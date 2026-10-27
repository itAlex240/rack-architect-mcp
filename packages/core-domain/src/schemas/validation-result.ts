import { z } from 'zod';
import { RackFaceSchema } from './hardware-blueprint.js';

export const DiagnosticSeveritySchema = z
  .enum(['ERROR', 'WARNING', 'INFO'])
  .describe('Severity level of the engineering constraint diagnostic.');
export type DiagnosticSeverity = z.infer<typeof DiagnosticSeveritySchema>;

export const DiagnosticCodeSchema = z
  .enum([
    // Stage 1: Spatial 3D AABB & Clearance Solver
    'CHASSIS_COLLISION',
    'PLUG_CLEARANCE_COLLISION',
    'FRONT_DOOR_COLLISION',
    'SLOT_DIMENSION_OVERFLOW',
    'SLOT_INCOMPATIBLE',
    'OUT_OF_RACK_BOUNDS',
    'BLUEPRINT_NOT_FOUND',
    // Stage 2: Port, Speed & Media Compatibility
    'PORT_NOT_FOUND',
    'PORT_ALREADY_OCCUPIED',
    'CONNECTOR_INCOMPATIBLE',
    'SIGNAL_PROTOCOL_INCOMPATIBLE',
    'SPEED_MISMATCH',
    // Stage 3: Electrical Power & PoE DAG
    'POE_BUDGET_EXCEEDED',
    'POE_CLASS_EXCEEDED',
    'UPS_OVERLOAD',
    'UNPOWERED_DEVICE',
    // Stage 4: Mechanical Stability & Portals
    'TOP_HEAVY_RACK',
    'NO_FRONT_TO_REAR_PORTAL',
    // Stage 5: Thermal Hotspots, Airflow & Acoustic dB(A) Analysis
    'THERMAL_AIRFLOW_CONFLICT',
    'THERMAL_HOTSPOT_STACKING',
    'ACOUSTIC_NOISE_HIGH'
  ])
  .describe('Machine-readable deterministic validation diagnostic code.');
export type DiagnosticCode = z.infer<typeof DiagnosticCodeSchema>;

export const RemediationActionSchema = z
  .object({
    action_type: z.enum([
      'move_device',
      'change_cable_type',
      'connect_power',
      'disconnect_cable',
      'redistribute_poe',
      'add_portal_gap',
      'change_rack_depth'
    ]),
    target_instance_id: z.string().optional(),
    target_cable_id: z.string().optional(),
    suggested_u_positions: z.array(z.number().int().positive()).optional(),
    suggested_face: RackFaceSchema.optional(),
    suggested_cable_type: z.string().optional(),
    description: z.string()
  })
  .describe('Structured self-correction action for autonomous agent remediation.');
export type RemediationAction = z.infer<typeof RemediationActionSchema>;

export const DiagnosticIssueSchema = z
  .object({
    code: DiagnosticCodeSchema,
    severity: DiagnosticSeveritySchema,
    stage: z.number().int().min(1).max(5).optional(),
    affected_instances: z
      .array(z.string())
      .describe('Device instance IDs involved in this diagnostic issue.'),
    u_range: z
      .tuple([z.number().int(), z.number().int()])
      .optional()
      .describe('Inclusive [start_u, end_u] range where the issue occurs.'),
    message: z
      .string()
      .describe('Detailed engineering explanation with exact millimeter/watt figures.'),
    remediation_suggestions: z
      .array(z.string())
      .min(1)
      .describe('Actionable self-correction instructions for the calling LLM agent.'),
    remediation_actions: z.array(RemediationActionSchema).optional()
  })
  .describe('Single validation finding with deterministic self-correction feedback.');
export type DiagnosticIssue = z.infer<typeof DiagnosticIssueSchema>;

export const PseBudgetSummarySchema = z.object({
  pse_instance_id: z.string(),
  poe_budget_watts: z.number(),
  consumed_poe_watts: z.number(),
  remaining_poe_watts: z.number(),
  downstream_devices: z.array(z.string())
});
export type PseBudgetSummary = z.infer<typeof PseBudgetSummarySchema>;

export const PowerSourceSummarySchema = z.object({
  source_instance_id: z.string(),
  role: z.enum(['pdu', 'ups']),
  capacity_watts: z.number(),
  total_load_watts: z.number(),
  utilization_percent: z.number()
});
export type PowerSourceSummary = z.infer<typeof PowerSourceSummarySchema>;

export const ValidationResultSchema = z
  .object({
    status: z.enum(['VALID', 'INVALID']),
    is_valid: z.boolean(),
    error_count: z.number().int().nonnegative(),
    warning_count: z.number().int().nonnegative(),
    issues: z.array(DiagnosticIssueSchema),
    power_summary: z.object({
      total_system_watts: z.number(),
      total_poe_watts: z.number(),
      pse_budgets: z.array(PseBudgetSummarySchema),
      power_sources: z.array(PowerSourceSummarySchema),
      unpowered_active_instances: z.array(z.string())
    }),
    mechanical_summary: z.object({
      total_weight_grams: z.number(),
      center_of_gravity_y_mm: z.number(),
      normalized_cog_y: z.number(),
      available_portal_u_positions: z.array(z.number().int()),
      total_thermal_btu_hr: z
        .number()
        .default(0)
        .describe('Total peak thermal dissipation in BTU/hr (1W = 3.41214 BTU/hr).'),
      combined_noise_db_a: z
        .number()
        .default(0)
        .describe('Logarithmic sum of acoustic noise emissions in dB(A) across all mounted devices.'),
      airflow_profile: z
        .enum([
          'uniform-front-to-rear',
          'uniform-passive',
          'hybrid-active-passive',
          'mixed-conflict'
        ])
        .default('uniform-passive')
        .describe('Rack-wide thermal airflow regime classification.')
    })
  })
  .describe('Complete 5-stage deterministic validation report.');
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
