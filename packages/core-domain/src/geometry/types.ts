import type {
  CableType,
  ConnectorType,
  HardwareBlueprint,
  PortCapability,
  PortDefinition,
  RackConfig,
  RackFace,
  SlotDefinition
} from '../schemas/index.js';

export interface Vector3D {
  readonly x: number;
  readonly y: number;
  readonly z: number;
}

export interface BoundingBox3D {
  readonly min: Vector3D;
  readonly max: Vector3D;
}

export interface ComputedPortGeometry {
  readonly instance_id: string;
  readonly port_id: string;
  readonly label: string;
  /** Physical face on the device blueprint ('front' | 'rear') */
  readonly local_face: RackFace;
  /** Effective face in world rack coordinates ('front' points -Z, 'rear' points +Z) */
  readonly world_face: RackFace;
  readonly connector_type: ConnectorType;
  readonly direction: PortDefinition['direction'];
  readonly capabilities: readonly PortCapability[];
  readonly is_passthrough_coupler: boolean;
  /** Local coordinates relative to owning device origin (mm) */
  readonly local_position: Vector3D;
  /** Global 3D world coordinates inside the rack (mm) */
  readonly world_position: Vector3D;
  /** Outward-pointing unit normal vector of the port in 3D world space */
  readonly world_normal: Vector3D;
}

export interface PortPlugClearance {
  readonly instance_id: string;
  readonly port_id: string;
  readonly cable_id: string;
  readonly cable_type: CableType;
  readonly connector_type: ConnectorType;
  readonly is_angled: boolean;
  readonly delta_z_mm: number;
  readonly world_normal: Vector3D;
  /** Bounding box of the plug extrusion zone across the device face */
  readonly clearance_box: BoundingBox3D;
  /** Tight local bounding box directly around the port connector */
  readonly port_local_box: BoundingBox3D;
}

export interface ComputedSlotGeometry {
  readonly carrier_instance_id: string;
  readonly slot_definition: SlotDefinition;
  readonly world_origin: Vector3D;
  readonly world_bounds: BoundingBox3D;
  readonly occupied_by_instance_id: string | null;
}

export interface ComputedDeviceGeometry {
  readonly instance_id: string;
  readonly blueprint_slug: string;
  readonly blueprint: HardwareBlueprint;
  readonly hostname: string | undefined;
  readonly mount_target: 'rack-unit' | 'carrier-slot';
  readonly u_position: number;
  readonly u_range: readonly [number, number];
  readonly face: RackFace;
  readonly parent_carrier_id: string | null;
  readonly slot_id: string | null;
  /** World origin of the device (mm) */
  readonly world_origin: Vector3D;
  /** Exact 3D Chassis Bounding Box B_chassis(i) in world space (mm) */
  readonly chassis_box: BoundingBox3D;
  /** Combined Plug & Bend-Radius Clearance Box B_clearance(i) in world space (mm), or null if no cables attached */
  readonly plug_clearance_box: BoundingBox3D | null;
  /** Individual plug clearance extrusions for each connected cable on this device */
  readonly port_clearances: readonly PortPlugClearance[];
  /** Computed global 3D geometry for all ports on this device */
  readonly ports: readonly ComputedPortGeometry[];
  /** Computed slot geometries if this device is a modular-carrier */
  readonly slots: readonly ComputedSlotGeometry[];
  readonly child_instance_ids: readonly string[];
}

export interface ComputedRackGeometry {
  readonly rack: RackConfig;
  readonly panel_width_mm: number;
  readonly aperture_width_mm: number;
  readonly total_height_mm: number;
  readonly rail_depth_mm: number;
  /** Map of instance_id -> ComputedDeviceGeometry (includes both top-level and child devices) */
  readonly devices_by_id: ReadonlyMap<string, ComputedDeviceGeometry>;
  /** Flat ordered list of all computed devices (top-level followed by their children) */
  readonly devices: readonly ComputedDeviceGeometry[];
}
