# 🗄️ RackArchitect MCP — Release Archive (`v0.1.0` – `v0.4.3`)

To keep the [GitHub Releases page](https://github.com/itAlex240/rack-architect-mcp/releases) clean and readable, only the **3 most recent releases** are kept active on the Releases feed. All earlier releases and their highlights are archived here (and in full technical detail in [`CHANGELOG.md`](../CHANGELOG.md)). Every historical Git tag remains permanently available under [GitHub Tags](https://github.com/itAlex240/rack-architect-mcp/tags).

---

## 📦 `v0.4.x` Series — 3D Port & Brush-Panel Realism, External Building Drops & Collision-Free Routing

- **[`v0.4.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.3) (2026-10-28) — Human-Readable Device Descriptions, Full Manufacturer/Model Titles & 3D-Printed Desktop Switch Cradles:**
  - Added `description` across all hardware blueprints, displayed full Manufacturer + Model titles alongside `hostname` in the 3D banner and right Inspector Sidebar, and added 3D rendering + `.SCAD`/`.STL` downloads for 10-inch desktop switch adapter cradles (`USW-Flex-2.5G-8-PoE`, `USW-Lite-8-PoE`).
- **[`v0.4.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.2) (2026-10-28) — Inspector Sidebar & TopNavBar Anti-Clipping Fix:**
  - Replaced `1fr 1fr` and `repeat(3, 1fr)` grids in `InspectorSidebar.tsx` with `minmax(0, 1fr)` and `minWidth: 0` ellipsis truncation so long port and building-drop labels never push the right sidebar off-screen.
  - Locked `TopNavBar.tsx` brand badge (`RackArchitect`) with `flexShrink: 0` so the top navigation bar never clips on narrow viewports.
- **[`v0.4.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.1) (2026-10-28) — Zero 3D Cable-to-Cable Tube Interpenetration:**
  - Added exact 3D segment-to-segment distance clearance solver (`computeMinSplineClearanceMm`, $\ge 6.2\text{ mm}$ minimum centerline separation) and inter-column port riser shifting (`computePortRiserX`) in `@rack-mcp/core-domain`.
  - Stratified front and rear Z-depth planes (`7.0 mm` lattice spacing) so upper/lower switch port rows, SFP+ DAC trunks, and vertical patch arches have `0` cable-to-cable collisions.
- **[`v0.4.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.4.0) (2026-10-28) — External Building Drops (`plan_external_endpoints`), Visible 3D Ports & Segmented Brush Panels:**
  - Added `external_endpoints` and the `plan_external_endpoints` MCP tool so incoming building cables (PoE cameras, Wi-Fi APs, room LAN outlets) terminate on the rear of a patch panel (`0U` wasted rack space) with step-by-step patching instructions.
  - Projected 3D ports, OLED screens, and cable strain-relief boots onto the outer faceplate of protruding devices and replaced solid black brush panels with 56 segmented nylon bristles.

---

## 🎨 `v0.3.x` Series — Precision CAD Studio UI, Local MCP Workbench & Coaxial Spline Routing

- **[`v0.3.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.3) (2026-10-28) — Dedicated Local MCP Engineering Workbench (`localhost:3100`):**
  - Separated the interactive GitHub Pages showcase from the local MCP Engineering Workbench (`New Empty Rack`, `Export to Disk`, live external MCP agent feed).
- **[`v0.3.2`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.2) (2026-10-28) — Coaxial Plug Insertion & Zero Shelf Clipping:**
  - Clamped Catmull-Rom cable splines coaxially along port normals and routed rear cross-face cables cleanly behind `U4`/`U5` trays (`0.00 mm` shelf clipping).
- **[`v0.3.1`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.1) (2026-10-28) — Complete Cable Harness in 2D Side-Profile Depth Cutaway:**
  - Synchronized all 18 front, rear, and brush-portal cables across the 2D `elevation.svg` side-profile cutaway in both live and standalone modes.
- **[`v0.3.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.3.0) (2026-10-28) — "Precision Hardware & CAD Studio" UI/UX Redesign:**
  - Introduced the neutral Carbon/Zinc color system (`#09090b` / `#121216`), single-line `52px` `TopNavBar`, bottom-center `FloatingHudToolbar`, and unified `InspectorSidebar`.

---

## ⚙️ `v0.2.x` & `v0.1.x` Series — Core Domain, 5-Stage Validation, Exporters & Initial MCP Server

- **[`v0.2.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.2.0) (2026-10-28) — Interactive Catalog & Cable Builder, Thermal/Acoustic Analysis & STL Export:**
  - Added browser-side interactive mounting, cable patching, thermal/acoustic KPIs, and watertight binary/ASCII `.STL` + `.SCAD` 3D-print carrier generation.
- **[`v0.1.3`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.1.3) – [`v0.1.0`](https://github.com/itAlex240/rack-architect-mcp/tree/v0.1.0) (2026-10-27 – 2026-10-28) — Foundation Releases:**
  - Initial release of `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/exporters` (`elevation.svg`, `wiring-schematic.svg`, `BOM.md`, `rack-scene.glb`), `@rack-mcp/mcp-server`, `@rack-mcp/web-viewer`, and `@rack-mcp/cli`.
