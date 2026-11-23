import { useCallback, useEffect, useRef, useState } from 'react';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
  deserializeRackScene,
  HardwareBlueprintSchema,
  MCP_TOOL_DEFINITIONS,
  normalizeHardwareBlueprint,
  RackProjectSchema,
  type CableType,
  type ConnectorType,
  type HardwareBlueprint,
  type RackFace,
  type RackProjectInput,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import {
  detectExternalImportFormat,
  generateBomMarkdown,
  generateCableLabelsCsv,
  generateCableLabelsSvg,
  importExternalInventory,
  type ExternalImportFormat,
} from '@rack-mcp/exporters';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';
import {
  createStandaloneHomelabProjectInput,
  evaluateStandaloneScene,
  renderClientSideElevationSvg,
  renderClientSideWiringSvg,
} from './standalone-homelab.js';
import {
  STANDALONE_PRESET_OPTIONS,
  createStandalonePresetProjectInput,
  type StandalonePresetId,
} from './standalone-presets.js';
import {
  decodeRackProjectFromHash,
  decodeRackProjectFromHashAsync,
  encodeRackProjectToCompressedHash,
} from './rack-url-codec.js';
import { trackUiEvent } from './ui-telemetry.js';

export type WorkspaceTab = '3d' | 'elevation' | 'wiring' | 'bom';
export type CableFilterMode = 'all' | 'network' | 'power' | 'poe' | 'none';
export type CameraPresetMode =
  | 'isometric'
  | 'front'
  | 'rear'
  | 'side-cutaway'
  | 'top';

export interface HoveredPortInfo {
  readonly instanceId: string;
  readonly portId: string;
  readonly label: string;
  readonly connectorType: string;
  readonly worldFace: string;
  readonly worldPosMm: { readonly x: number; readonly y: number; readonly z: number };
  readonly connectedCableId: string | undefined;
  readonly peerDescription: string | undefined;
}

export interface McpToolCallItem {
  readonly id: string;
  readonly timestamp: string;
  readonly tool: string;
  readonly summary: string;
  readonly status: 'VALID' | 'INVALID';
  readonly errorCount: number;
  readonly warningCount: number;
}

const DEFAULT_STANDALONE_TOOL_LOG: readonly McpToolCallItem[] = [
  {
    id: 'mcp-call-6',
    timestamp: '10:14:22',
    tool: 'validate_rack',
    summary:
      "Rack '8U 10-Inch Proxmox & UniFi Homelab' is VALID (0 Errors, 0 Warnings, 33.5W PoE active).",
    status: 'VALID',
    errorCount: 0,
    warningCount: 0,
  },
  {
    id: 'mcp-call-5b',
    timestamp: '10:14:20',
    tool: 'plan_external_endpoints',
    summary:
      "Terminated 4 top-rear external drops on 'patch-u7' (ISP Glasfaser-ONT WAN, Wi-Fi 7 PoE+ AP 21W, 4K PoE+ Kamera 12.5W, Office 2.5G LAN).",
    status: 'VALID',
    errorCount: 0,
    warningCount: 0,
  },
  {
    id: 'mcp-call-5',
    timestamp: '10:14:19',
    tool: 'connect_cables',
    summary:
      'Connected 22 cable(s) and computed 3D Catmull-Rom routes cleanly (including U6 Brush Portal & external patch links).',
    status: 'VALID',
    errorCount: 0,
    warningCount: 0,
  },
  {
    id: 'mcp-call-4',
    timestamp: '10:14:15',
    tool: 'modify_equipment',
    summary:
      "Self-Correction: Moved 'pdu-u2-rear' from U1 Rear -> U2 Rear to clear 45mm Schuko/IEC plug zone.",
    status: 'VALID',
    errorCount: 0,
    warningCount: 0,
  },
  {
    id: 'mcp-call-3',
    timestamp: '10:14:12',
    tool: 'connect_cables',
    summary:
      "PLUG_CLEARANCE_COLLISION on U1: 'ups-u1' rear plug (+45mm) collides with 'pdu-u2-rear' at U1 Rear.",
    status: 'INVALID',
    errorCount: 1,
    warningCount: 0,
  },
  {
    id: 'mcp-call-2',
    timestamp: '10:14:08',
    tool: 'mount_equipment',
    summary:
      'Mounted 8 top-level units + 10 sub-modules (UCG-Max, 2x Lenovo M920q, 7x Cat6A Keystones).',
    status: 'VALID',
    errorCount: 0,
    warningCount: 0,
  },
  {
    id: 'mcp-call-1',
    timestamp: '10:14:02',
    tool: 'init_rack',
    summary:
      "Initialized 10inch rack '8U 10-Inch Proxmox & UniFi Homelab' (8U, 240mm depth, closed-glass-front).",
    status: 'VALID',
    errorCount: 0,
    warningCount: 0,
  },
];

export interface InitNewRackParams {
  readonly project_name: string;
  readonly standard: '10inch' | '19inch' | '6inch';
  readonly u_height: number;
  readonly rail_depth_mm: number;
  readonly enclosure_type:
    | 'open-frame'
    | 'closed-glass-front'
    | 'closed-vented-front';
}

export interface PendingPortSelection {
  readonly instanceId: string;
  readonly portId: string;
  readonly label: string;
  readonly connectorType: ConnectorType;
  readonly worldFace: RackFace;
}

export function inferCableTypeForConnectors(
  a: ConnectorType,
  b: ConnectorType,
): CableType {
  if (a === 'usb-c' || b === 'usb-c') return 'power-usb-c';
  if (a === 'dc-5525' || b === 'dc-5525') return 'power-dc-5525';
  if (a === 'schuko-cee7' || b === 'schuko-cee7') return 'power-schuko-c13';
  if (
    a === 'iec-c13' ||
    a === 'iec-c14' ||
    b === 'iec-c13' ||
    b === 'iec-c14'
  ) {
    return 'power-c13-c14';
  }
  if (a === 'sfp-plus' && b === 'sfp-plus') return 'sfp-plus-dac';
  if (a === 'rj45-serial-console' || b === 'rj45-serial-console') {
    return 'rj45-serial-rollover';
  }
  return 'cat6a';
}

export interface ProjectImportResult {
  readonly ok: boolean;
  readonly format: 'rack-yaml' | 'rack-json' | ExternalImportFormat | null;
  readonly summary: string;
  readonly importedDevicesCount: number;
  readonly unmatchedCount: number;
}

export interface CustomBlueprintRegisterResult {
  readonly ok: boolean;
  readonly slug?: string | undefined;
  readonly error?: string | undefined;
}

function renderBomWithRate(
  serialized: SerializedRackScene,
  catalogRecord: Readonly<Record<string, HardwareBlueprint>>,
  electricityPricePerKwhEur: number,
): string {
  return generateBomMarkdown(deserializeRackScene(serialized), catalogRecord, {
    electricityPricePerKwhEur,
  });
}

export interface RackViewerState {
  readonly connectionMode: 'sidecar-live' | 'standalone-demo';
  readonly projectPath: string | null;
  readonly activePresetId: StandalonePresetId;
  readonly scene: SerializedRackScene;
  readonly catalog: readonly HardwareBlueprint[];
  readonly mcpToolLog: readonly McpToolCallItem[];
  readonly undoAvailable: number;
  readonly redoAvailable: number;
  readonly elevationSvg: string;
  readonly wiringSvg: string;
  readonly bomMarkdown: string;
  readonly labelsCsv: string;
  readonly labelsSvg: string;
  readonly electricityPricePerKwhEur: number;
  readonly setElectricityPricePerKwhEur: (rateEur: number) => void;
  readonly activeTab: WorkspaceTab;
  readonly xrayMode: boolean;
  readonly explodeZMm: number;
  readonly cableFilter: CableFilterMode;
  readonly cameraPreset: CameraPresetMode;
  readonly showClearanceBoxes: boolean;
  readonly doorOpen: boolean;
  readonly catalogDrawerOpen: boolean;
  readonly selectedDeviceId: string | null;
  readonly selectedCableId: string | null;
  readonly hoveredPort: HoveredPortInfo | null;
  readonly pendingPort: PendingPortSelection | null;
  setActiveTab(tab: WorkspaceTab): void;
  setXrayMode(enabled: boolean): void;
  setExplodeZMm(mm: number): void;
  setCableFilter(filter: CableFilterMode): void;
  setCameraPreset(preset: CameraPresetMode): void;
  setShowClearanceBoxes(show: boolean): void;
  setDoorOpen(open: boolean): void;
  setCatalogDrawerOpen(open: boolean): void;
  selectPreset(presetId: StandalonePresetId): void;
  buildShareableRackUrl(): Promise<string>;
  selectDevice(instanceId: string | null): void;
  selectCable(cableId: string | null): void;
  setHoveredPort(info: HoveredPortInfo | null): void;
  setPendingPort(port: PendingPortSelection | null): void;
  handlePortClick3D(
    port: PendingPortSelection,
    existingCableId?: string,
  ): void;
  moveDeviceU(instanceId: string, newUPosition: number): void;
  mountEquipmentFromCatalog(
    blueprintSlug: string,
    targetU: number,
    face: RackFace,
    hostname?: string,
  ): void;
  removeEquipment(instanceId: string): void;
  connectInteractiveCable(
    fromInstanceId: string,
    fromPortId: string,
    toInstanceId: string,
    toPortId: string,
    cableType: CableType,
    vlanId?: number,
    ipCidr?: string,
    fromFace?: RackFace,
    toFace?: RackFace,
  ): void;
  disconnectCable(cableId: string): void;
  importProjectJson(rawJsonText: string): boolean;
  importProjectFile(rawText: string, filename?: string): ProjectImportResult;
  exportProjectYaml(): string;
  registerCustomBlueprint(rawBlueprint: unknown): CustomBlueprintRegisterResult;
  initNewRack(params: InitNewRackParams): void;
  exportDeliverablesToDisk(): void;
  clearMcpToolLog(): void;
  simulateAgentStep(stage: 'collision' | 'resolved'): void;
  undo(): void;
  redo(): void;
  resetDemoScene(): void;
}

interface SidecarWsIncoming {
  readonly type:
    | 'INITIAL_STATE'
    | 'STATE_UPDATED'
    | 'RACK_SCENE_UPDATE'
    | 'COMMAND_RESULT'
    | 'ERROR';
  readonly projectPath?: string | null | undefined;
  readonly readOnly?: boolean | undefined;
  readonly scene?: SerializedRackScene | undefined;
  readonly blueprints?: readonly HardwareBlueprint[] | undefined;
  readonly undoAvailable?: number | undefined;
  readonly redoAvailable?: number | undefined;
  readonly toolCallLog?: readonly McpToolCallItem[] | undefined;
}

/**
 * Dual-Source State Hook & WebMCP Progressive Enhancement Bridge for `@rack-mcp/web-viewer`.
 * - Connects to the local Sidecar Server (`/api/state`, `/api/catalog`, `ws://.../ws`) when available.
 * - Falls back seamlessly to the in-browser reference evaluation via `@rack-mcp/core-domain` (or `#rack=v1.` URL hash).
 * - Registers client-side WebMCP tools on `document.modelContext` when supported by the browser.
 */
export function useRackState(): RackViewerState {
  const sharedHashBootProject =
    typeof window !== 'undefined'
      ? decodeRackProjectFromHash(window.location.hash)
      : null;
  const urlSearchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : null;
  const rawPresetParam = urlSearchParams?.get('preset')?.trim() ?? '';
  const initialPresetOption =
    !sharedHashBootProject && rawPresetParam
      ? (STANDALONE_PRESET_OPTIONS.find((opt) => opt.id === rawPresetParam) ??
        null)
      : null;
  const initialPresetId: StandalonePresetId =
    initialPresetOption?.id ?? '10inch-homelab';
  const rawTabParam = urlSearchParams?.get('tab')?.trim() ?? '';
  const initialTab: WorkspaceTab =
    rawTabParam === '3d' ||
    rawTabParam === 'elevation' ||
    rawTabParam === 'wiring' ||
    rawTabParam === 'bom'
      ? rawTabParam
      : '3d';
  const initialInputRef = useRef<RackProjectInput>(
    sharedHashBootProject ??
      (initialPresetOption
        ? createStandalonePresetProjectInput(initialPresetOption.id)
        : createStandaloneHomelabProjectInput()),
  );
  const undoStackRef = useRef<RackProjectInput[]>([]);
  const redoStackRef = useRef<RackProjectInput[]>([]);

  const [connectionMode, setConnectionMode] = useState<
    'sidecar-live' | 'standalone-demo'
  >('standalone-demo');
  const [projectPath, setProjectPath] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] =
    useState<StandalonePresetId>(initialPresetId);
  const [scene, setScene] = useState<SerializedRackScene>(() =>
    evaluateStandaloneScene(initialInputRef.current),
  );
  const [catalog, setCatalog] = useState<readonly HardwareBlueprint[]>(() =>
    defaultCatalogRegistry.getAllBlueprints(),
  );
  const [mcpToolLog, setMcpToolLog] = useState<readonly McpToolCallItem[]>(
    DEFAULT_STANDALONE_TOOL_LOG,
  );
  const [undoAvailable, setUndoAvailable] = useState<number>(0);
  const [redoAvailable, setRedoAvailable] = useState<number>(0);

  const [elevationSvg, setElevationSvg] = useState<string>(() =>
    renderClientSideElevationSvg(scene),
  );
  const [wiringSvg, setWiringSvg] = useState<string>(() =>
    renderClientSideWiringSvg(scene),
  );
  const [bomMarkdown, setBomMarkdown] = useState<string>(() =>
    renderBomWithRate(scene, defaultCatalogRegistry.toRecord(), 0.32),
  );
  const [electricityPricePerKwhEur, setElectricityPricePerKwhEurState] =
    useState<number>(0.32);
  const [labelsCsv, setLabelsCsv] = useState<string>(() =>
    generateCableLabelsCsv(deserializeRackScene(scene)),
  );
  const [labelsSvg, setLabelsSvg] = useState<string>(() =>
    generateCableLabelsSvg(deserializeRackScene(scene)),
  );
  const catalogRecordRef = useRef<Record<string, HardwareBlueprint>>(
    defaultCatalogRegistry.toRecord(),
  );
  const sceneRef = useRef<SerializedRackScene>(scene);
  sceneRef.current = scene;
  const electricityPriceRef = useRef<number>(0.32);

  // Workspace & 3D HUD state
  const [activeTab, setActiveTab] = useState<WorkspaceTab>(initialTab);
  const [xrayMode, setXrayMode] = useState<boolean>(false);
  const [explodeZMm, setExplodeZMm] = useState<number>(0);
  const [cableFilter, setCableFilter] = useState<CableFilterMode>('all');
  const [cameraPreset, setCameraPreset] =
    useState<CameraPresetMode>('isometric');
  const [showClearanceBoxes, setShowClearanceBoxes] = useState<boolean>(false);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [catalogDrawerOpen, setCatalogDrawerOpen] = useState<boolean>(false);

  // Selection, Hover & Direct 2-Click 3D Port Patching state
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(
    () =>
      sharedHashBootProject
        ? (sharedHashBootProject.mounted_devices?.[0]?.instance_id ?? null)
        : initialPresetOption
          ? initialPresetOption.defaultSelectedDeviceId
          : 'sw-u8',
  );
  const [selectedCableId, setSelectedCableId] = useState<string | null>(null);
  const [hoveredPort, setHoveredPort] = useState<HoveredPortInfo | null>(null);
  const [pendingPort, setPendingPort] = useState<PendingPortSelection | null>(
    null,
  );

  const wsRef = useRef<WebSocket | null>(null);
  const wsReadOnlyRef = useRef<boolean>(false);

  const syncDerivedExports = useCallback(
    (nextScene: SerializedRackScene, rateEur = electricityPriceRef.current) => {
      const computed = deserializeRackScene(nextScene);
      setElevationSvg(renderClientSideElevationSvg(nextScene));
      setWiringSvg(renderClientSideWiringSvg(nextScene));
      setBomMarkdown(
        generateBomMarkdown(computed, catalogRecordRef.current, {
          electricityPricePerKwhEur: rateEur,
        }),
      );
      setLabelsCsv(generateCableLabelsCsv(computed));
      setLabelsSvg(generateCableLabelsSvg(computed));
    },
    [],
  );

  const setElectricityPricePerKwhEur = useCallback(
    (rateEur: number) => {
      const clamped = Number.isFinite(rateEur)
        ? Math.max(0, Math.min(5, Math.round(rateEur * 1000) / 1000))
        : 0.32;
      electricityPriceRef.current = clamped;
      setElectricityPricePerKwhEurState(clamped);
      setBomMarkdown(
        renderBomWithRate(
          sceneRef.current,
          catalogRecordRef.current,
          clamped,
        ),
      );
    },
    [],
  );

  const refreshSidecarExports = useCallback(
    async (baseUrl: string, sessionQuery = '') => {
      try {
        const [elevRes, wireRes, bomRes, labelsCsvRes, labelsSvgRes] =
          await Promise.all([
            fetch(`${baseUrl}/api/export/elevation.svg${sessionQuery}`),
            fetch(`${baseUrl}/api/export/wiring.svg${sessionQuery}`),
            fetch(`${baseUrl}/api/export/bom.md${sessionQuery}`),
            fetch(`${baseUrl}/api/export/labels.csv${sessionQuery}`),
            fetch(`${baseUrl}/api/export/labels.svg${sessionQuery}`),
          ]);
        if (elevRes.ok) {
          setElevationSvg(await elevRes.text());
        }
        if (wireRes.ok) {
          setWiringSvg(await wireRes.text());
        }
        if (bomRes.ok && Math.abs(electricityPriceRef.current - 0.32) < 1e-6) {
          setBomMarkdown(await bomRes.text());
        } else if (Math.abs(electricityPriceRef.current - 0.32) >= 1e-6) {
          setBomMarkdown(
            renderBomWithRate(
              sceneRef.current,
              catalogRecordRef.current,
              electricityPriceRef.current,
            ),
          );
        }
        if (labelsCsvRes.ok) {
          setLabelsCsv(await labelsCsvRes.text());
        }
        if (labelsSvgRes.ok) {
          setLabelsSvg(await labelsSvgRes.text());
        }
      } catch {
        // Keep client-side rendered SVG/BOM fallback
      }
    },
    [],
  );

  const applyStandaloneMutation = useCallback(
    (mutator: (draft: RackProjectInput) => RackProjectInput) => {
      const prev = structuredClone(initialInputRef.current);
      undoStackRef.current.push(prev);
      redoStackRef.current = [];
      const nextInput = mutator(structuredClone(prev));
      initialInputRef.current = nextInput;
      const nextScene = evaluateStandaloneScene(
        nextInput,
        catalogRecordRef.current,
      );
      sceneRef.current = nextScene;
      setScene(nextScene);
      setUndoAvailable(undoStackRef.current.length);
      setRedoAvailable(0);
      syncDerivedExports(nextScene);
    },
    [syncDerivedExports],
  );

  const moveDeviceU = useCallback(
    (instanceId: string, newUPosition: number) => {
      const clampedU = Math.max(
        1,
        Math.min(scene.project.rack.u_height, Math.round(newUPosition)),
      );
      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'modify_equipment',
            args: {
              instance_id: instanceId,
              action: 'move',
              new_u_position: clampedU,
            },
          }),
        );
        return;
      }

      applyStandaloneMutation((draft) => {
        const list = draft.mounted_devices ?? [];
        for (const dev of list) {
          if (dev.instance_id === instanceId) {
            dev.u_position = clampedU;
          }
        }
        return draft;
      });
    },
    [applyStandaloneMutation, connectionMode, scene.project.rack.u_height],
  );

  const undo = useCallback(() => {
    if (
      connectionMode === 'sidecar-live' &&
      !wsReadOnlyRef.current &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: 'COMMAND',
          tool: 'undo_redo',
          args: { action: 'undo' },
        }),
      );
      return;
    }
    const previous = undoStackRef.current.pop();
    if (!previous) return;
    redoStackRef.current.push(structuredClone(initialInputRef.current));
    initialInputRef.current = previous;
    const nextScene = evaluateStandaloneScene(
      previous,
      catalogRecordRef.current,
    );
    sceneRef.current = nextScene;
    setScene(nextScene);
    setUndoAvailable(undoStackRef.current.length);
    setRedoAvailable(redoStackRef.current.length);
    syncDerivedExports(nextScene);
  }, [connectionMode, syncDerivedExports]);

  const redo = useCallback(() => {
    if (
      connectionMode === 'sidecar-live' &&
      !wsReadOnlyRef.current &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: 'COMMAND',
          tool: 'undo_redo',
          args: { action: 'redo' },
        }),
      );
      return;
    }
    const next = redoStackRef.current.pop();
    if (!next) return;
    undoStackRef.current.push(structuredClone(initialInputRef.current));
    initialInputRef.current = next;
    const nextScene = evaluateStandaloneScene(next, catalogRecordRef.current);
    sceneRef.current = nextScene;
    setScene(nextScene);
    setUndoAvailable(undoStackRef.current.length);
    setRedoAvailable(redoStackRef.current.length);
    syncDerivedExports(nextScene);
  }, [connectionMode, syncDerivedExports]);

  const selectPreset = useCallback(
    (presetId: StandalonePresetId) => {
      undoStackRef.current = [];
      redoStackRef.current = [];
      const presetInput = createStandalonePresetProjectInput(presetId);
      initialInputRef.current = presetInput;
      const nextScene = evaluateStandaloneScene(
        presetInput,
        catalogRecordRef.current,
      );
      sceneRef.current = nextScene;
      const meta = STANDALONE_PRESET_OPTIONS.find(
        (opt) => opt.id === presetId,
      );
      setActivePresetId(presetId);
      setScene(nextScene);
      setPendingPort(null);
      setSelectedCableId(null);
      setSelectedDeviceId(meta?.defaultSelectedDeviceId ?? null);
      setUndoAvailable(0);
      setRedoAvailable(0);
      syncDerivedExports(nextScene);
      setMcpToolLog([
        {
          id: `preset-${presetId}-${Date.now()}`,
          timestamp: 'PRESET',
          tool: 'validate_rack',
          summary: `Loaded preset '${nextScene.project.project_name}' (${nextScene.project.rack.standard.toUpperCase()} · ${nextScene.project.rack.u_height}U · ${nextScene.validation.error_count} Errors).`,
          status: nextScene.validation.is_valid ? 'VALID' : 'INVALID',
          errorCount: nextScene.validation.error_count,
          warningCount: nextScene.validation.warning_count,
        },
      ]);
      if (
        typeof window !== 'undefined' &&
        (window.location.hash.includes('rack=v1.') ||
          window.location.hash.includes('rack=v2.') ||
          new URLSearchParams(window.location.search).has('s'))
      ) {
        const nextParams = new URLSearchParams(window.location.search);
        nextParams.delete('s');
        const nextQuery = nextParams.toString();
        window.history.replaceState(
          null,
          '',
          `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ''}`,
        );
      }
    },
    [syncDerivedExports],
  );

  const resetDemoScene = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
    const fresh = createStandalonePresetProjectInput(activePresetId);
    initialInputRef.current = fresh;
    const nextScene = evaluateStandaloneScene(fresh, catalogRecordRef.current);
    sceneRef.current = nextScene;
    const meta = STANDALONE_PRESET_OPTIONS.find(
      (opt) => opt.id === activePresetId,
    );
    setScene(nextScene);
    setPendingPort(null);
    setSelectedCableId(null);
    setSelectedDeviceId(meta?.defaultSelectedDeviceId ?? null);
    if (activePresetId === '10inch-homelab') {
      setMcpToolLog(DEFAULT_STANDALONE_TOOL_LOG);
    }
    setUndoAvailable(0);
    setRedoAvailable(0);
    syncDerivedExports(nextScene);
  }, [activePresetId, syncDerivedExports]);

  const simulateAgentStep = useCallback(
    (stage: 'collision' | 'resolved') => {
      if (stage === 'collision') {
        const base = createStandaloneHomelabProjectInput();
        const collisionInput: RackProjectInput = {
          ...base,
          mounted_devices: (base.mounted_devices ?? []).map((dev) =>
            dev.instance_id === 'pdu-u2-rear'
              ? { ...dev, u_position: 1, face: 'rear' }
              : dev,
          ),
        };
        undoStackRef.current.push(structuredClone(initialInputRef.current));
        redoStackRef.current = [];
        initialInputRef.current = collisionInput;
        const nextScene = evaluateStandaloneScene(
          collisionInput,
          catalogRecordRef.current,
        );
        sceneRef.current = nextScene;
        setScene(nextScene);
        setUndoAvailable(undoStackRef.current.length);
        setRedoAvailable(0);
        syncDerivedExports(nextScene);
        setActiveTab('3d');
        setShowClearanceBoxes(true);
        setCameraPreset('side-cutaway');
        setSelectedDeviceId('ups-u1');
        setMcpToolLog([
          {
            id: `sim-collision-${Date.now()}`,
            timestamp: 'LIVE',
            tool: 'connect_cables',
            summary:
              "PLUG_CLEARANCE_COLLISION on U1: 'ups-u1' rear Schuko/IEC plug (+45mm) collides with 'pdu-u2-rear' on U1 Rear.",
            status: 'INVALID',
            errorCount: nextScene.validation.error_count,
            warningCount: nextScene.validation.warning_count,
          },
          ...DEFAULT_STANDALONE_TOOL_LOG.slice(-2),
        ]);
        return;
      }

      const resolvedInput = createStandaloneHomelabProjectInput();
      undoStackRef.current.push(structuredClone(initialInputRef.current));
      redoStackRef.current = [];
      initialInputRef.current = resolvedInput;
      const nextScene = evaluateStandaloneScene(
        resolvedInput,
        catalogRecordRef.current,
      );
      sceneRef.current = nextScene;
      setScene(nextScene);
      setUndoAvailable(undoStackRef.current.length);
      setRedoAvailable(0);
      syncDerivedExports(nextScene);
      setShowClearanceBoxes(false);
      setCameraPreset('isometric');
      setSelectedDeviceId('pdu-u2-rear');
      setMcpToolLog(DEFAULT_STANDALONE_TOOL_LOG);
    },
    [syncDerivedExports],
  );

  const mountEquipmentFromCatalog = useCallback(
    (
      blueprintSlug: string,
      targetU: number,
      face: RackFace,
      hostname?: string,
    ) => {
      const clampedU = Math.max(
        1,
        Math.min(scene.project.rack.u_height, Math.round(targetU)),
      );
      const uniqueSuffix = Math.floor(100 + Math.random() * 900);
      const shortPrefix = blueprintSlug.split('-').slice(0, 2).join('-');
      const instanceId = `${shortPrefix}-u${clampedU}-${uniqueSuffix}`;

      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'mount_equipment',
            args: {
              instance_id: instanceId,
              blueprint_slug: blueprintSlug,
              u_position: clampedU,
              face,
              ...(hostname ? { hostname } : {}),
            },
          }),
        );
        setSelectedDeviceId(instanceId);
        return;
      }

      applyStandaloneMutation((draft) => {
        const list = draft.mounted_devices ?? [];
        list.push({
          instance_id: instanceId,
          blueprint_slug: blueprintSlug,
          u_position: clampedU,
          face,
          ...(hostname ? { hostname } : {}),
          children: [],
        });
        draft.mounted_devices = list;
        return draft;
      });
      setSelectedDeviceId(instanceId);
    },
    [applyStandaloneMutation, connectionMode, scene.project.rack.u_height],
  );

  const removeEquipment = useCallback(
    (instanceId: string) => {
      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'modify_equipment',
            args: {
              instance_id: instanceId,
              action: 'remove',
              remove_connected_cables: true,
            },
          }),
        );
        if (selectedDeviceId === instanceId) setSelectedDeviceId(null);
        return;
      }

      applyStandaloneMutation((draft) => {
        const removedIds = new Set<string>([instanceId]);
        const nextMounted = (draft.mounted_devices ?? []).filter((d) => {
          if (d.instance_id === instanceId) {
            for (const c of d.children ?? []) {
              removedIds.add(c.instance_id);
            }
            return false;
          }
          d.children = (d.children ?? []).filter(
            (c) => c.instance_id !== instanceId,
          );
          return true;
        });
        draft.mounted_devices = nextMounted;
        draft.cables = (draft.cables ?? []).filter(
          (cab) =>
            !removedIds.has(cab.from.instance_id) &&
            !removedIds.has(cab.to.instance_id),
        );
        return draft;
      });
      if (selectedDeviceId === instanceId) setSelectedDeviceId(null);
    },
    [applyStandaloneMutation, connectionMode, selectedDeviceId],
  );

  const connectInteractiveCable = useCallback(
    (
      fromInstanceId: string,
      fromPortId: string,
      toInstanceId: string,
      toPortId: string,
      cableType: CableType,
      vlanId?: number,
      ipCidr?: string,
      fromFace?: RackFace,
      toFace?: RackFace,
    ) => {
      const cableId = `cab-${fromInstanceId}-${fromPortId}-to-${toInstanceId}-${toPortId}`
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '-');
      const colorHex = cableType.startsWith('power-')
        ? '#EF4444'
        : cableType.startsWith('sfp-')
          ? '#06B6D4'
          : '#38BDF8';

      const newCable = {
        cable_id: cableId,
        cable_type: cableType,
        color_hex: colorHex,
        label: `${fromInstanceId}:${fromPortId} -> ${toInstanceId}:${toPortId}`,
        from: {
          instance_id: fromInstanceId,
          port_id: fromPortId,
          ...(fromFace ? { face: fromFace } : {}),
        },
        to: {
          instance_id: toInstanceId,
          port_id: toPortId,
          ...(toFace ? { face: toFace } : {}),
        },
        ...(vlanId !== undefined ? { vlan_id: vlanId } : {}),
        ...(ipCidr !== undefined && ipCidr.trim().length > 0
          ? { ip_cidr: ipCidr.trim() }
          : {}),
      };

      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'connect_cables',
            args: { cables: [newCable] },
          }),
        );
        setSelectedCableId(cableId);
        return;
      }

      applyStandaloneMutation((draft) => {
        const list = (draft.cables ?? []).filter((c) => c.cable_id !== cableId);
        list.push(newCable);
        draft.cables = list;
        return draft;
      });
      setSelectedCableId(cableId);
    },
    [applyStandaloneMutation, connectionMode],
  );

  const handlePortClick3D = useCallback(
    (target: PendingPortSelection, existingCableId?: string) => {
      if (pendingPort === null) {
        if (existingCableId) {
          setSelectedCableId(existingCableId);
          setSelectedDeviceId(null);
          return;
        }
        setPendingPort(target);
        return;
      }

      if (
        pendingPort.instanceId === target.instanceId &&
        pendingPort.portId === target.portId &&
        pendingPort.worldFace === target.worldFace
      ) {
        setPendingPort(null);
        return;
      }

      if (existingCableId) {
        // Destination port is already occupied — select its cable and clear patch mode
        setPendingPort(null);
        setSelectedCableId(existingCableId);
        setSelectedDeviceId(null);
        return;
      }

      const inferredType = inferCableTypeForConnectors(
        pendingPort.connectorType,
        target.connectorType,
      );
      connectInteractiveCable(
        pendingPort.instanceId,
        pendingPort.portId,
        target.instanceId,
        target.portId,
        inferredType,
        undefined,
        undefined,
        pendingPort.worldFace,
        target.worldFace,
      );
      setPendingPort(null);
    },
    [connectInteractiveCable, pendingPort],
  );

  const buildShareableRackUrl = useCallback(async (): Promise<string> => {
    if (typeof window === 'undefined') {
      return encodeRackProjectToCompressedHash(scene.project);
    }

    const { protocol, hostname, origin, pathname } = window.location;
    const normalizedHost = hostname.toLowerCase();
    const isGitHubPages =
      normalizedHost === 'github.io' || normalizedHost.endsWith('.github.io');
    const isTestRunner =
      typeof navigator !== 'undefined' &&
      (navigator.userAgent.includes('jsdom') ||
        navigator.userAgent.includes('HappyDOM'));

    if (
      !isGitHubPages &&
      !isTestRunner &&
      (protocol === 'http:' || protocol === 'https:') &&
      typeof fetch === 'function'
    ) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), 4000);
      try {
        const res = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project: scene.project }),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = (await res.json()) as { readonly id?: unknown };
          if (
            typeof data.id === 'string' &&
            /^[a-z0-9]{8}$/.test(data.id)
          ) {
            const shortPath = `/?s=${data.id}`;
            window.history.replaceState(null, '', shortPath);
            return `${origin}${shortPath}`;
          }
        }
      } catch {
        // Fall through cleanly to compressed client-side `#rack=v2.` hash
      } finally {
        window.clearTimeout(timer);
      }
    }

    const hash = await encodeRackProjectToCompressedHash(scene.project);
    const nextParams = new URLSearchParams(window.location.search);
    nextParams.delete('s');
    const nextQuery = nextParams.toString();
    const querySuffix = nextQuery ? `?${nextQuery}` : '';
    window.history.replaceState(null, '', `${pathname}${querySuffix}${hash}`);
    return `${origin}${pathname}${querySuffix}${hash}`;
  }, [scene.project]);

  const disconnectCable = useCallback(
    (cableId: string) => {
      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'disconnect_cables',
            args: { cable_ids: [cableId] },
          }),
        );
        if (selectedCableId === cableId) setSelectedCableId(null);
        return;
      }

      applyStandaloneMutation((draft) => {
        draft.cables = (draft.cables ?? []).filter(
          (c) => c.cable_id !== cableId,
        );
        return draft;
      });
      if (selectedCableId === cableId) setSelectedCableId(null);
    },
    [applyStandaloneMutation, connectionMode, selectedCableId],
  );

  const exportProjectYaml = useCallback((): string => {
    return stringifyYaml(sceneRef.current.project, {
      indent: 2,
      lineWidth: 120,
    });
  }, []);

  const importProjectFile = useCallback(
    (rawText: string, filename?: string): ProjectImportResult => {
      const trimmed = rawText.trim();
      if (!trimmed) {
        return {
          ok: false,
          format: null,
          summary: 'Empty file content.',
          importedDevicesCount: 0,
          unmatchedCount: 0,
        };
      }

      let parsed: unknown = null;
      let wasJson = trimmed.startsWith('{') || trimmed.startsWith('[');
      try {
        parsed = wasJson ? JSON.parse(trimmed) : parseYaml(trimmed);
      } catch {
        try {
          parsed = parseYaml(trimmed);
          wasJson = false;
        } catch {
          parsed = null;
        }
      }

      if (parsed !== null) {
        const directProject = RackProjectSchema.safeParse(parsed);
        if (directProject.success) {
          applyStandaloneMutation(() => directProject.data);
          setSelectedDeviceId(
            directProject.data.mounted_devices?.[0]?.instance_id ?? null,
          );
          setSelectedCableId(null);
          const fmt = wasJson ? 'rack-json' : 'rack-yaml';
          const count = directProject.data.mounted_devices?.length ?? 0;
          const summary = `Imported ${fmt === 'rack-json' ? 'rack.json' : 'rack.yaml'} '${directProject.data.project_name}' (${count} devices).`;
          setMcpToolLog((prev) => [
            {
              id: `import-${fmt}-${Date.now()}`,
              timestamp: 'IMPORT',
              tool: 'validate_rack',
              summary,
              status: 'VALID',
              errorCount: 0,
              warningCount: 0,
            },
            ...prev.slice(0, 19),
          ]);
          return {
            ok: true,
            format: fmt,
            summary,
            importedDevicesCount: count,
            unmatchedCount: 0,
          };
        }

        const extFormat = detectExternalImportFormat(parsed);
        if (extFormat !== null) {
          const cleanName = filename
            ?.replace(/\.(json|ya?ml)$/i, '')
            .trim();
          const imported = importExternalInventory(trimmed, {
            format: extFormat,
            ...(cleanName ? { projectName: cleanName } : {}),
            catalog: catalogRecordRef.current,
          });
          applyStandaloneMutation(() => imported.project);
          setSelectedDeviceId(
            imported.project.mounted_devices?.[0]?.instance_id ?? null,
          );
          setSelectedCableId(null);
          const totalCount =
            imported.matchedDevices + imported.fallbackDevices;
          const summary = `Imported ${extFormat.toUpperCase()} inventory: ${imported.matchedDevices} matched, ${imported.fallbackDevices} fallback placeholders.`;
          setMcpToolLog((prev) => [
            {
              id: `import-${extFormat}-${Date.now()}`,
              timestamp: 'IMPORT',
              tool: 'validate_rack',
              summary,
              status: imported.fallbackDevices > 0 ? 'INVALID' : 'VALID',
              errorCount: 0,
              warningCount: imported.warnings.length,
            },
            ...prev.slice(0, 19),
          ]);
          return {
            ok: true,
            format: extFormat,
            summary,
            importedDevicesCount: totalCount,
            unmatchedCount: imported.fallbackDevices,
          };
        }
      }

      return {
        ok: false,
        format: null,
        summary:
          'Unsupported file format. Expected rack.yaml, rack.json, NetBox, UniFi, or Proxmox inventory.',
        importedDevicesCount: 0,
        unmatchedCount: 0,
      };
    },
    [applyStandaloneMutation],
  );

  const importProjectJson = useCallback(
    (rawJsonText: string): boolean => {
      return importProjectFile(rawJsonText).ok;
    },
    [importProjectFile],
  );

  const registerCustomBlueprint = useCallback(
    (rawBlueprint: unknown): CustomBlueprintRegisterResult => {
      const parsed = HardwareBlueprintSchema.safeParse(rawBlueprint);
      if (!parsed.success) {
        const msg = parsed.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; ');
        return { ok: false, error: msg };
      }
      const normalized = normalizeHardwareBlueprint(parsed.data);
      const nextRecord = {
        ...catalogRecordRef.current,
        [normalized.slug]: normalized,
      };
      catalogRecordRef.current = nextRecord;
      setCatalog(Object.values(nextRecord));
      const reEvaluated = evaluateStandaloneScene(
        initialInputRef.current,
        nextRecord,
      );
      sceneRef.current = reEvaluated;
      setScene(reEvaluated);
      syncDerivedExports(reEvaluated);

      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'define_custom_blueprint',
            args: { blueprint: parsed.data },
          }),
        );
      }

      setMcpToolLog((prev) => [
        {
          id: `custom-bp-${normalized.slug}-${Date.now()}`,
          timestamp: 'LIVE',
          tool: 'define_custom_blueprint',
          summary: `Registered custom blueprint '${normalized.slug}' (${normalized.geometry.width_mm}x${normalized.geometry.height_mm}x${normalized.geometry.depth_mm}mm, ${normalized.ports.length} ports).`,
          status: 'VALID',
          errorCount: 0,
          warningCount: 0,
        },
        ...prev.slice(0, 19),
      ]);

      trackUiEvent('custom_blueprint_register');
      return { ok: true, slug: normalized.slug };
    },
    [connectionMode, syncDerivedExports],
  );

  const initNewRack = useCallback(
    (params: InitNewRackParams) => {
      if (
        connectionMode === 'sidecar-live' &&
        !wsReadOnlyRef.current &&
        wsRef.current &&
        wsRef.current.readyState === WebSocket.OPEN
      ) {
        wsRef.current.send(
          JSON.stringify({
            type: 'COMMAND',
            tool: 'init_rack',
            args: {
              project_name: params.project_name,
              standard: params.standard,
              u_height: params.u_height,
              rail_depth_mm: params.rail_depth_mm,
              enclosure_type: params.enclosure_type,
              front_door_clearance_mm: params.standard === '19inch' ? 55 : 45,
              rear_clearance_mm: params.standard === '19inch' ? 60 : 40,
            },
          }),
        );
        setSelectedDeviceId(null);
        setSelectedCableId(null);
        return;
      }

      applyStandaloneMutation(() => ({
        schema_version: '1.0',
        project_name: params.project_name,
        rack: {
          standard: params.standard,
          u_height: params.u_height,
          rail_depth_mm: params.rail_depth_mm,
          enclosure_type: params.enclosure_type,
          front_door_clearance_mm: params.standard === '19inch' ? 55 : 45,
          rear_clearance_mm: params.standard === '19inch' ? 60 : 40,
        },
        mounted_devices: [],
        cables: [],
      }));
      setSelectedDeviceId(null);
      setSelectedCableId(null);
    },
    [applyStandaloneMutation, connectionMode],
  );

  const exportDeliverablesToDisk = useCallback(() => {
    if (
      connectionMode === 'sidecar-live' &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: 'COMMAND',
          tool: 'export_deliverables',
          args: {
            formats: [
              'elevation-svg',
              'wiring-svg',
              'bom-md',
              'scene-glb',
              'carrier-scad',
              'carrier-stl',
            ],
          },
        }),
      );
    }
  }, [connectionMode]);

  const clearMcpToolLog = useCallback(() => {
    if (
      connectionMode === 'sidecar-live' &&
      !wsReadOnlyRef.current &&
      wsRef.current &&
      wsRef.current.readyState === WebSocket.OPEN
    ) {
      wsRef.current.send(
        JSON.stringify({
          type: 'COMMAND',
          tool: 'clear_tool_log',
          args: {},
        }),
      );
    }
    setMcpToolLog([]);
  }, [connectionMode]);

  const selectDevice = useCallback((instanceId: string | null) => {
    setSelectedDeviceId(instanceId);
    if (instanceId !== null) {
      setSelectedCableId(null);
    }
  }, []);

  const selectCable = useCallback((cableId: string | null) => {
    setSelectedCableId(cableId);
    if (cableId !== null) {
      setSelectedDeviceId(null);
    }
  }, []);

  const hydrateSharedProject = useCallback(
    (projectInput: RackProjectInput, sourceLabel: string) => {
      undoStackRef.current = [];
      redoStackRef.current = [];
      initialInputRef.current = projectInput;
      const nextScene = evaluateStandaloneScene(
        projectInput,
        catalogRecordRef.current,
      );
      sceneRef.current = nextScene;
      setScene(nextScene);
      setPendingPort(null);
      setSelectedCableId(null);
      setSelectedDeviceId(
        projectInput.mounted_devices?.[0]?.instance_id ?? null,
      );
      setUndoAvailable(0);
      setRedoAvailable(0);
      syncDerivedExports(nextScene);
      setMcpToolLog((prev) => [
        {
          id: `shared-${Date.now()}`,
          timestamp: 'SHARED',
          tool: 'validate_rack',
          summary: `Loaded shared rack '${nextScene.project.project_name}' via ${sourceLabel} (${nextScene.validation.error_count} Errors).`,
          status: nextScene.validation.is_valid ? 'VALID' : 'INVALID',
          errorCount: nextScene.validation.error_count,
          warningCount: nextScene.validation.warning_count,
        },
        ...prev.slice(0, 19),
      ]);
    },
    [syncDerivedExports],
  );

  // Hydrate `?s=<8-char-id>` short links & `#rack=v2.` compressed hashes on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let cancelled = false;

    const searchParams = new URLSearchParams(window.location.search);
    const shortId = searchParams.get('s')?.trim() ?? '';
    if (/^[a-z0-9]{8}$/.test(shortId) && typeof fetch === 'function') {
      void fetch(`/api/share/${encodeURIComponent(shortId)}`)
        .then(async (res) => {
          if (!res.ok || cancelled) return;
          const body = (await res.json()) as { readonly project?: unknown };
          const validated = RackProjectSchema.safeParse(body.project);
          if (validated.success && !cancelled) {
            hydrateSharedProject(validated.data, `short link ?s=${shortId}`);
          }
        })
        .catch(() => {});
    } else if (window.location.hash.includes('rack=v2.')) {
      void decodeRackProjectFromHashAsync(window.location.hash).then(
        (decoded) => {
          if (decoded && !cancelled) {
            hydrateSharedProject(decoded, 'compressed #rack=v2 URL');
          }
        },
      );
    }

    return () => {
      cancelled = true;
    };
  }, [hydrateSharedProject]);

  // Hydrate shared `#rack=v1.` or `#rack=v2.` URL hash changes in standalone mode
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onHashChange = () => {
      if (connectionMode === 'sidecar-live') return;
      void decodeRackProjectFromHashAsync(window.location.hash).then(
        (decoded) => {
          if (!decoded) return;
          hydrateSharedProject(decoded, 'shared URL hash');
        },
      );
    };
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [connectionMode, hydrateSharedProject]);

  // Connect to Sidecar via HTTP + WebSocket when running in browser
  useEffect(() => {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
      return;
    }
    const searchParams = new URLSearchParams(window.location.search);
    const rawSessionParam = searchParams.get('session')?.trim() ?? '';
    const hasExplicitSession = /^[a-zA-Z0-9_-]{1,128}$/.test(rawSessionParam);
    const rawShortShareParam = searchParams.get('s')?.trim() ?? '';
    const hasShortShare = /^[a-z0-9]{8}$/.test(rawShortShareParam);
    const rawDeepLinkPreset = searchParams.get('preset')?.trim() ?? '';
    const hasDeepLinkPreset = STANDALONE_PRESET_OPTIONS.some(
      (opt) => opt.id === rawDeepLinkPreset,
    );
    if (
      (window.location.hash.includes('rack=v1.') ||
        window.location.hash.includes('rack=v2.') ||
        hasShortShare ||
        hasDeepLinkPreset) &&
      !hasExplicitSession
    ) {
      return;
    }
    // Skip automatic network connection inside JSDOM / HappyDOM unit tests
    if (
      window.navigator.userAgent.includes('jsdom') ||
      window.navigator.userAgent.includes('HappyDOM')
    ) {
      return;
    }

    let cancelled = false;
    const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || '127.0.0.1:3100';
    const sessionQuery = hasExplicitSession
      ? `?session=${encodeURIComponent(rawSessionParam)}`
      : '';
    const apiBase = `${protocol}//${host}`;
    const wsUrl = `${wsProtocol}//${host}/ws${sessionQuery}`;

    const connectSidecar = async () => {
      let sidecarSessionActive = false;
      try {
        const [stateRes, catRes] = await Promise.all([
          fetch(`${apiBase}/api/state${sessionQuery}`),
          fetch(`${apiBase}/api/catalog${sessionQuery}`),
        ]);
        if (!cancelled && stateRes.ok) {
          sidecarSessionActive = true;
          const stateData = (await stateRes.json()) as {
            projectPath?: string | null | undefined;
            scene: SerializedRackScene;
            undoAvailable: number;
            redoAvailable: number;
            toolCallLog?: readonly McpToolCallItem[] | undefined;
          };
          sceneRef.current = stateData.scene;
          setScene(stateData.scene);
          setProjectPath(stateData.projectPath ?? null);
          setUndoAvailable(stateData.undoAvailable);
          setRedoAvailable(stateData.redoAvailable);
          setMcpToolLog(
            Array.isArray(stateData.toolCallLog) ? stateData.toolCallLog : [],
          );
          setConnectionMode('sidecar-live');
          await refreshSidecarExports(apiBase, sessionQuery);
        }
        if (!cancelled && catRes.ok) {
          const catData = (await catRes.json()) as {
            blueprints: HardwareBlueprint[];
          };
          if (Array.isArray(catData.blueprints)) {
            const nextCat: Record<string, HardwareBlueprint> = {};
            for (const bp of catData.blueprints) {
              nextCat[bp.slug] = bp;
            }
            catalogRecordRef.current = nextCat;
            setCatalog(catData.blueprints);
          }
        }
      } catch {
        // Sidecar unreachable -> stay in standalone-demo mode
      }

      if (cancelled || !sidecarSessionActive) return;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!cancelled) {
            setConnectionMode('sidecar-live');
          }
        };

        ws.onmessage = (ev) => {
          if (cancelled) return;
          try {
            const msg = JSON.parse(String(ev.data)) as SidecarWsIncoming;
            if (msg.readOnly !== undefined) {
              wsReadOnlyRef.current = msg.readOnly;
            }
            if (
              (msg.type === 'INITIAL_STATE' ||
                msg.type === 'STATE_UPDATED' ||
                msg.type === 'RACK_SCENE_UPDATE') &&
              msg.scene
            ) {
              initialInputRef.current = structuredClone(msg.scene.project);
              sceneRef.current = msg.scene;
              setScene(msg.scene);
              if (msg.projectPath !== undefined) {
                setProjectPath(msg.projectPath ?? null);
              }
              if (Array.isArray(msg.blueprints)) {
                const nextCat: Record<string, HardwareBlueprint> = {};
                for (const bp of msg.blueprints) {
                  nextCat[bp.slug] = bp;
                }
                catalogRecordRef.current = nextCat;
                setCatalog(msg.blueprints);
              }
              setUndoAvailable(msg.undoAvailable ?? 0);
              setRedoAvailable(msg.redoAvailable ?? 0);
              if (Array.isArray(msg.toolCallLog)) {
                setMcpToolLog(msg.toolCallLog);
              }
              syncDerivedExports(msg.scene);
              void refreshSidecarExports(apiBase, sessionQuery);
            }
          } catch {
            // Ignore malformed message
          }
        };

        ws.onclose = () => {
          if (!cancelled) {
            setConnectionMode('standalone-demo');
          }
        };
      } catch {
        // Stay in standalone-demo mode
      }
    };

    void connectSidecar();

    return () => {
      cancelled = true;
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [refreshSidecarExports]);

  // Progressive Enhancement: Register Client-Side WebMCP Tools (`document.modelContext.registerTool`)
  useEffect(() => {
    if (typeof document === 'undefined' || !('modelContext' in document)) {
      return;
    }
    const modelContext = document.modelContext;
    if (!modelContext) {
      return;
    }

    const abortController = new AbortController();
    const signal = abortController.signal;

    const registerTools = async () => {
      try {
        await modelContext.registerTool(
          {
            name: MCP_TOOL_DEFINITIONS.validate_rack.name,
            description: MCP_TOOL_DEFINITIONS.validate_rack.description,
            inputSchema: { type: 'object', properties: {} },
            annotations: {
              readOnlyHint:
                MCP_TOOL_DEFINITIONS.validate_rack.annotations.readOnlyHint,
            },
            execute: () => ({
              status: scene.validation.status,
              is_valid: scene.validation.is_valid,
              error_count: scene.validation.error_count,
              warning_count: scene.validation.warning_count,
              issues: scene.validation.issues,
              power_summary: scene.validation.power_summary,
              mechanical_summary: scene.validation.mechanical_summary,
            }),
          },
          { signal },
        );

        await modelContext.registerTool(
          {
            name: MCP_TOOL_DEFINITIONS.search_catalog.name,
            description: MCP_TOOL_DEFINITIONS.search_catalog.description,
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string' },
                category: { type: 'string' },
              },
            },
            annotations: {
              readOnlyHint:
                MCP_TOOL_DEFINITIONS.search_catalog.annotations.readOnlyHint,
            },
            execute: (input: Record<string, unknown>) => {
              const q =
                typeof input['query'] === 'string'
                  ? input['query'].toLowerCase()
                  : '';
              const filtered = catalog.filter(
                (b) =>
                  !q ||
                  b.slug.toLowerCase().includes(q) ||
                  b.model.toLowerCase().includes(q) ||
                  b.manufacturer.toLowerCase().includes(q),
              );
              return {
                count: filtered.length,
                blueprints: filtered.map((b) => ({
                  slug: b.slug,
                  manufacturer: b.manufacturer,
                  model: b.model,
                  category: b.category,
                  u_height: b.geometry.u_height,
                  depth_mm: b.geometry.depth_mm,
                })),
              };
            },
          },
          { signal },
        );

        await modelContext.registerTool(
          {
            name: MCP_TOOL_DEFINITIONS.undo_redo.name,
            description: MCP_TOOL_DEFINITIONS.undo_redo.description,
            inputSchema: {
              type: 'object',
              properties: {
                action: { type: 'string', enum: ['undo', 'redo'] },
              },
              required: ['action'],
            },
            annotations: {
              readOnlyHint:
                MCP_TOOL_DEFINITIONS.undo_redo.annotations.readOnlyHint,
            },
            execute: (input: Record<string, unknown>) => {
              if (input['action'] === 'redo') {
                redo();
              } else {
                undo();
              }
              return { status: 'OK', action: input['action'] };
            },
          },
          { signal },
        );
      } catch {
        // Ignore duplicate tool registration errors during hot reload
      }
    };

    void registerTools();

    return () => {
      abortController.abort();
    };
  }, [catalog, redo, scene.validation, undo]);

  return {
    connectionMode,
    projectPath,
    activePresetId,
    scene,
    catalog,
    mcpToolLog,
    undoAvailable,
    redoAvailable,
    elevationSvg,
    wiringSvg,
    bomMarkdown,
    labelsCsv,
    labelsSvg,
    electricityPricePerKwhEur,
    setElectricityPricePerKwhEur,
    activeTab,
    xrayMode,
    explodeZMm,
    cableFilter,
    cameraPreset,
    showClearanceBoxes,
    doorOpen,
    catalogDrawerOpen,
    selectedDeviceId,
    selectedCableId,
    hoveredPort,
    pendingPort,
    setActiveTab,
    setXrayMode,
    setExplodeZMm,
    setCableFilter,
    setCameraPreset,
    setShowClearanceBoxes,
    setDoorOpen,
    setCatalogDrawerOpen,
    selectPreset,
    buildShareableRackUrl,
    selectDevice,
    selectCable,
    setHoveredPort,
    setPendingPort,
    handlePortClick3D,
    moveDeviceU,
    mountEquipmentFromCatalog,
    removeEquipment,
    connectInteractiveCable,
    disconnectCable,
    importProjectJson,
    importProjectFile,
    exportProjectYaml,
    registerCustomBlueprint,
    initNewRack,
    exportDeliverablesToDisk,
    clearMcpToolLog,
    simulateAgentStep,
    undo,
    redo,
    resetDemoScene,
  };
}
