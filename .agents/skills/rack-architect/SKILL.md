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

This skill equips you with the complete engineering runbook, real-world ANSI/TIA-942 & Homelab wiring schematics, and use-case reference architectures to design, validate, self-correct, and export physically buildable **19-inch**, **10-inch**, and **6-inch** server racks using the **`rack_architect_mcp`** MCP server (or CLI).

---

## 1. The Three Non-Negotiable Engineering Laws

1. **Never Calculate Geometry in Your Own Context Window:**
   Never guess millimeter coordinates, cable lengths, or whether a front switch collides with a rear PDU plug. Always execute mutations via the MCP tools (`mount_equipment`, `connect_cables`, `modify_equipment`, `plan_external_endpoints`) and let `@rack-mcp/core-domain` compute exact 3D Axis-Aligned Bounding Boxes (`1 U = 44.45 mm`), dynamic plug clearance ($\Delta Z_{\text{plug}}$), and clamped 3D Catmull-Rom cable splines.
2. **Single Source of Truth (`rack.yaml`):**
   Every rack project is persisted atomically in `rack.yaml` with a 50-step Undo/Redo stack (`undo_redo`) and live WebSocket / file-watcher synchronization to the local Web Viewer (`http://127.0.0.1:3100`).
3. **Closed-Loop Self-Correction (`error_count === 0`):**
   Never finish a rack design task while `validation.error_count > 0`. Read the structured `issues[].remediation_suggestions` returned by every tool call and apply fixes autonomously until the rack achieves **`VALID (0 Errors)`**.

### Connecting to the Local MCP Workbench (`http://127.0.0.1:3100`)
- If `rack_architect_mcp` tools (`init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `plan_external_endpoints`, `validate_rack`, `export_deliverables`, `undo_redo`) are registered natively in your MCP tool list, call them directly.
- If `rack_architect_mcp` is not registered as a native MCP server in your session, you can execute all 12 MCP tools directly against the running local Sidecar WebSocket at `ws://127.0.0.1:3100/ws` (sending `{ "type": "COMMAND", "tool": "<tool_name>", "args": { ... } }` and reading `{ "type": "COMMAND_RESULT", "tool": "<tool_name>", "result": { ... } }`) or via `node ./packages/cli/dist/bin.js serve`. Every tool call automatically streams live into the user's open browser workbench at `http://127.0.0.1:3100`.

---

## 2. User Sovereignty vs. Consultative Architecture Mode ("Who Has the Wheel?")

Before placing a single device, determine which of the two collaboration modes applies to the user's prompt:

### Mode A: Explicit User Specification (User Always Has 100% Sovereignty)
- **Trigger:** The user already knows what hardware they own or want, specifies exact device models, or requests specific `U` positions / custom cabling.
- **Mandatory Behavior:**
  - **The user ALWAYS has the upper hand.** Never fight, lecture, or override the user's explicit hardware or layout choices just because a textbook schematic would do it differently.
  - Mount and wire the exact equipment in the exact order requested by the user.
  - Only intervene when `@rack-mcp/core-domain` flags a hard physical or electrical violation (`CHASSIS_COLLISION`, `PLUG_CLEARANCE_COLLISION`, `POE_BUDGET_EXCEEDED`, `SLOT_INCOMPATIBLE`), and apply the smallest remediation that preserves the user's intended layout.

### Mode B: Open / Goal-Driven Request (AI as Senior Infrastructure Architect)
- **Trigger:** The user has only a rough idea, room list, or use case (e.g., *"Ich brauche ein leises Homelab fürs Wohnzimmer"*, *"Plane mir ein 19-Zoll-Rack für 10 Kameras, 5 Access Points und 5 Räume"*, *"Ich möchte Proxmox und ein NAS aufbauen, weiß aber nicht welche Komponenten zusammenpassen"*).
- **Mandatory Behavior:**
  - **Never throw random catalog devices into the rack just to fill U-slots.** Every mounted device must have a clear, real-world purpose and be fully wired (both power and data).
  - Select the matching **Use-Case Reference Architecture (Archetypes 1–4 in Section 5)** and strictly apply the **Real-World Elevation, Port-Alignment & Wiring Schematics (Section 3 & Section 4)**.
  - Explain *what* each device does in plain, accessible language (especially for non-obvious model numbers like `USW-Flex-2.5G-8-PoE`, `UCG-Max`, or `CRS310`) and explicitly state which compact desktop devices require a **3D-printed 1U PETG carrier/adapter cradle** or **1U shelf**.

---

## 3. Real-World Rack Elevation, Physical Zoning & Wiring Schematics

Real-world data center (ANSI/TIA-942), prosumer (Ubiquiti UniFi Design Center), and mini-rack (DeskPi RackMate / Project Mini-Rack) installations follow strict physical laws for weight, heat, and cable geometry.

### 3.1 The 5-Zone Bottom-to-Top Elevation Blueprint

Always build racks from **bottom (`U1`) to top (`U_max`)** using these 5 functional zones:

```text
[ TOP OF RACK — Ceiling / Wall Conduit Entry (top-rear) ]
+-----------------------------------------------------------------------+
| ZONE 5 (Top: U_max & U_max-1) — PATCH PANEL & ACCESS / PoE SWITCH     |
|  • U_max     : Keystone Patch Panel (12-Port 10" or 24-Port 19")      |
|  • U_max - 1 : Main PoE+/PoE++ Switch directly below Patch Panel      |
|  --> Connected via 1:1 vertically aligned 0.15m Cat6A patch cords!    |
+-----------------------------------------------------------------------+
| ZONE 4 (Upper-Mid: U6–U10) — CORE ROUTING, FIREWALL & BRUSH PORTAL    |
|  • 10G Aggregation Switch (SFP+ DAC backbone to PoE Switch & NAS)     |
|  • Hardware Firewall / Gateway / NVR (FortiGate, UDM-Pro, RB5009)     |
|  • 1U Thermal / Expansion Buffer (leave 1U free in >=10U racks)       |
|  • Single Strategic 1U Brush Panel (front-to-rear cable portal)       |
+-----------------------------------------------------------------------+
| ZONE 3 (Lower-Mid: U3–U5) — COMPUTE NODES & HEAVY STORAGE (NAS)       |
|  • 1U 3D-Printed Modular Carriers (Mini-PCs, RPi5, JetKVM, Keystones) |
|  • 2U Spinning-Disk NAS (Synology DS224+, UniFi UNAS Pro 2U)          |
+-----------------------------------------------------------------------+
| ZONE 2 (Lower Rear: U1–U2 Rear) — PDU & EXTERNAL POWER BRICKS         |
|  • Rear-mounted Schuko/IEC PDU strip on shallow lower U-slot          |
|  • All AC/DC power cords routed up the Rear-Left (RL) vertical duct   |
+-----------------------------------------------------------------------+
| ZONE 1 (Bottom: U1–U2 Front) — UNINTERRUPTIBLE POWER SUPPLY (UPS)     |
|  • Heaviest battery unit (3–25 kg) at U1 to keep CoG < 50%            |
+-----------------------------------------------------------------------+
[ BOTTOM OF RACK — Floor / Desk Base ]
```

### 3.2 Six Golden Cabling & Mechanical Rules from Real-World Schematics

1. **The 1:1 Vertical Port Alignment Law (Zero Crossed Front Patch Cords):**
   - Always place the **Patch Panel (`U_max`) directly adjacent to the PoE/Access Switch (`U_max - 1`)** with zero U-slots between them.
   - Connect **Patch Panel Port `pN` (`face: "front"`) straight down to Switch Port `ethN` (`face: "front"`)** (`p1 -> eth1`, `p2 -> eth2`, ..., `p20 -> eth20`).
   - Why: Both our 12-port/24-port patch panels and single-row switches (`ubiquiti-usw-pro-max-24-poe`, `ubiquiti-usw-flex-2-5g-8-poe`) have horizontally aligned port pitches ($\Delta X \le 35\text{ mm}$). 1:1 alignment produces ultra-clean `0.15 m` vertical C-arches (`direct-vertical-patch`) and completely eliminates diagonal cable spaghetti across the switch face.
2. **Rear-to-Rear Internal Server Patching (Keep Rear NIC Cables in the Rear):**
   - Mini-PCs (`lenovo-thinkcentre-m920q`, `dell-optiplex-7010-micro`) and compact gateways (`ubiquiti-ucg-max`) have their RJ45 ports on the **rear** (`face: "rear"`).
   - **Best Practice:** Route their Ethernet cables **entirely in the rear** (`face: "rear"` $\rightarrow$ `face: "rear"`) up the Rear-Right (`RR`) data duct to free rear ports on the top Patch Panel (`p1..p6`, `face: "rear"`), and then connect short `0.15 m` front patch cords from `p1..p6` (`face: "front"`) straight down to `eth1..eth6` (`face: "front"`) on the Switch!
   - Alternative: If the 3D-printed carrier has built-in Keystone slots (`keystone-1..3`), mount `keystone-rj45-cat6a-coupler` modules into those slots, wire the Mini-PC rear port to the Keystone's `rear` face, and patch from the Keystone's `front` face.
3. **Brush Panels — "Less is More" (One Strategic Portal, Never Spammed):**
   - Never mount brush panels between every single device or at the very top above a patch panel.
   - Mount **one** `1U` Brush Panel (`generic-10inch-brush-panel-1u` or `generic-19inch-brush-panel-1u`) in the middle of the rack (`U5` or `U6`) between the lower Compute/Storage zone and the upper Network zone.
   - Use this single brush portal specifically for cables that *must* cross between front and rear and cannot pass through an RJ45 patch panel (e.g., a `10G SFP+ DAC` cable from a front `USW-Aggregation` port `sfp6` to a rear `UNAS-Pro-2U` port `sfp_plus1`).
4. **Shortest-Direct Monotonic Routing by Default vs. Optional Side-Duct Overrides (`routing_mode`):**
   - By default (`routing_mode: "shortest-direct"`), `@rack-mcp/core-domain` routes every cable along the **shortest collision-free monotonic orthogonal L-bend or 1-step path** between its two ports (`0` zig-zag detours to the far rack side walls and back, saving 25%–50% in cable length and BOM cost).
   - If the user explicitly requests routing a cable around the left or right vertical cable management channel (e.g., strict side-wall EMI separation or custom cable bundling), set `routing_mode: "left-duct"` (`FL`/`RL`) or `routing_mode: "right-duct"` (`FR`/`RR`) on that cable in `connect_cables`.
5. **Desktop Hardware vs. Native Rackmount Hardware (3D-Print Carrier Transparency):**
   - Sub-modules (`mount_type: "sub-module"`, such as `lenovo-thinkcentre-m920q`, `dell-optiplex-7010-micro`, `ubiquiti-ucg-max`, `raspberry-pi-5-poe-hat`, `jetkvm-smart-ip-kvm`) **must** be mounted inside a `modular-carrier` (`3dprint-*`).
   - Compact polycarbonate desktop switches (`ubiquiti-usw-flex-2-5g-8-poe`, `ubiquiti-usw-lite-8-poe`) have `ear_mount_style: "3d-printed-ears"` (no metal rack ears in the retail box). RackArchitect automatically generates a custom **3D-printable 10-inch 1U PETG Adapter Cradle** (`.scad` & `.stl`) for them — always mention this to the user so they know how the switch is physically held in the rack.
6. **External Building / Room Drops (`plan_external_endpoints` — Never Waste a Rack U-Slot!):**
   - Incoming house or office cables (PoE security cameras, Wi-Fi Access Points, wall RJ45 outlets for PCs, home-cinema projectors/Beamers, laptops, docking stations, ISP fiber ONT modems) enter from outside the rack (`top-rear` or `bottom-rear`) onto the **rear** of the Patch Panel.
   - Always call `plan_external_endpoints` to terminate them on the Patch Panel and auto-generate 1:1 aligned front patch cables to the switch.

---

## 4. Standard Logical Network Topology & VLAN Segmentation Blueprint

When designing a complete homelab or enterprise rack, structure the logical network and cable metadata (`vlan_id`, `ip_cidr`, `color_hex`, `label`) according to this proven segmentation architecture:

```text
          [ ISP Fiber ONT / Cable Modem (External WAN) ]
                                │
                  (Patch Panel Rear -> Front WAN)
                                ▼
        ┌───────────────────────────────────────────────┐
        │  Firewall / Security Gateway                  │
        │  (FortiGate 200F / UDM-Pro / UCG-Max / RB5009)│
        └───────────────────────────────────────────────┘
                                │
             (10G SFP+ DAC or 2.5G 802.1Q VLAN Trunk)
                                ▼
        ┌───────────────────────────────────────────────┐
        │  Core / Aggregation & PoE+ Access Switching   │
        │  (USW-Aggregation + USW-Pro-Max-24 / Flex-2.5G│
        └───────────────────────────────────────────────┘
          │              │              │              │
    (10G SFP+ DAC) (2.5G Trunk)   (PoE+/PoE++)   (1G/2.5G PoE+)
          ▼              ▼              ▼              ▼
   ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
   │ NAS / SAN  │ │ Proxmox VE │ │ Wi-Fi 7 APs│ │ IP Cameras │
   │ (VLAN 50)  │ │ Nodes 1..2 │ │ & Rooms    │ │ & IoT/Door │
   │ SMB / NFS  │ │ (VLAN 10)  │ │ (VLAN 10/20│ │ (VLAN 30/40│
   └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### Canonical VLAN, Subnet & Cable Color Matrix

| VLAN ID | Zone Name | Standard Subnet (`ip_cidr`) | Cable Color (`color_hex`) | Typical Connected Devices & Security Policy |
| :---: | :--- | :--- | :---: | :--- |
| **`1` / `99`** | **Management & Core Backbone** | `10.0.0.0/24` or `10.10.99.0/24` | `#A855F7` (Purple) / `#6366F1` (Indigo) | Core switch SFP+ DAC trunks, Proxmox management NICs, JetKVM IP-KVM, UPS management. |
| **`10`** | **Trusted LAN & Servers** | `10.10.0.0/24` | `#3B82F6` (Blue) / `#10B981` (Emerald) | Office desktop PCs, workstations, docking stations, laptops, Proxmox VM trunks. |
| **`20`** | **Wi-Fi Access Points** | `10.20.0.0/24` | `#06B6D4` (Cyan) / `#0EA5E9` (Sky) | PoE+/PoE++ Wi-Fi 7 Access Points (`15–22 W` PoE draw per AP, `2.5 GbE` uplink). |
| **`30`** | **Security Cameras (No-WAN)** | `10.30.0.0/24` | `#F59E0B` (Amber) | PoE+ 4K IP Cameras (`8–12 W` PoE draw) and Protect NVR / Frigate stream trunk. Blocked from Internet. |
| **`40`** | **IoT, Smart-Home & Door Access** | `10.40.0.0/24` | `#EC4899` (Pink) / `#14B8A6` (Teal) | PoE door access readers (`12–15 W`), Home Assistant Raspberry Pi 5, smart-home bridges, 4K Beamer. |
| **`50`** | **Storage, NAS & Ceph Cluster** | `10.50.0.0/24` | `#6366F1` (Indigo) / `#14B8A6` (Teal) | 10G SFP+ NAS storage trunk (`UNAS-Pro-2U`) and direct rear-to-rear `2.5G` Proxmox Ceph replication links. |
| **`901` / `902`** | **External ISP WAN Uplinks** | `198.51.100.2/30` | `#EF4444` (Red) / `#F97316` (Orange) | Primary Fiber ONT (`WAN1`) and Backup 5G/Cable Modem (`WAN2`) from Patch Panel to Firewall. |

---

## 5. Four Ready-to-Build Use-Case Archetypes (For Consultative Planning)

When a user asks for a recommendation or only describes their goal, match their use case to one of these **4 battle-tested archetypes** and adapt it to their exact port/device counts:

### Archetype 1: 10-Inch Silent Smart-Home, Media & NAS Starter Rack (`8U`, `10inch`)
- **Ideal For:** Apartments, living rooms, or home offices needing whisper-quiet operation (`< 45 W` idle), Home Assistant, AdGuard/Pi-hole, Plex/Jellyfin media streaming, and local 2-bay RAID backup.
- **Rack Init:** `standard: "10inch", u_height: 8, rail_depth_mm: 260, enclosure_type: "open-frame"` (or `"closed-vented-front"`).
- **Bottom-to-Top Elevation:**
  - `U1 (front)`: `cyberpower-10inch-ups-1u` — 300W Lithium UPS at the bottom (`CoG < 50%`).
  - `U2 (rear)`: `digitus-10inch-pdu-4way-schuko` — Rear 4-way Schuko PDU powered by `ups-u1:iec_out1`.
  - `U3–U4 (front)`: `synology-ds224-plus-10inch-2u` — 2-Bay NAS for media & backups (powered via PDU).
  - `U5 (front)`: `3dprint-10inch-ucg-ultra-plus-3keystone` containing `ubiquiti-ucg-max` (Gateway) + 3× `keystone-rj45-cat6a-coupler`.
  - `U6 (front)`: `3dprint-10inch-rpi5-jetkvm-2keystone` containing `raspberry-pi-5-poe-hat` (Home Assistant, PoE-powered!) + `jetkvm-smart-ip-kvm` (remote BIOS/KVM) + 2× `keystone-rj45-cat6a-coupler`.
  - `U7 (front)`: `deskpi-10inch-patch-panel-12port` — Terminate rear cables from NAS (`lan1`), UCG-Max (`lan1`), and external rooms (`plan_external_endpoints`).
  - `U8 (front)`: `ubiquiti-usw-lite-8-poe` (52W PoE, or `ubiquiti-usw-flex-2-5g-8-poe` for 2.5G) mounted in its 3D-printed 10" 1U PETG adapter cradle, patched 1:1 (`p1..p8 -> eth1..eth8`) to `U7`.

### Archetype 2: 10-Inch Proxmox 2.5G High-Availability Cluster & Dev-Lab (`8U`, `10inch`)
- **Ideal For:** Software engineers, DevOps labs, Kubernetes/Docker clusters, and Proxmox VE high-availability virtualization in a compact 10-inch DeskPi RackMate footprint.
- **Rack Init:** `standard: "10inch", u_height: 8, rail_depth_mm: 240, enclosure_type: "closed-glass-front"`.
- **Bottom-to-Top Elevation (`examples/10inch-homelab/rack.yaml`):**
  - `U1 (front)`: `cyberpower-10inch-ups-1u` (`ups-core-01`).
  - `U2 (rear)`: `digitus-10inch-pdu-4way-schuko` (`pdu-rear-01`).
  - `U3 (front)`: `3dprint-10inch-ucg-ultra-plus-3keystone` + `ubiquiti-ucg-max` (`gw-unifi-max`) + 3× Keystones (`WAN-ISP`, `UCG-LAN1`, `UCG-LAN2`).
  - `U4 (front)`: `3dprint-10inch-lenovo-tiny-plus-2keystone` + `lenovo-thinkcentre-m920q` (`pve-node-01`) + 2× Keystones.
  - `U5 (front)`: `3dprint-10inch-lenovo-tiny-plus-2keystone` + `lenovo-thinkcentre-m920q` (`pve-node-02`) + 2× Keystones.
  - `U6 (front)`: `generic-10inch-brush-panel-1u` — Thermal separator & front-to-rear cable portal.
  - `U7 (front)`: `deskpi-10inch-patch-panel-12port` — Receives rear `cat6a` trunks from `ucg-max:lan1` (`p1`) and `pve-node-01/02` (`p2..p5`), plus optional external room drops (`p6..p12`).
  - `U8 (front)`: `ubiquiti-usw-flex-2-5g-8-poe` — Patched 1:1 (`p1..p5 -> eth1..eth5`) on the front face, plus a direct rear `cat6a` crossover (`pve-node-01:eth2 <-> pve-node-02:eth2`, `VLAN 50`) for 2.5G Ceph storage replication.

### Archetype 3: 19-Inch Smart-Building, PoE Surveillance & Wi-Fi 7 House Rack (`9U`–`12U`, `19inch`)
- **Ideal For:** Single-family homes (Einfamilienhaus/Villa) or small offices with many building LAN drops (e.g., 6–12 PoE cameras, 4–6 Wi-Fi 7 Access Points, and 4–8 room LAN outlets for PC, 4K Beamer, Laptop, and Docking Station).
- **Rack Init:** `standard: "19inch", u_height: 10` (or `12`), `rail_depth_mm: 450, enclosure_type: "closed-vented-front"`.
- **Bottom-to-Top Elevation:**
  - `U1–U2 (front)`: `apc-smart-ups-1500-2u` (1000W / 1500VA 2U UPS with 8× `iec-c13` outlets at the bottom).
  - `U3–U4 (front)`: `ubiquiti-unas-pro-2u` (7-Bay 10G SFP+ NAS for family cloud, Time Machine, and video archive).
  - `U5 (front)`: `generic-19inch-brush-panel-1u` (Central pass-through portal for the rear NAS `sfp_plus1` cable).
  - `U6`: *Free 1U Thermal & Expansion Buffer*.
  - `U7 (front)`: `ubiquiti-udm-pro` (All-in-One 10G Security Gateway, Firewall & UniFi Protect Camera NVR).
  - `U8 (front)`: `ubiquiti-usw-pro-max-24-poe` (24-Port PoE++ Switch with 400W PoE budget, linked to `UDM-Pro:sfp_lan11` via `sfp-plus-dac` on `sfp1` and to `UNAS-Pro:sfp_plus1` via `sfp2` through the `U5` brush portal).
  - `U9 (front)`: `generic-19inch-patch-panel-24port-cat6a` — Call `plan_external_endpoints` with `auto_connect_switch_instance_id` set to the `USW-Pro-Max-24-PoE` so all cameras, APs, and room outlets terminate on the rear (`p1..p24`) and patch 1:1 straight down (`p1..p24 -> eth1..eth24`) on the front!

### Archetype 4: 19-Inch Redundant Enterprise Core, Dual-WAN NGFW & Proxmox HA Stack (`12U`, `19inch`)
- **Ideal For:** Businesses, tech studios, or advanced enterprise homelabs requiring dedicated hardware Next-Gen Firewalling (Dual-WAN), 10G SFP+ Core Aggregation switching, PoE++ access switching, and a 3-node Proxmox HA + Quorum cluster.
- **Rack Init:** `standard: "19inch", u_height: 12, rail_depth_mm: 400` (with short-depth UPS) or `500`, `enclosure_type: "closed-vented-front"`.
- **Bottom-to-Top Elevation (`examples/19inch-enterprise/rack.yaml`):**
  - `U1–U2 (front)`: 2U Smart-UPS (`apc-smart-ups-1500-2u` or short-depth Li-Ion 2U UPS).
  - `U3–U4 (front)`: `ubiquiti-unas-pro-2u` (7-Bay 10G SFP+ NAS).
  - `U5 (front)`: `3dprint-19inch-triple-mini-pc-carrier` (or dual Mini-PC + Pi 5 PoE carrier) with Proxmox HA nodes (`lenovo-thinkcentre-m920q`).
  - `U6 (front)`: `generic-19inch-brush-panel-1u` (Single central front-to-rear cable portal).
  - `U7`: *Free 1U TIA-942 Thermal & Expansion Headroom*.
  - `U8 (front)`: `ubiquiti-udm-pro` (Dedicated Protect Camera NVR & UniFi Controller, `10G SFP+ DAC` to Aggregation).
  - `U9 (front)`: Enterprise NGFW / Router (e.g., `FortiGate 200F` or primary `UDM-Pro`, Dual-WAN from Patch Panel `p2`/`p3`, `2× 10G SFP+ LACP DAC` to Aggregation).
  - `U10 (front)`: `ubiquiti-usw-aggregation` (8-Port 10G SFP+ Core Switch interconnecting Firewall, PoE++ Switch via 2× 10G LACP DAC, UDM-Pro NVR, and rear UNAS Pro via `U6` brush portal).
  - `U11 (front)`: `ubiquiti-usw-pro-max-24-poe` (400W PoE++ Access Switch).
  - `U12 (front)`: `generic-19inch-patch-panel-24port-cat6a` (Top-of-Rack Patch Panel with 1:1 vertical port alignment `p8..p21 <-> eth8..eth21` to the PoE++ Switch).

---

## 6. Step-by-Step Autonomous Execution Workflow (6 Phases)

Whenever the user asks you to design, modify, or audit a rack, execute these **6 phases** in order:

### Phase 1: Hardware Discovery & Sub-U Carrier Planning
1. Call `search_catalog` (filtering by `form_factor: "10inch" | "19inch" | "6inch"`, `category`, or `query`) to inspect available hardware blueprints.
2. **Crucial Rule for Non-Rackmount Devices (`mount_type: "sub-module"`):**
   Devices with `mount_type: "sub-module"` **cannot** be mounted directly onto rack rails (`u_position`). You must:
   - First mount a **`modular-carrier`** onto a rack unit (`u_position`), e.g.:
     - `3dprint-10inch-lenovo-tiny-plus-2keystone` (accepts 1× `mini-pc-1liter` in `left-mini-pc-bay` + 2× `standard-keystone` in `keystone-1`..`2`)
     - `3dprint-10inch-ucg-ultra-plus-3keystone` (accepts 1× `unifi-compact-gateway` in `gateway-bay` + 3× `standard-keystone` in `keystone-1`..`3`)
     - `3dprint-10inch-rpi5-jetkvm-2keystone` (accepts 1× `sbc-rpi5` in `rpi-bay-1` + 1× `jetkvm-bay` in `jetkvm-bay-1` + 2× `standard-keystone` in `keystone-1`..`2`)
     - `3dprint-10inch-dual-rpi5-plus-4keystone` (accepts 2× `sbc-rpi5` in `rpi-bay-1`..`2` + 4× `standard-keystone` in `keystone-1`..`4`)
     - `3dprint-19inch-triple-mini-pc-carrier` (accepts 3× `mini-pc-1liter` up to `145 mm` width in `mini-pc-bay-1`..`3`)
   - Then mount the child `sub-module` into that carrier using `parent_carrier_id` and `slot_id`.
3. If the user owns hardware that is not among the 30 built-in blueprints, call `define_custom_blueprint` with exact millimeter dimensions (`width_mm`, `height_mm`, `depth_mm`), weight (`weight_grams`), power draw (`max_system_watts`), and `ports` before mounting it.

### Phase 2: Rack Initialization (`init_rack`)
1. Call `init_rack` with the target `standard` (`"10inch"`, `"19inch"`, or `"6inch"`), `u_height`, `rail_depth_mm`, and `enclosure_type` (`"open-frame"`, `"closed-glass-front"`, or `"closed-vented-front"`).
2. Ensure `rail_depth_mm` accommodates the deepest mounted device plus rear plug clearance (e.g., `240–260 mm` for 10-inch racks; `400–550 mm` for 19-inch racks depending on whether a `325 mm` deep short-depth UPS or `477 mm` deep full-size `apc-smart-ups-1500-2u` is used).

### Phase 3: Mounting Equipment & Sub-Modules (`mount_equipment`)
1. Mount all rack-level devices first (`u_position`, `face: "front" | "rear"`) following the 5-Zone Elevation Blueprint (Section 3.1) unless the user requested a custom order.
2. Call `get_device_blueprint` on each mounted carrier to verify its exact `slots[].slot_id` and `ports[].port_id` names.
3. Mount all `sub-module` devices into their carrier slots (`parent_carrier_id`, `slot_id`), including `keystone-rj45-cat6a-coupler` couplers into any `"standard-keystone"` slots you plan to wire.

### Phase 4: External Building / Room Drops (`plan_external_endpoints`) & Cable Routing (`connect_cables`)
1. **External Building / House Drops (`plan_external_endpoints`):**
   - Terminate all external building cables (PoE cameras, Wi-Fi APs, room LAN outlets, projectors, docking stations, ISP WAN uplinks) onto the rear of the top Patch Panel (`generic-19inch-patch-panel-24port-cat6a` or `deskpi-10inch-patch-panel-12port`) using **`plan_external_endpoints`**:
     ```json
     {
       "patch_panel_instance_id": "patch-u12",
       "entry_position": "top-rear",
       "auto_connect_switch_instance_id": "sw-pro-24",
       "clear_existing": true,
       "groups": [
         {
           "id_prefix": "cam",
           "label_prefix": "PoE Kamera",
           "category": "poe-camera",
           "room_or_zone": "Außenbereich",
           "count": 10,
           "poe_draw_watts": 9,
           "required_speed": "1gbe",
           "color_hex": "#F59E0B",
           "vlan_id": 30
         },
         {
           "id_prefix": "ap",
           "label_prefix": "WLAN Access Point",
           "category": "wifi-ap",
           "room_or_zone": "Haus WLAN",
           "count": 5,
           "poe_draw_watts": 18,
           "required_speed": "2.5gbe",
           "color_hex": "#06B6D4",
           "vlan_id": 20
         },
         {
           "id_prefix": "room",
           "label_prefix": "Raum LAN",
           "custom_labels": [
             "Büro – Desktop PC",
             "Heimkino – 4K Beamer",
             "Schlafzimmer – Laptop",
             "Studio – Workstation",
             "Home-Office – Dockingstation"
           ],
           "category": "wall-outlet-pc",
           "room_or_zone": "Wohnräume",
           "count": 5,
           "poe_draw_watts": 0,
           "required_speed": "2.5gbe",
           "color_hex": "#10B981",
           "vlan_id": 10
         }
       ]
     }
     ```
   - `plan_external_endpoints` automatically aligns each Patch Panel port `pN` 1:1 with Switch port `ethN` (`p1 -> eth1`, `p2 -> eth2`, ...), validates total PoE budget through the passive patch panel couplers, and generates a beginner-friendly step-by-step patching guide.
2. Call `get_device_blueprint` for every internal device you are wiring so you never guess a `port_id`.
3. **Choose the Right Cable & Plug Geometry (`cable_type`):**
   - **Tight Front Glass Door (`closed-glass-front` with `45–50 mm` clearance) or Tight Rear Depth:**
     Use **`-angled`** cable variants (`cat6a-angled`, `sfp-plus-dac-angled`, `power-schuko-c13-angled`, `power-c13-c14-angled`, `power-dc-5525-angled`, `power-usb-c-angled`) to cut plug protrusion $\Delta Z_{\text{plug}}$ by ~50% (`55 mm` $\rightarrow$ `28 mm` for Schuko, `35 mm` $\rightarrow$ `18 mm` for RJ45) and prevent `PLUG_CLEARANCE_COLLISION` or `FRONT_DOOR_COLLISION`.
   - **Multi-Gigabit Links ($\ge 2.5\text{ GbE}$ / $10\text{ GbE}$):**
     Always use `cat6a` / `cat6a-angled` (or `sfp-plus-dac` / `fiber-lc-duplex` for SFP+). Never use `cat5e` on $2.5\text{ GbE}$ or $10\text{ GbE}$ ports (`SPEED_MISMATCH` prevention).
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
| `POE_BUDGET_EXCEEDED` | 3 | Offload PoE PD devices to a higher-budget PoE switch (`ubiquiti-usw-flex-2-5g-8-poe` = `196 W`, or `ubiquiti-usw-pro-max-24-poe` = `400 W`) or power the device via its dedicated DC/AC input. |
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
- `BOM.md` — Commercial Hardware BOM (with device descriptions & mounting notes), 3D-Print Filament Queue (`g`), Cable Length Schedule (`mm`), and Fastener Checklist
- `rack-scene.glb` — Binary glTF 2.0 3D scene in meter scale (`1.0 = 1000 mm`)
- `<carrier-slug>.scad` & `<carrier-slug>.stl` — Parametric OpenSCAD scripts and **100% watertight 2-manifold `.stl` files** (with EIA-310 M6 mounting slots, `+0.35 mm` print tolerances, retention rails, and floor ventilation cutouts) ready for Bambu Studio, OrcaSlicer, or PrusaSlicer.

---

## 7. Built-In Hardware Catalog Quick Reference (30 Blueprints)

| Blueprint Slug | Form Factor / Mount | Category | U / Size (`W×H×D mm`) | Key Ports, Carrier Slots & Practical Role |
| :--- | :--- | :--- | :--- | :--- |
| `ubiquiti-usw-flex-2-5g-8-poe` | `rackmount-10` (3D-Print Cradle) | `switch` | `1U` (`212.9×32.5×99.4`) | `eth1`..`eth8` (2.5G PoE+ PSE, `196W`), `sfp1` (10G SFP+), `eth9` (10G), `pwr_in` · Compact 2.5G PoE++ core switch (requires 3D-printed 10" 1U PETG cradle) |
| `ubiquiti-usw-lite-8-poe` | `rackmount-10` (3D-Print Cradle) | `switch` | `1U` (`200×31×99.6`) | `eth1`..`eth4` (1G PoE+ PSE, `52W`), `eth5`..`eth8` (1G), `dc_in` · Whisper-quiet starter PoE switch (requires 3D-printed 10" 1U PETG cradle) |
| `mikrotik-crs310-8g-plus-2s-plus-in` | `rackmount-10` (Included Ears) | `switch` | `1U` (`200×44×206`) | `eth1`..`eth8` (2.5G RJ45), `sfp_plus1`..`sfp_plus2` (10G SFP+), `dc_in` · Native rackmount 2.5G/10G switch |
| `mikrotik-rb5009upr-s-in` | `rackmount-10` (Included Ears) | `router` | `1U` (`220×44×125`) | `eth1` (2.5G PoE), `eth2`..`eth8` (1G PoE-out, `130W`), `sfp_plus1` (10G), `pwr_in` · Heavy-duty RouterOS PoE router |
| `tp-link-tl-sg2210mp` | `rackmount-10` (Included Ears) | `switch` | `1U` (`220×44×180`) | `eth1`..`eth8` (1G PoE+ PSE, `150W`), `sfp1`..`sfp2` (SFP), `ac_in` · Native 10" 150W PoE+ switch with internal PSU |
| `synology-ds224-plus-10inch-2u` | `rackmount-10` (Shelf/Tray) | `nas` | `2U` (`222×88×232.5`) | `lan1`, `lan2` (1G RJ45), `usb_front_1`, `usb_rear_1`, `dc_in` (`18W` active fan) · 2-Bay RAID NAS for backups & Plex |
| `deskpi-10inch-patch-panel-12port` | `rackmount-10` (Included Ears) | `patch-panel` | `1U` (`222×44×30`) | `p1`..`p12` (Cat6A passthrough couplers) · Top-of-Rack 10" patch panel (`1:1` aligned with 8/12-port switches) |
| `digitus-10inch-pdu-4way-schuko` | `rackmount-10` (Included Ears) | `pdu` | `1U` (`220×44×55`) | `outlet1`..`outlet4` (`schuko-cee7`, `3600W`), `mains_in` · Rear 4-way power strip for Mini-PC & Gateway bricks |
| `cyberpower-10inch-ups-1u` | `rackmount-10` (Included Ears) | `ups` | `1U` (`220×44×185`) | `iec_out1`..`iec_out4` (`iec-c13`, `300W`), `ac_in` (`iec-c14`), OLED display · Mount at `U1` for low Center of Gravity |
| `generic-10inch-brush-panel-1u` | `rackmount-10` (Included Ears) | `brush-panel` | `1U` (`222×44×15`) | Front-to-rear cable pass-through portal (`has_cable_pass_through: true`) · Mount 1 centrally (`U5`/`U6`) |
| `generic-10inch-blank-panel-1u` | `rackmount-10` (Included Ears) | `blank-panel` | `1U` (`222×44×10`) | Solid steel airflow blanking panel for unused U-slots |
| `generic-10inch-shelf-1u` | `rackmount-10` (Included Ears) | `shelf` | `1U` (`254×44×180`) | Vented 1U cantilever shelf (`shelf-tray-1` accepts `open-shelf-area`) for modems or non-rack devices |
| `3dprint-10inch-lenovo-tiny-plus-2keystone` | `rackmount-10` (3D-Printed) | `modular-carrier` | `1U` (`254×44×185`) | Slots: `left-mini-pc-bay` (`mini-pc-1liter`), `keystone-1`, `keystone-2` |
| `3dprint-10inch-ucg-ultra-plus-3keystone` | `rackmount-10` (3D-Printed) | `modular-carrier` | `1U` (`254×44×140`) | Slots: `gateway-bay` (`unifi-compact-gateway`), `keystone-1`..`keystone-3` |
| `3dprint-10inch-rpi5-jetkvm-2keystone` | `rackmount-10` (3D-Printed) | `modular-carrier` | `1U` (`254×44×110`) | Slots: `rpi-bay-1` (`sbc-rpi5`), `jetkvm-bay-1` (`jetkvm-bay`), `keystone-1`..`2` |
| `3dprint-10inch-dual-rpi5-plus-4keystone` | `rackmount-10` (3D-Printed) | `modular-carrier` | `1U` (`254×44×105`) | Slots: `rpi-bay-1`, `rpi-bay-2` (`sbc-rpi5`), `keystone-1`..`keystone-4` |
| `3dprint-19inch-triple-mini-pc-carrier` | `rackmount-19` (3D-Printed) | `modular-carrier` | `1U` (`482.6×44×185`) | Slots: `mini-pc-bay-1`..`mini-pc-bay-3` (`mini-pc-1liter`, max width `145 mm`) |
| `lenovo-thinkcentre-m920q` | `sub-module` (Needs Carrier) | `mini-pc` | `179×34.5×182` | Compat: `mini-pc-1liter` · Ports: `eth0` (1G), `eth1`..`eth2` (2.5G), `dc_in` (`dc-5525`) · Proxmox / OPNsense node |
| `dell-optiplex-7010-micro` | `sub-module` (Needs Carrier) | `mini-pc` | `178×36×182` | Compat: `mini-pc-1liter` · Ports: `eth0` (1G), `eth1` (2.5G), `dc_in` (`dc-5525`) · Low-power VM node |
| `ubiquiti-ucg-max` | `sub-module` (Needs Carrier) | `router` | `141.8×30×127.6` | Compat: `unifi-compact-gateway` · Ports: `lan1`..`lan4` (2.5G), `wan` (2.5G), `usbc_pwr` · 2.5G UniFi Gateway & NVR |
| `jetkvm-smart-ip-kvm` | `sub-module` (Needs Carrier) | `compute-node` | `43×36×60` | Compat: `jetkvm-bay` · Ports: `eth0` (RJ45), `usb_c_pwr` (`4.5W`), OLED touchscreen · Out-of-Band BIOS IP-KVM |
| `raspberry-pi-5-poe-hat` | `sub-module` (Needs Carrier) | `sbc` | `62×32×92` | Compat: `sbc-rpi5` · Ports: `eth0` (PoE-in PD `12W`), `usbc_pwr` · Home Assistant / Pi-hole / Quorum Witness |
| `keystone-rj45-cat6a-coupler` | `sub-module` (Needs Carrier) | `keystone-module` | `16×20×30` | Compat: `standard-keystone` · Port: `coupler` (Cat6A passthrough coupler) |
| `ubiquiti-udm-pro` | `rackmount-19` (Included Ears) | `router` | `1U` (`442.4×43.7×285.6`) | `eth1`..`eth8` (1G), `wan1` (2.5G), `sfp_wan2`, `sfp_lan11` (10G SFP+), `ac_in` · 19" Security Gateway & Protect NVR |
| `ubiquiti-usw-pro-max-24-poe` | `rackmount-19` (Included Ears) | `switch` | `1U` (`442.4×43.7×325`) | `eth1`..`eth24` (Single-Row 24× RJ45 PoE++/PoE+ PSE, `400W`), `sfp1`..`sfp2` (10G SFP+), `ac_in` · Aligns 1:1 with 24-Port Patch Panel |
| `ubiquiti-usw-aggregation` | `rackmount-19` (Included Ears) | `switch` | `1U` (`442.4×43.7×120`) | `sfp1`..`sfp8` (8× 10G SFP+ L2 Aggregation), `ac_in`, OLED · High-speed 10G SFP+ DAC core backbone switch |
| `ubiquiti-unas-pro-2u` | `rackmount-19` (Included Ears) | `nas` | `2U` (`442.4×87.4×325.1`) | `eth1` (1G RJ45), `sfp_plus1` (10G SFP+), `ac_in` (`160W`), OLED touchscreen · 7-Bay 10G Enterprise NAS (`U3–U4`) |
| `generic-19inch-patch-panel-24port-cat6a` | `rackmount-19` (Included Ears) | `patch-panel` | `1U` (`482.6×44×35`) | `p1`..`p24` (24× Cat6A shielded passthrough couplers) · Mount at Top-of-Rack (`U_max`) directly above PoE switch |
| `generic-19inch-brush-panel-1u` | `rackmount-19` (Included Ears) | `brush-panel` | `1U` (`482.6×44×18`) | 19-inch front-to-rear cable pass-through portal (`has_cable_pass_through: true`) · Mount 1 centrally (`U5`/`U6`) |
| `apc-smart-ups-1500-2u` | `rackmount-19` (Included Ears) | `ups` | `2U` (`432×86×477`) | `iec_out1`..`iec_out8` (`iec-c13`, `1000W`), `ac_in`, `smartconnect_eth`, OLED · Mount at `U1–U2` (`24 kg`, needs $\ge 500\text{ mm}$ depth) |
