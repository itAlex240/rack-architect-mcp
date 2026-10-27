## Summary

Briefly describe what this Pull Request adds or fixes:

- [ ] New Hardware Blueprint(s) in `@rack-mcp/hardware-catalog`
- [ ] Core Geometry / Validation / Cable Routing in `@rack-mcp/core-domain`
- [ ] 2D SVG / BOM / GLB / OpenSCAD `.scad` & `.stl` Exporters in `@rack-mcp/exporters`
- [ ] MCP Server / CLI in `@rack-mcp/mcp-server` or `@rack-mcp/cli`
- [ ] 3D/2D Web-Viewer UI in `@rack-mcp/web-viewer`

## Verification Checklist (`AGENTS.md`)

- [ ] `pnpm typecheck` passes with 0 errors under strict TypeScript 5.9 compiler gates
- [ ] `pnpm validate:catalog` passes (all YAML blueprints expand cleanly with zero local port overlaps)
- [ ] `pnpm build` succeeds across all 6 packages
- [ ] `pnpm test` passes all unit & integration tests
- [ ] `@rack-mcp/core-domain` contains zero Node.js (`fs`, `path`, `process`) or DOM/WebGL imports
