# `@rack-mcp/hardware-catalog`

Precision-measured YAML hardware blueprints and `port_groups` matrix expander for **RackArchitect MCP**.

- **30 Included Blueprints:**
  - `catalog/10inch/` — 12× 10-inch mini-rack switches (Ubiquiti, MikroTik, TP-Link), 2-bay NAS tray (Synology DS224+), patch panels, brush panels, PDUs, and 1U UPS
  - `catalog/19inch/` — 8× 19-inch enterprise gateways, 10G SFP+ aggregation switches, 7-bay 2U NAS (UniFi UNAS Pro), 24-port patch panels, brush panels, and 2U UPS
  - `catalog/carriers/` — 5× Parametric 3D-printed 1U modular carriers (`slots[]` + `printable_metadata`)
  - `catalog/sub-modules/` — 5× Sub-U modules: Lenovo ThinkCentre M920q Tiny, Dell OptiPlex 7010 Micro, Ubiquiti UCG-Max, JetKVM Smart IP-KVM, Raspberry Pi 5 PoE HAT, and Keystone Cat6a couplers
- **Validation Command:** `pnpm validate:catalog`
