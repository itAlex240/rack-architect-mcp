# 🗄️ RackArchitect MCP — Release Archive (`v0.1.0` – `v0.6.6`)

To keep the [GitHub Releases page](https://github.com/itAlex240/rack-architect-mcp/releases) clean and readable, only the **3 most recent releases** are kept active on the Releases feed. All earlier releases and their highlights are archived here (**English first, followed by the German version below**) and in full technical detail in [`CHANGELOG.md`](../CHANGELOG.md). Every historical Git tag remains permanently available under [GitHub Tags](https://github.com/itAlex240/rack-architect-mcp/tags).

---

## 🇬🇧 English Release Archive (`v0.1.0` – `v0.6.6`)

### 🌐 `v0.6.x` Series — Zero-Install Hosted Multi-Session Remote MCP & Zero-CVE Container Hardening

- **[`v0.6.6`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.6) (2026-10-29) — Zero-Install Hosted Remote MCP Visibility Across GitHub, Glama & MCP Registries:**
  - Promoted the live Zero-Install Hosted Remote MCP endpoints (`https://rack-mcp.167.233.80.33.sslip.io/mcp` via `Streamable HTTP`, `/sse` via `SSE`, and live per-session 3D viewer `/?session=<uuid>`) right into the top Hero callout and Option A of `README.md`, `glama.json`, `server.json`, package READMEs, `SKILL.md`, and Release Notes.
- **[`v0.6.5`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.5) (2026-10-29) — Multi-Agent Handover Rules, Zero-Egress DMZ Invariants & Zero-Downtime Auto-Update Protocol:**
  - Added `CLAUDE.md`, `GEMINI.md`, and Section 10 of `AGENTS.md` codifying Hosted Remote MCP production invariants (`read_only: true` in-memory execution, Zero-Egress DMZ asset self-containment, fair-share/CSWSH guards, `server.json` lockstep sync) alongside automated Zero-Downtime GitHub `main` pull-deployments gated by Trivy CVE checks and HTTPS health probes.
- **[`v0.6.4`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.4) (2026-10-29) — Multi-Tenant Remote MCP, WebSocket, CSP & Container Security Hardening:**
  - Added fair-share per-IP session isolation (`maxSessionsPerIp = 12`, `maxNewSessionsPerMinutePerIp = 20`, rightmost `X-Forwarded-For` proxy extraction), WebSocket `256 KB` frame limits + Cross-Site WebSocket Hijacking (`CSWSH`) `Origin` verification, strict `Content-Security-Policy` + `Referrer-Policy: no-referrer` + scoped CORS, algorithmic DoS schema bounds, and `root:root`-owned immutable application binaries inside the `USER node` runtime image.
- **[`v0.6.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.3) (2026-10-29) — Workspace-Aware Zero-CVE Docker Production Build:**
  - Replaced root-only pruning with workspace-wide `pnpm install --prod --frozen-lockfile --ignore-scripts` and a build-time `rack-mcp validate` smoke check, preserving all monorepo `@rack-mcp/*` symlinks with `0` Critical and `0` High Trivy CVEs.
- **[`v0.6.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.2) (2026-10-29) — Headless CI Docker Pruning & Sourcemap Cleanup:**
  - Enforced `ENV CI=true` in the Docker `builder` stage for non-interactive headless builds and stripped residual `*esbuild*` virtual-store directories and `.map` sourcemaps prior to copying into `runner`.
- **[`v0.6.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.1) (2026-10-29) — Zero-CVE Production Docker Runtime Hardening:**
  - Pruned build-only devDependencies (`esbuild`, `vite`, `vitest`, `typescript`) and stripped unused global `npm`/`yarn` CLIs from the non-root `node:22-alpine` runtime stage (~350 MB smaller footprint, `0` Critical / `0` High Trivy CVEs).
- **[`v0.6.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.0) (2026-10-29) — Hosted Multi-Session Remote MCP Server (`Streamable HTTP` & `SSE`), Isolated Live 3D Session Viewer (`/?session=<uuid>`) & Zero-Disk URL Exports:**
  - Added `--remote-mcp` (`POST / GET / DELETE /mcp` and `GET /sse` + `POST /messages`), isolated in-memory per-session `ProjectStateManager` workspaces with real-time `wss://` Live 3D Digital Twin URLs, zero-disk HTTPS deliverable download endpoints, sliding-window IP rate limiting, and pre-compressed `gzip` asset caching.

### 🚀 `v0.5.x` Series — Live Preset Switcher, Shareable Rack URLs, Cover-Panel Configurator & 2-Click 3D Port Patching

- **[`v0.5.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.5.0) (2026-10-29) — Live Rack Preset Switcher (`10"` · `19"` · `6"` · `Empty`), Shareable Zero-Backend Rack URLs (`#rack=v1...`), Custom 3D-Print Cover-Panel Configurator & 2-Click 3D Port Patching:**
  - Added 1-click live switching across 5 EIA-310 rack presets (`10"`, `19"`, `6"`, and empty templates), deterministic `#rack=v1.<base64url>` shareable URLs (`Share` button), an interactive `0.5U`–`3U` 3D-print slot cover-panel configurator (`lines`/`hex`/`ribs`/`vented-slots`/`solid` + X-mirrored engraved front text) with live 2D CAD SVG preview and 100% watertight `.STL`/`.SCAD` export, and direct 2-click 3D port-to-port cable patching.

### 📦 `v0.4.x` Series — 3D Port & Brush-Panel Realism, External Building Drops & Collision-Free Routing

- **[`v0.4.12`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.12) (2026-10-28) — 3D-Printable Designer Slot Cover Panels (`1U` & `2U` • `Lines` / `Hex` / `Tech-Ribs`), Closed `U2 Front` Slot Above UPS & Watertight `.SCAD`/`.STL` Generators:**
  - Added 7 new 3D-printable Designer Slot Cover Panels (`60 -> 67` catalog blueprints), closed `U2 Front` above the UPS with `3dprint-10inch-cover-panel-lines-1u` (`8 mm` depth, `0` collisions with `pdu-u2-rear`), and added watertight 2-manifold `.SCAD`/`.STL` cover-panel generators.
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

## 🇩🇪 Deutsches Release-Archiv (`v0.1.0` – `v0.6.6`)

### 🌐 Serie `v0.6.x` — Gehosteter Multi-Session Remote-MCP-Server & Zero-CVE Container-Härtung

- **[`v0.6.6`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.6) (2026-10-29) — Prominente Darstellung des Zero-Install Hosted Remote-MCP-Endpunkts auf GitHub, Glama & in allen MCP-Verzeichnissen:**
  - Den live gehosteten Zero-Install Remote-MCP-Server (`https://rack-mcp.167.233.80.33.sslip.io/mcp`, `/sse` sowie `/?session=<uuid>`) prominent in den Hero-Bereich und als Option A der `README.md`, `glama.json`, `server.json`, Paket-READMEs, `SKILL.md` und Release Notes gesetzt.
- **[`v0.6.5`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.5) (2026-10-29) — Multi-Agenten-Übergabedokumentation, Zero-Egress-DMZ-Invarianten & Zero-Downtime Auto-Update-Protokoll:**
  - `CLAUDE.md`, `GEMINI.md` und Abschnitt 10 in `AGENTS.md` dokumentieren verbindlich alle Produktions- und Sicherheitsregeln für den gehosteten Remote-MCP-Server (`read_only: true`, Zero-Egress-DMZ ohne externe Laufzeit-Abhängigkeiten, Fair-Share-/CSWSH-Schutz, `server.json`-Synchronisation) sowie das automatische Zero-Downtime Pull-Deployment vom GitHub-`main`-Branch inkl. Trivy-CVE-Gate und HTTPS-Healthcheck.
- **[`v0.6.4`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.4) (2026-10-29) — Multi-Tenant Remote-MCP-, WebSocket-, CSP- & Container-Security-Hardening:**
  - Fair-Share-Mandantenschutz pro IP (`maxSessionsPerIp = 12`, `20` neue Sessions/Min., rechte `X-Forwarded-For`-Auswertung), `256 KB` WebSocket-Frame-Limit + CSWSH-`Origin`-Prüfung, strikte `Content-Security-Policy` + `Referrer-Policy: no-referrer` + Scoped CORS, algorithmische DoS-Schema-Obergrenzen sowie unveränderliche `root:root`-Programmdateien im `USER node`-Container.
- **[`v0.6.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.3) (2026-10-29) — Workspace-fähiger Zero-CVE Docker-Produktions-Build:**
  - Workspace-weites `pnpm install --prod --frozen-lockfile --ignore-scripts` inklusive automatischem CLI-Selbsttest (`rack-mcp validate`) beim Image-Build — erhält alle Monorepo-Links bei `0` Critical und `0` High CVEs im Trivy-Scan.
- **[`v0.6.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.2) (2026-10-29) — Headless Docker-Build-Fix & Sourcemap-Bereinigung:**
  - `ENV CI=true` im Docker-`builder`-Stage für nicht-interaktive Builds ohne TTY gesetzt sowie `.map`-Sourcemaps und `*esbuild*`-Reste vor dem Kopieren in `runner` entfernt.
- **[`v0.6.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.1) (2026-10-29) — Zero-CVE Docker-Runtime-Härtung:**
  - Reine Build-Abhängigkeiten (`esbuild`, `vite`, `vitest`, `typescript`) sowie ungenutzte globale Paketmanager (`npm`, `npx`, `yarn`) aus dem Non-Root-`node:22-alpine`-Produktions-Image entfernt (~350 MB schlanker, `0` Critical / `0` High Trivy-CVEs).
- **[`v0.6.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.6.0) (2026-10-29) — Gehosteter Multi-Session Remote-MCP-Server (`Streamable HTTP` & `SSE`), isolierter Live-3D-Session-Viewer (`/?session=<uuid>`) & URL-basierte Exporte:**
  - Direkte HTTPS-Anbindung (`/mcp` & `/sse`) ohne lokale Installation, isolierte In-Memory-Sessions mit eigenem Live-3D-Link (`wss://`), direkte HTTPS-Download-URLs ohne Server-Dateizugriff sowie Sliding-Window-IP-Rate-Limiting und `gzip`-Asset-Caching.

### 🚀 Serie `v0.5.x` — Live-Preset-Switcher, Teilbare Rack-URLs, Cover-Panel-Konfigurator & 2-Klick-3D-Port-Patching

- **[`v0.5.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.5.0) (2026-10-29) — Live-Preset-Switcher (`10"` · `19"` · `6"` · `Leer`), teilbare Rack-URLs (`#rack=v1...`), interaktiver 3D-Druck-Cover-Panel-Konfigurator & direktes 2-Klick-3D-Port-Patching:**
  - 1-Klick-Wechsel zwischen 5 EIA-310-Racks (`10"`, `19"`, `6"` & leere Vorlagen), teilbare `#rack=v1.<base64url>`-URLs (`Share`-Button), interaktiver `0.5U`–`3U` Cover-Panel-Konfigurator inkl. X-gespiegeltem Gravur-Text und 100 % wasserdichtem `.STL`/`.SCAD`-Export sowie direktes 2-Klick-3D-Port-Patching.

### 📦 Serie `v0.4.x` — 3D-Ports, Bürstenpanels, Externe Haus-Verkabelung & Kollisionsfreie Kabelführung

- **[`v0.4.12`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.12) (2026-10-28) — 3D-druckbare Designer-Cover-Panels (`1U` & `2U` • `Linien` / `Waben` / `Tech-Rippen`), geschlossener `U2 Front`-Slot über der USV & 2-Manifold `.SCAD`/`.STL`-Dateien:**
  - 7 neue 3D-druckbare Designer-Cover-Panels (`60 -> 67` Blueprints), geschlossener `U2 Front`-Slot über der USV (`cover-u2`, `8 mm` Tiefe, `0` Kollisionen) sowie wasserdichte `.scad`/`.stl`-Cover-Panel-Generatoren.
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
