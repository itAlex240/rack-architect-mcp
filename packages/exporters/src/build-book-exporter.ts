import {
  deserializeRackScene,
  ensureHighContrastCableHex,
  resolveCableEndpointPortGeometry,
  resolveEffectivePortZone,
  roundTenths,
  type ComputedCableRoute,
  type ComputedDeviceGeometry,
  type ComputedRackScene,
  type RackFace,
  type RackStandard,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import { generateElevationSvg } from './elevation-svg.js';
import {
  formatCableTypeBadge,
  generateWiringSchematicSvg,
} from './wiring-svg.js';

export interface BuildBookOptions {
  /** Target print page size for `@page` CSS rule (`'A4'` default or `'Letter'`). */
  readonly pageSize?: 'A4' | 'Letter' | undefined;
  /** Electricity price in EUR per kWh used to estimate annual running cost (default: 0.32 EUR/kWh). */
  readonly electricityPricePerKwhEur?: number | undefined;
  /** Whether to include the 3D-Print Carrier & Bracket Queue section (default: true). */
  readonly include3DPrintQueue?: boolean | undefined;
}

interface CommercialBomGroup {
  readonly slug: string;
  readonly manufacturer: string;
  readonly model: string;
  readonly category: string;
  readonly unitMaxWatts: number;
  readonly unitWeightGrams: number;
  readonly unitPriceEur: number | undefined;
  readonly instances: ComputedDeviceGeometry[];
}

interface PrintableQueueGroup {
  readonly slug: string;
  readonly model: string;
  readonly category: string;
  readonly material: string;
  readonly unitFilamentGrams: number;
  readonly heatSetInserts: string;
  readonly fasteners: string;
  readonly instances: ComputedDeviceGeometry[];
}

interface CableBomGroup {
  readonly key: string;
  readonly cableType: string;
  readonly commercialLengthMm: number;
  readonly colorHex: string;
  readonly badge: string;
  readonly cableIds: string[];
  readonly labels: string[];
}

/**
 * Escapes all HTML-significant characters (`&`, `<`, `>`, `"`, `'`) and strips
 * non-printable ASCII control characters so user-controlled strings can never
 * inject markup or script contexts.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]+/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeHexColor(raw: string, fallback = '#3B82F6'): string {
  const trimmed = raw.trim();
  return /^#[0-9A-Fa-f]{6}$/.test(trimmed) ? trimmed.toUpperCase() : fallback;
}

function isComputedRackScene(
  scene: ComputedRackScene | SerializedRackScene,
): scene is ComputedRackScene {
  return scene.geometry.devices_by_id instanceof Map;
}

function normalizeComputedScene(
  scene: ComputedRackScene | SerializedRackScene,
): ComputedRackScene {
  return isComputedRackScene(scene) ? scene : deserializeRackScene(scene);
}

function formatRackStandardLabel(standard: RackStandard): string {
  if (standard === '19inch') return '19" EIA-310 (19inch)';
  if (standard === '6inch') return '6" Micro-Lab (6inch)';
  return '10" Mini-Rack (10inch)';
}

function buildOrientationAdvice(
  category: string,
  rackStandard: RackStandard,
): string {
  const splitNote =
    rackStandard === '19inch'
      ? ' 19" wide spans (482.6 mm) require left/right split STL export for ≤256 mm print beds.'
      : '';
  if (category === 'blank-panel' || category === 'blanking-panel') {
    return `Print face-down on textured PEI sheet (Z=0 front face down) in PETG/ASA (4 perimeters, 25% gyroid infill, zero supports).${splitNote}`;
  }
  return `Print face-down (EIA-310 front faceplate flat on build plate, tray walls extending +Z) in PETG/ASA (4 perimeters, 25% gyroid infill, 0.20 mm layer height) for enclosed-rack heat resistance.${splitNote}`;
}

function buildStylesheet(pageSize: 'A4' | 'Letter'): string {
  const pageDimsLabel =
    pageSize === 'Letter' ? 'US Letter (8.5 × 11 in)' : 'A4 (210 × 297 mm)';

  return `<style>
  @page { size: ${pageSize}; margin: 12mm; }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  :root {
    --ink: #18181B;
    --ink-secondary: #52525B;
    --ink-muted: #71717A;
    --paper: #FFFFFF;
    --surface: #F8FAFC;
    --surface-subtle: #F4F4F5;
    --border: #E4E4E7;
    --border-strong: #D4D4D8;
    --cad-bg: #090D16;
    --ok-ink: #065F46;
    --ok-bg: #ECFDF5;
    --ok-border: #10B981;
    --err-ink: #991B1B;
    --err-bg: #FEF2F2;
    --err-border: #EF4444;
    --warn-ink: #92400E;
    --warn-bg: #FFFBEB;
    --warn-border: #F59E0B;
    --accent: #2563EB;
  }

  html, body {
    margin: 0;
    padding: 0;
    background: #EFEFF2;
    color: var(--ink);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-size: 10pt;
    line-height: 1.42;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace;
    font-variant-numeric: tabular-nums;
  }

  .book-shell {
    max-width: ${pageSize === 'Letter' ? '216mm' : '210mm'};
    margin: 16px auto 32px auto;
    background: var(--paper);
    padding: 12mm;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
    border-radius: 4px;
  }

  .no-print.print-banner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 14px;
    margin-bottom: 14px;
    border-radius: 6px;
    background: #18181B;
    color: #F4F4F5;
    border: 1px solid #3F3F46;
    font-size: 9pt;
  }

  .print-banner-title {
    font-weight: 700;
    font-size: 9.5pt;
    color: #FFFFFF;
  }

  .print-banner-hint {
    color: #D4D4D8;
    font-size: 8.5pt;
  }

  .kbd-pill {
    display: inline-block;
    padding: 1px 6px;
    border-radius: 4px;
    background: #27272A;
    border: 1px solid #52525B;
    color: #FAFAFA;
    font-size: 8pt;
    font-weight: 600;
  }

  .page-section {
    margin-bottom: 14px;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
  }

  .cover-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 14px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--ink);
    margin-bottom: 14px;
  }

  .eyebrow {
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 4px;
  }

  h1.project-title {
    margin: 0 0 6px 0;
    font-size: 19pt;
    line-height: 1.15;
    font-weight: 800;
    color: var(--ink);
    word-break: break-word;
  }

  .project-subtitle {
    font-size: 9pt;
    color: var(--ink-secondary);
  }

  .status-pill {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 8.5pt;
    font-weight: 700;
    border: 1px solid transparent;
  }

  .status-pill.valid {
    color: var(--ok-ink);
    background: var(--ok-bg);
    border-color: var(--ok-border);
  }

  .status-pill.invalid {
    color: var(--err-ink);
    background: var(--err-bg);
    border-color: var(--err-border);
  }

  .status-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    display: inline-block;
  }

  .status-dot.valid { background: var(--ok-border); }
  .status-dot.invalid { background: var(--err-border); }

  h2.section-title {
    margin: 0 0 4px 0;
    font-size: 12.5pt;
    font-weight: 700;
    color: var(--ink);
    padding-bottom: 5px;
    border-bottom: 1.5px solid var(--border-strong);
  }

  h3.subsection-title {
    margin: 12px 0 6px 0;
    font-size: 10pt;
    font-weight: 700;
    color: var(--ink);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .section-lead {
    margin: 0 0 10px 0;
    font-size: 8.5pt;
    color: var(--ink-secondary);
  }

  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 9px;
    margin-bottom: 12px;
  }

  .kpi-card {
    padding: 9px 11px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--surface);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .kpi-label {
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ink-muted);
    margin-bottom: 4px;
  }

  .kpi-value {
    font-size: 11.5pt;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 3px;
  }

  .kpi-detail {
    font-size: 8pt;
    color: var(--ink-secondary);
    line-height: 1.35;
  }

  .diag-box {
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 9px 11px;
    background: var(--surface);
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .diag-ok {
    border-left: 3px solid var(--ok-border);
    background: var(--ok-bg);
    color: var(--ok-ink);
    font-size: 8.5pt;
    font-weight: 600;
  }

  .diag-issue {
    padding: 6px 9px;
    border: 1px solid var(--border);
    border-left-width: 3px;
    border-radius: 4px;
    background: var(--paper);
    margin-top: 6px;
    break-inside: avoid;
    page-break-inside: avoid;
    font-size: 8.3pt;
  }

  .diag-issue.sev-error { border-left-color: var(--err-border); }
  .diag-issue.sev-warning { border-left-color: var(--warn-border); }
  .diag-issue.sev-info { border-left-color: var(--accent); }

  .cad-frame {
    background: var(--cad-bg);
    border: 1px solid #27272A;
    border-radius: 6px;
    padding: 6px;
    overflow: hidden;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .cad-frame svg {
    display: block;
    width: 100%;
    height: auto;
    max-width: 100%;
    max-height: 215mm;
  }

  .cad-caption {
    margin-top: 6px;
    font-size: 8pt;
    color: var(--ink-secondary);
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 8.2pt;
    margin-top: 6px;
    margin-bottom: 10px;
  }

  thead {
    display: table-header-group;
  }

  tr {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid var(--border);
    padding: 5px 6px;
    text-align: left;
    vertical-align: top;
    word-break: break-word;
  }

  th {
    background: var(--surface-subtle);
    color: var(--ink);
    font-weight: 700;
    font-size: 7.7pt;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  tbody tr:nth-child(even) td {
    background: #FCFCFD;
  }

  tfoot td {
    background: var(--surface-subtle);
    font-weight: 700;
  }

  .badge {
    display: inline-block;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 7.4pt;
    font-weight: 600;
    border: 1px solid var(--border-strong);
    background: var(--surface-subtle);
    color: var(--ink);
  }

  .badge-portal {
    background: #EFF6FF;
    border-color: #93C5FD;
    color: #1E40AF;
  }

  .badge-vlan {
    background: #EEF2FF;
    border-color: #A5B4FC;
    color: #3730A3;
  }

  .badge-cidr {
    background: #ECFDF5;
    border-color: #6EE7B7;
    color: #065F46;
  }

  .swatch {
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0.28);
    vertical-align: middle;
    margin-right: 4px;
  }

  .check-box {
    display: inline-block;
    width: 11px;
    height: 11px;
    border: 1.4px solid var(--ink-secondary);
    border-radius: 2px;
    background: var(--paper);
    vertical-align: middle;
  }

  .muted {
    color: var(--ink-muted);
  }

  .doc-footer {
    margin-top: 14px;
    padding-top: 8px;
    border-top: 1px solid var(--border);
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: var(--ink-muted);
  }

  @media print {
    html, body {
      background: #FFFFFF;
      font-size: 9.2pt;
    }

    .book-shell {
      max-width: none;
      margin: 0;
      padding: 0;
      box-shadow: none;
      border-radius: 0;
    }

    .no-print {
      display: none !important;
    }
  }
</style><!-- Target page format: ${pageDimsLabel} -->`;
}

function buildCoverAndKpisSection(
  scene: ComputedRackScene,
  electricityRateEur: number,
): string {
  const { project, geometry, validation } = scene;
  const pwr = validation.power_summary;
  const mech = validation.mechanical_summary;

  const annualKwh = pwr.annual_energy_kwh_typical ?? 0;
  const annualCostEur = roundTenths(annualKwh * electricityRateEur);
  const hardwareBudgetEur = pwr.estimated_hardware_budget_eur ?? 0;
  const totalPoeBudgetW = pwr.pse_budgets.reduce(
    (sum, b) => sum + b.poe_budget_watts,
    0,
  );
  const upsSources = pwr.power_sources.filter((s) => s.role === 'ups');
  const totalUpsWh = upsSources.reduce((sum, u) => sum + (u.battery_wh ?? 0), 0);
  const typicalUpsMin =
    pwr.estimated_ups_runtime_minutes ??
    upsSources[0]?.estimated_runtime_minutes_typical ??
    null;
  const peakUpsCandidates = upsSources
    .map((u) => u.estimated_runtime_minutes_peak)
    .filter((v): v is number => v !== undefined);
  const peakUpsMin =
    peakUpsCandidates.length > 0 ? Math.min(...peakUpsCandidates) : null;

  const isValid = validation.is_valid && validation.status === 'VALID';
  const statusClass = isValid ? 'valid' : 'invalid';
  const statusText = isValid
    ? `VALID · 0 Errors · ${validation.warning_count} Warn`
    : `INVALID · ${validation.error_count} Errors · ${validation.warning_count} Warn`;

  const subModuleCount = Math.max(
    0,
    geometry.devices.length - project.mounted_devices.length,
  );
  const portalUsText =
    mech.available_portal_u_positions.length > 0
      ? mech.available_portal_u_positions.map((u) => `U${u}`).join(', ')
      : 'None';

  const upsMainValue =
    upsSources.length > 0 && typicalUpsMin !== null
      ? `~${roundTenths(typicalUpsMin)} min typical`
      : 'No UPS Mounted';
  const upsDetailText =
    upsSources.length > 0
      ? `${roundTenths(totalUpsWh)} Wh total · ~${roundTenths(peakUpsMin ?? 0)} min @ peak · ${upsSources
          .map((u) => escapeHtml(u.source_instance_id))
          .join(', ')}`
      : 'Add a UPS unit to compute outage autonomy';

  const cogPct = roundTenths(mech.normalized_cog_y * 100);
  const totalMassKg = roundTenths(mech.total_weight_grams / 1000);

  const powerSourcesHtml =
    pwr.power_sources.length > 0 || pwr.pse_budgets.length > 0
      ? `<h3 class="subsection-title">Power Distribution &amp; PoE Budget Summary</h3>
<table>
  <thead>
    <tr>
      <th>Source / PSE Device</th>
      <th>Role</th>
      <th>Load / Consumed</th>
      <th>Rated Capacity</th>
      <th>Utilization</th>
      <th>Details</th>
    </tr>
  </thead>
  <tbody>
    ${pwr.power_sources
      .map(
        (ps) => `<tr>
      <td class="mono"><strong>${escapeHtml(ps.source_instance_id)}</strong></td>
      <td class="mono">${escapeHtml(ps.role.toUpperCase())}</td>
      <td class="mono">${roundTenths(ps.total_load_watts)} W</td>
      <td class="mono">${roundTenths(ps.capacity_watts)} W</td>
      <td class="mono">${roundTenths(ps.utilization_percent)}%</td>
      <td class="mono">${
        ps.role === 'ups' && ps.battery_wh !== undefined
          ? `${ps.battery_wh} Wh (~${roundTenths(ps.estimated_runtime_minutes_typical ?? 0)} min typ / ~${roundTenths(ps.estimated_runtime_minutes_peak ?? 0)} min peak)`
          : 'Mains / Rail Distribution'
      }</td>
    </tr>`,
      )
      .join('\n    ')}
    ${pwr.pse_budgets
      .map((pb) => {
        const utilPct =
          pb.poe_budget_watts > 0
            ? roundTenths((pb.consumed_poe_watts / pb.poe_budget_watts) * 100)
            : 0;
        const downstreamText =
          pb.downstream_devices.length > 0
            ? pb.downstream_devices.map((d) => escapeHtml(d)).join(', ')
            : 'No downstream PoE PDs';
        return `<tr>
      <td class="mono"><strong>${escapeHtml(pb.pse_instance_id)}</strong></td>
      <td class="mono">PoE PSE</td>
      <td class="mono">${roundTenths(pb.consumed_poe_watts)} W</td>
      <td class="mono">${roundTenths(pb.poe_budget_watts)} W</td>
      <td class="mono">${utilPct}%</td>
      <td class="mono">${roundTenths(pb.remaining_poe_watts)} W rem · ${downstreamText}</td>
    </tr>`;
      })
      .join('\n    ')}
  </tbody>
</table>`
      : '';

  const diagnosticsHtml =
    validation.issues.length === 0
      ? `<div class="diag-box diag-ok">All 5 deterministic engineering validation stages passed (Spatial 3D AABB, Port/Media Compatibility, Power &amp; PoE DAG, Mechanical CoG/Portals, Thermal/Acoustic).</div>`
      : `<div class="diag-box">
  <div class="kpi-label">Active Validation Diagnostics (${validation.issues.length})</div>
  ${validation.issues
    .map((issue) => {
      const sevClass =
        issue.severity === 'ERROR'
          ? 'sev-error'
          : issue.severity === 'WARNING'
            ? 'sev-warning'
            : 'sev-info';
      const uRangeText = issue.u_range
        ? ` · U${issue.u_range[0]}${issue.u_range[1] !== issue.u_range[0] ? `–U${issue.u_range[1]}` : ''}`
        : '';
      const affectedText =
        issue.affected_instances.length > 0
          ? ` · Affected: ${issue.affected_instances.join(', ')}`
          : '';
      const suggestions = issue.remediation_suggestions
        .map((s) => `<li>${escapeHtml(s)}</li>`)
        .join('');
      return `<div class="diag-issue ${sevClass}">
    <div><strong class="mono">[${escapeHtml(issue.severity)}] ${escapeHtml(issue.code)}</strong><span class="mono muted">${escapeHtml(uRangeText)}${escapeHtml(affectedText)}</span></div>
    <div>${escapeHtml(issue.message)}</div>
    ${suggestions ? `<ul style="margin:4px 0 0 16px;padding:0;">${suggestions}</ul>` : ''}
  </div>`;
    })
    .join('\n  ')}
</div>`;

  return `<section class="page-section page-break" data-section="cover-kpis">
  <header class="cover-header">
    <div>
      <div class="eyebrow">RackArchitect MCP · Printable Engineering Build Book (Schema v${escapeHtml(project.schema_version)})</div>
      <h1 class="project-title">${escapeHtml(project.project_name)}</h1>
      <div class="project-subtitle mono">
        ${escapeHtml(formatRackStandardLabel(project.rack.standard))} · ${project.rack.u_height}U (${roundTenths(geometry.total_height_mm)} mm) · Rail Depth ${roundTenths(project.rack.rail_depth_mm)} mm · ${escapeHtml(project.rack.enclosure_type)} (Front ${roundTenths(project.rack.front_door_clearance_mm)} mm / Rear ${roundTenths(project.rack.rear_clearance_mm)} mm)
      </div>
    </div>
    <div class="status-pill ${statusClass}" data-testid="buildbook-validation-status">
      <span class="status-dot ${statusClass}"></span>
      <span class="mono">${escapeHtml(statusText)}</span>
    </div>
  </header>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">Rack Geometry &amp; Inventory</div>
      <div class="kpi-value mono">${project.rack.u_height}U · ${escapeHtml(project.rack.standard)}</div>
      <div class="kpi-detail mono">
        Width ${roundTenths(geometry.panel_width_mm)} mm (Aperture ${roundTenths(geometry.aperture_width_mm)} mm)<br/>
        ${geometry.devices.length} Devices (${project.mounted_devices.length} rackmount, ${subModuleCount} sub-modules)<br/>
        ${project.cables.length} Cables · ${project.external_endpoints.length} External Drops · Portals: ${escapeHtml(portalUsText)}
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Electrical Draw &amp; PoE</div>
      <div class="kpi-value mono">${roundTenths(pwr.total_idle_watts ?? 0)} W idle / ${roundTenths(pwr.total_system_watts)} W peak</div>
      <div class="kpi-detail mono">
        PoE Load: ${roundTenths(pwr.total_poe_watts)} W${totalPoeBudgetW > 0 ? ` / ${roundTenths(totalPoeBudgetW)} W budget` : ''}<br/>
        Unpowered Active: ${pwr.unpowered_active_instances.length}
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">UPS Autonomy &amp; 24/7 Cost</div>
      <div class="kpi-value mono">${escapeHtml(upsMainValue)}</div>
      <div class="kpi-detail mono">
        ${upsDetailText}<br/>
        Energy: ~${roundTenths(annualKwh)} kWh/yr (~€${annualCostEur.toFixed(2)}/yr @ €${electricityRateEur.toFixed(2)}/kWh)
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Thermal &amp; Acoustic</div>
      <div class="kpi-value mono">${roundTenths(mech.total_thermal_btu_hr)} BTU/h · ${roundTenths(mech.combined_noise_db_a)} dBA</div>
      <div class="kpi-detail mono">
        Airflow Regime: ${escapeHtml(mech.airflow_profile)}<br/>
        Peak Heat Output: ${roundTenths(pwr.total_system_watts)} W thermal load
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Mechanical Mass &amp; CoG Y</div>
      <div class="kpi-value mono">${totalMassKg} kg · CoG Y ${roundTenths(mech.center_of_gravity_y_mm)} mm</div>
      <div class="kpi-detail mono">
        Total Mass: ${Math.round(mech.total_weight_grams)} g<br/>
        Normalized CoG Y: ${cogPct}% of rack height (target &le; 50%)
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-label">Estimated Catalog Budget</div>
      <div class="kpi-value mono">${hardwareBudgetEur > 0 ? `~€${hardwareBudgetEur.toFixed(2)}` : '—'}</div>
      <div class="kpi-detail mono">
        ${hardwareBudgetEur > 0 ? 'Sum of catalog street prices (EUR)' : 'No catalog unit prices listed'}<br/>
        Validation Status: ${escapeHtml(validation.status)}
      </div>
    </div>
  </div>

  ${powerSourcesHtml}
  ${diagnosticsHtml}
</section>`;
}

function sanitizeEmbeddedSvg(svgMarkup: string): string {
  const trimmed = svgMarkup.trim();
  if (!trimmed.startsWith('<svg') || !trimmed.endsWith('</svg>')) {
    return '';
  }
  return trimmed;
}

function buildCadSvgSection(
  sectionId: string,
  title: string,
  lead: string,
  svgMarkup: string,
  leftCaption: string,
  rightCaption: string,
): string {
  const safeSvg = sanitizeEmbeddedSvg(svgMarkup);
  return `<section class="page-section page-break" data-section="${escapeHtml(sectionId)}">
  <h2 class="section-title">${escapeHtml(title)}</h2>
  <p class="section-lead">${escapeHtml(lead)}</p>
  <div class="cad-frame">
    ${safeSvg || '<div style="color:#F4F4F5;padding:24px;text-align:center;">CAD SVG unavailable</div>'}
  </div>
  <div class="cad-caption mono">
    <span>${escapeHtml(leftCaption)}</span>
    <span>${escapeHtml(rightCaption)}</span>
  </div>
</section>`;
}

function formatDeviceDisplay(dev: ComputedDeviceGeometry): string {
  if (dev.hostname && dev.hostname.trim().length > 0 && dev.hostname.trim() !== dev.instance_id) {
    return `${dev.hostname.trim()} (${dev.instance_id})`;
  }
  return dev.instance_id;
}

function buildSlotMapAndPatchChecklistSection(scene: ComputedRackScene): string {
  const { project, geometry, validation, cable_routes } = scene;
  const routesById = new Map<string, ComputedCableRoute>(
    cable_routes.map((r) => [r.cable_id, r]),
  );
  const portalUSet = new Set<number>(
    validation.mechanical_summary.available_portal_u_positions,
  );
  const topLevelDevices = geometry.devices.filter(
    (d) => d.mount_target === 'rack-unit',
  );

  // Build Top-Down Rack Elevation Slot Map (U_max down to U1)
  const slotRows: string[] = [];
  for (let u = project.rack.u_height; u >= 1; u--) {
    const frontDevs = topLevelDevices.filter(
      (d) => d.face === 'front' && u >= d.u_range[0] && u <= d.u_range[1],
    );
    const rearDevs = topLevelDevices.filter(
      (d) => d.face === 'rear' && u >= d.u_range[0] && u <= d.u_range[1],
    );

    const formatFaceCell = (devs: readonly ComputedDeviceGeometry[]): string => {
      if (devs.length === 0) {
        if (portalUSet.has(u)) {
          return '<span class="badge badge-portal">Open U · Pass-Through Portal</span>';
        }
        return '<span class="muted">— Empty</span>';
      }

      return devs
        .map((dev) => {
          const isStartU = dev.u_position === u;
          const spanText =
            dev.u_range[1] > dev.u_range[0]
              ? ` [U${dev.u_range[0]}–U${dev.u_range[1]}]`
              : '';
          const portalBadge =
            dev.blueprint.category === 'brush-panel' ||
            dev.blueprint.geometry.has_cable_pass_through === true
              ? ' <span class="badge badge-portal">Cable Portal</span>'
              : '';
          const children = dev.child_instance_ids
            .map((cid) => geometry.devices_by_id.get(cid))
            .filter((c): c is ComputedDeviceGeometry => c !== undefined);
          const childHtml =
            isStartU && children.length > 0
              ? `<div class="muted" style="margin-top:2px;font-size:7.6pt;">Slots: ${children
                  .map(
                    (c) =>
                      `<span class="mono">${escapeHtml(c.slot_id ?? '')}</span>: <strong>${escapeHtml(formatDeviceDisplay(c))}</strong> (${escapeHtml(c.blueprint.model)})`,
                  )
                  .join(' · ')}</div>`
              : '';
          const headerText = isStartU
            ? `<strong class="mono">${escapeHtml(formatDeviceDisplay(dev))}</strong>${escapeHtml(spanText)} — ${escapeHtml(dev.blueprint.manufacturer)} ${escapeHtml(dev.blueprint.model)}${portalBadge}`
            : `<span class="muted mono">↳ ${escapeHtml(dev.instance_id)} (continued from U${dev.u_position})</span>`;
          return `<div>${headerText}${childHtml}</div>`;
        })
        .join('<div style="margin-top:3px;"></div>');
    };

    const allAtU = [...frontDevs, ...rearDevs];
    const maxDepthMm =
      allAtU.length > 0
        ? Math.max(...allAtU.map((d) => roundTenths(d.blueprint.geometry.depth_mm)))
        : 0;
    const depthText =
      maxDepthMm > 0
        ? `${maxDepthMm} mm`
        : portalUSet.has(u)
          ? 'Portal'
          : '—';

    slotRows.push(`<tr>
      <td class="mono"><strong>U${u}</strong></td>
      <td>${formatFaceCell(frontDevs)}</td>
      <td>${formatFaceCell(rearDevs)}</td>
      <td class="mono">${escapeHtml(depthText)}</td>
    </tr>`);
  }

  // Build Step-by-Step Cable Patching Checklist rows
  const cableRows: string[] = [];
  for (const cable of project.cables) {
    const route = routesById.get(cable.cable_id);
    const commMm = route?.recommended_commercial_mm ?? 500;
    const reqMm = route ? Math.round(route.required_length_mm) : commMm;
    const badge = formatCableTypeBadge(cable.cable_type, commMm);
    const safeColor = sanitizeHexColor(
      ensureHighContrastCableHex(cable.color_hex, 'svg-dark'),
    );

    const fromDev = geometry.devices_by_id.get(cable.from.instance_id);
    const toDev = geometry.devices_by_id.get(cable.to.instance_id);
    const fromParent = fromDev?.parent_carrier_id
      ? geometry.devices_by_id.get(fromDev.parent_carrier_id)
      : undefined;
    const toParent = toDev?.parent_carrier_id
      ? geometry.devices_by_id.get(toDev.parent_carrier_id)
      : undefined;

    const port1 = fromDev
      ? resolveCableEndpointPortGeometry(
          fromDev,
          cable.from.port_id,
          cable.from.face,
          fromParent,
        )
      : undefined;
    const port2 = toDev
      ? resolveCableEndpointPortGeometry(
          toDev,
          cable.to.port_id,
          cable.to.face,
          toParent,
        )
      : undefined;

    const fromFace: RackFace =
      fromDev && port1
        ? resolveEffectivePortZone(fromDev, port1, cable.from.face)
        : (cable.from.face ?? port1?.world_face ?? 'front');
    const toFace: RackFace =
      toDev && port2
        ? resolveEffectivePortZone(toDev, port2, cable.to.face)
        : (cable.to.face ?? port2?.world_face ?? 'front');

    const fromU = fromDev ? `U${fromDev.u_position} ` : '';
    const toU = toDev ? `U${toDev.u_position} ` : '';
    const portalNote =
      route?.portal_u !== null && route?.portal_u !== undefined
        ? `<div class="muted mono" style="font-size:7.4pt;">Route via U${route.portal_u} front↔rear portal</div>`
        : '';

    const noteParts: string[] = [];
    if (cable.vlan_id !== undefined) {
      noteParts.push(`<span class="badge badge-vlan mono">VLAN ${cable.vlan_id}</span>`);
    }
    if (cable.ip_cidr !== undefined) {
      noteParts.push(`<span class="badge badge-cidr mono">${escapeHtml(cable.ip_cidr)}</span>`);
    }
    if (cable.label !== undefined && cable.label.trim().length > 0) {
      noteParts.push(`<span>${escapeHtml(cable.label)}</span>`);
    }
    const notesHtml = noteParts.length > 0 ? noteParts.join(' ') : '<span class="muted">—</span>';

    cableRows.push(`<tr data-patch-cable-id="${escapeHtml(cable.cable_id)}">
      <td style="text-align:center;"><span class="check-box" aria-hidden="true"></span></td>
      <td class="mono"><span class="swatch" style="background:${safeColor};"></span><strong>${escapeHtml(cable.cable_id)}</strong></td>
      <td class="mono">${escapeHtml(badge)}<div class="muted" style="font-size:7.3pt;">${escapeHtml(cable.cable_type)}</div></td>
      <td class="mono"><strong>${escapeHtml(cable.from.instance_id)}:${escapeHtml(cable.from.port_id)}</strong> <span class="muted">(${escapeHtml(fromU)}${escapeHtml(fromFace.toUpperCase())})</span> &rarr; <strong>${escapeHtml(cable.to.instance_id)}:${escapeHtml(cable.to.port_id)}</strong> <span class="muted">(${escapeHtml(toU)}${escapeHtml(toFace.toUpperCase())})</span>${portalNote}</td>
      <td class="mono"><strong>${commMm} mm</strong><div class="muted" style="font-size:7.3pt;">req ${reqMm} mm</div></td>
      <td>${notesHtml}</td>
    </tr>`);
  }

  const externalDropsHtml =
    project.external_endpoints.length > 0
      ? `<h3 class="subsection-title">4.3 External Building / Room Cable Drops (${project.external_endpoints.length})</h3>
<table>
  <thead>
    <tr>
      <th style="width:28px;text-align:center;">Done</th>
      <th>Endpoint ID</th>
      <th>Room / Endpoint Label</th>
      <th>Speed &amp; PoE</th>
      <th>Step 1: Rear Termination</th>
      <th>Step 2: Front Switch Patch</th>
      <th>Notes / VLAN</th>
    </tr>
  </thead>
  <tbody>
    ${project.external_endpoints
      .map((ext) => {
        const frontPatch = project.cables.find(
          (c) =>
            (c.from.instance_id === ext.patch_panel_instance_id &&
              c.from.port_id === ext.patch_panel_port_id &&
              (c.from.face ?? 'front') === 'front') ||
            (c.to.instance_id === ext.patch_panel_instance_id &&
              c.to.port_id === ext.patch_panel_port_id &&
              (c.to.face ?? 'front') === 'front'),
        );
        const swEnd = frontPatch
          ? frontPatch.from.instance_id === ext.patch_panel_instance_id &&
            frontPatch.from.port_id === ext.patch_panel_port_id
            ? frontPatch.to
            : frontPatch.from
          : null;
        const safeColor = sanitizeHexColor(
          ensureHighContrastCableHex(ext.color_hex, 'svg-dark'),
        );
        const roomSuffix = ext.room_or_zone
          ? `<div class="muted" style="font-size:7.4pt;">${escapeHtml(ext.room_or_zone)}</div>`
          : '';
        const step2Html =
          swEnd && frontPatch
            ? `<span class="mono">${escapeHtml(frontPatch.cable_id)}: ${escapeHtml(ext.patch_panel_instance_id)}:${escapeHtml(ext.patch_panel_port_id)} (FRONT) &rarr; ${escapeHtml(swEnd.instance_id)}:${escapeHtml(swEnd.port_id)}</span>`
            : '<span class="muted">Unpatched on front</span>';
        const extNotes: string[] = [];
        if (ext.vlan_id !== undefined) {
          extNotes.push(`<span class="badge badge-vlan mono">VLAN ${ext.vlan_id}</span>`);
        }
        extNotes.push(`<span class="badge mono">${escapeHtml(ext.category)}</span>`);
        if (ext.notes) {
          extNotes.push(`<span>${escapeHtml(ext.notes)}</span>`);
        }

        return `<tr>
      <td style="text-align:center;"><span class="check-box" aria-hidden="true"></span></td>
      <td class="mono"><span class="swatch" style="background:${safeColor};"></span><strong>${escapeHtml(ext.endpoint_id)}</strong></td>
      <td><strong>${escapeHtml(ext.label)}</strong>${roomSuffix}</td>
      <td class="mono">${escapeHtml(ext.required_speed.toUpperCase())}${ext.poe_draw_watts > 0 ? ` · PoE ${roundTenths(ext.poe_draw_watts)} W` : ' · No PoE'}</td>
      <td class="mono">${escapeHtml(ext.entry_position)} &rarr; ${escapeHtml(ext.patch_panel_instance_id)}:${escapeHtml(ext.patch_panel_port_id)} (REAR)</td>
      <td>${step2Html}</td>
      <td>${extNotes.join(' ')}</td>
    </tr>`;
      })
      .join('\n    ')}
  </tbody>
</table>`
      : '';

  return `<section class="page-section page-break" data-section="slot-map-and-patching">
  <h2 class="section-title">4. Rack Elevation Slot Map &amp; Step-by-Step Cable Patching Checklist</h2>
  <p class="section-lead">Install rackmount hardware bottom-up (U1 upward) for Center-of-Gravity stability, then terminate and check off each patch and power link.</p>

  <h3 class="subsection-title">4.1 Rack Elevation Slot Map (Top-Down U${project.rack.u_height} &rarr; U1)</h3>
  <table>
    <thead>
      <tr>
        <th style="width:48px;">U</th>
        <th>Front Mounting Rails &amp; Carrier Sub-Modules</th>
        <th>Rear Mounting Rails</th>
        <th style="width:76px;">Depth</th>
      </tr>
    </thead>
    <tbody>
      ${slotRows.join('\n      ')}
    </tbody>
  </table>

  <h3 class="subsection-title">4.2 Step-by-Step Cable Patching Checklist (${project.cables.length} Cables)</h3>
  <table>
    <thead>
      <tr>
        <th style="width:32px;text-align:center;">Done</th>
        <th>Cable ID</th>
        <th>Type</th>
        <th>From Device:Port -&gt; To Device:Port</th>
        <th style="width:82px;">Cut Length mm</th>
        <th>Notes / VLAN</th>
      </tr>
    </thead>
    <tbody>
      ${
        cableRows.length > 0
          ? cableRows.join('\n      ')
          : '<tr><td colspan="6" class="muted">No internal patch or power cables configured in this project.</td></tr>'
      }
    </tbody>
  </table>

  ${externalDropsHtml}
</section>`;
}

function buildPrintQueueAndBomSection(
  scene: ComputedRackScene,
  include3DPrintQueue: boolean,
): string {
  const { project, geometry, validation, cable_routes } = scene;
  const routesById = new Map(cable_routes.map((r) => [r.cable_id, r]));

  const commercialGroups = new Map<string, CommercialBomGroup>();
  const printableGroups = new Map<string, PrintableQueueGroup>();

  for (const dev of geometry.devices) {
    const bp = dev.blueprint;
    if (bp.printable_metadata !== null) {
      const existingPrint = printableGroups.get(bp.slug);
      if (existingPrint !== undefined) {
        existingPrint.instances.push(dev);
      } else {
        printableGroups.set(bp.slug, {
          slug: bp.slug,
          model: bp.model,
          category: bp.category,
          material: bp.printable_metadata.material_recommendation,
          unitFilamentGrams: bp.printable_metadata.filament_grams,
          heatSetInserts: bp.printable_metadata.heat_set_inserts ?? '—',
          fasteners: bp.printable_metadata.fasteners ?? '—',
          instances: [dev],
        });
      }
      continue;
    }

    const existing = commercialGroups.get(bp.slug);
    if (existing !== undefined) {
      existing.instances.push(dev);
    } else {
      commercialGroups.set(bp.slug, {
        slug: bp.slug,
        manufacturer: bp.manufacturer,
        model: bp.model,
        category: bp.category,
        unitMaxWatts: bp.power_and_thermal.max_system_watts,
        unitWeightGrams: bp.geometry.weight_grams,
        unitPriceEur: bp.estimated_price_eur,
        instances: [dev],
      });
    }
  }

  let totalFilamentGrams = 0;
  const printRows: string[] = [];
  for (const pg of printableGroups.values()) {
    const qty = pg.instances.length;
    const sumFilament = Math.round(qty * pg.unitFilamentGrams);
    totalFilamentGrams += sumFilament;
    const locations = pg.instances
      .map((d) => `${d.instance_id} (U${d.u_position})`)
      .join(', ');
    const orientationAdvice = buildOrientationAdvice(
      pg.category,
      project.rack.standard,
    );
    printRows.push(`<tr>
      <td class="mono"><strong>${escapeHtml(pg.slug)}</strong><div class="muted" style="font-size:7.4pt;">${escapeHtml(pg.model)} · ${escapeHtml(locations)}</div><div class="muted" style="font-size:7.3pt;">CAD: ${escapeHtml(pg.slug)}.scad / ${escapeHtml(pg.slug)}.stl</div></td>
      <td class="mono" style="text-align:center;">${qty}</td>
      <td><strong class="mono">${escapeHtml(pg.material)}</strong><div style="font-size:7.5pt;color:#52525B;margin-top:2px;">${escapeHtml(orientationAdvice)}</div></td>
      <td class="mono"><strong>${sumFilament} g</strong><div class="muted" style="font-size:7.3pt;">${roundTenths(pg.unitFilamentGrams)} g/ea</div></td>
      <td class="mono"><div>Inserts: ${escapeHtml(pg.heatSetInserts)}</div><div>Fasteners: ${escapeHtml(pg.fasteners)}</div></td>
    </tr>`);
  }

  const printQueueHtml = include3DPrintQueue
    ? `<h3 class="subsection-title">5.1 3D-Print Carrier &amp; Bracket Queue</h3>
  <table data-testid="buildbook-print-queue">
    <thead>
      <tr>
        <th>Blueprint &amp; Local CAD Artifact</th>
        <th style="width:42px;text-align:center;">Qty</th>
        <th>Material &amp; Print Orientation Advice</th>
        <th style="width:86px;">Filament (g)</th>
        <th>Heat-Set Inserts &amp; Fasteners</th>
      </tr>
    </thead>
    <tbody>
      ${
        printRows.length > 0
          ? printRows.join('\n      ')
          : '<tr><td colspan="5" class="muted">No 3D-printed carriers or cover panels mounted in this project.</td></tr>'
      }
    </tbody>
    ${
      printRows.length > 0
        ? `<tfoot>
      <tr>
        <td colspan="3">Total Estimated 3D Filament Required</td>
        <td class="mono" colspan="2">${totalFilamentGrams} g</td>
      </tr>
    </tfoot>`
        : ''
    }
  </table>`
    : '';

  let totalCommercialQty = 0;
  let totalCommercialWatts = 0;
  let totalCommercialGrams = 0;
  const commercialRows: string[] = [];
  for (const group of commercialGroups.values()) {
    const qty = group.instances.length;
    totalCommercialQty += qty;
    const sumWatts = roundTenths(qty * group.unitMaxWatts);
    const sumGrams = Math.round(qty * group.unitWeightGrams);
    totalCommercialWatts = roundTenths(totalCommercialWatts + sumWatts);
    totalCommercialGrams += sumGrams;

    const locations = group.instances
      .map((d) =>
        d.mount_target === 'carrier-slot'
          ? `${d.instance_id} (U${d.u_position} ${String(d.parent_carrier_id)}:${String(d.slot_id)})`
          : `${d.instance_id} (U${d.u_position} ${d.face})`,
      )
      .join(', ');
    const priceCell =
      group.unitPriceEur !== undefined
        ? `€${(qty * group.unitPriceEur).toFixed(2)}`
        : '—';

    commercialRows.push(`<tr>
      <td><strong>${escapeHtml(group.manufacturer)} ${escapeHtml(group.model)}</strong><div class="mono muted" style="font-size:7.4pt;">${escapeHtml(group.slug)} · ${escapeHtml(group.category)}</div></td>
      <td class="mono" style="text-align:center;">${qty}</td>
      <td class="mono" style="font-size:7.6pt;">${escapeHtml(locations)}</td>
      <td class="mono">${sumWatts} W</td>
      <td class="mono">${sumGrams} g</td>
      <td class="mono">${escapeHtml(priceCell)}</td>
    </tr>`);
  }

  const cableGroups = new Map<string, CableBomGroup>();
  for (const cable of project.cables) {
    const route = routesById.get(cable.cable_id);
    const commMm = route?.recommended_commercial_mm ?? 500;
    const color = sanitizeHexColor(cable.color_hex);
    const key = `${cable.cable_type}|${commMm}|${color}`;

    const existing = cableGroups.get(key);
    if (existing !== undefined) {
      existing.cableIds.push(cable.cable_id);
      if (cable.label !== undefined && cable.label.trim().length > 0) {
        existing.labels.push(cable.label);
      }
    } else {
      cableGroups.set(key, {
        key,
        cableType: cable.cable_type,
        commercialLengthMm: commMm,
        colorHex: color,
        badge: formatCableTypeBadge(cable.cable_type, commMm),
        cableIds: [cable.cable_id],
        labels:
          cable.label !== undefined && cable.label.trim().length > 0
            ? [cable.label]
            : [],
      });
    }
  }

  const sortedCableGroups = [...cableGroups.values()].sort(
    (a, b) =>
      a.cableType.localeCompare(b.cableType) ||
      a.commercialLengthMm - b.commercialLengthMm,
  );

  const cableBomRows = sortedCableGroups.map((cg) => {
    const meters = (cg.commercialLengthMm / 1000).toFixed(2);
    const idsText = cg.cableIds.map((id) => escapeHtml(id)).join(', ');
    const labelsText =
      cg.labels.length > 0
        ? ` <span class="muted">(${cg.labels.map((l) => escapeHtml(l)).join('; ')})</span>`
        : '';
    return `<tr>
      <td class="mono"><strong>${escapeHtml(cg.cableType)}</strong><div class="muted" style="font-size:7.3pt;">${escapeHtml(cg.badge)}</div></td>
      <td class="mono"><strong>${meters} m</strong> (${cg.commercialLengthMm} mm)</td>
      <td class="mono"><span class="swatch" style="background:${cg.colorHex};"></span>${escapeHtml(cg.colorHex)}</td>
      <td class="mono" style="text-align:center;">${cg.cableIds.length}</td>
      <td class="mono" style="font-size:7.6pt;">${idsText}${labelsText}</td>
    </tr>`;
  });

  const budgetTotalEur = validation.power_summary.estimated_hardware_budget_eur ?? 0;

  return `<section class="page-section" data-section="print-queue-and-bom">
  <h2 class="section-title">5. 3D-Print Fabrication Queue &amp; Complete Procurement BOM</h2>
  <p class="section-lead">Consolidated fabrication queue, commercial hardware shopping list, and aggregated commercial cable length bins.</p>

  ${printQueueHtml}

  <h3 class="subsection-title">5.2 Commercial Hardware Procurement BOM</h3>
  <table data-testid="buildbook-hardware-bom">
    <thead>
      <tr>
        <th>Hardware Model &amp; Slug</th>
        <th style="width:42px;text-align:center;">Qty</th>
        <th>Instances &amp; Rack Locations</th>
        <th style="width:74px;">Max Power</th>
        <th style="width:74px;">Weight</th>
        <th style="width:78px;">Est. Price</th>
      </tr>
    </thead>
    <tbody>
      ${
        commercialRows.length > 0
          ? commercialRows.join('\n      ')
          : '<tr><td colspan="6" class="muted">No commercial rack hardware mounted in this project.</td></tr>'
      }
    </tbody>
    ${
      commercialRows.length > 0
        ? `<tfoot>
      <tr>
        <td>Commercial Hardware Totals</td>
        <td class="mono" style="text-align:center;">${totalCommercialQty}</td>
        <td class="muted">Total rack mass incl. carriers: ${roundTenths(validation.mechanical_summary.total_weight_grams / 1000)} kg</td>
        <td class="mono">${totalCommercialWatts} W</td>
        <td class="mono">${totalCommercialGrams} g</td>
        <td class="mono">${budgetTotalEur > 0 ? `€${budgetTotalEur.toFixed(2)}` : '—'}</td>
      </tr>
    </tfoot>`
        : ''
    }
  </table>

  <h3 class="subsection-title">5.3 Aggregated Cable Procurement BOM (${project.cables.length} Total Cables)</h3>
  <table data-testid="buildbook-cable-bom">
    <thead>
      <tr>
        <th>Cable Type</th>
        <th>Commercial Length</th>
        <th>Color</th>
        <th style="width:42px;text-align:center;">Qty</th>
        <th>Cable IDs &amp; Purpose</th>
      </tr>
    </thead>
    <tbody>
      ${
        cableBomRows.length > 0
          ? cableBomRows.join('\n      ')
          : '<tr><td colspan="5" class="muted">No cables configured in this project.</td></tr>'
      }
    </tbody>
  </table>

  <footer class="doc-footer mono">
    <span>Generated deterministically by RackArchitect MCP (@rack-mcp/exporters)</span>
    <span>Zero-Egress Self-Contained Build Book</span>
  </footer>
</section>`;
}

/**
 * Generates a self-contained, CSP-compliant (`default-src 'self'`, zero external URLs,
 * zero inline `<script>` or `onclick` handlers), print-ready A4/Letter Build Book HTML
 * document combining engineering KPIs, synchronized 2D CAD Elevation & Wiring SVGs,
 * Rack Elevation Slot Map, Cable Patching Checklist, 3D-Print Queue, and Procurement BOM.
 */
export function generateBuildBookHtml(
  sceneInput: ComputedRackScene | SerializedRackScene,
  options: BuildBookOptions = {},
): string {
  const scene = normalizeComputedScene(sceneInput);
  const pageSize: 'A4' | 'Letter' =
    options.pageSize === 'Letter' ? 'Letter' : 'A4';
  const rawRate = options.electricityPricePerKwhEur;
  const electricityRateEur =
    rawRate !== undefined && Number.isFinite(rawRate) && rawRate >= 0
      ? rawRate
      : 0.32;
  const include3DPrintQueue = options.include3DPrintQueue ?? true;

  const elevationSvg = generateElevationSvg(scene);
  const wiringSvg = generateWiringSchematicSvg(scene);

  const printBannerTitle = `RackArchitect Build Book · ${pageSize} Print-Ready Manual`;
  const pageSpecText =
    pageSize === 'Letter' ? 'US Letter (8.5 × 11 in)' : 'A4 (210 × 297 mm)';

  const coverSection = buildCoverAndKpisSection(scene, electricityRateEur);
  const elevationSection = buildCadSvgSection(
    'cad-elevation',
    '2. Synchronized 2D Elevation & Z-Depth Cutaway CAD Drawing',
    'Front mounting view, horizontally mirrored rear view, and Z-depth side cutaway showing chassis and plug clearances.',
    elevationSvg,
    `Envelope: ${roundTenths(scene.geometry.panel_width_mm)} × ${roundTenths(scene.geometry.total_height_mm)} mm · Rail Depth ${roundTenths(scene.project.rack.rail_depth_mm)} mm`,
    `Clearances: Front ${roundTenths(scene.project.rack.front_door_clearance_mm)} mm / Rear ${roundTenths(scene.project.rack.rear_clearance_mm)} mm`,
  );
  const wiringSection = buildCadSvgSection(
    'wiring-schematic',
    '3. 2D Wiring & Power/PoE Schematic',
    'Hierarchical power & PoE distribution DAG paired with multi-track port-to-port patch routing.',
    wiringSvg,
    `Peak Load: ${roundTenths(scene.validation.power_summary.total_system_watts)} W · PoE Output: ${roundTenths(scene.validation.power_summary.total_poe_watts)} W`,
    `Routed Cables: ${scene.project.cables.length} · External Drops: ${scene.project.external_endpoints.length}`,
  );
  const slotAndPatchSection = buildSlotMapAndPatchChecklistSection(scene);
  const bomAndPrintSection = buildPrintQueueAndBomSection(
    scene,
    include3DPrintQueue,
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(scene.project.project_name)} — RackArchitect Build Book</title>
  ${buildStylesheet(pageSize)}
</head>
<body>
  <main class="book-shell">
    <div class="no-print print-banner" role="region" aria-label="Print instructions">
      <div>
        <div class="print-banner-title">${escapeHtml(printBannerTitle)}</div>
        <div class="print-banner-hint">
          Press <span class="kbd-pill mono">Ctrl+P</span> or <span class="kbd-pill mono">⌘+P</span> (or use Browser &rarr; File &rarr; Print / Save as PDF). Set paper to <strong>${escapeHtml(pageSpecText)}</strong>, margins <strong>12 mm / Default</strong>, and enable <strong>Background graphics</strong>.
        </div>
      </div>
      <div class="kbd-pill mono">CSP-Clean · Print Hidden (.no-print)</div>
    </div>

    ${coverSection}
    ${elevationSection}
    ${wiringSection}
    ${slotAndPatchSection}
    ${bomAndPrintSection}
  </main>
</body>
</html>
`;
}
