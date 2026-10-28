---
name: rack-architect
description: >-
  Autonomous "Rack-as-Code" engineering workflow for planning, wiring, validating,
  and exporting 19-inch enterprise racks, 10-inch mini-racks (DeskPi RackMate,
  Digitus SOHO), and 6-inch micro-homelabs using RackArchitect MCP (rack_architect_mcp).
  Use this skill whenever the user wants to plan a server rack or homelab, mount
  switches/UPS/mini-PCs, check physical depth collisions or PoE budgets, route
  power/network cables, fix rack validation errors, or generate 2D CAD SVGs,
  Markdown BOMs, 3D GLB models, and 3D-printable OpenSCAD (.scad) / watertight STL (.stl)
  modular rack carriers.
---

# RackArchitect MCP — Autonomous Rack Engineering Skill

This skill equips you with the complete engineering runbook to design, validate, self-correct, and export physically buildable **19-inch**, **10-inch**, and **6-inch** server racks using the **`rack_architect_mcp`** MCP server (or CLI).

---

## 1. The Three Non-Negotiable Engineering Laws

1. **Never Calculate Geometry in Your Own Context Window:**
   Never guess millimeter coordinates, cable lengths, or whether a front switch collides with a rear PDU plug. Always execute mutations via the MCP tools (`mount_equipment`, `connect_cables`, `modify_equipment`) and let `@rack-mcp/core-domain` compute exact 3D Axis-Aligned Bounding Boxes (`1 U = 44.45 mm`), dynamic plug clearance ($\Delta Z_{\text{plug}}$), and clamped 3D Catmull-Rom cable splines.
2. **Single Source of Truth (`rack.yaml`):**
   Every rack project is persisted atomically in `rack.yaml` with a 50-step Undo/Redo stack (`undo_redo`) and live WebSocket / file-watcher synchronization to the local Web Viewer (`http://127.0.0.1:3100`).
3. **Closed-Loop Self-Correction (`error_count === 0`):**
   Never finish a rack design task while `validation.error_count > 0`. Read the structured `issues[].remediation_suggestions` returned by every tool call and apply fixes autonomously until the rack achieves **`VALID (0 Errors)`**.

### Connecting to the Local MCP Workbench (`http://127.0.0.1:3100`)
- If `rack_architect_mcp` tools (`init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `validate_rack`, `export_deliverables`, `undo_redo`) are registered natively in your MCP tool list, call them directly.
- If `rack_architect_mcp` is not registered as a native MCP server in your session, you can execute all 11 MCP tools directly against the running local Sidecar WebSocket at `ws://127.0.0.1:3100/ws` (sending `{ "type": "EXECUTE_TOOL", "tool": "<tool_name>", "args": { ... } }` and reading `{ "type": "COMMAND_RESULT", "tool": "<tool_name>", "result": { ... } }`) or via `node ./packages/cli/dist/bin.js serve`. Every tool call automatically streams live into the user's open browser workbench at `http://127.0.0.1:3100`.

---

## 2. Step-by-Step Autonomous Rack Planning Workflow

Whenever the user asks you to design, modify, or audit a rack, execute these **6 phases** in order:

### Phase 1: Hardware Discovery & Sub-U Carrier Planning
1. Call `search_catalog` (filtering by `form_factor: "10inch" | "19inch" | "6inch"`, `category`, or `query`) to inspect available hardware blueprints.
2. **Crucial Rule for Non-Rackmount Devices (Mini-PCs, Compact Gateways, Pi Blades, JetKVM):**
   Devices with `mount_type: "sub-module"` **cannot** be mounted directly onto rack rails (`u_position`). You must:
   - First mount a **`modular-carrier`** onto a rack unit (`u_position`), e.g.:
     - `3dprint-10inch-lenovo-tiny-plus-2keystone` (accepts 1× `mini-pc-1liter` in `left-mini-pc-bay` + 2× `standard-keystone` in `keystone-1`..`2`)
     - `3dprint-10inch-ucg-ultra-plus-3keystone` (accepts 1× `unifi-compact-gateway` in `gateway-bay` + 3× `standard-keystone` in `keystone-1`..`3`)
     - `3dprint-10inch-rpi5-jetkvm-2keystone` (accepts 1× `sbc-rpi5` in `rpi-bay-1` + 1× `jetkvm-bay` in `jetkvm-bay-1` + 2× `standard-keystone` in `keystone-1`..`2`)
     - `3dprint-10inch-dual-rpi5-plus-4keystone` (accepts 2× `sbc-rpi5` in `rpi-bay-1`..`2` + 4× `standard-keystone` in `keystone-1`..`4`)
     - `3dprint-19inch-triple-mini-pc-carrier` (accepts 3× `mini-pc-1liter` up to `145 mm` width in `mini-pc-bay-1`..`3`)
   - Then mount the child `sub-module` into that carrier using `parent_carrier_id` and `slot_id`.
3. If the user owns hardware that is not among the 30 built-in blueprints, call `define_custom_blueprint` with exact millimeter dimensions (`width_mm`, `height_mm`, `depth_mm`), weight (`weight_grams`), power draw (`max_system_watts`), and `ports` before mounting it.

### Phase 2: Rack Initialization & Mechanical Layout Strategy (`init_rack`)
1. Call `init_rack` with the target `standard` (`"10inch"`, `"19inch"`, or `"6inch"`), `u_height`, `rail_depth_mm`, and `enclosure_type` (`"open-frame"`, `"closed-glass-front"`, or `"closed-vented"`).
2. Plan the vertical `U` allocation from bottom (`U1`) to top (`U_max`) following mechanical, thermal, and cabling best practices:
   - **Bottom (`U1`–`U2`): Heavy Power Infrastructure (`ups`, `pdu`).**
     Always mount the heaviest UPS (`cyberpower-10inch-ups-1u` or `apc-smart-ups-1500-2u`) at `U1` to keep the vertical Center of Gravity below 50% (`CoG < 50%`) and prevent `HIGH_CENTER_OF_GRAVITY` warnings.
   - **Rear Rails (`face: "rear"`): PDU & External Power Bricks.**
     Mount rear PDUs (`digitus-10inch-pdu-4way-schuko`) or power shelves on the `rear` face of a lower `U` slot (`U1` or `U2`) where the front device is shallow, leaving $\ge 55\text{ mm}$ for Schuko plugs (or $\ge 28\text{ mm}$ for right-angled Schuko plugs).
   - **Middle (`U3`–`U5`): Compute Nodes, Modular 3D-Printed Carriers & Storage (`nas`).**
     Place 3D-printed carriers holding Mini-PCs (`lenovo-thinkcentre-m920q`, `dell-optiplex-7010-micro`), gateways (`ubiquiti-ucg-max`), IP-KVMs (`jetkvm-smart-ip-kvm`), or 2U NAS systems (`synology-ds224-plus-10inch-2u`, `ubiquiti-unas-pro-2u`).
   - **Thermal Separation Rule:**
     Never stack two high-wattage (`> 12 W`) `passive-convection` devices directly on consecutive `U` slots (`U_n` and `U_{n+1}` on the same face) — separate them with an active-cooled device or a `1U` cable management brush panel to avoid `THERMAL_HOTSPOT_STACKING`.
   - **Cable Pass-Through Portal (`U5` or `U6`):**
     Whenever any cable needs to run between a `front`-mounted device and a `rear`-mounted device (e.g. front UPS/Device to rear PDU, or rear Mini-PC NIC to front Keystone coupler), mount a **`generic-10inch-brush-panel-1u`** (or `generic-19inch-brush-panel-1u`) so the 3D spline router has a valid front-to-rear portal (`MISSING_CABLE_PORTAL` prevention).
   - **Top (`U7`–`U_max`): Patch Panels & Core Switches.**
     Mount keystone patch panels (`deskpi-10inch-patch-panel-12port`, `generic-19inch-patch-panel-24port-cat6a`) and switches (`ubiquiti-usw-flex-2-5g-8-poe`, `mikrotik-crs310-8g-plus-2s-plus-in`, `mikrotik-rb5009upr-s-in`, `tp-link-tl-sg2210mp`, `ubiquiti-usw-pro-max-24-poe`, `ubiquiti-usw-aggregation`) near the top for clean `direct-vertical-patch` runs.

### Phase 3: Mounting Equipment & Sub-Modules (`mount_equipment`)
1. Mount all rack-level devices first (`u_position`, `face: "front" | "rear"`).
2. Call `get_device_blueprint` on each mounted carrier to verify its exact `slots[].slot_id` and `ports[].port_id` names.
3. Mount all `sub-module` devices into their carrier slots (`parent_carrier_id`, `slot_id`), including `keystone-rj45-cat6a-coupler` couplers into any `"standard-keystone"` slots you plan to wire.

### Phase 4: Power & Network Cable Routing (`connect_cables`)
1. Call `get_device_blueprint` for every device you are wiring so you never guess a `port_id` (e.g. `eth1`..`eth8`, `wan1`, `lan1`..`lan4`, `sfp1`, `outlet1`..`outlet4`, `iec_out1`..`iec_out4`, `pwr_in`, `front_rj45`, `rear_punchdown`).
2. **Choose the Right Cable & Plug Geometry (`cable_type`):**
   - **Tight Front Glass Door (`closed-glass-front` with `45–50 mm` clearance) or Tight Rear Depth:**
     Use **`-angled`** cable variants (`cat6a-angled`, `sfp-plus-dac-angled`, `power-schuko-c13-angled`, `power-c13-c14-angled`, `power-dc-5525-angled`, `power-usb-c-angled`) to cut plug protrusion $\Delta Z_{\text{plug}}$ by ~50% (`55 mm` $\rightarrow$ `28 mm` for Schuko, `35 mm` $\rightarrow$ `18 mm` for RJ45) and prevent `PLUG_CLEARANCE_COLLISION` or `FRONT_DOOR_COLLISION`.
   - **Multi-Gigabit Links ($\ge 2.5\text{ GbE}$ / $10\text{ GbE}$):**
     Always use `cat6a` / `cat6a-angled` (or `sfp-plus-dac` / `fiber-lc-duplex` for SFP+). Never use `cat5e` on $2.5\text{ GbE}$ or $10\text{ GbE}$ ports (`SPEED_MISMATCH` prevention).
   - **Network Metadata for CAD Schematics:**
     Provide `label`, `vlan_id` (e.g. `10`, `20`, `99`), and `ip_cidr` (e.g. `"10.10.20.1/24"`) on data cables so `wiring-schematic.svg` automatically renders VLAN and subnet badges.
   - **Power Completeness:**
     Connect every non-passive device's `power-input` port (or `poe-in` port via a PoE-capable switch port) to a `power-outlet` on a PDU or UPS so zero `MISSING_POWER_INPUT` or `EXTERNAL_PSU_UNPLUGGED` warnings remain.

### Phase 5: 5-Stage Validation & Autonomous Remediation (`validate_rack`)
Call `validate_rack` and inspect `validation.issues`. Use this lookup table to resolve any diagnostic issue immediately:

| Diagnostic Code | Stage | Immediate Autonomous Fix |
| :--- | :---: | :--- |
| `CHASSIS_COLLISION` | 2 | Call `modify_equipment({ action: "move" })` to relocate one of the colliding devices to a free `u_position` or opposite `face`. |
| `PLUG_CLEARANCE_COLLISION` | 2 | Re-run `connect_cables` with the `-angled` variant of the colliding cable (e.g. `power-schuko-c13-angled` or `cat6a-angled`), or move the rear device to another `U`. |
| `FRONT_DOOR_COLLISION` | 2 | Switch front patch/DAC cables on that device to `cat6a-angled` / `sfp-plus-dac-angled`, or change rack enclosure to `open-frame`. |
| `REAR_CLEARANCE_VIOLATION` | 2 | Use `-angled` rear power/data cables or increase `rear_clearance_mm` via `init_rack`. |
| `SLOT_INCOMPATIBLE` / `SLOT_DIMENSION_OVERFLOW` | 1 | Mount a carrier whose `slots[].accepted_slot_type` matches the sub-module's `slot_compatibility`. |
| `POE_BUDGET_EXCEEDED` | 3 | Offload PoE PD devices to a higher-budget PoE switch (`ubiquiti-usw-flex-2-5g-8-poe` with external PSU = `196 W`, or `ubiquiti-usw-pro-max-16-poe` = `180 W`) or power the device via its dedicated DC/AC input. |
| `MISSING_POWER_INPUT` / `EXTERNAL_PSU_UNPLUGGED` | 3 | Connect a power cable (`power-c13-c14`, `power-schuko-c13`, `power-dc-5525`, or `power-usb-c`) from a PDU/UPS outlet (or PoE switch port) to the device's power input port. |
| `MISSING_CABLE_PORTAL` | 4 | Mount `generic-10inch-brush-panel-1u` (or `generic-19inch-brush-panel-1u`) on an open central `U` slot so front-to-rear cables have a pass-through portal. |
| `SPEED_MISMATCH` | 4 | Upgrade the cable from `cat5e` to `cat6a` or `cat6a-angled` via `connect_cables`. |
| `THERMAL_HOTSPOT_STACKING` | 5 | Separate the two stacked fanless devices by moving a brush panel or active-cooled device between them (`modify_equipment`). |
| `THERMAL_AIRFLOW_CONFLICT` | 5 | Avoid mixing `front-to-rear` and `rear-to-front` active fans on the same or adjacent `U` slots. |
| `HIGH_CENTER_OF_GRAVITY` | 5 | Move heavy UPS/battery units down to `U1`/`U2` and lighter patch panels/switches up to the top `U` slots. |

### Phase 6: CAD, BOM & 3D-Print Deliverable Export (`export_deliverables`)
Once `validate_rack` reports **`VALID (0 Errors)`**, call `export_deliverables` with:
```json
{
  "formats": [
    "elevation-svg",
    "wiring-svg",
    "bom-md",
    "scene-glb",
    "carrier-scad",
    "carrier-stl"
  ]
}
```
This deterministically writes:
- `elevation.svg` — Dual-Row Front, Mirrored Rear & Right-Hand Z-Depth Side Cutaway CAD blueprint
- `wiring-schematic.svg` — 5-Layer Pin-to-Pin Logical Wiring & Power Schematic with VLAN/CIDR badges
- `BOM.md` — Commercial Hardware BOM, 3D-Print Filament Queue (`g`), Cable Length Schedule (`mm`), and Fastener Checklist
- `rack-scene.glb` — Binary glTF 2.0 3D scene in meter scale (`1.0 = 1000 mm`)
- `<carrier-slug>.scad` & `<carrier-slug>.stl` — Parametric OpenSCAD scripts and **100% watertight 2-manifold `.stl` files** (with EIA-310 M6 mounting slots, `+0.35 mm` print tolerances, retention rails, and floor ventilation cutouts) ready for Bambu Studio, OrcaSlicer, or PrusaSlicer.

---

## 3. Built-In Hardware Catalog Quick Reference (30 Blueprints)

| Blueprint Slug | Form Factor / Mount | Category | U / Size (`W×H×D mm`) | Key Ports & Carrier Slots |
| :--- | :--- | :--- | :--- | :--- |
| `ubiquiti-usw-flex-2-5g-8-poe` | `rackmount-10` | `switch` | `1U` (`212.9×32.5×99.4`) | `eth1`..`eth8` (2.5G PoE+ PSE, `196W`), `sfp1` (10G SFP+), `eth9` (10G), `pwr_in` |
| `ubiquiti-usw-lite-8-poe` | `rackmount-10` | `switch` | `1U` (`200×31×99.6`) | `eth1`..`eth4` (1G PoE+ PSE, `52W`), `eth5`..`eth8` (1G), `dc_in` |
| `mikrotik-crs310-8g-plus-2s-plus-in` | `rackmount-10` | `switch` | `1U` (`200×44×206`) | `eth1`..`eth8` (2.5G RJ45), `sfp_plus1`..`sfp_plus2` (10G SFP+), `dc_in` |
| `mikrotik-rb5009upr-s-in` | `rackmount-10` | `router` | `1U` (`220×44×125`) | `eth1` (2.5G PoE), `eth2`..`eth8` (1G PoE-out, `130W`), `sfp_plus1` (10G), `pwr_in` |
| `tp-link-tl-sg2210mp` | `rackmount-10` | `switch` | `1U` (`220×44×180`) | `eth1`..`eth8` (1G PoE+ PSE, `150W`), `sfp1`..`sfp2` (SFP), `ac_in` |
| `synology-ds224-plus-10inch-2u` | `rackmount-10` | `nas` | `2U` (`222×88×232.5`) | `lan1`, `lan2` (1G RJ45), `usb_front_1`, `usb_rear_1`, `dc_in` (`18W` active fan) |
| `deskpi-10inch-patch-panel-12port` | `rackmount-10` | `patch-panel` | `1U` (`222×44×30`) | `p1`..`p12` (Cat6A passthrough couplers) |
| `digitus-10inch-pdu-4way-schuko` | `rackmount-10` | `pdu` | `1U` (`220×44×55`) | `outlet1`..`outlet4` (`schuko-cee7`, `3600W`), `mains_in` |
| `cyberpower-10inch-ups-1u` | `rackmount-10` | `ups` | `1U` (`220×44×185`) | `iec_out1`..`iec_out4` (`iec-c13`, `300W`), `ac_in` (`iec-c14`), OLED display |
| `generic-10inch-brush-panel-1u` | `rackmount-10` | `brush-panel` | `1U` (`222×44×15`) | Front-to-rear cable pass-through portal (`has_cable_pass_through: true`) |
| `generic-10inch-blank-panel-1u` | `rackmount-10` | `blank-panel` | `1U` (`222×44×10`) | Solid steel airflow blanking panel |
| `generic-10inch-shelf-1u` | `rackmount-10` | `shelf` | `1U` (`254×44×180`) | Vented 1U cantilever shelf (`shelf-tray-1` accepts `open-shelf-area`) |
| `3dprint-10inch-lenovo-tiny-plus-2keystone` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×185`) | Slots: `left-mini-pc-bay` (`mini-pc-1liter`), `keystone-1`, `keystone-2` |
| `3dprint-10inch-ucg-ultra-plus-3keystone` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×140`) | Slots: `gateway-bay` (`unifi-compact-gateway`), `keystone-1`..`keystone-3` |
| `3dprint-10inch-rpi5-jetkvm-2keystone` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×110`) | Slots: `rpi-bay-1` (`sbc-rpi5`), `jetkvm-bay-1` (`jetkvm-bay`), `keystone-1`..`2` |
| `3dprint-10inch-dual-rpi5-plus-4keystone` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×105`) | Slots: `rpi-bay-1`, `rpi-bay-2` (`sbc-rpi5`), `keystone-1`..`keystone-4` |
| `3dprint-19inch-triple-mini-pc-carrier` | `rackmount-19` | `modular-carrier` | `1U` (`482.6×44×185`) | Slots: `mini-pc-bay-1`..`mini-pc-bay-3` (`mini-pc-1liter`, max width `145 mm`) |
| `lenovo-thinkcentre-m920q` | `sub-module` | `mini-pc` | `179×34.5×182` | Compat: `mini-pc-1liter` · Ports: `eth0` (1G), `eth1`..`eth2` (2.5G), `dc_in` (`dc-5525`) |
| `dell-optiplex-7010-micro` | `sub-module` | `mini-pc` | `178×36×182` | Compat: `mini-pc-1liter` · Ports: `eth0` (1G), `eth1` (2.5G), `dc_in` (`dc-5525`) |
| `ubiquiti-ucg-max` | `sub-module` | `router` | `141.8×30×127.6` | Compat: `unifi-compact-gateway` · Ports: `lan1`..`lan4` (2.5G), `wan` (2.5G), `usbc_pwr` |
| `jetkvm-smart-ip-kvm` | `sub-module` | `compute-node` | `43×36×60` | Compat: `jetkvm-bay` · Ports: `eth0` (RJ45), `usb_c_pwr` (`4.5W`), OLED touchscreen |
| `raspberry-pi-5-poe-hat` | `sub-module` | `sbc` | `62×32×92` | Compat: `sbc-rpi5` · Ports: `eth0` (PoE-in PD `12W`), `usbc_pwr` |
| `keystone-rj45-cat6a-coupler` | `sub-module` | `keystone-module` | `16×20×30` | Compat: `standard-keystone` · Port: `coupler` (Cat6A passthrough coupler) |
| `ubiquiti-udm-pro` | `rackmount-19` | `router` | `1U` (`442.4×43.7×285.6`) | `eth1`..`eth8` (1G), `wan1` (2.5G), `sfp_wan2`, `sfp_lan11` (10G SFP+), `ac_in` |
| `ubiquiti-usw-pro-max-24-poe` | `rackmount-19` | `switch` | `1U` (`442.4×43.7×325`) | `eth1`..`eth24` (PoE++/PoE+ PSE, `400W`), `sfp1`..`sfp2` (10G SFP+), `ac_in` |
| `ubiquiti-usw-aggregation` | `rackmount-19` | `switch` | `1U` (`442.4×43.7×120`) | `sfp1`..`sfp8` (8× 10G SFP+ L2 Aggregation), `ac_in`, OLED |
| `ubiquiti-unas-pro-2u` | `rackmount-19` | `nas` | `2U` (`442.4×87.4×325.1`) | `eth1` (1G RJ45), `sfp_plus1` (10G SFP+), `ac_in` (`160W`), OLED touchscreen |
| `generic-19inch-patch-panel-24port-cat6a` | `rackmount-19` | `patch-panel` | `1U` (`482.6×44×35`) | `p1`..`p24` (24× Cat6A shielded passthrough couplers) |
| `generic-19inch-brush-panel-1u` | `rackmount-19` | `brush-panel` | `1U` (`482.6×44×18`) | 19-inch front-to-rear cable pass-through portal (`has_cable_pass_through: true`) |
| `apc-smart-ups-1500-2u` | `rackmount-19` | `ups` | `2U` (`432×86×477`) | `iec_out1`..`iec_out8` (`iec-c13`, `1000W`), `ac_in`, `smartconnect_eth`, OLED |
