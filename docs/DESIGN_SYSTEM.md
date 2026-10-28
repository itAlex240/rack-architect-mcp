# Precision Hardware & CAD Studio — Design System & Color Palette (`@rack-mcp/web-viewer`)

> **Design North Star:** `@rack-mcp/web-viewer` is an industrial-grade 3D/2D hardware engineering and MCP inspection studio inspired by **Linear**, **Ubiquiti UniFi Design Center**, and **Shapr3D**. Every UI change MUST preserve this calm, neutral, human-engineered aesthetic and strictly avoid generic "AI / Vibecoding" styling.

---

## 1. Canonical Color Palette (Carbon / Zinc Studio Tokens)

All UI surfaces use a **neutral Carbon/Zinc dark palette** (defined in [`packages/web-viewer/src/styles/studio.css`](../packages/web-viewer/src/styles/studio.css)) so that 3D hardware models, port indicators, and color-coded cables remain the visual focus.

### 1.1 Surface Hierarchy & Borders

| Token (`studio.css`) | Hex / RGBA | Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#09090b` | 3D viewport background, root app canvas, SVG viewer canvas |
| `--bg-surface` | `#0e0e11` | Top studio bar (`TopNavBar`), sticky filter bars, section subheaders |
| `--bg-panel` | `#121216` | Sidebars (`InspectorSidebar`, `CatalogBuilderDrawer`), BOM section cards |
| `--bg-elevated` | `#18181d` | Interactive cards, segmented control pill tracks, form inputs, secondary buttons |
| `--bg-glass` | `rgba(18, 18, 22, 0.86)` | Floating HUD dock (`FloatingHudToolbar`) with `backdrop-filter: blur(14px)` |
| `--border-hairline` | `rgba(255, 255, 255, 0.07)` | Standard `1px` structural divider and card border |
| `--border-strong` | `rgba(255, 255, 255, 0.14)` | Hover states, active segmented buttons, focused controls |

### 1.2 Typography & Text Hierarchy

| Token (`studio.css`) | Hex | Usage |
| :--- | :--- | :--- |
| `--text-primary` | `#F4F4F5` | Primary titles, active tab labels, metric values, device hostnames |
| `--text-secondary` | `#A1A1AA` | Secondary descriptions, inactive tabs, table headers, form labels |
| `--text-muted` | `#71717A` | Muted metadata, units (`mm`, `W`, `dBA`), timestamps, secondary IDs |

### 1.3 Semantic Accent & Telemetry Palette (Restricted Usage)

> **Rule:** Never wrap entire cards or sidebars in bright colored borders. Semantic accents are reserved **exclusively** for `6px` status dots, `2.5px` left severity indicator bars (`borderLeft`), and subtle badge pills (`10%–12%` background opacity).

| Role | Token | Primary Hex | Subtle Fill / Badge Background | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Interactive / Selection** | `--accent-primary` | `#3B82F6` (Text: `#93C5FD`) | `rgba(59, 130, 246, 0.12)` | Selected 3D device/cable, active camera preset, primary CAD action |
| **Valid / Online / Power OK** | `--status-ok` | `#10B981` (Text: `#6EE7B7`) | `rgba(16, 185, 129, 0.12)` | `0 ERR` dot, Live WS indicator, valid MCP tool badge, 3D power LED |
| **Warning / Thermal / Clearance** | `--status-warn` | `#F59E0B` (Text: `#FCD34D`) | `rgba(245, 158, 11, 0.12)` | Diagnostic `WARNING` left accent bar, thermal/airflow/CoG warnings |
| **Error / Collision** | `--status-err` | `#EF4444` (Text: `#FCA5A5`) | `rgba(239, 68, 68, 0.12)` | Diagnostic `ERROR` left accent bar, 3D AABB collision wireframe |
| **MCP Agent Activity** | `--accent-agent` | `#A855F7` (Text: `#D8B4FE`) | `rgba(168, 85, 247, 0.12)` | `Simulate Collision` button & MCP Agent Feed header badge |

### 1.4 3D Viewport & Hardware Material Palette

| 3D Element | Component File | Color / Material Spec |
| :--- | :--- | :--- |
| **Rack Outer Frame Posts** | [`RackFrame3D.tsx`](../packages/web-viewer/src/components/canvas/RackFrame3D.tsx) | `#3F3F46` (`metalness: 0.65`, `roughness: 0.35` — anodized gunmetal) |
| **EIA-310 Vertical Mounting Rails** | [`RackFrame3D.tsx`](../packages/web-viewer/src/components/canvas/RackFrame3D.tsx) | `#71717A` (`metalness: 0.78`, `roughness: 0.25` — brushed steel contrast) |
| **Floor Reference Grid** | [`RackFrame3D.tsx`](../packages/web-viewer/src/components/canvas/RackFrame3D.tsx) | `#27272A` / `#18181B` |
| **Device Front Faceplate Inset** | [`MountedDevice3D.tsx`](../packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) | `#090D16` (`metalness: 0.3`, `roughness: 0.6`) |
| **Device Power Status LED** | [`MountedDevice3D.tsx`](../packages/web-viewer/src/components/canvas/MountedDevice3D.tsx) | `#10B981` (`emissive: #10B981`, `emissiveIntensity: 0.9`) |

---

## 2. Typography & Numeric Discipline

1. **Font Stack:**
   - **UI Sans (`--font-sans`):** `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
   - **Engineering Mono (`--font-mono` / `.mono`):** `'JetBrains Mono', 'Fira Code', ui-monospace, SFMono-Regular, monospace`
2. **Mandatory `tabular-nums`:**
   - Every element with `.mono` or displaying coordinates (`mm`), rack units (`U1`–`U42`), power (`W` / `VA`), temperatures, or acoustic levels (`dB(A)`) MUST use `font-variant-numeric: tabular-nums` so columns and live sliders never jitter horizontally.
3. **Strict Type Scale (Max 4 Sizes per Panel):**
   - **Section Overline:** `10.5px`, `font-weight: 600`, `letter-spacing: 0.05em`, `text-transform: uppercase`, color `#A1A1AA`.
   - **Body / Control Label:** `12px`, `font-weight: 500`–`600`, color `#F4F4F5`.
   - **Secondary / Description Text:** `11.5px`, `line-height: 1.45`, color `#A1A1AA` (`#D4D4D8` for diagnostic messages).
   - **Monospace Telemetry / Badges:** `10.5px`–`11px`, `font-family: var(--font-mono)`.

---

## 3. Spatial Architecture & Component Invariants

1. **Single-Line Top Studio Bar ([`TopNavBar.tsx`](../packages/web-viewer/src/components/ui/TopNavBar.tsx)):**
   - Fixed height `52px`, divided into Left (Brand + Project Meta + `+ Catalog`), Center (Segmented 4-View Switcher with SVG icons), and Right (Status Indicator Pill + Agent Replay + Icon Action Buttons).
   - **Zero Text Wrapping:** Every button and badge in `TopNavBar` MUST enforce `whiteSpace: 'nowrap'` and `flexShrink: 0`. Multi-line wrapped header buttons or clipped status pills are strictly forbidden.
2. **Floating Bottom-Center 3D CAD Dock ([`FloatingHudToolbar.tsx`](../packages/web-viewer/src/components/ui/FloatingHudToolbar.tsx)):**
   - Positioned at `bottom: 18px`, `left: 50%`, `transform: translateX(-50%)` using `--bg-glass` (`backdrop-filter: blur(14px)`).
   - Never place floating toolbars at the top of the 3D canvas where they collide with the upper rack frame (`U8`/`U12`).
3. **Single-Scroll Inspector Sidebar with Sticky Section Filter ([`InspectorSidebar.tsx`](../packages/web-viewer/src/components/ui/InspectorSidebar.tsx)):**
   - Fixed width `360px` (`background: #121216`) with a sticky 4-tab filter bar at the top (`All` | `Element` | `Checks` | `MCP`).
   - **No Nested Scroll Traps:** Never put `maxHeight: 165px` + `overflowY: auto` inside sidebar cards. The sidebar itself is the single vertical scroll container so diagnostic cards, remediation suggestions, and MCP tool-call logs are always readable in full.
4. **Vector SVG Iconography ([`Icons.tsx`](../packages/web-viewer/src/components/ui/Icons.tsx)):**
   - Always use crisp `1.5px`-stroke inline SVG icons from `packages/web-viewer/src/components/ui/Icons.tsx`. Never use random OS emojis (`🧊`, `📐`, `🔌`, `📦`, `⚡`) as primary UI button icons.

---

## 4. Forbidden "AI / Vibecoding" Anti-Patterns (Checklist)

Before committing any change to `@rack-mcp/web-viewer`, verify that **none** of the following anti-patterns are introduced:

- ❌ **No Blue-Slate Navy Backgrounds:** Do not use `#090D16`, `#0F172A`, or `#1E293B` for UI panels or borders. Always use the neutral Carbon/Zinc tokens (`#09090b`, `#0e0e11`, `#121216`, `#18181d`, `rgba(255,255,255,0.07)`).
- ❌ **No Neon Box Borders:** Do not wrap cards or panels in `1px solid #38BDF8`, `#A855F7`, or `#EF4444`. Use `1px solid rgba(255,255,255,0.07)` on the card and a `2.5px solid` left accent bar (`borderLeft`) for severity.
- ❌ **No Emoji Icons in Navigation or Toolbars:** Use geometric SVG components from `Icons.tsx`.
- ❌ **No `ALL-CAPS` Colored Paragraphs:** Keep section headers subtle (`10.5px` uppercase in `#A1A1AA`), and write all card titles and descriptions in natural sentence/title case.
- ❌ **No Nested Scrollbars (`maxHeight` traps):** Never clip diagnostic explanations or `remediation_suggestions` inside tiny inner scroll containers.
