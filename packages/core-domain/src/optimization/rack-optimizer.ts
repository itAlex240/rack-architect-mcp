import {
  type BlueprintCatalogMap,
  type ComputedRackGeometry,
  computeRackGeometry,
  lookupBlueprint,
  roundCentis,
  roundMm
} from '../geometry/index.js';
import { routeProjectCables } from '../routing/index.js';
import {
  getPlugClearanceMm,
  type HardwareBlueprint,
  type MountedChildDevice,
  type MountedDevice,
  type RackFace,
  type RackProject,
  type RackProjectInput,
  RackProjectSchema,
  type ValidationResult
} from '../schemas/index.js';
import {
  computeAvailablePortalUs,
  validateRackProject
} from '../validation/index.js';

export interface OptimizationMetrics {
  readonly error_count: number;
  readonly warning_count: number;
  readonly normalized_cog_y: number;
  readonly total_cable_length_mm: number;
}

export interface MovedDeviceRecord {
  readonly instance_id: string;
  readonly from_u: number;
  readonly to_u: number;
  readonly from_face: RackFace;
  readonly to_face: RackFace;
  readonly reason: string;
}

export interface OptimizeRackLayoutOptions {
  readonly pin_instance_ids?: readonly string[] | undefined;
}

export interface OptimizeRackResult {
  readonly optimized_project: RackProject;
  readonly moved_devices: readonly MovedDeviceRecord[];
  readonly metrics_before: OptimizationMetrics;
  readonly metrics_after: OptimizationMetrics;
  readonly improved: boolean;
}

type FunctionalRole =
  | 'ups'
  | 'heavy-floor'
  | 'patch-panel'
  | 'switch'
  | 'router'
  | 'brush-panel'
  | 'blank-panel'
  | 'pdu'
  | 'compute';

interface PlacementSlot {
  readonly u_position: number;
  readonly face: RackFace;
}

interface DeviceProfile {
  readonly index: number;
  readonly device: MountedDevice;
  readonly blueprint: HardwareBlueprint | undefined;
  readonly pinned: boolean;
  readonly uSpan: number;
  readonly totalWeightGrams: number;
  readonly totalMaxWatts: number;
  readonly isPassiveHighHeat: boolean;
  readonly role: FunctionalRole;
  readonly rearMountable: boolean;
  readonly frontMountable: boolean;
  readonly inwardDepthFrontMm: number;
  readonly inwardDepthRearMm: number;
  readonly frontProtrusionTotalMm: number;
  readonly hasCables: boolean;
  readonly hasExternalEndpoints: boolean;
}

interface EvaluatedCandidate {
  readonly project: RackProject;
  readonly geometry: ComputedRackGeometry;
  readonly validation: ValidationResult;
  readonly metrics: OptimizationMetrics;
  readonly primaryScore: number;
  readonly zoningScore: number;
}

const SCORE_EPSILON = 1e-3;
const DEPTH_MARGIN_MM = 0.01;

function cloneChildDevice(child: MountedChildDevice): MountedChildDevice {
  return {
    instance_id: child.instance_id,
    blueprint_slug: child.blueprint_slug,
    slot_id: child.slot_id,
    ...(child.hostname !== undefined ? { hostname: child.hostname } : {})
  };
}

function buildProjectWithPlacements(
  baseProject: RackProject,
  placements: ReadonlyMap<string, PlacementSlot>
): RackProject {
  const mountedDevices: MountedDevice[] = baseProject.mounted_devices.map(
    (dev) => {
      const slot = placements.get(dev.instance_id);
      const children = dev.children.map(cloneChildDevice);
      return {
        instance_id: dev.instance_id,
        blueprint_slug: dev.blueprint_slug,
        u_position: slot ? slot.u_position : dev.u_position,
        face: slot ? slot.face : dev.face,
        children,
        ...(dev.hostname !== undefined ? { hostname: dev.hostname } : {})
      };
    }
  );

  return {
    schema_version: baseProject.schema_version,
    project_name: baseProject.project_name,
    rack: { ...baseProject.rack },
    mounted_devices: mountedDevices,
    cables: baseProject.cables.map((c) => ({
      ...c,
      from: { ...c.from },
      to: { ...c.to }
    })),
    external_endpoints: baseProject.external_endpoints.map((e) => ({ ...e }))
  };
}

function extractPlacementMap(project: RackProject): Map<string, PlacementSlot> {
  const map = new Map<string, PlacementSlot>();
  for (const dev of project.mounted_devices) {
    map.set(dev.instance_id, {
      u_position: dev.u_position,
      face: dev.face
    });
  }
  return map;
}

function classifyRole(
  bp: HardwareBlueprint | undefined,
  totalWeightGrams: number
): FunctionalRole {
  if (bp === undefined) {
    return 'compute';
  }
  if (
    bp.category === 'ups' ||
    bp.power_and_thermal.electrical_role === 'ups'
  ) {
    return 'ups';
  }
  if (
    bp.category === 'pdu' ||
    bp.power_and_thermal.electrical_role === 'pdu'
  ) {
    return 'pdu';
  }
  if (bp.category === 'patch-panel') {
    return 'patch-panel';
  }
  if (
    bp.category === 'brush-panel' ||
    bp.geometry.has_cable_pass_through === true
  ) {
    return 'brush-panel';
  }
  if (bp.category === 'blank-panel' || bp.category === 'blanking-panel') {
    return 'blank-panel';
  }
  if (
    bp.category === 'switch' ||
    bp.power_and_thermal.electrical_role === 'pse-switch'
  ) {
    return 'switch';
  }
  if (bp.category === 'router') {
    return 'router';
  }
  if (bp.category === 'nas' || totalWeightGrams >= 2500) {
    return 'heavy-floor';
  }
  return 'compute';
}

function computeInwardAndFrontExtents(
  device: MountedDevice,
  bp: HardwareBlueprint | undefined,
  project: RackProject,
  catalog: BlueprintCatalogMap
): {
  readonly inwardFrontMm: number;
  readonly inwardRearMm: number;
  readonly frontProtrusionTotalMm: number;
} {
  if (bp === undefined) {
    return {
      inwardFrontMm: 0,
      inwardRearMm: 0,
      frontProtrusionTotalMm: 0
    };
  }

  let bodyDepth = bp.geometry.depth_mm + bp.geometry.rear_protrusion_mm;
  let frontProtrusion = bp.geometry.front_protrusion_mm;

  const memberBlueprints = new Map<string, HardwareBlueprint>();
  memberBlueprints.set(device.instance_id, bp);

  for (const child of device.children) {
    const childBp = lookupBlueprint(catalog, child.blueprint_slug);
    if (childBp === undefined) {
      continue;
    }
    memberBlueprints.set(child.instance_id, childBp);
    const slot = bp.slots.find((s) => s.slot_id === child.slot_id);
    const slotZ = slot?.offset_mm.z ?? 0;
    bodyDepth = Math.max(
      bodyDepth,
      slotZ + childBp.geometry.depth_mm + childBp.geometry.rear_protrusion_mm
    );
    frontProtrusion = Math.max(
      frontProtrusion,
      childBp.geometry.front_protrusion_mm - slotZ
    );
  }

  let frontMountInwardPlug = 0;
  let rearMountInwardPlug = 0;
  let frontMountOutwardPlug = 0;

  for (const cable of project.cables) {
    const endpoints = [cable.from, cable.to];
    for (const ep of endpoints) {
      const memberBp = memberBlueprints.get(ep.instance_id);
      if (memberBp === undefined) {
        continue;
      }
      const port = memberBp.ports.find((p) => p.port_id === ep.port_id);
      if (port === undefined) {
        continue;
      }
      const deltaZ = getPlugClearanceMm(port.connector_type, cable.cable_type);
      const isCoupler =
        Boolean(port.is_passthrough_coupler) ||
        Boolean(memberBp.is_passthrough_coupler) ||
        port.capabilities.includes('passthrough-coupler') ||
        (memberBp.category === 'keystone-module' && memberBp.ports.length === 1);

      if (isCoupler) {
        if (ep.face === 'rear') {
          frontMountInwardPlug = Math.max(frontMountInwardPlug, deltaZ);
        } else if (ep.face === 'front') {
          rearMountInwardPlug = Math.max(rearMountInwardPlug, deltaZ);
          frontMountOutwardPlug = Math.max(frontMountOutwardPlug, deltaZ);
        } else {
          if (port.face === 'rear') {
            frontMountInwardPlug = Math.max(frontMountInwardPlug, deltaZ);
          } else {
            frontMountOutwardPlug = Math.max(frontMountOutwardPlug, deltaZ);
          }
        }
      } else if (port.face === 'rear') {
        frontMountInwardPlug = Math.max(frontMountInwardPlug, deltaZ);
        rearMountInwardPlug = Math.max(rearMountInwardPlug, deltaZ);
      } else {
        frontMountOutwardPlug = Math.max(frontMountOutwardPlug, deltaZ);
      }
    }
  }

  return {
    inwardFrontMm: roundMm(bodyDepth + frontMountInwardPlug),
    inwardRearMm: roundMm(bodyDepth + rearMountInwardPlug),
    frontProtrusionTotalMm: roundMm(
      Math.max(frontProtrusion, frontMountOutwardPlug)
    )
  };
}

function buildDeviceProfiles(
  project: RackProject,
  catalog: BlueprintCatalogMap,
  pinIds: ReadonlySet<string>
): DeviceProfile[] {
  const cableEndpointDeviceIds = new Set<string>();
  for (const cable of project.cables) {
    cableEndpointDeviceIds.add(cable.from.instance_id);
    cableEndpointDeviceIds.add(cable.to.instance_id);
  }
  const externalPpIds = new Set<string>(
    project.external_endpoints.map((e) => e.patch_panel_instance_id)
  );

  return project.mounted_devices.map((device, index) => {
    const bp = lookupBlueprint(catalog, device.blueprint_slug);
    const uSpan = bp ? Math.max(1, Math.ceil(bp.geometry.u_height)) : 1;

    let totalWeightGrams = bp?.geometry.weight_grams ?? 0;
    let totalMaxWatts = bp?.power_and_thermal.max_system_watts ?? 0;
    let hasCables = cableEndpointDeviceIds.has(device.instance_id);
    let hasChildPinned = false;

    for (const child of device.children) {
      if (pinIds.has(child.instance_id)) {
        hasChildPinned = true;
      }
      if (cableEndpointDeviceIds.has(child.instance_id)) {
        hasCables = true;
      }
      const childBp = lookupBlueprint(catalog, child.blueprint_slug);
      if (childBp) {
        totalWeightGrams += childBp.geometry.weight_grams;
        totalMaxWatts += childBp.power_and_thermal.max_system_watts;
      }
    }

    const pinned =
      bp === undefined || pinIds.has(device.instance_id) || hasChildPinned;
    const role = classifyRole(bp, totalWeightGrams);
    const isPassiveHighHeat =
      bp !== undefined &&
      bp.power_and_thermal.airflow === 'passive-convection' &&
      totalMaxWatts >= 35;

    const rearMountable =
      device.face === 'rear' ||
      (role === 'pdu' &&
        bp !== undefined &&
        bp.mount_type !== 'shelf-standing' &&
        bp.mount_type !== 'sub-module' &&
        bp.geometry.depth_mm < project.rack.rail_depth_mm);

    const frontMountable =
      device.face === 'front' ||
      (bp !== undefined && bp.geometry.ear_mount_style !== 'rear-rail-mount');

    const extents = computeInwardAndFrontExtents(device, bp, project, catalog);

    return {
      index,
      device,
      blueprint: bp,
      pinned,
      uSpan,
      totalWeightGrams,
      totalMaxWatts,
      isPassiveHighHeat,
      role,
      rearMountable,
      frontMountable,
      inwardDepthFrontMm: extents.inwardFrontMm,
      inwardDepthRearMm: extents.inwardRearMm,
      frontProtrusionTotalMm: extents.frontProtrusionTotalMm,
      hasCables,
      hasExternalEndpoints: externalPpIds.has(device.instance_id)
    };
  });
}

function buildUnitConnectivityMap(
  project: RackProject
): Map<string, Map<string, number>> {
  const childToParent = new Map<string, string>();
  for (const dev of project.mounted_devices) {
    childToParent.set(dev.instance_id, dev.instance_id);
    for (const child of dev.children) {
      childToParent.set(child.instance_id, dev.instance_id);
    }
  }

  const graph = new Map<string, Map<string, number>>();
  const addEdge = (a: string, b: string, weight: number) => {
    if (a === b) {
      return;
    }
    let mapA = graph.get(a);
    if (!mapA) {
      mapA = new Map<string, number>();
      graph.set(a, mapA);
    }
    mapA.set(b, (mapA.get(b) ?? 0) + weight);

    let mapB = graph.get(b);
    if (!mapB) {
      mapB = new Map<string, number>();
      graph.set(b, mapB);
    }
    mapB.set(a, (mapB.get(a) ?? 0) + weight);
  };

  for (const cable of project.cables) {
    const parentFrom = childToParent.get(cable.from.instance_id);
    const parentTo = childToParent.get(cable.to.instance_id);
    if (parentFrom !== undefined && parentTo !== undefined) {
      const weight =
        cable.cable_type.startsWith('power-') ? 0.5 : 2.0;
      addEdge(parentFrom, parentTo, weight);
    }
  }

  return graph;
}

function projectHasCrossFaceNeeds(
  project: RackProject,
  catalog: BlueprintCatalogMap,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  placements: ReadonlyMap<string, PlacementSlot>
): boolean {
  const childToParent = new Map<string, string>();
  const deviceBlueprintById = new Map<string, HardwareBlueprint>();

  for (const dev of project.mounted_devices) {
    childToParent.set(dev.instance_id, dev.instance_id);
    const parentProf = profilesById.get(dev.instance_id);
    if (parentProf?.blueprint !== undefined) {
      deviceBlueprintById.set(dev.instance_id, parentProf.blueprint);
    }
    for (const child of dev.children) {
      childToParent.set(child.instance_id, dev.instance_id);
      const childBp = lookupBlueprint(catalog, child.blueprint_slug);
      if (childBp !== undefined) {
        deviceBlueprintById.set(child.instance_id, childBp);
      }
    }
  }

  const resolvePortWorldFace = (
    instanceId: string,
    portId: string,
    explicitFace: RackFace | undefined,
    mountFace: RackFace
  ): RackFace => {
    if (explicitFace !== undefined) {
      return explicitFace;
    }
    const bp = deviceBlueprintById.get(instanceId);
    const port = bp?.ports.find((p) => p.port_id === portId);
    const localFace = port?.face ?? 'front';
    return mountFace === 'front'
      ? localFace
      : localFace === 'front'
        ? 'rear'
        : 'front';
  };

  for (const cable of project.cables) {
    const pFrom = childToParent.get(cable.from.instance_id);
    const pTo = childToParent.get(cable.to.instance_id);
    if (pFrom === undefined || pTo === undefined) {
      continue;
    }
    const profFrom = profilesById.get(pFrom);
    const profTo = profilesById.get(pTo);
    if (profFrom === undefined || profTo === undefined) {
      continue;
    }

    const faceFrom = placements.get(pFrom)?.face ?? profFrom.device.face;
    const faceTo = placements.get(pTo)?.face ?? profTo.device.face;
    if (faceFrom !== faceTo) {
      return true;
    }

    const wf1 = resolvePortWorldFace(
      cable.from.instance_id,
      cable.from.port_id,
      cable.from.face,
      faceFrom
    );
    const wf2 = resolvePortWorldFace(
      cable.to.instance_id,
      cable.to.port_id,
      cable.to.face,
      faceTo
    );
    if (wf1 !== wf2) {
      return true;
    }
  }

  return false;
}

function computeFloorHuggingPenalty(
  project: RackProject,
  profilesById: ReadonlyMap<string, DeviceProfile>
): number {
  let penalty = 0;
  for (const dev of project.mounted_devices) {
    const prof = profilesById.get(dev.instance_id);
    if (prof === undefined) {
      continue;
    }
    if (prof.role === 'ups') {
      penalty += (dev.u_position - 1) * 150;
    } else if (prof.role === 'heavy-floor') {
      penalty += (dev.u_position - 1) * 60;
    }
  }
  return penalty;
}

function computePrimaryScore(
  metrics: OptimizationMetrics,
  project?: RackProject,
  profilesById?: ReadonlyMap<string, DeviceProfile>
): number {
  const cogExcess = Math.max(0, metrics.normalized_cog_y - 0.45);
  const floorPenalty =
    project !== undefined && profilesById !== undefined
      ? computeFloorHuggingPenalty(project, profilesById)
      : 0;
  return (
    metrics.error_count * 1_000_000 +
    metrics.warning_count * 10_000 +
    cogExcess * 5_000 +
    metrics.total_cable_length_mm +
    floorPenalty
  );
}

function computeZoningScore(
  project: RackProject,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  geometry: ComputedRackGeometry,
  initialPlacements: ReadonlyMap<string, PlacementSlot>
): number {
  let score = 0;
  const uHeight = project.rack.u_height;
  const midU = Math.ceil(uHeight / 2);

  const patchPanelUs: number[] = [];
  for (const dev of project.mounted_devices) {
    const prof = profilesById.get(dev.instance_id);
    if (prof?.role === 'patch-panel') {
      patchPanelUs.push(dev.u_position);
    }
  }

  for (const dev of project.mounted_devices) {
    const prof = profilesById.get(dev.instance_id);
    if (prof === undefined) {
      continue;
    }
    const uEnd = dev.u_position + prof.uSpan - 1;

    if (prof.role === 'ups') {
      score += (dev.u_position - 1) * (20 + prof.totalWeightGrams / 500);
    } else if (prof.role === 'heavy-floor') {
      score += (dev.u_position - 1) * (5 + prof.totalWeightGrams / 1000);
    } else if (prof.role === 'patch-panel') {
      score += (uHeight - uEnd) * 3;
    } else if (prof.role === 'switch' || prof.role === 'router') {
      if (patchPanelUs.length > 0 && prof.role === 'switch') {
        let minGap = uHeight;
        for (const ppU of patchPanelUs) {
          minGap = Math.min(minGap, Math.abs(dev.u_position - ppU));
        }
        score += Math.max(0, minGap - 1) * 4;
      }
      score += (uHeight - uEnd) * 0.2;
    } else if (prof.role === 'brush-panel') {
      score += Math.abs(dev.u_position - midU) * 1.5;
    } else if (prof.role === 'pdu') {
      if (dev.face === 'rear') {
        const frontOpp = project.mounted_devices.filter((other) => {
          if (other.face !== 'front') {
            return false;
          }
          const otherProf = profilesById.get(other.instance_id);
          const otherEnd = other.u_position + (otherProf?.uSpan ?? 1) - 1;
          return (
            Math.max(dev.u_position, other.u_position) <=
            Math.min(uEnd, otherEnd)
          );
        });
        if (frontOpp.length === 0) {
          score -= 0.5;
        } else {
          const oppRole = profilesById.get(frontOpp[0]!.instance_id)?.role;
          if (
            oppRole === 'blank-panel' ||
            oppRole === 'brush-panel' ||
            oppRole === 'patch-panel'
          ) {
            score -= 0.4;
          } else {
            score += 2.0;
          }
        }
      } else {
        score += 1.0;
      }
    }

    const orig = initialPlacements.get(dev.instance_id);
    if (
      orig !== undefined &&
      (orig.u_position !== dev.u_position || orig.face !== dev.face)
    ) {
      score += 0.01;
    }
  }

  const portals = computeAvailablePortalUs(project, geometry);
  if (portals.length > 0 && project.cables.length > 0) {
    const closestToMid = portals.reduce((best, cand) =>
      Math.abs(cand - midU) < Math.abs(best - midU) ? cand : best
    );
    score += Math.abs(closestToMid - midU) * 0.05;
  }

  return roundCentis(score);
}

function evaluateCandidateFull(
  project: RackProject,
  catalog: BlueprintCatalogMap,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  initialPlacements: ReadonlyMap<string, PlacementSlot>
): EvaluatedCandidate {
  const geometry = computeRackGeometry(project, catalog);
  const validation = validateRackProject(project, catalog, geometry);
  const routes = routeProjectCables(project, catalog, geometry);
  const totalCableLengthMm = roundCentis(
    routes.reduce((sum, r) => sum + r.raw_arc_length_mm, 0)
  );
  const metrics: OptimizationMetrics = {
    error_count: validation.error_count,
    warning_count: validation.warning_count,
    normalized_cog_y: validation.mechanical_summary.normalized_cog_y,
    total_cable_length_mm: totalCableLengthMm
  };
  return {
    project,
    geometry,
    validation,
    metrics,
    primaryScore: computePrimaryScore(metrics, project, profilesById),
    zoningScore: computeZoningScore(
      project,
      profilesById,
      geometry,
      initialPlacements
    )
  };
}

function isStrictlyBetter(
  candidate: EvaluatedCandidate,
  baseline: EvaluatedCandidate
): boolean {
  if (candidate.primaryScore < baseline.primaryScore - SCORE_EPSILON) {
    return true;
  }
  if (
    Math.abs(candidate.primaryScore - baseline.primaryScore) <= SCORE_EPSILON &&
    candidate.zoningScore < baseline.zoningScore - SCORE_EPSILON
  ) {
    return true;
  }
  return false;
}

function isNonRegressingImprovement(
  candidate: EvaluatedCandidate,
  before: EvaluatedCandidate
): boolean {
  if (candidate.metrics.error_count > before.metrics.error_count) {
    return false;
  }
  if (
    candidate.metrics.error_count === before.metrics.error_count &&
    candidate.metrics.warning_count > before.metrics.warning_count
  ) {
    return false;
  }
  return isStrictlyBetter(candidate, before);
}

function canPlaceFast(
  placements: ReadonlyMap<string, PlacementSlot>,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  rack: RackProject['rack'],
  candidateProfile: DeviceProfile,
  targetU: number,
  targetFace: RackFace
): boolean {
  const candEnd = targetU + candidateProfile.uSpan - 1;
  if (targetU < 1 || candEnd > rack.u_height) {
    return false;
  }

  if (
    targetFace === 'front' &&
    rack.enclosure_type === 'closed-glass-front' &&
    candidateProfile.frontProtrusionTotalMm >
      rack.front_door_clearance_mm + DEPTH_MARGIN_MM
  ) {
    return false;
  }

  const candInwardDepth =
    targetFace === 'front'
      ? candidateProfile.inwardDepthFrontMm
      : candidateProfile.inwardDepthRearMm;

  for (const [otherId, otherSlot] of placements.entries()) {
    if (otherId === candidateProfile.device.instance_id) {
      continue;
    }
    const otherProfile = profilesById.get(otherId);
    if (otherProfile === undefined) {
      continue;
    }
    const otherEnd = otherSlot.u_position + otherProfile.uSpan - 1;
    const overlapsU =
      Math.max(targetU, otherSlot.u_position) <= Math.min(candEnd, otherEnd);
    if (!overlapsU) {
      continue;
    }

    if (otherSlot.face === targetFace) {
      return false;
    }

    const otherInwardDepth =
      otherSlot.face === 'front'
        ? otherProfile.inwardDepthFrontMm
        : otherProfile.inwardDepthRearMm;
    if (candInwardDepth + otherInwardDepth > rack.rail_depth_mm - DEPTH_MARGIN_MM) {
      return false;
    }
  }

  return true;
}

function computeMinimumOverlapPenalty(
  placements: ReadonlyMap<string, PlacementSlot>,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  rack: RackProject['rack'],
  candidateProfile: DeviceProfile,
  targetU: number,
  targetFace: RackFace
): number {
  const candEnd = targetU + candidateProfile.uSpan - 1;
  if (targetU < 1 || candEnd > rack.u_height) {
    return 1_000_000;
  }
  const candInward =
    targetFace === 'front'
      ? candidateProfile.inwardDepthFrontMm
      : candidateProfile.inwardDepthRearMm;

  let penalty = 0;
  for (const [otherId, otherSlot] of placements.entries()) {
    if (otherId === candidateProfile.device.instance_id) {
      continue;
    }
    const otherProf = profilesById.get(otherId);
    if (otherProf === undefined) {
      continue;
    }
    const otherEnd = otherSlot.u_position + otherProf.uSpan - 1;
    const uOverlap =
      Math.min(candEnd, otherEnd) - Math.max(targetU, otherSlot.u_position) + 1;
    if (uOverlap <= 0) {
      continue;
    }
    if (otherSlot.face === targetFace) {
      penalty += 10_000 * uOverlap;
    } else {
      const otherInward =
        otherSlot.face === 'front'
          ? otherProf.inwardDepthFrontMm
          : otherProf.inwardDepthRearMm;
      const zOverlap = candInward + otherInward - rack.rail_depth_mm;
      if (zOverlap > 0) {
        penalty += 1000 + zOverlap;
      }
    }
  }
  return penalty;
}

function findBestAvailableSlot(
  placements: ReadonlyMap<string, PlacementSlot>,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  rack: RackProject['rack'],
  profile: DeviceProfile,
  candidateSlots: readonly PlacementSlot[]
): PlacementSlot {
  for (const slot of candidateSlots) {
    if (
      canPlaceFast(
        placements,
        profilesById,
        rack,
        profile,
        slot.u_position,
        slot.face
      )
    ) {
      return slot;
    }
  }

  let bestFallback = candidateSlots[0] ?? {
    u_position: Math.min(
      Math.max(1, profile.device.u_position),
      Math.max(1, rack.u_height - profile.uSpan + 1)
    ),
    face: profile.device.face
  };
  let bestPenalty = Infinity;

  for (const slot of candidateSlots) {
    const penalty = computeMinimumOverlapPenalty(
      placements,
      profilesById,
      rack,
      profile,
      slot.u_position,
      slot.face
    );
    if (penalty < bestPenalty) {
      bestPenalty = penalty;
      bestFallback = slot;
    }
  }
  return bestFallback;
}

function buildMinimalRepairCandidate(
  initialEval: EvaluatedCandidate,
  profiles: readonly DeviceProfile[],
  profilesById: ReadonlyMap<string, DeviceProfile>
): Map<string, PlacementSlot> {
  const placements = new Map<string, PlacementSlot>();
  const rack = initialEval.project.rack;

  const affectedIds = new Set<string>();
  for (const issue of initialEval.validation.issues) {
    if (
      issue.code === 'CHASSIS_COLLISION' ||
      issue.code === 'PLUG_CLEARANCE_COLLISION' ||
      issue.code === 'OUT_OF_RACK_BOUNDS' ||
      issue.code === 'TOP_HEAVY_RACK' ||
      issue.code === 'NO_FRONT_TO_REAR_PORTAL' ||
      issue.code === 'THERMAL_HOTSPOT_STACKING'
    ) {
      for (const id of issue.affected_instances) {
        affectedIds.add(id);
      }
    }
  }

  for (const prof of profiles) {
    if (prof.pinned) {
      placements.set(prof.device.instance_id, {
        u_position: prof.device.u_position,
        face: prof.device.face
      });
    }
  }

  for (const prof of profiles) {
    if (prof.pinned || affectedIds.has(prof.device.instance_id)) {
      continue;
    }
    if (
      canPlaceFast(
        placements,
        profilesById,
        rack,
        prof,
        prof.device.u_position,
        prof.device.face
      )
    ) {
      placements.set(prof.device.instance_id, {
        u_position: prof.device.u_position,
        face: prof.device.face
      });
    }
  }

  const unplaced = profiles.filter(
    (p) => !placements.has(p.device.instance_id)
  );
  unplaced.sort((a, b) => {
    const rolePriority = (r: FunctionalRole): number => {
      switch (r) {
        case 'ups':
          return 0;
        case 'heavy-floor':
          return 1;
        case 'patch-panel':
          return 2;
        case 'switch':
          return 3;
        case 'brush-panel':
          return 4;
        case 'compute':
        case 'router':
          return 5;
        case 'pdu':
          return 6;
        case 'blank-panel':
          return 7;
      }
    };
    const diff = rolePriority(a.role) - rolePriority(b.role);
    if (diff !== 0) {
      return diff;
    }
    return a.index - b.index;
  });

  const midU = Math.ceil(rack.u_height / 2);

  for (const prof of unplaced) {
    const maxStartU = Math.max(1, rack.u_height - prof.uSpan + 1);
    const candidates: PlacementSlot[] = [];

    const orderedUs: number[] = [];
    for (let u = 1; u <= maxStartU; u++) {
      orderedUs.push(u);
    }

    if (prof.role === 'ups' || prof.role === 'heavy-floor') {
      orderedUs.sort((a, b) => a - b);
    } else if (prof.role === 'patch-panel' || prof.role === 'switch') {
      orderedUs.sort((a, b) => b - a);
    } else if (prof.role === 'brush-panel') {
      orderedUs.sort((a, b) => Math.abs(a - midU) - Math.abs(b - midU));
    } else {
      orderedUs.sort(
        (a, b) =>
          Math.abs(a - prof.device.u_position) -
          Math.abs(b - prof.device.u_position)
      );
    }

    if (prof.role === 'pdu' && prof.rearMountable) {
      const scoredRearUs = [...orderedUs].sort((a, b) => {
        const frontDepthAt = (uPos: number): number => {
          let maxD = 0;
          for (const [id, slot] of placements.entries()) {
            if (slot.face !== 'front') {
              continue;
            }
            const p = profilesById.get(id);
            if (!p) {
              continue;
            }
            if (uPos >= slot.u_position && uPos <= slot.u_position + p.uSpan - 1) {
              maxD = Math.max(maxD, p.inwardDepthFrontMm);
            }
          }
          return maxD;
        };
        const dA = frontDepthAt(a);
        const dB = frontDepthAt(b);
        if (dA !== dB) {
          return dA - dB;
        }
        return (
          Math.abs(a - prof.device.u_position) -
          Math.abs(b - prof.device.u_position)
        );
      });
      for (const u of scoredRearUs) {
        candidates.push({ u_position: u, face: 'rear' });
      }
      if (prof.frontMountable) {
        for (const u of orderedUs) {
          candidates.push({ u_position: u, face: 'front' });
        }
      }
    } else {
      const primaryFace: RackFace =
        prof.device.face === 'rear' && prof.rearMountable ? 'rear' : 'front';
      for (const u of orderedUs) {
        candidates.push({ u_position: u, face: primaryFace });
      }
    }

    const chosen = findBestAvailableSlot(
      placements,
      profilesById,
      rack,
      prof,
      candidates
    );
    placements.set(prof.device.instance_id, chosen);
  }

  return placements;
}

interface ZonedStrategyOptions {
  readonly preferRearForAllPdus: boolean;
  readonly reserveMidPortalGap: boolean;
  readonly separatePassiveHotspots: boolean;
  readonly clusterAroundPinned: boolean;
}

function isAdjacentToHighHeatPassive(
  placements: ReadonlyMap<string, PlacementSlot>,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  u: number,
  uSpan: number,
  face: RackFace
): boolean {
  const uEnd = u + uSpan - 1;
  for (const [id, slot] of placements.entries()) {
    const prof = profilesById.get(id);
    if (prof === undefined || !prof.isPassiveHighHeat) {
      continue;
    }
    if (slot.face !== face) {
      continue;
    }
    const otherEnd = slot.u_position + prof.uSpan - 1;
    if (slot.u_position === uEnd + 1 || u === otherEnd + 1) {
      return true;
    }
  }
  return false;
}

function buildZonedCandidate(
  project: RackProject,
  catalog: BlueprintCatalogMap,
  profiles: readonly DeviceProfile[],
  profilesById: ReadonlyMap<string, DeviceProfile>,
  connectivity: ReadonlyMap<string, ReadonlyMap<string, number>>,
  strategy: ZonedStrategyOptions
): Map<string, PlacementSlot> {
  const rack = project.rack;
  const placements = new Map<string, PlacementSlot>();

  for (const prof of profiles) {
    if (prof.pinned) {
      placements.set(prof.device.instance_id, {
        u_position: prof.device.u_position,
        face: prof.device.face
      });
    }
  }

  const unpinned = profiles.filter((p) => !p.pinned);
  const upsList = unpinned
    .filter((p) => p.role === 'ups')
    .sort((a, b) => {
      if (b.totalWeightGrams !== a.totalWeightGrams) {
        return b.totalWeightGrams - a.totalWeightGrams;
      }
      if (b.uSpan !== a.uSpan) {
        return b.uSpan - a.uSpan;
      }
      return a.device.instance_id.localeCompare(b.device.instance_id);
    });

  const heavyFloorList = unpinned
    .filter((p) => p.role === 'heavy-floor')
    .sort((a, b) => {
      if (b.totalWeightGrams !== a.totalWeightGrams) {
        return b.totalWeightGrams - a.totalWeightGrams;
      }
      return a.device.instance_id.localeCompare(b.device.instance_id);
    });

  const patchPanelList = unpinned
    .filter((p) => p.role === 'patch-panel')
    .sort((a, b) => {
      if (a.hasExternalEndpoints !== b.hasExternalEndpoints) {
        return a.hasExternalEndpoints ? -1 : 1;
      }
      return a.device.instance_id.localeCompare(b.device.instance_id);
    });

  const brushPanelList = unpinned
    .filter((p) => p.role === 'brush-panel')
    .sort((a, b) => a.device.instance_id.localeCompare(b.device.instance_id));

  const switchRouterList = unpinned
    .filter((p) => p.role === 'switch' || p.role === 'router')
    .sort((a, b) => {
      const roleOrder = (r: FunctionalRole) => (r === 'switch' ? 0 : 1);
      const rd = roleOrder(a.role) - roleOrder(b.role);
      if (rd !== 0) {
        return rd;
      }
      const connScore = (id: string): number => {
        const edges = connectivity.get(id);
        if (!edges) {
          return 0;
        }
        let sum = 0;
        for (const [peerId, w] of edges.entries()) {
          const peerRole = profilesById.get(peerId)?.role;
          if (peerRole === 'patch-panel') {
            sum += w * 10;
          } else {
            sum += w;
          }
        }
        return sum;
      };
      const cd = connScore(b.device.instance_id) - connScore(a.device.instance_id);
      if (cd !== 0) {
        return cd;
      }
      return a.device.instance_id.localeCompare(b.device.instance_id);
    });

  const computeList = unpinned
    .filter((p) => p.role === 'compute')
    .sort((a, b) => {
      if (b.totalWeightGrams !== a.totalWeightGrams) {
        return b.totalWeightGrams - a.totalWeightGrams;
      }
      return a.device.instance_id.localeCompare(b.device.instance_id);
    });

  const blankPanelList = unpinned
    .filter((p) => p.role === 'blank-panel')
    .sort((a, b) => a.device.instance_id.localeCompare(b.device.instance_id));

  const pduList = unpinned
    .filter((p) => p.role === 'pdu')
    .sort((a, b) => a.device.instance_id.localeCompare(b.device.instance_id));

  const placeWithPreferredUs = (
    prof: DeviceProfile,
    orderedUs: readonly number[],
    face: RackFace,
    reservedPortalU: number | null,
    fallbackFace?: RackFace
  ) => {
    const filteredPreferred: PlacementSlot[] = [];
    const nonHotspotSlots: PlacementSlot[] = [];

    for (const u of orderedUs) {
      if (
        reservedPortalU !== null &&
        prof.role !== 'brush-panel' &&
        reservedPortalU >= u &&
        reservedPortalU <= u + prof.uSpan - 1
      ) {
        continue;
      }
      const slot: PlacementSlot = { u_position: u, face };
      if (
        strategy.separatePassiveHotspots &&
        prof.isPassiveHighHeat &&
        isAdjacentToHighHeatPassive(
          placements,
          profilesById,
          u,
          prof.uSpan,
          face
        )
      ) {
        filteredPreferred.push(slot);
      } else {
        nonHotspotSlots.push(slot);
      }
    }

    const candidates: PlacementSlot[] = [
      ...nonHotspotSlots,
      ...filteredPreferred
    ];
    if (reservedPortalU !== null) {
      for (const u of orderedUs) {
        if (reservedPortalU >= u && reservedPortalU <= u + prof.uSpan - 1) {
          candidates.push({ u_position: u, face });
        }
      }
    }
    if (fallbackFace !== undefined) {
      for (const u of orderedUs) {
        candidates.push({ u_position: u, face: fallbackFace });
      }
    }

    const chosen = findBestAvailableSlot(
      placements,
      profilesById,
      rack,
      prof,
      candidates
    );
    placements.set(prof.device.instance_id, chosen);
  };

  const allUsAsc = (uSpan: number): number[] => {
    const maxU = Math.max(1, rack.u_height - uSpan + 1);
    const out: number[] = [];
    for (let u = 1; u <= maxU; u++) {
      out.push(u);
    }
    return out;
  };

  const allUsDesc = (uSpan: number): number[] => {
    return allUsAsc(uSpan).reverse();
  };

  const totalNonBlankFrontU = profiles
    .filter(
      (p) =>
        p.role !== 'blank-panel' &&
        p.role !== 'pdu' &&
        (p.pinned ? p.device.face === 'front' : true)
    )
    .reduce((sum, p) => sum + p.uSpan, 0);

  const hasPotentialCrossFace =
    project.cables.length > 0 &&
    (pduList.length > 0 ||
      profiles.some((p) => p.device.face === 'rear') ||
      projectHasCrossFaceNeeds(project, catalog, profilesById, placements));

  const midU = Math.ceil(rack.u_height / 2);
  let reservedPortalU: number | null = null;
  if (
    strategy.reserveMidPortalGap &&
    hasPotentialCrossFace &&
    brushPanelList.length === 0 &&
    !profiles.some((p) => p.pinned && p.role === 'brush-panel') &&
    totalNonBlankFrontU < rack.u_height
  ) {
    const freeMidCandidates = allUsAsc(1)
      .filter((u) => {
        for (const p of profiles) {
          if (!p.pinned || p.device.face !== 'front') {
            continue;
          }
          if (u >= p.device.u_position && u <= p.device.u_position + p.uSpan - 1) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => Math.abs(a - midU) - Math.abs(b - midU));
    reservedPortalU = freeMidCandidates[0] ?? null;
  }

  // Zone A: UPS & heavy floor-hugging equipment from U1 upward
  for (const prof of upsList) {
    placeWithPreferredUs(
      prof,
      allUsAsc(prof.uSpan),
      prof.device.face === 'rear' && !prof.frontMountable ? 'rear' : 'front',
      reservedPortalU
    );
  }
  for (const prof of heavyFloorList) {
    placeWithPreferredUs(
      prof,
      allUsAsc(prof.uSpan),
      prof.device.face === 'rear' && !prof.frontMountable ? 'rear' : 'front',
      reservedPortalU
    );
  }

  // Zone C1: Patch panels from top downward (or keep rear if rear-only)
  for (const prof of patchPanelList) {
    placeWithPreferredUs(
      prof,
      allUsDesc(prof.uSpan),
      prof.device.face === 'rear' && !prof.frontMountable ? 'rear' : 'front',
      reservedPortalU
    );
  }

  // Zone C2: Core switches & routers clustered adjacent to connected patch panels / peers
  for (const prof of switchRouterList) {
    const edges = connectivity.get(prof.device.instance_id);
    const targetAnchorUs: Array<{ readonly u: number; readonly weight: number }> = [];

    if (edges) {
      for (const [peerId, w] of edges.entries()) {
        const placedPeer = placements.get(peerId);
        const peerProf = profilesById.get(peerId);
        if (placedPeer !== undefined && peerProf !== undefined) {
          const boost =
            peerProf.role === 'patch-panel'
              ? 8
              : peerProf.role === 'switch'
                ? 4
                : strategy.clusterAroundPinned && peerProf.pinned
                  ? 5
                  : 1;
          targetAnchorUs.push({
            u: placedPeer.u_position,
            weight: w * boost
          });
        }
      }
    }

    if (targetAnchorUs.length === 0) {
      for (const [placedId, slot] of placements.entries()) {
        if (profilesById.get(placedId)?.role === 'patch-panel') {
          targetAnchorUs.push({ u: slot.u_position, weight: 5 });
        }
      }
    }

    const orderedUs = allUsDesc(prof.uSpan);
    if (targetAnchorUs.length > 0) {
      const totalWeight = targetAnchorUs.reduce((s, a) => s + a.weight, 0);
      const weightedAnchor =
        targetAnchorUs.reduce((s, a) => s + a.u * a.weight, 0) / totalWeight;
      orderedUs.sort((a, b) => {
        const distA = Math.abs(a - weightedAnchor);
        const distB = Math.abs(b - weightedAnchor);
        if (Math.abs(distA - distB) > 0.25) {
          return distA - distB;
        }
        return b - a;
      });
    }

    placeWithPreferredUs(
      prof,
      orderedUs,
      prof.device.face === 'rear' && !prof.frontMountable ? 'rear' : 'front',
      reservedPortalU
    );
  }

  // Zone B1: Brush panel at mid-height (within +/- 3U of cross-face cables)
  for (const prof of brushPanelList) {
    const orderedUs = allUsAsc(prof.uSpan).sort(
      (a, b) => Math.abs(a - midU) - Math.abs(b - midU)
    );
    placeWithPreferredUs(prof, orderedUs, 'front', null);
  }

  // Zone B2: Compute / carriers / shelves above Zone A and below Zone C
  for (const prof of computeList) {
    const orderedUs = allUsAsc(prof.uSpan);
    const face: RackFace =
      prof.device.face === 'rear' && prof.rearMountable ? 'rear' : 'front';
    placeWithPreferredUs(prof, orderedUs, face, reservedPortalU);
  }

  // Rear PDUs (if strategy prefers rear for all rear-mountable PDUs or PDU was originally rear)
  const frontPdus: DeviceProfile[] = [];
  const rearPdus: DeviceProfile[] = [];
  for (const prof of pduList) {
    if (
      prof.rearMountable &&
      (strategy.preferRearForAllPdus || prof.device.face === 'rear')
    ) {
      rearPdus.push(prof);
    } else {
      frontPdus.push(prof);
    }
  }

  for (const prof of rearPdus) {
    const rearUs = allUsAsc(prof.uSpan);
    const scoreRearSlot = (uPos: number): number => {
      const uEnd = uPos + prof.uSpan - 1;
      let worstFrontDepth = 0;
      let frontRoleBonus = 0;
      for (const [id, slot] of placements.entries()) {
        if (slot.face !== 'front') {
          continue;
        }
        const fProf = profilesById.get(id);
        if (!fProf) {
          continue;
        }
        const fEnd = slot.u_position + fProf.uSpan - 1;
        if (Math.max(uPos, slot.u_position) <= Math.min(uEnd, fEnd)) {
          worstFrontDepth = Math.max(worstFrontDepth, fProf.inwardDepthFrontMm);
          if (
            fProf.role === 'blank-panel' ||
            fProf.role === 'brush-panel' ||
            fProf.role === 'patch-panel'
          ) {
            frontRoleBonus -= 10;
          }
        }
      }
      // Also favor proximity to connected devices if any
      let cableDist = 0;
      const edges = connectivity.get(prof.device.instance_id);
      if (edges) {
        for (const [peerId, w] of edges.entries()) {
          const peerSlot = placements.get(peerId);
          if (peerSlot) {
            cableDist += Math.abs(uPos - peerSlot.u_position) * w * 2;
          }
        }
      }
      return worstFrontDepth + frontRoleBonus + cableDist;
    };

    rearUs.sort((a, b) => scoreRearSlot(a) - scoreRearSlot(b));
    const candidates: PlacementSlot[] = rearUs.map((u) => ({
      u_position: u,
      face: 'rear'
    }));
    if (prof.frontMountable) {
      for (const u of allUsAsc(prof.uSpan)) {
        candidates.push({ u_position: u, face: 'front' });
      }
    }
    const chosen = findBestAvailableSlot(
      placements,
      profilesById,
      rack,
      prof,
      candidates
    );
    placements.set(prof.device.instance_id, chosen);
  }

  for (const prof of frontPdus) {
    const orderedUs = allUsAsc(prof.uSpan);
    placeWithPreferredUs(
      prof,
      orderedUs,
      'front',
      reservedPortalU,
      prof.rearMountable ? 'rear' : undefined
    );
  }

  // Blank / Cover panels: prefer slots that already have a rear PDU behind them or away from mid-portal
  for (const prof of blankPanelList) {
    const orderedUs = allUsAsc(prof.uSpan).sort((a, b) => {
      const hasRearPdu = (uPos: number): boolean => {
        for (const [id, slot] of placements.entries()) {
          if (slot.face === 'rear' && profilesById.get(id)?.role === 'pdu') {
            const p = profilesById.get(id)!;
            if (uPos >= slot.u_position && uPos <= slot.u_position + p.uSpan - 1) {
              return true;
            }
          }
        }
        return false;
      };
      const rA = hasRearPdu(a) ? 0 : 1;
      const rB = hasRearPdu(b) ? 0 : 1;
      if (rA !== rB) {
        return rA - rB;
      }
      return Math.abs(b - midU) - Math.abs(a - midU);
    });
    placeWithPreferredUs(prof, orderedUs, 'front', reservedPortalU);
  }

  return placements;
}

function evaluateCandidateIfPromising(
  candProject: RackProject,
  catalog: BlueprintCatalogMap,
  profilesById: ReadonlyMap<string, DeviceProfile>,
  initialPlacements: ReadonlyMap<string, PlacementSlot>,
  maxPrimaryScore: number
): EvaluatedCandidate | undefined {
  const geometry = computeRackGeometry(candProject, catalog);
  const validation = validateRackProject(candProject, catalog, geometry);
  const cogExcess = Math.max(
    0,
    validation.mechanical_summary.normalized_cog_y - 0.45
  );
  const prefixScore =
    validation.error_count * 1_000_000 +
    validation.warning_count * 10_000 +
    cogExcess * 5_000 +
    computeFloorHuggingPenalty(candProject, profilesById);
  if (prefixScore > maxPrimaryScore + SCORE_EPSILON) {
    return undefined;
  }

  const routes = routeProjectCables(candProject, catalog, geometry);
  const totalCableLen = roundCentis(
    routes.reduce((sum, r) => sum + r.raw_arc_length_mm, 0)
  );
  const metrics: OptimizationMetrics = {
    error_count: validation.error_count,
    warning_count: validation.warning_count,
    normalized_cog_y: validation.mechanical_summary.normalized_cog_y,
    total_cable_length_mm: totalCableLen
  };
  return {
    project: candProject,
    geometry,
    validation,
    metrics,
    primaryScore: computePrimaryScore(metrics, candProject, profilesById),
    zoningScore: computeZoningScore(
      candProject,
      profilesById,
      geometry,
      initialPlacements
    )
  };
}

function refineCandidateWithLocalSearch(
  startEval: EvaluatedCandidate,
  catalog: BlueprintCatalogMap,
  profiles: readonly DeviceProfile[],
  profilesById: ReadonlyMap<string, DeviceProfile>,
  initialPlacements: ReadonlyMap<string, PlacementSlot>
): EvaluatedCandidate {
  let current = startEval;
  const rack = current.project.rack;
  const unpinned = profiles.filter((p) => !p.pinned);
  if (unpinned.length === 0) {
    return current;
  }

  const maxPasses = 3;

  for (let pass = 0; pass < maxPasses; pass++) {
    let improvedInPass = false;
    const placements = extractPlacementMap(current.project);

    // 1. Single-device moves
    for (const prof of unpinned) {
      const currentSlot = placements.get(prof.device.instance_id);
      if (currentSlot === undefined) {
        continue;
      }
      const allowedFaces: RackFace[] =
        prof.role === 'pdu' && prof.rearMountable
          ? prof.frontMountable
            ? ['rear', 'front']
            : ['rear']
          : prof.device.face === 'rear'
            ? prof.frontMountable
              ? ['rear', 'front']
              : ['rear']
            : ['front'];

      const maxStartU = Math.max(1, rack.u_height - prof.uSpan + 1);
      let bestMoveEval: EvaluatedCandidate | undefined;

      for (const face of allowedFaces) {
        for (let u = 1; u <= maxStartU; u++) {
          if (u === currentSlot.u_position && face === currentSlot.face) {
            continue;
          }
          if (
            !canPlaceFast(placements, profilesById, rack, prof, u, face)
          ) {
            continue;
          }
          const candMap = new Map(placements);
          candMap.set(prof.device.instance_id, { u_position: u, face });
          const candProject = buildProjectWithPlacements(
            current.project,
            candMap
          );
          const targetEval = bestMoveEval ?? current;
          const candEval = evaluateCandidateIfPromising(
            candProject,
            catalog,
            profilesById,
            initialPlacements,
            targetEval.primaryScore
          );
          if (candEval !== undefined && isStrictlyBetter(candEval, targetEval)) {
            bestMoveEval = candEval;
          }
        }
      }

      if (bestMoveEval !== undefined) {
        current = bestMoveEval;
        const nextSlot = extractPlacementMap(current.project).get(
          prof.device.instance_id
        );
        if (nextSlot) {
          placements.set(prof.device.instance_id, nextSlot);
        }
        improvedInPass = true;
      }
    }

    // 2. Pairwise swaps (essential for 100%-full racks!)
    for (let i = 0; i < unpinned.length; i++) {
      const profA = unpinned[i]!;
      const slotA = placements.get(profA.device.instance_id);
      if (slotA === undefined) {
        continue;
      }

      for (let j = i + 1; j < unpinned.length; j++) {
        const profB = unpinned[j]!;
        const slotB = placements.get(profB.device.instance_id);
        if (slotB === undefined) {
          continue;
        }
        if (slotA.face !== slotB.face) {
          continue;
        }

        const reducedMap = new Map(placements);
        reducedMap.delete(profA.device.instance_id);
        reducedMap.delete(profB.device.instance_id);

        if (
          !canPlaceFast(
            reducedMap,
            profilesById,
            rack,
            profA,
            slotB.u_position,
            slotA.face
          )
        ) {
          continue;
        }
        reducedMap.set(profA.device.instance_id, {
          u_position: slotB.u_position,
          face: slotA.face
        });
        if (
          !canPlaceFast(
            reducedMap,
            profilesById,
            rack,
            profB,
            slotA.u_position,
            slotB.face
          )
        ) {
          continue;
        }
        reducedMap.set(profB.device.instance_id, {
          u_position: slotA.u_position,
          face: slotB.face
        });

        const candProject = buildProjectWithPlacements(
          current.project,
          reducedMap
        );
        const candEval = evaluateCandidateIfPromising(
          candProject,
          catalog,
          profilesById,
          initialPlacements,
          current.primaryScore
        );
        if (candEval !== undefined && isStrictlyBetter(candEval, current)) {
          current = candEval;
          placements.set(profA.device.instance_id, {
            u_position: slotB.u_position,
            face: slotA.face
          });
          placements.set(profB.device.instance_id, {
            u_position: slotA.u_position,
            face: slotB.face
          });
          improvedInPass = true;
          break;
        }
      }
    }

    // 3. 2U <-> (1U + 1U) block swap on full racks
    const twoUDevices = unpinned.filter((p) => p.uSpan === 2);
    const oneUByKey = new Map<string, DeviceProfile>();
    for (const p of unpinned) {
      if (p.uSpan === 1) {
        const s = placements.get(p.device.instance_id);
        if (s) {
          oneUByKey.set(`${s.face}:${s.u_position}`, p);
        }
      }
    }
    for (const prof2U of twoUDevices) {
      const slot2U = placements.get(prof2U.device.instance_id);
      if (!slot2U) {
        continue;
      }
      for (let u = 1; u <= rack.u_height - 1; u++) {
        const oneA = oneUByKey.get(`${slot2U.face}:${u}`);
        const oneB = oneUByKey.get(`${slot2U.face}:${u + 1}`);
        if (!oneA || !oneB) {
          continue;
        }
        const candMap = new Map(placements);
        candMap.delete(prof2U.device.instance_id);
        candMap.delete(oneA.device.instance_id);
        candMap.delete(oneB.device.instance_id);

        if (
          !canPlaceFast(candMap, profilesById, rack, prof2U, u, slot2U.face)
        ) {
          continue;
        }
        candMap.set(prof2U.device.instance_id, {
          u_position: u,
          face: slot2U.face
        });
        if (
          !canPlaceFast(
            candMap,
            profilesById,
            rack,
            oneA,
            slot2U.u_position,
            slot2U.face
          )
        ) {
          continue;
        }
        candMap.set(oneA.device.instance_id, {
          u_position: slot2U.u_position,
          face: slot2U.face
        });
        if (
          !canPlaceFast(
            candMap,
            profilesById,
            rack,
            oneB,
            slot2U.u_position + 1,
            slot2U.face
          )
        ) {
          continue;
        }
        candMap.set(oneB.device.instance_id, {
          u_position: slot2U.u_position + 1,
          face: slot2U.face
        });

        const candProject = buildProjectWithPlacements(current.project, candMap);
        const candEval = evaluateCandidateIfPromising(
          candProject,
          catalog,
          profilesById,
          initialPlacements,
          current.primaryScore
        );
        if (candEval !== undefined && isStrictlyBetter(candEval, current)) {
          current = candEval;
          placements.set(prof2U.device.instance_id, {
            u_position: u,
            face: slot2U.face
          });
          placements.set(oneA.device.instance_id, {
            u_position: slot2U.u_position,
            face: slot2U.face
          });
          placements.set(oneB.device.instance_id, {
            u_position: slot2U.u_position + 1,
            face: slot2U.face
          });
          oneUByKey.delete(`${slot2U.face}:${u}`);
          oneUByKey.delete(`${slot2U.face}:${u + 1}`);
          oneUByKey.set(`${slot2U.face}:${slot2U.u_position}`, oneA);
          oneUByKey.set(`${slot2U.face}:${slot2U.u_position + 1}`, oneB);
          improvedInPass = true;
          break;
        }
      }
    }

    if (!improvedInPass) {
      break;
    }
  }

  return current;
}

function describeMoveReason(
  profile: DeviceProfile,
  fromU: number,
  toU: number,
  fromFace: RackFace,
  toFace: RackFace,
  beforeIssues: ValidationResult['issues'],
  afterEval: EvaluatedCandidate
): string {
  const id = profile.device.instance_id;
  const hadSpatialError = beforeIssues.some(
    (issue) =>
      issue.affected_instances.includes(id) &&
      (issue.code === 'CHASSIS_COLLISION' ||
        issue.code === 'OUT_OF_RACK_BOUNDS')
  );
  const hadPlugError = beforeIssues.some(
    (issue) =>
      issue.affected_instances.includes(id) &&
      issue.code === 'PLUG_CLEARANCE_COLLISION'
  );
  const hadPortalError = beforeIssues.some(
    (issue) => issue.code === 'NO_FRONT_TO_REAR_PORTAL'
  );
  const hadHotspot = beforeIssues.some(
    (issue) =>
      issue.affected_instances.includes(id) &&
      issue.code === 'THERMAL_HOTSPOT_STACKING'
  );

  if (profile.role === 'pdu' && toFace === 'rear') {
    if (hadPlugError || fromFace !== toFace) {
      return `Assigned rear-face PDU behind shallow/empty front slot at U${toU} to prevent Z-depth and plug clearance collisions`;
    }
    return `Relocated rear-face PDU from U${fromU} to U${toU} behind shallow front clearance`;
  }

  if (hadSpatialError) {
    return `Relocated from U${fromU} (${fromFace}) to collision-free slot U${toU} (${toFace})`;
  }

  if (hadPlugError) {
    return `Moved from U${fromU} (${fromFace}) to U${toU} (${toFace}) to eliminate plug clearance collision`;
  }

  if (
    (profile.role === 'ups' || profile.role === 'heavy-floor') &&
    toU < fromU
  ) {
    return `Lowered heavy ${profile.role === 'ups' ? 'UPS' : 'equipment'} (${profile.totalWeightGrams}g) from U${fromU} to U${toU} to bring normalized CoG to ${afterEval.metrics.normalized_cog_y}`;
  }

  if (profile.role === 'brush-panel' && hadPortalError) {
    return `Positioned brush-panel at mid-height U${toU} to restore front-to-rear cable portal`;
  }

  if (profile.role === 'patch-panel') {
    return `Positioned patch panel at U${toU} in upper wiring zone`;
  }

  if (profile.role === 'switch' || profile.role === 'router') {
    return `Clustered ${profile.role} at U${toU} adjacent to connected patch panel/peers to minimize cable spans`;
  }

  if (hadHotspot) {
    return `Separated passive high-heat device from U${fromU} to U${toU} to eliminate thermal hotspot stacking`;
  }

  return `Optimized placement from U${fromU} (${fromFace}) to U${toU} (${toFace}) for improved layout score`;
}

/**
 * Deterministically optimizes top-level rack device U positions and rear PDU faces
 * using the full 3D geometry, 5-stage validation, and Catmull-Rom cable routing engines.
 *
 * Guarantees:
 * - Preserves `carrier-slot` sub-modules inside their parent carriers untouched.
 * - Respects `rack.u_height` bounds and `pin_instance_ids`.
 * - Never mutates input objects; returns a strictly non-regressing layout (or unchanged original).
 */
export function optimizeRackLayout(
  projectInput: RackProject | RackProjectInput,
  catalog: BlueprintCatalogMap,
  options?: OptimizeRackLayoutOptions
): OptimizeRackResult {
  const initialProject = RackProjectSchema.parse(projectInput);
  const pinIds = new Set<string>(options?.pin_instance_ids ?? []);
  const profiles = buildDeviceProfiles(initialProject, catalog, pinIds);
  const profilesById = new Map<string, DeviceProfile>(
    profiles.map((p) => [p.device.instance_id, p] as const)
  );
  const initialPlacements = extractPlacementMap(initialProject);

  const beforeEval = evaluateCandidateFull(
    initialProject,
    catalog,
    profilesById,
    initialPlacements
  );

  const allPinned =
    profiles.length === 0 || profiles.every((p) => p.pinned);
  if (allPinned) {
    return {
      optimized_project: initialProject,
      moved_devices: [],
      metrics_before: beforeEval.metrics,
      metrics_after: beforeEval.metrics,
      improved: false
    };
  }

  const connectivity = buildUnitConnectivityMap(initialProject);

  const placementCandidates: Map<string, PlacementSlot>[] = [
    buildMinimalRepairCandidate(beforeEval, profiles, profilesById)
  ];

  const zonedConfigs: readonly ZonedStrategyOptions[] = [
    {
      preferRearForAllPdus: true,
      reserveMidPortalGap: true,
      separatePassiveHotspots: true,
      clusterAroundPinned: true
    },
    {
      preferRearForAllPdus: false,
      reserveMidPortalGap: true,
      separatePassiveHotspots: true,
      clusterAroundPinned: true
    },
    {
      preferRearForAllPdus: true,
      reserveMidPortalGap: false,
      separatePassiveHotspots: false,
      clusterAroundPinned: true
    },
    {
      preferRearForAllPdus: true,
      reserveMidPortalGap: true,
      separatePassiveHotspots: true,
      clusterAroundPinned: false
    }
  ];

  for (const cfg of zonedConfigs) {
    placementCandidates.push(
      buildZonedCandidate(
        initialProject,
        catalog,
        profiles,
        profilesById,
        connectivity,
        cfg
      )
    );
  }

  const evaluatedSeeds: EvaluatedCandidate[] = [beforeEval];
  const seenKeys = new Set<string>();
  const serializePlacementKey = (map: ReadonlyMap<string, PlacementSlot>) =>
    profiles
      .map((p) => {
        const s = map.get(p.device.instance_id);
        return `${p.device.instance_id}@${s?.u_position ?? p.device.u_position}:${s?.face ?? p.device.face}`;
      })
      .join('|');

  seenKeys.add(serializePlacementKey(initialPlacements));

  for (const candMap of placementCandidates) {
    const key = serializePlacementKey(candMap);
    if (seenKeys.has(key)) {
      continue;
    }
    seenKeys.add(key);
    const candProject = buildProjectWithPlacements(initialProject, candMap);
    evaluatedSeeds.push(
      evaluateCandidateFull(
        candProject,
        catalog,
        profilesById,
        initialPlacements
      )
    );
  }

  // Pick top 2 distinct seeds (best overall + initial/minimal-repair) for local search refinement
  evaluatedSeeds.sort((a, b) => {
    if (Math.abs(a.primaryScore - b.primaryScore) > SCORE_EPSILON) {
      return a.primaryScore - b.primaryScore;
    }
    return a.zoningScore - b.zoningScore;
  });

  const seedsToRefine: EvaluatedCandidate[] = [];
  if (evaluatedSeeds[0] !== undefined) {
    seedsToRefine.push(evaluatedSeeds[0]);
  }
  if (evaluatedSeeds[0] !== beforeEval) {
    seedsToRefine.push(beforeEval);
  }

  let bestEval = beforeEval;
  for (const seed of seedsToRefine) {
    const refined = refineCandidateWithLocalSearch(
      seed,
      catalog,
      profiles,
      profilesById,
      initialPlacements
    );
    if (isStrictlyBetter(refined, bestEval)) {
      bestEval = refined;
    }
  }

  if (!isNonRegressingImprovement(bestEval, beforeEval)) {
    return {
      optimized_project: initialProject,
      moved_devices: [],
      metrics_before: beforeEval.metrics,
      metrics_after: beforeEval.metrics,
      improved: false
    };
  }

  const movedDevices: MovedDeviceRecord[] = [];
  for (let i = 0; i < initialProject.mounted_devices.length; i++) {
    const orig = initialProject.mounted_devices[i]!;
    const next = bestEval.project.mounted_devices[i]!;
    if (orig.u_position !== next.u_position || orig.face !== next.face) {
      const prof = profilesById.get(orig.instance_id)!;
      movedDevices.push({
        instance_id: orig.instance_id,
        from_u: orig.u_position,
        to_u: next.u_position,
        from_face: orig.face,
        to_face: next.face,
        reason: describeMoveReason(
          prof,
          orig.u_position,
          next.u_position,
          orig.face,
          next.face,
          beforeEval.validation.issues,
          bestEval
        )
      });
    }
  }

  if (movedDevices.length === 0) {
    return {
      optimized_project: initialProject,
      moved_devices: [],
      metrics_before: beforeEval.metrics,
      metrics_after: beforeEval.metrics,
      improved: false
    };
  }

  return {
    optimized_project: bestEval.project,
    moved_devices: movedDevices,
    metrics_before: beforeEval.metrics,
    metrics_after: bestEval.metrics,
    improved: true
  };
}
