import { z } from 'zod';
import {
  HardwareBlueprintSchema,
  HardwareCategorySchema,
  RackFaceSchema
} from './hardware-blueprint.js';
import {
  CableConnectionSchema,
  EnclosureTypeSchema,
  ExternalEndpointCategorySchema,
  ExternalEndpointSpeedSchema,
  ExternalEntryPositionSchema,
  RackStandardSchema
} from './rack-project.js';

/**
 * Tool Annotations aligned with MCP and WebMCP (`document.modelContext.registerTool`) standards.
 */
export interface McpToolAnnotations {
  readonly readOnlyHint: boolean;
  readonly consequentialHint?: boolean;
  readonly untrustedContentHint?: boolean;
}

export const SearchFormFactorSchema = z
  .enum([
    'rackmount-19',
    'rackmount-10',
    'rackmount-6',
    'sub-module',
    'shelf-standing',
    '10inch',
    '19inch',
    '6inch'
  ])
  .describe('Hardware form factor or mounting mechanism filter.');
export type SearchFormFactor = z.infer<typeof SearchFormFactorSchema>;

export const SearchCatalogInputSchema = z.object({
  query: z
    .string()
    .optional()
    .describe('Free-text search filter matching manufacturer, model, or slug.'),
  form_factor: SearchFormFactorSchema.optional(),
  mount_type: SearchFormFactorSchema.optional(),
  category: HardwareCategorySchema.optional(),
  max_depth_mm: z
    .number()
    .positive()
    .optional()
    .describe('Maximum allowed chassis depth in millimeters.'),
  min_poe_budget_watts: z
    .number()
    .nonnegative()
    .optional()
    .describe('Minimum required PoE power budget in watts.'),
  accepted_slot_type: z
    .string()
    .min(1)
    .optional()
    .describe('Sub-module slot compatibility token (e.g., "mini-pc-1liter", "standard-keystone").')
});

export const GetDeviceBlueprintInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .describe('Exact hardware catalog blueprint slug to retrieve.')
});

export const DefineCustomBlueprintInputSchema = z.object({
  blueprint: HardwareBlueprintSchema
});

export const InitRackInputSchema = z.object({
  project_name: z.string().min(1).default('Rack Project').describe('Human-readable project name.'),
  standard: RackStandardSchema,
  u_height: z.number().int().positive().describe('Total usable rack height in U (1U = 44.45mm).'),
  rail_depth_mm: z.number().positive().describe('Front-to-rear mounting rail depth in millimeters.'),
  enclosure_type: EnclosureTypeSchema.default('open-frame'),
  front_door_clearance_mm: z.number().nonnegative().default(45).describe('Clearance in mm between front rails and door.'),
  rear_clearance_mm: z.number().nonnegative().default(40).describe('Clearance in mm behind rear rails.')
});

export const MountEquipmentInputSchema = z.object({
  instance_id: z.string().min(1).describe('Unique instance identifier for this mounted device.'),
  blueprint_slug: z.string().min(1).describe('Hardware catalog blueprint slug to instantiate.'),
  hostname: z.string().optional().describe('Logical hostname or label for this device instance.'),
  u_position: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('1-indexed target rack unit when mounting directly onto the rack.'),
  face: RackFaceSchema.optional().default('front'),
  parent_carrier_id: z
    .string()
    .optional()
    .describe('Instance ID of the parent modular-carrier when mounting a sub-module.'),
  slot_id: z
    .string()
    .optional()
    .describe('Target slot_id inside parent_carrier_id when mounting a sub-module.')
});

export const ModifyEquipmentInputSchema = z.object({
  instance_id: z.string().min(1).describe('Target mounted device or sub-module instance_id.'),
  action: z.enum(['move', 'rename', 'remove']).describe('Modification operation to apply.'),
  u_position: z.number().int().positive().optional().describe('New 1-indexed U position when moving a rackmount device.'),
  new_u_position: z.number().int().positive().optional().describe('Alias for u_position when moving a rackmount device.'),
  face: RackFaceSchema.optional().describe('New mounting face when moving a rackmount device.'),
  new_face: RackFaceSchema.optional().describe('Alias for face when moving a rackmount device.'),
  parent_carrier_id: z.string().min(1).optional().describe('Target parent carrier instance_id when moving a sub-module.'),
  slot_id: z.string().min(1).optional().describe('Target slot_id inside parent_carrier_id when moving a sub-module.'),
  hostname: z.string().min(1).optional().describe('New hostname when renaming a device.'),
  new_hostname: z.string().min(1).optional().describe('Alias for hostname when renaming a device.'),
  remove_connected_cables: z
    .boolean()
    .optional()
    .default(true)
    .describe('Whether to automatically disconnect cables attached to a removed device.')
});

export const ConnectCablesInputSchema = z.object({
  cables: z
    .array(CableConnectionSchema)
    .min(1)
    .describe('List of cable connections to route and validate.')
});

export const DisconnectCablesInputSchema = z.object({
  cable_ids: z.array(z.string()).optional().describe('Specific cable_id values to disconnect.'),
  instance_id: z.string().optional().describe('Device instance_id whose attached cables should all be disconnected.')
});

export const ValidateRackInputSchema = z.object({});

export const ExportDeliverablesInputSchema = z.object({
  formats: z
    .array(
      z.enum([
        'elevation-svg',
        'wiring-svg',
        'bom-md',
        'scene-glb',
        'carrier-scad',
        'carrier-stl'
      ])
    )
    .default([
      'elevation-svg',
      'wiring-svg',
      'bom-md',
      'scene-glb',
      'carrier-scad',
      'carrier-stl'
    ])
    .describe('Deliverable formats to export.'),
  output_dir: z
    .string()
    .optional()
    .describe('Optional target directory where deliverable files will be written.')
});

export const ExternalEndpointGroupInputSchema = z.object({
  id_prefix: z
    .string()
    .min(1)
    .optional()
    .describe('Optional ID prefix for generated endpoints (e.g., "cam", "ap", "room").'),
  label_prefix: z
    .string()
    .min(1)
    .describe('Human-readable label prefix (e.g., "Kamera", "WLAN Access Point", "Raum LAN").'),
  custom_labels: z
    .array(z.string().min(1))
    .optional()
    .describe(
      'Optional per-item custom labels overriding numbered prefix (e.g., ["Büro – PC", "Heimkino – Beamer", "Studio – Workstation"]).'
    ),
  category: ExternalEndpointCategorySchema.default('other-lan'),
  room_or_zone: z
    .string()
    .optional()
    .describe('Building zone or room name (e.g., "Außenbereich", "EG Wohnzimmer", "Wohnräume").'),
  count: z
    .number()
    .int()
    .positive()
    .default(1)
    .describe('Number of external cable drops in this group.'),
  poe_draw_watts: z
    .number()
    .nonnegative()
    .default(0)
    .describe('PoE power draw in watts per drop (0 for standard LAN; e.g., 9 for PoE camera, 18 for Wi-Fi AP).'),
  required_speed: ExternalEndpointSpeedSchema.optional().default('1gbe'),
  color_hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .describe('Hex color code for this group of cables (defaults to category color if omitted).'),
  vlan_id: z
    .number()
    .int()
    .min(1)
    .max(4094)
    .optional()
    .describe('Optional IEEE 802.1Q VLAN ID assigned to this group.')
});

export const ExternalEndpointItemInputSchema = z.object({
  endpoint_id: z
    .string()
    .min(1)
    .optional()
    .describe('Optional explicit endpoint_id (auto-generated if omitted).'),
  label: z
    .string()
    .min(1)
    .describe('Human-readable label for this room/device drop (e.g., "Kamera 1 – Einfahrt").'),
  category: ExternalEndpointCategorySchema.default('other-lan'),
  room_or_zone: z.string().optional().describe('Optional building zone or room name.'),
  poe_draw_watts: z
    .number()
    .nonnegative()
    .default(0)
    .describe('Required PoE power draw in watts (0 for non-PoE LAN).'),
  required_speed: ExternalEndpointSpeedSchema.optional().default('1gbe'),
  patch_panel_port_id: z
    .string()
    .min(1)
    .optional()
    .describe('Optional explicit patch panel port_id (e.g., "p1"); auto-assigned sequentially if omitted.'),
  color_hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional()
    .describe('Optional hex color code for this drop and its front patch cable.'),
  vlan_id: z.number().int().min(1).max(4094).optional().describe('Optional VLAN ID (1..4094).'),
  notes: z.string().optional().describe('Optional installation notes.')
});

export const PlanExternalEndpointsInputSchema = z.object({
  patch_panel_instance_id: z
    .string()
    .min(1)
    .describe('Mounted patch panel instance_id whose rear ports receive the incoming building cable drops.'),
  start_port_number: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('1-indexed starting port number on the patch panel (defaults to next free rear port or 1).'),
  entry_position: ExternalEntryPositionSchema.optional().default('top-rear'),
  groups: z
    .array(ExternalEndpointGroupInputSchema)
    .optional()
    .describe(
      'Batch groups of external drops (e.g., 10x PoE cameras, 5x Wi-Fi APs, 5x room LAN outlets).'
    ),
  endpoints: z
    .array(ExternalEndpointItemInputSchema)
    .optional()
    .describe('Individual external building/room drops to terminate on the rear of the patch panel.'),
  auto_connect_switch_instance_id: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Optional switch instance_id to automatically patch from the front of the patch panel using labeled Cat6A cables.'
    ),
  auto_connect_switch_start_port: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1)
    .describe('1-indexed starting Ethernet port number on auto_connect_switch_instance_id (e.g., 1 for eth1).'),
  clear_existing: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'If true, clears existing external_endpoints (and their front patch cables) on patch_panel_instance_id before planning.'
    )
});

export const UndoRedoInputSchema = z.object({
  action: z
    .enum(['undo', 'redo'])
    .describe('History traversal direction: undo reverts the previous mutation, redo reapplies it.')
});

/**
 * Canonical MCP / WebMCP Tool Registry definitions per ARCHITECTURE.md Section 6.1.
 * Note: Server name uses snake_case (`rack_architect_mcp`) per Gemini API Remote MCP naming rules.
 */
export const RACK_MCP_SERVER_NAME = 'rack_architect_mcp' as const;

export const MCP_TOOL_DEFINITIONS = {
  search_catalog: {
    name: 'search_catalog',
    description:
      'Filter hardware blueprints by search query, form factor, category, maximum depth, minimum PoE budget, or slot compatibility.',
    inputSchema: SearchCatalogInputSchema,
    annotations: { readOnlyHint: true } satisfies McpToolAnnotations
  },
  get_device_blueprint: {
    name: 'get_device_blueprint',
    description:
      'Retrieve expanded port coordinates, electrical capabilities, and modular carrier slot layouts for a specific hardware slug.',
    inputSchema: GetDeviceBlueprintInputSchema,
    annotations: { readOnlyHint: true } satisfies McpToolAnnotations
  },
  define_custom_blueprint: {
    name: 'define_custom_blueprint',
    description:
      'Register and persist a custom hardware blueprint when planning with unlisted equipment.',
    inputSchema: DefineCustomBlueprintInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  init_rack: {
    name: 'init_rack',
    description:
      'Initialize rack mechanical standard, U height, rail depth, and enclosure clearances.',
    inputSchema: InitRackInputSchema,
    annotations: {
      readOnlyHint: false,
      consequentialHint: true
    } satisfies McpToolAnnotations
  },
  mount_equipment: {
    name: 'mount_equipment',
    description:
      'Mount a device onto a rack unit or into a modular carrier slot and run the 5-stage validation engine.',
    inputSchema: MountEquipmentInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  modify_equipment: {
    name: 'modify_equipment',
    description:
      'Move, rename, or remove an existing mounted device instance and recalculate all 3D cable paths.',
    inputSchema: ModifyEquipmentInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  connect_cables: {
    name: 'connect_cables',
    description:
      'Connect one or more cables between device ports, computing 3D Catmull-Rom routes, commercial length bins, and PoE/power DAG status.',
    inputSchema: ConnectCablesInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  disconnect_cables: {
    name: 'disconnect_cables',
    description:
      'Disconnect cables by cable_id or remove all cables attached to a device instance_id.',
    inputSchema: DisconnectCablesInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  plan_external_endpoints: {
    name: 'plan_external_endpoints',
    description:
      'Terminate external building/house cable drops (PoE cameras, Wi-Fi APs, room LAN outlets) onto the rear of a patch panel without consuming rack U slots, and optionally auto-patch the front ports to a switch with labeled cables.',
    inputSchema: PlanExternalEndpointsInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  validate_rack: {
    name: 'validate_rack',
    description:
      'Run the full 5-stage deterministic constraint solver, generate an ASCII front/rear elevation plan, and return diagnostics with self-correction remediation suggestions.',
    inputSchema: ValidateRackInputSchema,
    annotations: { readOnlyHint: true } satisfies McpToolAnnotations
  },
  export_deliverables: {
    name: 'export_deliverables',
    description:
      'Generate 2D elevation SVG, orthogonal wiring schematic SVG, Markdown BOM, and 3D GLB deliverables.',
    inputSchema: ExportDeliverablesInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  },
  undo_redo: {
    name: 'undo_redo',
    description:
      'Revert the most recent rack state mutation (undo) or reapply a reverted mutation (redo).',
    inputSchema: UndoRedoInputSchema,
    annotations: { readOnlyHint: false } satisfies McpToolAnnotations
  }
} as const;
