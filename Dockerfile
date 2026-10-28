# ==============================================================================
# RackArchitect MCP (@rack-mcp/*) — Multi-Stage Production Dockerfile
# Builds all 6 packages (including the React 19 + Three.js 3D Web-Viewer)
# and launches the MCP server (--stdio) + HTTP/WebSocket Sidecar on port 3100.
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app
RUN npm install -g pnpm@10

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json vitest.config.ts ./
COPY packages ./packages
COPY examples ./examples

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:22-alpine AS runner

LABEL io.modelcontextprotocol.server.name="io.github.itAlex240/rack-architect-mcp"
LABEL org.opencontainers.image.source="https://github.com/itAlex240/rack-architect-mcp"
LABEL org.opencontainers.image.description="RackArchitect MCP — 3D/2D Rack-as-Code homelab planner, 5-stage validator, CAD SVG/BOM & watertight STL generator."

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/examples ./examples

EXPOSE 3100

CMD ["node", "packages/cli/dist/bin.js", "serve", "--stdio", "--host", "0.0.0.0", "--port", "3100", "--project", "examples/10inch-homelab/rack.yaml"]
