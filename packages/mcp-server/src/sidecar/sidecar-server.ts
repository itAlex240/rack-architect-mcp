import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import type { Duplex } from 'node:stream';
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
  readonly maxSessionsPerIp?: number | undefined;
  readonly maxNewSessionsPerMinutePerIp?: number | undefined;
  readonly maxRequestBodyBytes?: number | undefined;
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

const HTML_CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' ws: wss:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  "form-action 'self'"
].join('; ');

const MAX_WS_PAYLOAD_BYTES = 256 * 1024;
const MAX_WS_CONNECTIONS_PER_IP = 16;
const MAX_WS_CLIENTS_PER_SESSION = 8;

function tryExtractOrigin(rawUrl: string | undefined): string | undefined {
  if (rawUrl === undefined || rawUrl.trim().length === 0) {
    return undefined;
  }
  try {
    return new URL(rawUrl.trim()).origin;
  } catch {
    return undefined;
  }
}

function trimTrailingSlashes(raw: string): string {
  let end = raw.length;
  while (end > 0 && raw.charCodeAt(end - 1) === 47) {
    end--;
  }
  return raw.slice(0, end);
}

function isPublicCrossOriginMcpRoute(pathname: string): boolean {
  return (
    pathname === '/mcp' ||
    pathname === '/sse' ||
    pathname === '/messages' ||
    pathname === '/.well-known/mcp.json' ||
    pathname === '/api/mcp-info' ||
    pathname === '/api/catalog' ||
    pathname === '/health'
  );
}

function resolveAllowedViewerOrigin(
  originHeader: string | undefined,
  options: {
    readonly remoteMcp: boolean;
    readonly configuredPublicOrigin: string | undefined;
    readonly dynamicPublicOrigin: string | undefined;
    readonly boundHost: string;
    readonly boundPort: number;
  }
): string | undefined {
  if (originHeader === undefined || originHeader.length === 0) {
    return undefined;
  }
  const normalizedOrigin = tryExtractOrigin(originHeader);
  if (normalizedOrigin === undefined) {
    return undefined;
  }

  const localIpOrigin = `http://127.0.0.1:${options.boundPort}`;
  const localHostOrigin = `http://localhost:${options.boundPort}`;
  const localLoopbackAllowed =
    options.boundHost === '127.0.0.1' || options.boundHost === 'localhost';

  if (!options.remoteMcp) {
    for (const allowed of ALLOWED_LOCAL_ORIGINS) {
      if (normalizedOrigin === allowed) {
        return allowed;
      }
    }
    if (normalizedOrigin === localIpOrigin) {
      return localIpOrigin;
    }
    if (normalizedOrigin === localHostOrigin) {
      return localHostOrigin;
    }
    return undefined;
  }

  if (options.configuredPublicOrigin !== undefined) {
    if (normalizedOrigin === options.configuredPublicOrigin) {
      return options.configuredPublicOrigin;
    }
    if (localLoopbackAllowed) {
      if (normalizedOrigin === localIpOrigin) {
        return localIpOrigin;
      }
      if (normalizedOrigin === localHostOrigin) {
        return localHostOrigin;
      }
    }
    return undefined;
  }

  if (
    options.dynamicPublicOrigin !== undefined &&
    normalizedOrigin === options.dynamicPublicOrigin
  ) {
    return options.dynamicPublicOrigin;
  }

  const boundOrigin = `http://${options.boundHost}:${options.boundPort}`;
  if (normalizedOrigin === boundOrigin) {
    return boundOrigin;
  }
  if (localLoopbackAllowed) {
    if (normalizedOrigin === localIpOrigin) {
      return localIpOrigin;
    }
    if (normalizedOrigin === localHostOrigin) {
      return localHostOrigin;
    }
  }
  return undefined;
}

function setSecurityAndCorsHeaders(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  pathname: string,
  originPolicy: {
    readonly remoteMcp: boolean;
    readonly configuredPublicOrigin: string | undefined;
    readonly dynamicPublicOrigin: string | undefined;
    readonly boundHost: string;
    readonly boundPort: number;
  }
): void {
  // Baseline defensive HTTP headers on every response
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');

  if (originPolicy.remoteMcp && isPublicCrossOriginMcpRoute(pathname)) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Accept, Mcp-Session-Id, Last-Event-ID, MCP-Protocol-Version, Authorization'
    );
    res.setHeader('Access-Control-Expose-Headers', 'Mcp-Session-Id');
    return;
  }

  const matchedAllowedOrigin = resolveAllowedViewerOrigin(
    req.headers.origin,
    originPolicy
  );
  if (matchedAllowedOrigin !== undefined) {
    res.setHeader('Access-Control-Allow-Origin', matchedAllowedOrigin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  } else if (!originPolicy.remoteMcp) {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3100');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
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

function rejectUpgradeSocket(
  socket: Duplex,
  statusLine: string,
  bodyText = ''
): void {
  try {
    const payload =
      `HTTP/1.1 ${statusLine}\r\n` +
      'Content-Type: text/plain; charset=utf-8\r\n' +
      `Content-Length: ${Buffer.byteLength(bodyText, 'utf8')}\r\n` +
      'Connection: close\r\n\r\n' +
      bodyText;
    socket.write(payload);
  } catch {
    // Ignore socket write errors on teardown
  } finally {
    socket.destroy();
  }
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
      case 'export_deliverables': {
        // Never accept arbitrary host `output_dir` overrides over WebSocket frames
        const rawExportArgs = parsed.args ?? {};
        const safeExportArgs = Array.isArray(rawExportArgs['formats'])
          ? ({ formats: rawExportArgs['formats'] } as never)
          : ({} as never);
        result = targetHandlers.exportDeliverables(safeExportArgs);
        break;
      }
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
  const configuredPublicOrigin = tryExtractOrigin(options.publicBaseUrl);

  const remoteRegistry = remoteMcp
    ? new RemoteSessionRegistry({
        ...(options.publicBaseUrl !== undefined
          ? { publicBaseUrl: options.publicBaseUrl }
          : {}),
        ...(options.maxSessions !== undefined
          ? { maxSessions: options.maxSessions }
          : {}),
        ...(options.maxSessionsPerIp !== undefined
          ? { maxSessionsPerIp: options.maxSessionsPerIp }
          : {}),
        ...(options.maxNewSessionsPerMinutePerIp !== undefined
          ? { maxNewSessionsPerMinutePerIp: options.maxNewSessionsPerMinutePerIp }
          : {}),
        ...(options.maxRequestBodyBytes !== undefined
          ? { maxRequestBodyBytes: options.maxRequestBodyBytes }
          : {}),
        ...(options.sessionTtlMs !== undefined
          ? { sessionTtlMs: options.sessionTtlMs }
          : {})
      })
    : undefined;

  const rateLimiter = remoteMcp
    ? new SlidingWindowRateLimiter(options.rateLimitPerMinute ?? 240, 60_000)
    : undefined;

  let activeBoundPort = requestedPort;

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
    const requestUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
    const pathname = requestUrl.pathname;

    setSecurityAndCorsHeaders(req, res, pathname, {
      remoteMcp,
      configuredPublicOrigin,
      dynamicPublicOrigin: tryExtractOrigin(remoteRegistry?.getPublicBaseUrl()),
      boundHost: host,
      boundPort: activeBoundPort
    });

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

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
        req.resume();
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
        remoteRegistry?.getPublicBaseUrl() ?? `http://${host}:${activeBoundPort}`;
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
        let requestedFile: string;
        try {
          requestedFile = decodeURIComponent(
            pathname.slice('/api/export/printable/'.length)
          );
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ error: 'Malformed printable filename URI' }));
          return;
        }
        const safeFile = path
          .basename(requestedFile)
          .replace(/[^a-zA-Z0-9._-]/g, '_');
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
        const assetHeaders: Record<string, string> = {
          'Content-Type': asset.contentType,
          'Cache-Control': asset.cacheControl,
          ...(asset.contentType.startsWith('text/html')
            ? { 'Content-Security-Policy': HTML_CONTENT_SECURITY_POLICY }
            : {})
        };
        sendBufferWithOptionalGzip(
          req,
          res,
          200,
          assetHeaders,
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

  // Slowloris, Slow-POST, and header-flood HTTP hardening
  httpServer.headersTimeout = 15_000;
  httpServer.requestTimeout = 60_000;
  httpServer.keepAliveTimeout = 15_000;
  httpServer.maxHeadersCount = 64;

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

  const addressInfo = httpServer.address();
  const boundPort =
    typeof addressInfo === 'object' && addressInfo !== null
      ? addressInfo.port
      : requestedPort;
  activeBoundPort = boundPort;

  const wss = new WebSocketServer({
    noServer: true,
    maxPayload: MAX_WS_PAYLOAD_BYTES,
    perMessageDeflate: false
  });

  const wsConnectionsByIp = new Map<string, number>();

  httpServer.on('upgrade', (req: http.IncomingMessage, socket: Duplex, head: Buffer) => {
    socket.on('error', () => {
      socket.destroy();
    });

    const upgradeUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
    if (upgradeUrl.pathname !== '/ws') {
      rejectUpgradeSocket(socket, '404 Not Found', 'WebSocket endpoint not found');
      return;
    }

    // Cross-Site WebSocket Hijacking (CSWSH) Origin verification whenever browser sends Origin
    const originHeader = req.headers.origin;
    if (
      originHeader !== undefined &&
      resolveAllowedViewerOrigin(originHeader, {
        remoteMcp,
        configuredPublicOrigin,
        dynamicPublicOrigin: tryExtractOrigin(remoteRegistry?.getPublicBaseUrl()),
        boundHost: host,
        boundPort
      }) === undefined
    ) {
      rejectUpgradeSocket(socket, '403 Forbidden', 'Forbidden WebSocket Origin');
      return;
    }

    const clientIp = extractClientIp(req);
    if (remoteMcp) {
      if (rateLimiter !== undefined) {
        const check = rateLimiter.check(clientIp);
        if (!check.allowed) {
          rejectUpgradeSocket(socket, '429 Too Many Requests', 'Rate limit exceeded');
          return;
        }
      }

      const activeForIp = wsConnectionsByIp.get(clientIp) ?? 0;
      if (activeForIp >= MAX_WS_CONNECTIONS_PER_IP) {
        rejectUpgradeSocket(
          socket,
          '429 Too Many Requests',
          'Too many concurrent WebSocket connections from this IP'
        );
        return;
      }

      const sid = upgradeUrl.searchParams.get('session');
      const targetSession = remoteRegistry?.getSession(sid);
      if (
        targetSession !== undefined &&
        targetSession.wsClients.size >= MAX_WS_CLIENTS_PER_SESSION
      ) {
        rejectUpgradeSocket(
          socket,
          '429 Too Many Requests',
          'Too many concurrent viewer tabs for this session'
        );
        return;
      }
    }

    wss.handleUpgrade(req, socket, head, (ws) => {
      const prevCount = wsConnectionsByIp.get(clientIp) ?? 0;
      wsConnectionsByIp.set(clientIp, prevCount + 1);

      ws.once('close', () => {
        const current = wsConnectionsByIp.get(clientIp) ?? 1;
        if (current <= 1) {
          wsConnectionsByIp.delete(clientIp);
        } else {
          wsConnectionsByIp.set(clientIp, current - 1);
        }
      });

      ws.on('error', () => {
        try {
          ws.terminate();
        } catch {
          // Ignore close errors after maxPayload / protocol violation
        }
      });

      wss.emit('connection', ws, req);
    });
  });

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

  const baseUrl =
    options.publicBaseUrl !== undefined && options.publicBaseUrl.trim().length > 0
      ? trimTrailingSlashes(options.publicBaseUrl.trim())
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
      wsConnectionsByIp.clear();
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
