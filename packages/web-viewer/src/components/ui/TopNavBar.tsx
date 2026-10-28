import { useRef, type ReactNode } from 'react';
import type { SerializedRackScene } from '@rack-mcp/core-domain';
import type { WorkspaceTab } from '../../state/useRackState.js';
import {
  BlueprintLayersIcon,
  Cube3DIcon,
  PackageBomIcon,
  PlusIcon,
  RedoIcon,
  RotateResetIcon,
  SparklesAiIcon,
  UndoIcon,
  UploadJsonIcon,
  WiringNodesIcon,
} from './Icons.js';

export interface TopNavBarProps {
  readonly scene: SerializedRackScene;
  readonly connectionMode: 'sidecar-live' | 'standalone-demo';
  readonly activeTab: WorkspaceTab;
  readonly catalogDrawerOpen: boolean;
  readonly undoAvailable: number;
  readonly redoAvailable: number;
  readonly onSelectTab: (tab: WorkspaceTab) => void;
  readonly onToggleCatalogDrawer: () => void;
  readonly onImportProjectJson: (rawJson: string) => boolean;
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
  activeTab,
  catalogDrawerOpen,
  undoAvailable,
  redoAvailable,
  onSelectTab,
  onToggleCatalogDrawer,
  onImportProjectJson,
  onUndo,
  onRedo,
  onResetDemo,
  onSimulateAgentStep,
}: TopNavBarProps) {
  const isValid = scene.validation.is_valid;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <header
      data-testid="top-nav-bar"
      style={{
        height: '52px',
        padding: '0 16px',
        background: '#0E0E11',
        borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
    >
      {/* Left: Studio Brand, Project Title & Hardware Drawer Trigger */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            padding: '4px 8px',
            borderRadius: '6px',
            background: '#18181D',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            color: '#F4F4F5',
            fontWeight: 700,
            fontSize: '11.5px',
            letterSpacing: '-0.01em',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '2px',
              background: '#3B82F6',
              display: 'inline-block',
            }}
          />
          <span>RackArchitect</span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#F4F4F5',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '220px',
            }}
          >
            {scene.project.project_name}
          </span>
          <span
            className="mono"
            style={{
              padding: '2px 7px',
              borderRadius: '4px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '10.5px',
              color: '#A1A1AA',
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
            padding: '5px 10px',
            borderRadius: '6px',
            border: catalogDrawerOpen
              ? '1px solid rgba(59, 130, 246, 0.5)'
              : '1px solid rgba(255, 255, 255, 0.1)',
            background: catalogDrawerOpen ? 'rgba(59, 130, 246, 0.14)' : '#18181D',
            color: catalogDrawerOpen ? '#93C5FD' : '#E4E4E7',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
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
                gap: '6px',
                padding: '5px 11px',
                borderRadius: '6px',
                border: active
                  ? '1px solid rgba(255, 255, 255, 0.12)'
                  : '1px solid transparent',
                background: active ? '#23232B' : 'transparent',
                color: active ? '#F4F4F5' : '#A1A1AA',
                fontSize: '11.5px',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span
          data-testid="validation-status-pill"
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 9px',
            borderRadius: '6px',
            fontSize: '10.5px',
            fontWeight: 600,
            background: isValid
              ? 'rgba(16, 185, 129, 0.08)'
              : 'rgba(239, 68, 68, 0.12)',
            color: isValid ? '#D1FAE5' : '#FECACA',
            border: isValid
              ? '1px solid rgba(16, 185, 129, 0.25)'
              : '1px solid rgba(239, 68, 68, 0.35)',
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
          className="mono"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '10.5px',
            fontWeight: 500,
            background: '#16161B',
            color: connectionMode === 'sidecar-live' ? '#93C5FD' : '#A1A1AA',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <span
            style={{
              width: '5px',
              height: '5px',
              borderRadius: '999px',
              background:
                connectionMode === 'sidecar-live' ? '#3B82F6' : '#71717A',
            }}
          />
          <span>
            {connectionMode === 'sidecar-live' ? 'MCP Live' : 'Standalone'}
          </span>
        </span>

        {onSimulateAgentStep && (
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

          <button
            type="button"
            data-testid="btn-reset-demo"
            title="Reset Scene"
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
        </div>
      </div>
    </header>
  );
}
