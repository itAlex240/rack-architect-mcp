# Changelog

All notable changes to **RackArchitect MCP (`@rack-mcp/*`)** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-10-28

### Added
- **Live MCP Agent Tool-Call Feed & Interactive Self-Correction Replay (`@rack-mcp/mcp-server` & `@rack-mcp/web-viewer`):**
  - Added `McpToolCallEntry` tracking in `ProjectStateManager` (`getToolCallLog()`, `recordToolCall()`) and real-time `toolCallLog` streaming over `/api/state` and WebSocket (`INITIAL_STATE`, `STATE_UPDATED`).
  - Added the **`MCP AGENT TOOL-CALL FEED`** panel in `InspectorSidebar.tsx` and the **`⚡ Simulate LLM Collision` / `✓ Apply LLM Self-Correction`** replay button in `TopNavBar.tsx` so users can inspect every MCP tool call (`init_rack`, `mount_equipment`, `connect_cables`, `modify_equipment`, `validate_rack`) and watch the LLM resolve a 3D `PLUG_CLEARANCE_COLLISION` autonomously.
- **Expanded Guided MCP Prompts to 5 Workflows (`@rack-mcp/mcp-server`):**
  - Added `design-19inch-enterprise-rack`, `design-3d-printed-carrier-bay`, and `audit-poe-and-thermals` alongside `plan-homelab-from-scratch` and `optimize-and-fix-rack`.
- **Automated GHCR Docker Image Publishing (`ghcr.io/italex240/rack-architect-mcp`):**
  - Added `LABEL io.modelcontextprotocol.server.name="io.github.itAlex240/rack-architect-mcp"` to `Dockerfile` and automated `ghcr.io/italex240/rack-architect-mcp:latest` & `:0.2.0` container publishing in `.github/workflows/release.yml`.

## [0.1.3] - 2026-10-28

### Added
- **Official Anthropic MCP Registry (`registry.modelcontextprotocol.io`) Integration:**
  - Added canonical `server.json` (`io.github.itAlex240/rack-architect-mcp`) and `mcpName` verification fields across workspace packages.
  - Upgraded `.github/workflows/release.yml` to build the `.mcpb` release bundle (`rack-architect-mcp.mcpb`), compute its SHA-256 digest, and automatically publish new versions to `https://registry.modelcontextprotocol.io` via GitHub Actions OIDC (`mcp-publisher login github-oidc`).

## [0.1.2] - 2026-10-28

### Added
- **Expanded Hardware Catalog to 30 Precision-Measured Blueprints (`@rack-mcp/hardware-catalog`):**
  - Added 10 new, millimeter-accurate YAML hardware blueprints across all 4 categories:
    - **10-Inch Rackmount:** `mikrotik-crs310-8g-plus-2s-plus-in` (MikroTik CRS310 8x 2.5G + 2x 10G SFP+ Switch), `tp-link-tl-sg2210mp` (TP-Link Omada 8-Port PoE+ 150W + 2x SFP Switch), `synology-ds224-plus-10inch-2u` (Synology DiskStation DS224+ 2-Bay NAS on 10-Inch 2U Tray).
    - **19-Inch Rackmount:** `ubiquiti-unas-pro-2u` (Ubiquiti UniFi UNAS Pro 7-Bay 2U 10G SFP+ NAS), `ubiquiti-usw-aggregation` (Ubiquiti UniFi Switch Aggregation 8x 10G SFP+), `generic-19inch-patch-panel-24port-cat6a` (24-Port Cat6A Passthrough Patch Panel), `generic-19inch-brush-panel-1u` (19-Inch 1U Cable Management Brush Strip Panel).
    - **Sub-U Modules:** `dell-optiplex-7010-micro` (Dell OptiPlex 7010 Micro 1L Proxmox Node with dual 1G/2.5G RJ45, `mini-pc-1liter`), `jetkvm-smart-ip-kvm` (JetKVM Open-Source Out-of-Band IP-KVM with Touchscreen, `jetkvm-bay`).
    - **3D-Printable Modular Carrier:** `3dprint-10inch-rpi5-jetkvm-2keystone` (10-Inch 1U PETG Carrier for 1x Raspberry Pi 5 + 1x JetKVM + 2x Keystone Jacks).
- **Official Open-Source Agent Skill (`skills/rack-architect/SKILL.md` & `.agents/skills/rack-architect/SKILL.md`):**
  - Published the complete autonomous 6-Step "Rack-as-Code" Engineering Workflow as an open-source Agent Skill compatible with Claude Code, Cursor, GitHub Copilot, Windsurf, and Google Antigravity (`npx skills add itAlex240/rack-architect-mcp`).

## [0.1.1] - 2026-10-27

### Added & Improved
- **Watertight 2-Manifold CSG `.stl` 3D-Print Mesher (`@rack-mcp/exporters` & `@rack-mcp/web-viewer`):**
  - Upgraded `generateCarrierStl` and browser client-side `generateClientSideCarrierStl` to a 3D rectilinear CSG voxel mesher (`0` non-manifold edges, `0` unpaired half-edges, `0` internal faces).
  - Directly bakes all 6 EIA-310 M6 mounting slots (`10.0 × 6.5 mm`), `+0.35 mm` FDM print-tolerance device bay cutouts, floor-fused retention guide rails, structural side gussets, and tray floor ventilation cutouts into the exported `.stl` mesh.
  - Added automated 2-manifold edge and signed-volume verification tests in `packages/exporters/test/exporters.test.ts`.

### Security
- **Zero Dependabot Vulnerabilities (`pnpm audit` clean):**
  - Upgraded `zod` to `^4.6.7` and `vitest` / `@vitest/mocker` to `^4.1.12` across all workspace packages and `pnpm.overrides`.
- **CodeQL Code Scanning Hardening:**
  - Replaced dynamic `fs` static file resolution in `sidecar-server.ts` with a pre-indexed in-memory static asset `Map` (`loadStaticWebViewerAssets`), strict loopback CORS origin allowlisting, `Content-Security-Policy` headers on SVG exports, and sanitized error responses.
  - Replaced `dangerouslySetInnerHTML` in `SvgPanZoomViewer.tsx` with a sandboxed `<img src="data:image/svg+xml;...">` element.
  - Added explicit `permissions: contents: read` to `.github/workflows/ci.yml` and global regex replacements (`/#/g`) in exporters.

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
