// ============================================================================
// RackArchitect MCP — Parametric 3D-Printable Slot Cover Panel (.scad)
// Blueprint: Community 3D-Print 10-Inch 2U Designer Cover Panel (Horizontal Precision Lines) (3dprint-10inch-cover-panel-lines-2u)
// Standard:  10INCH EIA-310 (254mm Total Width, 2U = 88.1mm)
// Pattern:   LINES (Closed Front Faceplate — Zero Cable Pass-Through)
// Material:  PETG / PLA
// ============================================================================

/* [EIA-310 Cover Panel Parameters (mm)] */
panel_width_mm = 254;
aperture_width_mm = 222.25;
hole_center_pitch_x_mm = 236.5;
panel_height_mm = 88.1;
u_count = 2;
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
  // Horizontal precision decorative grooves (6 lines, blind depth = 1.4mm)
  translate([25.88, 6.8, -0.5]) cube([202.25, 2.4, pattern_groove_depth_mm + 0.5]);
  translate([25.88, 21.22, -0.5]) cube([202.25, 2.4, pattern_groove_depth_mm + 0.5]);
  translate([25.88, 35.64, -0.5]) cube([202.25, 2.4, pattern_groove_depth_mm + 0.5]);
  translate([25.88, 50.06, -0.5]) cube([202.25, 2.4, pattern_groove_depth_mm + 0.5]);
  translate([25.88, 64.48, -0.5]) cube([202.25, 2.4, pattern_groove_depth_mm + 0.5]);
  translate([25.88, 78.9, -0.5]) cube([202.25, 2.4, pattern_groove_depth_mm + 0.5]);
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