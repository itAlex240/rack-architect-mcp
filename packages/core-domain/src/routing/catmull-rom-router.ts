import {
  type BlueprintCatalogMap,
  type ComputedRackGeometry,
  computeRackGeometry,
  resolveCableEndpointPortGeometry,
  roundCentis,
  roundMm,
  vec3,
  vec3Add,
  vec3Distance,
  vec3Scale,
  type Vector3D
} from '../geometry/index.js';
import {
  CABLE_SLACK_MULTIPLIER,
  CABLE_TERMINATION_ALLOWANCE_MM,
  type CableConnection,
  type CableType,
  COMMERCIAL_CABLE_LENGTH_BINS_MM,
  DEFAULT_PLUG_BOOT_EXIT_MM,
  HEX_BUNDLE_CABLE_SPACING_MM,
  MM_PER_U,
  type RackProject
} from '../schemas/index.js';
import { computeAvailablePortalUs } from '../validation/index.js';

export type CableRouteCase =
  | 'direct-vertical-patch'
  | 'same-face-duct'
  | 'cross-face-portal';

export type CableDuctId = 'FL' | 'FR' | 'RL' | 'RR';

export interface ComputedCableRoute {
  readonly cable_id: string;
  readonly cable_type: CableType;
  readonly color_hex: string;
  readonly label: string | undefined;
  readonly route_case: CableRouteCase;
  readonly assigned_ducts: readonly CableDuctId[];
  readonly bundle_index: number;
  readonly bundle_offset_mm: { readonly du: number; readonly dv: number };
  readonly portal_u: number | null;
  readonly waypoints: readonly Vector3D[];
  readonly spline_points: readonly Vector3D[];
  readonly raw_arc_length_mm: number;
  readonly required_length_mm: number;
  readonly recommended_commercial_mm: number;
}

/**
 * Computes a deterministic 2D cross-sectional offset `(du, dv)` in millimeters for cable index `k`
 * in `{0, 1, 2, ...}` using concentric hexagonal rings with spacing `d_cable = 6.5 mm`.
 */
export function computeHexagonalBundleOffset(
  bundleIndex: number,
  spacingMm = HEX_BUNDLE_CABLE_SPACING_MM
): { du: number; dv: number } {
  if (bundleIndex <= 0) {
    return { du: 0, dv: 0 };
  }

  let ring = 1;
  while (1 + 3 * ring * (ring + 1) <= bundleIndex) {
    ring++;
  }

  const ringStartIndex = 1 + 3 * ring * (ring - 1);
  const idxInRing = bundleIndex - ringStartIndex;
  const side = Math.floor(idxInRing / ring);
  const step = idxInRing % ring;

  const angle1 = (side * Math.PI) / 3;
  const angle2 = ((side + 1) * Math.PI) / 3;
  const radius = ring * spacingMm;

  const x1 = radius * Math.cos(angle1);
  const y1 = radius * Math.sin(angle1);
  const x2 = radius * Math.cos(angle2);
  const y2 = radius * Math.sin(angle2);

  const t = step / ring;
  const du = roundMm(x1 + t * (x2 - x1));
  const dv = roundMm(y1 + t * (y2 - y1));

  return { du, dv };
}

/**
 * Evaluates a Centripetal Catmull-Rom Spline (`alpha = 0.5`) through `waypoints`
 * with explicit endpoint clamping (`[P_start, P_start, A_1, ...middleWaypoints, A_2, P_end, P_end]`)
 * so that `splinePoints[0]` is strictly identical to `P_start` and
 * `splinePoints[splinePoints.length - 1]` is strictly identical to `P_end`.
 */
export function evaluateCentripetalCatmullRomSpline(
  waypoints: readonly Vector3D[],
  subdivisionsPerSegment = 32,
  alpha = 0.5
): Vector3D[] {
  if (waypoints.length === 0) {
    return [];
  }
  if (waypoints.length === 1) {
    return [vec3(waypoints[0]!.x, waypoints[0]!.y, waypoints[0]!.z)];
  }

  const uniquePoints: Vector3D[] = [waypoints[0]!];
  for (let i = 1; i < waypoints.length; i++) {
    const prev = uniquePoints[uniquePoints.length - 1]!;
    const curr = waypoints[i]!;
    if (vec3Distance(prev, curr) > 1e-3) {
      uniquePoints.push(curr);
    }
  }

  if (uniquePoints.length === 1) {
    return [vec3(uniquePoints[0]!.x, uniquePoints[0]!.y, uniquePoints[0]!.z)];
  }

  const pStart = uniquePoints[0]!;
  const pEnd = uniquePoints[uniquePoints.length - 1]!;

  // Endpoint Clamping: Duplicate P_start at the beginning and P_end at the end:
  // [P_start, P_start, A_1, ...middleWaypoints, A_2, P_end, P_end]
  const controlPoints: Vector3D[] = [pStart, ...uniquePoints, pEnd];

  const lerpPoint = (a: Vector3D, b: Vector3D, weightB: number): Vector3D => {
    const weightA = 1 - weightB;
    return {
      x: a.x * weightA + b.x * weightB,
      y: a.y * weightA + b.y * weightB,
      z: a.z * weightA + b.z * weightB
    };
  };

  const splinePoints: Vector3D[] = [];
  const numSegments = uniquePoints.length - 1;

  for (let seg = 0; seg < numSegments; seg++) {
    const p0 = controlPoints[seg]!;
    const p1 = controlPoints[seg + 1]!;
    const p2 = controlPoints[seg + 2]!;
    const p3 = controlPoints[seg + 3]!;

    const d01 = Math.max(Math.pow(vec3Distance(p0, p1), alpha), 1e-4);
    const d12 = Math.max(Math.pow(vec3Distance(p1, p2), alpha), 1e-4);
    const d23 = Math.max(Math.pow(vec3Distance(p2, p3), alpha), 1e-4);

    const t0 = 0;
    const t1 = t0 + d01;
    const t2 = t1 + d12;
    const t3 = t2 + d23;

    const startStep = seg === 0 ? 0 : 1;
    for (let step = startStep; step <= subdivisionsPerSegment; step++) {
      const u = step / subdivisionsPerSegment;
      const t = t1 + u * (t2 - t1);

      const a1 = lerpPoint(p0, p1, (t - t0) / (t1 - t0));
      const a2 = lerpPoint(p1, p2, (t - t1) / (t2 - t1));
      const a3 = lerpPoint(p2, p3, (t - t2) / (t3 - t2));

      const b1 = lerpPoint(a1, a2, (t - t0) / (t2 - t0));
      const b2 = lerpPoint(a2, a3, (t - t1) / (t3 - t1));

      const c = lerpPoint(b1, b2, (t - t1) / (t2 - t1));
      splinePoints.push(vec3(c.x, c.y, c.z));
    }
  }

  // Enforce exact 0.0000mm endpoint clamping to P_start and P_end
  if (splinePoints.length > 0) {
    splinePoints[0] = vec3(pStart.x, pStart.y, pStart.z);
    splinePoints[splinePoints.length - 1] = vec3(pEnd.x, pEnd.y, pEnd.z);
  }

  return splinePoints;
}

/**
 * Computes the total Euclidean arc length of a 3D polyline / sampled spline in millimeters.
 */
export function computeSplineArcLengthMm(points: readonly Vector3D[]): number {
  let length = 0;
  for (let i = 1; i < points.length; i++) {
    length += vec3Distance(points[i - 1]!, points[i]!);
  }
  return roundCentis(length);
}

/**
 * Maps a raw spline arc length (`L_arc`) to required cable length (`L_arc * 1.12 + 40mm`)
 * and selects the smallest commercial patch cable bin `>= L_required_mm`.
 */
export function computeCommercialCableLength(arcLengthMm: number): {
  requiredLengthMm: number;
  recommendedCommercialMm: number;
} {
  const requiredLengthMm = roundCentis(
    arcLengthMm * CABLE_SLACK_MULTIPLIER + CABLE_TERMINATION_ALLOWANCE_MM
  );

  for (const bin of COMMERCIAL_CABLE_LENGTH_BINS_MM) {
    if (bin >= requiredLengthMm) {
      return { requiredLengthMm, recommendedCommercialMm: bin };
    }
  }

  const fallbackBin = Math.ceil(requiredLengthMm / 500) * 500;
  return { requiredLengthMm, recommendedCommercialMm: fallbackBin };
}

/**
 * Determines whether a cable is a Power cable (preferring Left Ducts FL/RL)
 * or a Data/Network cable (preferring Right Ducts FR/RR) per ARCHITECTURE.md Section 5.1.
 */
export function isPowerCableType(cableType: string): boolean {
  const lower = cableType.toLowerCase();
  return (
    lower.startsWith('power-') ||
    lower.includes('c13') ||
    lower.includes('c14') ||
    lower.includes('schuko') ||
    lower.includes('dc-5525') ||
    lower.includes('usb-c')
  );
}

/**
 * Routes a single cable in 3D space using the 3-Case Waypoint Resolver, Hexagonal Duct Bundling,
 * and Clamped Centripetal Catmull-Rom Spline interpolation (`[P_start, P_start, A_1, ..., A_2, P_end, P_end]`).
 */
export function routeSingleCable(
  cable: CableConnection,
  _project: RackProject,
  geometry: ComputedRackGeometry,
  availablePortalUs: readonly number[],
  ductOccupancyCounters: Map<string, number>
): ComputedCableRoute | null {
  const fromDev = geometry.devices_by_id.get(cable.from.instance_id);
  const toDev = geometry.devices_by_id.get(cable.to.instance_id);
  if (!fromDev || !toDev) {
    return null;
  }

  const fromParent = fromDev.parent_carrier_id
    ? geometry.devices_by_id.get(fromDev.parent_carrier_id)
    : undefined;
  const toParent = toDev.parent_carrier_id
    ? geometry.devices_by_id.get(toDev.parent_carrier_id)
    : undefined;

  const port1 = resolveCableEndpointPortGeometry(
    fromDev,
    cable.from.port_id,
    cable.from.face,
    fromParent
  );
  const port2 = resolveCableEndpointPortGeometry(
    toDev,
    cable.to.port_id,
    cable.to.face,
    toParent
  );
  if (!port1 || !port2) {
    return null;
  }

  const p1 = port1.world_position;
  const n1 = port1.world_normal;
  const p2 = port2.world_position;
  const n2 = port2.world_normal;

  const a1 = vec3Add(p1, vec3Scale(n1, DEFAULT_PLUG_BOOT_EXIT_MM));
  const a2 = vec3Add(p2, vec3Scale(n2, DEFAULT_PLUG_BOOT_EXIT_MM));

  const isPower = isPowerCableType(cable.cable_type);
  const ductX = isPower ? 28.0 : geometry.panel_width_mm - 28.0;
  const frontDuctZ = -18.0;
  const rearDuctZ = Math.max(
    geometry.rail_depth_mm - 12.0,
    port1.world_face === 'rear' ? p1.z + 12.0 : 0,
    port2.world_face === 'rear' ? p2.z + 12.0 : 0
  );

  const sameFace = port1.world_face === port2.world_face;
  const dy = Math.abs(p1.y - p2.y);
  const dx = Math.abs(p1.x - p2.x);
  const isAdjacentTopLevelFrontPatch =
    sameFace &&
    port1.world_face === 'front' &&
    Math.abs(fromDev.u_position - toDev.u_position) === 1 &&
    fromDev.parent_carrier_id === null &&
    toDev.parent_carrier_id === null;

  // Case A: Short Patch Bridge between adjacent U rows (`|Y1 - Y2| <= 95mm`)
  if (sameFace && dy <= 95.0 && (dx <= 50.0 || isAdjacentTopLevelFrontPatch)) {
    const patchKey = `PATCH:${port1.world_face}:${Math.min(fromDev.u_position, toDev.u_position)}`;
    const bundleIdx = ductOccupancyCounters.get(patchKey) ?? 0;
    ductOccupancyCounters.set(patchKey, bundleIdx + 1);
    const offset = computeHexagonalBundleOffset(bundleIdx);

    let waypoints: Vector3D[];
    if (dx <= 35.0) {
      // Subcase A1: Almost vertically aligned (`|X1 - X2| <= 35mm`) -> Clean direct vertical arch (`Z_peak = -22mm` on front)
      const zPeak =
        port1.world_face === 'front'
          ? -22.0 - Math.min(bundleIdx, 4) * 1.5
          : Math.max(a1.z, a2.z) + 12.0 + Math.min(bundleIdx, 4) * 1.5;
      const midA = vec3(
        (a1.x + a2.x) / 2 + offset.du * 0.35,
        (a1.y + a2.y) / 2,
        zPeak
      );
      waypoints = [p1, a1, midA, a2, p2];
    } else {
      // Subcase A2: Horizontally offset on adjacent U -> Dedicated horizontal micro-track along the U boundary
      const lowerU = Math.min(fromDev.u_position, toDev.u_position);
      const yBoundary = roundMm(lowerU * MM_PER_U + (bundleIdx - 2) * 3.5);
      const zChannel =
        port1.world_face === 'front'
          ? -20.0 - Math.min(bundleIdx, 6) * 1.2
          : Math.max(a1.z, a2.z) + 10.0 + Math.min(bundleIdx, 6) * 1.2;
      const c1 = vec3(p1.x, yBoundary, zChannel);
      const c2 = vec3(p2.x, yBoundary, zChannel);
      waypoints = [p1, a1, c1, c2, a2, p2];
    }

    const clampedInput: Vector3D[] = [
      p1,
      p1,
      ...waypoints.slice(1, -1),
      p2,
      p2
    ];
    const splinePoints = evaluateCentripetalCatmullRomSpline(clampedInput, 32);
    const arcLength = computeSplineArcLengthMm(splinePoints);
    const { requiredLengthMm, recommendedCommercialMm } =
      computeCommercialCableLength(arcLength);

    return {
      cable_id: cable.cable_id,
      cable_type: cable.cable_type,
      color_hex: cable.color_hex,
      label: cable.label,
      route_case: 'direct-vertical-patch',
      assigned_ducts: [],
      bundle_index: bundleIdx,
      bundle_offset_mm: offset,
      portal_u: null,
      waypoints,
      spline_points: splinePoints,
      raw_arc_length_mm: arcLength,
      required_length_mm: requiredLengthMm,
      recommended_commercial_mm: recommendedCommercialMm
    };
  }

  // Case B: Same-Face Duct Route (Front->Front stays Z <= 0; Rear->Rear stays Z > 0 in rear channel)
  if (sameFace) {
    const ductId: CableDuctId =
      port1.world_face === 'front'
        ? isPower
          ? 'FL'
          : 'FR'
        : isPower
          ? 'RL'
          : 'RR';

    const bundleIdx = ductOccupancyCounters.get(ductId) ?? 0;
    ductOccupancyCounters.set(ductId, bundleIdx + 1);
    const offset = computeHexagonalBundleOffset(bundleIdx);

    const baseDuctZ = port1.world_face === 'front' ? frontDuctZ : rearDuctZ;
    const safeDuctZ =
      port1.world_face === 'front'
        ? Math.min(-6.0, baseDuctZ + offset.dv * 0.5)
        : Math.max(Math.min(p1.z, p2.z) + 6.0, baseDuctZ + offset.dv * 0.5);

    const d1 = vec3(ductX + offset.du, p1.y, safeDuctZ);
    const d2 = vec3(ductX + offset.du, p2.y, safeDuctZ);

    const waypoints: Vector3D[] = [p1, a1, d1, d2, a2, p2];
    const clampedInput: Vector3D[] = [p1, p1, a1, d1, d2, a2, p2, p2];
    const splinePoints = evaluateCentripetalCatmullRomSpline(clampedInput, 32);
    const arcLength = computeSplineArcLengthMm(splinePoints);
    const { requiredLengthMm, recommendedCommercialMm } =
      computeCommercialCableLength(arcLength);

    return {
      cable_id: cable.cable_id,
      cable_type: cable.cable_type,
      color_hex: cable.color_hex,
      label: cable.label,
      route_case: 'same-face-duct',
      assigned_ducts: [ductId],
      bundle_index: bundleIdx,
      bundle_offset_mm: offset,
      portal_u: null,
      waypoints,
      spline_points: splinePoints,
      raw_arc_length_mm: arcLength,
      required_length_mm: requiredLengthMm,
      recommended_commercial_mm: recommendedCommercialMm
    };
  }

  // Case C: Cross-Face Portal Route (front <-> rear via Brush-Panel / Portal U)
  // Runs cleanly in side duct to Portal U, passes straight along Z at X = ductX (28mm or W_panel - 28mm)
  // through the brush panel without cutting diagonally through middle equipment!
  const frontDuctId: CableDuctId = isPower ? 'FL' : 'FR';
  const rearDuctId: CableDuctId = isPower ? 'RL' : 'RR';
  const startDuctId = port1.world_face === 'front' ? frontDuctId : rearDuctId;
  const endDuctId = port2.world_face === 'front' ? frontDuctId : rearDuctId;

  const crossKey = `${startDuctId}->${endDuctId}`;
  const bundleIdx = ductOccupancyCounters.get(crossKey) ?? 0;
  ductOccupancyCounters.set(crossKey, bundleIdx + 1);
  const offset = computeHexagonalBundleOffset(bundleIdx);

  // Prefer brush-panel U if mounted, otherwise nearest available portal U
  const brushPanelDevs = geometry.devices.filter(
    (d) =>
      d.blueprint.category === 'brush-panel' ||
      d.blueprint.geometry.has_cable_pass_through === true
  );
  const targetMeanU = (fromDev.u_position + toDev.u_position) / 2;
  let chosenPortalU: number;

  if (
    cable.preferred_portal_u !== undefined &&
    availablePortalUs.includes(cable.preferred_portal_u)
  ) {
    chosenPortalU = cable.preferred_portal_u;
  } else if (brushPanelDevs.length > 0) {
    chosenPortalU = brushPanelDevs.reduce((best, cand) =>
      Math.abs(cand.u_position - targetMeanU) <
      Math.abs(best.u_position - targetMeanU)
        ? cand
        : best
    ).u_position;
  } else if (availablePortalUs.length > 0) {
    chosenPortalU = availablePortalUs.reduce((best, cand) =>
      Math.abs(cand - targetMeanU) < Math.abs(best - targetMeanU) ? cand : best
    );
  } else {
    chosenPortalU =
      cable.preferred_portal_u ?? Math.max(1, Math.round(targetMeanU));
  }

  const yPortal = roundMm((chosenPortalU - 0.5) * MM_PER_U + offset.dv * 0.5);
  const startDuctZ =
    port1.world_face === 'front'
      ? frontDuctZ
      : Math.max(geometry.rail_depth_mm - 15.0, p1.z + 10.0);
  const endDuctZ =
    port2.world_face === 'front'
      ? frontDuctZ
      : Math.max(geometry.rail_depth_mm - 15.0, p2.z + 10.0);

  const portalX = roundMm(ductX + offset.du * 0.5);
  const dStartEntry = vec3(portalX, p1.y, startDuctZ);
  const dPortalStart = vec3(portalX, yPortal, startDuctZ);
  const dPortalEnd = vec3(portalX, yPortal, endDuctZ);
  const dEndExit = vec3(portalX, p2.y, endDuctZ);

  const waypoints: Vector3D[] = [
    p1,
    a1,
    dStartEntry,
    dPortalStart,
    dPortalEnd,
    dEndExit,
    a2,
    p2
  ];
  const clampedInput: Vector3D[] = [
    p1,
    p1,
    a1,
    dStartEntry,
    dPortalStart,
    dPortalEnd,
    dEndExit,
    a2,
    p2,
    p2
  ];

  const splinePoints = evaluateCentripetalCatmullRomSpline(clampedInput, 32);
  const arcLength = computeSplineArcLengthMm(splinePoints);
  const { requiredLengthMm, recommendedCommercialMm } =
    computeCommercialCableLength(arcLength);

  return {
    cable_id: cable.cable_id,
    cable_type: cable.cable_type,
    color_hex: cable.color_hex,
    label: cable.label,
    route_case: 'cross-face-portal',
    assigned_ducts: [startDuctId, endDuctId],
    bundle_index: bundleIdx,
    bundle_offset_mm: offset,
    portal_u: chosenPortalU,
    waypoints,
    spline_points: splinePoints,
    raw_arc_length_mm: arcLength,
    required_length_mm: requiredLengthMm,
    recommended_commercial_mm: recommendedCommercialMm
  };
}

/**
 * Routes all cables in a `RackProject` deterministically.
 */
export function routeProjectCables(
  project: RackProject,
  catalog: BlueprintCatalogMap,
  precomputedGeometry?: ComputedRackGeometry
): ComputedCableRoute[] {
  const geometry = precomputedGeometry ?? computeRackGeometry(project, catalog);
  const availablePortalUs = computeAvailablePortalUs(project, geometry);
  const ductOccupancyCounters = new Map<string, number>();

  const routes: ComputedCableRoute[] = [];
  for (const cable of project.cables) {
    const route = routeSingleCable(
      cable,
      project,
      geometry,
      availablePortalUs,
      ductOccupancyCounters
    );
    if (route) {
      routes.push(route);
    }
  }

  return routes;
}
