import {
  evaluateRackScene,
  serializeRackScene,
  type RackProjectInput,
} from '@rack-mcp/core-domain';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';
import { describe, expect, it } from 'vitest';
import {
  create10InchHomelabProjectInput,
  escapeHtml,
  evaluate10InchHomelabScene,
  generateBuildBookHtml,
} from '../src/index.js';

describe('generateBuildBookHtml (Printable A4/Letter Build Book Exporter)', () => {
  it('generates a complete, deterministic A4 Build Book HTML with KPIs, embedded CAD SVGs, slot map, patch checklist, 3D print queue, and BOM', () => {
    const scene = evaluate10InchHomelabScene();
    const html = generateBuildBookHtml(scene);
    const htmlAgain = generateBuildBookHtml(scene);

    // Deterministic output (identical across invocations)
    expect(html).toBe(htmlAgain);
    expect(html.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(html).toContain('</html>');

    // Default A4 print rules & .no-print control banner
    expect(html).toContain('@page { size: A4; margin: 12mm; }');
    expect(html).toContain('@media print');
    expect(html).toContain('.no-print');
    expect(html).toContain('page-break-after: always');
    expect(html).toContain('break-inside: avoid');

    // Section 1: Cover & Engineering KPIs
    expect(html).toContain('data-section="cover-kpis"');
    expect(html).toContain('8U 10-Inch Proxmox &amp; UniFi Homelab');
    expect(html).toContain('10&quot; Mini-Rack (10inch)');
    expect(html).toContain('Rail Depth 240 mm');
    expect(html).toContain('VALID · 0 Errors · 0 Warn');
    expect(html).toContain('BTU/h');
    expect(html).toContain('dBA');
    expect(html).toContain('CoG Y');
    expect(html).toContain('min typical');
    expect(html).toContain('€0.32/kWh');

    // Section 2: Embedded 2D Elevation & Z-Depth Cutaway SVG
    expect(html).toContain('data-section="cad-elevation"');
    expect(html).toContain('data-view="front-elevation"');
    expect(html).toContain('data-view="rear-elevation"');
    expect(html).toContain('data-view="side-cutaway"');

    // Section 3: Embedded 2D Wiring & Power/PoE Schematic SVG
    expect(html).toContain('data-section="wiring-schematic"');
    expect(html).toContain('data-section="power-poe-dag"');
    expect(html).toContain('data-section="port-to-port-schematic"');

    // Section 4: Rack Elevation Slot Map & Patching Checklist
    expect(html).toContain('data-section="slot-map-and-patching"');
    expect(html).toContain('pve-node-01');
    expect(html).toContain('data-patch-cable-id="patch-front-p1-sw1"');
    expect(html).toContain('patch-u7:p1');
    expect(html).toContain('sw-u8:eth1');
    expect(html).toContain('150 mm');
    expect(html).toContain('VLAN 900');
    expect(html).toContain('10.50.0.0/24');
    expect(html).toContain('ext-isp-wan');
    expect(html).toContain('ext-ap-eg');

    // Section 5: 3D-Print Queue & Procurement BOM
    expect(html).toContain('data-section="print-queue-and-bom"');
    expect(html).toContain('data-testid="buildbook-print-queue"');
    expect(html).toContain('3dprint-10inch-cover-panel-lines-1u');
    expect(html).toContain('3dprint-10inch-ucg-ultra-plus-3keystone');
    expect(html).toContain('3dprint-10inch-lenovo-tiny-plus-2keystone');
    expect(html).toContain('525 g');
    expect(html).toContain('Print face-down');
    expect(html).toContain('PETG/ASA');
    expect(html).toContain('data-testid="buildbook-hardware-bom"');
    expect(html).toContain('data-testid="buildbook-cable-bom"');
  });

  it('supports Letter pageSize, custom electricityPricePerKwhEur, include3DPrintQueue: false, and SerializedRackScene input', () => {
    const scene = evaluate10InchHomelabScene();
    const letterHtml = generateBuildBookHtml(scene, {
      pageSize: 'Letter',
      electricityPricePerKwhEur: 0.45,
      include3DPrintQueue: false,
    });

    expect(letterHtml).toContain('@page { size: Letter; margin: 12mm; }');
    expect(letterHtml).not.toContain('@page { size: A4;');
    expect(letterHtml).toContain('€0.45/kWh');
    expect(letterHtml).not.toContain('data-testid="buildbook-print-queue"');
    expect(letterHtml).toContain('data-testid="buildbook-hardware-bom"');

    // Also works seamlessly from SerializedRackScene (e.g., WebSocket / browser client)
    const fromSerialized = generateBuildBookHtml(serializeRackScene(scene));
    expect(fromSerialized).toBe(generateBuildBookHtml(scene));
  });

  it('escapes all user-controlled XSS payloads and avoids inline scripts or event handlers', () => {
    const baseProject = create10InchHomelabProjectInput();
    const evilProject: RackProjectInput = {
      ...baseProject,
      project_name: 'Lab <script>alert(1)</script> & "Test" \'X\'',
      mounted_devices: (baseProject.mounted_devices ?? []).map((d, idx) =>
        idx === 0
          ? {
              ...d,
              hostname: 'node-01 <script>alert(1)</script> <img src=x onerror=alert(1)>',
            }
          : d,
      ),
      cables: (baseProject.cables ?? []).map((c, idx) =>
        idx === 0
          ? {
              ...c,
              label: 'uplink <script>alert(1)</script> " onmouseover="alert(1)',
              ip_cidr: '10.0.0.1/24<script>alert(1)</script>',
            }
          : c,
      ),
      external_endpoints: (baseProject.external_endpoints ?? []).map((e, idx) =>
        idx === 0
          ? {
              ...e,
              label: 'Drop <script>alert(1)</script>',
              room_or_zone: 'Room <img src=x onerror=alert(1)>',
              notes: 'Note <script>alert(1)</script>',
            }
          : e,
      ),
    };

    const evilScene = evaluateRackScene(
      evilProject,
      defaultCatalogRegistry.toRecord(),
    );
    const html = generateBuildBookHtml(evilScene);

    expect(html.toLowerCase()).not.toContain('<script');
    expect(html.toLowerCase()).not.toContain('<img');
    expect(html).not.toContain('onclick=');
    // Any injected attribute text must only appear inside escaped entity strings, never inside an unescaped HTML tag
    expect(html).not.toMatch(/<[a-z][^>]*\bon(?:error|click|mouseover|load)\s*=/i);
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(html).toContain('&quot; onmouseover=&quot;alert(1)');

    expect(escapeHtml(`a & b <c> "d" 'e'`)).toBe(
      'a &amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39;',
    );
  });

  it('enforces Zero-Egress & strict CSP by omitting all external HTTP/HTTPS URLs from styles, fonts, scripts, and links', () => {
    const scene = evaluate10InchHomelabScene();
    const html = generateBuildBookHtml(scene);

    expect(html.toLowerCase()).not.toContain('https://');
    expect(html.toLowerCase()).not.toContain('<link');
    expect(html.toLowerCase()).not.toContain('@import');
    expect(html.toLowerCase()).not.toContain('<script');

    // Only http:// allowed is the standard SVG XML namespace
    const httpMatches = html.match(/http:\/\/[^\s"'<>]+/gi) ?? [];
    for (const match of httpMatches) {
      expect(match).toBe('http://www.w3.org/2000/svg');
    }
  });

  it('renders invalid/colliding diagnostics and empty rack scenes cleanly without NaN', () => {
    const collidingInput = create10InchHomelabProjectInput();
    const pduDevice = collidingInput.mounted_devices!.find(
      (d) => d.instance_id === 'pdu-u2-rear',
    )!;
    pduDevice.u_position = 4;

    const collidingScene = evaluateRackScene(
      collidingInput,
      defaultCatalogRegistry.toRecord(),
    );
    const collidingHtml = generateBuildBookHtml(collidingScene);
    expect(collidingHtml).toContain('INVALID');
    expect(collidingHtml).toContain('PLUG_CLEARANCE_COLLISION');
    expect(collidingHtml).not.toContain('NaN');

    const emptyProject: RackProjectInput = {
      schema_version: '1.0',
      project_name: 'Empty 6U 19-Inch Frame',
      rack: {
        standard: '19inch',
        u_height: 6,
        rail_depth_mm: 450,
        enclosure_type: 'open-frame',
        front_door_clearance_mm: 40,
        rear_clearance_mm: 40,
      },
      mounted_devices: [],
      cables: [],
      external_endpoints: [],
    };
    const emptyScene = evaluateRackScene(
      emptyProject,
      defaultCatalogRegistry.toRecord(),
    );
    const emptyHtml = generateBuildBookHtml(emptyScene);
    expect(emptyHtml).toContain('Empty 6U 19-Inch Frame');
    expect(emptyHtml).toContain('No internal patch or power cables configured');
    expect(emptyHtml).toContain('No 3D-printed carriers or cover panels mounted');
    expect(emptyHtml).not.toContain('NaN');
  });

  it('includes 19-inch split-STL orientation advice, multi-U slot spans, and escapes XSS in validation diagnostics', () => {
    const project19: RackProjectInput = {
      schema_version: '1.0',
      project_name: '19-Inch Lab',
      rack: {
        standard: '19inch',
        u_height: 6,
        rail_depth_mm: 450,
        enclosure_type: 'open-frame',
        front_door_clearance_mm: 45,
        rear_clearance_mm: 40,
      },
      mounted_devices: [
        {
          instance_id: 'cover-19-2u',
          blueprint_slug: '3dprint-19inch-cover-panel-hex-2u',
          u_position: 1,
          face: 'front',
          children: [],
        },
        {
          instance_id: 'evil<script>alert(1)</script>',
          blueprint_slug: '3dprint-19inch-cover-panel-lines-1u',
          u_position: 2, // intentionally collides with U1-U2 hex cover panel
          face: 'front',
          children: [],
        },
      ],
      cables: [],
      external_endpoints: [],
    };

    const scene = evaluateRackScene(
      project19,
      defaultCatalogRegistry.toRecord(),
    );
    const html = generateBuildBookHtml(scene);

    expect(html).toContain('[U1–U2]');
    expect(html).toContain('continued from U1');
    expect(html).toContain('require left/right split STL export');
    expect(html).toContain('INVALID');
    expect(html).toContain('CHASSIS_COLLISION');
    expect(html.toLowerCase()).not.toContain('<script');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
  });
});
