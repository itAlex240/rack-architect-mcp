import * as fs from 'node:fs';
import * as path from 'node:path';
import YAML from 'yaml';
import {
  evaluateRackScene,
  RackProjectSchema,
  type ComputedRackScene,
  type HardwareBlueprint,
  type RackProject,
  type RackProjectInput
} from '@rack-mcp/core-domain';
import {
  CatalogRegistry,
  parseAndValidateBlueprintYaml
} from '@rack-mcp/hardware-catalog';

export interface McpToolCallEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly tool: string;
  readonly summary: string;
  readonly status: 'VALID' | 'INVALID';
  readonly errorCount: number;
  readonly warningCount: number;
}

export interface StateChangeEvent {
  readonly reason:
    | 'init'
    | 'mutation'
    | 'undo'
    | 'redo'
    | 'external_file_change'
    | 'custom_blueprint'
    | 'tool_call';
  readonly scene: ComputedRackScene;
  readonly undoAvailable: number;
  readonly redoAvailable: number;
  readonly toolCallLog: readonly McpToolCallEntry[];
}

export type StateChangeListener = (event: StateChangeEvent) => void;

export interface ProjectStateManagerOptions {
  readonly projectPath?: string | undefined;
  readonly customCatalogDir?: string | undefined;
  readonly initialProject?: RackProject | RackProjectInput | undefined;
  readonly catalog?: CatalogRegistry | undefined;
  readonly maxHistory?: number | undefined;
  readonly watchFile?: boolean | undefined;
}

const DEFAULT_EMPTY_PROJECT: RackProject = {
  schema_version: '1.0',
  project_name: 'Default 10-Inch Homelab Rack',
  rack: {
    standard: '10inch',
    u_height: 8,
    rail_depth_mm: 240,
    enclosure_type: 'closed-glass-front',
    front_door_clearance_mm: 45,
    rear_clearance_mm: 40
  },
  mounted_devices: [],
  cables: [],
  external_endpoints: []
};

/**
 * Stateful Project Controller (`ProjectStateManager`) for `@rack-mcp/mcp-server`.
 * Manages:
 * - Active `RackProject` in memory and its `ComputedRackScene` snapshot
 * - 50-step Undo / Redo history stack
 * - Atomic `rack.yaml.tmp` -> `rack.yaml` persistence
 * - Custom blueprint registration and persistence in `custom-catalog/<slug>.yaml`
 * - Bidirectional file watcher (`fs.watch`) with write-lock and debounce
 */
export class ProjectStateManager {
  private project: RackProject;
  private scene: ComputedRackScene;
  private readonly catalog: CatalogRegistry;
  private readonly projectPath: string | undefined;
  private readonly customCatalogDir: string | undefined;
  private readonly toolLogPath: string | undefined;
  private readonly maxHistory: number;

  private readonly undoStack: RackProject[] = [];
  private readonly redoStack: RackProject[] = [];
  private readonly toolCallLog: McpToolCallEntry[] = [];
  private readonly listeners = new Set<StateChangeListener>();

  private watcher: fs.FSWatcher | undefined;
  private debounceTimer: ReturnType<typeof setTimeout> | undefined;
  private lastWrittenYaml = '';
  private lastWrittenToolLogJson = '';

  public constructor(options: ProjectStateManagerOptions = {}) {
    this.projectPath =
      options.projectPath !== undefined ? path.resolve(options.projectPath) : undefined;
    this.customCatalogDir =
      options.customCatalogDir !== undefined
        ? path.resolve(options.customCatalogDir)
        : this.projectPath !== undefined
          ? path.join(path.dirname(this.projectPath), 'custom-catalog')
          : undefined;
    this.toolLogPath =
      this.projectPath !== undefined
        ? path.join(path.dirname(this.projectPath), '.rack-mcp-tool-log.json')
        : undefined;
    this.maxHistory = options.maxHistory ?? 50;
    this.catalog = options.catalog ?? new CatalogRegistry();

    this.loadExistingCustomCatalogFromDisk();
    this.loadExistingToolLogFromDisk();

    if (options.initialProject !== undefined) {
      this.project = RackProjectSchema.parse(options.initialProject);
      this.persistProjectAtomically();
    } else if (this.projectPath !== undefined && fs.existsSync(this.projectPath)) {
      const raw = fs.readFileSync(this.projectPath, 'utf8');
      this.lastWrittenYaml = raw;
      const parsed = YAML.parse(raw) as unknown;
      this.project = RackProjectSchema.parse(parsed);
    } else {
      this.project = structuredClone(DEFAULT_EMPTY_PROJECT);
      if (this.projectPath !== undefined) {
        this.persistProjectAtomically();
      }
    }

    this.scene = evaluateRackScene(this.project, this.catalog.toRecord());

    if (options.watchFile === true && this.projectPath !== undefined) {
      this.startWatching();
    }
  }

  private loadExistingCustomCatalogFromDisk(): void {
    if (this.customCatalogDir === undefined || !fs.existsSync(this.customCatalogDir)) {
      return;
    }
    const entries = fs.readdirSync(this.customCatalogDir, { withFileTypes: true });
    for (const entry of entries) {
      if (
        entry.isFile() &&
        (entry.name.endsWith('.yaml') || entry.name.endsWith('.yml')) &&
        !entry.name.endsWith('.tmp')
      ) {
        const fullPath = path.join(this.customCatalogDir, entry.name);
        const rawYaml = fs.readFileSync(fullPath, 'utf8');
        const res = parseAndValidateBlueprintYaml(rawYaml, fullPath);
        if (res.valid && res.blueprint !== undefined) {
          this.catalog.registerCustomBlueprint(res.blueprint);
        }
      }
    }
  }

  private loadExistingToolLogFromDisk(): boolean {
    if (this.toolLogPath === undefined || !fs.existsSync(this.toolLogPath)) {
      return false;
    }
    try {
      const rawJson = fs.readFileSync(this.toolLogPath, 'utf8');
      if (rawJson === this.lastWrittenToolLogJson) {
        return false;
      }
      const parsed = JSON.parse(rawJson) as unknown;
      if (!Array.isArray(parsed)) {
        return false;
      }
      this.lastWrittenToolLogJson = rawJson;
      this.toolCallLog.length = 0;
      for (const item of parsed.slice(0, this.maxHistory)) {
        if (
          typeof item === 'object' &&
          item !== null &&
          typeof (item as Record<string, unknown>)['id'] === 'string' &&
          typeof (item as Record<string, unknown>)['tool'] === 'string' &&
          typeof (item as Record<string, unknown>)['summary'] === 'string'
        ) {
          const rec = item as Record<string, unknown>;
          this.toolCallLog.push({
            id: String(rec['id']),
            timestamp:
              typeof rec['timestamp'] === 'string'
                ? rec['timestamp']
                : new Date().toISOString(),
            tool: String(rec['tool']),
            summary: String(rec['summary']),
            status: rec['status'] === 'INVALID' ? 'INVALID' : 'VALID',
            errorCount:
              typeof rec['errorCount'] === 'number' ? rec['errorCount'] : 0,
            warningCount:
              typeof rec['warningCount'] === 'number' ? rec['warningCount'] : 0
          });
        }
      }
      return true;
    } catch {
      return false;
    }
  }

  private persistToolLogAtomically(): void {
    if (this.toolLogPath === undefined) {
      return;
    }
    try {
      const dir = path.dirname(this.toolLogPath);
      fs.mkdirSync(dir, { recursive: true });
      const tmpPath = `${this.toolLogPath}.tmp`;
      const jsonText = JSON.stringify(this.toolCallLog, null, 2);
      this.lastWrittenToolLogJson = jsonText;
      fs.writeFileSync(tmpPath, jsonText, 'utf8');
      fs.renameSync(tmpPath, this.toolLogPath);
    } catch {
      // Ignore non-fatal tool log persistence errors
    }
  }

  public getCatalog(): CatalogRegistry {
    return this.catalog;
  }

  public getProject(): RackProject {
    this.reloadFromDiskIfChanged();
    return this.project;
  }

  public getScene(): ComputedRackScene {
    this.reloadFromDiskIfChanged();
    return this.scene;
  }

  public getProjectPath(): string | undefined {
    return this.projectPath;
  }

  public getCustomCatalogDir(): string | undefined {
    return this.customCatalogDir;
  }

  public getHistoryCounts(): { readonly undoAvailable: number; readonly redoAvailable: number } {
    return {
      undoAvailable: this.undoStack.length,
      redoAvailable: this.redoStack.length
    };
  }

  public getProjectYaml(): string {
    return YAML.stringify(this.project, { indent: 2, lineWidth: 100 });
  }

  /**
   * Applies an atomic mutation to the active `RackProject`:
   * 1. Validates and normalizes `nextProjectInput`
   * 2. Pushes deep snapshot of current state to `undoStack` (up to `maxHistory`) and clears `redoStack`
   * 3. Evaluates 3D geometry, 5-stage validation, and 3D cable splines
   * 4. Writes `rack.yaml.tmp` and renames atomically to `rack.yaml`
   * 5. Broadcasts `StateChangeEvent` to all subscribers
   */
  public applyMutation(
    nextProjectInput: RackProject | RackProjectInput,
    reason: 'init' | 'mutation' = 'mutation'
  ): ComputedRackScene {
    const validatedNext = RackProjectSchema.parse(nextProjectInput);
    this.undoStack.push(structuredClone(this.project));
    while (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
    this.redoStack.length = 0;

    this.project = structuredClone(validatedNext);
    this.scene = evaluateRackScene(this.project, this.catalog.toRecord());
    this.persistProjectAtomically();
    this.emitChange(reason);
    return this.scene;
  }

  /**
   * Reverts the last mutation from the `undoStack`.
   */
  public undo(): {
    readonly applied: boolean;
    readonly scene: ComputedRackScene;
    readonly undoAvailable: number;
    readonly redoAvailable: number;
  } {
    const previous = this.undoStack.pop();
    if (previous === undefined) {
      return {
        applied: false,
        scene: this.scene,
        undoAvailable: this.undoStack.length,
        redoAvailable: this.redoStack.length
      };
    }

    this.redoStack.push(structuredClone(this.project));
    while (this.redoStack.length > this.maxHistory) {
      this.redoStack.shift();
    }

    this.project = structuredClone(previous);
    this.scene = evaluateRackScene(this.project, this.catalog.toRecord());
    this.persistProjectAtomically();
    this.emitChange('undo');

    return {
      applied: true,
      scene: this.scene,
      undoAvailable: this.undoStack.length,
      redoAvailable: this.redoStack.length
    };
  }

  /**
   * Reapplies a reverted mutation from the `redoStack`.
   */
  public redo(): {
    readonly applied: boolean;
    readonly scene: ComputedRackScene;
    readonly undoAvailable: number;
    readonly redoAvailable: number;
  } {
    const next = this.redoStack.pop();
    if (next === undefined) {
      return {
        applied: false,
        scene: this.scene,
        undoAvailable: this.undoStack.length,
        redoAvailable: this.redoStack.length
      };
    }

    this.undoStack.push(structuredClone(this.project));
    while (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }

    this.project = structuredClone(next);
    this.scene = evaluateRackScene(this.project, this.catalog.toRecord());
    this.persistProjectAtomically();
    this.emitChange('redo');

    return {
      applied: true,
      scene: this.scene,
      undoAvailable: this.undoStack.length,
      redoAvailable: this.redoStack.length
    };
  }

  /**
   * Registers a custom blueprint in the `CatalogRegistry`, persists it atomically
   * to `custom-catalog/<slug>.yaml` if `customCatalogDir` is set, and re-evaluates the scene.
   */
  public registerCustomBlueprint(blueprint: HardwareBlueprint): {
    readonly savedPath?: string | undefined;
    readonly blueprint: HardwareBlueprint;
  } {
    this.catalog.registerCustomBlueprint(blueprint);
    const normalized = this.catalog.getBlueprintBySlug(blueprint.slug);
    if (normalized === undefined) {
      throw new Error(`Failed to retrieve registered custom blueprint '${blueprint.slug}'.`);
    }

    let savedPath: string | undefined;
    if (this.customCatalogDir !== undefined) {
      const resolvedCatalogDir = path.resolve(this.customCatalogDir);
      fs.mkdirSync(resolvedCatalogDir, { recursive: true });
      const safeSlug = path
        .basename(normalized.slug)
        .replace(/[^a-z0-9-]/g, '');
      const candidatePath = path.resolve(
        resolvedCatalogDir,
        `${safeSlug}.yaml`
      );
      if (candidatePath.startsWith(resolvedCatalogDir + path.sep)) {
        savedPath = candidatePath;
        const tmpPath = `${savedPath}.tmp`;
        const yamlText = YAML.stringify(normalized, {
          indent: 2,
          lineWidth: 100
        });
        fs.writeFileSync(tmpPath, yamlText, 'utf8');
        fs.renameSync(tmpPath, savedPath);
      }
    }

    this.scene = evaluateRackScene(this.project, this.catalog.toRecord());
    this.emitChange('custom_blueprint');

    return {
      ...(savedPath !== undefined ? { savedPath } : {}),
      blueprint: normalized
    };
  }

  private persistProjectAtomically(): void {
    if (this.projectPath === undefined) {
      return;
    }
    const dir = path.dirname(this.projectPath);
    fs.mkdirSync(dir, { recursive: true });
    const tmpPath = `${this.projectPath}.tmp`;
    const yamlText = this.getProjectYaml();

    this.lastWrittenYaml = yamlText;
    fs.writeFileSync(tmpPath, yamlText, 'utf8');
    fs.renameSync(tmpPath, this.projectPath);
  }

  /**
   * Starts watching `projectPath` and `.rack-mcp-tool-log.json` for external changes made by a human in an IDE or an external stdio MCP agent process.
   */
  public startWatching(): void {
    if (this.projectPath === undefined || this.watcher !== undefined) {
      return;
    }
    const dir = path.dirname(this.projectPath);
    const targetFile = path.basename(this.projectPath);
    const toolLogFile = '.rack-mcp-tool-log.json';
    fs.mkdirSync(dir, { recursive: true });

    this.watcher = fs.watch(dir, (_eventType, filename) => {
      if (
        filename !== null &&
        filename !== targetFile &&
        filename !== toolLogFile
      ) {
        return;
      }
      if (this.debounceTimer !== undefined) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.reloadFromDiskIfChanged();
      }, 80);
    });
  }

  public stopWatching(): void {
    if (this.debounceTimer !== undefined) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = undefined;
    }
    if (this.watcher !== undefined) {
      this.watcher.close();
      this.watcher = undefined;
    }
  }

  private reloadFromDiskIfChanged(): void {
    if (this.projectPath === undefined) {
      return;
    }
    try {
      this.loadExistingCustomCatalogFromDisk();
      const toolLogChanged = this.loadExistingToolLogFromDisk();
      let projectChanged = false;

      if (fs.existsSync(this.projectPath)) {
        const raw = fs.readFileSync(this.projectPath, 'utf8');
        if (raw !== this.lastWrittenYaml) {
          const parsed = YAML.parse(raw) as unknown;
          const nextProject = RackProjectSchema.parse(parsed);
          this.lastWrittenYaml = raw;

          this.undoStack.push(structuredClone(this.project));
          while (this.undoStack.length > this.maxHistory) {
            this.undoStack.shift();
          }
          this.redoStack.length = 0;

          this.project = structuredClone(nextProject);
          this.scene = evaluateRackScene(this.project, this.catalog.toRecord());
          projectChanged = true;
        }
      }

      if (projectChanged) {
        this.emitChange('external_file_change');
      } else if (toolLogChanged) {
        this.emitChange('tool_call');
      }
    } catch {
      // Ignore partial writes or transient invalid YAML edits from external editors
    }
  }

  public getToolCallLog(): readonly McpToolCallEntry[] {
    return this.toolCallLog;
  }

  public clearToolCallLog(): void {
    this.toolCallLog.length = 0;
    this.persistToolLogAtomically();
    this.emitChange('tool_call');
  }

  public recordToolCall(
    tool: string,
    summary: string,
    status: 'VALID' | 'INVALID'
  ): McpToolCallEntry {
    this.loadExistingToolLogFromDisk();
    const entry: McpToolCallEntry = {
      id: `call-${this.toolCallLog.length + 1}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      tool,
      summary,
      status,
      errorCount: this.scene.validation.error_count,
      warningCount: this.scene.validation.warning_count
    };
    this.toolCallLog.unshift(entry);
    while (this.toolCallLog.length > this.maxHistory) {
      this.toolCallLog.pop();
    }
    this.persistToolLogAtomically();
    this.emitChange('tool_call');
    return entry;
  }

  public onStateChange(listener: StateChangeListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emitChange(reason: StateChangeEvent['reason']): void {
    const event: StateChangeEvent = {
      reason,
      scene: this.scene,
      undoAvailable: this.undoStack.length,
      redoAvailable: this.redoStack.length,
      toolCallLog: [...this.toolCallLog]
    };
    for (const listener of this.listeners) {
      listener(event);
    }
  }
}
