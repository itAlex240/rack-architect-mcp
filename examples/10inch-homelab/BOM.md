# 8U 10-Inch Proxmox & UniFi Homelab — Bill of Materials & Assembly Guide

## 1. Project & Validation Summary

- **Validation Status:** `VALID` (0 Errors, 0 Warnings)
- **Rack Enclosure:** 8U `10inch` (Rail Depth: `240 mm`, Rear Clearance: `60 mm`)
- **Total Mounted Devices:** 18 (8 rackmount units + 10 sub-modules)
- **Total Electrical Draw:** `175.1 W` system + `0 W` PoE
- **Mechanical Mass & Stability:** `8.5 kg` total weight | Center of Gravity $Y_{\text{CoG}} = 121.4\text{ mm}$ (`34.1%` of rack height)

## 2. Commercial Hardware BOM

| Slug | Manufacturer | Model | Category | Qty | Instances & Locations | Max Power (W) | Total Weight (g) |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| `cyberpower-10inch-ups-1u` | CyberPower | 10-Inch Compact Lithium UPS 500VA/300W 1U | `ups` | 1 | `ups-u1` (U1 front) | 15 W | 3200 g |
| `digitus-10inch-pdu-4way-schuko` | Digitus | 10-Inch 1U 4-Way Socket Strip (DN-95411) | `pdu` | 1 | `pdu-u2-rear` (U2 rear) | 0 W | 480 g |
| `ubiquiti-ucg-max` | Ubiquiti | Cloud Gateway Max (UCG-Max) | `router` | 1 | `ucg-max` (U3 `carrier-u3:gateway-bay`) | 16.1 W | 519 g |
| `keystone-rj45-cat6a-coupler` | Generic | Shielded RJ45 Cat6A Passthrough Keystone Coupler | `keystone-module` | 7 | `ks-u3-wan` (U3 `carrier-u3:keystone-1`), `ks-u3-uplink` (U3 `carrier-u3:keystone-2`), `ks-u3-aux` (U3 `carrier-u3:keystone-3`), `ks-u4-eth1` (U4 `carrier-u4:keystone-1`), `ks-u4-ceph` (U4 `carrier-u4:keystone-2`), `ks-u5-eth1` (U5 `carrier-u5:keystone-1`), `ks-u5-ceph` (U5 `carrier-u5:keystone-2`) | 0 W | 126 g |
| `lenovo-thinkcentre-m920q` | Lenovo | ThinkCentre M920q Tiny (with Dual-Port PCIe NIC) | `mini-pc` | 2 | `pve-node-01` (U4 `carrier-u4:left-mini-pc-bay`), `pve-node-02` (U5 `carrier-u5:left-mini-pc-bay`) | 130 W | 2640 g |
| `generic-10inch-brush-panel-1u` | Generic | 10-Inch 1U Cable Management Brush Strip Panel | `brush-panel` | 1 | `brush-u6` (U6 front) | 0 W | 160 g |
| `deskpi-10inch-patch-panel-12port` | DeskPi | RackMate 10-Inch 12-Port Cat6A Passthrough Patch Panel | `patch-panel` | 1 | `patch-u7` (U7 front) | 0 W | 310 g |
| `ubiquiti-usw-flex-2-5g-8-poe` | Ubiquiti | UniFi Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) | `switch` | 1 | `sw-u8` (U8 front) | 14 W | 567 g |

### 2.1 Geräte-Erklärungen & Montage-Hinweise

- **`ups-u1` (CyberPower 10-Inch Compact Lithium UPS 500VA/300W 1U — Hostname: `ups-core-01`)**: Kompakte 10-Zoll 1U Unterbrechungsfreie Stromversorgung (USV, 500VA / 300W Lithium) mit 4x IEC-C13 Batterie-Ausgängen hinten. Schützt das gesamte Mini-Rack bei Stromausfall und versorgt die hintere Steckdosenleiste (PDU) sowie das PoE-Netzteil.
- **`pdu-u2-rear` (Digitus 10-Inch 1U 4-Way Socket Strip (DN-95411) — Hostname: `pdu-rear-01`)**: 10-Zoll 1U 4-fach Schuko-Steckdosenleiste (PDU, Aluminiumgehäuse, bis 3600W). Wird meist rückseitig im Rack montiert, um die Netzteile von Mini-PCs, Routern und Switches zentral über die USV mit Strom zu versorgen.
- **`carrier-u3` (Community 3D-Print 10-Inch 1U Carrier for UniFi Cloud Gateway Ultra/Max + 3x Keystone — Hostname: `carrier-gateway-u3`)**: 3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS) passgenau für das Ubiquiti Cloud Gateway Max/Ultra (UCG-Max / UCG-Ultra) inklusive Sichtfenster für das Front-OLED und 3x Keystone-Buchsen, um die hinteren WAN/LAN-Ports nach vorne zu führen.
- **`ucg-max` (Ubiquiti Cloud Gateway Max (UCG-Max) — Hostname: `gw-unifi-max`)**: Kompaktes Multi-Gigabit UniFi Cloud Gateway & Firewall (UCG-Max) mit 5x 2.5GbE RJ45 Ports (1x WAN, 4x LAN), NVMe-Speicher für UniFi Protect und Front-OLED-Display. Da es ein reines Desktop-Gehäuse (141.8×30×127.6mm) ohne Rack-Ohren ist, wird es als Sub-Modul in den 3D-gedruckten 10-Zoll-Carrier eingesetzt.
- **`carrier-u4` (Community 3D-Print 10-Inch 1U Carrier for Lenovo Tiny + 2x Keystone — Hostname: `carrier-pve01-u4`)**: 3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS, offenes L-Tray) für 1x 1-Liter Mini-PC (Lenovo ThinkCentre Tiny / Dell OptiPlex Micro / HP EliteDesk Mini) plus 2x RJ45-Keystone-Buchsen rechts daneben.
- **`pve-node-01` (Lenovo ThinkCentre M920q Tiny (with Dual-Port PCIe NIC) — Hostname: `pve-node-01`)**: Beliebter 1-Liter Homelab- & Enterprise-Mini-PC (Lenovo ThinkCentre M920q Tiny) mit PCIe-Riser-Slot für eine zusätzliche Dual-Port 2.5GbE-Netzwerkkarte (insgesamt 3x RJ45). Wird als Sub-Modul in einen 3D-gedruckten 1U-Carrier eingeschoben.
- **`carrier-u5` (Community 3D-Print 10-Inch 1U Carrier for Lenovo Tiny + 2x Keystone — Hostname: `carrier-pve02-u5`)**: 3D-druckbarer 10-Zoll 1U Modulträger (PETG/ABS, offenes L-Tray) für 1x 1-Liter Mini-PC (Lenovo ThinkCentre Tiny / Dell OptiPlex Micro / HP EliteDesk Mini) plus 2x RJ45-Keystone-Buchsen rechts daneben.
- **`pve-node-02` (Lenovo ThinkCentre M920q Tiny (with Dual-Port PCIe NIC) — Hostname: `pve-node-02`)**: Beliebter 1-Liter Homelab- & Enterprise-Mini-PC (Lenovo ThinkCentre M920q Tiny) mit PCIe-Riser-Slot für eine zusätzliche Dual-Port 2.5GbE-Netzwerkkarte (insgesamt 3x RJ45). Wird als Sub-Modul in einen 3D-gedruckten 1U-Carrier eingeschoben.
- **`brush-u6` (Generic 10-Inch 1U Cable Management Brush Strip Panel — Hostname: `cable-brush-u6`)**: 10-Zoll 1U Bürstenleiste (Brush Panel) mit zweireihigen Nylonborsten. Ermöglicht die saubere Durchführung von Patch- und Stromkabeln zwischen Vorder- und Rückseite des Racks ohne Staub- oder Luftkurzschluss.
- **`patch-u7` (DeskPi RackMate 10-Inch 12-Port Cat6A Passthrough Patch Panel — Hostname: `patch-panel-u7`)**: Passives 10-Zoll 1U Cat6A Durchgangs-Patchpanel mit 12 geschirmten RJ45-Buchsen (vorne & hinten steckbar). Dient als sauberer Übergabepunkt zwischen den von hinten kommenden Gerätekabeln/Hausleitungen und den kurzen Patchkabeln zum Switch.
- **`sw-u8` (Ubiquiti UniFi Flex 2.5G PoE (USW-Flex-2.5G-8-PoE) — Hostname: `sw-core-flex25g`)**: Kompakter 8-Port 2.5-Gbit/s PoE++ Switch (bis 196W PoE-Budget) mit 10G SFP+ & 10G RJ45 Uplink-Port zur Versorgung von Access Points, Kameras und Mini-PCs. Wichtiger Montage-Hinweis: Von Haus aus ein reines Desktop-/Wandgerät aus Polycarbonat (212.9×32.5×99.4mm ohne eigene Rack-Ohren) — sitzt im 10-Zoll-Rack daher in einer 3D-gedruckten 1U-PETG-Aufnahmehalterung (Cradle) oder auf einem 1U-Fachboden.

## 3. 3D Print Queue (Fabrication List)

| Carrier Blueprint | Qty | Material | Total Filament (g) | Heat-Set Inserts (per unit) | Fasteners / Screws (per unit) | Source Model |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `3dprint-10inch-ucg-ultra-plus-3keystone` (U3) | 1 | PETG / ABS | 150 g | 4x M3x5x4mm | 4x M3x12mm Socket Head | https://www.printables.com/model/10inch-ucg-ultra-max-3keystone |
| `3dprint-10inch-lenovo-tiny-plus-2keystone` (U4, U5) | 2 | PETG / ABS | 330 g | 4x M3x5x4mm | 4x M3x10mm Socket Head | https://www.printables.com/model/10inch-lenovo-tiny-2keystone |

**Total Estimated 3D Filament Required:** `480 g`

## 4. Aggregated Cable Shopping List

| Cable Type | Commercial Length | Color Hex | Qty | Cable IDs & Purpose |
| :--- | :---: | :---: | :---: | :--- |
| `cat6a` | **0.15 m** (150 mm) | `#A855F7` | 1 | `trunk-pve-ceph-direct` (PVE-01 ETH2 <-> PVE-02 ETH2 (2.5G Ceph Cluster)) |
| `cat6a` | **0.15 m** (150 mm) | `#3B82F6` | 1 | `patch-front-p1-sw1` (Patch P1 -> Switch Port 1 (Gateway Uplink)) |
| `cat6a` | **0.15 m** (150 mm) | `#10B981` | 2 | `patch-front-p2-sw2`, `patch-front-p3-sw3` (Patch P2 -> Switch Port 2 (PVE-01 2.5G), Patch P3 -> Switch Port 3 (PVE-02 2.5G)) |
| `cat6a` | **0.15 m** (150 mm) | `#6366F1` | 2 | `patch-front-p4-sw4`, `patch-front-p5-sw5` (Patch P4 -> Switch Port 4 (PVE-01 Mgmt), Patch P5 -> Switch Port 5 (PVE-02 Mgmt)) |
| `cat6a` | **0.30 m** (300 mm) | `#EC4899` | 1 | `trunk-ucg-wan-to-ks` (UCG-Max WAN -> U3 Keystone 1 (Rear)) |
| `cat6a` | **0.75 m** (750 mm) | `#10B981` | 2 | `trunk-pve1-eth1-to-patch2`, `trunk-pve2-eth1-to-patch3` (PVE-01 2.5G ETH1 -> Patch P2 (Rear), PVE-02 2.5G ETH1 -> Patch P3 (Rear)) |
| `cat6a` | **0.75 m** (750 mm) | `#6366F1` | 1 | `trunk-pve2-eth0-to-patch5` (PVE-02 Mgmt ETH0 -> Patch P5 (Rear)) |
| `cat6a` | **1.00 m** (1000 mm) | `#3B82F6` | 1 | `trunk-ucg-lan1-to-patch1` (UCG-Max LAN1 -> Patch P1 (Rear)) |
| `cat6a` | **1.00 m** (1000 mm) | `#6366F1` | 1 | `trunk-pve1-eth0-to-patch4` (PVE-01 Mgmt ETH0 -> Patch P4 (Rear)) |
| `cat6a` | **1.00 m** (1000 mm) | `#06B6D4` | 1 | `cross-sw6-to-ucg-lan2` (Switch Port 6 (Front) -> U6 Brush Portal -> UCG-Max LAN2 (Rear)) |
| `power-c13-c14` | **1.00 m** (1000 mm) | `#EF4444` | 1 | `pwr-ups-to-sw` (UPS C13-2 -> USW-Flex-2.5G) |
| `power-dc-5525` | **0.50 m** (500 mm) | `#F59E0B` | 2 | `pwr-pdu-to-pve1`, `pwr-pdu-to-pve2` (PDU Schuko 2 -> PVE-01 20V DC Brick, PDU Schuko 3 -> PVE-02 20V DC Brick) |
| `power-schuko-c13` | **0.25 m** (250 mm) | `#EF4444` | 1 | `pwr-ups-to-pdu` (UPS C13-1 -> Rear PDU Input) |
| `power-usb-c` | **0.75 m** (750 mm) | `#F97316` | 1 | `pwr-pdu-to-ucg` (PDU Schuko 1 -> UCG-Max USB-C PD) |

## 5. Step-by-Step Assembly & Patching Checklist

### Phase A: Mechanical Mounting (Bottom-Up for Stability)
- [ ] Mount **10-Inch Compact Lithium UPS 500VA/300W 1U** (`ups-u1`) at **U1** (FRONT rails).
- [ ] Mount **10-Inch 1U 4-Way Socket Strip (DN-95411)** (`pdu-u2-rear`) at **U2** (REAR rails).
- [ ] Mount **10-Inch 1U Carrier for UniFi Cloud Gateway Ultra/Max + 3x Keystone** (`carrier-u3`) at **U3** (FRONT rails).
  - [ ] Insert sub-module **Cloud Gateway Max (UCG-Max)** (`ucg-max`) into carrier slot `carrier-u3:gateway-bay`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u3-wan`) into carrier slot `carrier-u3:keystone-1`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u3-uplink`) into carrier slot `carrier-u3:keystone-2`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u3-aux`) into carrier slot `carrier-u3:keystone-3`.
- [ ] Mount **10-Inch 1U Carrier for Lenovo Tiny + 2x Keystone** (`carrier-u4`) at **U4** (FRONT rails).
  - [ ] Insert sub-module **ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)** (`pve-node-01`) into carrier slot `carrier-u4:left-mini-pc-bay`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u4-eth1`) into carrier slot `carrier-u4:keystone-1`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u4-ceph`) into carrier slot `carrier-u4:keystone-2`.
- [ ] Mount **10-Inch 1U Carrier for Lenovo Tiny + 2x Keystone** (`carrier-u5`) at **U5** (FRONT rails).
  - [ ] Insert sub-module **ThinkCentre M920q Tiny (with Dual-Port PCIe NIC)** (`pve-node-02`) into carrier slot `carrier-u5:left-mini-pc-bay`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u5-eth1`) into carrier slot `carrier-u5:keystone-1`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u5-ceph`) into carrier slot `carrier-u5:keystone-2`.
- [ ] Mount **10-Inch 1U Cable Management Brush Strip Panel** (`brush-u6`) at **U6** (FRONT rails).
- [ ] Mount **RackMate 10-Inch 12-Port Cat6A Passthrough Patch Panel** (`patch-u7`) at **U7** (FRONT rails).
- [ ] Mount **UniFi Flex 2.5G PoE (USW-Flex-2.5G-8-PoE)** (`sw-u8`) at **U8** (FRONT rails).

### Phase B: Power & Network Cable Patching
- [ ] Patch **0.25m Schuko-C13** [`pwr-ups-to-pdu`, `#EF4444`]: Connect `ups-u1:iec_out1` (rear) $\rightarrow$ `pdu-u2-rear:mains_in` — _UPS C13-1 -> Rear PDU Input_.
- [ ] Patch **1.00m IEC C13-C14** [`pwr-ups-to-sw`, `#EF4444`]: Connect `ups-u1:iec_out2` (rear) $\rightarrow$ `sw-u8:pwr_in` (rear) — _UPS C13-2 -> USW-Flex-2.5G_.
- [ ] Patch **0.75m USB-C PD** [`pwr-pdu-to-ucg`, `#F97316`]: Connect `pdu-u2-rear:outlet1` $\rightarrow$ `ucg-max:usbc_pwr` (rear) — _PDU Schuko 1 -> UCG-Max USB-C PD_.
- [ ] Patch **0.50m DC Barrel** [`pwr-pdu-to-pve1`, `#F59E0B`]: Connect `pdu-u2-rear:outlet2` $\rightarrow$ `pve-node-01:dc_in` (rear) — _PDU Schuko 2 -> PVE-01 20V DC Brick_.
- [ ] Patch **0.50m DC Barrel** [`pwr-pdu-to-pve2`, `#F59E0B`]: Connect `pdu-u2-rear:outlet3` $\rightarrow$ `pve-node-02:dc_in` (rear) — _PDU Schuko 3 -> PVE-02 20V DC Brick_.
- [ ] Patch **1.00m Cat6A** [`trunk-ucg-lan1-to-patch1`, `#3B82F6`]: Connect `ucg-max:lan1` (rear) $\rightarrow$ `patch-u7:p1` (rear) — _UCG-Max LAN1 -> Patch P1 (Rear)_.
- [ ] Patch **0.75m Cat6A** [`trunk-pve1-eth1-to-patch2`, `#10B981`]: Connect `pve-node-01:eth1` (rear) $\rightarrow$ `patch-u7:p2` (rear) — _PVE-01 2.5G ETH1 -> Patch P2 (Rear)_.
- [ ] Patch **0.75m Cat6A** [`trunk-pve2-eth1-to-patch3`, `#10B981`]: Connect `pve-node-02:eth1` (rear) $\rightarrow$ `patch-u7:p3` (rear) — _PVE-02 2.5G ETH1 -> Patch P3 (Rear)_.
- [ ] Patch **1.00m Cat6A** [`trunk-pve1-eth0-to-patch4`, `#6366F1`]: Connect `pve-node-01:eth0` (rear) $\rightarrow$ `patch-u7:p4` (rear) — _PVE-01 Mgmt ETH0 -> Patch P4 (Rear)_.
- [ ] Patch **0.75m Cat6A** [`trunk-pve2-eth0-to-patch5`, `#6366F1`]: Connect `pve-node-02:eth0` (rear) $\rightarrow$ `patch-u7:p5` (rear) — _PVE-02 Mgmt ETH0 -> Patch P5 (Rear)_.
- [ ] Patch **0.30m Cat6A** [`trunk-ucg-wan-to-ks`, `#EC4899`]: Connect `ucg-max:wan` (rear) $\rightarrow$ `ks-u3-wan:coupler` (rear) — _UCG-Max WAN -> U3 Keystone 1 (Rear)_.
- [ ] Patch **0.15m Cat6A** [`trunk-pve-ceph-direct`, `#A855F7`]: Connect `pve-node-01:eth2` (rear) $\rightarrow$ `pve-node-02:eth2` (rear) — _PVE-01 ETH2 <-> PVE-02 ETH2 (2.5G Ceph Cluster)_.
- [ ] Patch **0.15m Cat6A** [`patch-front-p1-sw1`, `#3B82F6`]: Connect `patch-u7:p1` (front) $\rightarrow$ `sw-u8:eth1` (front) — _Patch P1 -> Switch Port 1 (Gateway Uplink)_.
- [ ] Patch **0.15m Cat6A** [`patch-front-p2-sw2`, `#10B981`]: Connect `patch-u7:p2` (front) $\rightarrow$ `sw-u8:eth2` (front) — _Patch P2 -> Switch Port 2 (PVE-01 2.5G)_.
- [ ] Patch **0.15m Cat6A** [`patch-front-p3-sw3`, `#10B981`]: Connect `patch-u7:p3` (front) $\rightarrow$ `sw-u8:eth3` (front) — _Patch P3 -> Switch Port 3 (PVE-02 2.5G)_.
- [ ] Patch **0.15m Cat6A** [`patch-front-p4-sw4`, `#6366F1`]: Connect `patch-u7:p4` (front) $\rightarrow$ `sw-u8:eth4` (front) — _Patch P4 -> Switch Port 4 (PVE-01 Mgmt)_.
- [ ] Patch **0.15m Cat6A** [`patch-front-p5-sw5`, `#6366F1`]: Connect `patch-u7:p5` (front) $\rightarrow$ `sw-u8:eth5` (front) — _Patch P5 -> Switch Port 5 (PVE-02 Mgmt)_.
- [ ] Patch **1.00m Cat6A** [`cross-sw6-to-ucg-lan2`, `#06B6D4`]: Connect `sw-u8:eth6` (front) $\rightarrow$ `ucg-max:lan2` (rear) — _Switch Port 6 (Front) -> U6 Brush Portal -> UCG-Max LAN2 (Rear)_.
