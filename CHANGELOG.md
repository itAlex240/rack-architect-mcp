# Changelog

All notable changes to **RackArchitect MCP (`@rack-mcp/*`)** are documented in this file (**English first, followed by the German summary / Deutsche Zusammenfassung**).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.7] - 2026-10-29

### Fixed — Release Pipeline & CodeQL Code Scanning Remediation (🇬🇧 English)
- **GitHub Actions Release Pipeline & Official MCP Registry `server.json` Validation (`.github/workflows/release.yml`, `server.json`):**
  - Restored the `"packages"` (`mcpb` desktop bundle) manifest entry alongside `"remotes"` (`streamable-http` + `sse`) in `server.json`, added defensive `packages` initialization in `.github/workflows/release.yml` Step 7, and kept `server.json` `description` within the official MCP Registry `<= 100`-character schema constraint (`mcp-publisher validate`).
- **GitHub CodeQL Security & Quality Remediation (`@rack-mcp/exporters`, `@rack-mcp/web-viewer`, `@rack-mcp/mcp-server`, `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`):**
  - Fixed overly permissive character-class ranges (`[^A-Z0-9 -._/]` -> `[^A-Z0-9 ._/-]`, CodeQL `js/overly-large-range`) in `sanitizeCoverPanelLabel` (`openscad-carrier.ts`) and `sanitizeClientCoverPanelLabel` (`standalone-homelab.ts`), preventing unintended ASCII `0x20..0x2E` punctuation leakage and covering glyph sanitization with dedicated unit tests.
  - Replaced `dangerouslySetInnerHTML` SVG preview rendering in `BomAndExportsView.tsx` with a sandboxed `data:image/svg+xml;charset=utf-8` `<img />` preview (`js/xss-through-dom`), replaced polynomial trailing-slash/padding/kebab regexes on HTTP-header-tainted inputs with deterministic $O(n)$ helpers (`js/polynomial-redos`), stripped untrusted `output_dir` parameters from WebSocket `export_deliverables` frames (`js/path-injection`), and hardened dynamic object-map indexing with `Object.defineProperty` guards.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Fix der GitHub-Release-Pipeline & Validierung für die offizielle MCP-Registry (`.github/workflows/release.yml`, `server.json`):**
  - In `server.json` sowohl das `"packages"`-Bundle (`mcpb`) als auch die gehosteten `"remotes"`-Endpunkte (`streamable-http` & `sse`) kombiniert, Step 7 in `.github/workflows/release.yml` abgesichert und die `description`-Länge auf das strikte `<= 100`-Zeichen-Limit von `mcp-publisher validate` abgestimmt.
- **Behebung der GitHub CodeQL Code-Scanning-Warnungen (`@rack-mcp/exporters`, `@rack-mcp/web-viewer`, `@rack-mcp/mcp-server`, `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`):**
  - Unbeabsichtigte ASCII-Zeichenbereiche (`[^A-Z0-9 -._/]` -> `[^A-Z0-9 ._/-]`, CodeQL `js/overly-large-range`) in `sanitizeCoverPanelLabel` (`openscad-carrier.ts`) und `sanitizeClientCoverPanelLabel` (`standalone-homelab.ts`) behoben und durch Unit-Tests abgesichert.
  - `dangerouslySetInnerHTML` in `BomAndExportsView.tsx` durch ein gekapseltes `data:image/svg+xml` `<img />` ersetzt (`js/xss-through-dom`), lineare $O(n)$-String-Helfer gegen polynomielles Regex-Backtracking (`js/polynomial-redos`) ergänzt, `output_dir` aus WebSocket-Export-Kommandos gefiltert (`js/path-injection`) und dynamische Objekt-Maps über `Object.defineProperty` gehärtet.

## [0.6.6] - 2026-10-29

### Documentation & Registry Visibility (🇬🇧 English)
- **Zero-Install Hosted Remote MCP Visibility Across GitHub, Glama, Registry Manifests & Release Notes (`README.md`, `glama.json`, `server.json`, `docs/RELEASE_NOTES.md`, `docs/COMPLETE_SYSTEM_HANDBOOK.md`, `packages/*/README.md`, `skills/rack-architect/SKILL.md`):**
  - Promoted the live **Zero-Install Hosted Remote MCP endpoint** (`https://rack-mcp.167.233.80.33.sslip.io/mcp` via `Streamable HTTP`, `/sse` via `HTTP+SSE`, and live per-session 3D viewer `/?session=<uuid>`) right into the top Hero callout and **Option A** of the `30-Second Quickstart` in `README.md`, complete with an endpoint reference table, `mcpServers` JSON snippets, 1-line `claude mcp add --transport http` CLI command, and `npx @modelcontextprotocol/inspector` quick-test command.
  - Added dedicated Zero-Install Hosted Remote MCP connection instructions (English & German) directly into `docs/RELEASE_NOTES.md` so every GitHub Release page highlights instant URL-based MCP access without local installation.
  - Updated `glama.json`, `server.json`, `packages/mcp-server/README.md`, `packages/cli/README.md`, `docs/COMPLETE_SYSTEM_HANDBOOK.md`, `skills/rack-architect/SKILL.md`, and `.agents/skills/rack-architect/SKILL.md` so MCP directories (`Glama`, `mcpservers.org`, `Awesome MCP Servers`, and official MCP registries) immediately surface the public Remote MCP URLs.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Prominente Darstellung des Zero-Install Hosted Remote-MCP-Endpunkts auf GitHub, Glama & in allen Dokumentationen (`README.md`, `glama.json`, `server.json`, `docs/RELEASE_NOTES.md`, `docs/COMPLETE_SYSTEM_HANDBOOK.md`, `packages/*/README.md`, `skills/rack-architect/SKILL.md`):**
  - Den live gehosteten **Zero-Install Remote-MCP-Server** (`https://rack-mcp.167.233.80.33.sslip.io/mcp` für `Streamable HTTP`, `/sse` für `SSE` sowie den Live-3D-Session-Viewer `/?session=<uuid>`) direkt oben in den Hero-Bereich und als **Option A** im `30-Second Quickstart` der `README.md` gesetzt — inklusive Endpunkt-Übersichtstabelle, Copy-Paste-`mcpServers`-JSON, 1-Zeilen-Befehl für `claude mcp add --transport http` und `npx @modelcontextprotocol/inspector`.
  - Eigene Remote-MCP-Schnellstart-Blöcke (Englisch & Deutsch) in `docs/RELEASE_NOTES.md` ergänzt sowie `glama.json`, `server.json`, `packages/mcp-server/README.md`, `packages/cli/README.md`, `docs/COMPLETE_SYSTEM_HANDBOOK.md` und beide `SKILL.md`-Dateien aktualisiert, damit Verzeichnisse wie **Glama**, **mcpservers.org** und **Awesome MCP Servers** sofort zeigen, dass der MCP-Server direkt per URL ohne Installation nutzbar ist.

## [0.6.5] - 2026-10-29

### Documentation, Automation & Multi-Agent Handover (🇬🇧 English)
- **Unified Multi-Agent Operational Rules, Zero-Egress DMZ Invariants & Zero-Downtime Auto-Deployment Protocol (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`):**
  - Added Section 10 to `AGENTS.md` codifying all production invariants for the Hosted Remote MCP instance (`https://rack-mcp.167.233.80.33.sslip.io`): strict compatibility with `read_only: true` (`EROFS`) in-memory execution, 100% self-contained assets under the Zero-Egress network DMZ (`br-rackmcp` + `Content-Security-Policy: default-src 'self'`), preservation of multi-tenant fair-share session limits and CSWSH/frame caps, and `server.json` version synchronization.
  - Added canonical `CLAUDE.md` and `GEMINI.md` agent entrypoint files linking directly to `AGENTS.md` (Sections 1–10), `ARCHITECTURE.md`, `docs/DESIGN_SYSTEM.md`, `docs/COMPLETE_SYSTEM_HANDBOOK.md`, and `skills/rack-architect/SKILL.md` so any AI coding agent (Antigravity, Claude Code, Gemini CLI, Cursor) immediately inherits all architectural, security, and release rules.
  - Documented the automated pull-based Zero-Downtime GitHub `main` auto-updater (`rack-mcp-autoupdate.timer` with Trivy `CRITICAL` CVE gate, automatic `:rollback` fallback, DMZ firewall self-healing, and public HTTPS `/health` verification).

### 🇩🇪 Zusammenfassung (Deutsch)
- **Multi-Agenten-Übergabedokumentation, Zero-Egress-DMZ-Invarianten & Zero-Downtime Auto-Update-Protokoll (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`):**
  - Abschnitt 10 in `AGENTS.md` ergänzt: dokumentiert verbindlich alle Produktions- und Sicherheits-Invarianten des gehosteten Remote-MCP-Servers (`https://rack-mcp.167.233.80.33.sslip.io`) — strikte `read_only: true`-Kompatibilität (100 % In-Memory im Remote-Modus), vollständige Eigenständigkeit aller Assets ohne externe Laufzeit-Requests in der Zero-Egress-DMZ (`br-rackmcp`), Erhalt aller Fair-Share-/CSWSH-/Schema-Schutzgrenzen sowie `server.json`-Synchronisation.
  - `CLAUDE.md` und `GEMINI.md` als zentrale Einstiegspunkte für alle KI-Coding-Agenten ergänzt, damit zukünftige Agenten automatisch sämtliche Architektur-, UI-, Sicherheits- und Release-Regeln aus `AGENTS.md` (Abschnitte 1–10) kennen.
  - Vollautomatischen Zero-Downtime Pull-Auto-Updater vom GitHub-`main`-Branch dokumentiert (`rack-mcp-autoupdate.timer` alle 15 Min. inkl. DMZ-Firewall-Selbstheilung, Trivy-`CRITICAL`-CVE-Gate, automatischem `:rollback`-Schutz und HTTPS-`/health`-Prüfung).

## [0.6.4] - 2026-10-29

### Security & Hardening (🇬🇧 English)
- **End-to-End Multi-Tenant Remote MCP, WebSocket, Schema & Container Security Hardening (`@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/mcp-server`, `Dockerfile`):**
  - **Fair-Share Multi-Tenant Session Isolation & Anti-Flood Protection (`remote-session-registry.ts`):** Added per-IP session ownership tracking (`maxSessionsPerIp = 12`), per-IP new-session rate limiting (`20 new sessions/min`), rightmost `X-Forwarded-For` proxy hop extraction (preventing left-prepending IP spoofing), bounded rate-limiter IP tracking (`maxTrackedIps = 10,000`), immediate session cleanup on `/sse` disconnect, and streaming `512 KB` JSON body limits (`413 Payload Too Large`) across both `POST /mcp` and `POST /messages`.
  - **WebSocket Frame Cap, CSWSH Origin Guard & Connection Limits (`sidecar-server.ts`):** Reduced `WebSocketServer` `maxPayload` from the `ws` `100 MB` default down to `256 KB` (`1009 Message Too Big`), disabled `perMessageDeflate` (preventing zip-bomb memory amplification), added Cross-Site WebSocket Hijacking (`CSWSH`) `Origin` verification (`403 Forbidden`), and enforced per-IP (`16`) and per-session (`8`) WebSocket connection caps plus Slowloris HTTP timeouts.
  - **Defensive HTTP Security Headers & Scoped CORS (`sidecar-server.ts`):** Added `Content-Security-Policy` (`default-src 'self'`, `frame-ancestors 'none'`, `object-src 'none'`), `Referrer-Policy: no-referrer` (preventing `?session=<uuid>` leakage via HTTP `Referer`), `X-Frame-Options: DENY`, `Permissions-Policy`, and `Cross-Origin-Opener-Policy: same-origin`, while scoping wildcard CORS (`*`) strictly to public MCP/discovery routes and restricting `/api/state` and `/api/export/*` to the authorized viewer origin.
  - **Algorithmic DoS Schema Bounds, URI Scheme Allowlist & Root-Owned Container Binaries (`core-domain`, `state-manager.ts`, `Dockerfile`):** Enforced strict upper bounds on rack dimensions (`u_height <= 60`), port expansion macros (`count <= 128`, `columns <= 64`, `rows <= 16`), external endpoint groups (`count <= 96`), and custom blueprints per session (`maxCustomBlueprints = 32`); restricted `printables_url` strictly to `http://` or `https://`; optimized per-session catalog initialization via `CatalogRegistry.clone()`; and locked `/app/packages` and `/app/node_modules` ownership to `root:root` inside the `USER node` runtime image.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Umfassendes Security-Hardening für Multi-Session Remote-MCP, WebSockets, Schemas & Docker-Runtime (`@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/mcp-server`, `Dockerfile`):**
  - **Fair-Share Mandanten-Schutz & Anti-Flooding (`remote-session-registry.ts`):** Pro-IP-Session-Limits (`maxSessionsPerIp = 12` & max. `20` neue Sessions/Min.) verhindern, dass ein einzelner Angreifer aktive Sessions anderer Nutzer verdrängen kann; sichere Auswertung des rechten `X-Forwarded-For`-Proxy-Hops gegen Header-Spoofing, sofortige Bereinigung geschlossener `/sse`-Streams sowie striktes `512 KB`-Body-Limit (`413 Payload Too Large`) auf `/mcp` und `/messages`.
  - **WebSocket-OOM-Schutz, CSWSH-Origin-Prüfung & Verbindungslimits (`sidecar-server.ts`):** WebSocket-`maxPayload` von `100 MB` (Standard in `ws`) auf `256 KB` gesenkt (`1009`), `perMessageDeflate` gegen Kompressions-Bomben deaktiviert, Cross-Site-WebSocket-Hijacking-Schutz (`Origin`-Prüfung -> `403 Forbidden`), Verbindungs-Limits pro IP (`16`) und Session (`8`) sowie HTTP-Slowloris-Timeouts ergänzt.
  - **HTTP-Security-Header & Scoped CORS (`sidecar-server.ts`):** Strikte `Content-Security-Policy`, `Referrer-Policy: no-referrer` (kein Leak von `?session=<uuid>` über `Referer`-Header), `X-Frame-Options: DENY`, `Permissions-Policy` und `Cross-Origin-Opener-Policy: same-origin` gesetzt; Wildcard-CORS (`*`) strikt auf öffentliche MCP-Routen begrenzt (`/api/state` und `/api/export/*` sind gegen fremde Origins geschützt).
  - **Algorithmische DoS-Grenzen, URI-Allowlist & `root:root`-Code-Schutz (`core-domain`, `state-manager.ts`, `Dockerfile`):** Obergrenzen gegen Speicher-/CPU-DoS in allen Zod-Schemas (`u_height <= 60`, `port_groups`, `external_endpoints`, max. `32` Custom-Blueprints pro Session), `http(s)://`-Pflicht für `printables_url` (blockiert `javascript:`-URIs), schneller `CatalogRegistry.clone()`-Start sowie unveränderliche `root:root`-Dateirechte für Programmcode im `USER node`-Container.

## [0.6.3] - 2026-10-29

### Fixed (🇬🇧 English)
- **Workspace Production Symlink Preservation in Docker (`Dockerfile`):**
  - Replaced root-only `pnpm prune --prod` with workspace-aware `pnpm install --prod --frozen-lockfile --ignore-scripts` plus a build-time CLI validation smoke check (`rack-mcp validate`), preserving `packages/*/node_modules/@rack-mcp/*` workspace symlinks while keeping **0 Critical and 0 High Trivy CVEs**.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Workspace-Symlinks im Produktions-Docker-Image (`Dockerfile`):**
  - `pnpm prune --prod` (das nur das Root-Manifest betrachtet) durch das Workspace-weite `pnpm install --prod --frozen-lockfile --ignore-scripts` inklusive Build-Zeit-Selbsttest (`rack-mcp validate`) ersetzt — alle `@rack-mcp/*`-Workspace-Links bleiben intakt bei weiterhin **0 Critical und 0 High Trivy-CVEs**.

## [0.6.2] - 2026-10-29

### Fixed & Hardening (🇬🇧 English)
- **Non-Interactive Docker Build Pruning & Sourcemap Cleanup (`Dockerfile`):**
  - Set `ENV CI=true` in the `builder` stage so `pnpm prune --prod --ignore-scripts` runs cleanly in headless non-TTY Docker builds without triggering `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`.
  - Explicitly stripped any residual `*esbuild*` virtual-store directories and `packages/web-viewer/dist/assets/*.map` sourcemaps prior to copying into `runner`.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Headless Docker-Build-Fix & Sourcemap-Bereinigung (`Dockerfile`):**
  - `ENV CI=true` im `builder`-Stage gesetzt, damit `pnpm prune --prod --ignore-scripts` auch in nicht-interaktiven Docker-Builds ohne TTY (`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`) sauber durchläuft, und `.map`-Sourcemaps sowie etwaige `*esbuild*`-Reste vor dem Kopieren in `runner` entfernt.

## [0.6.1] - 2026-10-29

### Security & Hardening (🇬🇧 English)
- **Zero-CVE Production Docker Image Hardening (`Dockerfile`):**
  - Added `pnpm prune --prod --ignore-scripts` in the `builder` stage before copying `/app/node_modules` into `runner`, removing build-only devDependencies (`@esbuild/linux-x64/bin/esbuild`, `vite`, `vitest`, `typescript`) from the runtime image (~350 MB smaller footprint and `0` Go stdlib CVEs).
  - Removed unused global package manager CLIs (`/usr/local/lib/node_modules/npm`, `npm`, `npx`, `corepack`, `/opt/yarn-*`) from the `node:22-alpine` runtime stage, achieving **0 Critical and 0 High CVEs** under Trivy container scanning.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Zero-CVE Docker-Runtime-Härtung (`Dockerfile`):**
  - `pnpm prune --prod --ignore-scripts` entfernt reine Build-Abhängigkeiten (`esbuild`, `vite`, `vitest`, `typescript`) vor dem Kopieren in das Produktions-Image (~350 MB schlankeres Image) und löscht ungenutzte globale Paketmanager (`npm`, `npx`, `yarn`) im `runner`-Stage — das Produktions-Image erreicht damit **0 Critical und 0 High CVEs** im Trivy-Sicherheits-Scan.

## [0.6.0] - 2026-10-29

### Added & Improved (🇬🇧 English)
- **Hosted Multi-Session Remote MCP Server (`Streamable HTTP` & `SSE`), Isolated Live 3D Session Viewer (`/?session=<uuid>`), Zero-Disk URL Exports & Production Security Hardening (`@rack-mcp/mcp-server`, `@rack-mcp/web-viewer`, `@rack-mcp/cli`, `Dockerfile`):**
  - **Multi-Tenant Remote MCP Transport (`remote-session-registry.ts`, `sidecar-server.ts`, `cli/src/index.ts`):** Added `--remote-mcp` (`RACK_MCP_REMOTE=1`) and `--public-url` (`RACK_MCP_PUBLIC_URL`) supporting both **MCP Streamable HTTP** (`POST / GET / DELETE /mcp` via `StreamableHTTPServerTransport`) and **Legacy HTTP+SSE** (`GET /sse` + `POST /messages` via `SSEServerTransport`), plus `/.well-known/mcp.json` discovery metadata.
  - **Strict Per-Session Isolation & Live 3D WebSocket Binding (`/?session=<uuid>`):** Each remote MCP connection allocates an isolated in-memory `ProjectStateManager` (bounded by `maxSessions = 200`, `2h` idle TTL sweep, and `512 KB` request body cap) and returns a dedicated `live_viewer_url` (`https://<host>/?session=<uuid>`). Opening that link binds `/api/state?session=<uuid>` and `wss://<host>/ws?session=<uuid>` strictly to that session for real-time bidirectional 3D/2D collaboration, while visiting the root URL `/` without `?session=` safely opens in browser-only `standalone-demo` mode.
  - **Zero-Disk Remote Deliverable Streaming (`tool-handlers.ts`, `mcp-tools.ts`, `sidecar-server.ts`):** In hosted remote mode, `export_deliverables` never writes arbitrary paths onto the server filesystem; instead, it returns direct HTTPS download URLs (`/api/export/elevation.svg`, `/api/export/wiring.svg`, `/api/export/bom.md`, `/api/export/scene.glb`, `/api/export/rack.yaml`, and `/api/export/printable/<carrier>.stl`/`.scad`) generated deterministically in memory.
  - **Bandwidth, Rate-Limit & Container Hardening (`Dockerfile`, `sidecar-server.ts`):** Added sliding-window per-IP rate limiting (`240 req/min` behind trusted reverse proxies), startup pre-computed `gzip` static bundle compression with `Cache-Control: public, max-age=31536000, immutable` on `/assets/*` (omitting `.map` sourcemaps from production RAM/traffic), and hardened the multi-stage `node:22-alpine` `Dockerfile` (`apk upgrade --no-cache`, `emSign` CA purge, non-root `USER node`, and native `/health` `HEALTHCHECK`).

### 🇩🇪 Zusammenfassung (Deutsch)
- **Gehosteter Multi-Session Remote-MCP-Server (`Streamable HTTP` & `SSE`), isolierter Live-3D-Session-Viewer (`/?session=<uuid>`), URL-basierte Exporte & Produktions-Härtung (`@rack-mcp/mcp-server`, `@rack-mcp/web-viewer`, `@rack-mcp/cli`, `Dockerfile`):**
  - **Multi-Session Remote-MCP ohne lokale Installation (`--remote-mcp` / `POST /mcp` & `GET /sse`):** Beliebige MCP-Clients (Claude, Cursor, VS Code, Windsurf, Antigravity) können sich ab sofort direkt per HTTPS-URL (`https://rack-mcp.167.233.80.33.sslip.io/mcp`) verbinden — ganz ohne lokales Node.js oder Docker.
  - **Strikte Mandanten-Trennung & eigener Live-3D-Viewer-Link (`/?session=<uuid>`):** Jede MCP-Verbindung erhält eine komplett isolierte In-Memory-Session (`maxSessions = 200`, automatische `2h`-TTL-Bereinigung) inklusive eigenem Live-3D-Link `https://<domain>/?session=<uuid>` (Echtzeit-Synchronisation über `wss://`), während Besucher der Hauptseite `/` ohne Session-Parameter sicher im lokalen Browser-Demo-Modus arbeiten.
  - **Sichere Download-URLs statt Server-Dateizugriff (`export_deliverables`):** Im Remote-Modus schreibt `export_deliverables` keine Dateien auf die Server-Festplatte, sondern liefert direkte HTTPS-Download-Links für `elevation.svg`, `wiring-schematic.svg`, `BOM.md`, `rack-scene.glb`, `rack.yaml` sowie alle wasserdichten `.stl`- und `.scad`-3D-Druckteile.
  - **Traffic-, Rate-Limit- & Container-Härtung:** Integriertes Sliding-Window-IP-Rate-Limiting (`240 Req/Min`), vorab komprimierte `gzip`-Assets mit `1 Jahr` Browser-Caching (`immutable`), Ausschluss der `.map`-Sourcemaps sowie gehärtetes Non-Root-Alpine-Image (`USER node`, `apk upgrade`, `emSign`-CA-Bereinigung & `HEALTHCHECK`).

## [0.5.0] - 2026-10-29

### Added & Improved (🇬🇧 English)
- **Live Rack Preset Switcher (`10"` · `19"` · `6"` · `Empty`), Shareable Zero-Backend Rack URLs (`#rack=v1...`), Interactive 3D-Print Cover-Panel Configurator & Direct 2-Click 3D Port Patching (`@rack-mcp/web-viewer`, `@rack-mcp/exporters`):**
  - **1-Click Live Rack Preset Switcher (`standalone-presets.ts`, `TopNavBar.tsx`, `useRackState.ts`):** Added an instant preset selector in the top studio navigation bar (`10" Homelab (8U · Proxmox + UniFi)`, `19" Enterprise HA (12U · FortiGate + 24p PoE++)` with `34` routed cables & `16` external drops, `6" DeskMate Micro-Lab (6U · Pi 5 + OpenWrt)` with `10` routed cables & `2` external drops, `Empty 10" Mini-Rack`, and `Empty 19" Server Rack`), allowing zero-install exploration of all three EIA-310 rack standards directly in the browser.
  - **Zero-Backend Shareable Rack Links (`rack-url-codec.ts`, `TopNavBar.tsx`):** Added deterministic URL-safe Base64 encoding/decoding (`#rack=v1.<base64url>`) validated via `RackProjectSchema.safeParse(...)`, automatic boot & `hashchange` hydration, and a **`Share`** button in `TopNavBar` that updates the browser hash and copies the shareable rack URL to the clipboard with `"Copied!"` confirmation.
  - **Interactive 3D-Print Slot Cover-Panel Configurator (`openscad-carrier.ts`, `standalone-homelab.ts`, `BomAndExportsView.tsx`):** Added Section **2.1 Custom 3D-Print Slot Cover-Panel Configurator** supporting **Rack Standard** (`10inch` / `19inch` / `6inch`), **Slot Height** (`0.5U` / `1U` / `2U` / `3U`), **Surface Pattern** (`lines` / `hex` / `ribs` / `vented-slots` through-cut / `solid`), and **Optional Engraved Front Text** (up to 14 uppercase characters `[A-Z0-9 -._/]`, properly X-mirrored on the `z = 0` build-plate face so face-down zero-support prints read Left-to-Right when mounted), complete with a live inline 2D CAD SVG preview and 1-click `.SCAD` + 100% watertight 2-manifold `.STL` downloads.
  - **Direct 2-Click 3D Port-to-Port Cable Patching (`PortMesh3D.tsx`, `MountedDevice3D.tsx`, `RackSceneCanvas.tsx`, `useRackState.ts`):** Clicking any free 3D port highlights it in emerald (`#10B981`) and opens a floating top-center CAD patching banner (`Esc` or `Cancel` to abort); clicking a second free 3D port automatically infers the matching `CableType` (`cat6a`, `sfp-plus-dac`, `power-c13-c14`, `power-schuko-c13`, `power-usb-c`, `power-dc-5525`, `rj45-serial-rollover`) and routes the 3D spline cable immediately.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Live-Preset-Switcher (`10"` · `19"` · `6"` · `Leer`), teilbare Rack-URLs ohne Backend (`#rack=v1...`), interaktiver 3D-Druck-Cover-Panel-Konfigurator & direktes 2-Klick-3D-Port-Patching (`@rack-mcp/web-viewer`, `@rack-mcp/exporters`):**
  - **1-Klick-Rack-Preset-Switcher in der Top-Navigation (`TopNavBar.tsx`, `standalone-presets.ts`):** Live-Umschaltung im Browser zwischen dem **8U 10-Zoll Proxmox & UniFi Homelab**, dem **12U 19-Zoll Enterprise HA-Rack** (`34` Kabel, `16` externe Zuleitungen, geschlossenes `1U`-Cover-Panel auf `U7 Front`), dem **6U 6-Zoll DeskMate Micro-Lab** (`10` Kabel, `2` externe Zuleitungen) sowie **leeren 10"- und 19"-Racks** zum sofortigen Selbstbauen.
  - **Teilbare Rack-Links per URL-Hash (`#rack=v1.<base64url>`):** Neuer **`Share`**-Button in der oberen Leiste kodiert das aktuelle Rack-Setup deterministisch in die URL (validiert gegen `RackProjectSchema`), kopiert den Link in die Zwischenablage (`Copied!`) und lädt geteilte Links beim Öffnen automatisch ohne Server/Datenbank.
  - **Interaktiver 3D-Druck Cover-Panel-Konfigurator (`0.5U`–`3U`, 5 Muster + eigene Front-Gravur):** Neuer Konfigurator im Tab **`BOM & 3D-Print`** (*2.1 Custom 3D-Print Slot Cover-Panel Configurator*) für **10" / 19" / 6"**, Höhen **`0.5U` / `1U` / `2U` / `3U`**, Muster (**Lines**, **Hex-Grid**, **Tech-Ribs**, luftdurchlässige **Vented Airflow Slots** oder **Solid**) sowie **eigenen eingravierten Front-Text** (z. B. `HOMELAB-01` oder `PROXMOX`, auf der `z = 0`-Druckbettseite korrekt X-gespiegelt für stützfreien Face-Down-Druck) — inklusive Live-2D-CAD-Vorschau und 1-Klick-Download als `.SCAD` und 100 % wasserdichte 2-Manifold-`.STL`.
  - **Direktes 2-Klick-Kabel-Patchen an den 3D-Ports (`PortMesh3D.tsx`, `RackSceneCanvas.tsx`):** Ein Klick auf einen freien 3D-Port markiert ihn smaragdgrün und zeigt ein kompaktes CAD-Patch-Banner (`Esc` zum Abbrechen); ein zweiter Klick auf den Ziel-Port erkennt automatisch den passenden Kabeltyp und verlegt das 3D-Kabel sofort.

## [0.4.12] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **3D-Printable Designer Slot Cover Panels (`1U` & `2U` • `Lines` / `Hex` / `Tech-Ribs`), Closed `U2 Front` Slot Above UPS & Watertight `.SCAD`/`.STL` Generators (`@rack-mcp/hardware-catalog`, `@rack-mcp/exporters`, `@rack-mcp/web-viewer`):**
  - **7 New 3D-Printable Designer Slot Cover Panels Added to Hardware Catalog (`60` $\rightarrow$ `67` Blueprints):** Added closed, zero-cable-passthrough 3D-printable blanking cover panels across `1U` and `2U` slot sizes, surface relief patterns (`lines` = Horizontal Precision Lines, `hex` = Blind Hexagonal Honeycomb Relief, `ribs` = Vertical Tech-Ribs), and rack standards (`10inch`, `19inch`, `6inch`):
    1. `3dprint-10inch-cover-panel-lines-1u` (`1U`, `45 g`, Horizontal Precision Lines)
    2. `3dprint-10inch-cover-panel-hex-1u` (`1U`, `42 g`, Blind Hexagonal Honeycomb Relief)
    3. `3dprint-10inch-cover-panel-lines-2u` (`2U`, `85 g`, 6 Horizontal Precision Lines)
    4. `3dprint-10inch-cover-panel-ribs-2u` (`2U`, `88 g`, Vertical Tech-Ribs, `#E5E7EB`)
    5. `3dprint-19inch-cover-panel-lines-1u` (`1U`, `85 g`, 19-Inch Horizontal Precision Lines)
    6. `3dprint-19inch-cover-panel-hex-2u` (`2U`, `160 g`, 19-Inch Hexagonal Honeycomb Relief)
    7. `3dprint-6inch-cover-panel-lines-1u` (`1U`, `28 g`, 6-Inch Horizontal Precision Lines)
  - **Closed Open Slot on `U2 Front` Above the UPS (`reference-homelab.ts`, `standalone-homelab.ts`, `examples/10inch-homelab/rack.yaml`):** Mounted `cover-u2` (`3dprint-10inch-cover-panel-lines-1u`, `depth_mm: 8.0 mm`) on `U2 Front` directly above `ups-u1` (`U1 Front`) while `pdu-u2-rear` (`depth_mm: 55.0 mm`) remains on `U2 Rear` (`177 mm` internal Z clearance, `0` collisions, `19` total mounted devices), closing the front of `U2` with a clean patterned faceplate.
  - **3D WebGL, 2D CAD Elevation SVG & `.glb` Surface Pattern Rendering (`MountedDevice3D.tsx`, `elevation-svg.ts`, `glb-exporter.ts`):** Rendered recessed decorative bezels and 3D relief patterns (`lines`, `hex`, `ribs`) on `blank-panel` devices in the 3D viewer, 2D CAD elevation drawing, and binary glTF 2.0 exports (`rack-scene.glb`).
  - **Parametric OpenSCAD (`.scad`) & 100% Watertight 2-Manifold `.stl` Cover Panel Generators + Browser Download Hub (`openscad-carrier.ts`, `BomAndExportsView.tsx`):** Upgraded the `.scad` and `.stl` generators to produce closed `4.2 mm` faceplates with `1.4 mm` blind decorative pattern grooves on the front (`2.8 mm` solid backing wall, zero through-holes) plus rear perimeter stiffening ribs (`Z = 4.2..8.0 mm`), pre-generated all 4 10-inch `.scad`/`.stl` cover panels into `examples/10inch-homelab/`, and added Section **2.1 3D-Printable Slot Cover Panels Library** in the `BOM & 3D-Print Hub` tab.

### 🇩🇪 Zusammenfassung (Deutsch)
- **3D-druckbare Designer-Cover-Panels (`1U` & `2U` • `Linien` / `Waben` / `Tech-Rippen`), geschlossener `U2 Front`-Slot über der USV & 2-Manifold `.SCAD`/`.STL`-Dateien (`@rack-mcp/hardware-catalog`, `@rack-mcp/exporters`, `@rack-mcp/web-viewer`):**
  - **7 neue 3D-druckbare Cover-Panels im Hardware-Katalog (`60` $\rightarrow$ `67` Blueprints):** Komplett geschlossene Frontblenden ohne Kabeldurchlass für `1U`- und `2U`-Slots mit verschiedenen Oberflächen-Mustern (**horizontale Präzisions-Linien**, **Hexagon-Wabenrelief**, **vertikale Tech-Rippen**) für `10inch`-, `19inch`- und `6inch`-Racks.
  - **Offener Slot auf `U2 Front` über der USV geschlossen (`cover-u2`):** Auf `U2 Front` (direkt über der USV auf `U1`, wo hinten auf `U2 Rear` die Steckdosenleiste sitzt) ist nun standardmäßig das `1U` Designer-Cover-Panel `3dprint-10inch-cover-panel-lines-1u` (`8 mm` Tiefe, `177 mm` Freiraum zur hinteren PDU, `0` Kollisionen) montiert, sodass die Vorderseite von `U2` sauber mit einem feinen Linien-Relief geschlossen ist.
  - **Parametrischer `.scad`- & wasserdichter `.stl`-Generator + direkter Download für alle Muster & Größen:** Alle 4 10-Zoll-Cover-Panel-Varianten (`1U Lines`, `1U Hex`, `2U Lines`, `2U Tech-Ribs`) liegen als druckfertige `.scad`- und `.stl`-Dateien unter `examples/10inch-homelab/` und können zudem im Tab **`BOM & 3D-Print Hub`** unter **2.1 3D-Printable Slot Cover Panels Library** mit 1 Klick heruntergeladen werden.

## [0.4.11] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Top-Rear External ISP WAN & PoE Building Cable Drops in the GitHub Pages Demo, 3D Roof Conduit Collar & 2D/3D/GLB Exporters (`@rack-mcp/web-viewer`, `@rack-mcp/exporters`):**
  - **4 External Building & ISP Drops (`external_endpoints`) in the 8U 10-Inch Homelab Reference Scene & Live GitHub Pages Demo (`standalone-homelab.ts`, `reference-homelab.ts`, `examples/10inch-homelab/rack.yaml`):** Added 4 overhead external cable drops (`entry_position: 'top-rear'`) terminating onto the rear of the 12-port patch panel (`patch-u7:p6..p9`) and patched on the front to the gateway and PoE++ switch (`22` total cables, `33.5W / 196W` active PoE load):
    1. `ext-isp-wan` (**ISP Glasfaser-ONT 2.5G WAN-Uplink**, `category: 'isp-wan-uplink'`, `#EC4899`) $\rightarrow$ `patch-u7:p6` (rear) $\rightarrow$ front patch cable `patch-front-p6-wan` to `ks-u3-wan:coupler` (front) $\rightarrow$ `ucg-max:wan` (rear).
    2. `ext-ap-eg` (**UniFi U7-Pro Wi-Fi 7 Ceiling AP**, `category: 'wifi-ap'`, `21W` PoE+, `2.5gbe`, `#0EA5E9`) $\rightarrow$ `patch-u7:p7` (rear) $\rightarrow$ front patch cable `patch-front-p7-sw7` to `sw-u8:eth7` (2.5G PoE++).
    3. `ext-cam-einfahrt` (**4K PoE+ Surveillance Camera Driveway / Entrance**, `category: 'poe-camera'`, `12.5W` PoE+, `1gbe`, `#F59E0B`) $\rightarrow$ `patch-u7:p8` (rear) $\rightarrow$ front patch cable `patch-front-p8-sw8` to `sw-u8:eth8` (2.5G PoE++).
    4. `ext-office-lan` (**Home-Office 2.5G Workstation Wall Outlet**, `category: 'workstation-dock'`, `0W`, `2.5gbe`, `#14B8A6`) $\rightarrow$ `patch-u7:p9` (rear) $\rightarrow$ front patch cable `patch-front-p9-sw9` to `sw-u8:eth9` (10G/2.5G RJ45).
  - **3D Overhead Roof Cable Entry Conduit & Vertical Drop Splines (`RackSceneCanvas.tsx`, `glb-exporter.ts`):** Anchored the `top-rear` cable entry conduit collar at the top-rear roof plane of the rack (`collarY = totalHeightMm + 3.0 mm`) with external drop splines entering vertically from above the rack roof (`Y = totalHeightMm + 30.0 mm`) down through the roof gland to any patch panel U height (`U7` in the 10-inch homelab) in both the interactive 3D WebGL viewport and exported binary glTF 2.0 (`rack-scene.glb`).
  - **2D Rear Elevation & Side-Profile Cutaway External Drop Rendering (`elevation-svg.ts`, `standalone-homelab.ts`):** Rendered the `TOP-REAR ISP / BUILDING CONDUIT` collar and dashed external drop paths (`data-layer="external-building-drops"`) in both the Rear Elevation and Side-Profile Depth Cutaway views, and added a dedicated pink `ISP WAN` badge in `InspectorSidebar.tsx`.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Externe Zuführungskabel von oben (ISP-Glasfaser-WAN, PoE+ Überwachungskamera, PoE+ Wi-Fi 7 AP & 2.5G Büro-LAN) in der GitHub-Pages-Demo, im 3D-Dacheinlass & in allen 2D/3D-Exportern (`@rack-mcp/web-viewer`, `@rack-mcp/exporters`):**
  - **4 externe Gebäude- & Provider-Leitungen (`external_endpoints`, `top-rear`) im 8U 10-Zoll-Homelab & in der GitHub-Demo:**
    1. `ext-isp-wan` (**ISP Glasfaser-ONT 2.5G WAN-Uplink**, `#EC4899`) von oben auf `patch-u7:p6` (hinten) und vorne über `patch-front-p6-wan` auf den `WAN-ISP`-Keystone (`ks-u3-wan` auf U3 $\rightarrow$ `ucg-max:wan`).
    2. `ext-ap-eg` (**UniFi U7-Pro Wi-Fi 7 Decken-AP**, `21W` PoE+, `#0EA5E9`) von oben auf `patch-u7:p7` (hinten) und vorne auf `sw-u8:eth7` (PoE++).
    3. `ext-cam-einfahrt` (**4K PoE+ Überwachungskamera Einfahrt & Haustür**, `12.5W` PoE+, `#F59E0B`) von oben auf `patch-u7:p8` (hinten) und vorne auf `sw-u8:eth8` (PoE++).
    4. `ext-office-lan` (**Home-Office 2.5G Workstation-Dose**, `#14B8A6`) von oben auf `patch-u7:p9` (hinten) und vorne auf `sw-u8:eth9` (10G/2.5G).
  - **Sichtbarer 3D-Kabeleinlass von oben am Rack-Dach (`RackSceneCanvas.tsx`, `glb-exporter.ts`) sowie im 2D-CAD-Schnitt (`elevation.svg`):** Der obere Kabelkanal-Einlass sitzt nun direkt auf dem hinteren Rack-Dach (`Y = totalHeightMm + 3 mm`), sodass die externen Kabel im 3D-Viewer, in der `.glb`-Datei sowie in der 2D-Rückansicht und im 2D-Seitenschnitt sichtbar von oben ins Rack geführt werden und in der rechten Sidebar (`🏠 Haus- & Raum-Verkabelung`) inkl. `33.5W` PoE-Budget erscheinen.

## [0.4.10] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **TDQS (Tool Definition Quality Score) Tier-A Overhaul Across All 12 MCP Tools, Documented `outputSchema` Contracts & Server Instructions (`@rack-mcp/core-domain`, `@rack-mcp/mcp-server`):**
  - **Upgraded All 12 Tool Definitions in `MCP_TOOL_DEFINITIONS` (`mcp-tools.ts`) to TDQS Tier A across All 6 Rubric Dimensions:** Rewrote tool descriptions to explicitly cover **Purpose Clarity** (specific verb + resource + sibling differentiation), **Usage Guidelines** (explicit when-to-use, preconditions, and named alternative tools), **Behavioral Transparency** (exact state/filesystem overwrite semantics, undo-stack behavior, and non-throwing `status: 'INVALID'` error handling), and **Parameter Semantics** (mutually exclusive modes, alias precedence, and filter combination rules) — specifically resolving the previous Glama TDQS ratings on `init_rack` (was Tier C `2.9`), `search_catalog` (was Tier B `3.2`), `validate_rack` (was Tier B `3.3`), and `export_deliverables` (was Tier B `3.3`).
  - **Documented `outputSchema` & `structuredContent` for Every Tool (`mcp-tools.ts`, `server.ts`):** Added fully described Zod output schemas (`SearchCatalogOutputSchema` through `UndoRedoOutputSchema`) and wired `outputSchema` + `structuredContent` into `McpServer.registerTool(...)` so MCP clients and TDQS evaluators receive 100% documented return schemas alongside 100% recursive input parameter description coverage.
  - **Complete MCP Behavioral Annotations & Meaningful Tool Titles:** Declared `title`, `readOnlyHint`, `destructiveHint`, `idempotentHint`, and `openWorldHint` on all 12 tools plus server-level `instructions` (`RACK_MCP_SERVER_INSTRUCTIONS`) on `McpServer`.
  - **Hardened `disconnect_cables` Input & Carrier Cascade Semantics (`tool-handlers.ts`):** Calling `disconnect_cables` with neither `cable_ids` nor `instance_id` now safely returns `status: 'INVALID'` with remediation guidance without mutating state, and supplying a parent `modular-carrier` `instance_id` also disconnects cables attached to its child sub-modules.

### 🇩🇪 Zusammenfassung (Deutsch)
- **TDQS (Tool Definition Quality Score) Tier-A-Upgrade für alle 12 MCP-Tools, dokumentierte `outputSchema`-Definitionen & Server-Instructions (`@rack-mcp/core-domain`, `@rack-mcp/mcp-server`):**
  - **Alle 12 MCP-Tools auf TDQS Tier A optimiert (`mcp-tools.ts`):** Vollständige Überarbeitung der Tool-Beschreibungen nach den 6 Glama-TDQS-Dimensionen (*Purpose Clarity*, *Usage Guidelines*, *Behavioral Transparency*, *Parameter Semantics*, *Conciseness* und *Contextual Completeness*) — behebt gezielt die bisherigen Abzüge bei `init_rack` (vorher C / `2.9`), `search_catalog` (vorher B / `3.2`), `validate_rack` (vorher B / `3.3`) und `export_deliverables` (vorher B / `3.3`) sowie bei allen übrigen Tools.
  - **Dokumentierte `outputSchema`-Verträge & `structuredContent` für alle 12 Tools:** Jedes Tool veröffentlicht nun ein vollständig beschriebenes JSON-Output-Schema (`status`, `summary`, `data`, `issues`) in `tools/list` und liefert validiertes `structuredContent` bei `tools/call`.
  - **Vollständige MCP-Annotationen, Tool-Titel & Server-Instructions:** Alle 12 Tools deklarieren `title`, `readOnlyHint`, `destructiveHint`, `idempotentHint` und `openWorldHint`; zudem veröffentlicht der MCP-Server `RACK_MCP_SERVER_INSTRUCTIONS`.

## [0.4.9] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **30 New Hardware Blueprints Across 10-Inch, 19-Inch & 6-Inch Racks — Doubling the Validated Catalog to 60 Blueprints (`@rack-mcp/hardware-catalog`, `@rack-mcp/web-viewer`, `@rack-mcp/exporters`):**
  - **12 New 10-Inch Rackmount & Sub-Module Blueprints:** Added `ubiquiti-usw-ultra-60w` (`USW-Ultra-60W` 8-Port PoE+ Switch), `ubiquiti-ucg-fiber` (`UCG-Fiber` 10G SFP+ + 2.5G PoE+ Cloud Gateway), `mikrotik-crs309-1g-8s-plus-in` (8× 10G SFP+ Switch), `qnap-ts-433-10inch-3u` (4-Bay 2.5GbE ARM NAS on 10-Inch 3U Tray), `brennenstuhl-10inch-pdu-6way-iec-c13` (6-Way IEC-C13 Alu-Line Rack PDU), `netgear-gs108pp-10inch-poe-plus` (8-Port Gigabit PoE+ `123W` Switch), `3dprint-10inch-intel-nuc-plus-3keystone` (10" 1U Carrier for 4×4" Intel/ASUS NUC + 3× Keystone), `3dprint-10inch-sbc-pikvm-carrier-1u` (10" 1U Carrier for ZimaBoard + PiKVM v4 Mini + 2× Keystone), `hp-elitedesk-800-g6-mini` (1L Proxmox Mini-PC), `intel-nuc-13-pro-slim` (`NUC13ANKi7` Dual 2.5GbE NUC), `zimaboard-832-2-5g-router-nas` (Dual 2.5GbE Single-Board Server), and `pikvm-v4-mini-ip-kvm` (Out-of-Band IP-KVM over PoE).
  - **12 New 19-Inch Enterprise & Homelab Blueprints:** Added `fortinet-fortigate-200f-ngfw-1u` (HA Dual-PSU 10G SFP+ Enterprise NGFW), `apc-smart-ups-li-ion-short-depth-2u` (`SCL1000RMI2UC` 302 mm Short-Depth Li-Ion UPS), `3dprint-19inch-dual-minipc-poe-carrier-1u` (19" 1U Dual Mini-PC + 4× Keystone Carrier), `ubiquiti-udm-se` (`UDM-SE` with 180W PoE+ switch), `ubiquiti-unvr-4bay-1u` (4-Bay 1U 10G SFP+ Protect NVR), `ubiquiti-usw-pro-max-16-poe-rack-1u` (16-Port 2.5G PoE++ + 10G SFP+ with 19" 1U Rackmount Kit), `mikrotik-crs326-24g-2s-plus-rm` (24× GbE + 2× 10G SFP+ Switch), `mikrotik-ccr2004-16g-2s-plus` (Dual-PSU Cloud Core Router), `synology-rs1221-plus-2u` (8-Bay 2U Short-Depth RackStation NAS), `brennenstuhl-19inch-pdu-8way-schuko-1u` (8-Way Schuko 19" PDU), `generic-19inch-shelf-1u` (19" 1U Heavy-Duty Vented Cantilever Shelf), and `generic-19inch-blank-panel-1u` (19" 1U Flanged Steel Blanking Panel).
  - **6 New 6-Inch Micro-Rack Blueprints & Reference Project (`examples/6inch-microlab/`):** Added `ubiquiti-usw-flex-mini-6inch` (`USW-Flex-Mini` 5-Port Switch in 6" PETG cradle), `gl-inet-mt3000-beryl-ax-6inch` (`GL-MT3000` Wi-Fi 6 2.5G Router in 6" PETG cradle), `generic-6inch-patch-panel-6port` (6-Port Cat6A Micro Patch Panel), `generic-6inch-usb-pd-pdu-4port` (200W 4× USB-C PD + 12V DC GaN Power Strip with OLED), `generic-6inch-brush-panel-1u` (6" 1U Brush Strip Panel), `3dprint-6inch-rpi5-plus-keystone-carrier-1u` (6" 1U Carrier for Raspberry Pi 5 + 2× Keystone), and the complete [`examples/6inch-microlab/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/6inch-microlab/rack.yaml) reference project.
  - **3D & 2D Visual Detail Upgrades (`MountedDevice3D.tsx`, `elevation-svg.ts`, `standalone-homelab.ts`):** Added procedural 3D and 2D CAD rendering for multi-bay hot-swap NAS/NVR drive sleds (`2`, `4`, `7`, and `8` drive bays with release latches and drive status LEDs), open L-shaped ventilated cantilever shelves (`10"` and `19"`), and `6"`/`10"` matte-black PETG adapter cradles for compact desktop gateways and switches.

### 🇩🇪 Zusammenfassung (Deutsch)
- **30 neue Hardware-Blueprints für 10-Zoll-, 19-Zoll- & 6-Zoll-Racks — Verdopplung des validierten Katalogs auf 60 Teile (`@rack-mcp/hardware-catalog`, `@rack-mcp/web-viewer`, `@rack-mcp/exporters`):**
  - **12 neue 10-Zoll-Rack- & Sub-Modul-Teile:** `ubiquiti-usw-ultra-60w`, `ubiquiti-ucg-fiber`, `mikrotik-crs309-1g-8s-plus-in`, `qnap-ts-433-10inch-3u` (4-Bay 3U NAS), `brennenstuhl-10inch-pdu-6way-iec-c13`, `netgear-gs108pp-10inch-poe-plus`, `3dprint-10inch-intel-nuc-plus-3keystone`, `3dprint-10inch-sbc-pikvm-carrier-1u`, `hp-elitedesk-800-g6-mini`, `intel-nuc-13-pro-slim`, `zimaboard-832-2-5g-router-nas` und `pikvm-v4-mini-ip-kvm`.
  - **12 neue 19-Zoll-Enterprise- & Homelab-Teile:** `fortinet-fortigate-200f-ngfw-1u`, `apc-smart-ups-li-ion-short-depth-2u`, `3dprint-19inch-dual-minipc-poe-carrier-1u`, `ubiquiti-udm-se`, `ubiquiti-unvr-4bay-1u`, `ubiquiti-usw-pro-max-16-poe-rack-1u`, `mikrotik-crs326-24g-2s-plus-rm`, `mikrotik-ccr2004-16g-2s-plus`, `synology-rs1221-plus-2u` (8-Bay 2U Short-Depth NAS), `brennenstuhl-19inch-pdu-8way-schuko-1u`, `generic-19inch-shelf-1u` und `generic-19inch-blank-panel-1u`.
  - **6 neue 6-Zoll-Micro-Rack-Teile & Referenzprojekt (`examples/6inch-microlab/`):** `ubiquiti-usw-flex-mini-6inch`, `gl-inet-mt3000-beryl-ax-6inch`, `generic-6inch-patch-panel-6port`, `generic-6inch-usb-pd-pdu-4port` (200W USB-C PD GaN-Leiste mit OLED), `generic-6inch-brush-panel-1u` und `3dprint-6inch-rpi5-plus-keystone-carrier-1u`.
  - **Erweiterte 3D- & 2D-CAD-Darstellung:** Detaillierte Hot-Swap-Laufwerksschächte (`2`, `4`, `7` und `8` Bays mit Entriegelungsgriffen und Status-LEDs), offene L-förmige gelochte Fachböden (`shelf`) sowie passgenaue 3D-Druck-Aufnahmeschalen für kompakte Desktop-Switches und Gateways.

## [0.4.8] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Shortest-Direct Monotonic 3D Cable Routing by Default & Optional Side-Duct Overrides (`@rack-mcp/core-domain`, `skills/rack-architect/SKILL.md`):**
  - Refactored `routeSingleCable` in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts) so `same-face-duct` (`Case B`) and `cross-face-portal` (`Case C`) default to **Shortest-Direct Monotonic Orthogonal L-Bend / 1-Step Routing** (`routing_mode: 'shortest-direct'`) instead of forcing every multi-U cable all the way out to the extreme left/right rack side walls and back.
  - **20%–55% Shorter Cable Paths & Lower BOM Costs:** Eliminated horizontal zig-zags (`Right -> Up -> Far-Left -> Up -> Right`) across rear and front plenums (e.g., `trunk-ucg-lan1-to-patch1` dropped from `810.2 mm` to `444.6 mm`; `pwr-pdu-to-ucg` dropped from `523.4 mm` to `261.7 mm`; `cross-sw6-to-ucg-lan2` dropped from `836.4 mm` to `618.5 mm`) while preserving **100% collision-free 3D centerline separation (`>= 6.50 mm` across all 34 cables in `19inch-enterprise` and `>= 7.38 mm` across all 18 cables in `10inch-homelab`)**.
  - **Direct Rear PDU Over-Edge Entry:** Rear PDU cables (`p1.z >= rail_depth_mm - 5 mm`) now step vertically over the PDU's top/bottom edge directly at their socket column `rX1` into the interior rear plenum rather than looping horizontally behind the rear rack posts.
  - **Aligned Brush-Panel Portal Entry (`Case C`):** Cross-face cables now pass through the brush panel at a `portalX` aligned directly with the starting port column `rX1` instead of detouring to the far corner of the brush strip.
  - **Optional Explicit Side-Duct Mode (`routing_mode: 'left-duct' | 'right-duct'`):** Added `CableRoutingModeSchema` to `CableConnectionSchema` in [`rack-project.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/rack-project.ts) so an MCP user or AI agent can explicitly request routing a cable via the left (`FL`/`RL`) or right (`FR`/`RR`) vertical side channel whenever desired.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Kürzeste, sinnvolle & kollisionsfreie 3D-Kabelführung als Standard (`routing_mode: 'shortest-direct'`) + optionale Seitenkanal-Wahl (`left-duct` / `right-duct`):**
  - Die 3D-Kabelführung in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts) führt Kabel ab sofort standardmäßig auf dem **kürzesten monotonen orthogonalen Weg (direkte L-Kurve bzw. 1-Stufen-Weg)** von Port zu Port, statt jedes Kabel unnötig im Zickzack bis ganz an die linke/rechte Außenwand und wieder zurück zu schicken.
  - **20 % bis 55 % kürzere Kabellängen (spart reale Kabelkosten in der BOM):** Unnötige Hin-und-her-Schlaufen sind komplett beseitigt (`trunk-ucg-lan1-to-patch1` sinkt z. B. von `810 mm` auf `445 mm`, `pwr-pdu-to-ucg` von `523 mm` auf `262 mm`), während alle Kabel weiterhin **100 % kollisionsfrei** bleiben (`>= 7,38 mm` Mindestabstand im 10"-Rack, `>= 6,50 mm` im 19"-Enterprise-Rack).
  - **Optionaler Umweg auf Nutzerwunsch (`routing_mode`):** Möchte ein Nutzer im Gespräch mit dem AI-Agent bewusst eine Führung über den linken oder rechten Seitenkanal, kann pro Kabel `routing_mode: "left-duct"` oder `"right-duct"` übergeben werden.

## [0.4.7] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Consistent English-First, German-Second Release Notes, Archive & Changelog Structure (`docs/RELEASE_NOTES.md`, `docs/RELEASE_ARCHIVE.md`, `CHANGELOG.md`, `.github/workflows/release.yml`):**
  - Unified [`docs/RELEASE_NOTES.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_NOTES.md), [`docs/RELEASE_ARCHIVE.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_ARCHIVE.md), [`CHANGELOG.md`](file:///home/alexb/projects/rack-designer/CHANGELOG.md), and the automated GitHub Releases curation workflow in [`.github/workflows/release.yml`](file:///home/alexb/projects/rack-designer/.github/workflows/release.yml) so **English always appears first (primary)** followed by the **complete German version (secondary)**, matching the repository's main `README.md` without switching languages back and forth.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Einheitliche Reihenfolge „Englisch zuerst, Deutsch danach" auf der GitHub-Releases-Seite, im Release-Archiv und im Changelog:**
  - [`docs/RELEASE_NOTES.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_NOTES.md), [`docs/RELEASE_ARCHIVE.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_ARCHIVE.md), [`CHANGELOG.md`](file:///home/alexb/projects/rack-designer/CHANGELOG.md) sowie der Release-Workflow [`.github/workflows/release.yml`](file:///home/alexb/projects/rack-designer/.github/workflows/release.yml) folgen nun durchgehend derselben Struktur wie die GitHub-Hauptseite (`README.md`): Zuerst die vollständige englische Version (Release-Highlights, Quick-Start-Guide, Asset-Tabelle), direkt gefolgt von der vollständigen deutschen Version.

## [0.4.6] - 2026-10-28

### Fixed (🇬🇧 English)
- **Zero Cable-Through-Rack-Rail / Frame Penetration, Convex-Hull-Bounded De Casteljau Corner Fillets & Clean Rear/Top Conduit Routing (`@rack-mcp/core-domain`, `@rack-mcp/web-viewer`):**
  - Replaced outward-bulging Barry-Goldman Catmull-Rom corner interpolation in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts) (`evaluateCentripetalCatmullRomSpline`) with **De Casteljau quadratic Bezier inner corner fillets** ($C^1/C^2$ continuous), mathematically guaranteeing **0.0000 mm outward corner overshoot** and zero S-wave oscillation along straight duct runs while preserving exact endpoint clamping (`splinePoints[0] === P_start`, `splinePoints[last] === P_end`).
  - Shifted vertical side-duct margins from `[5.5, 12.5, 19.5]` to `[railWidth + 6.0, railWidth + 12.5, railWidth + 19.0]` (`[21.875, 28.375, 34.875] mm` on 10"/19" racks) and clamped `computePortRiserX` so cables **never pass through the 4 vertical EIA-310 mounting rails (`X ∈ [0, 15.875 mm]` / `[W - 15.875, W]`) or the 4 corner posts**.
  - Bounded interior rear vertical duct Z-planes strictly inside `[maxFrontDeviceZ + 10 mm, rail_depth_mm - 8.5 mm]` (`195–231.5 mm` in 240 mm 10-inch racks; `335–391.5 mm` in 400 mm 19-inch racks) so internal rear LAN/power cables never loop out the back of the rack frame.
  - Updated `ExternalBuildingDrops3D` in [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx) so the rear building cable trunk collar and drop tubes sit strictly inside the upper rear aperture below the top steel roof plate (`Y <= totalHeightMm - 7.5 mm`) and above the lower switch chassis (`Y >= portY`), eliminating both roof-plate and switch-chassis clipping.
  - Aligned 10G SFP+ DAC ports (`sfp4..sfp8`) and left/right PoE/Proxmox ports (`eth2`, `eth23`, `eth24`) in [`examples/19inch-enterprise/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/19inch-enterprise/rack.yaml) so all core SFP+ trunks route as short vertical C-arches (`|dX| <= 48 mm`) and left/right bay cables stay on their respective side of the rack.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Kein Kabel-Clipping durch den Rack-Rahmen mehr, De-Casteljau-Kurven-Fillets & saubere Dach-/Rückseiten-Kabelführung:**
  - Alle vertikalen Kabelschächte liegen nun innerhalb der lichten EIA-310-Öffnung (`X >= 21,875 mm`, `0` Treffer an den 4 vertikalen Montageschienen und Eckpfosten).
  - Konvex-hüllen-beschränkte De-Casteljau-Bezier-Innenbögen verhindern jedes Überschwingen an 90°-Ecken (`0,0000 mm` Overshoot), halten interne Rückseiten-Kabel komplett im Rack-Rahmen und führen externe Haus-Kabel (`top-rear`) sauber unterhalb des Dachblechs ins Patchpanel.

## [0.4.5] - 2026-10-28

### Added & Improved (🇬🇧 English)
- **Automated GitHub Releases Page Curation (Keep Top 3 Recent Releases) & Release Archive (`.github/workflows/release.yml`, `docs/RELEASE_NOTES.md`, `docs/RELEASE_ARCHIVE.md`):**
  - Added automated GitHub Releases curation to [`.github/workflows/release.yml`](file:///home/alexb/projects/rack-designer/.github/workflows/release.yml) so the [GitHub Releases page](https://github.com/itAlex240/rack-architect-mcp/releases) always retains only the **3 most recent releases**, automatically collapses the Quick-Start tutorial into a `<details>` accordion on the 2nd and 3rd releases, and archives older release entries from the feed while preserving all Git tags (`v0.1.0`..`v0.4.2`).
  - Restructured [`docs/RELEASE_NOTES.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_NOTES.md) to show only the **3 most recent version highlights** at the top with a collapsible `<details>` summary for older releases, and created [`docs/RELEASE_ARCHIVE.md`](file:///home/alexb/projects/rack-designer/docs/RELEASE_ARCHIVE.md) to house the complete historical release archive.

### 🇩🇪 Zusammenfassung (Deutsch)
- **Automatische Bereinigung der GitHub-Releases-Seite (Top 3 Releases) & Release-Archiv (`docs/RELEASE_ARCHIVE.md`):**
  - Die GitHub-Releases-Seite behält automatisch nur die 3 aktuellsten Versionen aktiv im Feed, klappt die Einsteiger-Anleitung bei den beiden älteren Releases platzsparend ein und archiviert ältere Releases in `docs/RELEASE_ARCHIVE.md`.

## [0.4.4] - 2026-10-28

### Added & Improved
- **Real-World ANSI/TIA-942 & Homelab Rack Architecture Skill, 1:1 Port-Aligned Patching & 4 Ready-to-Build Use-Case Archetypes (`skills/rack-architect/SKILL.md`, `@rack-mcp/mcp-server`, `@rack-mcp/hardware-catalog`):**
  - Upgraded [`skills/rack-architect/SKILL.md`](file:///home/alexb/projects/rack-designer/skills/rack-architect/SKILL.md) and [`.agents/skills/rack-architect/SKILL.md`](file:///home/alexb/projects/rack-designer/.agents/skills/rack-architect/SKILL.md) with a clear **User Sovereignty vs. Consultative Architecture Mode** (*Mode A*: when a user specifies exact hardware or U-slots, respect their design 100% without fighting them; *Mode B*: when a user only has a rough idea or room/building requirements, apply industry-standard schematics instead of guessing randomly).
  - Documented the **5-Zone Bottom-to-Top Elevation Standard** (ANSI/TIA-942, Ubiquiti UniFi Design Center & DeskPi RackMate best practices), the **1:1 Vertical Port Alignment Law (`pN <-> ethN`)**, **Rear-to-Rear Internal Server Patching**, **Single Strategic 1U Brush Panel placement ("Less is More")**, and a **6-VLAN Enterprise/Homelab Segmentation Matrix** (`VLAN 1/99 Mgmt`, `VLAN 10 Trusted LAN`, `VLAN 20 Wi-Fi`, `VLAN 30 Cameras No-WAN`, `VLAN 40 IoT/Door`, `VLAN 50 Storage/Ceph`).
  - Added **4 Concrete Use-Case Archetypes** to `SKILL.md` and the MCP server guided prompts ([`server.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/mcp/server.ts)):
    1. *Archetype 1:* `8U 10-Inch Silent Smart-Home, Media & NAS Starter Rack` (`< 45W` idle)
    2. *Archetype 2:* `8U 10-Inch Proxmox 2.5G High-Availability Cluster & Dev-Lab`
    3. *Archetype 3:* `9U–12U 19-Inch Smart-Building, PoE Surveillance & Wi-Fi 7 House Rack`
    4. *Archetype 4:* `12U 19-Inch Redundant Enterprise Core, Dual-WAN NGFW & Proxmox HA Stack`
  - Updated [`ubiquiti-usw-pro-max-24-poe.yaml`](file:///home/alexb/projects/rack-designer/packages/hardware-catalog/catalog/19inch/ubiquiti-usw-pro-max-24-poe.yaml) to match the physical single-row 24-port Etherlighting layout (`rows: 1, columns: 24`), enhanced `plan_external_endpoints` in [`tool-handlers.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/mcp/tool-handlers.ts) to default to 1:1 vertical port alignment (`pN -> ethN`), and aligned [`examples/19inch-enterprise/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/19inch-enterprise/rack.yaml) so all 14 building patch cords drop straight down (`p8..p21 <-> eth8..eth21`) with zero diagonal crossings.

## [0.4.3] - 2026-10-28

### Added & Improved
- **Human-Readable Device Descriptions, Full Manufacturer/Model Titles & Physical Mounting Guidance (`@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/exporters`, `@rack-mcp/web-viewer`):**
  - Added `description` to `HardwareBlueprintSchema` in [`hardware-blueprint.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/hardware-blueprint.ts) and populated detailed German/technical descriptions across all 30 catalog and custom blueprints (`packages/hardware-catalog/catalog/**/*.yaml` and `examples/19inch-enterprise/custom-catalog/*.yaml`).
  - Updated [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx) and [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx) (`selected-device-guide-banner`) so selecting any device always shows its full **Manufacturer + Product Model** (`Ubiquiti UniFi Flex 2.5G PoE (USW-Flex-2.5G-8-PoE)`) alongside its assigned `hostname` (`sw-core-flex25g`), a physical **Mounting Method Badge** (`🖨️ Desktop-Gerät (benötigt 3D-Druck-Halterung / 1U-Fachboden)` vs. `🖨️ 3D-gedruckter 1U-Modulträger` vs. `🧩 Sub-Modul` vs. `🔩 Direktmontage`), and the **"Was ist dieses Gerät?"** explanation box.
  - Added 3D rendering of the matte-black PETG **10-Inch 1U Adapter Cradle/Tray** around compact polycarbonate desktop switches (`USW-Flex-2.5G-8-PoE`, `USW-Lite-8-PoE`) and full-span rack ears in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx), plus `.SCAD`/`.STL` cradle downloads in [`BomAndExportsView.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/BomAndExportsView.tsx) and [`standalone-homelab.ts`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/state/standalone-homelab.ts).
  - Added `### 2.1 Geräte-Erklärungen & Montage-Hinweise` to [`bom-markdown.ts`](file:///home/alexb/projects/rack-designer/packages/exporters/src/bom-markdown.ts) and device descriptions to [`CatalogBuilderDrawer.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/CatalogBuilderDrawer.tsx).

## [0.4.2] - 2026-10-28

### Fixed
- **Eliminated Horizontal Clipping in Right Inspector Sidebar & Top Navigation Bar (`@rack-mcp/web-viewer`):**
  - Replaced `gridTemplateColumns: '1fr 1fr'` and `'repeat(3, 1fr)'` across [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx) (`Ports (24)` list, `DIMENSIONS / POWER DRAW`, `UPS Load / PoE Budget`, mechanical KPIs, and demo controls) with `repeat(2, minmax(0, 1fr))` / `repeat(3, minmax(0, 1fr))` and added `minWidth: 0, overflow: 'hidden'` on all grid/flex cards so long port and building-drop labels (`🏢 Primary Fiber ONT (ISP 1)`, `🏠 Wi-Fi 7 PoE++ AP #1`) truncate cleanly with ellipsis instead of expanding the right column off-screen.
  - Locked `<aside data-testid="inspector-sidebar">` to `width: 368px; minWidth: 368px; maxWidth: 368px; overflowX: hidden; boxSizing: border-box`.
  - Updated [`TopNavBar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/TopNavBar.tsx) flex-shrink priorities (`flexShrink: 0` on the `RackArchitect` brand badge, workspace switcher, and action buttons; `flexShrink: 1` with ellipsis on the project title and compact filename badge) so the top navigation bar never clips on the left or right edge.

## [0.4.1] - 2026-10-28

### Fixed
- **Zero 3D Cable-to-Cable Tube Interpenetration (`@rack-mcp/core-domain`, `@rack-mcp/web-viewer`):**
  - Added exact 3D segment-to-segment distance clearance solver (`computeMinSplineClearanceMm`, `>= 6.2 mm` minimum centerline separation) and inter-column port riser shifting (`computePortRiserX`, `±7.8 mm` for 2-row switches and 2U UPS banks) to [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts).
  - Stratified front and rear Z-depth planes (`7.0 mm` lattice spacing), unified front/rear plane allocation across `Case A`, `Case B`, and `Case C` routes, and routed 1–2U vertically aligned patch cables (`dx <= 55.0 mm`) as parallel row-stratified C-arches so patch panels at either `U11` or `U12` have `0` cable-to-cable collisions.
  - Routed short-X front data uplinks on 19-inch racks (`wan1`/`wan2`) via the nearer outer rail channel instead of crossing the entire rack width, and widened 3D rear building drop spacing in [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx).

## [0.4.0] - 2026-10-28

### Added & Fixed
- **Visible 3D Ports, OLED Screens & Strain-Relief Boots on Protruding Devices (`@rack-mcp/web-viewer`):**
  - Projected all 3D port sockets (`PortMesh3D`), OLED screens, and cable terminator boots (`CableTube3D`) onto the device's actual outer faceplate (`chassis_box.min.z - 0.8mm` on `front`, `chassis_box.max.z + 0.8mm` on `rear`) in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx), [`PortMesh3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/PortMesh3D.tsx), and [`CableTube3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/CableTube3D.tsx), fixing invisible/buried RJ45 & SFP+ ports on devices with `front_protrusion_mm > 0` (`ubiquiti-usw-pro-max-24-poe`, `ubiquiti-udm-pro`, `apc-smart-ups-1500-2u`).
  - Added dual front+rear 3D socket rendering on passthrough patch panels (`is_passthrough_coupler: true`) and shielded metallic RJ45/SFP+ port rims.
- **Realistic Hollow 3D Brush Panel with Segmented Nylon Bristles (`@rack-mcp/web-viewer`):**
  - Replaced the solid black chassis box on `brush-panel` (`generic-10inch-brush-panel-1u`, `generic-19inch-brush-panel-1u`) in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) with a hollow 4-sided anodized aluminum frame (`#27272A` with `#71717A` retainer strips) and 56 segmented upper/lower vertical nylon bristles (`#09090B` / `#18181B`) with cable deflection openings where `cross-face-portal` cables pass through.
- **External Building / Room Cable Drops (`external_endpoints`), `plan_external_endpoints` MCP Tool & Step-by-Step Patching Guide (`@rack-mcp/core-domain`, `@rack-mcp/mcp-server`, `@rack-mcp/exporters`, `@rack-mcp/web-viewer`):**
  - Added `ExternalEndpointSchema` (`external_endpoints`) to [`rack-project.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/rack-project.ts) and the `plan_external_endpoints` MCP tool in [`mcp-tools.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/schemas/mcp-tools.ts) and [`tool-handlers.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/mcp/tool-handlers.ts) so external building cables (e.g., 10 PoE cameras, 5 Wi-Fi APs, 5 room LAN outlets for PC, projector, laptop, workstation, docking station) enter from the rear conduit (`top-rear` / `bottom-rear`), terminate on the rear of a Patch Panel (`0U` wasted rack space), and auto-create labeled front patch cables to the switch.
  - Extended Stage 2 & Stage 3 validation in [`validation-engine.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/validation/validation-engine.ts) to trace `external_endpoints` through passive patch-panel couplers to the connected switch port, validating `SPEED_MISMATCH`, `UNPOWERED_DEVICE`, `POE_CLASS_EXCEEDED`, and `POE_BUDGET_EXCEEDED`.
  - Added 3D rear building conduit & rear patch-panel cable drops (`ExternalBuildingDrops3D`), interactive step-by-step patching banner (`selected-cable-guide-banner`), and the **"🏠 Haus- & Raum-Verkabelung (Steck-für-Steck-Anleitung)"** in [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx), [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx), [`BomAndExportsView.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/BomAndExportsView.tsx), and [`bom-markdown.ts`](file:///home/alexb/projects/rack-designer/packages/exporters/src/bom-markdown.ts).

## [0.3.3] - 2026-10-28

### Added & Improved
- **Dedicated Local MCP Engineering Workbench vs. Static GitHub Pages Demo (`@rack-mcp/web-viewer`, `@rack-mcp/mcp-server`, `@rack-mcp/cli`):**
  - Strictly separated `standalone-demo` (GitHub Pages showcase) from `sidecar-live` (`http://127.0.0.1:3100` local engineering workspace) in [`TopNavBar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/TopNavBar.tsx), [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx), and [`useRackState.ts`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/state/useRackState.ts):
    - Removed hardcoded demo tool logs (`DEFAULT_STANDALONE_TOOL_LOG`) and fake collision-simulation buttons (`Simulate LLM Collision`, `1. Trigger Collision`, `2. LLM Self-Correction`, `Reset Demo`) when connected to a live local Sidecar server (`connectionMode === 'sidecar-live'`).
    - Added live **`New Empty Rack` (`init_rack`)** popover, **`Export to Disk` (`export_deliverables`)** trigger, bound `rack.yaml` file indicator (`MCP Live · <file>`), chronological MCP tool-call timestamps (`HH:MM:SS`), **`Clear`** log action (`clear_tool_log`), and a clean `"Ready for External MCP Agent (rack_architect_mcp)"` waiting state.
  - Added multi-process `stdio` + Sidecar synchronization across [`state-manager.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/state-manager.ts), [`sidecar-server.ts`](file:///home/alexb/projects/rack-designer/packages/mcp-server/src/sidecar/sidecar-server.ts), and [`cli/src/index.ts`](file:///home/alexb/projects/rack-designer/packages/cli/src/index.ts):
    - Automatic `EADDRINUSE` ephemeral port fallback (`port: 0`) when port `3100` is already bound by an active Web-Viewer sidecar, plus automatic active `projectPath` discovery from `http://127.0.0.1:3100/api/state` when `rack-mcp serve` is invoked without `--project`.
    - Atomic disk persistence and live file-watcher synchronization of `.rack-mcp-tool-log.json` and `custom-catalog/*.yaml` alongside `rack.yaml` so any external LLM agent running over `stdio` or WebSocket streams its mutations, custom blueprints, and tool calls live into `http://127.0.0.1:3100`.
- **400 mm Realistic 19-Inch Enterprise Network Cabinet & Non-Overlapping Portal Badges (`examples/19inch-enterprise`, `@rack-mcp/exporters`):**
  - Updated [`examples/19inch-enterprise/rack.yaml`](file:///home/alexb/projects/rack-designer/examples/19inch-enterprise/rack.yaml) to a `400 mm` wall/compact network cabinet depth with a short-depth `290 mm` Li-Ion UPS (`apc-smart-ups-li-ion-short-depth-2u`) and zero same-U Front/Rear overlap, plus `68 px` horizontal spacing for Brush-Panel portal badges in [`elevation-svg.ts`](file:///home/alexb/projects/rack-designer/packages/exporters/src/elevation-svg.ts).

## [0.3.2] - 2026-10-28

### Fixed & Improved
- **Coaxial Terminator Boot Insertion & Zero-Clipping 3D Cable Routing (`@rack-mcp/core-domain` & `@rack-mcp/web-viewer`):**
  - Added collinear post-boot approach waypoints (`b1`, `b2`) along the port normal across all 3 routing cases (`direct-vertical-patch`, `same-face-duct`, `cross-face-portal`) in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts), ensuring every cable enters and exits its black strain-relief terminator cylinder 100% coaxially (`0.00mm` lateral kink at boot tips on `patch-u7`, `sw-u8`, `ucg-max`, and `pve-node-01`/`02`).
  - Upgraded Case C (`cross-face-portal`) to a 14-waypoint orthogonal 3D path that steps down into the front U-boundary runner first, traverses straight horizontally through `brush-u6` (`Z = -2mm -> +17mm` at constant `Y = 244.475mm`), and drops vertically in the rear duct at `Z = 206mm` (`21mm` behind the `185mm` carrier shelves of `U5` and `U4`) so it never clips through `carrier-u5` or `carrier-u4`.
  - Refined Rear Duct (`Case B`) and Same-U Rear Jumper (`Case A`) paths so cables step straight back into the rear duct (`Z = 204..214mm`) at port height before moving laterally, eliminating under-shelf loops beneath `carrier-u4` and floor clipping on `carrier-u3`.
  - Inset 3D-printed modular carrier tray floors and side gussets in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) to `spec.W_aperture - 1.5mm` between the left/right rack rails, and extended the `brush-u6` bristle slot across both front and rear faces.

## [0.3.1] - 2026-10-28

### Fixed & Improved
- **Physical 3D Cable Routing & Open 3D-Printed Carrier Trays (`@rack-mcp/core-domain` & `@rack-mcp/web-viewer`):**
  - Eliminated Catmull-Rom tangent overshoot on long vertical/horizontal duct segments (`clampNeighborArm` in [`catmull-rom-router.ts`](file:///home/alexb/projects/rack-designer/packages/core-domain/src/routing/catmull-rom-router.ts)), preventing cables from bowing above `U8` (`sw-u8`) or outside the rack footprint.
  - Added U-boundary horizontal cable comb runners (`computeDeviceHorizontalRunnerY`) and per-U depth-plane transitions (`zPlane1` / `zRearVerticalDuct` / `zPlane2`) so rear cables step out cleanly behind their devices before entering the side ducts and never clip diagonally through `carrier-u3`/`u4`/`u5`, `pdu-u2-rear`, or neighboring sockets.
  - Rendered 3D-printed modular carriers (`category === 'modular-carrier'`) in [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) as open L-shaped PETG trays (`3.2mm` bottom support floor + `3.5mm` side gussets + `4.2mm` slotted front bezel frame) instead of opaque solid boxes, making sub-modules (`ucg-max`, `pve-node-01`/`02`), Keystone couplers, and rear cables 100% visible in 3D without needing X-Ray mode.
  - Aligned 3D cable strain-relief boots in [`CableTube3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/CableTube3D.tsx) strictly along the port normal (`waypoints[1] - waypoints[0]`).
- **2D Side-Profile Depth Cutaway Cable Harness (`@rack-mcp/web-viewer` & `@rack-mcp/exporters`):**
  - Upgraded [`renderClientSideElevationSvg`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/state/standalone-homelab.ts) and [`generateElevationSvg`](file:///home/alexb/projects/rack-designer/packages/exporters/src/elevation-svg.ts) so all 18 cables are rendered in the **Side-Profile Depth Cutaway (`Z-Y` plane)** alongside L-shaped carrier trays, plug clearance boxes, and U6 Brush-Panel Portal grommets.

## [0.3.0] - 2026-10-28

### Changed & Improved
- **Precision Hardware & CAD Studio Redesign (`@rack-mcp/web-viewer`):**
  - Replaced the navy-blue/neon-cyan aesthetic (`#090D16` / `#38BDF8`) with a neutral Carbon/Zinc engineering studio palette (`#09090b`, `#0e0e11`, `#121216`, `#18181d`) and `1px` translucent hairline borders (`rgba(255,255,255,0.07)`), inspired by Linear, Ubiquiti UniFi Design Center, and Shapr3D.
  - Added [`packages/web-viewer/src/styles/studio.css`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/styles/studio.css) with design tokens, `font-variant-numeric: tabular-nums` for telemetry alignment, and custom dark scrollbars.
  - Added [`packages/web-viewer/src/components/ui/Icons.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/Icons.tsx) with 12 geometric vector SVG icons (`1.5px` stroke) replacing emoji-based buttons.
  - Redesigned [`TopNavBar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/TopNavBar.tsx) into a single-line `52px` studio header with zero text wrapping or clipping, a segmented 4-view switcher, compact status indicator dots, and icon buttons.
  - Moved [`FloatingHudToolbar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/FloatingHudToolbar.tsx) to a floating **Bottom-Center CAD Dock** (`bottom: 18px`, `backdropFilter: blur(14px)`) so the 3D rack top never collides with UI controls.
  - Redesigned [`InspectorSidebar.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/ui/InspectorSidebar.tsx) with a sticky 4-way section filter (`All` | `Element` | `Checks` | `MCP`), eliminating nested scroll traps (`maxHeight: 165px`) and replacing neon box borders with clean `2.5px` left severity accent bars.
  - Enhanced 3D rack frame contrast and hardware detail in [`RackFrame3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackFrame3D.tsx), [`MountedDevice3D.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/MountedDevice3D.tsx), and [`RackSceneCanvas.tsx`](file:///home/alexb/projects/rack-designer/packages/web-viewer/src/components/canvas/RackSceneCanvas.tsx) (anodized gunmetal posts, brushed steel EIA-310 rails, recessed front faceplates, and emerald status LEDs).

## [0.2.0] - 2026-10-28

### Added
- **Live MCP Agent Tool-Call Feed & Interactive Self-Correction Replay (`@rack-mcp/mcp-server` & `@rack-mcp/web-viewer`):**
  - Added `McpToolCallEntry` tracking in `ProjectStateManager` (`getToolCallLog()`, `recordToolCall()`) and real-time `toolCallLog` streaming over `/api/state` and WebSocket (`INITIAL_STATE`, `STATE_UPDATED`).
  - Added the **`MCP AGENT TOOL-CALL FEED`** panel in `InspectorSidebar.tsx` and the **`⚡ Simulate LLM Collision` / `✓ Apply LLM Self-Correction`** replay button in `TopNavBar.tsx` so users can inspect every MCP tool call (`init_rack`, `mount_equipment`, `connect_cables`, `modify_equipment`, `validate_rack`) and watch the LLM resolve a 3D `PLUG_CLEARANCE_COLLISION` autonomously.
- **Expanded Guided MCP Prompts to 5 Workflows (`@rack-mcp/mcp-server`):**
  - Added `design-19inch-enterprise-rack`, `design-3d-printed-carrier-bay`, and `audit-poe-and-thermals` alongside `plan-homelab-from-scratch` and `optimize-and-fix-rack`.
- **Automated GHCR Docker Image Publishing (`ghcr.io/italex240/rack-architect-mcp`):**
  - Added `LABEL io.modelcontextprotocol.server.name="io.github.itAlex240/rack-architect-mcp"` to `Dockerfile` and automated `ghcr.io/italex240/rack-architect-mcp:latest` & `:0.2.0` container publishing in `.github/workflows/release.yml`.

## [0.1.3] - 2026-10-28

### Added
- **Official Anthropic MCP Registry (`registry.modelcontextprotocol.io`) Integration:**
  - Added canonical `server.json` (`io.github.itAlex240/rack-architect-mcp`) and `mcpName` verification fields across workspace packages.
  - Upgraded `.github/workflows/release.yml` to build the `.mcpb` release bundle (`rack-architect-mcp.mcpb`), compute its SHA-256 digest, and automatically publish new versions to `https://registry.modelcontextprotocol.io` via GitHub Actions OIDC (`mcp-publisher login github-oidc`).

## [0.1.2] - 2026-10-28

### Added
- **Expanded Hardware Catalog to 30 Precision-Measured Blueprints (`@rack-mcp/hardware-catalog`):**
  - Added 10 new, millimeter-accurate YAML hardware blueprints across all 4 categories:
    - **10-Inch Rackmount:** `mikrotik-crs310-8g-plus-2s-plus-in` (MikroTik CRS310 8x 2.5G + 2x 10G SFP+ Switch), `tp-link-tl-sg2210mp` (TP-Link Omada 8-Port PoE+ 150W + 2x SFP Switch), `synology-ds224-plus-10inch-2u` (Synology DiskStation DS224+ 2-Bay NAS on 10-Inch 2U Tray).
    - **19-Inch Rackmount:** `ubiquiti-unas-pro-2u` (Ubiquiti UniFi UNAS Pro 7-Bay 2U 10G SFP+ NAS), `ubiquiti-usw-aggregation` (Ubiquiti UniFi Switch Aggregation 8x 10G SFP+), `generic-19inch-patch-panel-24port-cat6a` (24-Port Cat6A Passthrough Patch Panel), `generic-19inch-brush-panel-1u` (19-Inch 1U Cable Management Brush Strip Panel).
    - **Sub-U Modules:** `dell-optiplex-7010-micro` (Dell OptiPlex 7010 Micro 1L Proxmox Node with dual 1G/2.5G RJ45, `mini-pc-1liter`), `jetkvm-smart-ip-kvm` (JetKVM Open-Source Out-of-Band IP-KVM with Touchscreen, `jetkvm-bay`).
    - **3D-Printable Modular Carrier:** `3dprint-10inch-rpi5-jetkvm-2keystone` (10-Inch 1U PETG Carrier for 1x Raspberry Pi 5 + 1x JetKVM + 2x Keystone Jacks).
- **Official Open-Source Agent Skill (`skills/rack-architect/SKILL.md` & `.agents/skills/rack-architect/SKILL.md`):**
  - Published the complete autonomous 6-Step "Rack-as-Code" Engineering Workflow as an open-source Agent Skill compatible with Claude Code, Cursor, GitHub Copilot, Windsurf, and Google Antigravity (`npx skills add itAlex240/rack-architect-mcp`).

## [0.1.1] - 2026-10-27

### Added & Improved
- **Watertight 2-Manifold CSG `.stl` 3D-Print Mesher (`@rack-mcp/exporters` & `@rack-mcp/web-viewer`):**
  - Upgraded `generateCarrierStl` and browser client-side `generateClientSideCarrierStl` to a 3D rectilinear CSG voxel mesher (`0` non-manifold edges, `0` unpaired half-edges, `0` internal faces).
  - Directly bakes all 6 EIA-310 M6 mounting slots (`10.0 × 6.5 mm`), `+0.35 mm` FDM print-tolerance device bay cutouts, floor-fused retention guide rails, structural side gussets, and tray floor ventilation cutouts into the exported `.stl` mesh.
  - Added automated 2-manifold edge and signed-volume verification tests in `packages/exporters/test/exporters.test.ts`.

### Security
- **Zero Dependabot Vulnerabilities (`pnpm audit` clean):**
  - Upgraded `zod` to `^4.6.7` and `vitest` / `@vitest/mocker` to `^4.1.12` across all workspace packages and `pnpm.overrides`.
- **CodeQL Code Scanning Hardening:**
  - Replaced dynamic `fs` static file resolution in `sidecar-server.ts` with a pre-indexed in-memory static asset `Map` (`loadStaticWebViewerAssets`), strict loopback CORS origin allowlisting, `Content-Security-Policy` headers on SVG exports, and sanitized error responses.
  - Replaced `dangerouslySetInnerHTML` in `SvgPanZoomViewer.tsx` with a sandboxed `<img src="data:image/svg+xml;...">` element.
  - Added explicit `permissions: contents: read` to `.github/workflows/ci.yml` and global regex replacements (`/#/g`) in exporters.

## [0.1.0] - 2026-10-27

### Added
- **`@rack-mcp/core-domain`:**
  - Right-handed 3D millimeter coordinate engine (`1 U = 44.45 mm`) supporting EIA-310 `19inch`, `10inch`, and `6inch` standards and hierarchical sub-U modularity (`Carrier -> Slot -> ChildDevice`).
  - Dynamic connector plug clearance solver (`CONNECTOR_PLUG_CLEARANCE_MM`) for straight and right-angled plugs (`schuko-cee7`, `iec-c13`/`c14`, `sfp+`, `rj45`, `dc-barrel`, `lenovo-slim-tip`).
  - 5-stage deterministic validation engine producing 26 closed `DiagnosticCode` items with actionable `remediation_suggestions`:
    - Stage 1: Rack bounds & modular carrier slot checks
    - Stage 2: 3D AABB chassis & plug-clearance collision solver + front glass door / rear wall violation checks
    - Stage 3: Electrical & PoE PSE budget DAG solver (`CODE_POE_BUDGET_EXCEEDED`, `CODE_MISSING_POWER_INPUT`, `CODE_EXTERNAL_PSU_UNPLUGGED`, `CODE_PDU_OVERLOAD`)
    - Stage 4: Clamped 3D Catmull-Rom spline cable router (3 physical routing topologies: `direct-vertical-patch`, `same-face-channel`, `cross-face-portal`), bend-radius analyzer, and `SPEED_MISMATCH` (`cat5e` bottleneck on $\ge 2.5\text{ GbE}$ links)
    - Stage 5: Thermal dissipation (`BTU/hr`), airflow conflict (`THERMAL_AIRFLOW_CONFLICT`), passive hotspot stacking (`THERMAL_HOTSPOT_STACKING`), and logarithmic acoustic noise addition ($L_{\text{total}} = 10 \log_{10}(\sum 10^{L_i/10})\text{ dB(A)}$, `ACOUSTIC_NOISE_HIGH`)
- **`@rack-mcp/hardware-catalog`:**
  - 20 precision-measured YAML blueprints across `10inch`, `19inch`, `carriers`, and `sub-modules` (Ubiquiti UniFi USW-Flex-2.5G-8-PoE, UCG-Max, Pro-Max-16-PoE, MikroTik RB5009, Lenovo ThinkCentre M920q Tiny, Dell OptiPlex 7010 Micro, HP EliteDesk 800 G6 Mini, JetKVM, Raspberry Pi 5 PoE Blade, CyberPower 1U UPS, Digitus PDU, DeskPi 12-Port Patch Panel).
  - Automatic `port_groups` matrix macro expansion and local port overlap validation (`pnpm validate:catalog`).
- **`@rack-mcp/exporters`:**
  - Dual-Row CAD `elevation.svg` (`2620 × 1260 px`) with Equipment Schedule, Front View, Horizontally Mirrored Rear View, Cable Callout Lanes, and Right-Hand Z-Depth Cutaway Profile (`Z_min` to `Z_max`).
  - 5-Layer Logical `wiring-schematic.svg` with automatic `VLAN<id>` and `ip_cidr` subnet callouts.
  - Complete Markdown & CSV Bill of Materials (`BOM.md`).
  - Binary glTF 2.0 3D scene exporter (`rack-scene.glb`).
  - Parametric OpenSCAD (`.scad`) and ready-to-slice watertight ASCII `.stl` 3D-print generator (`openscad-carrier.ts`) for all `modular-carrier` blueprints.
- **`@rack-mcp/mcp-server` & `@rack-mcp/cli`:**
  - 11 canonical MCP tools (`init_rack`, `search_catalog`, `get_device_blueprint`, `define_custom_blueprint`, `mount_equipment`, `modify_equipment`, `connect_cables`, `disconnect_cables`, `validate_rack`, `export_deliverables`, `undo_redo`), 4 MCP resources, and 2 guided prompts.
  - 50-step Undo/Redo history with atomic `.tmp` $\rightarrow$ `rename` persistence and real-time WebSocket sidecar (`http://127.0.0.1:3100`).
  - Unified `rack-mcp` CLI (`serve`, `validate`, `export`).
- **`@rack-mcp/web-viewer`:**
  - React 19 + Three.js (`@react-three/fiber`) live 3D Digital Twin with `X-Ray Chassis`, `Clearance Boxes`, `Explode Z (0..140 mm)`, and 4 camera presets.
  - Interactive `CatalogBuilderDrawer` (`+ Mount on U<N>` & point-to-point 3D cable patching with VLAN/CIDR), `Import JSON`, `Remove Device`, `Disconnect Cable`, and 1-click `.SCAD`/`.STL`/`.GLB`/`.SVG`/`BOM.md` downloads.
  - Progressive W3C WebMCP (`document.modelContext.registerTool`) browser integration.
