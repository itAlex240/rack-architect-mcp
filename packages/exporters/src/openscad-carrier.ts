import {
  EIA_310_SPECS,
  MM_PER_U,
  roundCentis,
  roundTenths,
  type ComputedRackScene,
  type HardwareBlueprint,
  type RackStandard,
  type SerializedRackScene
} from '@rack-mcp/core-domain';

export interface PrintableCarrierArtifact {
  readonly slug: string;
  readonly model: string;
  readonly instance_ids: readonly string[];
  readonly rack_standard: RackStandard;
  readonly filename_scad: string;
  readonly filename_stl: string;
  readonly openscad_code: string;
  readonly stl_ascii: string;
}

function inferRackStandardFromBlueprint(
  blueprint: HardwareBlueprint,
  fallback: RackStandard = '10inch'
): RackStandard {
  if (blueprint.mount_type === 'rackmount-19') return '19inch';
  if (blueprint.mount_type === 'rackmount-10') return '10inch';
  if (blueprint.mount_type === 'rackmount-6') return '6inch';
  return fallback;
}

/**
 * Generates a parametric OpenSCAD (`.scad`) script for a 3D-printable modular rack carrier
 * or custom rackmount faceplate, complete with EIA-310 mounting slots, L-shaped rear support tray,
 * honeycomb ventilation floor, and exact sub-module bay cutouts (`slots[]`).
 */
export function generateCarrierOpenScad(
  blueprint: HardwareBlueprint,
  rackStandard?: RackStandard
): string {
  const std =
    rackStandard ?? inferRackStandardFromBlueprint(blueprint, '10inch');
  const spec = EIA_310_SPECS[std];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75);
  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  const lines: string[] = [];
  lines.push(`// ============================================================================`);
  lines.push(`// RackArchitect MCP — Parametric 3D-Printable Rack Carrier (.scad)`);
  lines.push(`// Blueprint: ${blueprint.manufacturer} ${blueprint.model} (${blueprint.slug})`);
  lines.push(`// Standard:  ${std.toUpperCase()} EIA-310 (${panelWidthMm}mm Total Width, ${uCount}U = ${panelHeightMm}mm)`);
  lines.push(`// Material:  ${blueprint.printable_metadata?.material_recommendation ?? 'PETG / ABS / ASA (4 Perimeters, 25% Gyroid Infill)'}`);
  lines.push(`// ============================================================================`);
  lines.push(``);
  lines.push(`/* [EIA-310 Rack & Chassis Parameters (mm)] */`);
  lines.push(`panel_width_mm = ${panelWidthMm};`);
  lines.push(`aperture_width_mm = ${apertureWidthMm};`);
  lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
  lines.push(`panel_height_mm = ${panelHeightMm};`);
  lines.push(`u_count = ${uCount};`);
  lines.push(`faceplate_thickness_mm = 4.2;`);
  lines.push(`tray_depth_mm = ${trayDepthMm};`);
  lines.push(`tray_floor_thickness_mm = 3.2;`);
  lines.push(`side_gusset_thickness_mm = 3.5;`);
  lines.push(`print_tolerance_mm = 0.35;`);
  lines.push(`$fn = 36;`);
  lines.push(``);
  lines.push(`module oval_mounting_slot(slot_w = 10.0, slot_h = 6.5, thickness = 10.0) {`);
  lines.push(`  hull() {`);
  lines.push(`    translate([-(slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`);
  lines.push(`    translate([ (slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`module eia310_ear_holes() {`);
  lines.push(`  left_hole_x = (panel_width_mm - hole_center_pitch_x_mm) / 2;`);
  lines.push(`  right_hole_x = panel_width_mm - left_hole_x;`);
  lines.push(`  for (u = [0 : u_count - 1]) {`);
  lines.push(`    base_y = u * 44.45;`);
  lines.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`);
  lines.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`);
  lines.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
  lines.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`module slot_bay_cutouts() {`);

  if (blueprint.slots.length === 0) {
    lines.push(`  // Solid blanking / structural carrier (no front sub-module cutouts)`);
  } else {
    for (const slot of blueprint.slots) {
      const sx = roundCentis(slot.offset_mm.x);
      const sy = roundCentis(slot.offset_mm.y);
      const sw = roundCentis(slot.max_dimensions_mm.width);
      const sh = roundCentis(slot.max_dimensions_mm.height);
      lines.push(`  // Slot '${slot.slot_id}' (${slot.accepted_slot_type}): ${sw} x ${sh} mm at X=${sx}mm, Y=${sy}mm`);
      lines.push(`  translate([${sx} - print_tolerance_mm, ${sy} - print_tolerance_mm, -1.0])`);
      lines.push(`    cube([${sw} + 2 * print_tolerance_mm, ${sh} + 2 * print_tolerance_mm, faceplate_thickness_mm + 2.0]);`);
    }
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`module slot_retention_rails() {`);
  for (const slot of blueprint.slots) {
    if (slot.accepted_slot_type === 'standard-keystone') continue;
    const sx = roundCentis(slot.offset_mm.x);
    const sy = roundCentis(slot.offset_mm.y);
    const sw = roundCentis(slot.max_dimensions_mm.width);
    const sd = roundCentis(Math.min(trayDepthMm - 6, slot.max_dimensions_mm.depth));
    lines.push(`  // Guide rails for '${slot.slot_id}'`);
    lines.push(`  translate([${sx} - 2.6, ${sy}, faceplate_thickness_mm])`);
    lines.push(`    cube([2.2, 8.0, ${sd}]);`);
    lines.push(`  translate([${roundCentis(sx + sw + 0.4)}, ${sy}, faceplate_thickness_mm])`);
    lines.push(`    cube([2.2, 8.0, ${sd}]);`);
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`module honeycomb_vent_cutouts() {`);
  lines.push(`  tray_x0 = ${earWidthMm} + 14;`);
  lines.push(`  tray_x1 = panel_width_mm - ${earWidthMm} - 14;`);
  lines.push(`  for (z = [24 : 22 : tray_depth_mm - 18]) {`);
  lines.push(`    for (x = [tray_x0 : 22 : tray_x1]) {`);
  lines.push(`      translate([x, -1.0, z]) rotate([-90, 0, 0]) cylinder(d = 14, h = tray_floor_thickness_mm + 2.0, $fn = 6);`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`module rack_carrier_assembly() {`);
  lines.push(`  tray_x = ${earWidthMm};`);
  lines.push(`  tray_w = aperture_width_mm;`);
  lines.push(`  union() {`);
  lines.push(`    // 1. Front EIA-310 Faceplate with Mounting Ears & Sub-Module Bay Cutouts`);
  lines.push(`    difference() {`);
  lines.push(`      cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]);`);
  lines.push(`      eia310_ear_holes();`);
  lines.push(`      slot_bay_cutouts();`);
  lines.push(`    }`);
  lines.push(`    // 2. L-Shaped Rear Support Tray Floor with Hexagonal Ventilation`);
  lines.push(`    difference() {`);
  lines.push(`      translate([tray_x, 0, faceplate_thickness_mm])`);
  lines.push(`        cube([tray_w, tray_floor_thickness_mm, tray_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`      honeycomb_vent_cutouts();`);
  lines.push(`    }`);
  lines.push(`    // 3. Left & Right Structural Side Gussets`);
  lines.push(`    translate([tray_x, 0, faceplate_thickness_mm])`);
  lines.push(`      cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`    translate([tray_x + tray_w - side_gusset_thickness_mm, 0, faceplate_thickness_mm])`);
  lines.push(`      cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`    // 4. Internal Sub-Module Guide Rails`);
  lines.push(`    slot_retention_rails();`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`rack_carrier_assembly();`);

  return lines.join('\n');
}

interface Box3DMm {
  readonly x0: number;
  readonly y0: number;
  readonly z0: number;
  readonly x1: number;
  readonly y1: number;
  readonly z1: number;
}

function appendBoxTrianglesToStl(lines: string[], b: Box3DMm): void {
  const x0 = roundTenths(b.x0);
  const y0 = roundTenths(b.y0);
  const z0 = roundTenths(b.z0);
  const x1 = roundTenths(b.x1);
  const y1 = roundTenths(b.y1);
  const z1 = roundTenths(b.z1);
  if (x1 <= x0 || y1 <= y0 || z1 <= z0) return;

  const emitTri = (
    nx: number,
    ny: number,
    nz: number,
    v1: readonly [number, number, number],
    v2: readonly [number, number, number],
    v3: readonly [number, number, number]
  ) => {
    lines.push(`  facet normal ${nx} ${ny} ${nz}`);
    lines.push(`    outer loop`);
    lines.push(`      vertex ${v1[0]} ${v1[1]} ${v1[2]}`);
    lines.push(`      vertex ${v2[0]} ${v2[1]} ${v2[2]}`);
    lines.push(`      vertex ${v3[0]} ${v3[1]} ${v3[2]}`);
    lines.push(`    endloop`);
    lines.push(`  endfacet`);
  };

  // Front face (Z = z0, normal 0 0 -1)
  emitTri(0, 0, -1, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
  emitTri(0, 0, -1, [x0, y0, z0], [x1, y1, z0], [x1, y0, z0]);
  // Rear face (Z = z1, normal 0 0 1)
  emitTri(0, 0, 1, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1]);
  emitTri(0, 0, 1, [x0, y0, z1], [x1, y1, z1], [x0, y1, z1]);
  // Bottom face (Y = y0, normal 0 -1 0)
  emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]);
  emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z1], [x0, y0, z1]);
  // Top face (Y = y1, normal 0 1 0)
  emitTri(0, 1, 0, [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]);
  emitTri(0, 1, 0, [x0, y1, z0], [x1, y1, z1], [x1, y1, z0]);
  // Left face (X = x0, normal -1 0 0)
  emitTri(-1, 0, 0, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]);
  emitTri(-1, 0, 0, [x0, y0, z0], [x0, y1, z1], [x0, y1, z0]);
  // Right face (X = x1, normal 1 0 0)
  emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
  emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z1], [x1, y0, z1]);
}

/**
 * Generates a ready-to-slice ASCII `.stl` 3D mesh for a modular rack carrier,
 * decomposing the faceplate around every sub-module slot cutout plus the L-shaped
 * rear support tray and side gussets.
 */
export function generateCarrierStl(
  blueprint: HardwareBlueprint,
  rackStandard?: RackStandard
): string {
  const std =
    rackStandard ?? inferRackStandardFromBlueprint(blueprint, '10inch');
  const spec = EIA_310_SPECS[std];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const panelHeightMm = roundCentis(
    blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75
  );
  const faceplateThicknessMm = 4.2;
  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  const solidName = blueprint.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
  const lines: string[] = [];
  lines.push(`solid ${solidName}`);

  const sortedSlots = [...blueprint.slots].sort(
    (a, b) => a.offset_mm.x - b.offset_mm.x
  );

  if (sortedSlots.length === 0) {
    appendBoxTrianglesToStl(lines, {
      x0: 0,
      y0: 0,
      z0: 0,
      x1: panelWidthMm,
      y1: panelHeightMm,
      z1: faceplateThicknessMm
    });
  } else {
    let cursorX = 0;
    for (const slot of sortedSlots) {
      const sx0 = Math.max(cursorX, slot.offset_mm.x);
      const sx1 = Math.min(
        panelWidthMm,
        slot.offset_mm.x + slot.max_dimensions_mm.width
      );
      const sy0 = Math.max(0, slot.offset_mm.y);
      const sy1 = Math.min(
        panelHeightMm,
        slot.offset_mm.y + slot.max_dimensions_mm.height
      );

      // Vertical pillar to the left of this slot
      if (sx0 > cursorX) {
        appendBoxTrianglesToStl(lines, {
          x0: cursorX,
          y0: 0,
          z0: 0,
          x1: sx0,
          y1: panelHeightMm,
          z1: faceplateThicknessMm
        });
      }
      // Bottom bezel strip below the slot opening
      if (sy0 > 0) {
        appendBoxTrianglesToStl(lines, {
          x0: sx0,
          y0: 0,
          z0: 0,
          x1: sx1,
          y1: sy0,
          z1: faceplateThicknessMm
        });
      }
      // Top bezel strip above the slot opening
      if (sy1 < panelHeightMm) {
        appendBoxTrianglesToStl(lines, {
          x0: sx0,
          y0: sy1,
          z0: 0,
          x1: sx1,
          y1: panelHeightMm,
          z1: faceplateThicknessMm
        });
      }
      cursorX = Math.max(cursorX, sx1);
    }

    // Rightmost ear/pillar after the last slot
    if (cursorX < panelWidthMm) {
      appendBoxTrianglesToStl(lines, {
        x0: cursorX,
        y0: 0,
        z0: 0,
        x1: panelWidthMm,
        y1: panelHeightMm,
        z1: faceplateThicknessMm
      });
    }
  }

  // Rear L-Tray Floor
  appendBoxTrianglesToStl(lines, {
    x0: earWidthMm,
    y0: 0,
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: 3.2,
    z1: trayDepthMm
  });

  // Left & Right Side Gussets
  appendBoxTrianglesToStl(lines, {
    x0: earWidthMm,
    y0: 3.2,
    z0: faceplateThicknessMm,
    x1: earWidthMm + 3.5,
    y1: panelHeightMm * 0.65,
    z1: trayDepthMm
  });
  appendBoxTrianglesToStl(lines, {
    x0: panelWidthMm - earWidthMm - 3.5,
    y0: 3.2,
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: panelHeightMm * 0.65,
    z1: trayDepthMm
  });

  lines.push(`endsolid ${solidName}`);
  return lines.join('\n');
}

/**
 * Generates `.scad` and `.stl` printable carrier artifacts for all 3D-printable modular carriers
 * mounted in the given rack scene.
 */
export function generateProjectPrintableCarriers(
  scene: ComputedRackScene | SerializedRackScene
): PrintableCarrierArtifact[] {
  const bySlug = new Map<
    string,
    { blueprint: HardwareBlueprint; instanceIds: string[] }
  >();

  for (const dev of scene.geometry.devices) {
    const isPrintable =
      dev.blueprint.category === 'modular-carrier' ||
      (dev.blueprint.printable_metadata !== undefined &&
        dev.blueprint.printable_metadata !== null);
    if (!isPrintable) continue;

    const existing = bySlug.get(dev.blueprint.slug);
    if (existing) {
      existing.instanceIds.push(dev.instance_id);
    } else {
      bySlug.set(dev.blueprint.slug, {
        blueprint: dev.blueprint,
        instanceIds: [dev.instance_id]
      });
    }
  }

  const rackStd = scene.project.rack.standard;
  const results: PrintableCarrierArtifact[] = [];

  for (const [slug, entry] of bySlug.entries()) {
    results.push({
      slug,
      model: entry.blueprint.model,
      instance_ids: entry.instanceIds,
      rack_standard: rackStd,
      filename_scad: `${slug}.scad`,
      filename_stl: `${slug}.stl`,
      openscad_code: generateCarrierOpenScad(entry.blueprint, rackStd),
      stl_ascii: generateCarrierStl(entry.blueprint, rackStd)
    });
  }

  return results;
}
