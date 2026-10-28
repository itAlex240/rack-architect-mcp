# 12U 19-Inch Enterprise Firewall, PoE++ & Proxmox HA Rack — Bill of Materials & Assembly Guide

## 1. Project & Validation Summary

- **Validation Status:** `VALID` (0 Errors, 0 Warnings)
- **Rack Enclosure:** 12U `19inch` (Rail Depth: `400 mm`, Rear Clearance: `60 mm`)
- **Total Mounted Devices:** 13 (10 rackmount units + 3 sub-modules)
- **Total Electrical Draw:** `536 W` system + `264 W` PoE
- **Mechanical Mass & Stability:** `48.6 kg` total weight | Center of Gravity $Y_{\text{CoG}} = 188.6\text{ mm}$ (`35.4%` of rack height)

## 2. Commercial Hardware BOM

| Slug | Manufacturer | Model | Category | Qty | Instances & Locations | Max Power (W) | Total Weight (g) |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| `apc-smart-ups-li-ion-short-depth-2u` | APC | Smart-UPS Li-Ion 1500VA Short-Depth Network RM 2U (SMTL1500RMI2UC) | `ups` | 1 | `ups-core-01` (U1 front) | 35 W | 18500 g |
| `ubiquiti-unas-pro-2u` | Ubiquiti | UniFi UNAS Pro (7-Bay 2U 10G SFP+ Rackmount NAS) | `nas` | 1 | `nas-storage-01` (U3 front) | 160 W | 9200 g |
| `lenovo-thinkcentre-m920q` | Lenovo | ThinkCentre M920q Tiny (with Dual-Port PCIe NIC) | `mini-pc` | 2 | `pve-node-01` (U5 `carrier-compute-u5:mini-pc-bay-1`), `pve-node-02` (U5 `carrier-compute-u5:mini-pc-bay-2`) | 130 W | 2640 g |
| `raspberry-pi-5-poe-hat` | Raspberry Pi | Raspberry Pi 5 (8GB) with Official PoE+ HAT | `sbc` | 1 | `pi5-qdevice-01` (U5 `carrier-compute-u5:pi-poe-bay-1`) | 12 W | 110 g |
| `generic-19inch-brush-panel-1u` | Generic | 19-Inch 1U High-Density Cable Management Brush Strip Panel | `brush-panel` | 1 | `brush-portal-u6` (U6 front) | 0 W | 280 g |
| `ubiquiti-udm-pro` | Ubiquiti | UniFi Dream Machine Pro (UDM-Pro) | `router` | 1 | `udm-pro-sec-01` (U7 front) | 33 W | 3900 g |
| `fortinet-fortigate-200f-ngfw-1u` | Fortinet | FortiGate 200F Enterprise Next-Gen Firewall (1U) | `router` | 1 | `fw-ngfw-01` (U8 front) | 68 W | 4300 g |
| `ubiquiti-usw-aggregation` | Ubiquiti | UniFi Switch Aggregation (USW-Aggregation 8x 10G SFP+) | `switch` | 1 | `sw-core-agg-01` (U9 front) | 30 W | 2650 g |
| `ubiquiti-usw-pro-max-24-poe` | Ubiquiti | UniFi Switch Pro Max 24 PoE (USW-Pro-Max-24-PoE) | `switch` | 1 | `sw-poe-core-01` (U10 front) | 50 W | 5100 g |
| `generic-19inch-patch-panel-24port-cat6a` | Generic | 19-Inch 1U 24-Port Cat6A Shielded Passthrough Patch Panel | `patch-panel` | 1 | `patch-ext-u11` (U11 front) | 0 W | 640 g |
| `enterprise-poe-field-demarcation-16port-1u` | Building Infrastructure | External Building LAN & PoE++ Cable Entry Trunk (16x Cat6A Field Drops) | `patch-panel` | 1 | `ext-building-demarc` (U12 front) | 18 W | 880 g |

## 3. 3D Print Queue (Fabrication List)

| Carrier Blueprint | Qty | Material | Total Filament (g) | Heat-Set Inserts (per unit) | Fasteners / Screws (per unit) | Source Model |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `3dprint-19inch-dual-minipc-poe-carrier-1u` (U5) | 1 | PETG-CF / ASA | 365 g | 8x M3x5x4mm | 8x M3x12mm Socket Head | — |

**Total Estimated 3D Filament Required:** `365 g`

## 4. Aggregated Cable Shopping List

| Cable Type | Commercial Length | Color Hex | Qty | Cable IDs & Purpose |
| :--- | :---: | :---: | :---: | :--- |
| `cat6a` | **0.15 m** (150 mm) | `#EF4444` | 2 | `ext-drop-01`, `ext-drop-02` (Incoming ISP WAN 1 Drop, Incoming ISP WAN 2 Drop) |
| `cat6a` | **0.15 m** (150 mm) | `#0EA5E9` | 12 | `ext-drop-03`, `ext-drop-04`, `ext-drop-05`, `ext-drop-06`, `ext-drop-07`, `ext-drop-08`, `poe-patch-ap-01`, `poe-patch-ap-02`, `poe-patch-ap-03`, `poe-patch-ap-04`, `poe-patch-ap-05`, `poe-patch-ap-06` (External Wi-Fi 7 PoE++ AP #1 Drop, External Wi-Fi 7 PoE++ AP #2 Drop, External Wi-Fi 7 PoE++ AP #3 Drop, External Wi-Fi 7 PoE++ AP #4 Drop, External Wi-Fi 7 PoE++ AP #5 Drop, External Wi-Fi 7 PoE++ AP #6 Drop, PoE++ Patch -> Wi-Fi 7 AP #1 (22W), PoE++ Patch -> Wi-Fi 7 AP #2 (22W), PoE++ Patch -> Wi-Fi 7 AP #3 (22W), PoE++ Patch -> Wi-Fi 7 AP #4 (22W), PoE++ Patch -> Wi-Fi 7 AP #5 (22W), PoE++ Patch -> Wi-Fi 7 AP #6 (22W)) |
| `cat6a` | **0.15 m** (150 mm) | `#F59E0B` | 12 | `ext-drop-09`, `ext-drop-10`, `ext-drop-11`, `ext-drop-12`, `ext-drop-13`, `ext-drop-14`, `poe-patch-cam-01`, `poe-patch-cam-02`, `poe-patch-cam-03`, `poe-patch-cam-04`, `poe-patch-cam-05`, `poe-patch-cam-06` (External 4K PoE+ Camera #1 Drop, External 4K PoE+ Camera #2 Drop, External 4K PoE+ Camera #3 Drop, External 4K PoE+ Camera #4 Drop, External 4K PoE+ Camera #5 Drop, External 4K PoE+ Camera #6 Drop, PoE+ Patch -> 4K Security Cam #1 (12W), PoE+ Patch -> 4K Security Cam #2 (12W), PoE+ Patch -> 4K Security Cam #3 (12W), PoE+ Patch -> 4K Security Cam #4 (12W), PoE+ Patch -> 4K Security Cam #5 (12W), PoE+ Patch -> 4K Security Cam #6 (12W)) |
| `cat6a` | **0.15 m** (150 mm) | `#10B981` | 2 | `ext-drop-15`, `ext-drop-16` (External PoE+ Door Access #1 Drop, External PoE+ Door Access #2 Drop) |
| `cat6a` | **0.25 m** (250 mm) | `#10B981` | 2 | `poe-patch-door-01`, `poe-patch-door-02` (PoE+ Patch -> Door Access #1 (15W), PoE+ Patch -> Door Access #2 (15W)) |
| `cat6a` | **0.25 m** (250 mm) | `#F43F5E` | 1 | `fw-ha-sync-to-udm` (FortiGate <-> UDM-Pro Management & Telemetry Interconnect) |
| `cat6a` | **0.50 m** (500 mm) | `#14B8A6` | 1 | `rear-pve1-to-pve2-ceph` (2.5G Direct Ceph Storage Replication Heartbeat) |
| `cat6a` | **0.75 m** (750 mm) | `#EC4899` | 1 | `poe-sw-to-pi5-witness` (PoE+ Power & Quorum Link -> Pi 5 Witness (12W PoE)) |
| `cat6a` | **1.50 m** (1500 mm) | `#EF4444` | 1 | `wan1-patch-to-ngfw` (Primary Fiber ONT WAN1 -> FortiGate 200F) |
| `cat6a` | **1.50 m** (1500 mm) | `#F97316` | 1 | `wan2-patch-to-ngfw` (Backup 5G/Cable WAN2 -> FortiGate 200F) |
| `cat6a` | **1.50 m** (1500 mm) | `#2563EB` | 1 | `cross-pve2-to-poesw` (2.5G Proxmox Node 02 VM Trunk (via U6 Brush Portal)) |
| `cat6a` | **2.00 m** (2000 mm) | `#2563EB` | 1 | `cross-pve1-to-poesw` (2.5G Proxmox Node 01 VM Trunk (via U6 Brush Portal)) |
| `power-c13-c14` | **0.50 m** (500 mm) | `#18181B` | 1 | `pwr-ups-to-nas` (UPS IEC-1 -> UNAS Pro 2U (160W)) |
| `power-c13-c14` | **1.00 m** (1000 mm) | `#DC2626` | 1 | `pwr-ups-to-ngfw` (UPS IEC-3 -> FortiGate 200F NGFW (68W)) |
| `power-c13-c14` | **1.50 m** (1500 mm) | `#18181B` | 3 | `pwr-ups-to-udm`, `pwr-ups-to-agg`, `pwr-ups-to-poesw` (UPS IEC-2 -> UDM-Pro (33W), UPS IEC-4 -> USW-Aggregation 10G (30W), UPS IEC-5 -> USW-Pro-Max-24-PoE++ (450W Total)) |
| `power-dc-5525` | **1.00 m** (1000 mm) | `#27272A` | 1 | `pwr-ups-to-pve1` (UPS 20V DC Out 1 -> Proxmox Node 01 (65W)) |
| `power-dc-5525` | **1.50 m** (1500 mm) | `#27272A` | 1 | `pwr-ups-to-pve2` (UPS 20V DC Out 2 -> Proxmox Node 02 (65W)) |
| `sfp-plus-dac` | **0.25 m** (250 mm) | `#A855F7` | 1 | `dac-ngfw-to-agg-1` (10G SFP+ LACP Core Trunk 1 (FortiGate -> Aggregation)) |
| `sfp-plus-dac` | **0.25 m** (250 mm) | `#38BDF8` | 2 | `dac-agg-to-poesw-1`, `dac-agg-to-poesw-2` (10G SFP+ LACP Uplink 1 (Aggregation -> PoE++ Switch), 10G SFP+ LACP Uplink 2 (Aggregation -> PoE++ Switch)) |
| `sfp-plus-dac` | **0.30 m** (300 mm) | `#A855F7` | 1 | `dac-ngfw-to-agg-2` (10G SFP+ LACP Core Trunk 2 (FortiGate -> Aggregation)) |
| `sfp-plus-dac` | **0.50 m** (500 mm) | `#8B5CF6` | 1 | `dac-agg-to-udm` (10G SFP+ Protect NVR Camera Stream Trunk) |
| `sfp-plus-dac` | **1.00 m** (1000 mm) | `#6366F1` | 1 | `cross-agg-to-nas` (10G SFP+ UNAS Pro Storage Trunk (via U6 Brush Portal)) |

## 5. Step-by-Step Assembly & Patching Checklist

### Phase A: Mechanical Mounting (Bottom-Up for Stability)
- [ ] Mount **Smart-UPS Li-Ion 1500VA Short-Depth Network RM 2U (SMTL1500RMI2UC)** (`ups-core-01`) at **U1** (FRONT rails).
- [ ] Mount **UniFi UNAS Pro (7-Bay 2U 10G SFP+ Rackmount NAS)** (`nas-storage-01`) at **U3** (FRONT rails).
- [ ] Mount **19-Inch 1U Carrier for 2x 1L Proxmox Nodes + 1x PoE Pi5 Witness** (`carrier-compute-u5`) at **U5** (FRONT rails).
  - [ ] Insert sub-module **ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)** (`pve-node-01`) into carrier slot `carrier-compute-u5:mini-pc-bay-1`.
  - [ ] Insert sub-module **ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)** (`pve-node-02`) into carrier slot `carrier-compute-u5:mini-pc-bay-2`.
  - [ ] Insert sub-module **Raspberry Pi 5 (8GB) with Official PoE+ HAT** (`pi5-qdevice-01`) into carrier slot `carrier-compute-u5:pi-poe-bay-1`.
- [ ] Mount **19-Inch 1U High-Density Cable Management Brush Strip Panel** (`brush-portal-u6`) at **U6** (FRONT rails).
- [ ] Mount **UniFi Dream Machine Pro (UDM-Pro)** (`udm-pro-sec-01`) at **U7** (FRONT rails).
- [ ] Mount **FortiGate 200F Enterprise Next-Gen Firewall (1U)** (`fw-ngfw-01`) at **U8** (FRONT rails).
- [ ] Mount **UniFi Switch Aggregation (USW-Aggregation 8x 10G SFP+)** (`sw-core-agg-01`) at **U9** (FRONT rails).
- [ ] Mount **UniFi Switch Pro Max 24 PoE (USW-Pro-Max-24-PoE)** (`sw-poe-core-01`) at **U10** (FRONT rails).
- [ ] Mount **19-Inch 1U 24-Port Cat6A Shielded Passthrough Patch Panel** (`patch-ext-u11`) at **U11** (FRONT rails).
- [ ] Mount **External Building LAN & PoE++ Cable Entry Trunk (16x Cat6A Field Drops)** (`ext-building-demarc`) at **U12** (FRONT rails).

### Phase B: Power & Network Cable Patching
- [ ] Patch **0.15m Cat6A** [`ext-drop-01`, `#EF4444`]: Connect `ext-building-demarc:ext1` (rear) $\rightarrow$ `patch-ext-u11:p2` (rear) — _Incoming ISP WAN 1 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-02`, `#EF4444`]: Connect `ext-building-demarc:ext2` (rear) $\rightarrow$ `patch-ext-u11:p3` (rear) — _Incoming ISP WAN 2 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-03`, `#0EA5E9`]: Connect `ext-building-demarc:ext3` (rear) $\rightarrow$ `patch-ext-u11:p8` (rear) — _External Wi-Fi 7 PoE++ AP #1 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-04`, `#0EA5E9`]: Connect `ext-building-demarc:ext4` (rear) $\rightarrow$ `patch-ext-u11:p9` (rear) — _External Wi-Fi 7 PoE++ AP #2 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-05`, `#0EA5E9`]: Connect `ext-building-demarc:ext5` (rear) $\rightarrow$ `patch-ext-u11:p10` (rear) — _External Wi-Fi 7 PoE++ AP #3 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-06`, `#0EA5E9`]: Connect `ext-building-demarc:ext6` (rear) $\rightarrow$ `patch-ext-u11:p11` (rear) — _External Wi-Fi 7 PoE++ AP #4 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-07`, `#0EA5E9`]: Connect `ext-building-demarc:ext7` (rear) $\rightarrow$ `patch-ext-u11:p12` (rear) — _External Wi-Fi 7 PoE++ AP #5 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-08`, `#0EA5E9`]: Connect `ext-building-demarc:ext8` (rear) $\rightarrow$ `patch-ext-u11:p13` (rear) — _External Wi-Fi 7 PoE++ AP #6 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-09`, `#F59E0B`]: Connect `ext-building-demarc:ext9` (rear) $\rightarrow$ `patch-ext-u11:p14` (rear) — _External 4K PoE+ Camera #1 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-10`, `#F59E0B`]: Connect `ext-building-demarc:ext10` (rear) $\rightarrow$ `patch-ext-u11:p15` (rear) — _External 4K PoE+ Camera #2 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-11`, `#F59E0B`]: Connect `ext-building-demarc:ext11` (rear) $\rightarrow$ `patch-ext-u11:p16` (rear) — _External 4K PoE+ Camera #3 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-12`, `#F59E0B`]: Connect `ext-building-demarc:ext12` (rear) $\rightarrow$ `patch-ext-u11:p17` (rear) — _External 4K PoE+ Camera #4 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-13`, `#F59E0B`]: Connect `ext-building-demarc:ext13` (rear) $\rightarrow$ `patch-ext-u11:p18` (rear) — _External 4K PoE+ Camera #5 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-14`, `#F59E0B`]: Connect `ext-building-demarc:ext14` (rear) $\rightarrow$ `patch-ext-u11:p19` (rear) — _External 4K PoE+ Camera #6 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-15`, `#10B981`]: Connect `ext-building-demarc:ext15` (rear) $\rightarrow$ `patch-ext-u11:p20` (rear) — _External PoE+ Door Access #1 Drop_.
- [ ] Patch **0.15m Cat6A** [`ext-drop-16`, `#10B981`]: Connect `ext-building-demarc:ext16` (rear) $\rightarrow$ `patch-ext-u11:p21` (rear) — _External PoE+ Door Access #2 Drop_.
- [ ] Patch **1.50m Cat6A** [`wan1-patch-to-ngfw`, `#EF4444`]: Connect `patch-ext-u11:p2` (front) $\rightarrow$ `fw-ngfw-01:wan1` (front) — _Primary Fiber ONT WAN1 -> FortiGate 200F_.
- [ ] Patch **1.50m Cat6A** [`wan2-patch-to-ngfw`, `#F97316`]: Connect `patch-ext-u11:p3` (front) $\rightarrow$ `fw-ngfw-01:wan2` (front) — _Backup 5G/Cable WAN2 -> FortiGate 200F_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-ap-01`, `#0EA5E9`]: Connect `sw-poe-core-01:eth13` (front) $\rightarrow$ `patch-ext-u11:p8` (front) — _PoE++ Patch -> Wi-Fi 7 AP #1 (22W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-ap-02`, `#0EA5E9`]: Connect `sw-poe-core-01:eth14` (front) $\rightarrow$ `patch-ext-u11:p9` (front) — _PoE++ Patch -> Wi-Fi 7 AP #2 (22W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-ap-03`, `#0EA5E9`]: Connect `sw-poe-core-01:eth15` (front) $\rightarrow$ `patch-ext-u11:p10` (front) — _PoE++ Patch -> Wi-Fi 7 AP #3 (22W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-ap-04`, `#0EA5E9`]: Connect `sw-poe-core-01:eth16` (front) $\rightarrow$ `patch-ext-u11:p11` (front) — _PoE++ Patch -> Wi-Fi 7 AP #4 (22W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-ap-05`, `#0EA5E9`]: Connect `sw-poe-core-01:eth17` (front) $\rightarrow$ `patch-ext-u11:p12` (front) — _PoE++ Patch -> Wi-Fi 7 AP #5 (22W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-ap-06`, `#0EA5E9`]: Connect `sw-poe-core-01:eth18` (front) $\rightarrow$ `patch-ext-u11:p13` (front) — _PoE++ Patch -> Wi-Fi 7 AP #6 (22W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-cam-01`, `#F59E0B`]: Connect `sw-poe-core-01:eth19` (front) $\rightarrow$ `patch-ext-u11:p14` (front) — _PoE+ Patch -> 4K Security Cam #1 (12W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-cam-02`, `#F59E0B`]: Connect `sw-poe-core-01:eth20` (front) $\rightarrow$ `patch-ext-u11:p15` (front) — _PoE+ Patch -> 4K Security Cam #2 (12W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-cam-03`, `#F59E0B`]: Connect `sw-poe-core-01:eth21` (front) $\rightarrow$ `patch-ext-u11:p16` (front) — _PoE+ Patch -> 4K Security Cam #3 (12W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-cam-04`, `#F59E0B`]: Connect `sw-poe-core-01:eth22` (front) $\rightarrow$ `patch-ext-u11:p17` (front) — _PoE+ Patch -> 4K Security Cam #4 (12W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-cam-05`, `#F59E0B`]: Connect `sw-poe-core-01:eth23` (front) $\rightarrow$ `patch-ext-u11:p18` (front) — _PoE+ Patch -> 4K Security Cam #5 (12W)_.
- [ ] Patch **0.15m Cat6A** [`poe-patch-cam-06`, `#F59E0B`]: Connect `sw-poe-core-01:eth24` (front) $\rightarrow$ `patch-ext-u11:p19` (front) — _PoE+ Patch -> 4K Security Cam #6 (12W)_.
- [ ] Patch **0.25m Cat6A** [`poe-patch-door-01`, `#10B981`]: Connect `sw-poe-core-01:eth11` (front) $\rightarrow$ `patch-ext-u11:p20` (front) — _PoE+ Patch -> Door Access #1 (15W)_.
- [ ] Patch **0.25m Cat6A** [`poe-patch-door-02`, `#10B981`]: Connect `sw-poe-core-01:eth12` (front) $\rightarrow$ `patch-ext-u11:p21` (front) — _PoE+ Patch -> Door Access #2 (15W)_.
- [ ] Patch **0.25m 10G DAC** [`dac-ngfw-to-agg-1`, `#A855F7`]: Connect `fw-ngfw-01:sfp_plus1` (front) $\rightarrow$ `sw-core-agg-01:sfp1` (front) — _10G SFP+ LACP Core Trunk 1 (FortiGate -> Aggregation)_.
- [ ] Patch **0.30m 10G DAC** [`dac-ngfw-to-agg-2`, `#A855F7`]: Connect `fw-ngfw-01:sfp_plus2` (front) $\rightarrow$ `sw-core-agg-01:sfp2` (front) — _10G SFP+ LACP Core Trunk 2 (FortiGate -> Aggregation)_.
- [ ] Patch **0.25m 10G DAC** [`dac-agg-to-poesw-1`, `#38BDF8`]: Connect `sw-core-agg-01:sfp3` (front) $\rightarrow$ `sw-poe-core-01:sfp1` (front) — _10G SFP+ LACP Uplink 1 (Aggregation -> PoE++ Switch)_.
- [ ] Patch **0.25m 10G DAC** [`dac-agg-to-poesw-2`, `#38BDF8`]: Connect `sw-core-agg-01:sfp4` (front) $\rightarrow$ `sw-poe-core-01:sfp2` (front) — _10G SFP+ LACP Uplink 2 (Aggregation -> PoE++ Switch)_.
- [ ] Patch **0.50m 10G DAC** [`dac-agg-to-udm`, `#8B5CF6`]: Connect `sw-core-agg-01:sfp5` (front) $\rightarrow$ `udm-pro-sec-01:sfp_lan11` (front) — _10G SFP+ Protect NVR Camera Stream Trunk_.
- [ ] Patch **1.00m 10G DAC** [`cross-agg-to-nas`, `#6366F1`]: Connect `sw-core-agg-01:sfp6` (front) $\rightarrow$ `nas-storage-01:sfp_plus1` (rear) — _10G SFP+ UNAS Pro Storage Trunk (via U6 Brush Portal)_.
- [ ] Patch **0.75m Cat6A** [`poe-sw-to-pi5-witness`, `#EC4899`]: Connect `sw-poe-core-01:eth1` (front) $\rightarrow$ `pi5-qdevice-01:eth0` (front) — _PoE+ Power & Quorum Link -> Pi 5 Witness (12W PoE)_.
- [ ] Patch **2.00m Cat6A** [`cross-pve1-to-poesw`, `#2563EB`]: Connect `sw-poe-core-01:eth2` (front) $\rightarrow$ `pve-node-01:eth1` (rear) — _2.5G Proxmox Node 01 VM Trunk (via U6 Brush Portal)_.
- [ ] Patch **1.50m Cat6A** [`cross-pve2-to-poesw`, `#2563EB`]: Connect `sw-poe-core-01:eth3` (front) $\rightarrow$ `pve-node-02:eth1` (rear) — _2.5G Proxmox Node 02 VM Trunk (via U6 Brush Portal)_.
- [ ] Patch **0.50m Cat6A** [`rear-pve1-to-pve2-ceph`, `#14B8A6`]: Connect `pve-node-01:eth2` (rear) $\rightarrow$ `pve-node-02:eth2` (rear) — _2.5G Direct Ceph Storage Replication Heartbeat_.
- [ ] Patch **0.25m Cat6A** [`fw-ha-sync-to-udm`, `#F43F5E`]: Connect `fw-ngfw-01:eth8` (front) $\rightarrow$ `udm-pro-sec-01:eth8` (front) — _FortiGate <-> UDM-Pro Management & Telemetry Interconnect_.
- [ ] Patch **0.50m IEC C13-C14** [`pwr-ups-to-nas`, `#18181B`]: Connect `ups-core-01:iec_out1` (rear) $\rightarrow$ `nas-storage-01:ac_in` (rear) — _UPS IEC-1 -> UNAS Pro 2U (160W)_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-udm`, `#18181B`]: Connect `ups-core-01:iec_out2` (rear) $\rightarrow$ `udm-pro-sec-01:ac_in` (rear) — _UPS IEC-2 -> UDM-Pro (33W)_.
- [ ] Patch **1.00m IEC C13-C14** [`pwr-ups-to-ngfw`, `#DC2626`]: Connect `ups-core-01:iec_out3` (rear) $\rightarrow$ `fw-ngfw-01:ac_in` (rear) — _UPS IEC-3 -> FortiGate 200F NGFW (68W)_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-agg`, `#18181B`]: Connect `ups-core-01:iec_out4` (rear) $\rightarrow$ `sw-core-agg-01:ac_in` (rear) — _UPS IEC-4 -> USW-Aggregation 10G (30W)_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-poesw`, `#18181B`]: Connect `ups-core-01:iec_out5` (rear) $\rightarrow$ `sw-poe-core-01:ac_in` (rear) — _UPS IEC-5 -> USW-Pro-Max-24-PoE++ (450W Total)_.
- [ ] Patch **1.00m DC Barrel** [`pwr-ups-to-pve1`, `#27272A`]: Connect `ups-core-01:dc_out1` (rear) $\rightarrow$ `pve-node-01:dc_in` (rear) — _UPS 20V DC Out 1 -> Proxmox Node 01 (65W)_.
- [ ] Patch **1.50m DC Barrel** [`pwr-ups-to-pve2`, `#27272A`]: Connect `ups-core-01:dc_out2` (rear) $\rightarrow$ `pve-node-02:dc_in` (rear) — _UPS 20V DC Out 2 -> Proxmox Node 02 (65W)_.
