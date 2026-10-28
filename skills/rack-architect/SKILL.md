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
   Every rack project is persisted atomically in `rack.yaml` with a 50-step Undo/Redo stack (`undo_redo`).
3. **Closed-Loop Self-Correction (`error_count === 0`):**
   Never finish a rack design task while `validation.error_count > 0`. Read the structured `issues[].remediation_suggestions` returned by every tool call and apply fixes autonomously until the rack achieves **`VALID (0 Errors)`**.

---

## 2. Step-by-Step Autonomous Rack Planning Workflow

Whenever the user asks you to design, modify, or audit a rack, execute these **6 phases** in order:

### Phase 1: Hardware Discovery & Sub-U Carrier Planning
1. Call `search_catalog` (filtering by `form_factor: "10inch" | "19inch" | "6inch"`, `category`, or `query`) to inspect available hardware blueprints.
2. **Crucial Rule for Non-Rackmount Devices (Mini-PCs, Compact Gateways, Pi Blades, JetKVM):**
   Devices with `mount_type: "sub-module"` **cannot** be mounted directly onto rack rails (`u_position`). You must:
   - First mount a **`modular-carrier`** onto a rack unit (`u_position`), e.g.:
     - `3dprint-10inch-lenovo-tiny-plus-2keystone` (accepts 1× `mini-pc-1liter` + 2× `standard-keystone`)
     - `3dprint-10inch-ucg-ultra-plus-3keystone` (accepts 1× `unifi-ucg-ultra-bay` + 3× `standard-keystone`)
     - `3dprint-10inch-dual-pi5-jetkvm` (accepts 2× `pi5-poe-blade` + 1× `jetkvm-bay`)
     - `3dprint-19inch-trinity-lenovo-tiny-3bay` (accepts 3× `mini-pc-1liter` in a 19-inch 1U bay)
   - Then mount the child `sub-module` into that carrier using `parent_carrier_id` and `slot_id`.
3. If the user owns hardware that is not among the 20 built-in blueprints, call `define_custom_blueprint` with exact millimeter dimensions (`width_mm`, `height_mm`, `depth_mm`), weight (`weight_grams`), power draw (`max_system_watts`), and `ports` before mounting it.

### Phase 2: Rack Initialization & Mechanical Layout Strategy (`init_rack`)
1. Call `init_rack` with the target `standard` (`"10inch"`, `"19inch"`, or `"6inch"`), `u_height`, `rail_depth_mm`, and `enclosure_type` (`"open-frame"`, `"closed-glass-front"`, or `"closed-vented"`).
2. Plan the vertical `U` allocation from bottom (`U1`) to top (`U_max`) following mechanical, thermal, and cabling best practices:
   - **Bottom (`U1`–`U2`): Heavy Power Infrastructure (`ups`, `pdu`).**
     Always mount the heaviest UPS (`cyberpower-or600erm1u` or `apc-smt1500rmi2u`) at `U1` to keep the vertical Center of Gravity below 50% (`CoG < 50%`) and prevent `HIGH_CENTER_OF_GRAVITY` warnings.
   - **Rear Rails (`face: "rear"`): PDU & External Power Bricks.**
     Mount rear PDUs (`digitus-dn-95418-10inch-pdu`) or power shelves on the `rear` face of a lower `U` slot (`U1` or `U2`) where the front device is shallow, leaving $\ge 55\text{ mm}$ for Schuko plugs (or $\ge 28\text{ mm}$ for right-angled Schuko plugs).
   - **Middle (`U3`–`U5`): Compute Nodes, Modular 3D-Printed Carriers & Storage.**
     Place 3D-printed carriers holding Mini-PCs (`lenovo-thinkcentre-m920q-tiny`, `dell-optiplex-7010-micro`, `hp-elitedesk-800-g6-mini`) and gateways (`ubiquiti-ucg-max`).
   - **Thermal Separation Rule:**
     Never stack two high-wattage (`> 12 W`) `passive-convection` devices directly on consecutive `U` slots (`U_n` and `U_{n+1}` on the same face) — separate them with an active-cooled device or a `1U` cable management brush panel to avoid `THERMAL_HOTSPOT_STACKING`.
   - **Cable Pass-Through Portal (`U5` or `U6`):**
     Whenever any cable needs to run between a `front`-mounted device and a `rear`-mounted device (e.g. front UPS/Device to rear PDU, or rear Mini-PC NIC to front Keystone coupler), mount a **`generic-10inch-brush-panel-1u`** (or `generic-19inch-brush-panel-1u`) so the 3D spline router has a valid front-to-rear portal (`MISSING_CABLE_PORTAL` prevention).
   - **Top (`U7`–`U_max`): Patch Panels & Core Switches.**
     Mount keystone patch panels (`deskpi-rackmate-12port-patch-1u`) and switches (`ubiquiti-usw-flex-2-5g-8-poe`, `mikrotik-rb5009upr-s-in`, `ubiquiti-usw-pro-max-16-poe`) near the top for clean `direct-vertical-patch` runs.

### Phase 3: Mounting Equipment & Sub-Modules (`mount_equipment`)
1. Mount all rack-level devices first (`u_position`, `face: "front" | "rear"`).
2. Call `get_device_blueprint` on each mounted carrier to verify its exact `slots[].slot_id` and `ports[].port_id` names.
3. Mount all `sub-module` devices into their carrier slots (`parent_carrier_id`, `slot_id`), including `generic-keystone-rj45-cat6a` couplers into any `"standard-keystone"` slots you plan to wire.

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

## 3. Built-In Hardware Catalog Quick Reference (20 Blueprints)

| Blueprint Slug | Form Factor / Mount | Category | U / Size (`W×H×D mm`) | Key Ports & Carrier Slots |
| :--- | :--- | :--- | :--- | :--- |
| `ubiquiti-usw-flex-2-5g-8-poe` | `rackmount-10` | `switch` | `1U` (`212.9×32.5×99.4`) | `eth1`..`eth8` (2.5G PoE+ PSE, `196W`), `eth9_uplink` (10G), `dc_in` |
| `mikrotik-rb5009upr-s-in` | `rackmount-10` | `router` | `1U` (`220×44×125`) | `eth1` (2.5G), `eth2`..`eth8` (1G PoE-out, `130W`), `sfp_plus1` (10G), `dc_in` |
| `deskpi-rackmate-12port-patch-1u` | `rackmount-10` | `patch-panel` | `1U` (`254×43.65×32`) | `p1_front`..`p12_front`, `p1_rear`..`p12_rear` |
| `digitus-dn-95418-10inch-pdu` | `rackmount-10` | `pdu` | `1U` (`254×44×45`) | `outlet1`..`outlet4` (`schuko-cee7`, `3680W`), `mains_in` |
| `cyberpower-or600erm1u` | `rackmount-10` | `ups` | `1U` (`254×44×165`) | `iec_out1`..`iec_out4` (`iec-c13`, `360W`), `iec_in` |
| `generic-10inch-brush-panel-1u` | `rackmount-10` | `brush-panel` | `1U` (`254×44×18`) | Front-to-rear cable pass-through portal (`provides_cable_portal: true`) |
| `generic-10inch-blank-panel-1u` | `rackmount-10` | `blank-panel` | `1U` (`254×44×12`) | Solid airflow blanking panel |
| `generic-10inch-cantilever-shelf-1u` | `rackmount-10` | `shelf` | `1U` (`254×44×180`) | Vented 1U cantilever shelf (`shelf-bay`) |
| `3dprint-10inch-lenovo-tiny-plus-2keystone` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×185`) | Slots: `left-mini-pc-bay` (`mini-pc-1liter`), `keystone-1`, `keystone-2` |
| `3dprint-10inch-ucg-ultra-plus-3keystone` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×140`) | Slots: `left-gateway-bay` (`unifi-ucg-ultra-bay`), `keystone-1`..`keystone-3` |
| `3dprint-10inch-dual-pi5-jetkvm` | `rackmount-10` | `modular-carrier` | `1U` (`254×44×120`) | Slots: `pi-slot-1`, `pi-slot-2` (`pi5-poe-blade`), `kvm-slot-3` (`jetkvm-bay`) |
| `lenovo-thinkcentre-m920q-tiny` | `sub-module` | `compute-node` | `179×34.5×182.9` | Compat: `mini-pc-1liter` · Ports: `eth0` (rear), `usb_front_1`, `pwr_in` |
| `dell-optiplex-7010-micro` | `sub-module` | `compute-node` | `178×36×182` | Compat: `mini-pc-1liter` · Ports: `eth0` (rear), `pwr_in` (`dc-barrel`) |
| `hp-elitedesk-800-g6-mini` | `sub-module` | `compute-node` | `177×34.2×175` | Compat: `mini-pc-1liter` · Ports: `eth0` (rear), `pwr_in` (`dc-barrel`) |
| `ubiquiti-ucg-max` | `sub-module` | `gateway` | `141.8×30×127.6` | Compat: `unifi-ucg-ultra-bay` · Ports: `wan1`, `lan1`..`lan4` (2.5G), `usb_c_pwr` |
| `raspberry-pi-5-poe-blade` | `sub-module` | `sbc` | `42×38×92` | Compat: `pi5-poe-blade` · Ports: `eth0` (PoE-in PD `12W`) |
| `jetkvm` | `sub-module` | `kvm` | `43×36×60` | Compat: `jetkvm-bay` · Ports: `eth0` (RJ45), `usb_c_pwr` (`4.5W`) |
| `generic-keystone-rj45-cat6a` | `sub-module` | `keystone` | `16.5×19.5×30` | Compat: `standard-keystone` · Ports: `front_rj45` (front), `rear_punchdown` (rear) |
| `ubiquiti-usw-pro-max-16-poe` | `rackmount-19` | `switch` | `1U` (`442.4×43.7×325`) | `eth1`..`eth12` (1G PoE+), `eth13`..`eth16` (2.5G PoE++, `180W`), `sfp1`..`sfp2`, `iec_in` |
| `apc-smt1500rmi2u` | `rackmount-19` | `ups` | `2U` (`432×86×477`) | `iec_out1`..`iec_out4` (`1000W`), `iec_in` |
| `3dprint-19inch-trinity-lenovo-tiny-3bay` | `rackmount-19` | `modular-carrier` | `1U` (`482.6×44×185`) | Slots: `bay-1`, `bay-2`, `bay-3` (`mini-pc-1liter`), `keystone-1`..`keystone-4` |
| `generic-19inch-brush-panel-1u` | `rackmount-19` | `brush-panel` | `1U` (`482.6×44×18`) | 19-inch front-to-rear cable pass-through portal |
