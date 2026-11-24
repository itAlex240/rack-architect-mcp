# Rack-as-Code IDE Schema & CI/CD Integration Guide

RackArchitect MCP provides an official **JSON Schema (Draft 2020-12)** for `rack.yaml` files alongside a GitHub Actions-native CLI validation mode (`--ci`) and composite Action so hardware layouts are checked in your editor and on every Pull Request.

---

## 1. IDE Autocomplete & Live Schema Validation (VS Code, JetBrains, Neovim)

### Option A: Zero-Config YAML Modeline (Recommended)

Add the following comment as the **first line** of any `rack.yaml` file:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/itAlex240/rack-architect-mcp/main/schemas/rack.schema.json
schema_version: "1.0"
project_name: 8U 10-Inch Proxmox & UniFi Homelab
rack:
  standard: 10inch
  u_height: 8
  rail_depth_mm: 240
  enclosure_type: closed-glass-front
```

Both **VS Code** (with the [Red Hat YAML extension](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml), `redhat.vscode-yaml`) and **JetBrains IDEs** (IntelliJ IDEA, WebStorm, PyCharm, GoLand — built-in `yaml-language-server` / JSON Schema support) automatically enable:
- Inline autocomplete for all `RackProjectSchema` keys, cable types (`cat6a`, `sfp-plus-dac`, `power-c13-c14`, `power-dc-5525`, ...), rack standards (`19inch`, `10inch`, `6inch`), and external endpoint categories.
- Hover documentation with exact physical units (`mm`, `U`, `watts`, `VLAN 1..4094`).
- Immediate squiggly error diagnostics for invalid enums, out-of-range U positions, or malformed hex colors (`#RRGGBB`).

### Option B: Workspace Settings (Without Editing `rack.yaml`)

#### VS Code (`.vscode/settings.json`)

```json
{
  "yaml.schemas": {
    "https://raw.githubusercontent.com/itAlex240/rack-architect-mcp/main/schemas/rack.schema.json": [
      "rack.yaml",
      "*.rack.yaml",
      "**/rack.yaml"
    ]
  }
}
```

Or map to a locally generated schema file (`./schemas/rack.schema.json`) for offline/air-gapped environments.

#### JetBrains IDEs

1. Open **Settings / Preferences -> Languages & Frameworks -> Schemas and DTDs -> JSON Schema Mappings**.
2. Click **+** to add a new mapping:
   - **Name:** `RackArchitect MCP Project Schema`
   - **Schema file or URL:** `https://raw.githubusercontent.com/itAlex240/rack-architect-mcp/main/schemas/rack.schema.json` (or local `schemas/rack.schema.json`)
   - **Schema version:** `JSON Schema version 2020-12` (or latest available)
   - **File path pattern:** `rack.yaml` / `*.rack.yaml`

---

## 2. Generating `rack.schema.json` Locally via CLI (`rack-mcp schema`)

`@rack-mcp/cli` generates the exact canonical JSON Schema directly from `@rack-mcp/core-domain`'s `RackProjectSchema` at runtime:

```bash
# Print the official JSON Schema to stdout
npx -y @rack-mcp/cli schema

# Write atomically to a local file for offline IDE validation
npx -y @rack-mcp/cli schema --out ./schemas/rack.schema.json
```

Inside this monorepo, the repository's committed [`schemas/rack.schema.json`](../schemas/rack.schema.json) can also be regenerated deterministically with:

```bash
node scripts/generate-rack-schema.ts
```

---

## 3. CLI Validation in CI Mode (`rack-mcp validate <file> --ci`)

Pass `--ci` to `rack-mcp validate` to emit GitHub Actions annotations and a Markdown Step Summary:

```bash
npx -y @rack-mcp/cli validate rack.yaml --ci
```

### Behavior

| Condition | Exit Code | Output & GitHub Integration |
| :--- | :--- | :--- |
| Valid rack (`is_valid === true`) | `0` | Emits `::warning ...` lines for any non-blocking warnings (e.g., `TOP_HEAVY_RACK`) and writes `## RackArchitect Validation Report` to stdout and `$GITHUB_STEP_SUMMARY` (when set). |
| Physical / electrical / schema / YAML error | `1` | Emits `::error file=<file>,title=Rack Validation (<code>)::<message>` for each blocking error (and `::warning ...` for warnings), plus the Markdown report with remediation guidance. |

---

## 4. GitHub Actions Pull Request Gate

### Option A: Official Composite Action (`.github/actions/validate-rack`)

Create `.github/workflows/rack-ci.yml` in your homelab or infrastructure repository:

```yaml
name: Rack Layout Validation

on:
  pull_request:
    paths:
      - '**/rack.yaml'
      - '*.rack.yaml'
  push:
    branches: [main]

permissions:
  contents: read

jobs:
  validate-rack:
    name: Validate Rack-as-Code
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v7

      - name: Validate rack.yaml (5-Stage Geometry, Power, PoE & Thermal)
        uses: itAlex240/rack-architect-mcp/.github/actions/validate-rack@main
        with:
          rack-file: rack.yaml
          node-version: '22'
```

### Option B: Multi-Rack Matrix Workflow (Direct CLI)

If your repository tracks multiple racks (for example `site-a/rack.yaml` and `homelab/rack.yaml`):

```yaml
name: Multi-Rack Validation Gate

on:
  pull_request:
    paths:
      - '**/rack.yaml'

permissions:
  contents: read

jobs:
  validate-matrix:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        rack_file:
          - examples/10inch-homelab/rack.yaml
          - examples/19inch-enterprise/rack.yaml
          - examples/6inch-microlab/rack.yaml
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: '22'

      - name: Validate ${{ matrix.rack_file }}
        env:
          RACK_FILE: ${{ matrix.rack_file }}
        run: npx -y @rack-mcp/cli validate "${RACK_FILE}" --ci
```

> **Security Note:** Always pass dynamic inputs or matrix values into `run:` steps via `env:` variables (e.g., `RACK_FILE: ${{ inputs.rack-file }}` and `"${RACK_FILE}"`) rather than interpolating `${{ ... }}` directly inside shell scripts.
