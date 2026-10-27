# `@rack-mcp/exporters`

Deterministic 2D CAD, 3D glTF, BOM, and parametric 3D-print (`.scad` / `.stl`) exporters for **RackArchitect MCP**.

- **`generateElevationSvg()`:** `2620 × 1260 px` Dual-Row CAD elevation sheet (Equipment Schedule, Front View, Horizontally Mirrored Rear View, Cable Callouts, and Z-Depth Side Cutaway Profile).
- **`generateWiringSchematicSvg()`:** 5-Layer logical pin-to-pin wiring schematic with `VLAN<id>` and `ip_cidr` callout badges.
- **`generateBomMarkdown()`:** Complete Markdown & CSV Bill of Materials (devices, cables with exact lengths in `mm`, 3D-print filament in `g`, and `M6`/`M3` fasteners).
- **`generateGlbBinary()`:** Headless binary glTF 2.0 (`.glb`) 3D scene generator.
- **`generateCarrierOpenScad()` & `generateCarrierStl()`:** Parametric OpenSCAD (`.scad`) and watertight ASCII `.stl` 3D-print generator for modular rack carriers.
