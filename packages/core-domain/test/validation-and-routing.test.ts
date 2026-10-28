import { describe, expect, it } from 'vitest';
import {
  computeHexagonalBundleOffset,
  computeMinSplineClearanceMm,
  evaluateRackScene,
  type HardwareBlueprint,
  normalizeHardwareBlueprint,
  type RackProject,
  RackProjectSchema,
  resolveCableEndpointPortGeometry,
  vec3Distance
} from '../src/index.js';

describe('10-Inch Mini-Rack (8U, 260mm Depth) End-to-End Validation & 3D Routing Suite', () => {
  // 1. 8-Port PoE Switch with deep chassis (185mm) and rear IEC-C14 input
  const coreSwitchBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'ubiquiti-usw-pro-8-poe-10inch',
    manufacturer: 'Ubiquiti',
    model: 'USW-Pro-8-PoE (10-Inch Mount)',
    category: 'switch',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1.0,
      width_mm: 212.9,
      height_mm: 43.7,
      depth_mm: 185.0,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 5.0,
      rear_protrusion_mm: 0.0,
      weight_grams: 1850
    },
    power_and_thermal: {
      electrical_role: 'pse-switch',
      idle_watts: 15,
      max_system_watts: 30,
      poe_budget_watts: 120,
      airflow: 'passive-convection'
    },
    port_groups: [
      {
        id_prefix: 'eth',
        label_prefix: 'Port ',
        start_index: 1,
        count: 8,
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['2500base-t', 'poe-out-bt-type3'],
        grid: {
          origin_x_mm: 45.0,
          origin_y_mm: 14.0,
          columns: 8,
          rows: 1,
          pitch_x_mm: 16.5,
          pitch_y_mm: 0.0
        }
      }
    ],
    ports: [
      {
        port_id: 'pwr_in',
        label: 'AC Mains Input',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 40.0, y_mm: 20.0, orientation: 'upright' }
      },
      {
        port_id: 'console',
        label: 'RS232 Serial Console',
        face: 'front',
        connector_type: 'rj45-serial-console',
        direction: 'bidirectional',
        capabilities: ['serial-rs232'],
        coordinates: { x_mm: 200.0, y_mm: 14.0, orientation: 'upright' }
      }
    ]
  });

  // 2. 1U Modular Carrier (Mini-PC + Keystone)
  const carrierBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
    manufacturer: 'Printables',
    model: '10-Inch Lenovo Tiny + 2 Keystone Carrier',
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
      electrical_role: 'passive'
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
      },
      {
        slot_id: 'keystone-2',
        accepted_slot_type: 'standard-keystone',
        offset_mm: { x: 228.0, y: 12.0, z: 0.0 },
        max_dimensions_mm: { width: 16.5, height: 22.0, depth: 35.0 }
      }
    ]
  });

  // 3. Lenovo ThinkCentre Tiny Mini-PC (AC/DC consumer)
  const miniPcBp: HardwareBlueprint = normalizeHardwareBlueprint({
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
      weight_grams: 1320
    },
    power_and_thermal: {
      electrical_role: 'consumer',
      idle_watts: 12,
      max_system_watts: 65,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'eth0',
        label: '1GbE NIC',
        face: 'rear',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['1000base-t'],
        coordinates: { x_mm: 140.0, y_mm: 14.0, orientation: 'upright' }
      },
      {
        port_id: 'dc_in',
        label: '20V Barrel Input',
        face: 'rear',
        connector_type: 'dc-5525',
        direction: 'input',
        capabilities: ['dc-power'],
        coordinates: { x_mm: 20.0, y_mm: 14.0, orientation: 'upright' }
      }
    ]
  });

  // 4. Keystone Cat6A Coupler
  const keystoneCouplerBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'keystone-rj45-cat6a-coupler',
    manufacturer: 'FS',
    model: 'Cat6A RJ45 Keystone Coupler',
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
      weight_grams: 20
    },
    power_and_thermal: {
      electrical_role: 'passive'
    },
    ports: [
      {
        port_id: 'rj45',
        label: 'Keystone Feedthrough',
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['10gbase-t', 'passthrough-coupler'],
        is_passthrough_coupler: true,
        coordinates: { x_mm: 8.0, y_mm: 10.0, orientation: 'upright' }
      }
    ]
  });

  // 5. Rear 10-Inch PDU (55mm depth)
  const rearPduBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'intellinet-10inch-pdu-4way',
    manufacturer: 'Intellinet',
    model: '10-Inch 1U 4-Socket Schuko PDU',
    category: 'pdu',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1.0,
      width_mm: 212.0,
      height_mm: 44.0,
      depth_mm: 55.0,
      ear_mount_style: 'included-10inch-ears',
      weight_grams: 680
    },
    power_and_thermal: {
      electrical_role: 'pdu',
      pdu_capacity_watts: 1800
    },
    port_groups: [
      {
        id_prefix: 'outlet',
        label_prefix: 'Schuko ',
        start_index: 1,
        count: 4,
        face: 'front',
        connector_type: 'schuko-cee7',
        direction: 'output',
        capabilities: ['ac-mains'],
        grid: {
          origin_x_mm: 40.0,
          origin_y_mm: 22.0,
          columns: 4,
          rows: 1,
          pitch_x_mm: 42.0,
          pitch_y_mm: 0.0
        }
      }
    ]
  });

  // 6. High-power PoE++ Compute Node (50W PoE PD) for testing PoE budget overflow
  const poeComputeNodeBp: HardwareBlueprint = normalizeHardwareBlueprint({
    slug: 'poe-ai-cluster-blade-10inch',
    manufacturer: 'Homelab',
    model: 'PoE++ Compute Blade (3x 50W Nodes)',
    category: 'compute-node',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1.0,
      width_mm: 212.0,
      height_mm: 43.5,
      depth_mm: 140.0,
      ear_mount_style: 'included-10inch-ears',
      weight_grams: 950
    },
    power_and_thermal: {
      electrical_role: 'consumer',
      idle_watts: 18,
      max_system_watts: 50,
      airflow: 'front-to-rear'
    },
    ports: [
      {
        port_id: 'poe_in',
        label: '2.5G PoE++ Input',
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['2500base-t', 'poe-in-bt-type3'],
        coordinates: { x_mm: 50.0, y_mm: 15.0, orientation: 'upright' }
      }
    ]
  });

  const catalog = {
    [coreSwitchBp.slug]: coreSwitchBp,
    [carrierBp.slug]: carrierBp,
    [miniPcBp.slug]: miniPcBp,
    [keystoneCouplerBp.slug]: keystoneCouplerBp,
    [rearPduBp.slug]: rearPduBp,
    [poeComputeNodeBp.slug]: poeComputeNodeBp
  };

  it('detects PLUG_CLEARANCE_COLLISION on U4 (185mm front switch + 55mm straight IEC-C13 vs 55mm rear PDU in 260mm rack) and synthesizes valid free U remediation suggestions', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: '10-Inch Mini-Rack Collision & PoE Test',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'closed-glass-front',
        front_door_clearance_mm: 45,
        rear_clearance_mm: 40
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
          instance_id: 'sw-core-01',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 4,
          face: 'front'
        },
        {
          instance_id: 'pdu-rear-01',
          blueprint_slug: 'intellinet-10inch-pdu-4way',
          u_position: 4,
          face: 'rear'
        }
      ],
      cables: [
        // Straight power cord on sw-core-01 rear (185 + 55 = 240mm) -> collides with pdu-rear-01 (205..260mm) by 35mm!
        {
          cable_id: 'cab-pwr-01',
          from: { instance_id: 'pdu-rear-01', port_id: 'outlet1', face: 'rear' },
          to: { instance_id: 'sw-core-01', port_id: 'pwr_in', face: 'rear' },
          cable_type: 'power-schuko-c13'
        },
        // Front patch from sw-core-01 eth1 (U4 front) to ks-wan coupler (U3 front)
        {
          cable_id: 'cab-eth-front',
          from: { instance_id: 'sw-core-01', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'ks-wan', port_id: 'rj45', face: 'front' },
          cable_type: 'cat6a'
        },
        // Rear patch from ks-wan coupler (U3 rear) to pve-node-01 eth0 (U3 rear)
        {
          cable_id: 'cab-eth-rear',
          from: { instance_id: 'ks-wan', port_id: 'rj45', face: 'rear' },
          to: { instance_id: 'pve-node-01', port_id: 'eth0', face: 'rear' },
          cable_type: 'cat6a'
        },
        // Direct cross-face patch from sw-core-01 eth2 (U4 front) to pve-node-01 (or via portal)
        {
          cable_id: 'cab-cross-portal',
          from: { instance_id: 'sw-core-01', port_id: 'eth2', face: 'front' },
          to: { instance_id: 'ks-wan', port_id: 'rj45', face: 'front' },
          cable_type: 'cat6a'
        }
      ]
    });

    // First remove duplicate cab-cross-portal so ks-wan front isn't double-occupied, instead test cross-face directly when pve-node-01 eth0 is connected from sw-core-01
    const cleanProject: RackProject = {
      ...project,
      cables: project.cables.slice(0, 3)
    };

    const scene = evaluateRackScene(cleanProject, catalog);

    // 1. Verify PLUG_CLEARANCE_COLLISION on U4
    const plugIssue = scene.validation.issues.find(
      (i) => i.code === 'PLUG_CLEARANCE_COLLISION'
    );
    expect(plugIssue).toBeDefined();
    expect(plugIssue?.severity).toBe('ERROR');
    expect(plugIssue?.u_range).toEqual([4, 4]);
    expect(plugIssue?.affected_instances).toEqual([
      'sw-core-01',
      'pdu-rear-01'
    ]);
    expect(plugIssue?.message).toContain('35mm overlap');
    expect(plugIssue?.message).toContain('240mm');

    // Verify remediation_suggestions suggest valid free rear U positions (U1, U2, U5, U6, U7, U8) and angled plug
    const moveSuggestion = plugIssue?.remediation_suggestions[0] ?? '';
    expect(moveSuggestion).toContain("Move 'pdu-rear-01' from U4 (rear)");
    expect(moveSuggestion).toContain('U1 (rear)');
    expect(moveSuggestion).toContain('U7 (rear)');
    expect(moveSuggestion).toContain('U8 (rear)');
    expect(moveSuggestion).toContain('front depth is 0mm');

    const angledSuggestion = plugIssue?.remediation_suggestions[1] ?? '';
    expect(angledSuggestion).toContain('power-schuko-c13-angled');
    expect(angledSuggestion).toContain('from 55mm to 30mm');
    expect(angledSuggestion).toContain('10mm');

    // 2. Verify UNPOWERED_DEVICE warning for pve-node-01 (has no DC power cable connected)
    const unpoweredIssue = scene.validation.issues.find(
      (i) =>
        i.code === 'UNPOWERED_DEVICE' &&
        i.affected_instances.includes('pve-node-01')
    );
    expect(unpoweredIssue).toBeDefined();
    expect(unpoweredIssue?.severity).toBe('WARNING');
    expect(unpoweredIssue?.remediation_suggestions[0]).toContain('dc_in');
    expect(unpoweredIssue?.remediation_suggestions[0]).toContain('pdu-rear-01');

    // 3. Apply the self-correction suggestion (move pdu-rear-01 to U8 rear & power pve-node-01) and verify VALID status!
    const remediatedProject: RackProject = {
      ...cleanProject,
      mounted_devices: cleanProject.mounted_devices.map((d) =>
        d.instance_id === 'pdu-rear-01' ? { ...d, u_position: 8 } : d
      ),
      cables: [
        ...cleanProject.cables,
        {
          cable_id: 'cab-pwr-pve',
          from: { instance_id: 'pdu-rear-01', port_id: 'outlet2', face: 'rear' },
          to: { instance_id: 'pve-node-01', port_id: 'dc_in', face: 'rear' },
          cable_type: 'power-dc-5525',
          color_hex: '#111827'
        }
      ]
    };

    const remediatedScene = evaluateRackScene(remediatedProject, catalog);
    expect(remediatedScene.validation.status).toBe('VALID');
    expect(remediatedScene.validation.error_count).toBe(0);
    expect(remediatedScene.validation.warning_count).toBe(0);
  });

  it('detects POE_BUDGET_EXCEEDED when downstream PoE loads exceed switch poe_budget_watts (120W)', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'PoE Budget Overflow Test',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'pdu-01',
          blueprint_slug: 'intellinet-10inch-pdu-4way',
          u_position: 1,
          face: 'rear'
        },
        {
          instance_id: 'sw-poe',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 2,
          face: 'front'
        },
        // 3x 50W PoE blades = 150W > 120W budget!
        {
          instance_id: 'blade-1',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 3,
          face: 'front'
        },
        {
          instance_id: 'blade-2',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 4,
          face: 'front'
        },
        {
          instance_id: 'blade-3',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 5,
          face: 'front'
        }
      ],
      cables: [
        {
          cable_id: 'pwr-sw',
          from: { instance_id: 'pdu-01', port_id: 'outlet1' },
          to: { instance_id: 'sw-poe', port_id: 'pwr_in' },
          cable_type: 'power-schuko-c13'
        },
        {
          cable_id: 'poe-1',
          from: { instance_id: 'sw-poe', port_id: 'eth1' },
          to: { instance_id: 'blade-1', port_id: 'poe_in' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'poe-2',
          from: { instance_id: 'sw-poe', port_id: 'eth2' },
          to: { instance_id: 'blade-2', port_id: 'poe_in' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'poe-3',
          from: { instance_id: 'sw-poe', port_id: 'eth3' },
          to: { instance_id: 'blade-3', port_id: 'poe_in' },
          cable_type: 'cat6a'
        }
      ]
    });

    const scene = evaluateRackScene(project, catalog);
    const poeIssue = scene.validation.issues.find(
      (i) => i.code === 'POE_BUDGET_EXCEEDED'
    );

    expect(poeIssue).toBeDefined();
    expect(poeIssue?.severity).toBe('ERROR');
    expect(poeIssue?.message).toContain('150W');
    expect(poeIssue?.message).toContain('120W');
    expect(poeIssue?.message).toContain('30W');
    expect(poeIssue?.remediation_suggestions.length).toBeGreaterThan(0);

    // Also verify all 3 PoE blades are recognized as powered via PoE (no UNPOWERED_DEVICE warning)
    expect(
      scene.validation.power_summary.unpowered_active_instances
    ).toHaveLength(0);
    // And PDU total load = 30W (switch own) + 150W (PoE load) = 180W
    expect(
      scene.validation.power_summary.power_sources[0]?.total_load_watts
    ).toBe(180);
  });

  it('computes 3D Catmull-Rom cable splines, hexagonal duct bundling, and commercial length bins for Front-to-Front and Front-to-Rear routes', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: '3D Routing Verification',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
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
              slot_id: 'left-mini-pc-bay'
            },
            {
              instance_id: 'ks-wan',
              blueprint_slug: 'keystone-rj45-cat6a-coupler',
              slot_id: 'keystone-1'
            }
          ]
        },
        {
          instance_id: 'sw-core-01',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 4,
          face: 'front'
        },
        {
          instance_id: 'blade-u7',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 7,
          face: 'front'
        }
      ],
      cables: [
        // 1. Short vertical jump on front face: sw-core-01 eth1 (x=45, U4) -> blade on U3? Let's test eth8 (x=160.5, U4) -> ks-wan (x=216, U3) = Same-Face Duct Route
        {
          cable_id: 'cab-front-duct-1',
          from: { instance_id: 'sw-core-01', port_id: 'eth8', face: 'front' },
          to: { instance_id: 'ks-wan', port_id: 'rj45', face: 'front' },
          cable_type: 'cat6a'
        },
        // 2. Second front-to-front cable in the same FR duct (verifies hexagonal bundle offset!)
        {
          cable_id: 'cab-front-duct-2',
          from: { instance_id: 'sw-core-01', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'blade-u7', port_id: 'poe_in', face: 'front' },
          cable_type: 'cat6a'
        },
        // 3. Cross-Face Portal Route: sw-core-01 eth2 (U4 front) -> pve-node-01 eth0 (U3 rear) via portal U2
        {
          cable_id: 'cab-cross-face',
          from: { instance_id: 'sw-core-01', port_id: 'eth2', face: 'front' },
          to: { instance_id: 'pve-node-01', port_id: 'eth0', face: 'rear' },
          cable_type: 'cat6a',
          preferred_portal_u: 2
        }
      ]
    });

    const scene = evaluateRackScene(project, catalog);
    expect(scene.cable_routes).toHaveLength(3);

    const route1 = scene.cable_routes.find(
      (r) => r.cable_id === 'cab-front-duct-1'
    )!;
    const route2 = scene.cable_routes.find(
      (r) => r.cable_id === 'cab-front-duct-2'
    )!;
    const routeCross = scene.cable_routes.find(
      (r) => r.cable_id === 'cab-cross-face'
    )!;

    // Verify Route 1 & Route 2 use Right Front Duct ('FR') for data cables and receive distinct hexagonal bundle offsets
    expect(route1.route_case).toBe('same-face-duct');
    expect(route1.assigned_ducts).toEqual(['FR']);
    expect(route1.bundle_index).toBe(0);
    expect(route1.bundle_offset_mm).toEqual({ du: 0, dv: 0 });

    expect(route2.route_case).toBe('same-face-duct');
    expect(route2.assigned_ducts).toEqual(['FR']);
    expect(route2.bundle_index).toBe(1);
    expect(route2.bundle_offset_mm).toEqual({ du: 6.5, dv: 0 });

    // Verify Cross-Face Route uses ['FR', 'RR'] and passes through Portal U2
    expect(routeCross.route_case).toBe('cross-face-portal');
    expect(routeCross.assigned_ducts).toEqual(['FR', 'RR']);
    expect(routeCross.portal_u).toBe(2);
    expect(routeCross.waypoints.length).toBeGreaterThanOrEqual(9);
    expect(routeCross.spline_points.length).toBe(
      (routeCross.waypoints.length - 1) * 32 + 1
    );

    // Verify required_length_mm = raw_arc_length_mm * 1.12 + 40 and commercial bin mapping
    for (const r of [route1, route2, routeCross]) {
      expect(r.raw_arc_length_mm).toBeGreaterThan(100);
      expect(r.required_length_mm).toBeCloseTo(
        r.raw_arc_length_mm * 1.12 + 40,
        1
      );
      expect(r.recommended_commercial_mm).toBeGreaterThanOrEqual(
        r.required_length_mm
      );
    }
    // Cross-face route across 260mm deep rack is longer than front-only patch
    expect(routeCross.raw_arc_length_mm).toBeGreaterThan(
      route1.raw_arc_length_mm
    );
  });

  it('verifies Direct Vertical Patch (Case A), Hexagonal Ring Math, and Stage 2/4 edge cases', () => {
    // Verify hexagonal ring offsets for ring 0, ring 1 (1..6), and ring 2 (7..18)
    expect(computeHexagonalBundleOffset(0)).toEqual({ du: 0, dv: 0 });
    const ring1 = computeHexagonalBundleOffset(1, 6.5);
    expect(Math.hypot(ring1.du, ring1.dv)).toBeCloseTo(6.5, 3);
    const ring2Corner = computeHexagonalBundleOffset(7, 6.5);
    expect(Math.hypot(ring2Corner.du, ring2Corner.dv)).toBeCloseTo(13.0, 3);

    // Verify Case A (Direct Vertical Patch: |dY| <= 90mm, |dX| <= 50mm on same face)
    // and SIGNAL_PROTOCOL_INCOMPATIBLE when connecting serial console port to Ethernet
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Direct Patch & Signal Test',
      rack: {
        standard: '10inch',
        u_height: 4,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'sw-u1',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 1,
          face: 'front'
        },
        {
          instance_id: 'blade-u2',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 2,
          face: 'front'
        }
      ],
      cables: [
        // sw-u1 eth1 (x=45, y=14) -> blade-u2 poe_in (x=50, y=44.45+15=59.45): |dX|=5 <= 50, |dY|=45.45 <= 90!
        {
          cable_id: 'cab-short-patch',
          from: { instance_id: 'sw-u1', port_id: 'eth1' },
          to: { instance_id: 'blade-u2', port_id: 'poe_in' },
          cable_type: 'cat6a'
        },
        // Invalid serial console -> Ethernet connection
        {
          cable_id: 'cab-bad-serial',
          from: { instance_id: 'sw-u1', port_id: 'console' },
          to: { instance_id: 'sw-u1', port_id: 'eth2' },
          cable_type: 'cat6a'
        }
      ]
    });

    const scene = evaluateRackScene(project, catalog);
    const shortRoute = scene.cable_routes.find(
      (r) => r.cable_id === 'cab-short-patch'
    )!;
    expect(shortRoute.route_case).toBe('direct-vertical-patch');
    expect(shortRoute.recommended_commercial_mm).toBe(150);

    const signalIssue = scene.validation.issues.find(
      (i) => i.code === 'SIGNAL_PROTOCOL_INCOMPATIBLE'
    );
    expect(signalIssue).toBeDefined();
  });

  it('verifies CHASSIS_COLLISION, FRONT_DOOR_COLLISION, SLOT_DIMENSION_OVERFLOW, TOP_HEAVY_RACK, and NO_FRONT_TO_REAR_PORTAL', () => {
    const heavyUpsBp: HardwareBlueprint = normalizeHardwareBlueprint({
      slug: 'heavy-10inch-ups-1u',
      manufacturer: 'CyberPower',
      model: '10-Inch Lithium UPS',
      category: 'ups',
      mount_type: 'rackmount-10',
      geometry: {
        u_height: 1.0,
        width_mm: 212.0,
        height_mm: 44.0,
        depth_mm: 210.0,
        ear_mount_style: 'included-10inch-ears',
        front_protrusion_mm: 20.0,
        weight_grams: 5200
      },
      power_and_thermal: {
        electrical_role: 'ups',
        ups_capacity_watts: 300
      },
      ports: [
        {
          port_id: 'iec_out1',
          label: 'IEC C13 Out',
          face: 'rear',
          connector_type: 'iec-c13',
          direction: 'output',
          capabilities: ['ac-mains'],
          coordinates: { x_mm: 40.0, y_mm: 20.0, orientation: 'upright' }
        }
      ]
    });

    const oversizedMiniPcBp: HardwareBlueprint = normalizeHardwareBlueprint({
      slug: 'oversized-workstation-node',
      manufacturer: 'Generic',
      model: 'Oversized Node',
      category: 'compute-node',
      mount_type: 'sub-module',
      slot_compatibility: 'mini-pc-1liter',
      geometry: {
        u_height: 1.0,
        width_mm: 200.0, // exceeds 182.0mm max slot width!
        height_mm: 36.0,
        depth_mm: 180.0
      },
      power_and_thermal: {
        electrical_role: 'passive'
      }
    });

    const extendedCatalog = {
      ...catalog,
      [heavyUpsBp.slug]: heavyUpsBp,
      [oversizedMiniPcBp.slug]: oversizedMiniPcBp
    };

    // Seal a 3U rack completely on the front face (U1, U2, U3 all occupied by full-ear devices),
    // mount heavy UPS on U3 (> 4000g above U2/top), and provoke front door & chassis collision
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Edge Case Constraints Test',
      rack: {
        standard: '10inch',
        u_height: 4,
        rail_depth_mm: 220,
        enclosure_type: 'closed-glass-front',
        front_door_clearance_mm: 15 // heavyUpsBp has front_protrusion_mm = 20mm > 15mm!
      },
      mounted_devices: [
        {
          instance_id: 'carrier-u1',
          blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
          u_position: 1,
          face: 'front',
          children: [
            {
              instance_id: 'oversized-child',
              blueprint_slug: 'oversized-workstation-node',
              slot_id: 'left-mini-pc-bay'
            }
          ]
        },
        {
          instance_id: 'sw-u2',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 2,
          face: 'front'
        },
        // Rear PDU at U2 in 220mm rack: 220 - 55 = 165mm, while sw-u2 body is 185mm -> 20mm CHASSIS_COLLISION!
        {
          instance_id: 'pdu-u2-rear',
          blueprint_slug: 'intellinet-10inch-pdu-4way',
          u_position: 2,
          face: 'rear'
        },
        {
          instance_id: 'blade-u3',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 3,
          face: 'front'
        },
        {
          instance_id: 'ups-u4-top',
          blueprint_slug: 'heavy-10inch-ups-1u',
          u_position: 4,
          face: 'front'
        }
      ],
      cables: [
        // Cross-face cable when all 4 Us on the front face are 100% sealed -> NO_FRONT_TO_REAR_PORTAL
        {
          cable_id: 'cab-sealed-cross',
          from: { instance_id: 'sw-u2', port_id: 'pwr_in', face: 'rear' },
          to: { instance_id: 'blade-u3', port_id: 'poe_in', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'cab-valid-cross',
          from: { instance_id: 'sw-u2', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'pdu-u2-rear', port_id: 'outlet1', face: 'rear' },
          cable_type: 'cat6a'
        }
      ]
    });

    const scene = evaluateRackScene(project, extendedCatalog);
    const codes = new Set(scene.validation.issues.map((i) => i.code));

    expect(codes.has('SLOT_DIMENSION_OVERFLOW')).toBe(true);
    expect(codes.has('CHASSIS_COLLISION')).toBe(true);
    expect(codes.has('FRONT_DOOR_COLLISION')).toBe(true);
    expect(codes.has('CONNECTOR_INCOMPATIBLE')).toBe(true);
    expect(codes.has('TOP_HEAVY_RACK')).toBe(true);

    // Now test NO_FRONT_TO_REAR_PORTAL with valid RJ45 front-to-rear connection in a 100% sealed 4U rack
    const projectSealedPortal = RackProjectSchema.parse({
      ...project,
      mounted_devices: [
        {
          instance_id: 'carrier-u1',
          blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
          u_position: 1,
          face: 'front',
          children: [
            {
              instance_id: 'pve-u1',
              blueprint_slug: 'lenovo-thinkcentre-m920q',
              slot_id: 'left-mini-pc-bay'
            }
          ]
        },
        {
          instance_id: 'sw-u2',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 2,
          face: 'front'
        },
        {
          instance_id: 'blade-u3',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 3,
          face: 'front'
        },
        {
          instance_id: 'ups-u4-top',
          blueprint_slug: 'heavy-10inch-ups-1u',
          u_position: 4,
          face: 'front'
        }
      ],
      cables: [
        {
          cable_id: 'cab-eth-no-portal',
          from: { instance_id: 'sw-u2', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'pve-u1', port_id: 'eth0', face: 'rear' },
          cable_type: 'cat6a'
        }
      ]
    });

    const sealedScene = evaluateRackScene(projectSealedPortal, extendedCatalog);
    const portalIssue = sealedScene.validation.issues.find(
      (i) => i.code === 'NO_FRONT_TO_REAR_PORTAL'
    );
    expect(portalIssue).toBeDefined();
    expect(portalIssue?.severity).toBe('ERROR');
    expect(portalIssue?.remediation_suggestions[0]).toContain('brush-panel');
  });

  it('enforces exact 0.001mm Catmull-Rom endpoint clamping (splinePoints[0] === P_start, splinePoints[last] === P_end) and front/rear Z separation', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Endpoint Clamping & Z-Separation Test',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 240,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'pdu-u2-rear',
          blueprint_slug: 'intellinet-10inch-pdu-4way',
          u_position: 2,
          face: 'rear'
        },
        {
          instance_id: 'carrier-u4',
          blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
          u_position: 4,
          face: 'front',
          children: [
            {
              instance_id: 'pve-node-01',
              blueprint_slug: 'lenovo-thinkcentre-m920q',
              slot_id: 'left-mini-pc-bay'
            }
          ]
        },
        {
          instance_id: 'blade-u7',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 7,
          face: 'front'
        },
        {
          instance_id: 'sw-u8',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 8,
          face: 'front'
        }
      ],
      cables: [
        // 1. Rear -> Rear power cable (pdu-u2-rear -> sw-u8 rear)
        {
          cable_id: 'rear-to-rear-pwr',
          from: { instance_id: 'pdu-u2-rear', port_id: 'outlet1' },
          to: { instance_id: 'sw-u8', port_id: 'pwr_in', face: 'rear' },
          cable_type: 'power-schuko-c13'
        },
        // 2. Front -> Front adjacent-U horizontally offset patch (sw-u8:eth8 x=160.5 -> blade-u7:poe_in x=50)
        {
          cable_id: 'front-adjacent-offset-patch',
          from: { instance_id: 'sw-u8', port_id: 'eth8', face: 'front' },
          to: { instance_id: 'blade-u7', port_id: 'poe_in', face: 'front' },
          cable_type: 'cat6a'
        },
        // 3. Cross-Face Front -> Rear cable (sw-u8:eth1 front -> pve-node-01:eth0 rear)
        {
          cable_id: 'cross-face-sw-to-pve',
          from: { instance_id: 'sw-u8', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'pve-node-01', port_id: 'eth0', face: 'rear' },
          cable_type: 'cat6a'
        }
      ]
    });

    const scene = evaluateRackScene(project, catalog);
    expect(scene.cable_routes).toHaveLength(3);

    for (const cable of scene.project.cables) {
      const route = scene.cable_routes.find((r) => r.cable_id === cable.cable_id)!;
      const fromDev = scene.geometry.devices_by_id.get(cable.from.instance_id)!;
      const toDev = scene.geometry.devices_by_id.get(cable.to.instance_id)!;
      const fromParent = fromDev.parent_carrier_id
        ? scene.geometry.devices_by_id.get(fromDev.parent_carrier_id)
        : undefined;
      const toParent = toDev.parent_carrier_id
        ? scene.geometry.devices_by_id.get(toDev.parent_carrier_id)
        : undefined;

      const pStart = resolveCableEndpointPortGeometry(
        fromDev,
        cable.from.port_id,
        cable.from.face,
        fromParent
      )!.world_position;
      const pEnd = resolveCableEndpointPortGeometry(
        toDev,
        cable.to.port_id,
        cable.to.face,
        toParent
      )!.world_position;

      const firstSplinePt = route.spline_points[0]!;
      const lastSplinePt = route.spline_points[route.spline_points.length - 1]!;

      expect(vec3Distance(firstSplinePt, pStart)).toBeLessThanOrEqual(0.001);
      expect(vec3Distance(lastSplinePt, pEnd)).toBeLessThanOrEqual(0.001);
    }

    const rearRoute = scene.cable_routes.find(
      (r) => r.cable_id === 'rear-to-rear-pwr'
    )!;
    // Rear -> Rear cable must never travel to the front of the rack (Z <= 0)
    expect(rearRoute.spline_points.every((pt) => pt.z > 100)).toBe(true);

    const frontPatch = scene.cable_routes.find(
      (r) => r.cable_id === 'front-adjacent-offset-patch'
    )!;
    expect(frontPatch.route_case).toBe('direct-vertical-patch');
    expect(frontPatch.spline_points.every((pt) => pt.z <= 0.001)).toBe(true);
  });

  it('detects SPEED_MISMATCH (Cat5e on 2.5G link), THERMAL_AIRFLOW_CONFLICT, THERMAL_HOTSPOT_STACKING, and logarithmic ACOUSTIC_NOISE_HIGH dB(A)', () => {
    const noisyRearToFrontServerBp: HardwareBlueprint =
      normalizeHardwareBlueprint({
        slug: 'noisy-1u-server-rear-intake',
        manufacturer: 'Supermicro',
        model: '1U High-RPM Edge Node',
        category: 'compute-node',
        mount_type: 'rackmount-10',
        geometry: {
          u_height: 1.0,
          width_mm: 212.0,
          height_mm: 43.5,
          depth_mm: 180.0,
          ear_mount_style: 'included-10inch-ears',
          weight_grams: 2100
        },
        power_and_thermal: {
          electrical_role: 'consumer',
          idle_watts: 35,
          max_system_watts: 85,
          airflow: 'rear-to-front',
          noise_db_a: 48.0
        },
        ports: [
          {
            port_id: 'eth0',
            label: '2.5G RJ45',
            face: 'front',
            connector_type: 'rj45',
            direction: 'bidirectional',
            capabilities: ['2500base-t'],
            coordinates: { x_mm: 40.0, y_mm: 15.0, orientation: 'upright' }
          }
        ]
      });

    const hotPassiveSwitchBp: HardwareBlueprint = normalizeHardwareBlueprint({
      slug: 'hot-passive-switch-45w',
      manufacturer: 'Generic',
      model: '45W Fanless Switch',
      category: 'switch',
      mount_type: 'rackmount-10',
      geometry: {
        u_height: 1.0,
        width_mm: 212.0,
        height_mm: 43.5,
        depth_mm: 160.0,
        ear_mount_style: 'included-10inch-ears',
        weight_grams: 1400
      },
      power_and_thermal: {
        electrical_role: 'pse-switch',
        idle_watts: 20,
        max_system_watts: 45,
        poe_budget_watts: 120,
        airflow: 'passive-convection',
        noise_db_a: 0
      },
      ports: [
        {
          port_id: 'eth1',
          label: '2.5G RJ45',
          face: 'front',
          connector_type: 'rj45',
          direction: 'bidirectional',
          capabilities: ['2500base-t'],
          coordinates: { x_mm: 40.0, y_mm: 15.0, orientation: 'upright' }
        }
      ]
    });

    const testCatalog = {
      ...catalog,
      [noisyRearToFrontServerBp.slug]: noisyRearToFrontServerBp,
      [hotPassiveSwitchBp.slug]: hotPassiveSwitchBp
    };

    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Speed, Thermal & Acoustic Test',
      rack: {
        standard: '10inch',
        u_height: 6,
        rail_depth_mm: 240,
        enclosure_type: 'closed-glass-front'
      },
      mounted_devices: [
        // Two adjacent 45W passive switches on U1 & U2 -> THERMAL_HOTSPOT_STACKING
        {
          instance_id: 'passive-sw-u1',
          blueprint_slug: 'hot-passive-switch-45w',
          u_position: 1,
          face: 'front'
        },
        {
          instance_id: 'passive-sw-u2',
          blueprint_slug: 'hot-passive-switch-45w',
          u_position: 2,
          face: 'front'
        },
        // Front-to-rear blade on U4 + Rear-to-front noisy server on U5 -> THERMAL_AIRFLOW_CONFLICT & ACOUSTIC_NOISE_HIGH
        {
          instance_id: 'blade-f2r-u4',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 4,
          face: 'front'
        },
        {
          instance_id: 'srv-r2f-u5',
          blueprint_slug: 'noisy-1u-server-rear-intake',
          u_position: 5,
          face: 'front'
        },
        {
          instance_id: 'srv-r2f-u6',
          blueprint_slug: 'noisy-1u-server-rear-intake',
          u_position: 6,
          face: 'front'
        }
      ],
      cables: [
        // Cat5e cable on 2.5G link -> SPEED_MISMATCH
        {
          cable_id: 'cat5e-bottleneck',
          from: { instance_id: 'passive-sw-u1', port_id: 'eth1' },
          to: { instance_id: 'srv-r2f-u5', port_id: 'eth0' },
          cable_type: 'cat5e',
          vlan_id: 20,
          ip_cidr: '10.20.0.0/24'
        }
      ]
    });

    const scene = evaluateRackScene(project, testCatalog);
    const codes = new Set(scene.validation.issues.map((i) => i.code));

    expect(codes.has('SPEED_MISMATCH')).toBe(true);
    expect(codes.has('THERMAL_AIRFLOW_CONFLICT')).toBe(true);
    expect(codes.has('THERMAL_HOTSPOT_STACKING')).toBe(true);
    expect(codes.has('ACOUSTIC_NOISE_HIGH')).toBe(true);

    expect(scene.validation.mechanical_summary.airflow_profile).toBe(
      'mixed-conflict'
    );
    expect(
      scene.validation.mechanical_summary.combined_noise_db_a
    ).toBeGreaterThan(48.0);
    expect(
      scene.validation.mechanical_summary.total_thermal_btu_hr
    ).toBeGreaterThan(700);
  });

  it('guarantees zero 3D cable-to-cable interpenetration (>= 6.0mm centerline clearance) across dense mixed routes', () => {
    const project: RackProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Collision-Free 3D Cable Routing Verification',
      rack: {
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'open-frame'
      },
      mounted_devices: [
        {
          instance_id: 'pdu-u1',
          blueprint_slug: 'intellinet-10inch-pdu-4way',
          u_position: 1,
          face: 'rear'
        },
        {
          instance_id: 'carrier-u3',
          blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
          u_position: 3,
          face: 'front',
          children: [
            {
              instance_id: 'pve-node-01',
              blueprint_slug: 'lenovo-thinkcentre-m920q',
              slot_id: 'left-mini-pc-bay'
            },
            {
              instance_id: 'ks-01',
              blueprint_slug: 'keystone-rj45-cat6a-coupler',
              slot_id: 'keystone-1'
            },
            {
              instance_id: 'ks-02',
              blueprint_slug: 'keystone-rj45-cat6a-coupler',
              slot_id: 'keystone-2'
            }
          ]
        },
        {
          instance_id: 'blade-u6',
          blueprint_slug: 'poe-ai-cluster-blade-10inch',
          u_position: 6,
          face: 'front'
        },
        {
          instance_id: 'sw-u7',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 7,
          face: 'front'
        },
        {
          instance_id: 'sw-u8',
          blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
          u_position: 8,
          face: 'front'
        }
      ],
      cables: [
        {
          cable_id: 'patch-u8-u7-1',
          from: { instance_id: 'sw-u8', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'sw-u7', port_id: 'eth1', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'patch-u8-u7-2',
          from: { instance_id: 'sw-u8', port_id: 'eth2', face: 'front' },
          to: { instance_id: 'sw-u7', port_id: 'eth2', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'bridge-u8-u7-offset-1',
          from: { instance_id: 'sw-u8', port_id: 'eth7', face: 'front' },
          to: { instance_id: 'sw-u7', port_id: 'eth3', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'bridge-u8-u7-offset-2',
          from: { instance_id: 'sw-u8', port_id: 'eth8', face: 'front' },
          to: { instance_id: 'sw-u7', port_id: 'eth4', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'duct-u8-to-ks1',
          from: { instance_id: 'sw-u8', port_id: 'eth3', face: 'front' },
          to: { instance_id: 'ks-01', port_id: 'rj45', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'duct-u7-to-ks2',
          from: { instance_id: 'sw-u7', port_id: 'eth5', face: 'front' },
          to: { instance_id: 'ks-02', port_id: 'rj45', face: 'front' },
          cable_type: 'cat6a'
        },
        {
          cable_id: 'cross-u7-to-pve',
          from: { instance_id: 'sw-u7', port_id: 'eth6', face: 'front' },
          to: { instance_id: 'pve-node-01', port_id: 'eth0', face: 'rear' },
          cable_type: 'cat6a',
          preferred_portal_u: 5
        },
        {
          cable_id: 'pwr-pdu-to-sw7',
          from: { instance_id: 'pdu-u1', port_id: 'outlet1' },
          to: { instance_id: 'sw-u7', port_id: 'pwr_in', face: 'rear' },
          cable_type: 'power-schuko-c13'
        },
        {
          cable_id: 'pwr-pdu-to-sw8',
          from: { instance_id: 'pdu-u1', port_id: 'outlet2' },
          to: { instance_id: 'sw-u8', port_id: 'pwr_in', face: 'rear' },
          cable_type: 'power-schuko-c13'
        }
      ]
    });

    const scene = evaluateRackScene(project, catalog);
    expect(scene.cable_routes).toHaveLength(9);

    const railWidth =
      (scene.geometry.panel_width_mm - scene.geometry.aperture_width_mm) / 2;

    for (let i = 0; i < scene.cable_routes.length; i++) {
      const routeA = scene.cable_routes[i]!;
      const others = scene.cable_routes.slice(0, i);
      const minDist = computeMinSplineClearanceMm(routeA.spline_points, others);
      expect(minDist).toBeGreaterThanOrEqual(6.0);

      // Verify zero outward corner overshoot beyond waypoint bounding box
      const wpXs = routeA.waypoints.map((w) => w.x);
      const wpYs = routeA.waypoints.map((w) => w.y);
      const wpZs = routeA.waypoints.map((w) => w.z);
      const minWpX = Math.min(...wpXs) - 1e-3;
      const maxWpX = Math.max(...wpXs) + 1e-3;
      const minWpY = Math.min(...wpYs) - 1e-3;
      const maxWpY = Math.max(...wpYs) + 1e-3;
      const minWpZ = Math.min(...wpZs) - 1e-3;
      const maxWpZ = Math.max(...wpZs) + 1e-3;

      for (const pt of routeA.spline_points) {
        expect(pt.x).toBeGreaterThanOrEqual(minWpX);
        expect(pt.x).toBeLessThanOrEqual(maxWpX);
        expect(pt.y).toBeGreaterThanOrEqual(minWpY);
        expect(pt.y).toBeLessThanOrEqual(maxWpY);
        expect(pt.z).toBeGreaterThanOrEqual(minWpZ);
        expect(pt.z).toBeLessThanOrEqual(maxWpZ);

        // Verify zero penetration of the 4 EIA-310 vertical mounting rails
        const inLeftRail = pt.x < railWidth;
        const inRightRail = pt.x > scene.geometry.panel_width_mm - railWidth;
        const inFrontRailPlane = pt.z >= -1.0 && pt.z <= 4.0;
        const inRearRailPlane =
          pt.z >= scene.geometry.rail_depth_mm - 4.0 &&
          pt.z <= scene.geometry.rail_depth_mm + 1.0;
        expect((inLeftRail || inRightRail) && (inFrontRailPlane || inRearRailPlane)).toBe(false);
      }
    }
  });

  it('routes shortest-direct monotonically by default and honors explicit left-duct / right-duct routing_mode overrides', () => {
    const makeProject = (
      routingMode?: 'shortest-direct' | 'left-duct' | 'right-duct'
    ): RackProject =>
      RackProjectSchema.parse({
        schema_version: '1.0',
        project_name: 'Routing Mode Verification',
        rack: {
          standard: '10inch',
          u_height: 8,
          rail_depth_mm: 260,
          enclosure_type: 'open-frame'
        },
        mounted_devices: [
          {
            instance_id: 'sw-u1',
            blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
            u_position: 1,
            face: 'front'
          },
          {
            instance_id: 'sw-u8',
            blueprint_slug: 'ubiquiti-usw-pro-8-poe-10inch',
            u_position: 8,
            face: 'front'
          }
        ],
        cables: [
          {
            cable_id: 'test-cable',
            from: { instance_id: 'sw-u1', port_id: 'eth1', face: 'front' },
            to: { instance_id: 'sw-u8', port_id: 'eth2', face: 'front' },
            cable_type: 'cat6a',
            ...(routingMode ? { routing_mode: routingMode } : {})
          }
        ]
      });

    const directRoute = evaluateRackScene(makeProject(), catalog).cable_routes[0]!;
    const leftDuctRoute = evaluateRackScene(makeProject('left-duct'), catalog).cable_routes[0]!;
    const rightDuctRoute = evaluateRackScene(makeProject('right-duct'), catalog).cable_routes[0]!;

    // Shortest-direct is substantially shorter than side-duct detours and stays near the ports' X range
    expect(directRoute.raw_arc_length_mm).toBeLessThan(leftDuctRoute.raw_arc_length_mm);
    expect(directRoute.raw_arc_length_mm).toBeLessThan(rightDuctRoute.raw_arc_length_mm);
    expect(leftDuctRoute.assigned_ducts).toEqual(['FL']);
    expect(rightDuctRoute.assigned_ducts).toEqual(['FR']);
  });
});

