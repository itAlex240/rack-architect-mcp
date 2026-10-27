import { describe, expect, it } from 'vitest';
import {
  computeRackGeometry,
  type HardwareBlueprint,
  MM_PER_U,
  normalizeHardwareBlueprint,
  type RackProject,
  RackProjectSchema,
  resolveCableEndpointPortGeometry
} from '../src/index.js';

describe('3D Coordinate Transformer & Sub-U Modularity (Carrier -> Slot -> ChildDevice)', () => {
  const carrierBlueprint: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
    manufacturer: 'Printables Community',
    model: '10-Inch 1U Lenovo Tiny + 2x Keystone Carrier',
    category: 'modular-carrier',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1.0,
      width_mm: 254.0,
      height_mm: 44.0,
      depth_mm: 185.0,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 0.0,
      rear_protrusion_mm: 0.0,
      weight_grams: 180
    },
    power_and_thermal: {
      electrical_role: 'passive',
      idle_watts: 0,
      max_system_watts: 0,
      airflow: 'passive-convection'
    },
    slots: [
      {
        slot_id: 'left-mini-pc-bay',
        accepted_slot_type: 'mini-pc-1liter',
        offset_mm: { x: 18.0, y: 2.0, z: 0.0 },
        max_dimensions_mm: { width: 182.0, height: 38.0, depth: 185.0 }
      },
      {
        slot_id: 'keystone-1',
        accepted_slot_type: 'standard-keystone',
        offset_mm: { x: 208.0, y: 12.0, z: 0.0 },
        max_dimensions_mm: { width: 16.5, height: 22.0, depth: 35.0 }
      }
    ],
    printable_metadata: {
      filament_grams: 165,
      material_recommendation: 'PETG',
      heat_set_inserts: '4x M3x5x4'
    }
  });

  const miniPcBlueprint: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'lenovo-thinkcentre-m920q',
    manufacturer: 'Lenovo',
    model: 'ThinkCentre M920q Tiny',
    category: 'compute-node',
    mount_type: 'sub-module',
    slot_compatibility: 'mini-pc-1liter',
    geometry: {
      u_height: 0.8,
      width_mm: 179.0,
      height_mm: 34.5,
      depth_mm: 182.9,
      ear_mount_style: 'sub-module-clip',
      front_protrusion_mm: 0.0,
      rear_protrusion_mm: 0.0,
      weight_grams: 1320
    },
    power_and_thermal: {
      electrical_role: 'consumer',
      idle_watts: 11,
      max_system_watts: 65,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'usb_front',
        label: 'Front USB-C',
        face: 'front',
        connector_type: 'usb-c',
        direction: 'bidirectional',
        capabilities: ['usb-3.1'],
        coordinates: { x_mm: 25.0, y_mm: 15.0, orientation: 'upright' }
      },
      {
        port_id: 'eth0',
        label: '1GbE RJ45',
        face: 'rear',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['1000base-t'],
        coordinates: { x_mm: 140.0, y_mm: 12.0, orientation: 'upright' }
      },
      {
        port_id: 'dc_in',
        label: 'DC Power Input',
        face: 'rear',
        connector_type: 'dc-5525',
        direction: 'input',
        capabilities: ['dc-power'],
        coordinates: { x_mm: 20.0, y_mm: 12.0, orientation: 'upright' }
      }
    ]
  });

  const keystoneBlueprint: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'keystone-rj45-cat6a-coupler',
    manufacturer: 'Generic',
    model: 'Cat6A Shielded Keystone Coupler',
    category: 'keystone-module',
    mount_type: 'sub-module',
    slot_compatibility: 'standard-keystone',
    is_passthrough_coupler: true,
    geometry: {
      u_height: 0.5,
      width_mm: 16.0,
      height_mm: 20.0,
      depth_mm: 30.0,
      ear_mount_style: 'sub-module-clip',
      front_protrusion_mm: 0.0,
      rear_protrusion_mm: 0.0,
      weight_grams: 22
    },
    power_and_thermal: {
      electrical_role: 'passive',
      idle_watts: 0,
      max_system_watts: 0,
      airflow: 'none'
    },
    ports: [
      {
        port_id: 'coupler',
        label: 'RJ45 Feedthrough',
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['10gbase-t', 'passthrough-coupler'],
        is_passthrough_coupler: true,
        coordinates: { x_mm: 8.0, y_mm: 10.0, orientation: 'upright' }
      }
    ]
  });

  const rearPduBlueprint: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'deskpi-10inch-pdu-rear',
    manufacturer: 'DeskPi',
    model: '10-Inch 4-Way PDU',
    category: 'pdu',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1.0,
      width_mm: 212.0,
      height_mm: 44.0,
      depth_mm: 55.0,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 0.0,
      rear_protrusion_mm: 0.0,
      weight_grams: 650
    },
    power_and_thermal: {
      electrical_role: 'pdu',
      pdu_capacity_watts: 1800
    },
    ports: [
      {
        port_id: 'outlet1',
        label: 'Outlet 1',
        face: 'front',
        connector_type: 'schuko-cee7',
        direction: 'output',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 50.0, y_mm: 22.0, orientation: 'upright' }
      }
    ]
  });

  const catalog = {
    [carrierBlueprint.slug]: carrierBlueprint,
    [miniPcBlueprint.slug]: miniPcBlueprint,
    [keystoneBlueprint.slug]: keystoneBlueprint,
    [rearPduBlueprint.slug]: rearPduBlueprint
  };

  it('computes exact 3D world coordinates for Carrier -> Slot -> ChildDevice and mirrors rear mounts', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Geometry Verification',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'closed-glass-front'
      },
      mounted_devices: [
        {
          instance_id: 'carrier-u3',
          blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
          u_position: 3,
          face: 'front',
          children: [
            {
              instance_id: 'pve-node-01',
              blueprint_slug: 'lenovo-thinkcentre-m920q',
              slot_id: 'left-mini-pc-bay',
              hostname: 'pve01.lab'
            },
            {
              instance_id: 'ks-wan',
              blueprint_slug: 'keystone-rj45-cat6a-coupler',
              slot_id: 'keystone-1'
            }
          ]
        },
        {
          instance_id: 'pdu-rear-01',
          blueprint_slug: 'deskpi-10inch-pdu-rear',
          u_position: 4,
          face: 'rear'
        }
      ],
      cables: [
        {
          cable_id: 'cab-dc-01',
          from: { instance_id: 'pdu-rear-01', port_id: 'outlet1' },
          to: { instance_id: 'pve-node-01', port_id: 'dc_in', face: 'rear' },
          cable_type: 'power-dc-5525'
        }
      ]
    });

    const sceneGeo = computeRackGeometry(project, catalog);

    // 1. Verify Carrier at U3 (front): Y_base = (3 - 1) * 44.45 = 88.90 mm
    const carrierGeo = sceneGeo.devices_by_id.get('carrier-u3')!;
    expect(carrierGeo).toBeDefined();
    expect(carrierGeo.world_origin).toEqual({ x: 0, y: 2 * MM_PER_U, z: 0 });
    expect(carrierGeo.chassis_box.min).toEqual({ x: 0, y: 88.9, z: 0 });
    expect(carrierGeo.chassis_box.max).toEqual({ x: 254, y: 132.9, z: 185 });

    // 2. Verify Child Mini-PC in slot 'left-mini-pc-bay' (offset: 18, 2, 0)
    const pveGeo = sceneGeo.devices_by_id.get('pve-node-01')!;
    expect(pveGeo).toBeDefined();
    expect(pveGeo.world_origin).toEqual({ x: 18, y: 90.9, z: 0 });
    expect(pveGeo.chassis_box.min).toEqual({ x: 18, y: 90.9, z: 0 });
    expect(pveGeo.chassis_box.max).toEqual({
      x: 18 + 179.0,
      y: 90.9 + 34.5,
      z: 182.9
    });

    // GlobalPortPos = CarrierOrigin (0, 88.9, 0) + SlotOffset (18, 2, 0) + ChildLocalPort (140, 12, 182.9)
    const eth0 = pveGeo.ports.find((p) => p.port_id === 'eth0')!;
    expect(eth0.world_position).toEqual({
      x: 18 + 140,
      y: 88.9 + 2 + 12,
      z: 182.9
    });
    expect(eth0.world_normal).toEqual({ x: 0, y: 0, z: 1 });
    expect(eth0.world_face).toBe('rear');

    const usbFront = pveGeo.ports.find((p) => p.port_id === 'usb_front')!;
    expect(usbFront.world_position).toEqual({
      x: 18 + 25,
      y: 88.9 + 2 + 15,
      z: 0
    });
    expect(usbFront.world_normal).toEqual({ x: 0, y: 0, z: -1 });
    expect(usbFront.world_face).toBe('front');

    // Verify plug clearance box on pve-node-01 from cab-dc-01 (dc-5525 straight = 32mm)
    expect(pveGeo.plug_clearance_box).not.toBeNull();
    expect(pveGeo.plug_clearance_box?.min.z).toBe(182.9);
    expect(pveGeo.plug_clearance_box?.max.z).toBeCloseTo(182.9 + 32, 4);

    // 3. Verify Child Keystone Coupler on both 'front' and 'rear' faces
    const ksGeo = sceneGeo.devices_by_id.get('ks-wan')!;
    const ksFrontPort = resolveCableEndpointPortGeometry(
      ksGeo,
      'coupler',
      'front',
      carrierGeo
    )!;
    const ksRearPort = resolveCableEndpointPortGeometry(
      ksGeo,
      'coupler',
      'rear',
      carrierGeo
    )!;

    expect(ksFrontPort.world_position).toEqual({
      x: 208 + 8,
      y: 88.9 + 12 + 10,
      z: 0
    });
    expect(ksFrontPort.world_normal).toEqual({ x: 0, y: 0, z: -1 });

    expect(ksRearPort.world_position).toEqual({
      x: 208 + 8,
      y: 88.9 + 12 + 10,
      z: 30.0
    });
    expect(ksRearPort.world_normal).toEqual({ x: 0, y: 0, z: 1 });

    // 4. Verify Rear-Mounted PDU at U4 (face: 'rear'): X and Z axis mirroring
    const pduGeo = sceneGeo.devices_by_id.get('pdu-rear-01')!;
    // U4 Y_min = 3 * 44.45 = 133.35
    expect(pduGeo.world_origin).toEqual({ x: 254, y: 133.35, z: 260 });
    expect(pduGeo.chassis_box.min.z).toBe(260 - 55); // 205mm
    expect(pduGeo.chassis_box.max.z).toBe(260);

    const outlet1 = pduGeo.ports.find((p) => p.port_id === 'outlet1')!;
    // X is mirrored: W_panel (254) - 50 = 204
    expect(outlet1.world_position).toEqual({
      x: 254 - 50,
      y: 133.35 + 22,
      z: 260
    });
    expect(outlet1.world_normal).toEqual({ x: 0, y: 0, z: 1 });
    expect(outlet1.world_face).toBe('rear');
  });
});
