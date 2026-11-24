import * as fs from 'node:fs';
import * as http from 'node:http';
import * as path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
  HardwareBlueprintSchema,
  HardwareCategorySchema,
  MountTypeSchema,
  RackProjectSchema,
  RackStandardSchema,
  type ComputedRackScene,
  type DiagnosticIssue,
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
  readonly command: 'serve' | 'validate' | 'export' | 'import' | 'new-blueprint' | 'schema';
  readonly projectPath?: string | undefined;
  readonly outDir?: string | undefined;
  readonly outFile?: string | undefined;
  readonly missingOutArg?: boolean | undefined;
  readonly ci: boolean;
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
  let missingOutArg = false;
  let ci = false;
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
    argv[0] === 'new-blueprint' ||
    argv[0] === 'schema'
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
    } else if (arg === '--ci') {
      ci = true;
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
    } else if (arg === '--out' || arg === '-o') {
      if (next !== undefined && !next.startsWith('-')) {
        outFile = next;
        outDir = next;
        i++;
      } else {
        missingOutArg = true;
      }
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
    } else if (
      (command === 'validate' || command === 'export' || command === 'import') &&
      projectPath === undefined &&
      !arg.startsWith('-')
    ) {
      projectPath = arg;
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
    ...(missingOutArg ? { missingOutArg } : {}),
    ci,
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

export const RACK_SCHEMA_ID =
  'https://mcp.rackarchitect.dev/schemas/rack.schema.json';
export const RACK_SCHEMA_TITLE = 'RackArchitect MCP Project Schema';

const SCHEMA_KEYWORD_ORDER: ReadonlyMap<string, number> = new Map(
  [
    '$schema',
    '$id',
    'title',
    'description',
    'type',
    'const',
    'enum',
    'default',
    'format',
    'pattern',
    'minLength',
    'maxLength',
    'minimum',
    'exclusiveMinimum',
    'maximum',
    'exclusiveMaximum',
    'minItems',
    'maxItems',
    'items',
    'properties',
    'required',
    'additionalProperties'
  ].map((keyword, idx) => [keyword, idx] as const)
);

function sortJsonSchemaKeys(
  value: unknown,
  insidePropertiesMap = false
): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => sortJsonSchemaKeys(item, false));
  }
  if (value === null || typeof value !== 'object') {
    return value;
  }

  const record = value as Record<string, unknown>;
  const keys = Object.keys(record).sort((a, b) => {
    if (!insidePropertiesMap) {
      const pa = SCHEMA_KEYWORD_ORDER.get(a);
      const pb = SCHEMA_KEYWORD_ORDER.get(b);
      if (pa !== undefined && pb !== undefined) {
        return pa - pb;
      }
      if (pa !== undefined) {
        return -1;
      }
      if (pb !== undefined) {
        return 1;
      }
    }
    return a < b ? -1 : a > b ? 1 : 0;
  });

  const sorted: Record<string, unknown> = {};
  for (const key of keys) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    const childValue = sortJsonSchemaKeys(
      record[key],
      !insidePropertiesMap && key === 'properties'
    );
    Object.defineProperty(sorted, key, {
      value: childValue,
      enumerable: true,
      configurable: true,
      writable: true
    });
  }
  return sorted;
}

/**
 * Generates the official RackArchitect `rack.schema.json` object directly
 * from `RackProjectSchema` (`@rack-mcp/core-domain`) with deterministic key order.
 */
export function buildRackJsonSchema(): Record<string, unknown> {
  const generated = RackProjectSchema.toJSONSchema({
    io: 'input',
    target: 'draft-2020-12'
  }) as Record<string, unknown>;

  const enriched: Record<string, unknown> = {
    ...generated,
    $schema:
      typeof generated['$schema'] === 'string'
        ? generated['$schema']
        : 'https://json-schema.org/draft/2020-12/schema',
    $id: RACK_SCHEMA_ID,
    title: RACK_SCHEMA_TITLE
  };

  return sortJsonSchemaKeys(enriched) as Record<string, unknown>;
}

export function serializeRackJsonSchema(): string {
  return `${JSON.stringify(buildRackJsonSchema(), null, 2)}\n`;
}

function writeTextFileAtomicallySafe(
  rawTargetPath: string,
  content: string
): string {
  if (rawTargetPath.trim().length === 0 || rawTargetPath.includes('\0')) {
    throw new Error('Invalid output file path.');
  }
  const targetPath = path.resolve(rawTargetPath);

  let existingStat: fs.Stats | undefined;
  try {
    existingStat = fs.lstatSync(targetPath);
  } catch {
    existingStat = undefined;
  }
  if (existingStat !== undefined) {
    if (existingStat.isSymbolicLink()) {
      throw new Error(
        `Refusing to write through symbolic link '${targetPath}'.`
      );
    }
    if (existingStat.isDirectory()) {
      throw new Error(`Output path '${targetPath}' is a directory.`);
    }
  }

  const parentDir = path.dirname(targetPath);
  fs.mkdirSync(parentDir, { recursive: true });
  const realParent = fs.realpathSync(parentDir);
  const safeTarget = path.join(realParent, path.basename(targetPath));
  const tmpPath = path.join(
    realParent,
    `.${path.basename(targetPath)}.tmp.${process.pid}.${Date.now()}`
  );

  try {
    fs.writeFileSync(tmpPath, content, { encoding: 'utf8', flag: 'wx' });
    fs.renameSync(tmpPath, safeTarget);
  } catch (err) {
    try {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    } catch {
      // Ignore cleanup failure
    }
    throw err;
  }
  return targetPath;
}

function escapeGhaData(value: string): string {
  return value
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A');
}

function escapeGhaProperty(value: string): string {
  return value
    .replace(/%/g, '%25')
    .replace(/\r/g, '%0D')
    .replace(/\n/g, '%0A')
    .replace(/:/g, '%3A')
    .replace(/,/g, '%2C');
}

function escapeMarkdownCell(value: string): string {
  return value
    .replace(/\|/g, '\\|')
    .replace(/\r?\n/g, ' ')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeMarkdownCode(value: string): string {
  return value.replace(/`/g, "'").replace(/\r?\n/g, ' ');
}

function formatAnnotationFilePath(
  resolvedTargetPath: string,
  rawProjectPath?: string
): string {
  const rel = path.relative(process.cwd(), resolvedTargetPath);
  if (rel.length > 0 && !rel.startsWith('..') && !path.isAbsolute(rel)) {
    return rel.split(path.sep).join('/');
  }
  return (rawProjectPath ?? resolvedTargetPath).split(path.sep).join('/');
}

function formatWorkflowCommand(
  level: 'error' | 'warning' | 'notice',
  file: string,
  title: string,
  message: string,
  line?: number
): string {
  const props = [
    `file=${escapeGhaProperty(file)}`,
    ...(line !== undefined && Number.isInteger(line) && line > 0
      ? [`line=${line}`]
      : []),
    `title=${escapeGhaProperty(title)}`
  ].join(',');
  return `::${level} ${props}::${escapeGhaData(message)}`;
}

function appendGithubStepSummary(markdownSummary: string): void {
  const summaryPath = process.env['GITHUB_STEP_SUMMARY']?.trim();
  if (summaryPath === undefined || summaryPath.length === 0) {
    return;
  }
  try {
    let stat: fs.Stats | undefined;
    try {
      stat = fs.lstatSync(summaryPath);
    } catch {
      stat = undefined;
    }
    if (stat !== undefined && (stat.isSymbolicLink() || stat.isDirectory())) {
      return;
    }
    fs.appendFileSync(summaryPath, `${markdownSummary}\n`, 'utf8');
  } catch {
    // Non-fatal: runner summary file write errors must not override validation outcome
  }
}

function formatIssueAnnotationMessage(issue: DiagnosticIssue): string {
  const parts: string[] = [issue.message];
  if (issue.affected_instances.length > 0) {
    parts.push(`[instances: ${issue.affected_instances.join(', ')}]`);
  }
  if (issue.u_range !== undefined) {
    parts.push(`[U${issue.u_range[0]}..U${issue.u_range[1]}]`);
  }
  const firstRemediation = issue.remediation_suggestions[0];
  if (firstRemediation !== undefined && firstRemediation.length > 0) {
    parts.push(`Remediation: ${firstRemediation}`);
  }
  return parts.join(' ');
}

function formatCiSceneReport(
  scene: ComputedRackScene,
  annotationFile: string
): string {
  const { project, validation } = scene;
  const annotations: string[] = [];

  for (const issue of validation.issues) {
    const level =
      issue.severity === 'ERROR'
        ? 'error'
        : issue.severity === 'WARNING'
          ? 'warning'
          : 'notice';
    const title = `Rack Validation (${issue.code})`;
    annotations.push(
      formatWorkflowCommand(
        level,
        annotationFile,
        title,
        formatIssueAnnotationMessage(issue)
      )
    );
  }

  const pwr = validation.power_summary;
  const mech = validation.mechanical_summary;
  const totalPoeBudget = pwr.pse_budgets.reduce(
    (sum, b) => sum + b.poe_budget_watts,
    0
  );
  const statusBadge = validation.is_valid ? '✅ VALID' : '❌ INVALID';

  const summaryLines: string[] = [
    '## RackArchitect Validation Report',
    '',
    `- **Project:** \`${escapeMarkdownCode(project.project_name)}\``,
    `- **File:** \`${escapeMarkdownCode(annotationFile)}\``,
    `- **Status:** ${statusBadge} (${validation.error_count} Errors, ${validation.warning_count} Warnings)`,
    `- **Rack:** \`${project.rack.standard}\`, ${project.rack.u_height}U, ${project.rack.rail_depth_mm} mm depth (\`${project.rack.enclosure_type}\`)`,
    '',
    '| Metric | Value |',
    '| :--- | :--- |',
    `| Peak Power Draw | ${pwr.total_system_watts} W |`,
    `| PoE Load / Budget | ${pwr.total_poe_watts} W / ${totalPoeBudget} W |`,
    `| Total Equipment Mass | ${mech.total_weight_grams} g |`,
    `| Normalized CoG Y | ${mech.normalized_cog_y} |`,
    `| Thermal / Noise | ${mech.total_thermal_btu_hr} BTU/hr, ${mech.combined_noise_db_a} dB(A) (\`${mech.airflow_profile}\`) |`,
    `| Cables / External Drops | ${project.cables.length} / ${project.external_endpoints.length} |`
  ];

  if (validation.issues.length > 0) {
    summaryLines.push('');
    summaryLines.push(
      '| Severity | Code | Instances | Message | Remediation |'
    );
    summaryLines.push('| :--- | :--- | :--- | :--- | :--- |');
    for (const issue of validation.issues) {
      const instancesText =
        issue.affected_instances.length > 0
          ? issue.affected_instances.join(', ')
          : '-';
      const remediationText = issue.remediation_suggestions[0] ?? '-';
      summaryLines.push(
        `| ${escapeMarkdownCell(issue.severity)} | \`${escapeMarkdownCode(issue.code)}\` | ${escapeMarkdownCell(instancesText)} | ${escapeMarkdownCell(issue.message)} | ${escapeMarkdownCell(remediationText)} |`
      );
    }
  } else {
    summaryLines.push('');
    summaryLines.push('No spatial, electrical, mechanical, or thermal issues detected.');
  }

  const markdownSummary = summaryLines.join('\n');
  appendGithubStepSummary(markdownSummary);

  return annotations.length > 0
    ? `${annotations.join('\n')}\n\n${markdownSummary}`
    : markdownSummary;
}

function formatCiFailureReport(
  annotationFile: string,
  failures: ReadonlyArray<{
    readonly code: string;
    readonly message: string;
    readonly line?: number | undefined;
  }>
): string {
  const annotations = failures.map((f) =>
    formatWorkflowCommand(
      'error',
      annotationFile,
      `Rack Validation (${f.code})`,
      f.message,
      f.line
    )
  );
  const summaryLines: string[] = [
    '## RackArchitect Validation Report',
    '',
    `- **File:** \`${escapeMarkdownCode(annotationFile)}\``,
    `- **Status:** ❌ INVALID (${failures.length} Error${failures.length === 1 ? '' : 's'})`,
    '',
    '| Severity | Code | Message |',
    '| :--- | :--- | :--- |',
    ...failures.map(
      (f) =>
        `| ERROR | \`${escapeMarkdownCode(f.code)}\` | ${escapeMarkdownCell(f.message)} |`
    )
  ];
  const markdownSummary = summaryLines.join('\n');
  appendGithubStepSummary(markdownSummary);
  return `${annotations.join('\n')}\n\n${markdownSummary}`;
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

  if (parsed.command === 'schema') {
    if (parsed.missingOutArg) {
      return {
        exitCode: 1,
        output: 'Error: --out requires a target file path.'
      };
    }
    const schemaText = serializeRackJsonSchema();
    if (parsed.outFile !== undefined) {
      try {
        const writtenPath = writeTextFileAtomicallySafe(
          parsed.outFile,
          schemaText
        );
        return {
          exitCode: 0,
          output: `Generated RackProject JSON Schema -> '${writtenPath}' (${Buffer.byteLength(schemaText, 'utf8')} bytes).`
        };
      } catch (err) {
        return {
          exitCode: 1,
          output: `Error: ${err instanceof Error ? err.message : String(err)}`
        };
      }
    }
    return {
      exitCode: 0,
      output: schemaText
    };
  }

  if (parsed.command === 'validate') {
    const targetPath = path.resolve(parsed.projectPath ?? 'rack.yaml');
    const annotationFile = formatAnnotationFilePath(
      targetPath,
      parsed.projectPath
    );
    if (!fs.existsSync(targetPath)) {
      const msg = `Error: Project file not found at '${targetPath}'.`;
      if (parsed.ci) {
        return {
          exitCode: 1,
          output: formatCiFailureReport(annotationFile, [
            { code: 'FILE_NOT_FOUND', message: msg }
          ])
        };
      }
      return { exitCode: 1, output: msg };
    }

    const rawYaml = fs.readFileSync(targetPath, 'utf8');
    let parsedObj: unknown;
    try {
      parsedObj = parseYaml(rawYaml);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const linePos = (
        err as { readonly linePos?: ReadonlyArray<{ readonly line?: number }> }
      )?.linePos;
      const line = linePos?.[0]?.line;
      if (parsed.ci) {
        return {
          exitCode: 1,
          output: formatCiFailureReport(annotationFile, [
            {
              code: 'YAML_PARSE_ERROR',
              message: msg,
              ...(line !== undefined ? { line } : {})
            }
          ])
        };
      }
      return {
        exitCode: 1,
        output: `Error: Failed to parse '${targetPath}': ${msg}`
      };
    }

    const schemaResult = RackProjectSchema.safeParse(parsedObj);
    if (!schemaResult.success) {
      const failures = schemaResult.error.issues.map((issue) => {
        const fieldPath =
          issue.path.length > 0 ? issue.path.join('.') : '<root>';
        return {
          code: 'SCHEMA_VALIDATION_ERROR',
          message: `${fieldPath}: ${issue.message}`
        };
      });
      if (parsed.ci) {
        return {
          exitCode: 1,
          output: formatCiFailureReport(annotationFile, failures)
        };
      }
      return {
        exitCode: 1,
        output: `Error: Schema validation failed for '${targetPath}':\n${failures.map((f) => `  - ${f.message}`).join('\n')}`
      };
    }

    const stateManager = new ProjectStateManager({ projectPath: targetPath });
    const scene = stateManager.getScene();
    if (parsed.ci) {
      return {
        exitCode: scene.validation.is_valid ? 0 : 1,
        output: formatCiSceneReport(scene, annotationFile)
      };
    }

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
