import {
  ensureHighContrastCableHex,
  roundCentis,
  type ComputedRackScene,
} from '@rack-mcp/core-domain';
import { escapeXml } from './elevation-svg.js';
import { formatCableTypeBadge } from './wiring-svg.js';

export interface CableLabelEntry {
  readonly cableId: string;
  readonly wrapLabel: string;
  readonly fromEndpoint: string;
  readonly toEndpoint: string;
  readonly cableTypeLabel: string;
  readonly vlanTag: string;
  readonly commercialLengthMm: number;
  readonly colorHex: string;
  readonly notes: string;
}

export interface CableLabelsSvgOptions {
  /** Target thermal tape width in mm (Brother P-Touch / DYMO / Niimbot): 12, 18 (default), or 24 mm */
  readonly tapeWidthMm?: 12 | 18 | 24 | undefined;
}

function resolveDeviceDisplayName(
  scene: ComputedRackScene,
  instanceId: string,
): string {
  const dev = scene.geometry.devices_by_id.get(instanceId);
  if (dev?.hostname && dev.hostname.trim().length > 0) {
    return dev.hostname.trim();
  }
  return instanceId;
}

/**
 * Extracts deterministic wrap-around label entries for every routed rack cable
 * and incoming building/room drop so Brother P-Touch, DYMO, and Niimbot printers
 * can print matching port-to-port tags.
 */
export function extractCableLabelEntries(
  scene: ComputedRackScene,
): CableLabelEntry[] {
  const routesById = new Map(scene.cable_routes.map((r) => [r.cable_id, r]));
  const entries: CableLabelEntry[] = [];

  for (const cable of scene.project.cables) {
    const route = routesById.get(cable.cable_id);
    const commMm = route?.recommended_commercial_mm ?? 500;
    const fromHost = resolveDeviceDisplayName(scene, cable.from.instance_id);
    const toHost = resolveDeviceDisplayName(scene, cable.to.instance_id);
    const fromEndpoint = `${fromHost}:${cable.from.port_id}`;
    const toEndpoint = `${toHost}:${cable.to.port_id}`;
    const vlanTag =
      cable.vlan_id !== undefined ? `VLAN ${cable.vlan_id}` : '—';
    const badge = formatCableTypeBadge(cable.cable_type, commMm);
    const wrapLabel =
      cable.vlan_id !== undefined
        ? `${fromEndpoint} ↔ ${toEndpoint} · VLAN ${cable.vlan_id}`
        : `${fromEndpoint} ↔ ${toEndpoint}`;

    entries.push({
      cableId: cable.cable_id,
      wrapLabel,
      fromEndpoint,
      toEndpoint,
      cableTypeLabel: badge,
      vlanTag,
      commercialLengthMm: commMm,
      colorHex: ensureHighContrastCableHex(cable.color_hex),
      notes: cable.label ?? '',
    });
  }

  for (const ext of scene.project.external_endpoints ?? []) {
    const ppName = resolveDeviceDisplayName(scene, ext.patch_panel_instance_id);
    const toEndpoint = `${ppName}:${ext.patch_panel_port_id} (REAR)`;
    const fromEndpoint = ext.room_or_zone
      ? `${ext.label} [${ext.room_or_zone}]`
      : ext.label;
    entries.push({
      cableId: ext.endpoint_id,
      wrapLabel: `${ext.label} → ${ppName}:${ext.patch_panel_port_id}`,
      fromEndpoint,
      toEndpoint,
      cableTypeLabel: `Drop (${ext.required_speed.toUpperCase()})`,
      vlanTag: ext.poe_draw_watts > 0 ? `PoE ${ext.poe_draw_watts}W` : 'LAN/WAN',
      commercialLengthMm: 0,
      colorHex: ensureHighContrastCableHex(ext.color_hex),
      notes: `${ext.entry_position} · ${ext.category}`,
    });
  }

  return entries;
}

function escapeCsvCell(raw: string): string {
  const cleaned = raw.replace(/[\r\n\x00-\x08\x0b\x0c\x0e-\x1f\x7f]+/g, ' ').trim();
  // Neutralize spreadsheet formula injection (=, +, -, @, tab, CR)
  const safe =
    cleaned.length > 0 && /^[=+\-@\t\r]/.test(cleaned)
      ? `'${cleaned}`
      : cleaned;
  if (safe.includes(',') || safe.includes('"') || safe.includes('\n')) {
    return `"${safe.replace(/"/g, '""')}"`;
  }
  return safe;
}

/**
 * Generates an RFC-4180 CSV export (`labels.csv`) compatible with Brother P-Touch Editor,
 * DYMO Label Software, and Niimbot batch import templates.
 */
export function generateCableLabelsCsv(scene: ComputedRackScene): string {
  const entries = extractCableLabelEntries(scene);
  const rows: string[] = [
    'CableID,WrapLabel,FromEndpoint,ToEndpoint,CableType,VLAN,CommercialLengthMm,ColorHex,Notes',
  ];

  for (const entry of entries) {
    rows.push(
      [
        escapeCsvCell(entry.cableId),
        escapeCsvCell(entry.wrapLabel),
        escapeCsvCell(entry.fromEndpoint),
        escapeCsvCell(entry.toEndpoint),
        escapeCsvCell(entry.cableTypeLabel),
        escapeCsvCell(entry.vlanTag),
        entry.commercialLengthMm > 0 ? String(entry.commercialLengthMm) : 'Building-Drop',
        escapeCsvCell(entry.colorHex),
        escapeCsvCell(entry.notes),
      ].join(','),
    );
  }

  return `${rows.join('\n')}\n`;
}

/**
 * Generates a vector printable cable-label cut sheet (`labels.svg`) scaled to the selected
 * thermal tape height (`12mm`, `18mm`, or `24mm`) with jacket color stripes and fold guides.
 */
export function generateCableLabelsSvg(
  scene: ComputedRackScene,
  options: CableLabelsSvgOptions = {},
): string {
  const tapeWidthMm = options.tapeWidthMm ?? 18;
  const entries = extractCableLabelEntries(scene);

  const cols = 2;
  const labelW = 280;
  const labelH = tapeWidthMm === 12 ? 48 : tapeWidthMm === 24 ? 72 : 58;
  const gapX = 16;
  const gapY = 12;
  const marginX = 24;
  const marginTop = 64;
  const rowCount = Math.max(1, Math.ceil(entries.length / cols));
  const totalW = marginX * 2 + cols * labelW + (cols - 1) * gapX;
  const totalH = marginTop + rowCount * (labelH + gapY) + 28;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}">`,
  );
  parts.push(
    `<rect x="0" y="0" width="${totalW}" height="${totalH}" fill="#09090B" />`,
  );
  parts.push(
    `<text x="${marginX}" y="28" fill="#F4F4F5" font-family="ui-sans-serif, system-ui, sans-serif" font-size="14" font-weight="700">${escapeXml(scene.project.project_name)} — Wrap-Around Cable Labels (${tapeWidthMm}mm Tape)</text>`,
  );
  parts.push(
    `<text x="${marginX}" y="46" fill="#A1A1AA" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10.5">Total Labels: ${entries.length} · Print 1:1 on Brother P-Touch / DYMO / Niimbot or A4 sticker sheet and fold along center dashed line</text>`,
  );

  if (entries.length === 0) {
    parts.push(
      `<text x="${marginX}" y="${marginTop + 24}" fill="#71717A" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12">No cables or external drops configured in this rack.</text>`,
    );
  } else {
    entries.forEach((entry, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const x = marginX + col * (labelW + gapX);
      const y = marginTop + row * (labelH + gapY);
      const midY = roundCentis(y + labelH / 2);

      // White sticker surface with dashed cut border
      parts.push(
        `<rect x="${x}" y="${y}" width="${labelW}" height="${labelH}" rx="4" fill="#FAFAFA" stroke="#52525B" stroke-width="1" stroke-dasharray="4 2" />`,
      );
      // Left jacket color stripe
      parts.push(
        `<rect x="${x + 2}" y="${y + 2}" width="8" height="${labelH - 4}" rx="2" fill="${escapeXml(entry.colorHex)}" />`,
      );
      // Center wrap fold line
      parts.push(
        `<line x1="${x + 14}" y1="${midY}" x2="${x + labelW - 8}" y2="${midY}" stroke="#D4D4D8" stroke-width="0.9" stroke-dasharray="3 3" />`,
      );

      const topTextY = roundCentis(y + labelH * 0.3);
      const botTextY = roundCentis(y + labelH * 0.77);
      const fontSizeMain = tapeWidthMm === 12 ? 9.5 : tapeWidthMm === 24 ? 11.5 : 10.5;
      const fontSizeSub = tapeWidthMm === 12 ? 8.2 : 9.2;

      const primaryLine = `${entry.fromEndpoint} ↔ ${entry.toEndpoint}`;
      const secondaryLine = `${entry.cableId} · ${entry.cableTypeLabel} · ${entry.vlanTag}`;

      parts.push(
        `<text x="${x + 18}" y="${topTextY}" fill="#09090B" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${fontSizeMain}" font-weight="700">${escapeXml(primaryLine.slice(0, 40))}</text>`,
      );
      parts.push(
        `<text x="${x + 18}" y="${botTextY}" fill="#3F3F46" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="${fontSizeSub}">${escapeXml(secondaryLine.slice(0, 46))}</text>`,
      );
    });
  }

  parts.push(`</svg>`);
  return parts.join('\n');
}
