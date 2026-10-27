# `@rack-mcp/mcp-server`

Model Context Protocol (`stdio`) server, 50-step atomic Undo/Redo state manager, and local HTTP/WebSocket sidecar server (`127.0.0.1:3100`) for **RackArchitect MCP**.

- **11 Canonical MCP Tools:** `init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `validate_rack`, `export_deliverables`, `undo_redo`.
- **4 MCP Resources:** `rack://project/current`, `rack://project/validation`, `rack://project/elevation-ascii`, `rack://catalog/summary`.
- **2 Guided MCP Prompts:** `design-homelab-rack`, `audit-and-fix-rack`.
