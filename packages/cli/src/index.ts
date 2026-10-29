import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import {
  createRackMcpServer,
  generateAsciiElevation,
  ProjectStateManager,
  RackMcpToolHandlers,
  startRackSidecarServer,
  type RackMcpServerInstance,
  type RackSidecarServer
} from '@rack-mcp/mcp-server';

export interface ParsedCliArgs {
  readonly command: 'serve' | 'validate' | 'export';
  readonly projectPath?: string | undefined;
  readonly outDir?: string | undefined;
  readonly port: number;
  readonly host?: string | undefined;
  readonly stdio: boolean;
  readonly remoteMcp: boolean;
  readonly publicBaseUrl?: string | undefined;
  readonly maxSessions?: number | undefined;
}

export function parseCliArgs(
  argv: readonly string[],
  env: NodeJS.ProcessEnv = process.env
): ParsedCliArgs {
  let command: 'serve' | 'validate' | 'export' = 'serve';
  let projectPath: string | undefined;
  let outDir: string | undefined;
  let port =
    env['PORT'] !== undefined && !Number.isNaN(Number(env['PORT']))
      ? Number(env['PORT'])
      : 3100;
  let host: string | undefined = env['RACK_MCP_HOST'];
  let stdio = true;
  let explicitStdio = false;
  let remoteMcp =
    env['RACK_MCP_REMOTE'] === '1' || env['RACK_MCP_REMOTE'] === 'true';
  let publicBaseUrl: string | undefined = env['RACK_MCP_PUBLIC_URL'];
  let maxSessions: number | undefined =
    env['RACK_MCP_MAX_SESSIONS'] !== undefined &&
    !Number.isNaN(Number(env['RACK_MCP_MAX_SESSIONS']))
      ? Number(env['RACK_MCP_MAX_SESSIONS'])
      : undefined;

  let i = 0;
  if (argv[0] === 'validate' || argv[0] === 'export' || argv[0] === 'serve') {
    command = argv[0];
    i = 1;
    if (
      (command === 'validate' || command === 'export') &&
      argv[1] !== undefined &&
      !argv[1].startsWith('-')
    ) {
      projectPath = argv[1];
      i = 2;
    }
  }

  for (; i < argv.length; i++) {
    const arg = argv[i]!;
    if (arg === '--stdio') {
      stdio = true;
      explicitStdio = true;
    } else if (arg === '--no-stdio') {
      stdio = false;
      explicitStdio = true;
    } else if (arg === '--remote-mcp') {
      remoteMcp = true;
    } else if (arg === '--public-url' && argv[i + 1] !== undefined) {
      publicBaseUrl = argv[i + 1]!;
      i++;
    } else if (arg === '--max-sessions' && argv[i + 1] !== undefined) {
      const parsedMax = Number(argv[i + 1]);
      if (!Number.isNaN(parsedMax) && parsedMax > 0) {
        maxSessions = Math.floor(parsedMax);
      }
      i++;
    } else if (arg === '--port' && argv[i + 1] !== undefined) {
      const parsedPort = Number(argv[i + 1]);
      if (!Number.isNaN(parsedPort) && parsedPort >= 0) {
        port = parsedPort;
      }
      i++;
    } else if (arg === '--host' && argv[i + 1] !== undefined) {
      host = argv[i + 1]!;
      i++;
    } else if (arg === '--project' && argv[i + 1] !== undefined) {
      projectPath = argv[i + 1]!;
      i++;
    } else if (
      (arg === '--out-dir' || arg === '--output-dir' || arg === '-o') &&
      argv[i + 1] !== undefined
    ) {
      outDir = argv[i + 1]!;
      i++;
    }
  }

  if (remoteMcp && !explicitStdio) {
    stdio = false;
  }

  return {
    command,
    ...(projectPath !== undefined ? { projectPath } : {}),
    ...(outDir !== undefined ? { outDir } : {}),
    ...(host !== undefined ? { host } : {}),
    ...(publicBaseUrl !== undefined ? { publicBaseUrl } : {}),
    ...(maxSessions !== undefined ? { maxSessions } : {}),
    port,
    stdio,
    remoteMcp
  };
}

export interface CliExecutionResult {
  readonly exitCode: number;
  readonly output: string;
  readonly mcpServer?: RackMcpServerInstance | undefined;
  readonly sidecarServer?: RackSidecarServer | undefined;
}

function discoverActiveSidecarProjectPath(
  host: string,
  port: number
): Promise<string | undefined> {
  if (port <= 0) {
    return Promise.resolve(undefined);
  }
  return new Promise((resolve) => {
    const req = http.get(
      {
        hostname: host,
        port,
        path: '/api/state',
        timeout: 150
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          resolve(undefined);
          return;
        }
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(
              Buffer.concat(chunks).toString('utf8')
            ) as Record<string, unknown>;
            if (
              typeof parsed['projectPath'] === 'string' &&
              parsed['projectPath'].length > 0
            ) {
              resolve(parsed['projectPath']);
              return;
            }
          } catch {
            // Ignore parse errors
          }
          resolve(undefined);
        });
      }
    );
    req.on('timeout', () => {
      req.destroy();
      resolve(undefined);
    });
    req.on('error', () => {
      resolve(undefined);
    });
  });
}

/**
 * Executes the `rack-mcp` CLI command.
 * In `serve` (`--stdio`) mode, all human logs are written strictly to `process.stderr`
 * so `process.stdout` remains a clean JSON-RPC 2.0 stream.
 */
export async function runCli(
  argv: readonly string[],
  options: { readonly connectStdio?: boolean } = {}
): Promise<CliExecutionResult> {
  const parsed = parseCliArgs(argv);

  if (parsed.command === 'validate') {
    const targetPath = path.resolve(parsed.projectPath ?? 'rack.yaml');
    if (!fs.existsSync(targetPath)) {
      const msg = `Error: Project file not found at '${targetPath}'.`;
      return { exitCode: 1, output: msg };
    }
    const stateManager = new ProjectStateManager({ projectPath: targetPath });
    const scene = stateManager.getScene();
    const ascii = generateAsciiElevation(scene, stateManager.getCatalog());
    return {
      exitCode: scene.validation.is_valid ? 0 : 1,
      output: ascii
    };
  }

  if (parsed.command === 'export') {
    const targetPath = path.resolve(parsed.projectPath ?? 'rack.yaml');
    if (!fs.existsSync(targetPath)) {
      const msg = `Error: Project file not found at '${targetPath}'.`;
      return { exitCode: 1, output: msg };
    }
    const stateManager = new ProjectStateManager({ projectPath: targetPath });
    const handlers = new RackMcpToolHandlers(stateManager);
    const outDir =
      parsed.outDir !== undefined
        ? path.resolve(parsed.outDir)
        : path.dirname(targetPath);

    const envelope = handlers.exportDeliverables({
      formats: [
        'elevation-svg',
        'wiring-svg',
        'bom-md',
        'scene-glb',
        'carrier-scad',
        'carrier-stl'
      ],
      output_dir: outDir
    });

    const lines = [
      envelope.summary,
      `Validation Status: ${envelope.status}`,
      'Generated Deliverables:'
    ];
    const data = envelope.data as {
      readonly exported_files: ReadonlyArray<{
        readonly format: string;
        readonly path: string;
        readonly size_bytes: number;
      }>;
    };
    for (const f of data.exported_files) {
      lines.push(`  - [${f.format}] ${f.path} (${f.size_bytes} bytes)`);
    }

    return {
      exitCode: 0,
      output: lines.join('\n')
    };
  }

  // Hosted Multi-Session Remote MCP Mode (`--remote-mcp` or `RACK_MCP_REMOTE=1`)
  if (parsed.remoteMcp) {
    const stateManager = new ProjectStateManager({
      watchFile: false
    });
    const sidecarServer = await startRackSidecarServer(stateManager, {
      port: parsed.port,
      host: parsed.host ?? '0.0.0.0',
      remoteMcp: true,
      ...(parsed.publicBaseUrl !== undefined
        ? { publicBaseUrl: parsed.publicBaseUrl }
        : {}),
      ...(parsed.maxSessions !== undefined
        ? { maxSessions: parsed.maxSessions }
        : {})
    });

    const infoMsg = `[rack_architect_mcp] Started Hosted Multi-Session Remote MCP Server at ${sidecarServer.mcpUrl} (SSE: ${sidecarServer.sseUrl}, 3D Studio: ${sidecarServer.url})`;
    process.stderr.write(`${infoMsg}\n`);

    return {
      exitCode: 0,
      output: infoMsg,
      sidecarServer
    };
  }

  // Default: Local `serve` mode (MCP over stdio + HTTP/WebSocket Sidecar)
  const discoveredProjectPath =
    parsed.projectPath === undefined
      ? await discoverActiveSidecarProjectPath(
          parsed.host ?? '127.0.0.1',
          parsed.port
        )
      : undefined;
  const resolvedProject = path.resolve(
    parsed.projectPath ?? discoveredProjectPath ?? 'rack.yaml'
  );
  const stateManager = new ProjectStateManager({
    projectPath: resolvedProject,
    watchFile: true
  });

  const sidecarServer = await startRackSidecarServer(stateManager, {
    port: parsed.port,
    ...(parsed.host !== undefined ? { host: parsed.host } : {})
  });
  const mcpServer = createRackMcpServer(stateManager);

  const shouldConnectStdio = options.connectStdio ?? parsed.stdio;
  if (shouldConnectStdio) {
    await mcpServer.connectStdio();
  }

  const infoMsg = `[rack_architect_mcp] Started MCP server (project: ${resolvedProject}) & Sidecar at ${sidecarServer.url} (WS: ${sidecarServer.wsUrl})`;
  process.stderr.write(`${infoMsg}\n`);

  return {
    exitCode: 0,
    output: infoMsg,
    mcpServer,
    sidecarServer
  };
}
