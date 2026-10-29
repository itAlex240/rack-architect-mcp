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
  'RackArchitect MCP (rack_architect_mcp) is a deterministic Rack-as-Code planning, 5-stage validation, and 2D/3D/STL CAD export server for 19-inch, 10-inch, and 6-inch racks. Never guess millimeter coordinates, depth collisions, or PoE budgets: use search_catalog and get_device_blueprint to discover hardware specs, init_rack to create a new empty enclosure (or validate_rack to inspect the current rack state), mount_equipment and modify_equipment to place or update devices, plan_external_endpoints for off-rack building cable drops, connect_cables and disconnect_cables for wiring, validate_rack to verify zero errors using remediation_suggestions, and export_deliverables to write SVG, BOM, GLB, and 3D-printable OpenSCAD/STL files.' as const;

export const MCP_TOOL_DEFINITIONS = {
  search_catalog: {
    name: 'search_catalog',
    title: 'Search Hardware Blueprint Catalog',
    description:
      "Search and filter the local hardware catalog to discover compatible rackmount devices, 3D-printed modular carriers, and sub-modules before mounting. Call with no arguments to list all blueprints (unpaginated, no result cap), or combine multiple filters with logical AND; 'query' matches substrings case-insensitively across slug, manufacturer, and model, while 'form_factor' (or alias 'mount_type') shorthand values ('10inch', '19inch', '6inch') match both direct rackmount units and modular carriers of that width. To inspect full expanded port coordinates for a known slug, use get_device_blueprint instead; to register unlisted hardware, use define_custom_blueprint.",
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
      "Retrieve the complete hardware specification, millimeter port coordinates, electrical/PoE ratings, and carrier slot geometry for a single catalog blueprint by its exact lowercase kebab-case slug. Repeating port_groups matrices in the blueprint are returned pre-expanded into flat ports[] entries; if the slug does not exist in the built-in or custom catalog, returns status 'INVALID' with a BLUEPRINT_NOT_FOUND issue and candidate slugs without throwing. Use when you already know the target slug and need exact port_id or slot_id values for mount_equipment or connect_cables; to discover unknown slugs by criteria, use search_catalog instead.",
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
      "Validate, register, and persist a custom hardware blueprint into the active catalog and local custom-catalog YAML directory so unlisted equipment can be mounted. Expands any port_groups macros into flat ports[], verifies that all local port coordinates lie within chassis dimensions without overlapping, and overwrites any existing custom blueprint sharing the same slug while leaving mounted rack state and the undo stack untouched. Ports may be supplied via explicit ports[], repeating port_groups[], or both, and slots[] is only needed when mount_type is 'modular-carrier'. Use only when search_catalog confirms a device is missing from the catalog; to mount an already registered blueprint into the rack, use mount_equipment instead.",
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
      'Initialize a new rack project and destructively reset the active rack.yaml state to an empty enclosure with the specified mechanical width standard, usable U height, and rail depth. Overwrites the current rack configuration and clears all previously mounted devices, child sub-modules, cables, and external endpoints, while pushing the prior project state onto the in-memory undo stack (recoverable via undo_redo). Front door clearance checks apply when enclosure_type has a closed front door, and rail_depth_mm defines the front-to-rear Z mounting span (1U = 44.45mm). Use when starting a new rack design from scratch or changing enclosure dimensions; do not use to inspect the current rack (use validate_rack) or to relocate/remove individual devices in an existing layout (use modify_equipment).',
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
      "Mount a new hardware device instance onto a rack unit or into a modular carrier slot in the active rack.yaml project and run 5-stage physical and electrical validation. Supply u_position (and optional face) for direct rackmount equipment, or supply both parent_carrier_id and slot_id to place a sub-module inside an already mounted modular-carrier; the two targeting modes are mutually exclusive. Rejects duplicate instance_id values, unknown blueprint_slug values, or missing parent carriers without mutating state, whereas 3D depth/clearance or PoE issues still persist the mount, push the prior state to the undo stack, and return status 'INVALID' with remediation_suggestions. Use to add a new device instance to the rack; to move, rename, or remove an already mounted instance, use modify_equipment instead, and to terminate external room cable drops on a patch panel, use plan_external_endpoints.",
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
      "Move, rename, or destructively remove an existing mounted device or sub-module instance in the active rack, recalculate all 3D cable splines, and re-run 5-stage validation. Parameter requirements depend on action: 'move' uses u_position/face (or aliases new_u_position/new_face, where primary fields take precedence) for rackmount devices or parent_carrier_id/slot_id for sub-modules; 'rename' uses hostname (or alias new_hostname); 'remove' deletes the target instance (plus any child sub-modules if it is a carrier, and all attached cables and external endpoints when remove_connected_cables is true). Pushes the prior state onto the undo stack and persists the updated rack.yaml atomically, or rejects unknown instance_id values without mutating state. Use to update or delete an already mounted device; to mount a new device instance, use mount_equipment instead, and to remove cables while keeping the device mounted, use disconnect_cables.",
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
      "Connect or update a batch of power and network cables between mounted device ports in the active rack, computing 3D Catmull-Rom spline paths, commercial cable length bins, and PoE/power DAG budgets. Each item in cables[] upserts by cable_id (replacing any existing cable with the same cable_id), pushes the prior state to the undo stack, and persists to rack.yaml; port, connector, speed, PoE budget, or plug-clearance violations are returned as status 'INVALID' with remediation_suggestions rather than throwing. Endpoint face ('front' or 'rear') is only required on pass-through couplers such as patch panels that expose the same port_id on both faces, and preferred_portal_u only applies when cables traverse between front and rear faces. Use when both endpoint devices are already mounted inside the rack; to remove cables, use disconnect_cables, and to terminate external building/room drops onto the rear of a patch panel, use plan_external_endpoints instead.",
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
      "Remove specific cables by cable_id or strip all cables attached to a mounted device or carrier instance_id from the active rack, then re-evaluate PoE/power budgets and plug clearances. Supply cable_ids, instance_id, or both (their union is disconnected, and targeting a modular-carrier also disconnects cables attached to its child sub-modules); calling with neither parameter is rejected with status 'INVALID' without mutating state. Pushes the prior state onto the undo stack, updates rack.yaml atomically, and is idempotent if the targeted cables are already absent. Use when rewiring ports or relieving PoE/port conflicts while keeping devices mounted; to add or replace cables, use connect_cables instead, and to remove the device itself along with its cables, use modify_equipment with action 'remove'.",
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
      'Terminate external building or room cable drops (such as PoE cameras, Wi-Fi APs, and wall LAN outlets) onto the rear ports of a mounted patch panel without consuming rack U slots, and optionally auto-create labeled Cat6A front patch cables to a mounted switch. Use groups[] to batch-generate numbered drops sharing a category, PoE draw, and VLAN, or endpoints[] for individually named drops (both can be combined and allocate sequential free rear ports starting at start_port_number). When clear_existing is true, destructively removes existing external endpoints on patch_panel_instance_id and their front patch cables before allocating; rejects the call without mutating state if the target patch panel or switch is not mounted yet. Use for off-rack building wiring entering the enclosure; do not mount room endpoints as rack devices with mount_equipment, and use connect_cables for purely internal rack-to-rack connections.',
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
      "Inspect the active rack.yaml state and run all 5 deterministic validation stages (mechanical bounds, 3D front/rear depth and plug clearances, PoE/power budgets, cable port/speed compatibility, and thermal/center-of-gravity checks) without modifying state. Returns the current ASCII front/rear device elevation plan, power/PoE utilization summary, and all ERROR/WARNING/INFO issues with self-correction remediation_suggestions directly in the response payload (setting status to 'INVALID' when any ERROR exists, without throwing). Use to inspect currently mounted equipment or verify zero errors after mutations and before exporting; to write SVG, BOM, GLB, or 3D-print files to disk, use export_deliverables instead.",
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
      "Generate and write engineering deliverable files (2D elevation SVG, wiring schematic SVG, Markdown BOM, 3D GLB scene, and parametric OpenSCAD/STL 3D-print carrier models) for the active rack project to disk. Writes requested formats to output_dir (defaulting to the active rack.yaml directory) and overwrites any existing export files of the same name without mutating rack state or the undo stack; 'carrier-scad' and 'carrier-stl' emit files only when at least one modular-carrier is mounted in the rack. Returns the resolved output directory, written file paths and byte sizes, BOM power/cable totals, and current validation status. Use as the final step after validate_rack confirms a valid layout; for read-only validation and ASCII elevation inspection without writing files to disk, use validate_rack instead.",
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
      "Traverse the per-project in-memory mutation history (up to 50 snapshots) to revert the most recent rack state change ('undo') or reapply a previously reverted change ('redo'), atomically updating rack.yaml. Any new state-mutating tool call (init_rack, mount_equipment, modify_equipment, connect_cables, disconnect_cables, or plan_external_endpoints) clears the redo stack; calling undo or redo when the corresponding stack is empty is a safe no-op that returns applied=false without throwing. Use to roll back an unintended batch mutation or recover from an accidental init_rack reset; to modify or remove a specific device or cable without reverting intermediate steps, use modify_equipment or disconnect_cables instead.",
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
