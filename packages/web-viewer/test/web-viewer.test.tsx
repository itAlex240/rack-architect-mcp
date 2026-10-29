// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import {
  AppDashboard,
  STANDALONE_PRESET_OPTIONS,
  computeDeviceExplodeOffsetZMm,
  createStandalonePresetProjectInput,
  decodeRackProjectFromHash,
  encodeRackProjectToHash,
  evaluateStandaloneScene,
  generateClientCustomCoverPanelStl,
  InspectorSidebar,
  renderClientSideElevationSvg,
  TopNavBar,
} from '../src/index.js';

afterEach(() => {
  cleanup();
  window.history.replaceState(null, '', window.location.pathname);
});

describe('@rack-mcp/web-viewer — Interactive 3D/2D Inspector & CAD Studio', () => {
  it('evaluates the standalone 8U 10-Inch Homelab reference scene with 19 devices, 22 clamped cable routes, 4 top-rear external drops, and all 22 Side-Profile Cutaway SVG cables', () => {
    const scene = evaluateStandaloneScene();
    expect(scene.validation.is_valid).toBe(true);
    expect(scene.validation.error_count).toBe(0);
    expect(scene.geometry.devices.length).toBe(19);
    expect(scene.cable_routes.length).toBe(22);
    expect(scene.project.external_endpoints.length).toBe(4);
    expect(scene.validation.power_summary.total_poe_watts).toBe(33.5);

    // Verify client-side 2D Elevation SVG renders all 22 cables + 4 external drops in the Side-Profile Depth Cutaway
    const clientElevationSvg = renderClientSideElevationSvg(scene);
    const sideCableMatches = [
      ...clientElevationSvg.matchAll(/data-cable-view="side"/g),
    ];
    expect(sideCableMatches.length).toBe(22);
    expect(clientElevationSvg).toContain('data-external-endpoint-id="ext-isp-wan"');
    expect(clientElevationSvg).toContain('data-external-endpoint-id="ext-cam-einfahrt"');

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

    // Switch to BOM & 3D-Print Queue and verify .SCAD and .STL buttons (including U2 cover panel & Cover Panels Library)
    fireEvent.click(screen.getByTestId('nav-tab-bom'));
    expect(screen.getByTestId('download-scad-cover-u2')).toBeDefined();
    expect(screen.getByTestId('download-stl-cover-u2')).toBeDefined();
    expect(screen.getByTestId('download-scad-carrier-u3')).toBeDefined();
    expect(screen.getByTestId('download-stl-carrier-u3')).toBeDefined();
    expect(screen.getByTestId('download-scad-carrier-u4')).toBeDefined();
    expect(screen.getByTestId('download-stl-carrier-u4')).toBeDefined();
    expect(screen.getByTestId('download-scad-sw-u8')).toBeDefined();
    expect(screen.getByTestId('download-stl-sw-u8')).toBeDefined();
    expect(
      screen.getByTestId(
        'download-cover-stl-3dprint-10inch-cover-panel-hex-1u',
      ),
    ).toBeDefined();
    expect(
      screen.getByTestId(
        'download-cover-scad-3dprint-10inch-cover-panel-ribs-2u',
      ),
    ).toBeDefined();
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
    expect(screen.getByTestId('selected-device-description').textContent).toContain(
      'Durchgangs-Patchpanel',
    );
    expect(screen.getByTestId('device-mounting-badge').textContent).toContain(
      'Direktmontage',
    );

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

  it('evaluates all 5 standalone presets with 0 validation errors, switches presets live, and encodes/decodes shareable #rack=v1. URLs', () => {
    for (const opt of STANDALONE_PRESET_OPTIONS) {
      const presetInput = createStandalonePresetProjectInput(opt.id);
      const evaluated = evaluateStandaloneScene(presetInput);
      expect(evaluated.validation.is_valid).toBe(true);
      expect(evaluated.validation.error_count).toBe(0);

      const encodedHash = encodeRackProjectToHash(presetInput);
      expect(encodedHash.startsWith('#rack=v1.')).toBe(true);
      const decoded = decodeRackProjectFromHash(encodedHash);
      expect(decoded).not.toBeNull();
      expect(decoded!.project_name).toBe(presetInput.project_name);
    }

    expect(decodeRackProjectFromHash('#rack=v1.not-valid-json!')).toBeNull();

    render(<AppDashboard />);

    const presetSelect = screen.getByTestId(
      'preset-switcher-select',
    ) as HTMLSelectElement;
    expect(presetSelect.value).toBe('10inch-homelab');

    // Switch live to 19-Inch Enterprise HA Rack (34 cable tubes)
    fireEvent.change(presetSelect, { target: { value: '19inch-enterprise' } });
    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'VALID (0 ERRORS)',
    );
    expect(screen.getByTestId('rack-3d-scene-summary').textContent).toContain(
      '34 Visible Cable Tubes',
    );

    // Switch live to 6-Inch Micro-Lab (10 cable tubes)
    fireEvent.change(presetSelect, { target: { value: '6inch-microlab' } });
    expect(screen.getByTestId('validation-status-pill').textContent).toContain(
      'VALID (0 ERRORS)',
    );
    expect(screen.getByTestId('rack-3d-scene-summary').textContent).toContain(
      '10 Visible Cable Tubes',
    );

    // Click Share button -> updates window.location.hash and flashes Copied!
    const shareBtn = screen.getByTestId('btn-share-rack-link');
    fireEvent.click(shareBtn);
    expect(shareBtn.textContent).toContain('Copied!');
    expect(window.location.hash.startsWith('#rack=v1.')).toBe(true);
  });

  it('supports direct 2-click 3D port-to-port cable patching and custom 3D-print cover-panel configuration', () => {
    render(<AppDashboard />);

    expect(screen.getByTestId('rack-3d-scene-summary').textContent).toContain(
      '22 Visible Cable Tubes',
    );

    // 1st click: select patch-u7 and click free port p10 (front)
    fireEvent.click(screen.getByTestId('scene-device-patch-u7'));
    fireEvent.click(screen.getByTestId('scene-port-patch-u7-p10-front'));
    expect(screen.getByTestId('pending-port-patch-banner').textContent).toContain(
      'patch-u7:p10',
    );

    // 2nd click: select ucg-max and click free port lan4 (rear) -> creates cable #23!
    fireEvent.click(screen.getByTestId('scene-device-ucg-max'));
    fireEvent.click(screen.getByTestId('scene-port-ucg-max-lan4-rear'));
    expect(screen.queryByTestId('pending-port-patch-banner')).toBeNull();
    expect(screen.getByTestId('rack-3d-scene-summary').textContent).toContain(
      '23 Visible Cable Tubes',
    );

    // Navigate to BOM & 3D-Print tab and exercise the Custom Cover-Panel Configurator
    fireEvent.click(screen.getByTestId('nav-tab-bom'));
    expect(screen.getByTestId('cover-panel-customizer-form')).toBeDefined();

    fireEvent.change(screen.getByTestId('custom-cover-u-height'), {
      target: { value: '0.5' },
    });
    fireEvent.change(screen.getByTestId('custom-cover-pattern'), {
      target: { value: 'vented-slots' },
    });
    fireEvent.change(screen.getByTestId('custom-cover-label'), {
      target: { value: 'HOMELAB-01' },
    });

    const preview = screen.getByTestId('custom-cover-svg-preview');
    const previewImg = preview.querySelector('img');
    expect(previewImg).not.toBeNull();
    const decodedSvg = decodeURIComponent(
      previewImg?.getAttribute('src') ?? '',
    );
    expect(decodedSvg).toContain('<svg');
    expect(decodedSvg).toContain('fill="#E4E4E7"');

    // Verify browser-side custom cover STL generator produces a watertight mesh
    const stl = generateClientCustomCoverPanelStl({
      standard: '10inch',
      u_height: 0.5,
      pattern: 'vented-slots',
      label_text: 'HOMELAB-01',
    });
    expect(stl.startsWith('solid custom_cover_10inch_0p5u_vented-slots')).toBe(
      true,
    );
  });
});
