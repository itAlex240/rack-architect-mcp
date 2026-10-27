import { mkdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EIA_310_SPECS, evaluateRackScene } from '@rack-mcp/core-domain';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';
import { stringify as stringifyYaml } from 'yaml';
import { describe, expect, it } from 'vitest';
import {
  create10InchHomelabProjectInput,
  evaluate10InchHomelabScene,
  generateBomMarkdown,
  generateCarrierOpenScad,
  generateCarrierStl,
  generateElevationSvg,
  generateGlbBinary,
  generateProjectPrintableCarriers,
  generateWiringSchematicSvg,
} from '../src/index.js';

describe('@rack-mcp/exporters & 8U 10-Inch Homelab Reference Scenario (CAD Upgrade)', () => {
  it('validates the 8U 10-Inch Homelab reference scenario and verifies sub-module aperture & port geometry precision', () => {
    const scene = evaluate10InchHomelabScene();
    expect(scene.validation.issues).toEqual([]);
    expect(scene.validation.status).toBe('VALID');
    expect(scene.validation.is_valid).toBe(true);
    expect(scene.validation.error_count).toBe(0);

    // 8 rackmount units + 10 child sub-modules (1 UCG-Max + 2 Lenovo M920q + 7 Keystones) = 18 devices
    expect(scene.geometry.devices.length).toBe(18);
    // 18 cables including 5 Front-to-Front patch, 1 Cross-Face U6 Brush Portal cable, and 12 Rear-to-Rear power/LAN cables
    expect(scene.cable_routes.length).toBe(18);

    // Verify all child sub-modules lie 100% within the 10-inch usable aperture [15.875 .. 238.125 mm]
    const spec = EIA_310_SPECS['10inch'];
    const apertureMinX = spec.X_aperture_min;
    const apertureMaxX = spec.X_aperture_min + spec.W_aperture;
    for (const dev of scene.geometry.devices) {
      if (dev.mount_target === 'carrier-slot') {
        expect(dev.chassis_box.min.x).toBeGreaterThanOrEqual(apertureMinX);
        expect(dev.chassis_box.max.x).toBeLessThanOrEqual(apertureMaxX);
      }
      // Verify all ports sit strictly within their device's horizontal and vertical bounds
      for (const port of dev.ports) {
        expect(port.world_position.x).toBeGreaterThan(dev.chassis_box.min.x);
        expect(port.world_position.x).toBeLessThan(dev.chassis_box.max.x);
        expect(port.world_position.y).toBeGreaterThan(dev.chassis_box.min.y);
        expect(port.world_position.y).toBeLessThan(dev.chassis_box.max.y);
      }
    }

    // Adjacent U7 -> U8 front patch cables should recommend 150mm (0.15m) commercial bins
    const frontPatch = scene.cable_routes.find(
      (r) => r.cable_id === 'patch-front-p1-sw1',
    );
    expect(frontPatch).toBeDefined();
    expect(frontPatch!.recommended_commercial_mm).toBe(150);
  });

  it('generates CAD-grade synchronized 2D Elevation & Depth Cutaway SVG with PortAnchorRegistry attachment and Brush-Panel Grommet Portal', () => {
    const scene = evaluate10InchHomelabScene();
    const svg = generateElevationSvg(scene);

    expect(svg.startsWith('<svg ')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('data-view="front-elevation"');
    expect(svg).toContain('data-view="front-equipment-schedule"');
    expect(svg).toContain('data-view="front-callout-legend"');
    expect(svg).toContain('data-view="rear-elevation"');
    expect(svg).toContain('data-view="side-cutaway"');
    expect(svg).toContain('data-connector="rj45"');
    expect(svg).toContain('data-connector="sfp-plus"');
    expect(svg).toContain('data-connector="iec-c13"');
    expect(svg).toContain('data-connector="schuko-cee7"');
    expect(svg).toContain('data-instance-id="ups-u1"');
    expect(svg).toContain('data-instance-id="pve-node-01"');
    expect(svg).toContain('data-cable-id="patch-front-p1-sw1"');
    expect(svg).toContain('data-cable-id="pwr-ups-to-pdu"');
    expect(svg).toContain('data-cable-id="cross-sw6-to-ucg-lan2"');
    expect(svg).toContain('data-portal-grommet="PORTAL:U6:front:cross-sw6-to-ucg-lan2"');
    expect(svg).toContain('data-portal-grommet="PORTAL:U6:rear:cross-sw6-to-ucg-lan2"');
    expect(svg).toContain('●-&gt;REAR');
    expect(svg).toContain('FRONT-&gt;●');
    expect(svg).toContain('mm clear</text>');

    // Verify every cable path (17 Same-Face + 2 Cross-Face portal halves = 19 paths) starts at `M startX startY` and ends at `L endX endY` matching its PortAnchorRegistry coordinates
    const cablePathMatches = [
      ...svg.matchAll(
        /<path data-cable-id="([^"]+)" data-cable-view="(?:front|rear)" data-start-anchor="([^"]+)" data-end-anchor="([^"]+)" data-start-xy="([^"]+)" data-end-xy="([^"]+)" d="M ([^ ]+) ([^ ]+) [^"]*L ([^ ]+) ([^"]+)"/g,
      ),
    ];
    expect(cablePathMatches.length).toBe(19);
    for (const match of cablePathMatches) {
      const startXY = match[4]!;
      const endXY = match[5]!;
      const pathStart = `${match[6]},${match[7]}`;
      const pathEnd = `${match[8]},${match[9]}`;
      expect(pathStart).toBe(startXY);
      expect(pathEnd).toBe(endXY);
    }

    // Verify every Side-Cutaway cable path (18 cables) also starts and ends at its exact Z-Y port coordinates
    const sideCableMatches = [
      ...svg.matchAll(
        /<path data-cable-id="([^"]+)" data-cable-view="side" data-start-xy="([^"]+)" data-end-xy="([^"]+)" d="M ([^ ]+) ([^ ]+) [^"]*L ([^ ]+) ([^"]+)"/g,
      ),
    ];
    expect(sideCableMatches.length).toBe(18);
    for (const match of sideCableMatches) {
      expect(`${match[4]},${match[5]}`).toBe(match[2]!);
      expect(`${match[6]},${match[7]}`).toBe(match[3]!);
    }

    // Verify red collision callouts on a deliberately colliding rack
    const collidingInput = create10InchHomelabProjectInput();
    collidingInput.rack.rail_depth_mm = 250;
    const pduDevice = collidingInput.mounted_devices!.find(
      (d) => d.instance_id === 'pdu-u2-rear',
    )!;
    pduDevice.u_position = 4;

    const collidingScene = evaluateRackScene(
      collidingInput,
      defaultCatalogRegistry.toRecord(),
    );
    expect(collidingScene.validation.is_valid).toBe(false);
    const collidingSvg = generateElevationSvg(collidingScene);
    expect(collidingSvg).toContain('data-collision-code="PLUG_CLEARANCE_COLLISION"');
    expect(collidingSvg).toContain('PLUG COLLISION');
  });

  it('generates 2D Technical Wiring & Power Schematic SVG with guaranteed Port-Pin attachment (pinMap) and 16px Multi-Track Router', () => {
    const scene = evaluate10InchHomelabScene();
    const svg = generateWiringSchematicSvg(scene);

    expect(svg.startsWith('<svg ')).toBe(true);
    expect(svg.endsWith('</svg>')).toBe(true);
    expect(svg).toContain('data-section="power-poe-dag"');
    expect(svg).toContain('TIER 1: MAINS / UPS BACKUP');
    expect(svg).toContain('TIER 2: DISTRIBUTION (PDU &amp; PoE PSE)');
    expect(svg).toContain('TIER 3: ACTIVE CONSUMERS &amp; PoE PDs');
    expect(svg).toContain('data-section="port-to-port-schematic"');
    expect(svg).toContain('data-track-index="0"');
    expect(svg).toContain('data-track-index="17"');
    expect(svg).toContain('PoE Budget:');
    expect(svg).toContain('UPS Load:');
    expect(svg).toContain('patch-front-p1-sw1 | 0.15m Cat6A');

    // Verify every schematic cable path starts at `M startPin.x startPin.y` and ends at `L endPin.x endPin.y`
    const schematicCableMatches = [
      ...svg.matchAll(
        /<g data-schematic-cable="([^"]+)" data-track-index="[^"]+" data-channel-x="[^"]+" data-start-pin="([^"]+)" data-end-pin="([^"]+)"[^>]*>\s*<path d="M ([^ ]+) ([^ ]+) [^"]*L ([^ ]+) ([^"]+)"/g,
      ),
    ];
    expect(schematicCableMatches.length).toBe(18);
    for (const match of schematicCableMatches) {
      const startPin = match[2]!;
      const endPin = match[3]!;
      const pathStart = `${match[4]},${match[5]}`;
      const pathEnd = `${match[6]},${match[7]}`;
      expect(pathStart).toBe(startPin);
      expect(pathEnd).toBe(endPin);
    }
  });

  it('generates 5-section BOM & Assembly Guide Markdown with 3D print queue and aggregated cable shopping list', () => {
    const scene = evaluate10InchHomelabScene();
    const bom = generateBomMarkdown(scene);

    expect(bom).toContain('## 1. Project & Validation Summary');
    expect(bom).toContain('## 2. Commercial Hardware BOM');
    expect(bom).toContain('## 3. 3D Print Queue (Fabrication List)');
    expect(bom).toContain('## 4. Aggregated Cable Shopping List');
    expect(bom).toContain('## 5. Step-by-Step Assembly & Patching Checklist');
    expect(bom).toContain('`3dprint-10inch-ucg-ultra-plus-3keystone`');
    expect(bom).toContain('`3dprint-10inch-lenovo-tiny-plus-2keystone`');
    expect(bom).toContain('**Total Estimated 3D Filament Required:** `480 g`');
  });

  it('generates valid binary glTF 2.0 (.glb) in meter scale with solid TRIANGLES (mode: 4) PTF tubes, boots, raised ports, and glass door', () => {
    const scene = evaluate10InchHomelabScene();
    const glb = generateGlbBinary(scene);

    expect(glb.byteLength).toBeGreaterThan(4096);
    const view = new DataView(glb.buffer, glb.byteOffset, glb.byteLength);

    expect(view.getUint32(0, true)).toBe(0x46546c67); // "glTF"
    expect(view.getUint32(4, true)).toBe(2);
    expect(view.getUint32(8, true)).toBe(glb.byteLength);

    const jsonChunkLength = view.getUint32(12, true);
    expect(view.getUint32(16, true)).toBe(0x4e4f534a); // "JSON"

    const jsonBytes = glb.subarray(20, 20 + jsonChunkLength);
    const jsonStr = new TextDecoder().decode(jsonBytes).trim();
    const gltf = JSON.parse(jsonStr) as {
      asset: { version: string };
      nodes: Array<{ name: string; extras?: Record<string, unknown> }>;
      meshes: Array<{
        name: string;
        primitives: Array<{ mode: number; attributes: { POSITION: number } }>;
      }>;
      materials: Array<{ name: string; alphaMode?: string }>;
      accessors: Array<{ min?: number[]; max?: number[] }>;
    };

    expect(gltf.asset.version).toBe('2.0');

    // Verify every single primitive in the GLB is mode: 4 (TRIANGLES) and NEVER mode: 3 (LINE_STRIP)
    for (const mesh of gltf.meshes) {
      for (const prim of mesh.primitives) {
        expect(prim.mode).toBe(4);
      }
    }

    // Verify meter scale: 10-inch rack panel width is 0.254m
    const rackFrameNode = gltf.nodes.find((n) => n.name === 'RackFrame');
    expect(rackFrameNode).toBeDefined();
    expect(rackFrameNode!.extras?.['panel_width_m']).toBe(0.254);

    // Verify node taxonomy: RackFrame, Device_*, SubDevice_*, Port_*, Cable_*, CableBootStart_*
    const nodeNames = gltf.nodes.map((n) => n.name);
    expect(nodeNames).toContain('RackFrame');
    expect(nodeNames).toContain('Device_ups-u1');
    expect(nodeNames).toContain('Device_sw-u8');
    expect(nodeNames).toContain('SubDevice_pve-node-01');
    expect(nodeNames).toContain('SubDevice_ucg-max');
    expect(nodeNames).toContain('Port_sw-u8_eth1');
    expect(nodeNames).toContain('Cable_patch-front-p1-sw1');
    expect(nodeNames).toContain('CableBootStart_patch-front-p1-sw1');
    expect(nodeNames).toContain('RackGlassFrontDoorMesh');

    const glassMat = gltf.materials.find(
      (m) => m.name === 'RackGlassFrontDoor',
    );
    expect(glassMat?.alphaMode).toBe('BLEND');
  });

  it('writes all updated CAD-grade reference artifacts + rack.yaml to examples/10inch-homelab/', () => {
    const currentDir = dirname(fileURLToPath(import.meta.url));
    const exampleDir = resolve(currentDir, '../../../examples/10inch-homelab');
    mkdirSync(exampleDir, { recursive: true });

    const projectInput = create10InchHomelabProjectInput();
    const scene = evaluate10InchHomelabScene();

    const yamlPath = resolve(exampleDir, 'rack.yaml');
    const elevationPath = resolve(exampleDir, 'elevation.svg');
    const wiringPath = resolve(exampleDir, 'wiring-schematic.svg');
    const bomPath = resolve(exampleDir, 'BOM.md');
    const glbPath = resolve(exampleDir, 'rack-scene.glb');

    writeFileSync(yamlPath, stringifyYaml(projectInput), 'utf8');
    writeFileSync(elevationPath, generateElevationSvg(scene), 'utf8');
    writeFileSync(wiringPath, generateWiringSchematicSvg(scene), 'utf8');
    writeFileSync(bomPath, generateBomMarkdown(scene), 'utf8');
    writeFileSync(glbPath, generateGlbBinary(scene));

    // Also generate parametric 3D-printable OpenSCAD (.scad) and ASCII STL (.stl) files for all modular carriers
    const printableCarriers = generateProjectPrintableCarriers(scene);
    expect(printableCarriers.length).toBe(2);
    for (const item of printableCarriers) {
      expect(item.openscad_code).toContain('rack_carrier_assembly();');
      expect(item.openscad_code).toContain('slot_bay_cutouts()');
      expect(item.stl_ascii.startsWith('solid ')).toBe(true);
      expect(item.stl_ascii.includes('facet normal')).toBe(true);
      writeFileSync(
        resolve(exampleDir, item.filename_scad),
        item.openscad_code,
        'utf8',
      );
      writeFileSync(
        resolve(exampleDir, item.filename_stl),
        item.stl_ascii,
        'utf8',
      );
    }

    const tinyCarrierBp = defaultCatalogRegistry.getBlueprintBySlug(
      '3dprint-10inch-lenovo-tiny-plus-2keystone',
    )!;
    expect(generateCarrierOpenScad(tinyCarrierBp, '10inch')).toContain(
      'left-mini-pc-bay',
    );
    expect(generateCarrierStl(tinyCarrierBp, '10inch')).toContain(
      'endsolid 3dprint-10inch-lenovo-tiny-plus-2keystone',
    );

    expect(statSync(yamlPath).size).toBeGreaterThan(500);
    expect(statSync(elevationPath).size).toBeGreaterThan(5000);
    expect(statSync(wiringPath).size).toBeGreaterThan(5000);
    expect(statSync(bomPath).size).toBeGreaterThan(1000);
    expect(statSync(glbPath).size).toBeGreaterThan(10000);
  });
});
