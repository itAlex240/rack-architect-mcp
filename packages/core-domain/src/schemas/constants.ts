/**
 * Physical & Mechanical Engineering Constants for RackArchitect MCP
 * All internal geometry is in millimeters (mm).
 */

/** Standard EIA-310 height of 1 Rack Unit (1U / 1HE) in millimeters */
export const MM_PER_U = 44.45;

/** Vertical hole pitch offsets within 1U (44.45 mm) relative to Y_min(u) */
export const U_HOLE_OFFSETS_MM = [6.35, 22.225, 38.1] as const;

export type RackStandardSlug = '19inch' | '10inch' | '6inch';

export interface Eia310Specification {
  readonly standard: RackStandardSlug;
  /** Total faceplate panel width (W_panel) in mm */
  readonly panel_width_mm: number;
  /** Inner opening between vertical mounting rails (W_aperture) in mm */
  readonly aperture_width_mm: number;
  /** Horizontal center-to-center distance between left and right mounting holes (W_holes) in mm */
  readonly hole_center_to_center_mm: number;
  /** Distance from left edge of panel (X=0) to inner edge of left rail opening (X_aperture_min) in mm */
  readonly left_aperture_offset_mm: number;
  /** Distance from left edge of panel (X=0) to center of left mounting hole (X_hole_left) in mm */
  readonly left_hole_center_x_mm: number;
  /** Alias matching ARCHITECTURE.md Section 2.2 notation */
  readonly W_panel: number;
  /** Alias matching ARCHITECTURE.md Section 2.2 notation */
  readonly W_aperture: number;
  /** Alias matching ARCHITECTURE.md Section 2.2 notation */
  readonly W_holes: number;
  /** Alias matching ARCHITECTURE.md Section 2.2 notation */
  readonly X_aperture_min: number;
  /** Alias matching ARCHITECTURE.md Section 2.2 notation */
  readonly X_hole_left: number;
}

export const EIA_310_19_INCH_SPEC: Eia310Specification = {
  standard: '19inch',
  panel_width_mm: 482.6,
  aperture_width_mm: 450.85,
  hole_center_to_center_mm: 465.1,
  left_aperture_offset_mm: 15.875,
  left_hole_center_x_mm: 8.75,
  W_panel: 482.6,
  W_aperture: 450.85,
  W_holes: 465.1,
  X_aperture_min: 15.875,
  X_hole_left: 8.75
} as const;

export const EIA_310_10_INCH_SPEC: Eia310Specification = {
  standard: '10inch',
  panel_width_mm: 254.0,
  aperture_width_mm: 222.25,
  hole_center_to_center_mm: 236.5,
  left_aperture_offset_mm: 15.875,
  left_hole_center_x_mm: 8.75,
  W_panel: 254.0,
  W_aperture: 222.25,
  W_holes: 236.5,
  X_aperture_min: 15.875,
  X_hole_left: 8.75
} as const;

export const EIA_310_6_INCH_SPEC: Eia310Specification = {
  standard: '6inch',
  panel_width_mm: 152.4,
  aperture_width_mm: 120.65,
  hole_center_to_center_mm: 134.9,
  left_aperture_offset_mm: 15.875,
  left_hole_center_x_mm: 8.75,
  W_panel: 152.4,
  W_aperture: 120.65,
  W_holes: 134.9,
  X_aperture_min: 15.875,
  X_hole_left: 8.75
} as const;

export const EIA_310_SPECS: Record<RackStandardSlug, Eia310Specification> = {
  '19inch': EIA_310_19_INCH_SPEC,
  '10inch': EIA_310_10_INCH_SPEC,
  '6inch': EIA_310_6_INCH_SPEC
} as const;

export type ConnectorType =
  | 'rj45'
  | 'rj45-serial-console'
  | 'sfp-plus'
  | 'iec-c13'
  | 'iec-c14'
  | 'schuko-cee7'
  | 'dc-5525'
  | 'usb-c'
  | 'usb-a'
  | 'audio-35mm';

export interface PlugClearanceSpec {
  readonly straight_mm: number;
  readonly angled_mm: number | null;
}

/**
 * Plug & Bend-Radius Clearance Table (delta_Z_plug in mm) per ARCHITECTURE.md Section 4 (Stage 1)
 */
export const DELTA_Z_PLUG_MM: Record<ConnectorType, PlugClearanceSpec> = {
  'rj45': { straight_mm: 35, angled_mm: 20 },
  'rj45-serial-console': { straight_mm: 35, angled_mm: 20 },
  'sfp-plus': { straight_mm: 48, angled_mm: null },
  'iec-c13': { straight_mm: 55, angled_mm: 30 },
  'iec-c14': { straight_mm: 55, angled_mm: 30 },
  'schuko-cee7': { straight_mm: 65, angled_mm: 38 },
  'dc-5525': { straight_mm: 32, angled_mm: 18 },
  'usb-c': { straight_mm: 32, angled_mm: 18 },
  'usb-a': { straight_mm: 32, angled_mm: 18 },
  'audio-35mm': { straight_mm: 28, angled_mm: 15 }
} as const;

/** Half-width and half-height (mm) around a port center for plug clearance bounding box */
export const PLUG_FOOTPRINT_HALF_SIZE_MM = 8.0;

/** Determine whether a cable_type string represents an angled connector variant */
export function isAngledCableType(cableType: string): boolean {
  return cableType.toLowerCase().includes('angled');
}

/**
 * Returns the required plug clearance depth (delta_Z_plug in mm) for a given port connector and cable type.
 */
export function getPlugClearanceMm(
  connectorType: ConnectorType,
  cableType?: string
): number {
  const spec = DELTA_Z_PLUG_MM[connectorType];
  if (cableType && isAngledCableType(cableType) && spec.angled_mm !== null) {
    return spec.angled_mm;
  }
  return spec.straight_mm;
}

/** Standard PoE per-port maximum wattage by IEEE 802.3 class */
export const POE_CLASS_WATTS = {
  af: 15.4,
  at: 30.0,
  'bt-type3': 60.0,
  'bt-type4': 90.0
} as const;

export type PoeClass = keyof typeof POE_CLASS_WATTS;

/** Standard commercial patch cable length bins in millimeters */
export const COMMERCIAL_CABLE_LENGTH_BINS_MM = [
  150, 250, 300, 500, 750, 1000, 1500, 2000, 3000
] as const;

/** Cable routing slack multiplier (12% reserve) */
export const CABLE_SLACK_MULTIPLIER = 1.12;

/** Cable connector termination allowance in mm (+40mm) */
export const CABLE_TERMINATION_ALLOWANCE_MM = 40;

/** Spacing between adjacent bundled cables in hexagonal duct packing (mm) */
export const HEX_BUNDLE_CABLE_SPACING_MM = 6.5;

/** Default rigid plug boot exit offset along port normal before bending (mm) */
export const DEFAULT_PLUG_BOOT_EXIT_MM = 10.0;
