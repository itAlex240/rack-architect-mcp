# `@rack-mcp/web-viewer`

Interactive React 19 + Three.js (`@react-three/fiber`) 3D Digital Twin, 2D SVG CAD Inspector, Hardware Catalog & Cable Patch Builder, 1-click Auto-Optimize (`optimize_rack`), BOM/Build Book (PDF/Print) & 3D-Print Hub (with interactive `StlPreview3D` print-bed fit overlay), and W3C WebMCP (`document.modelContext`) browser client for **RackArchitect MCP**.

- **Live Demo:** [https://italex240.github.io/rack-architect-mcp/](https://italex240.github.io/rack-architect-mcp/)
- **Dual-Mode Operation:** Automatically connects to the local MCP WebSocket sidecar (`ws://127.0.0.1:3100/ws`) when running locally, or falls back after `1800 ms` to a 100% client-side `STANDALONE DEMO` mode in the browser.
