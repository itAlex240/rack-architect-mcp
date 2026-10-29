import * as fs from 'node:fs';
import * as path from 'node:path';
import type { z } from 'zod';
import {
  ConnectCablesInputSchema,
  DefineCustomBlueprintInputSchema,
  DisconnectCablesInputSchema,
  ExportDeliverablesInputSchema,
  GetDeviceBlueprintInputSchema,
  InitRackInputSchema,
  ModifyEquipmentInputSchema,
  MountEquipmentInputSchema,
  PlanExternalEndpointsInputSchema,
  SearchCatalogInputSchema,
  UndoRedoInputSchema,
  ValidateRackInputSchema,
  type CableConnection,
  type DiagnosticIssue,
  type ExternalEndpoint,
  type ExternalEndpointCategory,
  type MountedChildDevice,
  type MountedDevice,
  type RackProject
} from '@rack-mcp/core-domain';
import {
  generateBomMarkdown,
  generateElevationSvg,
  generateGlbBinary,
  generateProjectPrintableCarriers,
  generateWiringSchematicSvg
} from '@rack-mcp/exporters';
import { generateAsciiElevation } from '../ascii-elevation.js';
import type { ProjectStateManager } from '../state-manager.js';

export interface ToolExecutionEnvelope<T = unknown> {
  readonly status: 'VALID' | 'INVALID';
  readonly summary: string;
  readonly data: T;
  readonly issues: readonly DiagnosticIssue[];
}

export interface RemoteToolSessionContext {
  readonly sessionId: string;
  readonly getPublicBaseUrl: () => string;
}

export class RackMcpToolHandlers {
  private readonly stateManager: ProjectStateManager;
  private readonly remoteSession: RemoteToolSessionContext | undefined;

  public constructor(
    stateManager: ProjectStateManager,
    remoteSession?: RemoteToolSessionContext
  ) {
    this.stateManager = stateManager;
    this.remoteSession = remoteSession;
  }

  private finalize<T>(
    tool: string,
    env: ToolExecutionEnvelope<T>
  ): ToolExecutionEnvelope<T> {
    const firstLine = env.summary.split('\n')[0] ?? env.summary;
    this.stateManager.recordToolCall(tool, firstLine, env.status);

    if (this.remoteSession === undefined) {
      return env;
    }

    const baseUrl = this.remoteSession.getPublicBaseUrl().replace(/\/+$/, '');
    const encodedSession = encodeURIComponent(this.remoteSession.sessionId);
    const liveViewerUrl = `${baseUrl}/?session=${encodedSession}`;

    const enrichedData =
      typeof env.data === 'object' && env.data !== null && !Array.isArray(env.data)
        ? ({
            ...(env.data as Record<string, unknown>),
            live_viewer_url: liveViewerUrl
          } as T)
        : env.data;

    const shouldAppendViewerBanner =
      (tool === 'init_rack' ||
        tool === 'validate_rack' ||
        tool === 'export_deliverables') &&
      !env.summary.includes(liveViewerUrl);

    return {
      ...env,
      summary: shouldAppendViewerBanner
        ? `${env.summary}\nLive 3D Rack Viewer: ${liveViewerUrl}`
        : env.summary,
      data: enrichedData
    };
  }

  public searchCatalog(
    rawInput: z.input<typeof SearchCatalogInputSchema>
  ): ToolExecutionEnvelope {
    const input = SearchCatalogInputSchema.parse(rawInput);
    const catalog = this.stateManager.getCatalog();
    const results = catalog.searchCatalog({
      query: input.query,
      form_factor: input.form_factor,
      mount_type: input.mount_type,
      category: input.category,
      max_depth_mm: input.max_depth_mm,
      min_poe_budget_watts: input.min_poe_budget_watts,
      accepted_slot_type: input.accepted_slot_type
    });

    const summaries = results.map((bp) => ({
      slug: bp.slug,
      manufacturer: bp.manufacturer,
      model: bp.model,
      category: bp.category,
      mount_type: bp.mount_type,
      u_height: bp.geometry.u_height,
      width_mm: bp.geometry.width_mm,
      height_mm: bp.geometry.height_mm,
      depth_mm: bp.geometry.depth_mm,
      weight_grams: bp.geometry.weight_grams,
      electrical_role: bp.power_and_thermal.electrical_role,
      max_system_watts: bp.power_and_thermal.max_system_watts,
      poe_budget_watts: bp.power_and_thermal.poe_budget_watts ?? 0,
      slot_compatibility: bp.slot_compatibility ?? null,
      slots: bp.slots.map((s) => ({
        slot_id: s.slot_id,
        accepted_slot_type: s.accepted_slot_type,
        max_dimensions_mm: s.max_dimensions_mm
      })),
      port_count: bp.ports.length
    }));

    return this.finalize('search_catalog', {
      status: 'VALID',
      summary: `Found ${summaries.length} matching hardware blueprint(s) in catalog.`,
      data: {
        count: summaries.length,
        blueprints: summaries
      },
      issues: []
    });
  }

  public getDeviceBlueprint(
    rawInput: z.input<typeof GetDeviceBlueprintInputSchema>
  ): ToolExecutionEnvelope {
    const input = GetDeviceBlueprintInputSchema.parse(rawInput);
    const catalog = this.stateManager.getCatalog();
    const bp = catalog.getBlueprintBySlug(input.slug);

    if (bp === undefined) {
      const availableSlugs = catalog
        .getAllBlueprints()
        .map((b) => b.slug)
        .slice(0, 10)
        .join(', ');
      const issue: DiagnosticIssue = {
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        message: `Hardware blueprint '${input.slug}' was not found in the catalog.`,
        affected_instances: [input.slug],
        remediation_suggestions: [
          `Call search_catalog to find valid hardware slugs (e.g. ${availableSlugs}) or register a custom blueprint with define_custom_blueprint.`
        ]
      };
      return this.finalize('get_device_blueprint', {
        status: 'INVALID',
        summary: issue.message,
        data: { requested_slug: input.slug },
        issues: [issue]
      });
    }

    return this.finalize('get_device_blueprint', {
      status: 'VALID',
      summary: `Loaded blueprint '${bp.slug}' (${bp.manufacturer} ${bp.model}) with ${bp.ports.length} expanded ports and ${bp.slots.length} carrier slots.`,
      data: { blueprint: bp },
      issues: []
    });
  }

  public defineCustomBlueprint(
    rawInput: z.input<typeof DefineCustomBlueprintInputSchema>
  ): ToolExecutionEnvelope {
    const parsed = DefineCustomBlueprintInputSchema.safeParse(rawInput);
    if (!parsed.success) {
      const issue: DiagnosticIssue = {
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        message: `Custom blueprint validation failed: ${parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`,
        affected_instances: ['custom-blueprint'],
        remediation_suggestions: [
          'Ensure all required geometry, power_and_thermal, and port fields match HardwareBlueprintSchema.'
        ]
      };
      return this.finalize('define_custom_blueprint', {
        status: 'INVALID',
        summary: issue.message,
        data: { validation_errors: parsed.error.issues },
        issues: [issue]
      });
    }

    try {
      const res = this.stateManager.registerCustomBlueprint(parsed.data.blueprint);
      return this.finalize('define_custom_blueprint', {
        status: 'VALID',
        summary: `Registered custom hardware blueprint '${res.blueprint.slug}' with ${res.blueprint.ports.length} expanded ports.`,
        data: {
          slug: res.blueprint.slug,
          saved_path: res.savedPath ?? null,
          blueprint: res.blueprint
        },
        issues: []
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const issue: DiagnosticIssue = {
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        message: `Custom blueprint integrity error: ${msg}`,
        affected_instances: [parsed.data.blueprint.slug],
        remediation_suggestions: [
          'Fix overlapping local port coordinates or out-of-bounds port positions and retry define_custom_blueprint.'
        ]
      };
      return this.finalize('define_custom_blueprint', {
        status: 'INVALID',
        summary: issue.message,
        data: { slug: parsed.data.blueprint.slug },
        issues: [issue]
      });
    }
  }

  public initRack(
    rawInput: z.input<typeof InitRackInputSchema>
  ): ToolExecutionEnvelope {
    const input = InitRackInputSchema.parse(rawInput);
    const nextProject: RackProject = {
      schema_version: '1.0',
      project_name: input.project_name,
      rack: {
        standard: input.standard,
        u_height: input.u_height,
        rail_depth_mm: input.rail_depth_mm,
        enclosure_type: input.enclosure_type,
        front_door_clearance_mm: input.front_door_clearance_mm,
        rear_clearance_mm: input.rear_clearance_mm
      },
      mounted_devices: [],
      cables: [],
      external_endpoints: []
    };

    const scene = this.stateManager.applyMutation(nextProject, 'init');

    return this.finalize('init_rack', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: `Initialized ${input.standard} rack '${input.project_name}' (${input.u_height}U, ${input.rail_depth_mm}mm depth, ${input.enclosure_type}).`,
      data: {
        rack: scene.project.rack,
        geometry: {
          total_height_mm: scene.geometry.total_height_mm,
          rail_depth_mm: scene.geometry.rail_depth_mm,
          panel_width_mm: scene.geometry.panel_width_mm,
          aperture_width_mm: scene.geometry.aperture_width_mm
        },
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public mountEquipment(
    rawInput: z.input<typeof MountEquipmentInputSchema>
  ): ToolExecutionEnvelope {
    const input = MountEquipmentInputSchema.parse(rawInput);
    const currentProject = this.stateManager.getProject();
    const catalog = this.stateManager.getCatalog();

    // Verify instance_id uniqueness
    const existingIds = new Set<string>();
    for (const dev of currentProject.mounted_devices) {
      existingIds.add(dev.instance_id);
      for (const child of dev.children) {
        existingIds.add(child.instance_id);
      }
    }
    if (existingIds.has(input.instance_id)) {
      const issue: DiagnosticIssue = {
        code: 'CHASSIS_COLLISION',
        severity: 'ERROR',
        message: `Equipment instance_id '${input.instance_id}' is already mounted in the rack.`,
        affected_instances: [input.instance_id],
        remediation_suggestions: [
          `Choose a unique instance_id or use modify_equipment({ instance_id: '${input.instance_id}', action: 'move' }) to relocate the existing device.`
        ]
      };
      return this.finalize('mount_equipment', {
        status: 'INVALID',
        summary: issue.message,
        data: { instance_id: input.instance_id },
        issues: [issue]
      });
    }

    const bp = catalog.getBlueprintBySlug(input.blueprint_slug);
    if (bp === undefined) {
      const issue: DiagnosticIssue = {
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        message: `Cannot mount '${input.instance_id}': blueprint '${input.blueprint_slug}' does not exist in catalog.`,
        affected_instances: [input.instance_id, input.blueprint_slug],
        remediation_suggestions: [
          `Call search_catalog to find a valid blueprint slug or register '${input.blueprint_slug}' via define_custom_blueprint.`
        ]
      };
      return this.finalize('mount_equipment', {
        status: 'INVALID',
        summary: issue.message,
        data: { instance_id: input.instance_id, blueprint_slug: input.blueprint_slug },
        issues: [issue]
      });
    }

    const nextProject = structuredClone(currentProject);

    if (input.parent_carrier_id !== undefined) {
      if (input.slot_id === undefined) {
        const issue: DiagnosticIssue = {
          code: 'SLOT_INCOMPATIBLE',
          severity: 'ERROR',
          message: `Mounting sub-module '${input.instance_id}' into carrier '${input.parent_carrier_id}' requires 'slot_id'.`,
          affected_instances: [input.instance_id, input.parent_carrier_id],
          remediation_suggestions: [
            `Provide a valid slot_id from carrier '${input.parent_carrier_id}'.`
          ]
        };
        return this.finalize('mount_equipment', {
          status: 'INVALID',
          summary: issue.message,
          data: { instance_id: input.instance_id },
          issues: [issue]
        });
      }

      const carrier = nextProject.mounted_devices.find(
        (d) => d.instance_id === input.parent_carrier_id
      );
      if (carrier === undefined) {
        const availableCarriers = nextProject.mounted_devices.map((d) => d.instance_id);
        const issue: DiagnosticIssue = {
          code: 'SLOT_INCOMPATIBLE',
          severity: 'ERROR',
          message: `Parent carrier '${input.parent_carrier_id}' is not mounted in the rack.`,
          affected_instances: [input.instance_id, input.parent_carrier_id],
          remediation_suggestions: [
            availableCarriers.length > 0
              ? `Use an existing mounted carrier instance_id (${availableCarriers.join(', ')}) or mount '${input.parent_carrier_id}' first.`
              : `Mount a modular-carrier onto a rack unit first before mounting sub-module '${input.instance_id}'.`
          ]
        };
        return this.finalize('mount_equipment', {
          status: 'INVALID',
          summary: issue.message,
          data: { instance_id: input.instance_id },
          issues: [issue]
        });
      }

      const childEntry: MountedChildDevice = {
        instance_id: input.instance_id,
        blueprint_slug: input.blueprint_slug,
        slot_id: input.slot_id,
        ...(input.hostname !== undefined ? { hostname: input.hostname } : {})
      };
      carrier.children.push(childEntry);
    } else {
      if (input.u_position === undefined) {
        const issue: DiagnosticIssue = {
          code: 'OUT_OF_RACK_BOUNDS',
          severity: 'ERROR',
          message: `Mounting rack device '${input.instance_id}' requires 'u_position' (or 'parent_carrier_id' + 'slot_id' for sub-modules).`,
          affected_instances: [input.instance_id],
          remediation_suggestions: [
            `Specify u_position (1..${currentProject.rack.u_height}) for direct rack mounting, or parent_carrier_id + slot_id for sub-modules.`
          ]
        };
        return this.finalize('mount_equipment', {
          status: 'INVALID',
          summary: issue.message,
          data: { instance_id: input.instance_id },
          issues: [issue]
        });
      }

      const mountedEntry: MountedDevice = {
        instance_id: input.instance_id,
        blueprint_slug: input.blueprint_slug,
        u_position: input.u_position,
        face: input.face ?? 'front',
        children: [],
        ...(input.hostname !== undefined ? { hostname: input.hostname } : {})
      };
      nextProject.mounted_devices.push(mountedEntry);
    }

    const scene = this.stateManager.applyMutation(nextProject, 'mutation');
    const mountedGeometry = scene.geometry.devices_by_id.get(input.instance_id);

    return this.finalize('mount_equipment', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: scene.validation.is_valid
        ? `Mounted '${input.instance_id}' (${input.blueprint_slug}) cleanly with 0 validation errors.`
        : `Mounted '${input.instance_id}' (${input.blueprint_slug}), but ${scene.validation.error_count} validation error(s) were detected. Review remediation_suggestions.`,
      data: {
        mounted_device: mountedGeometry ?? null,
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public modifyEquipment(
    rawInput: z.input<typeof ModifyEquipmentInputSchema>
  ): ToolExecutionEnvelope {
    const input = ModifyEquipmentInputSchema.parse(rawInput);
    const currentProject = this.stateManager.getProject();
    const nextProject = structuredClone(currentProject);

    const topLevelIndex = nextProject.mounted_devices.findIndex(
      (d) => d.instance_id === input.instance_id
    );

    let parentCarrier: MountedDevice | undefined;
    let childIndex = -1;
    if (topLevelIndex === -1) {
      for (const dev of nextProject.mounted_devices) {
        const idx = dev.children.findIndex((c) => c.instance_id === input.instance_id);
        if (idx !== -1) {
          parentCarrier = dev;
          childIndex = idx;
          break;
        }
      }
    }

    if (topLevelIndex === -1 && childIndex === -1) {
      const allIds = nextProject.mounted_devices.flatMap((d) => [
        d.instance_id,
        ...d.children.map((c) => c.instance_id)
      ]);
      const issue: DiagnosticIssue = {
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        message: `Equipment instance '${input.instance_id}' was not found in the rack.`,
        affected_instances: [input.instance_id],
        remediation_suggestions: [
          allIds.length > 0
            ? `Use one of the currently mounted instance_ids: ${allIds.join(', ')}.`
            : 'No devices are currently mounted. Call mount_equipment first.'
        ]
      };
      return this.finalize('modify_equipment', {
        status: 'INVALID',
        summary: issue.message,
        data: { instance_id: input.instance_id },
        issues: [issue]
      });
    }

    const removedDeviceIds = new Set<string>();
    const removedCableIds: string[] = [];

    if (input.action === 'remove') {
      if (topLevelIndex !== -1) {
        const removed = nextProject.mounted_devices[topLevelIndex]!;
        removedDeviceIds.add(removed.instance_id);
        for (const child of removed.children) {
          removedDeviceIds.add(child.instance_id);
        }
        nextProject.mounted_devices.splice(topLevelIndex, 1);
      } else if (parentCarrier !== undefined && childIndex !== -1) {
        const removedChild = parentCarrier.children[childIndex]!;
        removedDeviceIds.add(removedChild.instance_id);
        parentCarrier.children.splice(childIndex, 1);
      }

      if (input.remove_connected_cables !== false) {
        nextProject.cables = nextProject.cables.filter((cable) => {
          const attached =
            removedDeviceIds.has(cable.from.instance_id) ||
            removedDeviceIds.has(cable.to.instance_id);
          if (attached) {
            removedCableIds.push(cable.cable_id);
          }
          return !attached;
        });
        nextProject.external_endpoints = (
          nextProject.external_endpoints ?? []
        ).filter((ext) => !removedDeviceIds.has(ext.patch_panel_instance_id));
      }
    } else if (input.action === 'rename') {
      const targetHostname = input.hostname ?? input.new_hostname;
      if (topLevelIndex !== -1) {
        const existing = nextProject.mounted_devices[topLevelIndex]!;
        nextProject.mounted_devices[topLevelIndex] = {
          instance_id: existing.instance_id,
          blueprint_slug: existing.blueprint_slug,
          u_position: existing.u_position,
          face: existing.face,
          children: existing.children,
          ...(targetHostname !== undefined ? { hostname: targetHostname } : {})
        };
      } else if (parentCarrier !== undefined && childIndex !== -1) {
        const existingChild = parentCarrier.children[childIndex]!;
        parentCarrier.children[childIndex] = {
          instance_id: existingChild.instance_id,
          blueprint_slug: existingChild.blueprint_slug,
          slot_id: existingChild.slot_id,
          ...(targetHostname !== undefined ? { hostname: targetHostname } : {})
        };
      }
    } else if (input.action === 'move') {
      const targetU = input.u_position ?? input.new_u_position;
      const targetFace = input.face ?? input.new_face;
      if (topLevelIndex !== -1) {
        const existing = nextProject.mounted_devices[topLevelIndex]!;
        nextProject.mounted_devices[topLevelIndex] = {
          ...existing,
          u_position: targetU ?? existing.u_position,
          face: targetFace ?? existing.face
        };
      } else if (parentCarrier !== undefined && childIndex !== -1) {
        const existingChild = parentCarrier.children[childIndex]!;
        const targetCarrierId = input.parent_carrier_id ?? parentCarrier.instance_id;
        const targetSlotId = input.slot_id ?? existingChild.slot_id;

        if (targetCarrierId !== parentCarrier.instance_id) {
          const newCarrier = nextProject.mounted_devices.find(
            (d) => d.instance_id === targetCarrierId
          );
          if (newCarrier === undefined) {
            const issue: DiagnosticIssue = {
              code: 'SLOT_INCOMPATIBLE',
              severity: 'ERROR',
              message: `Target carrier '${targetCarrierId}' does not exist in the rack.`,
              affected_instances: [input.instance_id, targetCarrierId],
              remediation_suggestions: [
                `Specify a valid mounted carrier instance_id.`
              ]
            };
            return this.finalize('modify_equipment', {
              status: 'INVALID',
              summary: issue.message,
              data: { instance_id: input.instance_id },
              issues: [issue]
            });
          }
          parentCarrier.children.splice(childIndex, 1);
          newCarrier.children.push({
            ...existingChild,
            slot_id: targetSlotId
          });
        } else {
          parentCarrier.children[childIndex] = {
            ...existingChild,
            slot_id: targetSlotId
          };
        }
      }
    }

    const scene = this.stateManager.applyMutation(nextProject, 'mutation');
    const updatedDevice = scene.geometry.devices_by_id.get(input.instance_id) ?? null;

    return this.finalize('modify_equipment', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: `Executed '${input.action}' on '${input.instance_id}'. Validation status: ${scene.validation.is_valid ? 'VALID (0 Errors)' : `INVALID (${scene.validation.error_count} Errors)`}.`,
      data: {
        action: input.action,
        instance_id: input.instance_id,
        updated_device: updatedDevice,
        removed_cable_ids: removedCableIds,
        rerouted_cables: scene.cable_routes.map((r) => ({
          cable_id: r.cable_id,
          raw_arc_length_mm: r.raw_arc_length_mm,
          required_length_mm: r.required_length_mm,
          recommended_commercial_mm: r.recommended_commercial_mm
        })),
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public connectCables(
    rawInput: z.input<typeof ConnectCablesInputSchema>
  ): ToolExecutionEnvelope {
    const input = ConnectCablesInputSchema.parse(rawInput);
    const currentProject = this.stateManager.getProject();
    const nextProject = structuredClone(currentProject);

    for (const cable of input.cables) {
      const existingIdx = nextProject.cables.findIndex(
        (c) => c.cable_id === cable.cable_id
      );
      if (existingIdx !== -1) {
        nextProject.cables[existingIdx] = cable;
      } else {
        nextProject.cables.push(cable);
      }
    }

    const scene = this.stateManager.applyMutation(nextProject, 'mutation');
    const addedIds = new Set(input.cables.map((c) => c.cable_id));
    const connectedRoutes = scene.cable_routes
      .filter((r) => addedIds.has(r.cable_id))
      .map((r) => ({
        cable_id: r.cable_id,
        cable_type: r.cable_type,
        route_case: r.route_case,
        raw_arc_length_mm: r.raw_arc_length_mm,
        required_length_mm: r.required_length_mm,
        recommended_commercial_mm: r.recommended_commercial_mm,
        portal_u: r.portal_u,
        assigned_ducts: r.assigned_ducts
      }));

    return this.finalize('connect_cables', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: scene.validation.is_valid
        ? `Connected ${input.cables.length} cable(s) and computed 3D Catmull-Rom routes cleanly.`
        : `Connected ${input.cables.length} cable(s), but ${scene.validation.error_count} validation error(s) were found. Check remediation_suggestions.`,
      data: {
        connected_cables: connectedRoutes,
        total_cables: scene.project.cables.length,
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public disconnectCables(
    rawInput: z.input<typeof DisconnectCablesInputSchema>
  ): ToolExecutionEnvelope {
    const input = DisconnectCablesInputSchema.parse(rawInput);
    const currentProject = this.stateManager.getProject();

    const cableIdSet = new Set(input.cable_ids ?? []);
    const targetInstanceId = input.instance_id;

    if (cableIdSet.size === 0 && targetInstanceId === undefined) {
      const issue: DiagnosticIssue = {
        code: 'PORT_NOT_FOUND',
        severity: 'ERROR',
        message:
          'disconnect_cables requires at least one of cable_ids (non-empty) or instance_id.',
        affected_instances: [],
        remediation_suggestions: [
          'Provide cable_ids with one or more cable identifiers, or specify a mounted device/carrier instance_id.'
        ]
      };
      return this.finalize('disconnect_cables', {
        status: 'INVALID',
        summary: issue.message,
        data: {
          removed_cable_ids: [],
          remaining_cables_count: currentProject.cables.length
        },
        issues: [issue]
      });
    }

    const nextProject = structuredClone(currentProject);
    const targetDeviceIds = new Set<string>();
    if (targetInstanceId !== undefined) {
      targetDeviceIds.add(targetInstanceId);
      const carrier = nextProject.mounted_devices.find(
        (d) => d.instance_id === targetInstanceId
      );
      if (carrier !== undefined) {
        for (const child of carrier.children) {
          targetDeviceIds.add(child.instance_id);
        }
      }
    }

    const removedCableIds: string[] = [];

    nextProject.cables = nextProject.cables.filter((cable) => {
      const matchesId = cableIdSet.has(cable.cable_id);
      const matchesDevice =
        targetDeviceIds.has(cable.from.instance_id) ||
        targetDeviceIds.has(cable.to.instance_id);
      if (matchesId || matchesDevice) {
        removedCableIds.push(cable.cable_id);
        return false;
      }
      return true;
    });

    const scene = this.stateManager.applyMutation(nextProject, 'mutation');

    return this.finalize('disconnect_cables', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: `Disconnected ${removedCableIds.length} cable(s). Remaining cables: ${scene.project.cables.length}.`,
      data: {
        removed_cable_ids: removedCableIds,
        remaining_cables_count: scene.project.cables.length,
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public planExternalEndpoints(
    rawInput: z.input<typeof PlanExternalEndpointsInputSchema>
  ): ToolExecutionEnvelope {
    const input = PlanExternalEndpointsInputSchema.parse(rawInput);
    const currentProject = this.stateManager.getProject();
    const catalog = this.stateManager.getCatalog();

    // Locate target patch panel
    const findMounted = (id: string) => {
      for (const dev of currentProject.mounted_devices) {
        if (dev.instance_id === id) {
          return { dev, face: dev.face };
        }
        for (const child of dev.children) {
          if (child.instance_id === id) {
            return { dev: child, face: dev.face };
          }
        }
      }
      return undefined;
    };

    const ppLookup = findMounted(input.patch_panel_instance_id);
    if (!ppLookup) {
      const mountedIds = currentProject.mounted_devices.map((d) => d.instance_id);
      const issue: DiagnosticIssue = {
        code: 'PORT_NOT_FOUND',
        severity: 'ERROR',
        message: `Patch panel '${input.patch_panel_instance_id}' is not mounted in the rack.`,
        affected_instances: [input.patch_panel_instance_id],
        remediation_suggestions: [
          mountedIds.length > 0
            ? `Mount a patch panel (e.g., 'generic-19inch-keystone-patch-24p-1u' or 'generic-10inch-keystone-patch-12p-1u') first, or use one of the mounted devices: ${mountedIds.join(', ')}.`
            : `Mount a patch panel first using mount_equipment.`
        ]
      };
      return this.finalize('plan_external_endpoints', {
        status: 'INVALID',
        summary: issue.message,
        data: { patch_panel_instance_id: input.patch_panel_instance_id },
        issues: [issue]
      });
    }

    const ppBp = catalog.getBlueprintBySlug(ppLookup.dev.blueprint_slug);
    if (!ppBp) {
      const issue: DiagnosticIssue = {
        code: 'BLUEPRINT_NOT_FOUND',
        severity: 'ERROR',
        message: `Blueprint '${ppLookup.dev.blueprint_slug}' for '${input.patch_panel_instance_id}' was not found.`,
        affected_instances: [input.patch_panel_instance_id],
        remediation_suggestions: [`Verify blueprint '${ppLookup.dev.blueprint_slug}' exists in catalog.`]
      };
      return this.finalize('plan_external_endpoints', {
        status: 'INVALID',
        summary: issue.message,
        data: { patch_panel_instance_id: input.patch_panel_instance_id },
        issues: [issue]
      });
    }

    let switchLookup: ReturnType<typeof findMounted> | undefined;
    let switchBp: ReturnType<typeof catalog.getBlueprintBySlug> | undefined;
    if (input.auto_connect_switch_instance_id !== undefined) {
      switchLookup = findMounted(input.auto_connect_switch_instance_id);
      if (!switchLookup) {
        const issue: DiagnosticIssue = {
          code: 'PORT_NOT_FOUND',
          severity: 'ERROR',
          message: `Target switch '${input.auto_connect_switch_instance_id}' is not mounted in the rack.`,
          affected_instances: [input.auto_connect_switch_instance_id],
          remediation_suggestions: [
            `Mount switch '${input.auto_connect_switch_instance_id}' first or specify a mounted switch instance_id.`
          ]
        };
        return this.finalize('plan_external_endpoints', {
          status: 'INVALID',
          summary: issue.message,
          data: { auto_connect_switch_instance_id: input.auto_connect_switch_instance_id },
          issues: [issue]
        });
      }
      switchBp = catalog.getBlueprintBySlug(switchLookup.dev.blueprint_slug);
    }

    const nextProject = structuredClone(currentProject);
    nextProject.external_endpoints = nextProject.external_endpoints ?? [];

    if (input.clear_existing) {
      const clearedPorts = new Set(
        nextProject.external_endpoints
          .filter((e) => e.patch_panel_instance_id === input.patch_panel_instance_id)
          .map((e) => e.patch_panel_port_id)
      );
      nextProject.external_endpoints = nextProject.external_endpoints.filter(
        (e) => e.patch_panel_instance_id !== input.patch_panel_instance_id
      );
      nextProject.cables = nextProject.cables.filter((c) => {
        const isFromClearedPp =
          c.from.instance_id === input.patch_panel_instance_id &&
          clearedPorts.has(c.from.port_id);
        const isToClearedPp =
          c.to.instance_id === input.patch_panel_instance_id &&
          clearedPorts.has(c.to.port_id);
        return !isFromClearedPp && !isToClearedPp;
      });
    }

    const defaultCategoryColors: Record<ExternalEndpointCategory, string> = {
      'poe-camera': '#F59E0B',
      'wifi-ap': '#06B6D4',
      'wall-outlet-pc': '#3B82F6',
      'projector-media': '#A855F7',
      'workstation-dock': '#10B981',
      'iot-controller': '#EC4899',
      'isp-wan-uplink': '#EF4444',
      'other-lan': '#38BDF8'
    };

    interface PendingDrop {
      endpoint_id?: string | undefined;
      label: string;
      category: ExternalEndpointCategory;
      room_or_zone?: string | undefined;
      poe_draw_watts: number;
      required_speed: '100m' | '1gbe' | '2.5gbe' | '10gbe';
      patch_panel_port_id?: string | undefined;
      color_hex: string;
      vlan_id?: number | undefined;
      notes?: string | undefined;
    }

    const pendingDrops: PendingDrop[] = [];

    for (const grp of input.groups ?? []) {
      const idPrefix =
        grp.id_prefix ??
        grp.category
          .replace(/[^a-z0-9]+/gi, '-')
          .replace(/^-|-$/g, '')
          .toLowerCase();
      const colorHex = grp.color_hex ?? defaultCategoryColors[grp.category];
      for (let i = 0; i < grp.count; i++) {
        const customLabel = grp.custom_labels?.[i];
        const label =
          customLabel ??
          (grp.count === 1 ? grp.label_prefix : `${grp.label_prefix} ${i + 1}`);
        pendingDrops.push({
          endpoint_id: `${idPrefix}-${String(i + 1).padStart(2, '0')}`,
          label,
          category: grp.category,
          room_or_zone: grp.room_or_zone,
          poe_draw_watts: grp.poe_draw_watts,
          required_speed: grp.required_speed ?? '1gbe',
          color_hex: colorHex,
          vlan_id: grp.vlan_id
        });
      }
    }

    for (const ep of input.endpoints ?? []) {
      const colorHex = ep.color_hex ?? defaultCategoryColors[ep.category];
      pendingDrops.push({
        endpoint_id: ep.endpoint_id,
        label: ep.label,
        category: ep.category,
        room_or_zone: ep.room_or_zone,
        poe_draw_watts: ep.poe_draw_watts,
        required_speed: ep.required_speed ?? '1gbe',
        patch_panel_port_id: ep.patch_panel_port_id,
        color_hex: colorHex,
        vlan_id: ep.vlan_id,
        notes: ep.notes
      });
    }

    const usedEndpointIds = new Set(
      nextProject.external_endpoints.map((e) => e.endpoint_id)
    );
    const usedRearPpPorts = new Set(
      nextProject.external_endpoints
        .filter((e) => e.patch_panel_instance_id === input.patch_panel_instance_id)
        .map((e) => e.patch_panel_port_id)
    );

    const ppPorts = ppBp.ports.filter((p) => p.connector_type === 'rj45');
    let nextPpIndex =
      input.start_port_number !== undefined
        ? Math.max(0, input.start_port_number - 1)
        : 0;

    // Prepare available Ethernet ports on auto_connect_switch_instance_id
    const occupiedSwitchPorts = new Set<string>();
    if (input.auto_connect_switch_instance_id !== undefined) {
      for (const c of nextProject.cables) {
        if (c.from.instance_id === input.auto_connect_switch_instance_id) {
          occupiedSwitchPorts.add(c.from.port_id);
        }
        if (c.to.instance_id === input.auto_connect_switch_instance_id) {
          occupiedSwitchPorts.add(c.to.port_id);
        }
      }
    }
    const switchEthPorts =
      switchBp?.ports.filter((p) => p.connector_type === 'rj45') ?? [];
    let nextSwitchIndex = Math.max(
      0,
      (input.auto_connect_switch_start_port ?? 1) - 1
    );

    const addedEndpoints: ExternalEndpoint[] = [];
    const autoCreatedCables: CableConnection[] = [];
    const patchingGuide: Array<{
      readonly step_number: number;
      readonly endpoint_id: string;
      readonly label: string;
      readonly room_or_zone: string;
      readonly poe_draw_watts: number;
      readonly rear_punchdown: string;
      readonly front_patch_cable: string;
      readonly color_hex: string;
    }> = [];

    for (let idx = 0; idx < pendingDrops.length; idx++) {
      const item = pendingDrops[idx]!;

      // Resolve unique endpoint_id
      let endpointId =
        item.endpoint_id ??
        `ext-${String(nextProject.external_endpoints.length + 1).padStart(2, '0')}`;
      let suffix = 2;
      while (usedEndpointIds.has(endpointId)) {
        endpointId = `${item.endpoint_id ?? 'ext'}-${suffix}`;
        suffix++;
      }
      usedEndpointIds.add(endpointId);

      // Resolve target patch panel port
      let ppPortId = item.patch_panel_port_id;
      if (!ppPortId) {
        while (
          nextPpIndex < ppPorts.length &&
          usedRearPpPorts.has(ppPorts[nextPpIndex]!.port_id)
        ) {
          nextPpIndex++;
        }
        ppPortId =
          ppPorts[nextPpIndex]?.port_id ?? `p${nextPpIndex + 1}`;
        nextPpIndex++;
      }
      usedRearPpPorts.add(ppPortId);

      const extObj: ExternalEndpoint = {
        endpoint_id: endpointId,
        label: item.label,
        category: item.category,
        poe_draw_watts: item.poe_draw_watts,
        required_speed: item.required_speed,
        entry_position: input.entry_position ?? 'top-rear',
        patch_panel_instance_id: input.patch_panel_instance_id,
        patch_panel_port_id: ppPortId,
        color_hex: item.color_hex,
        ...(item.room_or_zone !== undefined
          ? { room_or_zone: item.room_or_zone }
          : {}),
        ...(item.vlan_id !== undefined ? { vlan_id: item.vlan_id } : {}),
        ...(item.notes !== undefined ? { notes: item.notes } : {})
      };
      nextProject.external_endpoints.push(extObj);
      addedEndpoints.push(extObj);

      let frontPatchDescription = 'Noch nicht vorne gepatcht';

      if (
        input.auto_connect_switch_instance_id !== undefined &&
        switchLookup !== undefined
      ) {
        let swPortId: string | undefined;
        // Prefer 1:1 vertical port alignment (e.g. Patch Panel p8 -> Switch eth8)
        // when auto_connect_switch_start_port was not explicitly overridden.
        if (input.auto_connect_switch_start_port === undefined) {
          const ppPortIdx = ppPorts.findIndex((p) => p.port_id === ppPortId);
          const alignedSwPort =
            ppPortIdx >= 0 ? switchEthPorts[ppPortIdx] : undefined;
          if (
            alignedSwPort !== undefined &&
            !occupiedSwitchPorts.has(alignedSwPort.port_id)
          ) {
            swPortId = alignedSwPort.port_id;
          }
        }
        if (swPortId === undefined) {
          while (
            nextSwitchIndex < switchEthPorts.length &&
            occupiedSwitchPorts.has(switchEthPorts[nextSwitchIndex]!.port_id)
          ) {
            nextSwitchIndex++;
          }
          swPortId =
            switchEthPorts[nextSwitchIndex]?.port_id ??
            `eth${nextSwitchIndex + 1}`;
          nextSwitchIndex++;
        }
        occupiedSwitchPorts.add(swPortId);

        const cableId = `patch-${endpointId}`;
        const poeTag =
          extObj.poe_draw_watts > 0 ? ` [PoE ${extObj.poe_draw_watts}W]` : '';
        const zoneTag = extObj.room_or_zone ? ` (${extObj.room_or_zone})` : '';
        const cableLabel = `${ppPortId.toUpperCase()} · ${extObj.label}${zoneTag}${poeTag}`;

        const cable: CableConnection = {
          cable_id: cableId,
          from: {
            instance_id: input.patch_panel_instance_id,
            port_id: ppPortId,
            face: 'front'
          },
          to: {
            instance_id: input.auto_connect_switch_instance_id,
            port_id: swPortId,
            face: switchLookup.face
          },
          cable_type: 'cat6a',
          color_hex: extObj.color_hex,
          label: cableLabel,
          ...(extObj.vlan_id !== undefined ? { vlan_id: extObj.vlan_id } : {})
        };

        const existingCableIdx = nextProject.cables.findIndex(
          (c) => c.cable_id === cableId
        );
        if (existingCableIdx !== -1) {
          nextProject.cables[existingCableIdx] = cable;
        } else {
          nextProject.cables.push(cable);
        }
        autoCreatedCables.push(cable);
        frontPatchDescription = `${input.patch_panel_instance_id}:${ppPortId} (Vorne) -> ${input.auto_connect_switch_instance_id}:${swPortId}`;
      }

      patchingGuide.push({
        step_number: idx + 1,
        endpoint_id: extObj.endpoint_id,
        label: extObj.label,
        room_or_zone: extObj.room_or_zone ?? 'Gebäude',
        poe_draw_watts: extObj.poe_draw_watts,
        rear_punchdown: `${input.patch_panel_instance_id}:${ppPortId} (Hinten / Rear)`,
        front_patch_cable: frontPatchDescription,
        color_hex: extObj.color_hex
      });
    }

    const scene = this.stateManager.applyMutation(nextProject, 'mutation');

    return this.finalize('plan_external_endpoints', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: scene.validation.is_valid
        ? `Planned ${addedEndpoints.length} external building/room drop(s) on '${input.patch_panel_instance_id}' (rear) and auto-patched ${autoCreatedCables.length} front Cat6A cable(s) with 0 validation errors.`
        : `Planned ${addedEndpoints.length} external building/room drop(s) on '${input.patch_panel_instance_id}', but ${scene.validation.error_count} validation error(s) occurred. Review remediation_suggestions.`,
      data: {
        added_endpoints_count: addedEndpoints.length,
        auto_patched_cables_count: autoCreatedCables.length,
        total_external_endpoints: scene.project.external_endpoints.length,
        patching_guide: patchingGuide,
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public validateRack(
    rawInput: z.input<typeof ValidateRackInputSchema> = {}
  ): ToolExecutionEnvelope {
    ValidateRackInputSchema.parse(rawInput);
    const scene = this.stateManager.getScene();
    const catalog = this.stateManager.getCatalog();
    const asciiElevation = generateAsciiElevation(scene, catalog);

    return this.finalize('validate_rack', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: scene.validation.is_valid
        ? `Rack '${scene.project.project_name}' is VALID (0 Errors, ${scene.validation.warning_count} Warnings).\n\n${asciiElevation}`
        : `Rack '${scene.project.project_name}' is INVALID (${scene.validation.error_count} Errors, ${scene.validation.warning_count} Warnings).\n\n${asciiElevation}`,
      data: {
        is_valid: scene.validation.is_valid,
        ascii_elevation: asciiElevation,
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public exportDeliverables(
    rawInput: z.input<typeof ExportDeliverablesInputSchema> = {}
  ): ToolExecutionEnvelope {
    const input = ExportDeliverablesInputSchema.parse(rawInput);
    const scene = this.stateManager.getScene();
    const catalog = this.stateManager.getCatalog();
    const pwr = scene.validation.power_summary;
    const totalPoeBudget = pwr.pse_budgets.reduce((s, b) => s + b.poe_budget_watts, 0);

    // Hosted Remote Multi-Session Mode: never write arbitrary files to the server filesystem.
    // Instead, compute deterministic byte sizes in memory and return direct HTTPS download URLs.
    if (this.remoteSession !== undefined) {
      const baseUrl = this.remoteSession.getPublicBaseUrl().replace(/\/+$/, '');
      const sid = encodeURIComponent(this.remoteSession.sessionId);
      const liveViewerUrl = `${baseUrl}/?session=${sid}`;
      const rackYamlUrl = `${baseUrl}/api/export/rack.yaml?session=${sid}`;

      const remoteFiles: Array<{
        readonly format: string;
        readonly path: string;
        readonly download_url: string;
        readonly filename: string;
        readonly size_bytes: number;
      }> = [];

      let cachedCarriers: ReturnType<typeof generateProjectPrintableCarriers> | undefined;
      const getCarriers = () => {
        if (cachedCarriers === undefined) {
          cachedCarriers = generateProjectPrintableCarriers(scene);
        }
        return cachedCarriers;
      };

      for (const fmt of input.formats) {
        if (fmt === 'elevation-svg') {
          const svg = generateElevationSvg(scene);
          const url = `${baseUrl}/api/export/elevation.svg?session=${sid}`;
          remoteFiles.push({
            format: fmt,
            path: url,
            download_url: url,
            filename: 'elevation.svg',
            size_bytes: Buffer.byteLength(svg, 'utf8')
          });
        } else if (fmt === 'wiring-svg') {
          const svg = generateWiringSchematicSvg(scene);
          const url = `${baseUrl}/api/export/wiring.svg?session=${sid}`;
          remoteFiles.push({
            format: fmt,
            path: url,
            download_url: url,
            filename: 'wiring-schematic.svg',
            size_bytes: Buffer.byteLength(svg, 'utf8')
          });
        } else if (fmt === 'bom-md') {
          const md = generateBomMarkdown(scene, catalog.toRecord());
          const url = `${baseUrl}/api/export/bom.md?session=${sid}`;
          remoteFiles.push({
            format: fmt,
            path: url,
            download_url: url,
            filename: 'BOM.md',
            size_bytes: Buffer.byteLength(md, 'utf8')
          });
        } else if (fmt === 'scene-glb') {
          const glb = generateGlbBinary(scene);
          const url = `${baseUrl}/api/export/scene.glb?session=${sid}`;
          remoteFiles.push({
            format: fmt,
            path: url,
            download_url: url,
            filename: 'rack-scene.glb',
            size_bytes: glb.byteLength
          });
        } else if (fmt === 'carrier-scad') {
          for (const item of getCarriers()) {
            const safeName = path.basename(item.filename_scad);
            const url = `${baseUrl}/api/export/printable/${encodeURIComponent(safeName)}?session=${sid}`;
            remoteFiles.push({
              format: fmt,
              path: url,
              download_url: url,
              filename: safeName,
              size_bytes: Buffer.byteLength(item.openscad_code, 'utf8')
            });
          }
        } else if (fmt === 'carrier-stl') {
          for (const item of getCarriers()) {
            const safeName = path.basename(item.filename_stl);
            const url = `${baseUrl}/api/export/printable/${encodeURIComponent(safeName)}?session=${sid}`;
            remoteFiles.push({
              format: fmt,
              path: url,
              download_url: url,
              filename: safeName,
              size_bytes: Buffer.byteLength(item.stl_ascii, 'utf8')
            });
          }
        }
      }

      return this.finalize('export_deliverables', {
        status: scene.validation.is_valid ? 'VALID' : 'INVALID',
        summary: `Generated ${remoteFiles.length} downloadable deliverable URL(s) for remote session.`,
        data: {
          output_dir: `${baseUrl}/api/export?session=${sid}`,
          live_viewer_url: liveViewerUrl,
          rack_yaml_url: rackYamlUrl,
          exported_files: remoteFiles,
          bom_summary: {
            mounted_devices_count: scene.geometry.devices.length,
            cables_count: scene.project.cables.length,
            total_power_draw_watts: pwr.total_system_watts,
            total_poe_draw_watts: pwr.total_poe_watts,
            total_poe_budget_watts: totalPoeBudget
          },
          validation: scene.validation
        },
        issues: scene.validation.issues
      });
    }

    const projectPath = this.stateManager.getProjectPath();

    const outDir =
      input.output_dir !== undefined
        ? path.resolve(input.output_dir)
        : projectPath !== undefined
          ? path.dirname(projectPath)
          : path.resolve(process.cwd(), 'exports');

    fs.mkdirSync(outDir, { recursive: true });

    const exportedFiles: Array<{
      readonly format: string;
      readonly path: string;
      readonly size_bytes: number;
    }> = [];

    for (const fmt of input.formats) {
      if (fmt === 'elevation-svg') {
        const svg = generateElevationSvg(scene);
        const filePath = path.join(outDir, 'elevation.svg');
        fs.writeFileSync(filePath, svg, 'utf8');
        exportedFiles.push({
          format: fmt,
          path: filePath,
          size_bytes: Buffer.byteLength(svg, 'utf8')
        });
      } else if (fmt === 'wiring-svg') {
        const svg = generateWiringSchematicSvg(scene);
        const filePath = path.join(outDir, 'wiring-schematic.svg');
        fs.writeFileSync(filePath, svg, 'utf8');
        exportedFiles.push({
          format: fmt,
          path: filePath,
          size_bytes: Buffer.byteLength(svg, 'utf8')
        });
      } else if (fmt === 'bom-md') {
        const md = generateBomMarkdown(scene, catalog.toRecord());
        const filePath = path.join(outDir, 'BOM.md');
        fs.writeFileSync(filePath, md, 'utf8');
        exportedFiles.push({
          format: fmt,
          path: filePath,
          size_bytes: Buffer.byteLength(md, 'utf8')
        });
      } else if (fmt === 'scene-glb') {
        const glb = generateGlbBinary(scene);
        const filePath = path.join(outDir, 'rack-scene.glb');
        fs.writeFileSync(filePath, glb);
        exportedFiles.push({
          format: fmt,
          path: filePath,
          size_bytes: glb.byteLength
        });
      } else if (fmt === 'carrier-scad') {
        const carriers = generateProjectPrintableCarriers(scene);
        for (const item of carriers) {
          const safeName = path.basename(item.filename_scad);
          const filePath = path.resolve(outDir, safeName);
          if (filePath.startsWith(outDir + path.sep)) {
            fs.writeFileSync(filePath, item.openscad_code, 'utf8');
            exportedFiles.push({
              format: fmt,
              path: filePath,
              size_bytes: Buffer.byteLength(item.openscad_code, 'utf8')
            });
          }
        }
      } else if (fmt === 'carrier-stl') {
        const carriers = generateProjectPrintableCarriers(scene);
        for (const item of carriers) {
          const safeName = path.basename(item.filename_stl);
          const filePath = path.resolve(outDir, safeName);
          if (filePath.startsWith(outDir + path.sep)) {
            fs.writeFileSync(filePath, item.stl_ascii, 'utf8');
            exportedFiles.push({
              format: fmt,
              path: filePath,
              size_bytes: Buffer.byteLength(item.stl_ascii, 'utf8')
            });
          }
        }
      }
    }

    return this.finalize('export_deliverables', {
      status: scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: `Exported ${exportedFiles.length} deliverable file(s) to '${outDir}'.`,
      data: {
        output_dir: outDir,
        exported_files: exportedFiles,
        bom_summary: {
          mounted_devices_count: scene.geometry.devices.length,
          cables_count: scene.project.cables.length,
          total_power_draw_watts: pwr.total_system_watts,
          total_poe_draw_watts: pwr.total_poe_watts,
          total_poe_budget_watts: totalPoeBudget
        },
        validation: scene.validation
      },
      issues: scene.validation.issues
    });
  }

  public undoRedo(
    rawInput: z.input<typeof UndoRedoInputSchema>
  ): ToolExecutionEnvelope {
    const input = UndoRedoInputSchema.parse(rawInput);
    const catalog = this.stateManager.getCatalog();
    const res =
      input.action === 'undo'
        ? this.stateManager.undo()
        : this.stateManager.redo();
    const asciiElevation = generateAsciiElevation(res.scene, catalog);

    return this.finalize('undo_redo', {
      status: res.scene.validation.is_valid ? 'VALID' : 'INVALID',
      summary: res.applied
        ? `Successfully applied '${input.action}'. Undo stack: ${res.undoAvailable}, Redo stack: ${res.redoAvailable}.`
        : `Nothing to '${input.action}' (stack is empty).`,
      data: {
        action: input.action,
        applied: res.applied,
        undo_available: res.undoAvailable,
        redo_available: res.redoAvailable,
        ascii_elevation: asciiElevation,
        validation: res.scene.validation
      },
      issues: res.scene.validation.issues
    });
  }
}
