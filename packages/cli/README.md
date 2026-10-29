# `@rack-mcp/cli`

Unified command-line interface (`rack-mcp`) for **RackArchitect MCP**.

> **Zero-Install Hosted Remote MCP:** Connect directly via **`https://mcp.rackarchitect.dev/mcp`** (`Streamable HTTP`) or **`https://mcp.rackarchitect.dev/sse`** (`SSE`) without installing anything locally!

## Commands

```bash
# Start local MCP server (stdio) + Live 3D/2D Web-Viewer Sidecar on http://127.0.0.1:3100
rack-mcp serve --project examples/10inch-homelab/rack.yaml --port 3100

# Start multi-session Hosted Remote MCP server (Streamable HTTP /mcp + SSE /sse + Live 3D Session Viewer)
rack-mcp serve --remote-mcp --no-stdio --host 0.0.0.0 --port 3100 --public-url https://mcp.rackarchitect.dev

# Validate a rack.yaml project and print the ASCII Elevation Plan + Diagnostics
rack-mcp validate examples/10inch-homelab/rack.yaml

# Export elevation.svg, wiring-schematic.svg, BOM.md, rack-scene.glb, and all .scad + .stl 3D-print files
rack-mcp export examples/10inch-homelab/rack.yaml --out-dir ./examples/10inch-homelab
```
