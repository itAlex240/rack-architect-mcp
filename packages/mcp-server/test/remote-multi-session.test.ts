import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { afterEach, describe, expect, it } from 'vitest';
import { WebSocket } from 'ws';
import {
  ProjectStateManager,
  startRackSidecarServer,
  type RackSidecarServer,
  type SidecarWsMessage
} from '../src/index.js';

describe('@rack-mcp/mcp-server Hosted Multi-Session Remote MCP (Streamable HTTP + Live Session WS)', () => {
  const activeServers: RackSidecarServer[] = [];

  afterEach(async () => {
    while (activeServers.length > 0) {
      const srv = activeServers.pop();
      if (srv !== undefined) {
        await srv.close();
      }
    }
  });

  it('isolates concurrent Streamable HTTP MCP sessions, streams live 3D session WebSockets, and serves URL-based exports without writing to host disk', async () => {
    const baseState = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(baseState, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      publicBaseUrl: 'https://rack-mcp.example.test'
    });
    activeServers.push(server);

    const mcpEndpoint = new URL(`${server.url}/mcp`);

    // 1. Root /api/state without ?session= must return 404 so public root visitors stay in standalone browser mode
    const unauthStateRes = await fetch(`${server.url}/api/state`);
    expect(unauthStateRes.status).toBe(404);

    // 2. Discovery endpoint /.well-known/mcp.json & GET /mcp (browser/curl JSON overview)
    const wellKnownRes = await fetch(`${server.url}/.well-known/mcp.json`);
    expect(wellKnownRes.status).toBe(200);
    const wellKnownJson = (await wellKnownRes.json()) as {
      readonly mode: string;
      readonly transports: { readonly streamable_http: string };
    };
    expect(wellKnownJson.mode).toBe('remote-mcp');
    expect(wellKnownJson.transports.streamable_http).toBe(
      'https://rack-mcp.example.test/mcp'
    );

    const browserGetMcp = await fetch(`${server.url}/mcp`, {
      headers: { Accept: 'application/json' }
    });
    expect(browserGetMcp.status).toBe(200);

    // 3. Connect two independent MCP clients over Streamable HTTP
    const transportA = new StreamableHTTPClientTransport(mcpEndpoint);
    const clientA = new Client({ name: 'test-agent-alpha', version: '1.0.0' });
    await clientA.connect(transportA);
    const sessionA = transportA.sessionId;
    expect(typeof sessionA).toBe('string');
    expect(sessionA!.length).toBeGreaterThan(10);

    const transportB = new StreamableHTTPClientTransport(mcpEndpoint);
    const clientB = new Client({ name: 'test-agent-beta', version: '1.0.0' });
    await clientB.connect(transportB);
    const sessionB = transportB.sessionId;
    expect(typeof sessionB).toBe('string');
    expect(sessionB).not.toBe(sessionA);

    const healthRes = await fetch(`${server.url}/health`);
    const healthJson = (await healthRes.json()) as {
      readonly status: string;
      readonly mode: string;
      readonly activeSessions: number;
    };
    expect(healthJson.status).toBe('ok');
    expect(healthJson.mode).toBe('remote-mcp');
    expect(healthJson.activeSessions).toBe(2);

    // 4. Mutate Session A (10-inch Homelab) and Session B (19-inch Enterprise) independently
    const initARes = await clientA.callTool({
      name: 'init_rack',
      arguments: {
        project_name: 'Alpha 10-Inch Homelab',
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 240,
        enclosure_type: 'closed-glass-front'
      }
    });
    const initAEnv = initARes.structuredContent as {
      readonly status: string;
      readonly summary: string;
      readonly data: { readonly live_viewer_url: string };
    };
    expect(initAEnv.status).toBe('VALID');
    expect(initAEnv.data.live_viewer_url).toBe(
      `https://rack-mcp.example.test/?session=${encodeURIComponent(sessionA!)}`
    );
    expect(initAEnv.summary).toContain(initAEnv.data.live_viewer_url);

    await clientB.callTool({
      name: 'init_rack',
      arguments: {
        project_name: 'Beta 19-Inch Datacenter',
        standard: '19inch',
        u_height: 24,
        rail_depth_mm: 600,
        enclosure_type: 'closed-vented-front'
      }
    });

    // 5. Connect a live 3D Web-Viewer WebSocket strictly to Session A
    const wsMessagesA: SidecarWsMessage[] = [];
    const wsA = new WebSocket(
      `${server.wsUrl}?session=${encodeURIComponent(sessionA!)}`
    );
    await new Promise<void>((resolve, reject) => {
      wsA.once('error', reject);
      wsA.on('message', (raw) => {
        const parsed = JSON.parse(String(raw)) as SidecarWsMessage;
        wsMessagesA.push(parsed);
        if (parsed.type === 'INITIAL_STATE') {
          resolve();
        }
      });
    });
    expect(wsMessagesA[0]?.scene?.project.project_name).toBe(
      'Alpha 10-Inch Homelab'
    );

    // Mount a 3D-printable 1U Hex cover panel in Session A and verify live WS broadcast arrives
    const wsUpdatePromise = new Promise<SidecarWsMessage>((resolve) => {
      wsA.on('message', (raw) => {
        const parsed = JSON.parse(String(raw)) as SidecarWsMessage;
        if (
          parsed.type === 'STATE_UPDATED' &&
          (parsed.scene?.project.mounted_devices.length ?? 0) === 1
        ) {
          resolve(parsed);
        }
      });
    });

    await clientA.callTool({
      name: 'mount_equipment',
      arguments: {
        instance_id: 'cover-u2',
        blueprint_slug: '3dprint-10inch-cover-panel-hex-1u',
        u_position: 2,
        face: 'front'
      }
    });

    const liveUpdateA = await wsUpdatePromise;
    expect(liveUpdateA.scene?.project.mounted_devices[0]?.instance_id).toBe(
      'cover-u2'
    );

    // Verify Session B remained completely untouched (0 mounted devices, 19inch 24U)
    const stateBRes = await fetch(
      `${server.url}/api/state?session=${encodeURIComponent(sessionB!)}`
    );
    expect(stateBRes.status).toBe(200);
    const stateBJson = (await stateBRes.json()) as {
      readonly scene: {
        readonly project: {
          readonly project_name: string;
          readonly mounted_devices: readonly unknown[];
        };
      };
    };
    expect(stateBJson.scene.project.project_name).toBe(
      'Beta 19-Inch Datacenter'
    );
    expect(stateBJson.scene.project.mounted_devices.length).toBe(0);

    // 6. Export deliverables in Session A and verify ZERO host disk writes + working HTTP downloads
    const forbiddenHostDir = path.join(
      os.tmpdir(),
      `rack-mcp-forbidden-remote-dir-${Date.now()}`
    );
    const exportARes = await clientA.callTool({
      name: 'export_deliverables',
      arguments: {
        output_dir: forbiddenHostDir,
        formats: ['elevation-svg', 'bom-md', 'scene-glb', 'carrier-stl']
      }
    });
    expect(fs.existsSync(forbiddenHostDir)).toBe(false);

    const exportEnv = exportARes.structuredContent as {
      readonly status: string;
      readonly data: {
        readonly live_viewer_url: string;
        readonly rack_yaml_url: string;
        readonly exported_files: ReadonlyArray<{
          readonly format: string;
          readonly download_url: string;
          readonly filename: string;
          readonly size_bytes: number;
        }>;
      };
    };
    expect(exportEnv.status).toBe('VALID');
    expect(exportEnv.data.exported_files.length).toBe(4);

    // Replace publicBaseUrl host with local ephemeral server URL to fetch every generated deliverable
    for (const fileEntry of exportEnv.data.exported_files) {
      expect(fileEntry.size_bytes).toBeGreaterThan(50);
      const localDownloadUrl = fileEntry.download_url.replace(
        'https://rack-mcp.example.test',
        server.url
      );
      const dlRes = await fetch(localDownloadUrl, {
        headers: { 'Accept-Encoding': 'gzip' }
      });
      expect(dlRes.status).toBe(200);
      const buf = Buffer.from(await dlRes.arrayBuffer());
      expect(buf.byteLength).toBe(fileEntry.size_bytes);
    }

    const yamlRes = await fetch(
      exportEnv.data.rack_yaml_url.replace(
        'https://rack-mcp.example.test',
        server.url
      )
    );
    expect(yamlRes.status).toBe(200);
    expect(await yamlRes.text()).toContain('Alpha 10-Inch Homelab');

    // 7. Terminate Session B via DELETE /mcp and verify session count decrements to 1
    wsA.close();
    await transportB.terminateSession();
    await clientB.close();

    const healthAfterDelete = (await (
      await fetch(`${server.url}/health`)
    ).json()) as { readonly activeSessions: number };
    expect(healthAfterDelete.activeSessions).toBe(1);

    await transportA.terminateSession();
    await clientA.close();
  }, 15_000);

  it('enforces sliding-window per-IP rate limiting (429) and bounded maxSessions eviction', async () => {
    const baseState = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(baseState, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      maxSessions: 2,
      rateLimitPerMinute: 4
    });
    activeServers.push(server);

    // First 4 API requests succeed; 5th within 60s window returns 429 Too Many Requests
    for (let i = 0; i < 4; i++) {
      const okRes = await fetch(`${server.url}/api/mcp-info`, {
        headers: { 'X-Real-IP': '203.0.113.42' }
      });
      expect(okRes.status).toBe(200);
    }
    const limitedRes = await fetch(`${server.url}/api/mcp-info`, {
      headers: { 'X-Real-IP': '203.0.113.42' }
    });
    expect(limitedRes.status).toBe(429);
    expect(Number(limitedRes.headers.get('retry-after'))).toBeGreaterThanOrEqual(1);

    // /health remains exempt from rate limiting for Docker healthchecks & Uptime Kuma
    const healthRes = await fetch(`${server.url}/health`, {
      headers: { 'X-Real-IP': '203.0.113.42' }
    });
    expect(healthRes.status).toBe(200);
  });
});
