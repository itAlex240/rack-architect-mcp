import {
  roundTenths,
  type BlueprintCatalogMap,
  type ComputedDeviceGeometry,
  type ComputedRackScene,
} from '@rack-mcp/core-domain';
import { formatCableTypeBadge } from './wiring-svg.js';

interface HardwareBomGroup {
  readonly slug: string;
  readonly manufacturer: string;
  readonly model: string;
  readonly category: string;
  readonly unitMaxWatts: number;
  readonly unitWeightGrams: number;
  readonly instances: ComputedDeviceGeometry[];
}

interface PrintableBomGroup {
  readonly slug: string;
  readonly model: string;
  readonly material: string;
  readonly unitFilamentGrams: number;
  readonly heatSetInserts: string;
  readonly fasteners: string;
  readonly printablesUrl: string;
  readonly instances: ComputedDeviceGeometry[];
}

interface CableBomGroup {
  readonly key: string;
  readonly cableType: string;
  readonly commercialLengthMm: number;
  readonly colorHex: string;
  readonly badge: string;
  readonly cableIds: string[];
  readonly labels: string[];
}

/**
 * Generates a structured 5-section Bill of Materials & Assembly Guide in GitHub-Flavored Markdown (`BOM.md`):
 * 1. Project & Validation Summary
 * 2. Commercial Hardware BOM
 * 3. 3D Print Queue (Fabrication List)
 * 4. Aggregated Cable Shopping List
 * 5. Step-by-Step Assembly & Patching Checklist
 */
export function generateBomMarkdown(
  scene: ComputedRackScene,
  _catalog?: BlueprintCatalogMap,
): string {
  const { project, geometry, validation, cable_routes } = scene;
  const routesById = new Map(cable_routes.map((r) => [r.cable_id, r]));

  const lines: string[] = [];

  // =========================================================================
  // 1. Project & Validation Summary
  // =========================================================================
  lines.push(`# ${project.project_name} — Bill of Materials & Assembly Guide`);
  lines.push('');
  lines.push(`## 1. Project & Validation Summary`);
  lines.push('');
  lines.push(
    `- **Validation Status:** \`${validation.status}\` (${validation.error_count} Errors, ${validation.warning_count} Warnings)`,
  );
  lines.push(
    `- **Rack Enclosure:** ${project.rack.u_height}U \`${project.rack.standard}\` (Rail Depth: \`${project.rack.rail_depth_mm} mm\`, Rear Clearance: \`${project.rack.rear_clearance_mm} mm\`)`,
  );
  lines.push(
    `- **Total Mounted Devices:** ${geometry.devices.length} (${project.mounted_devices.length} rackmount units + ${geometry.devices.length - project.mounted_devices.length} sub-modules)`,
  );
  lines.push(
    `- **Total Electrical Draw:** \`${roundTenths(validation.power_summary.total_system_watts)} W\` system + \`${roundTenths(validation.power_summary.total_poe_watts)} W\` PoE`,
  );
  lines.push(
    `- **Mechanical Mass & Stability:** \`${roundTenths(validation.mechanical_summary.total_weight_grams / 1000)} kg\` total weight | Center of Gravity $Y_{\\text{CoG}} = ${roundTenths(validation.mechanical_summary.center_of_gravity_y_mm)}\\text{ mm}$ (\`${roundTenths(validation.mechanical_summary.normalized_cog_y * 100)}%\` of rack height)`,
  );

  if (validation.issues.length > 0) {
    lines.push('');
    lines.push(`### Active Diagnostics`);
    for (const issue of validation.issues) {
      lines.push(
        `- **[${issue.severity}] \`${issue.code}\`:** ${issue.message}`,
      );
    }
  }
  lines.push('');

  // =========================================================================
  // 2. Commercial Hardware BOM
  // =========================================================================
  lines.push(`## 2. Commercial Hardware BOM`);
  lines.push('');
  lines.push(
    `| Slug | Manufacturer | Model | Category | Qty | Instances & Locations | Max Power (W) | Total Weight (g) |`,
  );
  lines.push(
    `| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |`,
  );

  const commercialGroups = new Map<string, HardwareBomGroup>();
  const printableGroups = new Map<string, PrintableBomGroup>();

  for (const dev of geometry.devices) {
    const bp = dev.blueprint;
    if (bp.printable_metadata !== null) {
      const existingPrint = printableGroups.get(bp.slug);
      if (existingPrint !== undefined) {
        existingPrint.instances.push(dev);
      } else {
        printableGroups.set(bp.slug, {
          slug: bp.slug,
          model: bp.model,
          material: bp.printable_metadata.material_recommendation,
          unitFilamentGrams: bp.printable_metadata.filament_grams,
          heatSetInserts: bp.printable_metadata.heat_set_inserts ?? '—',
          fasteners: bp.printable_metadata.fasteners ?? '—',
          printablesUrl: bp.printable_metadata.printables_url ?? '—',
          instances: [dev],
        });
      }
      continue;
    }

    const existing = commercialGroups.get(bp.slug);
    if (existing !== undefined) {
      existing.instances.push(dev);
    } else {
      commercialGroups.set(bp.slug, {
        slug: bp.slug,
        manufacturer: bp.manufacturer,
        model: bp.model,
        category: bp.category,
        unitMaxWatts: bp.power_and_thermal.max_system_watts,
        unitWeightGrams: bp.geometry.weight_grams,
        instances: [dev],
      });
    }
  }

  for (const group of commercialGroups.values()) {
    const qty = group.instances.length;
    const locations = group.instances
      .map((d) =>
        d.mount_target === 'carrier-slot'
          ? `\`${d.instance_id}\` (U${d.u_position} \`${d.parent_carrier_id}:${d.slot_id}\`)`
          : `\`${d.instance_id}\` (U${d.u_position} ${d.face})`,
      )
      .join(', ');
    const totalWatts = roundTenths(qty * group.unitMaxWatts);
    const totalWeight = Math.round(qty * group.unitWeightGrams);
    lines.push(
      `| \`${group.slug}\` | ${group.manufacturer} | ${group.model} | \`${group.category}\` | ${qty} | ${locations} | ${totalWatts} W | ${totalWeight} g |`,
    );
  }
  lines.push('');

  // =========================================================================
  // 3. 3D Print Queue (Fabrication List)
  // =========================================================================
  lines.push(`## 3. 3D Print Queue (Fabrication List)`);
  lines.push('');
  if (printableGroups.size === 0) {
    lines.push(`_No 3D-printed carriers mounted in this project._`);
  } else {
    lines.push(
      `| Carrier Blueprint | Qty | Material | Total Filament (g) | Heat-Set Inserts (per unit) | Fasteners / Screws (per unit) | Source Model |`,
    );
    lines.push(
      `| :--- | :---: | :---: | :---: | :--- | :--- | :--- |`,
    );
    let totalFilamentGrams = 0;
    for (const pg of printableGroups.values()) {
      const qty = pg.instances.length;
      const sumFilament = Math.round(qty * pg.unitFilamentGrams);
      totalFilamentGrams += sumFilament;
      const uList = pg.instances.map((d) => `U${d.u_position}`).join(', ');
      lines.push(
        `| \`${pg.slug}\` (${uList}) | ${qty} | ${pg.material} | ${sumFilament} g | ${pg.heatSetInserts} | ${pg.fasteners} | ${pg.printablesUrl} |`,
      );
    }
    lines.push('');
    lines.push(
      `**Total Estimated 3D Filament Required:** \`${totalFilamentGrams} g\``,
    );
  }
  lines.push('');

  // =========================================================================
  // 4. Aggregated Cable Shopping List
  // =========================================================================
  lines.push(`## 4. Aggregated Cable Shopping List`);
  lines.push('');
  if (project.cables.length === 0) {
    lines.push(`_No cables configured in this project._`);
  } else {
    lines.push(
      `| Cable Type | Commercial Length | Color Hex | Qty | Cable IDs & Purpose |`,
    );
    lines.push(`| :--- | :---: | :---: | :---: | :--- |`);

    const cableGroups = new Map<string, CableBomGroup>();
    for (const cable of project.cables) {
      const route = routesById.get(cable.cable_id);
      const commMm = route?.recommended_commercial_mm ?? 500;
      const color = cable.color_hex.toUpperCase();
      const key = `${cable.cable_type}|${commMm}|${color}`;

      const existing = cableGroups.get(key);
      if (existing !== undefined) {
        existing.cableIds.push(`\`${cable.cable_id}\``);
        if (cable.label !== undefined) {
          existing.labels.push(cable.label);
        }
      } else {
        cableGroups.set(key, {
          key,
          cableType: cable.cable_type,
          commercialLengthMm: commMm,
          colorHex: color,
          badge: formatCableTypeBadge(cable.cable_type, commMm),
          cableIds: [`\`${cable.cable_id}\``],
          labels: cable.label !== undefined ? [cable.label] : [],
        });
      }
    }

    const sortedGroups = [...cableGroups.values()].sort(
      (a, b) =>
        a.cableType.localeCompare(b.cableType) ||
        a.commercialLengthMm - b.commercialLengthMm,
    );

    for (const cg of sortedGroups) {
      const meters = (cg.commercialLengthMm / 1000).toFixed(2);
      const purpose =
        cg.labels.length > 0
          ? `${cg.cableIds.join(', ')} (${cg.labels.join(', ')})`
          : cg.cableIds.join(', ');
      lines.push(
        `| \`${cg.cableType}\` | **${meters} m** (${cg.commercialLengthMm} mm) | \`${cg.colorHex}\` | ${cg.cableIds.length} | ${purpose} |`,
      );
    }
  }
  lines.push('');

  // =========================================================================
  // 5. Step-by-Step Assembly & Patching Checklist
  // =========================================================================
  lines.push(`## 5. Step-by-Step Assembly & Patching Checklist`);
  lines.push('');
  lines.push(`### Phase A: Mechanical Mounting (Bottom-Up for Stability)`);
  const sortedMounted = [...project.mounted_devices].sort(
    (a, b) => a.u_position - b.u_position,
  );
  for (const m of sortedMounted) {
    const devGeo = geometry.devices_by_id.get(m.instance_id);
    const modelName = devGeo?.blueprint.model ?? m.blueprint_slug;
    lines.push(
      `- [ ] Mount **${modelName}** (\`${m.instance_id}\`) at **U${m.u_position}** (${m.face.toUpperCase()} rails).`,
    );
    for (const child of m.children) {
      const childGeo = geometry.devices_by_id.get(child.instance_id);
      const childModel = childGeo?.blueprint.model ?? child.blueprint_slug;
      lines.push(
        `  - [ ] Insert sub-module **${childModel}** (\`${child.instance_id}\`) into carrier slot \`${m.instance_id}:${child.slot_id}\`.`,
      );
    }
  }

  lines.push('');
  lines.push(`### Phase B: Power & Network Cable Patching`);
  for (const cable of project.cables) {
    const route = routesById.get(cable.cable_id);
    const commMm = route?.recommended_commercial_mm ?? 500;
    const badge = formatCableTypeBadge(cable.cable_type, commMm);
    const fromFace = cable.from.face ? ` (${cable.from.face})` : '';
    const toFace = cable.to.face ? ` (${cable.to.face})` : '';
    const labelSuffix = cable.label ? ` — _${cable.label}_` : '';
    lines.push(
      `- [ ] Patch **${badge}** [\`${cable.cable_id}\`, \`${cable.color_hex}\`]: Connect \`${cable.from.instance_id}:${cable.from.port_id}\`${fromFace} $\\rightarrow$ \`${cable.to.instance_id}:${cable.to.port_id}\`${toFace}${labelSuffix}.`,
    );
  }

  lines.push('');
  return lines.join('\n');
}
