# 🗄️ RackArchitect MCP — Release Archive (`v0.1.0` – `v0.4.4`)

To keep the [GitHub Releases page](https://github.com/itAlex240/rack-architect-mcp/releases) clean and readable, only the **3 most recent releases** are kept active on the Releases feed. All earlier releases and their highlights are archived here (**English first, followed by the German version below**) and in full technical detail in [`CHANGELOG.md`](../CHANGELOG.md). Every historical Git tag remains permanently available under [GitHub Tags](https://github.com/itAlex240/rack-architect-mcp/tags).

---

## 🇬🇧 English Release Archive (`v0.1.0` – `v0.4.4`)

### 📦 `v0.4.x` Series — 3D Port & Brush-Panel Realism, External Building Drops & Collision-Free Routing

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

## 🇩🇪 Deutsches Release-Archiv (`v0.1.0` – `v0.4.4`)

### 📦 Serie `v0.4.x` — 3D-Ports, Bürstenpanels, Externe Haus-Verkabelung & Kollisionsfreie Kabelführung

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
