import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import { afterEach, describe, expect, it } from 'vitest';
import {
  classifyMcpClientFamily,
  ProjectStateManager,
  RackTelemetryTracker,
  startRackSidecarServer,
  type RackSidecarServer,
  type RackTelemetrySummary
} from '../src/index.js';

describe('@rack-mcp/mcp-server Telemetry, AI-Client Classification & Protected Prometheus Metrics', () => {
  const activeServers: RackSidecarServer[] = [];
  const tempDirs: string[] = [];

  afterEach(async () => {
    while (activeServers.length > 0) {
      const srv = activeServers.pop();
      if (srv !== undefined) {
        await srv.close();
      }
    }
    while (tempDirs.length > 0) {
      const dir = tempDirs.pop();
      if (dir !== undefined) {
        fs.rmSync(dir, { recursive: true, force: true });
      }
    }
  });

  it('deduplicates GDPR-salted unique visitors across today/7d/30d without storing raw IP addresses and persists checkpoints across restarts', () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rack-telemetry-'));
    tempDirs.push(tmpDir);
    const checkpointFile = path.join(tmpDir, 'telemetry.json');

    const baseNow = Date.UTC(2026, 9, 29, 12, 0, 0);
    const twoDaysAgo = baseNow - 2 * 86_400_000;
    const fifteenDaysAgo = baseNow - 15 * 86_400_000;

    const tracker = new RackTelemetryTracker({
      mode: 'remote-mcp',
      telemetryFilePath: checkpointFile
    });

    // Same active MCP user across 3 different days must count as 1 unique user in 7d & 30d
    tracker.recordMcpToolCall({
      toolName: 'init_rack',
      isValid: true,
      clientIp: '203.0.113.42',
      clientFamily: 'claude-code',
      nowMs: fifteenDaysAgo
    });
    tracker.recordMcpToolCall({
      toolName: 'mount_equipment',
      isValid: true,
      clientIp: '203.0.113.42',
      clientFamily: 'claude-code',
      nowMs: twoDaysAgo
    });
    tracker.recordMcpToolCall({
      toolName: 'validate_rack',
      isValid: true,
      clientIp: '203.0.113.42',
      clientFamily: 'claude-code',
      nowMs: baseNow
    });

    // Second distinct MCP user active only 2 days ago
    tracker.recordMcpToolCall({
      toolName: 'search_catalog',
      isValid: true,
      clientIp: '198.51.100.77',
      clientFamily: 'cursor',
      nowMs: twoDaysAgo
    });

    // Registry probe connecting today WITHOUT calling tools (connected != active)
    tracker.recordMcpSessionCreated(
      'streamable-http',
      '198.51.100.99',
      'registry-probe',
      baseNow
    );

    // 3D Web-Viewer human & internet scanner
    tracker.recordTraffic({
      channel: 'web_viewer',
      bytesIn: 420,
      bytesOut: 480_000,
      clientIp: '203.0.113.88',
      nowMs: baseNow
    });
    tracker.recordTraffic({
      channel: 'bot_scanner',
      bytesIn: 180,
      bytesOut: 64,
      clientIp: '192.0.2.199',
      nowMs: baseNow
    });

    tracker.close();

    // Ensure raw visitor IPs NEVER appear anywhere in the persisted file
    const rawSaved = fs.readFileSync(checkpointFile, 'utf8');
    expect(rawSaved).not.toContain('203.0.113.42');
    expect(rawSaved).not.toContain('198.51.100.77');
    expect(rawSaved).not.toContain('192.0.2.199');

    // Reload into a fresh tracker instance (simulating container update or nightly 03:00 reboot)
    const reloaded = new RackTelemetryTracker({
      mode: 'remote-mcp',
      telemetryFilePath: checkpointFile
    });
    const summary = reloaded.getSummary(
      { activeMcpSessions: 2, activeWebSocketClients: 1 },
      baseNow
    );
    reloaded.close();

    expect(summary.uniqueVisitors.mcp_active).toEqual({
      today: 1,
      last7d: 2,
      last30d: 2
    });
    expect(summary.uniqueVisitors.mcp_connected).toEqual({
      today: 2,
      last7d: 3,
      last30d: 3
    });
    expect(summary.uniqueVisitors.web_viewer.today).toBe(1);
    expect(summary.uniqueVisitors.bot_scanner.today).toBe(1);
    expect(summary.mcpTools.callsTotal).toBe(4);
    expect(summary.aiClients.toolCallsByClient['claude-code']).toBe(3);
    expect(summary.aiClients.toolCallsByClient.cursor).toBe(1);
    expect(summary.aiClients.sessionsByClient['registry-probe']).toBe(1);
    expect(summary.homepage.active_mcp_users_24h_30d).toBe('1 / 2');
  });

  it('classifies MCP AI clients, tracks live Remote MCP tool usage & traffic, and enforces Bearer token auth on /metrics and /api/telemetry', async () => {
    expect(classifyMcpClientFamily('claude-code', '')).toBe('claude-code');
    expect(classifyMcpClientFamily('Claude Desktop', '')).toBe('claude-desktop');
    expect(classifyMcpClientFamily('cursor-vscode', '')).toBe('cursor');
    expect(classifyMcpClientFamily('Google Antigravity', '')).toBe('antigravity');
    expect(classifyMcpClientFamily('Glama MCP Scanner', '')).toBe('registry-probe');

    const secretToken = 'test-secret-metrics-bearer-token-256bit';
    const baseState = new ProjectStateManager({ watchFile: false });
    const server = await startRackSidecarServer(baseState, {
      port: 0,
      host: '127.0.0.1',
      remoteMcp: true,
      publicBaseUrl: 'https://rack-mcp.example.test',
      metricsAuthToken: secretToken
    });
    activeServers.push(server);

    // 1. Unauthenticated or wrong-token requests to /metrics and /api/telemetry MUST be rejected (403)
    const unauthMetrics = await fetch(`${server.url}/metrics`);
    expect(unauthMetrics.status).toBe(403);

    const wrongTokenTelemetry = await fetch(`${server.url}/api/telemetry`, {
      headers: { Authorization: 'Bearer wrong-token' }
    });
    expect(wrongTokenTelemetry.status).toBe(403);

    // 2. Connect a real MCP client announcing itself as `claude-code` from public IP 203.0.113.55
    const mcpClient = new Client(
      { name: 'claude-code', version: '1.0.42' },
      { capabilities: {} }
    );
    const transport = new StreamableHTTPClientTransport(
      new URL(`${server.url}/mcp`),
      {
        requestInit: {
          headers: {
            'X-Real-IP': '203.0.113.55'
          }
        }
      }
    );
    await mcpClient.connect(transport);

    // Execute two real MCP tools (`search_catalog` + `init_rack`)
    await mcpClient.callTool({
      name: 'search_catalog',
      arguments: { form_factor: '10inch' }
    });
    await mcpClient.callTool({
      name: 'init_rack',
      arguments: {
        project_name: 'Telemetry Verification Lab',
        standard: '10inch',
        u_height: 8,
        rail_depth_mm: 260,
        enclosure_type: 'closed-glass-front'
      }
    });

    // Simulate a scanner hitting /.env from 198.51.100.250
    const scanRes = await fetch(`${server.url}/.env`, {
      headers: { 'X-Real-IP': '198.51.100.250', 'User-Agent': 'zgrab/0.x' }
    });
    expect(scanRes.status).toBe(404);

    // 3. Query /api/telemetry and /metrics with valid Bearer token
    const telemetryRes = await fetch(`${server.url}/api/telemetry`, {
      headers: { Authorization: `Bearer ${secretToken}` }
    });
    expect(telemetryRes.status).toBe(200);
    const summary = (await telemetryRes.json()) as RackTelemetrySummary;

    expect(summary.live.activeMcpSessions).toBe(1);
    expect(summary.sessions.createdTotal).toBe(1);
    expect(summary.sessions.withToolExecutionTotal).toBe(1);
    expect(summary.uniqueVisitors.mcp_active.today).toBe(1);
    expect(summary.uniqueVisitors.bot_scanner.today).toBe(1);
    expect(summary.aiClients.sessionsByClient['claude-code']).toBe(1);
    expect(summary.aiClients.toolCallsByClient['claude-code']).toBe(2);
    expect(summary.mcpTools.byTool['search_catalog']?.valid).toBe(1);
    expect(summary.mcpTools.byTool['init_rack']?.valid).toBe(1);
    expect(summary.traffic.bytesOutTotal).toBeGreaterThan(500);

    const promRes = await fetch(`${server.url}/metrics`, {
      headers: { Authorization: `Bearer ${secretToken}` }
    });
    expect(promRes.status).toBe(200);
    const promBody = await promRes.text();
    expect(promBody).toContain('rack_mcp_active_sessions 1');
    expect(
      promBody
    ).toContain('rack_mcp_unique_visitors{category="mcp_active",window="today"} 1');
    expect(
      promBody
    ).toContain('rack_mcp_client_tool_calls_total{client="claude-code"} 2');
    expect(
      promBody
    ).toContain('rack_mcp_tool_calls_total{tool="init_rack",status="VALID"} 1');

    await mcpClient.close();
  });
});
