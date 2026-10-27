import { roundMm } from '../geometry/precision.js';
import {
  type HardwareBlueprint,
  type HardwareBlueprintInput,
  HardwareBlueprintSchema,
  type PortDefinition,
  type PortGroupMacro
} from './hardware-blueprint.js';

/**
 * Expands a single declarative `PortGroupMacro` into an array of explicit `PortDefinition` objects.
 * Row-major grid traversal: column = i % columns, row = floor(i / columns).
 */
export function expandPortGroupMacro(group: PortGroupMacro): PortDefinition[] {
  const expanded: PortDefinition[] = [];
  const labelPrefix = group.label_prefix ?? group.id_prefix;

  for (let i = 0; i < group.count; i++) {
    const portIndex = group.start_index + i;
    const col = i % group.grid.columns;
    const row = Math.floor(i / group.grid.columns);

    const x_mm = roundMm(group.grid.origin_x_mm + col * group.grid.pitch_x_mm);
    const y_mm = roundMm(group.grid.origin_y_mm + row * group.grid.pitch_y_mm);

    const portDef: PortDefinition = {
      port_id: `${group.id_prefix}${portIndex}`,
      label: `${labelPrefix}${portIndex}`,
      face: group.face,
      connector_type: group.connector_type,
      direction: group.direction,
      capabilities: [...group.capabilities],
      coordinates: {
        x_mm,
        y_mm,
        orientation: group.orientation
      },
      ...(group.is_passthrough_coupler !== undefined
        ? { is_passthrough_coupler: group.is_passthrough_coupler }
        : {})
    };

    expanded.push(portDef);
  }

  return expanded;
}

/**
 * Parses, validates, and normalizes a HardwareBlueprint by expanding all `port_groups` macros
 * into flat, explicit `PortDefinition` objects inside `blueprint.ports`.
 * This function is idempotent.
 */
export function normalizeHardwareBlueprint(
  input: HardwareBlueprintInput | HardwareBlueprint
): HardwareBlueprint {
  const parsed = HardwareBlueprintSchema.parse(input);

  const portMap = new Map<string, PortDefinition>();

  for (const group of parsed.port_groups) {
    const groupPorts = expandPortGroupMacro(group);
    for (const port of groupPorts) {
      portMap.set(port.port_id, port);
    }
  }

  for (const explicitPort of parsed.ports) {
    portMap.set(explicitPort.port_id, explicitPort);
  }

  return {
    ...parsed,
    ports: Array.from(portMap.values())
  };
}

/**
 * Alias for normalizeHardwareBlueprint to support both naming conventions.
 */
export const expandBlueprintPorts = normalizeHardwareBlueprint;
