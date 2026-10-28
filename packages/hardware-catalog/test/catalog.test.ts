import { describe, expect, it } from 'vitest';
import {
  CatalogRegistry,
  getAllBlueprints,
  getBlueprintBySlug,
  searchCatalog,
  validateBlueprintIntegrity,
} from '../src/index.js';
import { validateCatalogDirectory } from '../src/validate-cli.js';

describe('@rack-mcp/hardware-catalog', () => {
  it('validates all 60 YAML hardware blueprints on disk with zero schema, port, or slot errors', () => {
    const report = validateCatalogDirectory();
    expect(report.totalFiles).toBe(60);
    expect(report.issues).toEqual([]);
    expect(report.validFiles).toBe(60);
  });

  it('loads all 60 blueprints in CatalogRegistry with expanded port_groups', () => {
    const all = getAllBlueprints();
    expect(all.length).toBe(60);

    const flex25g = getBlueprintBySlug('ubiquiti-usw-flex-2-5g-8-poe');
    expect(flex25g).toBeDefined();
    // 8 expanded eth1..eth8 + 1 sfp1 + 1 eth9 + 1 pwr_in = 11 ports
    expect(flex25g!.ports.length).toBe(11);
    expect(flex25g!.ports.some((p) => p.port_id === 'eth8')).toBe(true);

    const proMax24 = getBlueprintBySlug('ubiquiti-usw-pro-max-24-poe');
    expect(proMax24).toBeDefined();
    // 24 expanded eth1..eth24 + 2 SFP+ + 1 AC in = 27 ports
    expect(proMax24!.ports.length).toBe(27);

    const deskpiPatch = getBlueprintBySlug('deskpi-10inch-patch-panel-12port');
    expect(deskpiPatch).toBeDefined();
    expect(deskpiPatch!.ports.length).toBe(12);
    expect(deskpiPatch!.ports.every((p) => p.is_passthrough_coupler)).toBe(true);

    const patch24 = getBlueprintBySlug('generic-19inch-patch-panel-24port-cat6a');
    expect(patch24).toBeDefined();
    expect(patch24!.ports.length).toBe(24);
    expect(patch24!.ports.every((p) => p.is_passthrough_coupler)).toBe(true);

    const unasPro = getBlueprintBySlug('ubiquiti-unas-pro-2u');
    expect(unasPro).toBeDefined();
    expect(unasPro!.category).toBe('nas');

    const crs310 = getBlueprintBySlug('mikrotik-crs310-8g-plus-2s-plus-in');
    expect(crs310).toBeDefined();
    expect(crs310!.ports.length).toBe(11);

    const jetkvmCarrier = getBlueprintBySlug('3dprint-10inch-rpi5-jetkvm-2keystone');
    expect(jetkvmCarrier).toBeDefined();
    expect(jetkvmCarrier!.slots.length).toBe(4);
  });

  it('supports searchCatalog filtering by query, form_factor/mount_type, category, max_depth_mm, min_poe_budget_watts, and accepted_slot_type', () => {
    // Full-text query
    const ubiquitiHits = searchCatalog({ query: 'ubiquiti poe' });
    expect(ubiquitiHits.map((b) => b.slug)).toEqual(
      expect.arrayContaining([
        'ubiquiti-usw-flex-2-5g-8-poe',
        'ubiquiti-usw-lite-8-poe',
        'ubiquiti-usw-pro-max-24-poe',
      ]),
    );

    // Filter by 10inch form factor + category + max depth
    const shallow10InchSwitches = searchCatalog({
      mount_type: '10inch',
      category: 'switch',
      max_depth_mm: 210,
    });
    expect(shallow10InchSwitches.map((b) => b.slug)).toEqual(
      expect.arrayContaining([
        'ubiquiti-usw-flex-2-5g-8-poe',
        'ubiquiti-usw-lite-8-poe',
        'mikrotik-crs310-8g-plus-2s-plus-in',
        'tp-link-tl-sg2210mp',
      ]),
    );

    // Filter by min_poe_budget_watts
    const highPoeSwitches = searchCatalog({ min_poe_budget_watts: 180 });
    expect(highPoeSwitches.map((b) => b.slug).sort()).toEqual([
      'ubiquiti-udm-se',
      'ubiquiti-usw-flex-2-5g-8-poe',
      'ubiquiti-usw-pro-max-16-poe-rack-1u',
      'ubiquiti-usw-pro-max-24-poe',
    ]);

    // Filter by accepted_slot_type
    const miniPcCompatible = searchCatalog({ accepted_slot_type: 'mini-pc-1liter' });
    expect(miniPcCompatible.map((b) => b.slug).sort()).toEqual([
      '3dprint-10inch-lenovo-tiny-plus-2keystone',
      '3dprint-19inch-dual-minipc-poe-carrier-1u',
      '3dprint-19inch-triple-mini-pc-carrier',
      'dell-optiplex-7010-micro',
      'hp-elitedesk-800-g6-mini',
      'lenovo-thinkcentre-m920q',
      'zimaboard-832-2-5g-router-nas',
    ]);

    const sixInchGear = searchCatalog({ mount_type: '6inch' });
    expect(sixInchGear.map((b) => b.slug).sort()).toEqual([
      '3dprint-6inch-rpi5-plus-keystone-carrier-1u',
      'generic-6inch-brush-panel-1u',
      'generic-6inch-patch-panel-6port',
      'generic-6inch-usb-pd-pdu-4port',
      'gl-inet-mt3000-beryl-ax-6inch',
      'ubiquiti-usw-flex-mini-6inch',
    ]);

    const jetkvmCompatible = searchCatalog({ accepted_slot_type: 'jetkvm-bay' });
    expect(jetkvmCompatible.map((b) => b.slug).sort()).toEqual([
      '3dprint-10inch-rpi5-jetkvm-2keystone',
      'jetkvm-smart-ip-kvm',
    ]);
  });

  it('detects out-of-bounds ports, overlapping ports, and out-of-aperture carrier slots', () => {
    const baseCarrier = getBlueprintBySlug('3dprint-10inch-lenovo-tiny-plus-2keystone')!;

    // 1. Out-of-aperture slot on a 10-inch carrier (aperture max is 238.125 mm)
    const badSlotCarrier = {
      ...baseCarrier,
      slug: 'bad-slot-carrier',
      slots: [
        ...baseCarrier.slots,
        {
          slot_id: 'overflow-slot',
          accepted_slot_type: 'standard-keystone',
          offset_mm: { x: 230.0, y: 11.0, z: 0.0 },
          max_dimensions_mm: { width: 16.5, height: 22.0, depth: 35.0 },
        },
      ],
    };

    const resSlot = validateBlueprintIntegrity(badSlotCarrier);
    expect(resSlot.valid).toBe(false);
    expect(resSlot.issues.map((i) => i.code)).toContain('SLOT_OUT_OF_APERTURE');
    expect(resSlot.issues.map((i) => i.code)).toContain('SLOT_OVERLAP');

    // 2. Overlapping ports on a device
    const baseSwitch = getBlueprintBySlug('ubiquiti-usw-lite-8-poe')!;
    const badSwitch = {
      ...baseSwitch,
      slug: 'bad-overlap-switch',
      port_groups: [],
      ports: [
        {
          port_id: 'p1',
          label: '1',
          face: 'front' as const,
          connector_type: 'rj45' as const,
          direction: 'bidirectional' as const,
          capabilities: ['1000base-t' as const],
          coordinates: { x_mm: 20, y_mm: 15, orientation: 'upright' as const },
        },
        {
          port_id: 'p2',
          label: '2',
          face: 'front' as const,
          connector_type: 'rj45' as const,
          direction: 'bidirectional' as const,
          capabilities: ['1000base-t' as const],
          coordinates: { x_mm: 22, y_mm: 15, orientation: 'upright' as const },
        },
      ],
    };

    const resPort = validateBlueprintIntegrity(badSwitch);
    expect(resPort.valid).toBe(false);
    expect(resPort.issues.map((i) => i.code)).toContain('PORT_OVERLAP');

    // 3. Registering a valid custom blueprint succeeds
    const registry = new CatalogRegistry();
    registry.registerCustomBlueprint({
      ...baseSwitch,
      slug: 'custom-homelab-switch-1u',
    });
    expect(registry.getBlueprintBySlug('custom-homelab-switch-1u')).toBeDefined();
  });
});
