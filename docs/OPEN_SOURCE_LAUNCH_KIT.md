# 🚀 Open-Source Launch Kit & Community Playbook (`@rack-mcp/*`)

Dieses Dokument fasst zusammen, was im Repository bereits **schlüsselfertig automatisiert** wurde, welche **3 Account-Schritte** du selbst ausführen musst und welche **Copy-Paste Launch-Posts** für Reddit (`r/minilab`, `r/homelab`), Hacker News (`Show HN`) und Printables/MakerWorld bereitstehen.

---

## 1. Was bereits komplett im Repository eingerichtet ist

| Datei / Pfad | Zweck |
| :--- | :--- |
| [`LICENSE`](../LICENSE) | **MIT-Lizenz** (maximale Open-Source-Kompatibilität für Homelabber & Firmen). |
| [`README.md`](../README.md) | Showcase-README mit eingebetteten CAD-SVGs (`elevation.svg`, `wiring-schematic.svg`), Badges, 30-Sekunden-Quickstart, Docker-Anleitung und MCP-Config. |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | 2-Minuten-Tutorial für Community-Beiträge (neue YAML-Hardware-Blueprints & 3D-Druck-Carrier). |
| [`CODE_OF_CONDUCT.md`](../CODE_OF_CONDUCT.md) | Contributor Covenant v2.1 Verhaltenskodex. |
| [`SECURITY.md`](../SECURITY.md) | Erklärung der Zero-Auth Loopback-Architektur (`127.0.0.1:3100`) & Vulnerability-Reporting. |
| [`CHANGELOG.md`](../CHANGELOG.md) | Vollständige Release-Notes für `v0.1.0`. |
| [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | Prüft bei jedem Push & PR: `pnpm typecheck`, `pnpm validate:catalog`, `pnpm build` und `pnpm test` (`34/34`). |
| [`.github/workflows/pages.yml`](../.github/workflows/pages.yml) | Baut `@rack-mcp/web-viewer` (mit relativem `base: './'`) und veröffentlicht die **interaktive 3D/2D Live-Demo automatisch auf GitHub Pages**! |
| [`.github/workflows/release.yml`](../.github/workflows/release.yml) | Erzeugt bei jedem Git-Tag (`v0.1.0`) automatisch alle CAD- & 3D-Druck-Dateien (`.svg`, `BOM.md`, `.glb`, `.scad`, `.stl`) und hängt sie an das GitHub Release an. |
| [`.github/ISSUE_TEMPLATE/`](../.github/ISSUE_TEMPLATE/) | Strukturierte GitHub-Formulare für **Hardware Blueprint Requests** und **Bug Reports**. |
| [`Dockerfile`](../Dockerfile) & [`.dockerignore`](../.dockerignore) | Multi-Stage Alpine-Image für 1-Befehl-Start (`docker run -p 3100:3100 rack-architect-mcp`). |
| [`smithery.yaml`](../smithery.yaml) & [`glama.json`](../glama.json) | Fertige Manifeste für die großen MCP-Server-Suchmaschinen (**Smithery.ai** & **Glama.ai**). |

---

## 2. Wo ich deine Hilfe brauche (Deine 3 Account-Schritte)

Da ich keinen Zugriff auf deinen persönlichen GitHub-Account oder deine npm-Zugangsdaten habe, sind hier die **3 kurzen Schritte**, die du selbst ausführst (das lokale Git-Repository inkl. sauberem Initial-Commit und Tag `v0.1.0` habe ich bereits fertig angelegt!):

### Schritt 1: Öffentliches GitHub-Repository anlegen & pushen (1 Minute)
1. Erstelle auf GitHub ein neues **Public** Repository (`rack-architect-mcp`).
2. Führe im Projektordner folgende Befehle aus:

```bash
cd rack-architect-mcp

# Falls dein Git-Name/E-Mail noch nicht global gesetzt ist:
git config user.name "AlexB"
git config user.email "deine-email@example.com"

# Remote hinzufügen und main-Branch + v0.1.0 Release-Tag pushen:
git remote add origin https://github.com/itAlex240/rack-architect-mcp.git
git push -u origin main
git push origin v0.1.0
```

> **Was passiert sofort nach dem Push automatisch?**
> - `.github/workflows/ci.yml` läuft los und setzt den grünen Haken (`34/34 Tests passing`).
> - Durch den Push des Tags `v0.1.0` startet `.github/workflows/release.yml` und erstellt auf GitHub automatisch das **Release `v0.1.0`** inklusive fertiger Downloads für `elevation.svg`, `wiring-schematic.svg`, `BOM.md`, `rack-scene.glb` sowie der 3D-Druck-Dateien (`.scad` & `.stl`)!

### Schritt 2: GitHub Pages für die 0-Install Live-3D-Demo aktivieren (30 Sekunden)
Damit jeder Besucher auf Reddit/GitHub den 3D-Viewer sofort im Browser ohne Installation ausprobieren kann:
1. Öffne dein neues GitHub-Repo $\rightarrow$ **`Settings`** $\rightarrow$ links **`Pages`**.
2. Wähle unter **Build and deployment $\rightarrow$ Source** die Option **`GitHub Actions`**.
3. Nach ~60 Sekunden ist dein interaktiver 3D/2D Web-Viewer live unter:
   `https://italex240.github.io/rack-architect-mcp/`

### Schritt 3: In die offiziellen MCP-Verzeichnisse eintragen (2 Minuten)
Sobald das Repo öffentlich ist, trage die GitHub-URL hier ein (die Konfigurationsdateien `smithery.yaml` und `glama.json` liegen bereits im Root):
1. **Glama MCP Directory:** [https://glama.ai/mcp/servers](https://glama.ai/mcp/servers) $\rightarrow$ *Submit Server*
2. **Smithery.ai:** [https://smithery.ai/](https://smithery.ai/) $\rightarrow$ *Publish MCP Server*
3. **PulseMCP / mcp.so:** [https://mcp.so/](https://mcp.so/) $\rightarrow$ *Submit*
4. **Awesome-MCP-Servers (PR):** Pull Request in `punkpeye/awesome-mcp-servers` unter *Developer Tools / Hardware & CAD*.

---

## 3. Copy-Paste Launch-Posts für maximale Reichweite

### Post A: Reddit (`r/minilab` & `r/homelab`)

**Titel:**
> I built an open-source "Rack-as-Code" 3D/2D CAD planner, collision solver & parametric OpenSCAD/STL 3D-print generator for 10-inch mini-racks and 19-inch homelabs (with MCP AI integration)

**Text:**
```markdown
Hey r/minilab & r/homelab!

While planning an 8U 10-inch mini-rack (DeskPi RackMate / Digitus SOHO style) with two Lenovo ThinkCentre M920q Proxmox nodes, a UniFi UCG-Max, a USW-Flex-2.5G-8-PoE switch, a rear Schuko PDU, and a 1U CyberPower UPS, I kept running into the same physical headaches:
1. **Depth + Plug Clearance Collisions:** Two devices look like they fit on paper, until you plug a 55mm Schuko or 45mm IEC-C13 power plug into the back of a rear PDU and it slams into the Mini-PC on the front rail.
2. **3D-Printed Sub-U Carriers:** In 10-inch racks, we mount sub-U devices (Mini-PCs, JetKVM, Keystone couplers, 135W power bricks) inside custom 3D-printed 1U trays.
3. **LLMs Hallucinate Coordinates:** Asking Claude/ChatGPT to plan a rack usually produces invalid U heights or impossible cable lengths.

So I built **RackArchitect MCP (`@rack-mcp/*`)** — a 100% open-source (MIT), local-first **Rack-as-Code** engine and interactive 3D/2D CAD studio:

### What it does:
- **Single Source of Truth (`rack.yaml`):** Define your 10", 19", or 6" rack, modular carrier bays, sub-modules, and cables in a clean YAML file.
- **5-Stage Physical, Electrical & Acoustic Validation (26 Diagnostic Codes):**
  - **3D AABB + Dynamic Plug Clearance Solver:** Checks millimeter-exact bounding boxes including plug protrusion (`schuko-cee7 = 55mm`, `iec-c13 = 45mm`, `sfp+ = 38mm`, `rj45 = 35mm`) plus front glass door (`-50mm`) and rear wall clearances.
  - **PoE & Power DAG:** Verifies your PoE PSE switch budget (e.g. 196W on the USW-Flex-2.5G-8-PoE) and checks that external power bricks (like Lenovo 135W Slim-Tip PSUs) are plugged into both AC and DC sides.
  - **Clamped 3D Catmull-Rom Cable Routing & Speed Bottlenecks:** Calculates exact cable lengths (`+12%` slack), bend radii, front-to-rear brush panel portals, and warns when a `Cat5e` cable throttles a `2.5GbE / 10GbE` link (`SPEED_MISMATCH`).
  - **Thermal Hotspots & Logarithmic `dB(A)` Acoustics:** Detects stacked fanless high-wattage switches (`THERMAL_HOTSPOT_STACKING`), opposing airflow (`front-to-rear` vs `rear-to-front`), and computes total rack noise in `dB(A)`.
- **Parametric `.SCAD` & Ready-to-Slice `.STL` 3D-Print Exporter:** Automatically generates customizable OpenSCAD scripts and watertight `.stl` meshes for any modular 1U carrier (complete with EIA-310 oval holes, Keystone snap-in cutouts, side rails, and rear PSU brick cradles).
- **Live 3D Digital Twin & 2D CAD Studio:** Built with React 19 + Three.js (`X-Ray Chassis` mode, `Explode Z` slider, interactive Catalog & Point-to-Point Cable Builder, Dual-Row `elevation.svg` with Z-depth side cutaway, and 5-layer `wiring-schematic.svg` with VLAN/CIDR badges).
- **Model Context Protocol (MCP) + WebMCP:** Connect Claude Desktop, Cursor, or Antigravity via `stdio` and watch the AI build, validate, and self-correct your rack live in the 3D browser viewport!

🔗 **GitHub Repo (MIT License):** https://github.com/itAlex240/rack-architect-mcp
🌐 **Live Browser 3D Demo (Zero Install):** https://italex240.github.io/rack-architect-mcp/

Adding a new device to the catalog takes ~2 minutes via a simple YAML file (`packages/hardware-catalog/catalog/`). Let me know what 10-inch or 19-inch gear you'd like to see in the catalog next!
```

---

### Post B: Hacker News (`Show HN`)

**Titel:**
> Show HN: RackArchitect MCP – Agent-first Rack-as-Code with 3D AABB collision and OpenSCAD/STL export

**Text:**
```text
Hi HN,

I built RackArchitect MCP (@rack-mcp/*), an open-source, deterministic "Rack-as-Code" geometry, validation, and 2D/3D CAD platform for 19-inch enterprise racks, 10-inch homelab mini-racks, and 6-inch micro-racks.

The core design rule is "LLMs never guess geometry." When an AI agent (over MCP stdio or browser W3C WebMCP) plans or modifies a rack, every spatial coordinate (1U = 44.45mm), sub-U carrier slot offset (CarrierOrigin + SlotOffset + PortOffset), 3D AABB collision (including dynamic connector plug clearances), Catmull-Rom 3D cable spline, PoE budget DAG, and logarithmic dB(A) noise level is computed deterministically in pure TypeScript (@rack-mcp/core-domain has zero Node/DOM dependencies).

Whenever a mutation fails validation (e.g., a front mini-PC collides with a rear Schuko plug in Z-depth, or a Cat5e cable throttles a 2.5GbE link), the tool returns structured DiagnosticIssue objects with explicit remediation_suggestions so the agent can self-correct on the next turn.

It also exports Dual-Row 2D CAD elevation SVGs (with Z-depth cutaway profiles), 5-layer logical wiring schematics with VLAN/IP-CIDR annotations, binary glTF 2.0 (.glb) models, and parametric OpenSCAD (.scad) + watertight ASCII (.stl) files for 3D-printing modular rack carriers.

Repo: https://github.com/itAlex240/rack-architect-mcp
Live 3D/2D Web-Viewer Demo: https://italex240.github.io/rack-architect-mcp/
```

---

### Post C: Printables.com / MakerWorld Modell-Beschreibung

Wenn du die automatisch generierten Dateien [`3dprint-10inch-lenovo-tiny-plus-2keystone.stl`](../examples/10inch-homelab/3dprint-10inch-lenovo-tiny-plus-2keystone.stl) und [`3dprint-10inch-ucg-ultra-plus-3keystone.stl`](../examples/10inch-homelab/3dprint-10inch-ucg-ultra-plus-3keystone.stl) (samt `.scad`) auf **Printables** oder **MakerWorld** hochlädst:

> **Generated with RackArchitect MCP (Open-Source Rack-as-Code & Parametric 10-Inch Carrier Generator)**
> - **Material:** PETG or ASA recommended (`25%` Gyroid infill, `4` perimeters, no supports required when printed face-down on the front panel).
> - **Features:** EIA-310 10-inch (`254.0 mm` width, `236.5 mm` hole center-to-center) oval mounting slots, precision sub-U bay (`+0.35 mm` tolerance), integrated Keystone snap-in cutouts, reinforced `1.8 mm` side support rails, and rear power-brick cradle with Velcro tie-down slots.
> - **Customize any slot or dimension:** Automatically generated from YAML blueprints via [RackArchitect MCP on GitHub](https://github.com/itAlex240/rack-architect-mcp).
