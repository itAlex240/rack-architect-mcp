import * as crypto from 'node:crypto';
import type * as http from 'node:http';
import { WebSocket } from 'ws';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import {
  RACK_MCP_SERVER_NAME,
  serializeRackScene,
  type RackProject
} from '@rack-mcp/core-domain';
import {
  createRackMcpServer,
  RACK_MCP_SERVER_VERSION,
  type RackMcpServerInstance
} from '../mcp/server.js';
import type { RackMcpToolHandlers } from '../mcp/tool-handlers.js';
import type { SidecarWsMessage } from '../sidecar/sidecar-server.js';
import { ProjectStateManager } from '../state-manager.js';

export interface RemoteMcpSession {
  readonly sessionId: string;
  readonly ownerIp: string;
  readonly createdAt: number;
  lastAccessedAt: number;
  readonly stateManager: ProjectStateManager;
  readonly mcpServer: RackMcpServerInstance;
  readonly handlers: RackMcpToolHandlers;
  readonly streamableTransport?: StreamableHTTPServerTransport | undefined;
  readonly sseTransport?: SSEServerTransport | undefined;
  readonly wsClients: Set<WebSocket>;
  readonly unsubscribeStateChange: () => void;
}

export interface RemoteSessionRegistryOptions {
  readonly publicBaseUrl?: string | undefined;
  readonly initialProjectTemplate?: RackProject | undefined;
  readonly maxSessions?: number | undefined;
  readonly maxSessionsPerIp?: number | undefined;
  readonly maxNewSessionsPerMinutePerIp?: number | undefined;
  readonly maxCustomBlueprintsPerSession?: number | undefined;
  readonly sessionTtlMs?: number | undefined;
  readonly maxRequestBodyBytes?: number | undefined;
}

function isTrustedProxyAddress(remoteAddress: string | undefined): boolean {
  if (remoteAddress === undefined) {
    return false;
  }
  const normalized = remoteAddress.replace(/^::ffff:/, '');
  return (
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    normalized.startsWith('10.') ||
    normalized.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized)
  );
}

function normalizeIpToken(raw: string): string {
  return raw.trim().replace(/^::ffff:/, '').slice(0, 64);
}

export function extractClientIp(req: http.IncomingMessage): string {
  const peer = req.socket.remoteAddress;
  if (isTrustedProxyAddress(peer)) {
    const xRealIp = req.headers['x-real-ip'];
    if (typeof xRealIp === 'string' && xRealIp.trim().length > 0) {
      return normalizeIpToken(xRealIp);
    }
    const xff = req.headers['x-forwarded-for'];
    const rawXff = Array.isArray(xff) ? xff[xff.length - 1] : xff;
    if (typeof rawXff === 'string' && rawXff.length > 0) {
      // Use the rightmost hop appended by the trusted reverse proxy to prevent XFF left-prepending spoofing
      const hops = rawXff
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
      const rightmostHop = hops[hops.length - 1];
      if (rightmostHop !== undefined) {
        return normalizeIpToken(rightmostHop);
      }
    }
  }
  return normalizeIpToken(peer ?? 'unknown');
}

/**
 * Memory-bounded sliding-window per-IP rate limiter to prevent abuse and protect outbound bandwidth.
 */
export class SlidingWindowRateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly maxTrackedIps: number;
  private readonly buckets = new Map<string, number[]>();
  private readonly cleanupTimer: ReturnType<typeof setInterval>;

  public constructor(
    maxRequests = 240,
    windowMs = 60_000,
    maxTrackedIps = 10_000
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.maxTrackedIps = maxTrackedIps;
    this.cleanupTimer = setInterval(() => {
      this.prune(Date.now());
    }, Math.max(15_000, windowMs));
    this.cleanupTimer.unref();
  }

  public check(ip: string, now = Date.now()): {
    readonly allowed: boolean;
    readonly remaining: number;
    readonly retryAfterSeconds: number;
  } {
    const cutoff = now - this.windowMs;
    const existing = this.buckets.get(ip);
    if (existing === undefined && this.buckets.size >= this.maxTrackedIps) {
      this.prune(now);
      if (this.buckets.size >= this.maxTrackedIps) {
        const oldestKey = this.buckets.keys().next().value;
        if (oldestKey !== undefined) {
          this.buckets.delete(oldestKey);
        }
      }
    }

    const active =
      existing !== undefined ? existing.filter((ts) => ts > cutoff) : [];

    if (active.length >= this.maxRequests) {
      this.buckets.set(ip, active);
      const oldest = active[0] ?? now;
      const retryAfterMs = Math.max(1000, oldest + this.windowMs - now);
      return {
        allowed: false,
        remaining: 0,
        retryAfterSeconds: Math.ceil(retryAfterMs / 1000)
      };
    }

    active.push(now);
    this.buckets.set(ip, active);
    return {
      allowed: true,
      remaining: Math.max(0, this.maxRequests - active.length),
      retryAfterSeconds: 0
    };
  }

  private prune(now: number): void {
    const cutoff = now - this.windowMs;
    for (const [ip, timestamps] of this.buckets.entries()) {
      const active = timestamps.filter((ts) => ts > cutoff);
      if (active.length === 0) {
        this.buckets.delete(ip);
      } else {
        this.buckets.set(ip, active);
      }
    }
  }

  public close(): void {
    clearInterval(this.cleanupTimer);
    this.buckets.clear();
  }
}

type BoundedBodyResult =
  | { readonly ok: true; readonly parsed: unknown }
  | { readonly ok: false; readonly statusCode: 400 | 413 | 415; readonly message: string };

async function readBoundedJsonBody(
  req: http.IncomingMessage,
  maxBytes: number
): Promise<BoundedBodyResult> {
  const rawContentType = req.headers['content-type'] ?? '';
  if (!rawContentType.toLowerCase().includes('application/json')) {
    return {
      ok: false,
      statusCode: 415,
      message: 'Unsupported Content-Type: application/json is required.'
    };
  }

  const contentLengthHeader = req.headers['content-length'];
  if (typeof contentLengthHeader === 'string' && contentLengthHeader.length > 0) {
    const declaredLength = Number(contentLengthHeader);
    if (Number.isFinite(declaredLength) && declaredLength > maxBytes) {
      return {
        ok: false,
        statusCode: 413,
        message: `Payload Too Large: request body exceeds ${maxBytes} bytes.`
      };
    }
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  return await new Promise<BoundedBodyResult>((resolve) => {
    let settled = false;
    const finish = (result: BoundedBodyResult): void => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    req.on('data', (chunk: Buffer | string) => {
      if (settled) {
        return;
      }
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, 'utf8');
      totalBytes += buf.byteLength;
      if (totalBytes > maxBytes) {
        req.resume();
        finish({
          ok: false,
          statusCode: 413,
          message: `Payload Too Large: request body exceeds ${maxBytes} bytes.`
        });
        return;
      }
      chunks.push(buf);
    });

    req.on('error', () => {
      finish({
        ok: false,
        statusCode: 400,
        message: 'Failed to read HTTP request stream.'
      });
    });

    req.on('end', () => {
      if (settled) {
        return;
      }
      try {
        const rawText = Buffer.concat(chunks).toString('utf8');
        const parsed: unknown = JSON.parse(rawText);
        finish({ ok: true, parsed });
      } catch {
        finish({
          ok: false,
          statusCode: 400,
          message: 'Parse error: Invalid JSON payload.'
        });
      }
    });
  });
}

function isLoopbackHostHeader(host: string): boolean {
  const hostname = host.split(':')[0]?.toLowerCase() ?? '';
  return hostname === '127.0.0.1' || hostname === 'localhost';
}

/**
 * Multi-tenant in-memory session registry for Hosted Remote MCP (`Streamable HTTP` + legacy `SSE`).
 * Guarantees strict per-session isolation (zero host filesystem writes, zero cross-user state leakage),
 * per-IP fair-share tenant eviction protection, and real-time WebSocket synchronization to `/?session=<uuid>`.
 */
export class RemoteSessionRegistry {
  private readonly sessions = new Map<string, RemoteMcpSession>();
  private readonly configuredBaseUrl: string | undefined;
  private inferredBaseUrl = 'http://127.0.0.1:3100';
  private inferredBaseUrlLocked = false;
  private readonly initialProjectTemplate: RackProject | undefined;
  private readonly maxSessions: number;
  private readonly maxSessionsPerIp: number;
  private readonly maxCustomBlueprintsPerSession: number;
  private readonly sessionTtlMs: number;
  private readonly maxRequestBodyBytes: number;
  private readonly sessionCreationLimiter: SlidingWindowRateLimiter;
  private readonly sweepTimer: ReturnType<typeof setInterval>;

  public constructor(options: RemoteSessionRegistryOptions = {}) {
    this.configuredBaseUrl =
      options.publicBaseUrl !== undefined && options.publicBaseUrl.trim().length > 0
        ? options.publicBaseUrl.trim().replace(/\/+$/, '')
        : undefined;
    this.initialProjectTemplate =
      options.initialProjectTemplate !== undefined
        ? structuredClone(options.initialProjectTemplate)
        : undefined;
    this.maxSessions = options.maxSessions ?? 200;
    this.maxSessionsPerIp =
      options.maxSessionsPerIp ??
      (this.maxSessions >= 4
        ? Math.min(12, Math.max(2, Math.floor(this.maxSessions / 2)))
        : this.maxSessions);
    this.maxCustomBlueprintsPerSession =
      options.maxCustomBlueprintsPerSession ?? 32;
    this.sessionTtlMs = options.sessionTtlMs ?? 2 * 60 * 60 * 1000;
    this.maxRequestBodyBytes = options.maxRequestBodyBytes ?? 512 * 1024;
    this.sessionCreationLimiter = new SlidingWindowRateLimiter(
      options.maxNewSessionsPerMinutePerIp ?? 20,
      60_000
    );

    this.sweepTimer = setInterval(() => {
      void this.sweepExpiredSessions();
    }, 60_000);
    this.sweepTimer.unref();
  }

  public getPublicBaseUrl(): string {
    return this.configuredBaseUrl ?? this.inferredBaseUrl;
  }

  public updateDynamicBaseUrl(req: http.IncomingMessage): void {
    if (this.configuredBaseUrl !== undefined || this.inferredBaseUrlLocked) {
      return;
    }
    const peer = req.socket.remoteAddress;
    const trusted = isTrustedProxyAddress(peer);
    const protoHeader = trusted ? req.headers['x-forwarded-proto'] : undefined;
    const rawProto = Array.isArray(protoHeader) ? protoHeader[0] : protoHeader;
    const proto =
      rawProto === 'https' || rawProto === 'http' ? rawProto : 'http';

    const hostHeader =
      (trusted ? req.headers['x-forwarded-host'] : undefined) ??
      req.headers.host;
    const rawHost = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
    if (
      typeof rawHost === 'string' &&
      rawHost.length <= 253 &&
      /^[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*(?::\d{1,5})?$/.test(rawHost)
    ) {
      this.inferredBaseUrl = `${proto}://${rawHost}`;
      if (!isLoopbackHostHeader(rawHost)) {
        this.inferredBaseUrlLocked = true;
      }
    }
  }

  public getActiveSessionCount(): number {
    return this.sessions.size;
  }

  public getSession(sessionId: string | null | undefined): RemoteMcpSession | undefined {
    if (sessionId === undefined || sessionId === null || sessionId.length === 0) {
      return undefined;
    }
    const session = this.sessions.get(sessionId);
    if (session !== undefined) {
      session.lastAccessedAt = Date.now();
    }
    return session;
  }

  private createSessionRecord(
    sessionId: string,
    ownerIp: string,
    transports: {
      readonly streamableTransport?: StreamableHTTPServerTransport | undefined;
      readonly sseTransport?: SSEServerTransport | undefined;
    }
  ): RemoteMcpSession {
    const stateManager = new ProjectStateManager({
      ...(this.initialProjectTemplate !== undefined
        ? { initialProject: structuredClone(this.initialProjectTemplate) }
        : {}),
      maxHistory: 30,
      maxCustomBlueprints: this.maxCustomBlueprintsPerSession,
      watchFile: false
    });

    const mcpServer = createRackMcpServer(stateManager, {
      remoteSession: {
        sessionId,
        getPublicBaseUrl: () => this.getPublicBaseUrl()
      }
    });

    const wsClients = new Set<WebSocket>();
    const unsubscribeStateChange = stateManager.onStateChange((event) => {
      if (wsClients.size === 0) {
        return;
      }
      const broadcastMsg: SidecarWsMessage = {
        type: 'STATE_UPDATED',
        reason: event.reason,
        projectPath: `remote-session:${sessionId.slice(0, 8)}`,
        scene: serializeRackScene(event.scene),
        blueprints: stateManager.getCatalog().getAllBlueprints(),
        undoAvailable: event.undoAvailable,
        redoAvailable: event.redoAvailable,
        toolCallLog: event.toolCallLog
      };
      const serialized = JSON.stringify(broadcastMsg);
      for (const client of wsClients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(serialized);
        }
      }
    });

    const now = Date.now();
    return {
      sessionId,
      ownerIp,
      createdAt: now,
      lastAccessedAt: now,
      stateManager,
      mcpServer,
      handlers: mcpServer.handlers,
      streamableTransport: transports.streamableTransport,
      sseTransport: transports.sseTransport,
      wsClients,
      unsubscribeStateChange
    };
  }

  private pickOldestSessionId(
    candidates: Iterable<RemoteMcpSession>
  ): string | undefined {
    let candidateId: string | undefined;
    let oldestTs = Number.POSITIVE_INFINITY;
    for (const session of candidates) {
      const effectiveTs =
        session.wsClients.size > 0
          ? session.lastAccessedAt + 15 * 60 * 1000
          : session.lastAccessedAt;
      if (effectiveTs < oldestTs) {
        oldestTs = effectiveTs;
        candidateId = session.sessionId;
      }
    }
    return candidateId;
  }

  /**
   * Fair-share multi-tenant session capacity enforcement:
   * 1. Enforces per-IP concurrent session cap (`maxSessionsPerIp`) by evicting ONLY the caller IP's oldest session.
   * 2. If global `maxSessions` is still full across many distinct IPs, sweeps expired sessions first,
   *    then evicts from whichever IP currently holds the largest number of sessions (preventing single-tenant starvation).
   */
  private async enforceTenantAndGlobalCapacity(ownerIp: string): Promise<void> {
    const ownedByCaller: RemoteMcpSession[] = [];
    for (const session of this.sessions.values()) {
      if (session.ownerIp === ownerIp) {
        ownedByCaller.push(session);
      }
    }

    while (ownedByCaller.length >= this.maxSessionsPerIp) {
      const victimId = this.pickOldestSessionId(ownedByCaller);
      if (victimId === undefined) {
        break;
      }
      await this.deleteSession(victimId);
      const idx = ownedByCaller.findIndex((s) => s.sessionId === victimId);
      if (idx >= 0) {
        ownedByCaller.splice(idx, 1);
      } else {
        break;
      }
    }

    if (this.sessions.size < this.maxSessions) {
      return;
    }

    await this.sweepExpiredSessions();
    if (this.sessions.size < this.maxSessions) {
      return;
    }

    const byIp = new Map<string, RemoteMcpSession[]>();
    let maxPerIpCount = 0;
    for (const session of this.sessions.values()) {
      const list = byIp.get(session.ownerIp) ?? [];
      list.push(session);
      byIp.set(session.ownerIp, list);
      if (list.length > maxPerIpCount) {
        maxPerIpCount = list.length;
      }
    }

    const evictionPool: RemoteMcpSession[] = [];
    for (const list of byIp.values()) {
      if (list.length === maxPerIpCount) {
        evictionPool.push(...list);
      }
    }

    const candidateId = this.pickOldestSessionId(
      evictionPool.length > 0 ? evictionPool : this.sessions.values()
    );
    if (candidateId !== undefined) {
      await this.deleteSession(candidateId);
    }
  }

  public async sweepExpiredSessions(now = Date.now()): Promise<number> {
    const expiredIds: string[] = [];
    for (const [id, session] of this.sessions.entries()) {
      if (session.wsClients.size > 0) {
        // Keep session warm while an active 3D Web-Viewer WebSocket tab is open (up to 4x TTL max)
        if (now - session.lastAccessedAt > this.sessionTtlMs * 4) {
          expiredIds.push(id);
        }
      } else if (now - session.lastAccessedAt > this.sessionTtlMs) {
        expiredIds.push(id);
      }
    }
    for (const id of expiredIds) {
      await this.deleteSession(id);
    }
    return expiredIds.length;
  }

  public async deleteSession(sessionId: string): Promise<void> {
    const existing = this.sessions.get(sessionId);
    if (existing === undefined) {
      return;
    }
    this.sessions.delete(sessionId);
    existing.unsubscribeStateChange();
    existing.stateManager.stopWatching();
    for (const ws of existing.wsClients) {
      try {
        ws.close(1000, 'MCP session closed');
      } catch {
        // Ignore socket close errors
      }
    }
    existing.wsClients.clear();
    try {
      await existing.mcpServer.close();
    } catch {
      // Ignore already-closed transport errors
    }
  }

  private hasOversizedContentLength(req: http.IncomingMessage): boolean {
    const rawLen = req.headers['content-length'];
    if (typeof rawLen !== 'string' || rawLen.length === 0) {
      return false;
    }
    const parsed = Number(rawLen);
    return Number.isFinite(parsed) && parsed > this.maxRequestBodyBytes;
  }

  /**
   * Handles MCP Streamable HTTP requests (`POST /mcp`, `GET /mcp`, `DELETE /mcp`).
   */
  public async handleStreamableHttp(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    this.updateDynamicBaseUrl(req);

    if (req.method === 'POST' && this.hasOversizedContentLength(req)) {
      req.resume();
      res.writeHead(413, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: `Payload Too Large: request body exceeds ${this.maxRequestBodyBytes} bytes.`
          },
          id: null
        })
      );
      return;
    }

    const rawHeader = req.headers['mcp-session-id'];
    const sessionIdHeader = Array.isArray(rawHeader) ? rawHeader[0] : rawHeader;

    if (sessionIdHeader !== undefined && sessionIdHeader.length > 0) {
      const existing = this.sessions.get(sessionIdHeader);
      if (existing === undefined || existing.streamableTransport === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
          JSON.stringify({
            jsonrpc: '2.0',
            error: {
              code: -32001,
              message: 'MCP session not found or expired. Re-initialize a new session.'
            },
            id: null
          })
        );
        return;
      }

      existing.lastAccessedAt = Date.now();
      await existing.streamableTransport.handleRequest(req, res);
      if (req.method === 'DELETE') {
        await this.deleteSession(sessionIdHeader);
      }
      return;
    }

    // No Mcp-Session-Id header present
    if (req.method === 'GET') {
      const accept = req.headers.accept ?? '';
      if (!accept.includes('text/event-stream')) {
        const baseUrl = this.getPublicBaseUrl();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
          JSON.stringify(
            {
              name: RACK_MCP_SERVER_NAME,
              version: RACK_MCP_SERVER_VERSION,
              protocol: 'MCP Streamable HTTP (2025-03-26 / 2025-06-18)',
              status: 'ready',
              endpoints: {
                streamable_http: `${baseUrl}/mcp`,
                legacy_sse: `${baseUrl}/sse`,
                web_viewer_studio: `${baseUrl}/`
              },
              usage:
                'Connect any MCP client (Claude, Cursor, VS Code, Windsurf, Antigravity) to the streamable_http URL via POST /mcp.'
            },
            null,
            2
          )
        );
        return;
      }

      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Bad Request: Mcp-Session-Id header is required for GET /mcp SSE streams.'
          },
          id: null
        })
      );
      return;
    }

    if (req.method !== 'POST') {
      res.writeHead(405, {
        'Content-Type': 'application/json; charset=utf-8',
        Allow: 'GET, POST, DELETE, OPTIONS'
      });
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: { code: -32000, message: 'Method Not Allowed.' },
          id: null
        })
      );
      return;
    }

    // Enforce per-IP session creation rate limit before allocating session resources
    const clientIp = extractClientIp(req);
    const creationCheck = this.sessionCreationLimiter.check(clientIp);
    if (!creationCheck.allowed) {
      req.resume();
      res.writeHead(429, {
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': String(creationCheck.retryAfterSeconds)
      });
      res.end(
        JSON.stringify({
          jsonrpc: '2.0',
          error: {
            code: -32000,
            message: 'Too Many New MCP Sessions from this IP. Reuse your Mcp-Session-Id or retry shortly.'
          },
          id: null
        })
      );
      return;
    }

    // New Streamable HTTP session initialization via POST /mcp
    await this.enforceTenantAndGlobalCapacity(clientIp);
    const newSessionId = crypto.randomUUID();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => newSessionId,
      maxRequestBodySize: this.maxRequestBodyBytes,
      onsessionclosed: (closedId) => {
        void this.deleteSession(closedId);
      }
    });

    const session = this.createSessionRecord(newSessionId, clientIp, {
      streamableTransport: transport
    });
    this.sessions.set(newSessionId, session);

    try {
      await session.mcpServer.mcpServer.connect(transport);
      await transport.handleRequest(req, res);
    } finally {
      // If the client POST was not a valid `initialize` request, transport.sessionId remains undefined.
      // Dispose immediately so malformed POSTs never occupy session slots.
      if (transport.sessionId === undefined) {
        await this.deleteSession(newSessionId);
      }
    }
  }

  /**
   * Handles legacy HTTP+SSE MCP connection establishment (`GET /sse`).
   */
  public async handleSseConnect(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    this.updateDynamicBaseUrl(req);

    const clientIp = extractClientIp(req);
    const creationCheck = this.sessionCreationLimiter.check(clientIp);
    if (!creationCheck.allowed) {
      res.writeHead(429, {
        'Content-Type': 'application/json; charset=utf-8',
        'Retry-After': String(creationCheck.retryAfterSeconds)
      });
      res.end(
        JSON.stringify({
          error: 'Too Many New SSE Sessions',
          retry_after_seconds: creationCheck.retryAfterSeconds
        })
      );
      return;
    }

    await this.enforceTenantAndGlobalCapacity(clientIp);

    const sseTransport = new SSEServerTransport('/messages', res);
    const sid = sseTransport.sessionId;
    const session = this.createSessionRecord(sid, clientIp, { sseTransport });
    this.sessions.set(sid, session);

    const cleanupOnDisconnect = (): void => {
      void this.deleteSession(sid);
    };
    res.once('close', cleanupOnDisconnect);

    await session.mcpServer.mcpServer.connect(sseTransport);
  }

  /**
   * Handles legacy HTTP+SSE client JSON-RPC messages (`POST /messages?sessionId=<uuid>`).
   */
  public async handleSsePostMessage(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    sessionId: string | null
  ): Promise<void> {
    this.updateDynamicBaseUrl(req);
    if (sessionId === null || sessionId.length === 0) {
      req.resume();
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Missing sessionId query parameter' }));
      return;
    }

    const session = this.sessions.get(sessionId);
    if (session === undefined || session.sseTransport === undefined) {
      req.resume();
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'SSE session not found or expired' }));
      return;
    }

    const bodyResult = await readBoundedJsonBody(req, this.maxRequestBodyBytes);
    if (!bodyResult.ok) {
      res.writeHead(bodyResult.statusCode, {
        'Content-Type': 'application/json; charset=utf-8'
      });
      res.end(JSON.stringify({ error: bodyResult.message }));
      return;
    }

    session.lastAccessedAt = Date.now();
    try {
      await session.sseTransport.handlePostMessage(req, res, bodyResult.parsed);
    } catch {
      if (!res.headersSent) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Failed to process SSE JSON-RPC message.' }));
      }
    }
  }

  public async closeAll(): Promise<void> {
    clearInterval(this.sweepTimer);
    this.sessionCreationLimiter.close();
    const ids = Array.from(this.sessions.keys());
    for (const id of ids) {
      await this.deleteSession(id);
    }
  }
}
