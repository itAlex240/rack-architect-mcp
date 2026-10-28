# 6U 6-Inch DeskMate Micro-Homelab (Pi 5 + OpenWrt + UniFi) — Bill of Materials & Assembly Guide

## 1. Project & Validation Summary

- **Validation Status:** `VALID` (0 Errors, 0 Warnings)
- **Rack Enclosure:** 6U `6inch` (Rail Depth: `180 mm`, Rear Clearance: `50 mm`)
- **Total Mounted Devices:** 9 (6 rackmount units + 3 sub-modules)
- **Total Electrical Draw:** `34.5 W` system + `0 W` PoE
- **Mechanical Mass & Stability:** `1.3 kg` total weight | Center of Gravity $Y_{\text{CoG}} = 109.1\text{ mm}$ (`40.9%` of rack height)

## 2. Commercial Hardware BOM

| Slug | Manufacturer | Model | Category | Qty | Instances & Locations | Max Power (W) | Total Weight (g) |
| :--- | :--- | :--- | :--- | :---: | :--- | :---: | :---: |
| `generic-6inch-usb-pd-pdu-4port` | MicroLab | 6-Inch 1U 200W 4-Port USB-C GaN PD + DC-5525 Micro-PDU | `pdu` | 1 | `pdu-u1` (U1 front) | 8 W | 340 g |
| `raspberry-pi-5-poe-hat` | Raspberry Pi | Raspberry Pi 5 (8GB) with Official PoE+ HAT | `sbc` | 1 | `pi5-docker-01` (U2 `carrier-pi5-u2:rpi5-bay-1`) | 12 W | 110 g |
| `keystone-rj45-cat6a-coupler` | Generic | Shielded RJ45 Cat6A Passthrough Keystone Coupler | `keystone-module` | 2 | `ks-u2-wan` (U2 `carrier-pi5-u2:keystone-1`), `ks-u2-lan` (U2 `carrier-pi5-u2:keystone-2`) | 0 W | 36 g |
| `gl-inet-mt3000-beryl-ax-6inch` | GL.iNet | GL-MT3000 Beryl AX OpenWrt 2.5G Security Gateway (6-Inch 1U) | `router` | 1 | `gw-beryl-u3` (U3 front) | 12 W | 196 g |
| `generic-6inch-brush-panel-1u` | MicroRack | 6-Inch 1U Brush Strip Cable Pass-Through Panel | `brush-panel` | 1 | `brush-u4` (U4 front) | 0 W | 130 g |
| `generic-6inch-patch-panel-6port` | DeskPi / MicroRack | 6-Inch 1U 6-Port Cat6A Shielded Passthrough Patch Panel | `patch-panel` | 1 | `patch-u5` (U5 front) | 0 W | 185 g |
| `ubiquiti-usw-flex-mini-6inch` | Ubiquiti | UniFi Switch Flex Mini (USW-Flex-Mini, 6-Inch 1U Mount) | `switch` | 1 | `sw-flex-u6` (U6 front) | 2.5 W | 150 g |

### 2.1 Geräte-Erklärungen & Montage-Hinweise

- **`pdu-u1` (MicroLab 6-Inch 1U 200W 4-Port USB-C GaN PD + DC-5525 Micro-PDU — Hostname: `pdu-gan-200w`)**: Kompakte 6-Zoll 1U GaN-Stromverteilungseinheit (Micro-PDU, 200W Gesamtleistung) mit 4x USB-C Power-Delivery-Ausgängen (5V/9V/12V/15V/20V für Raspberry Pi 5, USW-Flex-Mini, GL.iNet Router & JetKVM/PiKVM), 1x 12V/20V DC-5525 Hohlstecker-Ausgang und rückseitigem IEC-C14 Kaltgeräte-Eingang.
- **`carrier-pi5-u2` (Printables Community 6-Inch 1U Raspberry Pi 5 + 2x Keystone Micro-Carrier — Hostname: `carrier-pi5-u2`)**: 3D-gedruckter 6-Zoll 1U Modulträger (PETG/ASA, 152,4mm Gesamtbreite) mit einem Einschub für einen Raspberry Pi 5 (inkl. PoE+ HAT) auf der linken Seite sowie zwei Keystone-Slots rechts. Ideal für ultrakompakte 6-Zoll Schreibtisch-Racks.
- **`pi5-docker-01` (Raspberry Pi Raspberry Pi 5 (8GB) with Official PoE+ HAT — Hostname: `pi5-docker-node`)**: Raspberry Pi 5 (8GB) Einplatinencomputer mit offiziellem PoE+ HAT. Bezieht Strom und Netzwerk über ein einziges PoE-Netzwerkkabel an der Vorderseite — ideal als Proxmox-Quorum-Witness, Pi-hole DNS oder Monitoring-Node.
- **`gw-beryl-u3` (GL.iNet GL-MT3000 Beryl AX OpenWrt 2.5G Security Gateway (6-Inch 1U) — Hostname: `gw-beryl-ax`)**: Kompaktes OpenWrt / WireGuard / OpenVPN Security-Gateway (120×34×83mm) mit 2.5GbE WAN-Port, 1GbE LAN-Port, USB 3.0 und Wi-Fi 6 für 6-Zoll Micro-Homelabs. Wird über USB-C (5V/3A PD) versorgt und sitzt in einer 3D-gedruckten 6-Zoll 1U Halterung.
- **`brush-u4` (MicroRack 6-Inch 1U Brush Strip Cable Pass-Through Panel — Hostname: `brush-portal-u4`)**: 6-Zoll 1U Bürstenleiste (Kabeldurchführung mit dichten Nylonborsten im eloxierten Stahlrahmen) für 6-Zoll Micro-Racks. Ermöglicht das saubere Durchführen von Patch- und Stromkabeln zwischen Vorder- und Rückseite.
- **`patch-u5` (DeskPi / MicroRack 6-Inch 1U 6-Port Cat6A Shielded Passthrough Patch Panel — Hostname: `patch-6p-u5`)**: Passives 6-Zoll 1U Cat6A Durchgangs-Patchpanel mit 6 geschirmten RJ45-Keystone-Buchsen (vorne & hinten steckbar) zur sauberen Strukturverkabelung in 6-Zoll Micro-Homelabs.
- **`sw-flex-u6` (Ubiquiti UniFi Switch Flex Mini (USW-Flex-Mini, 6-Inch 1U Mount) — Hostname: `sw-flex-mini`)**: Ultrakompakter 5-Port Gigabit Managed Switch (107,2×21,2×70,2mm, lautlos) für 6-Zoll Micro-Racks. Kann wahlweise über Port 1 per 802.3af/at PoE-In oder über den rückseitigen 5V USB-C Anschluss mit Strom versorgt werden und sitzt im 6-Zoll-Rack in einer 3D-gedruckten 1U-PETG-Aufnahmehalterung.

## 3. 3D Print Queue (Fabrication List)

| Carrier Blueprint | Qty | Material | Total Filament (g) | Heat-Set Inserts (per unit) | Fasteners / Screws (per unit) | Source Model |
| :--- | :---: | :---: | :---: | :--- | :--- | :--- |
| `3dprint-6inch-rpi5-plus-keystone-carrier-1u` (U2) | 1 | PETG or ASA (25% Gyroid Infill, 4 Perimeters) | 110 g | 4x M2.5x4mm brass inserts | 4x M2.5x8mm SHCS + 4x M6 cage nuts | https://www.printables.com/model/6inch-rpi5-2keystone-carrier |

**Total Estimated 3D Filament Required:** `110 g`

## 4. Aggregated Cable Shopping List

| Cable Type | Commercial Length | Color Hex | Qty | Cable IDs & Purpose |
| :--- | :---: | :---: | :---: | :--- |
| `cat6a` | **0.15 m** (150 mm) | `#3B82F6` | 1 | `patch-p1-to-sw1` (Patch P1 -> Flex Mini Port 1 (Gateway Uplink)) |
| `cat6a` | **0.15 m** (150 mm) | `#10B981` | 1 | `patch-p2-to-sw2` (Patch P2 -> Flex Mini Port 2 (Pi 5 Docker Node)) |
| `cat6a` | **0.15 m** (150 mm) | `#0EA5E9` | 1 | `patch-p3-to-sw3` (Patch P3 -> Flex Mini Port 3 (Desk Workstation)) |
| `cat6a` | **0.25 m** (250 mm) | `#10B981` | 1 | `lan-pi5-to-ks2` (Pi 5 GbE -> U2 Keystone 2 (Front)) |
| `cat6a` | **0.50 m** (500 mm) | `#3B82F6` | 1 | `lan-beryl-to-patch1` (Beryl AX LAN -> Patch P1 (Rear)) |
| `cat6a` | **0.75 m** (750 mm) | `#EC4899` | 1 | `wan-ks-to-beryl` (ISP ONT Keystone (Front) -> Beryl AX 2.5G WAN) |
| `cat6a` | **0.75 m** (750 mm) | `#10B981` | 1 | `trunk-ks2-to-patch2` (U2 Keystone 2 (Rear) -> Patch P2 (Rear)) |
| `power-usb-c` | **0.75 m** (750 mm) | `#F97316` | 1 | `pwr-pdu-to-beryl` (200W PDU USB-C PD1 -> Beryl AX Gateway) |
| `power-usb-c` | **0.75 m** (750 mm) | `#F59E0B` | 1 | `pwr-pdu-to-pi5` (200W PDU USB-C PD2 -> Raspberry Pi 5 (27W PD)) |
| `power-usb-c` | **0.75 m** (750 mm) | `#EF4444` | 1 | `pwr-pdu-to-flex` (200W PDU USB-C PD3 -> USW-Flex-Mini) |

## 5. Step-by-Step Assembly & Patching Checklist

### Phase A: Mechanical Mounting (Bottom-Up for Stability)
- [ ] Mount **6-Inch 1U 200W 4-Port USB-C GaN PD + DC-5525 Micro-PDU** (`pdu-u1`) at **U1** (FRONT rails).
- [ ] Mount **6-Inch 1U Raspberry Pi 5 + 2x Keystone Micro-Carrier** (`carrier-pi5-u2`) at **U2** (FRONT rails).
  - [ ] Insert sub-module **Raspberry Pi 5 (8GB) with Official PoE+ HAT** (`pi5-docker-01`) into carrier slot `carrier-pi5-u2:rpi5-bay-1`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u2-wan`) into carrier slot `carrier-pi5-u2:keystone-1`.
  - [ ] Insert sub-module **Shielded RJ45 Cat6A Passthrough Keystone Coupler** (`ks-u2-lan`) into carrier slot `carrier-pi5-u2:keystone-2`.
- [ ] Mount **GL-MT3000 Beryl AX OpenWrt 2.5G Security Gateway (6-Inch 1U)** (`gw-beryl-u3`) at **U3** (FRONT rails).
- [ ] Mount **6-Inch 1U Brush Strip Cable Pass-Through Panel** (`brush-u4`) at **U4** (FRONT rails).
- [ ] Mount **6-Inch 1U 6-Port Cat6A Shielded Passthrough Patch Panel** (`patch-u5`) at **U5** (FRONT rails).
- [ ] Mount **UniFi Switch Flex Mini (USW-Flex-Mini, 6-Inch 1U Mount)** (`sw-flex-u6`) at **U6** (FRONT rails).

### Phase B: Power & Network Cable Patching
- [ ] Patch **0.75m USB-C PD** [`pwr-pdu-to-beryl`, `#F97316`]: Connect `pdu-u1:usb_pd1` (front) $\rightarrow$ `gw-beryl-u3:pwr_usb_c` (rear) — _200W PDU USB-C PD1 -> Beryl AX Gateway_.
- [ ] Patch **0.75m USB-C PD** [`pwr-pdu-to-pi5`, `#F59E0B`]: Connect `pdu-u1:usb_pd2` (front) $\rightarrow$ `pi5-docker-01:usbc_pwr` (rear) — _200W PDU USB-C PD2 -> Raspberry Pi 5 (27W PD)_.
- [ ] Patch **0.75m USB-C PD** [`pwr-pdu-to-flex`, `#EF4444`]: Connect `pdu-u1:usb_pd3` (front) $\rightarrow$ `sw-flex-u6:pwr_usb_c` (rear) — _200W PDU USB-C PD3 -> USW-Flex-Mini_.
- [ ] Patch **0.75m Cat6A** [`wan-ks-to-beryl`, `#EC4899`]: Connect `ks-u2-wan:coupler` (front) $\rightarrow$ `gw-beryl-u3:wan1` (rear) — _ISP ONT Keystone (Front) -> Beryl AX 2.5G WAN_.
- [ ] Patch **0.50m Cat6A** [`lan-beryl-to-patch1`, `#3B82F6`]: Connect `gw-beryl-u3:lan1` (rear) $\rightarrow$ `patch-u5:p1` (rear) — _Beryl AX LAN -> Patch P1 (Rear)_.
- [ ] Patch **0.25m Cat6A** [`lan-pi5-to-ks2`, `#10B981`]: Connect `pi5-docker-01:eth0` (front) $\rightarrow$ `ks-u2-lan:coupler` (front) — _Pi 5 GbE -> U2 Keystone 2 (Front)_.
- [ ] Patch **0.75m Cat6A** [`trunk-ks2-to-patch2`, `#10B981`]: Connect `ks-u2-lan:coupler` (rear) $\rightarrow$ `patch-u5:p2` (rear) — _U2 Keystone 2 (Rear) -> Patch P2 (Rear)_.
- [ ] Patch **0.15m Cat6A** [`patch-p1-to-sw1`, `#3B82F6`]: Connect `patch-u5:p1` (front) $\rightarrow$ `sw-flex-u6:eth1` (front) — _Patch P1 -> Flex Mini Port 1 (Gateway Uplink)_.
- [ ] Patch **0.15m Cat6A** [`patch-p2-to-sw2`, `#10B981`]: Connect `patch-u5:p2` (front) $\rightarrow$ `sw-flex-u6:eth2` (front) — _Patch P2 -> Flex Mini Port 2 (Pi 5 Docker Node)_.
- [ ] Patch **0.15m Cat6A** [`patch-p3-to-sw3`, `#0EA5E9`]: Connect `patch-u5:p3` (front) $\rightarrow$ `sw-flex-u6:eth3` (front) — _Patch P3 -> Flex Mini Port 3 (Desk Workstation)_.

### Phase C: External Building / Room Cable Drops (Step-by-Step Patching Guide)

| # | Room / Endpoint | Category & PoE | Step 1: Rear Patch Panel Termination | Step 2: Front Switch Patch Cable |
| :---: | :--- | :--- | :--- | :--- |
| 1 | **ISP Fiber ONT (Glasfaser-Modem) (Wohnzimmer Glasfaser-APL)** | `isp-wan-uplink` (No PoE) | Building cable (top-rear) $\rightarrow$ `ks-u2-wan:coupler` (REAR) | Patch cable `wan-ks-to-beryl` (`#EC4899`) from `ks-u2-wan:coupler` (FRONT) $\rightarrow$ `gw-beryl-u3:wan1` |
| 2 | **Desk Workstation Drop (1GbE LAN) (Home Office Schreibtisch)** | `workstation-dock` (No PoE) | Building cable (top-rear) $\rightarrow$ `patch-u5:p3` (REAR) | Patch cable `patch-p3-to-sw3` (`#0EA5E9`) from `patch-u5:p3` (FRONT) $\rightarrow$ `sw-flex-u6:eth3` |
