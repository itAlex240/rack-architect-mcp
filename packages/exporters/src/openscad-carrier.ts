import {
  EIA_310_SPECS,
  MM_PER_U,
  roundCentis,
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

export type CoverPanelSurfacePattern = 'lines' | 'hex' | 'ribs' | 'bevel';

export function resolveCoverPanelPattern(slug: string): CoverPanelSurfacePattern {
  if (slug.includes('-hex')) return 'hex';
  if (slug.includes('-ribs')) return 'ribs';
  if (slug.includes('-lines')) return 'lines';
  return 'bevel';
}

function isCoverPanelBlueprint(blueprint: HardwareBlueprint): boolean {
  return (
    blueprint.category === 'blank-panel' ||
    blueprint.category === 'blanking-panel'
  );
}

/**
 * Generates a parametric OpenSCAD (`.scad`) script for a 3D-printable modular rack carrier
 * or patterned slot cover panel (`blank-panel`), complete with EIA-310 mounting slots,
 * surface relief grooves (horizontal lines, hexagonal honeycomb, or vertical tech-ribs),
 * rear stiffening flange or L-shaped support tray, and sub-module bay cutouts (`slots[]`).
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
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  if (isCoverPanelBlueprint(blueprint)) {
    const pattern = resolveCoverPanelPattern(blueprint.slug);
    const totalDepthMm = roundCentis(Math.max(6.0, blueprint.geometry.depth_mm));
    const lines: string[] = [];
    lines.push(`// ============================================================================`);
    lines.push(`// RackArchitect MCP — Parametric 3D-Printable Slot Cover Panel (.scad)`);
    lines.push(`// Blueprint: ${blueprint.manufacturer} ${blueprint.model} (${blueprint.slug})`);
    lines.push(`// Standard:  ${std.toUpperCase()} EIA-310 (${panelWidthMm}mm Total Width, ${uCount}U = ${panelHeightMm}mm)`);
    lines.push(`// Pattern:   ${pattern.toUpperCase()} (Closed Front Faceplate — Zero Cable Pass-Through)`);
    lines.push(`// Material:  ${blueprint.printable_metadata?.material_recommendation ?? 'PETG / PLA / ASA (4 Perimeters, 25% Gyroid Infill)'}`);
    lines.push(`// ============================================================================`);
    lines.push(``);
    lines.push(`/* [EIA-310 Cover Panel Parameters (mm)] */`);
    lines.push(`panel_width_mm = ${panelWidthMm};`);
    lines.push(`aperture_width_mm = ${apertureWidthMm};`);
    lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
    lines.push(`panel_height_mm = ${panelHeightMm};`);
    lines.push(`u_count = ${uCount};`);
    lines.push(`faceplate_thickness_mm = 4.2;`);
    lines.push(`stiffener_depth_mm = ${totalDepthMm};`);
    lines.push(`stiffener_wall_mm = 3.2;`);
    lines.push(`pattern_groove_depth_mm = 1.4;`);
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
    lines.push(`module front_surface_pattern_grooves() {`);
    const patX0 = roundCentis(earWidthMm + 10.0);
    const patW = roundCentis(apertureWidthMm - 20.0);
    if (pattern === 'lines') {
      const lineCount = uCount * 3;
      const marginY = 8.0;
      const usableH = panelHeightMm - 2 * marginY;
      const stepY = lineCount > 1 ? usableH / (lineCount - 1) : 0;
      lines.push(`  // Horizontal precision decorative grooves (${lineCount} lines, blind depth = 1.4mm)`);
      for (let i = 0; i < lineCount; i++) {
        const gy = roundCentis(marginY + i * stepY - 1.2);
        lines.push(`  translate([${patX0}, ${gy}, -0.5]) cube([${patW}, 2.4, pattern_groove_depth_mm + 0.5]);`);
      }
    } else if (pattern === 'hex') {
      const rows = uCount * 2;
      const cols = Math.max(5, Math.min(14, Math.floor(patW / 20)));
      const pitchX = roundCentis(patW / cols);
      const pitchY = roundCentis((panelHeightMm - 12.0) / rows);
      lines.push(`  // Blind hexagonal honeycomb relief cells (${rows}x${cols}, closed 2.8mm rear baffle wall)`);
      for (let r = 0; r < rows; r++) {
        const cy = roundCentis(6.0 + (r + 0.5) * pitchY);
        const rowShift = r % 2 === 1 ? roundCentis(pitchX * 0.25) : -roundCentis(pitchX * 0.25);
        for (let c = 0; c < cols; c++) {
          const cx = roundCentis(patX0 + (c + 0.5) * pitchX + rowShift);
          lines.push(`  translate([${cx}, ${cy}, -0.5]) cylinder(d = ${roundCentis(Math.min(pitchX, pitchY) * 0.68)}, h = pattern_groove_depth_mm + 0.5, $fn = 6);`);
        }
      }
    } else if (pattern === 'ribs') {
      const ribCount = Math.max(8, Math.min(20, Math.floor(patW / 14)));
      const pitchX = patW / ribCount;
      const grooveW = roundCentis(Math.max(3.0, pitchX * 0.45));
      const grooveH = roundCentis(panelHeightMm - 12.0);
      lines.push(`  // Vertical tech-rib relief grooves (${ribCount} channels, blind depth = 1.4mm)`);
      for (let i = 0; i < ribCount; i++) {
        const gx = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
        lines.push(`  translate([${gx}, 6.0, -0.5]) cube([${grooveW}, ${grooveH}, pattern_groove_depth_mm + 0.5]);`);
      }
    } else {
      lines.push(`  // Minimalist recessed architectural bevel groove`);
      lines.push(`  translate([${patX0}, ${roundCentis(panelHeightMm / 2 - 1.2)}, -0.5]) cube([${patW}, 2.4, pattern_groove_depth_mm + 0.5]);`);
    }
    lines.push(`}`);
    lines.push(``);
    lines.push(`module slot_bay_cutouts() {`);
    lines.push(`  // Closed blanking cover panel (zero through-holes; front relief grooves only)`);
    lines.push(`  front_surface_pattern_grooves();`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`module rear_perimeter_stiffener_frame() {`);
    lines.push(`  flange_h = stiffener_depth_mm - faceplate_thickness_mm;`);
    lines.push(`  if (flange_h > 0.5) {`);
    lines.push(`    // Bottom & Top horizontal stiffening ribs`);
    lines.push(`    translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, flange_h]);`);
    lines.push(`    translate([${earWidthMm}, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, flange_h]);`);
    lines.push(`    // Left & Right vertical stiffening ribs`);
    lines.push(`    translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, flange_h]);`);
    lines.push(`    translate([${earWidthMm} + aperture_width_mm - stiffener_wall_mm, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, flange_h]);`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`module rack_carrier_assembly() {`);
    lines.push(`  union() {`);
    lines.push(`    difference() {`);
    lines.push(`      cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]);`);
    lines.push(`      eia310_ear_holes();`);
    lines.push(`      slot_bay_cutouts();`);
    lines.push(`    }`);
    lines.push(`    rear_perimeter_stiffener_frame();`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`rack_carrier_assembly();`);
    return lines.join('\n');
  }

  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));

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
    const railHeightMm = roundCentis(Math.min(panelHeightMm, Math.max(8.0, sy + 6.0)));
    lines.push(`  // Guide rails for '${slot.slot_id}' (fused to tray floor Y=0..${railHeightMm}mm)`);
    lines.push(`  translate([${sx} - print_tolerance_mm - 2.2, 0, faceplate_thickness_mm])`);
    lines.push(`    cube([2.2, ${railHeightMm}, ${sd}]);`);
    lines.push(`  translate([${roundCentis(sx + sw)} + print_tolerance_mm, 0, faceplate_thickness_mm])`);
    lines.push(`    cube([2.2, ${railHeightMm}, ${sd}]);`);
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

function normalizeBox(b: Box3DMm): Box3DMm {
  return {
    x0: roundCentis(Math.min(b.x0, b.x1)),
    y0: roundCentis(Math.min(b.y0, b.y1)),
    z0: roundCentis(Math.min(b.z0, b.z1)),
    x1: roundCentis(Math.max(b.x0, b.x1)),
    y1: roundCentis(Math.max(b.y0, b.y1)),
    z1: roundCentis(Math.max(b.z0, b.z1))
  };
}

function isPointInsideBox(
  x: number,
  y: number,
  z: number,
  b: Box3DMm
): boolean {
  return (
    x > b.x0 &&
    x < b.x1 &&
    y > b.y0 &&
    y < b.y1 &&
    z > b.z0 &&
    z < b.z1
  );
}

function collectUniqueSortedCoords(values: readonly number[]): number[] {
  const sorted = [...values].map((v) => roundCentis(v)).sort((a, b) => a - b);
  const unique: number[] = [];
  for (const val of sorted) {
    const prev = unique[unique.length - 1];
    if (prev === undefined || Math.abs(val - prev) > 1e-3) {
      unique.push(val);
    }
  }
  return unique;
}

/**
 * Generates a watertight, 2-manifold ASCII `.stl` 3D mesh for a modular rack carrier.
 * Evaluates the full CSG assembly (Front EIA-310 Faceplate minus M6 Ear Mounting Slots
 * and Tolerance-Compensated Sub-Module Bay Cutouts, Rear L-Shaped Support Tray Floor
 * minus Ventilation Cutouts, Structural Side Gussets, and Sub-Module Retention Rails)
 * on an exact rectilinear coordinate grid so there are zero internal faces, zero T-junctions,
 * and zero non-manifold edges.
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
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(
    blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75
  );
  const isCoverPanel = isCoverPanelBlueprint(blueprint);
  const faceplateThicknessMm = 4.2;
  const trayFloorThicknessMm = 3.2;
  const sideGussetThicknessMm = 3.5;
  const printToleranceMm = 0.35;
  const trayDepthMm = isCoverPanel
    ? roundCentis(Math.max(6.0, blueprint.geometry.depth_mm))
    : roundCentis(Math.max(40, blueprint.geometry.depth_mm));
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  // 1. Primary additive CSG volumes
  const faceplateBox = normalizeBox({
    x0: 0,
    y0: 0,
    z0: 0,
    x1: panelWidthMm,
    y1: panelHeightMm,
    z1: faceplateThicknessMm
  });

  const trayFloorBox = normalizeBox({
    x0: earWidthMm,
    y0: 0,
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: trayFloorThicknessMm,
    z1: trayDepthMm
  });

  const topStiffenerBox = isCoverPanel
    ? normalizeBox({
        x0: earWidthMm,
        y0: roundCentis(panelHeightMm - trayFloorThicknessMm),
        z0: faceplateThicknessMm,
        x1: panelWidthMm - earWidthMm,
        y1: panelHeightMm,
        z1: trayDepthMm
      })
    : null;

  const gussetHeightMm = isCoverPanel
    ? panelHeightMm
    : roundCentis(panelHeightMm * 0.65);
  const gussetBoxes: Box3DMm[] = [
    normalizeBox({
      x0: earWidthMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: earWidthMm + sideGussetThicknessMm,
      y1: gussetHeightMm,
      z1: trayDepthMm
    }),
    normalizeBox({
      x0: panelWidthMm - earWidthMm - sideGussetThicknessMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: panelWidthMm - earWidthMm,
      y1: gussetHeightMm,
      z1: trayDepthMm
    })
  ];

  // 2. EIA-310 M6 Mounting Slots (10.0 x 6.5 mm oblong slots on left and right rack ears)
  const leftHoleX = roundCentis((panelWidthMm - holePitchXMm) / 2);
  const rightHoleX = roundCentis(panelWidthMm - leftHoleX);
  const slotHalfW = 5.0;
  const slotHalfH = 3.25;
  const earHoleBoxes: Box3DMm[] = [];
  for (let u = 0; u < uCount; u++) {
    const baseY = u * MM_PER_U;
    for (const offsetY of [6.35, 22.225, 38.1]) {
      const cy = roundCentis(baseY + offsetY);
      if (cy + slotHalfH < panelHeightMm - 1.5 && cy - slotHalfH > 1.5) {
        earHoleBoxes.push(
          normalizeBox({
            x0: Math.max(1.2, leftHoleX - slotHalfW),
            y0: cy - slotHalfH,
            z0: -1,
            x1: Math.min(earWidthMm - 1.2, leftHoleX + slotHalfW),
            y1: cy + slotHalfH,
            z1: faceplateThicknessMm + 1
          }),
          normalizeBox({
            x0: Math.max(panelWidthMm - earWidthMm + 1.2, rightHoleX - slotHalfW),
            y0: cy - slotHalfH,
            z0: -1,
            x1: Math.min(panelWidthMm - 1.2, rightHoleX + slotHalfW),
            y1: cy + slotHalfH,
            z1: faceplateThicknessMm + 1
          })
        );
      }
    }
  }

  // 2b. Blind Front Decorative Pattern Grooves for Cover Panels (z = 0..1.4mm, leaving 2.8mm solid backing wall)
  const patternGrooveBoxes: Box3DMm[] = [];
  if (isCoverPanel) {
    const pattern = resolveCoverPanelPattern(blueprint.slug);
    const patX0 = roundCentis(earWidthMm + 10.0);
    const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
    const patW = roundCentis(patX1 - patX0);
    const grooveDepthMm = 1.4;

    if (pattern === 'lines') {
      const lineCount = uCount * 3;
      const marginY = 8.0;
      const usableH = panelHeightMm - 2 * marginY;
      const stepY = lineCount > 1 ? usableH / (lineCount - 1) : 0;
      for (let i = 0; i < lineCount; i++) {
        const gy0 = roundCentis(marginY + i * stepY - 1.2);
        const gy1 = roundCentis(gy0 + 2.4);
        patternGrooveBoxes.push(
          normalizeBox({
            x0: patX0,
            y0: gy0,
            z0: -1,
            x1: patX1,
            y1: gy1,
            z1: grooveDepthMm
          })
        );
      }
    } else if (pattern === 'hex') {
      const rows = uCount * 2;
      const cols = Math.max(5, Math.min(10, Math.floor(patW / 24)));
      const pitchX = patW / cols;
      const pitchY = (panelHeightMm - 12.0) / rows;
      const cellW = roundCentis(pitchX * 0.62);
      const cellH = roundCentis(pitchY * 0.6);
      for (let r = 0; r < rows; r++) {
        const cy = 6.0 + (r + 0.5) * pitchY;
        const shiftX = r % 2 === 1 ? pitchX * 0.16 : -pitchX * 0.16;
        for (let c = 0; c < cols; c++) {
          const cx = patX0 + (c + 0.5) * pitchX + shiftX;
          const x0 = roundCentis(Math.max(patX0, cx - cellW / 2));
          const x1 = roundCentis(Math.min(patX1, cx + cellW / 2));
          const y0 = roundCentis(cy - cellH / 2);
          const y1 = roundCentis(cy + cellH / 2);
          if (x1 - x0 >= 3.0 && y1 - y0 >= 3.0) {
            patternGrooveBoxes.push(
              normalizeBox({
                x0,
                y0,
                z0: -1,
                x1,
                y1,
                z1: grooveDepthMm
              })
            );
          }
        }
      }
    } else if (pattern === 'ribs') {
      const ribCount = Math.max(8, Math.min(14, Math.floor(patW / 16)));
      const pitchX = patW / ribCount;
      const grooveW = roundCentis(Math.max(3.0, pitchX * 0.45));
      for (let i = 0; i < ribCount; i++) {
        const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
        const gx1 = roundCentis(gx0 + grooveW);
        patternGrooveBoxes.push(
          normalizeBox({
            x0: gx0,
            y0: 6.0,
            z0: -1,
            x1: gx1,
            y1: roundCentis(panelHeightMm - 6.0),
            z1: grooveDepthMm
          })
        );
      }
    } else {
      patternGrooveBoxes.push(
        normalizeBox({
          x0: patX0,
          y0: roundCentis(panelHeightMm / 2 - 1.2),
          z0: -1,
          x1: patX1,
          y1: roundCentis(panelHeightMm / 2 + 1.2),
          z1: grooveDepthMm
        })
      );
    }
  }

  // 3. Sub-Module Bay Cutouts (with +0.35mm 3D-print clearance) & Retention Guide Rails
  const slotCutoutBoxes: Box3DMm[] = [];
  const railBoxes: Box3DMm[] = [];
  for (const slot of blueprint.slots) {
    const sx0 = roundCentis(
      Math.max(earWidthMm + 1.0, slot.offset_mm.x - printToleranceMm)
    );
    const sx1 = roundCentis(
      Math.min(
        panelWidthMm - earWidthMm - 1.0,
        slot.offset_mm.x + slot.max_dimensions_mm.width + printToleranceMm
      )
    );
    const sy0 = roundCentis(Math.max(1.2, slot.offset_mm.y - printToleranceMm));
    const sy1 = roundCentis(
      Math.min(
        panelHeightMm - 1.2,
        slot.offset_mm.y + slot.max_dimensions_mm.height + printToleranceMm
      )
    );
    if (sx1 > sx0 && sy1 > sy0) {
      slotCutoutBoxes.push(
        normalizeBox({
          x0: sx0,
          y0: sy0,
          z0: -1,
          x1: sx1,
          y1: sy1,
          z1: faceplateThicknessMm + 1
        })
      );
    }

    if (slot.accepted_slot_type !== 'standard-keystone') {
      const sd = roundCentis(
        Math.min(trayDepthMm - 6, slot.max_dimensions_mm.depth)
      );
      const railHeightMm = roundCentis(
        Math.min(panelHeightMm, Math.max(8.0, slot.offset_mm.y + 6.0))
      );
      const leftRailX0 = roundCentis(
        Math.max(earWidthMm + sideGussetThicknessMm, sx0 - 2.2)
      );
      if (sx0 - leftRailX0 >= 1.0) {
        railBoxes.push(
          normalizeBox({
            x0: leftRailX0,
            y0: 0,
            z0: faceplateThicknessMm,
            x1: sx0,
            y1: railHeightMm,
            z1: faceplateThicknessMm + sd
          })
        );
      }
      const rightRailX1 = roundCentis(
        Math.min(panelWidthMm - earWidthMm - sideGussetThicknessMm, sx1 + 2.2)
      );
      if (rightRailX1 - sx1 >= 1.0) {
        railBoxes.push(
          normalizeBox({
            x0: sx1,
            y0: 0,
            z0: faceplateThicknessMm,
            x1: rightRailX1,
            y1: railHeightMm,
            z1: faceplateThicknessMm + sd
          })
        );
      }
    }
  }

  // 4. Tray Floor Ventilation Cutouts (spaced safely clear of gussets and retention rails)
  const ventCutoutBoxes: Box3DMm[] = [];
  if (!isCoverPanel) {
    const ventXMin = roundCentis(earWidthMm + sideGussetThicknessMm + 10);
    const ventXMax = roundCentis(
      panelWidthMm - earWidthMm - sideGussetThicknessMm - 10
    );
    for (let z = 20; z + 12 <= trayDepthMm - 12; z += 22) {
      for (let x = ventXMin; x + 12 <= ventXMax; x += 22) {
        const vx0 = roundCentis(x);
        const vx1 = roundCentis(x + 12);
        const vz0 = roundCentis(z);
        const vz1 = roundCentis(z + 12);
        const overlapsRail = railBoxes.some(
          (r) =>
            vx1 > r.x0 - 2.0 &&
            vx0 < r.x1 + 2.0 &&
            vz1 > r.z0 - 2.0 &&
            vz0 < r.z1 + 2.0
        );
        if (!overlapsRail) {
          ventCutoutBoxes.push(
            normalizeBox({
              x0: vx0,
              y0: -1,
              z0: vz0,
              x1: vx1,
              y1: trayFloorThicknessMm + 1,
              z1: vz1
            })
          );
        }
      }
    }
  }

  // 5. Build exact rectilinear coordinate grid across all features
  const allBoxes = [
    faceplateBox,
    trayFloorBox,
    ...(topStiffenerBox ? [topStiffenerBox] : []),
    ...gussetBoxes,
    ...earHoleBoxes,
    ...patternGrooveBoxes,
    ...slotCutoutBoxes,
    ...railBoxes,
    ...ventCutoutBoxes
  ];

  const xs = collectUniqueSortedCoords(
    allBoxes
      .flatMap((b) => [b.x0, b.x1])
      .filter((x) => x >= 0 && x <= panelWidthMm)
  );
  const ys = collectUniqueSortedCoords(
    allBoxes
      .flatMap((b) => [b.y0, b.y1])
      .filter((y) => y >= 0 && y <= panelHeightMm)
  );
  const zs = collectUniqueSortedCoords(
    allBoxes
      .flatMap((b) => [b.z0, b.z1])
      .filter((z) => z >= 0 && z <= trayDepthMm)
  );

  const nx = xs.length - 1;
  const ny = ys.length - 1;
  const nz = zs.length - 1;

  const isCellSolid = (ix: number, iy: number, iz: number): boolean => {
    if (ix < 0 || ix >= nx || iy < 0 || iy >= ny || iz < 0 || iz >= nz) {
      return false;
    }
    const x0 = xs[ix];
    const x1 = xs[ix + 1];
    const y0 = ys[iy];
    const y1 = ys[iy + 1];
    const z0 = zs[iz];
    const z1 = zs[iz + 1];
    if (
      x0 === undefined ||
      x1 === undefined ||
      y0 === undefined ||
      y1 === undefined ||
      z0 === undefined ||
      z1 === undefined
    ) {
      return false;
    }
    const mx = 0.5 * (x0 + x1);
    const my = 0.5 * (y0 + y1);
    const mz = 0.5 * (z0 + z1);

    const inFaceplate =
      isPointInsideBox(mx, my, mz, faceplateBox) &&
      !earHoleBoxes.some((b) => isPointInsideBox(mx, my, mz, b)) &&
      !patternGrooveBoxes.some((b) => isPointInsideBox(mx, my, mz, b)) &&
      !slotCutoutBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    const inTrayFloor =
      isPointInsideBox(mx, my, mz, trayFloorBox) &&
      !ventCutoutBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    const inTopStiffener =
      topStiffenerBox !== null && isPointInsideBox(mx, my, mz, topStiffenerBox);
    const inGusset = gussetBoxes.some((b) => isPointInsideBox(mx, my, mz, b));
    const inRail = railBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    return (
      inFaceplate || inTrayFloor || inTopStiffener || inGusset || inRail
    );
  };

  const solidGrid: boolean[][][] = [];
  for (let ix = 0; ix < nx; ix++) {
    const ySlice: boolean[][] = [];
    for (let iy = 0; iy < ny; iy++) {
      const zRow: boolean[] = [];
      for (let iz = 0; iz < nz; iz++) {
        zRow.push(isCellSolid(ix, iy, iz));
      }
      ySlice.push(zRow);
    }
    solidGrid.push(ySlice);
  }

  const getSolid = (ix: number, iy: number, iz: number): boolean =>
    solidGrid[ix]?.[iy]?.[iz] ?? false;

  const solidName = blueprint.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
  const lines: string[] = [];
  lines.push(`solid ${solidName}`);

  const emitTri = (
    normX: number,
    normY: number,
    normZ: number,
    v1: readonly [number, number, number],
    v2: readonly [number, number, number],
    v3: readonly [number, number, number]
  ) => {
    lines.push(`  facet normal ${normX} ${normY} ${normZ}`);
    lines.push(`    outer loop`);
    lines.push(`      vertex ${v1[0]} ${v1[1]} ${v1[2]}`);
    lines.push(`      vertex ${v2[0]} ${v2[1]} ${v2[2]}`);
    lines.push(`      vertex ${v3[0]} ${v3[1]} ${v3[2]}`);
    lines.push(`    endloop`);
    lines.push(`  endfacet`);
  };

  for (let ix = 0; ix < nx; ix++) {
    const x0 = xs[ix]!;
    const x1 = xs[ix + 1]!;
    for (let iy = 0; iy < ny; iy++) {
      const y0 = ys[iy]!;
      const y1 = ys[iy + 1]!;
      for (let iz = 0; iz < nz; iz++) {
        if (!getSolid(ix, iy, iz)) continue;
        const z0 = zs[iz]!;
        const z1 = zs[iz + 1]!;

        // -Z face (Front)
        if (!getSolid(ix, iy, iz - 1)) {
          emitTri(0, 0, -1, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
          emitTri(0, 0, -1, [x0, y0, z0], [x1, y1, z0], [x1, y0, z0]);
        }
        // +Z face (Rear)
        if (!getSolid(ix, iy, iz + 1)) {
          emitTri(0, 0, 1, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1]);
          emitTri(0, 0, 1, [x0, y0, z1], [x1, y1, z1], [x0, y1, z1]);
        }
        // -Y face (Bottom)
        if (!getSolid(ix, iy - 1, iz)) {
          emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]);
          emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z1], [x0, y0, z1]);
        }
        // +Y face (Top)
        if (!getSolid(ix, iy + 1, iz)) {
          emitTri(0, 1, 0, [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]);
          emitTri(0, 1, 0, [x0, y1, z0], [x1, y1, z1], [x1, y1, z0]);
        }
        // -X face (Left)
        if (!getSolid(ix - 1, iy, iz)) {
          emitTri(-1, 0, 0, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]);
          emitTri(-1, 0, 0, [x0, y0, z0], [x0, y1, z1], [x0, y1, z0]);
        }
        // +X face (Right)
        if (!getSolid(ix + 1, iy, iz)) {
          emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
          emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z1], [x1, y0, z1]);
        }
      }
    }
  }

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

export type CoverPanelPatternType =
  | 'lines'
  | 'hex'
  | 'ribs'
  | 'vented-slots'
  | 'solid';

export type CoverPanelUHeight = 0.5 | 1 | 2 | 3;

export interface CustomCoverPanelOptions {
  readonly standard: RackStandard;
  readonly u_height: CoverPanelUHeight;
  readonly pattern: CoverPanelPatternType;
  readonly label_text?: string | undefined;
}

const FONT_5X7_GLYPHS: Readonly<Record<string, readonly string[]>> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#..##', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['#...#', '#...#', '#...#', '#####', '....#', '....#', '....#'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '####.', '#...#', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  _: ['.....', '.....', '.....', '.....', '.....', '.....', '#####'],
  '/': ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....']
};

export function sanitizeCoverPanelLabel(raw?: string): string {
  if (!raw) return '';
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9 ._/-]/g, '')
    .trim()
    .slice(0, 14);
}

interface CoverPanelTextLayout {
  readonly label: string;
  readonly plateX0: number;
  readonly plateX1: number;
  readonly plateY0: number;
  readonly plateY1: number;
  readonly dotBoxes: readonly Box3DMm[];
}

function buildCoverPanelTextLayout(
  rawLabel: string | undefined,
  panelWidthMm: number,
  panelHeightMm: number,
  patW: number,
  grooveDepthMm: number
): CoverPanelTextLayout | null {
  const label = sanitizeCoverPanelLabel(rawLabel);
  if (label.length === 0) return null;

  const totalCols = label.length * 6 - 1;
  const maxUsableW = Math.max(24, patW - 10);
  const dotPitch = roundCentis(
    Math.max(1.0, Math.min(1.55, maxUsableW / Math.max(1, totalCols)))
  );
  const dotSize = roundCentis(Math.max(0.68, dotPitch * 0.7));
  const textSpanW = (totalCols - 1) * dotPitch + dotSize;
  const textSpanH = 6 * dotPitch + dotSize;

  const centerX = panelWidthMm / 2;
  const centerY = panelHeightMm / 2;
  // Front face is z=0 (outward normal -Z), Up is +Y, so Viewer-Left->Viewer-Right maps to decreasing X
  const viewerLeftStartCenter = centerX + ((totalCols - 1) * dotPitch) / 2;
  const topRowCenterY = centerY + (6 * dotPitch) / 2;

  const dotBoxes: Box3DMm[] = [];
  for (let ci = 0; ci < label.length; ci++) {
    const ch = label[ci] ?? ' ';
    const glyph = FONT_5X7_GLYPHS[ch] ?? FONT_5X7_GLYPHS[' ']!;
    for (let r = 0; r < 7; r++) {
      const rowStr = glyph[r] ?? '.....';
      const dyCenter = topRowCenterY - r * dotPitch;
      for (let c = 0; c < 5; c++) {
        if (rowStr[c] !== '#') continue;
        const globalCol = ci * 6 + c;
        const dxCenter = viewerLeftStartCenter - globalCol * dotPitch;
        dotBoxes.push(
          normalizeBox({
            x0: dxCenter - dotSize / 2,
            y0: dyCenter - dotSize / 2,
            z0: -1,
            x1: dxCenter + dotSize / 2,
            y1: dyCenter + dotSize / 2,
            z1: grooveDepthMm
          })
        );
      }
    }
  }

  return {
    label,
    plateX0: roundCentis(centerX - textSpanW / 2 - 2.6),
    plateX1: roundCentis(centerX + textSpanW / 2 + 2.6),
    plateY0: roundCentis(centerY - textSpanH / 2 - 2.2),
    plateY1: roundCentis(centerY + textSpanH / 2 + 2.2),
    dotBoxes
  };
}

function boxesOverlap2D(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  ex0: number,
  ey0: number,
  ex1: number,
  ey1: number
): boolean {
  return x1 > ex0 && x0 < ex1 && y1 > ey0 && y0 < ey1;
}

/**
 * Generates a parametric OpenSCAD (`.scad`) script for a custom 3D-printable slot cover panel
 * supporting `0.5U` / `1U` / `2U` / `3U` heights, `lines` / `hex` / `ribs` / `vented-slots` / `solid`
 * surface patterns, and optional front-engraved nameplate text.
 */
export function generateCustomCoverPanelOpenScad(
  options: CustomCoverPanelOptions
): string {
  const spec = EIA_310_SPECS[options.standard];
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(options.u_height * MM_PER_U - 0.75);
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);
  const patX0 = roundCentis(earWidthMm + 10.0);
  const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
  const patW = roundCentis(patX1 - patX0);
  const stiffenerDepthMm = options.u_height >= 2 ? 12.0 : 10.0;
  const grooveDepthMm = 1.4;
  const faceplateThicknessMm = 4.2;

  const textLayout = buildCoverPanelTextLayout(
    options.label_text,
    panelWidthMm,
    panelHeightMm,
    patW,
    grooveDepthMm
  );

  const lines: string[] = [];
  lines.push(`// ============================================================================`);
  lines.push(`// RackArchitect MCP — Custom Parametric 3D-Printable Slot Cover Panel (.scad)`);
  lines.push(`// Standard:  ${options.standard.toUpperCase()} EIA-310 (${panelWidthMm}mm Width, ${options.u_height}U = ${panelHeightMm}mm Height)`);
  lines.push(`// Pattern:   ${options.pattern.toUpperCase()}${textLayout ? ` | Engraved Label: "${textLayout.label}"` : ''}`);
  lines.push(`// Material:  PETG / PLA / ASA (Print Face-Down on Textured PEI Plate, Zero Supports)`);
  lines.push(`// ============================================================================`);
  lines.push(``);
  lines.push(`panel_width_mm = ${panelWidthMm};`);
  lines.push(`aperture_width_mm = ${apertureWidthMm};`);
  lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
  lines.push(`panel_height_mm = ${panelHeightMm};`);
  lines.push(`faceplate_thickness_mm = ${faceplateThicknessMm};`);
  lines.push(`stiffener_depth_mm = ${stiffenerDepthMm};`);
  lines.push(`stiffener_wall_mm = 3.2;`);
  lines.push(`pattern_groove_depth_mm = ${grooveDepthMm};`);
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
  if (options.u_height < 1) {
    const cy = roundCentis(panelHeightMm / 2);
    lines.push(`  translate([left_hole_x, ${cy}, 0]) oval_mounting_slot();`);
    lines.push(`  translate([right_hole_x, ${cy}, 0]) oval_mounting_slot();`);
  } else {
    const fullUs = Math.round(options.u_height);
    lines.push(`  for (u = [0 : ${fullUs - 1}]) {`);
    lines.push(`    base_y = u * 44.45;`);
    lines.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`);
    lines.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`);
    lines.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
    lines.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
    lines.push(`      }`);
    lines.push(`    }`);
    lines.push(`  }`);
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`module custom_surface_features() {`);
  if (options.pattern === 'lines') {
    const lineCount = Math.max(2, Math.round(options.u_height * 3));
    const marginY = options.u_height < 1 ? 5.2 : 8.0;
    const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
    for (let i = 0; i < lineCount; i++) {
      const gy0 = roundCentis(marginY + i * stepY - 1.1);
      const gy1 = roundCentis(gy0 + 2.2);
      if (
        textLayout &&
        boxesOverlap2D(
          patX0,
          gy0,
          patX1,
          gy1,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1
        )
      ) {
        const leftW = roundCentis(textLayout.plateX0 - patX0);
        const rightW = roundCentis(patX1 - textLayout.plateX1);
        if (leftW >= 6.0) {
          lines.push(`  translate([${patX0}, ${gy0}, -0.5]) cube([${leftW}, 2.2, pattern_groove_depth_mm + 0.5]);`);
        }
        if (rightW >= 6.0) {
          lines.push(`  translate([${textLayout.plateX1}, ${gy0}, -0.5]) cube([${rightW}, 2.2, pattern_groove_depth_mm + 0.5]);`);
        }
      } else {
        lines.push(`  translate([${patX0}, ${gy0}, -0.5]) cube([${patW}, 2.2, pattern_groove_depth_mm + 0.5]);`);
      }
    }
  } else if (options.pattern === 'hex') {
    const rows = Math.max(1, Math.round(options.u_height * 2));
    const cols = Math.max(5, Math.min(14, Math.floor(patW / 20)));
    const pitchX = patW / cols;
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const pitchY = (panelHeightMm - 2 * marginY) / rows;
    const diam = roundCentis(Math.min(pitchX, pitchY) * 0.66);
    for (let r = 0; r < rows; r++) {
      const cy = roundCentis(marginY + (r + 0.5) * pitchY);
      const shiftX = r % 2 === 1 ? pitchX * 0.2 : -pitchX * 0.2;
      for (let c = 0; c < cols; c++) {
        const cx = roundCentis(patX0 + (c + 0.5) * pitchX + shiftX);
        if (
          textLayout &&
          boxesOverlap2D(
            cx - diam / 2,
            cy - diam / 2,
            cx + diam / 2,
            cy + diam / 2,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1
          )
        ) {
          continue;
        }
        lines.push(`  translate([${cx}, ${cy}, -0.5]) cylinder(d = ${diam}, h = pattern_groove_depth_mm + 0.5, $fn = 6);`);
      }
    }
  } else if (options.pattern === 'ribs') {
    const ribCount = Math.max(8, Math.min(18, Math.floor(patW / 15)));
    const pitchX = patW / ribCount;
    const grooveW = roundCentis(Math.max(2.8, pitchX * 0.44));
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const grooveH = roundCentis(panelHeightMm - 2 * marginY);
    for (let i = 0; i < ribCount; i++) {
      const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
      const gx1 = roundCentis(gx0 + grooveW);
      if (
        textLayout &&
        boxesOverlap2D(
          gx0,
          marginY,
          gx1,
          marginY + grooveH,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1
        )
      ) {
        continue;
      }
      lines.push(`  translate([${gx0}, ${marginY}, -0.5]) cube([${grooveW}, ${grooveH}, pattern_groove_depth_mm + 0.5]);`);
    }
  } else if (options.pattern === 'vented-slots') {
    const colCount = options.standard === '19inch' ? 3 : 2;
    const bridgeMm = 6.0;
    const slotW = roundCentis((patW - (colCount - 1) * bridgeMm) / colCount);
    const slotH = 2.4;
    const pitchY = 5.6;
    const marginY = 5.2;
    for (let y = marginY; y + slotH <= panelHeightMm - marginY; y += pitchY) {
      const sy0 = roundCentis(y);
      const sy1 = roundCentis(y + slotH);
      for (let col = 0; col < colCount; col++) {
        const sx0 = roundCentis(patX0 + col * (slotW + bridgeMm));
        const sx1 = roundCentis(sx0 + slotW);
        if (
          textLayout &&
          boxesOverlap2D(
            sx0,
            sy0,
            sx1,
            sy1,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1
          )
        ) {
          continue;
        }
        lines.push(`  translate([${sx0}, ${sy0}, -1.0]) cube([${slotW}, ${slotH}, faceplate_thickness_mm + 2.0]);`);
      }
    }
  }

  if (textLayout) {
    const fontSizeMm = roundCentis(
      Math.min(options.u_height < 1 ? 7.5 : 10.5, (patW * 0.72) / Math.max(1, textLayout.label.length))
    );
    lines.push(`  // Front-engraved nameplate label (mirrored X on z=0 build-plate face)`);
    lines.push(
      `  translate([panel_width_mm / 2, panel_height_mm / 2, -0.5]) linear_extrude(height = pattern_groove_depth_mm + 0.5) mirror([1, 0, 0]) text("${textLayout.label}", size = ${fontSizeMm}, font = "Liberation Mono:style=Bold", halign = "center", valign = "center");`
    );
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`union() {`);
  lines.push(`  difference() {`);
  lines.push(`    cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]);`);
  lines.push(`    eia310_ear_holes();`);
  lines.push(`    custom_surface_features();`);
  lines.push(`  }`);
  lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm}, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([3.5, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm} + aperture_width_mm - 3.5, 0, faceplate_thickness_mm]) cube([3.5, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`}`);

  return lines.join('\n');
}

/**
 * Generates a 100% watertight, 2-manifold ASCII `.stl` mesh for a custom 3D-printable slot cover panel
 * (`0.5U` / `1U` / `2U` / `3U`, `lines` / `hex` / `ribs` / `vented-slots` / `solid`, optional engraved 5x7 dot-matrix text).
 */
export function generateCustomCoverPanelStl(
  options: CustomCoverPanelOptions
): string {
  const spec = EIA_310_SPECS[options.standard];
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(options.u_height * MM_PER_U - 0.75);
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);
  const faceplateThicknessMm = 4.2;
  const stiffenerWallMm = 3.2;
  const sideGussetMm = 3.5;
  const totalDepthMm = options.u_height >= 2 ? 12.0 : 10.0;
  const grooveDepthMm = 1.4;

  const faceplateBox = normalizeBox({
    x0: 0,
    y0: 0,
    z0: 0,
    x1: panelWidthMm,
    y1: panelHeightMm,
    z1: faceplateThicknessMm
  });

  const bottomStiffenerBox = normalizeBox({
    x0: earWidthMm,
    y0: 0,
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: stiffenerWallMm,
    z1: totalDepthMm
  });

  const topStiffenerBox = normalizeBox({
    x0: earWidthMm,
    y0: roundCentis(panelHeightMm - stiffenerWallMm),
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: panelHeightMm,
    z1: totalDepthMm
  });

  const gussetBoxes: Box3DMm[] = [
    normalizeBox({
      x0: earWidthMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: earWidthMm + sideGussetMm,
      y1: panelHeightMm,
      z1: totalDepthMm
    }),
    normalizeBox({
      x0: panelWidthMm - earWidthMm - sideGussetMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: panelWidthMm - earWidthMm,
      y1: panelHeightMm,
      z1: totalDepthMm
    })
  ];

  // EIA-310 Ear Mounting Slots
  const leftHoleX = roundCentis((panelWidthMm - holePitchXMm) / 2);
  const rightHoleX = roundCentis(panelWidthMm - leftHoleX);
  const earHoleBoxes: Box3DMm[] = [];
  if (options.u_height < 1) {
    const cy = roundCentis(panelHeightMm / 2);
    earHoleBoxes.push(
      normalizeBox({
        x0: Math.max(1.2, leftHoleX - 5.0),
        y0: cy - 3.25,
        z0: -1,
        x1: Math.min(earWidthMm - 1.2, leftHoleX + 5.0),
        y1: cy + 3.25,
        z1: faceplateThicknessMm + 1
      }),
      normalizeBox({
        x0: Math.max(panelWidthMm - earWidthMm + 1.2, rightHoleX - 5.0),
        y0: cy - 3.25,
        z0: -1,
        x1: Math.min(panelWidthMm - 1.2, rightHoleX + 5.0),
        y1: cy + 3.25,
        z1: faceplateThicknessMm + 1
      })
    );
  } else {
    const fullUs = Math.round(options.u_height);
    for (let u = 0; u < fullUs; u++) {
      const baseY = u * MM_PER_U;
      for (const offsetY of [6.35, 22.225, 38.1]) {
        const cy = roundCentis(baseY + offsetY);
        if (cy + 3.25 < panelHeightMm - 1.5 && cy - 3.25 > 1.5) {
          earHoleBoxes.push(
            normalizeBox({
              x0: Math.max(1.2, leftHoleX - 5.0),
              y0: cy - 3.25,
              z0: -1,
              x1: Math.min(earWidthMm - 1.2, leftHoleX + 5.0),
              y1: cy + 3.25,
              z1: faceplateThicknessMm + 1
            }),
            normalizeBox({
              x0: Math.max(panelWidthMm - earWidthMm + 1.2, rightHoleX - 5.0),
              y0: cy - 3.25,
              z0: -1,
              x1: Math.min(panelWidthMm - 1.2, rightHoleX + 5.0),
              y1: cy + 3.25,
              z1: faceplateThicknessMm + 1
            })
          );
        }
      }
    }
  }

  const patX0 = roundCentis(earWidthMm + 10.0);
  const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
  const patW = roundCentis(patX1 - patX0);

  const textLayout = buildCoverPanelTextLayout(
    options.label_text,
    panelWidthMm,
    panelHeightMm,
    patW,
    grooveDepthMm
  );

  const featureCutoutBoxes: Box3DMm[] = [];

  if (options.pattern === 'lines') {
    const lineCount = Math.max(2, Math.round(options.u_height * 3));
    const marginY = options.u_height < 1 ? 5.2 : 8.0;
    const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
    for (let i = 0; i < lineCount; i++) {
      const gy0 = roundCentis(marginY + i * stepY - 1.1);
      const gy1 = roundCentis(gy0 + 2.2);
      if (
        textLayout &&
        boxesOverlap2D(
          patX0,
          gy0,
          patX1,
          gy1,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1
        )
      ) {
        if (textLayout.plateX0 - patX0 >= 6.0) {
          featureCutoutBoxes.push(
            normalizeBox({
              x0: patX0,
              y0: gy0,
              z0: -1,
              x1: textLayout.plateX0,
              y1: gy1,
              z1: grooveDepthMm
            })
          );
        }
        if (patX1 - textLayout.plateX1 >= 6.0) {
          featureCutoutBoxes.push(
            normalizeBox({
              x0: textLayout.plateX1,
              y0: gy0,
              z0: -1,
              x1: patX1,
              y1: gy1,
              z1: grooveDepthMm
            })
          );
        }
      } else {
        featureCutoutBoxes.push(
          normalizeBox({
            x0: patX0,
            y0: gy0,
            z0: -1,
            x1: patX1,
            y1: gy1,
            z1: grooveDepthMm
          })
        );
      }
    }
  } else if (options.pattern === 'hex') {
    const rows = Math.max(1, Math.round(options.u_height * 2));
    const cols = Math.max(5, Math.min(10, Math.floor(patW / 24)));
    const pitchX = patW / cols;
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const pitchY = (panelHeightMm - 2 * marginY) / rows;
    const cellW = roundCentis(pitchX * 0.62);
    const cellH = roundCentis(pitchY * 0.6);
    for (let r = 0; r < rows; r++) {
      const cy = marginY + (r + 0.5) * pitchY;
      const shiftX = r % 2 === 1 ? pitchX * 0.16 : -pitchX * 0.16;
      for (let c = 0; c < cols; c++) {
        const cx = patX0 + (c + 0.5) * pitchX + shiftX;
        const x0 = roundCentis(Math.max(patX0, cx - cellW / 2));
        const x1 = roundCentis(Math.min(patX1, cx + cellW / 2));
        const y0 = roundCentis(cy - cellH / 2);
        const y1 = roundCentis(cy + cellH / 2);
        if (x1 - x0 < 3.0 || y1 - y0 < 3.0) continue;
        if (
          textLayout &&
          boxesOverlap2D(
            x0,
            y0,
            x1,
            y1,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1
          )
        ) {
          continue;
        }
        featureCutoutBoxes.push(
          normalizeBox({ x0, y0, z0: -1, x1, y1, z1: grooveDepthMm })
        );
      }
    }
  } else if (options.pattern === 'ribs') {
    const ribCount = Math.max(8, Math.min(14, Math.floor(patW / 16)));
    const pitchX = patW / ribCount;
    const grooveW = roundCentis(Math.max(2.8, pitchX * 0.44));
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    for (let i = 0; i < ribCount; i++) {
      const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
      const gx1 = roundCentis(gx0 + grooveW);
      const gy0 = marginY;
      const gy1 = roundCentis(panelHeightMm - marginY);
      if (
        textLayout &&
        boxesOverlap2D(
          gx0,
          gy0,
          gx1,
          gy1,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1
        )
      ) {
        continue;
      }
      featureCutoutBoxes.push(
        normalizeBox({ x0: gx0, y0: gy0, z0: -1, x1: gx1, y1: gy1, z1: grooveDepthMm })
      );
    }
  } else if (options.pattern === 'vented-slots') {
    const colCount = options.standard === '19inch' ? 3 : 2;
    const bridgeMm = 6.0;
    const slotW = roundCentis((patW - (colCount - 1) * bridgeMm) / colCount);
    const slotH = 2.4;
    const pitchY = 5.6;
    const marginY = 5.2;
    for (let y = marginY; y + slotH <= panelHeightMm - marginY; y += pitchY) {
      const sy0 = roundCentis(y);
      const sy1 = roundCentis(y + slotH);
      for (let col = 0; col < colCount; col++) {
        const sx0 = roundCentis(patX0 + col * (slotW + bridgeMm));
        const sx1 = roundCentis(sx0 + slotW);
        if (
          textLayout &&
          boxesOverlap2D(
            sx0,
            sy0,
            sx1,
            sy1,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1
          )
        ) {
          continue;
        }
        featureCutoutBoxes.push(
          normalizeBox({
            x0: sx0,
            y0: sy0,
            z0: -1,
            x1: sx1,
            y1: sy1,
            z1: faceplateThicknessMm + 1
          })
        );
      }
    }
  }

  if (textLayout) {
    featureCutoutBoxes.push(...textLayout.dotBoxes);
  }

  const allBoxes = [
    faceplateBox,
    bottomStiffenerBox,
    topStiffenerBox,
    ...gussetBoxes,
    ...earHoleBoxes,
    ...featureCutoutBoxes
  ];

  const xs = collectUniqueSortedCoords(
    allBoxes
      .flatMap((b) => [b.x0, b.x1])
      .filter((x) => x >= 0 && x <= panelWidthMm)
  );
  const ys = collectUniqueSortedCoords(
    allBoxes
      .flatMap((b) => [b.y0, b.y1])
      .filter((y) => y >= 0 && y <= panelHeightMm)
  );
  const zs = collectUniqueSortedCoords(
    allBoxes
      .flatMap((b) => [b.z0, b.z1])
      .filter((z) => z >= 0 && z <= totalDepthMm)
  );

  const nx = xs.length - 1;
  const ny = ys.length - 1;
  const nz = zs.length - 1;

  const isCellSolid = (ix: number, iy: number, iz: number): boolean => {
    if (ix < 0 || ix >= nx || iy < 0 || iy >= ny || iz < 0 || iz >= nz) {
      return false;
    }
    const mx = 0.5 * (xs[ix]! + xs[ix + 1]!);
    const my = 0.5 * (ys[iy]! + ys[iy + 1]!);
    const mz = 0.5 * (zs[iz]! + zs[iz + 1]!);

    const inFaceplate =
      isPointInsideBox(mx, my, mz, faceplateBox) &&
      !earHoleBoxes.some((b) => isPointInsideBox(mx, my, mz, b)) &&
      !featureCutoutBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    const inBottomStiffener = isPointInsideBox(mx, my, mz, bottomStiffenerBox);
    const inTopStiffener = isPointInsideBox(mx, my, mz, topStiffenerBox);
    const inGusset = gussetBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    return inFaceplate || inBottomStiffener || inTopStiffener || inGusset;
  };

  const solidGrid: boolean[][][] = [];
  for (let ix = 0; ix < nx; ix++) {
    const ySlice: boolean[][] = [];
    for (let iy = 0; iy < ny; iy++) {
      const zRow: boolean[] = [];
      for (let iz = 0; iz < nz; iz++) {
        zRow.push(isCellSolid(ix, iy, iz));
      }
      ySlice.push(zRow);
    }
    solidGrid.push(ySlice);
  }

  const getSolid = (ix: number, iy: number, iz: number): boolean =>
    solidGrid[ix]?.[iy]?.[iz] ?? false;

  const solidName = `custom_cover_${options.standard}_${String(options.u_height).replaceAll('.', 'p')}u_${options.pattern}`;
  const lines: string[] = [`solid ${solidName}`];

  const emitTri = (
    normX: number,
    normY: number,
    normZ: number,
    v1: readonly [number, number, number],
    v2: readonly [number, number, number],
    v3: readonly [number, number, number]
  ) => {
    lines.push(`  facet normal ${normX} ${normY} ${normZ}`);
    lines.push(`    outer loop`);
    lines.push(`      vertex ${v1[0]} ${v1[1]} ${v1[2]}`);
    lines.push(`      vertex ${v2[0]} ${v2[1]} ${v2[2]}`);
    lines.push(`      vertex ${v3[0]} ${v3[1]} ${v3[2]}`);
    lines.push(`    endloop`);
    lines.push(`  endfacet`);
  };

  for (let ix = 0; ix < nx; ix++) {
    const x0 = xs[ix]!;
    const x1 = xs[ix + 1]!;
    for (let iy = 0; iy < ny; iy++) {
      const y0 = ys[iy]!;
      const y1 = ys[iy + 1]!;
      for (let iz = 0; iz < nz; iz++) {
        if (!getSolid(ix, iy, iz)) continue;
        const z0 = zs[iz]!;
        const z1 = zs[iz + 1]!;

        if (!getSolid(ix, iy, iz - 1)) {
          emitTri(0, 0, -1, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
          emitTri(0, 0, -1, [x0, y0, z0], [x1, y1, z0], [x1, y0, z0]);
        }
        if (!getSolid(ix, iy, iz + 1)) {
          emitTri(0, 0, 1, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1]);
          emitTri(0, 0, 1, [x0, y0, z1], [x1, y1, z1], [x0, y1, z1]);
        }
        if (!getSolid(ix, iy - 1, iz)) {
          emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]);
          emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z1], [x0, y0, z1]);
        }
        if (!getSolid(ix, iy + 1, iz)) {
          emitTri(0, 1, 0, [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]);
          emitTri(0, 1, 0, [x0, y1, z0], [x1, y1, z1], [x1, y1, z0]);
        }
        if (!getSolid(ix - 1, iy, iz)) {
          emitTri(-1, 0, 0, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]);
          emitTri(-1, 0, 0, [x0, y0, z0], [x0, y1, z1], [x0, y1, z0]);
        }
        if (!getSolid(ix + 1, iy, iz)) {
          emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
          emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z1], [x1, y0, z1]);
        }
      }
    }
  }

  lines.push(`endsolid ${solidName}`);
  return lines.join('\n');
}
