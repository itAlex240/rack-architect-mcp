# `@rack-mcp/hardware-catalog`

Precision-measured YAML hardware blueprints and `port_groups` matrix expander for **RackArchitect MCP**.

- **67 Validated Blueprints (`10inch`, `19inch`, `6inch`, `carriers`, `sub-modules`):**
  - `catalog/10inch/` — 21× 10-inch mini-rack switches & gateways (`USW-Flex-2.5G-8-PoE`, `USW-Ultra-60W`, `UCG-Fiber`, `MikroTik CRS309-1G-8S+IN`, `RB5009UPr+S+IN`, `Netgear GS108PP`), 2-bay/4-bay NAS (`Synology DS224+`, `QNAP TS-433`), patch panels, brush panels, 3D-printable designer slot cover panels (`1U`/`2U` Horizontal Lines, Hex Honeycomb, Vertical Tech-Ribs), PDUs (`Digitus 4-Way Schuko`, `Brennenstuhl 6-Way IEC-C13`), and 1U UPS (`CyberPower 500VA`)
  - `catalog/19inch/` — 21× 19-inch enterprise gateways & firewalls (`FortiGate 200F`, `UDM-Pro`, `UDM-SE`, `MikroTik CCR2004-16G-2S+`), 10G/PoE++ switches (`USW-Aggregation`, `USW-Pro-Max-24-PoE`, `USW-Pro-Max-16-PoE`, `MikroTik CRS326-24G-2S+RM`), hot-swap NAS/NVRs (`UniFi UNAS Pro 7-Bay`, `Synology RS1221+ 8-Bay`, `UniFi UNVR 4-Bay`), 24-port patch panels, brush/blanking panels, 3D-printable designer cover panels (`1U` Lines, `2U` Hex), ventilated cantilever shelves, 8-way Schuko PDU, and 2U UPS (`APC Smart-UPS 1500VA Li-Ion`, `CyberPower PR1500ERT2U`)
  - `catalog/6inch/` — 6× 6-inch micro-rack blueprints (`UniFi Switch Flex Mini`, `GL.iNet Beryl AX MT3000`, `6-Port Cat6A Patch Panel`, `200W 4-Port USB-C GaN PD + DC-5525 Micro-PDU`, `6-Inch 1U Brush Panel`, `6-Inch 1U Designer Cover Panel`)
  - `catalog/carriers/` — 9× Parametric 3D-printed 1U modular carriers (`10inch`, `19inch`, and `6inch` with `slots[]` + `printable_metadata`)
  - `catalog/sub-modules/` — 10× Sub-U compute & KVM modules: `Lenovo ThinkCentre M920q Tiny`, `HP EliteDesk 800 G6 Mini`, `Dell OptiPlex 7010 Micro`, `Intel NUC 13 Pro Slim`, `ZimaBoard 832`, `Ubiquiti UCG-Max`, `PiKVM V4 Mini`, `JetKVM`, `Raspberry Pi 5 PoE+ HAT`, and `Cat6A Keystone Couplers`
- **Validation Command:** `pnpm validate:catalog`
