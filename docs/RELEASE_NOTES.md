<div align="center">

# 🏗️ RackArchitect MCP `v0.2.0` — 3D/2D Rack-Planer & 3D-Druck-Paket

**Willkommen beim Release `v0.2.0` von RackArchitect MCP!**  
Egal ob du **gar nicht programmieren kannst** und einfach nur deinen kleinen Netzwerkschrank / 10-Zoll-Mini-Rack im Browser planen oder eine Halterung auf deinem 3D-Drucker ausdrucken möchtest — hier steht Schritt für Schritt in einfacher Sprache, was du tun musst.

> **✨ Neu in Version `v0.2.0`:**
> - **Live MCP Agent Tool-Call Feed & Interaktiver KI-Selbstkorrektur-Replay im Web-Viewer:** Verfolge im neuen **`MCP AGENT TOOL-CALL FEED`** jeden MCP-Tool-Aufruf deiner KI (`init_rack`, `mount_equipment`, `connect_cables`, `modify_equipment`, `validate_rack`) live mit oder teste per 1-Klick (**`⚡ Simulate LLM Collision`** $\rightarrow$ **`✓ Apply LLM Self-Correction`**), wie die KI eine echte 3D-Stecker-Kollision (`PLUG_CLEARANCE_COLLISION`) erkennt und selbstständig behebt!
> - **5 geführte MCP-Prompts für Claude Desktop, Cursor & Antigravity:** `plan-homelab-from-scratch`, `optimize-and-fix-rack`, `design-19inch-enterprise-rack`, `design-3d-printed-carrier-bay` und `audit-poe-and-thermals`.
> - **Fertiges Docker-Image auf GitHub Container Registry (`ghcr.io/italex240/rack-architect-mcp:latest`) & Offizielle MCP Registry (`registry.modelcontextprotocol.io`).**
> - **Hardware-Katalog mit 30 hochdetaillierten Geräten & 100 % wasserdichte 2-Manifold `.STL`-Dateien (`0` Slicer-Warnungen).**

*(🇬🇧 English Quick-Start Guide included below the German section!)*

</div>

---

## 🇩🇪 Anleitung für Einsteiger & Nicht-Techniker (Ohne Installation!)

### 🌐 Möglichkeit 1: Ich möchte das 3D-Rack einfach im Browser anschauen & ausprobieren
Du musst **nichts herunterladen und nichts installieren**. Klicke einfach auf diesen Link:

> ### 👉 [**Hier klicken: Interaktiven 3D/2D Rack-Planer im Browser starten**](https://italex240.github.io/rack-architect-mcp/)

**Was kann ich dort mit der Maus machen?**
1. **3D-Schrank frei drehen:** Halte die **linke Maustaste** gedrückt und bewege die Maus, um von allen Seiten in den Serverschrank zu schauen. Mit dem **Mausrad** zoomst du hinein.
2. **Ins Innere schauen (`X-Ray` & `Explode`):** Unten im Bild findest du den Knopf **`X-Ray Chassis`** (macht die Gehäuse durchsichtig wie beim Röntgen) und den Schieberegler **`Explode Z`** (zieht Vorder- und Rückseite auseinander, damit man alle Stecker sieht).
3. **Eigene Geräte & Kabel einbauen:** Klicke ganz oben links auf den blauen Knopf **`+ Catalog & Cable Builder`**:
   - Wähle ein Gerät aus der Liste (z. B. Mini-PC, Switch oder Steckdosenleiste), suche dir eine Etage (`U1` bis `U8`) aus und klicke auf **`+ Mount`**.
   - Das Programm prüft sofort automatisch, ob alles vom Platz, Strom und den Steckern her zusammenpasst!
4. **Fertige Baupläne & Stückliste ansehen:** Über die Knöpfe ganz oben in der Mitte wechselst du zwischen:
   - **`3D Digital Twin`** (3D-Ansicht)
   - **`2D Elevation CAD`** (Technischer Bauplan von Vorne, Hinten und der Seite)
   - **`2D Wiring Schematic`** (Übersichtlicher Kabel-Steckplan: Welches Kabel gehört in welche Buchse?)
   - **`BOM & 3D-Print Hub`** (Deine fertige Einkaufsliste + 1-Klick-Downloads für deinen 3D-Drucker)

---

### 📦 Möglichkeit 2: Wofür sind die 9 Download-Dateien ganz unten unter „Assets"?

Ganz unten auf dieser Seite unter der Überschrift **„Assets"** findest du **9 fertige Dateien zum direkten Herunterladen**. Hier ist für jede Datei genau erklärt, was du damit machst:

| Datei unten bei „Assets" | Für wen? | Was ist das & wie öffne ich es? |
| :--- | :--- | :--- |
| 🖨️ **`3dprint-10inch-lenovo-tiny-plus-2keystone.stl`** | **3D-Drucker-Besitzer** | **Druckfertige 3D-Halterung** für einen Lenovo ThinkCentre Mini-PC + 2 Netzwerk-Buchsen (für 10-Zoll-Racks). Einfach herunterladen und direkt in dein 3D-Druck-Programm (**Bambu Studio**, **OrcaSlicer**, **PrusaSlicer** oder **Cura**) ziehen und drucken! *(Tipp: PETG-Filament, flach auf die Vorderseite legen, keine Stützstruktur nötig).* |
| 🖨️ **`3dprint-10inch-ucg-ultra-plus-3keystone.stl`** | **3D-Drucker-Besitzer** | **Druckfertige 3D-Halterung** für ein Ubiquiti UniFi Cloud Gateway (`UCG-Max` / `UCG-Ultra`) + 3 Netzwerk-Buchsen im 10-Zoll-Rack. Ebenfalls direkt im Slicer öffnen und losdrucken! |
| 🔧 **`...scad` (2 Dateien)** | **Bastler & CAD-Nutzer** | Die offenen **OpenSCAD-Konstruktionsdateien** zu den beiden 3D-Druck-Halterungen. Wenn du mit dem kostenlosen Programm [OpenSCAD](https://openscad.org/) Wandstärken oder Lochmaße anpassen willst, öffnest du diese Datei. |
| 📐 **`elevation.svg`** | **Jeder (Bauplan)** | **Der maßstabsgetreue 2D-Bauplan** (Vorderansicht, Rückansicht und Seitenansicht). Nach dem Herunterladen einfach **doppelt anklicken** — die Datei öffnet sich in deinem normalen Internet-Browser (Chrome, Edge, Firefox, Safari) und lässt sich gestochen scharf zoomen oder ausdrucken. |
| 🔌 **`wiring-schematic.svg`** | **Jeder (Steckplan)** | **Der Kabel-Steckplan.** Zeigt dir auf einen Blick mit farbigen Linien, welches Strom- und Netzwerkkabel von welchem Gerät in welchen Anschluss gesteckt wird. Einfach per **Doppelklick im Browser öffnen**. |
| 🛒 **`BOM.md`** | **Einkaufs- & Stückliste** | **Deine komplette Einkaufs- und Materialliste** (Textdatei, öffnet sich in jedem Texteditor oder Markdown-Programm). Listet alle Geräte, benötigten Schrauben (`M6`-Käfigmuttern, `M3`-Schrauben), Gramm-Anzahl für den 3D-Drucker und die **exakten Kabellängen** auf. |
| 🧊 **`rack-scene.glb`** | **3D-Ansicht auf PC/Mac** | Das komplette **3D-Modell des gefüllten Racks** als einzelne Datei. Kann unter Windows/Mac mit jedem 3D-Betrachter, in PowerPoint oder in **Blender** geöffnet werden. |
| 📄 **`rack.yaml`** | **Projekt-Speicherdatei** | Die Textdatei, in der dieses komplette 8-Etagen-Beispiel-Rack gespeichert ist. |

---

## 🇬🇧 English Quick-Start Guide (For Everyone!)

### 🌐 Option 1: Try the 3D/2D Rack Planner Directly in Your Browser (Zero Install)
You don't need to install anything to explore, modify, or export the rack:

> ### 👉 [**Click Here to Open the Live 3D/2D Browser Studio**](https://italex240.github.io/rack-architect-mcp/)

- **Rotate & Inspect in 3D:** Left-click and drag to orbit around the rack, toggle **`X-Ray Chassis`** to see inside the 3D-printed carriers, or slide **`Explode Z`** to separate front and rear equipment.
- **Mount Gear & Route Cables:** Click **`+ Catalog & Cable Builder`** in the top-left corner to mount new switches/mini-PCs or patch 3D cables between ports.
- **Download Blueprints:** Switch to **`2D Elevation CAD`**, **`2D Wiring Schematic`**, or **`BOM & 3D-Print Hub`** at the top bar to download `.SVG`, `BOM.md`, `.GLB`, `.SCAD`, and `.STL` files.

### 📦 Option 2: What Are the 9 Downloadable Files Under "Assets" Below?
- 🖨️ **`.stl` files (`3dprint-10inch-...stl`):** **Ready-to-print 3D models** for 10-inch rack carriers (Lenovo Tiny M920q + 2 Keystones, and UniFi UCG-Max/Ultra + 3 Keystones). Drop straight into **Bambu Studio**, **OrcaSlicer**, or **PrusaSlicer** (print face-down in PETG/ASA, no supports needed).
- 🔧 **`.scad` files:** Parametric [OpenSCAD](https://openscad.org/) source files if you want to customize wall thickness or slot dimensions.
- 📐 **`elevation.svg` & `wiring-schematic.svg`:** High-resolution CAD drawings (Front, Rear, Side Z-Depth Cutaway, and Pin-to-Pin Wiring Plan). Double-click to open in any web browser!
- 🛒 **`BOM.md`:** Complete Bill of Materials (devices, exact cable lengths in `mm`, filament weight in `g`, and `M6`/`M3` fasteners).
- 🧊 **`rack-scene.glb`:** Full 3D model of the populated rack (open in Blender or any glTF viewer).

---

## 💻 Für Entwickler, Docker & KI-Agenten (Claude Desktop / Cursor / Antigravity)

```bash
# Mit Docker in 10 Sekunden lokal starten:
docker build -t rack-architect-mcp https://github.com/itAlex240/rack-architect-mcp.git
docker run --rm -p 3100:3100 rack-architect-mcp
# Öffne http://127.0.0.1:3100/
```

Alle technischen Details zur 5-Stufen-Validierung, den 11 MCP-Tools und den 26 Diagnose-Codes findest du im [**Kompletten System-Handbuch (`docs/COMPLETE_SYSTEM_HANDBOOK.md`)**](https://github.com/itAlex240/rack-architect-mcp/blob/main/docs/COMPLETE_SYSTEM_HANDBOOK.md).
