# `@rack-mcp/mcp-server`

Multi-tenant Hosted Remote MCP (`Streamable HTTP` `/mcp` & `HTTP+SSE` `/sse`) and local `stdio` Model Context Protocol server, 50-step atomic Undo/Redo state manager, and live 3D/2D HTTP + WebSocket sidecar server (`:3100`) for **RackArchitect MCP**.

## Live Zero-Install Hosted Remote MCP Endpoints

- **Streamable HTTP MCP (`POST / GET / DELETE`):** `https://rack-mcp.167.233.80.33.sslip.io/mcp`
- **Legacy HTTP+SSE MCP (`GET /sse` + `POST /messages`):** `https://rack-mcp.167.233.80.33.sslip.io/sse`
- **Live 3D Studio & Per-Session Viewer (`wss://`):** `https://rack-mcp.167.233.80.33.sslip.io/` (`/?session=<uuid>`)
- **MCP Discovery & Health Check:** `https://rack-mcp.167.233.80.33.sslip.io/.well-known/mcp.json` · `/health`

```json
{
  "mcpServers": {
    "rack_architect_mcp": {
      "url": "https://rack-mcp.167.233.80.33.sslip.io/mcp"
    }
  }
}
```

## Capabilities

- **12 Canonical MCP Tools:** `init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `plan_external_endpoints`, `validate_rack`, `export_deliverables`, `undo_redo`.
- **4 MCP Resources:** `rack://project/current`, `rack://project/validation`, `rack://project/elevation-ascii`, `rack://catalog/summary`.
- **2 Guided MCP Prompts:** `design-homelab-rack`, `audit-and-fix-rack`.
