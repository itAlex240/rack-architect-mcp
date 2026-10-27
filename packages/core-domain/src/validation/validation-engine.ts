import {
  AABB_INTERSECTION_EPSILON_MM,
  type BlueprintCatalogMap,
  type ComputedDeviceGeometry,
  type ComputedPortGeometry,
  type ComputedRackGeometry,
  computeRackGeometry,
  getBoxIntersection,
  lookupBlueprint,
  type PortPlugClearance,
  resolveCableEndpointPortGeometry,
  roundCentis,
  roundMm,
  roundTenths
} from '../geometry/index.js';
import {
  type CableConnection,
  type ConnectorType,
  DELTA_Z_PLUG_MM,
  type DiagnosticIssue,
  MM_PER_U,
  POE_CLASS_WATTS,
  type PortCapability,
  type PowerSourceSummary,
  type PseBudgetSummary,
  type RackFace,
  type RackProject,
  type RemediationAction,
  type ValidationResult
} from '../schemas/index.js';

/**
 * Determines which U positions (1..u_height) act as valid Front-to-Rear Cable Portals.
 * Per ARCHITECTURE.md Stage 4:
 * A valid Portal is:
 * - An unoccupied U gap on the front face
 * - A mounted `brush-panel` (or device with `geometry.has_cable_pass_through === true`)
 * - A device with a side aperture gap >= 15 mm that does not seal the full panel width with rack ears
 */
export function computeAvailablePortalUs(
  project: RackProject,
  geometry: ComputedRackGeometry
): number[] {
  const portals: number[] = [];
  const frontTopLevelDevices = geometry.devices.filter(
    (d) => d.mount_target === 'rack-unit' && d.face === 'front'
  );

  for (let u = 1; u <= project.rack.u_height; u++) {
    const occupying = frontTopLevelDevices.filter(
      (d) => u >= d.u_range[0] && u <= d.u_range[1]
    );

    if (occupying.length === 0) {
      portals.push(u);
      continue;
    }

    const hasPortalPassThrough = occupying.some((d) => {
      if (
        d.blueprint.category === 'brush-panel' ||
        d.blueprint.geometry.has_cable_pass_through === true
      ) {
        return true;
      }
      const sideGapMm =
        (geometry.aperture_width_mm - d.blueprint.geometry.width_mm) / 2;
      const sealsFrontFaceplate =
        d.blueprint.geometry.ear_mount_style !== 'none' &&
        d.blueprint.mount_type !== 'shelf-standing';
      return !sealsFrontFaceplate && sideGapMm >= 15;
    });

    if (hasPortalPassThrough) {
      portals.push(u);
    }
  }

  return portals;
}

/**
 * Probes all U positions (1..u_height) on `targetFace` to find where `deviceToMove`
 * can be placed without any chassis or plug clearance collision.
 */
export function findCollisionFreeUPositions(
  deviceToMove: ComputedDeviceGeometry,
  targetFace: RackFace,
  project: RackProject,
  geometry: ComputedRackGeometry
): { freeUs: number[]; zeroOppositeDepthUs: number[] } {
  const uSpan = Math.max(
    1,
    Math.ceil(deviceToMove.blueprint.geometry.u_height)
  );
  const freeUs: number[] = [];
  const zeroOppositeDepthUs: number[] = [];

  const otherTopLevel = geometry.devices.filter(
    (d) =>
      d.mount_target === 'rack-unit' &&
      d.instance_id !== deviceToMove.instance_id
  );

  for (
    let candidateU = 1;
    candidateU <= project.rack.u_height - uSpan + 1;
    candidateU++
  ) {
    const candStart = candidateU;
    const candEnd = candidateU + uSpan - 1;

    const sameFaceConflict = otherTopLevel.some(
      (d) =>
        d.face === targetFace &&
        Math.max(candStart, d.u_range[0]) <= Math.min(candEnd, d.u_range[1])
    );
    if (sameFaceConflict) {
      continue;
    }

    const oppositeDevices = geometry.devices.filter(
      (d) =>
        d.face !== targetFace &&
        Math.max(candStart, d.u_range[0]) <= Math.min(candEnd, d.u_range[1])
    );

    if (oppositeDevices.length === 0) {
      freeUs.push(candidateU);
      zeroOppositeDepthUs.push(candidateU);
      continue;
    }

    const maxPlugDeltaOnMovingDevice = deviceToMove.port_clearances.reduce(
      (max, pc) => {
        const pointsInward =
          (targetFace === 'front' && pc.world_normal.z > 0) ||
          (targetFace === 'rear' && pc.world_normal.z < 0);
        return pointsInward ? Math.max(max, pc.delta_z_mm) : max;
      },
      0
    );
    const movingDeviceRequiredDepth =
      deviceToMove.blueprint.geometry.depth_mm + maxPlugDeltaOnMovingDevice;

    const hasDepthConflict = oppositeDevices.some((opp) => {
      const oppInwardPlugDelta = opp.port_clearances.reduce((max, pc) => {
        const pointsInward =
          (opp.face === 'front' && pc.world_normal.z > 0) ||
          (opp.face === 'rear' && pc.world_normal.z < 0);
        return pointsInward ? Math.max(max, pc.delta_z_mm) : max;
      }, 0);
      const oppTotalDepth =
        opp.blueprint.geometry.depth_mm + oppInwardPlugDelta;
      return (
        movingDeviceRequiredDepth + oppTotalDepth > project.rack.rail_depth_mm
      );
    });

    if (!hasDepthConflict) {
      freeUs.push(candidateU);
    }
  }

  return { freeUs, zeroOppositeDepthUs };
}

/**
 * Checks physical connector compatibility between two ports.
 */
export function areConnectorsPhysicallyCompatible(
  a: ConnectorType,
  b: ConnectorType
): boolean {
  const rj45Group: readonly ConnectorType[] = ['rj45', 'rj45-serial-console'];
  if (rj45Group.includes(a) && rj45Group.includes(b)) {
    return true;
  }
  if (a === 'sfp-plus' && b === 'sfp-plus') {
    return true;
  }
  if (
    (a === 'iec-c13' && b === 'iec-c14') ||
    (a === 'iec-c14' && b === 'iec-c13') ||
    (a === 'schuko-cee7' && (b === 'iec-c14' || b === 'iec-c13')) ||
    ((a === 'iec-c14' || a === 'iec-c13') && b === 'schuko-cee7')
  ) {
    return true;
  }
  if (
    (a === 'dc-5525' &&
      (b === 'dc-5525' || b === 'schuko-cee7' || b === 'iec-c13')) ||
    ((a === 'schuko-cee7' || a === 'iec-c13') && b === 'dc-5525')
  ) {
    return true;
  }
  if (
    (a === 'usb-c' &&
      (b === 'usb-c' || b === 'schuko-cee7' || b === 'iec-c13')) ||
    ((a === 'schuko-cee7' || a === 'iec-c13') && b === 'usb-c')
  ) {
    return true;
  }
  if (a === 'usb-a' && b === 'usb-a') {
    return true;
  }
  if (a === 'audio-35mm' && b === 'audio-35mm') {
    return true;
  }
  return false;
}

/**
 * Checks signal/protocol compatibility between two physically compatible ports.
 */
export function arePortSignalsCompatible(
  portA: ComputedPortGeometry,
  portB: ComputedPortGeometry,
  cableType: string
): { compatible: boolean; reason?: string } {
  const isASerial =
    portA.connector_type === 'rj45-serial-console' ||
    (portA.capabilities.includes('serial-rs232') &&
      portA.capabilities.length === 1);
  const isBSerial =
    portB.connector_type === 'rj45-serial-console' ||
    (portB.capabilities.includes('serial-rs232') &&
      portB.capabilities.length === 1);

  if (isASerial !== isBSerial) {
    return {
      compatible: false,
      reason: `Cannot connect RJ45 serial console port ('${isASerial ? portA.port_id : portB.port_id}') directly to standard Ethernet port ('${isASerial ? portB.port_id : portA.port_id}') without a serial-to-Ethernet adapter.`
    };
  }

  const lowerCable = cableType.toLowerCase();
  const isPowerCable =
    lowerCable.startsWith('power-') ||
    lowerCable.includes('c13') ||
    lowerCable.includes('schuko') ||
    lowerCable.includes('dc-5525');
  const isDataPort =
    portA.connector_type === 'rj45' ||
    portA.connector_type === 'sfp-plus' ||
    portB.connector_type === 'rj45' ||
    portB.connector_type === 'sfp-plus';

  if (isPowerCable && isDataPort) {
    return {
      compatible: false,
      reason: `Power cable '${cableType}' cannot be used on data ports '${portA.port_id}' <-> '${portB.port_id}'.`
    };
  }

  return { compatible: true };
}

function extractPoeOutClassWatts(capabilities: readonly PortCapability[]): {
  supported: boolean;
  maxWatts: number;
  className: string;
} {
  if (capabilities.includes('poe-out-bt-type4')) {
    return {
      supported: true,
      maxWatts: POE_CLASS_WATTS['bt-type4'],
      className: 'bt-type4'
    };
  }
  if (capabilities.includes('poe-out-bt-type3')) {
    return {
      supported: true,
      maxWatts: POE_CLASS_WATTS['bt-type3'],
      className: 'bt-type3'
    };
  }
  if (capabilities.includes('poe-out-at') || capabilities.includes('poe+')) {
    return {
      supported: true,
      maxWatts: POE_CLASS_WATTS.at,
      className: 'at'
    };
  }
  if (capabilities.includes('poe-out-af') || capabilities.includes('poe-out')) {
    return {
      supported: true,
      maxWatts: POE_CLASS_WATTS.af,
      className: 'af'
    };
  }
  return { supported: false, maxWatts: 0, className: 'none' };
}

function isPoeInCapable(capabilities: readonly PortCapability[]): boolean {
  return capabilities.some((cap) => cap.startsWith('poe-in'));
}

/**
 * Returns the maximum supported Ethernet/Optical speed in Mbps for a given port capability list.
 */
export function extractMaxPortSpeedMbps(
  capabilities: readonly PortCapability[]
): number {
  if (capabilities.includes('25gbase-dac')) return 25000;
  if (
    capabilities.includes('10gbase-t') ||
    capabilities.includes('10gbase-sr') ||
    capabilities.includes('10gbase-lr') ||
    capabilities.includes('10gbase-dac')
  ) {
    return 10000;
  }
  if (capabilities.includes('5gbase-t')) return 5000;
  if (capabilities.includes('2500base-t')) return 2500;
  if (capabilities.includes('1000base-t')) return 1000;
  if (capabilities.includes('100base-tx')) return 100;
  return 0;
}

/**
 * Runs the deterministic 5-Stage Constraint & Validation Engine on a `RackProject`.
 */
export function validateRackProject(
  project: RackProject,
  catalog: BlueprintCatalogMap,
  precomputedGeometry?: ComputedRackGeometry
): ValidationResult {
  const geometry = precomputedGeometry ?? computeRackGeometry(project, catalog);
  const issues: DiagnosticIssue[] = [];

  // =========================================================================
  // STAGE 1: Spatial 3D AABB, Sub-Slot & Plug Clearance Solver
  // =========================================================================
  for (const mounted of project.mounted_devices) {
    const bp = lookupBlueprint(catalog, mounted.blueprint_slug);
    if (!bp) {
      issues.push({
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        stage: 1,
        affected_instances: [mounted.instance_id],
        u_range: [mounted.u_position, mounted.u_position],
        message: `Hardware blueprint '${mounted.blueprint_slug}' for instance '${mounted.instance_id}' was not found in the catalog.`,
        remediation_suggestions: [
          `Register '${mounted.blueprint_slug}' using define_custom_blueprint or select a valid slug via search_catalog.`
        ]
      });
      continue;
    }

    const uSpan = Math.max(1, Math.ceil(bp.geometry.u_height));
    const uMax = mounted.u_position + uSpan - 1;
    if (mounted.u_position < 1 || uMax > project.rack.u_height) {
      issues.push({
        code: 'OUT_OF_RACK_BOUNDS',
        severity: 'ERROR',
        stage: 1,
        affected_instances: [mounted.instance_id],
        u_range: [mounted.u_position, uMax],
        message: `Device '${mounted.instance_id}' at U${mounted.u_position}..U${uMax} exceeds rack height of ${project.rack.u_height}U.`,
        remediation_suggestions: [
          `Move '${mounted.instance_id}' to a U position between U1 and U${Math.max(1, project.rack.u_height - uSpan + 1)}.`
        ]
      });
    }

    for (const child of mounted.children) {
      const childBp = lookupBlueprint(catalog, child.blueprint_slug);
      if (!childBp) {
        issues.push({
          code: 'BLUEPRINT_NOT_FOUND',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [child.instance_id],
          u_range: [mounted.u_position, uMax],
          message: `Child hardware blueprint '${child.blueprint_slug}' for '${child.instance_id}' was not found in the catalog.`,
          remediation_suggestions: [
            `Register '${child.blueprint_slug}' using define_custom_blueprint or select a valid sub-module blueprint.`
          ]
        });
        continue;
      }

      const slotDef = bp.slots.find((s) => s.slot_id === child.slot_id);
      if (!slotDef) {
        const validSlots = bp.slots.map((s) => `'${s.slot_id}'`).join(', ');
        issues.push({
          code: 'SLOT_INCOMPATIBLE',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [mounted.instance_id, child.instance_id],
          u_range: [mounted.u_position, uMax],
          message: `Carrier '${mounted.instance_id}' does not have a slot '${child.slot_id}' for child '${child.instance_id}'.`,
          remediation_suggestions: [
            validSlots
              ? `Mount '${child.instance_id}' in one of the available slots on '${mounted.instance_id}': ${validSlots}.`
              : `Mount '${child.instance_id}' inside a compatible modular-carrier.`
          ]
        });
        continue;
      }

      if (
        childBp.slot_compatibility &&
        childBp.slot_compatibility !== slotDef.accepted_slot_type
      ) {
        issues.push({
          code: 'SLOT_INCOMPATIBLE',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [mounted.instance_id, child.instance_id],
          u_range: [mounted.u_position, uMax],
          message: `Slot '${slotDef.slot_id}' on '${mounted.instance_id}' expects slot type '${slotDef.accepted_slot_type}', but '${child.instance_id}' has slot_compatibility '${childBp.slot_compatibility}'.`,
          remediation_suggestions: [
            `Mount '${child.instance_id}' into a slot accepting '${childBp.slot_compatibility}'.`
          ]
        });
      }

      const { width_mm, height_mm, depth_mm } = childBp.geometry;
      const { width, height, depth } = slotDef.max_dimensions_mm;
      if (width_mm > width || height_mm > height || depth_mm > depth) {
        issues.push({
          code: 'SLOT_DIMENSION_OVERFLOW',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [mounted.instance_id, child.instance_id],
          u_range: [mounted.u_position, uMax],
          message: `Child device '${child.instance_id}' (${width_mm}x${height_mm}x${depth_mm}mm) exceeds max dimensions of slot '${slotDef.slot_id}' (${width}x${height}x${depth}mm) on carrier '${mounted.instance_id}'.`,
          remediation_suggestions: [
            `Use a carrier with a larger bay (>= ${width_mm}x${height_mm}x${depth_mm}mm) or mount '${child.instance_id}' on a 1U rack shelf.`
          ]
        });
      }
    }
  }

  // 1.1 Rule 1.1: Device-to-Device Hard Chassis Overlap (CHASSIS_COLLISION)
  const allDevices = geometry.devices;
  const chassisCollidingPairs = new Set<string>();

  for (let i = 0; i < allDevices.length; i++) {
    const devA = allDevices[i]!;
    for (let j = i + 1; j < allDevices.length; j++) {
      const devB = allDevices[j]!;

      if (
        devA.parent_carrier_id === devB.instance_id ||
        devB.parent_carrier_id === devA.instance_id
      ) {
        continue;
      }

      const intersection = getBoxIntersection(
        devA.chassis_box,
        devB.chassis_box
      );
      if (intersection) {
        const pairKey = [devA.instance_id, devB.instance_id].sort().join('::');
        chassisCollidingPairs.add(pairKey);

        const overlapZ = roundTenths(intersection.max.z - intersection.min.z);
        const uStart = Math.max(devA.u_range[0], devB.u_range[0]);
        const uEnd = Math.min(devA.u_range[1], devB.u_range[1]);

        const moveTarget = devB.mount_target === 'rack-unit' ? devB : devA;
        const { freeUs } = findCollisionFreeUPositions(
          moveTarget,
          moveTarget.face,
          project,
          geometry
        );

        const suggestions: string[] = [];
        const actions: RemediationAction[] = [];

        if (freeUs.length > 0) {
          const formattedUs = freeUs
            .map((u) => `U${u} (${moveTarget.face})`)
            .join(' or ');
          const desc = `Move '${moveTarget.instance_id}' from U${moveTarget.u_position} (${moveTarget.face}) to ${formattedUs} to resolve chassis overlap.`;
          suggestions.push(desc);
          actions.push({
            action_type: 'move_device',
            target_instance_id: moveTarget.instance_id,
            suggested_u_positions: freeUs,
            suggested_face: moveTarget.face,
            description: desc
          });
        } else {
          suggestions.push(
            `Relocate '${moveTarget.instance_id}' or increase rack rail depth beyond ${project.rack.rail_depth_mm}mm.`
          );
        }

        issues.push({
          code: 'CHASSIS_COLLISION',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [devA.instance_id, devB.instance_id],
          u_range: [uStart, Math.max(uStart, uEnd)],
          message: `Hard chassis collision on U${uStart}: '${devA.instance_id}' (${devA.face}) and '${devB.instance_id}' (${devB.face}) overlap by ${overlapZ}mm on Z-axis.`,
          remediation_suggestions: suggestions,
          remediation_actions: actions
        });
      }
    }
  }

  // 1.2 Rule 1.2: Plug-to-Device Overlap (PLUG_CLEARANCE_COLLISION)
  for (const devWithPlug of allDevices) {
    for (const pc of devWithPlug.port_clearances) {
      for (const otherDev of allDevices) {
        if (devWithPlug.instance_id === otherDev.instance_id) {
          continue;
        }
        if (
          devWithPlug.parent_carrier_id === otherDev.instance_id ||
          otherDev.parent_carrier_id === devWithPlug.instance_id
        ) {
          continue;
        }
        const pairKey = [devWithPlug.instance_id, otherDev.instance_id]
          .sort()
          .join('::');
        if (chassisCollidingPairs.has(pairKey)) {
          continue;
        }

        const intersection = getBoxIntersection(
          pc.clearance_box,
          otherDev.chassis_box
        );
        if (!intersection) {
          continue;
        }

        const overlapZ = roundTenths(intersection.max.z - intersection.min.z);
        const uStart = Math.max(devWithPlug.u_range[0], otherDev.u_range[0]);
        const uEnd = Math.min(devWithPlug.u_range[1], otherDev.u_range[1]);

        const devBodyDepth = devWithPlug.blueprint.geometry.depth_mm;
        const totalDepthWithPlug = roundTenths(devBodyDepth + pc.delta_z_mm);
        const otherDepth = otherDev.blueprint.geometry.depth_mm;

        const suggestions: string[] = [];
        const actions: RemediationAction[] = [];

        const deviceToRelocate =
          otherDev.face === 'rear' && otherDev.mount_target === 'rack-unit'
            ? otherDev
            : devWithPlug.mount_target === 'rack-unit'
              ? devWithPlug
              : otherDev;

        if (deviceToRelocate.mount_target === 'rack-unit') {
          const { freeUs, zeroOppositeDepthUs } = findCollisionFreeUPositions(
            deviceToRelocate,
            deviceToRelocate.face,
            project,
            geometry
          );

          const preferredUs =
            zeroOppositeDepthUs.length > 0 ? zeroOppositeDepthUs : freeUs;
          if (preferredUs.length > 0) {
            const uListStr = preferredUs
              .map((u) => `U${u} (${deviceToRelocate.face})`)
              .join(' or ');
            const oppositeFaceName =
              deviceToRelocate.face === 'rear' ? 'front' : 'rear';
            const depthNote =
              zeroOppositeDepthUs.length > 0
                ? `, where ${oppositeFaceName} depth is 0mm.`
                : `, where depth clearance is sufficient.`;
            const moveMsg = `Move '${deviceToRelocate.instance_id}' from U${deviceToRelocate.u_position} (${deviceToRelocate.face}) to ${uListStr}${depthNote}`;
            suggestions.push(moveMsg);
            actions.push({
              action_type: 'move_device',
              target_instance_id: deviceToRelocate.instance_id,
              suggested_u_positions: preferredUs,
              suggested_face: deviceToRelocate.face,
              description: moveMsg
            });
          }
        }

        const plugSpec = DELTA_Z_PLUG_MM[pc.connector_type];
        if (!pc.is_angled && plugSpec.angled_mm !== null) {
          const angledMm = plugSpec.angled_mm;
          const angledCableType = `${pc.cable_type}-angled`;
          const savedMm = pc.delta_z_mm - angledMm;
          const remainingOverlap = roundTenths(overlapZ - savedMm);

          const angledMsg =
            remainingOverlap <= 0
              ? `Change cable '${pc.cable_id}' to '${angledCableType}', reducing plug clearance from ${pc.delta_z_mm}mm to ${angledMm}mm and resolving the collision.`
              : `Change cable '${pc.cable_id}' to '${angledCableType}', reducing plug clearance from ${pc.delta_z_mm}mm to ${angledMm}mm (still requires moving '${deviceToRelocate.instance_id}' or increasing rail depth by ${remainingOverlap}mm).`;

          suggestions.push(angledMsg);
          actions.push({
            action_type: 'change_cable_type',
            target_cable_id: pc.cable_id,
            suggested_cable_type: angledCableType,
            description: angledMsg
          });
        }

        if (suggestions.length === 0) {
          suggestions.push(
            `Increase rack rail_depth_mm by at least ${overlapZ}mm (to >= ${project.rack.rail_depth_mm + overlapZ}mm).`
          );
        }

        const plugLabel = `${pc.is_angled ? 'angled' : 'straight'} ${pc.connector_type.toUpperCase()} plug`;

        issues.push({
          code: 'PLUG_CLEARANCE_COLLISION',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [devWithPlug.instance_id, otherDev.instance_id],
          u_range: [uStart, Math.max(uStart, uEnd)],
          message: `Depth collision on U${uStart}: '${devWithPlug.instance_id}' (${devBodyDepth}mm body + ${pc.delta_z_mm}mm ${plugLabel} = ${totalDepthWithPlug}mm) overlaps with ${otherDev.face}-mounted '${otherDev.instance_id}' (${otherDepth}mm depth) in a ${project.rack.rail_depth_mm}mm deep rack (${overlapZ}mm overlap).`,
          remediation_suggestions: suggestions,
          remediation_actions: actions
        });
      }
    }
  }

  // 1.3 Rule 1.3: Enclosure Front Door Boundary Violation (FRONT_DOOR_COLLISION)
  if (project.rack.enclosure_type === 'closed-glass-front') {
    const minAllowedZ = -project.rack.front_door_clearance_mm;
    for (const dev of allDevices) {
      const chassisMinZ = dev.chassis_box.min.z;
      const plugMinZ =
        dev.plug_clearance_box !== null
          ? dev.plug_clearance_box.min.z
          : chassisMinZ;
      const worstMinZ = Math.min(chassisMinZ, plugMinZ);

      if (worstMinZ < minAllowedZ - AABB_INTERSECTION_EPSILON_MM) {
        const excessMm = roundTenths(minAllowedZ - worstMinZ);
        const violatingFrontPlug: PortPlugClearance | undefined =
          dev.port_clearances.find(
            (pc) =>
              pc.clearance_box.min.z <
              minAllowedZ - AABB_INTERSECTION_EPSILON_MM
          );

        const suggestions: string[] = [];
        if (violatingFrontPlug && !violatingFrontPlug.is_angled) {
          const spec = DELTA_Z_PLUG_MM[violatingFrontPlug.connector_type];
          if (spec.angled_mm !== null) {
            suggestions.push(
              `Change cable '${violatingFrontPlug.cable_id}' to '${violatingFrontPlug.cable_type}-angled' to reduce front plug protrusion from ${violatingFrontPlug.delta_z_mm}mm to ${spec.angled_mm}mm.`
            );
          }
        }
        suggestions.push(
          `Use recessed mounting ears ('recessed-20mm') on '${dev.instance_id}' or change rack enclosure_type to 'open-frame'.`
        );

        issues.push({
          code: 'FRONT_DOOR_COLLISION',
          severity: 'ERROR',
          stage: 1,
          affected_instances: [dev.instance_id],
          u_range: [dev.u_range[0], dev.u_range[1]],
          message: `Front door collision on U${dev.u_position}: '${dev.instance_id}' protrudes to Z = ${worstMinZ}mm, exceeding front glass door clearance (-${project.rack.front_door_clearance_mm}mm) by ${excessMm}mm.`,
          remediation_suggestions: suggestions
        });
      }
    }
  }

  // =========================================================================
  // STAGE 2: Port & Media Compatibility Matrix
  // =========================================================================
  const portOccupancy = new Map<string, string>();

  interface ResolvedCableEndpoints {
    cable: CableConnection;
    fromDev: ComputedDeviceGeometry;
    toDev: ComputedDeviceGeometry;
    fromPort: ComputedPortGeometry;
    toPort: ComputedPortGeometry;
  }
  const validResolvedCables: ResolvedCableEndpoints[] = [];

  for (const cable of project.cables) {
    const fromDev = geometry.devices_by_id.get(cable.from.instance_id);
    const toDev = geometry.devices_by_id.get(cable.to.instance_id);

    if (!fromDev || !toDev) {
      const missingId = !fromDev
        ? cable.from.instance_id
        : cable.to.instance_id;
      issues.push({
        code: 'PORT_NOT_FOUND',
        severity: 'ERROR',
        stage: 2,
        affected_instances: [missingId],
        message: `Cable '${cable.cable_id}' references non-existent device instance '${missingId}'.`,
        remediation_suggestions: [
          `Verify instance_id '${missingId}' is mounted or remove cable '${cable.cable_id}'.`
        ]
      });
      continue;
    }

    const fromParent = fromDev.parent_carrier_id
      ? geometry.devices_by_id.get(fromDev.parent_carrier_id)
      : undefined;
    const toParent = toDev.parent_carrier_id
      ? geometry.devices_by_id.get(toDev.parent_carrier_id)
      : undefined;

    const fromPort = resolveCableEndpointPortGeometry(
      fromDev,
      cable.from.port_id,
      cable.from.face,
      fromParent
    );
    const toPort = resolveCableEndpointPortGeometry(
      toDev,
      cable.to.port_id,
      cable.to.face,
      toParent
    );

    if (!fromPort || !toPort) {
      const missingDev = !fromPort ? fromDev : toDev;
      const missingPortId = !fromPort ? cable.from.port_id : cable.to.port_id;
      const availablePorts = missingDev.ports
        .map((p) => `'${p.port_id}'`)
        .join(', ');
      issues.push({
        code: 'PORT_NOT_FOUND',
        severity: 'ERROR',
        stage: 2,
        affected_instances: [missingDev.instance_id],
        u_range: [missingDev.u_range[0], missingDev.u_range[1]],
        message: `Port '${missingPortId}' does not exist on device '${missingDev.instance_id}' (referenced by cable '${cable.cable_id}').`,
        remediation_suggestions: [
          `Use one of the valid port IDs on '${missingDev.instance_id}': ${availablePorts || 'none'}.`
        ]
      });
      continue;
    }

    const endpointsToCheck = [
      {
        dev: fromDev,
        port: fromPort,
        epFace: cable.from.face ?? fromPort.world_face
      },
      {
        dev: toDev,
        port: toPort,
        epFace: cable.to.face ?? toPort.world_face
      }
    ];

    for (const ep of endpointsToCheck) {
      const occupancyKey = ep.port.is_passthrough_coupler
        ? `${ep.dev.instance_id}:${ep.port.port_id}:${ep.epFace}`
        : `${ep.dev.instance_id}:${ep.port.port_id}`;

      const existingCableId = portOccupancy.get(occupancyKey);
      if (existingCableId) {
        const freePorts = ep.dev.ports
          .filter(
            (p) =>
              p.connector_type === ep.port.connector_type &&
              !portOccupancy.has(`${ep.dev.instance_id}:${p.port_id}`)
          )
          .map((p) => `'${p.port_id}'`);

        issues.push({
          code: 'PORT_ALREADY_OCCUPIED',
          severity: 'ERROR',
          stage: 2,
          affected_instances: [ep.dev.instance_id],
          u_range: [ep.dev.u_range[0], ep.dev.u_range[1]],
          message: `Port '${ep.port.port_id}'${ep.port.is_passthrough_coupler ? ` (${ep.epFace} face)` : ''} on '${ep.dev.instance_id}' is already occupied by cable '${existingCableId}' and cannot accept cable '${cable.cable_id}'.`,
          remediation_suggestions: [
            freePorts.length > 0
              ? `Connect cable '${cable.cable_id}' to a free port on '${ep.dev.instance_id}': ${freePorts.slice(0, 4).join(', ')}.`
              : `Disconnect '${existingCableId}' before connecting '${cable.cable_id}'.`
          ]
        });
      } else {
        portOccupancy.set(occupancyKey, cable.cable_id);
      }
    }

    if (
      !areConnectorsPhysicallyCompatible(
        fromPort.connector_type,
        toPort.connector_type
      )
    ) {
      issues.push({
        code: 'CONNECTOR_INCOMPATIBLE',
        severity: 'ERROR',
        stage: 2,
        affected_instances: [fromDev.instance_id, toDev.instance_id],
        message: `Physical connector mismatch on cable '${cable.cable_id}': '${fromDev.instance_id}:${fromPort.port_id}' (${fromPort.connector_type}) is incompatible with '${toDev.instance_id}:${toPort.port_id}' (${toPort.connector_type}).`,
        remediation_suggestions: [
          `Connect '${fromDev.instance_id}:${fromPort.port_id}' (${fromPort.connector_type}) to a compatible '${fromPort.connector_type}' port on '${toDev.instance_id}'.`
        ]
      });
      continue;
    }

    const signalCheck = arePortSignalsCompatible(
      fromPort,
      toPort,
      cable.cable_type
    );
    if (!signalCheck.compatible) {
      issues.push({
        code: 'SIGNAL_PROTOCOL_INCOMPATIBLE',
        severity: 'ERROR',
        stage: 2,
        affected_instances: [fromDev.instance_id, toDev.instance_id],
        message: `Signal incompatibility on cable '${cable.cable_id}': ${signalCheck.reason}`,
        remediation_suggestions: [
          `Connect '${fromDev.instance_id}:${fromPort.port_id}' to a protocol-compatible port or insert a media/protocol converter.`
        ]
      });
      continue;
    }

    // Check Cat5e media speed bottleneck on multi-gigabit (>= 2.5G) ports
    const isCat5e =
      cable.cable_type === 'cat5e' || cable.cable_type === 'cat5e-angled';
    const speedFrom = extractMaxPortSpeedMbps(fromPort.capabilities);
    const speedTo = extractMaxPortSpeedMbps(toPort.capabilities);
    const negotiatedPortSpeed =
      speedFrom > 0 && speedTo > 0
        ? Math.min(speedFrom, speedTo)
        : Math.max(speedFrom, speedTo);

    if (isCat5e && negotiatedPortSpeed >= 2500) {
      const upgradedType =
        cable.cable_type === 'cat5e-angled' ? 'cat6a-angled' : 'cat6a';
      const fixDesc = `Upgrade cable '${cable.cable_id}' from '${cable.cable_type}' to '${upgradedType}' to prevent multi-gigabit (${negotiatedPortSpeed / 1000}G) link throttling to 1000BASE-T.`;
      issues.push({
        code: 'SPEED_MISMATCH',
        severity: 'WARNING',
        stage: 2,
        affected_instances: [fromDev.instance_id, toDev.instance_id],
        message: `Cable media bottleneck on '${cable.cable_id}': '${cable.cable_type}' is rated for 1000BASE-T (1G) and may throttle the ${negotiatedPortSpeed / 1000}G link between '${fromDev.instance_id}:${fromPort.port_id}' and '${toDev.instance_id}:${toPort.port_id}'.`,
        remediation_suggestions: [fixDesc],
        remediation_actions: [
          {
            action_type: 'change_cable_type',
            target_cable_id: cable.cable_id,
            suggested_cable_type: upgradedType,
            description: fixDesc
          }
        ]
      });
    }

    validResolvedCables.push({
      cable,
      fromDev,
      toDev,
      fromPort,
      toPort
    });
  }

  // =========================================================================
  // STAGE 3: Electrical Power & PoE Directed Acyclic Graph (DAG)
  // =========================================================================
  interface LogicalLink {
    cableIds: string[];
    devA: ComputedDeviceGeometry;
    portA: ComputedPortGeometry;
    devB: ComputedDeviceGeometry;
    portB: ComputedPortGeometry;
  }

  const logicalLinks: LogicalLink[] = [];
  interface CouplerHalfLink {
    dev: ComputedDeviceGeometry;
    port: ComputedPortGeometry;
    cableId: string;
    otherCouplerKey?: string;
    otherCouplerFace?: RackFace;
  }
  const couplerSides = new Map<
    string,
    {
      front?: CouplerHalfLink;
      rear?: CouplerHalfLink;
    }
  >();

  for (const rc of validResolvedCables) {
    const fromIsCoupler = rc.fromPort.is_passthrough_coupler;
    const toIsCoupler = rc.toPort.is_passthrough_coupler;

    if (!fromIsCoupler && !toIsCoupler) {
      logicalLinks.push({
        cableIds: [rc.cable.cable_id],
        devA: rc.fromDev,
        portA: rc.fromPort,
        devB: rc.toDev,
        portB: rc.toPort
      });
      continue;
    }

    if (fromIsCoupler && !toIsCoupler) {
      const key = `${rc.fromDev.instance_id}:${rc.fromPort.port_id}`;
      const face = rc.cable.from.face ?? rc.fromPort.world_face;
      const entry = couplerSides.get(key) ?? {};
      entry[face] = {
        dev: rc.toDev,
        port: rc.toPort,
        cableId: rc.cable.cable_id
      };
      couplerSides.set(key, entry);
    } else if (!fromIsCoupler && toIsCoupler) {
      const key = `${rc.toDev.instance_id}:${rc.toPort.port_id}`;
      const face = rc.cable.to.face ?? rc.toPort.world_face;
      const entry = couplerSides.get(key) ?? {};
      entry[face] = {
        dev: rc.fromDev,
        port: rc.fromPort,
        cableId: rc.cable.cable_id
      };
      couplerSides.set(key, entry);
    } else if (fromIsCoupler && toIsCoupler) {
      const keyA = `${rc.fromDev.instance_id}:${rc.fromPort.port_id}`;
      const faceA = rc.cable.from.face ?? rc.fromPort.world_face;
      const keyB = `${rc.toDev.instance_id}:${rc.toPort.port_id}`;
      const faceB = rc.cable.to.face ?? rc.toPort.world_face;

      const entryA = couplerSides.get(keyA) ?? {};
      entryA[faceA] = {
        dev: rc.toDev,
        port: rc.toPort,
        cableId: rc.cable.cable_id,
        otherCouplerKey: keyB,
        otherCouplerFace: faceB
      };
      couplerSides.set(keyA, entryA);

      const entryB = couplerSides.get(keyB) ?? {};
      entryB[faceB] = {
        dev: rc.fromDev,
        port: rc.fromPort,
        cableId: rc.cable.cable_id,
        otherCouplerKey: keyA,
        otherCouplerFace: faceA
      };
      couplerSides.set(keyB, entryB);
    }
  }

  // Resolve 1-hop and multi-hop coupler chains into end-to-end LogicalLinks
  const visitedCouplers = new Set<string>();
  for (const [couplerKey, sides] of couplerSides.entries()) {
    if (visitedCouplers.has(couplerKey)) {
      continue;
    }
    if (sides.front && sides.rear) {
      let leftSide: CouplerHalfLink | undefined = sides.front;
      let rightSide: CouplerHalfLink | undefined = sides.rear;
      const chainCableIds = new Set<string>([
        leftSide.cableId,
        rightSide.cableId
      ]);
      visitedCouplers.add(couplerKey);

      while (leftSide?.otherCouplerKey && leftSide.otherCouplerFace) {
        const nextKey: string = leftSide.otherCouplerKey;
        visitedCouplers.add(nextKey);
        const oppositeFace: RackFace =
          leftSide.otherCouplerFace === 'front' ? 'rear' : 'front';
        const nextSide: CouplerHalfLink | undefined =
          couplerSides.get(nextKey)?.[oppositeFace];
        if (!nextSide) {
          leftSide = undefined;
          break;
        }
        chainCableIds.add(nextSide.cableId);
        leftSide = nextSide;
      }

      while (rightSide?.otherCouplerKey && rightSide.otherCouplerFace) {
        const nextKey: string = rightSide.otherCouplerKey;
        visitedCouplers.add(nextKey);
        const oppositeFace: RackFace =
          rightSide.otherCouplerFace === 'front' ? 'rear' : 'front';
        const nextSide: CouplerHalfLink | undefined =
          couplerSides.get(nextKey)?.[oppositeFace];
        if (!nextSide) {
          rightSide = undefined;
          break;
        }
        chainCableIds.add(nextSide.cableId);
        rightSide = nextSide;
      }

      if (
        leftSide &&
        rightSide &&
        !leftSide.otherCouplerKey &&
        !rightSide.otherCouplerKey
      ) {
        logicalLinks.push({
          cableIds: Array.from(chainCableIds),
          devA: leftSide.dev,
          portA: leftSide.port,
          devB: rightSide.dev,
          portB: rightSide.port
        });
      }
    }
  }

  const pseBudgetsMap = new Map<
    string,
    {
      pseDev: ComputedDeviceGeometry;
      budgetWatts: number;
      consumedWatts: number;
      downstreamIds: string[];
    }
  >();

  for (const dev of allDevices) {
    if (dev.blueprint.power_and_thermal.electrical_role === 'pse-switch') {
      pseBudgetsMap.set(dev.instance_id, {
        pseDev: dev,
        budgetWatts: dev.blueprint.power_and_thermal.poe_budget_watts ?? 0,
        consumedWatts: 0,
        downstreamIds: []
      });
    }
  }

  const poePoweredDevices = new Set<string>();
  const acDcPoweredDevices = new Set<string>();
  const powerSourceToDownstream = new Map<string, string[]>();

  for (const link of logicalLinks) {
    const poeA = extractPoeOutClassWatts(link.portA.capabilities);
    const poeB = extractPoeOutClassWatts(link.portB.capabilities);

    const checkPoePair = (
      pseDev: ComputedDeviceGeometry,
      psePort: ComputedPortGeometry,
      pseInfo: { supported: boolean; maxWatts: number; className: string },
      pdDev: ComputedDeviceGeometry,
      pdPort: ComputedPortGeometry
    ) => {
      if (!pseInfo.supported) {
        return;
      }
      if (!isPoeInCapable(pdPort.capabilities)) {
        return;
      }

      const pdWatts = pdDev.blueprint.power_and_thermal.max_system_watts;
      poePoweredDevices.add(pdDev.instance_id);

      if (pdWatts > pseInfo.maxWatts) {
        issues.push({
          code: 'POE_CLASS_EXCEEDED',
          severity: 'ERROR',
          stage: 3,
          affected_instances: [pseDev.instance_id, pdDev.instance_id],
          u_range: [pseDev.u_range[0], pdDev.u_range[1]],
          message: `PoE class exceeded on '${pseDev.instance_id}:${psePort.port_id}' (class '${pseInfo.className}', max ${pseInfo.maxWatts}W): downstream device '${pdDev.instance_id}' requires ${pdWatts}W.`,
          remediation_suggestions: [
            `Connect '${pdDev.instance_id}' to a higher-class PoE++ port (>= ${pdWatts}W) or power it via a dedicated AC/DC adapter.`
          ]
        });
      }

      let pseRecord = pseBudgetsMap.get(pseDev.instance_id);
      if (!pseRecord) {
        pseRecord = {
          pseDev,
          budgetWatts: pseDev.blueprint.power_and_thermal.poe_budget_watts ?? 0,
          consumedWatts: 0,
          downstreamIds: []
        };
        pseBudgetsMap.set(pseDev.instance_id, pseRecord);
      }

      pseRecord.consumedWatts = roundCentis(pseRecord.consumedWatts + pdWatts);
      if (!pseRecord.downstreamIds.includes(pdDev.instance_id)) {
        pseRecord.downstreamIds.push(pdDev.instance_id);
      }
    };

    checkPoePair(link.devA, link.portA, poeA, link.devB, link.portB);
    checkPoePair(link.devB, link.portB, poeB, link.devA, link.portA);

    const isPowerPort = (p: ComputedPortGeometry) =>
      p.connector_type === 'iec-c13' ||
      p.connector_type === 'iec-c14' ||
      p.connector_type === 'schuko-cee7' ||
      p.connector_type === 'dc-5525' ||
      (p.connector_type === 'usb-c' &&
        (p.capabilities.includes('usb-pd') ||
          p.capabilities.includes('dc-power') ||
          p.direction !== 'bidirectional'));

    if (isPowerPort(link.portA) && isPowerPort(link.portB)) {
      const roleA = link.devA.blueprint.power_and_thermal.electrical_role;
      const roleB = link.devB.blueprint.power_and_thermal.electrical_role;

      const isASource =
        roleA === 'ups' ||
        (roleA === 'pdu' && roleB !== 'ups') ||
        link.portA.direction === 'output';
      const isBSource =
        roleB === 'ups' ||
        (roleB === 'pdu' && roleA !== 'ups') ||
        link.portB.direction === 'output';

      if (isASource && !isBSource) {
        acDcPoweredDevices.add(link.devB.instance_id);
        const list = powerSourceToDownstream.get(link.devA.instance_id) ?? [];
        list.push(link.devB.instance_id);
        powerSourceToDownstream.set(link.devA.instance_id, list);
      } else if (isBSource && !isASource) {
        acDcPoweredDevices.add(link.devA.instance_id);
        const list = powerSourceToDownstream.get(link.devB.instance_id) ?? [];
        list.push(link.devA.instance_id);
        powerSourceToDownstream.set(link.devB.instance_id, list);
      }
    }
  }

  const pseBudgetSummaries: PseBudgetSummary[] = [];
  let totalPoeWatts = 0;

  for (const [, pseRecord] of pseBudgetsMap.entries()) {
    totalPoeWatts = roundCentis(totalPoeWatts + pseRecord.consumedWatts);
    const remaining = roundCentis(
      pseRecord.budgetWatts - pseRecord.consumedWatts
    );
    pseBudgetSummaries.push({
      pse_instance_id: pseRecord.pseDev.instance_id,
      poe_budget_watts: pseRecord.budgetWatts,
      consumed_poe_watts: pseRecord.consumedWatts,
      remaining_poe_watts: remaining,
      downstream_devices: pseRecord.downstreamIds
    });

    if (pseRecord.consumedWatts > pseRecord.budgetWatts) {
      const excessWatts = roundTenths(
        pseRecord.consumedWatts - pseRecord.budgetWatts
      );
      const suggestions: string[] = [
        `Disconnect or move at least ${excessWatts}W of PoE load (${pseRecord.downstreamIds.map((id) => `'${id}'`).join(', ')}) from '${pseRecord.pseDev.instance_id}' to dedicated AC/DC power or a PoE injector.`,
        `Upgrade '${pseRecord.pseDev.instance_id}' to a PSE switch with poe_budget_watts >= ${pseRecord.consumedWatts}W.`
      ];
      issues.push({
        code: 'POE_BUDGET_EXCEEDED',
        severity: 'ERROR',
        stage: 3,
        affected_instances: [
          pseRecord.pseDev.instance_id,
          ...pseRecord.downstreamIds
        ],
        u_range: [pseRecord.pseDev.u_range[0], pseRecord.pseDev.u_range[1]],
        message: `PoE budget exceeded on '${pseRecord.pseDev.instance_id}': downstream PoE devices (${pseRecord.downstreamIds.join(', ')}) draw ${pseRecord.consumedWatts}W, exceeding the ${pseRecord.budgetWatts}W budget by ${excessWatts}W.`,
        remediation_suggestions: suggestions,
        remediation_actions: [
          {
            action_type: 'redistribute_poe',
            target_instance_id: pseRecord.pseDev.instance_id,
            description: suggestions[0]!
          }
        ]
      });
    }
  }

  const computeDeviceTotalDrawWatts = (
    instanceId: string,
    visited = new Set<string>()
  ): number => {
    if (visited.has(instanceId)) {
      return 0;
    }
    visited.add(instanceId);

    const dev = geometry.devices_by_id.get(instanceId);
    if (!dev) {
      return 0;
    }

    const ownWatts = dev.blueprint.power_and_thermal.max_system_watts;
    const poeWatts = pseBudgetsMap.get(instanceId)?.consumedWatts ?? 0;
    const downstreamIds = powerSourceToDownstream.get(instanceId) ?? [];
    const downstreamWatts = downstreamIds.reduce(
      (sum, childId) => sum + computeDeviceTotalDrawWatts(childId, visited),
      0
    );

    return roundCentis(ownWatts + poeWatts + downstreamWatts);
  };

  const powerSourceSummaries: PowerSourceSummary[] = [];
  for (const dev of allDevices) {
    const role = dev.blueprint.power_and_thermal.electrical_role;
    if (role !== 'ups' && role !== 'pdu') {
      continue;
    }

    const downstreamIds = powerSourceToDownstream.get(dev.instance_id) ?? [];
    const downstreamLoad = downstreamIds.reduce(
      (sum, id) => sum + computeDeviceTotalDrawWatts(id),
      0
    );
    const totalLoadWatts = roundCentis(
      dev.blueprint.power_and_thermal.max_system_watts + downstreamLoad
    );
    const capacityWatts =
      dev.blueprint.power_and_thermal.ups_capacity_watts ??
      dev.blueprint.power_and_thermal.pdu_capacity_watts ??
      (role === 'ups' ? 600 : 2300);

    const utilizationPercent = roundTenths(
      (totalLoadWatts / capacityWatts) * 100
    );

    powerSourceSummaries.push({
      source_instance_id: dev.instance_id,
      role,
      capacity_watts: capacityWatts,
      total_load_watts: totalLoadWatts,
      utilization_percent: utilizationPercent
    });

    if (totalLoadWatts > capacityWatts) {
      const excessWatts = roundTenths(totalLoadWatts - capacityWatts);
      issues.push({
        code: 'UPS_OVERLOAD',
        severity: 'ERROR',
        stage: 3,
        affected_instances: [dev.instance_id, ...downstreamIds],
        u_range: [dev.u_range[0], dev.u_range[1]],
        message: `Power capacity exceeded on '${dev.instance_id}' (${role.toUpperCase()}): connected peak load is ${totalLoadWatts}W, exceeding capacity of ${capacityWatts}W by ${excessWatts}W.`,
        remediation_suggestions: [
          `Offload at least ${excessWatts}W from '${dev.instance_id}' onto a secondary PDU/UPS or upgrade '${dev.instance_id}' to >= ${Math.ceil(totalLoadWatts * 1.2)}W capacity.`
        ]
      });
    }
  }

  const unpoweredActiveInstances: string[] = [];
  const powerSources = allDevices.filter(
    (d) =>
      d.blueprint.power_and_thermal.electrical_role === 'pdu' ||
      d.blueprint.power_and_thermal.electrical_role === 'ups'
  );

  for (const dev of allDevices) {
    const role = dev.blueprint.power_and_thermal.electrical_role;
    if (role === 'passive' || role === 'ups' || role === 'pdu') {
      continue;
    }

    const isPowered =
      acDcPoweredDevices.has(dev.instance_id) ||
      poePoweredDevices.has(dev.instance_id);

    if (!isPowered) {
      unpoweredActiveInstances.push(dev.instance_id);

      const powerInputPort = dev.ports.find(
        (p) =>
          p.direction === 'input' ||
          p.connector_type === 'iec-c14' ||
          p.connector_type === 'dc-5525' ||
          p.capabilities.some((c) => c.startsWith('poe-in'))
      );

      const suggestions: string[] = [];
      const actions: RemediationAction[] = [];

      if (powerSources.length > 0 && powerInputPort) {
        const source = powerSources[0]!;
        const freeOutlet = source.ports.find(
          (p) =>
            !portOccupancy.has(`${source.instance_id}:${p.port_id}`) &&
            (p.direction === 'output' ||
              p.connector_type === 'schuko-cee7' ||
              p.connector_type === 'iec-c13')
        );
        if (freeOutlet) {
          const msg = `Connect power port '${powerInputPort.port_id}' on '${dev.instance_id}' to free outlet '${freeOutlet.port_id}' on '${source.instance_id}'.`;
          suggestions.push(msg);
          actions.push({
            action_type: 'connect_power',
            target_instance_id: dev.instance_id,
            description: msg
          });
        }
      }

      if (suggestions.length === 0) {
        suggestions.push(
          `Connect '${dev.instance_id}' to a PDU/UPS power outlet or a PoE-capable switch port.`
        );
      }

      issues.push({
        code: 'UNPOWERED_DEVICE',
        severity: 'WARNING',
        stage: 3,
        affected_instances: [dev.instance_id],
        u_range: [dev.u_range[0], dev.u_range[1]],
        message: `Active device '${dev.instance_id}' (${role}, ${dev.blueprint.power_and_thermal.max_system_watts}W) has no active power or PoE connection.`,
        remediation_suggestions: suggestions,
        remediation_actions: actions
      });
    }
  }

  // =========================================================================
  // STAGE 4: Mechanical Stability, Portals & Thermal Heuristics
  // =========================================================================
  let totalWeightGrams = 0;
  let weightedYSum = 0;
  const heavyDevicesAboveU3: ComputedDeviceGeometry[] = [];

  for (const dev of allDevices) {
    const weight = dev.blueprint.geometry.weight_grams;
    const yCenter = (dev.chassis_box.min.y + dev.chassis_box.max.y) / 2;
    totalWeightGrams += weight;
    weightedYSum += weight * yCenter;

    if (weight >= 4000 && dev.u_position > 3) {
      heavyDevicesAboveU3.push(dev);
    }
  }

  const totalRackHeightMm = project.rack.u_height * MM_PER_U;
  const cogYMm =
    totalWeightGrams > 0 ? roundCentis(weightedYSum / totalWeightGrams) : 0;
  const normalizedCogY =
    totalWeightGrams > 0 && totalRackHeightMm > 0
      ? roundMm(cogYMm / totalRackHeightMm)
      : 0;

  if (normalizedCogY > 0.55 || heavyDevicesAboveU3.length > 0) {
    const affected =
      heavyDevicesAboveU3.length > 0
        ? heavyDevicesAboveU3.map((d) => d.instance_id)
        : allDevices
            .filter((d) => d.u_position > Math.ceil(project.rack.u_height / 2))
            .map((d) => d.instance_id);

    const reason =
      heavyDevicesAboveU3.length > 0
        ? `heavy equipment (${heavyDevicesAboveU3.map((d) => `'${d.instance_id}' at ${d.blueprint.geometry.weight_grams}g on U${d.u_position}`).join(', ')}) is mounted above U3 (normalized CoG = ${normalizedCogY})`
        : `normalized vertical Center of Gravity is ${normalizedCogY} (> 0.55 threshold)`;

    issues.push({
      code: 'TOP_HEAVY_RACK',
      severity: 'WARNING',
      stage: 4,
      affected_instances: affected,
      message: `Rack mechanical stability warning: ${reason}.`,
      remediation_suggestions: [
        `Move heavy devices (such as UPS or high-mass nodes) to U1–U3 at the bottom of the rack to lower the center of gravity.`
      ]
    });
  }

  const availablePortalUs = computeAvailablePortalUs(project, geometry);

  for (const rc of validResolvedCables) {
    if (rc.fromPort.world_face !== rc.toPort.world_face) {
      const uA = rc.fromDev.u_position;
      const uB = rc.toDev.u_position;
      const minTargetU = Math.min(uA, uB) - 3;
      const maxTargetU = Math.max(uA, uB) + 3;

      const nearbyPortals = availablePortalUs.filter(
        (u) => u >= minTargetU && u <= maxTargetU
      );

      if (nearbyPortals.length === 0) {
        issues.push({
          code: 'NO_FRONT_TO_REAR_PORTAL',
          severity: 'ERROR',
          stage: 4,
          affected_instances: [rc.fromDev.instance_id, rc.toDev.instance_id],
          u_range: [Math.min(uA, uB), Math.max(uA, uB)],
          message: `Cross-face cable '${rc.cable.cable_id}' connects '${rc.fromDev.instance_id}:${rc.fromPort.port_id}' (${rc.fromPort.world_face}, U${uA}) to '${rc.toDev.instance_id}:${rc.toPort.port_id}' (${rc.toPort.world_face}, U${uB}), but no valid front-to-rear cable portal exists within +/- 3U.`,
          remediation_suggestions: [
            `Leave at least one rack unit unoccupied or mount a 1U 'brush-panel' between U${Math.max(1, minTargetU)} and U${Math.min(project.rack.u_height, maxTargetU)}.`
          ],
          remediation_actions: [
            {
              action_type: 'add_portal_gap',
              target_cable_id: rc.cable.cable_id,
              description: `Mount a brush-panel or free a 1U gap within +/- 3U of U${uA}..U${uB}.`
            }
          ]
        });
      }
    }
  }

  const totalSystemWatts = roundCentis(
    allDevices.reduce(
      (sum, d) => sum + d.blueprint.power_and_thermal.max_system_watts,
      0
    )
  );

  // =========================================================================
  // STAGE 5: Thermal Hotspots, Airflow Regime & Acoustic dB(A) Analysis
  // =========================================================================
  const totalThermalBtuHr = roundTenths(totalSystemWatts * 3.41214);

  const frontToRearDevs = allDevices.filter(
    (d) =>
      d.blueprint.power_and_thermal.max_system_watts > 0 &&
      d.blueprint.power_and_thermal.airflow === 'front-to-rear'
  );
  const rearToFrontDevs = allDevices.filter(
    (d) =>
      d.blueprint.power_and_thermal.max_system_watts > 0 &&
      d.blueprint.power_and_thermal.airflow === 'rear-to-front'
  );
  const passiveActiveDevs = allDevices.filter(
    (d) =>
      d.blueprint.power_and_thermal.max_system_watts > 0 &&
      d.blueprint.power_and_thermal.airflow === 'passive-convection'
  );

  let airflowProfile:
    | 'uniform-front-to-rear'
    | 'uniform-passive'
    | 'hybrid-active-passive'
    | 'mixed-conflict' = 'uniform-passive';

  if (frontToRearDevs.length > 0 && rearToFrontDevs.length > 0) {
    airflowProfile = 'mixed-conflict';
    const conflictIds = [
      ...frontToRearDevs.map((d) => d.instance_id),
      ...rearToFrontDevs.map((d) => d.instance_id)
    ];
    issues.push({
      code: 'THERMAL_AIRFLOW_CONFLICT',
      severity: 'WARNING',
      stage: 5,
      affected_instances: conflictIds,
      message: `Opposing thermal airflow directions detected: front-to-rear devices (${frontToRearDevs.map((d) => `'${d.instance_id}'`).join(', ')}) conflict with rear-to-front devices (${rearToFrontDevs.map((d) => `'${d.instance_id}'`).join(', ')}), causing hot-air recirculation.`,
      remediation_suggestions: [
        `Reverse mounting face or fan orientation on ${rearToFrontDevs.map((d) => `'${d.instance_id}'`).join(', ')} so all active equipment follows a uniform front-to-rear cold/hot aisle path.`
      ]
    });
  } else if (
    (frontToRearDevs.length > 0 || rearToFrontDevs.length > 0) &&
    passiveActiveDevs.length > 0
  ) {
    airflowProfile = 'hybrid-active-passive';
  } else if (frontToRearDevs.length > 0) {
    airflowProfile = 'uniform-front-to-rear';
  }

  // Check for stacked high-heat passive-convection devices (>= 35W each) on adjacent U positions
  const highHeatPassiveDevs = passiveActiveDevs.filter(
    (d) => d.blueprint.power_and_thermal.max_system_watts >= 35
  );
  for (let i = 0; i < highHeatPassiveDevs.length; i++) {
    const devA = highHeatPassiveDevs[i]!;
    for (let j = i + 1; j < highHeatPassiveDevs.length; j++) {
      const devB = highHeatPassiveDevs[j]!;
      if (Math.abs(devA.u_position - devB.u_position) === 1) {
        const uMin = Math.min(devA.u_position, devB.u_position);
        const uMax = Math.max(devA.u_position, devB.u_position);
        issues.push({
          code: 'THERMAL_HOTSPOT_STACKING',
          severity: 'WARNING',
          stage: 5,
          affected_instances: [devA.instance_id, devB.instance_id],
          u_range: [uMin, uMax],
          message: `Thermal hotspot stacking on U${uMin}..U${uMax}: passive-convection devices '${devA.instance_id}' (${devA.blueprint.power_and_thermal.max_system_watts}W) and '${devB.instance_id}' (${devB.blueprint.power_and_thermal.max_system_watts}W) are stacked directly adjacent without active airflow or a 1U ventilation gap.`,
          remediation_suggestions: [
            `Insert a 1U ventilation gap or brush-panel between '${devA.instance_id}' and '${devB.instance_id}', or add active front-to-rear rack cooling.`
          ]
        });
      }
    }
  }

  // Calculate logarithmic sum of acoustic noise in dB(A): L_total = 10 * log10(sum(10^(L_i / 10)))
  let acousticPowerRatioSum = 0;
  const noisyDevices: { id: string; dbA: number }[] = [];
  for (const dev of allDevices) {
    const pt = dev.blueprint.power_and_thermal;
    let dbA = pt.noise_db_a;
    if (dbA === undefined) {
      if (
        pt.airflow === 'front-to-rear' ||
        pt.airflow === 'rear-to-front' ||
        pt.airflow === 'side-to-side'
      ) {
        dbA = pt.max_system_watts >= 25 ? 28 : pt.max_system_watts > 0 ? 22 : 0;
      } else {
        dbA = 0;
      }
    }
    if (dbA > 0) {
      acousticPowerRatioSum += Math.pow(10, dbA / 10);
      if (dbA >= 40) {
        noisyDevices.push({ id: dev.instance_id, dbA });
      }
    }
  }
  const combinedNoiseDbA =
    acousticPowerRatioSum > 0
      ? roundTenths(10 * Math.log10(acousticPowerRatioSum))
      : 0;

  if (combinedNoiseDbA > 45) {
    issues.push({
      code: 'ACOUSTIC_NOISE_HIGH',
      severity: 'WARNING',
      stage: 5,
      affected_instances:
        noisyDevices.length > 0
          ? noisyDevices.map((n) => n.id)
          : allDevices.map((d) => d.instance_id),
      message: `Combined rack acoustic emission is ${combinedNoiseDbA} dB(A), exceeding the 45.0 dB(A) homelab/office comfort threshold.`,
      remediation_suggestions: [
        `Replace high-RPM fans with low-noise PWM fans or relocate high-noise equipment (${noisyDevices.map((n) => `'${n.id}' at ${n.dbA} dB(A)`).join(', ') || 'active switches/servers'}) to an enclosed utility closet.`
      ]
    });
  }

  const errorCount = issues.filter((i) => i.severity === 'ERROR').length;
  const warningCount = issues.filter((i) => i.severity === 'WARNING').length;

  return {
    status: errorCount === 0 ? 'VALID' : 'INVALID',
    is_valid: errorCount === 0,
    error_count: errorCount,
    warning_count: warningCount,
    issues,
    power_summary: {
      total_system_watts: totalSystemWatts,
      total_poe_watts: totalPoeWatts,
      pse_budgets: pseBudgetSummaries,
      power_sources: powerSourceSummaries,
      unpowered_active_instances: unpoweredActiveInstances
    },
    mechanical_summary: {
      total_weight_grams: totalWeightGrams,
      center_of_gravity_y_mm: cogYMm,
      normalized_cog_y: normalizedCogY,
      available_portal_u_positions: availablePortalUs,
      total_thermal_btu_hr: totalThermalBtuHr,
      combined_noise_db_a: combinedNoiseDbA,
      airflow_profile: airflowProfile
    }
  };
}
