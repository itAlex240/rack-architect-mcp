import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
  HardwareBlueprintSchema,
  HardwareCategorySchema,
  MountTypeSchema,
  RackStandardSchema,
  type HardwareBlueprintInput,
  type RackStandard
} from '@rack-mcp/core-domain';
import {
  detectExternalImportFormat,
  importExternalInventory,
  type ExternalImportFormat
} from '@rack-mcp/exporters';
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
  readonly command: 'serve' | 'validate' | 'export' | 'import' | 'new-blueprint';
  readonly projectPath?: string | undefined;
  readonly outDir?: string | undefined;
  readonly outFile?: string | undefined;
  readonly importFormat?: ExternalImportFormat | undefined;
  readonly rackStandard?: RackStandard | undefined;
  readonly uHeight?: number | undefined;
  readonly railDepthMm?: number | undefined;
  readonly projectName?: string | undefined;
  readonly blueprintSlug?: string | undefined;
  readonly blueprintManufacturer?: string | undefined;
  readonly blueprintModel?: string | undefined;
  readonly blueprintCategory?: string | undefined;
  readonly blueprintMountType?: string | undefined;
  readonly widthMm?: number | undefined;
  readonly heightMm?: number | undefined;
  readonly depthMm?: number | undefined;
  readonly watts?: number | undefined;
  readonly rj45Count?: number | undefined;
  readonly sfpCount?: number | undefined;
  readonly powerConnector?: 'iec-c14' | 'dc-5525' | 'usb-c' | 'none' | undefined;
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
  let command: ParsedCliArgs['command'] = 'serve';
  let projectPath: string | undefined;
  let outDir: string | undefined;
  let outFile: string | undefined;
  let importFormat: ExternalImportFormat | undefined;
  let rackStandard: RackStandard | undefined;
  let uHeight: number | undefined;
  let railDepthMm: number | undefined;
  let projectName: string | undefined;
  let blueprintSlug: string | undefined;
  let blueprintManufacturer: string | undefined;
  let blueprintModel: string | undefined;
  let blueprintCategory: string | undefined;
  let blueprintMountType: string | undefined;
  let widthMm: number | undefined;
  let heightMm: number | undefined;
  let depthMm: number | undefined;
  let watts: number | undefined;
  let rj45Count: number | undefined;
  let sfpCount: number | undefined;
  let powerConnector: ParsedCliArgs['powerConnector'];
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
  if (
    argv[0] === 'validate' ||
    argv[0] === 'export' ||
    argv[0] === 'serve' ||
    argv[0] === 'import' ||
    argv[0] === 'new-blueprint'
  ) {
    command = argv[0];
    i = 1;
    if (
      (command === 'validate' || command === 'export' || command === 'import') &&
      argv[1] !== undefined &&
      !argv[1].startsWith('-')
    ) {
      projectPath = argv[1];
      i = 2;
    }
  }

  for (; i < argv.length; i++) {
    const arg = argv[i]!;
    const next = argv[i + 1];
    if (arg === '--stdio') {
      stdio = true;
      explicitStdio = true;
    } else if (arg === '--no-stdio') {
      stdio = false;
      explicitStdio = true;
    } else if (arg === '--remote-mcp') {
      remoteMcp = true;
    } else if (arg === '--public-url' && next !== undefined) {
      publicBaseUrl = next;
      i++;
    } else if (arg === '--max-sessions' && next !== undefined) {
      const parsedMax = Number(next);
      if (!Number.isNaN(parsedMax) && parsedMax > 0) {
        maxSessions = Math.floor(parsedMax);
      }
      i++;
    } else if (arg === '--port' && next !== undefined) {
      const parsedPort = Number(next);
      if (!Number.isNaN(parsedPort) && parsedPort >= 0) {
        port = parsedPort;
      }
      i++;
    } else if (arg === '--host' && next !== undefined) {
      host = next;
      i++;
    } else if ((arg === '--project' || arg === '--source' || arg === '-i') && next !== undefined) {
      projectPath = next;
      i++;
    } else if ((arg === '--out-dir' || arg === '--output-dir') && next !== undefined) {
      outDir = next;
      i++;
    } else if ((arg === '--out' || arg === '-o') && next !== undefined) {
      outFile = next;
      outDir = next;
      i++;
    } else if (arg === '--format' && next !== undefined) {
      if (next === 'netbox' || next === 'unifi' || next === 'proxmox') {
        importFormat = next;
      }
      i++;
    } else if (arg === '--standard' && next !== undefined) {
      const parsedStd = RackStandardSchema.safeParse(next);
      if (parsedStd.success) {
        rackStandard = parsedStd.data;
      }
      i++;
    } else if (arg === '--u-height' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n > 0) uHeight = n;
      i++;
    } else if (arg === '--depth' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n > 0) {
        railDepthMm = n;
        depthMm = n;
      }
      i++;
    } else if (arg === '--name' && next !== undefined) {
      projectName = next;
      i++;
    } else if (arg === '--slug' && next !== undefined) {
      blueprintSlug = next;
      i++;
    } else if (arg === '--manufacturer' && next !== undefined) {
      blueprintManufacturer = next;
      i++;
    } else if (arg === '--model' && next !== undefined) {
      blueprintModel = next;
      i++;
    } else if (arg === '--category' && next !== undefined) {
      blueprintCategory = next;
      i++;
    } else if (arg === '--mount-type' && next !== undefined) {
      blueprintMountType = next;
      i++;
    } else if (arg === '--width' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n > 0) widthMm = n;
      i++;
    } else if (arg === '--height' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n > 0) heightMm = n;
      i++;
    } else if (arg === '--watts' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n >= 0) watts = n;
      i++;
    } else if (arg === '--rj45' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n >= 0) rj45Count = Math.floor(n);
      i++;
    } else if (arg === '--sfp' && next !== undefined) {
      const n = Number(next);
      if (!Number.isNaN(n) && n >= 0) sfpCount = Math.floor(n);
      i++;
    } else if (arg === '--power' && next !== undefined) {
      if (
        next === 'iec-c14' ||
        next === 'dc-5525' ||
        next === 'usb-c' ||
        next === 'none'
      ) {
        powerConnector = next;
      }
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
    ...(outFile !== undefined ? { outFile } : {}),
    ...(importFormat !== undefined ? { importFormat } : {}),
    ...(rackStandard !== undefined ? { rackStandard } : {}),
    ...(uHeight !== undefined ? { uHeight } : {}),
    ...(railDepthMm !== undefined ? { railDepthMm } : {}),
    ...(projectName !== undefined ? { projectName } : {}),
    ...(blueprintSlug !== undefined ? { blueprintSlug } : {}),
    ...(blueprintManufacturer !== undefined ? { blueprintManufacturer } : {}),
    ...(blueprintModel !== undefined ? { blueprintModel } : {}),
    ...(blueprintCategory !== undefined ? { blueprintCategory } : {}),
    ...(blueprintMountType !== undefined ? { blueprintMountType } : {}),
    ...(widthMm !== undefined ? { widthMm } : {}),
    ...(heightMm !== undefined ? { heightMm } : {}),
    ...(depthMm !== undefined ? { depthMm } : {}),
    ...(watts !== undefined ? { watts } : {}),
    ...(rj45Count !== undefined ? { rj45Count } : {}),
    ...(sfpCount !== undefined ? { sfpCount } : {}),
    ...(powerConnector !== undefined ? { powerConnector } : {}),
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
              const candidate = path.resolve(parsed['projectPath']);
              const cwdRoot = path.resolve(process.cwd());
              const isYaml =
                candidate.endsWith('.yaml') || candidate.endsWith('.yml');
              if (
                isYaml &&
                (candidate === cwdRoot ||
                  candidate.startsWith(cwdRoot + path.sep))
              ) {
                resolve(candidate);
                return;
              }
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

    const envelope = handlers.exportDeliverables(
      {
        formats: [
          'elevation-svg',
          'wiring-svg',
          'bom-md',
          'scene-glb',
          'carrier-scad',
          'carrier-stl',
          'labels-csv',
          'labels-svg'
        ],
        output_dir: outDir
      },
      { allowTrustedCliOutDir: true }
    );

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

  if (parsed.command === 'import') {
    const sourcePath = path.resolve(parsed.projectPath ?? 'inventory.json');
    if (!fs.existsSync(sourcePath)) {
      return {
        exitCode: 1,
        output: `Error: Inventory source file not found at '${sourcePath}'.`
      };
    }
    const rawContent = fs.readFileSync(sourcePath, 'utf8');
    let parsedObj: unknown;
    try {
      parsedObj = parseYaml(rawContent);
    } catch (err) {
      return {
        exitCode: 1,
        output: `Error: Failed to parse '${sourcePath}': ${err instanceof Error ? err.message : String(err)}`
      };
    }
    const detected = parsed.importFormat ?? detectExternalImportFormat(parsedObj);
    if (detected === null) {
      return {
        exitCode: 1,
        output: `Error: Could not auto-detect inventory format for '${sourcePath}'. Pass --format netbox|unifi|proxmox explicitly.`
      };
    }
    const result = importExternalInventory(rawContent, {
      format: detected,
      ...(parsed.projectName !== undefined ? { projectName: parsed.projectName } : {}),
      ...(parsed.rackStandard !== undefined ? { rackStandard: parsed.rackStandard } : {}),
      ...(parsed.uHeight !== undefined ? { uHeight: parsed.uHeight } : {}),
      ...(parsed.railDepthMm !== undefined ? { railDepthMm: parsed.railDepthMm } : {})
    });

    if (parsed.outFile !== undefined) {
      const targetOut = path.resolve(parsed.outFile);
      fs.mkdirSync(path.dirname(targetOut), { recursive: true });
      fs.writeFileSync(targetOut, result.yaml, 'utf8');
      const warnText =
        result.warnings.length > 0
          ? `\nWarnings:\n${result.warnings.map((w) => `  - ${w}`).join('\n')}`
          : '';
      return {
        exitCode: 0,
        output: `Imported ${detected.toUpperCase()} inventory -> '${targetOut}' (${result.matchedDevices} matched, ${result.fallbackDevices} shelf fallback, ${result.importedCables} cable(s)).${warnText}`
      };
    }
    return {
      exitCode: 0,
      output: result.yaml
    };
  }

  if (parsed.command === 'new-blueprint') {
    const slug = parsed.blueprintSlug;
    const manufacturer = parsed.blueprintManufacturer ?? 'Community';
    const model = parsed.blueprintModel ?? slug ?? 'Custom Hardware Device';
    const catRes = HardwareCategorySchema.safeParse(parsed.blueprintCategory ?? 'compute-node');
    const mtRes = MountTypeSchema.safeParse(parsed.blueprintMountType ?? 'rackmount-10');
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return {
        exitCode: 1,
        output: 'Error: --slug is required and must use lowercase kebab-case (a-z0-9-).'
      };
    }
    if (!catRes.success) {
      return {
        exitCode: 1,
        output: `Error: Invalid --category '${parsed.blueprintCategory ?? ''}'.`
      };
    }
    if (!mtRes.success) {
      return {
        exitCode: 1,
        output: `Error: Invalid --mount-type '${parsed.blueprintMountType ?? ''}'.`
      };
    }
    const widthMm = parsed.widthMm ?? (mtRes.data === 'rackmount-19' ? 440 : 210);
    const heightMm = parsed.heightMm ?? 43.7;
    const depthMm = parsed.depthMm ?? 140;
    const uHeight = parsed.uHeight ?? Math.max(0.5, Number((heightMm / 44.45).toFixed(2)));
    const maxWatts = parsed.watts ?? 15;
    const rj45Count = Math.min(24, Math.max(0, parsed.rj45Count ?? 2));
    const sfpCount = Math.min(8, Math.max(0, parsed.sfpCount ?? 0));
    const pwrConn = parsed.powerConnector ?? 'dc-5525';

    const ports: NonNullable<HardwareBlueprintInput['ports']> = [];
    const totalFrontPorts = rj45Count + sfpCount;
    const frontSpacing = totalFrontPorts > 0 ? Math.min(18, Math.max(9.5, (widthMm - 24) / Math.max(1, totalFrontPorts))) : 15;
    const frontStartX = Math.max(12, (widthMm - (totalFrontPorts - 1) * frontSpacing) / 2);
    const frontY = Number((heightMm / 2).toFixed(1));
    for (let r = 0; r < rj45Count; r++) {
      ports.push({
        port_id: `eth${r + 1}`,
        label: `LAN ${r + 1}`,
        face: 'front',
        connector_type: 'rj45',
        direction: 'bidirectional',
        capabilities: ['1000base-t', '2500base-t'],
        coordinates: {
          x_mm: Number((frontStartX + r * frontSpacing).toFixed(1)),
          y_mm: frontY,
          orientation: 'upright'
        }
      });
    }
    for (let s = 0; s < sfpCount; s++) {
      ports.push({
        port_id: `sfp${s + 1}`,
        label: `SFP+ ${s + 1}`,
        face: 'front',
        connector_type: 'sfp-plus',
        direction: 'bidirectional',
        capabilities: ['10gbase-sr', '10gbase-dac'],
        coordinates: {
          x_mm: Number((frontStartX + (rj45Count + s) * frontSpacing).toFixed(1)),
          y_mm: frontY,
          orientation: 'upright'
        }
      });
    }
    if (pwrConn !== 'none') {
      ports.push({
        port_id: 'pwr_in',
        label: 'Power Input',
        face: 'rear',
        connector_type: pwrConn,
        direction: 'input',
        capabilities: [
          pwrConn === 'iec-c14' ? 'ac-mains' : pwrConn === 'usb-c' ? 'usb-pd' : 'dc-power'
        ],
        coordinates: {
          x_mm: Number(Math.max(10, widthMm - 22).toFixed(1)),
          y_mm: frontY,
          orientation: 'upright'
        }
      });
    }

    const rawBlueprint: HardwareBlueprintInput = {
      slug,
      manufacturer,
      model,
      description: `${manufacturer} ${model} hardware blueprint generated by rack-mcp new-blueprint.`,
      category: catRes.data,
      mount_type: mtRes.data,
      ...(mtRes.data === 'sub-module' ? { slot_compatibility: 'custom-sub-module' } : {}),
      geometry: {
        u_height: uHeight,
        width_mm: widthMm,
        height_mm: heightMm,
        depth_mm: depthMm,
        ear_mount_style:
          mtRes.data === 'rackmount-19'
            ? 'included-19inch-ears'
            : mtRes.data === 'rackmount-10'
              ? 'included-10inch-ears'
              : mtRes.data === 'rackmount-6'
                ? 'included-6inch-ears'
                : 'sub-module-clip',
        front_protrusion_mm: 2.0,
        rear_protrusion_mm: 0.0,
        weight_grams: Math.round(maxWatts * 45 + 350)
      },
      power_and_thermal: {
        electrical_role:
          catRes.data === 'ups'
            ? 'ups'
            : catRes.data === 'pdu'
              ? 'pdu'
              : catRes.data === 'patch-panel' || catRes.data === 'blank-panel' || catRes.data === 'brush-panel' || catRes.data === 'shelf'
                ? 'passive'
                : 'consumer',
        idle_watts: Number((maxWatts * 0.4).toFixed(1)),
        max_system_watts: maxWatts,
        airflow: 'passive-convection'
      },
      ports,
      visuals: {
        chassis_color_hex: '#18181B',
        material_preset: 'matte-black-steel',
        has_oled_display: false,
        stl_mesh_path: null
      },
      printable_metadata: null
    };

    const validatedBp = HardwareBlueprintSchema.parse(rawBlueprint);
    const yamlOut = stringifyYaml(validatedBp);
    if (parsed.outFile !== undefined) {
      const targetOut = path.resolve(parsed.outFile);
      fs.mkdirSync(path.dirname(targetOut), { recursive: true });
      fs.writeFileSync(targetOut, yamlOut, 'utf8');
      return {
        exitCode: 0,
        output: `Generated schema-valid blueprint '${validatedBp.slug}' -> '${targetOut}'.`
      };
    }
    return {
      exitCode: 0,
      output: yamlOut
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
  let stdioFirstToolRecorded = false;
  const mcpServer = createRackMcpServer(stateManager, {
    onToolCall: (event) => {
      if (!stdioFirstToolRecorded) {
        stdioFirstToolRecorded = true;
        sidecarServer.telemetry.recordMcpSessionCreated('stdio', '127.0.0.1');
        sidecarServer.telemetry.recordSessionFirstToolUse();
      }
      sidecarServer.telemetry.recordMcpToolCall({
        toolName: event.toolName,
        isValid: event.status === 'VALID'
      });
    }
  });

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
