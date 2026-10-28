import { useRackState } from '../../state/useRackState.js';
import { RackSceneCanvas } from '../canvas/RackSceneCanvas.js';
import { TopNavBar } from './TopNavBar.js';
import { FloatingHudToolbar } from './FloatingHudToolbar.js';
import { SvgPanZoomViewer } from './SvgPanZoomViewer.js';
import { BomAndExportsView } from './BomAndExportsView.js';
import { InspectorSidebar } from './InspectorSidebar.js';
import { CatalogBuilderDrawer } from './CatalogBuilderDrawer.js';

/**
 * Precision Hardware & CAD Studio Dashboard for `@rack-mcp/web-viewer`.
 */
export function AppDashboard() {
  const state = useRackState();

  return (
    <div
      data-testid="app-dashboard"
      style={{
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
        activeTab={state.activeTab}
        catalogDrawerOpen={state.catalogDrawerOpen}
        undoAvailable={state.undoAvailable}
        redoAvailable={state.redoAvailable}
        onSelectTab={state.setActiveTab}
        onToggleCatalogDrawer={() =>
          state.setCatalogDrawerOpen(!state.catalogDrawerOpen)
        }
        onImportProjectJson={state.importProjectJson}
        onInitNewRack={state.initNewRack}
        onExportDeliverablesToDisk={state.exportDeliverablesToDisk}
        onUndo={state.undo}
        onRedo={state.redo}
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
        <CatalogBuilderDrawer
          open={state.catalogDrawerOpen}
          catalog={state.catalog}
          scene={state.scene}
          onClose={() => state.setCatalogDrawerOpen(false)}
          onMountEquipment={state.mountEquipmentFromCatalog}
          onConnectCable={state.connectInteractiveCable}
        />

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
                onSelectDevice={state.selectDevice}
                onSelectCable={state.selectCable}
                onHoverPort={state.setHoveredPort}
              />
            </>
          )}

          {state.activeTab === 'elevation' && (
            <SvgPanZoomViewer
              title="Synchronized 2D Front/Rear Elevation & Z-Y Depth Cutaway"
              filename="elevation.svg"
              svgMarkup={state.elevationSvg}
            />
          )}

          {state.activeTab === 'wiring' && (
            <SvgPanZoomViewer
              title="Hierarchical Power/PoE DAG & Multi-Track Wiring Schematic"
              filename="wiring-schematic.svg"
              svgMarkup={state.wiringSvg}
            />
          )}

          {state.activeTab === 'bom' && (
            <BomAndExportsView
              scene={state.scene}
              elevationSvg={state.elevationSvg}
              wiringSvg={state.wiringSvg}
              bomMarkdown={state.bomMarkdown}
            />
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
          onClearToolLog={state.clearMcpToolLog}
          onSimulateAgentStep={state.simulateAgentStep}
        />
      </div>
    </div>
  );
}
