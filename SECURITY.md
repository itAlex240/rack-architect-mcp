# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.7.x   | :white_check_mark: |
| < 0.7.0 | :x:                |

## Security Architecture (Local-First & Multi-Tenant Remote MCP)

**RackArchitect MCP (`@rack-mcp/*`)** is engineered for both **Zero-Cloud Local-First (`stdio` + `:3100` Sidecar)** and **Multi-Tenant Hosted Remote MCP (`--remote-mcp`)** deployments:

1. **Loopback-Only Local Sidecar & DNS-Rebinding Guard (`127.0.0.1:3100`):**
   - By default, `@rack-mcp/mcp-server` binds its local HTTP and WebSocket sidecar server strictly to `127.0.0.1`.
   - Every local HTTP and WebSocket request validates the `Host` header against loopback/bound hostnames (`421 Misdirected Request`) and `Origin` header (`403 Forbidden`) to prevent DNS rebinding and Cross-Site WebSocket Hijacking (CSWSH).
2. **Workspace-Confined Deliverable Exports (`export_deliverables`):**
   - In local MCP mode, `export_deliverables` resolves and verifies `output_dir` (including `fs.realpathSync` symlink checks) to ensure generated files cannot escape the active project workspace directory.
   - In Hosted Remote MCP mode (`--remote-mcp` / `RACK_MCP_REMOTE=1`), `export_deliverables` operates **100% in memory** and never writes to the host filesystem, serving deliverables via ephemeral session URLs.
3. **Separated Read-Only Viewer Tokens & WebSocket Command Guards:**
   - Hosted Remote MCP sessions derive a distinct HMAC-SHA256 `viewerToken` for `live_viewer_url` (`/?session=<viewerToken>`) and `/api/export/*` links, ensuring shared viewer URLs never expose the write-capable `Mcp-Session-Id`.
   - Remote viewer WebSockets (`/ws?session=<viewerToken>`) are strictly read-only unless authenticated with the session's `Mcp-Session-Id` header, and enforce per-socket message rate limiting (`60 commands/min`, `256 KB` `maxPayload`, `4 MB` backpressure cap).
4. **Fair-Share Multi-Tenant Rate Limiting & Proxy Trust:**
   - `X-Forwarded-For` (rightmost hop) and `X-Real-IP` headers are trusted only from loopback, the dedicated Docker DMZ bridge (`172.30.250.0/29`), or explicit `RACK_MCP_TRUSTED_PROXIES` addresses.
   - Per-IP session caps and sliding-window rate limiters normalize IPv6 addresses to `/64` prefixes to prevent IPv6 subnet rotation bypasses.
5. **GDPR-Safe Telemetry & Non-Persisted HMAC Key:**
   - Anonymous visitor deduplication uses HMAC-SHA256 with an in-memory / environment-injected secret (`RACK_MCP_TELEMETRY_SALT`). The HMAC key is never persisted to `telemetry.json`.
6. **Pure Deterministic Core (`@rack-mcp/core-domain`):**
   - The core geometry, collision, power DAG, and 3D spline routing engine compiles with `"types": []` and has zero access to `fs`, `child_process`, `net`, or DOM APIs.

## Reporting a Vulnerability

If you discover a security vulnerability (for example, a path-traversal edge case in `export_deliverables`, a cross-tenant isolation issue, or an injection vector in SVG/OpenSCAD/Markdown generation), please **do not open a public issue**.

Instead, please report it privately via **GitHub Private Vulnerability Reporting** (`Security` tab $\rightarrow$ `Report a vulnerability`) on the repository. We will acknowledge your report within 48 hours and publish a fix and advisory promptly.
