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

export function extractClientIp(req: http.IncomingMessage): string {
  const peer = req.socket.remoteAddress;
  if (isTrustedProxyAddress(peer)) {
    const xRealIp = req.headers['x-real-ip'];
    if (typeof xRealIp === 'string' && xRealIp.trim().length > 0) {
      return xRealIp.trim();
    }
    const xff = req.headers['x-forwarded-for'];
    const rawXff = Array.isArray(xff) ? xff[0] : xff;
    if (typeof rawXff === 'string' && rawXff.length > 0) {
      const firstHop = rawXff.split(',')[0]?.trim();
      if (firstHop !== undefined && firstHop.length > 0) {
        return firstHop;
      }
    }
  }
  return (peer ?? 'unknown').replace(/^::ffff:/, '');
}

/**
 * Memory-bounded sliding-window per-IP rate limiter to prevent abuse and protect outbound bandwidth.
 */
export class SlidingWindowRateLimiter {
  private readonly maxRequests: number;
  private readonly windowMs: number;
  private readonly buckets = new Map<string, number[]>();
  private readonly cleanupTimer: ReturnType<typeof setInterval>;

  public constructor(maxRequests = 240, windowMs = 60_000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
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

/**
 * Multi-tenant in-memory session registry for Hosted Remote MCP (`Streamable HTTP` + legacy `SSE`).
 * Guarantees strict per-session isolation (zero host filesystem writes, zero cross-user state leakage)
 * and real-time WebSocket synchronization to `/?session=<uuid>` 3D Web-Viewer tabs.
 */
export class RemoteSessionRegistry {
  private readonly sessions = new Map<string, RemoteMcpSession>();
  private readonly configuredBaseUrl: string | undefined;
  private inferredBaseUrl = 'http://127.0.0.1:3100';
  private readonly initialProjectTemplate: RackProject | undefined;
  private readonly maxSessions: number;
  private readonly sessionTtlMs: number;
  private readonly maxRequestBodyBytes: number;
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
    this.sessionTtlMs = options.sessionTtlMs ?? 2 * 60 * 60 * 1000;
    this.maxRequestBodyBytes = options.maxRequestBodyBytes ?? 512 * 1024;

    this.sweepTimer = setInterval(() => {
      void this.sweepExpiredSessions();
    }, 60_000);
    this.sweepTimer.unref();
  }

  public getPublicBaseUrl(): string {
    return this.configuredBaseUrl ?? this.inferredBaseUrl;
  }

  public updateDynamicBaseUrl(req: http.IncomingMessage): void {
    if (this.configuredBaseUrl !== undefined) {
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
    if (typeof rawHost === 'string' && /^[a-zA-Z0-9._:-]+$/.test(rawHost)) {
      this.inferredBaseUrl = `${proto}://${rawHost}`;
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

  private async evictIfAtCapacity(): Promise<void> {
    if (this.sessions.size < this.maxSessions) {
      return;
    }
    await this.sweepExpiredSessions();
    if (this.sessions.size < this.maxSessions) {
      return;
    }
    // Evict least-recently-accessed session (preferring sessions without active browser WebSocket tabs)
    let candidateId: string | undefined;
    let oldestTs = Number.POSITIVE_INFINITY;
    for (const [id, session] of this.sessions.entries()) {
      const effectiveTs =
        session.wsClients.size > 0
          ? session.lastAccessedAt + 15 * 60 * 1000
          : session.lastAccessedAt;
      if (effectiveTs < oldestTs) {
        oldestTs = effectiveTs;
        candidateId = id;
      }
    }
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

  /**
   * Handles MCP Streamable HTTP requests (`POST /mcp`, `GET /mcp`, `DELETE /mcp`).
   */
  public async handleStreamableHttp(
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> {
    this.updateDynamicBaseUrl(req);

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

    // New Streamable HTTP session initialization via POST /mcp
    await this.evictIfAtCapacity();
    const newSessionId = crypto.randomUUID();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => newSessionId,
      maxRequestBodySize: this.maxRequestBodyBytes,
      onsessionclosed: (closedId) => {
        void this.deleteSession(closedId);
      }
    });

    const session = this.createSessionRecord(newSessionId, {
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
    await this.evictIfAtCapacity();

    const sseTransport = new SSEServerTransport('/messages', res);
    const sid = sseTransport.sessionId;
    const session = this.createSessionRecord(sid, { sseTransport });
    this.sessions.set(sid, session);

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
      res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Missing sessionId query parameter' }));
      return;
    }

    const session = this.sessions.get(sessionId);
    if (session === undefined || session.sseTransport === undefined) {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'SSE session not found or expired' }));
      return;
    }

    session.lastAccessedAt = Date.now();
    await session.sseTransport.handlePostMessage(req, res);
  }

  public async closeAll(): Promise<void> {
    clearInterval(this.sweepTimer);
    const ids = Array.from(this.sessions.keys());
    for (const id of ids) {
      await this.deleteSession(id);
    }
  }
}
