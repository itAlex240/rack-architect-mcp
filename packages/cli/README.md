# `@rack-mcp/cli`

Unified command-line interface (`rack-mcp`) for **RackArchitect MCP**.

## Commands

```bash
# Start MCP server (stdio) + Live 3D/2D Web-Viewer Sidecar on http://127.0.0.1:3100
rack-mcp serve --project examples/10inch-homelab/rack.yaml --port 3100

# Validate a rack.yaml project and print the ASCII Elevation Plan + Diagnostics
rack-mcp validate examples/10inch-homelab/rack.yaml

# Export elevation.svg, wiring-schematic.svg, BOM.md, rack-scene.glb, and all .scad + .stl 3D-print files
rack-mcp export examples/10inch-homelab/rack.yaml --out-dir ./examples/10inch-homelab
```
