import {
  ensureHighContrastCableHex,
  roundCentis,
  roundTenths,
  type CableType,
  type ComputedDeviceGeometry,
  type ComputedPortGeometry,
  type ComputedRackScene,
} from '@rack-mcp/core-domain';
import { escapeXml } from './elevation-svg.js';

export function formatCableTypeBadge(
  cableType: CableType,
  commercialMm: number,
): string {
  const meters = (commercialMm / 1000).toFixed(2);
  const labelMap: Record<CableType, string> = {
    cat6a: 'Cat6A',
    'cat6a-angled': 'Cat6A Angled',
    cat6: 'Cat6',
    'cat6-angled': 'Cat6 Angled',
    cat5e: 'Cat5e',
    'cat5e-angled': 'Cat5e Angled',
    'sfp-plus-dac': '10G DAC',
    'sfp-plus-dac-angled': '10G DAC Angled',
    'fiber-lc-duplex': 'OM4 Fiber',
    'fiber-lc-duplex-angled': 'OM4 Fiber Angled',
    'rj45-serial-rollover': 'Serial Rollover',
    'rj45-serial-rollover-angled': 'Serial Rollover Angled',
    'power-c13-c14': 'IEC C13-C14',
    'power-c13-c14-angled': 'IEC C13-C14 Angled',
    'power-schuko-c13': 'Schuko-C13',
    'power-schuko-c13-angled': 'Schuko-C13 Angled',
    'power-dc-5525': 'DC Barrel',
    'power-dc-5525-angled': 'DC Barrel Angled',
    'power-usb-c': 'USB-C PD',
    'power-usb-c-angled': 'USB-C PD Angled',
  };
  return `${meters}m ${labelMap[cableType]}`;
}

/**
 * Builds an orthogonal 3-segment SVG path `(x1, y1) -> (xTrack, y1) -> (xTrack, y2) -> (x2, y2)`
 * with smooth `r = 8px` rounded 90-degree corners via SVG `Q` commands.
 * Guarantees exact start `M x1 y1` and exact end `L x2 y2`.
 */
function buildRoundedManhattanPath(
  x1: number,
  y1: number,
  xTrack: number,
  x2: number,
  y2: number,
  cornerRadius = 8,
): string {
  const sx = roundCentis(x1);
  const sy = roundCentis(y1);
  const ex = roundCentis(x2);
  const ey = roundCentis(y2);
  const tx = roundCentis(xTrack);

  const dy = ey - sy;
  if (Math.abs(dy) < 1) {
    return `M ${sx} ${sy} L ${ex} ${ey}`;
  }
  const r = roundCentis(
    Math.min(
      cornerRadius,
      Math.abs(dy) / 2,
      Math.abs(tx - sx) / 2,
      Math.abs(ex - tx) / 2,
    ),
  );
  const signY = dy > 0 ? 1 : -1;
  const signX1 = tx >= sx ? 1 : -1;
  const signX2 = ex >= tx ? 1 : -1;

  return [
    `M ${sx} ${sy}`,
    `L ${roundCentis(tx - signX1 * r)} ${sy}`,
    `Q ${tx} ${sy} ${tx} ${roundCentis(sy + signY * r)}`,
    `L ${tx} ${roundCentis(ey - signY * r)}`,
    `Q ${tx} ${ey} ${roundCentis(tx + signX2 * r)} ${ey}`,
    `L ${ex} ${ey}`,
  ].join(' ');
}

export interface PortPinAnchor {
  readonly pinKey: string;
  readonly cableId: string;
  readonly instanceId: string;
  readonly portId: string;
  readonly face: string | undefined;
  readonly connectorType: string;
  readonly capabilityBadge: string;
  readonly pinX: number;
  readonly pinY: number;
  readonly column: 'left' | 'right';
}

interface DeviceSchematicCard {
  readonly instanceId: string;
  readonly title: string;
  readonly subtitle: string;
  readonly column: 'left' | 'right';
  readonly cardX: number;
  readonly cardY: number;
  readonly cardW: number;
  readonly cardH: number;
  readonly pins: PortPinAnchor[];
}

function resolvePortDetails(
  dev: ComputedDeviceGeometry | undefined,
  portId: string,
  face: string | undefined,
): { connectorType: string; capabilityBadge: string } {
  if (!dev) {
    return { connectorType: 'rj45', capabilityBadge: 'PORT' };
  }
  const matching: ComputedPortGeometry | undefined =
    dev.ports.find(
      (p) =>
        p.port_id === portId &&
        (face === undefined || p.local_face === face || p.world_face === face),
    ) ?? dev.ports.find((p) => p.port_id === portId);

  if (!matching) {
    return { connectorType: 'rj45', capabilityBadge: 'PORT' };
  }
  const conn = matching.connector_type.toUpperCase();
  const primaryCap = matching.capabilities[0]?.toUpperCase() ?? 'IO';
  return {
    connectorType: matching.connector_type,
    capabilityBadge: `${conn} • ${primaryCap}`,
  };
}

/**
 * Generates a CAD-grade two-section 2D Technical Wiring & Power Schematic SVG:
 * - Section 1: Hierarchical Left-to-Right Power & PoE Distribution Tree (`Mains/UPS -> PDU / PSE Switch -> Consumers/PDs`) with exact watt figures and utilization bars.
 * - Section 2: Port-to-Port Network & Patch Schematic with device port cards (`30px` vertical port pitch), explicit `pinMap` port-pin anchors `(pinX, pinY)` with mini socket icons and type badges, and a Multi-Track Orthogonal Channel Router (`16px` track spacing, `r=8px` `Q` corners, non-overlapping cable tags `cab-id | 0.25m Cat6A`).
 */
export function generateWiringSchematicSvg(scene: ComputedRackScene): string {
  const powerSummary = scene.validation.power_summary;
  const routesById = new Map(scene.cable_routes.map((r) => [r.cable_id, r]));

  const activeDevices = scene.geometry.devices.filter(
    (d) => d.blueprint.power_and_thermal.electrical_role !== 'passive',
  );

  // Group active devices into 3 hierarchical DAG tiers for Section 1:
  // Tier 0 (Left): UPS
  // Tier 1 (Middle): PDU & PoE PSE Switches
  // Tier 2 (Right): Active Consumers & PoE PDs
  const tier0Ups = activeDevices.filter(
    (d) => d.blueprint.power_and_thermal.electrical_role === 'ups',
  );
  const tier1Mid = activeDevices.filter((d) => {
    const r = d.blueprint.power_and_thermal.electrical_role;
    return r === 'pdu' || r === 'pse-switch';
  });
  const tier2Consumers = activeDevices.filter(
    (d) => d.blueprint.power_and_thermal.electrical_role === 'consumer',
  );

  const pwrCardW = 340;
  const pwrCardH = 74;
  const pwrCardGapY = 18;
  const maxTierCount = Math.max(
    1,
    tier0Ups.length,
    tier1Mid.length,
    tier2Consumers.length,
  );
  const sec1Height = 96 + maxTierCount * (pwrCardH + pwrCardGapY) + 20;

  // =========================================================================
  // Pre-compute Section 2 Device Port Cards & Multi-Track Channel Assignments
  // =========================================================================
  const portRowPitchPx = 30;
  const cardHeaderPx = 40;
  const cardBottomPadPx = 12;
  const deviceCardGapY = 20;

  const classifyColumn = (dev: ComputedDeviceGeometry | undefined): 'left' | 'right' => {
    if (!dev) return 'left';
    const cat = dev.blueprint.category;
    if (cat === 'ups' || cat === 'pdu' || cat === 'patch-panel') {
      return 'left';
    }
    return 'right';
  };

  interface RawPinSpec {
    readonly cableId: string;
    readonly instanceId: string;
    readonly portId: string;
    readonly face: string | undefined;
  }

  const leftDevicePins = new Map<string, RawPinSpec[]>();
  const rightDevicePins = new Map<string, RawPinSpec[]>();

  for (const cable of scene.project.cables) {
    const fromDev = scene.geometry.devices_by_id.get(cable.from.instance_id);
    const toDev = scene.geometry.devices_by_id.get(cable.to.instance_id);
    const fromCol = classifyColumn(fromDev);
    const toCol = classifyColumn(toDev);

    // Place one endpoint on the left column and the other on the right column
    // so every cable cleanly traverses the central multi-track channel
    const placeFromLeft =
      fromCol === 'left' || (fromCol === 'right' && toCol === 'right');

    const leftEp = placeFromLeft ? cable.from : cable.to;
    const rightEp = placeFromLeft ? cable.to : cable.from;

    const lList = leftDevicePins.get(leftEp.instance_id) ?? [];
    lList.push({
      cableId: cable.cable_id,
      instanceId: leftEp.instance_id,
      portId: leftEp.port_id,
      face: leftEp.face,
    });
    leftDevicePins.set(leftEp.instance_id, lList);

    const rList = rightDevicePins.get(rightEp.instance_id) ?? [];
    rList.push({
      cableId: cable.cable_id,
      instanceId: rightEp.instance_id,
      portId: rightEp.port_id,
      face: rightEp.face,
    });
    rightDevicePins.set(rightEp.instance_id, rList);
  }

  const trackCount = Math.max(1, scene.project.cables.length);
  const trackSpacingPx = 16; // Dedicated 16px per vertical routing track
  const channelPaddingPx = 296; // Corridor for non-overlapping cable tags
  const channelWidthPx = channelPaddingPx + trackCount * trackSpacingPx + 24;

  const devCardW = 320;
  const leftCardX = 48;
  const channelStartX = leftCardX + devCardW;
  const rightCardX = channelStartX + channelWidthPx;
  const svgWidth = Math.max(1420, rightCardX + devCardW + 48);

  const sec1Top = 76;
  const sec2Top = sec1Top + sec1Height + 24;

  // Central Pin Registry (`pinMap`) guaranteeing every cable attaches to its exact pin `(pinX, pinY)`
  const pinMap = new Map<string, PortPinAnchor>();

  const buildColumnCards = (
    rawMap: ReadonlyMap<string, RawPinSpec[]>,
    column: 'left' | 'right',
    cardX: number,
  ): { cards: DeviceSchematicCard[]; totalColumnHeight: number } => {
    const cards: DeviceSchematicCard[] = [];
    let currentY = sec2Top + 56;

    for (const [instanceId, rawPins] of rawMap.entries()) {
      const dev = scene.geometry.devices_by_id.get(instanceId);
      const title = dev
        ? `${dev.hostname ?? dev.blueprint.model} (${instanceId})`
        : instanceId;
      const subtitle = dev
        ? `U${dev.u_position} ${dev.face.toUpperCase()} • ${dev.blueprint.category}`
        : 'Device';
      const cardH =
        cardHeaderPx + rawPins.length * portRowPitchPx + cardBottomPadPx;

      const pinX = roundCentis(column === 'left' ? cardX + devCardW : cardX);

      const pins: PortPinAnchor[] = rawPins.map((p, idx) => {
        const pinY = roundCentis(
          currentY + cardHeaderPx + idx * portRowPitchPx + portRowPitchPx / 2,
        );
        const details = resolvePortDetails(dev, p.portId, p.face);
        const pinKey = `${p.cableId}:${column}`;
        const anchor: PortPinAnchor = {
          pinKey,
          cableId: p.cableId,
          instanceId: p.instanceId,
          portId: p.portId,
          face: p.face,
          connectorType: details.connectorType,
          capabilityBadge: details.capabilityBadge,
          pinX,
          pinY,
          column,
        };
        pinMap.set(pinKey, anchor);
        return anchor;
      });

      cards.push({
        instanceId,
        title,
        subtitle,
        column,
        cardX,
        cardY: currentY,
        cardW: devCardW,
        cardH,
        pins,
      });

      currentY += cardH + deviceCardGapY;
    }

    return {
      cards,
      totalColumnHeight: Math.max(180, currentY - sec2Top + 24),
    };
  };

  const leftColLayout = buildColumnCards(leftDevicePins, 'left', leftCardX);
  const rightColLayout = buildColumnCards(rightDevicePins, 'right', rightCardX);
  const sec2Height = Math.max(
    leftColLayout.totalColumnHeight,
    rightColLayout.totalColumnHeight,
  );

  const svgHeight = roundCentis(sec2Top + sec2Height + 40);

  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">`,
  );

  // Dark CAD Background
  lines.push(
    `  <rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#090D16" />`,
  );

  // Header
  lines.push(
    `  <text x="32" y="34" fill="#F8FAFC" font-size="17" font-weight="700">${escapeXml(scene.project.project_name)} — Hierarchical Power DAG &amp; Multi-Track Wiring Schematic</text>`,
  );
  lines.push(
    `  <text x="32" y="54" fill="#94A3B8" font-size="11.5">Total System Draw: ${roundTenths(powerSummary.total_system_watts)}W | Total PoE Output: ${roundTenths(powerSummary.total_poe_watts)}W | Routed Cables: ${scene.project.cables.length} (16px Track Pitch, 8px Corner Rounding, 30px Port Pitch)</text>`,
  );

  // =========================================================================
  // SECTION 1: Power & PoE Distribution Graph (Left -> Right Tree)
  // =========================================================================
  lines.push(`  <g data-section="power-poe-dag">`);
  lines.push(
    `    <rect x="24" y="${sec1Top}" width="${svgWidth - 48}" height="${sec1Height}" rx="8" fill="#0F172A" stroke="#1E293B" stroke-width="1.5" />`,
  );
  lines.push(
    `    <text x="48" y="${sec1Top + 30}" fill="#38BDF8" font-size="13.5" font-weight="700">SECTION 1: POWER &amp; PoE DISTRIBUTION TREE (MAINS / UPS → PDU &amp; PSE SWITCH → CONSUMERS)</text>`,
  );

  const tierColX = [
    48,
    roundCentis((svgWidth - pwrCardW) / 2),
    svgWidth - 48 - pwrCardW,
  ] as const;

  const powerNodePositions = new Map<
    string,
    { readonly x: number; readonly y: number; readonly w: number; readonly h: number }
  >();

  const renderPowerTier = (
    devs: readonly ComputedDeviceGeometry[],
    tierIdx: 0 | 1 | 2,
    tierHeader: string,
  ): void => {
    const colX = tierColX[tierIdx];
    lines.push(
      `    <text x="${colX}" y="${sec1Top + 54}" fill="#94A3B8" font-size="10.5" font-weight="700">${escapeXml(tierHeader)}</text>`,
    );

    for (let i = 0; i < devs.length; i++) {
      const dev = devs[i]!;
      const cardY = sec1Top + 66 + i * (pwrCardH + pwrCardGapY);
      powerNodePositions.set(dev.instance_id, {
        x: colX,
        y: cardY,
        w: pwrCardW,
        h: pwrCardH,
      });

      const isUnpowered = powerSummary.unpowered_active_instances.includes(
        dev.instance_id,
      );
      const pseBudget = powerSummary.pse_budgets.find(
        (b) => b.pse_instance_id === dev.instance_id,
      );
      const pwrSource = powerSummary.power_sources.find(
        (s) => s.source_instance_id === dev.instance_id,
      );

      const role = dev.blueprint.power_and_thermal.electrical_role;
      const maxW = dev.blueprint.power_and_thermal.max_system_watts;
      const idleW = dev.blueprint.power_and_thermal.idle_watts;

      const borderStroke = isUnpowered
        ? '#EF4444'
        : role === 'ups' || role === 'pdu'
          ? '#10B981'
          : role === 'pse-switch'
            ? '#F59E0B'
            : '#38BDF8';

      lines.push(
        `    <g data-power-node="${escapeXml(dev.instance_id)}" data-role="${role}">`,
      );
      lines.push(
        `      <rect x="${colX}" y="${cardY}" width="${pwrCardW}" height="${pwrCardH}" rx="6" fill="#1E293B" stroke="${borderStroke}" stroke-width="1.6" />`,
      );
      lines.push(
        `      <text x="${colX + 12}" y="${cardY + 20}" fill="#F8FAFC" font-size="11" font-weight="700">${escapeXml(dev.hostname ?? dev.blueprint.model)} (${escapeXml(dev.instance_id)})</text>`,
      );
      lines.push(
        `      <text x="${colX + 12}" y="${cardY + 37}" fill="#94A3B8" font-size="9.5">U${dev.u_position} ${dev.face.toUpperCase()} • ${role.toUpperCase()} • Own Draw: ${idleW}W Idle / ${maxW}W Max</text>`,
      );

      if (isUnpowered) {
        lines.push(
          `      <rect x="${colX + pwrCardW - 102}" y="${cardY + 6}" width="92" height="18" rx="4" fill="#EF4444" />`,
        );
        lines.push(
          `      <text x="${colX + pwrCardW - 56}" y="${cardY + 18}" fill="#090D16" font-size="9" font-weight="700" text-anchor="middle">UNPOWERED</text>`,
        );
      }

      if (pseBudget !== undefined) {
        const utilPct =
          pseBudget.poe_budget_watts > 0
            ? Math.min(
                100,
                roundTenths(
                  (pseBudget.consumed_poe_watts / pseBudget.poe_budget_watts) *
                    100,
                ),
              )
            : 0;
        const barW = 120;
        const fillW = roundCentis((barW * utilPct) / 100);
        const barColor =
          pseBudget.consumed_poe_watts > pseBudget.poe_budget_watts
            ? '#EF4444'
            : '#F59E0B';
        lines.push(
          `      <rect x="${colX + 12}" y="${cardY + 50}" width="${barW}" height="8" rx="4" fill="#090D16" />`,
        );
        lines.push(
          `      <rect x="${colX + 12}" y="${cardY + 50}" width="${fillW}" height="8" rx="4" fill="${barColor}" />`,
        );
        lines.push(
          `      <text x="${colX + 140}" y="${cardY + 57}" fill="#FDE68A" font-size="9">PoE Budget: ${roundTenths(pseBudget.consumed_poe_watts)}W / ${pseBudget.poe_budget_watts}W (${utilPct}%)</text>`,
        );
      } else if (pwrSource !== undefined) {
        const utilPct = Math.min(100, roundTenths(pwrSource.utilization_percent));
        const barW = 120;
        const fillW = roundCentis((barW * utilPct) / 100);
        const barColor =
          pwrSource.total_load_watts > pwrSource.capacity_watts
            ? '#EF4444'
            : '#10B981';
        lines.push(
          `      <rect x="${colX + 12}" y="${cardY + 50}" width="${barW}" height="8" rx="4" fill="#090D16" />`,
        );
        lines.push(
          `      <rect x="${colX + 12}" y="${cardY + 50}" width="${fillW}" height="8" rx="4" fill="${barColor}" />`,
        );
        lines.push(
          `      <text x="${colX + 140}" y="${cardY + 57}" fill="#A7F3D0" font-size="9">${pwrSource.role.toUpperCase()} Load: ${roundTenths(pwrSource.total_load_watts)}W / ${pwrSource.capacity_watts}W (${roundTenths(pwrSource.utilization_percent)}%)</text>`,
        );
      }
      lines.push(`    </g>`);
    }
  };

  renderPowerTier(tier0Ups, 0, 'TIER 1: MAINS / UPS BACKUP');
  renderPowerTier(tier1Mid, 1, 'TIER 2: DISTRIBUTION (PDU & PoE PSE)');
  renderPowerTier(tier2Consumers, 2, 'TIER 3: ACTIVE CONSUMERS & PoE PDs');

  // Render Power & PoE DAG Tree Edges between tiers
  const powerCables = scene.project.cables.filter((c) =>
    c.cable_type.startsWith('power-'),
  );
  for (let i = 0; i < powerCables.length; i++) {
    const pc = powerCables[i]!;
    const posA = powerNodePositions.get(pc.from.instance_id);
    const posB = powerNodePositions.get(pc.to.instance_id);
    if (!posA || !posB) continue;

    const leftPos = posA.x <= posB.x ? posA : posB;
    const rightPos = posA.x <= posB.x ? posB : posA;
    const x1 = roundCentis(leftPos.x + leftPos.w);
    const y1 = roundCentis(leftPos.y + 24 + (i % 3) * 10);
    const x2 = roundCentis(rightPos.x);
    const y2 = roundCentis(rightPos.y + 24 + (i % 3) * 10);
    const xTrack = roundCentis((x1 + x2) / 2 + (i - powerCables.length / 2) * 12);

    const pcColor = ensureHighContrastCableHex(pc.color_hex, 'svg-dark');
    const d = buildRoundedManhattanPath(x1, y1, xTrack, x2, y2, 8);
    lines.push(
      `    <path data-power-edge="${escapeXml(pc.cable_id)}" d="${d}" fill="none" stroke="${pcColor}" stroke-width="2" stroke-dasharray="4,2" opacity="0.88" />`,
    );
    lines.push(
      `    <circle cx="${x1}" cy="${y1}" r="3" fill="${pcColor}" stroke="#090D16" stroke-width="1" />`,
    );
    lines.push(
      `    <circle cx="${x2}" cy="${y2}" r="3" fill="${pcColor}" stroke="#090D16" stroke-width="1" />`,
    );
  }
  lines.push(`  </g>`);

  // =========================================================================
  // SECTION 2: Port-to-Port Network & Patch Schematic (Multi-Track Channel)
  // =========================================================================
  lines.push(`  <g data-section="port-to-port-schematic">`);
  lines.push(
    `    <rect x="24" y="${sec2Top}" width="${svgWidth - 48}" height="${sec2Height}" rx="8" fill="#0F172A" stroke="#1E293B" stroke-width="1.5" />`,
  );
  lines.push(
    `    <text x="48" y="${sec2Top + 30}" fill="#38BDF8" font-size="13.5" font-weight="700">SECTION 2: PORT-TO-PORT NETWORK &amp; PATCH SCHEMATIC (MULTI-TRACK ORTHOGONAL CHANNEL ROUTER)</text>`,
  );

  const renderDeviceSchematicCards = (
    cards: readonly DeviceSchematicCard[],
  ): void => {
    for (const card of cards) {
      lines.push(
        `    <g data-schematic-device="${escapeXml(card.instanceId)}">`,
      );
      lines.push(
        `      <rect x="${card.cardX}" y="${card.cardY}" width="${card.cardW}" height="${card.cardH}" rx="6" fill="#1E293B" stroke="#334155" stroke-width="1.5" />`,
      );
      lines.push(
        `      <rect x="${card.cardX}" y="${card.cardY}" width="${card.cardW}" height="${cardHeaderPx}" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1" />`,
      );
      lines.push(
        `      <text x="${card.cardX + 12}" y="${card.cardY + 17}" fill="#F8FAFC" font-size="10.5" font-weight="700">${escapeXml(card.title.slice(0, 40))}</text>`,
      );
      lines.push(
        `      <text x="${card.cardX + 12}" y="${card.cardY + 31}" fill="#94A3B8" font-size="9">${escapeXml(card.subtitle)}</text>`,
      );

      for (const pin of card.pins) {
        const rowTop = roundCentis(pin.pinY - portRowPitchPx / 2);
        const faceBadge = pin.face ? ` [${pin.face}]` : '';
        const pinName = `${pin.portId}${faceBadge}`;

        const isLeft = card.column === 'left';
        // Mini connector socket icon positioned just inside the card border adjacent to (pinX, pinY)
        const iconW = 10;
        const iconH = 10;
        const iconX = roundCentis(isLeft ? pin.pinX - 18 : pin.pinX + 8);
        const iconY = roundCentis(pin.pinY - iconH / 2);

        const textX = roundCentis(isLeft ? pin.pinX - 24 : pin.pinX + 24);
        const textAnchor = isLeft ? 'end' : 'start';

        // Port Type & Capability Badge on opposite side of the row
        const badgeW = 94;
        const badgeH = 15;
        const badgeX = roundCentis(
          isLeft ? card.cardX + 10 : card.cardX + card.cardW - badgeW - 10,
        );
        const badgeY = roundCentis(pin.pinY - badgeH / 2);

        lines.push(
          `      <line x1="${card.cardX + 6}" y1="${rowTop}" x2="${card.cardX + card.cardW - 6}" y2="${rowTop}" stroke="#334155" stroke-width="0.6" />`,
        );

        // Port Type Badge
        lines.push(
          `      <rect x="${badgeX}" y="${badgeY}" width="${badgeW}" height="${badgeH}" rx="3" fill="#090D16" stroke="#475569" stroke-width="0.8" />`,
        );
        lines.push(
          `      <text x="${roundCentis(badgeX + badgeW / 2)}" y="${roundCentis(pin.pinY + 3)}" fill="#94A3B8" font-size="7.5" font-weight="600" text-anchor="middle">${escapeXml(pin.capabilityBadge.slice(0, 16))}</text>`,
        );

        // Mini Socket Symbol
        lines.push(
          `      <rect data-pin-connector="${escapeXml(pin.connectorType)}" x="${iconX}" y="${iconY}" width="${iconW}" height="${iconH}" rx="1.5" fill="#090D16" stroke="#64748B" stroke-width="1" />`,
        );
        lines.push(
          `      <line x1="${roundCentis(iconX + 2.5)}" y1="${roundCentis(iconY + 3)}" x2="${roundCentis(iconX + iconW - 2.5)}" y2="${roundCentis(iconY + 3)}" stroke="#F59E0B" stroke-width="1" />`,
        );

        // Port Name Label
        lines.push(
          `      <text x="${textX}" y="${roundCentis(pin.pinY + 3.5)}" fill="#E2E8F0" font-size="10" font-weight="700" text-anchor="${textAnchor}">${escapeXml(pinName)}</text>`,
        );

        // Fixed Pin Terminal on Card Border `(pinX, pinY)`
        lines.push(
          `      <circle data-pin-key="${escapeXml(pin.pinKey)}" data-pin-x="${pin.pinX}" data-pin-y="${pin.pinY}" cx="${pin.pinX}" cy="${pin.pinY}" r="4" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5" />`,
        );
      }

      lines.push(`    </g>`);
    }
  };

  renderDeviceSchematicCards(leftColLayout.cards);
  renderDeviceSchematicCards(rightColLayout.cards);

  // Render Multi-Track Orthogonal Cable Paths + Non-Overlapping Cable Tags
  const baseChannelX = roundCentis(channelStartX + channelPaddingPx);

  for (let trackIdx = 0; trackIdx < scene.project.cables.length; trackIdx++) {
    const cable = scene.project.cables[trackIdx]!;
    const startPin = pinMap.get(`${cable.cable_id}:left`);
    const endPin = pinMap.get(`${cable.cable_id}:right`);
    if (!startPin || !endPin) continue;

    const route = routesById.get(cable.cable_id);
    const commercialMm = route?.recommended_commercial_mm ?? 500;
    const badgeText = formatCableTypeBadge(cable.cable_type, commercialMm);

    // Dedicated vertical track X coordinate with 16px spacing and 8px corner rounding
    const channelX = roundCentis(baseChannelX + trackIdx * trackSpacingPx);
    const manhattanPath = buildRoundedManhattanPath(
      startPin.pinX,
      startPin.pinY,
      channelX,
      endPin.pinX,
      endPin.pinY,
      8,
    );

    const netSuffixParts: string[] = [];
    if (cable.vlan_id !== undefined) {
      netSuffixParts.push(`VLAN${cable.vlan_id}`);
    }
    if (cable.ip_cidr !== undefined) {
      netSuffixParts.push(cable.ip_cidr);
    }
    const netSuffix =
      netSuffixParts.length > 0 ? ` • ${netSuffixParts.join(' ')}` : '';
    const vlanAttr =
      cable.vlan_id !== undefined ? ` data-vlan-id="${cable.vlan_id}"` : '';
    const cidrAttr =
      cable.ip_cidr !== undefined
        ? ` data-ip-cidr="${escapeXml(cable.ip_cidr)}"`
        : '';

    const displayColor = ensureHighContrastCableHex(
      cable.color_hex,
      'svg-dark',
    );

    lines.push(
      `    <g data-schematic-cable="${escapeXml(cable.cable_id)}" data-track-index="${trackIdx}" data-channel-x="${channelX}" data-start-pin="${startPin.pinX},${startPin.pinY}" data-end-pin="${endPin.pinX},${endPin.pinY}" data-cable-type="${cable.cable_type}"${vlanAttr}${cidrAttr}>`,
    );
    lines.push(
      `      <path d="${manhattanPath}" fill="none" stroke="${displayColor}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`,
    );

    // Plug dots directly on startPin and endPin
    lines.push(
      `      <circle class="schematic-pin-plug" cx="${startPin.pinX}" cy="${startPin.pinY}" r="3.2" fill="${displayColor}" stroke="#090D16" stroke-width="1" />`,
    );
    lines.push(
      `      <circle class="schematic-pin-plug" cx="${endPin.pinX}" cy="${endPin.pinY}" r="3.2" fill="${displayColor}" stroke="#090D16" stroke-width="1" />`,
    );

    // Non-overlapping Cable Tag (`cab-id | 0.25m Cat6A • VLAN10`) on the dedicated horizontal segment at startPin.pinY
    const pillW = netSuffix.length > 0 ? 316 : 264;
    const pillH = 19;
    const pillX = roundCentis(startPin.pinX + 14);
    const pillY = roundCentis(startPin.pinY - pillH / 2);
    const pillText = `${cable.cable_id} | ${badgeText}${netSuffix}`;

    lines.push(
      `      <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="9.5" fill="#090D16" stroke="${displayColor}" stroke-width="1.3" />`,
    );
    lines.push(
      `      <text x="${roundCentis(pillX + pillW / 2)}" y="${roundCentis(startPin.pinY + 3.2)}" fill="#F8FAFC" font-size="8.4" font-weight="600" text-anchor="middle">${escapeXml(pillText.slice(0, 48))}</text>`,
    );
    lines.push(`    </g>`);
  }

  lines.push(`  </g>`);
  lines.push(`</svg>`);
  return lines.join('\n');
}

export const generateWiringSvg = generateWiringSchematicSvg;
