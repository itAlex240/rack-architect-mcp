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

/**
 * Full deterministic evaluation pipeline for a `RackProject`:
 * 1. Validates & parses project schema
 * 2. Computes 3D world geometry (`B_chassis`, `B_clearance`, sub-slots, port coordinates & normals)
 * 3. Runs the 5-stage constraint & validation solver with self-correction remediation synthesis
 * 4. Computes 3D Catmull-Rom cable splines, hexagonal duct bundling, and commercial length bins
 */
export function evaluateRackScene(
  projectInput: RackProject | RackProjectInput,
  catalog: BlueprintCatalogMap
): ComputedRackScene {
  const project = RackProjectSchema.parse(projectInput);
  const geometry = computeRackGeometry(project, catalog);
  const validation = validateRackProject(project, catalog, geometry);
  const cableRoutes = routeProjectCables(project, catalog, geometry);

  return {
    project,
    geometry,
    validation,
    cable_routes: cableRoutes
  };
}
