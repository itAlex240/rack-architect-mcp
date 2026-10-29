import { useRef, useState, type ReactNode } from 'react';
import type { SerializedRackScene } from '@rack-mcp/core-domain';
import {
  STANDALONE_PRESET_OPTIONS,
  type StandalonePresetId,
} from '../../state/standalone-presets.js';
import type {
  InitNewRackParams,
  WorkspaceTab,
} from '../../state/useRackState.js';
import {
  BlueprintLayersIcon,
  Cube3DIcon,
  DownloadIcon,
  PackageBomIcon,
  PlusIcon,
  RedoIcon,
  RotateResetIcon,
  ShareLinkIcon,
  SparklesAiIcon,
  UndoIcon,
  UploadJsonIcon,
  WiringNodesIcon,
} from './Icons.js';

export interface TopNavBarProps {
  readonly scene: SerializedRackScene;
  readonly connectionMode: 'sidecar-live' | 'standalone-demo';
  readonly projectPath?: string | null | undefined;
  readonly activePresetId?: StandalonePresetId | undefined;
  readonly activeTab: WorkspaceTab;
  readonly catalogDrawerOpen: boolean;
  readonly undoAvailable: number;
  readonly redoAvailable: number;
  readonly onSelectTab: (tab: WorkspaceTab) => void;
  readonly onToggleCatalogDrawer: () => void;
  readonly onSelectPreset?: ((presetId: StandalonePresetId) => void) | undefined;
  readonly onShareRackUrl?: (() => string) | undefined;
  readonly onImportProjectJson: (rawJson: string) => boolean;
  readonly onInitNewRack?: ((params: InitNewRackParams) => void) | undefined;
  readonly onExportDeliverablesToDisk?: (() => void) | undefined;
  readonly onUndo: () => void;
  readonly onRedo: () => void;
  readonly onResetDemo: () => void;
  readonly onSimulateAgentStep?:
    | ((stage: 'collision' | 'resolved') => void)
    | undefined;
}

const WORKSPACE_TABS: ReadonlyArray<{
  readonly id: WorkspaceTab;
  readonly label: string;
  readonly icon: ReactNode;
}> = [
  { id: '3d', label: '3D Rack', icon: <Cube3DIcon size={13} /> },
  {
    id: 'elevation',
    label: '2D Elevation',
    icon: <BlueprintLayersIcon size={13} />,
  },
  { id: 'wiring', label: 'Wiring Plan', icon: <WiringNodesIcon size={13} /> },
  { id: 'bom', label: 'BOM & 3D-Print', icon: <PackageBomIcon size={13} /> },
];

export function TopNavBar({
  scene,
  connectionMode,
  projectPath,
  activePresetId,
  activeTab,
  catalogDrawerOpen,
  undoAvailable,
  redoAvailable,
  onSelectTab,
  onToggleCatalogDrawer,
  onSelectPreset,
  onShareRackUrl,
  onImportProjectJson,
  onInitNewRack,
  onExportDeliverablesToDisk,
  onUndo,
  onRedo,
  onResetDemo,
  onSimulateAgentStep,
}: TopNavBarProps) {
  const isValid = scene.validation.is_valid;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [newRackOpen, setNewRackOpen] = useState(false);
  const [newRackName, setNewRackName] = useState('New Rack Project');
  const [newRackStandard, setNewRackStandard] = useState<
    '10inch' | '19inch' | '6inch'
  >('19inch');
  const [newRackU, setNewRackU] = useState(12);
  const [newRackDepth, setNewRackDepth] = useState(400);
  const [exportSavedFlash, setExportSavedFlash] = useState(false);
  const [shareCopiedFlash, setShareCopiedFlash] = useState(false);

  const shortFileName = projectPath
    ? projectPath.split(/[\\/]/).slice(-2).join('/')
    : 'rack.yaml';

  return (
    <header
      data-testid="top-nav-bar"
      style={{
        width: '100%',
        maxWidth: '100%',
        height: '52px',
        padding: '0 12px',
        background: '#0E0E11',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
        flexShrink: 0,
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
      }}
    >
      {/* Left: Studio Brand, Project Title, Preset Switcher & Hardware Drawer Trigger */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          minWidth: 0,
          flexShrink: 1,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '6px',
            background: '#18181D',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            color: '#F4F4F5',
            fontWeight: 700,
            fontSize: '11.5px',
            letterSpacing: '-0.01em',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: '#3B82F6',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span>RackArchitect</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minWidth: 0,
            flexShrink: 1,
          }}
        >
          {connectionMode === 'standalone-demo' && onSelectPreset ? (
            <select
              aria-label="Select Rack Preset"
              data-testid="preset-switcher-select"
              value={activePresetId ?? '10inch-homelab'}
              onChange={(e) =>
                onSelectPreset(e.target.value as StandalonePresetId)
              }
              title={`Preset: ${scene.project.project_name}`}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: '#141418',
                color: '#F4F4F5',
                fontSize: '11.5px',
                fontWeight: 600,
                maxWidth: '215px',
                minWidth: '90px',
                cursor: 'pointer',
                flexShrink: 1,
              }}
            >
              {STANDALONE_PRESET_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <span
              title={scene.project.project_name}
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#F4F4F5',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '175px',
                minWidth: '40px',
                flexShrink: 1,
              }}
            >
              {scene.project.project_name}
            </span>
          )}
          <span
            className="mono"
            style={{
              padding: '2px 6px',
              borderRadius: '4px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '10px',
              color: '#A1A1AA',
              flexShrink: 0,
            }}
          >
            {scene.project.rack.standard.toUpperCase()} ·{' '}
            {scene.project.rack.u_height}U · {scene.project.rack.rail_depth_mm}
            mm
          </span>
        </div>

        <button
          type="button"
          data-testid="btn-toggle-catalog-drawer"
          onClick={onToggleCatalogDrawer}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 9px',
            borderRadius: '6px',
            border: catalogDrawerOpen
              ? '1px solid rgba(59, 130, 246, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            background: catalogDrawerOpen ? 'rgba(59, 130, 246, 0.14)' : '#18181D',
            color: catalogDrawerOpen ? '#93C5FD' : '#E4E4E7',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <PlusIcon size={12} />
          <span>{catalogDrawerOpen ? 'Close Builder' : 'Catalog & Cables'}</span>
        </button>
      </div>

      {/* Center: Segmented 4-View Workspace Switcher */}
      <nav
        aria-label="Workspace Views"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '3px',
          borderRadius: '8px',
          background: '#141418',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          flexShrink: 0,
        }}
      >
        {WORKSPACE_TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              data-testid={`nav-tab-${tab.id}`}
              onClick={() => onSelectTab(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 9px',
                borderRadius: '6px',
                border: active
                  ? '1px solid rgba(255, 255, 255, 0.12)'
                  : '1px solid transparent',
                background: active ? '#23232B' : 'transparent',
                color: active ? '#F4F4F5' : '#A1A1AA',
                fontSize: '11px',
                fontWeight: active ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Validation Status Dot, AI Self-Correction Trigger & History Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          minWidth: 0,
          flexShrink: 0,
        }}
      >
        <span
          data-testid="validation-status-pill"
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 600,
            background: isValid
              ? 'rgba(16, 185, 129, 0.08)'
              : 'rgba(239, 68, 68, 0.12)',
            color: isValid ? '#D1FAE5' : '#FECACA',
            border: isValid
              ? '1px solid rgba(16, 185, 129, 0.25)'
              : '1px solid rgba(239, 68, 68, 0.35)',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '999px',
              background: isValid ? '#10B981' : '#EF4444',
              boxShadow: isValid
                ? '0 0 6px rgba(16, 185, 129, 0.6)'
                : '0 0 6px rgba(239, 68, 68, 0.7)',
            }}
          />
          <span>
            {isValid
              ? 'VALID (0 ERRORS)'
              : `INVALID (${scene.validation.error_count} ERRORS)`}
          </span>
        </span>

        <span
          data-testid="connection-status-badge"
          title={
            connectionMode === 'sidecar-live'
              ? `Live MCP Sidecar connected (${projectPath ?? 'rack.yaml'})`
              : 'Static Standalone Demo Mode (GitHub Pages)'
          }
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 7px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 500,
            background: '#16161B',
            color: connectionMode === 'sidecar-live' ? '#93C5FD' : '#A1A1AA',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            maxWidth: '155px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '999px',
              flexShrink: 0,
              background:
                connectionMode === 'sidecar-live' ? '#3B82F6' : '#71717A',
              boxShadow:
                connectionMode === 'sidecar-live'
                  ? '0 0 6px rgba(59, 130, 246, 0.7)'
                  : 'none',
            }}
          />
          <span
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {connectionMode === 'sidecar-live'
              ? `MCP Live · ${shortFileName}`
              : 'Standalone Demo'}
          </span>
        </span>

        {connectionMode === 'standalone-demo' && onSimulateAgentStep && (
          <button
            type="button"
            data-testid="btn-simulate-mcp-agent"
            onClick={() =>
              onSimulateAgentStep(isValid ? 'collision' : 'resolved')
            }
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              border: isValid
                ? '1px solid rgba(245, 158, 11, 0.35)'
                : '1px solid rgba(16, 185, 129, 0.4)',
              background: isValid
                ? 'rgba(245, 158, 11, 0.1)'
                : 'rgba(16, 185, 129, 0.12)',
              color: isValid ? '#FDE68A' : '#A7F3D0',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <SparklesAiIcon size={12} />
            <span>
              {isValid
                ? 'Simulate LLM Collision'
                : 'Apply LLM Self-Correction'}
            </span>
          </button>
        )}

        {connectionMode === 'sidecar-live' && onInitNewRack && (
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              data-testid="btn-init-new-rack"
              onClick={() => setNewRackOpen(!newRackOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '6px',
                border: newRackOpen
                  ? '1px solid rgba(59, 130, 246, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                background: newRackOpen
                  ? 'rgba(59, 130, 246, 0.14)'
                  : '#16161B',
                color: newRackOpen ? '#93C5FD' : '#E4E4E7',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <PlusIcon size={11} />
              <span>New Empty Rack</span>
            </button>

            {newRackOpen && (
              <div
                data-testid="new-rack-popover"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '280px',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#141418',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  boxShadow: '0 16px 36px rgba(0, 0, 0, 0.65)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  whiteSpace: 'normal',
                }}
              >
                <div
                  style={{
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#F4F4F5',
                  }}
                >
                  Initialize Clean Rack (`init_rack`)
                </div>
                <input
                  type="text"
                  value={newRackName}
                  onChange={(e) => setNewRackName(e.target.value)}
                  placeholder="Project Name"
                  style={{
                    padding: '5px 8px',
                    borderRadius: '5px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#0E0E11',
                    color: '#F4F4F5',
                    fontSize: '11px',
                  }}
                />
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                    gap: '6px',
                  }}
                >
                  <select
                    value={newRackStandard}
                    onChange={(e) => {
                      const std = e.target.value as
                        | '10inch'
                        | '19inch'
                        | '6inch';
                      setNewRackStandard(std);
                      setNewRackDepth(
                        std === '19inch' ? 400 : std === '10inch' ? 240 : 180,
                      );
                      setNewRackU(std === '19inch' ? 12 : 8);
                    }}
                    style={{
                      padding: '5px 6px',
                      borderRadius: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#0E0E11',
                      color: '#F4F4F5',
                      fontSize: '11px',
                    }}
                  >
                    <option value="19inch">19-Inch</option>
                    <option value="10inch">10-Inch</option>
                    <option value="6inch">6-Inch</option>
                  </select>
                  <input
                    type="number"
                    min={2}
                    max={48}
                    value={newRackU}
                    onChange={(e) =>
                      setNewRackU(Math.max(2, Number(e.target.value) || 8))
                    }
                    title="Height (U)"
                    style={{
                      padding: '5px 6px',
                      borderRadius: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#0E0E11',
                      color: '#F4F4F5',
                      fontSize: '11px',
                    }}
                  />
                  <input
                    type="number"
                    min={120}
                    max={1000}
                    step={10}
                    value={newRackDepth}
                    onChange={(e) =>
                      setNewRackDepth(
                        Math.max(120, Number(e.target.value) || 300),
                      )
                    }
                    title="Rail Depth (mm)"
                    style={{
                      padding: '5px 6px',
                      borderRadius: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#0E0E11',
                      color: '#F4F4F5',
                      fontSize: '11px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '6px',
                    marginTop: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setNewRackOpen(false)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '5px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: 'transparent',
                      color: '#A1A1AA',
                      fontSize: '10.5px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    data-testid="btn-confirm-init-new-rack"
                    onClick={() => {
                      onInitNewRack({
                        project_name: newRackName.trim() || 'New Rack Project',
                        standard: newRackStandard,
                        u_height: newRackU,
                        rail_depth_mm: newRackDepth,
                        enclosure_type:
                          newRackStandard === '19inch'
                            ? 'closed-vented-front'
                            : 'closed-glass-front',
                      });
                      setNewRackOpen(false);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '5px',
                      border: '1px solid rgba(59, 130, 246, 0.5)',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Initialize Empty Rack
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {connectionMode === 'sidecar-live' && onExportDeliverablesToDisk && (
          <button
            type="button"
            data-testid="btn-export-disk"
            title="Write SVG, BOM, GLB & STL deliverables to project folder"
            onClick={() => {
              onExportDeliverablesToDisk();
              setExportSavedFlash(true);
              setTimeout(() => setExportSavedFlash(false), 1800);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 9px',
              borderRadius: '6px',
              border: exportSavedFlash
                ? '1px solid rgba(16, 185, 129, 0.45)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              background: exportSavedFlash
                ? 'rgba(16, 185, 129, 0.14)'
                : '#16161B',
              color: exportSavedFlash ? '#A7F3D0' : '#D4D4D8',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <DownloadIcon size={12} />
            <span>{exportSavedFlash ? 'Exported!' : 'Export to Disk'}</span>
          </button>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            paddingLeft: '4px',
            borderLeft: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <button
            type="button"
            data-testid="btn-undo"
            title={`Undo (${undoAvailable})`}
            disabled={undoAvailable === 0}
            onClick={onUndo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#16161B',
              color: undoAvailable > 0 ? '#E4E4E7' : '#52525B',
              fontSize: '11px',
              cursor: undoAvailable > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            <UndoIcon size={12} />
            <span className="mono">{undoAvailable}</span>
          </button>

          <button
            type="button"
            data-testid="btn-redo"
            title={`Redo (${redoAvailable})`}
            disabled={redoAvailable === 0}
            onClick={onRedo}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#16161B',
              color: redoAvailable > 0 ? '#E4E4E7' : '#52525B',
              fontSize: '11px',
              cursor: redoAvailable > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            <RedoIcon size={12} />
            <span className="mono">{redoAvailable}</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            data-testid="input-import-project-file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              void file.text().then((txt) => {
                onImportProjectJson(txt);
              });
            }}
          />
          <button
            type="button"
            data-testid="btn-import-project"
            title="Import rack.json"
            onClick={() => fileInputRef.current?.click()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#16161B',
              color: '#D4D4D8',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            <UploadJsonIcon size={12} />
            <span>Import</span>
          </button>

          {onShareRackUrl && (
            <button
              type="button"
              data-testid="btn-share-rack-link"
              title="Copy Shareable Rack URL (#rack=v1...)"
              onClick={() => {
                const url = onShareRackUrl();
                if (
                  typeof navigator !== 'undefined' &&
                  navigator.clipboard &&
                  typeof navigator.clipboard.writeText === 'function'
                ) {
                  void navigator.clipboard.writeText(url).catch(() => {});
                }
                setShareCopiedFlash(true);
                setTimeout(() => setShareCopiedFlash(false), 1800);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '6px',
                border: shareCopiedFlash
                  ? '1px solid rgba(16, 185, 129, 0.35)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
                background: shareCopiedFlash
                  ? 'rgba(16, 185, 129, 0.12)'
                  : '#16161B',
                color: shareCopiedFlash ? '#6EE7B7' : '#D4D4D8',
                fontSize: '11px',
                fontWeight: shareCopiedFlash ? 600 : 500,
                cursor: 'pointer',
              }}
            >
              <ShareLinkIcon size={12} />
              <span>{shareCopiedFlash ? 'Copied!' : 'Share'}</span>
            </button>
          )}

          {connectionMode === 'standalone-demo' && (
            <button
              type="button"
              data-testid="btn-reset-demo"
              title="Reset Demo Scene"
              onClick={onResetDemo}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                background: 'transparent',
                color: '#A1A1AA',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              <RotateResetIcon size={12} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
