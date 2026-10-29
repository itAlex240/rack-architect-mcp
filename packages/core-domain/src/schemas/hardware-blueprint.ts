import { z } from 'zod';

export const HardwareCategorySchema = z
  .enum([
    'switch',
    'router',
    'compute-node',
    'mini-pc',
    'sbc',
    'nas',
    'patch-panel',
    'pdu',
    'ups',
    'modular-carrier',
    'brush-panel',
    'blanking-panel',
    'blank-panel',
    'shelf',
    'keystone-module'
  ])
  .describe('Primary functional category of the hardware unit.');
export type HardwareCategory = z.infer<typeof HardwareCategorySchema>;

export const MountTypeSchema = z
  .enum([
    'rackmount-19',
    'rackmount-10',
    'rackmount-6',
    'sub-module',
    'shelf-standing'
  ])
  .describe('Physical form factor and mounting mechanism.');
export type MountType = z.infer<typeof MountTypeSchema>;

export const EarMountStyleSchema = z
  .enum([
    'included-19inch-ears',
    'included-10inch-ears',
    'included-6inch-ears',
    'flush-front',
    'recessed-20mm',
    'sub-module-clip',
    'rear-rail-mount',
    'none'
  ])
  .describe('Mounting ear geometry relative to the vertical rack rails.');
export type EarMountStyle = z.infer<typeof EarMountStyleSchema>;

export const ElectricalRoleSchema = z
  .enum(['consumer', 'pse-switch', 'pdu', 'ups', 'passive'])
  .describe(
    'Role in the electrical and PoE Directed Acyclic Graph (DAG).'
  );
export type ElectricalRole = z.infer<typeof ElectricalRoleSchema>;

export const AirflowDirectionSchema = z
  .enum([
    'front-to-rear',
    'rear-to-front',
    'side-to-side',
    'passive-convection',
    'none'
  ])
  .describe('Primary thermal airflow path through the device chassis.');
export type AirflowDirection = z.infer<typeof AirflowDirectionSchema>;

export const RackFaceSchema = z
  .enum(['front', 'rear'])
  .describe('Mounting or port face relative to the rack or chassis.');
export type RackFace = z.infer<typeof RackFaceSchema>;

export const ConnectorTypeSchema = z
  .enum([
    'rj45',
    'rj45-serial-console',
    'sfp-plus',
    'iec-c13',
    'iec-c14',
    'schuko-cee7',
    'dc-5525',
    'usb-c',
    'usb-a',
    'audio-35mm'
  ])
  .describe('Physical connector interface type.');

export const PortCapabilitySchema = z
  .enum([
    '100base-tx',
    '1000base-t',
    '2500base-t',
    '5gbase-t',
    '10gbase-t',
    '10gbase-sr',
    '10gbase-lr',
    '10gbase-dac',
    '25gbase-dac',
    'poe-out',
    'poe+',
    'poe-out-af',
    'poe-out-at',
    'poe-out-bt-type3',
    'poe-out-bt-type4',
    'poe-in-af',
    'poe-in-at',
    'poe-in-bt-type3',
    'poe-in-bt-type4',
    'ac-mains',
    'dc-power',
    'usb-pd',
    'usb-3.0',
    'usb-3.1',
    'audio-analog',
    'serial-rs232',
    'passthrough-coupler'
  ])
  .describe('Supported electrical, optical, or PoE protocol capability.');
export type PortCapability = z.infer<typeof PortCapabilitySchema>;

export const PortDirectionSchema = z
  .enum(['input', 'output', 'bidirectional'])
  .describe('Signal or electrical power flow direction.');
export type PortDirection = z.infer<typeof PortDirectionSchema>;

export const PortOrientationSchema = z
  .enum(['upright', 'inverted', 'left', 'right'])
  .describe('Physical orientation of the connector latch/keyway.');
export type PortOrientation = z.infer<typeof PortOrientationSchema>;

export const PortCoordinatesSchema = z
  .object({
    x_mm: z
      .number()
      .describe('Horizontal offset in mm from the bottom-left corner of the face.'),
    y_mm: z
      .number()
      .describe('Vertical offset in mm from the bottom-left corner of the face.'),
    orientation: PortOrientationSchema.default('upright')
  })
  .describe('Local 2D coordinates on the device face in millimeters.');
export type PortCoordinates = z.infer<typeof PortCoordinatesSchema>;

export const PortDefinitionSchema = z
  .object({
    port_id: z.string().min(1).max(128).describe('Unique identifier of the port within the device.'),
    label: z.string().min(1).max(160).describe('Human-readable silk-screened port label.'),
    face: RackFaceSchema,
    connector_type: ConnectorTypeSchema,
    direction: PortDirectionSchema,
    capabilities: z
      .array(PortCapabilitySchema)
      .max(32)
      .default([])
      .describe('Electrical, optical, or PoE capabilities supported by this port.'),
    coordinates: PortCoordinatesSchema,
    is_passthrough_coupler: z
      .boolean()
      .optional()
      .describe('True if this port is a passive front-to-rear feedthrough coupler.')
  })
  .describe('Explicit physical port definition with local millimeter coordinates.');
export type PortDefinition = z.infer<typeof PortDefinitionSchema>;

export const PortGroupGridSchema = z
  .object({
    origin_x_mm: z
      .number()
      .min(-2000)
      .max(2000)
      .describe('X coordinate of the first port (column 0) in mm.'),
    origin_y_mm: z
      .number()
      .min(-3000)
      .max(3000)
      .describe('Y coordinate of the first port (row 0) in mm.'),
    columns: z
      .number()
      .int()
      .positive()
      .max(64)
      .describe('Number of horizontal port columns in the matrix (1..64).'),
    rows: z
      .number()
      .int()
      .positive()
      .max(16)
      .describe('Number of vertical port rows in the matrix (1..16).'),
    pitch_x_mm: z
      .number()
      .min(-500)
      .max(500)
      .describe('Horizontal center-to-center spacing between adjacent columns in mm.'),
    pitch_y_mm: z
      .number()
      .min(-500)
      .max(500)
      .describe('Vertical center-to-center spacing between adjacent rows in mm.')
  })
  .describe('2D grid layout parameters for automatic port matrix expansion.');
export type PortGroupGrid = z.infer<typeof PortGroupGridSchema>;

export const PortGroupMacroSchema = z
  .object({
    id_prefix: z.string().min(1).max(64).describe('Prefix for generated port_id values (e.g. "eth").'),
    label_prefix: z.string().max(96).optional().describe('Prefix for generated human-readable labels.'),
    start_index: z
      .number()
      .int()
      .nonnegative()
      .max(10000)
      .default(1)
      .describe('Starting numeric suffix for generated port IDs (default: 1).'),
    count: z
      .number()
      .int()
      .positive()
      .max(128)
      .describe('Total number of ports to generate in this group (1..128).'),
    face: RackFaceSchema,
    connector_type: ConnectorTypeSchema,
    direction: PortDirectionSchema,
    capabilities: z
      .array(PortCapabilitySchema)
      .max(32)
      .default([])
      .describe('Capabilities assigned to every port generated by this group.'),
    orientation: PortOrientationSchema.default('upright'),
    is_passthrough_coupler: z
      .boolean()
      .optional()
      .describe('True if generated ports are passive front-to-rear couplers.'),
    grid: PortGroupGridSchema
  })
  .describe('Declarative port matrix macro expanded into flat PortDefinition items on load.');
export type PortGroupMacro = z.infer<typeof PortGroupMacroSchema>;

export const HardwareGeometrySchema = z
  .object({
    u_height: z
      .number()
      .nonnegative()
      .max(60)
      .describe('Nominal height in Rack Units (1U = 44.45mm, max 60U).'),
    width_mm: z
      .number()
      .positive()
      .max(1000)
      .describe('Physical chassis body width in millimeters (max 1000mm).'),
    height_mm: z
      .number()
      .positive()
      .max(3000)
      .describe('Physical chassis height in millimeters (max 3000mm).'),
    depth_mm: z
      .number()
      .positive()
      .max(2000)
      .describe('Physical chassis depth in millimeters along the Z-axis (max 2000mm).'),
    ear_mount_style: EarMountStyleSchema.default('flush-front'),
    front_protrusion_mm: z
      .number()
      .nonnegative()
      .max(500)
      .default(0)
      .describe('Protrusion in front of Z=0 (handles, ears, knobs) in mm.'),
    rear_protrusion_mm: z
      .number()
      .nonnegative()
      .max(500)
      .default(0)
      .describe('Protrusion behind depth_mm (fans, PSU handles) in mm.'),
    weight_grams: z
      .number()
      .nonnegative()
      .max(500000)
      .default(0)
      .describe('Total device mass in grams for Center of Gravity calculation.'),
    has_cable_pass_through: z
      .boolean()
      .optional()
      .describe('True if cables can pass front-to-rear through this unit.')
  })
  .describe('Physical 3D bounding dimensions and mass specification.');
export type HardwareGeometry = z.infer<typeof HardwareGeometrySchema>;

export const PowerAndThermalSchema = z
  .object({
    electrical_role: ElectricalRoleSchema,
    idle_watts: z.number().nonnegative().default(0).describe('Idle power draw in watts.'),
    max_system_watts: z
      .number()
      .nonnegative()
      .default(0)
      .describe('Peak own system power consumption in watts (excluding PoE output).'),
    poe_budget_watts: z
      .number()
      .nonnegative()
      .optional()
      .describe('Maximum total PoE output power budget in watts for PSE switches.'),
    ups_capacity_watts: z
      .number()
      .positive()
      .optional()
      .describe('Maximum output load capacity in watts for UPS units.'),
    pdu_capacity_watts: z
      .number()
      .positive()
      .optional()
      .describe('Maximum output load capacity in watts for PDU units.'),
    airflow: AirflowDirectionSchema.default('passive-convection'),
    noise_db_a: z
      .number()
      .nonnegative()
      .optional()
      .describe('Acoustic noise emission in dB(A) at 1 meter distance.')
  })
  .describe('Electrical power consumption, PoE budget, thermal airflow, and acoustic dB(A) characteristics.');
export type PowerAndThermal = z.infer<typeof PowerAndThermalSchema>;

export const SlotOffsetMmSchema = z
  .object({
    x: z.number().describe('Local X offset from carrier origin in mm.'),
    y: z.number().describe('Local Y offset from carrier origin in mm.'),
    z: z.number().default(0).describe('Local Z offset from carrier origin in mm.')
  })
  .describe('Local 3D offset of a sub-module slot relative to its parent carrier.');
export type SlotOffsetMm = z.infer<typeof SlotOffsetMmSchema>;

export const SlotMaxDimensionsMmSchema = z
  .object({
    width: z.number().positive().describe('Maximum allowed child width in mm.'),
    height: z.number().positive().describe('Maximum allowed child height in mm.'),
    depth: z.number().positive().describe('Maximum allowed child depth in mm.')
  })
  .describe('Maximum internal bounding dimensions of a carrier slot in mm.');
export type SlotMaxDimensionsMm = z.infer<typeof SlotMaxDimensionsMmSchema>;

export const SlotDefinitionSchema = z
  .object({
    slot_id: z.string().min(1).describe('Unique slot identifier within the carrier.'),
    accepted_slot_type: z
      .string()
      .min(1)
      .describe('Required child slot_compatibility token (e.g. "mini-pc-1liter").'),
    offset_mm: SlotOffsetMmSchema,
    max_dimensions_mm: SlotMaxDimensionsMmSchema
  })
  .describe('Sub-U carrier bay specification for modular child devices.');
export type SlotDefinition = z.infer<typeof SlotDefinitionSchema>;

export const MaterialPresetSchema = z
  .enum([
    'matte-black-steel',
    'coated-aluminum',
    '3d-printed-petg',
    '3d-printed-abs',
    'polycarbonate'
  ])
  .describe('Surface material shader preset for 3D procedural rendering.');
export type MaterialPreset = z.infer<typeof MaterialPresetSchema>;

export const HardwareVisualsSchema = z
  .object({
    chassis_color_hex: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .default('#E5E7EB')
      .describe('Primary chassis hex color code.'),
    material_preset: MaterialPresetSchema.default('matte-black-steel'),
    has_oled_display: z
      .boolean()
      .default(false)
      .describe('True if the front panel includes a status OLED screen.'),
    stl_mesh_path: z
      .string()
      .nullable()
      .default(null)
      .describe('Optional relative path to custom 3D mesh (.stl/.glb).')
  })
  .describe('Visual rendering metadata for 2D SVG and 3D WebGL pipelines.');
export type HardwareVisuals = z.infer<typeof HardwareVisualsSchema>;

export const PrintableMetadataSchema = z
  .object({
    filament_grams: z.number().nonnegative().max(50000).describe('Estimated filament mass in grams.'),
    material_recommendation: z
      .string()
      .max(128)
      .default('PETG')
      .describe('Recommended 3D printing filament material (e.g. "PETG", "ABS", "ASA").'),
    heat_set_inserts: z
      .string()
      .max(256)
      .optional()
      .describe('Optional specification of required brass heat-set inserts.'),
    fasteners: z
      .string()
      .max(256)
      .optional()
      .describe('Optional specification of required mounting screws and cage nuts.'),
    printables_url: z
      .string()
      .url()
      .max(512)
      .regex(/^https?:\/\//i, 'Reference URL must use http:// or https://')
      .optional()
      .describe('Optional HTTPS reference URL to an upstream 3D model repository.')
  })
  .nullable()
  .default(null)
  .describe('3D printing fabrication metadata for printable modular carriers.');
export type PrintableMetadata = z.infer<typeof PrintableMetadataSchema>;

export const HardwareBlueprintSchema = z
  .object({
    slug: z
      .string()
      .min(1)
      .max(100)
      .regex(/^[a-z0-9-]+$/, 'Hardware slug must be lowercase kebab-case')
      .describe('Unique lowercase kebab-case hardware identifier (vendor-model-variant).'),
    manufacturer: z.string().min(1).max(160).describe('Hardware manufacturer name.'),
    model: z.string().min(1).max(160).describe('Hardware model name or part number.'),
    description: z
      .string()
      .max(2000)
      .optional()
      .describe(
        'Human-readable explanation of what the device is, its role in the rack, and its physical mounting method (e.g. native rack ears vs. 3D-printed carrier/cradle).'
      ),
    category: HardwareCategorySchema,
    mount_type: MountTypeSchema,
    slot_compatibility: z
      .string()
      .max(100)
      .optional()
      .describe('Slot compatibility token when mount_type is "sub-module".'),
    is_passthrough_coupler: z
      .boolean()
      .optional()
      .describe('True if the entire unit acts as a passive front-to-rear feedthrough patch panel.'),
    geometry: HardwareGeometrySchema,
    power_and_thermal: PowerAndThermalSchema,
    port_groups: z
      .array(PortGroupMacroSchema)
      .max(16)
      .default([])
      .describe('Optional repeating port grid macros expanded into flat ports[] upon registration.'),
    ports: z
      .array(PortDefinitionSchema)
      .max(256)
      .default([])
      .describe('Explicit physical ports with local face millimeter coordinates.'),
    slots: z
      .array(SlotDefinitionSchema)
      .max(32)
      .default([])
      .describe('Sub-module carrier bays when mount_type is "modular-carrier".'),
    visuals: HardwareVisualsSchema.default({
      chassis_color_hex: '#E5E7EB',
      material_preset: 'matte-black-steel',
      has_oled_display: false,
      stl_mesh_path: null
    }),
    printable_metadata: PrintableMetadataSchema
  })
  .describe('Complete hardware catalog blueprint specification.');

export type HardwareBlueprintInput = z.input<typeof HardwareBlueprintSchema>;
export type HardwareBlueprint = z.output<typeof HardwareBlueprintSchema>;
