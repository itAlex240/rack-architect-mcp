import { useRef } from 'react';
import type { SerializedRackScene } from '@rack-mcp/core-domain';
import type { WorkspaceTab } from '../../state/useRackState.js';

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
}

const WORKSPACE_TABS: ReadonlyArray<{
  readonly id: WorkspaceTab;
  readonly label: string;
}> = [
  { id: '3d', label: '[1] 3D Live Rack Inspector' },
  { id: 'elevation', label: '[2] 2D CAD Elevation & Depth Cutaway' },
  { id: 'wiring', label: '[3] 2D Wiring & Power Schematic' },
  { id: 'bom', label: '[4] BOM, 3D-Print Queue & Patch Checklist' },
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
}: TopNavBarProps) {
  const isValid = scene.validation.is_valid;
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <header
      data-testid="top-nav-bar"
      style={{
        height: '56px',
        padding: '0 18px',
        background: '#0F172A',
        borderBottom: '1px solid #1E293B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexShrink: 0,
      }}
    >
      {/* Left: Brand & Project Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            padding: '4px 9px',
            borderRadius: '6px',
            background: '#0284C7',
            color: '#F8FAFC',
            fontWeight: 800,
            fontSize: '12px',
            letterSpacing: '0.04em',
          }}
        >
          RACKARCHITECT MCP
        </div>
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8FAFC' }}>
            {scene.project.project_name}
          </div>
          <div
            className="mono"
            style={{ fontSize: '10.5px', color: '#94A3B8' }}
          >
            {scene.project.rack.standard.toUpperCase()} •{' '}
            {scene.project.rack.u_height}U • Rail Depth{' '}
            {scene.project.rack.rail_depth_mm}mm
          </div>
        </div>

        <button
          type="button"
          data-testid="btn-toggle-catalog-drawer"
          onClick={onToggleCatalogDrawer}
          style={{
            marginLeft: '6px',
            padding: '6px 11px',
            borderRadius: '6px',
            border: catalogDrawerOpen
              ? '1px solid #10B981'
              : '1px solid #38BDF8',
            background: catalogDrawerOpen ? '#064E3B' : '#082F49',
            color: catalogDrawerOpen ? '#34D399' : '#38BDF8',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          {catalogDrawerOpen ? '✓ Builder Open' : '+ Catalog & Cable Builder'}
        </button>
      </div>

      {/* Center: 4-View Workspace Switcher */}
      <nav
        aria-label="Workspace Views"
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
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
                padding: '7px 12px',
                borderRadius: '6px',
                border: active ? '1px solid #38BDF8' : '1px solid #334155',
                background: active ? '#082F49' : '#1E293B',
                color: active ? '#38BDF8' : '#CBD5E1',
                fontSize: '12px',
                fontWeight: active ? 700 : 500,
                cursor: 'pointer',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Right: Validation Status, Connection Mode & Undo/Redo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span
          data-testid="validation-status-pill"
          className="mono"
          style={{
            padding: '4px 9px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            background: isValid ? '#064E3B' : '#450A0A',
            color: isValid ? '#34D399' : '#FCA5A5',
            border: isValid ? '1px solid #10B981' : '1px solid #EF4444',
          }}
        >
          {isValid
            ? 'VALID (0 ERRORS)'
            : `INVALID (${scene.validation.error_count} ERRORS)`}
        </span>

        <span
          data-testid="connection-status-badge"
          className="mono"
          style={{
            padding: '4px 9px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
            background:
              connectionMode === 'sidecar-live' ? '#0C4A6E' : '#1E293B',
            color: connectionMode === 'sidecar-live' ? '#38BDF8' : '#94A3B8',
            border: '1px solid #334155',
          }}
        >
          {connectionMode === 'sidecar-live'
            ? '● MCP Sidecar Connected'
            : '○ Demo Mode (Standalone)'}
        </span>

        <button
          type="button"
          data-testid="btn-undo"
          disabled={undoAvailable === 0}
          onClick={onUndo}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#1E293B',
            color: undoAvailable > 0 ? '#F8FAFC' : '#475569',
            fontSize: '11.5px',
            cursor: undoAvailable > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Undo ({undoAvailable})
        </button>

        <button
          type="button"
          data-testid="btn-redo"
          disabled={redoAvailable === 0}
          onClick={onRedo}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#1E293B',
            color: redoAvailable > 0 ? '#F8FAFC' : '#475569',
            fontSize: '11.5px',
            cursor: redoAvailable > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Redo ({redoAvailable})
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
          onClick={() => fileInputRef.current?.click()}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#1E293B',
            color: '#CBD5E1',
            fontSize: '11.5px',
            cursor: 'pointer',
          }}
        >
          Import JSON
        </button>

        <button
          type="button"
          data-testid="btn-reset-demo"
          onClick={onResetDemo}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: '1px solid #334155',
            background: '#0F172A',
            color: '#94A3B8',
            fontSize: '11.5px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </header>
  );
}
