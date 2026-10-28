import {
  type BlueprintCatalogMap,
  type ComputedDeviceGeometry,
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
 * Evaluates a corner-filleted, convex-hull-bounded 3D spline through `waypoints`
 * with exact endpoint clamping (`splinePoints[0] === P_start`, `splinePoints[last] === P_end`)
 * and De Casteljau quadratic Bezier inner corner fillets so orthogonal duct runs
 * have 0.0000mm outward corner overshoot and zero S-wave oscillation.
 */
export function evaluateCentripetalCatmullRomSpline(
  waypoints: readonly Vector3D[],
  subdivisionsPerSegment = 32,
  _alpha = 0.5
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
  const numSegments = uniquePoints.length - 1;

  const lerpPoint = (a: Vector3D, b: Vector3D, weightB: number): Vector3D => {
    const weightA = 1 - weightB;
    return {
      x: a.x * weightA + b.x * weightB,
      y: a.y * weightA + b.y * weightB,
      z: a.z * weightA + b.z * weightB
    };
  };

  const evalQuadBezier = (
    p0: Vector3D,
    p1: Vector3D,
    p2: Vector3D,
    t: number
  ): Vector3D => {
    const inv = 1 - t;
    const c0 = inv * inv;
    const c1 = 2 * inv * t;
    const c2 = t * t;
    return {
      x: c0 * p0.x + c1 * p1.x + c2 * p2.x,
      y: c0 * p0.y + c1 * p1.y + c2 * p2.y,
      z: c0 * p0.z + c1 * p1.z + c2 * p2.z
    };
  };

  interface CornerFilletGeometry {
    readonly radiusMm: number;
    readonly sIn: Vector3D;
    readonly cIn: Vector3D;
    readonly apex: Vector3D;
    readonly cOut: Vector3D;
    readonly sOut: Vector3D;
  }

  const corners: CornerFilletGeometry[] = uniquePoints.map((w, idx) => {
    if (idx === 0 || idx === numSegments) {
      return {
        radiusMm: 0,
        sIn: w,
        cIn: w,
        apex: w,
        cOut: w,
        sOut: w
      };
    }

    const prev = uniquePoints[idx - 1]!;
    const next = uniquePoints[idx + 1]!;
    const lenIn = vec3Distance(prev, w);
    const lenOut = vec3Distance(w, next);

    if (lenIn <= 1e-3 || lenOut <= 1e-3) {
      return {
        radiusMm: 0,
        sIn: w,
        cIn: w,
        apex: w,
        cOut: w,
        sOut: w
      };
    }

    const uIn = {
      x: (w.x - prev.x) / lenIn,
      y: (w.y - prev.y) / lenIn,
      z: (w.z - prev.z) / lenIn
    };
    const uOut = {
      x: (next.x - w.x) / lenOut,
      y: (next.y - w.y) / lenOut,
      z: (next.z - w.z) / lenOut
    };

    const isBootCorner = idx === 1 || idx === numSegments - 1;
    const maxRadius = isBootCorner ? 4.5 : 10.0;
    const maxFraction = isBootCorner ? 0.35 : 0.4;
    const radiusMm = Math.min(maxRadius, lenIn * maxFraction, lenOut * maxFraction);

    const sIn = {
      x: w.x - uIn.x * radiusMm,
      y: w.y - uIn.y * radiusMm,
      z: w.z - uIn.z * radiusMm
    };
    const sOut = {
      x: w.x + uOut.x * radiusMm,
      y: w.y + uOut.y * radiusMm,
      z: w.z + uOut.z * radiusMm
    };
    const cIn = lerpPoint(sIn, w, 0.5);
    const cOut = lerpPoint(w, sOut, 0.5);
    const apex = lerpPoint(cIn, cOut, 0.5);

    return {
      radiusMm,
      sIn,
      cIn,
      apex,
      cOut,
      sOut
    };
  });

  const splinePoints: Vector3D[] = [];

  for (let seg = 0; seg < numSegments; seg++) {
    const startCorner = corners[seg]!;
    const endCorner = corners[seg + 1]!;

    const hasStartFillet = startCorner.radiusMm > 1e-3;
    const hasEndFillet = endCorner.radiusMm > 1e-3;

    const u1 = hasStartFillet ? 0.28 : 0.0;
    const u2 = hasEndFillet ? 0.72 : 1.0;

    const startStep = seg === 0 ? 0 : 1;
    for (let step = startStep; step <= subdivisionsPerSegment; step++) {
      const u = step / subdivisionsPerSegment;
      let pt: Vector3D;

      if (hasStartFillet && u < u1) {
        const tau = u / u1;
        pt = evalQuadBezier(
          startCorner.apex,
          startCorner.cOut,
          startCorner.sOut,
          tau
        );
      } else if (hasEndFillet && u > u2) {
        const tau = (u - u2) / (1.0 - u2);
        pt = evalQuadBezier(
          endCorner.sIn,
          endCorner.cIn,
          endCorner.apex,
          tau
        );
      } else {
        const spanU = Math.max(1e-6, u2 - u1);
        const tau = (u - u1) / spanU;
        pt = lerpPoint(startCorner.sOut, endCorner.sIn, tau);
      }

      splinePoints.push(vec3(pt.x, pt.y, pt.z));
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
 * Computes the exact 3D Euclidean distance between two finite line segments `[p1, q1]` and `[p2, q2]`.
 */
function segmentToSegmentDistance3D(
  p1: Vector3D,
  q1: Vector3D,
  p2: Vector3D,
  q2: Vector3D
): number {
  const d1x = q1.x - p1.x;
  const d1y = q1.y - p1.y;
  const d1z = q1.z - p1.z;
  const d2x = q2.x - p2.x;
  const d2y = q2.y - p2.y;
  const d2z = q2.z - p2.z;
  const rx = p1.x - p2.x;
  const ry = p1.y - p2.y;
  const rz = p1.z - p2.z;

  const a = d1x * d1x + d1y * d1y + d1z * d1z;
  const e = d2x * d2x + d2y * d2y + d2z * d2z;
  const f = d2x * rx + d2y * ry + d2z * rz;

  let s = 0;
  let t = 0;

  if (a <= 1e-6 && e <= 1e-6) {
    return Math.hypot(rx, ry, rz);
  }
  if (a <= 1e-6) {
    t = Math.max(0, Math.min(1, f / e));
  } else {
    const c = d1x * rx + d1y * ry + d1z * rz;
    if (e <= 1e-6) {
      s = Math.max(0, Math.min(1, -c / a));
    } else {
      const b = d1x * d2x + d1y * d2y + d1z * d2z;
      const denom = a * e - b * b;
      if (denom !== 0) {
        s = Math.max(0, Math.min(1, (b * f - c * e) / denom));
      }
      t = (b * s + f) / e;
      if (t < 0) {
        t = 0;
        s = Math.max(0, Math.min(1, -c / a));
      } else if (t > 1) {
        t = 1;
        s = Math.max(0, Math.min(1, (b - c) / a));
      }
    }
  }

  return Math.hypot(
    rx + d1x * s - d2x * t,
    ry + d1y * s - d2y * t,
    rz + d1z * s - d2z * t
  );
}

/**
 * Computes the minimum 3D centerline-to-centerline distance between a candidate spline
 * and all previously routed cable splines.
 */
export function computeMinSplineClearanceMm(
  candidateSpline: readonly Vector3D[],
  existingRoutes: readonly ComputedCableRoute[],
  earlyExitThresholdMm = 6.2
): number {
  if (existingRoutes.length === 0 || candidateSpline.length < 2) {
    return Number.POSITIVE_INFINITY;
  }

  let cMinX = Number.POSITIVE_INFINITY;
  let cMaxX = Number.NEGATIVE_INFINITY;
  let cMinY = Number.POSITIVE_INFINITY;
  let cMaxY = Number.NEGATIVE_INFINITY;
  let cMinZ = Number.POSITIVE_INFINITY;
  let cMaxZ = Number.NEGATIVE_INFINITY;

  for (const pt of candidateSpline) {
    if (pt.x < cMinX) cMinX = pt.x;
    if (pt.x > cMaxX) cMaxX = pt.x;
    if (pt.y < cMinY) cMinY = pt.y;
    if (pt.y > cMaxY) cMaxY = pt.y;
    if (pt.z < cMinZ) cMinZ = pt.z;
    if (pt.z > cMaxZ) cMaxZ = pt.z;
  }

  let minClearance = Number.POSITIVE_INFINITY;
  const stride = 2;

  for (const otherRoute of existingRoutes) {
    const otherPts = otherRoute.spline_points;
    if (otherPts.length < 2) continue;

    let oMinX = Number.POSITIVE_INFINITY;
    let oMaxX = Number.NEGATIVE_INFINITY;
    let oMinY = Number.POSITIVE_INFINITY;
    let oMaxY = Number.NEGATIVE_INFINITY;
    let oMinZ = Number.POSITIVE_INFINITY;
    let oMaxZ = Number.NEGATIVE_INFINITY;

    for (const pt of otherPts) {
      if (pt.x < oMinX) oMinX = pt.x;
      if (pt.x > oMaxX) oMaxX = pt.x;
      if (pt.y < oMinY) oMinY = pt.y;
      if (pt.y > oMaxY) oMaxY = pt.y;
      if (pt.z < oMinZ) oMinZ = pt.z;
      if (pt.z > oMaxZ) oMaxZ = pt.z;
    }

    if (
      cMaxX + minClearance < oMinX ||
      oMaxX + minClearance < cMinX ||
      cMaxY + minClearance < oMinY ||
      oMaxY + minClearance < cMinY ||
      cMaxZ + minClearance < oMinZ ||
      oMaxZ + minClearance < cMinZ
    ) {
      continue;
    }

    for (let i = 0; i < candidateSpline.length - 1; i += stride) {
      const p1 = candidateSpline[i]!;
      const q1 =
        candidateSpline[Math.min(i + stride, candidateSpline.length - 1)]!;

      for (let j = 0; j < otherPts.length - 1; j += stride) {
        const p2 = otherPts[j]!;
        const q2 = otherPts[Math.min(j + stride, otherPts.length - 1)]!;

        const d = segmentToSegmentDistance3D(p1, q1, p2, q2);
        if (d < minClearance) {
          minClearance = d;
          if (minClearance < earlyExitThresholdMm * 0.45) {
            return minClearance;
          }
        }
      }
    }
  }

  return minClearance;
}

/**
 * Checks whether stepping vertically from `portPos` to `yRunner` on `portFace`
 * passes across another port on the same face at the same X column (e.g. a 2-row switch
 * or 2U UPS), and shifts the vertical riser X into the inter-column gap (`±7.8 mm`) when needed.
 */
function computePortRiserX(
  geometry: ComputedRackGeometry,
  portPos: Vector3D,
  portFace: 'front' | 'rear',
  yRunner: number,
  preferredDirection = 1
): number {
  const minY = Math.min(portPos.y, yRunner) - 3.2;
  const maxY = Math.max(portPos.y, yRunner) + 3.2;

  const hasVerticalPortObstruction = (candX: number): boolean => {
    for (const dev of geometry.devices) {
      for (const p of dev.ports) {
        if (p.world_face !== portFace) continue;
        if (
          Math.abs(p.world_position.x - portPos.x) < 0.5 &&
          Math.abs(p.world_position.y - portPos.y) < 0.5
        ) {
          continue;
        }
        if (
          Math.abs(p.world_position.x - candX) < 6.8 &&
          p.world_position.y >= minY &&
          p.world_position.y <= maxY
        ) {
          return true;
        }
      }
    }
    return false;
  };

  if (!hasVerticalPortObstruction(portPos.x)) {
    return portPos.x;
  }

  const railWidth = (geometry.panel_width_mm - geometry.aperture_width_mm) / 2;
  const minClearX = roundMm(railWidth + 5.5);
  const maxClearX = roundMm(geometry.panel_width_mm - railWidth - 5.5);
  const clampRiserX = (x: number): number =>
    roundMm(Math.max(minClearX, Math.min(maxClearX, x)));

  const dir = preferredDirection >= 0 ? 1 : -1;
  const cand1 = clampRiserX(portPos.x + dir * 7.8);
  if (!hasVerticalPortObstruction(cand1)) {
    return cand1;
  }
  const cand2 = clampRiserX(portPos.x - dir * 7.8);
  if (!hasVerticalPortObstruction(cand2)) {
    return cand2;
  }
  return cand1;
}

/**
 * Computes a safe U-boundary horizontal cable runner Y coordinate so cables
 * exit their port vertically into a horizontal comb track instead of
 * crossing horizontally in front of neighboring sockets on the same device.
 */
function computeDeviceHorizontalRunnerY(
  dev: ComputedDeviceGeometry,
  portY: number,
  targetY: number,
  trackSlotIndex: number,
  totalHeightMm: number,
  face: 'front' | 'rear' = 'front'
): number {
  const uBottom = (dev.u_range[0] - 1) * MM_PER_U;
  const uTop = dev.u_range[1] * MM_PER_U;

  if (face === 'rear') {
    const isMultiU = dev.u_range[1] - dev.u_range[0] >= 1;
    if (isMultiU) {
      const isLowerRow = portY - uBottom < 38.0;
      const multiUTracks = isLowerRow
        ? [uBottom + 8.0, uBottom + 15.5, uBottom + 41.5, uTop - 5.5]
        : [uTop - 5.5, uTop - 13.0, uBottom + 42.5, uBottom + 8.0];
      const chosen = multiUTracks[trackSlotIndex % multiUTracks.length]!;
      return roundMm(Math.max(4.0, Math.min(totalHeightMm - 4.0, chosen)));
    }

    const rearTracks = [
      uTop - 4.5,
      uTop - 11.5,
      Math.min(totalHeightMm - 4.0, uTop + 3.0),
      uBottom + 5.5
    ];
    const chosen = rearTracks[trackSlotIndex % rearTracks.length]!;
    return roundMm(Math.max(4.0, Math.min(totalHeightMm - 4.0, chosen)));
  }

  const preferUp =
    targetY > portY + 8
      ? uTop <= totalHeightMm - 3
      : targetY < portY - 8
        ? false
        : portY - uBottom > uTop - portY;

  const topInner = Math.min(totalHeightMm - 4.0, uTop - 3.6);
  const topOuter = Math.min(totalHeightMm - 3.0, uTop + 3.4);
  const topDeep = Math.min(totalHeightMm - 4.0, uTop - 7.0);
  const topFarOuter = Math.min(totalHeightMm - 3.0, uTop + 6.8);
  const botInner = Math.max(4.0, uBottom + 3.6);
  const botOuter = Math.max(3.0, uBottom - 3.4);
  const botDeep = Math.max(4.0, uBottom + 7.0);
  const botFarOuter = Math.max(3.0, uBottom - 6.8);

  const frontTracks = preferUp
    ? [topInner, topOuter, topDeep, topFarOuter, botInner, botOuter]
    : [botInner, botOuter, botDeep, botFarOuter, topInner, topOuter];

  return roundMm(frontTracks[trackSlotIndex % frontTracks.length]!);
}

/**
 * Routes a single cable in 3D space using the 3-Case Waypoint Resolver,
 * U-boundary horizontal cable runners, collision-free side ducts, and
 * corner-stabilized Centripetal Catmull-Rom Spline interpolation.
 */
export function routeSingleCable(
  cable: CableConnection,
  _project: RackProject,
  geometry: ComputedRackGeometry,
  availablePortalUs: readonly number[],
  ductOccupancyCounters: Map<string, number>,
  existingRoutes: readonly ComputedCableRoute[] = []
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

  const bootExitMm = DEFAULT_PLUG_BOOT_EXIT_MM;
  const a1 = vec3Add(p1, vec3Scale(n1, bootExitMm));
  const a2 = vec3Add(p2, vec3Scale(n2, bootExitMm));

  const isPower = isPowerCableType(cable.cable_type);
  const sameFace = port1.world_face === port2.world_face;
  const dy = Math.abs(p1.y - p2.y);
  const dx = Math.abs(p1.x - p2.x);
  const dz = Math.abs(p1.z - p2.z);

  const uDiff = Math.abs(fromDev.u_position - toDev.u_position);
  const isSameOrAdjacentU =
    uDiff <= 1 ||
    (uDiff === 2 &&
      sameFace &&
      port1.world_face === 'front' &&
      dx <= 55.0 &&
      dy <= 95.0 &&
      fromDev.parent_carrier_id === null &&
      toDev.parent_carrier_id === null);
  const isAdjacentTopLevelFrontPatch =
    sameFace &&
    port1.world_face === 'front' &&
    uDiff === 1 &&
    fromDev.parent_carrier_id === null &&
    toDev.parent_carrier_id === null;

  // =========================================================================
  // CASE A: Direct / Intra-Bay / Adjacent-U Patch Bridge
  // =========================================================================
  if (
    sameFace &&
    isSameOrAdjacentU &&
    dy <= 95.0 &&
    dz <= 160.0 &&
    (fromDev.u_position !== toDev.u_position || fromDev.face === toDev.face) &&
    (dx <= 55.0 ||
      fromDev.u_position === toDev.u_position ||
      isAdjacentTopLevelFrontPatch)
  ) {
    const patchKey = `PATCH:${port1.world_face}:${Math.min(fromDev.u_position, toDev.u_position)}`;
    const bundleIdx = ductOccupancyCounters.get(patchKey) ?? 0;
    ductOccupancyCounters.set(patchKey, bundleIdx + 1);
    const offset = computeHexagonalBundleOffset(bundleIdx);

    const lowerU = Math.min(fromDev.u_position, toDev.u_position);
    const bridgeCounterKey = `BRIDGE:${port1.world_face}:${lowerU}`;
    const bridgeBaseIdx = ductOccupancyCounters.get(bridgeCounterKey) ?? 0;
    if (port1.world_face === 'front' && (dx > 55.0 || fromDev.u_position === toDev.u_position)) {
      ductOccupancyCounters.set(bridgeCounterKey, bridgeBaseIdx + 1);
    }

    const riserCheckX1 = computePortRiserX(
      geometry,
      p1,
      port1.world_face,
      p2.y,
      1
    );
    const riserCheckX2 = computePortRiserX(
      geometry,
      p2,
      port2.world_face,
      p1.y,
      1
    );
    const isStackedPortVerticalArch =
      riserCheckX1 !== p1.x || riserCheckX2 !== p2.x;

    const buildCaseAWaypoints = (attempt: number): Vector3D[] => {
      if (port1.world_face === 'front') {
        if (dx <= 55.0 && fromDev.u_position !== toDev.u_position) {
          // Clean vertical C-arch between aligned ports (e.g. Patch Panel <-> Switch)
          const archZLayers = isStackedPortVerticalArch
            ? [-24.0, -31.0, -38.0, -45.0, -17.0]
            : [-17.0, -24.0, -31.0, -38.0, -45.0];
          const zArch = archZLayers[attempt % archZLayers.length]!;
          const bZ1 =
            !isStackedPortVerticalArch && attempt === 0
              ? roundMm(a1.z - 5.0)
              : zArch;
          const bZ2 =
            !isStackedPortVerticalArch && attempt === 0
              ? roundMm(a2.z - 5.0)
              : zArch;

          const b1 = vec3(p1.x, p1.y, bZ1);
          const b2 = vec3(p2.x, p2.y, bZ2);
          const midA = vec3(
            roundMm((a1.x + a2.x) / 2),
            roundMm((a1.y + a2.y) / 2),
            zArch
          );
          return [p1, a1, b1, midA, b2, a2, p2];
        }

        const slot = bridgeBaseIdx + attempt;
        const bridgeZPlanes = [-23.5, -29.8, -36.1, -42.4, -17.5, -45.5];
        const zPeak = bridgeZPlanes[slot % bridgeZPlanes.length]!;
        const yBoundaryOffsets = [-3.6, 3.6, -10.2, 10.2, 0.0, -6.8, 6.8];
        const yBoundary =
          fromDev.u_position === toDev.u_position
            ? roundMm((lowerU - 1) * MM_PER_U + 5.0 + (slot % 4) * 6.8)
            : roundMm(
                lowerU * MM_PER_U +
                  yBoundaryOffsets[slot % yBoundaryOffsets.length]!
              );

        const rX1 = computePortRiserX(geometry, p1, 'front', yBoundary, 1);
        const rX2 = computePortRiserX(geometry, p2, 'front', yBoundary, 1);
        const b1 = vec3(rX1, p1.y, zPeak);
        const b2 = vec3(rX2, p2.y, zPeak);
        return [
          p1,
          a1,
          b1,
          vec3(rX1, yBoundary, zPeak),
          vec3(rX2, yBoundary, zPeak),
          b2,
          a2,
          p2
        ];
      }

      // Rear Same-U or Adjacent-U Jumper
      const slot = bundleIdx + attempt;
      const zClearPlane = roundMm(
        Math.max(a1.z, a2.z) + 10.0 + (slot % 6) * 6.8
      );

      if (dx <= 28.0 && dz <= 15.0) {
        const b1 = vec3(p1.x, p1.y, roundMm(a1.z + 6.0));
        const b2 = vec3(p2.x, p2.y, roundMm(a2.z + 6.0));
        const midRear = vec3(
          roundMm((a1.x + a2.x) / 2),
          roundMm((a1.y + a2.y) / 2),
          zClearPlane
        );
        return [p1, a1, b1, midRear, b2, a2, p2];
      }

      if (fromDev.u_position === toDev.u_position) {
        // Same-U Rear Sub-Module Jumper:
        // Step coaxially back to zClearPlane, step up above neighboring ports on the same row,
        // traverse horizontally at yJumper, then step down to p2.y and enter p2 coaxially along -Z.
        const uTop = (fromParent ?? fromDev).u_range[1] * MM_PER_U;
        const yJumper = roundMm(
          Math.min(uTop - 3.5, Math.max(p1.y, p2.y) + 11.5 + (slot % 2) * 6.5)
        );
        const b1 = vec3(p1.x, p1.y, zClearPlane);
        const b2 = vec3(p2.x, p2.y, roundMm(Math.min(zClearPlane, a2.z + 10.0)));
        return [
          p1,
          a1,
          b1,
          vec3(p1.x, yJumper, zClearPlane),
          vec3(p2.x, yJumper, zClearPlane),
          b2,
          a2,
          p2
        ];
      }

      const b1 = vec3(p1.x, p1.y, roundMm(Math.min(zClearPlane, a1.z + 10.0)));
      const b2 = vec3(p2.x, p2.y, roundMm(Math.min(zClearPlane, a2.z + 10.0)));
      return [
        p1,
        a1,
        b1,
        vec3(p1.x, p1.y, zClearPlane),
        vec3(p2.x, p2.y, zClearPlane),
        b2,
        a2,
        p2
      ];
    };

    let bestWaypoints = buildCaseAWaypoints(0);
    let bestSpline = evaluateCentripetalCatmullRomSpline(bestWaypoints, 32);
    let bestClearance = computeMinSplineClearanceMm(bestSpline, existingRoutes);

    if (bestClearance < 6.2) {
      for (let attempt = 1; attempt < 12; attempt++) {
        const candWaypoints = buildCaseAWaypoints(attempt);
        const candSpline = evaluateCentripetalCatmullRomSpline(
          candWaypoints,
          32
        );
        const clearance = computeMinSplineClearanceMm(
          candSpline,
          existingRoutes
        );
        if (clearance > bestClearance) {
          bestClearance = clearance;
          bestWaypoints = candWaypoints;
          bestSpline = candSpline;
        }
        if (bestClearance >= 6.2) {
          break;
        }
      }
    }

    const arcLength = computeSplineArcLengthMm(bestSpline);
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
      waypoints: bestWaypoints,
      spline_points: bestSpline,
      raw_arc_length_mm: arcLength,
      required_length_mm: requiredLengthMm,
      recommended_commercial_mm: recommendedCommercialMm
    };
  }

  // =========================================================================
  // CASE B: Same-Face Vertical Duct Route (`front -> front` or `rear -> rear`)
  // =========================================================================
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

    const planeCounterKey =
      port1.world_face === 'front' ? 'PLANE:FRONT' : 'PLANE:REAR';
    const basePlaneSlot = ductOccupancyCounters.get(planeCounterKey) ?? 0;

    const minU = Math.min(fromDev.u_position, toDev.u_position);
    const maxU = Math.max(fromDev.u_position, toDev.u_position);
    let maxFrontDeviceZInSpan = 185.0;
    for (const dev of geometry.devices) {
      if (
        dev.face === 'front' &&
        dev.u_range[1] >= minU &&
        dev.u_range[0] <= maxU
      ) {
        maxFrontDeviceZInSpan = Math.max(
          maxFrontDeviceZInSpan,
          dev.chassis_box.max.z
        );
      }
    }

    // If both ports of a front data cable on a wide 19-inch rack are near the X=0 side rail,
    // use the nearer X=0 side channel so the cable does not cross the entire 482.6mm rack width.
    const useNearLeftSideChannelForFrontData =
      port1.world_face === 'front' &&
      !isPower &&
      geometry.panel_width_mm > 300.0 &&
      Math.max(p1.x, p2.x) < geometry.panel_width_mm * 0.35;

    const buildCaseBWaypoints = (attempt: number): Vector3D[] => {
      const slot = basePlaneSlot + attempt;
      const railWidth =
        (geometry.panel_width_mm - geometry.aperture_width_mm) / 2;
      const innerRailClearX = roundMm(railWidth + 6.0);
      const ductMargins = [
        innerRailClearX,
        roundMm(innerRailClearX + 6.5),
        roundMm(innerRailClearX + 13.0)
      ];
      const sideMarginMm =
        ductMargins[Math.floor(slot / 2) % ductMargins.length]!;
      const ductX = roundMm(
        isPower || useNearLeftSideChannelForFrontData
          ? sideMarginMm
          : geometry.panel_width_mm - sideMarginMm
      );

      if (port1.world_face === 'front') {
        const frontDuctZPlanes = [
          -25.0, -31.5, -38.0, -18.8, -44.2, -21.8, -28.2, -34.8
        ];
        const zFrontDuct = frontDuctZPlanes[slot % frontDuctZPlanes.length]!;
        const yTrackSlot = Math.floor(slot / frontDuctZPlanes.length);

        const yRunner1 = computeDeviceHorizontalRunnerY(
          fromParent ?? fromDev,
          p1.y,
          p2.y,
          yTrackSlot,
          geometry.total_height_mm,
          'front'
        );
        const yRunner2 = computeDeviceHorizontalRunnerY(
          toParent ?? toDev,
          p2.y,
          p1.y,
          yTrackSlot,
          geometry.total_height_mm,
          'front'
        );

        const rX1 = computePortRiserX(geometry, p1, 'front', yRunner1, 1);
        const rX2 = computePortRiserX(geometry, p2, 'front', yRunner2, 1);

        const b1 = vec3(rX1, p1.y, zFrontDuct);
        const b2 = vec3(rX2, p2.y, zFrontDuct);
        return [
          p1,
          a1,
          b1,
          vec3(rX1, yRunner1, zFrontDuct),
          vec3(ductX, yRunner1, zFrontDuct),
          vec3(ductX, yRunner2, zFrontDuct),
          vec3(rX2, yRunner2, zFrontDuct),
          b2,
          a2,
          p2
        ];
      }

      // Rear Duct Route:
      const interiorMinRearZ = Math.max(
        maxFrontDeviceZInSpan + 10.0,
        Math.min(geometry.rail_depth_mm - 38.0, 194.0)
      );
      const interiorMaxRearZ = Math.max(
        interiorMinRearZ + 14.0,
        geometry.rail_depth_mm - 8.5
      );
      const interiorSpanZ = interiorMaxRearZ - interiorMinRearZ;
      const rearPlaneSteps = 8;
      const zRearVerticalDuct = roundMm(
        interiorMinRearZ +
          (((slot * 3) % rearPlaneSteps) * interiorSpanZ) /
            (rearPlaneSteps - 1)
      );

      const yTrackSlot = Math.floor(slot / 3) + attempt;
      const yRunner1 = computeDeviceHorizontalRunnerY(
        fromParent ?? fromDev,
        p1.y,
        p2.y,
        yTrackSlot,
        geometry.total_height_mm,
        'rear'
      );
      const yRunner2 = computeDeviceHorizontalRunnerY(
        toParent ?? toDev,
        p2.y,
        p1.y,
        yTrackSlot + 1,
        geometry.total_height_mm,
        'rear'
      );

      const rX1 = computePortRiserX(geometry, p1, 'rear', yRunner1, 1);
      const rX2 = computePortRiserX(geometry, p2, 'rear', yRunner2, 1);

      const zBehindRearRail = roundMm(a1.z + 5.0 + (slot % 5) * 5.2);
      const yPassOverStart = roundMm(
        Math.min(
          geometry.total_height_mm - 5.0,
          (fromParent ?? fromDev).u_range[1] * MM_PER_U +
            4.5 +
            (slot % 3) * 4.5
        )
      );
      const departWaypoints: Vector3D[] =
        a1.z > zRearVerticalDuct - 4.0
          ? [
              vec3(rX1, p1.y, zBehindRearRail),
              vec3(rX1, yPassOverStart, zBehindRearRail),
              vec3(ductX, yPassOverStart, zBehindRearRail),
              vec3(ductX, yPassOverStart, zRearVerticalDuct)
            ]
          : [
              vec3(rX1, p1.y, zRearVerticalDuct),
              vec3(rX1, yRunner1, zRearVerticalDuct),
              vec3(ductX, yRunner1, zRearVerticalDuct)
            ];

      const zBehindRearRail2 = roundMm(a2.z + 5.0 + (slot % 5) * 5.2);
      const yPassOverEnd = roundMm(
        Math.min(
          geometry.total_height_mm - 5.0,
          (toParent ?? toDev).u_range[1] * MM_PER_U + 4.5 + (slot % 3) * 4.5
        )
      );
      const arriveWaypoints: Vector3D[] =
        a2.z > zRearVerticalDuct + 4.0
          ? [
              vec3(ductX, yPassOverEnd, zRearVerticalDuct),
              vec3(ductX, yPassOverEnd, zBehindRearRail2),
              vec3(rX2, yPassOverEnd, zBehindRearRail2),
              vec3(rX2, p2.y, zBehindRearRail2)
            ]
          : [
              vec3(ductX, yRunner2, zRearVerticalDuct),
              vec3(rX2, yRunner2, zRearVerticalDuct),
              vec3(rX2, p2.y, zRearVerticalDuct),
              vec3(p2.x, p2.y, roundMm(Math.min(zRearVerticalDuct, a2.z + 8.0)))
            ];

      return [p1, a1, ...departWaypoints, ...arriveWaypoints, a2, p2];
    };

    let chosenAttempt = 0;
    let bestWaypoints = buildCaseBWaypoints(0);
    let bestSpline = evaluateCentripetalCatmullRomSpline(bestWaypoints, 32);
    let bestClearance = computeMinSplineClearanceMm(bestSpline, existingRoutes);

    if (bestClearance < 6.2) {
      for (let attempt = 1; attempt < 24; attempt++) {
        const candWaypoints = buildCaseBWaypoints(attempt);
        const candSpline = evaluateCentripetalCatmullRomSpline(
          candWaypoints,
          32
        );
        const clearance = computeMinSplineClearanceMm(
          candSpline,
          existingRoutes
        );
        if (clearance > bestClearance) {
          bestClearance = clearance;
          chosenAttempt = attempt;
          bestWaypoints = candWaypoints;
          bestSpline = candSpline;
        }
        if (bestClearance >= 6.2) {
          break;
        }
      }
    }

    ductOccupancyCounters.set(
      planeCounterKey,
      basePlaneSlot + chosenAttempt + 1
    );

    const arcLength = computeSplineArcLengthMm(bestSpline);
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
      waypoints: bestWaypoints,
      spline_points: bestSpline,
      raw_arc_length_mm: arcLength,
      required_length_mm: requiredLengthMm,
      recommended_commercial_mm: recommendedCommercialMm
    };
  }

  // =========================================================================
  // CASE C: Cross-Face Portal Route (`front <-> rear` via Brush-Panel / Open U)
  // =========================================================================
  const frontDuctId: CableDuctId = isPower ? 'FL' : 'FR';
  const rearDuctId: CableDuctId = isPower ? 'RL' : 'RR';
  const startDuctId = port1.world_face === 'front' ? frontDuctId : rearDuctId;
  const endDuctId = port2.world_face === 'front' ? frontDuctId : rearDuctId;

  const crossKey = `${startDuctId}->${endDuctId}`;
  const bundleIdx = ductOccupancyCounters.get(crossKey) ?? 0;
  ductOccupancyCounters.set(crossKey, bundleIdx + 1);
  const offset = computeHexagonalBundleOffset(bundleIdx);

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

  const minPortalSpanU = Math.min(
    fromDev.u_position,
    toDev.u_position,
    chosenPortalU
  );
  const maxPortalSpanU = Math.max(
    fromDev.u_position,
    toDev.u_position,
    chosenPortalU
  );
  let maxFrontZForPortal = 185.0;
  for (const dev of geometry.devices) {
    if (
      dev.face === 'front' &&
      dev.u_range[1] >= minPortalSpanU &&
      dev.u_range[0] <= maxPortalSpanU
    ) {
      maxFrontZForPortal = Math.max(maxFrontZForPortal, dev.chassis_box.max.z);
    }
  }

  const frontPlaneBase = ductOccupancyCounters.get('PLANE:FRONT') ?? 0;
  const rearPlaneBase = ductOccupancyCounters.get('PLANE:REAR') ?? 0;
  const portalCounterKey = `PORTAL:${chosenPortalU}`;
  const portalBase = ductOccupancyCounters.get(portalCounterKey) ?? 0;

  const buildCaseCWaypoints = (attempt: number): Vector3D[] => {
    const fSlot = frontPlaneBase + attempt;
    const rSlot = rearPlaneBase + attempt * 2;
    const pSlot = portalBase + attempt;

    const useLeftPortalSide =
      isPower ||
      (geometry.panel_width_mm > 300.0 &&
        Math.min(p1.x, p2.x) < geometry.panel_width_mm * 0.45);
    const portalX = roundMm(
      useLeftPortalSide
        ? 38.0 + (pSlot % 10) * 8.5
        : geometry.panel_width_mm - 38.0 - (pSlot % 10) * 8.5
    );
    const yPortal = roundMm(
      (chosenPortalU - 0.5) * MM_PER_U + ((pSlot % 3) - 1) * 5.0
    );

    const frontDuctZPlanes = [
      -25.0, -31.5, -38.0, -18.8, -44.2, -21.8, -28.2, -34.8
    ];
    const zFrontDuct = frontDuctZPlanes[fSlot % frontDuctZPlanes.length]!;

    const interiorMinRearZ = Math.max(
      maxFrontZForPortal + 10.0,
      Math.min(geometry.rail_depth_mm - 38.0, 194.0)
    );
    const interiorMaxRearZ = Math.max(
      interiorMinRearZ + 14.0,
      geometry.rail_depth_mm - 8.5
    );
    const interiorSpanZ = interiorMaxRearZ - interiorMinRearZ;
    const rearPlaneSteps = 8;
    const zRearDuct = roundMm(
      interiorMinRearZ +
        (((rSlot * 3) % rearPlaneSteps) * interiorSpanZ) /
          (rearPlaneSteps - 1)
    );

    const yRunner1 = computeDeviceHorizontalRunnerY(
      fromParent ?? fromDev,
      p1.y,
      yPortal,
      Math.floor(attempt / frontDuctZPlanes.length),
      geometry.total_height_mm,
      port1.world_face
    );
    const yRunner2 = computeDeviceHorizontalRunnerY(
      toParent ?? toDev,
      p2.y,
      yPortal,
      attempt % 4,
      geometry.total_height_mm,
      port2.world_face
    );

    const startDuctZ = port1.world_face === 'front' ? zFrontDuct : zRearDuct;
    const endDuctZ = port2.world_face === 'front' ? zFrontDuct : zRearDuct;

    const rX1 = computePortRiserX(
      geometry,
      p1,
      port1.world_face,
      yRunner1,
      1
    );
    const rX2 = computePortRiserX(
      geometry,
      p2,
      port2.world_face,
      yRunner2,
      1
    );

    const b1 = vec3(rX1, p1.y, startDuctZ);
    const dStartRunner = vec3(rX1, yRunner1, startDuctZ);
    const dStartEntry = vec3(portalX, yRunner1, startDuctZ);
    const dPortalStartOuter = vec3(portalX, yPortal, startDuctZ);
    const dPortalBrushIn = vec3(
      portalX,
      yPortal,
      port1.world_face === 'front' ? -2.0 : 17.0
    );
    const dPortalBrushOut = vec3(
      portalX,
      yPortal,
      port1.world_face === 'front' ? 17.0 : -2.0
    );
    const dPortalEndOuter = vec3(portalX, yPortal, endDuctZ);

    const endArriveWaypoints: Vector3D[] = [
      vec3(portalX, yRunner2, endDuctZ),
      vec3(rX2, yRunner2, endDuctZ),
      vec3(rX2, p2.y, endDuctZ)
    ];

    return [
      p1,
      a1,
      b1,
      dStartRunner,
      dStartEntry,
      dPortalStartOuter,
      dPortalBrushIn,
      dPortalBrushOut,
      dPortalEndOuter,
      ...endArriveWaypoints,
      a2,
      p2
    ];
  };

  let chosenAttempt = 0;
  let bestWaypoints = buildCaseCWaypoints(0);
  let bestSpline = evaluateCentripetalCatmullRomSpline(bestWaypoints, 32);
  let bestClearance = computeMinSplineClearanceMm(bestSpline, existingRoutes);

  if (bestClearance < 6.2) {
    for (let attempt = 1; attempt < 24; attempt++) {
      const candWaypoints = buildCaseCWaypoints(attempt);
      const candSpline = evaluateCentripetalCatmullRomSpline(candWaypoints, 32);
      const clearance = computeMinSplineClearanceMm(
        candSpline,
        existingRoutes
      );
      if (clearance > bestClearance) {
        bestClearance = clearance;
        chosenAttempt = attempt;
        bestWaypoints = candWaypoints;
        bestSpline = candSpline;
      }
      if (bestClearance >= 6.2) {
        break;
      }
    }
  }

  ductOccupancyCounters.set('PLANE:FRONT', frontPlaneBase + chosenAttempt + 1);
  ductOccupancyCounters.set('PLANE:REAR', rearPlaneBase + chosenAttempt + 1);
  ductOccupancyCounters.set(portalCounterKey, portalBase + chosenAttempt + 1);

  const arcLength = computeSplineArcLengthMm(bestSpline);
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
    waypoints: bestWaypoints,
    spline_points: bestSpline,
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
      ductOccupancyCounters,
      routes
    );
    if (route) {
      routes.push(route);
    }
  }

  return routes;
}
