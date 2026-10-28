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
    action_type: z
      .enum([
        'move_device',
        'change_cable_type',
        'connect_power',
        'disconnect_cable',
        'redistribute_poe',
        'add_portal_gap',
        'change_rack_depth'
      ])
      .describe('Recommended self-correction operation category.'),
    target_instance_id: z
      .string()
      .optional()
      .describe('Device instance_id targeted by this remediation action.'),
    target_cable_id: z
      .string()
      .optional()
      .describe('Cable connection cable_id targeted by this remediation action.'),
    suggested_u_positions: z
      .array(z.number().int().positive())
      .optional()
      .describe('Candidate 1-indexed U positions that resolve the spatial conflict.'),
    suggested_face: RackFaceSchema.optional(),
    suggested_cable_type: z
      .string()
      .optional()
      .describe('Suggested replacement cable_type (e.g. angled plug or higher speed grade).'),
    description: z
      .string()
      .describe('Human- and agent-readable explanation of the remediation step.')
  })
  .describe('Structured self-correction action for autonomous agent remediation.');
export type RemediationAction = z.infer<typeof RemediationActionSchema>;

export const DiagnosticIssueSchema = z
  .object({
    code: DiagnosticCodeSchema,
    severity: DiagnosticSeveritySchema,
    stage: z
      .number()
      .int()
      .min(1)
      .max(5)
      .optional()
      .describe('Validation pipeline stage (1..5) that produced this finding.'),
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
    remediation_actions: z
      .array(RemediationActionSchema)
      .optional()
      .describe('Optional machine-actionable remediation descriptors.')
  })
  .describe('Single validation finding with deterministic self-correction feedback.');
export type DiagnosticIssue = z.infer<typeof DiagnosticIssueSchema>;

export const PseBudgetSummarySchema = z
  .object({
    pse_instance_id: z
      .string()
      .describe('Instance ID of the PoE Power Sourcing Equipment (PSE) switch.'),
    poe_budget_watts: z
      .number()
      .describe('Maximum rated PoE output power budget of the switch in watts.'),
    consumed_poe_watts: z
      .number()
      .describe('Total PoE power drawn by connected Powered Devices (PDs) in watts.'),
    remaining_poe_watts: z
      .number()
      .describe('Remaining available PoE power budget in watts (negative if overloaded).'),
    downstream_devices: z
      .array(z.string())
      .describe('Instance or endpoint IDs of downstream PoE consumers powered by this switch.')
  })
  .describe('PoE budget utilization breakdown for a single PSE switch.');
export type PseBudgetSummary = z.infer<typeof PseBudgetSummarySchema>;

export const PowerSourceSummarySchema = z
  .object({
    source_instance_id: z
      .string()
      .describe('Instance ID of the upstream PDU or UPS unit.'),
    role: z
      .enum(['pdu', 'ups'])
      .describe('Electrical source classification ("pdu" or "ups").'),
    capacity_watts: z
      .number()
      .describe('Maximum rated output capacity of the power source in watts.'),
    total_load_watts: z
      .number()
      .describe('Cumulative downstream system and PoE load in watts.'),
    utilization_percent: z
      .number()
      .describe('Percentage of rated watt capacity consumed (0..100+).')
  })
  .describe('Load and capacity summary for a mounted PDU or UPS unit.');
export type PowerSourceSummary = z.infer<typeof PowerSourceSummarySchema>;

export const ValidationResultSchema = z
  .object({
    status: z
      .enum(['VALID', 'INVALID'])
      .describe('Overall rack validation state ("VALID" when error_count is 0).'),
    is_valid: z
      .boolean()
      .describe('True when zero ERROR-level diagnostic issues exist.'),
    error_count: z
      .number()
      .int()
      .nonnegative()
      .describe('Total number of blocking ERROR diagnostics.'),
    warning_count: z
      .number()
      .int()
      .nonnegative()
      .describe('Total number of non-blocking WARNING diagnostics.'),
    issues: z
      .array(DiagnosticIssueSchema)
      .describe('List of all detected ERROR, WARNING, and INFO diagnostic issues.'),
    power_summary: z
      .object({
        total_system_watts: z
          .number()
          .describe('Total peak system power draw across all mounted equipment in watts.'),
        total_poe_watts: z
          .number()
          .describe('Total PoE power draw across all connected PoE devices and external drops in watts.'),
        pse_budgets: z
          .array(PseBudgetSummarySchema)
          .describe('Per-switch PoE budget utilization breakdown.'),
        power_sources: z
          .array(PowerSourceSummarySchema)
          .describe('Per-PDU and per-UPS electrical load breakdown.'),
        unpowered_active_instances: z
          .array(z.string())
          .describe('Active device instance IDs missing a valid AC, DC, USB-C, or PoE power input.')
      })
      .describe('Aggregated electrical and PoE DAG power analysis.'),
    mechanical_summary: z
      .object({
        total_weight_grams: z
          .number()
          .describe('Total mass of all mounted equipment in grams.'),
        center_of_gravity_y_mm: z
          .number()
          .describe('Vertical Center of Gravity height from bottom of U1 in millimeters.'),
        normalized_cog_y: z
          .number()
          .describe('Normalized vertical Center of Gravity ratio (0.0 = bottom, 1.0 = top; keep <= 0.50).'),
        available_portal_u_positions: z
          .array(z.number().int())
          .describe('1-indexed U slots that allow front-to-rear cable pass-through (open U or brush panel).'),
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
      .describe('Aggregated mechanical mass, center of gravity, thermal BTU/hr, and acoustic dB(A) metrics.')
  })
  .describe('Complete 5-stage deterministic validation report.');
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
