import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';
import {
  serializeRackScene,
  type SerializedRackScene
} from '@rack-mcp/core-domain';
import {
  generateBomMarkdown,
  generateElevationSvg,
  generateGlbBinary,
  generateWiringSchematicSvg
} from '@rack-mcp/exporters';
import { RackMcpToolHandlers } from '../mcp/tool-handlers.js';
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
}

export interface RackSidecarServer {
  readonly port: number;
  readonly host: string;
  readonly url: string;
  readonly wsUrl: string;
  close(): Promise<void>;
}

const ALLOWED_LOCAL_ORIGINS = new Set([
  'http://127.0.0.1:3100',
  'http://localhost:3100',
  'http://127.0.0.1:5173',
  'http://localhost:5173'
]);

function setCorsHeaders(
  req: http.IncomingMessage,
  res: http.ServerResponse
): void {
  const origin = req.headers.origin;
  if (origin !== undefined && ALLOWED_LOCAL_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:3100');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
}

interface StaticAssetEntry {
  readonly contentType: string;
  readonly body: Buffer;
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
        const contentType = mimeMap[ext] ?? 'application/octet-stream';
        assets.set(routePath, {
          contentType,
          body: fs.readFileSync(fullPath)
        });
      }
    }
  };

  walkDir(distRoot, '');
  return assets;
}

/**
 * Starts the embedded HTTP + WebSocket Sidecar Server (`ws://localhost:3100/ws`)
 * for live 2D/3D synchronization and REST deliverable streaming.
 */
export async function startRackSidecarServer(
  stateManager: ProjectStateManager,
  options: RackSidecarServerOptions = {}
): Promise<RackSidecarServer> {
  const requestedPort = options.port ?? 3100;
  const host = options.host ?? '127.0.0.1';
  const handlers = new RackMcpToolHandlers(stateManager);
  const staticAssets = loadStaticWebViewerAssets();

  const httpServer = http.createServer((req, res) => {
    setCorsHeaders(req, res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
    const pathname = requestUrl.pathname;

    try {
      if (req.method === 'GET' && pathname === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
      }

      if (req.method === 'GET' && pathname === '/api/state') {
        const history = stateManager.getHistoryCounts();
        const payload = {
          projectPath: stateManager.getProjectPath() ?? null,
          scene: serializeRackScene(stateManager.getScene()),
          undoAvailable: history.undoAvailable,
          redoAvailable: history.redoAvailable,
          toolCallLog: stateManager.getToolCallLog()
        };
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(payload));
        return;
      }

      if (req.method === 'GET' && pathname === '/api/catalog') {
        const blueprints = stateManager.getCatalog().getAllBlueprints();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(
          JSON.stringify({
            count: blueprints.length,
            blueprints
          })
        );
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/elevation.svg') {
        const svgBuffer = Buffer.from(
          generateElevationSvg(stateManager.getScene()),
          'utf8'
        );
        res.writeHead(200, {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Content-Disposition': 'inline; filename="elevation.svg"',
          'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'"
        });
        res.end(svgBuffer);
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/wiring.svg') {
        const svgBuffer = Buffer.from(
          generateWiringSchematicSvg(stateManager.getScene()),
          'utf8'
        );
        res.writeHead(200, {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Content-Disposition': 'inline; filename="wiring-schematic.svg"',
          'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'"
        });
        res.end(svgBuffer);
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/scene.glb') {
        const glb = generateGlbBinary(stateManager.getScene());
        res.writeHead(200, {
          'Content-Type': 'model/gltf-binary',
          'Content-Disposition': 'attachment; filename="rack-scene.glb"',
          'Content-Length': String(glb.byteLength)
        });
        res.end(Buffer.from(glb.buffer, glb.byteOffset, glb.byteLength));
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/bom.md') {
        const mdBuffer = Buffer.from(
          generateBomMarkdown(
            stateManager.getScene(),
            stateManager.getCatalog().toRecord()
          ),
          'utf8'
        );
        res.writeHead(200, {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Disposition': 'inline; filename="BOM.md"'
        });
        res.end(mdBuffer);
        return;
      }

      // Static SPA Hosting from pre-indexed in-memory asset map (zero path traversal surface)
      if (req.method === 'GET' && !pathname.startsWith('/api/')) {
        const routeKey = pathname === '/' ? '/index.html' : pathname;
        const asset = staticAssets.get(routeKey);
        if (asset !== undefined) {
          res.writeHead(200, { 'Content-Type': asset.contentType });
          res.end(asset.body);
          return;
        }
      }

      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });

  await new Promise<void>((resolve, reject) => {
    const onError = (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE' && requestedPort > 0) {
        // Another sidecar instance is already serving port 3100; bind ephemeral port so stdio MCP agents never fail
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

  wss.on('connection', (ws: WebSocket) => {
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
      try {
        const parsed = JSON.parse(String(rawData)) as SidecarClientCommand;
        if (parsed.type !== 'COMMAND' && parsed.type !== 'EXECUTE_TOOL') {
          return;
        }
        const args = (parsed.args ?? {}) as never;
        let result: unknown;
        switch (parsed.tool) {
          case 'search_catalog':
            result = handlers.searchCatalog(args);
            break;
          case 'get_device_blueprint':
            result = handlers.getDeviceBlueprint(args);
            break;
          case 'define_custom_blueprint':
            result = handlers.defineCustomBlueprint(args);
            break;
          case 'init_rack':
            result = handlers.initRack(args);
            break;
          case 'mount_equipment':
            result = handlers.mountEquipment(args);
            break;
          case 'modify_equipment':
            result = handlers.modifyEquipment(args);
            break;
          case 'connect_cables':
            result = handlers.connectCables(args);
            break;
          case 'disconnect_cables':
            result = handlers.disconnectCables(args);
            break;
          case 'plan_external_endpoints':
            result = handlers.planExternalEndpoints(args);
            break;
          case 'validate_rack':
            result = handlers.validateRack(args);
            break;
          case 'export_deliverables':
            result = handlers.exportDeliverables(args);
            break;
          case 'undo_redo':
            result = handlers.undoRedo(args);
            break;
          case 'clear_tool_log':
            stateManager.clearToolCallLog();
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
    });
  });

  const unsubscribe = stateManager.onStateChange((event) => {
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
  });

  const addressInfo = httpServer.address();
  const boundPort =
    typeof addressInfo === 'object' && addressInfo !== null
      ? addressInfo.port
      : requestedPort;

  return {
    port: boundPort,
    host,
    url: `http://${host}:${boundPort}`,
    wsUrl: `ws://${host}:${boundPort}/ws`,
    async close(): Promise<void> {
      unsubscribe();
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
