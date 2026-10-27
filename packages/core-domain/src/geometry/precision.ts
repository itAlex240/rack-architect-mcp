/**
 * Deterministic floating-point precision helpers for spatial, electrical, and mechanical calculations.
 * Prevents IEEE-754 drift (e.g., 0.1 + 0.2 = 0.30000000000000004) across all domain engines.
 */

/** Minimum overlap threshold in millimeters for two AABBs to be considered colliding (1 micrometer) */
export const AABB_INTERSECTION_EPSILON_MM = 1e-3;

/** Rounds a spatial coordinate or distance to 0.0001 mm (0.1 micrometer) precision */
export function roundMm(value: number): number {
  return Math.round((value + Number.EPSILON) * 1e4) / 1e4;
}

/** Rounds a measurement (such as arc length or wattage) to 0.01 precision */
export function roundCentis(value: number): number {
  return Math.round((value + Number.EPSILON) * 1e2) / 1e2;
}

/** Rounds a diagnostic display metric (such as overlap depth in mm) to 0.1 precision */
export function roundTenths(value: number): number {
  return Math.round((value + Number.EPSILON) * 1e1) / 1e1;
}
