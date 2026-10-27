import { describe, expect, it } from 'vitest';
import {
  COMMERCIAL_CABLE_LENGTH_BINS_MM,
  DELTA_Z_PLUG_MM,
  EIA_310_10_INCH_SPEC,
  EIA_310_19_INCH_SPEC,
  EIA_310_6_INCH_SPEC,
  getPlugClearanceMm,
  type HardwareBlueprintInput,
  HardwareBlueprintSchema,
  MCP_TOOL_DEFINITIONS,
  MM_PER_U,
  normalizeHardwareBlueprint,
  RACK_MCP_SERVER_NAME,
  RackProjectSchema,
  U_HOLE_OFFSETS_MM
} from '../src/index.js';

describe('Physical Constants & Mechanical Standards', () => {
  it('defines exact EIA-310-D and homelab form factor dimensions in mm', () => {
    expect(MM_PER_U).toBe(44.45);
    expect(U_HOLE_OFFSETS_MM).toEqual([6.35, 22.225, 38.1]);

    expect(EIA_310_19_INCH_SPEC.panel_width_mm).toBe(482.6);
    expect(EIA_310_19_INCH_SPEC.aperture_width_mm).toBe(450.85);
    expect(EIA_310_19_INCH_SPEC.hole_center_to_center_mm).toBe(465.1);
    expect(EIA_310_19_INCH_SPEC.left_aperture_offset_mm).toBe(15.875);
    expect(EIA_310_19_INCH_SPEC.left_hole_center_x_mm).toBe(8.75);

    expect(EIA_310_10_INCH_SPEC.panel_width_mm).toBe(254.0);
    expect(EIA_310_10_INCH_SPEC.aperture_width_mm).toBe(222.25);
    expect(EIA_310_10_INCH_SPEC.hole_center_to_center_mm).toBe(236.5);

    expect(EIA_310_6_INCH_SPEC.panel_width_mm).toBe(152.4);
    expect(EIA_310_6_INCH_SPEC.aperture_width_mm).toBe(120.65);
    expect(EIA_310_6_INCH_SPEC.hole_center_to_center_mm).toBe(134.9);
  });

  it('defines straight and angled plug clearance table (delta_Z_plug)', () => {
    expect(DELTA_Z_PLUG_MM['rj45']).toEqual({ straight_mm: 35, angled_mm: 20 });
    expect(DELTA_Z_PLUG_MM['sfp-plus']).toEqual({
      straight_mm: 48,
      angled_mm: null
    });
    expect(DELTA_Z_PLUG_MM['iec-c13']).toEqual({
      straight_mm: 55,
      angled_mm: 30
    });
    expect(DELTA_Z_PLUG_MM['iec-c14']).toEqual({
      straight_mm: 55,
      angled_mm: 30
    });
    expect(DELTA_Z_PLUG_MM['schuko-cee7']).toEqual({
      straight_mm: 65,
      angled_mm: 38
    });
    expect(DELTA_Z_PLUG_MM['dc-5525']).toEqual({
      straight_mm: 32,
      angled_mm: 18
    });
    expect(DELTA_Z_PLUG_MM['usb-c']).toEqual({
      straight_mm: 32,
      angled_mm: 18
    });

    expect(getPlugClearanceMm('iec-c14', 'power-schuko-c13')).toBe(55);
    expect(getPlugClearanceMm('iec-c14', 'power-schuko-c13-angled')).toBe(30);
    expect(getPlugClearanceMm('rj45', 'cat6a')).toBe(35);
    expect(getPlugClearanceMm('rj45', 'cat6a-angled')).toBe(20);
    expect(getPlugClearanceMm('sfp-plus', 'sfp-plus-dac-angled')).toBe(48);

    expect(COMMERCIAL_CABLE_LENGTH_BINS_MM).toEqual([
      150, 250, 300, 500, 750, 1000, 1500, 2000, 3000
    ]);
  });
});

describe('HardwareBlueprintSchema & Port Matrix Expansion', () => {
  const switchBlueprintInput: HardwareBlueprintInput = {
    slug: 'ubiquiti-usw-flex-2-5g-8-poe',
    manufacturer: 'Ubiquiti',
    model: 'USW-Flex-2.5G-8-PoE',
    category: 'switch',
    mount_type: 'rackmount-10',
    geometry: {
      u_height: 1.0,
      width_mm: 212.9,
      height_mm: 43.7,
      depth_mm: 135.0,
      ear_mount_style: 'included-10inch-ears',
      front_protrusion_mm: 5.0,
      rear_protrusion_mm: 0.0,
      weight_grams: 1150
    },
    power_and_thermal: {
      electrical_role: 'pse-switch',
      idle_watts: 12,
      max_system_watts: 25,
      poe_budget_watts: 196,
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
        port_id: 'uplink_10g',
        label: '10G SFP+/RJ45 Combo',
        face: 'front',
        connector_type: 'sfp-plus',
        direction: 'bidirectional',
        capabilities: ['10gbase-sr', '10gbase-dac'],
        coordinates: { x_mm: 190.0, y_mm: 14.0, orientation: 'upright' }
      },
      {
        port_id: 'pwr_in',
        label: 'AC/DC Input',
        face: 'rear',
        connector_type: 'iec-c14',
        direction: 'input',
        capabilities: ['ac-mains'],
        coordinates: { x_mm: 30.0, y_mm: 18.0, orientation: 'upright' }
      }
    ],
    visuals: {
      chassis_color_hex: '#E5E7EB',
      material_preset: 'coated-aluminum',
      has_oled_display: false,
      stl_mesh_path: null
    },
    printable_metadata: null
  };

  it('expands an 8-port switch port_groups matrix into flat PortDefinition objects with exact (x_mm, y_mm)', () => {
    const normalized = normalizeHardwareBlueprint(switchBlueprintInput);

    // 8 expanded eth1..eth8 ports + 2 explicit ports = 10 total ports
    expect(normalized.ports).toHaveLength(10);

    const eth1 = normalized.ports.find((p) => p.port_id === 'eth1');
    const eth4 = normalized.ports.find((p) => p.port_id === 'eth4');
    const eth8 = normalized.ports.find((p) => p.port_id === 'eth8');
    const uplink = normalized.ports.find((p) => p.port_id === 'uplink_10g');
    const pwrIn = normalized.ports.find((p) => p.port_id === 'pwr_in');

    expect(eth1).toBeDefined();
    expect(eth1?.label).toBe('Port 1');
    expect(eth1?.coordinates).toEqual({
      x_mm: 45.0,
      y_mm: 14.0,
      orientation: 'upright'
    });

    expect(eth4?.coordinates.x_mm).toBeCloseTo(45.0 + 3 * 16.5, 4);
    expect(eth8?.coordinates.x_mm).toBeCloseTo(45.0 + 7 * 16.5, 4);
    expect(eth8?.capabilities).toEqual(['2500base-t', 'poe-out-bt-type3']);

    expect(uplink?.connector_type).toBe('sfp-plus');
    expect(pwrIn?.face).toBe('rear');

    // Calling normalizeHardwareBlueprint again is idempotent
    const reNormalized = normalizeHardwareBlueprint(normalized);
    expect(reNormalized.ports).toHaveLength(10);
  });

  it('expands a 2D multi-row port_groups grid accurately', () => {
    const patchPanel24 = normalizeHardwareBlueprint({
      slug: 'generic-24port-patch-panel',
      manufacturer: 'Generic',
      model: 'PP-24-1U',
      category: 'patch-panel',
      mount_type: 'rackmount-19',
      geometry: {
        u_height: 1,
        width_mm: 482.6,
        height_mm: 44.0,
        depth_mm: 35.0
      },
      power_and_thermal: {
        electrical_role: 'passive'
      },
      port_groups: [
        {
          id_prefix: 'p',
          label_prefix: 'Patch ',
          start_index: 1,
          count: 24,
          face: 'front',
          connector_type: 'rj45',
          direction: 'bidirectional',
          grid: {
            origin_x_mm: 30.0,
            origin_y_mm: 10.0,
            columns: 12,
            rows: 2,
            pitch_x_mm: 18.0,
            pitch_y_mm: 16.0
          }
        }
      ]
    });

    expect(patchPanel24.ports).toHaveLength(24);
    // p1 is col 0, row 0
    expect(patchPanel24.ports[0]?.coordinates).toEqual({
      x_mm: 30.0,
      y_mm: 10.0,
      orientation: 'upright'
    });
    // p13 is col 0, row 1
    expect(patchPanel24.ports[12]?.port_id).toBe('p13');
    expect(patchPanel24.ports[12]?.coordinates).toEqual({
      x_mm: 30.0,
      y_mm: 26.0,
      orientation: 'upright'
    });
  });

  it('validates RackProjectSchema with nested children and cables', () => {
    const parsedProject = RackProjectSchema.parse({
      schema_version: '1.0',
      project_name: 'Mini-Lab Cluster',
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
            }
          ]
        }
      ],
      cables: [
        {
          cable_id: 'cab-eth-01',
          from: { instance_id: 'carrier-u3', port_id: 'eth1', face: 'front' },
          to: { instance_id: 'pve-node-01', port_id: 'eth0', face: 'rear' },
          cable_type: 'cat6a',
          color_hex: '#3B82F6',
          label: 'PVE01 Trunk',
          preferred_portal_u: 2
        }
      ]
    });

    expect(parsedProject.project_name).toBe('Mini-Lab Cluster');
    expect(parsedProject.mounted_devices[0]?.children).toHaveLength(1);
    expect(parsedProject.cables[0]?.preferred_portal_u).toBe(2);
    expect(() =>
      HardwareBlueprintSchema.parse({
        ...switchBlueprintInput,
        slug: 'INVALID_UPPERCASE_SLUG'
      })
    ).toThrow();
  });

  it('enforces strict enums on CableTypeSchema, PortCapabilitySchema, and provides MCP/WebMCP tool annotations', () => {
    expect(RACK_MCP_SERVER_NAME).toBe('rack_architect_mcp');
    expect(MCP_TOOL_DEFINITIONS.search_catalog.annotations.readOnlyHint).toBe(
      true
    );
    expect(
      MCP_TOOL_DEFINITIONS.get_device_blueprint.annotations.readOnlyHint
    ).toBe(true);
    expect(MCP_TOOL_DEFINITIONS.validate_rack.annotations.readOnlyHint).toBe(
      true
    );
    expect(MCP_TOOL_DEFINITIONS.mount_equipment.annotations.readOnlyHint).toBe(
      false
    );
    expect(
      MCP_TOOL_DEFINITIONS.init_rack.annotations.consequentialHint
    ).toBe(true);

    // Reject unknown/arbitrary cable_type strings (no z.string() union fallback)
    expect(() =>
      RackProjectSchema.parse({
        schema_version: '1.0',
        project_name: 'Invalid Cable Test',
        rack: { standard: '10inch', u_height: 4, rail_depth_mm: 200 },
        mounted_devices: [],
        cables: [
          {
            cable_id: 'c1',
            from: { instance_id: 'a', port_id: 'p1' },
            to: { instance_id: 'b', port_id: 'p2' },
            cable_type: 'unknown-vibecode-cable'
          }
        ]
      })
    ).toThrow();
  });
});
