# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Security Architecture (Local-First by Design)

**RackArchitect MCP (`@rack-mcp/*`)** is designed as a **Zero-Cloud, Local-First developer and homelab tool**:

1. **Loopback-Only Sidecar Binding (`127.0.0.1:3100`):**
   - By default, `@rack-mcp/mcp-server` binds its HTTP and WebSocket sidecar server strictly to `127.0.0.1` (`localhost`). It does not expose ports on LAN (`0.0.0.0`) unless explicitly overridden via `--host`.
2. **Stdio JSON-RPC Isolation:**
   - AI agent communication with Claude Desktop, Cursor, or Antigravity runs over standard input/output (`stdio`) under the local user's OS process permissions.
3. **Static File Path-Traversal Protection:**
   - The embedded static asset server in `packages/mcp-server/src/sidecar/sidecar-server.ts` normalizes all paths and enforces `filePath.startsWith(distDir)` to block `../` directory traversal attacks.
4. **Atomic File Writes:**
   - Updates to `rack.yaml` are written to `<projectPath>.tmp` first and atomically renamed via `fs.renameSync()` so interrupted processes never corrupt project files.
5. **Pure Deterministic Core (`@rack-mcp/core-domain`):**
   - The core geometry, collision, power DAG, and routing engine compiles with `"types": []` and has zero access to `fs`, `child_process`, `net`, or DOM APIs.

## Reporting a Vulnerability

If you discover a security vulnerability (for example, a path-traversal edge case in `export_deliverables` or an injection vector in SVG/OpenSCAD generation), please **do not open a public issue**.

Instead, please report it privately via **GitHub Private Vulnerability Reporting** (`Security` tab $\rightarrow$ `Report a vulnerability`) on the repository. We will acknowledge your report within 48 hours and publish a fix and advisory promptly.
