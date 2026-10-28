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
 * Evaluates a Centripetal Catmull-Rom Spline (`alpha = 0.5`) through `waypoints`
 * with explicit endpoint clamping (`[P_start, P_start, A_1, ...middleWaypoints, A_2, P_end, P_end]`)
 * and corner-tangent lever-arm bounding so long duct segments never overshoot
 * past 90-degree bends while `splinePoints[0] === P_start` and `splinePoints[last] === P_end`.
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

  const clampNeighborArm = (
    anchor: Vector3D,
    neighbor: Vector3D,
    maxArmMm: number
  ): Vector3D => {
    const dist = vec3Distance(anchor, neighbor);
    if (dist <= maxArmMm || dist <= 1e-4) {
      return neighbor;
    }
    const ratio = maxArmMm / dist;
    return {
      x: anchor.x + (neighbor.x - anchor.x) * ratio,
      y: anchor.y + (neighbor.y - anchor.y) * ratio,
      z: anchor.z + (neighbor.z - anchor.z) * ratio
    };
  };

  const splinePoints: Vector3D[] = [];
  const numSegments = uniquePoints.length - 1;

  for (let seg = 0; seg < numSegments; seg++) {
    const rawP0 = controlPoints[seg]!;
    const p1 = controlPoints[seg + 1]!;
    const p2 = controlPoints[seg + 2]!;
    const rawP3 = controlPoints[seg + 3]!;

    const spanDist = vec3Distance(p1, p2);
    const isStartBootSpan = seg === 0;
    const isEndBootSpan = seg === numSegments - 1;
    const maxArm0 = isStartBootSpan
      ? Math.min(4.0, spanDist * 0.2)
      : Math.min(12.0, spanDist * 0.34);
    const maxArm3 = isEndBootSpan
      ? Math.min(4.0, spanDist * 0.2)
      : Math.min(12.0, spanDist * 0.34);

    const p0 = clampNeighborArm(p1, rawP0, maxArm0);
    const p3 = clampNeighborArm(p2, rawP3, maxArm3);

    const d01 = Math.max(Math.pow(vec3Distance(p0, p1), alpha), 1e-4);
    const d12 = Math.max(Math.pow( spanDist, alpha), 1e-4);
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
 * Computes a safe U-boundary horizontal cable runner Y coordinate so cables
 * exit their port vertically by ~12mm into a horizontal comb track instead of
 * crossing horizontally in front of neighboring sockets on the same device.
 */
function computeDeviceHorizontalRunnerY(
  dev: ComputedDeviceGeometry,
  portY: number,
  targetY: number,
  trackSlotIndex: number,
  totalHeightMm: number
): number {
  const uBottom = (dev.u_range[0] - 1) * MM_PER_U;
  const uTop = dev.u_range[1] * MM_PER_U;
  const laneSpread = ((trackSlotIndex % 4) - 1.5) * 2.2;

  // Prefer stepping toward targetY (up if target is above, down if target is below),
  // unless at the very top or bottom of the rack.
  const goUp =
    targetY > portY + 8
      ? uTop <= totalHeightMm - 3
      : targetY < portY - 8
        ? false
        : portY - uBottom > uTop - portY;

  if (goUp) {
    return roundMm(Math.min(totalHeightMm - 4, uTop - 4.5 + laneSpread));
  }
  return roundMm(Math.max(4, uBottom + 4.5 + laneSpread));
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

  const bootExitMm = DEFAULT_PLUG_BOOT_EXIT_MM;
  const a1 = vec3Add(p1, vec3Scale(n1, bootExitMm));
  const a2 = vec3Add(p2, vec3Scale(n2, bootExitMm));

  const isPower = isPowerCableType(cable.cable_type);
  const sameFace = port1.world_face === port2.world_face;
  const dy = Math.abs(p1.y - p2.y);
  const dx = Math.abs(p1.x - p2.x);
  const dz = Math.abs(p1.z - p2.z);

  const isSameOrAdjacentU =
    Math.abs(fromDev.u_position - toDev.u_position) <= 1;
  const isAdjacentTopLevelFrontPatch =
    sameFace &&
    port1.world_face === 'front' &&
    Math.abs(fromDev.u_position - toDev.u_position) === 1 &&
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
    (dx <= 50.0 ||
      fromDev.u_position === toDev.u_position ||
      isAdjacentTopLevelFrontPatch)
  ) {
    const patchKey = `PATCH:${port1.world_face}:${Math.min(fromDev.u_position, toDev.u_position)}`;
    const bundleIdx = ductOccupancyCounters.get(patchKey) ?? 0;
    ductOccupancyCounters.set(patchKey, bundleIdx + 1);
    const offset = computeHexagonalBundleOffset(bundleIdx);

    let waypoints: Vector3D[];

    if (port1.world_face === 'front') {
      const zPeak = roundMm(-20.0 - Math.min(bundleIdx, 5) * 1.6);
      if (dx <= 36.0) {
        // Clean vertical arch between aligned ports (e.g. U7 Patch Panel <-> U8 Switch)
        const b1 = vec3(p1.x, p1.y, roundMm(a1.z - 5.0));
        const b2 = vec3(p2.x, p2.y, roundMm(a2.z - 5.0));
        const midA = vec3(
          roundMm((a1.x + a2.x) / 2 + offset.du * 0.25),
          roundMm((a1.y + a2.y) / 2),
          zPeak
        );
        waypoints = [p1, a1, b1, midA, b2, a2, p2];
      } else {
        const lowerU = Math.min(fromDev.u_position, toDev.u_position);
        const yBoundary =
          fromDev.u_position === toDev.u_position
            ? roundMm((lowerU - 1) * MM_PER_U + 5.5 + (bundleIdx % 3) * 2.0)
            : roundMm(lowerU * MM_PER_U + ((bundleIdx % 4) - 1.5) * 2.5);
        const b1 = vec3(p1.x, p1.y, zPeak);
        const b2 = vec3(p2.x, p2.y, zPeak);
        waypoints = [
          p1,
          a1,
          b1,
          vec3(p1.x, yBoundary, zPeak),
          vec3(p2.x, yBoundary, zPeak),
          b2,
          a2,
          p2
        ];
      }
    } else {
      // Rear Same-U or Adjacent-U Jumper (e.g. U3 UCG-Max WAN -> U3 Keystone, U1 UPS -> U2 Rear PDU, U4 PVE1 <-> U5 PVE2 Ceph)
      const zClearPlane = roundMm(
        Math.max(a1.z, a2.z) + 10.0 + Math.min(bundleIdx, 4) * 2.5
      );

      if (dx <= 28.0 && dz <= 15.0) {
        // Vertically aligned rear ports at same depth (e.g. PVE-01 ETH2 <-> PVE-02 ETH2)
        const b1 = vec3(p1.x, p1.y, roundMm(a1.z + 6.0));
        const b2 = vec3(p2.x, p2.y, roundMm(a2.z + 6.0));
        const midRear = vec3(
          roundMm((a1.x + a2.x) / 2 + offset.du * 0.2),
          roundMm((a1.y + a2.y) / 2),
          zClearPlane
        );
        waypoints = [p1, a1, b1, midRear, b2, a2, p2];
      } else if (fromDev.u_position === toDev.u_position) {
        // Same-U Rear Sub-Module Jumper (e.g. U3 UCG-Max Z=127.6mm -> U3 Keystone Z=30mm):
        // Step coaxially straight back from p1 to zClearPlane at p1.y (staying well above the carrier tray floor!),
        // traverse horizontally at zClearPlane to (p2.x, p2.y, zClearPlane),
        // then run straight forward coaxially along -Z into b2 -> a2 -> p2!
        const b1 = vec3(p1.x, p1.y, zClearPlane);
        const b2 = vec3(p2.x, p2.y, roundMm(Math.min(zClearPlane, a2.z + 10.0)));
        waypoints = [
          p1,
          a1,
          b1,
          vec3(p2.x, p2.y, zClearPlane),
          b2,
          a2,
          p2
        ];
      } else {
        // Adjacent-U Rear Jumper with different Z depths (e.g. U1 UPS Z=185mm -> U2 Rear PDU Z=240mm):
        // Step coaxially out to zClearPlane at (p1.x, p1.y) before moving to (p2.x, p2.y, zClearPlane),
        // then enter p2 coaxially along -Z via b2 -> a2 -> p2.
        const b1 = vec3(p1.x, p1.y, roundMm(Math.min(zClearPlane, a1.z + 10.0)));
        const b2 = vec3(p2.x, p2.y, roundMm(Math.min(zClearPlane, a2.z + 10.0)));
        waypoints = [
          p1,
          a1,
          b1,
          vec3(p1.x, p1.y, zClearPlane),
          vec3(p2.x, p2.y, zClearPlane),
          b2,
          a2,
          p2
        ];
      }
    }

    const splinePoints = evaluateCentripetalCatmullRomSpline(waypoints, 32);
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

    // Place vertical cable ducts in the outer rail channel (X = 6..15mm / W - 15..W - 6mm),
    // strictly outside the chassis aperture ([17, 237]mm on 10" and [20.1, 462.5]mm on 19")
    // so Z transitions in the side channel never intersect front or rear device enclosures.
    const sideMarginMm = 6.0 + (bundleIdx % 5) * 2.2;
    const ductX = roundMm(
      isPower ? sideMarginMm : geometry.panel_width_mm - sideMarginMm
    );

    const yRunner1 = computeDeviceHorizontalRunnerY(
      fromParent ?? fromDev,
      p1.y,
      p2.y,
      bundleIdx,
      geometry.total_height_mm
    );
    const yRunner2 = computeDeviceHorizontalRunnerY(
      toParent ?? toDev,
      p2.y,
      p1.y,
      bundleIdx,
      geometry.total_height_mm
    );

    let waypoints: Vector3D[];

    if (port1.world_face === 'front') {
      const zFrontDuct = roundMm(-18.0 - (bundleIdx % 4) * 2.0);
      const b1 = vec3(p1.x, p1.y, zFrontDuct);
      const b2 = vec3(p2.x, p2.y, zFrontDuct);
      waypoints = [
        p1,
        a1,
        b1,
        vec3(p1.x, yRunner1, zFrontDuct),
        vec3(ductX, yRunner1, zFrontDuct),
        vec3(ductX, yRunner2, zFrontDuct),
        vec3(p2.x, yRunner2, zFrontDuct),
        b2,
        a2,
        p2
      ];
    } else {
      // Rear Duct Route:
      // Determine maximum rear Z of intermediate front-mounted devices between U1 and U2
      // so the vertical rear duct plane stays behind all front-mounted chassis (Z = 204..214mm),
      // while depth transitions into shallower U bays (like U7 Patch Panel at Z=30mm or U8 Switch at Z=99mm)
      // happen strictly at the target U's height and enter terminator boots coaxially along -Z!
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

      const zRearVerticalDuct = roundMm(
        Math.min(
          geometry.rail_depth_mm - 6.0,
          Math.max(maxFrontDeviceZInSpan + 19.0, 204.0) + (bundleIdx % 5) * 2.5
        )
      );

      const yDepart = roundMm(p1.y + ((bundleIdx % 5) - 2) * 1.5);
      const yArrive = roundMm(p2.y + ((bundleIdx % 5) - 2) * 1.5);

      const zBehindRearRail = roundMm(a1.z + 8.0 + (bundleIdx % 4) * 2.5);
      const departWaypoints: Vector3D[] =
        a1.z > zRearVerticalDuct - 6.0
          ? [
              // Rear-rail device (e.g. Rear PDU at Z=240mm): step coaxially back behind the rear rail,
              // step to runner Y, run horizontally behind the PDU to ductX, and travel vertically at zBehindRearRail
              // to yArrive so it never passes through the PDU chassis (Z=185..242mm)!
              vec3(p1.x, p1.y, zBehindRearRail),
              vec3(p1.x, yRunner1, zBehindRearRail),
              vec3(ductX, yRunner1, zBehindRearRail),
              vec3(ductX, yArrive, zBehindRearRail)
            ]
          : [
              // Front/mid-depth device with open rear space (e.g. UCG-Max at Z=127.6, Mini-PCs at Z=182, UPS at Z=185):
              // Step coaxially straight back along +Z at port height all the way to zRearVerticalDuct (204..214mm),
              // then traverse horizontally to the rear side duct (zero shelf clipping or under-tray loops!)
              vec3(p1.x, p1.y, zRearVerticalDuct),
              vec3(ductX, yDepart, zRearVerticalDuct)
            ];

      const zBehindRearRail2 = roundMm(a2.z + 8.0 + (bundleIdx % 4) * 2.5);
      const arriveWaypoints: Vector3D[] =
        a2.z > zRearVerticalDuct + 6.0
          ? [
              // Rear-rail target device (e.g. Rear PDU at Z=600mm facing +Z):
              // Travel in the outer side channel to yRunner2, step behind the rear rail at ductX,
              // traverse horizontally behind the rear device to p2.x, and plug straight forward (-Z) into a2 -> p2!
              vec3(ductX, yRunner2, zRearVerticalDuct),
              vec3(ductX, yRunner2, zBehindRearRail2),
              vec3(p2.x, yRunner2, zBehindRearRail2),
              vec3(p2.x, p2.y, zBehindRearRail2)
            ]
          : a2.z >= zRearVerticalDuct - 70.0
          ? [
              // Deep/mid-depth target device (e.g. UCG-Max at Z=127.6, Mini-PCs at Z=182):
              // Arrive at target port height in the rear duct, traverse horizontally at zRearVerticalDuct to p2.x,
              // then go 100% straight forward coaxially along -Z into the terminator boot!
              vec3(ductX, yArrive, zRearVerticalDuct),
              vec3(p2.x, p2.y, zRearVerticalDuct),
              vec3(p2.x, p2.y, roundMm(Math.min(zRearVerticalDuct, a2.z + 8.0)))
            ]
          : [
              // Shallow target device (e.g. U7 Patch Panel at Z=30mm or U8 Switch at Z=99.4mm):
              // Step forward along the side wall at target port height to a staggered approach depth (18..36mm behind boots),
              // traverse horizontally behind the boots to (p2.x, p2.y, zApproach),
              // then go 100% straight forward coaxially along -Z into the terminator boot!
              vec3(ductX, yArrive, zRearVerticalDuct),
              vec3(
                ductX,
                yArrive,
                roundMm(a2.z + 18.0 + (bundleIdx % 5) * 4.5)
              ),
              vec3(
                p2.x,
                p2.y,
                roundMm(a2.z + 18.0 + (bundleIdx % 5) * 4.5)
              ),
              vec3(p2.x, p2.y, roundMm(a2.z + 9.0))
            ];

      waypoints = [p1, a1, ...departWaypoints, ...arriveWaypoints, a2, p2];
    }

    const splinePoints = evaluateCentripetalCatmullRomSpline(waypoints, 32);
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

  // Pass through the open bristle slot of the brush panel (inset 38mm from panel edge so it passes
  // cleanly through the black brush strip rather than the metal mounting ear!)
  const portalX = roundMm(
    isPower
      ? 38.0 + bundleIdx * 4.5
      : geometry.panel_width_mm - 38.0 - bundleIdx * 4.5
  );
  const yPortal = roundMm((chosenPortalU - 0.5) * MM_PER_U + offset.dv * 0.35);

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

  const zFrontDuct = roundMm(-18.0 - (bundleIdx % 4) * 2.0);
  const zRearDuct = roundMm(
    Math.min(
      geometry.rail_depth_mm - 8.0,
      Math.max(maxFrontZForPortal + 21.0, 206.0) + (bundleIdx % 5) * 2.5
    )
  );

  const yRunner1 = computeDeviceHorizontalRunnerY(
    fromParent ?? fromDev,
    p1.y,
    yPortal,
    bundleIdx,
    geometry.total_height_mm
  );
  const yRunner2 = computeDeviceHorizontalRunnerY(
    toParent ?? toDev,
    p2.y,
    yPortal,
    bundleIdx,
    geometry.total_height_mm
  );

  const startDuctZ = port1.world_face === 'front' ? zFrontDuct : zRearDuct;
  const endDuctZ = port2.world_face === 'front' ? zFrontDuct : zRearDuct;

  const b1 = vec3(p1.x, p1.y, startDuctZ);
  const dStartRunner = vec3(p1.x, yRunner1, startDuctZ);
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

  const endArriveWaypoints: Vector3D[] =
    port2.world_face === 'front'
      ? [
          vec3(portalX, yRunner2, endDuctZ),
          vec3(p2.x, yRunner2, endDuctZ),
          vec3(p2.x, p2.y, endDuctZ)
        ]
      : [
          vec3(portalX, p2.y, endDuctZ),
          vec3(p2.x, p2.y, endDuctZ),
          vec3(p2.x, p2.y, roundMm(Math.min(endDuctZ, a2.z + 10.0)))
        ];

  const waypoints: Vector3D[] = [
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

  const splinePoints = evaluateCentripetalCatmullRomSpline(waypoints, 32);
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
