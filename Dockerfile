# ==============================================================================
# RackArchitect MCP (@rack-mcp/*) — Hardened Multi-Stage Production Dockerfile
# Builds all 6 packages (including the React 19 + Three.js 3D Web-Viewer)
# and launches either local stdio+Sidecar or Hosted Multi-Session Remote MCP
# (via RACK_MCP_REMOTE=1 and RACK_MCP_PUBLIC_URL=https://...).
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app
RUN apk update && apk upgrade --no-cache && npm install -g pnpm@10

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json vitest.config.ts ./
COPY packages ./packages
COPY examples ./examples

RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:22-alpine AS runner

LABEL io.modelcontextprotocol.server.name="io.github.itAlex240/rack-architect-mcp"
LABEL org.opencontainers.image.source="https://github.com/itAlex240/rack-architect-mcp"
LABEL org.opencontainers.image.description="RackArchitect MCP — 3D/2D Rack-as-Code homelab planner, 5-stage validator, CAD SVG/BOM & watertight STL generator."

# Apply latest Alpine security updates and strip distrusted eMudhra/emSign root CAs
RUN apk update && apk upgrade --no-cache && \
    rm -f /etc/ssl/certs/*emSign* /usr/share/ca-certificates/mozilla/*emSign* 2>/dev/null || true

WORKDIR /app
ENV NODE_ENV=production

COPY --chown=node:node --from=builder /app/package.json /app/pnpm-workspace.yaml ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/packages ./packages
COPY --chown=node:node --from=builder /app/examples ./examples

USER node
EXPOSE 3100

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3100/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "packages/cli/dist/bin.js", "serve", "--host", "0.0.0.0", "--port", "3100", "--project", "examples/10inch-homelab/rack.yaml"]
