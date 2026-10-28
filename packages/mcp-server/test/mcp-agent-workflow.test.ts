import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WebSocket } from 'ws';
import {
  createRackMcpServer,
  ProjectStateManager,
  RackMcpToolHandlers,
  startRackSidecarServer,
  type SidecarWsMessage
} from '../src/index.js';

describe('@rack-mcp/mcp-server End-to-End Agentic Workflow & Sidecar Suite', () => {
  const tempDirs: string[] = [];

  function createTempDir(): string {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rack-mcp-test-'));
    tempDirs.push(dir);
    return dir;
  }

  afterEach(() => {
    for (const dir of tempDirs.splice(0, tempDirs.length)) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('simulates a complete AI Agent self-correction workflow from catalog search to 0-error export', () => {
    const tmpDir = createTempDir();
    const projectPath = path.join(tmpDir, 'rack.yaml');
    const customCatalogDir = path.join(tmpDir, 'custom-catalog');
    const exportDir = path.join(tmpDir, 'deliverables');

    const stateManager = new ProjectStateManager({
      projectPath,
      customCatalogDir
    });
    const handlers = new RackMcpToolHandlers(stateManager);

    // 1. Agent searches catalog for 10-inch devices
    const searchRes = handlers.searchCatalog({ form_factor: '10inch' });
    expect(searchRes.status).toBe('VALID');
    const searchData = searchRes.data as {
      readonly count: number;
      readonly blueprints: ReadonlyArray<{ readonly slug: string }>;
    };
    expect(searchData.count).toBeGreaterThanOrEqual(9);
    expect(
      searchData.blueprints.some((b) => b.slug === 'ubiquiti-usw-lite-8-poe')
    ).toBe(true);

    // Agent inspects a blueprint
    const bpRes = handlers.getDeviceBlueprint({ slug: 'cyberpower-10inch-ups-1u' });
    expect(bpRes.status).toBe('VALID');

    // Agent registers a custom 28W PoE+ AI edge node (fits inside rpi-bay-1/2: 60x32x60mm <= 65x36x100mm)
    // Connecting 2 of these (2 x 28W = 56W) to a 52W USW-Lite-8-PoE switch provokes POE_BUDGET_EXCEEDED!
    const customBpRes = handlers.defineCustomBlueprint({
      blueprint: {
        slug: 'custom-poe-ai-edge-node',
        manufacturer: 'CustomLab',
        model: 'PoE+ AI Edge Node 28W',
        category: 'sbc',
        mount_type: 'sub-module',
        slot_compatibility: 'sbc-rpi5',
        geometry: {
          u_height: 0.8,
          width_mm: 60,
          height_mm: 32,
          depth_mm: 60,
          ear_mount_style: 'sub-module-clip',
          front_protrusion_mm: 2,
          rear_protrusion_mm: 0,
          weight_grams: 220
        },
        power_and_thermal: {
          electrical_role: 'consumer',
          idle_watts: 12,
          max_system_watts: 28,
          airflow: 'passive-convection'
        },
        ports: [
          {
            port_id: 'eth0',
            label: 'PoE+ In',
            face: 'front',
            connector_type: 'rj45',
            direction: 'input',
            capabilities: ['1000base-t', '2500base-t', 'poe-in-at'],
            coordinates: { x_mm: 20, y_mm: 12, orientation: 'upright' }
          }
        ],
        port_groups: [],
        slots: []
      }
    });
    expect(customBpRes.status).toBe('VALID');
    expect(
      fs.existsSync(path.join(customCatalogDir, 'custom-poe-ai-edge-node.yaml'))
    ).toBe(true);

    // 2. Agent initializes 10-inch 8U rack with 245mm rail depth
    // (UPS depth = 185mm + PDU depth = 55mm = 240mm < 245mm, leaving 5mm chassis gap,
    //  so plugging a 42mm IEC C13-C14 cable into the UPS rear triggers PLUG_CLEARANCE_COLLISION!)
    const initRes = handlers.initRack({
      project_name: 'Agent 10-Inch Self-Healing Homelab',
      standard: '10inch',
      u_height: 8,
      rail_depth_mm: 245,
      enclosure_type: 'closed-glass-front',
      front_door_clearance_mm: 45,
      rear_clearance_mm: 40
    });
    expect(initRes.status).toBe('VALID');
    expect(fs.existsSync(projectPath)).toBe(true);

    // 3. Agent mounts equipment and provokes PLUG_CLEARANCE_COLLISION on U1 and POE_BUDGET_EXCEEDED
    // Mount UPS on U1 Front (depth 185mm -> Z: 0..185mm)
    const mountUps = handlers.mountEquipment({
      instance_id: 'ups-1',
      blueprint_slug: 'cyberpower-10inch-ups-1u',
      hostname: 'ups-core-01',
      u_position: 1,
      face: 'front'
    });
    expect(mountUps.status).toBe('VALID');

    // Mount PDU on U1 Rear (depth 55mm -> Z: 190..245mm; 5mm clear of UPS chassis!)
    const mountPdu = handlers.mountEquipment({
      instance_id: 'pdu-1',
      blueprint_slug: 'digitus-10inch-pdu-4way-schuko',
      hostname: 'pdu-rear-01',
      u_position: 1,
      face: 'rear'
    });
    expect(mountPdu.status).toBe('VALID');

    // Mount USW-Lite-8-PoE (52W PoE budget) on U8 Front and USW-Flex-2.5G-8-PoE (196W budget) on U7 Front
    handlers.mountEquipment({
      instance_id: 'sw-lite',
      blueprint_slug: 'ubiquiti-usw-lite-8-poe',
      hostname: 'sw-lite-52w',
      u_position: 8,
      face: 'front'
    });
    handlers.mountEquipment({
      instance_id: 'sw-flex',
      blueprint_slug: 'ubiquiti-usw-flex-2-5g-8-poe',
      hostname: 'sw-flex-196w',
      u_position: 7,
      face: 'front'
    });

    // Mount RPi5 carrier on U5 Front and two 28W PoE+ edge nodes inside `rpi-bay-1` and `rpi-bay-2` (56W > 52W!)
    handlers.mountEquipment({
      instance_id: 'carrier-sbc',
      blueprint_slug: '3dprint-10inch-dual-rpi5-plus-4keystone',
      hostname: 'carrier-edge-u5',
      u_position: 5,
      face: 'front'
    });
    handlers.mountEquipment({
      instance_id: 'edge-1',
      blueprint_slug: 'custom-poe-ai-edge-node',
      hostname: 'edge-ai-01',
      parent_carrier_id: 'carrier-sbc',
      slot_id: 'rpi-bay-1'
    });
    handlers.mountEquipment({
      instance_id: 'edge-2',
      blueprint_slug: 'custom-poe-ai-edge-node',
      hostname: 'edge-ai-02',
      parent_carrier_id: 'carrier-sbc',
      slot_id: 'rpi-bay-2'
    });

    // Connect cables:
    // - Straight `power-c13-c14` cable on UPS rear port (`iec_out1` -> `sw-flex:pwr_in`):
    //   Extends UPS rear clearance box by +42mm (185 + 42 = 227mm > PDU min.z 190mm) -> PLUG_CLEARANCE_COLLISION!
    // - Connect both 28W PoE+ edge nodes to `sw-lite` (56W > 52W budget) -> POE_BUDGET_EXCEEDED!
    const connectBadRes = handlers.connectCables({
      cables: [
        {
          cable_id: 'pwr-ups-to-flex',
          cable_type: 'power-c13-c14',
          from: {
            instance_id: 'ups-1',
            port_id: 'iec_out1'
          },
          to: {
            instance_id: 'sw-flex',
            port_id: 'pwr_in'
          }
        },
        {
          cable_id: 'poe-edge-1',
          cable_type: 'cat6a',
          from: {
            instance_id: 'sw-lite',
            port_id: 'eth1'
          },
          to: {
            instance_id: 'edge-1',
            port_id: 'eth0'
          }
        },
        {
          cable_id: 'poe-edge-2',
          cable_type: 'cat6a',
          from: {
            instance_id: 'sw-lite',
            port_id: 'eth2'
          },
          to: {
            instance_id: 'edge-2',
            port_id: 'eth0'
          }
        }
      ]
    });

    // 4. Verify structured DiagnosticIssues & remediation_suggestions
    expect(connectBadRes.status).toBe('INVALID');
    const issueCodes = connectBadRes.issues.map((i) => i.code);
    expect(issueCodes).toContain('PLUG_CLEARANCE_COLLISION');
    expect(issueCodes).toContain('POE_BUDGET_EXCEEDED');

    const plugCollisionIssue = connectBadRes.issues.find(
      (i) => i.code === 'PLUG_CLEARANCE_COLLISION'
    );
    expect(plugCollisionIssue).toBeDefined();
    expect(plugCollisionIssue!.remediation_suggestions.length).toBeGreaterThan(0);

    const poeIssue = connectBadRes.issues.find(
      (i) => i.code === 'POE_BUDGET_EXCEEDED'
    );
    expect(poeIssue).toBeDefined();
    expect(poeIssue!.remediation_suggestions.length).toBeGreaterThan(0);

    // 5. Agent applies self-correction based on remediation_suggestions:
    // Fix 1: Move `pdu-1` from U1 Rear to U2 Rear via `modify_equipment`
    const movePduRes = handlers.modifyEquipment({
      instance_id: 'pdu-1',
      action: 'move',
      u_position: 2,
      face: 'rear'
    });
    expect(
      movePduRes.issues.some((i) => i.code === 'PLUG_CLEARANCE_COLLISION')
    ).toBe(false);

    // Fix 2: Disconnect `poe-edge-2` from overloaded `sw-lite` and reconnect it to `sw-flex` (196W budget)
    handlers.disconnectCables({ cable_ids: ['poe-edge-2'] });
    const reconnectPoeRes = handlers.connectCables({
      cables: [
        {
          cable_id: 'poe-edge-2-flex',
          cable_type: 'cat6a',
          from: {
            instance_id: 'sw-flex',
            port_id: 'eth1'
          },
          to: {
            instance_id: 'edge-2',
            port_id: 'eth0'
          }
        }
      ]
    });
    expect(
      reconnectPoeRes.issues.some((i) => i.code === 'POE_BUDGET_EXCEEDED')
    ).toBe(false);

    // 6. Agent runs `validate_rack` -> 0 Errors, ASCII elevation plan generated
    const valRes = handlers.validateRack({});
    expect(valRes.status).toBe('VALID');
    const valData = valRes.data as {
      readonly is_valid: boolean;
      readonly ascii_elevation: string;
    };
    expect(valData.is_valid).toBe(true);
    expect(valData.ascii_elevation).toContain('=== RACK ELEVATION PLAN:');
    expect(valRes.issues.filter((i) => i.severity === 'ERROR')).toHaveLength(0);

    // 7. Test Undo / Redo Stack
    const undoRes = handlers.undoRedo({ action: 'undo' });
    expect(undoRes.status).toBe('VALID');
    expect((undoRes.data as { readonly applied: boolean }).applied).toBe(true);

    const redoRes = handlers.undoRedo({ action: 'redo' });
    expect(redoRes.status).toBe('VALID');
    expect((redoRes.data as { readonly applied: boolean }).applied).toBe(true);

    // 8. Agent calls `export_deliverables` -> All 4 files written cleanly
    const exportRes = handlers.exportDeliverables({
      formats: ['elevation-svg', 'wiring-svg', 'bom-md', 'scene-glb'],
      output_dir: exportDir
    });
    expect(exportRes.status).toBe('VALID');
    expect(fs.existsSync(path.join(exportDir, 'elevation.svg'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'wiring-schematic.svg'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'BOM.md'))).toBe(true);
    expect(fs.existsSync(path.join(exportDir, 'rack-scene.glb'))).toBe(true);

    // 9. Verify live MCP Tool-Call Log recorded every step
    const toolLog = stateManager.getToolCallLog();
    expect(toolLog.length).toBeGreaterThanOrEqual(15);
    expect(toolLog[0]?.tool).toBe('export_deliverables');
    expect(toolLog.some((e) => e.tool === 'connect_cables' && e.status === 'INVALID')).toBe(true);
    expect(toolLog.some((e) => e.tool === 'validate_rack' && e.status === 'VALID')).toBe(true);
  });

  it('pushes real-time STATE_UPDATED over WebSocket and serves HTTP export endpoints', async () => {
    const tmpDir = createTempDir();
    const projectPath = path.join(tmpDir, 'rack.yaml');
    const stateManager = new ProjectStateManager({ projectPath });
    const mcpInstance = createRackMcpServer(stateManager);
    const sidecar = await startRackSidecarServer(stateManager, { port: 0 });

    try {
      const receivedMessages: SidecarWsMessage[] = [];
      const ws = new WebSocket(sidecar.wsUrl);

      ws.on('message', (data) => {
        receivedMessages.push(JSON.parse(String(data)) as SidecarWsMessage);
      });

      await new Promise<void>((resolve, reject) => {
        ws.once('open', () => resolve());
        ws.once('error', reject);
      });

      // Wait for INITIAL_STATE
      await new Promise((r) => setTimeout(r, 40));
      expect(receivedMessages.some((m) => m.type === 'INITIAL_STATE')).toBe(true);

      // Execute MCP tool mutation and verify STATE_UPDATED is pushed over WebSocket
      mcpInstance.handlers.mountEquipment({
        instance_id: 'ups-ws-1',
        blueprint_slug: 'cyberpower-10inch-ups-1u',
        hostname: 'ups-live',
        u_position: 1,
        face: 'front'
      });

      await new Promise((r) => setTimeout(r, 50));
      const updateMsg = receivedMessages.find((m) => m.type === 'STATE_UPDATED');
      expect(updateMsg).toBeDefined();
      expect(updateMsg!.scene?.geometry.devices_by_id['ups-ws-1']).toBeDefined();

      // Test HTTP endpoints
      const stateRes = await fetch(`${sidecar.url}/api/state`);
      expect(stateRes.status).toBe(200);
      const stateJson = (await stateRes.json()) as {
        readonly scene: {
          readonly geometry: {
            readonly devices_by_id: Record<string, unknown>;
          };
        };
      };
      expect(stateJson.scene.geometry.devices_by_id['ups-ws-1']).toBeDefined();

      const catalogRes = await fetch(`${sidecar.url}/api/catalog`);
      expect(catalogRes.status).toBe(200);
      const catalogJson = (await catalogRes.json()) as { readonly count: number };
      expect(catalogJson.count).toBeGreaterThanOrEqual(20);

      const elevRes = await fetch(`${sidecar.url}/api/export/elevation.svg`);
      expect(elevRes.status).toBe(200);
      expect(elevRes.headers.get('content-type')).toContain('image/svg+xml');
      const elevSvg = await elevRes.text();
      expect(elevSvg).toContain('<svg');

      const glbRes = await fetch(`${sidecar.url}/api/export/scene.glb`);
      expect(glbRes.status).toBe(200);
      expect(glbRes.headers.get('content-type')).toContain('model/gltf-binary');
      const glbBuf = await glbRes.arrayBuffer();
      expect(glbBuf.byteLength).toBeGreaterThan(100);

      ws.close();
    } finally {
      await sidecar.close();
      await mcpInstance.close();
    }
  });

  it('handles EADDRINUSE port fallback and synchronizes external stdio tool logs and mutations', async () => {
    const tmpDir = createTempDir();
    const projectPath = path.join(tmpDir, 'rack.yaml');
    const primaryState = new ProjectStateManager({
      projectPath,
      watchFile: true
    });
    const primarySidecar = await startRackSidecarServer(primaryState, {
      port: 0
    });

    // Spawn a secondary stdio-style process sharing the same projectPath and requesting the already-bound port
    const secondaryState = new ProjectStateManager({
      projectPath,
      watchFile: false
    });
    const secondaryMcp = createRackMcpServer(secondaryState);
    const secondarySidecar = await startRackSidecarServer(secondaryState, {
      port: primarySidecar.port
    });

    try {
      expect(secondarySidecar.port).toBeGreaterThan(0);
      expect(secondarySidecar.port).not.toBe(primarySidecar.port);

      // Secondary agent executes init_rack and mount_equipment
      secondaryMcp.handlers.initRack({
        project_name: 'External Agent Sync Test',
        standard: '19inch',
        u_height: 12,
        rail_depth_mm: 400
      });
      secondaryMcp.handlers.mountEquipment({
        instance_id: 'sw-ext-1',
        blueprint_slug: 'ubiquiti-usw-aggregation',
        hostname: 'core-agg-01',
        u_position: 12,
        face: 'front'
      });

      // Wait for file watcher debounce on primaryState
      await new Promise((r) => setTimeout(r, 140));

      expect(primaryState.getProject().project_name).toBe(
        'External Agent Sync Test'
      );
      expect(
        primaryState.getScene().geometry.devices_by_id.get('sw-ext-1')
      ).toBeDefined();
      expect(primaryState.getToolCallLog().length).toBeGreaterThanOrEqual(2);
      expect(primaryState.getToolCallLog()[0]?.tool).toBe('mount_equipment');

      // Clearing the tool log on primary persists empty log to disk
      primaryState.clearToolCallLog();
      expect(primaryState.getToolCallLog()).toHaveLength(0);
    } finally {
      primaryState.stopWatching();
      await secondarySidecar.close();
      await secondaryMcp.close();
      await primarySidecar.close();
    }
  });
});
