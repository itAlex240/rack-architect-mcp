# ==============================================================================
# RackArchitect MCP (@rack-mcp/*) — Zero-CVE Hardened Multi-Stage Dockerfile
# Builds all 6 packages (including the React 19 + Three.js 3D Web-Viewer),
# prunes devDependencies (esbuild/vite/vitest), strips unused runtime package
# managers (npm/yarn/corepack) and distrusted emSign CAs, and runs as USER node.
# ==============================================================================

FROM node:22-alpine AS builder

WORKDIR /app
RUN apk update && apk upgrade --no-cache && npm install -g pnpm@10

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json vitest.config.ts ./
COPY packages ./packages
COPY examples ./examples

ENV CI=true
RUN pnpm install --frozen-lockfile
RUN pnpm build
RUN pnpm install --prod --frozen-lockfile --ignore-scripts && \
    rm -rf node_modules/.pnpm/*esbuild* packages/web-viewer/dist/assets/*.map && \
    node packages/cli/dist/bin.js validate --project examples/10inch-homelab/rack.yaml

FROM node:22-alpine AS runner

LABEL io.modelcontextprotocol.server.name="io.github.itAlex240/rack-architect-mcp"
LABEL org.opencontainers.image.source="https://github.com/itAlex240/rack-architect-mcp"
LABEL org.opencontainers.image.description="RackArchitect MCP — 3D/2D Rack-as-Code homelab planner, 5-stage validator, CAD SVG/BOM & watertight STL generator."

# Apply latest Alpine security updates, remove unused npm/yarn CLIs from runtime image,
# and strip distrusted eMudhra/emSign root CAs for 0 High/Critical Trivy CVEs.
RUN apk update && apk upgrade --no-cache && \
    rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack \
           /opt/yarn-* \
           /etc/ssl/certs/*emSign* \
           /usr/share/ca-certificates/mozilla/*emSign* 2>/dev/null || true

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
