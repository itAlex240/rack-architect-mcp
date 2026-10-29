import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as zlib from 'node:zlib';
import { WebSocket, WebSocketServer } from 'ws';
import {
  RACK_MCP_SERVER_NAME,
  serializeRackScene,
  type SerializedRackScene
} from '@rack-mcp/core-domain';
import {
  generateBomMarkdown,
  generateElevationSvg,
  generateGlbBinary,
  generateProjectPrintableCarriers,
  generateWiringSchematicSvg
} from '@rack-mcp/exporters';
import { RACK_MCP_SERVER_VERSION } from '../mcp/server.js';
import { RackMcpToolHandlers } from '../mcp/tool-handlers.js';
import {
  extractClientIp,
  RemoteSessionRegistry,
  SlidingWindowRateLimiter
} from '../remote/remote-session-registry.js';
import type {
  McpToolCallEntry,
  ProjectStateManager,
  StateChangeEvent
} from '../state-manager.js';

export interface SidecarWsMessage {
  readonly type: 'INITIAL_STATE' | 'STATE_UPDATED' | 'COMMAND_RESULT' | 'ERROR';
  readonly reason?: StateChangeEvent['reason'] | undefined;
  readonly projectPath?: string | null | undefined;
  readonly scene?: SerializedRackScene | undefined;
  readonly blueprints?: readonly unknown[] | undefined;
  readonly undoAvailable?: number | undefined;
  readonly redoAvailable?: number | undefined;
  readonly toolCallLog?: readonly McpToolCallEntry[] | undefined;
  readonly tool?: string | undefined;
  readonly result?: unknown;
  readonly message?: string | undefined;
}

export interface SidecarClientCommand {
  readonly type: 'COMMAND' | 'EXECUTE_TOOL';
  readonly tool:
    | 'search_catalog'
    | 'get_device_blueprint'
    | 'define_custom_blueprint'
    | 'init_rack'
    | 'mount_equipment'
    | 'modify_equipment'
    | 'connect_cables'
    | 'disconnect_cables'
    | 'plan_external_endpoints'
    | 'validate_rack'
    | 'export_deliverables'
    | 'undo_redo'
    | 'clear_tool_log';
  readonly args?: Record<string, unknown> | undefined;
}

export interface RackSidecarServerOptions {
  readonly port?: number | undefined;
  readonly host?: string | undefined;
  readonly remoteMcp?: boolean | undefined;
  readonly publicBaseUrl?: string | undefined;
  readonly maxSessions?: number | undefined;
  readonly sessionTtlMs?: number | undefined;
  readonly rateLimitPerMinute?: number | undefined;
}

export interface RackSidecarServer {
  readonly port: number;
  readonly host: string;
  readonly url: string;
  readonly wsUrl: string;
  readonly remoteMcp: boolean;
  readonly mcpUrl?: string | undefined;
  readonly sseUrl?: string | undefined;
  readonly remoteRegistry?: RemoteSessionRegistry | undefined;
  close(): Promise<void>;
}

const ALLOWED_LOCAL_ORIGINS = new Set([
  'http://127.0.0.1:3100',
  'http://localhost:3100',
  'http://127.0.0.1:5173',
  'http://localhost:5173'
]);

const COMPRESSIBLE_EXTENSIONS = new Set([
  '.html',
  '.js',
  '.css',
  '.svg',
  '.json',
  '.map'
]);

function setCorsHeaders(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  remoteMcp: boolean
): void {
  if (remoteMcp) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Mcp-Session-Id, Last-Event-ID, MCP-Protocol-Version, Authorization'
    );
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
  } else {
    const origin = req.headers.origin;
    if (origin !== undefined && ALLOWED_LOCAL_ORIGINS.has(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
      res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3100');
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

interface StaticAssetEntry {
  readonly contentType: string;
  readonly body: Buffer;
  readonly gzipBody?: Buffer | undefined;
  readonly cacheControl: string;
}

function loadStaticWebViewerAssets(): ReadonlyMap<string, StaticAssetEntry> {
  const assets = new Map<string, StaticAssetEntry>();
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const distRoot = path.resolve(currentDir, '../../../web-viewer/dist');
  if (!fs.existsSync(distRoot)) {
    return assets;
  }

  const mimeMap: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.map': 'application/json; charset=utf-8'
  };

  const walkDir = (dirPath: string, urlPrefix: string): void => {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const routePath = `${urlPrefix}/${entry.name}`;
      if (entry.isDirectory()) {
        walkDir(fullPath, routePath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (ext === '.map') {
          continue;
        }
        const contentType = mimeMap[ext] ?? 'application/octet-stream';
        const rawBody = fs.readFileSync(fullPath);
        const gzipBody =
          COMPRESSIBLE_EXTENSIONS.has(ext) && rawBody.byteLength >= 512
            ? zlib.gzipSync(rawBody, { level: 6 })
            : undefined;
        const cacheControl = routePath.startsWith('/assets/')
          ? 'public, max-age=31536000, immutable'
          : 'no-cache';
        assets.set(routePath, {
          contentType,
          body: rawBody,
          ...(gzipBody !== undefined ? { gzipBody } : {}),
          cacheControl
        });
      }
    }
  };

  walkDir(distRoot, '');
  return assets;
}

function sendBufferWithOptionalGzip(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  statusCode: number,
  headers: Record<string, string>,
  rawBuffer: Buffer,
  options: {
    readonly compressible?: boolean | undefined;
    readonly precomputedGzip?: Buffer | undefined;
  } = {}
): void {
  const acceptEncoding = req.headers['accept-encoding'];
  const acceptsGzip =
    typeof acceptEncoding === 'string' && acceptEncoding.includes('gzip');

  if (acceptsGzip && options.precomputedGzip !== undefined) {
    res.writeHead(statusCode, {
      ...headers,
      'Content-Encoding': 'gzip',
      Vary: 'Accept-Encoding',
      'Content-Length': String(options.precomputedGzip.byteLength)
    });
    res.end(options.precomputedGzip);
    return;
  }

  if (acceptsGzip && options.compressible === true && rawBuffer.byteLength >= 1024) {
    const compressed = zlib.gzipSync(rawBuffer, { level: 6 });
    res.writeHead(statusCode, {
      ...headers,
      'Content-Encoding': 'gzip',
      Vary: 'Accept-Encoding',
      'Content-Length': String(compressed.byteLength)
    });
    res.end(compressed);
    return;
  }

  res.writeHead(statusCode, {
    ...headers,
    'Content-Length': String(rawBuffer.byteLength)
  });
  res.end(rawBuffer);
}

function executeWsToolCommand(
  ws: WebSocket,
  rawData: unknown,
  targetHandlers: RackMcpToolHandlers,
  targetStateManager: ProjectStateManager
): void {
  try {
    const parsed = JSON.parse(String(rawData)) as SidecarClientCommand;
    if (parsed.type !== 'COMMAND' && parsed.type !== 'EXECUTE_TOOL') {
      return;
    }
    const args = (parsed.args ?? {}) as never;
    let result: unknown;
    switch (parsed.tool) {
      case 'search_catalog':
        result = targetHandlers.searchCatalog(args);
        break;
      case 'get_device_blueprint':
        result = targetHandlers.getDeviceBlueprint(args);
        break;
      case 'define_custom_blueprint':
        result = targetHandlers.defineCustomBlueprint(args);
        break;
      case 'init_rack':
        result = targetHandlers.initRack(args);
        break;
      case 'mount_equipment':
        result = targetHandlers.mountEquipment(args);
        break;
      case 'modify_equipment':
        result = targetHandlers.modifyEquipment(args);
        break;
      case 'connect_cables':
        result = targetHandlers.connectCables(args);
        break;
      case 'disconnect_cables':
        result = targetHandlers.disconnectCables(args);
        break;
      case 'plan_external_endpoints':
        result = targetHandlers.planExternalEndpoints(args);
        break;
      case 'validate_rack':
        result = targetHandlers.validateRack(args);
        break;
      case 'export_deliverables':
        result = targetHandlers.exportDeliverables(args);
        break;
      case 'undo_redo':
        result = targetHandlers.undoRedo(args);
        break;
      case 'clear_tool_log':
        targetStateManager.clearToolCallLog();
        result = { cleared: true };
        break;
      default: {
        const errReply: SidecarWsMessage = {
          type: 'ERROR',
          message: 'Unsupported WebSocket command tool.'
        };
        ws.send(JSON.stringify(errReply));
        return;
      }
    }

    const reply: SidecarWsMessage = {
      type: 'COMMAND_RESULT',
      tool: parsed.tool,
      result
    };
    ws.send(JSON.stringify(reply));
  } catch {
    const errReply: SidecarWsMessage = {
      type: 'ERROR',
      message: 'Invalid command payload or parameters.'
    };
    ws.send(JSON.stringify(errReply));
  }
}

/**
 * Starts the embedded HTTP + WebSocket Sidecar Server (`ws://localhost:3100/ws`)
 * and optional Multi-Session Hosted Remote MCP Server (`/mcp`, `/sse`, `/messages`).
 */
export async function startRackSidecarServer(
  stateManager: ProjectStateManager,
  options: RackSidecarServerOptions = {}
): Promise<RackSidecarServer> {
  const requestedPort = options.port ?? 3100;
  const remoteMcp = options.remoteMcp === true;
  const host = options.host ?? (remoteMcp ? '0.0.0.0' : '127.0.0.1');
  const localHandlers = new RackMcpToolHandlers(stateManager);
  const staticAssets = loadStaticWebViewerAssets();

  const remoteRegistry = remoteMcp
    ? new RemoteSessionRegistry({
        ...(options.publicBaseUrl !== undefined
          ? { publicBaseUrl: options.publicBaseUrl }
          : {}),
        ...(options.maxSessions !== undefined
          ? { maxSessions: options.maxSessions }
          : {}),
        ...(options.sessionTtlMs !== undefined
          ? { sessionTtlMs: options.sessionTtlMs }
          : {})
      })
    : undefined;

  const rateLimiter = remoteMcp
    ? new SlidingWindowRateLimiter(options.rateLimitPerMinute ?? 240, 60_000)
    : undefined;

  const resolveStateManagerForRequest = (
    requestUrl: URL
  ): {
    readonly targetStateManager: ProjectStateManager | undefined;
    readonly projectLabel: string | null;
  } => {
    if (!remoteMcp) {
      return {
        targetStateManager: stateManager,
        projectLabel: stateManager.getProjectPath() ?? null
      };
    }
    const sid = requestUrl.searchParams.get('session');
    const session = remoteRegistry?.getSession(sid);
    if (session === undefined) {
      return { targetStateManager: undefined, projectLabel: null };
    }
    return {
      targetStateManager: session.stateManager,
      projectLabel: `remote-session:${session.sessionId.slice(0, 8)}`
    };
  };

  const handleHttpRequest = async (
    req: http.IncomingMessage,
    res: http.ServerResponse
  ): Promise<void> => {
    setCorsHeaders(req, res, remoteMcp);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
    const pathname = requestUrl.pathname;

    // Apply per-IP rate limiting on dynamic MCP and API endpoints in remote mode
    if (
      rateLimiter !== undefined &&
      (pathname === '/mcp' ||
        pathname === '/sse' ||
        pathname === '/messages' ||
        pathname.startsWith('/api/'))
    ) {
      const check = rateLimiter.check(extractClientIp(req));
      if (!check.allowed) {
        res.writeHead(429, {
          'Content-Type': 'application/json; charset=utf-8',
          'Retry-After': String(check.retryAfterSeconds)
        });
        res.end(
          JSON.stringify({
            error: 'Too Many Requests',
            retry_after_seconds: check.retryAfterSeconds
          })
        );
        return;
      }
    }

    if (req.method === 'GET' && pathname === '/health') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(
        JSON.stringify({
          status: 'ok',
          version: RACK_MCP_SERVER_VERSION,
          mode: remoteMcp ? 'remote-mcp' : 'local-sidecar',
          ...(remoteRegistry !== undefined
            ? { activeSessions: remoteRegistry.getActiveSessionCount() }
            : {})
        })
      );
      return;
    }

    if (
      req.method === 'GET' &&
      (pathname === '/.well-known/mcp.json' || pathname === '/api/mcp-info')
    ) {
      remoteRegistry?.updateDynamicBaseUrl(req);
      const baseUrl =
        remoteRegistry?.getPublicBaseUrl() ?? `http://${host}:${requestedPort}`;
      const infoPayload = Buffer.from(
        JSON.stringify(
          {
            name: RACK_MCP_SERVER_NAME,
            version: RACK_MCP_SERVER_VERSION,
            mode: remoteMcp ? 'remote-mcp' : 'local-sidecar',
            transports: remoteMcp
              ? {
                  streamable_http: `${baseUrl}/mcp`,
                  sse: `${baseUrl}/sse`,
                  messages: `${baseUrl}/messages`
                }
              : { stdio: true },
            web_viewer_url: `${baseUrl}/`
          },
          null,
          2
        ),
        'utf8'
      );
      sendBufferWithOptionalGzip(
        req,
        res,
        200,
        { 'Content-Type': 'application/json; charset=utf-8' },
        infoPayload,
        { compressible: true }
      );
      return;
    }

    // Hosted Remote Multi-Session MCP Endpoints
    if (remoteRegistry !== undefined) {
      if (pathname === '/mcp') {
        await remoteRegistry.handleStreamableHttp(req, res);
        return;
      }
      if (req.method === 'GET' && pathname === '/sse') {
        await remoteRegistry.handleSseConnect(req, res);
        return;
      }
      if (req.method === 'POST' && pathname === '/messages') {
        await remoteRegistry.handleSsePostMessage(
          req,
          res,
          requestUrl.searchParams.get('sessionId')
        );
        return;
      }
    }

    if (req.method === 'GET' && pathname === '/api/state') {
      const { targetStateManager, projectLabel } =
        resolveStateManagerForRequest(requestUrl);
      if (targetStateManager === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
          JSON.stringify({
            error: 'No active remote MCP session specified. Append ?session=<id> or use standalone studio mode.'
          })
        );
        return;
      }
      const history = targetStateManager.getHistoryCounts();
      const payloadBuffer = Buffer.from(
        JSON.stringify({
          projectPath: projectLabel,
          scene: serializeRackScene(targetStateManager.getScene()),
          undoAvailable: history.undoAvailable,
          redoAvailable: history.redoAvailable,
          toolCallLog: targetStateManager.getToolCallLog()
        }),
        'utf8'
      );
      sendBufferWithOptionalGzip(
        req,
        res,
        200,
        { 'Content-Type': 'application/json; charset=utf-8' },
        payloadBuffer,
        { compressible: true }
      );
      return;
    }

    if (req.method === 'GET' && pathname === '/api/catalog') {
      const { targetStateManager } = resolveStateManagerForRequest(requestUrl);
      const effectiveState = targetStateManager ?? stateManager;
      const blueprints = effectiveState.getCatalog().getAllBlueprints();
      const payloadBuffer = Buffer.from(
        JSON.stringify({
          count: blueprints.length,
          blueprints
        }),
        'utf8'
      );
      sendBufferWithOptionalGzip(
        req,
        res,
        200,
        { 'Content-Type': 'application/json; charset=utf-8' },
        payloadBuffer,
        { compressible: true }
      );
      return;
    }

    if (req.method === 'GET' && pathname.startsWith('/api/export/')) {
      const { targetStateManager } = resolveStateManagerForRequest(requestUrl);
      if (targetStateManager === undefined) {
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Remote session not found or expired' }));
        return;
      }

      if (pathname === '/api/export/elevation.svg') {
        const svgBuffer = Buffer.from(
          generateElevationSvg(targetStateManager.getScene()),
          'utf8'
        );
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Content-Disposition': 'inline; filename="elevation.svg"',
            'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'"
          },
          svgBuffer,
          { compressible: true }
        );
        return;
      }

      if (pathname === '/api/export/wiring.svg') {
        const svgBuffer = Buffer.from(
          generateWiringSchematicSvg(targetStateManager.getScene()),
          'utf8'
        );
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Content-Disposition': 'inline; filename="wiring-schematic.svg"',
            'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'"
          },
          svgBuffer,
          { compressible: true }
        );
        return;
      }

      if (pathname === '/api/export/scene.glb') {
        const glb = generateGlbBinary(targetStateManager.getScene());
        const glbBuffer = Buffer.from(glb.buffer, glb.byteOffset, glb.byteLength);
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          {
            'Content-Type': 'model/gltf-binary',
            'Content-Disposition': 'attachment; filename="rack-scene.glb"'
          },
          glbBuffer,
          { compressible: true }
        );
        return;
      }

      if (pathname === '/api/export/bom.md') {
        const mdBuffer = Buffer.from(
          generateBomMarkdown(
            targetStateManager.getScene(),
            targetStateManager.getCatalog().toRecord()
          ),
          'utf8'
        );
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          {
            'Content-Type': 'text/markdown; charset=utf-8',
            'Content-Disposition': 'inline; filename="BOM.md"'
          },
          mdBuffer,
          { compressible: true }
        );
        return;
      }

      if (pathname === '/api/export/rack.yaml') {
        const yamlBuffer = Buffer.from(
          targetStateManager.getProjectYaml(),
          'utf8'
        );
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          {
            'Content-Type': 'text/yaml; charset=utf-8',
            'Content-Disposition': 'attachment; filename="rack.yaml"'
          },
          yamlBuffer,
          { compressible: true }
        );
        return;
      }

      if (pathname.startsWith('/api/export/printable/')) {
        const requestedFile = decodeURIComponent(
          pathname.slice('/api/export/printable/'.length)
        );
        const safeFile = path.basename(requestedFile);
        const carriers = generateProjectPrintableCarriers(
          targetStateManager.getScene()
        );
        for (const item of carriers) {
          if (path.basename(item.filename_stl) === safeFile) {
            const stlBuffer = Buffer.from(item.stl_ascii, 'utf8');
            sendBufferWithOptionalGzip(
              req,
              res,
              200,
              {
                'Content-Type': 'model/stl; charset=utf-8',
                'Content-Disposition': `attachment; filename="${safeFile}"`
              },
              stlBuffer,
              { compressible: true }
            );
            return;
          }
          if (path.basename(item.filename_scad) === safeFile) {
            const scadBuffer = Buffer.from(item.openscad_code, 'utf8');
            sendBufferWithOptionalGzip(
              req,
              res,
              200,
              {
                'Content-Type': 'application/x-openscad; charset=utf-8',
                'Content-Disposition': `attachment; filename="${safeFile}"`
              },
              scadBuffer,
              { compressible: true }
            );
            return;
          }
        }
        res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Printable carrier file not found in active rack' }));
        return;
      }
    }

    // Static SPA Hosting from pre-indexed in-memory asset map (zero path traversal surface)
    if (req.method === 'GET' && !pathname.startsWith('/api/')) {
      const routeKey = pathname === '/' ? '/index.html' : pathname;
      const asset = staticAssets.get(routeKey);
      if (asset !== undefined) {
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          {
            'Content-Type': asset.contentType,
            'Cache-Control': asset.cacheControl
          },
          asset.body,
          { precomputedGzip: asset.gzipBody }
        );
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: 'Not found' }));
  };

  const httpServer = http.createServer((req, res) => {
    void handleHttpRequest(req, res).catch(() => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      } else {
        res.end();
      }
    });
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && requestedPort > 0 && !remoteMcp) {
        // Another local sidecar instance is already serving port 3100; bind ephemeral port so stdio MCP agents never fail
        httpServer.once('error', reject);
        httpServer.listen(0, host, () => {
          httpServer.removeListener('error', reject);
          resolve();
        });
        return;
      }
      reject(err);
    };
    httpServer.once('error', onError);
    httpServer.listen(requestedPort, host, () => {
      httpServer.removeListener('error', onError);
      resolve();
    });
  });

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket, req: http.IncomingMessage) => {
    if (remoteRegistry !== undefined) {
      const wsUrlObj = new URL(req.url ?? '/ws', 'http://127.0.0.1');
      const sid = wsUrlObj.searchParams.get('session');
      const session = remoteRegistry.getSession(sid);
      if (session === undefined) {
        const errMsg: SidecarWsMessage = {
          type: 'ERROR',
          message: 'Remote session not found or expired.'
        };
        ws.send(JSON.stringify(errMsg));
        ws.close(1008, 'Session not found');
        return;
      }

      session.wsClients.add(ws);
      ws.on('close', () => {
        session.wsClients.delete(ws);
      });

      const history = session.stateManager.getHistoryCounts();
      const initialMsg: SidecarWsMessage = {
        type: 'INITIAL_STATE',
        reason: 'init',
        projectPath: `remote-session:${session.sessionId.slice(0, 8)}`,
        scene: serializeRackScene(session.stateManager.getScene()),
        blueprints: session.stateManager.getCatalog().getAllBlueprints(),
        undoAvailable: history.undoAvailable,
        redoAvailable: history.redoAvailable,
        toolCallLog: session.stateManager.getToolCallLog()
      };
      ws.send(JSON.stringify(initialMsg));

      ws.on('message', (rawData) => {
        session.lastAccessedAt = Date.now();
        executeWsToolCommand(ws, rawData, session.handlers, session.stateManager);
      });
      return;
    }

    const history = stateManager.getHistoryCounts();
    const initialMsg: SidecarWsMessage = {
      type: 'INITIAL_STATE',
      reason: 'init',
      projectPath: stateManager.getProjectPath() ?? null,
      scene: serializeRackScene(stateManager.getScene()),
      blueprints: stateManager.getCatalog().getAllBlueprints(),
      undoAvailable: history.undoAvailable,
      redoAvailable: history.redoAvailable,
      toolCallLog: stateManager.getToolCallLog()
    };
    ws.send(JSON.stringify(initialMsg));

    ws.on('message', (rawData) => {
      executeWsToolCommand(ws, rawData, localHandlers, stateManager);
    });
  });

  const unsubscribeLocal = !remoteMcp
    ? stateManager.onStateChange((event) => {
        const broadcastMsg: SidecarWsMessage = {
          type: 'STATE_UPDATED',
          reason: event.reason,
          projectPath: stateManager.getProjectPath() ?? null,
          scene: serializeRackScene(event.scene),
          blueprints: stateManager.getCatalog().getAllBlueprints(),
          undoAvailable: event.undoAvailable,
          redoAvailable: event.redoAvailable,
          toolCallLog: event.toolCallLog
        };
        const serialized = JSON.stringify(broadcastMsg);
        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(serialized);
          }
        }
      })
    : undefined;

  const addressInfo = httpServer.address();
  const boundPort =
    typeof addressInfo === 'object' && addressInfo !== null
      ? addressInfo.port
      : requestedPort;

  const baseUrl =
    options.publicBaseUrl !== undefined && options.publicBaseUrl.trim().length > 0
      ? options.publicBaseUrl.trim().replace(/\/+$/, '')
      : `http://${host}:${boundPort}`;

  return {
    port: boundPort,
    host,
    url: `http://${host}:${boundPort}`,
    wsUrl: `ws://${host}:${boundPort}/ws`,
    remoteMcp,
    ...(remoteMcp
      ? {
          mcpUrl: `${baseUrl}/mcp`,
          sseUrl: `${baseUrl}/sse`,
          remoteRegistry
        }
      : {}),
    async close(): Promise<void> {
      unsubscribeLocal?.();
      rateLimiter?.close();
      if (remoteRegistry !== undefined) {
        await remoteRegistry.closeAll();
      }
      for (const client of wss.clients) {
        client.terminate();
      }
      await new Promise<void>((resolve) => {
        wss.close(() => {
          httpServer.close(() => {
            resolve();
          });
        });
      });
    }
  };
}
