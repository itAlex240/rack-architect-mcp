import {
  MM_PER_U,
  roundTenths,
  type ComputedDeviceGeometry,
  type ComputedRackScene
} from '@rack-mcp/core-domain';
import type { CatalogRegistry } from '@rack-mcp/hardware-catalog';

function padRight(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }
  return text + ' '.repeat(width - text.length);
}

function padLeft(text: string, width: number): string {
  if (text.length >= width) {
    return text.slice(0, width);
  }
  return ' '.repeat(width - text.length) + text;
}

/**
 * Generates a deterministic, compact ASCII Elevation Plan (Front & Rear views)
 * alongside a Power/PoE budget table and diagnostic summary for LLM inspection.
 */
export function generateAsciiElevation(
  scene: ComputedRackScene,
  catalog: CatalogRegistry
): string {
  const { project, geometry, validation } = scene;
  const totalU = project.rack.u_height;
  const railDepthMm = project.rack.rail_depth_mm;

  const topLevelDevices = geometry.devices.filter((d) => d.parent_carrier_id === null);
  const childDevicesByParent = new Map<string, ComputedDeviceGeometry[]>();
  for (const dev of geometry.devices) {
    if (dev.parent_carrier_id !== null) {
      const list = childDevicesByParent.get(dev.parent_carrier_id) ?? [];
      list.push(dev);
      childDevicesByParent.set(dev.parent_carrier_id, list);
    }
  }

  function findDevicesOnURow(u: number, face: 'front' | 'rear'): ComputedDeviceGeometry[] {
    const uBottomMm = (u - 1) * MM_PER_U;
    const uTopMm = u * MM_PER_U;
    return topLevelDevices.filter((dev) => {
      if (dev.face !== face) return false;
      const overlapBottom = Math.max(uBottomMm, dev.chassis_box.min.y);
      const overlapTop = Math.min(uTopMm, dev.chassis_box.max.y);
      return overlapTop - overlapBottom > 1.0;
    });
  }

  function formatCell(u: number, face: 'front' | 'rear', colWidth: number): string {
    const devs = findDevicesOnURow(u, face);
    if (devs.length === 0) {
      return padRight('· [empty]', colWidth);
    }
    const labels = devs.map((dev) => {
      const bp = catalog.getBlueprintBySlug(dev.blueprint_slug);
      const depth = bp?.geometry.depth_mm ?? 0;
      const children = childDevicesByParent.get(dev.instance_id) ?? [];
      const childSuffix =
        children.length > 0
          ? ` {${children.map((c) => `${c.slot_id ?? '?'}:${c.hostname ?? c.instance_id}`).join(', ')}}`
          : '';
      return `${dev.hostname ?? dev.instance_id} (${dev.blueprint_slug}, ${depth}mm)${childSuffix}`;
    });
    const combined = labels.join(' !! OVERLAP !! ');
    return padRight(combined, colWidth);
  }

  function computeURowClearance(u: number): string {
    const frontDevs = findDevicesOnURow(u, 'front');
    const rearDevs = findDevicesOnURow(u, 'rear');
    if (frontDevs.length === 0 && rearDevs.length === 0) {
      return `${railDepthMm}mm free`;
    }
    const maxFrontZ =
      frontDevs.length > 0
        ? Math.max(...frontDevs.map((d) => (d.plug_clearance_box ?? d.chassis_box).max.z))
        : 0;
    const minRearZ =
      rearDevs.length > 0
        ? Math.min(...rearDevs.map((d) => (d.plug_clearance_box ?? d.chassis_box).min.z))
        : railDepthMm;
    const gapMm = roundTenths(minRearZ - maxFrontZ);
    if (gapMm < 0) {
      return `COLLISION (${gapMm}mm)`;
    }
    return `+${gapMm}mm gap`;
  }

  const colWidth = 44;
  const clearanceWidth = 18;
  const divider = `+------+${'-'.repeat(colWidth + 2)}+${'-'.repeat(colWidth + 2)}+${'-'.repeat(clearanceWidth + 2)}+`;

  const lines: string[] = [];
  lines.push(
    `=== RACK ELEVATION PLAN: ${project.project_name} (${project.rack.standard}, ${totalU}U, Depth ${railDepthMm}mm, ${project.rack.enclosure_type}) ===`
  );
  lines.push(divider);
  lines.push(
    `| ${padRight('Unit', 4)} | ${padRight('FRONT FACE (Z=0 -> +Z)', colWidth)} | ${padRight('REAR FACE (Z=D_rail -> -Z)', colWidth)} | ${padRight('Z-CLEARANCE', clearanceWidth)} |`
  );
  lines.push(divider);

  for (let u = totalU; u >= 1; u--) {
    const uLabel = `U${padLeft(String(u), 2)} `;
    const frontCell = formatCell(u, 'front', colWidth);
    const rearCell = formatCell(u, 'rear', colWidth);
    const clearanceCell = padRight(computeURowClearance(u), clearanceWidth);
    lines.push(`| ${uLabel} | ${frontCell} | ${rearCell} | ${clearanceCell} |`);
  }
  lines.push(divider);

  // Power, PoE & Mechanical Summary
  const pwr = validation.power_summary;
  const mech = validation.mechanical_summary;
  const totalPoeBudget = pwr.pse_budgets.reduce((s, b) => s + b.poe_budget_watts, 0);

  lines.push('');
  lines.push('=== ELECTRICAL, POE & MECHANICAL SUMMARY ===');
  lines.push(
    `- Status: ${validation.is_valid ? 'VALID (0 Errors)' : `INVALID (${validation.error_count} Errors)`} | Warnings: ${validation.warning_count}`
  );
  lines.push(
    `- Total Power Draw: ${pwr.total_system_watts} W | Total PoE Load: ${pwr.total_poe_watts} W / ${totalPoeBudget} W`
  );
  lines.push(
    `- Total Equipment Mass: ${mech.total_weight_grams} g (${roundTenths(mech.total_weight_grams / 1000)} kg) | CoG Y: ${mech.center_of_gravity_y_mm} mm (${roundTenths(mech.center_of_gravity_y_mm / MM_PER_U)}U)`
  );
  lines.push(`- Connected Cables: ${project.cables.length}`);

  if (validation.issues.length > 0) {
    lines.push('');
    lines.push('=== DIAGNOSTIC ISSUES & REMEDIATION SUGGESTIONS ===');
    for (const issue of validation.issues) {
      lines.push(
        `[${issue.severity}] ${issue.code}: ${issue.message} (instances: ${issue.affected_instances.join(', ')})`
      );
      for (const rem of issue.remediation_suggestions) {
        lines.push(`  -> REMEDIATION: ${rem}`);
      }
    }
  }

  return lines.join('\n');
}
