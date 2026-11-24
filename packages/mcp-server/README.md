# `@rack-mcp/mcp-server`

Multi-tenant Hosted Remote MCP (`Streamable HTTP` `/mcp` & `HTTP+SSE` `/sse`) and local `stdio` Model Context Protocol server, 50-step atomic Undo/Redo state manager, and live 3D/2D HTTP + WebSocket sidecar server (`:3100`) for **RackArchitect MCP**.

## Live Zero-Install Hosted Remote MCP Endpoints

- **Streamable HTTP MCP (`POST / GET / DELETE`):** `https://mcp.rackarchitect.dev/mcp`
- **Legacy HTTP+SSE MCP (`GET /sse` + `POST /messages`):** `https://mcp.rackarchitect.dev/sse`
- **Live 3D Studio & Per-Session Viewer (`wss://`):** `https://mcp.rackarchitect.dev/` (`/?session=<uuid>`)
- **MCP Discovery & Health Check:** `https://mcp.rackarchitect.dev/.well-known/mcp.json` · `/health`

```json
{
  "mcpServers": {
    "rack_architect_mcp": {
      "url": "https://mcp.rackarchitect.dev/mcp"
    }
  }
}
```

## Capabilities

- **13 Canonical MCP Tools:** `init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `plan_external_endpoints`, `validate_rack`, `export_deliverables`, `undo_redo`, `optimize_rack`.
- **4 MCP Resources:** `rack://current/summary`, `rack://current/bom`, `rack://current/diagnostics`, `rack://current/yaml`.
- **5 Guided MCP Prompts:** `plan-homelab-from-scratch`, `optimize-and-fix-rack`, `design-19inch-enterprise-rack`, `design-3d-printed-carrier-bay`, `audit-poe-and-thermals`.
