# 12U 19-Inch Enterprise Firewall, PoE++ & Proxmox HA Rack — Bill of Materials & Assembly Guide

## 1. Project & Validation Summary

- **Validation Status:** `VALID` (0 Errors, 0 Warnings)
- **Rack Enclosure:** 12U `19inch` (Rail Depth: `600 mm`, Rear Clearance: `80 mm`)
- **Total Mounted Devices:** 15 (12 rackmount units + 3 sub-modules)
- **Total Electrical Draw:** `554 W` system + `264 W` PoE
- **Mechanical Mass & Stability:** `56.5 kg` total weight | Center of Gravity $Y_{\text{CoG}} = 180.9\text{ mm}$ (`33.9%` of rack height)

## 2. Commercial Hardware BOM

| Slug | Manufacturer | Model | Category | Qty | Instances & Locations | Max Power (W) | Total Weight (g) |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| `apc-smart-ups-1500-2u` | APC | Smart-UPS 1500VA LCD RM 2U (SMT1500RMI2UC) | `ups` | 1 | `ups-core-01` (U1 front) | 45 W | 24000 g |
| `ubiquiti-unas-pro-2u` | Ubiquiti | UniFi UNAS Pro (7-Bay 2U 10G SFP+ Rackmount NAS) | `nas` | 1 | `nas-storage-01` (U3 front) | 160 W | 9200 g |
| `lenovo-thinkcentre-m920q` | Lenovo | ThinkCentre M920q Tiny (with Dual-Port PCIe NIC) | `mini-pc` | 2 | `pve-node-01` (U5 `carrier-compute-u5:mini-pc-bay-1`), `pve-node-02` (U5 `carrier-compute-u5:mini-pc-bay-2`) | 130 W | 2640 g |
| `raspberry-pi-5-poe-hat` | Raspberry Pi | Raspberry Pi 5 (8GB) with Official PoE+ HAT | `sbc` | 1 | `pi5-qdevice-01` (U5 `carrier-compute-u5:pi-poe-bay-1`) | 12 W | 110 g |
| `enterprise-19inch-dc-pdu-shelf-1u` | APC | NetShelter 19-Inch 1U Rear PDU & 20V DC Power Shelf | `pdu` | 1 | `pdu-rear-u5` (U5 rear) | 8 W | 2100 g |
| `generic-19inch-brush-panel-1u` | Generic | 19-Inch 1U High-Density Cable Management Brush Strip Panel | `brush-panel` | 2 | `brush-portal-u6` (U6 front), `brush-portal-u10` (U10 front) | 0 W | 560 g |
| `ubiquiti-udm-pro` | Ubiquiti | UniFi Dream Machine Pro (UDM-Pro) | `router` | 1 | `udm-pro-sec-01` (U7 front) | 33 W | 3900 g |
| `fortinet-fortigate-200f-ngfw-1u` | Fortinet | FortiGate 200F Enterprise Next-Gen Firewall (1U) | `router` | 1 | `fw-ngfw-01` (U8 front) | 68 W | 4300 g |
| `ubiquiti-usw-aggregation` | Ubiquiti | UniFi Switch Aggregation (USW-Aggregation 8x 10G SFP+) | `switch` | 1 | `sw-core-agg-01` (U9 front) | 30 W | 2650 g |
| `ubiquiti-usw-pro-max-24-poe` | Ubiquiti | UniFi Switch Pro Max 24 PoE (USW-Pro-Max-24-PoE) | `switch` | 1 | `sw-poe-core-01` (U11 front) | 50 W | 5100 g |
| `generic-19inch-patch-panel-24port-cat6a` | Generic | 19-Inch 1U 24-Port Cat6A Shielded Passthrough Patch Panel | `patch-panel` | 1 | `patch-ext-u12` (U12 front) | 0 W | 640 g |
| `enterprise-poe-field-demarcation-16port-1u` | Building Infrastructure | External Building LAN & PoE++ Field Demarcation Trunk (16x Cat6A Drops) | `patch-panel` | 1 | `ext-building-demarc` (U12 rear) | 18 W | 950 g |

## 3. 3D Print Queue (Fabrication List)

| Carrier Blueprint | Qty | Material | Total Filament (g) | Heat-Set Inserts (per unit) | Fasteners / Screws (per unit) | Source Model |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `3dprint-19inch-dual-minipc-poe-carrier-1u` (U5) | 1 | PETG-CF / ASA | 365 g | 8x M3x5x4mm | 8x M3x12mm Socket Head | — |

**Total Estimated 3D Filament Required:** `365 g`

## 4. Aggregated Cable Shopping List

| Cable Type | Commercial Length | Color Hex | Qty | Cable IDs & Purpose |
| :--- | :---: | :---: | :---: | :--- |
| `cat6a` | **0.25 m** (250 mm) | `#F59E0B` | 2 | `poe-front-patch-p13`, `poe-front-patch-p14` (4K PoE+ Camera-5 Patch, 4K PoE+ Camera-6 Patch) |
| `cat6a` | **0.25 m** (250 mm) | `#A855F7` | 2 | `poe-front-patch-p15`, `poe-front-patch-p16` (PoE+ Door Access-1 Patch, PoE+ Door Access-2 Patch) |
| `cat6a` | **0.25 m** (250 mm) | `#F43F5E` | 1 | `fw-ha-sync-to-udm` (FortiGate <-> UDM-Pro Management & Telemetry Interconnect) |
| `cat6a` | **0.30 m** (300 mm) | `#10B981` | 6 | `poe-front-patch-p3`, `poe-front-patch-p4`, `poe-front-patch-p5`, `poe-front-patch-p6`, `poe-front-patch-p7`, `poe-front-patch-p8` (Wi-Fi 7 PoE++ AP-1 Patch, Wi-Fi 7 PoE++ AP-2 Patch, Wi-Fi 7 PoE++ AP-3 Patch, Wi-Fi 7 PoE++ AP-4 Patch, Wi-Fi 7 PoE++ AP-5 Patch, Wi-Fi 7 PoE++ AP-6 Patch) |
| `cat6a` | **0.30 m** (300 mm) | `#F59E0B` | 4 | `poe-front-patch-p9`, `poe-front-patch-p10`, `poe-front-patch-p11`, `poe-front-patch-p12` (4K PoE+ Camera-1 Patch, 4K PoE+ Camera-2 Patch, 4K PoE+ Camera-3 Patch, 4K PoE+ Camera-4 Patch) |
| `cat6a` | **0.50 m** (500 mm) | `#14B8A6` | 1 | `rear-pve1-to-pve2-ceph` (2.5G Direct Ceph Storage Replication Heartbeat) |
| `cat6a` | **0.75 m** (750 mm) | `#EC4899` | 1 | `poe-sw-to-pi5-witness` (PoE+ Power & Quorum Link -> Pi 5 Witness (12W PoE)) |
| `cat6a` | **1.50 m** (1500 mm) | `#10B981` | 2 | `ext-drop-07`, `ext-drop-08` (Incoming Building Drop AP-5 (PoE++), Incoming Building Drop AP-6 (PoE++)) |
| `cat6a` | **1.50 m** (1500 mm) | `#F59E0B` | 6 | `ext-drop-09`, `ext-drop-10`, `ext-drop-11`, `ext-drop-12`, `ext-drop-13`, `ext-drop-14` (Incoming Building Drop CAM-1 (PoE+), Incoming Building Drop CAM-2 (PoE+), Incoming Building Drop CAM-3 (PoE+), Incoming Building Drop CAM-4 (PoE+), Incoming Building Drop CAM-5 (PoE+), Incoming Building Drop CAM-6 (PoE+)) |
| `cat6a` | **1.50 m** (1500 mm) | `#A855F7` | 2 | `ext-drop-15`, `ext-drop-16` (Incoming Building Drop DOOR-1 (PoE+), Incoming Building Drop DOOR-2 (PoE+)) |
| `cat6a` | **1.50 m** (1500 mm) | `#EF4444` | 1 | `wan1-patch-to-ngfw` (Primary Fiber WAN1 (ONT -> FortiGate WAN1)) |
| `cat6a` | **1.50 m** (1500 mm) | `#F97316` | 1 | `wan2-patch-to-ngfw` (Backup 5G/Cable WAN2 (Patch p2 -> FortiGate WAN2)) |
| `cat6a` | **1.50 m** (1500 mm) | `#2563EB` | 1 | `cross-pve2-to-poesw` (2.5G Proxmox Node 02 VM Trunk (via U10 Brush Portal)) |
| `cat6a` | **2.00 m** (2000 mm) | `#EF4444` | 2 | `ext-drop-01`, `ext-drop-02` (Incoming ISP WAN 1, Incoming ISP WAN 2) |
| `cat6a` | **2.00 m** (2000 mm) | `#10B981` | 4 | `ext-drop-03`, `ext-drop-04`, `ext-drop-05`, `ext-drop-06` (Incoming Building Drop AP-1 (PoE++), Incoming Building Drop AP-2 (PoE++), Incoming Building Drop AP-3 (PoE++), Incoming Building Drop AP-4 (PoE++)) |
| `cat6a` | **2.00 m** (2000 mm) | `#2563EB` | 1 | `cross-pve1-to-poesw` (2.5G Proxmox Node 01 VM Trunk (via U10 Brush Portal)) |
| `power-c13-c14` | **0.75 m** (750 mm) | `#18181B` | 1 | `pwr-ups-to-nas` (UPS IEC-2 -> UNAS Pro 2U (160W)) |
| `power-c13-c14` | **1.00 m** (1000 mm) | `#DC2626` | 1 | `pwr-ups-to-ngfw` (UPS IEC-4 -> FortiGate 200F NGFW (68W)) |
| `power-c13-c14` | **1.50 m** (1500 mm) | `#18181B` | 4 | `pwr-ups-to-pdu`, `pwr-ups-to-udm`, `pwr-ups-to-agg`, `pwr-ups-to-poesw` (UPS IEC-1 -> Rear DC PDU Mains In, UPS IEC-3 -> UDM-Pro (33W), UPS IEC-5 -> USW-Aggregation 10G (30W), UPS IEC-6 -> USW-Pro-Max-24-PoE++ (450W Total)) |
| `power-dc-5525` | **1.00 m** (1000 mm) | `#27272A` | 1 | `pwr-pdu-to-pve1` (20V DC Out 1 -> Proxmox Node 01 (65W)) |
| `power-dc-5525` | **1.50 m** (1500 mm) | `#27272A` | 1 | `pwr-pdu-to-pve2` (20V DC Out 2 -> Proxmox Node 02 (65W)) |
| `sfp-plus-dac` | **0.25 m** (250 mm) | `#06B6D4` | 1 | `dac-ngfw-to-agg-1` (10G SFP+ LACP Firewall Trunk 1) |
| `sfp-plus-dac` | **0.30 m** (300 mm) | `#06B6D4` | 1 | `dac-ngfw-to-agg-2` (10G SFP+ LACP Firewall Trunk 2) |
| `sfp-plus-dac` | **0.50 m** (500 mm) | `#3B82F6` | 2 | `dac-poesw-to-agg-1`, `dac-poesw-to-agg-2` (10G SFP+ LACP PoE Switch Uplink 1, 10G SFP+ LACP PoE Switch Uplink 2) |
| `sfp-plus-dac` | **0.75 m** (750 mm) | `#38BDF8` | 1 | `dac-udm-to-agg` (10G SFP+ Protect NVR & Controller Trunk) |
| `sfp-plus-dac` | **1.50 m** (1500 mm) | `#6366F1` | 1 | `dac-nas-to-agg-cross` (10G SFP+ UNAS Pro Storage Trunk (via U6 Brush Portal)) |

## 5. Step-by-Step Assembly & Patching Checklist

### Phase A: Mechanical Mounting (Bottom-Up for Stability)
- [ ] Mount **Smart-UPS 1500VA LCD RM 2U (SMT1500RMI2UC)** (`ups-core-01`) at **U1** (FRONT rails).
- [ ] Mount **UniFi UNAS Pro (7-Bay 2U 10G SFP+ Rackmount NAS)** (`nas-storage-01`) at **U3** (FRONT rails).
- [ ] Mount **19-Inch 1U Carrier for 2x 1L Proxmox Nodes + 1x PoE Pi5 Witness** (`carrier-compute-u5`) at **U5** (FRONT rails).
  - [ ] Insert sub-module **ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)** (`pve-node-01`) into carrier slot `carrier-compute-u5:mini-pc-bay-1`.
  - [ ] Insert sub-module **ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)** (`pve-node-02`) into carrier slot `carrier-compute-u5:mini-pc-bay-2`.
  - [ ] Insert sub-module **Raspberry Pi 5 (8GB) with Official PoE+ HAT** (`pi5-qdevice-01`) into carrier slot `carrier-compute-u5:pi-poe-bay-1`.
- [ ] Mount **NetShelter 19-Inch 1U Rear PDU & 20V DC Power Shelf** (`pdu-rear-u5`) at **U5** (REAR rails).
- [ ] Mount **19-Inch 1U High-Density Cable Management Brush Strip Panel** (`brush-portal-u6`) at **U6** (FRONT rails).
- [ ] Mount **UniFi Dream Machine Pro (UDM-Pro)** (`udm-pro-sec-01`) at **U7** (FRONT rails).
- [ ] Mount **FortiGate 200F Enterprise Next-Gen Firewall (1U)** (`fw-ngfw-01`) at **U8** (FRONT rails).
- [ ] Mount **UniFi Switch Aggregation (USW-Aggregation 8x 10G SFP+)** (`sw-core-agg-01`) at **U9** (FRONT rails).
- [ ] Mount **19-Inch 1U High-Density Cable Management Brush Strip Panel** (`brush-portal-u10`) at **U10** (FRONT rails).
- [ ] Mount **UniFi Switch Pro Max 24 PoE (USW-Pro-Max-24-PoE)** (`sw-poe-core-01`) at **U11** (FRONT rails).
- [ ] Mount **19-Inch 1U 24-Port Cat6A Shielded Passthrough Patch Panel** (`patch-ext-u12`) at **U12** (FRONT rails).
- [ ] Mount **External Building LAN & PoE++ Field Demarcation Trunk (16x Cat6A Drops)** (`ext-building-demarc`) at **U12** (REAR rails).

### Phase B: Power & Network Cable Patching
- [ ] Patch **2.00m Cat6A** [`ext-drop-01`, `#EF4444`]: Connect `ext-building-demarc:ext1` (rear) $\rightarrow$ `patch-ext-u12:p1` (rear) — _Incoming ISP WAN 1_.
- [ ] Patch **2.00m Cat6A** [`ext-drop-02`, `#EF4444`]: Connect `ext-building-demarc:ext2` (rear) $\rightarrow$ `patch-ext-u12:p2` (rear) — _Incoming ISP WAN 2_.
- [ ] Patch **2.00m Cat6A** [`ext-drop-03`, `#10B981`]: Connect `ext-building-demarc:ext3` (rear) $\rightarrow$ `patch-ext-u12:p3` (rear) — _Incoming Building Drop AP-1 (PoE++)_.
- [ ] Patch **2.00m Cat6A** [`ext-drop-04`, `#10B981`]: Connect `ext-building-demarc:ext4` (rear) $\rightarrow$ `patch-ext-u12:p4` (rear) — _Incoming Building Drop AP-2 (PoE++)_.
- [ ] Patch **2.00m Cat6A** [`ext-drop-05`, `#10B981`]: Connect `ext-building-demarc:ext5` (rear) $\rightarrow$ `patch-ext-u12:p5` (rear) — _Incoming Building Drop AP-3 (PoE++)_.
- [ ] Patch **2.00m Cat6A** [`ext-drop-06`, `#10B981`]: Connect `ext-building-demarc:ext6` (rear) $\rightarrow$ `patch-ext-u12:p6` (rear) — _Incoming Building Drop AP-4 (PoE++)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-07`, `#10B981`]: Connect `ext-building-demarc:ext7` (rear) $\rightarrow$ `patch-ext-u12:p7` (rear) — _Incoming Building Drop AP-5 (PoE++)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-08`, `#10B981`]: Connect `ext-building-demarc:ext8` (rear) $\rightarrow$ `patch-ext-u12:p8` (rear) — _Incoming Building Drop AP-6 (PoE++)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-09`, `#F59E0B`]: Connect `ext-building-demarc:ext9` (rear) $\rightarrow$ `patch-ext-u12:p9` (rear) — _Incoming Building Drop CAM-1 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-10`, `#F59E0B`]: Connect `ext-building-demarc:ext10` (rear) $\rightarrow$ `patch-ext-u12:p10` (rear) — _Incoming Building Drop CAM-2 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-11`, `#F59E0B`]: Connect `ext-building-demarc:ext11` (rear) $\rightarrow$ `patch-ext-u12:p11` (rear) — _Incoming Building Drop CAM-3 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-12`, `#F59E0B`]: Connect `ext-building-demarc:ext12` (rear) $\rightarrow$ `patch-ext-u12:p12` (rear) — _Incoming Building Drop CAM-4 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-13`, `#F59E0B`]: Connect `ext-building-demarc:ext13` (rear) $\rightarrow$ `patch-ext-u12:p13` (rear) — _Incoming Building Drop CAM-5 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-14`, `#F59E0B`]: Connect `ext-building-demarc:ext14` (rear) $\rightarrow$ `patch-ext-u12:p14` (rear) — _Incoming Building Drop CAM-6 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-15`, `#A855F7`]: Connect `ext-building-demarc:ext15` (rear) $\rightarrow$ `patch-ext-u12:p15` (rear) — _Incoming Building Drop DOOR-1 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`ext-drop-16`, `#A855F7`]: Connect `ext-building-demarc:ext16` (rear) $\rightarrow$ `patch-ext-u12:p16` (rear) — _Incoming Building Drop DOOR-2 (PoE+)_.
- [ ] Patch **1.50m Cat6A** [`wan1-patch-to-ngfw`, `#EF4444`]: Connect `patch-ext-u12:p1` (front) $\rightarrow$ `fw-ngfw-01:wan1` (front) — _Primary Fiber WAN1 (ONT -> FortiGate WAN1)_.
- [ ] Patch **1.50m Cat6A** [`wan2-patch-to-ngfw`, `#F97316`]: Connect `patch-ext-u12:p2` (front) $\rightarrow$ `fw-ngfw-01:wan2` (front) — _Backup 5G/Cable WAN2 (Patch p2 -> FortiGate WAN2)_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p3`, `#10B981`]: Connect `patch-ext-u12:p3` (front) $\rightarrow$ `sw-poe-core-01:eth3` (front) — _Wi-Fi 7 PoE++ AP-1 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p4`, `#10B981`]: Connect `patch-ext-u12:p4` (front) $\rightarrow$ `sw-poe-core-01:eth4` (front) — _Wi-Fi 7 PoE++ AP-2 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p5`, `#10B981`]: Connect `patch-ext-u12:p5` (front) $\rightarrow$ `sw-poe-core-01:eth5` (front) — _Wi-Fi 7 PoE++ AP-3 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p6`, `#10B981`]: Connect `patch-ext-u12:p6` (front) $\rightarrow$ `sw-poe-core-01:eth6` (front) — _Wi-Fi 7 PoE++ AP-4 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p7`, `#10B981`]: Connect `patch-ext-u12:p7` (front) $\rightarrow$ `sw-poe-core-01:eth7` (front) — _Wi-Fi 7 PoE++ AP-5 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p8`, `#10B981`]: Connect `patch-ext-u12:p8` (front) $\rightarrow$ `sw-poe-core-01:eth8` (front) — _Wi-Fi 7 PoE++ AP-6 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p9`, `#F59E0B`]: Connect `patch-ext-u12:p9` (front) $\rightarrow$ `sw-poe-core-01:eth9` (front) — _4K PoE+ Camera-1 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p10`, `#F59E0B`]: Connect `patch-ext-u12:p10` (front) $\rightarrow$ `sw-poe-core-01:eth10` (front) — _4K PoE+ Camera-2 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p11`, `#F59E0B`]: Connect `patch-ext-u12:p11` (front) $\rightarrow$ `sw-poe-core-01:eth11` (front) — _4K PoE+ Camera-3 Patch_.
- [ ] Patch **0.30m Cat6A** [`poe-front-patch-p12`, `#F59E0B`]: Connect `patch-ext-u12:p12` (front) $\rightarrow$ `sw-poe-core-01:eth12` (front) — _4K PoE+ Camera-4 Patch_.
- [ ] Patch **0.25m Cat6A** [`poe-front-patch-p13`, `#F59E0B`]: Connect `patch-ext-u12:p13` (front) $\rightarrow$ `sw-poe-core-01:eth13` (front) — _4K PoE+ Camera-5 Patch_.
- [ ] Patch **0.25m Cat6A** [`poe-front-patch-p14`, `#F59E0B`]: Connect `patch-ext-u12:p14` (front) $\rightarrow$ `sw-poe-core-01:eth14` (front) — _4K PoE+ Camera-6 Patch_.
- [ ] Patch **0.25m Cat6A** [`poe-front-patch-p15`, `#A855F7`]: Connect `patch-ext-u12:p15` (front) $\rightarrow$ `sw-poe-core-01:eth15` (front) — _PoE+ Door Access-1 Patch_.
- [ ] Patch **0.25m Cat6A** [`poe-front-patch-p16`, `#A855F7`]: Connect `patch-ext-u12:p16` (front) $\rightarrow$ `sw-poe-core-01:eth16` (front) — _PoE+ Door Access-2 Patch_.
- [ ] Patch **0.25m 10G DAC** [`dac-ngfw-to-agg-1`, `#06B6D4`]: Connect `fw-ngfw-01:sfp_plus1` (front) $\rightarrow$ `sw-core-agg-01:sfp1` (front) — _10G SFP+ LACP Firewall Trunk 1_.
- [ ] Patch **0.30m 10G DAC** [`dac-ngfw-to-agg-2`, `#06B6D4`]: Connect `fw-ngfw-01:sfp_plus2` (front) $\rightarrow$ `sw-core-agg-01:sfp2` (front) — _10G SFP+ LACP Firewall Trunk 2_.
- [ ] Patch **0.75m 10G DAC** [`dac-udm-to-agg`, `#38BDF8`]: Connect `udm-pro-sec-01:sfp_lan11` (front) $\rightarrow$ `sw-core-agg-01:sfp3` (front) — _10G SFP+ Protect NVR & Controller Trunk_.
- [ ] Patch **0.50m 10G DAC** [`dac-poesw-to-agg-1`, `#3B82F6`]: Connect `sw-poe-core-01:sfp1` (front) $\rightarrow$ `sw-core-agg-01:sfp7` (front) — _10G SFP+ LACP PoE Switch Uplink 1_.
- [ ] Patch **0.50m 10G DAC** [`dac-poesw-to-agg-2`, `#3B82F6`]: Connect `sw-poe-core-01:sfp2` (front) $\rightarrow$ `sw-core-agg-01:sfp8` (front) — _10G SFP+ LACP PoE Switch Uplink 2_.
- [ ] Patch **1.50m 10G DAC** [`dac-nas-to-agg-cross`, `#6366F1`]: Connect `sw-core-agg-01:sfp4` (front) $\rightarrow$ `nas-storage-01:sfp_plus1` (rear) — _10G SFP+ UNAS Pro Storage Trunk (via U6 Brush Portal)_.
- [ ] Patch **0.75m Cat6A** [`poe-sw-to-pi5-witness`, `#EC4899`]: Connect `sw-poe-core-01:eth17` (front) $\rightarrow$ `pi5-qdevice-01:eth0` (front) — _PoE+ Power & Quorum Link -> Pi 5 Witness (12W PoE)_.
- [ ] Patch **2.00m Cat6A** [`cross-pve1-to-poesw`, `#2563EB`]: Connect `sw-poe-core-01:eth18` (front) $\rightarrow$ `pve-node-01:eth1` (rear) — _2.5G Proxmox Node 01 VM Trunk (via U10 Brush Portal)_.
- [ ] Patch **1.50m Cat6A** [`cross-pve2-to-poesw`, `#2563EB`]: Connect `sw-poe-core-01:eth19` (front) $\rightarrow$ `pve-node-02:eth1` (rear) — _2.5G Proxmox Node 02 VM Trunk (via U10 Brush Portal)_.
- [ ] Patch **0.50m Cat6A** [`rear-pve1-to-pve2-ceph`, `#14B8A6`]: Connect `pve-node-01:eth2` (rear) $\rightarrow$ `pve-node-02:eth2` (rear) — _2.5G Direct Ceph Storage Replication Heartbeat_.
- [ ] Patch **0.25m Cat6A** [`fw-ha-sync-to-udm`, `#F43F5E`]: Connect `fw-ngfw-01:eth8` (front) $\rightarrow$ `udm-pro-sec-01:eth8` (front) — _FortiGate <-> UDM-Pro Management & Telemetry Interconnect_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-pdu`, `#18181B`]: Connect `ups-core-01:iec_out1` (rear) $\rightarrow$ `pdu-rear-u5:ac_in` (rear) — _UPS IEC-1 -> Rear DC PDU Mains In_.
- [ ] Patch **0.75m IEC C13-C14** [`pwr-ups-to-nas`, `#18181B`]: Connect `ups-core-01:iec_out2` (rear) $\rightarrow$ `nas-storage-01:ac_in` (rear) — _UPS IEC-2 -> UNAS Pro 2U (160W)_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-udm`, `#18181B`]: Connect `ups-core-01:iec_out3` (rear) $\rightarrow$ `udm-pro-sec-01:ac_in` (rear) — _UPS IEC-3 -> UDM-Pro (33W)_.
- [ ] Patch **1.00m IEC C13-C14** [`pwr-ups-to-ngfw`, `#DC2626`]: Connect `ups-core-01:iec_out4` (rear) $\rightarrow$ `fw-ngfw-01:ac_in` (rear) — _UPS IEC-4 -> FortiGate 200F NGFW (68W)_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-agg`, `#18181B`]: Connect `ups-core-01:iec_out5` (rear) $\rightarrow$ `sw-core-agg-01:ac_in` (rear) — _UPS IEC-5 -> USW-Aggregation 10G (30W)_.
- [ ] Patch **1.50m IEC C13-C14** [`pwr-ups-to-poesw`, `#18181B`]: Connect `ups-core-01:iec_out6` (rear) $\rightarrow$ `sw-poe-core-01:ac_in` (rear) — _UPS IEC-6 -> USW-Pro-Max-24-PoE++ (450W Total)_.
- [ ] Patch **1.00m DC Barrel** [`pwr-pdu-to-pve1`, `#27272A`]: Connect `pdu-rear-u5:dc_out1` (rear) $\rightarrow$ `pve-node-01:dc_in` (rear) — _20V DC Out 1 -> Proxmox Node 01 (65W)_.
- [ ] Patch **1.50m DC Barrel** [`pwr-pdu-to-pve2`, `#27272A`]: Connect `pdu-rear-u5:dc_out2` (rear) $\rightarrow$ `pve-node-02:dc_in` (rear) — _20V DC Out 2 -> Proxmox Node 02 (65W)_.
