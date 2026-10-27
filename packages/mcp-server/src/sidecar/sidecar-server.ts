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
import type { ProjectStateManager, StateChangeEvent } from '../state-manager.js';

export interface SidecarWsMessage {
  readonly type: 'INITIAL_STATE' | 'STATE_UPDATED' | 'COMMAND_RESULT' | 'ERROR';
  readonly reason?: StateChangeEvent['reason'] | undefined;
  readonly scene?: SerializedRackScene | undefined;
  readonly undoAvailable?: number | undefined;
  readonly redoAvailable?: number | undefined;
  readonly tool?: string | undefined;
  readonly result?: unknown;
  readonly message?: string | undefined;
}

export interface SidecarClientCommand {
  readonly type: 'COMMAND';
  readonly tool:
    | 'init_rack'
    | 'mount_equipment'
    | 'modify_equipment'
    | 'connect_cables'
    | 'disconnect_cables'
    | 'undo_redo';
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

function setCorsHeaders(res: http.ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
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

  const httpServer = http.createServer((req, res) => {
    setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const requestUrl = new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`);
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
          scene: serializeRackScene(stateManager.getScene()),
          undoAvailable: history.undoAvailable,
          redoAvailable: history.redoAvailable
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
        const svg = generateElevationSvg(stateManager.getScene());
        res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
        res.end(svg);
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/wiring.svg') {
        const svg = generateWiringSchematicSvg(stateManager.getScene());
        res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8' });
        res.end(svg);
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/scene.glb') {
        const glb = generateGlbBinary(stateManager.getScene());
        res.writeHead(200, {
          'Content-Type': 'model/gltf-binary',
          'Content-Length': String(glb.byteLength)
        });
        res.end(Buffer.from(glb.buffer, glb.byteOffset, glb.byteLength));
        return;
      }

      if (req.method === 'GET' && pathname === '/api/export/bom.md') {
        const md = generateBomMarkdown(
          stateManager.getScene(),
          stateManager.getCatalog().toRecord()
        );
        res.writeHead(200, { 'Content-Type': 'text/markdown; charset=utf-8' });
        res.end(md);
        return;
      }

      // Static SPA Hosting from packages/web-viewer/dist
      if (req.method === 'GET' && !pathname.startsWith('/api/')) {
        const currentDir = path.dirname(fileURLToPath(import.meta.url));
        const distRoot = path.resolve(currentDir, '../../../web-viewer/dist');
        const requestedRel = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
        const candidatePath = path.resolve(distRoot, requestedRel);

        if (
          candidatePath.startsWith(distRoot) &&
          fs.existsSync(candidatePath) &&
          fs.statSync(candidatePath).isFile()
        ) {
          const ext = path.extname(candidatePath).toLowerCase();
          const mimeMap: Record<string, string> = {
            '.html': 'text/html; charset=utf-8',
            '.js': 'application/javascript; charset=utf-8',
            '.css': 'text/css; charset=utf-8',
            '.svg': 'image/svg+xml; charset=utf-8',
            '.json': 'application/json; charset=utf-8',
            '.map': 'application/json; charset=utf-8'
          };
          const contentType = mimeMap[ext] ?? 'application/octet-stream';
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(fs.readFileSync(candidatePath));
          return;
        }
      }

      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: `Not found: ${pathname}` }));
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: msg }));
    }
  });

  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    const history = stateManager.getHistoryCounts();
    const initialMsg: SidecarWsMessage = {
      type: 'INITIAL_STATE',
      reason: 'init',
      scene: serializeRackScene(stateManager.getScene()),
      undoAvailable: history.undoAvailable,
      redoAvailable: history.redoAvailable
    };
    ws.send(JSON.stringify(initialMsg));

    ws.on('message', (rawData) => {
      try {
        const parsed = JSON.parse(String(rawData)) as SidecarClientCommand;
        if (parsed.type !== 'COMMAND') {
          return;
        }
        const args = (parsed.args ?? {}) as never;
        let result: unknown;
        switch (parsed.tool) {
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
          case 'undo_redo':
            result = handlers.undoRedo(args);
            break;
          default: {
            const errReply: SidecarWsMessage = {
              type: 'ERROR',
              message: `Unsupported WebSocket command tool.`
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
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const errReply: SidecarWsMessage = {
          type: 'ERROR',
          message: msg
        };
        ws.send(JSON.stringify(errReply));
      }
    });
  });

  const unsubscribe = stateManager.onStateChange((event) => {
    const broadcastMsg: SidecarWsMessage = {
      type: 'STATE_UPDATED',
      reason: event.reason,
      scene: serializeRackScene(event.scene),
      undoAvailable: event.undoAvailable,
      redoAvailable: event.redoAvailable
    };
    const serialized = JSON.stringify(broadcastMsg);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(serialized);
      }
    }
  });

  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(requestedPort, host, () => {
      httpServer.removeListener('error', reject);
      resolve();
    });
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
