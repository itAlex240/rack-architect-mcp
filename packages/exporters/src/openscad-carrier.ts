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
  const faceplateThicknessMm = 4.2;
  const trayFloorThicknessMm = 3.2;
  const sideGussetThicknessMm = 3.5;
  const printToleranceMm = 0.35;
  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));
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

  const gussetHeightMm = roundCentis(panelHeightMm * 0.65);
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

  // 5. Build exact rectilinear coordinate grid across all features
  const allBoxes = [
    faceplateBox,
    trayFloorBox,
    ...gussetBoxes,
    ...earHoleBoxes,
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
      !slotCutoutBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    const inTrayFloor =
      isPointInsideBox(mx, my, mz, trayFloorBox) &&
      !ventCutoutBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    const inGusset = gussetBoxes.some((b) => isPointInsideBox(mx, my, mz, b));
    const inRail = railBoxes.some((b) => isPointInsideBox(mx, my, mz, b));

    return inFaceplate || inTrayFloor || inGusset || inRail;
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
