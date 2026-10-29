import * as crypto from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { MCP_TOOL_DEFINITIONS } from '@rack-mcp/core-domain';
import { RACK_MCP_SERVER_VERSION } from '../mcp/server.js';

export const CANONICAL_MCP_TOOLS = Object.keys(
  MCP_TOOL_DEFINITIONS
) as readonly (keyof typeof MCP_TOOL_DEFINITIONS)[];

export const MCP_CLIENT_FAMILIES = [
  'claude-desktop',
  'claude-code',
  'cursor',
  'windsurf',
  'antigravity',
  'vscode-copilot',
  'zed',
  'mcp-inspector',
  'registry-probe',
  'other-mcp'
] as const;

export type McpClientFamily = (typeof MCP_CLIENT_FAMILIES)[number];

export const VISITOR_CATEGORIES = [
  'mcp_active',
  'mcp_connected',
  'web_viewer',
  'bot_scanner'
] as const;

export type VisitorCategory = (typeof VISITOR_CATEGORIES)[number];

export const TRAFFIC_CHANNELS = [
  'mcp',
  'web_viewer',
  'exports',
  'websocket',
  'health',
  'bot_scanner',
  'other'
] as const;

export type TrafficChannel = (typeof TRAFFIC_CHANNELS)[number];

export const EXPORT_DOWNLOAD_FORMATS = [
  'elevation-svg',
  'wiring-svg',
  'bom-md',
  'scene-glb',
  'carrier-stl',
  'carrier-scad',
  'rack-yaml'
] as const;

export type ExportDownloadFormat = (typeof EXPORT_DOWNLOAD_FORMATS)[number];

export type McpTransportKind = 'streamable-http' | 'sse' | 'stdio';

interface DailyTelemetryBucket {
  mcpToolCalls: number;
  mcpSessionsCreated: number;
  mcpActiveSessions: number;
  bytesOut: number;
  bytesIn: number;
  requests: number;
  readonly visitors: Record<VisitorCategory, Set<string>>;
}

interface PersistedDailyBucket {
  readonly mcpToolCalls: number;
  readonly mcpSessionsCreated: number;
  readonly mcpActiveSessions: number;
  readonly bytesOut: number;
  readonly bytesIn: number;
  readonly requests: number;
  readonly visitors: Record<VisitorCategory, readonly string[]>;
}

interface PersistedTelemetryState {
  readonly schemaVersion: 1;
  readonly saltHex: string;
  readonly startedAtIso: string;
  readonly updatedAtIso: string;
  readonly sessionsCreatedByTransport: Record<McpTransportKind, number>;
  readonly sessionsWithToolExecutionTotal: number;
  readonly toolCallsValidByTool: Record<string, number>;
  readonly toolCallsInvalidByTool: Record<string, number>;
  readonly clientSessionsByFamily: Record<McpClientFamily, number>;
  readonly clientToolCallsByFamily: Record<McpClientFamily, number>;
  readonly requestsByChannel: Record<TrafficChannel, number>;
  readonly bytesOutByChannel: Record<TrafficChannel, number>;
  readonly bytesInByChannel: Record<TrafficChannel, number>;
  readonly exportDownloadsByFormat: Record<ExportDownloadFormat, number>;
  readonly rateLimitedRequestsTotal: number;
  readonly dailyBuckets: Record<string, PersistedDailyBucket>;
}

export interface RackTelemetryTrackerOptions {
  readonly telemetryFilePath?: string | undefined;
  readonly saltHex?: string | undefined;
  readonly mode?: 'remote-mcp' | 'local-sidecar' | undefined;
  readonly flushIntervalMs?: number | undefined;
}

export interface TelemetryWindowCounts {
  readonly today: number;
  readonly last7d: number;
  readonly last30d: number;
}

export interface RackTelemetrySummary {
  readonly status: 'ok';
  readonly version: string;
  readonly mode: 'remote-mcp' | 'local-sidecar';
  readonly generatedAtIso: string;
  readonly live: {
    readonly activeMcpSessions: number;
    readonly activeWebSocketClients: number;
  };
  readonly sessions: {
    readonly createdTotal: number;
    readonly withToolExecutionTotal: number;
    readonly byTransport: Record<McpTransportKind, number>;
    readonly createdWindow: TelemetryWindowCounts;
    readonly activeSessionsWindow: TelemetryWindowCounts;
  };
  readonly uniqueVisitors: Record<VisitorCategory, TelemetryWindowCounts>;
  readonly mcpTools: {
    readonly callsTotal: number;
    readonly callsWindow: TelemetryWindowCounts;
    readonly byTool: Record<
      string,
      { readonly total: number; readonly valid: number; readonly invalid: number }
    >;
  };
  readonly aiClients: {
    readonly sessionsByClient: Record<McpClientFamily, number>;
    readonly toolCallsByClient: Record<McpClientFamily, number>;
  };
  readonly traffic: {
    readonly bytesOutTotal: number;
    readonly bytesInTotal: number;
    readonly bytesOutWindow: TelemetryWindowCounts;
    readonly bytesOutHuman: {
      readonly today: string;
      readonly last7d: string;
      readonly last30d: string;
      readonly total: string;
    };
    readonly bytesOutByChannel: Record<TrafficChannel, number>;
    readonly requestsByChannel: Record<TrafficChannel, number>;
    readonly exportDownloadsByFormat: Record<ExportDownloadFormat, number>;
    readonly rateLimitedRequestsTotal: number;
  };
  readonly homepage: {
    readonly active_sessions: number;
    readonly active_mcp_users_24h_30d: string;
    readonly mcp_tool_calls_24h_total: string;
    readonly traffic_30d_human: string;
  };
}

const MAX_RETENTION_DAYS = 31;
const MAX_VISITOR_DIGESTS_PER_DAY = 5_000;

const KNOWN_SCANNER_USER_AGENTS = [
  'masscan',
  'zgrab',
  'censys',
  'shodan',
  'nuclei',
  'nikto',
  'sqlmap',
  'nmap',
  'gobuster',
  'dirbuster',
  'acunetix',
  'nessus'
] as const;

export function formatBytesHuman(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
  let value = bytes;
  let unitIdx = 0;
  while (value >= 1024 && unitIdx < units.length - 1) {
    value /= 1024;
    unitIdx++;
  }
  const decimals = unitIdx === 0 ? 0 : value >= 100 ? 1 : 2;
  return `${value.toFixed(decimals)} ${units[unitIdx]}`;
}

/**
 * Classifies an MCP client into a bounded canonical family using MCP `initialize`
 * `clientInfo.name` first and HTTP `User-Agent` as fallback.
 */
export function classifyMcpClientFamily(
  clientInfoName?: string | undefined,
  userAgent?: string | undefined
): McpClientFamily {
  const combined = `${clientInfoName ?? ''} ${userAgent ?? ''}`.toLowerCase();
  if (
    combined.includes('glama') ||
    combined.includes('smithery') ||
    combined.includes('mcpservers') ||
    combined.includes('uptime-kuma') ||
    combined.includes('healthcheck')
  ) {
    return 'registry-probe';
  }
  if (combined.includes('claude-code') || combined.includes('claude code')) {
    return 'claude-code';
  }
  if (combined.includes('claude')) {
    return 'claude-desktop';
  }
  if (combined.includes('cursor')) {
    return 'cursor';
  }
  if (combined.includes('windsurf') || combined.includes('codeium')) {
    return 'windsurf';
  }
  if (
    combined.includes('antigravity') ||
    combined.includes('agy') ||
    combined.includes('gemini')
  ) {
    return 'antigravity';
  }
  if (combined.includes('inspector')) {
    return 'mcp-inspector';
  }
  if (
    combined.includes('vscode') ||
    combined.includes('visual studio code') ||
    combined.includes('copilot')
  ) {
    return 'vscode-copilot';
  }
  if (combined.includes('zed')) {
    return 'zed';
  }
  return 'other-mcp';
}

export function isLikelyScannerRequest(
  pathname: string,
  userAgent: string | undefined,
  statusCode: number
): boolean {
  const ua = (userAgent ?? '').toLowerCase();
  for (const token of KNOWN_SCANNER_USER_AGENTS) {
    if (ua.includes(token)) {
      return true;
    }
  }
  const lowerPath = pathname.toLowerCase();
  if (
    lowerPath.includes('/.env') ||
    lowerPath.includes('/.git') ||
    lowerPath.includes('/wp-') ||
    lowerPath.includes('/phpmyadmin') ||
    lowerPath.includes('/actuator') ||
    lowerPath.includes('/cgi-bin') ||
    lowerPath.endsWith('.php')
  ) {
    return true;
  }
  return statusCode === 404 && lowerPath !== '/favicon.ico';
}

/**
 * Constant-time Bearer token comparison using SHA-256 digests so token length
 * and prefix timing side-channels are eliminated.
 */
export function verifyMetricsBearerToken(
  authorizationHeader: string | undefined,
  expectedToken: string
): boolean {
  if (
    authorizationHeader === undefined ||
    expectedToken.trim().length === 0 ||
    !authorizationHeader.startsWith('Bearer ')
  ) {
    return false;
  }
  const provided = authorizationHeader.slice('Bearer '.length).trim();
  if (provided.length === 0) {
    return false;
  }
  const digestA = crypto.createHash('sha256').update(provided, 'utf8').digest();
  const digestB = crypto
    .createHash('sha256')
    .update(expectedToken.trim(), 'utf8')
    .digest();
  return crypto.timingSafeEqual(digestA, digestB);
}

function toUtcDateKey(tsMs: number): string {
  return new Date(tsMs).toISOString().slice(0, 10);
}

function getRecentDateKeys(nowMs: number, days: number): readonly string[] {
  const keys: string[] = [];
  const baseUtcMidnight = Date.UTC(
    new Date(nowMs).getUTCFullYear(),
    new Date(nowMs).getUTCMonth(),
    new Date(nowMs).getUTCDate()
  );
  for (let i = 0; i < days; i++) {
    keys.push(toUtcDateKey(baseUtcMidnight - i * 86_400_000));
  }
  return keys;
}

function createEmptyDailyBucket(): DailyTelemetryBucket {
  return {
    mcpToolCalls: 0,
    mcpSessionsCreated: 0,
    mcpActiveSessions: 0,
    bytesOut: 0,
    bytesIn: 0,
    requests: 0,
    visitors: {
      mcp_active: new Set<string>(),
      mcp_connected: new Set<string>(),
      web_viewer: new Set<string>(),
      bot_scanner: new Set<string>()
    }
  };
}

function isLoopbackIp(ip: string): boolean {
  return (
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip === 'localhost' ||
    ip === 'unknown' ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.30.250.')
  );
}

/**
 * Privacy-first (GDPR-safe) usage, AI-client, and bandwidth telemetry tracker for RackArchitect MCP.
 * - Never stores or exposes raw visitor IP addresses (uses HMAC-SHA256 digests with a private 256-bit salt).
 * - Operates 100% in-memory by default (`read_only: true` safe), with optional debounced atomic JSON checkpoints
 *   when `telemetryFilePath` (`RACK_MCP_TELEMETRY_FILE`) is configured on a dedicated data mount.
 */
export class RackTelemetryTracker {
  private readonly telemetryFilePath: string | undefined;
  private readonly mode: 'remote-mcp' | 'local-sidecar';
  private saltHex: string;
  private startedAtIso: string;

  private readonly sessionsCreatedByTransport = new Map<McpTransportKind, number>([
    ['streamable-http', 0],
    ['sse', 0],
    ['stdio', 0]
  ]);
  private sessionsWithToolExecutionTotal = 0;

  private readonly toolCallsValid = new Map<string, number>();
  private readonly toolCallsInvalid = new Map<string, number>();

  private readonly clientSessions = new Map<McpClientFamily, number>();
  private readonly clientToolCalls = new Map<McpClientFamily, number>();

  private readonly requestsByChannel = new Map<TrafficChannel, number>();
  private readonly bytesOutByChannel = new Map<TrafficChannel, number>();
  private readonly bytesInByChannel = new Map<TrafficChannel, number>();
  private readonly exportDownloads = new Map<ExportDownloadFormat, number>();
  private rateLimitedRequestsTotal = 0;

  private readonly dailyBuckets = new Map<string, DailyTelemetryBucket>();
  private dirty = false;
  private readonly flushTimer: ReturnType<typeof setInterval> | undefined;

  public constructor(options: RackTelemetryTrackerOptions = {}) {
    this.telemetryFilePath =
      options.telemetryFilePath !== undefined &&
      options.telemetryFilePath.trim().length > 0
        ? options.telemetryFilePath.trim()
        : undefined;
    this.mode = options.mode ?? 'local-sidecar';
    this.saltHex =
      options.saltHex !== undefined && /^[0-9a-fA-F]{32,128}$/.test(options.saltHex)
        ? options.saltHex.toLowerCase()
        : crypto.randomBytes(32).toString('hex');
    this.startedAtIso = new Date().toISOString();

    for (const toolName of CANONICAL_MCP_TOOLS) {
      this.toolCallsValid.set(toolName, 0);
      this.toolCallsInvalid.set(toolName, 0);
    }
    for (const family of MCP_CLIENT_FAMILIES) {
      this.clientSessions.set(family, 0);
      this.clientToolCalls.set(family, 0);
    }
    for (const channel of TRAFFIC_CHANNELS) {
      this.requestsByChannel.set(channel, 0);
      this.bytesOutByChannel.set(channel, 0);
      this.bytesInByChannel.set(channel, 0);
    }
    for (const fmt of EXPORT_DOWNLOAD_FORMATS) {
      this.exportDownloads.set(fmt, 0);
    }

    if (this.telemetryFilePath !== undefined) {
      this.loadFromDiskIfPresent(this.telemetryFilePath);
      const intervalMs = Math.max(5_000, options.flushIntervalMs ?? 20_000);
      this.flushTimer = setInterval(() => {
        if (this.dirty) {
          this.flushSync();
        }
      }, intervalMs);
      this.flushTimer.unref();
    }
  }

  private hashVisitorIp(clientIp: string): string {
    return crypto
      .createHmac('sha256', this.saltHex)
      .update(clientIp, 'utf8')
      .digest('hex')
      .slice(0, 16);
  }

  private getOrCreateDayBucket(nowMs = Date.now()): DailyTelemetryBucket {
    const key = toUtcDateKey(nowMs);
    let bucket = this.dailyBuckets.get(key);
    if (bucket === undefined) {
      bucket = createEmptyDailyBucket();
      this.dailyBuckets.set(key, bucket);
      this.pruneOldBuckets(nowMs);
    }
    return bucket;
  }

  private pruneOldBuckets(nowMs: number): void {
    if (this.dailyBuckets.size <= MAX_RETENTION_DAYS) {
      return;
    }
    const allowed = new Set(getRecentDateKeys(nowMs, MAX_RETENTION_DAYS));
    for (const key of this.dailyBuckets.keys()) {
      if (!allowed.has(key)) {
        this.dailyBuckets.delete(key);
      }
    }
  }

  public recordVisitor(
    category: VisitorCategory,
    clientIp: string,
    nowMs = Date.now()
  ): void {
    if (isLoopbackIp(clientIp)) {
      return;
    }
    const bucket = this.getOrCreateDayBucket(nowMs);
    const set = bucket.visitors[category];
    if (set.size >= MAX_VISITOR_DIGESTS_PER_DAY) {
      return;
    }
    const digest = this.hashVisitorIp(clientIp);
    if (!set.has(digest)) {
      set.add(digest);
      this.dirty = true;
    }
  }

  public recordMcpSessionCreated(
    transport: McpTransportKind,
    clientIp: string,
    clientFamily?: McpClientFamily | undefined,
    nowMs = Date.now()
  ): void {
    this.sessionsCreatedByTransport.set(
      transport,
      (this.sessionsCreatedByTransport.get(transport) ?? 0) + 1
    );
    const bucket = this.getOrCreateDayBucket(nowMs);
    bucket.mcpSessionsCreated += 1;
    this.recordVisitor('mcp_connected', clientIp, nowMs);
    if (clientFamily !== undefined) {
      this.recordMcpClientIdentified(clientFamily);
    }
    this.dirty = true;
  }

  public recordMcpClientIdentified(clientFamily: McpClientFamily): void {
    this.clientSessions.set(
      clientFamily,
      (this.clientSessions.get(clientFamily) ?? 0) + 1
    );
    this.dirty = true;
  }

  public recordSessionFirstToolUse(nowMs = Date.now()): void {
    this.sessionsWithToolExecutionTotal += 1;
    const bucket = this.getOrCreateDayBucket(nowMs);
    bucket.mcpActiveSessions += 1;
    this.dirty = true;
  }

  public recordMcpToolCall(params: {
    readonly toolName: string;
    readonly isValid: boolean;
    readonly clientIp?: string | undefined;
    readonly clientFamily?: McpClientFamily | undefined;
    readonly nowMs?: number | undefined;
  }): void {
    const nowMs = params.nowMs ?? Date.now();
    if (this.toolCallsValid.has(params.toolName)) {
      if (params.isValid) {
        this.toolCallsValid.set(
          params.toolName,
          (this.toolCallsValid.get(params.toolName) ?? 0) + 1
        );
      } else {
        this.toolCallsInvalid.set(
          params.toolName,
          (this.toolCallsInvalid.get(params.toolName) ?? 0) + 1
        );
      }
    }
    const family = params.clientFamily ?? 'other-mcp';
    this.clientToolCalls.set(
      family,
      (this.clientToolCalls.get(family) ?? 0) + 1
    );
    const bucket = this.getOrCreateDayBucket(nowMs);
    bucket.mcpToolCalls += 1;
    if (params.clientIp !== undefined) {
      this.recordVisitor('mcp_connected', params.clientIp, nowMs);
      this.recordVisitor('mcp_active', params.clientIp, nowMs);
    }
    this.dirty = true;
  }

  public recordExportDownload(format: ExportDownloadFormat): void {
    this.exportDownloads.set(format, (this.exportDownloads.get(format) ?? 0) + 1);
    this.dirty = true;
  }

  public recordRateLimited(): void {
    this.rateLimitedRequestsTotal += 1;
    this.dirty = true;
  }

  public recordTraffic(params: {
    readonly channel: TrafficChannel;
    readonly bytesIn: number;
    readonly bytesOut: number;
    readonly countRequest?: boolean | undefined;
    readonly clientIp?: string | undefined;
    readonly nowMs?: number | undefined;
  }): void {
    const nowMs = params.nowMs ?? Date.now();
    const safeIn = Math.max(0, Math.floor(params.bytesIn));
    const safeOut = Math.max(0, Math.floor(params.bytesOut));
    if (params.countRequest !== false) {
      this.requestsByChannel.set(
        params.channel,
        (this.requestsByChannel.get(params.channel) ?? 0) + 1
      );
    }
    if (safeIn > 0) {
      this.bytesInByChannel.set(
        params.channel,
        (this.bytesInByChannel.get(params.channel) ?? 0) + safeIn
      );
    }
    if (safeOut > 0) {
      this.bytesOutByChannel.set(
        params.channel,
        (this.bytesOutByChannel.get(params.channel) ?? 0) + safeOut
      );
    }

    // Exclude internal `/health` checks from application user traffic windows
    if (params.channel !== 'health') {
      const bucket = this.getOrCreateDayBucket(nowMs);
      if (params.countRequest !== false) {
        bucket.requests += 1;
      }
      bucket.bytesIn += safeIn;
      bucket.bytesOut += safeOut;
    }

    if (params.clientIp !== undefined) {
      if (params.channel === 'web_viewer' || params.channel === 'websocket') {
        this.recordVisitor('web_viewer', params.clientIp, nowMs);
      } else if (params.channel === 'bot_scanner') {
        this.recordVisitor('bot_scanner', params.clientIp, nowMs);
      }
    }
    this.dirty = true;
  }

  private computeWindowSum(
    selector: (b: DailyTelemetryBucket) => number,
    nowMs: number
  ): TelemetryWindowCounts {
    const keys30 = getRecentDateKeys(nowMs, 30);
    let today = 0;
    let last7d = 0;
    let last30d = 0;
    for (let i = 0; i < keys30.length; i++) {
      const bucket = this.dailyBuckets.get(keys30[i]!);
      if (bucket === undefined) {
        continue;
      }
      const val = selector(bucket);
      if (i === 0) {
        today += val;
      }
      if (i < 7) {
        last7d += val;
      }
      last30d += val;
    }
    return { today, last7d, last30d };
  }

  private computeUniqueVisitorWindows(
    category: VisitorCategory,
    nowMs: number
  ): TelemetryWindowCounts {
    const keys30 = getRecentDateKeys(nowMs, 30);
    const setToday = new Set<string>();
    const set7d = new Set<string>();
    const set30d = new Set<string>();
    for (let i = 0; i < keys30.length; i++) {
      const bucket = this.dailyBuckets.get(keys30[i]!);
      if (bucket === undefined) {
        continue;
      }
      for (const digest of bucket.visitors[category]) {
        if (i === 0) {
          setToday.add(digest);
        }
        if (i < 7) {
          set7d.add(digest);
        }
        set30d.add(digest);
      }
    }
    return {
      today: setToday.size,
      last7d: set7d.size,
      last30d: set30d.size
    };
  }

  public getSummary(
    liveGauges: {
      readonly activeMcpSessions: number;
      readonly activeWebSocketClients: number;
    },
    nowMs = Date.now()
  ): RackTelemetrySummary {
    const byTransport: Record<McpTransportKind, number> = {
      'streamable-http': this.sessionsCreatedByTransport.get('streamable-http') ?? 0,
      sse: this.sessionsCreatedByTransport.get('sse') ?? 0,
      stdio: this.sessionsCreatedByTransport.get('stdio') ?? 0
    };
    const sessionsCreatedTotal =
      byTransport['streamable-http'] + byTransport.sse + byTransport.stdio;

    const byTool: Record<
      string,
      { readonly total: number; readonly valid: number; readonly invalid: number }
    > = {};
    let callsTotal = 0;
    for (const toolName of CANONICAL_MCP_TOOLS) {
      const valid = this.toolCallsValid.get(toolName) ?? 0;
      const invalid = this.toolCallsInvalid.get(toolName) ?? 0;
      const total = valid + invalid;
      callsTotal += total;
      byTool[toolName] = { total, valid, invalid };
    }

    const sessionsByClient = {} as Record<McpClientFamily, number>;
    const toolCallsByClient = {} as Record<McpClientFamily, number>;
    for (const family of MCP_CLIENT_FAMILIES) {
      sessionsByClient[family] = this.clientSessions.get(family) ?? 0;
      toolCallsByClient[family] = this.clientToolCalls.get(family) ?? 0;
    }

    const bytesOutByChannel = {} as Record<TrafficChannel, number>;
    const requestsByChannel = {} as Record<TrafficChannel, number>;
    let bytesOutTotal = 0;
    let bytesInTotal = 0;
    for (const channel of TRAFFIC_CHANNELS) {
      const outB = this.bytesOutByChannel.get(channel) ?? 0;
      const inB = this.bytesInByChannel.get(channel) ?? 0;
      bytesOutByChannel[channel] = outB;
      requestsByChannel[channel] = this.requestsByChannel.get(channel) ?? 0;
      bytesOutTotal += outB;
      bytesInTotal += inB;
    }

    const exportDownloadsByFormat = {} as Record<ExportDownloadFormat, number>;
    for (const fmt of EXPORT_DOWNLOAD_FORMATS) {
      exportDownloadsByFormat[fmt] = this.exportDownloads.get(fmt) ?? 0;
    }

    const uniqueVisitors: Record<VisitorCategory, TelemetryWindowCounts> = {
      mcp_active: this.computeUniqueVisitorWindows('mcp_active', nowMs),
      mcp_connected: this.computeUniqueVisitorWindows('mcp_connected', nowMs),
      web_viewer: this.computeUniqueVisitorWindows('web_viewer', nowMs),
      bot_scanner: this.computeUniqueVisitorWindows('bot_scanner', nowMs)
    };

    const callsWindow = this.computeWindowSum((b) => b.mcpToolCalls, nowMs);
    const bytesOutWindow = this.computeWindowSum((b) => b.bytesOut, nowMs);
    const createdWindow = this.computeWindowSum(
      (b) => b.mcpSessionsCreated,
      nowMs
    );
    const activeSessionsWindow = this.computeWindowSum(
      (b) => b.mcpActiveSessions,
      nowMs
    );

    const bytesOutHuman = {
      today: formatBytesHuman(bytesOutWindow.today),
      last7d: formatBytesHuman(bytesOutWindow.last7d),
      last30d: formatBytesHuman(bytesOutWindow.last30d),
      total: formatBytesHuman(bytesOutTotal)
    };

    return {
      status: 'ok',
      version: RACK_MCP_SERVER_VERSION,
      mode: this.mode,
      generatedAtIso: new Date(nowMs).toISOString(),
      live: {
        activeMcpSessions: liveGauges.activeMcpSessions,
        activeWebSocketClients: liveGauges.activeWebSocketClients
      },
      sessions: {
        createdTotal: sessionsCreatedTotal,
        withToolExecutionTotal: this.sessionsWithToolExecutionTotal,
        byTransport,
        createdWindow,
        activeSessionsWindow
      },
      uniqueVisitors,
      mcpTools: {
        callsTotal,
        callsWindow,
        byTool
      },
      aiClients: {
        sessionsByClient,
        toolCallsByClient
      },
      traffic: {
        bytesOutTotal,
        bytesInTotal,
        bytesOutWindow,
        bytesOutHuman,
        bytesOutByChannel,
        requestsByChannel,
        exportDownloadsByFormat,
        rateLimitedRequestsTotal: this.rateLimitedRequestsTotal
      },
      homepage: {
        active_sessions: liveGauges.activeMcpSessions,
        active_mcp_users_24h_30d: `${uniqueVisitors.mcp_active.today} / ${uniqueVisitors.mcp_active.last30d}`,
        mcp_tool_calls_24h_total: `${callsWindow.today} / ${callsTotal}`,
        traffic_30d_human: bytesOutHuman.last30d
      }
    };
  }

  /**
   * Renders Prometheus text exposition format (`0.0.4`) with bounded label sets.
   */
  public renderPrometheusMetrics(
    liveGauges: {
      readonly activeMcpSessions: number;
      readonly activeWebSocketClients: number;
    },
    nowMs = Date.now()
  ): string {
    const s = this.getSummary(liveGauges, nowMs);
    const lines: string[] = [];

    lines.push('# HELP rack_mcp_up Whether the RackArchitect MCP server is healthy.');
    lines.push('# TYPE rack_mcp_up gauge');
    lines.push('rack_mcp_up 1');

    lines.push('# HELP rack_mcp_info Build and mode metadata.');
    lines.push('# TYPE rack_mcp_info gauge');
    lines.push(`rack_mcp_info{version="${s.version}",mode="${s.mode}"} 1`);

    lines.push('# HELP rack_mcp_active_sessions Currently active remote MCP sessions in memory.');
    lines.push('# TYPE rack_mcp_active_sessions gauge');
    lines.push(`rack_mcp_active_sessions ${s.live.activeMcpSessions}`);

    lines.push('# HELP rack_mcp_active_websocket_clients Currently open 3D Web-Viewer WebSocket connections.');
    lines.push('# TYPE rack_mcp_active_websocket_clients gauge');
    lines.push(`rack_mcp_active_websocket_clients ${s.live.activeWebSocketClients}`);

    lines.push('# HELP rack_mcp_sessions_created_total Total MCP sessions initialized since telemetry start.');
    lines.push('# TYPE rack_mcp_sessions_created_total counter');
    lines.push(`rack_mcp_sessions_created_total{transport="streamable-http"} ${s.sessions.byTransport['streamable-http']}`);
    lines.push(`rack_mcp_sessions_created_total{transport="sse"} ${s.sessions.byTransport.sse}`);
    lines.push(`rack_mcp_sessions_created_total{transport="stdio"} ${s.sessions.byTransport.stdio}`);

    lines.push('# HELP rack_mcp_sessions_with_tool_use_total Total MCP sessions that actively executed at least one tool.');
    lines.push('# TYPE rack_mcp_sessions_with_tool_use_total counter');
    lines.push(`rack_mcp_sessions_with_tool_use_total ${s.sessions.withToolExecutionTotal}`);

    lines.push('# HELP rack_mcp_unique_visitors Deduplicated GDPR-salted unique visitors by category and rolling window.');
    lines.push('# TYPE rack_mcp_unique_visitors gauge');
    for (const category of VISITOR_CATEGORIES) {
      const win = s.uniqueVisitors[category];
      lines.push(`rack_mcp_unique_visitors{category="${category}",window="today"} ${win.today}`);
      lines.push(`rack_mcp_unique_visitors{category="${category}",window="7d"} ${win.last7d}`);
      lines.push(`rack_mcp_unique_visitors{category="${category}",window="30d"} ${win.last30d}`);
    }

    lines.push('# HELP rack_mcp_tool_calls_total Total MCP tool invocations by tool name and validation status.');
    lines.push('# TYPE rack_mcp_tool_calls_total counter');
    for (const toolName of CANONICAL_MCP_TOOLS) {
      const entry = s.mcpTools.byTool[toolName];
      if (entry !== undefined) {
        lines.push(`rack_mcp_tool_calls_total{tool="${toolName}",status="VALID"} ${entry.valid}`);
        lines.push(`rack_mcp_tool_calls_total{tool="${toolName}",status="INVALID"} ${entry.invalid}`);
      }
    }

    lines.push('# HELP rack_mcp_tool_calls_window Rolling MCP tool call count over today, 7d, and 30d.');
    lines.push('# TYPE rack_mcp_tool_calls_window gauge');
    lines.push(`rack_mcp_tool_calls_window{window="today"} ${s.mcpTools.callsWindow.today}`);
    lines.push(`rack_mcp_tool_calls_window{window="7d"} ${s.mcpTools.callsWindow.last7d}`);
    lines.push(`rack_mcp_tool_calls_window{window="30d"} ${s.mcpTools.callsWindow.last30d}`);

    lines.push('# HELP rack_mcp_client_sessions_total Total MCP sessions by AI client family.');
    lines.push('# TYPE rack_mcp_client_sessions_total counter');
    for (const family of MCP_CLIENT_FAMILIES) {
      lines.push(`rack_mcp_client_sessions_total{client="${family}"} ${s.aiClients.sessionsByClient[family]}`);
    }

    lines.push('# HELP rack_mcp_client_tool_calls_total Total MCP tool calls by AI client family.');
    lines.push('# TYPE rack_mcp_client_tool_calls_total counter');
    for (const family of MCP_CLIENT_FAMILIES) {
      lines.push(`rack_mcp_client_tool_calls_total{client="${family}"} ${s.aiClients.toolCallsByClient[family]}`);
    }

    lines.push('# HELP rack_mcp_http_requests_total Total requests handled by traffic channel.');
    lines.push('# TYPE rack_mcp_http_requests_total counter');
    for (const channel of TRAFFIC_CHANNELS) {
      lines.push(`rack_mcp_http_requests_total{channel="${channel}"} ${s.traffic.requestsByChannel[channel]}`);
    }

    lines.push('# HELP rack_mcp_traffic_bytes_out_total Total outgoing bytes transmitted by channel.');
    lines.push('# TYPE rack_mcp_traffic_bytes_out_total counter');
    for (const channel of TRAFFIC_CHANNELS) {
      lines.push(`rack_mcp_traffic_bytes_out_total{channel="${channel}"} ${s.traffic.bytesOutByChannel[channel]}`);
    }

    lines.push('# HELP rack_mcp_traffic_window_bytes_out Outgoing application bytes over rolling today, 7d, and 30d windows.');
    lines.push('# TYPE rack_mcp_traffic_window_bytes_out gauge');
    lines.push(`rack_mcp_traffic_window_bytes_out{window="today"} ${s.traffic.bytesOutWindow.today}`);
    lines.push(`rack_mcp_traffic_window_bytes_out{window="7d"} ${s.traffic.bytesOutWindow.last7d}`);
    lines.push(`rack_mcp_traffic_window_bytes_out{window="30d"} ${s.traffic.bytesOutWindow.last30d}`);

    lines.push('# HELP rack_mcp_export_downloads_total Total CAD and 3D-print deliverable downloads by format.');
    lines.push('# TYPE rack_mcp_export_downloads_total counter');
    for (const fmt of EXPORT_DOWNLOAD_FORMATS) {
      lines.push(`rack_mcp_export_downloads_total{format="${fmt}"} ${s.traffic.exportDownloadsByFormat[fmt]}`);
    }

    lines.push('# HELP rack_mcp_rate_limited_requests_total Total requests rejected by per-IP rate limiting (HTTP 429).');
    lines.push('# TYPE rack_mcp_rate_limited_requests_total counter');
    lines.push(`rack_mcp_rate_limited_requests_total ${s.traffic.rateLimitedRequestsTotal}`);

    return `${lines.join('\n')}\n`;
  }

  private loadFromDiskIfPresent(filePath: string): void {
    try {
      if (!fs.existsSync(filePath)) {
        return;
      }
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw) as Partial<PersistedTelemetryState>;
      if (parsed.schemaVersion !== 1) {
        return;
      }
      if (
        typeof parsed.saltHex === 'string' &&
        /^[0-9a-fA-F]{32,128}$/.test(parsed.saltHex)
      ) {
        this.saltHex = parsed.saltHex.toLowerCase();
      }
      if (typeof parsed.startedAtIso === 'string') {
        this.startedAtIso = parsed.startedAtIso;
      }
      if (typeof parsed.sessionsWithToolExecutionTotal === 'number') {
        this.sessionsWithToolExecutionTotal = Math.max(
          0,
          parsed.sessionsWithToolExecutionTotal
        );
      }
      if (typeof parsed.rateLimitedRequestsTotal === 'number') {
        this.rateLimitedRequestsTotal = Math.max(
          0,
          parsed.rateLimitedRequestsTotal
        );
      }
      if (parsed.sessionsCreatedByTransport !== undefined) {
        for (const t of ['streamable-http', 'sse', 'stdio'] as const) {
          const val = parsed.sessionsCreatedByTransport[t];
          if (typeof val === 'number' && val >= 0) {
            this.sessionsCreatedByTransport.set(t, val);
          }
        }
      }
      for (const toolName of CANONICAL_MCP_TOOLS) {
        const vVal = parsed.toolCallsValidByTool?.[toolName];
        const iVal = parsed.toolCallsInvalidByTool?.[toolName];
        if (typeof vVal === 'number' && vVal >= 0) {
          this.toolCallsValid.set(toolName, vVal);
        }
        if (typeof iVal === 'number' && iVal >= 0) {
          this.toolCallsInvalid.set(toolName, iVal);
        }
      }
      for (const family of MCP_CLIENT_FAMILIES) {
        const sVal = parsed.clientSessionsByFamily?.[family];
        const cVal = parsed.clientToolCallsByFamily?.[family];
        if (typeof sVal === 'number' && sVal >= 0) {
          this.clientSessions.set(family, sVal);
        }
        if (typeof cVal === 'number' && cVal >= 0) {
          this.clientToolCalls.set(family, cVal);
        }
      }
      for (const channel of TRAFFIC_CHANNELS) {
        const rVal = parsed.requestsByChannel?.[channel];
        const outVal = parsed.bytesOutByChannel?.[channel];
        const inVal = parsed.bytesInByChannel?.[channel];
        if (typeof rVal === 'number' && rVal >= 0) {
          this.requestsByChannel.set(channel, rVal);
        }
        if (typeof outVal === 'number' && outVal >= 0) {
          this.bytesOutByChannel.set(channel, outVal);
        }
        if (typeof inVal === 'number' && inVal >= 0) {
          this.bytesInByChannel.set(channel, inVal);
        }
      }
      for (const fmt of EXPORT_DOWNLOAD_FORMATS) {
        const eVal = parsed.exportDownloadsByFormat?.[fmt];
        if (typeof eVal === 'number' && eVal >= 0) {
          this.exportDownloads.set(fmt, eVal);
        }
      }
      if (
        parsed.dailyBuckets !== undefined &&
        typeof parsed.dailyBuckets === 'object'
      ) {
        const allowedDays = new Set(
          getRecentDateKeys(Date.now(), MAX_RETENTION_DAYS)
        );
        for (const [dateKey, rawBucket] of Object.entries(parsed.dailyBuckets)) {
          if (!allowedDays.has(dateKey) || rawBucket === undefined) {
            continue;
          }
          const restored = createEmptyDailyBucket();
          restored.mcpToolCalls = Math.max(0, Number(rawBucket.mcpToolCalls) || 0);
          restored.mcpSessionsCreated = Math.max(
            0,
            Number(rawBucket.mcpSessionsCreated) || 0
          );
          restored.mcpActiveSessions = Math.max(
            0,
            Number(rawBucket.mcpActiveSessions) || 0
          );
          restored.bytesOut = Math.max(0, Number(rawBucket.bytesOut) || 0);
          restored.bytesIn = Math.max(0, Number(rawBucket.bytesIn) || 0);
          restored.requests = Math.max(0, Number(rawBucket.requests) || 0);
          for (const category of VISITOR_CATEGORIES) {
            const arr = rawBucket.visitors?.[category];
            if (Array.isArray(arr)) {
              for (const digest of arr.slice(0, MAX_VISITOR_DIGESTS_PER_DAY)) {
                if (typeof digest === 'string' && /^[0-9a-f]{16}$/.test(digest)) {
                  restored.visitors[category].add(digest);
                }
              }
            }
          }
          this.dailyBuckets.set(dateKey, restored);
        }
      }
    } catch {
      // Never block server startup if optional telemetry checkpoint is absent or corrupt
    }
  }

  public flushSync(): void {
    if (this.telemetryFilePath === undefined) {
      return;
    }
    try {
      const dir = path.dirname(this.telemetryFilePath);
      fs.mkdirSync(dir, { recursive: true });

      const toolCallsValidByTool: Record<string, number> = {};
      const toolCallsInvalidByTool: Record<string, number> = {};
      for (const toolName of CANONICAL_MCP_TOOLS) {
        toolCallsValidByTool[toolName] = this.toolCallsValid.get(toolName) ?? 0;
        toolCallsInvalidByTool[toolName] =
          this.toolCallsInvalid.get(toolName) ?? 0;
      }

      const clientSessionsByFamily = {} as Record<McpClientFamily, number>;
      const clientToolCallsByFamily = {} as Record<McpClientFamily, number>;
      for (const family of MCP_CLIENT_FAMILIES) {
        clientSessionsByFamily[family] = this.clientSessions.get(family) ?? 0;
        clientToolCallsByFamily[family] = this.clientToolCalls.get(family) ?? 0;
      }

      const requestsByChannel = {} as Record<TrafficChannel, number>;
      const bytesOutByChannel = {} as Record<TrafficChannel, number>;
      const bytesInByChannel = {} as Record<TrafficChannel, number>;
      for (const channel of TRAFFIC_CHANNELS) {
        requestsByChannel[channel] = this.requestsByChannel.get(channel) ?? 0;
        bytesOutByChannel[channel] = this.bytesOutByChannel.get(channel) ?? 0;
        bytesInByChannel[channel] = this.bytesInByChannel.get(channel) ?? 0;
      }

      const exportDownloadsByFormat = {} as Record<ExportDownloadFormat, number>;
      for (const fmt of EXPORT_DOWNLOAD_FORMATS) {
        exportDownloadsByFormat[fmt] = this.exportDownloads.get(fmt) ?? 0;
      }

      const dailyBucketsObj: Record<string, PersistedDailyBucket> = {};
      for (const [dateKey, bucket] of this.dailyBuckets.entries()) {
        if (
          dateKey === '__proto__' ||
          dateKey === 'constructor' ||
          dateKey === 'prototype'
        ) {
          continue;
        }
        Object.defineProperty(dailyBucketsObj, dateKey, {
          value: {
            mcpToolCalls: bucket.mcpToolCalls,
            mcpSessionsCreated: bucket.mcpSessionsCreated,
            mcpActiveSessions: bucket.mcpActiveSessions,
            bytesOut: bucket.bytesOut,
            bytesIn: bucket.bytesIn,
            requests: bucket.requests,
            visitors: {
              mcp_active: Array.from(bucket.visitors.mcp_active),
              mcp_connected: Array.from(bucket.visitors.mcp_connected),
              web_viewer: Array.from(bucket.visitors.web_viewer),
              bot_scanner: Array.from(bucket.visitors.bot_scanner)
            }
          },
          enumerable: true,
          configurable: true,
          writable: true
        });
      }

      const payload: PersistedTelemetryState = {
        schemaVersion: 1,
        saltHex: this.saltHex,
        startedAtIso: this.startedAtIso,
        updatedAtIso: new Date().toISOString(),
        sessionsCreatedByTransport: {
          'streamable-http':
            this.sessionsCreatedByTransport.get('streamable-http') ?? 0,
          sse: this.sessionsCreatedByTransport.get('sse') ?? 0,
          stdio: this.sessionsCreatedByTransport.get('stdio') ?? 0
        },
        sessionsWithToolExecutionTotal: this.sessionsWithToolExecutionTotal,
        toolCallsValidByTool,
        toolCallsInvalidByTool,
        clientSessionsByFamily,
        clientToolCallsByFamily,
        requestsByChannel,
        bytesOutByChannel,
        bytesInByChannel,
        exportDownloadsByFormat,
        rateLimitedRequestsTotal: this.rateLimitedRequestsTotal,
        dailyBuckets: dailyBucketsObj
      };

      const tmpPath = `${this.telemetryFilePath}.tmp`;
      fs.writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
      fs.renameSync(tmpPath, this.telemetryFilePath);
      this.dirty = false;
    } catch {
      // Fail-open silently on read-only filesystems
    }
  }

  public close(): void {
    if (this.flushTimer !== undefined) {
      clearInterval(this.flushTimer);
    }
    if (this.dirty) {
      this.flushSync();
    }
  }
}
