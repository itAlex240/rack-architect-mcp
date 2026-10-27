# Changelog

All notable changes to **RackArchitect MCP (`@rack-mcp/*`)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-10-27

### Added
- **`@rack-mcp/core-domain`:**
  - Right-handed 3D millimeter coordinate engine (`1 U = 44.45 mm`) supporting EIA-310 `19inch`, `10inch`, and `6inch` standards and hierarchical sub-U modularity (`Carrier -> Slot -> ChildDevice`).
  - Dynamic connector plug clearance solver (`CONNECTOR_PLUG_CLEARANCE_MM`) for straight and right-angled plugs (`schuko-cee7`, `iec-c13`/`c14`, `sfp+`, `rj45`, `dc-barrel`, `lenovo-slim-tip`).
  - 5-stage deterministic validation engine producing 26 closed `DiagnosticCode` items with actionable `remediation_suggestions`:
    - Stage 1: Rack bounds & modular carrier slot checks
    - Stage 2: 3D AABB chassis & plug-clearance collision solver + front glass door / rear wall violation checks
    - Stage 3: Electrical & PoE PSE budget DAG solver (`CODE_POE_BUDGET_EXCEEDED`, `CODE_MISSING_POWER_INPUT`, `CODE_EXTERNAL_PSU_UNPLUGGED`, `CODE_PDU_OVERLOAD`)
    - Stage 4: Clamped 3D Catmull-Rom spline cable router (3 physical routing topologies: `direct-vertical-patch`, `same-face-channel`, `cross-face-portal`), bend-radius analyzer, and `SPEED_MISMATCH` (`cat5e` bottleneck on $\ge 2.5\text{ GbE}$ links)
    - Stage 5: Thermal dissipation (`BTU/hr`), airflow conflict (`THERMAL_AIRFLOW_CONFLICT`), passive hotspot stacking (`THERMAL_HOTSPOT_STACKING`), and logarithmic acoustic noise addition ($L_{\text{total}} = 10 \log_{10}(\sum 10^{L_i/10})\text{ dB(A)}$, `ACOUSTIC_NOISE_HIGH`)
- **`@rack-mcp/hardware-catalog`:**
  - 20 precision-measured YAML blueprints across `10inch`, `19inch`, `carriers`, and `sub-modules` (Ubiquiti UniFi USW-Flex-2.5G-8-PoE, UCG-Max, Pro-Max-16-PoE, MikroTik RB5009, Lenovo ThinkCentre M920q Tiny, Dell OptiPlex 7010 Micro, HP EliteDesk 800 G6 Mini, JetKVM, Raspberry Pi 5 PoE Blade, CyberPower 1U UPS, Digitus PDU, DeskPi 12-Port Patch Panel).
  - Automatic `port_groups` matrix macro expansion and local port overlap validation (`pnpm validate:catalog`).
- **`@rack-mcp/exporters`:**
  - Dual-Row CAD `elevation.svg` (`2620 × 1260 px`) with Equipment Schedule, Front View, Horizontally Mirrored Rear View, Cable Callout Lanes, and Right-Hand Z-Depth Cutaway Profile (`Z_min` to `Z_max`).
  - 5-Layer Logical `wiring-schematic.svg` with automatic `VLAN<id>` and `ip_cidr` subnet callouts.
  - Complete Markdown & CSV Bill of Materials (`BOM.md`).
  - Binary glTF 2.0 3D scene exporter (`rack-scene.glb`).
  - Parametric OpenSCAD (`.scad`) and ready-to-slice watertight ASCII `.stl` 3D-print generator (`openscad-carrier.ts`) for all `modular-carrier` blueprints.
- **`@rack-mcp/mcp-server` & `@rack-mcp/cli`:**
  - 11 canonical MCP tools (`init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `validate_rack`, `export_deliverables`, `undo_redo`), 4 MCP resources, and 2 guided prompts.
  - 50-step Undo/Redo history with atomic `.tmp` $\rightarrow$ `rename` persistence and real-time WebSocket sidecar (`http://127.0.0.1:3100`).
  - Unified `rack-mcp` CLI (`serve`, `validate`, `export`).
- **`@rack-mcp/web-viewer`:**
  - React 19 + Three.js (`@react-three/fiber`) live 3D Digital Twin with `X-Ray Chassis`, `Clearance Boxes`, `Explode Z (0..140 mm)`, and 4 camera presets.
  - Interactive `CatalogBuilderDrawer` (`+ Mount on U<N>` & point-to-point 3D cable patching with VLAN/CIDR), `Import JSON`, `Remove Device`, `Disconnect Cable`, and 1-click `.SCAD`/`.STL`/`.GLB`/`.SVG`/`BOM.md` downloads.
  - Progressive W3C WebMCP (`document.modelContext.registerTool`) browser integration.
