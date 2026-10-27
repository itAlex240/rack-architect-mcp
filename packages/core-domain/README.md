# `@rack-mcp/core-domain`

Pure TypeScript & Zod 3D geometry, collision, power DAG, thermal/acoustic, and cable-spline routing engine for **RackArchitect MCP**.

- **Zero Environment Dependencies:** Runs identically in Node.js and web browsers (`"types": []` enforced in `tsconfig.json`).
- **Right-Handed 3D Millimeter Coordinate System (`1 U = 44.45 mm`):** Supports `19inch`, `10inch`, and `6inch` EIA-310 rack standards and hierarchical sub-U modularity (`Carrier -> Slot -> ChildDevice`).
- **5-Stage Deterministic Validation (`26` Diagnostic Codes):**
  1. Rack bounds & modular carrier slot constraints
  2. 3D AABB chassis & dynamic plug-clearance ($\Delta Z_{\text{plug}}$) collision solver
  3. Electrical & PoE PSE budget DAG analyzer
  4. Clamped 3D Catmull-Rom cable router (`direct-vertical-patch`, `same-face-channel`, `cross-face-portal`) & `SPEED_MISMATCH` (`Cat5e` bottleneck check)
  5. Thermal dissipation (`BTU/hr`), airflow conflict, passive hotspot stacking, and logarithmic `dB(A)` acoustic summation
