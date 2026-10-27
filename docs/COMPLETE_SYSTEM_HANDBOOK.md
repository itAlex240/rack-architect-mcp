

---

## 15. Teil 1 Upgrade: Parametrischer 3D-Druck-Exporter (`.SCAD` & `.STL`), Interaktiver Builder, VLAN/Speed-Check & Akustik-Engine

### 15.1 Parametrischer 3D-Druck-Exporter (`@rack-mcp/exporters/src/openscad-carrier.ts`)
Alle modularen 3D-Druck-Carrier (`category: 'modular-carrier'`) werden aus ihren `HardwareBlueprint`-Geometriedaten und `slots[]`-Definitionen deterministisch in zwei CAD-/Slicer-Formate übersetzt:
1. **`generateCarrierOpenScad(blueprint, rackStandard)` (`.scad`):**
   - Vollständig parametrisches OpenSCAD-Skript mit konfigurierbaren Variablen (`panel_width_mm`, `aperture_width_mm`, `hole_pitch_x_mm`, `faceplate_thickness_mm`, `tray_floor_thickness_mm`, `rail_wall_thickness_mm`).
   - Generiert die Frontplatte mit EIA-310 Langlöchern (`9.5 × 6.5 mm`), exakten Durchbrüchen für alle `slots[]` (inkl. `+0.35 mm` 3D-Druck-Toleranz für Mini-PCs/Gateways und Snap-In-Rastlippen für Keystone-Jacks), seitlichen Stützstegen (`1.8 mm` Wandstärke), hinterem PSU-Cradle mit Klettband-Schlitzen und eingraviertem Modell-Schriftzug.
2. **`generateCarrierStl(blueprint, rackStandard)` (`.stl`):**
   - Berechnet ohne externe Abhängigkeiten im Speicher ein wasserdichtes ASCII-STL-Dreiecksnetz mittels 2D-Gitter-Subdivision um sämtliche Slot- und Langloch-Ausschnitte und fügt Bodenplatten sowie Stützstege für alle Bays hinzu.
3. **`generateProjectPrintableCarriers(project, catalog)`:**
   - Sammelt alle im Projekt montierten `modular-carrier`, dedupliziert sie nach `slug` und erzeugt `<slug>.scad` sowie `<slug>.stl`.
   - Direkt abrufbar über das MCP-Tool `export_deliverables` (`formats: ['carrier-scad', 'carrier-stl']`) sowie per 1-Klick-Buttons (**`Download .SCAD`** / **`Download .STL`**) im Tab **`BOM & 3D-Print Hub`** (`BomAndExportsView.tsx`).

### 15.2 Interaktiver Katalog- & Kabel-Builder im Web-Viewer (`CatalogBuilderDrawer.tsx`)
- **`+ Catalog & Cable Builder`** (`data-testid="btn-toggle-builder"`) in der oberen Navigationsleiste öffnet die linke Builder-Schublade (`340 px`):
  - **Tab `Hardware Catalog` (`builder-tab-catalog`):** Volltextsuche über alle 20 Blueprints, Formfaktor-Filter (`10inch`, `19inch`, `sub-module`), Wahl von `Target U (1..N)` und `Face (FRONT/REAR)` sowie 1-Klick **`+ Mount on U<N>`** (`mount-bp-<slug>`).
  - **Tab `Cable Patch Builder` (`builder-tab-cables`):** Auswahl von Quell-Gerät/Port und Ziel-Gerät/Port, Kabeltyp (`cat6a`, `cat5e`, `sfp-dac`, `iec-c13-c14`, ...), optionaler `VLAN ID` & `IP CIDR` und **`+ Route 3D Spline Cable`** (`btn-connect-cable-submit`).
- **Weitere Direkt-Aktionen im Browser:**
  - **`Import JSON`** (`data-testid="btn-import-json"`) in `TopNavBar.tsx` lädt ein komplettes `RackProject`-JSON.
  - **`Remove Device`** (`data-testid="btn-remove-device"`) und **`Disconnect Cable`** (`data-testid="btn-disconnect-cable"`) in `InspectorSidebar.tsx` löschen das ausgewählte Gerät (inkl. seiner angeschlossenen Kabel) bzw. das ausgewählte Kabel.

### 15.3 Netzwerk-Bottleneck-Erkennung (`SPEED_MISMATCH`) & VLAN / IP-CIDR Schaltplan-Badges
- `CableConnectionSchema` unterstützt `'cat5e'` und `'cat5e-angled'` sowie optionale Felder `vlan_id` (`1..4094`) und `ip_cidr` (z. B. `'10.10.20.0/24'`).
- Verbindet ein `cat5e`-Kabel zwei High-Speed-Ports ($\ge 2.5\text{ GbE}$, ermittelt durch `extractMaxPortSpeedMbps()`), meldet Stufe 4 automatisch den Diagnose-Code **`SPEED_MISMATCH`** (`WARNING`) mit der Empfehlung, auf `cat6a` oder `sfp-dac` zu wechseln.
- `generateWiringSchematicSvg()` rendert `VLAN<id>` und `ip_cidr` direkt in die Kabel-Badges von `wiring-schematic.svg`.

### 15.4 Stufe 5: Thermik-Hotspots, Airflow-Konflikte & Logarithmische `dB(A)`-Akustik
- **Thermische Verlustleistung (`total_thermal_btu_hr`):** $\text{BTU/hr} = P_{\text{total, W}} \times 3.41214$.
- **Logarithmische Schallpegel-Addition (`combined_noise_db_a`):**
  $$L_{\text{total}} = 10 \cdot \log_{10}\!\left(\sum_{i=1}^{n} 10^{L_i / 10}\right)\text{ dB(A)}$$
- **Neue Diagnose-Codes in Stufe 5:**
  - `THERMAL_AIRFLOW_CONFLICT` (`WARNING`): Mischung aus `front-to-rear` und `rear-to-front` Geräten (`airflow_profile: 'mixed-conflict'`).
  - `THERMAL_HOTSPOT_STACKING` (`WARNING`): Zwei passiv gekühlte Hochleistungsgeräte ($\ge 30\text{ W}$ pro Gerät, zusammen $\ge 65\text{ W}$) direkt auf benachbarten HEs ohne `1U` Konvektionsabstand.
  - `ACOUSTIC_NOISE_HIGH` (`WARNING`): Kombinierter Schalldruckpegel $L_{\text{total}} \ge 45.0\text{ dB(A)}$.
