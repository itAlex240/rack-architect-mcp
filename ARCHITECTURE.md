# ARCHITECTURE.md — Technical Blueprint & System Specification

## 1. System Overview & Hybrid-Sidecar Architecture

The platform bridges AI agents (via the **Model Context Protocol**) with deterministic physical engineering rules and real-time 2D/3D visual inspection.

```text
+-------------------------------------------------------------------------+
|                        AI Agent / MCP Host                              |
|             (Claude Desktop, Cursor, Gemini CLI, Antigravity)           |
+------------------------------------+------------------------------------+
                                     |
                        MCP Protocol (stdio / SSE)
                     [Tool Calls & Diagnostic JSON]
                                     |
                                     v
+-------------------------------------------------------------------------+
|                    @rack-mcp/mcp-server (Single Process)                |
|                                                                         |
|  +---------------------------+       +-------------------------------+  |
|  |   MCP Tool & Resource     | <---> |   Project State Controller    |  |
|  |         Handlers          |       |  (Undo/Redo, Atomic File IO)  |  |
|  +-------------+-------------+       +---------------+---------------+  |
|                |                                     |                  |
|                v                                     v                  |
|  +-------------------------------------------------------------------+  |
|  |                      @rack-mcp/core-domain                        |  |
|  |  1. Coordinate Transformer (U / Carrier Slots -> Global 3D mm)    |  |
|  |  2. 5-Stage Constraint Solver (AABB, Clearance, PoE/Power DAG)    |  |
|  |  3. 3D Channel & Portal Cable Router (Catmull-Rom + Bundling)     |  |
|  +-------------------------------------------------------------------+  |
|                |                                     |                  |
|                v                                     v                  |
|  +---------------------------+       +-------------------------------+  |
|  |    @rack-mcp/exporters    |       |  Embedded HTTP + WebSocket    |  |
|  | (2D SVG, Schematics, BOM, |       |   Sidecar Server (:3100)      |  |
|  |     Headless GLB)         |       +---------------+---------------+  |
+----------------+-------------------------------------+------------------+
                 |                                     |
                 v                                     v (Real-time State Delta)
      +--------------------+               +------------------------------+
      | Local Project Dir  |               |    @rack-mcp/web-viewer      |
      | - rack.yaml        |               |  - Procedural Three.js Scene |
      | - elevation.svg    |               |  - Instanced Ports & Tubes   |
      | - wiring.svg       |               |  - X-Ray & Z-Explode Mode    |
      | - BOM.md / .glb    |               |  - STL/3MF Carrier Loader    |
      +--------------------+               +------------------------------+
```

### Runtime Synchronization Loop
1. **Agent Mutation:** The AI agent invokes an MCP tool (e.g., `mount_equipment` or `connect_cables`).
2. **Deterministic Evaluation:** `@rack-mcp/core-domain` computes the new 3D scene graph, runs all 5 validation stages, and routes all cables in 3D space.
3. **Persistence & Broadcast:** The state is saved atomically to `rack.yaml` and the full `ComputedRackScene` payload is broadcast via WebSocket to `@rack-mcp/web-viewer`.
4. **External File Watch:** If the user edits `rack.yaml` in an IDE or moves a device in the Web UI, `chokidar` / WebSocket updates the in-memory state so the agent's next MCP call operates on the latest ground truth.

---

## 2. Physical Coordinate System & Mechanical Standards

All spatial math inside `@rack-mcp/core-domain` uses a **Right-Handed 3D Cartesian Coordinate System** in **millimeters (`mm`)**.

### 2.1 Axis Definitions
* **Origin `(0, 0, 0)`:** Located at the **bottom-most, front-most, left-most outer edge** of the standard rack faceplate envelope at `U1`.
* **X-Axis (Horizontal Width):** `0` is the left edge of the faceplate; `W_panel` is the right edge.
* **Y-Axis (Vertical Height):** `0` is the bottom of `U1`. Each rack unit `u` (1-indexed, `u` in `[1..N_U]`) spans:
  * `Y_min(u) = (u - 1) * 44.45 mm`
  * `Y_max(u) = u * 44.45 mm`
* **Z-Axis (Depth):**
  * `Z = 0` is the **front mounting face of the front vertical rails**.
  * `Z < 0` extends forward outside the rails (rack ears thickness, handles, patch cable bend radii, front glass door at `Z = -D_front_clearance`).
  * `Z > 0` extends inward toward the rear mounting rails located at `Z = D_rail_depth`.

### 2.2 Rack Form Factor Standards (EIA-310-D & Homelab Extensions)

| Standard Slug | Panel Width (`W_panel`) | Rail Opening (`W_aperture`) | Mounting Hole Center-to-Center (`W_holes`) | Left Rail Aperture Offset (`X_aperture_min`) | Left Hole Center X (`X_hole_left`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`19inch`** | `482.60 mm` | `450.85 mm` | `465.10 mm` | `15.875 mm` | `8.75 mm` |
| **`10inch`** | `254.00 mm` | `222.25 mm` | `236.50 mm` | `15.875 mm` | `8.75 mm` |
| **`6inch`** | `152.40 mm` | `120.65 mm` | `134.90 mm` | `15.875 mm` | `8.75 mm` |

* **Vertical Hole Pitch within 1U (`44.45 mm`):** Every 1U interval on a rail has 3 mounting holes centered at offsets `+6.35 mm`, `+22.225 mm`, and `+38.10 mm` relative to `Y_min(u)`.

### 2.3 Hierarchical Sub-U Coordinate Resolution (`Carrier -> Slot -> Child`)
To support 10-inch and 19-inch modular carriers (e.g., a 3D-printed 1U faceplate holding a Lenovo ThinkCentre Tiny on the left and 4 Keystone jacks on the right):

1. **Carrier Global Origin:** A carrier mounted on `u_start` on the `front` face has origin:
   `O_carrier = (0, (u_start - 1) * 44.45, 0)`
   If mounted on the `rear` face (`Z = D_rail_depth`), its local Z-axis points inward (`-Z` in world space), and its local X-axis is mirrored when viewed from the rear so "left/right" matches physical rear inspection.
2. **Slot Global Origin:** Each `SlotDefinition` inside a carrier specifies a local offset `O_slot = (x_s, y_s, z_s)` and bounding dimensions `(w_s, h_s, d_s)`.
3. **Child Device & Port Global Transform:** Any child device mounted in `slot_id` inherits the transform:
   `P_world = T_carrier * (O_slot + P_child_local)`

---

## 3. Data Schemas (`@rack-mcp/core-domain`)

### 3.1 Hardware Blueprint Schema (`catalog/*.yaml`)
Every hardware item in `@rack-mcp/hardware-catalog` conforms to `HardwareBlueprintSchema`:

```yaml
slug: "ubiquiti-usw-flex-2-5g-8-poe"
manufacturer: "Ubiquiti"
model: "USW-Flex-2.5G-8-PoE"
category: "switch" # switch | router | compute-node | nas | patch-panel | pdu | ups | modular-carrier | brush-panel | shelf | keystone-module
mount_type: "rackmount-10" # rackmount-19 | rackmount-10 | rackmount-6 | sub-module | shelf-standing

geometry:
  u_height: 1.0
  width_mm: 212.9       # Body width behind faceplate/ears
  height_mm: 43.7
  depth_mm: 135.0
  ear_mount_style: "included-10inch-ears" # flush-front | recessed-20mm | sub-module-clip | none
  front_protrusion_mm: 5.0
  rear_protrusion_mm: 0.0
  weight_grams: 1150

power_and_thermal:
  electrical_role: "pse-switch" # consumer | pse-switch | pdu | ups | passive
  idle_watts: 12
  max_system_watts: 25          # Own consumption excluding PoE output
  poe_budget_watts: 196         # Available PoE output budget
  airflow: "passive-convection" # front-to-rear | rear-to-front | side-to-side | passive-convection

# Declarative Port Matrix Macro (Expanded automatically on load into individual ports)
port_groups:
  - id_prefix: "eth"
    label_prefix: "Port "
    start_index: 1
    count: 8
    face: "front"
    connector_type: "rj45"
    direction: "bidirectional"
    capabilities: ["2500base-t", "poe-out-bt-type3"]
    grid:
      origin_x_mm: 45.0 # Relative to bottom-left corner of front face
      origin_y_mm: 14.0
      columns: 8
      rows: 1
      pitch_x_mm: 16.5
      pitch_y_mm: 0.0

ports:
  - port_id: "uplink_10g"
    label: "10G SFP+/RJ45 Combo"
    face: "front"
    connector_type: "sfp-plus"
    direction: "bidirectional"
    capabilities: ["10gbase-sr", "10gbase-dac"]
    coordinates: { x_mm: 190.0, y_mm: 14.0, orientation: "upright" }
  - port_id: "pwr_in"
    label: "AC/DC Input"
    face: "rear"
    connector_type: "iec-c14"
    direction: "input"
    capabilities: ["ac-mains"]
    coordinates: { x_mm: 30.0, y_mm: 18.0, orientation: "upright" }

visuals:
  chassis_color_hex: "#E5E7EB"
  material_preset: "coated-aluminum" # matte-black-steel | coated-aluminum | 3d-printed-petg
  has_oled_display: false
  stl_mesh_path: null # Optional relative path to custom .stl/.glb for 3D-printed parts

printable_metadata: null # Populated for 3D-printed carriers (filament_grams, heat_set_inserts, printables_url)
```

### 3.2 Modular Carrier Extension (`slots` Block)
When `category: "modular-carrier"`, the blueprint includes a `slots` array:

```yaml
slots:
  - slot_id: "left-mini-pc-bay"
    accepted_slot_type: "mini-pc-1liter" # Matches child device 'slot_compatibility'
    offset_mm: { x: 18.0, y: 2.0, z: 0.0 }
    max_dimensions_mm: { width: 182.0, height: 38.0, depth: 185.0 }
  - slot_id: "keystone-1"
    accepted_slot_type: "standard-keystone"
    offset_mm: { x: 208.0, y: 12.0, z: 0.0 }
    max_dimensions_mm: { width: 16.5, height: 22.0, depth: 35.0 }
```

### 3.3 Project State Schema (`rack.yaml`)
The user project file stores only declarative intent (no redundant computed coordinates):

```yaml
schema_version: "1.0"
project_name: "Mini-Lab Cluster"
rack:
  standard: "10inch"
  u_height: 8
  rail_depth_mm: 260
  enclosure_type: "closed-glass-front"
  front_door_clearance_mm: 45
  rear_clearance_mm: 40

mounted_devices:
  - instance_id: "ups-01"
    blueprint_slug: "cyberpower-10inch-ups-1u"
    u_position: 1
    face: "front"
    hostname: "ups-core"
  - instance_id: "carrier-u3"
    blueprint_slug: "3dprint-10inch-lenovo-tiny-plus-2keystone"
    u_position: 3
    face: "front"
    children:
      - instance_id: "pve-node-01"
        blueprint_slug: "lenovo-thinkcentre-m920q"
        slot_id: "left-mini-pc-bay"
        hostname: "pve01.lab"
      - instance_id: "ks-wan"
        blueprint_slug: "keystone-rj45-cat6a-coupler"
        slot_id: "keystone-1"

cables:
  - cable_id: "cab-eth-01"
    from: { instance_id: "sw-core", port_id: "eth1", face: "front" }
    to: { instance_id: "pve-node-01", port_id: "eth0", face: "rear" }
    cable_type: "cat6a"
    color_hex: "#3B82F6"
    label: "PVE01 Trunk"
    preferred_portal_u: 2 # Optional hint for front-to-rear transition
```

---

## 4. The 5-Stage Deterministic Constraint & Validation Engine

Every state evaluation runs a 5-stage pipeline returning a `ValidationResult`:

### Stage 1: Spatial 3D AABB & Plug Clearance Solver
For every mounted device `i`, compute two Axis-Aligned Bounding Boxes in world space (`mm`):
1. **Chassis Box `B_chassis(i)`:** Exact `[X_min, X_max] x [Y_min, Y_max] x [Z_min, Z_max]`.
2. **Plug & Bend-Radius Clearance Box `B_clearance(i)`:** For each port on device `i` that has a connected cable `c`, extrude a local clearance box from the port coordinate along the face normal by `delta_Z_plug(cable_type)`:

| Connector / Cable Type | Required Straight Clearance (`delta_Z_plug`) | Angled Variant Clearance |
| :--- | :--- | :--- |
| `rj45` (Cat6 / Cat6A with boot) | `35 mm` | `20 mm` |
| `sfp-plus` (DAC Twinax / Fiber) | `48 mm` | N/A |
| `iec-c13` / `iec-c14` (Standard AC) | `55 mm` | `30 mm` |
| `schuko-cee7` (Mains Plug in PDU) | `65 mm` | `38 mm` |
| `dc-5525` / `usb-c` (Barrel / USB Power) | `32 mm` | `18 mm` |

**Collision Rules:**
* **Rule 1.1 (Device-to-Device Hard Overlap):** If `B_chassis(i)` intersects `B_chassis(j)` for `i != j` (excluding valid parent-carrier/child-slot pairs), emit `ERROR: CHASSIS_COLLISION` with exact overlapping millimeter depth on `Z` and U range on `Y`.
* **Rule 1.2 (Plug-to-Device Overlap):** If `B_clearance(i)` intersects `B_chassis(j)`, emit `ERROR: PLUG_CLEARANCE_COLLISION` (e.g., a rear PDU collides with the power cord sticking out of the back of a switch).
* **Rule 1.3 (Enclosure Boundary Violation):** If `enclosure_type == "closed-glass-front"` and any front `B_chassis` or `B_clearance` has `Z_min < -D_front_door_clearance`, emit `ERROR: FRONT_DOOR_COLLISION`.

### Stage 2: Port & Media Compatibility Matrix
For each cable `c` connecting Port `A` and Port `B`:
* Verify neither port is already occupied (note: `passthrough-coupler` ports allow 1 connection on `face: "front"` and 1 connection on `face: "rear"`).
* Verify physical plug compatibility (`rj45 <-> rj45`, `sfp-plus <-> sfp-plus`, `iec-c13 <-> iec-c14`, `schuko-cee7 <-> iec-c14`).
* Verify electrical/signal compatibility (prevent connecting an `rj45-serial-console` port into an Ethernet switch port without an adapter).

### Stage 3: Electrical Power & PoE Directed Acyclic Graph (DAG)
Construct a directed graph `G = (V, E)` of all power and PoE flows:
* **PoE Budget & Class Verification:** For each PSE switch `s`, sum the `max_system_watts` of all downstream PoE-powered devices (`poe-in-*`):
  `SUM(P_max(d)) <= P_poe_budget(s)`
  If exceeded, emit `ERROR: POE_BUDGET_EXCEEDED`. Also verify per-port class (`af` = 15.4W, `at` = 30W, `bt-type3` = 60W, `bt-type4` = 90W).
* **PDU & UPS Capacity Verification:** Sum total peak power (device consumption + active PoE loads) flowing into each PDU and UPS. If `SUM(P_max) > P_ups_capacity`, emit `ERROR: UPS_OVERLOAD`.
* **Orphaned Active Device Check:** Every device with `electrical_role != "passive"` must have an active path to a power source (either AC/DC power cable to a PDU/UPS or PoE input from a powered PSE switch). Otherwise emit `WARNING: UNPOWERED_DEVICE`.

### Stage 4: Mechanical Stability, Portals & Thermal Heuristics
* **Center of Gravity (`Y_CoG`):**
  `Y_CoG_normalized = SUM(m_i * Y_center(i)) / (H_total_rack * SUM(m_i))`
  If `Y_CoG_normalized > 0.55` or any device with `m_i >= 4000 g` is mounted above `U3`, emit `WARNING: TOP_HEAVY_RACK`.
* **Front-to-Rear Cable Portal Verification:** If any cable connects a `front` port to a `rear` port, verify that at least one valid **Portal** (an unoccupied U gap, a side aperture gap `>= 15 mm`, or a mounted `brush-panel`) exists within `+/- 3 U`. If the front plane is 100% sealed with full-width devices and blanking panels, emit `ERROR: NO_FRONT_TO_REAR_PORTAL`.

### Stage 5: Self-Correction Remediation Synthesizer
Every `DiagnosticIssue` MUST include a machine-actionable `remediation_suggestions` array computed by probing free U slots and alternative cable types:

```json
{
  "code": "PLUG_CLEARANCE_COLLISION",
  "severity": "ERROR",
  "affected_instances": ["sw-core-01", "pdu-rear-01"],
  "u_range": [4, 4],
  "message": "Depth collision on U4: 'sw-core-01' (185mm body + 55mm straight IEC-C13 plug = 240mm) overlaps with rear-mounted 'pdu-rear-01' (55mm depth) in a 260mm deep rack (35mm overlap).",
  "remediation_suggestions": [
    "Move 'pdu-rear-01' from U4 (rear) to U7 (rear) or U8 (rear), where front depth is 0mm.",
    "Change power cable 'cab-pwr-01' to 'power-schuko-c13-angled', reducing plug clearance from 55mm to 30mm (still requires moving PDU or increasing rail depth by 10mm)."
  ]
}
```

---

## 5. 3D Cable Routing & Length Calculation Engine

### 5.1 Virtual Routing Channels (Ducts)
Each rack defines 4 vertical cable ducts along the Y-axis:
* **Front-Left Duct (`FL`) & Front-Right Duct (`FR`):** Positioned near the left and right mounting ears at `Z = -18 mm`, `X_FL = 12 mm`, `X_FR = W_panel - 12 mm`.
* **Rear-Left Duct (`RL`) & Rear-Right Duct (`RR`):** Positioned inside the rear rails at `Z = D_rail_depth - 15 mm`.
* **Segregation Rule:** By default, **Data/Network cables** prefer the **Right Duct** (`FR`/`RR`), and **Power cables** prefer the **Left Duct** (`FL`/`RL`) to prevent visual clutter and electromagnetic interference.

### 5.2 The 3-Case Waypoint Resolver
Given Start Port `P_1 = (X_1, Y_1, Z_1)` with normal `n_1` and End Port `P_2 = (X_2, Y_2, Z_2)` with normal `n_2`:
First compute rigid plug exit points `A_1 = P_1 + d_boot * n_1` and `A_2 = P_2 + d_boot * n_2`.

1. **Case A — Direct Vertical Patch (Short Jump):**
   * *Trigger:* Same face (`front->front` or `rear->rear`), `|Y_1 - Y_2| <= 90 mm` (`<= 2 U`), and `|X_1 - X_2| <= 50 mm`.
   * *Waypoints:* `[P_1, A_1, M_arc, A_2, P_2]` where `M_arc` arches outward by `25 mm` along `n_1`.
2. **Case B — Same-Face Duct Route:**
   * *Trigger:* Same face, outside Case A thresholds.
   * *Waypoints:* Exit `A_1` -> Horizontal channel at `Y_1` to target vertical duct (`FL`/`FR` or `RL`/`RR`) -> Vertical travel in duct from `Y_1` to `Y_2` -> Horizontal channel at `Y_2` to `A_2` -> `P_2`.
3. **Case C — Cross-Face Portal Route (`front <-> rear`):**
   * *Trigger:* One port on `front`, one on `rear`.
   * *Waypoints:* Exit `A_1` -> Front vertical duct to nearest valid **Portal** at height `Y_portal` -> Pass through portal along Z-axis from `Z_front` to `Z_rear` -> Rear vertical duct to `Y_2` -> Horizontal entry to `A_2` -> `P_2`.

### 5.3 Hexagonal Bundle Offset Packing
To prevent multiple cables in the same vertical or horizontal duct from occupying identical 3D coordinates, each duct maintains a spatial occupancy counter. Cable index `k` in `{0, 1, 2, ...}` passing through a duct segment receives a 2D cross-sectional offset `(delta_u_k, delta_v_k)` using concentric hexagonal rings with spacing `d_cable = 6.5 mm`.

### 5.4 Centripetal Catmull-Rom Spline & Commercial Length Mapping
1. Fit a centripetal Catmull-Rom spline (`alpha = 0.5`) through the offset waypoints with 32 subdivisions per segment.
2. Compute exact arc length `L_arc` by summing Euclidean distances across all spline segments.
3. Apply routing slack and connector termination allowance:
   `L_required_mm = (L_arc * 1.12) + 40 mm`
4. Map `L_required_mm` to the smallest commercial patch cable bin `>= L_required_mm` from:
   `[150, 250, 300, 500, 750, 1000, 1500, 2000, 3000]` (in `mm`).

---

## 6. MCP Server Interface Specification (`@rack-mcp/mcp-server`)

### 6.1 Exposed MCP Tools
1. `search_catalog`: Filter hardware blueprints by `query`, `form_factor` (`10inch` | `19inch` | `6inch` | `sub-module`), `category`, `max_depth_mm`, or `min_poe_budget_watts`.
2. `get_device_blueprint`: Retrieve full port coordinates, capabilities, and carrier slot layout for a specific `slug`.
3. `define_custom_blueprint`: Register a project-local hardware blueprint (`custom-catalog/*.yaml`) when the user owns unlisted hardware.
4. `init_rack`: Configure rack standard (`10inch` | `19inch` | `6inch`), `u_height`, `rail_depth_mm`, and `enclosure_type`.
5. `mount_equipment`: Mount a device onto a rack unit (`u_position`, `face`) OR into a carrier slot (`parent_carrier_id`, `slot_id`). Automatically runs the 5-stage validator and returns the updated state + diagnostics.
6. `modify_equipment`: Move, rename, or remove an existing `instance_id` (automatically recalculating all attached 3D cable paths).
7. `connect_cables`: Batch-connect one or more cables (`from`, `to`, `cable_type`, `color_hex`, `label`). Returns computed lengths (`exact_mm`, `recommended_commercial_mm`) and PoE/power validation status.
8. `disconnect_cables`: Remove cables by `cable_id` or device `instance_id`.
9. `validate_rack`: Run a full 5-stage audit and return the complete `ValidationResult` + ASCII elevation summary + power/PoE utilization table.
10. `export_deliverables`: Generate `elevation.svg`, `wiring-schematic.svg`, `BOM.md`, and `rack-scene.glb` in the active workspace.

### 6.2 Exposed MCP Resources
* `rack://current/summary`: Compact Markdown/ASCII representation of front/rear U allocation, slot occupancy, power draw, and active warnings.
* `rack://current/bom`: Live Bill of Materials (Hardware, 3D-Printed Parts with filament/insert specs, and grouped Cable Purchase List).

---

## 7. Rendering Pipelines (`@rack-mcp/exporters` & `@rack-mcp/web-viewer`)

### 7.1 Procedural 3D Web Viewer (`@rack-mcp/web-viewer`)
Built with React, Three.js, and `@react-three/fiber`:
* **Procedural Rack Frame:** Generates vertical EIA-310-D rails with square cage-nut cutouts, silk-screened `1U..NU` numbering, aluminum extrusion posts (`20x20mm` for 10-inch mini-racks), and optional smoked-glass front door.
* **Procedural Chassis & Instanced Ports:** Extrudes rounded metal/PETG chassis boxes from `geometry` specs and renders RJ45 jacks (with link/PoE LEDs), SFP+ cages, IEC power sockets, and Keystones using GPU `InstancedMesh` at exact blueprint coordinates.
* **Hybrid STL/GLB Loader:** If a blueprint defines `stl_mesh_path` (e.g., a 3D-printed 10-inch carrier), loads the `.stl` geometry while still rendering child devices and interactive ports at the mathematical slot coordinates.
* **Interactive Inspection Modes:**
  * **X-Ray Mode:** Sets rack frame and device bodies to `opacity: 0.15, depthWrite: false` while keeping ports, internal cables, and red collision bounding boxes at `opacity: 1.0`.
  * **Z-Axis Explode Slider:** Continuously separates Front Plane, Internal Devices, and Rear Plane along the Z-axis (`0 mm` to `300 mm` offset) to inspect dense mini-rack wiring.
  * **Layer & VLAN Filters:** Toggle visibility by cable category (`All`, `Power Only`, `Data Only`, `PoE Active`) or highlight a single device's trace.

### 7.2 2D Vector & Documentation Exporter (`@rack-mcp/exporters`)
* **Front & Rear Elevation + Side Depth Cutaway (`elevation.svg`):** True-to-scale vector drawing (`1 mm = 2 px`) showing Front View, Rear View, and a Side Cross-Section illustrating front vs. rear depth clearance and plug bend zones per U.
* **Orthogonal Port-to-Port Wiring Diagram (`wiring-schematic.svg`):** Clean logical block schematic separating Power Distribution (UPS -> PDU -> Devices) and Network Topology with color-coded orthogonal lines and cable length badges.
* **Build & Buy Sheet (`BOM.md`):**
  1. Commercial Hardware Table.
  2. 3D Printing Queue (STL files, quantity, PETG/ABS material recommendation, required M3 heat-set inserts and screws).
  3. Cable Shopping List (aggregated by type, color, and commercial length bin).
  4. Step-by-Step Patching Checklist (`[ ] Cable #01...`).