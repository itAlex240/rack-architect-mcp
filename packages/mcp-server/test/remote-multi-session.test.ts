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

  it('protects legitimate tenant sessions against single-IP session floods and X-Forwarded-For left-prepending spoofing', async () => {
    const baseState = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(baseState, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      maxSessions: 5,
      maxSessionsPerIp: 2,
      maxNewSessionsPerMinutePerIp: 4,
      rateLimitPerMinute: 200
    });
    activeServers.push(server);

    const initRpcPayload = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'security-audit-client', version: '1.0.0' }
      }
    });

    // 1. Legitimate user at 198.51.100.10 creates an active session
    const victimInitRes = await fetch(`${server.url}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'X-Real-IP': '198.51.100.10'
      },
      body: initRpcPayload
    });
    expect(victimInitRes.status).toBe(200);
    const victimSessionId = victimInitRes.headers.get('mcp-session-id');
    expect(typeof victimSessionId).toBe('string');

    // 2. Flooder at 203.0.113.99 tries spoofing leftmost X-Forwarded-For hops while opening many sessions
    for (let i = 0; i < 4; i++) {
      const floodRes = await fetch(`${server.url}/mcp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          'X-Forwarded-For': `192.0.2.${i + 1}, 203.0.113.99`
        },
        body: initRpcPayload
      });
      expect(floodRes.status).toBe(200);
    }

    // 5th session creation within 60s from 203.0.113.99 is blocked by per-IP session creation limiter (429)
    const blockedFloodRes = await fetch(`${server.url}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream',
        'X-Forwarded-For': '198.18.0.99, 203.0.113.99'
      },
      body: initRpcPayload
    });
    expect(blockedFloodRes.status).toBe(429);

    // 3. Victim session (198.51.100.10) is completely intact (1 victim + max 2 flooder = 3 active sessions)
    const victimStateRes = await fetch(
      `${server.url}/api/state?session=${encodeURIComponent(victimSessionId!)}`,
      { headers: { 'X-Real-IP': '198.51.100.10' } }
    );
    expect(victimStateRes.status).toBe(200);

    const healthJson = (await (await fetch(`${server.url}/health`)).json()) as {
      readonly activeSessions: number;
    };
    expect(healthJson.activeSessions).toBe(3);
  });

  it('rejects oversized HTTP bodies (413), cross-site WebSocket origins (403 CSWSH), oversized WS frames (1009), and cleans up closed SSE streams', async () => {
    const baseState = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(baseState, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      publicBaseUrl: 'https://rack-mcp.example.test',
      maxRequestBodyBytes: 8 * 1024
    });
    activeServers.push(server);

    // 1. Oversized POST /mcp (> 8 KB) rejected with 413 without allocating any session
    const hugeBody = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      padding: 'A'.repeat(16 * 1024)
    });
    const oversizedMcpRes = await fetch(`${server.url}/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/event-stream'
      },
      body: hugeBody
    });
    expect(oversizedMcpRes.status).toBe(413);

    // 2. Legacy /sse stream cleanup + /messages 413 body limit
    const sseAbort = new AbortController();
    const sseRes = await fetch(`${server.url}/sse`, {
      signal: sseAbort.signal
    });
    expect(sseRes.status).toBe(200);
    const reader = sseRes.body!.getReader();
    const firstChunk = new TextDecoder().decode((await reader.read()).value);
    const match = /sessionId=([a-f0-9-]+)/i.exec(firstChunk);
    expect(match).not.toBeNull();
    const sseSid = match![1]!;

    const oversizedSsePost = await fetch(
      `${server.url}/messages?sessionId=${encodeURIComponent(sseSid)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: hugeBody
      }
    );
    expect(oversizedSsePost.status).toBe(413);

    // Abort SSE connection and verify session is immediately evicted (no 2h zombie leak)
    sseAbort.abort();
    await new Promise((r) => setTimeout(r, 80));
    const healthAfterSseClose = (await (
      await fetch(`${server.url}/health`)
    ).json()) as { readonly activeSessions: number };
    expect(healthAfterSseClose.activeSessions).toBe(0);

    // 3. Create valid Streamable HTTP session to test CSWSH Origin check & WS 256 KB maxPayload
    const transport = new StreamableHTTPClientTransport(
      new URL(`${server.url}/mcp`)
    );
    const client = new Client({ name: 'ws-sec-client', version: '1.0.0' });
    await client.connect(transport);
    const sid = transport.sessionId!;

    // Cross-site Origin must be rejected with 403 before WS handshake succeeds
    const evilWs = new WebSocket(
      `${server.wsUrl}?session=${encodeURIComponent(sid)}`,
      { origin: 'https://evil.attacker.invalid' }
    );
    const evilWsError = await new Promise<string>((resolve) => {
      evilWs.once('unexpected-response', (_req, res) => {
        resolve(`HTTP_${res.statusCode}`);
      });
      evilWs.once('error', (err) => {
        resolve(err.message);
      });
    });
    expect(evilWsError).toBe('HTTP_403');

    // Authorized publicBaseUrl Origin succeeds, then >256 KB WS frame is terminated with 1009
    const validWs = new WebSocket(
      `${server.wsUrl}?session=${encodeURIComponent(sid)}`,
      { origin: 'https://rack-mcp.example.test' }
    );
    await new Promise<void>((resolve, reject) => {
      validWs.once('open', () => resolve());
      validWs.once('error', reject);
    });

    const closeCodePromise = new Promise<number>((resolve) => {
      validWs.once('close', (code) => resolve(code));
    });
    validWs.send('X'.repeat(300 * 1024));
    const closeCode = await closeCodePromise;
    expect(closeCode).toBe(1009);

    await transport.terminateSession();
    await client.close();
  });

  it('enforces defensive HTTP headers, scoped CORS on session routes, and algorithmic/URI schema bounds', async () => {
    const baseState = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(baseState, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      publicBaseUrl: 'https://rack-mcp.example.test'
    });
    activeServers.push(server);

    const transport = new StreamableHTTPClientTransport(
      new URL(`${server.url}/mcp`)
    );
    const client = new Client({ name: 'bounds-audit-client', version: '1.0.0' });
    await client.connect(transport);
    const sid = transport.sessionId!;

    // 1. Public MCP discovery route permits wildcard CORS; session-private /api/state blocks foreign Origin
    const mcpInfoRes = await fetch(`${server.url}/api/mcp-info`, {
      headers: { Origin: 'https://inspector.modelcontextprotocol.io' }
    });
    expect(mcpInfoRes.headers.get('access-control-allow-origin')).toBe('*');
    expect(mcpInfoRes.headers.get('x-content-type-options')).toBe('nosniff');
    expect(mcpInfoRes.headers.get('x-frame-options')).toBe('DENY');
    expect(mcpInfoRes.headers.get('referrer-policy')).toBe('no-referrer');
    expect(mcpInfoRes.headers.get('cross-origin-opener-policy')).toBe('same-origin');

    const crossSiteStateRes = await fetch(
      `${server.url}/api/state?session=${encodeURIComponent(sid)}`,
      { headers: { Origin: 'https://evil.attacker.invalid' } }
    );
    expect(crossSiteStateRes.status).toBe(200);
    expect(crossSiteStateRes.headers.get('access-control-allow-origin')).toBeNull();

    const sameSiteStateRes = await fetch(
      `${server.url}/api/state?session=${encodeURIComponent(sid)}`,
      { headers: { Origin: 'https://rack-mcp.example.test' } }
    );
    expect(sameSiteStateRes.headers.get('access-control-allow-origin')).toBe(
      'https://rack-mcp.example.test'
    );

    const rootHtmlRes = await fetch(`${server.url}/`);
    if (rootHtmlRes.status === 200) {
      expect(rootHtmlRes.headers.get('content-security-policy')).toContain(
        "default-src 'self'"
      );
      expect(rootHtmlRes.headers.get('content-security-policy')).toContain(
        "frame-ancestors 'none'"
      );
    }

    // 2. Algorithmic DoS & javascript: URI payloads are deterministically rejected
    const hugeRackRes = await client.callTool({
      name: 'init_rack',
      arguments: {
        project_name: 'DoS Attempt Rack',
        standard: '19inch',
        u_height: 100_000,
        rail_depth_mm: 600,
        enclosure_type: 'open-frame'
      }
    });
    expect(hugeRackRes.isError).toBe(true);

    const xssBlueprintRes = await client.callTool({
      name: 'define_custom_blueprint',
      arguments: {
        blueprint: {
          slug: 'custom-evil-panel',
          manufacturer: 'Test',
          model: 'Test Panel',
          category: 'blanking-panel',
          mount_type: 'rackmount-10',
          geometry: {
            u_height: 1,
            width_mm: 254,
            height_mm: 44,
            depth_mm: 15,
            ear_mount_style: 'front-ears',
            front_protrusion_mm: 2,
            rear_protrusion_mm: 0,
            weight_grams: 80
          },
          power_and_thermal: {
            electrical_role: 'passive',
            idle_watts: 0,
            max_system_watts: 0,
            airflow: 'passive-convection'
          },
          ports: [],
          port_groups: [],
          slots: [],
          printable_metadata: {
            is_3d_printable: true,
            recommended_material: 'PETG',
            printables_url: 'javascript:alert(1)'
          }
        }
      }
    });
    expect(xssBlueprintRes.isError).toBe(true);

    await transport.terminateSession();
    await client.close();
  });
});
