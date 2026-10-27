import {
  AABB_INTERSECTION_EPSILON_MM,
  EIA_310_SPECS,
  HardwareBlueprintSchema,
  normalizeHardwareBlueprint,
  roundMm,
  type HardwareBlueprint,
  type RackStandardSlug,
} from '@rack-mcp/core-domain';
import { parse as parseYaml } from 'yaml';

export interface BlueprintIntegrityIssue {
  readonly slug: string;
  readonly source: string;
  readonly code:
    | 'YAML_PARSE_ERROR'
    | 'ZOD_SCHEMA_INVALID'
    | 'PORT_OUT_OF_BOUNDS'
    | 'PORT_OVERLAP'
    | 'DUPLICATE_PORT_ID'
    | 'SLOT_OUT_OF_APERTURE'
    | 'SLOT_OVERLAP';
  readonly message: string;
}

export interface BlueprintIntegrityResult {
  readonly valid: boolean;
  readonly blueprint?: HardwareBlueprint;
  readonly issues: BlueprintIntegrityIssue[];
}

/** Minimum center-to-center distance in mm between two distinct ports on the same face. */
export const MIN_PORT_CENTER_DISTANCE_MM = 8.0;

function resolveRackStandardForMountType(
  mountType: HardwareBlueprint['mount_type'],
): RackStandardSlug | undefined {
  switch (mountType) {
    case 'rackmount-10':
      return '10inch';
    case 'rackmount-19':
      return '19inch';
    case 'rackmount-6':
      return '6inch';
    case 'sub-module':
    case 'shelf-standing':
      return undefined;
  }
}

/**
 * Validates the geometric and structural integrity of an already-parsed and port-expanded
 * `HardwareBlueprint`.
 */
export function validateBlueprintIntegrity(
  rawOrExpandedBlueprint: HardwareBlueprint,
  source = rawOrExpandedBlueprint.slug,
): BlueprintIntegrityResult {
  const blueprint = normalizeHardwareBlueprint(rawOrExpandedBlueprint);
  const issues: BlueprintIntegrityIssue[] = [];
  const { width_mm, height_mm } = blueprint.geometry;

  // 1. Validate all expanded ports lie strictly within (width_mm, height_mm) and do not overlap
  const seenPortIds = new Set<string>();
  for (let i = 0; i < blueprint.ports.length; i++) {
    const portA = blueprint.ports[i]!;
    if (seenPortIds.has(portA.port_id)) {
      issues.push({
        slug: blueprint.slug,
        source,
        code: 'DUPLICATE_PORT_ID',
        message: `Duplicate port_id '${portA.port_id}' in blueprint '${blueprint.slug}'.`,
      });
    }
    seenPortIds.add(portA.port_id);

    const { x_mm, y_mm } = portA.coordinates;
    if (x_mm <= 0 || x_mm >= width_mm || y_mm <= 0 || y_mm >= height_mm) {
      issues.push({
        slug: blueprint.slug,
        source,
        code: 'PORT_OUT_OF_BOUNDS',
        message: `Port '${portA.port_id}' on face '${portA.face}' at (${x_mm}, ${y_mm}) mm lies outside face bounds (0..${width_mm}, 0..${height_mm}) mm.`,
      });
    }

    for (let j = i + 1; j < blueprint.ports.length; j++) {
      const portB = blueprint.ports[j]!;
      if (portA.face !== portB.face) {
        continue;
      }
      const dx = portA.coordinates.x_mm - portB.coordinates.x_mm;
      const dy = portA.coordinates.y_mm - portB.coordinates.y_mm;
      const dist = roundMm(Math.hypot(dx, dy));
      if (dist < MIN_PORT_CENTER_DISTANCE_MM) {
        issues.push({
          slug: blueprint.slug,
          source,
          code: 'PORT_OVERLAP',
          message: `Ports '${portA.port_id}' and '${portB.port_id}' on '${portA.face}' face overlap (distance ${dist} mm < ${MIN_PORT_CENTER_DISTANCE_MM} mm).`,
        });
      }
    }
  }

  // 2. Validate all slots on modular-carriers lie inside W_aperture and do not overlap each other
  const rackStd = resolveRackStandardForMountType(blueprint.mount_type);
  const spec = rackStd !== undefined ? EIA_310_SPECS[rackStd] : undefined;

  for (let i = 0; i < blueprint.slots.length; i++) {
    const slotA = blueprint.slots[i]!;
    const aMinX = slotA.offset_mm.x;
    const aMaxX = roundMm(slotA.offset_mm.x + slotA.max_dimensions_mm.width);
    const aMinY = slotA.offset_mm.y;
    const aMaxY = roundMm(slotA.offset_mm.y + slotA.max_dimensions_mm.height);
    const aMinZ = slotA.offset_mm.z;
    const aMaxZ = roundMm(slotA.offset_mm.z + slotA.max_dimensions_mm.depth);

    if (spec !== undefined) {
      const apertureMinX = spec.X_aperture_min;
      const apertureMaxX = roundMm(spec.X_aperture_min + spec.W_aperture);
      if (
        aMinX < apertureMinX - AABB_INTERSECTION_EPSILON_MM ||
        aMaxX > apertureMaxX + AABB_INTERSECTION_EPSILON_MM
      ) {
        issues.push({
          slug: blueprint.slug,
          source,
          code: 'SLOT_OUT_OF_APERTURE',
          message: `Slot '${slotA.slot_id}' X-span [${aMinX}, ${aMaxX}] mm exceeds ${rackStd} usable aperture [${apertureMinX}, ${apertureMaxX}] mm (W_aperture = ${spec.W_aperture} mm).`,
        });
      }
    }

    if (
      aMinY < -AABB_INTERSECTION_EPSILON_MM ||
      aMaxY > height_mm + AABB_INTERSECTION_EPSILON_MM
    ) {
      issues.push({
        slug: blueprint.slug,
        source,
        code: 'SLOT_OUT_OF_APERTURE',
        message: `Slot '${slotA.slot_id}' Y-span [${aMinY}, ${aMaxY}] mm exceeds carrier height [0, ${height_mm}] mm.`,
      });
    }

    for (let j = i + 1; j < blueprint.slots.length; j++) {
      const slotB = blueprint.slots[j]!;
      const bMinX = slotB.offset_mm.x;
      const bMaxX = roundMm(slotB.offset_mm.x + slotB.max_dimensions_mm.width);
      const bMinY = slotB.offset_mm.y;
      const bMaxY = roundMm(slotB.offset_mm.y + slotB.max_dimensions_mm.height);
      const bMinZ = slotB.offset_mm.z;
      const bMaxZ = roundMm(slotB.offset_mm.z + slotB.max_dimensions_mm.depth);

      const overlapX = Math.min(aMaxX, bMaxX) - Math.max(aMinX, bMinX);
      const overlapY = Math.min(aMaxY, bMaxY) - Math.max(aMinY, bMinY);
      const overlapZ = Math.min(aMaxZ, bMaxZ) - Math.max(aMinZ, bMinZ);

      if (
        overlapX > AABB_INTERSECTION_EPSILON_MM &&
        overlapY > AABB_INTERSECTION_EPSILON_MM &&
        overlapZ > AABB_INTERSECTION_EPSILON_MM
      ) {
        issues.push({
          slug: blueprint.slug,
          source,
          code: 'SLOT_OVERLAP',
          message: `Carrier slots '${slotA.slot_id}' and '${slotB.slot_id}' overlap in 3D space by (${roundMm(overlapX)}, ${roundMm(overlapY)}, ${roundMm(overlapZ)}) mm.`,
        });
      }
    }
  }

  return {
    valid: issues.length === 0,
    blueprint,
    issues,
  };
}

/**
 * Parses a raw YAML string into a validated, port-expanded `HardwareBlueprint`
 * and checks geometric integrity.
 */
export function parseAndValidateBlueprintYaml(
  rawYaml: string,
  source = 'inline-yaml',
): BlueprintIntegrityResult {
  let rawObject: unknown;
  try {
    rawObject = parseYaml(rawYaml);
  } catch (err) {
    return {
      valid: false,
      issues: [
        {
          slug: source,
          source,
          code: 'YAML_PARSE_ERROR',
          message: err instanceof Error ? err.message : String(err),
        },
      ],
    };
  }

  const parsed = HardwareBlueprintSchema.safeParse(rawObject);
  if (!parsed.success) {
    return {
      valid: false,
      issues: parsed.error.issues.map((issue) => ({
        slug: source,
        source,
        code: 'ZOD_SCHEMA_INVALID' as const,
        message: `${issue.path.join('.')}: ${issue.message}`,
      })),
    };
  }

  return validateBlueprintIntegrity(parsed.data, source);
}
