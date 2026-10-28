// ============================================================================
// RackArchitect MCP — Parametric 3D-Printable Slot Cover Panel (.scad)
// Blueprint: Community 3D-Print 10-Inch 1U Designer Cover Panel (Hexagonal Honeycomb Relief) (3dprint-10inch-cover-panel-hex-1u)
// Standard:  10INCH EIA-310 (254mm Total Width, 1U = 44mm)
// Pattern:   HEX (Closed Front Faceplate — Zero Cable Pass-Through)
// Material:  PETG / PLA
// ============================================================================

/* [EIA-310 Cover Panel Parameters (mm)] */
panel_width_mm = 254;
aperture_width_mm = 222.25;
hole_center_pitch_x_mm = 236.5;
panel_height_mm = 44;
u_count = 1;
faceplate_thickness_mm = 4.2;
stiffener_depth_mm = 8;
stiffener_wall_mm = 3.2;
pattern_groove_depth_mm = 1.4;
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

module front_surface_pattern_grooves() {
  // Blind hexagonal honeycomb relief cells (2x10, closed 2.8mm rear baffle wall)
  translate([30.94, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([51.16, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([71.4, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([91.63, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([111.85, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([132.09, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([152.32, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([172.55, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([192.78, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([213.01, 14, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([41.06, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([61.29, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([81.52, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([101.75, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([121.98, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([142.21, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([162.44, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([182.67, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([202.9, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
  translate([223.13, 30, -0.5]) cylinder(d = 10.88, h = pattern_groove_depth_mm + 0.5, $fn = 6);
}

module slot_bay_cutouts() {
  // Closed blanking cover panel (zero through-holes; front relief grooves only)
  front_surface_pattern_grooves();
}

module rear_perimeter_stiffener_frame() {
  flange_h = stiffener_depth_mm - faceplate_thickness_mm;
  if (flange_h > 0.5) {
    // Bottom & Top horizontal stiffening ribs
    translate([15.88, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, flange_h]);
    translate([15.88, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, flange_h]);
    // Left & Right vertical stiffening ribs
    translate([15.88, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, flange_h]);
    translate([15.88 + aperture_width_mm - stiffener_wall_mm, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, flange_h]);
  }
}

module rack_carrier_assembly() {
  union() {
    difference() {
      cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]);
      eia310_ear_holes();
      slot_bay_cutouts();
    }
    rear_perimeter_stiffener_frame();
  }
}

rack_carrier_assembly();