<div align="center">

# 🏗️ RackArchitect MCP `v0.4.11` — 3D/2D Rack Planner, CAD Blueprints & 3D-Print Package (`.STL`)

**Welcome to RackArchitect MCP `v0.4.11`!**  
Whether you are a **complete beginner with zero coding experience** who just wants to plan a compact 10-inch mini-rack or 19-inch server rack in your browser and 3D-print custom modular brackets, or an **AI / DevOps engineer** orchestrating racks via MCP — everything is explained step by step below (**English first, followed by the full German version / Deutsche Version weiter unten**).

> **✨ What's New in the Last 3 Releases (`v0.4.9` – `v0.4.11`):**
> - **Top-Rear External ISP WAN & PoE Building Cable Drops in the GitHub Pages Demo, 3D Roof Conduit Collar & 2D/3D/GLB Exporters (`v0.4.11`):** Upgraded the 8U 10-Inch Homelab reference scene and live GitHub Pages Demo with **4 external building & ISP cables entering from above (`top-rear`)** onto the rear of the 12-port patch panel (`patch-u7:p6..p9`) and patched on the front (`22` total cables, `33.5W / 196W` active PoE load): **ISP Fiber ONT 2.5G WAN Uplink** (`ext-isp-wan` $\rightarrow$ `patch-u7:p6` $\rightarrow$ `ks-u3-wan` $\rightarrow$ `ucg-max:wan`), **UniFi U7-Pro Wi-Fi 7 Ceiling AP** (`21W` PoE+ on `sw-u8:eth7`), **4K PoE+ Surveillance Camera Driveway** (`12.5W` PoE+ on `sw-u8:eth8`), and **Home-Office 2.5G Workstation Outlet** (`sw-u8:eth9`), complete with 3D overhead roof conduit entry splines, 2D Rear/Side-Cutaway external drop paths, and `.glb` export meshes.
> - **TDQS Tier-A Overhaul Across All 12 MCP Tools, Documented `outputSchema` Contracts & Server Instructions (`v0.4.10`):** Upgraded all 12 MCP tools (`init_rack`, `search_catalog`, `validate_rack`, `export_deliverables`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `plan_external_endpoints`, `get_device_blueprint`, `define_custom_blueprint`, and `undo_redo`) with complete `outputSchema` contracts (`structuredContent`), 100% recursive parameter description coverage, explicit sibling tool disambiguation and usage boundaries, behavioral transparency disclosures, meaningful tool `title`s, full MCP behavioral annotations (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`), and server-level `instructions`.
> - **30 New Hardware Blueprints Across 10-Inch, 19-Inch & 6-Inch Racks — Catalog Doubled to 60 Parts (`v0.4.9`):** Added **12 new 10-inch & sub-module parts** (`USW-Ultra-60W`, `UCG-Fiber` 10G, `CRS309-1G-8S+IN`, `QNAP TS-433` 4-Bay 3U NAS, `Brennenstuhl 6-Way IEC-C13 PDU`, `Netgear GS108PP`, `HP EliteDesk 800 G6 Mini`, `Intel NUC 13 Pro`, `ZimaBoard 832`, `PiKVM v4 Mini`, + 2 new 3D-print carriers), **12 new 19-inch parts** (`UDM-SE`, `UNVR 4-Bay 1U`, `USW-Pro-Max-16-PoE`, `CRS326-24G-2S+RM`, `CCR2004-16G-2S+`, `Synology RS1221+` 8-Bay 2U NAS, `FortiGate 200F`, `APC Short-Depth Li-Ion 2U UPS`, `Brennenstuhl 8-Way Schuko PDU`, `19" Cantilever Shelf`, `19" Blank Panel`, `19" Dual Mini-PC Carrier`), and **6 new 6-inch micro-rack parts** (`USW-Flex-Mini`, `GL.iNet Beryl AX`, `6-Port Patch Panel`, `200W USB-C PD GaN PDU`, `6" Brush Panel`, `6" RPi5+Keystone Carrier`, plus `examples/6inch-microlab/`), complete with 3D/2D multi-bay hot-swap NAS sleds and ventilated cantilever shelves.

<details>
<summary>🗄️ <b>View Earlier Releases (v0.1.0 – v0.4.8) in the Release Archive</b></summary>

<br />

- **`v0.4.8`** — Shortest-direct monotonic 3D cable routing by default (`routing_mode: 'shortest-direct'`) & optional side-duct overrides (`20%–55%` shorter cable paths).
- **`v0.4.7`** — Consistent English-first, German-second release notes, archive & changelog structure.
- **`v0.4.6`** — Zero cable-through-rail penetration, convex-hull De Casteljau corner fillets & clean rear/top conduit routing.
- **`v0.4.5`** — Automated GitHub Releases page curation (retaining top 3 releases) & [`docs/RELEASE_ARCHIVE.md`](https://github.com/itAlex240/rack-architect-mcp/blob/main/docs/RELEASE_ARCHIVE.md).
- **`v0.4.4`** — Real-world ANSI/TIA-942 & Homelab schematics, 1:1 vertical port alignment (`p1..p24 <-> eth1..eth24`) & 4 use-case archetypes in `SKILL.md`.
- **`v0.4.3`** — Human-readable device descriptions ("What is this device?"), full Manufacturer + Model titles & 3D-printed desktop switch adapter cradles (`USW-Flex-2.5G-8-PoE`).
- **`v0.4.2`** — Eliminated horizontal text clipping in the right `InspectorSidebar` (`minmax(0, 1fr)`) and `TopNavBar`.
- **`v0.4.1`** — 100% collision-free 3D cable routing (`0` cable-to-cable interpenetrations via `computeMinSplineClearanceMm`).
- **`v0.4.0`** — External building/room cable drops (`plan_external_endpoints`), visible 3D ports on protruding faceplates & segmented 3D nylon brush panels.
- **`v0.3.0` – `v0.3.3`** — "Precision Hardware & CAD Studio" UI/UX redesign, dedicated local MCP Engineering Workbench (`localhost:3100`) & coaxial plug entry splines.
- **`v0.1.0` – `v0.2.0`** — Core domain engine, 5-stage validation solver, 30 hardware blueprints, SVG/BOM/GLB/OpenSCAD/STL exporters & MCP server.

👉 Full History: [**`docs/RELEASE_ARCHIVE.md`**](https://github.com/itAlex240/rack-architect-mcp/blob/main/docs/RELEASE_ARCHIVE.md) · [**`CHANGELOG.md`**](https://github.com/itAlex240/rack-architect-mcp/blob/main/CHANGELOG.md)

</details>

</div>

<!-- BEGIN_QUICKSTART_GUIDE -->

---

## 🇬🇧 English Quick-Start Guide (Zero Installation Required!)

### 🌐 Option 1: Try the 3D/2D Rack Planner Directly in Your Browser
You **do not need to download or install anything**. Simply click this link:

> ### 👉 [**Click Here: Launch the Interactive 3D/2D Rack Planner in Your Browser**](https://italex240.github.io/rack-architect-mcp/)

**What can you do with your mouse?**
1. **Orbit & Zoom in 3D:** Hold the **left mouse button** to rotate around the rack from any angle, and use the **scroll wheel** to zoom in on ports and cables.
2. **Look Inside (`X-Ray` & `Explode`):** Use the bottom dock to toggle **`X-Ray Chassis`** (makes enclosures translucent) or drag the **`Explode Z`** slider (separates front and rear equipment so every internal plug is visible).
3. **Mount Your Own Gear & Route Cables:** Click **`+ Catalog & Cable Builder`** in the top-left corner:
   - Pick any device (Mini-PC, switch, PDU, UPS, or 3D-printed carrier), choose a rack unit (`U1`–`U8`), and click **`+ Mount`**.
   - The engine immediately checks for depth collisions, power/PoE budgets, and thermal constraints!
4. **Switch Between 3D, CAD Blueprints & BOM:** Use the top-center switcher to view:
   - **`3D Digital Twin`** (Interactive 3D view)
   - **`2D Elevation CAD`** (True-to-scale Front, Rear & Side Z-Depth Cutaway drawing)
   - **`2D Wiring Schematic`** (Color-coded Pin-to-Pin cable wiring diagram)
   - **`BOM & 3D-Print Hub`** (Complete shopping list + 1-click `.STL` / `.SCAD` downloads for your 3D printer)

---

### 📦 Option 2: What Are the 9 Downloadable Files Under "Assets" Below?

At the very bottom of this release page under **"Assets"**, you will find **9 ready-to-use files**. Here is what each file is for:

| File Under "Assets" | Who Is It For? | What Is It & How Do I Open It? |
| :--- | :--- | :--- |
| 🖨️ **`3dprint-10inch-lenovo-tiny-plus-2keystone.stl`** | **3D Printer Owners** | **Ready-to-print 3D bracket** for a 1-Liter Mini-PC (Lenovo ThinkCentre M920q / Dell Micro) + 2 Keystone ports in a 10-inch rack. Drag directly into **Bambu Studio**, **OrcaSlicer**, **PrusaSlicer**, or **Cura** and print! *(Tip: PETG/ASA filament, lay flat on the front faceplate, zero supports required).* |
| 🖨️ **`3dprint-10inch-ucg-ultra-plus-3keystone.stl`** | **3D Printer Owners** | **Ready-to-print 3D bracket** for a Ubiquiti UniFi Cloud Gateway (`UCG-Max` / `UCG-Ultra`) + 3 Keystone ports in a 10-inch rack. Open directly in your slicer and print! |
| 🔧 **`...scad` (2 files)** | **Makers & CAD Users** | Parametric **[OpenSCAD](https://openscad.org/) source files** for the two 3D-printed brackets if you want to customize wall thickness or hole tolerances. |
| 📐 **`elevation.svg`** | **Everyone (CAD Plan)** | **True-to-scale 2D CAD Elevation Plan** (Front view, Rear view, and Side Z-depth cutaway). Simply **double-click** after downloading — it opens in any web browser (Chrome, Edge, Firefox, Safari) with infinite crisp zoom. |
| 🔌 **`wiring-schematic.svg`** | **Everyone (Wiring Plan)** | **Pin-to-Pin Cable Wiring Diagram.** Shows with color-coded lines exactly which power and network cable plugs into which socket. **Double-click to open in any browser.** |
| 🛒 **`BOM.md`** | **Shopping & Parts List** | **Complete Bill of Materials** (opens in any text/Markdown editor). Lists all devices, required screws (`M6` cage nuts, `M3` fasteners), 3D-print filament weight in grams, and **exact commercial cable lengths**. |
| 🧊 **`rack-scene.glb`** | **3D Viewers / Blender** | Complete **3D model of the populated rack** as a single binary glTF file. Open in Windows/macOS 3D viewers, PowerPoint, or **Blender**. |
| 📄 **`rack.yaml`** | **Project Save File** | Declarative YAML source file defining the complete 8U reference homelab rack. |

---

### 💻 For Developers, Docker & AI Agents (Claude Desktop / Cursor / Antigravity)

```bash
# Run locally in 10 seconds with Docker:
docker build -t rack-architect-mcp https://github.com/itAlex240/rack-architect-mcp.git
docker run --rm -p 3100:3100 rack-architect-mcp
# Open http://127.0.0.1:3100/
```

---

## 🇩🇪 Deutsche Version — Release Notes & Einsteiger-Anleitung

**Willkommen beim Release `v0.4.11` von RackArchitect MCP!**  
Egal ob du **gar nicht programmieren kannst** und einfach nur deinen kleinen Netzwerkschrank / 10-Zoll-Mini-Rack im Browser planen oder eine Halterung auf deinem 3D-Drucker ausdrucken möchtest — hier steht Schritt für Schritt in einfacher Sprache, was du tun musst.

> **✨ Was ist neu in den letzten 3 Versionen (`v0.4.9` – `v0.4.11`):**
> - **Externe Zuführungskabel von oben (ISP-Glasfaser-WAN, PoE+ Überwachungskamera, PoE+ Wi-Fi 7 AP & 2.5G Büro-LAN) in der GitHub-Pages-Demo & im 3D/2D-Viewer (`v0.4.11`):** Das 8U 10-Zoll-Homelab-Referenzszenario und die interaktive GitHub-Pages-Demo enthalten nun **4 externe Gebäude- und Provider-Leitungen von oben (`top-rear`)**, die hinten auf dem 12-Port-Patchpanel (`patch-u7:p6..p9`) aufgelegt und vorne gepatcht sind (`22` Kabel gesamt, `33,5 W / 196 W` aktive PoE-Last): **ISP Glasfaser-ONT (2.5G WAN-Uplink)** (`ext-isp-wan` $\rightarrow$ `patch-u7:p6` $\rightarrow$ `ks-u3-wan` $\rightarrow$ `ucg-max:wan`), **UniFi U7-Pro Wi-Fi 7 Decken-AP** (`21W` PoE+ an `sw-u8:eth7`), **4K PoE+ Überwachungskamera Einfahrt & Haustür** (`12,5W` PoE+ an `sw-u8:eth8`) sowie **Home-Office 2.5G Workstation-Dose** (`sw-u8:eth9`) — inklusive sichtbarem 3D-Dachkabeleinlass, 2D-CAD-Rück-/Seitenschnitt-Darstellung und `.glb`-Export.
> - **TDQS Tier-A-Upgrade für alle 12 MCP-Tools, dokumentierte `outputSchema`-Verträge & Server-Instructions (`v0.4.10`):** Alle 12 MCP-Tools (`init_rack`, `search_catalog`, `validate_rack`, `export_deliverables`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `plan_external_endpoints`, `get_device_blueprint`, `define_custom_blueprint` und `undo_redo`) verfügen nun über vollständig dokumentierte `outputSchema`-Definitionen (`structuredContent`), 100 % Parameter-Beschreibungsabdeckung, explizite Nutzungs- und Abgrenzungsregeln zwischen Nachbar-Tools, transparente Verhaltens- und Seiteneffekt-Dokumentation, sprechende Tool-`title`s, alle 4 MCP-Annotationen (`readOnlyHint`, `destructiveHint`, `idempotentHint`, `openWorldHint`) sowie Server-weite `instructions`.
> - **30 neue Hardware-Blueprints für 10-Zoll-, 19-Zoll- & 6-Zoll-Racks — Verdopplung des Katalogs auf 60 Teile (`v0.4.9`):** Neu hinzugekommen sind **12 Teile für 10-Zoll-Racks & Sub-Module** (`USW-Ultra-60W`, `UCG-Fiber` 10G, `CRS309-1G-8S+IN`, `QNAP TS-433` 4-Bay 3U NAS, `Brennenstuhl 6-fach IEC-C13 PDU`, `Netgear GS108PP`, `HP EliteDesk 800 G6 Mini`, `Intel NUC 13 Pro`, `ZimaBoard 832`, `PiKVM v4 Mini` + 2 neue 3D-Druck-Carrier), **12 Teile für 19-Zoll-Racks** (`UDM-SE`, `UNVR 4-Bay 1U`, `USW-Pro-Max-16-PoE`, `CRS326-24G-2S+RM`, `CCR2004-16G-2S+`, `Synology RS1221+` 8-Bay 2U NAS, `FortiGate 200F`, `APC Short-Depth Li-Ion 2U USV`, `Brennenstuhl 8-fach Schuko PDU`, `19" Fachboden`, `19" Blindpanel`, `19" Dual-Mini-PC-Carrier`) sowie **6 Teile für 6-Zoll-Micro-Racks** (`USW-Flex-Mini`, `GL.iNet Beryl AX`, `6-Port Patchpanel`, `200W USB-C PD GaN-Leiste`, `6" Bürstenleiste`, `6" RPi5+Keystone Carrier` inkl. Referenzprojekt `examples/6inch-microlab/`) samt detaillierter 3D/2D-Darstellung für Hot-Swap-Laufwerksschächte und L-Fachböden.

<details>
<summary>🗄️ <b>Ältere Versionen (v0.1.0 – v0.4.8) auf Deutsch anzeigen</b></summary>

<br />

- **`v0.4.8`** — Kürzeste, sinnvolle & kollisionsfreie 3D-Kabelführung als Standard (`routing_mode: 'shortest-direct'`) & optionale Seitenkanal-Wahl (`20 %–55 %` kürzere Kabellängen).
- **`v0.4.7`** — Einheitliche Struktur „Englisch zuerst, Deutsch danach" in allen Releases, im Archiv & im Changelog.
- **`v0.4.6`** — Kein Kabel-Clipping durch den Rack-Rahmen mehr, De-Casteljau-Kurven-Fillets & saubere Dach-/Rückseiten-Kabelführung.
- **`v0.4.5`** — Automatische Bereinigung der GitHub-Releases-Seite (Top 3 Releases) & [`docs/RELEASE_ARCHIVE.md`](https://github.com/itAlex240/rack-architect-mcp/blob/main/docs/RELEASE_ARCHIVE.md).
- **`v0.4.4`** — Echte Server-Rack-Schaltpläne (ANSI/TIA-942 & Homelab-Best-Practices), 1:1 Port-Alignment (`p1..p24 <-> eth1..eth24`) & 4 Praxis-Archetypen im `rack-architect` Skill.
- **`v0.4.3`** — Verständliche Geräte-Beschreibungen („Was ist dieses Gerät?"), echter Hersteller + Modellname & 3D-Druck-Halterung für Desktop-Switches (`USW-Flex-2.5G-8-PoE`).
- **`v0.4.2`** — Fix gegen horizontales Abschneiden in der rechten `InspectorSidebar` (`minmax(0, 1fr)`) & `TopNavBar`.
- **`v0.4.1`** — 100 % kollisionsfreie 3D-Kabelführung (`0` Kabel-Überlappungen durch `computeMinSplineClearanceMm`).
- **`v0.4.0`** — Externe Haus- & Raum-Verkabelung (`plan_external_endpoints`), sichtbare 3D-Ports & segmentiertes 3D-Bürstenpanel.
- **`v0.3.0` – `v0.3.3`** — „Precision Hardware & CAD Studio" UI/UX-Redesign, lokale MCP-Workbench (`localhost:3100`) & koaxiale Spline-Steckereinführung.
- **`v0.1.0` – `v0.2.0`** — Core-Domain, 5-Stufen-Validierung, 30 Hardware-Blueprints, SVG/BOM/GLB/OpenSCAD/STL-Exporter & MCP-Server.

👉 Vollständige Historie: [**`docs/RELEASE_ARCHIVE.md`**](https://github.com/itAlex240/rack-architect-mcp/blob/main/docs/RELEASE_ARCHIVE.md) · [**`CHANGELOG.md`**](https://github.com/itAlex240/rack-architect-mcp/blob/main/CHANGELOG.md)

</details>

### 🌐 Möglichkeit 1: 3D-Rack direkt im Browser anschauen & ausprobieren (Ohne Installation)

> ### 👉 [**Hier klicken: Interaktiven 3D/2D Rack-Planer im Browser starten**](https://italex240.github.io/rack-architect-mcp/)

1. **3D-Schrank frei drehen:** Halte die **linke Maustaste** gedrückt und bewege die Maus, um von allen Seiten in den Serverschrank zu schauen. Mit dem **Mausrad** zoomst du hinein.
2. **Ins Innere schauen (`X-Ray` & `Explode`):** Unten im Bild findest du den Knopf **`X-Ray Chassis`** (macht die Gehäuse durchsichtig wie beim Röntgen) und den Schieberegler **`Explode Z`** (zieht Vorder- und Rückseite auseinander, damit man alle Stecker sieht).
3. **Eigene Geräte & Kabel einbauen:** Klicke ganz oben links auf den blauen Knopf **`+ Catalog & Cable Builder`**, wähle ein Gerät und klicke auf **`+ Mount`**.
4. **Fertige Baupläne & Stückliste ansehen:** Wechsle oben zwischen **`3D Digital Twin`**, **`2D Elevation CAD`**, **`2D Wiring Schematic`** und **`BOM & 3D-Print Hub`**.

### 📦 Möglichkeit 2: Erklärung der 9 Download-Dateien unten unter „Assets"

| Datei unten bei „Assets" | Für wen? | Was ist das & wie öffne ich es? |
| :--- | :--- | :--- |
| 🖨️ **`3dprint-10inch-lenovo-tiny-plus-2keystone.stl`** | **3D-Drucker-Besitzer** | **Druckfertige 3D-Halterung** für einen Lenovo ThinkCentre Mini-PC + 2 Netzwerk-Buchsen (für 10-Zoll-Racks). Direkt in **Bambu Studio**, **OrcaSlicer**, **PrusaSlicer** oder **Cura** ziehen und drucken! *(Tipp: PETG-Filament, flach auf die Vorderseite legen, keine Stützstruktur nötig).* |
| 🖨️ **`3dprint-10inch-ucg-ultra-plus-3keystone.stl`** | **3D-Drucker-Besitzer** | **Druckfertige 3D-Halterung** für ein Ubiquiti UniFi Cloud Gateway (`UCG-Max` / `UCG-Ultra`) + 3 Netzwerk-Buchsen im 10-Zoll-Rack. |
| 🔧 **`...scad` (2 Dateien)** | **Bastler & CAD-Nutzer** | Offene **[OpenSCAD](https://openscad.org/)-Konstruktionsdateien** zum Anpassen von Wandstärken oder Lochmaßen. |
| 📐 **`elevation.svg`** | **Jeder (Bauplan)** | **Maßstabsgetreuer 2D-Bauplan** (Vorderansicht, Rückansicht, Seitenansicht). Einfach **doppelt anklicken** zum Öffnen im Browser. |
| 🔌 **`wiring-schematic.svg`** | **Jeder (Steckplan)** | **Kabel-Steckplan.** Zeigt mit farbigen Linien, welches Kabel in welchen Anschluss gehört. Per **Doppelklick im Browser öffnen**. |
| 🛒 **`BOM.md`** | **Einkaufs- & Stückliste** | **Komplette Einkaufs- und Materialliste** (Geräte, Schrauben, Filament-Gramm und **exakte Kabellängen**). |
| 🧊 **`rack-scene.glb`** | **3D-Ansicht auf PC/Mac** | Komplettes **3D-Modell des gefüllten Racks** für 3D-Betrachter oder **Blender**. |
| 📄 **`rack.yaml`** | **Projekt-Speicherdatei** | Textdatei, in der dieses komplette 8-Etagen-Beispiel-Rack gespeichert ist. |

Alle technischen Details zur 5-Stufen-Validierung, den 12 MCP-Tools und den 26 Diagnose-Codes findest du im [**Kompletten System-Handbuch (`docs/COMPLETE_SYSTEM_HANDBOOK.md`)**](https://github.com/itAlex240/rack-architect-mcp/blob/main/docs/COMPLETE_SYSTEM_HANDBOOK.md).

<!-- END_QUICKSTART_GUIDE -->
