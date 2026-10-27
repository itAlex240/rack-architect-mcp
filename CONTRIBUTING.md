# Contributing to RackArchitect MCP (`@rack-mcp/*`)

Thank you for contributing to **RackArchitect MCP**, the open-source, agent-first **Rack-as-Code** planning, validation, and 2D/3D CAD visualization platform for 19-inch enterprise racks, 10-inch mini-racks, and 6-inch micro-homelabs!

Whether you are adding a new hardware blueprint (e.g., a 10-inch switch, mini-PC, or 3D-printed carrier), improving the 3D/2D exporters, or extending the validation engine, this guide gets you started in minutes.

---

## 1. Quickest Way to Contribute: Adding a Hardware Blueprint (2 Minutes)

Our hardware catalog lives in [`packages/hardware-catalog/catalog/`](./packages/hardware-catalog/catalog/):

- `catalog/10inch/` — 10-inch rackmount switches, patch panels, brush panels, UPS, and PDUs
- `catalog/19inch/` — 19-inch enterprise switches, gateways, and servers
- `catalog/carriers/` — 3D-printed modular carriers (`.scad` / `.stl` ready) with sub-U `slots[]`
- `catalog/sub-modules/` — Mini-PCs (Lenovo Tiny, Dell OptiPlex Micro, HP EliteDesk Mini), Raspberry Pi blades, JetKVM, power bricks, and Keystone couplers

### Step-by-Step Blueprint Tutorial

1. **Create a YAML file** named `<vendor>-<model>.yaml` (lowercase `kebab-case`) in the matching folder under `packages/hardware-catalog/catalog/`.
2. **Define exact dimensions in millimeters (`mm`)** and use `port_groups` for repeating port rows:

```yaml
slug: mikrotik-crs310-8g-2s-in
manufacturer: MikroTik
model: CRS310-8G+2S+IN (10-Inch / 19-Inch)
category: switch
mount_type: rackmount-10
geometry:
  u_height: 1.0
  width_mm: 200.0
  height_mm: 44.0
  depth_mm: 206.0
  ear_mount_style: included-10inch-ears
  weight_grams: 1120
power_and_thermal:
  electrical_role: consumer
  idle_watts: 10
  max_system_watts: 34
  airflow: front-to-rear
  noise_db_a: 26.0
ports:
  - port_id: dc_in
    label: 24V DC Barrel
    face: rear
    connector_type: dc-barrel
    direction: power-in
    capabilities: [dc-power]
    coordinates:
      x_mm: 25.0
      y_mm: 18.0
      orientation: upright
port_groups:
  - prefix: eth
    start_index: 1
    count: 8
    rows: 1
    columns: 8
    pitch_x_mm: 14.5
    pitch_y_mm: 0.0
    origin_x_mm: 32.0
    origin_y_mm: 16.0
    face: front
    connector_type: rj45
    direction: bidirectional
    capabilities: [2500base-t]
```

3. **Register or validate the blueprint:**
   Run the catalog validator to verify Zod schema compliance, port matrix expansion, and zero local port overlaps:
   ```bash
   pnpm validate:catalog
   ```

---

## 2. Adding a 3D-Printed Modular Carrier (`category: modular-carrier`)

When you create a blueprint with `category: modular-carrier` and `slots[]`, `@rack-mcp/exporters` **automatically generates both a parametric OpenSCAD (`.scad`) file and a watertight ASCII `.stl` file** for 3D printing!

Make sure to include:
- `slots[]`: Each bay's `slot_id`, `label`, `accepted_categories`, `origin_mm: { x, y, z }`, and `max_dimensions_mm: { width_mm, height_mm, depth_mm }`.
- `printable_metadata`: Recommended filament (`PETG`, `ASA`, `ABS`), `infill_percent`, `perimeters`, `estimated_filament_grams`, and `fasteners_required`.

---

## 3. Monorepo Architecture & Engineering Rules (`AGENTS.md`)

Please read [`AGENTS.md`](./AGENTS.md) and [`ARCHITECTURE.md`](./ARCHITECTURE.md) before modifying TypeScript code:

1. **Zero Boundary Violations:**
   - `@rack-mcp/core-domain` MUST remain 100% environment-agnostic (zero Node.js `fs`/`path`/`process` and zero DOM/WebGL imports; `"types": []` is enforced in `tsconfig.json`).
2. **Coordinate System (`mm`):**
   - Right-handed 3D millimeter coordinate system (`1 U = 44.45 mm`).
   - Origin `(0, 0, 0)` is the **bottom-front-left inner corner** of the usable rack aperture (`U1` bottom, front rail face).
   - `+X` = Left to Right, `+Y` = Bottom to Top, `+Z` = Front to Rear (`Z < 0` in front of rails toward glass door, `Z > 0` inside rack toward rear).
3. **Strict TypeScript 5.9 Gates:**
   - `"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`, `"verbatimModuleSyntax": true`, and `"erasableSyntaxOnly": true` are mandatory.
   - Never use `z.any()`, `z.unknown()`, or open string fallback unions for domain taxonomies.

---

## 4. Local Development & Verification Commands

Before opening a Pull Request, run the full verification suite from the repository root:

```bash
# 1. Install workspace dependencies
pnpm install

# 2. Typecheck all 6 packages under strict TypeScript gates
pnpm typecheck

# 3. Validate all hardware YAML blueprints
pnpm validate:catalog

# 4. Build all packages in topological order
pnpm build

# 5. Run all unit & integration tests (Vitest)
pnpm test
```

Thank you for helping build the future of **Rack-as-Code**!
