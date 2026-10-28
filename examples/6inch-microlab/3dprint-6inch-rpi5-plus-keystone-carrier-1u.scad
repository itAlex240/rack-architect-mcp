// ============================================================================
// RackArchitect MCP — Parametric 3D-Printable Rack Carrier (.scad)
// Blueprint: Printables Community 6-Inch 1U Raspberry Pi 5 + 2x Keystone Micro-Carrier (3dprint-6inch-rpi5-plus-keystone-carrier-1u)
// Standard:  6INCH EIA-310 (152.4mm Total Width, 1U = 44mm)
// Material:  PETG or ASA (25% Gyroid Infill, 4 Perimeters)
// ============================================================================

/* [EIA-310 Rack & Chassis Parameters (mm)] */
panel_width_mm = 152.4;
aperture_width_mm = 120.65;
hole_center_pitch_x_mm = 134.9;
panel_height_mm = 44;
u_count = 1;
faceplate_thickness_mm = 4.2;
tray_depth_mm = 105;
tray_floor_thickness_mm = 3.2;
side_gusset_thickness_mm = 3.5;
print_tolerance_mm = 0.35;
$fn = 36;

module oval_mounting_slot(slot_w = 10.0, slot_h = 6.5, thickness = 10.0) {
  hull() {
    translate([-(slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);
    translate([ (slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);
  }
}

module eia310_ear_holes() {
  left_hole_x = (panel_width_mm - hole_center_pitch_x_mm) / 2;
  right_hole_x = panel_width_mm - left_hole_x;
  for (u = [0 : u_count - 1]) {
    base_y = u * 44.45;
    for (offset_y = [6.35, 22.225, 38.10]) {
      if (base_y + offset_y < panel_height_mm - 3.0) {
        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();
        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();
      }
    }
  }
}

module slot_bay_cutouts() {
  // Slot 'rpi5-bay-1' (sbc-rpi5): 66 x 36 mm at X=18mm, Y=4mm
  translate([18 - print_tolerance_mm, 4 - print_tolerance_mm, -1.0])
    cube([66 + 2 * print_tolerance_mm, 36 + 2 * print_tolerance_mm, faceplate_thickness_mm + 2.0]);
  // Slot 'keystone-1' (standard-keystone): 16.5 x 22 mm at X=90mm, Y=12mm
  translate([90 - print_tolerance_mm, 12 - print_tolerance_mm, -1.0])
    cube([16.5 + 2 * print_tolerance_mm, 22 + 2 * print_tolerance_mm, faceplate_thickness_mm + 2.0]);
  // Slot 'keystone-2' (standard-keystone): 16.5 x 22 mm at X=112mm, Y=12mm
  translate([112 - print_tolerance_mm, 12 - print_tolerance_mm, -1.0])
    cube([16.5 + 2 * print_tolerance_mm, 22 + 2 * print_tolerance_mm, faceplate_thickness_mm + 2.0]);
}

module slot_retention_rails() {
  // Guide rails for 'rpi5-bay-1' (fused to tray floor Y=0..10mm)
  translate([18 - print_tolerance_mm - 2.2, 0, faceplate_thickness_mm])
    cube([2.2, 10, 99]);
  translate([84 + print_tolerance_mm, 0, faceplate_thickness_mm])
    cube([2.2, 10, 99]);
}

module honeycomb_vent_cutouts() {
  tray_x0 = 15.88 + 14;
  tray_x1 = panel_width_mm - 15.88 - 14;
  for (z = [24 : 22 : tray_depth_mm - 18]) {
    for (x = [tray_x0 : 22 : tray_x1]) {
      translate([x, -1.0, z]) rotate([-90, 0, 0]) cylinder(d = 14, h = tray_floor_thickness_mm + 2.0, $fn = 6);
    }
  }
}

module rack_carrier_assembly() {
  tray_x = 15.88;
  tray_w = aperture_width_mm;
  union() {
    // 1. Front EIA-310 Faceplate with Mounting Ears & Sub-Module Bay Cutouts
    difference() {
      cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]);
      eia310_ear_holes();
      slot_bay_cutouts();
    }
    // 2. L-Shaped Rear Support Tray Floor with Hexagonal Ventilation
    difference() {
      translate([tray_x, 0, faceplate_thickness_mm])
        cube([tray_w, tray_floor_thickness_mm, tray_depth_mm - faceplate_thickness_mm]);
      honeycomb_vent_cutouts();
    }
    // 3. Left & Right Structural Side Gussets
    translate([tray_x, 0, faceplate_thickness_mm])
      cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);
    translate([tray_x + tray_w - side_gusset_thickness_mm, 0, faceplate_thickness_mm])
      cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);
    // 4. Internal Sub-Module Guide Rails
    slot_retention_rails();
  }
}

rack_carrier_assembly();