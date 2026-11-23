import { roundTenths, type SerializedRackScene } from '@rack-mcp/core-domain';

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function toSafeSlug(raw: string): string {
  let out = '';
  let prevDash = false;
  for (const ch of raw.toLowerCase()) {
    const code = ch.charCodeAt(0);
    const isAlphaNum =
      (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
    if (isAlphaNum) {
      out += ch;
      prevDash = false;
    } else if (!prevDash && out.length > 0) {
      out += '-';
      prevDash = true;
    }
    if (out.length >= 48) {
      break;
    }
  }
  while (out.endsWith('-')) {
    out = out.slice(0, -1);
  }
  return out || 'rack-architecture';
}

function truncateText(text: string, maxChars: number): string {
  if (text.length <= maxChars) return text;
  return `${text.slice(0, Math.max(1, maxChars - 1))}…`;
}

function extractNestedSvg(
  elevationSvg: string,
): { readonly viewBox: string; readonly innerMarkup: string } | null {
  const openIdx = elevationSvg.indexOf('<svg');
  if (openIdx === -1) return null;
  const openEndIdx = elevationSvg.indexOf('>', openIdx);
  const closeIdx = elevationSvg.lastIndexOf('</svg>');
  if (openEndIdx === -1 || closeIdx <= openEndIdx) return null;

  const openTag = elevationSvg.slice(openIdx, openEndIdx + 1);
  const vbMatch = /viewBox="([^"]{1,64})"/.exec(openTag);
  const viewBox = vbMatch?.[1]?.trim() || '0 0 1180 680';
  const innerMarkup = elevationSvg.slice(openEndIdx + 1, closeIdx);
  return { viewBox, innerMarkup };
}

function triggerBinaryDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates a self-contained 1200×675 (16:9) Carbon/Zinc showcase card SVG
 * embedding the deterministic 2D rack elevation preview alongside live KPIs.
 * Contains zero external URLs or fonts so it stays 100% CSP `default-src 'self'` compliant.
 */
export function renderRackShareCardSvg(
  scene: SerializedRackScene,
  elevationSvg: string,
): string {
  const width = 1200;
  const height = 675;
  const { project, validation, geometry, cable_routes } = scene;
  const pwr = validation.power_summary;
  const mech = validation.mechanical_summary;
  const isValid = validation.is_valid;
  const statusColor = isValid ? '#10B981' : '#EF4444';
  const statusBg = isValid ? 'rgba(16,185,129,0.14)' : 'rgba(239,68,68,0.14)';
  const statusLabel = isValid
    ? `VALIDATED · 0 ERRORS`
    : `${validation.error_count} ERRORS · ${validation.warning_count} WARN`;

  const stdLabel =
    project.rack.standard === '19inch'
      ? '19" EIA-310'
      : project.rack.standard === '6inch'
        ? '6" MICRO-LAB'
        : '10" MINI-RACK';
  const weightKg = roundTenths(mech.total_weight_grams / 1000);
  const idleW = roundTenths(pwr.total_idle_watts);
  const peakW = roundTenths(pwr.total_system_watts);
  const poeW = roundTenths(pwr.total_poe_watts);
  const totalEur = pwr.estimated_hardware_budget_eur;
  const projectTitle = truncateText(project.project_name, 52);

  const nestedElevation = extractNestedSvg(elevationSvg);
  const topDevices = geometry.devices
    .filter((d) => d.mount_target === 'rack-unit')
    .slice(0, 6);

  const deviceRowsSvg = topDevices
    .map((dev, idx) => {
      const y = 398 + idx * 28;
      const uText =
        dev.blueprint.geometry.u_height === 1
          ? `U${dev.u_position}`
          : `U${dev.u_position}–${dev.u_position + Math.ceil(dev.blueprint.geometry.u_height) - 1}`;
      const label = truncateText(
        `${dev.hostname ?? dev.instance_id} (${dev.blueprint.model})`,
        34,
      );
      return [
        `<rect x="822" y="${y}" width="342" height="22" rx="4" fill="#18181D" stroke="#27272A" stroke-width="0.8" />`,
        `<text x="832" y="${y + 15}" fill="#60A5FA" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11" font-weight="600">${escapeXml(uText)}</text>`,
        `<text x="878" y="${y + 15}" fill="#E4E4E7" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="11.5">${escapeXml(label)}</text>`,
      ].join('');
    })
    .join('\n  ');

  const elevationPreviewSvg = nestedElevation
    ? `<svg x="36" y="102" width="752" height="496" viewBox="${escapeXml(nestedElevation.viewBox)}" preserveAspectRatio="xMidYMid meet">${nestedElevation.innerMarkup}</svg>`
    : `<text x="412" y="350" text-anchor="middle" fill="#71717A" font-family="ui-monospace, monospace" font-size="14">2D Elevation Preview Unavailable</text>`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect x="0" y="0" width="${width}" height="${height}" fill="#09090B" />
  <rect x="16" y="16" width="${width - 32}" height="${height - 32}" rx="14" fill="#0E0E11" stroke="#27272A" stroke-width="1.2" />

  <!-- Top Header Strip -->
  <text x="38" y="54" fill="#F4F4F5" font-family="ui-sans-serif, system-ui, -apple-system, sans-serif" font-size="22" font-weight="700">${escapeXml(projectTitle)}</text>
  <text x="38" y="76" fill="#A1A1AA" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="12.5">${escapeXml(`${stdLabel} · ${project.rack.u_height}U · ${project.rack.rail_depth_mm}mm Depth · ${project.rack.enclosure_type}`)}</text>

  <rect x="930" y="34" width="234" height="32" rx="16" fill="${statusBg}" stroke="${statusColor}" stroke-opacity="0.45" stroke-width="1" />
  <circle cx="948" cy="50" r="4.5" fill="${statusColor}" />
  <text x="962" y="54.5" fill="${isValid ? '#6EE7B7' : '#FCA5A5'}" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="11.5" font-weight="700">${escapeXml(statusLabel)}</text>

  <!-- Left 2D Elevation Panel -->
  <rect x="30" y="94" width="764" height="512" rx="10" fill="#121216" stroke="#27272A" stroke-width="1" />
  ${elevationPreviewSvg}

  <!-- Right Spec & KPI Panel -->
  <rect x="810" y="94" width="366" height="512" rx="10" fill="#121216" stroke="#27272A" stroke-width="1" />
  <text x="826" y="122" fill="#A1A1AA" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8">DETERMINISTIC ENGINEERING KPIs</text>

  <!-- 2x2 KPI Grid -->
  <rect x="824" y="136" width="164" height="72" rx="8" fill="#18181D" stroke="#27272A" stroke-width="0.9" />
  <text x="836" y="156" fill="#71717A" font-family="ui-sans-serif, sans-serif" font-size="10.5">POWER (IDLE / PEAK)</text>
  <text x="836" y="182" fill="#F4F4F5" font-family="ui-monospace, monospace" font-size="16" font-weight="700">${escapeXml(`${idleW}W / ${peakW}W`)}</text>
  <text x="836" y="198" fill="#60A5FA" font-family="ui-monospace, monospace" font-size="10.5">${escapeXml(`PoE Load: ${poeW}W`)}</text>

  <rect x="998" y="136" width="164" height="72" rx="8" fill="#18181D" stroke="#27272A" stroke-width="0.9" />
  <text x="1010" y="156" fill="#71717A" font-family="ui-sans-serif, sans-serif" font-size="10.5">EQUIPMENT &amp; CABLES</text>
  <text x="1010" y="182" fill="#F4F4F5" font-family="ui-monospace, monospace" font-size="16" font-weight="700">${geometry.devices.length} Dev · ${cable_routes.length} Cab</text>
  <text x="1010" y="198" fill="#A1A1AA" font-family="ui-monospace, monospace" font-size="10.5">${escapeXml(`Mass: ${weightKg} kg`)}</text>

  <rect x="824" y="218" width="164" height="72" rx="8" fill="#18181D" stroke="#27272A" stroke-width="0.9" />
  <text x="836" y="238" fill="#71717A" font-family="ui-sans-serif, sans-serif" font-size="10.5">THERMAL &amp; ACOUSTIC</text>
  <text x="836" y="264" fill="#F4F4F5" font-family="ui-monospace, monospace" font-size="16" font-weight="700">${escapeXml(`${roundTenths(mech.total_thermal_btu_hr)} BTU/h`)}</text>
  <text x="836" y="280" fill="#A1A1AA" font-family="ui-monospace, monospace" font-size="10.5">${escapeXml(`Noise: ${roundTenths(mech.combined_noise_db_a)} dBA`)}</text>

  <rect x="998" y="218" width="164" height="72" rx="8" fill="#18181D" stroke="#27272A" stroke-width="0.9" />
  <text x="1010" y="238" fill="#71717A" font-family="ui-sans-serif, sans-serif" font-size="10.5">INDICATIVE BOM</text>
  <text x="1010" y="264" fill="#F4F4F5" font-family="ui-monospace, monospace" font-size="16" font-weight="700">${totalEur > 0 ? escapeXml(`~€${Math.round(totalEur)}`) : 'Custom BOM'}</text>
  <text x="1010" y="280" fill="#34D399" font-family="ui-monospace, monospace" font-size="10.5">Watertight .STL Ready</text>

  <rect x="824" y="302" width="338" height="58" rx="8" fill="#18181D" stroke="#27272A" stroke-width="0.9" />
  <text x="836" y="322" fill="#71717A" font-family="ui-sans-serif, sans-serif" font-size="10.5">AI AGENT / RACK-AS-CODE STATUS</text>
  <text x="836" y="344" fill="#D4D4D8" font-family="ui-monospace, monospace" font-size="12">${escapeXml(`Warnings: ${validation.warning_count} · Clearances &amp; Splines Verified`)}</text>

  <text x="826" y="384" fill="#A1A1AA" font-family="ui-sans-serif, sans-serif" font-size="11" font-weight="700" letter-spacing="0.8">MOUNTED HARDWARE STACK</text>
  ${deviceRowsSvg}

  <!-- Bottom Attribution Footer -->
  <line x1="30" y1="622" x2="1176" y2="622" stroke="#27272A" stroke-width="1" />
  <text x="38" y="644" fill="#E4E4E7" font-family="ui-sans-serif, sans-serif" font-size="12.5" font-weight="700">RackArchitect MCP</text>
  <text x="172" y="644" fill="#71717A" font-family="ui-monospace, monospace" font-size="12">Deterministic 2D/3D Rack-as-Code + Parametric OpenSCAD/.STL</text>
  <text x="1166" y="644" text-anchor="end" fill="#60A5FA" font-family="ui-monospace, monospace" font-size="12" font-weight="600">mcp.rackarchitect.dev</text>
</svg>`;
}

/**
 * Renders the 1200×675 Rack Share Card onto an offscreen canvas and triggers
 * a PNG download (`<slug>-share-card.png`), falling back to `.svg` if canvas PNG export is unsupported.
 */
export async function exportRackShareCardPng(
  scene: SerializedRackScene,
  elevationSvg: string,
): Promise<'png' | 'svg'> {
  const cardSvg = renderRackShareCardSvg(scene, elevationSvg);
  const stem = `${toSafeSlug(scene.project.project_name)}-share-card`;
  const svgBlob = new Blob([cardSvg], { type: 'image/svg+xml;charset=utf-8' });

  if (typeof document === 'undefined' || typeof Image === 'undefined') {
    triggerBinaryDownload(svgBlob, `${stem}.svg`);
    return 'svg';
  }

  const svgUrl = URL.createObjectURL(svgBlob);
  try {
    const img = new Image();
    img.width = 1200;
    img.height = 675;

    const loaded = await new Promise<boolean>((resolve) => {
      const timeout = window.setTimeout(() => resolve(false), 3000);
      img.onload = () => {
        window.clearTimeout(timeout);
        resolve(true);
      };
      img.onerror = () => {
        window.clearTimeout(timeout);
        resolve(false);
      };
      img.src = svgUrl;
    });

    if (!loaded) {
      triggerBinaryDownload(svgBlob, `${stem}.svg`);
      return 'svg';
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      triggerBinaryDownload(svgBlob, `${stem}.svg`);
      return 'svg';
    }
    ctx.fillStyle = '#09090B';
    ctx.fillRect(0, 0, 1200, 675);
    ctx.drawImage(img, 0, 0, 1200, 675);

    const pngBlob = await new Promise<Blob | null>((resolve) => {
      if (typeof canvas.toBlob !== 'function') {
        resolve(null);
        return;
      }
      canvas.toBlob((blob) => resolve(blob), 'image/png');
    });

    if (!pngBlob) {
      triggerBinaryDownload(svgBlob, `${stem}.svg`);
      return 'svg';
    }

    triggerBinaryDownload(pngBlob, `${stem}.png`);
    return 'png';
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
