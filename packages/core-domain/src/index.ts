export * from './schemas/index.js';
export * from './geometry/index.js';
export * from './validation/index.js';
export * from './routing/index.js';

import {
  type BlueprintCatalogMap,
  type ComputedDeviceGeometry,
  type ComputedRackGeometry,
  computeRackGeometry
} from './geometry/index.js';
import {
  type ComputedCableRoute,
  routeProjectCables
} from './routing/index.js';
import {
  type RackProject,
  type RackProjectInput,
  RackProjectSchema,
  type ValidationResult
} from './schemas/index.js';
import { validateRackProject } from './validation/index.js';

export interface ComputedRackScene {
  readonly project: RackProject;
  readonly geometry: ComputedRackGeometry;
  readonly validation: ValidationResult;
  readonly cable_routes: readonly ComputedCableRoute[];
}

export interface SerializedRackGeometry extends Omit<ComputedRackGeometry, 'devices_by_id'> {
  readonly devices_by_id: Readonly<Record<string, ComputedDeviceGeometry>>;
}

export interface SerializedRackScene {
  readonly project: RackProject;
  readonly geometry: SerializedRackGeometry;
  readonly validation: ValidationResult;
  readonly cable_routes: readonly ComputedCableRoute[];
}

/**
 * Converts a `ComputedRackScene` (whose `geometry.devices_by_id` is a `ReadonlyMap`)
 * into a JSON-serializable `SerializedRackScene` for WebSocket / HTTP transport.
 */
export function serializeRackScene(scene: ComputedRackScene): SerializedRackScene {
  const devicesRecord: Record<string, ComputedDeviceGeometry> = {};
  for (const [id, dev] of scene.geometry.devices_by_id.entries()) {
    if (id === '__proto__' || id === 'constructor' || id === 'prototype') {
      continue;
    }
    Object.defineProperty(devicesRecord, id, {
      value: dev,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }

  return {
    project: scene.project,
    geometry: {
      rack: scene.geometry.rack,
      panel_width_mm: scene.geometry.panel_width_mm,
      aperture_width_mm: scene.geometry.aperture_width_mm,
      total_height_mm: scene.geometry.total_height_mm,
      rail_depth_mm: scene.geometry.rail_depth_mm,
      devices: scene.geometry.devices,
      devices_by_id: devicesRecord
    },
    validation: scene.validation,
    cable_routes: scene.cable_routes
  };
}

function canReuseCableRoutes(
  prev: RackProject,
  next: RackProject
): boolean {
  if (
    prev.rack.standard !== next.rack.standard ||
    prev.rack.u_height !== next.rack.u_height ||
    prev.rack.rail_depth_mm !== next.rack.rail_depth_mm ||
    prev.rack.enclosure_type !== next.rack.enclosure_type ||
    prev.rack.front_door_clearance_mm !== next.rack.front_door_clearance_mm ||
    prev.rack.rear_clearance_mm !== next.rack.rear_clearance_mm
  ) {
    return false;
  }

  if (
    prev.mounted_devices.length !== next.mounted_devices.length ||
    prev.cables.length !== next.cables.length
  ) {
    return false;
  }

  for (let i = 0; i < prev.mounted_devices.length; i++) {
    const a = prev.mounted_devices[i];
    const b = next.mounted_devices[i];
    if (
      a === undefined ||
      b === undefined ||
      a.instance_id !== b.instance_id ||
      a.blueprint_slug !== b.blueprint_slug ||
      a.u_position !== b.u_position ||
      a.face !== b.face ||
      a.children.length !== b.children.length
    ) {
      return false;
    }
    for (let j = 0; j < a.children.length; j++) {
      const ca = a.children[j];
      const cb = b.children[j];
      if (
        ca === undefined ||
        cb === undefined ||
        ca.instance_id !== cb.instance_id ||
        ca.blueprint_slug !== cb.blueprint_slug ||
        ca.slot_id !== cb.slot_id
      ) {
        return false;
      }
    }
  }

  for (let i = 0; i < prev.cables.length; i++) {
    const a = prev.cables[i];
    const b = next.cables[i];
    if (
      a === undefined ||
      b === undefined ||
      a.cable_id !== b.cable_id ||
      a.cable_type !== b.cable_type ||
      a.preferred_portal_u !== b.preferred_portal_u ||
      (a.routing_mode ?? 'shortest-direct') !== (b.routing_mode ?? 'shortest-direct') ||
      a.from.instance_id !== b.from.instance_id ||
      a.from.port_id !== b.from.port_id ||
      a.from.face !== b.from.face ||
      a.to.instance_id !== b.to.instance_id ||
      a.to.port_id !== b.to.port_id ||
      a.to.face !== b.to.face
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Full deterministic evaluation pipeline for a `RackProject`:
 * 1. Validates & parses project schema
 * 2. Computes 3D world geometry (`B_chassis`, `B_clearance`, sub-slots, port coordinates & normals)
 * 3. Runs the 5-stage constraint & validation solver with self-correction remediation synthesis
 * 4. Computes 3D Catmull-Rom cable splines, hexagonal duct bundling, and commercial length bins
 */
export function evaluateRackScene(
  projectInput: RackProject | RackProjectInput,
  catalog: BlueprintCatalogMap,
  previousScene?: ComputedRackScene
): ComputedRackScene {
  const project = RackProjectSchema.parse(projectInput);
  const geometry = computeRackGeometry(project, catalog);
  const validation = validateRackProject(project, catalog, geometry);
  let cableRoutes: readonly ComputedCableRoute[];
  if (
    previousScene !== undefined &&
    canReuseCableRoutes(previousScene.project, project)
  ) {
    const cableMetaById = new Map(
      project.cables.map((c) => [c.cable_id, c] as const)
    );
    cableRoutes = previousScene.cable_routes.map((route) => {
      const updated = cableMetaById.get(route.cable_id);
      if (updated === undefined) {
        return route;
      }
      return {
        ...route,
        color_hex: updated.color_hex,
        label: updated.label
      };
    });
  } else {
    cableRoutes = routeProjectCables(project, catalog, geometry);
  }

  return {
    project,
    geometry,
    validation,
    cable_routes: cableRoutes
  };
}
