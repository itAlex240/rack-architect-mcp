import { z } from 'zod';
import { RackFaceSchema } from './hardware-blueprint.js';

export const RackStandardSchema = z
  .enum(['19inch', '10inch', '6inch'])
  .describe('EIA-310-D or homelab rack width standard.');
export type RackStandard = z.infer<typeof RackStandardSchema>;

export const EnclosureTypeSchema = z
  .enum(['open-frame', 'closed-glass-front', 'closed-vented-front'])
  .describe('Physical rack enclosure style governing front door clearance checks.');
export type EnclosureType = z.infer<typeof EnclosureTypeSchema>;

export const RackConfigSchema = z
  .object({
    standard: RackStandardSchema,
    u_height: z
      .number()
      .int()
      .positive()
      .describe('Total vertical rack capacity in Rack Units (U / HE).'),
    rail_depth_mm: z
      .number()
      .positive()
      .describe('Distance from front mounting rail face (Z=0) to rear mounting rail face in mm.'),
    enclosure_type: EnclosureTypeSchema.default('open-frame'),
    front_door_clearance_mm: z
      .number()
      .nonnegative()
      .default(45)
      .describe('Available clearance in front of Z=0 before hitting the front door in mm.'),
    rear_clearance_mm: z
      .number()
      .nonnegative()
      .default(40)
      .describe('Available clearance behind Z=rail_depth_mm in mm.')
  })
  .describe('Physical rack frame dimensions and enclosure configuration.');
export type RackConfig = z.infer<typeof RackConfigSchema>;

export const MountedChildDeviceSchema = z
  .object({
    instance_id: z
      .string()
      .min(1)
      .describe('Unique project-wide instance identifier for the child device.'),
    blueprint_slug: z
      .string()
      .min(1)
      .describe('Hardware catalog blueprint slug for the child sub-module.'),
    slot_id: z
      .string()
      .min(1)
      .describe('Target slot_id inside the parent modular carrier.'),
    hostname: z.string().optional().describe('Optional logical hostname or label.')
  })
  .describe('Sub-module device mounted inside a specific slot of a parent carrier.');
export type MountedChildDevice = z.infer<typeof MountedChildDeviceSchema>;

export const MountedDeviceSchema = z
  .object({
    instance_id: z
      .string()
      .min(1)
      .describe('Unique project-wide instance identifier for the mounted equipment.'),
    blueprint_slug: z
      .string()
      .min(1)
      .describe('Hardware catalog blueprint slug.'),
    u_position: z
      .number()
      .int()
      .positive()
      .describe('Lowest 1-indexed Rack Unit (U) occupied by this device.'),
    face: RackFaceSchema.default('front'),
    hostname: z.string().optional().describe('Optional logical hostname or label.'),
    children: z
      .array(MountedChildDeviceSchema)
      .default([])
      .describe('Child sub-modules mounted inside this carrier.')
  })
  .describe('Equipment mounted directly onto a rack unit.');
export type MountedDevice = z.infer<typeof MountedDeviceSchema>;

export const CableEndpointSchema = z
  .object({
    instance_id: z
      .string()
      .min(1)
      .describe('Target device instance_id (top-level or child sub-module).'),
    port_id: z.string().min(1).describe('Target port_id on the device.'),
    face: RackFaceSchema.optional().describe(
      'Explicit rack face selector (used to distinguish front vs rear connections on passthrough couplers).'
    )
  })
  .describe('Source or destination port endpoint of a physical cable.');
export type CableEndpoint = z.infer<typeof CableEndpointSchema>;

export const CableTypeSchema = z
  .enum([
    'cat6a',
    'cat6a-angled',
    'cat6',
    'cat6-angled',
    'cat5e',
    'cat5e-angled',
    'sfp-plus-dac',
    'sfp-plus-dac-angled',
    'fiber-lc-duplex',
    'fiber-lc-duplex-angled',
    'rj45-serial-rollover',
    'rj45-serial-rollover-angled',
    'power-c13-c14',
    'power-c13-c14-angled',
    'power-schuko-c13',
    'power-schuko-c13-angled',
    'power-dc-5525',
    'power-dc-5525-angled',
    'power-usb-c',
    'power-usb-c-angled'
  ])
  .describe('Standardized physical cable and connector assembly type.');
export type CableType = z.infer<typeof CableTypeSchema>;

export const CableConnectionSchema = z
  .object({
    cable_id: z.string().min(1).describe('Unique identifier for the cable connection.'),
    from: CableEndpointSchema,
    to: CableEndpointSchema,
    cable_type: CableTypeSchema,
    color_hex: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/)
      .default('#3B82F6')
      .describe('Hex color code for 2D/3D cable visualization.'),
    label: z.string().optional().describe('Optional cable label or circuit tag.'),
    vlan_id: z
      .number()
      .int()
      .min(1)
      .max(4094)
      .optional()
      .describe('Optional IEEE 802.1Q primary VLAN ID carried on this link (1..4094).'),
    ip_cidr: z
      .string()
      .optional()
      .describe('Optional IPv4/IPv6 subnet or interface CIDR annotation (e.g. "10.10.20.0/24").'),
    preferred_portal_u: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Optional 1-indexed U hint for front-to-rear cable portal routing.')
  })
  .describe('Point-to-point physical cable connection between two ports.');
export type CableConnection = z.infer<typeof CableConnectionSchema>;

export const RackProjectSchema = z
  .object({
    schema_version: z.literal('1.0').default('1.0'),
    project_name: z.string().min(1).describe('Human-readable name of the rack layout project.'),
    rack: RackConfigSchema,
    mounted_devices: z.array(MountedDeviceSchema).default([]),
    cables: z.array(CableConnectionSchema).default([])
  })
  .describe('Root declarative Rack-as-Code state schema (rack.yaml).');

export type RackProjectInput = z.input<typeof RackProjectSchema>;
export type RackProject = z.output<typeof RackProjectSchema>;
