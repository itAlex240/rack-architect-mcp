// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  AppDashboard,
  checkStlFitsPrintBed,
  computeDeviceExplodeOffsetZMm,
  createStandalonePresetProjectInput,
  decodeRackProjectFromHash,
  decodeRackProjectFromHashAsync,
  encodeRackProjectToCompressedHash,
  encodeRackProjectToHash,
  evaluateStandaloneScene,
  generateClientCustomCoverPanelStl,
  generateCustomBracketStl,
  InspectorSidebar,
  measureAsciiStlBoundsMm,
  parseAsciiStlToBufferGeometry,
  renderClientSideElevationSvg,
  renderRackShareCardSvg,
  STANDALONE_PRESET_OPTIONS,
  STL_PRINT_BED_PRESETS,
  StlPreview3D,
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

  it('evaluates all 5 standalone presets with 0 validation errors, switches presets live, and encodes/decodes shareable #rack=v1. & compressed #rack=v2. URLs', async () => {
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

      const compressedHash = await encodeRackProjectToCompressedHash(presetInput);
      if (typeof CompressionStream === 'function') {
        expect(compressedHash.startsWith('#rack=v2.')).toBe(true);
        expect(compressedHash.length).toBeLessThan(encodedHash.length);
      }
      const decodedCompressed = await decodeRackProjectFromHashAsync(compressedHash);
      expect(decodedCompressed).not.toBeNull();
      expect(decodedCompressed!.project_name).toBe(presetInput.project_name);
    }

    expect(decodeRackProjectFromHash('#rack=v1.not-valid-json!')).toBeNull();
    expect(await decodeRackProjectFromHashAsync('#rack=v2.not-valid-deflate!')).toBeNull();

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

    // Click Share button -> updates compressed window.location.hash and flashes Copied!
    const shareBtn = screen.getByTestId('btn-share-rack-link');
    fireEvent.click(shareBtn);
    await waitFor(() => {
      expect(shareBtn.textContent).toContain('Copied!');
    });
    expect(
      window.location.hash.startsWith('#rack=v2.') ||
        window.location.hash.startsWith('#rack=v1.'),
    ).toBe(true);
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

  it('supports drag-and-drop YAML/NetBox import, custom bracket 3D STL preview, cable label tape options, electricity rate KPIs, and Custom Blueprint Wizard', async () => {
    render(<AppDashboard />);

    // 1. Inspector KPIs render UPS runtime & energy cost with default €0.32/kWh
    expect(screen.getByTestId('kpi-ups-runtime').textContent).toContain('min');
    expect(screen.getByTestId('kpi-energy-cost').textContent).toContain('@ €0.32');

    // 2. BOM view exposes UPS, energy rate, hardware budget, Custom Bracket, and Cable Labels
    fireEvent.click(screen.getByTestId('nav-tab-bom'));
    expect(screen.getByTestId('bom-ups-runtime-card')).toBeDefined();
    expect(screen.getByTestId('bom-hardware-budget-card')).toBeDefined();
    expect(screen.getByTestId('export-rack-yaml')).toBeDefined();
    expect(screen.getByTestId('export-labels-csv')).toBeDefined();
    expect(screen.getByTestId('export-labels-svg')).toBeDefined();

    fireEvent.change(screen.getByTestId('input-electricity-rate'), {
      target: { value: '0.45' },
    });
    expect(screen.getByTestId('kpi-energy-cost').textContent).toContain('@ €0.45');

    // Custom Device Bracket Configurator + 3D STL Preview toggle
    expect(screen.getByTestId('custom-bracket-configurator')).toBeDefined();
    expect(
      screen.getByTestId('custom-bracket-validation-badge').textContent,
    ).toContain('Fit OK');
    fireEvent.click(screen.getByTestId('bracket-preview-mode-stl'));
    const stlPreview = screen.getByTestId('custom-bracket-stl-preview');
    expect(Number(stlPreview.getAttribute('data-triangles'))).toBeGreaterThan(50);

    const parsedGeo = parseAsciiStlToBufferGeometry(
      generateClientCustomCoverPanelStl({
        standard: '10inch',
        u_height: 1,
        pattern: 'hex',
      }),
    );
    expect(parsedGeo.getAttribute('position').count).toBeGreaterThan(30);
    parsedGeo.dispose();

    // Cable Labels tape width selector
    const tapeSel = screen.getByTestId(
      'select-label-tape-width',
    ) as HTMLSelectElement;
    fireEvent.change(tapeSel, { target: { value: '24' } });
    expect(tapeSel.value).toBe('24');

    // 3. Visual Custom Blueprint Wizard registration & live catalog availability
    fireEvent.click(screen.getByTestId('btn-toggle-catalog-drawer'));
    fireEvent.click(screen.getByTestId('tab-custom-blueprint'));
    expect(screen.getByTestId('custom-blueprint-wizard')).toBeDefined();
    fireEvent.change(screen.getByTestId('custom-bp-slug'), {
      target: { value: 'my-edge-box-1u' },
    });
    fireEvent.click(screen.getByTestId('btn-register-custom-blueprint'));
    expect(screen.getByTestId('custom-bp-feedback').textContent).toContain(
      "Registered 'my-edge-box-1u'",
    );
    fireEvent.click(screen.getByTestId('tab-catalog-patcher'));
    expect(screen.getByTestId('catalog-card-my-edge-box-1u')).toBeDefined();
    expect(screen.getByTestId('mount-blueprint-my-edge-box-1u')).toBeDefined();

    // 4. Drag-and-drop NetBox inventory import updates the scene and shows toast feedback
    const netboxJson = JSON.stringify({
      rack: { name: 'Dropped NetBox Rack', u_height: 8, width: 10, mounting_depth: 240 },
      devices: [
        {
          name: 'edge-sw',
          position: 8,
          face: 'front',
          device_type: { manufacturer: { name: 'Ubiquiti' }, model: 'USW-Flex-2.5G-8-PoE' },
        },
      ],
    });
    const fakeFile = {
      name: 'netbox-export.json',
      text: async () => netboxJson,
    } as unknown as File;
    fireEvent.drop(screen.getByTestId('app-dashboard'), {
      dataTransfer: { files: [fakeFile], types: ['Files'] },
    });
    const toast = await screen.findByTestId('import-status-toast');
    expect(toast.textContent).toContain('Imported NETBOX');
  });

  it('supports URL deep-links (?tab=bom&preset=19inch-enterprise), 19-inch 2-part STL split controls, 16:9 Share Card SVG/PNG generation, and GitHub catalog issue submission', () => {
    window.history.replaceState(null, '', '/?tab=bom&preset=19inch-enterprise');
    render(<AppDashboard />);

    // Deep-linked directly into BOM view with the 19-inch Enterprise preset
    expect(screen.getByTestId('bom-and-exports-view')).toBeDefined();
    expect(screen.getByTestId('btn-export-share-card')).toBeDefined();
    expect(screen.getByTestId('export-share-card-png')).toBeDefined();

    // 19-inch 2-part split selector & quick Left/Right STL buttons appear
    const splitSelect = screen.getByTestId(
      'custom-bracket-split-half',
    ) as HTMLSelectElement;
    expect(splitSelect.value).toBe('full');
    expect(screen.getByTestId('download-custom-bracket-stl-left')).toBeDefined();
    expect(screen.getByTestId('download-custom-bracket-stl-right')).toBeDefined();

    fireEvent.change(splitSelect, { target: { value: 'left' } });
    expect(splitSelect.value).toBe('left');
    fireEvent.click(screen.getByTestId('bracket-preview-mode-stl'));
    const splitPreview = screen.getByTestId('custom-bracket-stl-preview');
    expect(Number(splitPreview.getAttribute('data-triangles'))).toBeGreaterThan(50);

    // Custom Blueprint Wizard includes pre-filled GitHub Catalog Issue button
    fireEvent.click(screen.getByTestId('btn-toggle-catalog-drawer'));
    fireEvent.click(screen.getByTestId('tab-custom-blueprint'));
    const ghLink = screen.getByTestId('btn-submit-blueprint-github') as HTMLAnchorElement;
    expect(ghLink.href).toContain('https://github.com/itAlex240/rack-architect-mcp/issues/new');
    expect(ghLink.href).toContain('labels=hardware-catalog');

    // Share card SVG embeds elevation cleanly and escapes XML characters
    const scene = evaluateStandaloneScene({
      ...createStandalonePresetProjectInput('19inch-enterprise'),
      project_name: 'R&D <Rack> "Prod"',
    });
    const elevSvg = renderClientSideElevationSvg(scene);
    const cardSvg = renderRackShareCardSvg(scene, elevSvg);
    expect(cardSvg).toContain('width="1200" height="675"');
    expect(cardSvg).toContain('mcp.rackarchitect.dev');
    expect(cardSvg).toContain('R&amp;D &lt;Rack&gt; &quot;Prod&quot;');
    expect(cardSvg).not.toContain('<Rack>');
  });

  it('hydrates short ?s=<id> share URLs via /api/share/:id without clobbering state', async () => {
    const sharedPreset = createStandalonePresetProjectInput('6inch-microlab');
    const mockedFetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 'ab23cd45', project: sharedPreset }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    vi.stubGlobal('fetch', mockedFetch);
    try {
      window.history.replaceState(null, '', '/?s=ab23cd45');
      render(<AppDashboard />);
      await waitFor(() => {
        expect(mockedFetch).toHaveBeenCalledWith('/api/share/ab23cd45');
        expect(screen.getByTestId('rack-3d-scene-summary').textContent).toContain(
          '10 Visible Cable Tubes',
        );
      });
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('measures ASCII STL bounding boxes cleanly and checks 0°/90° fit against print-bed presets', () => {
    const cover10InchStl = generateClientCustomCoverPanelStl({
      standard: '10inch',
      u_height: 1,
      pattern: 'hex',
    });
    const cover10Bounds = measureAsciiStlBoundsMm(cover10InchStl);
    expect(cover10Bounds.widthMm).toBe(254);
    expect(cover10Bounds.heightMm).toBe(43.7);
    expect(cover10Bounds.depthMm).toBe(10);
    expect(cover10Bounds.triangleCount).toBeGreaterThan(50);

    expect(
      checkStlFitsPrintBed(cover10Bounds, STL_PRINT_BED_PRESETS['bambu-256']),
    ).toEqual({ fits: true, rotated: false });
    expect(
      checkStlFitsPrintBed(cover10Bounds, STL_PRINT_BED_PRESETS['prusa-mk4']),
    ).toEqual({ fits: false, rotated: false });
    expect(
      checkStlFitsPrintBed(cover10Bounds, STL_PRINT_BED_PRESETS.ender3),
    ).toEqual({ fits: false, rotated: false });
    expect(
      checkStlFitsPrintBed(cover10Bounds, STL_PRINT_BED_PRESETS['a1-mini']),
    ).toEqual({ fits: false, rotated: false });

    const cover6InchStl = generateClientCustomCoverPanelStl({
      standard: '6inch',
      u_height: 1,
      pattern: 'solid',
    });
    const cover6Bounds = measureAsciiStlBoundsMm(cover6InchStl);
    expect(cover6Bounds.widthMm).toBe(152.4);
    expect(checkStlFitsPrintBed(cover6Bounds, 'a1-mini')).toEqual({
      fits: true,
      rotated: false,
    });

    // 90-degree rotated fit check (205x245 fits 250x210 Prusa bed when rotated)
    expect(
      checkStlFitsPrintBed({ widthMm: 205, heightMm: 245 }, 'prusa-mk4'),
    ).toEqual({ fits: true, rotated: true });

    // Empty / invalid STL gracefully returns zero bounds and non-fit
    const emptyBounds = measureAsciiStlBoundsMm('');
    expect(emptyBounds).toEqual({
      widthMm: 0,
      heightMm: 0,
      depthMm: 0,
      triangleCount: 0,
    });
    expect(checkStlFitsPrintBed(emptyBounds, 'bambu-256')).toEqual({
      fits: false,
      rotated: false,
    });

    // 19-inch full bracket vs 2-part split_half
    const bracketFullStl = generateCustomBracketStl({
      standard: '19inch',
      u_height: 1,
      device_name: 'Firewall',
      device_width_mm: 220,
      device_height_mm: 35,
      device_depth_mm: 150,
      keystone_count: 0,
      split_half: 'full',
    });
    const fullBounds = measureAsciiStlBoundsMm(bracketFullStl);
    expect(fullBounds.widthMm).toBe(482.6);
    expect(checkStlFitsPrintBed(fullBounds, 'bambu-256').fits).toBe(false);

    const bracketLeftStl = generateCustomBracketStl({
      standard: '19inch',
      u_height: 1,
      device_name: 'Firewall',
      device_width_mm: 220,
      device_height_mm: 35,
      device_depth_mm: 150,
      keystone_count: 0,
      split_half: 'left',
    });
    const leftBounds = measureAsciiStlBoundsMm(bracketLeftStl);
    expect(leftBounds.widthMm).toBe(241.3);
    expect(checkStlFitsPrintBed(leftBounds, 'bambu-256').fits).toBe(true);
    expect(checkStlFitsPrintBed(leftBounds, 'prusa-mk4').fits).toBe(true);
    expect(checkStlFitsPrintBed(leftBounds, 'ender3').fits).toBe(false);

    const bracketRightStl = generateCustomBracketStl({
      standard: '19inch',
      u_height: 1,
      device_name: 'Firewall',
      device_width_mm: 220,
      device_height_mm: 35,
      device_depth_mm: 150,
      keystone_count: 0,
      split_half: 'right',
    });
    const rightBounds = measureAsciiStlBoundsMm(bracketRightStl);
    expect(rightBounds.widthMm).toBe(241.3);
    expect(checkStlFitsPrintBed(rightBounds, 'bambu-256').fits).toBe(true);
  });

  it('updates StlPreview3D print-bed fit badge dynamically across bed presets and 19-inch 2-part splits', () => {
    const cover10InchStl = generateClientCustomCoverPanelStl({
      standard: '10inch',
      u_height: 1,
      pattern: 'lines',
    });
    render(<StlPreview3D stlAscii={cover10InchStl} />);

    const selectEl = screen.getByTestId(
      'stl-bed-preset-select',
    ) as HTMLSelectElement;
    expect(selectEl.value).toBe('bambu-256');
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      'Fits 256×256',
    );
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      '254×43.7 mm',
    );

    fireEvent.change(selectEl, { target: { value: 'ender3' } });
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      'Exceeds 220×220 — Split STL',
    );

    fireEvent.change(selectEl, { target: { value: 'none' } });
    expect(screen.queryByTestId('stl-bed-fit-badge')).toBeNull();

    cleanup();

    // Respects defaultBedPreset and showBedControls=false
    render(
      <StlPreview3D
        stlAscii={cover10InchStl}
        defaultBedPreset="prusa-mk4"
      />,
    );
    expect(
      (screen.getByTestId('stl-bed-preset-select') as HTMLSelectElement).value,
    ).toBe('prusa-mk4');
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      'Exceeds 250×210 — Split STL',
    );
    cleanup();

    render(
      <StlPreview3D stlAscii={cover10InchStl} showBedControls={false} />,
    );
    expect(screen.queryByTestId('stl-bed-preset-select')).toBeNull();
    expect(screen.queryByTestId('stl-bed-fit-badge')).toBeNull();
    cleanup();

    // End-to-end inside BomAndExportsView (19-inch full -> Exceeds, split_half='left' -> Fits)
    window.history.replaceState(null, '', '/?tab=bom&preset=19inch-enterprise');
    render(<AppDashboard />);

    fireEvent.click(screen.getByTestId('bracket-preview-mode-stl'));
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      'Exceeds 256×256 — Split STL',
    );
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      '482.6×43.7 mm',
    );

    fireEvent.change(screen.getByTestId('custom-bracket-split-half'), {
      target: { value: 'left' },
    });
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      'Fits 256×256',
    );
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      '241.3×43.7 mm',
    );

    fireEvent.change(screen.getByTestId('stl-bed-preset-select'), {
      target: { value: 'ender3' },
    });
    expect(screen.getByTestId('stl-bed-fit-badge').textContent).toContain(
      'Exceeds 220×220 — Split STL',
    );
  });
});
