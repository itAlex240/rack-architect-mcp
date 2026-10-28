# Changelog

All notable changes to **RackArchitect MCP (`@rack-mcp/*`)** are documented in this file (**English first, followed by the German summary / Deutsche Zusammenfassung**).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.8] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Shortest-Direct Monotonic 3D Cable Routing by Default & Optional Side-Duct Overrides (`@rack-mcp/core-domain`, `skills/rack-architect/SKILL.md`):**
  - Refactored `routeSingleCable` in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts) so `same-face-duct` (`Case B`) and `cross-face-portal` (`Case C`) default to **Shortest-Direct Monotonic Orthogonal L-Bend / 1-Step Routing** (`routing_mode: 'shortest-direct'`) instead of forcing every multi-U cable all the way out to the extreme left/right rack side walls and back.
  - **20%–55% Shorter Cable Paths & Lower BOM Costs:** Eliminated horizontal zig-zags (`Right -> Up -> Far-Left -> Up -> Right`) across rear and front plenums (e.g., `trunk-ucg-lan1-to-patch1` dropped from `810.2 mm` to `444.6 mm`; `pwr-pdu-to-ucg` dropped from `523.4 mm` to `261.7 mm`; `cross-sw6-to-ucg-lan2` dropped from `836.4 mm` to `618.5 mm`) while preserving **100% collision-free 3D centerline separation (`>= 6.50 mm` across all 34 cables in `19inch-enterprise` and `>= 7.38 mm` across all 18 cables in `10inch-homelab`)**.
  - **Direct Rear PDU Over-Edge Entry:** Rear PDU cables (`p1.z >= rail_depth_mm - 5 mm`) now step vertically over the PDU's top/bottom edge directly at their socket column `rX1` into the interior rear plenum rather than looping horizontally behind the rear rack posts.
  - **Aligned Brush-Panel Portal Entry (`Case C`):** Cross-face cables now pass through the brush panel at a `portalX` aligned directly with the starting port column `rX1` instead of detouring to the far corner of the brush strip.
  - **Optional Explicit Side-Duct Mode (`routing_mode: 'left-duct' | 'right-duct'`):** Added `CableRoutingModeSchema` to `CableConnectionSchema` in [`rack-project.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/rack-project.ts) so an MCP user or AI agent can explicitly request routing a cable via the left (`FL`/`RL`) or right (`FR`/`RR`) vertical side channel whenever desired.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Kürzeste, sinnvolle & kollisionsfreie 3D-Kabelführung als Standard (`routing_mode: 'shortest-direct'`) + optionale Seitenkanal-Wahl (`left-duct` / `right-duct`):**
  - Die 3D-Kabelführung in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts) führt Kabel ab sofort standardmäßig auf dem **kürzesten monotonen orthogonalen Weg (direkte L-Kurve bzw. 1-Stufen-Weg)** von Port zu Port, statt jedes Kabel unnötig im Zickzack bis ganz an die linke/rechte Außenwand und wieder zurück zu schicken.
  - **20 % bis 55 % kürzere Kabellängen (spart reale Kabelkosten in der BOM):** Unnötige Hin-und-her-Schlaufen sind komplett beseitigt (`trunk-ucg-lan1-to-patch1` sinkt z. B. von `810 mm` auf `445 mm`, `pwr-pdu-to-ucg` von `523 mm` auf `262 mm`), während alle Kabel weiterhin **100 % kollisionsfrei** bleiben (`>= 7,38 mm` Mindestabstand im 10"-Rack, `>= 6,50 mm` im 19"-Enterprise-Rack).
  - **Optionaler Umweg auf Nutzerwunsch (`routing_mode`):** Möchte ein Nutzer im Gespräch mit dem AI-Agent bewusst eine Führung über den linken oder rechten Seitenkanal, kann pro Kabel `routing_mode: "left-duct"` oder `"right-duct"` übergeben werden.

## [0.4.7] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Consistent English-First, German-Second Release Notes, Archive & Changelog Structure (`docs/RELEASE_NOTES.md`, `docs/RELEASE_ARCHIVE.md`, `CHANGELOG.md`, `.github/workflows/release.yml`):**
  - Unified [`docs/RELEASE_NOTES.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_NOTES.md), [`docs/RELEASE_ARCHIVE.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_ARCHIVE.md), [`CHANGELOG.md`](file:///home/alexb/projects/rack-designer/CHANGELOG.md), and the automated GitHub Releases curation workflow in [`.github/workflows/release.yml`](file:///home/alexb/projects/rack-designer/.github/workflows/release.yml) so **English always appears first (primary)** followed by the **complete German version (secondary)**, matching the repository's main `README.md` without switching languages back and forth.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Einheitliche Reihenfolge „Englisch zuerst, Deutsch danach" auf der GitHub-Releases-Seite, im Release-Archiv und im Changelog:**
  - [`docs/RELEASE_NOTES.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_NOTES.md), [`docs/RELEASE_ARCHIVE.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_ARCHIVE.md), [`CHANGELOG.md`](file:///home/alexb/projects/rack-designer/CHANGELOG.md) sowie der Release-Workflow [`.github/workflows/release.yml`](file:///home/alexb/projects/rack-designer/.github/workflows/release.yml) folgen nun durchgehend derselben Struktur wie die GitHub-Hauptseite (`README.md`): Zuerst die vollständige englische Version (Release-Highlights, Quick-Start-Guide, Asset-Tabelle), direkt gefolgt von der vollständigen deutschen Version.

## [0.4.6] - 2026-10-28

### Fixed (🇬🇧 English)
- **Zero Cable-Through-Rack-Rail / Frame Penetration, Convex-Hull-Bounded De Casteljau Corner Fillets & Clean Rear/Top Conduit Routing (`@rack-mcp/core-domain`, `@rack-mcp/web-viewer`):**
  - Replaced outward-bulging Barry-Goldman Catmull-Rom corner interpolation in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts) (`evaluateCentripetalCatmullRomSpline`) with **De Casteljau quadratic Bezier inner corner fillets** ($C^1/C^2$ continuous), mathematically guaranteeing **0.0000 mm outward corner overshoot** and zero S-wave oscillation along straight duct runs while preserving exact endpoint clamping (`splinePoints[0] === P_start`, `splinePoints[last] === P_end`).
  - Shifted vertical side-duct margins from `[5.5, 12.5, 19.5]` to `[railWidth + 6.0, railWidth + 12.5, railWidth + 19.0]` (`[21.875, 28.375, 34.875] mm` on 10"/19" racks) and clamped `computePortRiserX` so cables **never pass through the 4 vertical EIA-310 mounting rails (`X ∈ [0, 15.875 mm]` / `[W - 15.875, W]`) or the 4 corner posts**.
  - Bounded interior rear vertical duct Z-planes strictly inside `[maxFrontDeviceZ + 10 mm, rail_depth_mm - 8.5 mm]` (`195–231.5 mm` in 240 mm 10-inch racks; `335–391.5 mm` in 400 mm 19-inch racks) so internal rear LAN/power cables never loop out the back of the rack frame.
  - Updated `ExternalBuildingDrops3D` in [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx) so the rear building cable trunk collar and drop tubes sit strictly inside the upper rear aperture below the top steel roof plate (`Y <= totalHeightMm - 7.5 mm`) and above the lower switch chassis (`Y >= portY`), eliminating both roof-plate and switch-chassis clipping.
  - Aligned 10G SFP+ DAC ports (`sfp4..sfp8`) and left/right PoE/Proxmox ports (`eth2`, `eth23`, `eth24`) in [`examples/19inch-enterprise/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/19inch-enterprise/rack.yaml) so all core SFP+ trunks route as short vertical C-arches (`|dX| <= 48 mm`) and left/right bay cables stay on their respective side of the rack.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Kein Kabel-Clipping durch den Rack-Rahmen mehr, De-Casteljau-Kurven-Fillets & saubere Dach-/Rückseiten-Kabelführung:**
  - Alle vertikalen Kabelschächte liegen nun innerhalb der lichten EIA-310-Öffnung (`X >= 21,875 mm`, `0` Treffer an den 4 vertikalen Montageschienen und Eckpfosten).
  - Konvex-hüllen-beschränkte De-Casteljau-Bezier-Innenbögen verhindern jedes Überschwingen an 90°-Ecken (`0,0000 mm` Overshoot), halten interne Rückseiten-Kabel komplett im Rack-Rahmen und führen externe Haus-Kabel (`top-rear`) sauber unterhalb des Dachblechs ins Patchpanel.

## [0.4.5] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Automated GitHub Releases Page Curation (Keep Top 3 Recent Releases) & Release Archive (`.github/workflows/release.yml`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_ARCHIVE.md`):**
  - Added automated GitHub Releases curation to [`.github/workflows/release.yml`](file:///home/alexb/projects/rack-designer/.github/workflows/release.yml) so the [GitHub Releases page](https://github.com/itAlex240/rack-architect-mcp/releases) always retains only the **3 most recent releases**, automatically collapses the Quick-Start tutorial into a `<details>` accordion on the 2nd and 3rd releases, and archives older release entries from the feed while preserving all Git tags (`v0.1.0`..`v0.4.2`).
  - Restructured [`docs/RELEASE_NOTES.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_NOTES.md) to show only the **3 most recent version highlights** at the top with a collapsible `<details>` summary for older releases, and created [`docs/RELEASE_ARCHIVE.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_ARCHIVE.md) to house the complete historical release archive.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Automatische Bereinigung der GitHub-Releases-Seite (Top 3 Releases) & Release-Archiv (`docs/RELEASE_ARCHIVE.md`):**
  - Die GitHub-Releases-Seite behält automatisch nur die 3 aktuellsten Versionen aktiv im Feed, klappt die Einsteiger-Anleitung bei den beiden älteren Releases platzsparend ein und archiviert ältere Releases in `docs/RELEASE_ARCHIVE.md`.

## [0.4.4] - 2026-10-28

### Added & Improved
- **Real-World ANSI/TIA-942 & Homelab Rack Architecture Skill, 1:1 Port-Aligned Patching & 4 Ready-to-Build Use-Case Archetypes (`skills/rack-architect/SKILL.md`, `@rack-mcp/mcp-server`, `@rack-mcp/hardware-catalog`):**
  - Upgraded [`skills/rack-architect/SKILL.md`](file:///home/alexb/projects/rack-designer/skills/rack-architect/SKILL.md) and [`.agents/skills/rack-architect/SKILL.md`](file:///home/alexb/projects/rack-designer/.agents/skills/rack-architect/SKILL.md) with a clear **User Sovereignty vs. Consultative Architecture Mode** (*Mode A*: when a user specifies exact hardware or U-slots, respect their design 100% without fighting them; *Mode B*: when a user only has a rough idea or room/building requirements, apply industry-standard schematics instead of guessing randomly).
  - Documented the **5-Zone Bottom-to-Top Elevation Standard** (ANSI/TIA-942, Ubiquiti UniFi Design Center & DeskPi RackMate best practices), the **1:1 Vertical Port Alignment Law (`pN <-> ethN`)**, **Rear-to-Rear Internal Server Patching**, **Single Strategic 1U Brush Panel placement ("Less is More")**, and a **6-VLAN Enterprise/Homelab Segmentation Matrix** (`VLAN 1/99 Mgmt`, `VLAN 10 Trusted LAN`, `VLAN 20 Wi-Fi`, `VLAN 30 Cameras No-WAN`, `VLAN 40 IoT/Door`, `VLAN 50 Storage/Ceph`).
  - Added **4 Concrete Use-Case Archetypes** to `SKILL.md` and the MCP server guided prompts ([`server.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/mcp/server.ts)):
    1. *Archetype 1:* `8U 10-Inch Silent Smart-Home, Media & NAS Starter Rack` (`< 45W` idle)
    2. *Archetype 2:* `8U 10-Inch Proxmox 2.5G High-Availability Cluster & Dev-Lab`
    3. *Archetype 3:* `9U–12U 19-Inch Smart-Building, PoE Surveillance & Wi-Fi 7 House Rack`
    4. *Archetype 4:* `12U 19-Inch Redundant Enterprise Core, Dual-WAN NGFW & Proxmox HA Stack`
  - Updated [`ubiquiti-usw-pro-max-24-poe.yaml`](file:///home/alexb/projects/rack-designer/packages/hardware-catalog/catalog/19inch/ubiquiti-usw-pro-max-24-poe.yaml) to match the physical single-row 24-port Etherlighting layout (`rows: 1, columns: 24`), enhanced `plan_external_endpoints` in [`tool-handlers.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/mcp/tool-handlers.ts) to default to 1:1 vertical port alignment (`pN -> ethN`), and aligned [`examples/19inch-enterprise/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/19inch-enterprise/rack.yaml) so all 14 building patch cords drop straight down (`p8..p21 <-> eth8..eth21`) with zero diagonal crossings.

## [0.4.3] - 2026-10-28

### Added & Improved
- **Human-Readable Device Descriptions, Full Manufacturer/Model Titles & Physical Mounting Guidance (`@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/exporters`, `@rack-mcp/web-viewer`):**
  - Added `description` to `HardwareBlueprintSchema` in [`hardware-blueprint.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/hardware-blueprint.ts) and populated detailed German/technical descriptions across all 30 catalog and custom blueprints (`packages/hardware-catalog/catalog/**/*.yaml` and `examples/19inch-enterprise/custom-catalog/*.yaml`).
  - Updated [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx) and [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx) (`selected-device-guide-banner`) so selecting any device always shows its full **Manufacturer + Product Model** (`Ubiquiti UniFi Flex 2.5G PoE (USW-Flex-2.5G-8-PoE)`) alongside its assigned `hostname` (`sw-core-flex25g`), a physical **Mounting Method Badge** (`🖨️ Desktop-Gerät (benötigt 3D-Druck-Halterung / 1U-Fachboden)` vs. `🖨️ 3D-gedruckter 1U-Modulträger` vs. `🧩 Sub-Modul` vs. `🔩 Direktmontage`), and the **"Was ist dieses Gerät?"** explanation box.
  - Added 3D rendering of the matte-black PETG **10-Inch 1U Adapter Cradle/Tray** around compact polycarbonate desktop switches (`USW-Flex-2.5G-8-PoE`, `USW-Lite-8-PoE`) and full-span rack ears in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx), plus `.SCAD`/`.STL` cradle downloads in [`BomAndExportsView.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/BomAndExportsView.tsx) and [`standalone-homelab.ts`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/state/standalone-homelab.ts).
  - Added `### 2.1 Geräte-Erklärungen & Montage-Hinweise` to [`bom-markdown.ts`](file:///home/alexb/projects/rack-designer/packages/exporters/src/bom-markdown.ts) and device descriptions to [`CatalogBuilderDrawer.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/CatalogBuilderDrawer.tsx).

## [0.4.2] - 2026-10-28

### Fixed
- **Eliminated Horizontal Clipping in Right Inspector Sidebar & Top Navigation Bar (`@rack-mcp/web-viewer`):**
  - Replaced `gridTemplateColumns: '1fr 1fr'` and `'repeat(3, 1fr)'` across [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx) (`Ports (24)` list, `DIMENSIONS / POWER DRAW`, `UPS Load / PoE Budget`, mechanical KPIs, and demo controls) with `repeat(2, minmax(0, 1fr))` / `repeat(3, minmax(0, 1fr))` and added `minWidth: 0, overflow: 'hidden'` on all grid/flex cards so long port and building-drop labels (`🏢 Primary Fiber ONT (ISP 1)`, `🏠 Wi-Fi 7 PoE++ AP #1`) truncate cleanly with ellipsis instead of expanding the right column off-screen.
  - Locked `<aside data-testid="inspector-sidebar">` to `width: 368px; minWidth: 368px; maxWidth: 368px; overflowX: hidden; boxSizing: border-box`.
  - Updated [`TopNavBar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/TopNavBar.tsx) flex-shrink priorities (`flexShrink: 0` on the `RackArchitect` brand badge, workspace switcher, and action buttons; `flexShrink: 1` with ellipsis on the project title and compact filename badge) so the top navigation bar never clips on the left or right edge.

## [0.4.1] - 2026-10-28

### Fixed
- **Zero 3D Cable-to-Cable Tube Interpenetration (`@rack-mcp/core-domain`, `@rack-mcp/web-viewer`):**
  - Added exact 3D segment-to-segment distance clearance solver (`computeMinSplineClearanceMm`, `>= 6.2 mm` minimum centerline separation) and inter-column port riser shifting (`computePortRiserX`, `±7.8 mm` for 2-row switches and 2U UPS banks) to [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts).
  - Stratified front and rear Z-depth planes (`7.0 mm` lattice spacing), unified front/rear plane allocation across `Case A`, `Case B`, and `Case C` routes, and routed 1–2U vertically aligned patch cables (`dx <= 55.0 mm`) as parallel row-stratified C-arches so patch panels at either `U11` or `U12` have `0` cable-to-cable collisions.
  - Routed short-X front data uplinks on 19-inch racks (`wan1`/`wan2`) via the nearer outer rail channel instead of crossing the entire rack width, and widened 3D rear building drop spacing in [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx).

## [0.4.0] - 2026-10-28

### Added & Fixed
- **Visible 3D Ports, OLED Screens & Strain-Relief Boots on Protruding Devices (`@rack-mcp/web-viewer`):**
  - Projected all 3D port sockets (`PortMesh3D`), OLED screens, and cable terminator boots (`CableTube3D`) onto the device's actual outer faceplate (`chassis_box.min.z - 0.8mm` on `front`, `chassis_box.max.z + 0.8mm` on `rear`) in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx), [`PortMesh3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/PortMesh3D.tsx), and [`CableTube3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/CableTube3D.tsx), fixing invisible/buried RJ45 & SFP+ ports on devices with `front_protrusion_mm > 0` (`ubiquiti-usw-pro-max-24-poe`, `ubiquiti-udm-pro`, `apc-smart-ups-1500-2u`).
  - Added dual front+rear 3D socket rendering on passthrough patch panels (`is_passthrough_coupler: true`) and shielded metallic RJ45/SFP+ port rims.
- **Realistic Hollow 3D Brush Panel with Segmented Nylon Bristles (`@rack-mcp/web-viewer`):**
  - Replaced the solid black chassis box on `brush-panel` (`generic-10inch-brush-panel-1u`, `generic-19inch-brush-panel-1u`) in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) with a hollow 4-sided anodized aluminum frame (`#27272A` with `#71717A` retainer strips) and 56 segmented upper/lower vertical nylon bristles (`#09090B` / `#18181B`) with cable deflection openings where `cross-face-portal` cables pass through.
- **External Building / Room Cable Drops (`external_endpoints`), `plan_external_endpoints` MCP Tool & Step-by-Step Patching Guide (`@rack-mcp/core-domain`, `@rack-mcp/mcp-server`, `@rack-mcp/exporters`, `@rack-mcp/web-viewer`):**
  - Added `ExternalEndpointSchema` (`external_endpoints`) to [`rack-project.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/rack-project.ts) and the `plan_external_endpoints` MCP tool in [`mcp-tools.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/mcp-tools.ts) and [`tool-handlers.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/mcp/tool-handlers.ts) so external building cables (e.g., 10 PoE cameras, 5 Wi-Fi APs, 5 room LAN outlets for PC, projector, laptop, workstation, docking station) enter from the rear conduit (`top-rear` / `bottom-rear`), terminate on the rear of a Patch Panel (`0U` wasted rack space), and auto-create labeled front patch cables to the switch.
  - Extended Stage 2 & Stage 3 validation in [`validation-engine.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/validation/validation-engine.ts) to trace `external_endpoints` through passive patch-panel couplers to the connected switch port, validating `SPEED_MISMATCH`, `UNPOWERED_DEVICE`, `POE_CLASS_EXCEEDED`, and `POE_BUDGET_EXCEEDED`.
  - Added 3D rear building conduit & rear patch-panel cable drops (`ExternalBuildingDrops3D`), interactive step-by-step patching banner (`selected-cable-guide-banner`), and the **"🏠 Haus- & Raum-Verkabelung (Steck-für-Steck-Anleitung)"** in [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx), [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx), [`BomAndExportsView.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/BomAndExportsView.tsx), and [`bom-markdown.ts`](file:///home/alexb/projects/rack-designer/packages/exporters/src/bom-markdown.ts).

## [0.3.3] - 2026-10-28

### Added & Improved
- **Dedicated Local MCP Engineering Workbench vs. Static GitHub Pages Demo (`@rack-mcp/web-viewer`, `@rack-mcp/mcp-server`, `@rack-mcp/cli`):**
  - Strictly separated `standalone-demo` (GitHub Pages showcase) from `sidecar-live` (`http://127.0.0.1:3100` local engineering workspace) in [`TopNavBar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/TopNavBar.tsx), [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx), and [`useRackState.ts`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/state/useRackState.ts):
    - Removed hardcoded demo tool logs (`DEFAULT_STANDALONE_TOOL_LOG`) and fake collision-simulation buttons (`Simulate LLM Collision`, `1. Trigger Collision`, `2. LLM Self-Correction`, `Reset Demo`) when connected to a live local Sidecar server (`connectionMode === 'sidecar-live'`).
    - Added live **`New Empty Rack` (`init_rack`)** popover, **`Export to Disk` (`export_deliverables`)** trigger, bound `rack.yaml` file indicator (`MCP Live · <file>`), chronological MCP tool-call timestamps (`HH:MM:SS`), **`Clear`** log action (`clear_tool_log`), and a clean `"Ready for External MCP Agent (rack_architect_mcp)"` waiting state.
  - Added multi-process `stdio` + Sidecar synchronization across [`state-manager.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/state-manager.ts), [`sidecar-server.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/sidecar/sidecar-server.ts), and [`cli/src/index.ts`](file:///home/alexb/projects/rack-designer/packages/cli/src/index.ts):
    - Automatic `EADDRINUSE` ephemeral port fallback (`port: 0`) when port `3100` is already bound by an active Web-Viewer sidecar, plus automatic active `projectPath` discovery from `http://127.0.0.1:3100/api/state` when `rack-mcp serve` is invoked without `--project`.
    - Atomic disk persistence and live file-watcher synchronization of `.rack-mcp-tool-log.json` and `custom-catalog/*.yaml` alongside `rack.yaml` so any external LLM agent running over `stdio` or WebSocket streams its mutations, custom blueprints, and tool calls live into `http://127.0.0.1:3100`.
- **400 mm Realistic 19-Inch Enterprise Network Cabinet & Non-Overlapping Portal Badges (`examples/19inch-enterprise`, `@rack-mcp/exporters`):**
  - Updated [`examples/19inch-enterprise/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/19inch-enterprise/rack.yaml) to a `400 mm` wall/compact network cabinet depth with a short-depth `290 mm` Li-Ion UPS (`apc-smart-ups-li-ion-short-depth-2u`) and zero same-U Front/Rear overlap, plus `68 px` horizontal spacing for Brush-Panel portal badges in [`elevation-svg.ts`](file:///home/alexb/projects/rack-designer/packages/exporters/src/elevation-svg.ts).

## [0.3.2] - 2026-10-28

### Fixed & Improved
- **Coaxial Terminator Boot Insertion & Zero-Clipping 3D Cable Routing (`@rack-mcp/core-domain` & `@rack-mcp/web-viewer`):**
  - Added collinear post-boot approach waypoints (`b1`, `b2`) along the port normal across all 3 routing cases (`direct-vertical-patch`, `same-face-duct`, `cross-face-portal`) in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts), ensuring every cable enters and exits its black strain-relief terminator cylinder 100% coaxially (`0.00mm` lateral kink at boot tips on `patch-u7`, `sw-u8`, `ucg-max`, and `pve-node-01`/`02`).
  - Upgraded Case C (`cross-face-portal`) to a 14-waypoint orthogonal 3D path that steps down into the front U-boundary runner first, traverses straight horizontally through `brush-u6` (`Z = -2mm -> +17mm` at constant `Y = 244.475mm`), and drops vertically in the rear duct at `Z = 206mm` (`21mm` behind the `185mm` carrier shelves of `U5` and `U4`) so it never clips through `carrier-u5` or `carrier-u4`.
  - Refined Rear Duct (`Case B`) and Same-U Rear Jumper (`Case A`) paths so cables step straight back into the rear duct (`Z = 204..214mm`) at port height before moving laterally, eliminating under-shelf loops beneath `carrier-u4` and floor clipping on `carrier-u3`.
  - Inset 3D-printed modular carrier tray floors and side gussets in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) to `spec.W_aperture - 1.5mm` between the left/right rack rails, and extended the `brush-u6` bristle slot across both front and rear faces.

## [0.3.1] - 2026-10-28

### Fixed & Improved
- **Physical 3D Cable Routing & Open 3D-Printed Carrier Trays (`@rack-mcp/core-domain` & `@rack-mcp/web-viewer`):**
  - Eliminated Catmull-Rom tangent overshoot on long vertical/horizontal duct segments (`clampNeighborArm` in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts)), preventing cables from bowing above `U8` (`sw-u8`) or outside the rack footprint.
  - Added U-boundary horizontal cable comb runners (`computeDeviceHorizontalRunnerY`) and per-U depth-plane transitions (`zPlane1` / `zRearVerticalDuct` / `zPlane2`) so rear cables step out cleanly behind their devices before entering the side ducts and never clip diagonally through `carrier-u3`/`u4`/`u5`, `pdu-u2-rear`, or neighboring sockets.
  - Rendered 3D-printed modular carriers (`category === 'modular-carrier'`) in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) as open L-shaped PETG trays (`3.2mm` bottom support floor + `3.5mm` side gussets + `4.2mm` slotted front bezel frame) instead of opaque solid boxes, making sub-modules (`ucg-max`, `pve-node-01`/`02`), Keystone couplers, and rear cables 100% visible in 3D without needing X-Ray mode.
  - Aligned 3D cable strain-relief boots in [`CableTube3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/CableTube3D.tsx) strictly along the port normal (`waypoints[1] - waypoints[0]`).
- **2D Side-Profile Depth Cutaway Cable Harness (`@rack-mcp/web-viewer` & `@rack-mcp/exporters`):**
  - Upgraded [`renderClientSideElevationSvg`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/state/standalone-homelab.ts) and [`generateElevationSvg`](file:///home/alexb/projects/rack-designer/packages/exporters/src/elevation-svg.ts) so all 18 cables are rendered in the **Side-Profile Depth Cutaway (`Z-Y` plane)** alongside L-shaped carrier trays, plug clearance boxes, and U6 Brush-Panel Portal grommets.

## [0.3.0] - 2026-10-28

### Changed & Improved
- **Precision Hardware & CAD Studio Redesign (`@rack-mcp/web-viewer`):**
  - Replaced the navy-blue/neon-cyan aesthetic (`#090D16` / `#38BDF8`) with a neutral Carbon/Zinc engineering studio palette (`#09090b`, `#0e0e11`, `#121216`, `#18181d`) and `1px` translucent hairline borders (`rgba(255,255,255,0.07)`), inspired by Linear, Ubiquiti UniFi Design Center, and Shapr3D.
  - Added [`packages/web-viewer/src/styles/studio.css`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/styles/studio.css) with design tokens, `font-variant-numeric: tabular-nums` for telemetry alignment, and custom dark scrollbars.
  - Added [`packages/web-viewer/src/components/ui/Icons.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/Icons.tsx) with 12 geometric vector SVG icons (`1.5px` stroke) replacing emoji-based buttons.
  - Redesigned [`TopNavBar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/TopNavBar.tsx) into a single-line `52px` studio header with zero text wrapping or clipping, a segmented 4-view switcher, compact status indicator dots, and icon buttons.
  - Moved [`FloatingHudToolbar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/FloatingHudToolbar.tsx) to a floating **Bottom-Center CAD Dock** (`bottom: 18px`, `backdropFilter: blur(14px)`) so the 3D rack top never collides with UI controls.
  - Redesigned [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx) with a sticky 4-way section filter (`All` | `Element` | `Checks` | `MCP`), eliminating nested scroll traps (`maxHeight: 165px`) and replacing neon box borders with clean `2.5px` left severity accent bars.
  - Enhanced 3D rack frame contrast and hardware detail in [`RackFrame3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackFrame3D.tsx), [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx), and [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx) (anodized gunmetal posts, brushed steel EIA-310 rails, recessed front faceplates, and emerald status LEDs).

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
