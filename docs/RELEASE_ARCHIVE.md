# 🗄️ RackArchitect MCP — Release Archive (`v0.1.0` – `v0.4.11`)

To keep the [GitHub Releases page](https://github.com/itAlex240/rack-architect-mcp/releases) clean and readable, only the **3 most recent releases** are kept active on the Releases feed. All earlier releases and their highlights are archived here (**English first, followed by the German version below**) and in full technical detail in [`CHANGELOG.md`](../CHANGELOG.md). Every historical Git tag remains permanently available under [GitHub Tags](https://github.com/itAlex240/rack-architect-mcp/tags).

---

## 🇬🇧 English Release Archive (`v0.1.0` – `v0.4.11`)

### 📦 `v0.4.x` Series — 3D Port & Brush-Panel Realism, External Building Drops & Collision-Free Routing

- **[`v0.4.11`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.11) (2026-10-28) — Top-Rear External ISP WAN & PoE Building Cable Drops in the GitHub Pages Demo, 3D Roof Conduit Collar & 2D/3D/GLB Exporters:**
  - Added 4 overhead external building & ISP drops (`top-rear`: ISP Fiber ONT 2.5G WAN, UniFi U7-Pro Wi-Fi 7 Ceiling AP `21W` PoE+, 4K PoE+ Driveway Camera `12.5W`, and Home-Office 2.5G Workstation Outlet) into the 8U 10-Inch Homelab reference scene and live GitHub Pages Demo, complete with 3D overhead roof conduit entry splines, 2D Rear/Side-Cutaway external drop paths, and `.glb` export meshes.
- **[`v0.4.10`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.10) (2026-10-28) — TDQS Tier-A Overhaul Across All 12 MCP Tools, Documented `outputSchema` Contracts & Server Instructions:**
  - Upgraded all 12 MCP tools (`init_rack`, `search_catalog`, `validate_rack`, `export_deliverables`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `plan_external_endpoints`, `get_device_blueprint`, `define_custom_blueprint`, and `undo_redo`) with documented `outputSchema` contracts (`structuredContent`), 100% recursive parameter descriptions, sibling tool disambiguation, full MCP behavioral annotations, and `RACK_MCP_SERVER_INSTRUCTIONS`.
- **[`v0.4.9`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.9) (2026-10-28) — 30 New Hardware Blueprints Across 10-Inch, 19-Inch & 6-Inch Racks (Catalog Doubled to 60 Parts):**
  - Added 12 new 10-inch & sub-module parts (`USW-Ultra-60W`, `UCG-Fiber` 10G, `CRS309-1G-8S+IN`, `QNAP TS-433`, `Brennenstuhl 6-Way IEC-C13 PDU`, `Netgear GS108PP`, `HP EliteDesk 800 G6 Mini`, `Intel NUC 13 Pro`, `ZimaBoard 832`, `PiKVM v4 Mini`, + 2 new 3D-print carriers), 12 new 19-inch parts (`UDM-SE`, `UNVR 4-Bay`, `USW-Pro-Max-16-PoE`, `CRS326-24G-2S+RM`, `CCR2004-16G-2S+`, `Synology RS1221+`, `FortiGate 200F`, `APC Short-Depth Li-Ion 2U UPS`, `Brennenstuhl 8-Way Schuko PDU`, `19" Shelf`, `19" Blank Panel`, `19" Dual Mini-PC Carrier`), and 6 new 6-inch micro-rack parts + `examples/6inch-microlab/`.
- **[`v0.4.8`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.8) (2026-10-28) — Shortest-Direct Monotonic 3D Cable Routing by Default & Optional Side-Duct Overrides:**
  - Refactored `routeSingleCable` in `catmull-rom-router.ts` so `same-face-duct` and `cross-face-portal` default to shortest-direct monotonic orthogonal L-bend routing (`20%–55%` shorter cable paths and lower BOM costs while preserving `>= 6.50 mm` 3D clearance), with optional `routing_mode: 'left-duct' | 'right-duct'`.
- **[`v0.4.7`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.7) (2026-10-28) — English-First, German-Second Release Notes, Archive & Changelog Consistency:**
  - Unified `docs/RELEASE_NOTES.md`, `docs/RELEASE_ARCHIVE.md`, `CHANGELOG.md`, and `.github/workflows/release.yml` so English always appears first followed by the complete German version.
- **[`v0.4.6`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.6) (2026-10-28) — Zero Cable-Through-Rail Penetration, De Casteljau Corner Fillets & Clean Rear/Top Conduit Routing:**
  - Bounded all vertical cable ducts within the inner EIA-310 aperture (`X >= 21.875 mm`, `0` rail/post collisions) and replaced outward-bulging Catmull-Rom corners with convex-hull-bounded De Casteljau quadratic Bezier fillets (`0.0000 mm` overshoot).
- **[`v0.4.5`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.5) (2026-10-28) — Automated GitHub Releases Page Curation (Keep Top 3 Recent Releases) & Release Archive:**
  - Added automated GitHub Releases curation to `.github/workflows/release.yml` so the GitHub Releases page retains only the 3 most recent releases and collapses the Quick-Start guide on the 2nd and 3rd releases into an accordion.
- **[`v0.4.4`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.4) (2026-10-28) — Real-World ANSI/TIA-942 & Homelab Schematics, 1:1 Port Alignment & 4 Use-Case Archetypes:**
  - Upgraded `skills/rack-architect/SKILL.md` with strict **User Sovereignty vs. Consultative Mode**, the 5-Zone Elevation Standard, 1:1 vertical port alignment (`p1..p24 <-> eth1..eth24`), and 4 ready-to-build reference rack archetypes.
- **[`v0.4.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.3) (2026-10-28) — Human-Readable Device Descriptions, Full Manufacturer/Model Titles & 3D-Printed Desktop Switch Cradles:**
  - Added `description` across all hardware blueprints, displayed full Manufacturer + Model titles alongside `hostname` in the 3D banner and right Inspector Sidebar, and added 3D rendering + `.SCAD`/`.STL` downloads for 10-inch desktop switch adapter cradles (`USW-Flex-2.5G-8-PoE`, `USW-Lite-8-PoE`).
- **[`v0.4.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.2) (2026-10-28) — Inspector Sidebar & TopNavBar Anti-Clipping Fix:**
  - Replaced `1fr 1fr` and `repeat(3, 1fr)` grids in `InspectorSidebar.tsx` with `minmax(0, 1fr)` and `minWidth: 0` ellipsis truncation so long port and building-drop labels never push the right sidebar off-screen.
  - Locked `TopNavBar.tsx` brand badge (`RackArchitect`) with `flexShrink: 0` so the top navigation bar never clips on narrow viewports.
- **[`v0.4.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.1) (2026-10-28) — Zero 3D Cable-to-Cable Tube Interpenetration:**
  - Added exact 3D segment-to-segment distance clearance solver (`computeMinSplineClearanceMm`, $\ge 6.2\text{ mm}$ minimum centerline separation) and inter-column port riser shifting (`computePortRiserX`) in `@rack-mcp/core-domain`.
  - Stratified front and rear Z-depth planes (`7.0 mm` lattice spacing) so upper/lower switch port rows, SFP+ DAC trunks, and vertical patch arches have `0` cable-to-cable collisions.
- **[`v0.4.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.0) (2026-10-28) — External Building Drops (`plan_external_endpoints`), Visible 3D Ports & Segmented Brush Panels:**
  - Added `external_endpoints` and the `plan_external_endpoints` MCP tool so incoming building cables (PoE cameras, Wi-Fi APs, room LAN outlets) terminate on the rear of a patch panel (`0U` wasted rack space) with step-by-step patching instructions.
  - Projected 3D ports, OLED screens, and cable strain-relief boots onto the outer faceplate of protruding devices and replaced solid black brush panels with 56 segmented nylon bristles.

### 🎨 `v0.3.x` Series — Precision CAD Studio UI, Local MCP Workbench & Coaxial Spline Routing

- **[`v0.3.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.3) (2026-10-28) — Dedicated Local MCP Engineering Workbench (`localhost:3100`):**
  - Separated the interactive GitHub Pages showcase from the local MCP Engineering Workbench (`New Empty Rack`, `Export to Disk`, live external MCP agent feed).
- **[`v0.3.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.2) (2026-10-28) — Coaxial Plug Insertion & Zero Shelf Clipping:**
  - Clamped Catmull-Rom cable splines coaxially along port normals and routed rear cross-face cables cleanly behind `U4`/`U5` trays (`0.00 mm` shelf clipping).
- **[`v0.3.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.1) (2026-10-28) — Complete Cable Harness in 2D Side-Profile Depth Cutaway:**
  - Synchronized all 18 front, rear, and brush-portal cables across the 2D `elevation.svg` side-profile cutaway in both live and standalone modes.
- **[`v0.3.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.0) (2026-10-28) — "Precision Hardware & CAD Studio" UI/UX Redesign:**
  - Introduced the neutral Carbon/Zinc color system (`#09090b` / `#121216`), single-line `52px` `TopNavBar`, bottom-center `FloatingHudToolbar`, and unified `InspectorSidebar`.

### ⚙️ `v0.2.x` & `v0.1.x` Series — Core Domain, 5-Stage Validation, Exporters & Initial MCP Server

- **[`v0.2.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.2.0) (2026-10-28) — Interactive Catalog & Cable Builder, Thermal/Acoustic Analysis & STL Export:**
  - Added browser-side interactive mounting, cable patching, thermal/acoustic KPIs, and watertight binary/ASCII `.STL` + `.SCAD` 3D-print carrier generation.
- **[`v0.1.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.1.3) – [`v0.1.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.1.0) (2026-10-27 – 2026-10-28) — Foundation Releases:**
  - Initial release of `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/exporters` (`elevation.svg`, `wiring-schematic.svg`, `BOM.md`, `rack-scene.glb`), `@rack-mcp/mcp-server`, `@rack-mcp/web-viewer`, and `@rack-mcp/cli`.

---

## 🇩🇪 Deutsches Release-Archiv (`v0.1.0` – `v0.4.11`)

### 📦 Serie `v0.4.x` — 3D-Ports, Bürstenpanels, Externe Haus-Verkabelung & Kollisionsfreie Kabelführung

- **[`v0.4.11`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.11) (2026-10-28) — Externe Zuführungskabel von oben (ISP-Glasfaser-WAN, PoE+ Überwachungskamera, PoE+ Wi-Fi 7 AP & 2.5G Büro-LAN) in der GitHub-Pages-Demo & im 3D/2D-Viewer:**
  - 4 externe Gebäude- und Provider-Leitungen von oben (`top-rear`: ISP Glasfaser-ONT 2.5G WAN, UniFi U7-Pro Wi-Fi 7 Decken-AP `21W` PoE+, 4K PoE+ Überwachungskamera Einfahrt `12,5W` & 2.5G Home-Office-Dose) im 8U 10-Zoll-Homelab und in der GitHub-Demo ergänzt — inklusive sichtbarem 3D-Dachkabeleinlass, 2D-CAD-Rück-/Seitenschnitt-Darstellung und `.glb`-Export.
- **[`v0.4.10`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.10) (2026-10-28) — TDQS Tier-A-Upgrade für alle 12 MCP-Tools, dokumentierte `outputSchema`-Verträge & Server-Instructions:**
  - Alle 12 MCP-Tools mit vollständig dokumentierten `outputSchema`-Definitionen (`structuredContent`), 100 % Parameter-Beschreibungen, Abgrenzung zu Nachbar-Tools, allen 4 MCP-Annotationen und `RACK_MCP_SERVER_INSTRUCTIONS` ausgestattet.
- **[`v0.4.9`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.9) (2026-10-28) — 30 neue Hardware-Blueprints für 10-Zoll-, 19-Zoll- & 6-Zoll-Racks (Verdopplung auf 60 Teile):**
  - 12 neue 10-Zoll- und Sub-Modul-Teile, 12 neue 19-Zoll-Enterprise-Teile und 6 neue 6-Zoll-Micro-Rack-Teile (inkl. `examples/6inch-microlab/`) sowie 3D/2D-Darstellung für Hot-Swap-NAS-Laufwerksschächte und L-Fachböden.
- **[`v0.4.8`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.8) (2026-10-28) — Kürzeste, sinnvolle & kollisionsfreie 3D-Kabelführung als Standard (`shortest-direct`) & optionale Seitenkanal-Wahl:**
  - Direkte monotone orthogonale L-Kurven-Kabelführung als Standard (`20 %–55 %` kürzere Kabellängen ohne Zickzack an die Seitenwände bei `>= 6,50 mm` Mindestabstand) sowie optionales `routing_mode: 'left-duct' | 'right-duct'`.
- **[`v0.4.7`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.7) (2026-10-28) — Einheitliche Struktur „Englisch zuerst, Deutsch danach" in allen Releases, im Archiv & im Changelog:**
  - `docs/RELEASE_NOTES.md`, `docs/RELEASE_ARCHIVE.md`, `CHANGELOG.md` und `.github/workflows/release.yml` durchgehend auf die Reihenfolge Englisch zuerst, Deutsch danach vereinheitlicht.
- **[`v0.4.6`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.6) (2026-10-28) — Kein Kabel-Clipping durch den Rack-Rahmen mehr, De-Casteljau-Kurven-Fillets & saubere Dach-/Rückseiten-Kabelführung:**
  - Alle vertikalen Kabelschächte liegen innerhalb der lichten EIA-310-Öffnung (`X >= 21,875 mm`, `0` Treffer an Schienen/Eckpfosten) und nutzen De-Casteljau-Bezier-Innenbögen ohne Überschwingen (`0,00 mm` Overshoot).
- **[`v0.4.5`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.5) (2026-10-28) — Automatische Bereinigung der GitHub-Releases-Seite (Top 3 Releases) & Release-Archiv:**
  - Automatische Kuration der GitHub-Releases-Seite (`.github/workflows/release.yml`), sodass immer nur die 3 aktuellsten Versionen im Feed verbleiben und ältere Versionen hier archiviert werden.
- **[`v0.4.4`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.4) (2026-10-28) — Echte Server-Rack-Schaltpläne (ANSI/TIA-942 & Homelab-Best-Practices), 1:1 Port-Alignment & 4 Praxis-Archetypen:**
  - `rack-architect` Skill um Nutzer-Souveränität vs. Beratungs-Modus, den 5-Zonen-Etagenplan, automatisches 1:1-Port-Alignment (`p1..p24 <-> eth1..eth24`) und 4 Referenz-Archetypen erweitert.
- **[`v0.4.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.3) (2026-10-28) — Verständliche Geräte-Beschreibungen, echter Hersteller-/Modellname & 3D-Druck-Halterung für Desktop-Switches:**
  - `description`-Feld in allen 30 Hardware-Blueprints ergänzt, Anzeige von Hersteller + Modellname neben `hostname` im 3D-Banner und in der rechten Sidebar sowie 3D-Darstellung + `.SCAD`/`.STL`-Download für 10-Zoll-Aufnahmehalterungen von Desktop-Switches (`USW-Flex-2.5G-8-PoE`, `USW-Lite-8-PoE`).
- **[`v0.4.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.2) (2026-10-28) — Fix gegen horizontales Abschneiden in der `InspectorSidebar` & `TopNavBar`:**
  - `1fr 1fr`- und `repeat(3, 1fr)`-Grids in `InspectorSidebar.tsx` durch `minmax(0, 1fr)` und `minWidth: 0` ersetzt, damit lange Port- und Raum-Labels sauber mit `...` abgekürzt werden, statt die rechte Spalte abzuschneiden.
- **[`v0.4.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.1) (2026-10-28) — 100 % kollisionsfreie 3D-Kabelführung:**
  - Exakte 3D-Segment-Abstandsprüfung (`computeMinSplineClearanceMm`, $\ge 6{,}2\text{ mm}$ Mindestabstand) und gestaffelte Z-Tiefenebenen für kreuzungsfreie Patch-Bögen und SFP+-DAC-Trunks.
- **[`v0.4.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.0) (2026-10-28) — Externe Haus-Verkabelung (`plan_external_endpoints`), sichtbare 3D-Ports & 3D-Bürstenpanel:**
  - Unterstützung für externe Gebäudekabel (PoE-Kameras, Wi-Fi-APs, Wanddosen) auf der Rückseite des Patchpanels (`0U` Platzverbrauch) sowie 56 einzelne Nylon-Borsten im 3D-Bürstenpanel.

### 🎨 Serie `v0.3.x` — Precision CAD Studio UI, Lokale MCP-Workbench & Koaxiale Steckereinführung

- **[`v0.3.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.3) – [`v0.3.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.0) (2026-10-28):**
  - Trennung zwischen der GitHub-Pages-Demo und der lokalen MCP-Arbeitsumgebung (`localhost:3100`), koaxiale Spline-Steckereinführung, vollständiger Kabelbaum im 2D-Seitenschnitt (`elevation.svg`) und neutrales Carbon/Zinc CAD-Designsystem.

### ⚙️ Serie `v0.2.x` & `v0.1.x` — Core-Domain, 5-Stufen-Validierung, Exporter & Initialer MCP-Server

- **[`v0.2.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.2.0) – [`v0.1.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.1.0) (2026-10-27 – 2026-10-28):**
  - Grundlegende Architektur aus `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/exporters`, `@rack-mcp/mcp-server`, `@rack-mcp/web-viewer` und `@rack-mcp/cli`.
