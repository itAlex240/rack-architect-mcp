// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  AppDashboard,
  computeDeviceExplodeOffsetZMm,
  evaluateStandaloneScene,
  InspectorSidebar,
  renderClientSideElevationSvg,
  TopNavBar,
} from '../src/index.js';

afterEach(() => {
  cleanup();
});

describe('@rack-mcp/web-viewer — Interactive 3D/2D Inspector & CAD Studio', () => {
  it('evaluates the standalone 8U 10-Inch Homelab reference scene with 18 devices, 18 clamped cable routes, and all 18 Side-Profile Cutaway SVG cables', () => {
    const scene = evaluateStandaloneScene();
    expect(scene.validation.is_valid).toBe(true);
    expect(scene.validation.error_count).toBe(0);
    expect(scene.geometry.devices.length).toBe(18);
    expect(scene.cable_routes.length).toBe(18);

    // Verify client-side 2D Elevation SVG renders all 18 cables in the Side-Profile Depth Cutaway
    const clientElevationSvg = renderClientSideElevationSvg(scene);
    const sideCableMatches = [
      ...clientElevationSvg.matchAll(/data-cable-view="side"/g),
    ];
    expect(sideCableMatches.length).toBe(18);

    const pdu = scene.geometry.devices.find(
      (d) => d.instance_id === 'pdu-u2-rear',
    );
    const frontSw = scene.geometry.devices.find(
      (d) => d.instance_id === 'sw-u8',
    );
    const subNode = scene.geometry.devices.find(
      (d) => d.instance_id === 'pve-node-01',
    );

    expect(computeDeviceExplodeOffsetZMm(pdu, 100)).toBe(100);
    expect(computeDeviceExplodeOffsetZMm(frontSw, 100)).toBe(-65);
    expect(computeDeviceExplodeOffsetZMm(subNode, 100)).toBe(25);
  });

  it('renders AppDashboard, switches across all 4 workspace views, and toggles 3D HUD controls (X-Ray, Explode Z, Camera, Cable Filters)', () => {
    render(<AppDashboard />);

    expect(screen.getByTestId('app-dashboard')).toBeDefined();
    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'VALID (0 ERRORS)',
    );
    expect(screen.getByTestId('floating-3d-hud')).toBeDefined();

    // Toggle X-Ray Ghost View & Explode Z Slider
    const xrayBtn = screen.getByTestId('hud-toggle-xray');
    expect(xrayBtn.textContent).toContain('X-Ray Ghost: OFF');
    fireEvent.click(xrayBtn);
    expect(xrayBtn.textContent).toContain('X-Ray Ghost: ON');

    const explodeSlider = screen.getByTestId('hud-explode-z-slider');
    fireEvent.change(explodeSlider, { target: { value: '120' } });
    expect(
      screen.getByTestId('rack-3d-viewport').getAttribute('data-explode-z'),
    ).toBe('120');

    // Switch Camera Preset & Cable Filter
    fireEvent.click(screen.getByTestId('hud-camera-side-cutaway'));
    expect(
      screen.getByTestId('rack-3d-viewport').getAttribute('data-camera-preset'),
    ).toBe('side-cutaway');

    fireEvent.click(screen.getByTestId('hud-cable-filter-power'));
    expect(screen.getByTestId('rack-3d-scene-summary').textContent).toContain(
      '5 Visible Cable Tubes',
    );
    fireEvent.click(screen.getByTestId('hud-cable-filter-all'));

    // Switch to Tab [2] 2D CAD Elevation & Depth Cutaway
    fireEvent.click(screen.getByTestId('nav-tab-elevation'));
    expect(screen.getByTestId('svg-pan-zoom-viewer').textContent).toContain(
      'elevation.svg',
    );

    // Switch to Tab [3] 2D Wiring & Power Schematic
    fireEvent.click(screen.getByTestId('nav-tab-wiring'));
    expect(screen.getByTestId('svg-pan-zoom-viewer').textContent).toContain(
      'wiring-schematic.svg',
    );

    // Switch to Tab [4] BOM, 3D-Print Queue & Patch Checklist
    fireEvent.click(screen.getByTestId('nav-tab-bom'));
    expect(screen.getByTestId('bom-and-exports-view').textContent).toContain(
      '3D-Print Fabrication Queue',
    );

    // Switch back to Tab [1] 3D Live Rack Inspector
    fireEvent.click(screen.getByTestId('nav-tab-3d'));
    expect(screen.getByTestId('rack-3d-viewport')).toBeDefined();
  });

  it('supports live device U-position mutations, collision diagnostics, and Undo/Redo recovery', () => {
    render(<AppDashboard />);

    // Currently sw-u8 (on U8 Front) is selected; move it to U7 (which already has patch-u7 on U7 Front) -> triggers CHASSIS_COLLISION!
    fireEvent.click(screen.getByTestId('move-device-u-7'));

    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'INVALID',
    );
    expect(
      screen.getByTestId('diagnostic-issue-CHASSIS_COLLISION'),
    ).toBeDefined();

    // Click Undo to restore valid state
    const undoBtn = screen.getByTestId('btn-undo');
    fireEvent.click(undoBtn);

    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'VALID (0 ERRORS)',
    );
  });

  it('registers client-side WebMCP tools when document.modelContext is available', () => {
    const registerToolSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(document, 'modelContext', {
      value: { registerTool: registerToolSpy },
      configurable: true,
    });

    const { unmount } = render(<AppDashboard />);
    expect(registerToolSpy).toHaveBeenCalled();

    unmount();
    Reflect.deleteProperty(document, 'modelContext');
  });

  it('opens the Catalog & Cable Builder Drawer, mounts equipment interactively, displays Thermal/Acoustic KPIs, and exposes .SCAD/.STL 3D-print buttons', () => {
    render(<AppDashboard />);

    // Verify new Thermal & Acoustic KPIs in InspectorSidebar
    expect(screen.getByTestId('kpi-thermal-btu').textContent).toContain(
      'BTU/h',
    );
    expect(screen.getByTestId('kpi-acoustic-dba').textContent).toContain(
      'dB(A)',
    );
    expect(screen.getByTestId('kpi-airflow-profile').textContent).toContain(
      'hybrid-active-passive',
    );

    // Open Catalog & Cable Builder Drawer
    fireEvent.click(screen.getByTestId('btn-toggle-catalog-drawer'));
    expect(screen.getByTestId('catalog-builder-drawer')).toBeDefined();
    expect(screen.getByTestId('interactive-cable-patcher')).toBeDefined();

    // Mount a device from the catalog
    fireEvent.click(
      screen.getByTestId('mount-blueprint-generic-10inch-brush-panel-1u'),
    );
    expect(screen.getByTestId('btn-remove-device')).toBeDefined();

    // Switch to BOM & 3D-Print Queue and verify .SCAD and .STL buttons
    fireEvent.click(screen.getByTestId('nav-tab-bom'));
    expect(screen.getByTestId('download-scad-carrier-u3')).toBeDefined();
    expect(screen.getByTestId('download-stl-carrier-u3')).toBeDefined();
    expect(screen.getByTestId('download-scad-carrier-u4')).toBeDefined();
    expect(screen.getByTestId('download-stl-carrier-u4')).toBeDefined();
  });

  it('displays the MCP Agent Tool-Call Feed and replays LLM Plug-Clearance Collision & Self-Correction', () => {
    render(<AppDashboard />);

    const feed = screen.getByTestId('mcp-agent-feed');
    expect(feed.textContent).toContain('MCP AGENT TOOL-CALL FEED');
    expect(feed.textContent).toContain('validate_rack()');

    // Trigger Step 1: LLM Plug Collision on U1
    const simBtn = screen.getByTestId('btn-simulate-mcp-agent');
    expect(simBtn.textContent).toContain('Simulate LLM Collision');
    fireEvent.click(simBtn);

    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'INVALID',
    );
    expect(
      screen.getAllByTestId('diagnostic-issue-PLUG_CLEARANCE_COLLISION').length,
    ).toBeGreaterThanOrEqual(1);

    // Trigger Step 2: Apply LLM Self-Correction (moves PDU to U2 Rear)
    expect(simBtn.textContent).toContain('Apply LLM Self-Correction');
    fireEvent.click(simBtn);

    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'VALID (0 ERRORS)',
    );
  });

  it('hides standalone demo simulation buttons and renders live MCP workbench controls in sidecar-live mode', () => {
    const scene = evaluateStandaloneScene();
    const initNewRackSpy = vi.fn();
    const exportToDiskSpy = vi.fn();
    const clearToolLogSpy = vi.fn();

    render(
      <div>
        <TopNavBar
          scene={scene}
          connectionMode="sidecar-live"
          projectPath="/workspace/examples/19inch-enterprise/rack.yaml"
          activeTab="3d"
          onSelectTab={vi.fn()}
          undoAvailable={2}
          redoAvailable={0}
          onUndo={vi.fn()}
          onRedo={vi.fn()}
          onResetDemo={vi.fn()}
          catalogDrawerOpen={false}
          onToggleCatalogDrawer={vi.fn()}
          onImportProjectJson={vi.fn()}
          onSimulateAgentStep={vi.fn()}
          onInitNewRack={initNewRackSpy}
          onExportDeliverablesToDisk={exportToDiskSpy}
        />
        <InspectorSidebar
          scene={scene}
          connectionMode="sidecar-live"
          projectPath="/workspace/examples/19inch-enterprise/rack.yaml"
          selectedDeviceId="patch-u7"
          selectedCableId={null}
          mcpToolLog={[]}
          onSelectDevice={vi.fn()}
          onSelectCable={vi.fn()}
          onMoveDeviceU={vi.fn()}
          onRemoveDevice={vi.fn()}
          onDisconnectCable={vi.fn()}
          onSimulateAgentStep={vi.fn()}
          onClearToolLog={clearToolLogSpy}
        />
      </div>,
    );

    const sidebarEl = screen.getByTestId('inspector-sidebar');
    expect(sidebarEl.style.overflowX).toBe('hidden');
    expect(sidebarEl.style.maxWidth).toBe('368px');

    // Fake demo simulation controls must NOT exist in sidecar-live mode
    expect(screen.queryByTestId('btn-simulate-mcp-agent')).toBeNull();
    expect(screen.queryByTestId('btn-reset-demo')).toBeNull();
    expect(screen.queryByTestId('agent-sim-step-collision')).toBeNull();
    expect(screen.queryByTestId('agent-sim-step-resolved')).toBeNull();

    // Live MCP workbench controls MUST exist
    expect(screen.getByTestId('connection-status-badge').textContent).toContain(
      'MCP Live · 19inch-enterprise/rack.yaml',
    );
    expect(screen.getByTestId('btn-init-new-rack')).toBeDefined();
    expect(screen.getByTestId('btn-export-disk')).toBeDefined();
    expect(screen.getByTestId('mcp-agent-empty-feed').textContent).toContain(
      'Ready for External MCP Agent',
    );

    fireEvent.click(screen.getByTestId('btn-export-disk'));
    expect(exportToDiskSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByTestId('btn-init-new-rack'));
    expect(screen.getByTestId('new-rack-popover')).toBeDefined();
    fireEvent.click(screen.getByTestId('btn-confirm-init-new-rack'));
    expect(initNewRackSpy).toHaveBeenCalledTimes(1);
  });
});
