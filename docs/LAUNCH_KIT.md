# 🚀 RackArchitect MCP — Community Launch Kit (`v0.9.0`)

Ready-to-post, technical, zero-fluff templates for sharing **RackArchitect MCP** with hardware tinkerers, 3D-printing homelabbers, AI tool builders, and MCP directories. All deep links below open directly on **[https://mcp.rackarchitect.dev/](https://mcp.rackarchitect.dev/)** with zero sign-up required.

---

## 1. Reddit — `r/minilab` (10-Inch Mini-Rack & 3D-Printed Brackets)

**Title:** `I built a free browser CAD planner & parametric 3D-printable bracket generator for 10" mini-racks (zero install + watertight .STL)`

**Post Body:**
> Every time I planned a new 10" DeskPi RackMate / Digitus mini-rack build, I hit the same annoyance: eyeballing whether rear AC plugs clear the front switch chassis, measuring calipers twice for a custom Lenovo Tiny / NUC / Cloud Gateway bracket, and guessing PoE/UPS power budgets.
>
> So I built **RackArchitect MCP** — an open-source, deterministic **Rack-as-Code** studio that runs directly in the browser:
>
> - **Interactive 3D Digital Twin (10" / 6" / 19" presets):** https://mcp.rackarchitect.dev/?preset=10inch-homelab
> - **Parametric Custom Device Bracket Generator (`.STL` & `.SCAD`):** https://mcp.rackarchitect.dev/?tab=bom#custom-bracket — type in *any* non-rackmount box (`W × H × D` mm), add keystone cutouts + engraved label, preview the STL in 3D, and export a verified watertight 2-manifold `.STL` ready for Bambu Studio / OrcaSlicer / PrusaSlicer (prints face-down, zero supports).
> - **Built-in 5-Stage Physics Checks:** Catches chassis + rear plug-clearance depth collisions (`mm`), PoE+ wattage overflows, Center-of-Gravity tip-over ratios, and missing open-U pass-through portals automatically.
> - **16:9 Share Card Export + Brother/DYMO Cable Labels:** Export a clean 1200×675 build summary PNG (`Card` button in the top bar) to share your layout, plus printable `12mm`/`18mm`/`24mm` cable label SVGs & CSVs.
>
> Zero login, zero paywall, MIT-licensed: https://github.com/itAlex240/rack-architect-mcp  
> *(And if you have custom mini-PC or switch dimensions missing from the 101-part catalog, you can design one in the `Custom Blueprint` drawer and open a pre-filled GitHub Catalog Issue in one click!)*

---

## 2. Reddit — `r/homelab` (19" Split Print Brackets, NetBox/UniFi/Proxmox Import & Hosted MCP)

**Title:** `Open-source Rack-as-Code 3D planner: NetBox/UniFi/Proxmox drag-and-drop import, 5-stage depth/PoE checks & 2-part <= 245mm 19" 3D-printable brackets`

**Post Body:**
> Most 19-inch rackmount 3D-print brackets are `482.6 mm` wide — which is great until you realize your Bambu X1C/P1S/A1 or Prusa MK4 print bed tops out at `250–256 mm`.
>
> In **RackArchitect MCP `v0.9.0`**, I added **2-Part 19" Print-Bed Splitting** alongside direct inventory imports:
>
> - **19" Enterprise Demo + 2-Part Split Configurator (`241.3 mm` per half + M3 rear joiner lug):** https://mcp.rackarchitect.dev/?preset=19inch-enterprise&tab=bom#custom-bracket
> - **Drag-and-Drop Existing Racks:** Drop a `rack.yaml`, `rack.json`, **NetBox** JSON, **Ubiquiti UniFi** API export, or **Proxmox VE `/nodes`** JSON straight onto the browser canvas (`or npx rack-mcp import <file>`).
> - **Deterministic Physical & Electrical Validation:** Checks front/rear rail collisions including power plug bend radii, UPS typical/peak battery runtime + `€/kWh` annual energy cost, BTU/h heat output, and shortest collision-free 3D cable routing (`elevation.svg`, `wiring-schematic.svg`, `BOM.md`, `.glb`).
> - **Native Remote MCP Server for AI Agents:** Connect Claude, Cursor, Claude Code, VS Code, or Antigravity via Streamable HTTP at `https://mcp.rackarchitect.dev/mcp` (isolated in-memory sessions + live 3D viewer URL `/?session=<uuid>`).
>
> Repo & Docs (MIT): https://github.com/itAlex240/rack-architect-mcp  
> Happy to hear feedback on missing hardware blueprints or real-world edge cases!

---

## 3. Printables.com / MakerWorld — Model Description (`Parametric EIA-310 Custom Rack Brackets — 6" / 10" / 19" 2-Part Split`)

**Summary:**
Parametric, 100% watertight 2-manifold `.STL` and `.SCAD` EIA-310 rackmount brackets generated on demand for **any mini-PC, firewall, NVR, or switch** — across **6-inch**, **10-inch DeskPi/Digitus**, and **2-part split 19-inch (`<= 241.3 mm` per half with rear M3 joiner lug)**.

**Generate Your Exact Dimensions Live in Browser (No CAD Software Required):**
👉 **[Open the Custom Bracket Generator](https://mcp.rackarchitect.dev/?tab=bom#custom-bracket)**

**Why Generate Instead of Remixing Static STLs?**
1. Dial in your exact device `Width × Height × Depth` (`mm`), tolerance (`0.4 mm` default), `1U`–`3U` height, up to 4 keystone jacks, rear retention stopper lip, and mirrored engraved front label.
2. **Fits Standard 250 mm Print Beds for 19" Racks:** Switch `Split Mode` to **Left Half** & **Right Half** (`241.3 mm` width each) with an integrated rear **M3 bolt joiner lug (`3.4 mm` hole)** so both halves bolt solidly together before mounting.
3. Inspect the interactive **3D STL mesh** directly in your browser, then download watertight `.STL` + parametric `.SCAD`.

**Recommended Print Settings:**
- **Material:** PETG or ASA *(PLA can creep under warm switch/mini-PC loads)*
- **Orientation:** Face-down on the front plate (**0 supports needed**)
- **Perimeters / Infill:** 4 perimeters, 25% Gyroid infill, `0.20 mm` layer height
- **Hardware (for 19" 2-Part Split):** 1× M3×10mm socket head screw + M3 nut/heat-set insert for the rear joiner lug.

---

## 4. Hacker News — `Show HN`

**Title:** `Show HN: RackArchitect MCP – Deterministic Rack-as-Code 3D/2D planner & STL generator (no LLM geometry guessing)`

**Text:**
> Hi HN! LLMs are surprisingly bad at 3D spatial geometry — if you ask an AI assistant to plan a compact server rack, it will confidently place a 180mm switch on U4 behind a 90mm shelf or exceed your PoE budget by 40W.
>
> **RackArchitect MCP** follows one strict rule: **LLMs never guess geometry.** Every millimeter coordinate, AABB + plug-clearance check, PoE/UPS power DAG, Catmull-Rom 3D cable spline, SVG elevation, and watertight manifold `.STL` mesh is computed deterministically in pure TypeScript (`@rack-mcp/core-domain` + `@rack-mcp/exporters`).
>
> You can try the live Web Viewer right away (zero backend login needed) or connect an MCP client directly:
> - Live 3D Studio & Custom Bracket `.STL` Generator: https://mcp.rackarchitect.dev/
> - 19" Split Bracket + Enterprise Preset: https://mcp.rackarchitect.dev/?preset=19inch-enterprise&tab=bom#custom-bracket
> - Zero-Install Remote MCP Endpoint (`Streamable HTTP` & `SSE`): `https://mcp.rackarchitect.dev/mcp`
> - GitHub (MIT): https://github.com/itAlex240/rack-architect-mcp
>
> Each MCP session gets an isolated in-memory workspace running inside a read-only zero-egress container (`cap_drop: ALL`, `0` runtime outbound network access), emitting a live `wss://` 3D viewer URL (`/?session=<uuid>`) whenever the agent mounts equipment or resolves collisions autonomously.

---

## 5. `awesome-mcp-servers` / MCP Directory Entry

```markdown
- [RackArchitect MCP](https://github.com/itAlex240/rack-architect-mcp) 📇 ☁️ 🏠 - Deterministic Rack-as-Code planner, 5-stage physical/PoE/thermal validator, CAD SVG/BOM/glTF exporter, and 2-manifold `.STL` 3D-print generator for 19", 10", and 6" racks (Live Remote MCP at `https://mcp.rackarchitect.dev/mcp`).
```

Or one-line CLI install test for reviewers:
```bash
claude mcp add --transport http rack_architect_mcp https://mcp.rackarchitect.dev/mcp
```
