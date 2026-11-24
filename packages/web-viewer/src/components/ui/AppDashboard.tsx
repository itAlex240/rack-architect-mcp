import { lazy, Suspense, useEffect, useState, type DragEvent } from 'react';
import { exportRackShareCardPng } from '../../state/share-card-renderer.js';
import { renderClientSideElevationSvg } from '../../state/standalone-homelab.js';
import { trackUiEvent } from '../../state/ui-telemetry.js';
import { useRackState, type ProjectImportResult } from '../../state/useRackState.js';
import { RackSceneCanvas } from '../canvas/RackSceneCanvas.js';
import { TopNavBar } from './TopNavBar.js';
import { FloatingHudToolbar } from './FloatingHudToolbar.js';
import { InspectorSidebar } from './InspectorSidebar.js';

const LazySvgPanZoomViewer = lazy(async () => ({
  default: (await import('./SvgPanZoomViewer.js')).SvgPanZoomViewer,
}));
const LazyBomAndExportsView = lazy(async () => ({
  default: (await import('./BomAndExportsView.js')).BomAndExportsView,
}));
const LazyCatalogBuilderDrawer = lazy(async () => ({
  default: (await import('./CatalogBuilderDrawer.js')).CatalogBuilderDrawer,
}));

function StudioViewFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#09090b',
        color: '#71717A',
        fontSize: '12px',
      }}
    >
      Loading CAD view…
    </div>
  );
}

export interface AppDashboardProps {
  readonly onOptimizeRack?: (() => void) | undefined;
}

/**
 * Precision Hardware & CAD Studio Dashboard for `@rack-mcp/web-viewer`.
 */
export function AppDashboard({ onOptimizeRack }: AppDashboardProps = {}) {
  const state = useRackState();
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [importToast, setImportToast] = useState<{
    readonly ok: boolean;
    readonly text: string;
  } | null>(null);

  useEffect(() => {
    if (!importToast || typeof window === 'undefined') {
      return;
    }
    const timer = window.setTimeout(() => {
      setImportToast(null);
    }, 6500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [importToast]);

  const handleImportFileContent = (
    rawText: string,
    filename?: string,
  ): ProjectImportResult => {
    const res = state.importProjectFile(rawText, filename);
    if (res.ok) {
      trackUiEvent('file_import');
    }
    setImportToast({ ok: res.ok, text: res.summary });
    return res;
  };

  const handleExportShareCard = () => {
    trackUiEvent('share_card_export');
    const elevSvg =
      state.elevationSvg || renderClientSideElevationSvg(state.scene);
    void exportRackShareCardPng(state.scene, elevSvg);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      if (!dragActive) setDragActive(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    void file.text().then((txt) => {
      handleImportFileContent(txt, file.name);
    });
  };

  return (
    <div
      data-testid="app-dashboard"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#09090b',
        color: '#F4F4F5',
        overflow: 'hidden',
      }}
    >
      {/* Top Navigation & 4-View Workspace Switcher */}
      <TopNavBar
        scene={state.scene}
        connectionMode={state.connectionMode}
        projectPath={state.projectPath}
        activePresetId={state.activePresetId}
        activeTab={state.activeTab}
        catalogDrawerOpen={state.catalogDrawerOpen}
        undoAvailable={state.undoAvailable}
        redoAvailable={state.redoAvailable}
        onSelectTab={state.setActiveTab}
        onToggleCatalogDrawer={() =>
          state.setCatalogDrawerOpen(!state.catalogDrawerOpen)
        }
        onSelectPreset={state.selectPreset}
        onShareRackUrl={state.buildShareableRackUrl}
        onExportShareCard={handleExportShareCard}
        onImportProjectJson={state.importProjectJson}
        onImportProjectFile={handleImportFileContent}
        onInitNewRack={state.initNewRack}
        onExportDeliverablesToDisk={state.exportDeliverablesToDisk}
        onUndo={state.undo}
        onRedo={state.redo}
        onOptimizeRack={onOptimizeRack ?? state.optimizeRack}
        onResetDemo={state.resetDemoScene}
        onSimulateAgentStep={state.simulateAgentStep}
      />

      {/* Main Split Workspace + Left Builder Drawer + Right Inspector Sidebar */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          minHeight: 0,
          overflow: 'hidden',
        }}
      >
        {state.catalogDrawerOpen && (
          <Suspense fallback={null}>
            <LazyCatalogBuilderDrawer
              open={state.catalogDrawerOpen}
              catalog={state.catalog}
              scene={state.scene}
              onClose={() => state.setCatalogDrawerOpen(false)}
              onMountEquipment={state.mountEquipmentFromCatalog}
              onConnectCable={state.connectInteractiveCable}
              onRegisterCustomBlueprint={state.registerCustomBlueprint}
            />
          </Suspense>
        )}

        {/* Center Active View */}
        <main
          style={{
            flex: 1,
            position: 'relative',
            minWidth: 0,
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {state.activeTab === '3d' && (
            <>
              <FloatingHudToolbar
                xrayMode={state.xrayMode}
                explodeZMm={state.explodeZMm}
                cableFilter={state.cableFilter}
                cameraPreset={state.cameraPreset}
                showClearanceBoxes={state.showClearanceBoxes}
                doorOpen={state.doorOpen}
                onToggleXray={state.setXrayMode}
                onChangeExplodeZ={state.setExplodeZMm}
                onSelectCableFilter={state.setCableFilter}
                onSelectCameraPreset={state.setCameraPreset}
                onToggleClearanceBoxes={state.setShowClearanceBoxes}
                onToggleDoorOpen={state.setDoorOpen}
              />
              <RackSceneCanvas
                scene={state.scene}
                xrayMode={state.xrayMode}
                explodeZMm={state.explodeZMm}
                cableFilter={state.cableFilter}
                cameraPreset={state.cameraPreset}
                showClearanceBoxes={state.showClearanceBoxes}
                doorOpen={state.doorOpen}
                selectedDeviceId={state.selectedDeviceId}
                selectedCableId={state.selectedCableId}
                hoveredPort={state.hoveredPort}
                pendingPort={state.pendingPort}
                onSelectDevice={state.selectDevice}
                onSelectCable={state.selectCable}
                onHoverPort={state.setHoveredPort}
                onClickPort={state.handlePortClick3D}
                onCancelPendingPort={() => state.setPendingPort(null)}
                onMoveDeviceU={state.moveDeviceU}
              />
            </>
          )}

          {state.activeTab === 'elevation' && (
            <Suspense fallback={<StudioViewFallback />}>
              <LazySvgPanZoomViewer
                title="Synchronized 2D Front/Rear Elevation & Z-Y Depth Cutaway"
                filename="elevation.svg"
                svgMarkup={state.elevationSvg}
              />
            </Suspense>
          )}

          {state.activeTab === 'wiring' && (
            <Suspense fallback={<StudioViewFallback />}>
              <LazySvgPanZoomViewer
                title="Hierarchical Power/PoE DAG & Multi-Track Wiring Schematic"
                filename="wiring-schematic.svg"
                svgMarkup={state.wiringSvg}
              />
            </Suspense>
          )}

          {state.activeTab === 'bom' && (
            <Suspense fallback={<StudioViewFallback />}>
              <LazyBomAndExportsView
                scene={state.scene}
                elevationSvg={state.elevationSvg}
                wiringSvg={state.wiringSvg}
                bomMarkdown={state.bomMarkdown}
                labelsCsv={state.labelsCsv}
                labelsSvg={state.labelsSvg}
                projectYaml={state.exportProjectYaml()}
                electricityPricePerKwhEur={state.electricityPricePerKwhEur}
                onChangeElectricityPricePerKwhEur={state.setElectricityPricePerKwhEur}
                onExportShareCard={handleExportShareCard}
              />
            </Suspense>
          )}
        </main>

        {/* Right Telemetry, Validation & Selection Inspector Sidebar */}
        <InspectorSidebar
          scene={state.scene}
          connectionMode={state.connectionMode}
          projectPath={state.projectPath}
          mcpToolLog={state.mcpToolLog}
          selectedDeviceId={state.selectedDeviceId}
          selectedCableId={state.selectedCableId}
          onSelectDevice={state.selectDevice}
          onSelectCable={state.selectCable}
          onMoveDeviceU={state.moveDeviceU}
          onRemoveDevice={state.removeEquipment}
          onDisconnectCable={state.disconnectCable}
          electricityPricePerKwhEur={state.electricityPricePerKwhEur}
          onClearToolLog={state.clearMcpToolLog}
          onSimulateAgentStep={state.simulateAgentStep}
        />
      </div>

      {/* Drag-and-Drop File Import Overlay (A3 + B7) */}
      {dragActive && (
        <div
          data-testid="yaml-drop-overlay"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 60,
            background: 'rgba(9, 9, 11, 0.82)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              padding: '28px 36px',
              borderRadius: '12px',
              background: '#121216',
              border: '1px dashed rgba(59, 130, 246, 0.55)',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)',
            }}
          >
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#F4F4F5' }}>
              Drop Rack or Infrastructure Export File
            </div>
            <div style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '6px' }}>
              Supports <code className="mono">rack.yaml</code>, <code className="mono">rack.json</code>, NetBox, UniFi &amp; Proxmox VE
            </div>
          </div>
        </div>
      )}

      {/* Non-blocking Import Feedback Toast */}
      {importToast && (
        <div
          data-testid="import-status-toast"
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 70,
            maxWidth: '420px',
            padding: '10px 14px',
            borderRadius: '8px',
            background: 'rgba(18, 18, 22, 0.94)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderLeft: `2.5px solid ${importToast.ok ? '#10B981' : '#EF4444'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 12px 32px rgba(0, 0, 0, 0.65)',
          }}
        >
          <span
            style={{
              fontSize: '12px',
              color: importToast.ok ? '#E4E4E7' : '#FCA5A5',
            }}
          >
            {importToast.text}
          </span>
          <button
            type="button"
            data-testid="btn-dismiss-import-toast"
            onClick={() => setImportToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A1A1AA',
              fontSize: '12px',
              cursor: 'pointer',
              padding: '2px 4px',
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
