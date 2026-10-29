import { z } from 'zod';
import {
  ElectricalRoleSchema,
  HardwareBlueprintSchema,
  HardwareCategorySchema,
  MountTypeSchema,
  RackFaceSchema,
  SlotMaxDimensionsMmSchema
} from './hardware-blueprint.js';
import {
  CableConnectionSchema,
  CableTypeSchema,
  EnclosureTypeSchema,
  ExternalEndpointCategorySchema,
  ExternalEndpointSpeedSchema,
  ExternalEntryPositionSchema,
  RackConfigSchema,
  RackStandardSchema
} from './rack-project.js';
import {
  DiagnosticIssueSchema,
  ValidationResultSchema
} from './validation-result.js';

/**
 * Tool Annotations aligned with MCP (`ToolAnnotations`) and WebMCP (`document.modelContext.registerTool`) standards.
 */
export interface McpToolAnnotations {
  readonly readOnlyHint: boolean;
  readonly destructiveHint?: boolean;
  readonly idempotentHint?: boolean;
  readonly openWorldHint?: boolean;
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
    .describe(
      'Optional case-insensitive substring filter matching slug, manufacturer, or model name (omit to match all).'
    ),
  form_factor: SearchFormFactorSchema.optional().describe(
    'Primary rack width or mounting form-factor filter (shorthands "10inch", "19inch", and "6inch" match both direct rackmount equipment and modular carriers of that width).'
  ),
  mount_type: SearchFormFactorSchema.optional().describe(
    'Optional alias for form_factor to filter by physical mounting style ("rackmount-10", "rackmount-19", "rackmount-6", "sub-module", or "shelf-standing"); combined with logical AND if both are provided.'
  ),
  category: HardwareCategorySchema.optional().describe(
    'Functional hardware category filter (e.g., "switch", "router", "ups", "pdu", "patch-panel", "modular-carrier", "mini-pc", "sbc").'
  ),
  max_depth_mm: z
    .number()
    .positive()
    .optional()
    .describe('Maximum allowed chassis depth in millimeters (inclusive upper bound).'),
  min_poe_budget_watts: z
    .number()
    .nonnegative()
    .optional()
    .describe('Minimum required PSE PoE output power budget in watts (inclusive lower bound).'),
  accepted_slot_type: z
    .string()
    .min(1)
    .optional()
    .describe(
      'Sub-module slot compatibility token matching either a sub-module slot_compatibility or a carrier slot accepted_slot_type (e.g., "mini-pc-1liter", "sbc-rpi5", "standard-keystone").'
    )
});

export const GetDeviceBlueprintInputSchema = z.object({
  slug: z
    .string()
    .min(1)
    .describe(
      'Exact lowercase kebab-case hardware catalog blueprint slug to retrieve (discoverable via search_catalog).'
    )
});

export const DefineCustomBlueprintInputSchema = z.object({
  blueprint: HardwareBlueprintSchema.describe(
    'Complete custom hardware blueprint specification; ports may be defined via explicit ports[], repeating port_groups[] macros, or both.'
  )
});

export const InitRackInputSchema = z.object({
  project_name: z
    .string()
    .min(1)
    .max(160)
    .default('Rack Project')
    .describe('Human-readable project name stored in rack.yaml.'),
  standard: RackStandardSchema.describe(
    'Mechanical rack width standard ("19inch" = 482.6mm, "10inch" = 254.0mm, "6inch" = 152.4mm).'
  ),
  u_height: z
    .number()
    .int()
    .positive()
    .max(60)
    .describe('Total usable vertical rack height in Rack Units (1U = 44.45mm, 1..60U).'),
  rail_depth_mm: z
    .number()
    .positive()
    .max(2000)
    .describe('Front-to-rear mounting rail depth in millimeters along the Z-axis (max 2000mm).'),
  enclosure_type: EnclosureTypeSchema.default('open-frame').describe(
    'Enclosure door style ("open-frame", "closed-glass-front", or "closed-vented-front").'
  ),
  front_door_clearance_mm: z
    .number()
    .nonnegative()
    .max(1000)
    .default(45)
    .describe(
      'Available clearance in millimeters between front mounting rails (Z=0) and a closed front door.'
    ),
  rear_clearance_mm: z
    .number()
    .nonnegative()
    .max(1000)
    .default(40)
    .describe(
      'Available clearance in millimeters behind the rear mounting rails (Z=rail_depth_mm) for power plugs and bending radii.'
    )
});

export const MountEquipmentInputSchema = z.object({
  instance_id: z
    .string()
    .min(1)
    .describe(
      'Unique project-wide instance identifier for this mounted device (e.g., "ups-u1", "sw-core-01").'
    ),
  blueprint_slug: z
    .string()
    .min(1)
    .describe('Catalog or custom hardware blueprint slug to instantiate.'),
  hostname: z
    .string()
    .optional()
    .describe('Optional logical hostname or display label shown in elevations and schematics.'),
  u_position: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      '1-indexed lowest Rack Unit (U) when mounting directly onto the rack rails (mutually exclusive with parent_carrier_id/slot_id).'
    ),
  face: RackFaceSchema.optional()
    .default('front')
    .describe('Target rack mounting face ("front" or "rear") for direct rackmount equipment.'),
  parent_carrier_id: z
    .string()
    .optional()
    .describe(
      'Mounted parent modular-carrier instance_id when mounting a sub-module (requires slot_id; mutually exclusive with u_position).'
    ),
  slot_id: z
    .string()
    .optional()
    .describe(
      'Target bay slot_id inside parent_carrier_id when mounting a sub-module (e.g., "left-bay", "keystone-1").'
    )
});

export const ModifyEquipmentInputSchema = z.object({
  instance_id: z
    .string()
    .min(1)
    .describe('Existing mounted device or child sub-module instance_id to modify.'),
  action: z
    .enum(['move', 'rename', 'remove'])
    .describe(
      'Modification operation: "move" relocates a device, "rename" updates its hostname, and "remove" deletes the device instance.'
    ),
  u_position: z
    .number()
    .int()
    .positive()
    .optional()
    .describe(
      'New 1-indexed U position when action is "move" on a direct rackmount device (takes precedence over new_u_position).'
    ),
  new_u_position: z
    .number()
    .int()
    .positive()
    .optional()
    .describe('Optional alias for u_position when action is "move".'),
  face: RackFaceSchema.optional().describe(
    'New mounting face ("front" or "rear") when action is "move" on a rackmount device (takes precedence over new_face).'
  ),
  new_face: RackFaceSchema.optional().describe(
    'Optional alias for face when action is "move".'
  ),
  parent_carrier_id: z
    .string()
    .min(1)
    .optional()
    .describe('Target parent carrier instance_id when action is "move" on a child sub-module.'),
  slot_id: z
    .string()
    .min(1)
    .optional()
    .describe('Target slot_id inside parent_carrier_id when action is "move" on a child sub-module.'),
  hostname: z
    .string()
    .min(1)
    .optional()
    .describe('New logical hostname when action is "rename" (takes precedence over new_hostname).'),
  new_hostname: z
    .string()
    .min(1)
    .optional()
    .describe('Optional alias for hostname when action is "rename".'),
  remove_connected_cables: z
    .boolean()
    .optional()
    .default(true)
    .describe(
      'When action is "remove", whether to automatically disconnect all cables and external endpoints attached to the removed device (default: true).'
    )
});

export const ConnectCablesInputSchema = z.object({
  cables: z
    .array(CableConnectionSchema)
    .min(1)
    .max(128)
    .describe(
      'Batch of one or more cable connections to upsert by cable_id, route in 3D, and validate (max 128 per call).'
    )
});

export const DisconnectCablesInputSchema = z.object({
  cable_ids: z
    .array(z.string())
    .optional()
    .describe(
      'Specific cable_id values to disconnect (can be combined with instance_id; at least one of cable_ids or instance_id must be provided).'
    ),
  instance_id: z
    .string()
    .optional()
    .describe(
      'Mounted device or modular-carrier instance_id whose attached cables (including child sub-module cables) should all be disconnected.'
    )
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
    .describe(
      'Deliverable formats to generate and write to disk (defaults to all 6 formats; carrier-scad and carrier-stl emit files when modular carriers are mounted).'
    ),
  output_dir: z
    .string()
    .optional()
    .describe(
      'Optional target filesystem directory for generated files in local stdio mode (defaults to the directory of the active rack.yaml file; ignored on hosted remote MCP servers where HTTPS download URLs are returned instead).'
    )
});

export const ExternalEndpointGroupInputSchema = z.object({
  id_prefix: z
    .string()
    .min(1)
    .max(64)
    .optional()
    .describe('Optional ID prefix for generated endpoints (e.g., "cam", "ap", "room").'),
  label_prefix: z
    .string()
    .min(1)
    .max(160)
    .describe('Human-readable label prefix (e.g., "Kamera", "WLAN Access Point", "Raum LAN").'),
  custom_labels: z
    .array(z.string().min(1).max(200))
    .max(96)
    .optional()
    .describe(
      'Optional per-item custom labels overriding numbered prefix (e.g., ["Büro – PC", "Heimkino – Beamer", "Studio – Workstation"]).'
    ),
  category: ExternalEndpointCategorySchema.default('other-lan'),
  room_or_zone: z
    .string()
    .max(160)
    .optional()
    .describe('Building zone or room name (e.g., "Außenbereich", "EG Wohnzimmer", "Wohnräume").'),
  count: z
    .number()
    .int()
    .positive()
    .max(96)
    .default(1)
    .describe('Number of external cable drops in this group (1..96).'),
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
    .max(24)
    .optional()
    .describe(
      'Batch groups of external drops (e.g., 10x PoE cameras, 5x Wi-Fi APs, 5x room LAN outlets).'
    ),
  endpoints: z
    .array(ExternalEndpointItemInputSchema)
    .max(128)
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
      'If true, destructively clears existing external_endpoints (and their front patch cables) on patch_panel_instance_id before planning.'
    )
});

export const UndoRedoInputSchema = z.object({
  action: z
    .enum(['undo', 'redo'])
    .describe('History traversal direction: "undo" reverts the most recent state mutation, "redo" reapplies a reverted mutation.')
});

// ---------------------------------------------------------------------------
// Documented Tool Output Schemas (TDQS Contextual Completeness & MCP Structured Output)
// ---------------------------------------------------------------------------

export const ToolExecutionStatusSchema = z
  .enum(['VALID', 'INVALID'])
  .describe(
    'Deterministic execution outcome: "VALID" when the operation succeeded with 0 validation errors; "INVALID" when precondition or engineering validation errors are present in issues[].'
  );

function createToolOutputEnvelopeSchema<T extends z.ZodTypeAny>(
  dataSchema: T,
  description: string
) {
  return z
    .object({
      status: ToolExecutionStatusSchema,
      summary: z
        .string()
        .describe('Concise human- and agent-readable summary of the tool result and validation status.'),
      data: dataSchema,
      issues: z
        .array(DiagnosticIssueSchema)
        .describe(
          'Structured diagnostic findings (ERROR, WARNING, INFO) with actionable remediation_suggestions.'
        )
    })
    .describe(description);
}

export const CatalogBlueprintSummarySchema = z
  .object({
    slug: z.string().describe('Unique lowercase kebab-case hardware blueprint slug.'),
    manufacturer: z.string().describe('Hardware manufacturer name.'),
    model: z.string().describe('Hardware model name.'),
    category: HardwareCategorySchema,
    mount_type: MountTypeSchema,
    u_height: z.number().describe('Nominal height in Rack Units (U).'),
    width_mm: z.number().describe('Chassis width in millimeters.'),
    height_mm: z.number().describe('Chassis height in millimeters.'),
    depth_mm: z.number().describe('Chassis depth in millimeters.'),
    weight_grams: z.number().describe('Device mass in grams.'),
    electrical_role: ElectricalRoleSchema,
    max_system_watts: z.number().describe('Peak system power consumption in watts.'),
    poe_budget_watts: z.number().describe('Available PSE PoE output budget in watts (0 if non-PSE).'),
    slot_compatibility: z
      .string()
      .nullable()
      .describe('Sub-module slot compatibility token, or null for rackmount equipment.'),
    slots: z
      .array(
        z.object({
          slot_id: z.string().describe('Carrier bay slot identifier.'),
          accepted_slot_type: z.string().describe('Accepted child sub-module compatibility token.'),
          max_dimensions_mm: SlotMaxDimensionsMmSchema
        })
      )
      .describe('Available carrier bays when mount_type is "modular-carrier".'),
    port_count: z.number().int().nonnegative().describe('Total number of expanded physical ports.')
  })
  .passthrough()
  .describe('Compact hardware blueprint summary returned by search_catalog.');

export const SearchCatalogOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      count: z
        .number()
        .int()
        .nonnegative()
        .describe('Total number of catalog blueprints matching all supplied filter criteria.'),
      blueprints: z
        .array(CatalogBlueprintSummarySchema)
        .describe('Matching hardware blueprint summary records.')
    })
    .passthrough()
    .describe('Catalog search result payload.'),
  'Structured result of search_catalog containing matching hardware blueprint summaries.'
);

export const GetDeviceBlueprintOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      blueprint: HardwareBlueprintSchema.optional().describe(
        'Complete hardware blueprint specification with port_groups pre-expanded into flat ports[].'
      ),
      requested_slug: z
        .string()
        .optional()
        .describe('Requested slug echoed when lookup fails with BLUEPRINT_NOT_FOUND.')
    })
    .passthrough()
    .describe('Blueprint lookup result payload.'),
  'Structured result of get_device_blueprint containing the expanded hardware blueprint or lookup diagnostics.'
);

export const DefineCustomBlueprintOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      slug: z.string().optional().describe('Registered lowercase kebab-case blueprint slug.'),
      saved_path: z
        .string()
        .nullable()
        .optional()
        .describe('Absolute filesystem path of the persisted custom blueprint YAML file, or null if in-memory.'),
      blueprint: HardwareBlueprintSchema.optional().describe(
        'Registered hardware blueprint with expanded port coordinates.'
      ),
      validation_errors: z
        .array(z.unknown())
        .optional()
        .describe('Schema validation details if the custom blueprint failed parsing.')
    })
    .passthrough()
    .describe('Custom blueprint registration payload.'),
  'Structured result of define_custom_blueprint confirming persistence and expanded port geometry.'
);

export const InitRackOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      rack: RackConfigSchema.describe('Initialized physical rack frame specification.'),
      geometry: z
        .object({
          total_height_mm: z
            .number()
            .describe('Total vertical mounting height in millimeters (u_height * 44.45).'),
          rail_depth_mm: z.number().describe('Front-to-rear mounting rail depth in millimeters.'),
          panel_width_mm: z.number().describe('Outer mounting ear panel width in millimeters.'),
          aperture_width_mm: z.number().describe('Inner usable rail aperture width in millimeters.')
        })
        .passthrough()
        .describe('Computed millimeter enclosure dimensions.'),
      validation: ValidationResultSchema.describe(
        'Initial 5-stage validation report for the newly initialized empty rack.'
      )
    })
    .passthrough()
    .describe('Rack initialization payload.'),
  'Structured result of init_rack containing the new rack configuration, millimeter dimensions, and validation status.'
);

export const MountEquipmentOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      mounted_device: z
        .record(z.string(), z.unknown())
        .nullable()
        .optional()
        .describe(
          'Computed 3D world bounding boxes (chassis and plug clearance) and global port coordinates for the mounted device.'
        ),
      instance_id: z
        .string()
        .optional()
        .describe('Target instance_id echoed when a pre-mount check fails.'),
      blueprint_slug: z
        .string()
        .optional()
        .describe('Target blueprint_slug echoed when a pre-mount check fails.'),
      validation: ValidationResultSchema.optional().describe(
        'Updated 5-stage validation report after mounting the device.'
      )
    })
    .passthrough()
    .describe('Equipment mounting result payload.'),
  'Structured result of mount_equipment with 3D world geometry and 5-stage validation diagnostics.'
);

export const ModifyEquipmentOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      action: z
        .enum(['move', 'rename', 'remove'])
        .optional()
        .describe('Modification operation that was executed.'),
      instance_id: z.string().describe('Target mounted device or sub-module instance_id.'),
      updated_device: z
        .record(z.string(), z.unknown())
        .nullable()
        .optional()
        .describe('Updated 3D world geometry of the device, or null if removed.'),
      removed_cable_ids: z
        .array(z.string())
        .optional()
        .describe('Cable IDs automatically disconnected when action is "remove".'),
      rerouted_cables: z
        .array(
          z
            .object({
              cable_id: z.string().describe('Cable connection identifier.'),
              raw_arc_length_mm: z.number().describe('Recalculated 3D spline arc length in mm.'),
              required_length_mm: z.number().describe('Required cable length with slack in mm.'),
              recommended_commercial_mm: z
                .number()
                .describe('Standard commercial cable length bin in mm.')
            })
            .passthrough()
        )
        .optional()
        .describe('Recalculated 3D cable length summaries after moving or removing equipment.'),
      validation: ValidationResultSchema.optional().describe(
        'Updated 5-stage validation report after the equipment modification.'
      )
    })
    .passthrough()
    .describe('Equipment modification result payload.'),
  'Structured result of modify_equipment with updated device geometry, rerouted cable lengths, and validation diagnostics.'
);

export const ConnectCablesOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      connected_cables: z
        .array(
          z
            .object({
              cable_id: z.string().describe('Unique cable identifier.'),
              cable_type: CableTypeSchema,
              route_case: z.string().describe('Computed 3D spline routing topology class.'),
              raw_arc_length_mm: z.number().describe('3D Catmull-Rom spline arc length in mm.'),
              required_length_mm: z.number().describe('Required length including slack in mm.'),
              recommended_commercial_mm: z
                .number()
                .describe('Standard commercial patch cable length bin in mm.'),
              portal_u: z
                .number()
                .nullable()
                .optional()
                .describe('1-indexed U position of the front-to-rear cable portal if traversed.'),
              assigned_ducts: z
                .array(z.string())
                .optional()
                .describe('Cable ducts traversed along the route.')
            })
            .passthrough()
        )
        .describe('Computed 3D spline route metrics and commercial SKU length bins for the connected cables.'),
      total_cables: z
        .number()
        .int()
        .nonnegative()
        .describe('Total number of active cables in the rack project.'),
      validation: ValidationResultSchema.describe(
        'Updated 5-stage validation report including port, speed, PoE budget, and plug clearance checks.'
      )
    })
    .passthrough()
    .describe('Cable connection and 3D routing result payload.'),
  'Structured result of connect_cables containing 3D cable lengths, commercial length bins, and PoE/clearance diagnostics.'
);

export const DisconnectCablesOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      removed_cable_ids: z
        .array(z.string())
        .describe('List of cable_id values that were disconnected.'),
      remaining_cables_count: z
        .number()
        .int()
        .nonnegative()
        .describe('Total number of cables remaining in the active rack project.'),
      validation: ValidationResultSchema.optional().describe(
        'Updated 5-stage validation report after cable removal.'
      )
    })
    .passthrough()
    .describe('Cable disconnection result payload.'),
  'Structured result of disconnect_cables listing removed cable IDs and updated validation status.'
);

export const PlanExternalEndpointsOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      added_endpoints_count: z
        .number()
        .int()
        .nonnegative()
        .optional()
        .describe('Number of external building/room cable drops terminated on the patch panel rear ports.'),
      auto_patched_cables_count: z
        .number()
        .int()
        .nonnegative()
        .optional()
        .describe('Number of front Cat6A patch cables automatically created to the target switch.'),
      total_external_endpoints: z
        .number()
        .int()
        .nonnegative()
        .optional()
        .describe('Total external endpoints now configured in the rack project.'),
      patching_guide: z
        .array(
          z
            .object({
              step_number: z.number().int().positive().describe('Sequential installation step number.'),
              endpoint_id: z.string().describe('Unique external endpoint identifier.'),
              label: z.string().describe('Human-readable room or device drop label.'),
              room_or_zone: z.string().describe('Building zone or room name.'),
              poe_draw_watts: z.number().nonnegative().describe('PoE power draw in watts for this drop.'),
              rear_punchdown: z.string().describe('Rear patch panel port termination assignment.'),
              front_patch_cable: z.string().describe('Front patch panel to switch port assignment.'),
              color_hex: z.string().describe('Assigned cable hex color code.')
            })
            .passthrough()
        )
        .optional()
        .describe('Step-by-step rear punchdown and front switch patching schedule.'),
      patch_panel_instance_id: z
        .string()
        .optional()
        .describe('Target patch_panel_instance_id echoed when a pre-check fails.'),
      auto_connect_switch_instance_id: z
        .string()
        .optional()
        .describe('Target auto_connect_switch_instance_id echoed when a pre-check fails.'),
      validation: ValidationResultSchema.optional().describe(
        'Updated 5-stage validation report including cumulative PoE load from external building drops.'
      )
    })
    .passthrough()
    .describe('External endpoint planning and auto-patching payload.'),
  'Structured result of plan_external_endpoints containing the rear punchdown/front patching schedule and PoE validation report.'
);

export const ValidateRackOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      is_valid: z
        .boolean()
        .describe('True when error_count is 0 across all 5 validation stages.'),
      ascii_elevation: z
        .string()
        .describe(
          'Formatted ASCII front/rear rack elevation diagram, mounted device inventory, and power/PoE summary.'
        ),
      validation: ValidationResultSchema.describe(
        'Complete 5-stage deterministic validation report with issues and remediation_suggestions.'
      )
    })
    .passthrough()
    .describe('Rack state inspection and validation result payload.'),
  'Structured result of validate_rack containing the ASCII front/rear elevation diagram and full 5-stage diagnostic report.'
);

export const ExportDeliverablesOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      output_dir: z
        .string()
        .describe(
          'Resolved absolute directory path where deliverable files were written (or HTTPS base export endpoint when running on a hosted remote MCP server).'
        ),
      live_viewer_url: z
        .string()
        .optional()
        .describe(
          'Interactive 3D/2D Web-Viewer URL bound live to this remote MCP session (present in hosted remote MCP mode).'
        ),
      rack_yaml_url: z
        .string()
        .optional()
        .describe(
          'Direct HTTPS download URL for the session rack.yaml source of truth (present in hosted remote MCP mode).'
        ),
      exported_files: z
        .array(
          z
            .object({
              format: z
                .string()
                .describe('Deliverable format identifier (e.g., "elevation-svg", "carrier-stl").'),
              path: z
                .string()
                .describe(
                  'Absolute filesystem path of the written file (or direct HTTPS download URL in hosted remote MCP mode).'
                ),
              download_url: z
                .string()
                .optional()
                .describe(
                  'Direct HTTPS download URL for this deliverable when connected to a hosted remote MCP server.'
                ),
              filename: z
                .string()
                .optional()
                .describe('Suggested local filename for saving the deliverable.'),
              size_bytes: z
                .number()
                .int()
                .nonnegative()
                .describe('Size of the generated deliverable in bytes.')
            })
            .passthrough()
        )
        .describe('Metadata for each generated deliverable file or download URL.'),
      bom_summary: z
        .object({
          mounted_devices_count: z
            .number()
            .int()
            .nonnegative()
            .describe('Total mounted rack devices and carrier sub-modules.'),
          cables_count: z.number().int().nonnegative().describe('Total routed cables.'),
          total_power_draw_watts: z
            .number()
            .nonnegative()
            .describe('Total peak system power draw in watts.'),
          total_poe_draw_watts: z
            .number()
            .nonnegative()
            .describe('Total PoE power draw in watts.'),
          total_poe_budget_watts: z
            .number()
            .nonnegative()
            .describe('Total available PSE PoE budget in watts.')
        })
        .passthrough()
        .describe('Summary counts and power totals included in the Bill of Materials.'),
      validation: ValidationResultSchema.describe(
        'Current 5-stage validation report at the time of export.'
      )
    })
    .passthrough()
    .describe('Deliverable export result payload.'),
  'Structured result of export_deliverables listing written file paths, byte sizes, BOM summary, and validation status.'
);

export const UndoRedoOutputSchema = createToolOutputEnvelopeSchema(
  z
    .object({
      action: z
        .enum(['undo', 'redo'])
        .describe('History traversal direction that was requested.'),
      applied: z
        .boolean()
        .describe('True if a history snapshot was restored; false if the target history stack was empty.'),
      undo_available: z
        .number()
        .int()
        .nonnegative()
        .describe('Number of remaining undo snapshots available in memory.'),
      redo_available: z
        .number()
        .int()
        .nonnegative()
        .describe('Number of remaining redo snapshots available in memory.'),
      ascii_elevation: z
        .string()
        .describe('Updated ASCII front/rear rack elevation diagram after history traversal.'),
      validation: ValidationResultSchema.describe(
        'Updated 5-stage validation report for the restored rack state.'
      )
    })
    .passthrough()
    .describe('Undo/redo history traversal result payload.'),
  'Structured result of undo_redo containing stack availability, updated ASCII elevation, and validation status.'
);

/**
 * Canonical MCP / WebMCP Tool Registry definitions per ARCHITECTURE.md Section 6.1.
 * Note: Server name uses snake_case (`rack_architect_mcp`) per Gemini API Remote MCP naming rules.
 */
export const RACK_MCP_SERVER_NAME = 'rack_architect_mcp' as const;

export const RACK_MCP_SERVER_INSTRUCTIONS =
  'RackArchitect MCP (rack_architect_mcp) is a deterministic Rack-as-Code planning, 5-stage validation, and 2D/3D/STL CAD export server for 19-inch, 10-inch, and 6-inch racks. Never guess millimeter coordinates, depth collisions, or PoE budgets: use search_catalog and get_device_blueprint to discover hardware specs, init_rack to create a new empty enclosure (or validate_rack to inspect the current rack state), mount_equipment and modify_equipment to place or update devices (respecting explicit user hardware/U-slot requests 100%, or applying bottom-up UPS -> NAS/Compute -> Brush/Open-U Portal -> Gateway/Switch -> Top Patch Panel zoning for open requests), plan_external_endpoints for off-rack building cable drops, connect_cables and disconnect_cables for wiring, validate_rack to verify zero errors using remediation_suggestions, and export_deliverables to generate SVG, BOM, GLB, and 3D-printable OpenSCAD/STL files. When connected to a Hosted Remote MCP session, always share data.live_viewer_url and data.exported_files[].download_url (plus data.rack_yaml_url) directly with the user.' as const;

export const MCP_TOOL_DEFINITIONS = {
  search_catalog: {
    name: 'search_catalog',
    title: 'Search Hardware Blueprint Catalog',
    description:
      "Search and filter the local hardware catalog to discover compatible rackmount devices, modular carriers, and sub-modules before mounting. All supplied filters combine with logical AND: 'form_factor' and its alias 'mount_type' accept width shorthands '10inch', '19inch', and '6inch' that match both direct rackmount gear and modular carriers, 'accepted_slot_type' matches both carrier bays and compatible sub-modules, and 'max_depth_mm' bounds chassis depth excluding plug clearance. Returns all matches from the bounded catalog in one unpaginated response sorted in deterministic registration order, with built-in blueprints followed by custom blueprints. Call with no arguments to list the full catalog; use get_device_blueprint to inspect expanded port coordinates for a known slug, or define_custom_blueprint to register unlisted hardware.",
    inputSchema: SearchCatalogInputSchema,
    outputSchema: SearchCatalogOutputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  get_device_blueprint: {
    name: 'get_device_blueprint',
    title: 'Retrieve Hardware Device Blueprint Details',
    description:
      "Retrieve the complete hardware specification, millimeter port coordinates, electrical and PoE ratings, and carrier slot geometry for a single catalog blueprint. The 'slug' parameter requires a case-sensitive exact match in lowercase kebab-case vendor-model-variant format against the built-in or session custom catalog; partial substrings or uppercase characters do not match. Returns the full blueprint in one unpaginated payload with repeating port_groups pre-expanded into up to 256 flat ports[] entries, or returns status 'INVALID' with a BLUEPRINT_NOT_FOUND issue and candidate slugs instead of throwing. Use when you already know the target slug and need exact port_id or slot_id values for mount_equipment or connect_cables; use search_catalog instead to discover unknown slugs by criteria.",
    inputSchema: GetDeviceBlueprintInputSchema,
    outputSchema: GetDeviceBlueprintOutputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  define_custom_blueprint: {
    name: 'define_custom_blueprint',
    title: 'Register Custom Hardware Blueprint',
    description:
      "Validate and register a custom hardware blueprint into the active catalog so unlisted equipment can be mounted. Pass the entire specification inside the top-level 'blueprint' object: 'blueprint.slug' must use lowercase kebab-case, ports may combine explicit 'ports[]' with repeating 'port_groups[]' macros whose coordinates fit strictly within 'blueprint.geometry' without overlapping, and 'slots[]' applies only when 'mount_type' is 'modular-carrier' whereas 'slot_compatibility' applies to 'sub-module'. Persists YAML to the local custom-catalog folder in stdio mode or session memory on remote servers, overwrites same-slug custom entries without touching mounted rack state or undo history, and returns status 'INVALID' instead of throwing on validation errors. Use only after search_catalog confirms hardware is unlisted; use mount_equipment instead to place an already registered blueprint into the rack.",
    inputSchema: DefineCustomBlueprintInputSchema,
    outputSchema: DefineCustomBlueprintOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  init_rack: {
    name: 'init_rack',
    title: 'Initialize and Reset Rack Enclosure',
    description:
      "Initialize a new rack project and destructively reset the active rack.yaml state to an empty enclosure with the specified width standard, U height, and rail depth. Overwrites the current enclosure and clears all mounted devices, child sub-modules, cables, and external endpoints, while pushing the previous project state onto the in-memory undo stack for recovery via undo_redo. 'project_name' sets the title used in exported schematics and BOMs, 'rail_depth_mm' plus 'rear_clearance_mm' bounds total +Z chassis and rear plug depth before wall collision, and 'front_door_clearance_mm' is enforced only when 'enclosure_type' has a closed front door. Use when starting a rack design from scratch or changing enclosure dimensions; use validate_rack to inspect the current rack, or modify_equipment to move or remove individual devices.",
    inputSchema: InitRackInputSchema,
    outputSchema: InitRackOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false,
      consequentialHint: true
    } satisfies McpToolAnnotations
  },
  mount_equipment: {
    name: 'mount_equipment',
    title: 'Mount Equipment into Rack Unit or Carrier Slot',
    description:
      "Mount a new hardware device instance onto a rack unit or into a modular carrier bay in the active rack.yaml project and run 5-stage validation. 'instance_id' must be unique across both top-level devices and nested sub-modules, 'blueprint_slug' must reference an existing catalog or custom slug, and placement uses two mutually exclusive modes: 'u_position' with optional 'face' where the device's full U span fits within 1..u_height, or 'parent_carrier_id' plus a compatible 'slot_id' for sub-modules. Precondition errors such as duplicate 'instance_id', unknown 'blueprint_slug', or missing carriers return status 'INVALID' without mutating state, whereas 3D collision or PoE issues persist the mount, push an undo snapshot, and return remediation_suggestions. Use to add a new device instance; use modify_equipment to move, rename, or remove an existing instance, or plan_external_endpoints for off-rack room cable drops.",
    inputSchema: MountEquipmentInputSchema,
    outputSchema: MountEquipmentOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  modify_equipment: {
    name: 'modify_equipment',
    title: 'Move, Rename, or Remove Mounted Equipment',
    description:
      "Move, rename, or destructively remove an existing mounted device or child sub-module in the active rack, recalculate 3D cable splines, and re-run 5-stage validation. 'instance_id' resolves across top-level devices and carrier sub-modules, and required fields depend on 'action': 'move' updates 'u_position' and 'face' on rackmount gear or 'slot_id' and optional 'parent_carrier_id' across carriers for sub-modules with primary fields taking precedence over 'new_*' aliases, 'rename' updates or clears 'hostname', and 'remove' cascades to child sub-modules plus attached cables and external endpoints when 'remove_connected_cables' is true. Pushes the prior state onto the undo stack and updates rack.yaml atomically, or returns status 'INVALID' without mutating state when 'instance_id' or a target carrier is unknown. Use to update or delete a mounted instance; use mount_equipment to add new hardware, or disconnect_cables to remove cables while keeping devices mounted.",
    inputSchema: ModifyEquipmentInputSchema,
    outputSchema: ModifyEquipmentOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false,
      consequentialHint: true
    } satisfies McpToolAnnotations
  },
  connect_cables: {
    name: 'connect_cables',
    title: 'Connect and Route Inter-Device Cables',
    description:
      "Connect or update a batch of up to 128 power and network cables between mounted device ports in the active rack, computing 3D Catmull-Rom splines, commercial length bins, and PoE or power budgets. Each entry in 'cables[]' upserts in place by 'cable_id' while leaving all other cables and mounted equipment untouched, pushes a recoverable undo snapshot, and persists rack.yaml atomically; port, speed, PoE, or clearance violations return status 'INVALID' with remediation_suggestions instead of throwing. Within each cable, endpoint 'face' is required only on pass-through couplers such as patch panels exposing identical 'port_id' values on both faces, 'preferred_portal_u' applies only to front-to-rear transitions, and 'vlan_id' or 'ip_cidr' annotate logical network links. Use when both endpoint devices are mounted inside the rack; use disconnect_cables to remove cables, or plan_external_endpoints to terminate incoming building cable drops on a patch panel.",
    inputSchema: ConnectCablesInputSchema,
    outputSchema: ConnectCablesOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  disconnect_cables: {
    name: 'disconnect_cables',
    title: 'Disconnect Cables by ID or Device Instance',
    description:
      "Remove specific cables by identifier or strip all cables attached to a mounted device or modular carrier from the active rack, then re-evaluate PoE budgets and plug clearances. Supply a non-empty 'cable_ids' list, 'instance_id', or both to disconnect their union; 'instance_id' matches both 'from' and 'to' endpoints across a carrier and its child sub-modules while leaving external patch-panel drops intact, whereas omitting both or passing only an empty list returns status 'INVALID' with a PORT_NOT_FOUND issue and zero mutations. Valid calls push an undo snapshot, persist rack.yaml atomically, and return removed IDs, remaining cable count, and updated validation results, succeeding idempotently when targeted IDs are already absent. Use when rewiring ports while keeping hardware mounted; use connect_cables to add or replace cables, or modify_equipment with action 'remove' to delete a device and its cables.",
    inputSchema: DisconnectCablesInputSchema,
    outputSchema: DisconnectCablesOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  plan_external_endpoints: {
    name: 'plan_external_endpoints',
    title: 'Terminate External Building Cable Drops on Patch Panel',
    description:
      "Terminate external building or room cable drops onto the rear RJ45 ports of a mounted patch panel without consuming rack U slots, and optionally auto-create labeled Cat6A front patch cables to a mounted switch. 'groups[]' batch-generates drops first—with 'custom_labels[]' overriding numbered 'label_prefix' entries per index—followed by 'endpoints[]', allocating sequential free rear ports from 'start_port_number' and sequential free switch RJ45 ports from 'auto_connect_switch_start_port'. Setting 'clear_existing' destructively removes prior external drops on 'patch_panel_instance_id' and their front patch cables before allocation, while unmounted patch-panel or switch IDs return status 'INVALID' without mutating state. Use for off-rack building wiring entering the enclosure; never mount room endpoints via mount_equipment, and use connect_cables for purely internal rack-to-rack links.",
    inputSchema: PlanExternalEndpointsInputSchema,
    outputSchema: PlanExternalEndpointsOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: false,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  validate_rack: {
    name: 'validate_rack',
    title: 'Inspect and Validate Active Rack State',
    description:
      "Inspect the active rack.yaml state and run all 5 deterministic validation stages covering mechanical bounds, 3D depth and plug clearances, PoE and power budgets, cable compatibility, and thermal limits. Takes no parameters, performs zero state or undo-stack mutations, and returns the ASCII front and rear elevation diagram, power utilization summary, and all diagnostic issues with remediation_suggestions. Sets status to 'INVALID' instead of throwing whenever any validation ERROR is present. Use to inspect currently mounted equipment or verify zero errors before exporting; use export_deliverables instead to generate SVG, BOM, GLB, or 3D-print files.",
    inputSchema: ValidateRackInputSchema,
    outputSchema: ValidateRackOutputSchema,
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  export_deliverables: {
    name: 'export_deliverables',
    title: 'Export 2D SVG, BOM, 3D GLB, and 3D-Print Deliverables',
    description:
      "Generate 2D elevation and wiring SVGs, a Markdown BOM, a binary 3D GLB scene, and parametric OpenSCAD or watertight STL 3D-print models for the active rack project. Omitting 'formats' exports all six types; 'carrier-scad' and 'carrier-stl' emit one file per mounted modular carrier, switch cradle, or printable cover panel and emit zero files when none are mounted, while 'output_dir' resolves relative paths and creates missing folders. Local stdio execution writes deterministic filenames—elevation.svg, wiring-schematic.svg, BOM.md, rack-scene.glb, and <slug>.scad or <slug>.stl—overwriting same-named files in place, whereas hosted remote sessions stream in-memory HTTPS download URLs; neither mode mutates rack state or undo history. Use after validate_rack confirms a valid layout; use validate_rack instead for read-only validation and ASCII elevation inspection without generating export files.",
    inputSchema: ExportDeliverablesInputSchema,
    outputSchema: ExportDeliverablesOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    } satisfies McpToolAnnotations
  },
  undo_redo: {
    name: 'undo_redo',
    title: 'Undo or Redo Rack State Mutation',
    description:
      "Traverse the per-project in-memory history ring buffer of up to 50 snapshots to revert the latest rack mutation or reapply a reverted mutation, updating rack.yaml atomically. Setting 'action' to 'undo' steps backward across rack-state mutations—excluding catalog-only define_custom_blueprint calls and read-only tools—and pushes the displaced state onto the redo stack, whereas 'redo' is available only immediately after 'undo' because any new rack mutation flushes the redo stack. Calling either action when its target stack is empty is a safe no-op returning applied=false without throwing. Use to roll back an unintended batch change or accidental init_rack reset; use modify_equipment or disconnect_cables instead to edit specific items without reverting intermediate steps.",
    inputSchema: UndoRedoInputSchema,
    outputSchema: UndoRedoOutputSchema,
    annotations: {
      readOnlyHint: false,
      destructiveHint: false,
      idempotentHint: false,
      openWorldHint: false
    } satisfies McpToolAnnotations
  }
} as const;
