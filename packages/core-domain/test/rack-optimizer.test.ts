import { describe, expect, it } from 'vitest';
import {
  type HardwareBlueprint,
  normalizeHardwareBlueprint,
  optimizeRackLayout,
  type RackProject,
  RackProjectSchema
} from '../src/index.js';

describe('Deterministic Rack Auto-Optimizer (optimizeRackLayout)', () => {
  const upsBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-ups-1u',
    manufacturer: 'CyberPower',
    model: '10-Inch 1U UPS',
    category: 'ups',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 215,
      height_mm: 43.7,
      depth_mm: 185,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 3,
      rear_protrusion_mm: 0,
      weight_grams: 4500
    },
    power_and_thermal: {
      electrical_role: 'ups',
      idle_watts: 6,
      max_system_watts: 12,
      ups_capacity_watts: 450,
      ups_battery_wh: 108,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'iec_out1',
        label: 'IEC Out 1',
        face: 'rear',
        connector_type: 'iec-c13',
        direction: 'output',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 50, y_mm: 22, orientation: 'upright' }
      },
      {
        port_id: 'iec_out2',
        label: 'IEC Out 2',
        face: 'rear',
        connector_type: 'iec-c13',
        direction: 'output',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 90, y_mm: 22, orientation: 'upright' }
      },
      {
        port_id: 'iec_out3',
        label: 'IEC Out 3',
        face: 'rear',
        connector_type: 'iec-c13',
        direction: 'output',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 130, y_mm: 22, orientation: 'upright' }
      }
    ]
  });

  const ups2uBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-ups-2u',
    manufacturer: 'APC',
    model: '10-Inch 2U Heavy UPS',
    category: 'ups',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 2,
      width_mm: 215,
      height_mm: 88,
      depth_mm: 185,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 3,
      rear_protrusion_mm: 0,
      weight_grams: 6500
    },
    power_and_thermal: {
      electrical_role: 'ups',
      idle_watts: 8,
      max_system_watts: 15,
      ups_capacity_watts: 700,
      ups_battery_wh: 168,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'iec_out1',
        label: 'IEC Out 1',
        face: 'rear',
        connector_type: 'iec-c13',
        direction: 'output',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 50, y_mm: 22, orientation: 'upright' }
      }
    ]
  });

  const pduBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-pdu-1u',
    manufacturer: 'Brennenstuhl',
    model: '10-Inch 1U Shallow PDU',
    category: 'pdu',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 220,
      height_mm: 44,
      depth_mm: 52,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 2,
      rear_protrusion_mm: 0,
      weight_grams: 480
    },
    power_and_thermal: {
      electrical_role: 'pdu',
      idle_watts: 0,
      max_system_watts: 0,
      pdu_capacity_watts: 2300,
      airflow: 'passive-convection'
    },
    port_groups: [
      {
        id_prefix: 'outlet',
        label_prefix: 'C13 ',
        start_index: 1,
        count: 4,
        face: 'front',
        connector_type: 'iec-c13',
        direction: 'output',
        capabilities: ['ac-mains'],
        grid: {
          origin_x_mm: 30,
          origin_y_mm: 22,
          columns: 4,
          rows: 1,
          pitch_x_mm: 32,
          pitch_y_mm: 0
        }
      }
    ],
    ports: [
      {
        port_id: 'ac_in',
        label: 'AC Input',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 190, y_mm: 22, orientation: 'upright' }
      }
    ]
  });

  const switchBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-poe-switch-1u',
    manufacturer: 'Ubiquiti',
    model: '10-Inch 8P PoE Switch',
    category: 'switch',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 212,
      height_mm: 43.7,
      depth_mm: 140,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 3,
      rear_protrusion_mm: 0,
      weight_grams: 1200
    },
    power_and_thermal: {
      electrical_role: 'pse-switch',
      idle_watts: 10,
      max_system_watts: 22,
      poe_budget_watts: 120,
      airflow: 'front-to-rear'
    },
    port_groups: [
      {
        id_prefix: 'eth',
        label_prefix: 'Port ',
        start_index: 1,
        count: 4,
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['2500base-t', 'poe-out-at'],
        grid: {
          origin_x_mm: 40,
          origin_y_mm: 18,
          columns: 4,
          rows: 1,
          pitch_x_mm: 20,
          pitch_y_mm: 0
        }
      }
    ],
    ports: [
      {
        port_id: 'pwr_in',
        label: 'AC Input',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 40, y_mm: 20, orientation: 'upright' }
      }
    ]
  });

  const patchPanelBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-patch-panel-1u',
    manufacturer: 'DeskPi',
    model: '10-Inch 1U Patch Panel',
    category: 'patch-panel',
    mount_type: 'rackmount-10',
    is_passthrough_coupler: true,
    geometry: {
      u_height: 1,
      width_mm: 222,
      height_mm: 44,
      depth_mm: 28,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 1,
      rear_protrusion_mm: 0,
      weight_grams: 310
    },
    power_and_thermal: {
      electrical_role: 'passive',
      airflow: 'passive-convection'
    },
    port_groups: [
      {
        id_prefix: 'p',
        label_prefix: 'Patch ',
        start_index: 1,
        count: 4,
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['2500base-t', 'passthrough-coupler'],
        is_passthrough_coupler: true,
        grid: {
          origin_x_mm: 40,
          origin_y_mm: 22,
          columns: 4,
          rows: 1,
          pitch_x_mm: 20,
          pitch_y_mm: 0
        }
      }
    ]
  });

  const brushPanelBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-brush-panel-1u',
    manufacturer: 'Generic',
    model: '10-Inch 1U Brush Panel',
    category: 'brush-panel',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 222,
      height_mm: 44,
      depth_mm: 15,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 1.5,
      rear_protrusion_mm: 0,
      weight_grams: 160,
      has_cable_pass_through: true
    },
    power_and_thermal: {
      electrical_role: 'passive',
      airflow: 'passive-convection'
    }
  });

  const blankPanelBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-cover-panel-1u',
    manufacturer: '3DPrint',
    model: '10-Inch 1U Cover Panel',
    category: 'blank-panel',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 222,
      height_mm: 44,
      depth_mm: 8,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 2,
      rear_protrusion_mm: 0,
      weight_grams: 42
    },
    power_and_thermal: {
      electrical_role: 'passive',
      airflow: 'none'
    }
  });

  const nas2uBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-nas-2u',
    manufacturer: 'DeskPi',
    model: '10-Inch 2U NAS',
    category: 'nas',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 2,
      width_mm: 215,
      height_mm: 88,
      depth_mm: 175,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 2,
      rear_protrusion_mm: 0,
      weight_grams: 2800
    },
    power_and_thermal: {
      electrical_role: 'consumer',
      idle_watts: 18,
      max_system_watts: 38,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'pwr_in',
        label: 'AC Input',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 35, y_mm: 22, orientation: 'upright' }
      }
    ]
  });

  const carrierBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-10inch-carrier-1u',
    manufacturer: 'Printables',
    model: '10-Inch Tiny + Keystone Carrier',
    category: 'modular-carrier',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 254,
      height_mm: 44,
      depth_mm: 180,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 0,
      rear_protrusion_mm: 0,
      weight_grams: 180
    },
    power_and_thermal: {
      electrical_role: 'passive',
      airflow: 'passive-convection'
    },
    slots: [
      {
        slot_id: 'left-mini-pc-bay',
        accepted_slot_type: 'mini-pc-1liter',
        offset_mm: { x: 18, y: 2, z: 0 },
        max_dimensions_mm: { width: 182, height: 38, depth: 180 }
      },
      {
        slot_id: 'keystone-1',
        accepted_slot_type: 'standard-keystone',
        offset_mm: { x: 208, y: 12, z: 0 },
        max_dimensions_mm: { width: 16.5, height: 22, depth: 35 }
      }
    ]
  });

  const miniPcBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-mini-pc',
    manufacturer: 'Lenovo',
    model: 'ThinkCentre Tiny',
    category: 'mini-pc',
    mount_type: 'sub-module',
    slot_compatibility: 'mini-pc-1liter',
    geometry: {
      u_height: 0.8,
      width_mm: 179,
      height_mm: 34.5,
      depth_mm: 178,
      ear_mount_style: 'sub-module-clip',
      front_protrusion_mm: 0,
      rear_protrusion_mm: 0,
      weight_grams: 1100
    },
    power_and_thermal: {
      electrical_role: 'consumer',
      idle_watts: 10,
      max_system_watts: 35,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'eth0',
        label: 'LAN',
        face: 'rear',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['2500base-t'],
        coordinates: { x_mm: 90, y_mm: 16, orientation: 'upright' }
      },
      {
        port_id: 'pwr_in',
        label: 'AC Input',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 30, y_mm: 16, orientation: 'upright' }
      }
    ]
  });

  const keystoneBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-keystone-rj45',
    manufacturer: 'Generic',
    model: 'Cat6A Keystone Coupler',
    category: 'keystone-module',
    mount_type: 'sub-module',
    slot_compatibility: 'standard-keystone',
    is_passthrough_coupler: true,
    geometry: {
      u_height: 0.5,
      width_mm: 14.5,
      height_mm: 19,
      depth_mm: 30,
      ear_mount_style: 'sub-module-clip',
      front_protrusion_mm: 0,
      rear_protrusion_mm: 0,
      weight_grams: 18
    },
    power_and_thermal: {
      electrical_role: 'passive',
      airflow: 'passive-convection'
    },
    ports: [
      {
        port_id: 'eth0',
        label: 'Keystone',
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['2500base-t', 'passthrough-coupler'],
        is_passthrough_coupler: true,
        coordinates: { x_mm: 7.25, y_mm: 9.5, orientation: 'upright' }
      }
    ]
  });

  const passiveHotComputeBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'test-passive-hot-compute-1u',
    manufacturer: 'CustomLab',
    model: 'Passive 42W Compute Node',
    category: 'compute-node',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1,
      width_mm: 210,
      height_mm: 43.5,
      depth_mm: 150,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 0,
      rear_protrusion_mm: 0,
      weight_grams: 950
    },
    power_and_thermal: {
      electrical_role: 'consumer',
      idle_watts: 18,
      max_system_watts: 42,
      airflow: 'passive-convection'
    },
    ports: [
      {
        port_id: 'pwr_in',
        label: 'AC In',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 30, y_mm: 20, orientation: 'upright' }
      }
    ]
  });

  const catalog: Readonly<Record<string, HardwareBlueprint>> = {
    [upsBp.slug]: upsBp,
    [ups2uBp.slug]: ups2uBp,
    [pduBp.slug]: pduBp,
    [switchBp.slug]: switchBp,
    [patchPanelBp.slug]: patchPanelBp,
    [brushPanelBp.slug]: brushPanelBp,
    [blankPanelBp.slug]: blankPanelBp,
    [nas2uBp.slug]: nas2uBp,
    [carrierBp.slug]: carrierBp,
    [miniPcBp.slug]: miniPcBp,
    [keystoneBp.slug]: keystoneBp,
    [passiveHotComputeBp.slug]: passiveHotComputeBp
  };

  it('fixes top-heavy rack, rear PDU depth collision, unclustered switch/patch panel, and slashes cable length', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Badly Ordered 10-Inch Homelab',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 245,
        enclosure_type: 'closed-glass-front',
        front_door_clearance_mm: 45,
        rear_clearance_mm: 40
      },
      mounted_devices: [
        {
          instance_id: 'ups-1',
          blueprint_slug: upsBp.slug,
          u_position: 8,
          face: 'front',
          children: []
        },
        {
          instance_id: 'pdu-1',
          blueprint_slug: pduBp.slug,
          u_position: 8,
          face: 'rear',
          children: []
        },
        {
          instance_id: 'patch-1',
          blueprint_slug: patchPanelBp.slug,
          u_position: 1,
          face: 'front',
          children: []
        },
        {
          instance_id: 'sw-1',
          blueprint_slug: switchBp.slug,
          u_position: 5,
          face: 'front',
          children: []
        },
        {
          instance_id: 'brush-1',
          blueprint_slug: brushPanelBp.slug,
          u_position: 2,
          face: 'front',
          children: []
        },
        {
          instance_id: 'cover-1',
          blueprint_slug: blankPanelBp.slug,
          u_position: 6,
          face: 'front',
          children: []
        }
      ],
      cables: [
        {
          cable_id: 'pwr-ups-sw',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out1' },
          to: { instance_id: 'sw-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'pwr-ups-pdu',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out2' },
          to: { instance_id: 'pdu-1', port_id: 'ac_in' }
        },
        {
          cable_id: 'patch-1-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p1', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth1' }
        },
        {
          cable_id: 'patch-2-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p2', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth2' }
        },
        {
          cable_id: 'patch-3-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p3', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth3' }
        }
      ],
      external_endpoints: []
    });

    const result = optimizeRackLayout(project, catalog);

    expect(result.improved).toBe(true);
    expect(result.moved_devices.length).toBeGreaterThan(0);
    expect(result.metrics_before.error_count).toBeGreaterThan(0);
    expect(result.metrics_before.warning_count).toBeGreaterThan(0);

    expect(result.metrics_after.error_count).toBe(0);
    expect(result.metrics_after.warning_count).toBe(0);
    expect(result.metrics_after.normalized_cog_y).toBeLessThanOrEqual(0.5);
    expect(result.metrics_after.total_cable_length_mm).toBeLessThan(
      result.metrics_before.total_cable_length_mm
    );

    const afterUps = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'ups-1'
    )!;
    const afterSw = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'sw-1'
    )!;
    const afterPatch = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'patch-1'
    )!;
    const afterPdu = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'pdu-1'
    )!;

    expect(afterUps.u_position).toBe(1);
    expect(afterUps.face).toBe('front');
    expect(Math.abs(afterSw.u_position - afterPatch.u_position)).toBe(1);
    expect(afterPdu.face).toBe('rear');
    expect(afterPdu.u_position).not.toBe(afterUps.u_position);

    // Idempotency check: optimizing an already-optimized rack makes zero moves
    const secondRun = optimizeRackLayout(result.optimized_project, catalog);
    expect(secondRun.improved).toBe(false);
    expect(secondRun.moved_devices).toHaveLength(0);
    expect(secondRun.metrics_after).toEqual(result.metrics_after);
  });

  it('resolves overlapping U slots and out-of-bounds devices while respecting rack.u_height', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Overlapping & Out-of-Bounds Rack',
      rack: {
        standard: '10inch',
        u_height: 6,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'ups-1',
          blueprint_slug: upsBp.slug,
          u_position: 1,
          face: 'front',
          children: []
        },
        {
          instance_id: 'nas-1',
          blueprint_slug: nas2uBp.slug,
          u_position: 6,
          face: 'front',
          children: []
        },
        {
          instance_id: 'sw-1',
          blueprint_slug: switchBp.slug,
          u_position: 4,
          face: 'front',
          children: []
        },
        {
          instance_id: 'patch-1',
          blueprint_slug: patchPanelBp.slug,
          u_position: 4,
          face: 'front',
          children: []
        }
      ],
      cables: [],
      external_endpoints: []
    });

    const result = optimizeRackLayout(project, catalog);
    expect(result.improved).toBe(true);
    expect(result.metrics_before.error_count).toBeGreaterThanOrEqual(2);
    expect(result.metrics_after.error_count).toBe(0);

    for (const dev of result.optimized_project.mounted_devices) {
      const span = dev.blueprint_slug === nas2uBp.slug ? 2 : 1;
      expect(dev.u_position).toBeGreaterThanOrEqual(1);
      expect(dev.u_position + span - 1).toBeLessThanOrEqual(6);
    }
  });

  it('keeps carrier-slot child sub-modules intact inside parent carrier and preserves pin_instance_ids', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Carrier + Pinned Rack',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'ups-1',
          blueprint_slug: upsBp.slug,
          u_position: 8,
          face: 'front',
          children: []
        },
        {
          instance_id: 'carrier-1',
          blueprint_slug: carrierBp.slug,
          u_position: 6,
          face: 'front',
          children: [
            {
              instance_id: 'mini-1',
              blueprint_slug: miniPcBp.slug,
              slot_id: 'left-mini-pc-bay',
              hostname: 'pve-01'
            },
            {
              instance_id: 'ks-1',
              blueprint_slug: keystoneBp.slug,
              slot_id: 'keystone-1'
            }
          ]
        },
        {
          instance_id: 'patch-1',
          blueprint_slug: patchPanelBp.slug,
          u_position: 4,
          face: 'front',
          children: []
        },
        {
          instance_id: 'sw-1',
          blueprint_slug: switchBp.slug,
          u_position: 1,
          face: 'front',
          children: []
        }
      ],
      cables: [
        {
          cable_id: 'pwr-ups-sw',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out1' },
          to: { instance_id: 'sw-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'pwr-ups-mini',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out2' },
          to: { instance_id: 'mini-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'lan-mini-ks',
          cable_type: 'cat6a',
          from: { instance_id: 'mini-1', port_id: 'eth0' },
          to: { instance_id: 'ks-1', port_id: 'eth0', face: 'rear' }
        },
        {
          cable_id: 'patch-ks-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'ks-1', port_id: 'eth0', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth1' }
        },
        {
          cable_id: 'patch-pp-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p1', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth2' }
        }
      ],
      external_endpoints: []
    });

    // Pin patch-1 (at U4) and mini-1 (child inside carrier-1 at U6)
    const result = optimizeRackLayout(project, catalog, {
      pin_instance_ids: ['patch-1', 'mini-1']
    });

    expect(result.improved).toBe(true);
    expect(result.metrics_after.error_count).toBe(0);
    expect(result.metrics_after.warning_count).toBe(0);
    expect(result.metrics_after.normalized_cog_y).toBeLessThanOrEqual(0.5);

    const afterPatch = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'patch-1'
    )!;
    const afterCarrier = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'carrier-1'
    )!;
    const afterUps = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'ups-1'
    )!;
    const afterSw = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'sw-1'
    )!;

    expect(afterPatch.u_position).toBe(4);
    expect(afterCarrier.u_position).toBe(6);
    expect(afterCarrier.children).toHaveLength(2);
    expect(afterCarrier.children[0]?.instance_id).toBe('mini-1');
    expect(afterCarrier.children[0]?.slot_id).toBe('left-mini-pc-bay');
    expect(afterCarrier.children[1]?.instance_id).toBe('ks-1');
    expect(afterCarrier.children[1]?.slot_id).toBe('keystone-1');
    expect(afterUps.u_position).toBe(1);
    // Switch should cluster adjacent to pinned patch-1 (U3 or U5) or carrier-1 (U5)
    expect([3, 5]).toContain(afterSw.u_position);
  });

  it('restores mid-height front-to-rear cable portal and moves front-conflicting PDU to rear behind shallow slot', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Blocked Portal + Crowded Front PDU',
      rack: {
        standard: '10inch',
        u_height: 6,
        rail_depth_mm: 245,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'ups-1',
          blueprint_slug: upsBp.slug,
          u_position: 1,
          face: 'front',
          children: []
        },
        {
          instance_id: 'carrier-1',
          blueprint_slug: carrierBp.slug,
          u_position: 2,
          face: 'front',
          children: [
            {
              instance_id: 'mini-1',
              blueprint_slug: miniPcBp.slug,
              slot_id: 'left-mini-pc-bay'
            }
          ]
        },
        {
          instance_id: 'cover-1',
          blueprint_slug: blankPanelBp.slug,
          u_position: 3,
          face: 'front',
          children: []
        },
        {
          instance_id: 'brush-1',
          blueprint_slug: brushPanelBp.slug,
          u_position: 1, // colliding with ups-1 and leaving NO portal within +/- 3U of U2<->U6!
          face: 'front',
          children: []
        },
        {
          instance_id: 'sw-1',
          blueprint_slug: switchBp.slug,
          u_position: 5,
          face: 'front',
          children: []
        },
        {
          instance_id: 'patch-1',
          blueprint_slug: patchPanelBp.slug,
          u_position: 6,
          face: 'front',
          children: []
        },
        {
          instance_id: 'pdu-1',
          blueprint_slug: pduBp.slug,
          u_position: 5, // colliding on front with sw-1 because 6U front is full!
          face: 'front',
          children: []
        }
      ],
      cables: [
        {
          cable_id: 'pwr-ups-pdu',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out1' },
          to: { instance_id: 'pdu-1', port_id: 'ac_in' }
        },
        {
          cable_id: 'pwr-pdu-sw',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'pdu-1', port_id: 'outlet1' },
          to: { instance_id: 'sw-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'pwr-pdu-mini',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'pdu-1', port_id: 'outlet2' },
          to: { instance_id: 'mini-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'cross-mini-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'mini-1', port_id: 'eth0' },
          to: { instance_id: 'sw-1', port_id: 'eth2' }
        },
        {
          cable_id: 'patch-1-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p1', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth1' }
        }
      ],
      external_endpoints: []
    });

    const result = optimizeRackLayout(project, catalog);
    expect(result.improved).toBe(true);
    expect(result.metrics_before.error_count).toBeGreaterThan(0);
    expect(result.metrics_after.error_count).toBe(0);
    expect(result.metrics_after.warning_count).toBe(0);

    const afterPdu = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'pdu-1'
    )!;
    const afterBrush = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'brush-1'
    )!;
    const afterSw = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'sw-1'
    )!;
    const afterPatch = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'patch-1'
    )!;
    expect(afterPdu.face).toBe('rear');
    expect(afterBrush.u_position).toBeGreaterThanOrEqual(2);
    expect(Math.abs(afterSw.u_position - afterPatch.u_position)).toBe(1);
    expect(result.metrics_after.total_cable_length_mm).toBeLessThan(
      result.metrics_before.total_cable_length_mm
    );
  });

  it('eliminates NO_FRONT_TO_REAR_PORTAL error by relocating a sealed rack brush-panel to mid-height', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Sealed 8U Rack Missing Mid-Height Portal',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'brush-1',
          blueprint_slug: brushPanelBp.slug,
          u_position: 1, // only portal is at U1, >3U away from U6<->U7 cross-face cable!
          face: 'front',
          children: []
        },
        {
          instance_id: 'ups-1',
          blueprint_slug: upsBp.slug,
          u_position: 2,
          face: 'front',
          children: []
        },
        {
          instance_id: 'cover-1',
          blueprint_slug: blankPanelBp.slug,
          u_position: 3,
          face: 'front',
          children: []
        },
        {
          instance_id: 'cover-2',
          blueprint_slug: blankPanelBp.slug,
          u_position: 4,
          face: 'front',
          children: []
        },
        {
          instance_id: 'cover-3',
          blueprint_slug: blankPanelBp.slug,
          u_position: 5,
          face: 'front',
          children: []
        },
        {
          instance_id: 'carrier-1',
          blueprint_slug: carrierBp.slug,
          u_position: 6,
          face: 'front',
          children: [
            {
              instance_id: 'mini-1',
              blueprint_slug: miniPcBp.slug,
              slot_id: 'left-mini-pc-bay'
            }
          ]
        },
        {
          instance_id: 'sw-1',
          blueprint_slug: switchBp.slug,
          u_position: 7,
          face: 'front',
          children: []
        },
        {
          instance_id: 'patch-1',
          blueprint_slug: patchPanelBp.slug,
          u_position: 8,
          face: 'front',
          children: []
        }
      ],
      cables: [
        {
          cable_id: 'pwr-ups-sw',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out1' },
          to: { instance_id: 'sw-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'pwr-ups-mini',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out2' },
          to: { instance_id: 'mini-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'cross-mini-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'mini-1', port_id: 'eth0' },
          to: { instance_id: 'sw-1', port_id: 'eth1' }
        },
        {
          cable_id: 'patch-pp-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p1', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth2' }
        }
      ],
      external_endpoints: []
    });

    const result = optimizeRackLayout(project, catalog);
    expect(result.improved).toBe(true);
    expect(result.metrics_before.error_count).toBeGreaterThanOrEqual(1);
    expect(result.metrics_after.error_count).toBe(0);
    expect(result.metrics_after.warning_count).toBe(0);

    const afterBrush = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'brush-1'
    )!;
    const afterUps = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'ups-1'
    )!;
    expect(afterUps.u_position).toBe(1);
    expect(afterBrush.u_position).toBeGreaterThanOrEqual(3);
    expect(afterBrush.u_position).toBeLessThanOrEqual(6);
  });

  it('reorders a 100%-full mixed 1U/2U rack using block swaps to fix TOP_HEAVY_RACK', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Full 6U Mixed Height Rack',
      rack: {
        standard: '10inch',
        u_height: 6,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'patch-1',
          blueprint_slug: patchPanelBp.slug,
          u_position: 1,
          face: 'front',
          children: []
        },
        {
          instance_id: 'sw-1',
          blueprint_slug: switchBp.slug,
          u_position: 2,
          face: 'front',
          children: []
        },
        {
          instance_id: 'cover-1',
          blueprint_slug: blankPanelBp.slug,
          u_position: 3,
          face: 'front',
          children: []
        },
        {
          instance_id: 'brush-1',
          blueprint_slug: brushPanelBp.slug,
          u_position: 4,
          face: 'front',
          children: []
        },
        {
          instance_id: 'ups-2u',
          blueprint_slug: ups2uBp.slug,
          u_position: 5,
          face: 'front',
          children: []
        }
      ],
      cables: [
        {
          cable_id: 'pwr-ups-sw',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-2u', port_id: 'iec_out1' },
          to: { instance_id: 'sw-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'patch-pp-sw',
          cable_type: 'cat6a',
          from: { instance_id: 'patch-1', port_id: 'p1', face: 'front' },
          to: { instance_id: 'sw-1', port_id: 'eth1' }
        }
      ],
      external_endpoints: []
    });

    const result = optimizeRackLayout(project, catalog);
    expect(result.improved).toBe(true);
    expect(result.metrics_before.warning_count).toBeGreaterThan(0);
    expect(result.metrics_after.error_count).toBe(0);
    expect(result.metrics_after.warning_count).toBe(0);
    expect(result.metrics_after.normalized_cog_y).toBeLessThanOrEqual(0.5);

    const afterUps = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'ups-2u'
    )!;
    expect(afterUps.u_position).toBe(1);
  });

  it('separates adjacent passive high-heat devices to eliminate THERMAL_HOTSPOT_STACKING warnings', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Thermal Hotspot Stacking Rack',
      rack: {
        standard: '10inch',
        u_height: 6,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'ups-1',
          blueprint_slug: upsBp.slug,
          u_position: 1,
          face: 'front',
          children: []
        },
        {
          instance_id: 'hot-1',
          blueprint_slug: passiveHotComputeBp.slug,
          u_position: 3,
          face: 'front',
          children: []
        },
        {
          instance_id: 'hot-2',
          blueprint_slug: passiveHotComputeBp.slug,
          u_position: 4,
          face: 'front',
          children: []
        }
      ],
      cables: [
        {
          cable_id: 'pwr-1',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out1' },
          to: { instance_id: 'hot-1', port_id: 'pwr_in' }
        },
        {
          cable_id: 'pwr-2',
          cable_type: 'power-c13-c14',
          from: { instance_id: 'ups-1', port_id: 'iec_out2' },
          to: { instance_id: 'hot-2', port_id: 'pwr_in' }
        }
      ],
      external_endpoints: []
    });

    const result = optimizeRackLayout(project, catalog);
    expect(result.improved).toBe(true);
    expect(result.metrics_before.warning_count).toBe(1);
    expect(result.metrics_after.error_count).toBe(0);
    expect(result.metrics_after.warning_count).toBe(0);

    const h1 = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'hot-1'
    )!;
    const h2 = result.optimized_project.mounted_devices.find(
      (d) => d.instance_id === 'hot-2'
    )!;
    expect(Math.abs(h1.u_position - h2.u_position)).toBeGreaterThanOrEqual(2);
  });
});
