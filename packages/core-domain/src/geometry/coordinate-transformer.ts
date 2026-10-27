import {
  type CableConnection,
  type CableEndpoint,
  EIA_310_SPECS,
  getPlugClearanceMm,
  type HardwareBlueprint,
  isAngledCableType,
  MM_PER_U,
  normalizeHardwareBlueprint,
  PLUG_FOOTPRINT_HALF_SIZE_MM,
  type PortDefinition,
  type RackFace,
  type RackProject
} from '../schemas/index.js';
import { createBoundingBox, mergeBoundingBoxes, vec3, vec3Add } from './aabb.js';
import { roundMm } from './precision.js';
import type {
  BoundingBox3D,
  ComputedDeviceGeometry,
  ComputedPortGeometry,
  ComputedRackGeometry,
  ComputedSlotGeometry,
  PortPlugClearance,
  Vector3D
} from './types.js';

export type BlueprintCatalogMap =
  | ReadonlyMap<string, HardwareBlueprint>
  | Readonly<Record<string, HardwareBlueprint>>;

export function lookupBlueprint(
  catalog: BlueprintCatalogMap,
  slug: string
): HardwareBlueprint | undefined {
  const raw =
    catalog instanceof Map
      ? catalog.get(slug)
      : (catalog as Readonly<Record<string, HardwareBlueprint>>)[slug];
  if (!raw) {
    return undefined;
  }
  return normalizeHardwareBlueprint(raw);
}

/**
 * Determines whether a port or its owning device acts as a passive front/rear passthrough coupler
 * (e.g., Keystone RJ45 Cat6A female-to-female coupler).
 */
export function isPassthroughCoupler(
  blueprint: HardwareBlueprint,
  port: PortDefinition
): boolean {
  if (port.is_passthrough_coupler || blueprint.is_passthrough_coupler) {
    return true;
  }
  if (port.capabilities.includes('passthrough-coupler')) {
    return true;
  }
  if (
    blueprint.category === 'keystone-module' &&
    blueprint.ports.length === 1
  ) {
    return true;
  }
  return false;
}

/**
 * Converts a 1-indexed U position into its minimum and maximum Y coordinates (mm).
 */
export function uPositionToYRangeMm(
  uPosition: number,
  uHeight = 1
): { yMinMm: number; yMaxMm: number } {
  const yMinMm = roundMm((uPosition - 1) * MM_PER_U);
  const yMaxMm = roundMm((uPosition - 1 + Math.max(1, uHeight)) * MM_PER_U);
  return { yMinMm, yMaxMm };
}

/**
 * Computes the world origin of a rack-mounted device or carrier on a given U and face.
 * Per ARCHITECTURE.md Section 2.3:
 * - Front face: O = (0, (u_start - 1) * 44.45, 0)
 * - Rear face:  O = (W_panel, (u_start - 1) * 44.45, D_rail_depth)
 */
export function computeCarrierOrDeviceOrigin(
  uPosition: number,
  face: RackFace,
  panelWidthMm: number,
  railDepthMm: number
): Vector3D {
  const yMm = (uPosition - 1) * MM_PER_U;
  if (face === 'front') {
    return vec3(0, yMm, 0);
  }
  return vec3(panelWidthMm, yMm, railDepthMm);
}

/**
 * Transforms a local 3D coordinate `(x, y, z)` relative to a parent origin on `mountFace`
 * into global right-handed world space `(X, Y, Z)`.
 * For `rear` face mounts, X and Z are mirrored relative to `(W_panel, Y_origin, D_rail_depth)`.
 */
export function transformLocalToWorldPoint(
  localPoint: Vector3D,
  mountOrigin: Vector3D,
  mountFace: RackFace
): Vector3D {
  if (mountFace === 'front') {
    return vec3(
      mountOrigin.x + localPoint.x,
      mountOrigin.y + localPoint.y,
      mountOrigin.z + localPoint.z
    );
  }
  return vec3(
    mountOrigin.x - localPoint.x,
    mountOrigin.y + localPoint.y,
    mountOrigin.z - localPoint.z
  );
}

/**
 * Transforms a local normal vector `(nx, ny, nz)` into world space based on `mountFace`.
 * A 180-degree rotation around the Y-axis for `rear` mounts negates X and Z normals.
 */
export function transformLocalToWorldNormal(
  localNormal: Vector3D,
  mountFace: RackFace
): Vector3D {
  if (mountFace === 'front') {
    return vec3(localNormal.x, localNormal.y, localNormal.z);
  }
  return vec3(-localNormal.x, localNormal.y, -localNormal.z);
}

/**
 * Computes the global 3D port geometry for a port on a device (either top-level or child in a slot).
 */
export function computePortGeometry(
  instanceId: string,
  blueprint: HardwareBlueprint,
  port: PortDefinition,
  deviceLocalOffsetInMountFrame: Vector3D,
  mountOrigin: Vector3D,
  mountFace: RackFace,
  overrideLocalFace?: RackFace
): ComputedPortGeometry {
  const effectiveLocalFace = overrideLocalFace ?? port.face;
  const localZ =
    effectiveLocalFace === 'front' ? 0 : blueprint.geometry.depth_mm;
  const localNormal =
    effectiveLocalFace === 'front' ? vec3(0, 0, -1) : vec3(0, 0, 1);

  const localPosInDevice = vec3(
    port.coordinates.x_mm,
    port.coordinates.y_mm,
    localZ
  );
  const localPosInMount = vec3Add(
    deviceLocalOffsetInMountFrame,
    localPosInDevice
  );

  const worldPosition = transformLocalToWorldPoint(
    localPosInMount,
    mountOrigin,
    mountFace
  );
  const worldNormal = transformLocalToWorldNormal(localNormal, mountFace);
  const worldFace: RackFace = worldNormal.z < 0 ? 'front' : 'rear';

  return {
    instance_id: instanceId,
    port_id: port.port_id,
    label: port.label,
    local_face: effectiveLocalFace,
    world_face: worldFace,
    connector_type: port.connector_type,
    direction: port.direction,
    capabilities: port.capabilities,
    is_passthrough_coupler: isPassthroughCoupler(blueprint, port),
    local_position: localPosInDevice,
    world_position: worldPosition,
    world_normal: worldNormal
  };
}

/**
 * Resolves the world port geometry for a specific cable endpoint `(instance_id, port_id, face?)`.
 * Handles passthrough couplers where a single port definition can be connected on both `front` and `rear` faces.
 */
export function resolveCableEndpointPortGeometry(
  deviceGeo: ComputedDeviceGeometry,
  portId: string,
  requestedFace?: RackFace,
  parentCarrierGeo?: ComputedDeviceGeometry
): ComputedPortGeometry | undefined {
  const portDef = deviceGeo.blueprint.ports.find((p) => p.port_id === portId);
  if (!portDef) {
    return undefined;
  }

  const basePortGeo = deviceGeo.ports.find((p) => p.port_id === portId);
  if (!basePortGeo) {
    return undefined;
  }

  if (!requestedFace || !basePortGeo.is_passthrough_coupler) {
    return basePortGeo;
  }

  // For a passthrough coupler, requestedFace selects which world face ('front' or 'rear') of the coupler is used
  const mountFace = deviceGeo.face;
  const desiredLocalFace: RackFace =
    mountFace === 'front'
      ? requestedFace
      : requestedFace === 'front'
        ? 'rear'
        : 'front';

  if (desiredLocalFace === basePortGeo.local_face) {
    return basePortGeo;
  }

  let mountOrigin = deviceGeo.world_origin;
  let localOffset = vec3(0, 0, 0);

  if (deviceGeo.mount_target === 'carrier-slot' && parentCarrierGeo) {
    mountOrigin = parentCarrierGeo.world_origin;
    const slot = parentCarrierGeo.blueprint.slots.find(
      (s) => s.slot_id === deviceGeo.slot_id
    );
    if (slot) {
      localOffset = vec3(slot.offset_mm.x, slot.offset_mm.y, slot.offset_mm.z);
    }
  }

  return computePortGeometry(
    deviceGeo.instance_id,
    deviceGeo.blueprint,
    portDef,
    localOffset,
    mountOrigin,
    mountFace,
    desiredLocalFace
  );
}

/**
 * Computes port plug clearance boxes for all cables connected to `deviceGeo`.
 */
function computeDevicePlugClearances(
  deviceGeo: ComputedDeviceGeometry,
  cables: readonly CableConnection[],
  parentCarrierGeo?: ComputedDeviceGeometry
): {
  portClearances: PortPlugClearance[];
  combinedClearanceBox: BoundingBox3D | null;
} {
  const portClearances: PortPlugClearance[] = [];

  for (const cable of cables) {
    const endpoints: CableEndpoint[] = [];
    if (cable.from.instance_id === deviceGeo.instance_id) {
      endpoints.push(cable.from);
    }
    if (cable.to.instance_id === deviceGeo.instance_id) {
      endpoints.push(cable.to);
    }

    for (const ep of endpoints) {
      const portGeo = resolveCableEndpointPortGeometry(
        deviceGeo,
        ep.port_id,
        ep.face,
        parentCarrierGeo
      );
      if (!portGeo) {
        continue;
      }

      const deltaZ = getPlugClearanceMm(
        portGeo.connector_type,
        cable.cable_type
      );
      const angled = isAngledCableType(cable.cable_type);

      const zStart = portGeo.world_position.z;
      const zEnd = zStart + portGeo.world_normal.z * deltaZ;

      const clearanceBox = createBoundingBox(
        vec3(deviceGeo.chassis_box.min.x, deviceGeo.chassis_box.min.y, zStart),
        vec3(deviceGeo.chassis_box.max.x, deviceGeo.chassis_box.max.y, zEnd)
      );

      const portLocalBox = createBoundingBox(
        vec3(
          portGeo.world_position.x - PLUG_FOOTPRINT_HALF_SIZE_MM,
          portGeo.world_position.y - PLUG_FOOTPRINT_HALF_SIZE_MM,
          zStart
        ),
        vec3(
          portGeo.world_position.x + PLUG_FOOTPRINT_HALF_SIZE_MM,
          portGeo.world_position.y + PLUG_FOOTPRINT_HALF_SIZE_MM,
          zEnd
        )
      );

      portClearances.push({
        instance_id: deviceGeo.instance_id,
        port_id: portGeo.port_id,
        cable_id: cable.cable_id,
        cable_type: cable.cable_type,
        connector_type: portGeo.connector_type,
        is_angled: angled,
        delta_z_mm: deltaZ,
        world_normal: portGeo.world_normal,
        clearance_box: clearanceBox,
        port_local_box: portLocalBox
      });
    }
  }

  const combinedClearanceBox = mergeBoundingBoxes(
    portClearances.map((pc) => pc.clearance_box)
  );

  return { portClearances, combinedClearanceBox };
}

/**
 * Computes the complete 3D scene geometry for a `RackProject` and hardware catalog.
 */
export function computeRackGeometry(
  project: RackProject,
  catalog: BlueprintCatalogMap
): ComputedRackGeometry {
  const spec = EIA_310_SPECS[project.rack.standard];
  const panelWidthMm = spec.panel_width_mm;
  const apertureWidthMm = spec.aperture_width_mm;
  const totalHeightMm = roundMm(project.rack.u_height * MM_PER_U);
  const railDepthMm = project.rack.rail_depth_mm;

  const devicesById = new Map<string, ComputedDeviceGeometry>();
  const devices: ComputedDeviceGeometry[] = [];

  for (const mounted of project.mounted_devices) {
    const blueprint = lookupBlueprint(catalog, mounted.blueprint_slug);
    if (!blueprint) {
      continue;
    }

    const uSpan = Math.max(1, Math.ceil(blueprint.geometry.u_height));
    const uRange: readonly [number, number] = [
      mounted.u_position,
      mounted.u_position + uSpan - 1
    ];

    const mountOrigin = computeCarrierOrDeviceOrigin(
      mounted.u_position,
      mounted.face,
      panelWidthMm,
      railDepthMm
    );

    const xMargin = Math.max(
      0,
      (panelWidthMm - blueprint.geometry.width_mm) / 2
    );
    const xMin = xMargin;
    const xMax = panelWidthMm - xMargin;

    const yMin = (mounted.u_position - 1) * MM_PER_U;
    const yMax = yMin + blueprint.geometry.height_mm;

    let zMin: number;
    let zMax: number;
    if (mounted.face === 'front') {
      zMin = -blueprint.geometry.front_protrusion_mm;
      zMax =
        blueprint.geometry.depth_mm + blueprint.geometry.rear_protrusion_mm;
    } else {
      zMin =
        railDepthMm -
        blueprint.geometry.depth_mm -
        blueprint.geometry.rear_protrusion_mm;
      zMax = railDepthMm + blueprint.geometry.front_protrusion_mm;
    }

    const chassisBox = createBoundingBox(
      vec3(xMin, yMin, zMin),
      vec3(xMax, yMax, zMax)
    );

    const devicePorts = blueprint.ports.map((port) =>
      computePortGeometry(
        mounted.instance_id,
        blueprint,
        port,
        vec3(0, 0, 0),
        mountOrigin,
        mounted.face
      )
    );

    const computedSlots: ComputedSlotGeometry[] = blueprint.slots.map(
      (slot) => {
        const slotLocalMin = vec3(
          slot.offset_mm.x,
          slot.offset_mm.y,
          slot.offset_mm.z
        );
        const slotLocalMax = vec3(
          slot.offset_mm.x + slot.max_dimensions_mm.width,
          slot.offset_mm.y + slot.max_dimensions_mm.height,
          slot.offset_mm.z + slot.max_dimensions_mm.depth
        );
        const worldSlotOrigin = transformLocalToWorldPoint(
          slotLocalMin,
          mountOrigin,
          mounted.face
        );
        const worldSlotCorner = transformLocalToWorldPoint(
          slotLocalMax,
          mountOrigin,
          mounted.face
        );
        const childInSlot = mounted.children.find(
          (c) => c.slot_id === slot.slot_id
        );

        return {
          carrier_instance_id: mounted.instance_id,
          slot_definition: slot,
          world_origin: worldSlotOrigin,
          world_bounds: createBoundingBox(worldSlotOrigin, worldSlotCorner),
          occupied_by_instance_id: childInSlot ? childInSlot.instance_id : null
        };
      }
    );

    const baseParentGeo: ComputedDeviceGeometry = {
      instance_id: mounted.instance_id,
      blueprint_slug: mounted.blueprint_slug,
      blueprint,
      hostname: mounted.hostname,
      mount_target: 'rack-unit',
      u_position: mounted.u_position,
      u_range: uRange,
      face: mounted.face,
      parent_carrier_id: null,
      slot_id: null,
      world_origin: mountOrigin,
      chassis_box: chassisBox,
      plug_clearance_box: null,
      port_clearances: [],
      ports: devicePorts,
      slots: computedSlots,
      child_instance_ids: mounted.children.map((c) => c.instance_id)
    };

    const parentClearances = computeDevicePlugClearances(
      baseParentGeo,
      project.cables
    );

    const finalParentGeo: ComputedDeviceGeometry = {
      ...baseParentGeo,
      plug_clearance_box: parentClearances.combinedClearanceBox,
      port_clearances: parentClearances.portClearances
    };

    devicesById.set(finalParentGeo.instance_id, finalParentGeo);
    devices.push(finalParentGeo);

    for (const child of mounted.children) {
      const childBlueprint = lookupBlueprint(catalog, child.blueprint_slug);
      if (!childBlueprint) {
        continue;
      }

      const slotDef = blueprint.slots.find((s) => s.slot_id === child.slot_id);
      const slotOffset = slotDef
        ? vec3(slotDef.offset_mm.x, slotDef.offset_mm.y, slotDef.offset_mm.z)
        : vec3(0, 0, 0);

      const childWorldOrigin = transformLocalToWorldPoint(
        slotOffset,
        mountOrigin,
        mounted.face
      );

      const childLocalMin = vec3(
        slotOffset.x,
        slotOffset.y,
        slotOffset.z - childBlueprint.geometry.front_protrusion_mm
      );
      const childLocalMax = vec3(
        slotOffset.x + childBlueprint.geometry.width_mm,
        slotOffset.y + childBlueprint.geometry.height_mm,
        slotOffset.z +
          childBlueprint.geometry.depth_mm +
          childBlueprint.geometry.rear_protrusion_mm
      );

      const childWorldCornerA = transformLocalToWorldPoint(
        childLocalMin,
        mountOrigin,
        mounted.face
      );
      const childWorldCornerB = transformLocalToWorldPoint(
        childLocalMax,
        mountOrigin,
        mounted.face
      );
      const childChassisBox = createBoundingBox(
        childWorldCornerA,
        childWorldCornerB
      );

      const childPorts = childBlueprint.ports.map((port) =>
        computePortGeometry(
          child.instance_id,
          childBlueprint,
          port,
          slotOffset,
          mountOrigin,
          mounted.face
        )
      );

      const baseChildGeo: ComputedDeviceGeometry = {
        instance_id: child.instance_id,
        blueprint_slug: child.blueprint_slug,
        blueprint: childBlueprint,
        hostname: child.hostname,
        mount_target: 'carrier-slot',
        u_position: mounted.u_position,
        u_range: uRange,
        face: mounted.face,
        parent_carrier_id: mounted.instance_id,
        slot_id: child.slot_id,
        world_origin: childWorldOrigin,
        chassis_box: childChassisBox,
        plug_clearance_box: null,
        port_clearances: [],
        ports: childPorts,
        slots: [],
        child_instance_ids: []
      };

      const childClearances = computeDevicePlugClearances(
        baseChildGeo,
        project.cables,
        finalParentGeo
      );

      const finalChildGeo: ComputedDeviceGeometry = {
        ...baseChildGeo,
        plug_clearance_box: childClearances.combinedClearanceBox,
        port_clearances: childClearances.portClearances
      };

      devicesById.set(finalChildGeo.instance_id, finalChildGeo);
      devices.push(finalChildGeo);
    }
  }

  return {
    rack: project.rack,
    panel_width_mm: panelWidthMm,
    aperture_width_mm: apertureWidthMm,
    total_height_mm: totalHeightMm,
    rail_depth_mm: railDepthMm,
    devices_by_id: devicesById,
    devices
  };
}
