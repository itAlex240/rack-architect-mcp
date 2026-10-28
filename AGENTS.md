# AGENTS.md — Operational Rules & Coding Guidelines for AI Agents

## 1. Project Mission & Core Philosophy
You are working on **RackArchitect MCP** (working title), an open-source, agent-first **Rack-as-Code** planning, validation, and 2D/3D visualization platform for 19-inch enterprise racks, 10-inch mini-racks, and 6-inch micro-homelabs.

### The Three Golden Laws
1. **LLMs Never Guess Geometry:** AI agents using our MCP server must never calculate coordinates, cable lengths, or depth collisions in their own context window. Every spatial, electrical, and mechanical truth is computed deterministically by `@rack-mcp/core-domain`.
2. **Single Source of Truth (`rack.yaml`):** The entire state of a planned rack resides in a declarative, human-readable, Git-friendly YAML/JSON file validated by strict Zod schemas.
3. **Actionable Self-Correction Feedback:** Whenever a mutation or validation fails (e.g., depth collision on U4, PoE budget exceeded, missing power cable), the system MUST return structured diagnostic objects containing explicit `remediation_suggestions` so the calling LLM agent can fix the issue autonomously in the next turn.

---

## 2. Monorepo Topology & Strict Dependency Boundaries

This repository uses a strict layered monorepo architecture (TypeScript / Node.js / pnpm workspaces). **Circular dependencies or boundary violations are strictly forbidden.**

| Package | Path | Responsibility | Allowed Internal Dependencies |
| :--- | :--- | :--- | :--- |
| **`@rack-mcp/core-domain`** | `packages/core-domain` | Schemas (Zod), 3D coordinate math, AABB collision solver, PoE/power DAG analyzer, 3D spline cable router. | **NONE** (Zero Node.js-specific or DOM-specific APIs; must run identically in Node and Browser). |
| **`@rack-mcp/hardware-catalog`** | `packages/hardware-catalog` | YAML hardware blueprints (racks, switches, mini-PCs, 3D-printed carriers, PDUs) + catalog loader & validator. | `@rack-mcp/core-domain` |
| **`@rack-mcp/exporters`** | `packages/exporters` | Deterministic 2D SVG elevation/wiring generator, Markdown/CSV BOM generator, and headless GLTF/GLB exporter. | `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog` |
| **`@rack-mcp/mcp-server`** | `packages/mcp-server` | MCP server (`stdio` & `sse`), tool handlers, state manager, file watcher, and local WebSocket sidecar server. | `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog`, `@rack-mcp/exporters` |
| **`@rack-mcp/web-viewer`** | `packages/web-viewer` | React + Three.js (`@react-three/fiber`) live 3D/2D inspection UI connected via WebSocket. | `@rack-mcp/core-domain`, `@rack-mcp/hardware-catalog` |
| **`@rack-mcp/cli`** | `packages/cli` | Unified CLI entry point (`npx rack-mcp`) launching the MCP server and serving the built web viewer. | All packages |

### Critical Boundary Enforcement
* **NEVER** import `fs`, `path`, `process`, or `three` inside `@rack-mcp/core-domain` (use pure TypeScript math and data structures; only lightweight math helpers or `zod` are allowed).
* **NEVER** duplicate collision logic or coordinate calculations inside `@rack-mcp/web-viewer` or `@rack-mcp/exporters`. Both consumers must render the exact computed layout snapshot emitted by `@rack-mcp/core-domain`.

---

## 3. Non-Negotiable Technical Invariants

When writing or modifying code across any package, adhere to these exact invariants:

1. **Internal Unit of Measurement:**
   * All internal geometry, bounding boxes, port positions, clearance zones, and cable lengths are calculated in **millimeters (`mm`)** as floating-point numbers.
   * Rack units (`U` / `HE`) are strictly an input/display abstraction ($1\text{ U} = 44.45\text{ mm}$).
2. **Right-Handed 3D World Coordinate System:**
   * Origin `(0, 0, 0)` is the **bottom-front-left inner corner** of the usable rack mounting plane (bottom of `U1`, front surface of the front mounting rails).
   * `+X` = Left to Right (Width).
   * `+Y` = Bottom to Top (Height).
   * `+Z` = Front to Rear (Depth into the rack enclosure; `Z < 0` is in front of the front rails, `Z > 0` is inside the rack toward the rear rails).
3. **Sub-U Modularity (`Carrier -> Slot -> ChildDevice`):**
   * Never assume a device occupies a full rack unit. Every spatial resolver must support both direct rackmount devices (`MountTarget = RackUnit`) and sub-modules mounted inside a carrier bay (`MountTarget = CarrierSlot`).
   * Global coordinates of a child device port are always resolved via vector addition:
     `GlobalPortPos = CarrierOrigin + SlotOffset + ChildDeviceLocalPortOffset`.
4. **Port Matrix Expansion at Load Time:**
   * Hardware YAML blueprints may define repeating ports (e.g., a 24-port switch or 12-port patch panel) using a `port_groups` matrix macro. The catalog loader MUST expand all port matrices into explicit, flat `PortDefinition[]` objects immediately upon parsing so downstream engines only ever deal with flat port arrays.
5. **Immutable State & Atomic Mutations:**
   * Every MCP tool mutation (`mount_equipment`, `connect_cables`, `modify_equipment`) operates on an immutable state tree, runs the validation pipeline, appends the previous state to an in-memory Undo stack, writes `rack.yaml` atomically (write to `.tmp` then rename), and broadcasts the updated `ComputedRackScene` over WebSocket.

---

## 4. Coding Standards & Conventions

* **Language & Runtime:** TypeScript 5.x with `"strict": true`, `"noUncheckedIndexedAccess": true`, and `"exactOptionalPropertyTypes": true`.
* **Schema-First Development:** Define all data structures in Zod (`packages/core-domain/src/schemas/`) first, and infer TypeScript types using `z.infer<typeof Schema>`. Never write manual interfaces that drift from runtime validation.
* **Naming Conventions:**
  * Files: `kebab-case.ts` (e.g., `aabb-collision-solver.ts`, `catmull-rom-router.ts`).
  * Types & Interfaces: `PascalCase`.
  * Functions & Variables: `camelCase`.
  * Constants & Standard Specs: `UPPER_SNAKE_CASE` (e.g., `EIA_310_10_INCH_SPEC`, `MM_PER_U = 44.45`).
  * Hardware Catalog Slugs: `vendor-model-variant` in lowercase `kebab-case` (e.g., `ubiquiti-usw-flex-2-5g-8-poe`).
* **Error Handling:**
  * Never throw unhandled exceptions inside MCP tool handlers for domain violations (such as overlapping devices or invalid ports). Return a structured MCP response with `isError: false` (or domain-level status `VALID` / `INVALID`) containing the full `DiagnosticReport` so the LLM receives structured guidance.

---

## 5. Development Workflow & Testing Protocol for Agents

Whenever you are assigned an Epic, Feature, or Bugfix in Antigravity, follow this sequence:

1. **Read `ARCHITECTURE.md` First:** Verify the exact mathematical formulas, schema fields, and edge cases before creating files.
2. **Schema & Unit Tests Before Integration:**
   * For any change in `@rack-mcp/core-domain`, write Vitest unit tests (`*.test.ts`) covering both positive cases and failure modes (e.g., front/rear depth collision including power plug clearance, PoE budget overflow, missing front-to-rear cable portal).
3. **Verify Catalog Integrity:**
   * Whenever modifying blueprint schemas or adding YAML files in `@rack-mcp/hardware-catalog`, run the catalog validation test suite to ensure all YAML blueprints parse cleanly and have non-overlapping local ports.
4. **Headless Scene Verification:**
   * Verify 3D coordinates and SVG output via snapshot/geometry assertions in `@rack-mcp/exporters` before touching WebGL/Three.js code in `@rack-mcp/web-viewer`.

### Standard Workspace Commands
* `pnpm typecheck` — Typecheck all packages under strict TypeScript 5.9 compiler gates.
* `pnpm build` — Build all packages in topological order.
* `pnpm test` — Run all Vitest unit and integration suites.
* `pnpm validate:catalog` — Validate all hardware YAML definitions against the Zod blueprint schema.
* `pnpm dev` — Start the MCP server + WebSocket sidecar + Vite hot-reload 3D viewer.

---

## 6. Strict TypeScript & Anti-Vibecode Engineering Rules (Mandatory)

Every contribution across all packages MUST adhere to these zero-compromise engineering rules:

1. **Non-Negotiable Compiler Gates (`tsconfig.base.json`):**
   * Never weaken or disable `"strict": true`, `"noUncheckedIndexedAccess": true`, `"exactOptionalPropertyTypes": true`, `"verbatimModuleSyntax": true`, `"erasableSyntaxOnly": true`, `"noUncheckedSideEffectImports": true`, `"noUnusedLocals": true`, or `"noUnusedParameters": true`.
   * Always use explicit `import type { ... }` and `export type { ... }` for type-only symbols so compiled ESM output contains zero phantom runtime imports.
   * `@rack-mcp/core-domain` MUST keep `"types": []` in its `tsconfig.json` to statically prevent accidental usage of Node.js (`fs`, `path`, `process`) or DOM (`window`, `document`) globals.
2. **Zero Type Widening in Zod Schemas:**
   * **NEVER** use `z.any()`, `z.unknown()`, untyped `z.string()`, or fallback unions like `z.union([StrictEnumSchema, z.string()])` for domain taxonomies (`CableTypeSchema`, `PortCapabilitySchema`, `ConnectorTypeSchema`, `HardwareCategorySchema`, `DiagnosticCodeSchema`).
   * Every domain taxonomy MUST be a closed, explicit `z.enum([...])`. If a new hardware capability, connector, or cable variant is required in a later phase, add it to the canonical enum in `packages/core-domain/src/schemas/` and cover it with unit tests.
3. **Centralized Deterministic Floating-Point Math:**
   * **NEVER** scatter inline `Number(val.toFixed(...))` or raw floating-point equality checks across files.
   * Always use the canonical precision helpers from `@rack-mcp/core-domain` (`roundMm` for $10^{-4}\text{ mm}$, `roundCentis` for $10^{-2}$, `roundTenths` for $10^{-1}$, and `AABB_INTERSECTION_EPSILON_MM = 1e-3`).

---

## 7. Gemini API (`@google/genai`), MCP & WebMCP Standards

1. **Rich Schema Descriptions for Constrained Decoding & Function Calling:**
   * Every Zod schema and property in `@rack-mcp/core-domain` MUST include a concise `.describe(...)` annotation specifying physical units (`mm`, `watts`, `grams`, 1-indexed `U`).
   * Do not rely solely on JSON Schema `minLength`/`maxLength` or `minProperties`/`maxProperties` (which are ignored by LLM constrained decoding on the server); always enforce semantic constraints deterministically inside `@rack-mcp/core-domain` and return structured `DiagnosticIssue` items.
2. **Canonical Tool Registry & Annotations (`MCP_TOOL_DEFINITIONS`):**
   * Both `@rack-mcp/mcp-server` (backend MCP) and `@rack-mcp/web-viewer` (browser WebMCP) MUST consume tool names, descriptions, input schemas, and `annotations` from `MCP_TOOL_DEFINITIONS` in `packages/core-domain/src/schemas/mcp-tools.ts`.
   * Every tool MUST declare `annotations: { readOnlyHint: boolean, consequentialHint?: boolean }` (`readOnlyHint: true` for read-only inspection tools like `search_catalog`, `get_device_blueprint`, `validate_rack`; `consequentialHint: true` for destructive/resetting tools like `init_rack`).
   * Tool descriptions must state *what* the tool does and *when* to use it without repeating parameter names, types, or enum values already present in `inputSchema`.
   * Remote MCP server names MUST use `snake_case` without hyphens (`RACK_MCP_SERVER_NAME = 'rack_architect_mcp'`).
3. **Gemini API & Agent Integration Rules:**
   * Whenever writing code that calls the Gemini API or orchestrates agents, use the `gemini-api-dev` skill and `gemini_search_docs` MCP tool first.
   * Exclusively use the current `@google/genai` SDK (`>= 2.29.1`, `client.interactions.create(...)`) and current models (`gemini-4-argon`, `gemini-3.8-flash`, `gemini-3.5-flash-lite`). Legacy SDKs (`@google/generative-ai`), `generateContent`, and deprecated models (`gemini-2.5-*`, `gemini-2.0-*`, `gemini-1.5-*`) are strictly forbidden.

---

## 8. Modern Web & 3D Viewer Standards (`@rack-mcp/web-viewer`)

1. **Mandatory Pre-Flight Check with `modern-web-guidance`:**
   * Before implementing any HTML, CSS layout, dialog/popover, dark mode, form validation, or client-side Canvas/WebGL UI in `@rack-mcp/web-viewer`, agents MUST query `npx -y modern-web-guidance@latest search "<query>"` and follow the retrieved guides.
2. **Browser Support & Progressive Enhancement Policy:**
   * **Browser Support:** Assume Baseline Widely Available features natively. Allow Baseline Newly Available and Early Preview web platform capabilities (such as WebMCP `document.modelContext` and HTML-in-Canvas `content="drawable"`) ONLY when strictly feature-detected (`if ('modelContext' in document)`, `if ('content' in HTMLCanvasElement.prototype)`) with clean fallbacks and `AbortSignal` cleanup on component unmount.
3. **Client-Side WebMCP Integration:**
   * Use the official `webmcp-types` package (`"types": ["webmcp-types"]`) instead of hand-written `document.modelContext` type declarations.
   * Register client-side tools via `document.modelContext.registerTool(tool, { signal: abortController.signal })` and never use deprecated `navigator.modelContext` or `unregisterTool()`.
   * Never throw raw exceptions from tool `execute()` handlers (exception messages are not forwarded to the agent); always return structured diagnostic objects.
4. **3D Canvas & HiDPI Rendering:**
   * Manage canvas sizing via a single `ResizeObserver` outside the render/`onpaint` loop using `devicePixelContentBoxSize` (falling back to `Math.round(entry.contentRect.width * window.devicePixelRatio)`) to prevent blurriness and memory leaks.
5. **Precision Hardware & CAD Studio Design System & Color Palette (Mandatory Anti-Vibecode UI Rules):**
   * Every UI change in `@rack-mcp/web-viewer` MUST strictly follow [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) and [`packages/web-viewer/src/styles/studio.css`](packages/web-viewer/src/styles/studio.css) (inspired by Linear, Ubiquiti UniFi Design Center, and Shapr3D):
     * **Neutral Carbon/Zinc Surfaces Only:** Use `--bg-canvas: #09090b`, `--bg-surface: #0e0e11`, `--bg-panel: #121216`, `--bg-elevated: #18181d`, `--bg-glass: rgba(18, 18, 22, 0.86)` (`backdrop-filter: blur(14px)`), and `1px` translucent hairline borders (`--border-hairline: rgba(255, 255, 255, 0.07)`). **NEVER** reintroduce blue-slate navy backgrounds (`#090D16`, `#0F172A`, `#1E293B`).
     * **Typography & `tabular-nums`:** Use `--text-primary: #F4F4F5`, `--text-secondary: #A1A1AA`, `--text-muted: #71717A`, and enforce `font-variant-numeric: tabular-nums` (`.mono`) on all physical dimensions (`mm`, `U`, `W`, `dBA`).
     * **Restricted Semantic Accents (No Neon Box Borders):** Never wrap entire cards or sidebars in neon borders (`#38BDF8`, `#A855F7`, `#EF4444`). Use `1px solid rgba(255, 255, 255, 0.07)` for card outlines and indicate status/severity exclusively via `6px` status dots, `2.5px solid` left accent bars (`borderLeft`), or subtle `10%–12%` opacity pill badges (`#10B981` OK, `#F59E0B` Warning, `#EF4444` Error, `#3B82F6` Selection, `#A855F7` Agent).
     * **Spatial Layout & Iconography Invariants:** Keep `TopNavBar` strictly single-line (`52px`, `whiteSpace: 'nowrap'`), keep `FloatingHudToolbar` anchored as a bottom-center CAD dock (`bottom: 18px`), keep `InspectorSidebar` as a single vertical scroll container with the sticky `All | Element | Checks | MCP` filter bar (never add nested `maxHeight` scroll traps), and always use `1.5px`-stroke vector SVG icons from `packages/web-viewer/src/components/ui/Icons.tsx` instead of emojis.

---

## 9. Automatic Semantic Versioning & Release Protocol (Mandatory)

Whenever publishing a release or pushing a completed feature/fix batch, **automatically determine and bump the version number based on the scope of the release** without waiting for the user to remind you:

1. **Version Increment Rules (`MAJOR.MINOR.PATCH`):**
   * **`PATCH` (`0.x.Y` -> `0.x.(Y+1)`):** Bugfixes, security/Dependabot/CodeQL patches, STL/SVG/exporter refinements, documentation/skill updates, or adding new hardware blueprints to `@rack-mcp/hardware-catalog`.
   * **`MINOR` (`0.X.y` -> `0.(X+1).0`):** New MCP tools, new exporter formats, new validation stages/diagnostic codes, major 3D/2D Web-Viewer features, or new schema capabilities.
   * **`MAJOR` (`X.y.z` -> `(X+1).0.0`):** Breaking changes to `rack.yaml` schema, MCP tool contracts, or a major milestone release.
2. **Mandatory Synchronized Files on Every Version Bump:**
   Every release MUST update all of the following files in lockstep before creating and pushing the git tag `vX.Y.Z`:
   * Root `package.json` and all 6 workspace `packages/*/package.json` files (`core-domain`, `hardware-catalog`, `exporters`, `mcp-server`, `web-viewer`, `cli`).
   * `packages/mcp-server/src/mcp/server.ts` (`version: 'X.Y.Z'`).
   * `packages/web-viewer/src/index.ts` (`export const WEB_VIEWER_VERSION = 'X.Y.Z';`).
   * `CHANGELOG.md` (new `## [X.Y.Z] - YYYY-MM-DD` entry).
   * `docs/RELEASE_NOTES.md` (update header `# 🏗️ RackArchitect MCP vX.Y.Z`, intro line, and the `> ✨ Neu in Version vX.Y.Z:` box so the GitHub Release page always matches the tag).
   * Whenever hardware blueprints are added or modified in `packages/hardware-catalog/catalog/`, regenerate `packages/hardware-catalog/src/embedded-catalog.ts`, run `pnpm validate:catalog`, and update blueprint counts/tables in `README.md`, `packages/hardware-catalog/README.md`, `docs/COMPLETE_SYSTEM_HANDBOOK.md`, `skills/rack-architect/SKILL.md`, and `.agents/skills/rack-architect/SKILL.md`.
