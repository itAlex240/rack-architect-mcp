import {
  AABB_INTERSECTION_EPSILON_MM,
  EIA_310_SPECS,
  MM_PER_U,
  U_HOLE_OFFSETS_MM,
  getBoxIntersection,
  isPowerCableType,
  resolveCableEndpointPortGeometry,
  roundCentis,
  roundTenths,
  type BoundingBox3D,
  type ComputedPortGeometry,
  type ComputedRackScene,
  type RackFace,
} from '@rack-mcp/core-domain';

export interface ElevationSvgOptions {
  /** Pixels per millimeter scale factor (default: 2.8 px/mm for CAD-grade precision) */
  readonly scalePxPerMm?: number | undefined;
  /** Whether to render front & rear cable paths on the elevation views (default: true) */
  readonly showCables?: boolean | undefined;
}

export interface PortPixelAnchor {
  readonly key: string;
  readonly instanceId: string;
  readonly portId: string;
  readonly face: RackFace;
  readonly x: number;
  readonly y: number;
  readonly uPosition: number;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getContrastingTextColor(hexColor: string): string {
  const clean = hexColor.replace(/#/g, '');
  if (clean.length !== 6) {
    return '#F8FAFC';
  }
  const r = Number.parseInt(clean.slice(0, 2), 16);
  const g = Number.parseInt(clean.slice(2, 4), 16);
  const b = Number.parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.62 ? '#0F172A' : '#F8FAFC';
}

interface DepthCollisionHighlight {
  readonly code:
    | 'CHASSIS_COLLISION'
    | 'PLUG_CLEARANCE_COLLISION'
    | 'FRONT_DOOR_COLLISION';
  readonly box: BoundingBox3D;
  readonly overlapDepthMm: number;
  readonly label: string;
}

function computeDepthCollisionHighlights(
  scene: ComputedRackScene,
): DepthCollisionHighlight[] {
  const highlights: DepthCollisionHighlight[] = [];
  const devices = scene.geometry.devices;

  for (let i = 0; i < devices.length; i++) {
    const devA = devices[i]!;
    for (let j = i + 1; j < devices.length; j++) {
      const devB = devices[j]!;
      if (
        devA.parent_carrier_id === devB.instance_id ||
        devB.parent_carrier_id === devA.instance_id
      ) {
        continue;
      }

      const chassisInter = getBoxIntersection(
        devA.chassis_box,
        devB.chassis_box,
        AABB_INTERSECTION_EPSILON_MM,
      );
      if (chassisInter) {
        const overlapMm = roundTenths(
          chassisInter.max.z - chassisInter.min.z,
        );
        highlights.push({
          code: 'CHASSIS_COLLISION',
          box: chassisInter,
          overlapDepthMm: overlapMm,
          label: `CHASSIS COLLISION: ${devA.instance_id} vs ${devB.instance_id} (${overlapMm}mm)`,
        });
        continue;
      }

      if (!devA.plug_clearance_box && !devB.plug_clearance_box) {
        continue;
      }

      const candidateIntersections = [
        devA.plug_clearance_box
          ? getBoxIntersection(
              devA.plug_clearance_box,
              devB.chassis_box,
              AABB_INTERSECTION_EPSILON_MM,
            )
          : null,
        devB.plug_clearance_box
          ? getBoxIntersection(
              devA.chassis_box,
              devB.plug_clearance_box,
              AABB_INTERSECTION_EPSILON_MM,
            )
          : null,
        devA.plug_clearance_box && devB.plug_clearance_box
          ? getBoxIntersection(
              devA.plug_clearance_box,
              devB.plug_clearance_box,
              AABB_INTERSECTION_EPSILON_MM,
            )
          : null,
      ].filter((b): b is BoundingBox3D => b !== null);

      const plugInter = candidateIntersections[0];
      if (plugInter) {
        const overlapMm = roundTenths(plugInter.max.z - plugInter.min.z);
        highlights.push({
          code: 'PLUG_CLEARANCE_COLLISION',
          box: plugInter,
          overlapDepthMm: overlapMm,
          label: `PLUG COLLISION: ${devA.instance_id} vs ${devB.instance_id} (${overlapMm}mm)`,
        });
      }
    }
  }

  if (scene.project.rack.enclosure_type !== 'open-frame') {
    const doorPlaneZ = -scene.project.rack.front_door_clearance_mm;
    for (const dev of devices) {
      const minZ = Math.min(
        dev.chassis_box.min.z,
        dev.plug_clearance_box?.min.z ?? dev.chassis_box.min.z,
      );
      if (minZ < doorPlaneZ - AABB_INTERSECTION_EPSILON_MM) {
        const overflowMm = roundTenths(doorPlaneZ - minZ);
        highlights.push({
          code: 'FRONT_DOOR_COLLISION',
          box: {
            min: {
              x: dev.chassis_box.min.x,
              y: dev.chassis_box.min.y,
              z: minZ,
            },
            max: {
              x: dev.chassis_box.max.x,
              y: dev.chassis_box.max.y,
              z: doorPlaneZ,
            },
          },
          overlapDepthMm: overflowMm,
          label: `DOOR COLLISION: ${dev.instance_id} (+${overflowMm}mm)`,
        });
      }
    }
  }

  return highlights;
}

/**
 * Builds a clean orthogonal polyline SVG path through `pts` with rounded `Q` corners (`radiusPx`),
 * strictly beginning at `M pts[0].x pts[0].y` and ending at `L pts[last].x pts[last].y`.
 */
function buildRoundedOrthogonalPath(
  pts: ReadonlyArray<{ readonly x: number; readonly y: number }>,
  radiusPx = 5.5,
): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) {
    return `M ${roundCentis(pts[0]!.x)} ${roundCentis(pts[0]!.y)}`;
  }

  // Filter consecutive duplicate points while preserving first and last
  const clean: Array<{ readonly x: number; readonly y: number }> = [pts[0]!];
  for (let i = 1; i < pts.length; i++) {
    const prev = clean[clean.length - 1]!;
    const curr = pts[i]!;
    if (Math.hypot(curr.x - prev.x, curr.y - prev.y) > 0.5) {
      clean.push(curr);
    }
  }
  if (clean.length === 1) {
    const end = pts[pts.length - 1]!;
    return `M ${roundCentis(clean[0]!.x)} ${roundCentis(clean[0]!.y)} L ${roundCentis(end.x)} ${roundCentis(end.y)}`;
  }

  const cmds: string[] = [
    `M ${roundCentis(clean[0]!.x)} ${roundCentis(clean[0]!.y)}`,
  ];

  for (let i = 1; i < clean.length - 1; i++) {
    const prev = clean[i - 1]!;
    const curr = clean[i]!;
    const next = clean[i + 1]!;

    const vx1 = curr.x - prev.x;
    const vy1 = curr.y - prev.y;
    const len1 = Math.hypot(vx1, vy1);

    const vx2 = next.x - curr.x;
    const vy2 = next.y - curr.y;
    const len2 = Math.hypot(vx2, vy2);

    const r = Math.min(radiusPx, len1 * 0.42, len2 * 0.42);
    if (r < 1.0) {
      cmds.push(`L ${roundCentis(curr.x)} ${roundCentis(curr.y)}`);
      continue;
    }

    const enterX = roundCentis(curr.x - (vx1 / len1) * r);
    const enterY = roundCentis(curr.y - (vy1 / len1) * r);
    const exitX = roundCentis(curr.x + (vx2 / len2) * r);
    const exitY = roundCentis(curr.y + (vy2 / len2) * r);

    cmds.push(`L ${enterX} ${enterY}`);
    cmds.push(
      `Q ${roundCentis(curr.x)} ${roundCentis(curr.y)}, ${exitX} ${exitY}`,
    );
  }

  const last = clean[clean.length - 1]!;
  cmds.push(`L ${roundCentis(last.x)} ${roundCentis(last.y)}`);
  return cmds.join(' ');
}

/**
 * Builds a smooth cubic Bézier path (`M ... C ...`) for the Side-Cutaway Z-profile.
 */
export function buildSmoothBezierSvgPath(
  pts: ReadonlyArray<{ readonly x: number; readonly y: number }>,
): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;
  if (pts.length === 2) {
    const p0 = pts[0]!;
    const p1 = pts[1]!;
    const midY = roundCentis((p0.y + p1.y) / 2);
    return `M ${p0.x} ${p0.y} C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }

  const d: string[] = [`M ${pts[0]!.x} ${pts[0]!.y}`];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]!;
    const p1 = pts[i]!;
    const p2 = pts[i + 1]!;
    const p3 = pts[Math.min(pts.length - 1, i + 2)]!;

    const cp1x = roundCentis(p1.x + (p2.x - p0.x) / 6);
    const cp1y = roundCentis(p1.y + (p2.y - p0.y) / 6);
    const cp2x = roundCentis(p2.x - (p3.x - p1.x) / 6);
    const cp2y = roundCentis(p2.y - (p3.y - p1.y) / 6);

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(' ');
}

/**
 * Generates a CAD-grade 2D multi-view technical blueprint SVG (`elevation.svg`) containing:
 * 0. Left Equipment Callout Column (with leader lines to each U row so titles never cover ports)
 * 1. Front Elevation (X-Y plane, `Z = 0`, EIA-310 cage-nut holes & mounted rack screws)
 * 2. Rear Elevation (Mirrored X-Y plane, `X_rear = W_panel - X_world`, `Z = D_rail_depth`)
 * 3. Side-Profile Depth Cutaway (Z-Y plane, front door clearance, plug clearance boxes, remaining gap arrows)
 * 4. Right Port & Cable Callout Legend Column
 *
 * Uses a central `PortAnchorRegistry` so every cable path is mathematically guaranteed to start and end
 * at the exact drawn port center `(cx, cy)` or Brush-Panel Grommet Portal (`● -> REAR` / `FRONT -> ●`).
 */
export function generateElevationSvg(
  scene: ComputedRackScene,
  options: ElevationSvgOptions = {},
): string {
  const scale = options.scalePxPerMm ?? 2.8;
  const showCables = options.showCables ?? true;
  const px = (mm: number): number => roundCentis(mm * scale);

  const spec = EIA_310_SPECS[scene.project.rack.standard];
  const panelWidthMm = scene.geometry.panel_width_mm;
  const totalHeightMm = scene.geometry.total_height_mm;
  const railDepthMm = scene.geometry.rail_depth_mm;
  const uCount = scene.project.rack.u_height;

  const frontDoorClearanceMm = scene.project.rack.front_door_clearance_mm;
  const rearClearanceMm = Math.max(scene.project.rack.rear_clearance_mm, 45);
  const sideTotalDepthMm =
    frontDoorClearanceMm + railDepthMm + rearClearanceMm;

  const rackWidthPx = px(panelWidthMm);
  const rackHeightPx = px(totalHeightMm);
  const sideDepthWidthPx = px(sideTotalDepthMm);

  const outerFramePadPx = 14;
  const topMarginPx = 158;
  const bottomMarginPx = 96;

  // Dedicated Left Equipment Callout Column + 3 CAD Views + Right Callout Legend
  const calloutColOriginX = 28;
  const calloutColWidthPx = 256;
  const rulerWidthPx = 44;

  const frontOriginX = roundCentis(
    calloutColOriginX + calloutColWidthPx + 24 + rulerWidthPx,
  );
  const viewGapPx = 98;
  const rearOriginX = roundCentis(
    frontOriginX + rackWidthPx + viewGapPx + rulerWidthPx,
  );
  const sideOriginX = roundCentis(
    rearOriginX + rackWidthPx + viewGapPx + rulerWidthPx,
  );
  const legendOriginX = roundCentis(sideOriginX + sideDepthWidthPx + 66);
  const legendWidthPx = 370;

  // Assign deterministic 1-indexed Callout Numbers to all connected ports
  interface ConnectedPortCallout {
    readonly calloutNumber: number;
    readonly key: string;
    readonly instanceId: string;
    readonly portId: string;
    readonly face: RackFace;
    readonly cableId: string;
    readonly cableType: string;
    readonly peerDesc: string;
    readonly colorHex: string;
  }

  const calloutByEndpointKey = new Map<string, ConnectedPortCallout>();
  const calloutList: ConnectedPortCallout[] = [];
  let nextCalloutNumber = 1;

  for (const cable of scene.project.cables) {
    const fromDev = scene.geometry.devices_by_id.get(cable.from.instance_id);
    const toDev = scene.geometry.devices_by_id.get(cable.to.instance_id);
    const fromParent = fromDev?.parent_carrier_id
      ? scene.geometry.devices_by_id.get(fromDev.parent_carrier_id)
      : undefined;
    const toParent = toDev?.parent_carrier_id
      ? scene.geometry.devices_by_id.get(toDev.parent_carrier_id)
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

    const fromFace: RackFace = cable.from.face ?? port1?.world_face ?? 'front';
    const toFace: RackFace = cable.to.face ?? port2?.world_face ?? 'front';

    const fromKey = `${cable.from.instance_id}:${cable.from.port_id}:${fromFace}`;
    if (!calloutByEndpointKey.has(fromKey)) {
      const entry: ConnectedPortCallout = {
        calloutNumber: nextCalloutNumber++,
        key: fromKey,
        instanceId: cable.from.instance_id,
        portId: cable.from.port_id,
        face: fromFace,
        cableId: cable.cable_id,
        cableType: cable.cable_type,
        peerDesc: `${cable.to.instance_id}:${cable.to.port_id}`,
        colorHex: cable.color_hex,
      };
      calloutByEndpointKey.set(fromKey, entry);
      calloutList.push(entry);
    }

    const toKey = `${cable.to.instance_id}:${cable.to.port_id}:${toFace}`;
    if (!calloutByEndpointKey.has(toKey)) {
      const entry: ConnectedPortCallout = {
        calloutNumber: nextCalloutNumber++,
        key: toKey,
        instanceId: cable.to.instance_id,
        portId: cable.to.port_id,
        face: toFace,
        cableId: cable.cable_id,
        cableType: cable.cable_type,
        peerDesc: `${cable.from.instance_id}:${cable.from.port_id}`,
        colorHex: cable.color_hex,
      };
      calloutByEndpointKey.set(toKey, entry);
      calloutList.push(entry);
    }
  }

  const legendHeightPx = Math.max(
    rackHeightPx,
    56 + calloutList.length * 20 + 24,
  );
  const totalSvgWidth = roundCentis(legendOriginX + legendWidthPx + 36);
  const totalSvgHeight = roundCentis(
    topMarginPx + Math.max(rackHeightPx, legendHeightPx) + bottomMarginPx,
  );

  /**
   * World Y (`Y = 0` at bottom of U1) -> SVG Y (`topMarginPx` at top of UN).
   */
  const worldYToSvgY = (worldYMm: number): number =>
    roundCentis(topMarginPx + (totalHeightMm - worldYMm) * scale);

  /**
   * World Z (`Z = 0` at front rail) -> SVG X in Side-Profile Cutaway.
   */
  const worldZToSideSvgX = (worldZMm: number): number =>
    roundCentis(sideOriginX + (worldZMm + frontDoorClearanceMm) * scale);

  // Track which (uPosition, face) have mounted top-level devices for screw rendering
  const occupiedFrontUs = new Set<number>();
  const occupiedRearUs = new Set<number>();
  for (const dev of scene.geometry.devices) {
    if (dev.mount_target !== 'rack-unit') continue;
    for (let u = dev.u_range[0]; u <= dev.u_range[1]; u++) {
      if (dev.face === 'front') occupiedFrontUs.add(u);
      else occupiedRearUs.add(u);
    }
  }

  // Central PortAnchorRegistry: Maps `${instanceId}:${portId}:${face}` -> Exact Drawn Pixel Center `(x, y)`
  const portAnchorRegistry = new Map<string, PortPixelAnchor>();

  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSvgWidth} ${totalSvgHeight}" width="${totalSvgWidth}" height="${totalSvgHeight}" font-family="'JetBrains Mono', 'Inter', system-ui, -apple-system, sans-serif">`,
  );

  // =========================================================================
  // SVG Defs (Industrial CAD Gradients, 3D-Print Infill, Shadows, Markers)
  // =========================================================================
  lines.push(`  <defs>`);
  lines.push(
    `    <linearGradient id="bg-gradient" x1="0" y1="0" x2="0" y2="1">`,
  );
  lines.push(`      <stop offset="0%" stop-color="#060A12" />`);
  lines.push(`      <stop offset="100%" stop-color="#0B1120" />`);
  lines.push(`    </linearGradient>`);

  lines.push(
    `    <linearGradient id="grad-steel-dark" x1="0" y1="0" x2="0" y2="1">`,
  );
  lines.push(`      <stop offset="0%" stop-color="#27272A" />`);
  lines.push(`      <stop offset="50%" stop-color="#18181B" />`);
  lines.push(`      <stop offset="100%" stop-color="#09090B" />`);
  lines.push(`    </linearGradient>`);

  lines.push(
    `    <linearGradient id="grad-aluminum-silver" x1="0" y1="0" x2="0" y2="1">`,
  );
  lines.push(`      <stop offset="0%" stop-color="#F8FAFC" />`);
  lines.push(`      <stop offset="50%" stop-color="#E2E8F0" />`);
  lines.push(`      <stop offset="100%" stop-color="#CBD5E1" />`);
  lines.push(`    </linearGradient>`);

  lines.push(
    `    <linearGradient id="grad-coated-gray" x1="0" y1="0" x2="0" y2="1">`,
  );
  lines.push(`      <stop offset="0%" stop-color="#475569" />`);
  lines.push(`      <stop offset="100%" stop-color="#1E293B" />`);
  lines.push(`    </linearGradient>`);

  lines.push(
    `    <pattern id="collision-hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">`,
  );
  lines.push(
    `      <rect width="10" height="10" fill="#EF4444" fill-opacity="0.22" />`,
  );
  lines.push(
    `      <line x1="0" y1="0" x2="0" y2="10" stroke="#EF4444" stroke-width="3" />`,
  );
  lines.push(`    </pattern>`);

  lines.push(
    `    <pattern id="carrier-infill" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">`,
  );
  lines.push(
    `      <rect width="8" height="8" fill="#18181B" />`,
  );
  lines.push(
    `      <line x1="0" y1="0" x2="0" y2="8" stroke="#3F3F46" stroke-width="1.5" stroke-opacity="0.65" />`,
  );
  lines.push(
    `      <line x1="0" y1="0" x2="8" y2="0" stroke="#27272A" stroke-width="1.0" stroke-opacity="0.55" />`,
  );
  lines.push(`    </pattern>`);

  lines.push(
    `    <filter id="cable-shadow" x="-15%" y="-15%" width="130%" height="130%">`,
  );
  lines.push(
    `      <feDropShadow dx="0" dy="1.5" stdDeviation="1.4" flood-color="#000000" flood-opacity="0.65" />`,
  );
  lines.push(`    </filter>`);

  lines.push(
    `    <marker id="dim-arrow-end" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">`,
  );
  lines.push(`      <path d="M 0 1 L 7 4 L 0 7 z" fill="#F87171" />`);
  lines.push(`    </marker>`);
  lines.push(
    `    <marker id="dim-arrow-start" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">`,
  );
  lines.push(`      <path d="M 8 1 L 1 4 L 8 7 z" fill="#F87171" />`);
  lines.push(`    </marker>`);
  lines.push(
    `    <marker id="ok-arrow-end" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">`,
  );
  lines.push(`      <path d="M 0 1 L 6 3.5 L 0 6 z" fill="#38BDF8" />`);
  lines.push(`    </marker>`);
  lines.push(
    `    <marker id="ok-arrow-start" markerWidth="7" markerHeight="7" refX="1" refY="3.5" orient="auto">`,
  );
  lines.push(`      <path d="M 7 1 L 1 3.5 L 7 6 z" fill="#38BDF8" />`);
  lines.push(`    </marker>`);
  lines.push(`  </defs>`);

  // Background
  lines.push(
    `  <rect width="${totalSvgWidth}" height="${totalSvgHeight}" fill="url(#bg-gradient)" />`,
  );

  // =========================================================================
  // Industrial CAD Title Block & VLAN / Cable Color Legend
  // =========================================================================
  const statusColor =
    scene.validation.status === 'VALID' ? '#22C55E' : '#EF4444';
  const totalPoeBudgetW = scene.validation.power_summary.pse_budgets.reduce(
    (s, b) => s + b.poe_budget_watts,
    0,
  );

  lines.push(`  <g data-layer="title-block">`);
  lines.push(
    `    <rect x="20" y="16" width="${roundCentis(totalSvgWidth - 40)}" height="88" rx="6" fill="#0F172A" stroke="#334155" stroke-width="1.5" />`,
  );
  lines.push(
    `    <text x="38" y="44" fill="#F8FAFC" font-size="19" font-weight="700" letter-spacing="0.4">${escapeXml(scene.project.project_name)} — CAD ELEVATION, PORT ANCHOR &amp; DEPTH CLEARANCE BLUEPRINT</text>`,
  );
  lines.push(
    `    <text x="38" y="66" fill="#94A3B8" font-size="11.5">Standard: ${scene.project.rack.standard.toUpperCase()} (${panelWidthMm}mm Panel / ${spec.W_aperture}mm Aperture) • Capacity: ${uCount}U (${totalHeightMm}mm) • Rail Depth: ${railDepthMm}mm • Enclosure: ${scene.project.rack.enclosure_type} • Scale: ${scale} px/mm</text>`,
  );

  // Color Legend Bar inside Title Block
  const legendBadges: ReadonlyArray<{ readonly color: string; readonly label: string }> = [
    { color: '#EF4444', label: 'AC Mains (IEC/Schuko)' },
    { color: '#F97316', label: 'USB-C PD 5V' },
    { color: '#F59E0B', label: '20V DC Barrel' },
    { color: '#3B82F6', label: 'Gateway Trunk' },
    { color: '#10B981', label: '2.5GbE Proxmox' },
    { color: '#6366F1', label: '1GbE Mgmt' },
    { color: '#A855F7', label: '2.5G Ceph Cluster' },
    { color: '#EC4899', label: 'WAN Feedthrough' },
    { color: '#06B6D4', label: 'Cross-Face Portal (U6)' },
  ];
  let legX = 38;
  for (const item of legendBadges) {
    lines.push(
      `    <circle cx="${legX + 5}" cy="86" r="4.5" fill="${item.color}" />`,
    );
    lines.push(
      `    <text x="${legX + 14}" y="90" fill="#CBD5E1" font-size="9.5" font-weight="600">${escapeXml(item.label)}</text>`,
    );
    legX += item.label.length * 6.2 + 28;
  }

  // Right-aligned KPI & Validation Status Box in Title Block
  const kpiX = roundCentis(totalSvgWidth - 360);
  lines.push(
    `    <rect x="${kpiX}" y="26" width="324" height="68" rx="5" fill="#090D16" stroke="${statusColor}" stroke-width="1.5" />`,
  );
  lines.push(
    `    <circle cx="${kpiX + 18}" cy="44" r="5.5" fill="${statusColor}" />`,
  );
  lines.push(
    `    <text x="${kpiX + 32}" y="48" fill="${statusColor}" font-size="12.5" font-weight="700">STATUS: ${scene.validation.status} (${scene.validation.error_count} ERR, ${scene.validation.warning_count} WARN)</text>`,
  );
  lines.push(
    `    <text x="${kpiX + 18}" y="67" fill="#E2E8F0" font-size="10.5">Power: ${scene.validation.power_summary.total_system_watts}W • PoE: ${scene.validation.power_summary.total_poe_watts}W / ${totalPoeBudgetW}W</text>`,
  );
  lines.push(
    `    <text x="${kpiX + 18}" y="83" fill="#94A3B8" font-size="10">Mass: ${roundTenths(scene.validation.mechanical_summary.total_weight_grams / 1000)}kg • CoG Y: ${scene.validation.mechanical_summary.center_of_gravity_y_mm}mm • Cables: ${scene.project.cables.length}</text>`,
  );
  lines.push(`  </g>`);

  // =========================================================================
  // Section 0: Left Equipment Callout Column (U8 .. U1 Leader Lines)
  // =========================================================================
  lines.push(`  <g data-view="front-equipment-schedule" data-layer="left-equipment-callouts">`);
  lines.push(
    `    <text x="${roundCentis(calloutColOriginX + calloutColWidthPx / 2)}" y="${topMarginPx - 28}" fill="#E2E8F0" font-size="12.5" font-weight="700" text-anchor="middle">EQUIPMENT SCHEDULE (U1..U${uCount})</text>`,
  );
  lines.push(
    `    <text x="${roundCentis(calloutColOriginX + calloutColWidthPx / 2)}" y="${topMarginPx - 12}" fill="#64748B" font-size="9.5" text-anchor="middle">Hostnames, Models &amp; Sub-Module Slots</text>`,
  );

  for (let u = 1; u <= uCount; u++) {
    const uTopMm = u * MM_PER_U;
    const yTopSvg = worldYToSvgY(uTopMm);
    const yCenterSvg = roundCentis(yTopSvg + px(MM_PER_U) / 2);
    const cardH = roundCentis(px(MM_PER_U) - 4);

    const uDevs = scene.geometry.devices.filter(
      (d) =>
        d.mount_target === 'rack-unit' &&
        u >= d.u_range[0] &&
        u <= d.u_range[1],
    );

    lines.push(
      `    <rect x="${calloutColOriginX}" y="${roundCentis(yTopSvg + 2)}" width="${calloutColWidthPx}" height="${cardH}" rx="4" fill="#0F172A" stroke="#334155" stroke-width="1.1" />`,
    );
    // Leader line from callout card right edge to the U ruler
    lines.push(
      `    <line x1="${calloutColOriginX + calloutColWidthPx}" y1="${yCenterSvg}" x2="${frontOriginX - rulerWidthPx}" y2="${yCenterSvg}" stroke="#475569" stroke-width="1" stroke-dasharray="3,2" />`,
    );
    lines.push(
      `    <circle cx="${calloutColOriginX + calloutColWidthPx}" cy="${yCenterSvg}" r="2.5" fill="#38BDF8" />`,
    );

    if (uDevs.length === 0) {
      lines.push(
        `    <text x="${calloutColOriginX + 10}" y="${roundCentis(yCenterSvg + 3.5)}" fill="#64748B" font-size="9.5">U${u}: [Empty Open Slot]</text>`,
      );
    } else {
      const primary = uDevs[0]!;
      const children = primary.child_instance_ids
        .map((cid) => scene.geometry.devices_by_id.get(cid))
        .filter((c) => c !== undefined);

      const faceTag = primary.face === 'rear' ? 'REAR' : 'FRONT';
      const titleLine = `U${u} [${faceTag}] ${primary.hostname ?? primary.instance_id}`;
      const subLine =
        children.length > 0
          ? `Slots: ${children.map((c) => c.hostname ?? c.instance_id).join(', ')}`
          : `${primary.blueprint.manufacturer} ${primary.blueprint.model} (${primary.blueprint.geometry.depth_mm}mm)`;

      lines.push(
        `    <text x="${calloutColOriginX + 10}" y="${roundCentis(yTopSvg + 18)}" fill="#F8FAFC" font-size="9.8" font-weight="700">${escapeXml(titleLine.slice(0, 36))}</text>`,
      );
      lines.push(
        `    <text x="${calloutColOriginX + 10}" y="${roundCentis(yTopSvg + 32)}" fill="#94A3B8" font-size="8.4">${escapeXml(subLine.slice(0, 42))}</text>`,
      );
    }
  }
  lines.push(`  </g>`);

  // =========================================================================
  // Helper: Draw Rack Enclosure Frame, EIA-310 Rails, Cage-Nut Holes & Screws
  // =========================================================================
  const renderRackBayFrame = (
    originX: number,
    title: string,
    subtitle: string,
    occupiedSet: ReadonlySet<number>,
  ): void => {
    lines.push(`  <g data-bay="${escapeXml(title)}">`);
    lines.push(
      `    <text x="${roundCentis(originX + rackWidthPx / 2)}" y="${topMarginPx - 28}" fill="#E2E8F0" font-size="13.5" font-weight="700" text-anchor="middle">${escapeXml(title)}</text>`,
    );
    lines.push(
      `    <text x="${roundCentis(originX + rackWidthPx / 2)}" y="${topMarginPx - 12}" fill="#64748B" font-size="10.5" text-anchor="middle">${escapeXml(subtitle)}</text>`,
    );

    // Outer Steel Enclosure Frame
    lines.push(
      `    <rect x="${originX - outerFramePadPx}" y="${topMarginPx - outerFramePadPx}" width="${rackWidthPx + outerFramePadPx * 2}" height="${rackHeightPx + outerFramePadPx * 2}" rx="6" fill="#090D16" stroke="#475569" stroke-width="2.2" />`,
    );

    // Alternating U background bands + Left U Ruler
    for (let u = 1; u <= uCount; u++) {
      const uTopMm = u * MM_PER_U;
      const yTopSvg = worldYToSvgY(uTopMm);
      const uHeightPx = px(MM_PER_U);
      const bandFill = u % 2 === 1 ? '#0F172A' : '#162033';

      lines.push(
        `    <rect x="${originX - rulerWidthPx}" y="${yTopSvg}" width="${rulerWidthPx}" height="${uHeightPx}" fill="#0B1120" stroke="#1E293B" stroke-width="1" />`,
      );
      lines.push(
        `    <text x="${originX - rulerWidthPx / 2}" y="${roundCentis(yTopSvg + uHeightPx / 2 + 4)}" fill="#94A3B8" font-size="10.5" font-weight="700" text-anchor="middle">U${u}</text>`,
      );

      lines.push(
        `    <rect x="${originX}" y="${yTopSvg}" width="${rackWidthPx}" height="${uHeightPx}" fill="${bandFill}" stroke="#334155" stroke-width="0.9" stroke-dasharray="4,3" />`,
      );
    }

    // Left and Right EIA-310 Mounting Rail Flanges
    const leftRailWidthPx = px(spec.X_aperture_min);
    const rightRailStartX = roundCentis(
      originX + px(spec.X_aperture_min + spec.W_aperture),
    );
    lines.push(
      `    <rect x="${originX}" y="${topMarginPx}" width="${leftRailWidthPx}" height="${rackHeightPx}" fill="#1E293B" fill-opacity="0.92" stroke="#475569" stroke-width="1.2" />`,
    );
    lines.push(
      `    <rect x="${rightRailStartX}" y="${topMarginPx}" width="${leftRailWidthPx}" height="${rackHeightPx}" fill="#1E293B" fill-opacity="0.92" stroke="#475569" stroke-width="1.2" />`,
    );

    // 3 EIA-310 Square Cage-Nut Holes (+6.35mm, +22.225mm, +38.10mm) per U
    const leftHoleCenterSvgX = roundCentis(originX + leftRailWidthPx / 2);
    const rightHoleCenterSvgX = roundCentis(
      rightRailStartX + leftRailWidthPx / 2,
    );
    const holeSizePx = Math.max(4.8, roundCentis(scale * 2.2));

    for (let u = 1; u <= uCount; u++) {
      const uBottomMm = (u - 1) * MM_PER_U;
      const isOccupied = occupiedSet.has(u);

      for (let hIdx = 0; hIdx < U_HOLE_OFFSETS_MM.length; hIdx++) {
        const holeOffset = U_HOLE_OFFSETS_MM[hIdx]!;
        const holeCenterY = worldYToSvgY(uBottomMm + holeOffset);
        const holeTopY = roundCentis(holeCenterY - holeSizePx / 2);

        for (const cx of [leftHoleCenterSvgX, rightHoleCenterSvgX]) {
          lines.push(
            `    <rect x="${roundCentis(cx - holeSizePx / 2)}" y="${holeTopY}" width="${holeSizePx}" height="${holeSizePx}" rx="0.8" fill="#060911" stroke="#64748B" stroke-width="0.9" />`,
          );
          if (isOccupied && (hIdx === 0 || hIdx === 2)) {
            lines.push(
              `    <circle cx="${cx}" cy="${holeCenterY}" r="${roundCentis(holeSizePx * 0.56)}" fill="#94A3B8" stroke="#0F172A" stroke-width="0.9" />`,
            );
            lines.push(
              `    <line x1="${roundCentis(cx - 2)}" y1="${holeCenterY}" x2="${roundCentis(cx + 2)}" y2="${holeCenterY}" stroke="#0F172A" stroke-width="0.9" />`,
            );
            lines.push(
              `    <line x1="${cx}" y1="${roundCentis(holeCenterY - 2)}" x2="${cx}" y2="${roundCentis(holeCenterY + 2)}" stroke="#0F172A" stroke-width="0.9" />`,
            );
          }
        }
      }
    }

    lines.push(`  </g>`);
  };

  renderRackBayFrame(
    frontOriginX,
    'FRONT ELEVATION (Z = 0 mm)',
    'X: Left (0) -> Right (W_panel) | Y: U1 -> U8',
    occupiedFrontUs,
  );
  renderRackBayFrame(
    rearOriginX,
    `REAR ELEVATION (Z = ${railDepthMm} mm, MIRRORED X)`,
    'X_rear = W_panel - X_world (Looking at Rack Rear)',
    occupiedRearUs,
  );

  // =========================================================================
  // Side-Profile Depth Cutaway Frame
  // =========================================================================
  lines.push(`  <g data-bay="SIDE-PROFILE DEPTH CUTAWAY">`);
  lines.push(
    `    <text x="${roundCentis(sideOriginX + sideDepthWidthPx / 2)}" y="${topMarginPx - 28}" fill="#E2E8F0" font-size="13.5" font-weight="700" text-anchor="middle">SIDE-PROFILE DEPTH CUTAWAY (Z-Y PLANE)</text>`,
  );
  lines.push(
    `    <text x="${roundCentis(sideOriginX + sideDepthWidthPx / 2)}" y="${topMarginPx - 12}" fill="#64748B" font-size="10.5" text-anchor="middle">Front Door (-${frontDoorClearanceMm}mm) • Front Rail (0mm) • Rear Rail (${railDepthMm}mm)</text>`,
  );

  lines.push(
    `    <rect x="${sideOriginX - outerFramePadPx}" y="${topMarginPx - outerFramePadPx}" width="${sideDepthWidthPx + outerFramePadPx * 2}" height="${rackHeightPx + outerFramePadPx * 2}" rx="6" fill="#090D16" stroke="#475569" stroke-width="2.2" />`,
  );

  for (let u = 1; u <= uCount; u++) {
    const uTopMm = u * MM_PER_U;
    const yTopSvg = worldYToSvgY(uTopMm);
    const uHeightPx = px(MM_PER_U);
    const bandFill = u % 2 === 1 ? '#0F172A' : '#162033';

    lines.push(
      `    <rect x="${sideOriginX - rulerWidthPx}" y="${yTopSvg}" width="${rulerWidthPx}" height="${uHeightPx}" fill="#0B1120" stroke="#1E293B" stroke-width="1" />`,
    );
    lines.push(
      `    <text x="${sideOriginX - rulerWidthPx / 2}" y="${roundCentis(yTopSvg + uHeightPx / 2 + 4)}" fill="#94A3B8" font-size="10.5" font-weight="700" text-anchor="middle">U${u}</text>`,
    );
    lines.push(
      `    <rect x="${sideOriginX}" y="${yTopSvg}" width="${sideDepthWidthPx}" height="${uHeightPx}" fill="${bandFill}" stroke="#334155" stroke-width="0.9" stroke-dasharray="4,3" />`,
    );
  }
  lines.push(`  </g>`);

  // =========================================================================
  // CAD Port Vector Silhouette Renderer + PortAnchorRegistry Registration
  // =========================================================================
  const renderPortIcon = (
    port: ComputedPortGeometry,
    cxSvg: number,
    cySvg: number,
    viewFace: RackFace,
    uPos: number,
  ): void => {
    const endpointKey = `${port.instance_id}:${port.port_id}:${viewFace}`;

    // Register exact drawn pixel center in PortAnchorRegistry!
    portAnchorRegistry.set(endpointKey, {
      key: endpointKey,
      instanceId: port.instance_id,
      portId: port.port_id,
      face: viewFace,
      x: cxSvg,
      y: cySvg,
      uPosition: uPos,
    });

    const callout = calloutByEndpointKey.get(endpointKey);
    const isOccupied = callout !== undefined;
    const hasPoe = port.capabilities.some((c) => c.startsWith('poe'));

    lines.push(
      `    <g data-port-id="${escapeXml(port.port_id)}" data-port-instance="${escapeXml(port.instance_id)}" data-port-face="${viewFace}" data-anchor-x="${cxSvg}" data-anchor-y="${cySvg}" data-connector="${port.connector_type}" data-connector-type="${port.connector_type}" transform="translate(${cxSvg}, ${cySvg})">`,
    );

    switch (port.connector_type) {
      case 'rj45':
      case 'rj45-serial-console': {
        const w = px(11.8);
        const h = px(9.6);
        const hw = roundCentis(w / 2);
        const hh = roundCentis(h / 2);
        const latchW = px(5.0);
        const latchH = px(2.2);
        const frameColor =
          port.connector_type === 'rj45-serial-console'
            ? '#38BDF8'
            : hasPoe
              ? '#F59E0B'
              : '#94A3B8';

        lines.push(
          `      <rect x="${-hw}" y="${-hh}" width="${w}" height="${h}" rx="1.2" fill="#090D16" stroke="${frameColor}" stroke-width="1.2" />`,
        );
        lines.push(
          `      <rect x="${roundCentis(-latchW / 2)}" y="${roundCentis(-hh - latchH * 0.5)}" width="${latchW}" height="${latchH}" fill="#090D16" stroke="${frameColor}" stroke-width="1" />`,
        );
        for (let pin = 0; pin < 8; pin++) {
          const pxOffset = roundCentis(-hw * 0.68 + (pin / 7) * (w * 0.68));
          lines.push(
            `      <line x1="${pxOffset}" y1="${roundCentis(-hh * 0.35)}" x2="${pxOffset}" y2="${roundCentis(hh * 0.25)}" stroke="#FBBF24" stroke-width="0.8" />`,
          );
        }
        const ledLeftColor = isOccupied ? '#22C55E' : '#334155';
        const ledRightColor = isOccupied
          ? hasPoe
            ? '#F59E0B'
            : '#22C55E'
          : '#334155';
        lines.push(
          `      <circle cx="${roundCentis(-hw + 2.2)}" cy="${roundCentis(-hh + 2.0)}" r="1.4" fill="${ledLeftColor}" />`,
        );
        lines.push(
          `      <circle cx="${roundCentis(hw - 2.2)}" cy="${roundCentis(-hh + 2.0)}" r="1.4" fill="${ledRightColor}" />`,
        );
        break;
      }

      case 'sfp-plus': {
        const w = px(13.5);
        const h = px(8.8);
        const hw = roundCentis(w / 2);
        const hh = roundCentis(h / 2);
        lines.push(
          `      <rect x="${-hw}" y="${-hh}" width="${w}" height="${h}" rx="1" fill="#090D16" stroke="#38BDF8" stroke-width="1.3" />`,
        );
        lines.push(
          `      <rect x="${roundCentis(-hw + 2)}" y="${roundCentis(-hh + 2)}" width="${roundCentis(w - 4)}" height="${roundCentis(h - 4)}" fill="#0F172A" stroke="#0284C7" stroke-width="0.9" />`,
        );
        lines.push(
          `      <path d="M ${roundCentis(-hw * 0.5)} ${roundCentis(hh)} L 0 ${roundCentis(hh + 3)} L ${roundCentis(hw * 0.5)} ${roundCentis(hh)}" fill="none" stroke="#38BDF8" stroke-width="1" />`,
        );
        break;
      }

      case 'iec-c13':
      case 'iec-c14': {
        const w = px(18.0);
        const h = px(11.6);
        const hw = roundCentis(w / 2);
        const hh = roundCentis(h / 2);
        const bevel = px(3.4);
        const poly = `${-hw + bevel},${-hh} ${hw - bevel},${-hh} ${hw},${-hh + bevel} ${hw},${hh} ${-hw},${hh} ${-hw},${-hh + bevel}`;
        const strokeCol =
          port.connector_type === 'iec-c14' ? '#EF4444' : '#F97316';
        lines.push(
          `      <polygon points="${poly}" fill="#090D16" stroke="${strokeCol}" stroke-width="1.3" />`,
        );
        const pinW = px(1.8);
        const pinH = px(4.0);
        lines.push(
          `      <rect x="${roundCentis(-hw * 0.55 - pinW / 2)}" y="${roundCentis(-pinH * 0.3)}" width="${pinW}" height="${pinH}" fill="#CBD5E1" />`,
        );
        lines.push(
          `      <rect x="${roundCentis(-pinW / 2)}" y="${roundCentis(-hh * 0.55)}" width="${pinW}" height="${pinH}" fill="#FBBF24" />`,
        );
        lines.push(
          `      <rect x="${roundCentis(hw * 0.55 - pinW / 2)}" y="${roundCentis(-pinH * 0.3)}" width="${pinW}" height="${pinH}" fill="#CBD5E1" />`,
        );
        break;
      }

      case 'schuko-cee7': {
        const r = px(10.8);
        lines.push(
          `      <circle cx="0" cy="0" r="${r}" fill="#090D16" stroke="#EF4444" stroke-width="1.4" />`,
        );
        lines.push(
          `      <circle cx="0" cy="0" r="${roundCentis(r * 0.76)}" fill="none" stroke="#475569" stroke-width="0.9" stroke-dasharray="2,2" />`,
        );
        lines.push(
          `      <circle cx="${roundCentis(-r * 0.38)}" cy="0" r="2.1" fill="#94A3B8" />`,
        );
        lines.push(
          `      <circle cx="${roundCentis(r * 0.38)}" cy="0" r="2.1" fill="#94A3B8" />`,
        );
        lines.push(
          `      <rect x="-1.5" y="${roundCentis(-r + 1)}" width="3" height="3.2" fill="#FBBF24" />`,
        );
        lines.push(
          `      <rect x="-1.5" y="${roundCentis(r - 4.2)}" width="3" height="3.2" fill="#FBBF24" />`,
        );
        break;
      }

      case 'dc-5525': {
        const r = px(3.8);
        lines.push(
          `      <circle cx="0" cy="0" r="${r}" fill="#090D16" stroke="#FACC15" stroke-width="1.2" />`,
        );
        lines.push(`      <circle cx="0" cy="0" r="1.6" fill="#FACC15" />`);
        break;
      }

      case 'usb-c': {
        const w = px(8.4);
        const h = px(3.2);
        lines.push(
          `      <rect x="${roundCentis(-w / 2)}" y="${roundCentis(-h / 2)}" width="${w}" height="${h}" rx="${roundCentis(h / 2)}" fill="#090D16" stroke="#38BDF8" stroke-width="1.1" />`,
        );
        break;
      }

      case 'usb-a': {
        const w = px(11.0);
        const h = px(4.8);
        lines.push(
          `      <rect x="${roundCentis(-w / 2)}" y="${roundCentis(-h / 2)}" width="${w}" height="${h}" rx="0.8" fill="#090D16" stroke="#60A5FA" stroke-width="1.1" />`,
        );
        lines.push(
          `      <rect x="${roundCentis(-w * 0.38)}" y="${roundCentis(-h * 0.15)}" width="${roundCentis(w * 0.76)}" height="${roundCentis(h * 0.35)}" fill="#2563EB" />`,
        );
        break;
      }

      case 'audio-35mm': {
        const r = px(2.8);
        lines.push(
          `      <circle cx="0" cy="0" r="${r}" fill="#090D16" stroke="#A3E635" stroke-width="1.1" />`,
        );
        break;
      }
    }

    // Crisp micro-number below the socket
    const shortPortTag = port.port_id.replace(
      /^(eth|lan|outlet|iec_out|p)/i,
      '',
    );
    const microLabel =
      shortPortTag.length > 0 && shortPortTag.length <= 4
        ? shortPortTag
        : port.port_id.slice(0, 4);
    lines.push(
      `      <text x="0" y="${px(7.4)}" fill="#CBD5E1" font-size="6.8" font-weight="600" text-anchor="middle">${escapeXml(microLabel)}</text>`,
    );
    lines.push(
      `      <title>${escapeXml(`${port.instance_id}.${port.port_id} (${port.label} — ${port.connector_type})`)}</title>`,
    );
    lines.push(`    </g>`);
  };

  const renderRackEars = (
    viewOriginX: number,
    yTopSvg: number,
    hSvg: number,
    earColorHex: string,
  ): void => {
    const earW = px(spec.X_aperture_min);
    const rightEarX = roundCentis(
      viewOriginX + px(spec.X_aperture_min + spec.W_aperture),
    );
    lines.push(
      `      <rect x="${viewOriginX}" y="${yTopSvg}" width="${earW}" height="${hSvg}" rx="1.5" fill="${earColorHex}" stroke="#475569" stroke-width="1.2" />`,
    );
    lines.push(
      `      <rect x="${rightEarX}" y="${yTopSvg}" width="${earW}" height="${hSvg}" rx="1.5" fill="${earColorHex}" stroke="#475569" stroke-width="1.2" />`,
    );
  };

  const selectChassisFill = (
    materialPreset: string,
    fallbackHex: string,
  ): string => {
    if (fallbackHex.toUpperCase() === '#E5E7EB' || fallbackHex.toUpperCase() === '#F3F4F6' || fallbackHex.toUpperCase() === '#D1D5DB') {
      return 'url(#grad-aluminum-silver)';
    }
    if (materialPreset === 'matte-black-steel') {
      return 'url(#grad-steel-dark)';
    }
    if (materialPreset === 'coated-aluminum') {
      return 'url(#grad-coated-gray)';
    }
    return fallbackHex;
  };

  // =========================================================================
  // 1. Render Devices & Ports on FRONT ELEVATION
  // =========================================================================
  lines.push(`  <g data-view="front-elevation" data-layer="front-devices">`);
  const topLevelFrontDevices = scene.geometry.devices.filter(
    (d) => d.mount_target === 'rack-unit' && d.face === 'front',
  );
  for (const dev of topLevelFrontDevices) {
    const xSvg = roundCentis(frontOriginX + px(dev.chassis_box.min.x));
    const ySvg = worldYToSvgY(dev.chassis_box.max.y);
    const wSvg = px(dev.chassis_box.max.x - dev.chassis_box.min.x);
    const hSvg = px(dev.chassis_box.max.y - dev.chassis_box.min.y);
    const bgHex = dev.blueprint.visuals.chassis_color_hex;
    const fillPaint = selectChassisFill(
      dev.blueprint.visuals.material_preset,
      bgHex,
    );
    const textHex = getContrastingTextColor(bgHex);

    lines.push(
      `    <g data-instance-id="${escapeXml(dev.instance_id)}" data-blueprint="${escapeXml(dev.blueprint_slug)}">`,
    );

    if (dev.blueprint.geometry.ear_mount_style !== 'none') {
      renderRackEars(frontOriginX, ySvg, hSvg, bgHex);
    }

    lines.push(
      `      <rect x="${xSvg}" y="${ySvg}" width="${wSvg}" height="${hSvg}" rx="2.5" fill="${fillPaint}" stroke="#475569" stroke-width="1.6" />`,
    );
    if (dev.blueprint.category === 'modular-carrier') {
      lines.push(
        `      <rect x="${roundCentis(xSvg + 2)}" y="${roundCentis(ySvg + 2)}" width="${roundCentis(wSvg - 4)}" height="${roundCentis(hSvg - 4)}" rx="2" fill="url(#carrier-infill)" stroke="#52525B" stroke-width="0.9" />`,
      );
    } else if (dev.blueprint.category === 'brush-panel') {
      const brushX = roundCentis(xSvg + px(10));
      const brushW = roundCentis(wSvg - px(20));
      const brushY = roundCentis(ySvg + px(8));
      const brushH = roundCentis(hSvg - px(16));
      lines.push(
        `      <rect x="${brushX}" y="${brushY}" width="${brushW}" height="${brushH}" rx="2" fill="#050811" stroke="#374151" stroke-width="1.2" />`,
      );
      for (let bx = brushX + 4; bx < brushX + brushW - 2; bx += 4) {
        lines.push(
          `      <line x1="${roundCentis(bx)}" y1="${brushY}" x2="${roundCentis(bx)}" y2="${roundCentis(brushY + brushH)}" stroke="#1E293B" stroke-width="1.2" />`,
        );
      }
    } else {
      lines.push(
        `      <rect x="${roundCentis(xSvg + 2.5)}" y="${roundCentis(ySvg + 2.5)}" width="${roundCentis(wSvg - 5)}" height="${roundCentis(hSvg - 5)}" rx="1.5" fill="none" stroke="#94A3B8" stroke-opacity="0.28" stroke-width="1" />`,
      );
    }

    if (dev.blueprint.visuals.has_oled_display) {
      const oledX = roundCentis(xSvg + px(8));
      const oledY = roundCentis(ySvg + px(6));
      const oledW = px(18);
      const oledH = px(11);
      lines.push(
        `      <rect x="${oledX}" y="${oledY}" width="${oledW}" height="${oledH}" rx="2" fill="#082F49" stroke="#38BDF8" stroke-width="1.2" />`,
      );
      lines.push(
        `      <line x1="${roundCentis(oledX + 4)}" y1="${roundCentis(oledY + oledH * 0.4)}" x2="${roundCentis(oledX + oledW - 4)}" y2="${roundCentis(oledY + oledH * 0.4)}" stroke="#38BDF8" stroke-width="1.4" />`,
      );
      lines.push(
        `      <line x1="${roundCentis(oledX + 4)}" y1="${roundCentis(oledY + oledH * 0.72)}" x2="${roundCentis(oledX + oledW * 0.65)}" y2="${roundCentis(oledY + oledH * 0.72)}" stroke="#7DD3FC" stroke-width="1.1" />`,
      );
    }

    // Carrier Slots
    for (const slot of dev.slots) {
      const sx = roundCentis(frontOriginX + px(slot.world_bounds.min.x));
      const sy = worldYToSvgY(slot.world_bounds.max.y);
      const sw = px(slot.world_bounds.max.x - slot.world_bounds.min.x);
      const sh = px(slot.world_bounds.max.y - slot.world_bounds.min.y);
      lines.push(
        `      <rect x="${sx}" y="${sy}" width="${sw}" height="${sh}" rx="2" fill="#090D16" fill-opacity="0.65" stroke="#64748B" stroke-width="1.1" stroke-dasharray="3,2" />`,
      );
    }

    // Top bezel micro-label (strictly in top 10px bezel strip)
    if (dev.blueprint.category !== 'modular-carrier') {
      const badgeX = roundCentis(
        xSvg + (dev.blueprint.visuals.has_oled_display ? px(30) : px(8)),
      );
      const badgeY = roundCentis(ySvg + 2);
      const labelText = `${dev.hostname ?? dev.blueprint.model} [${dev.instance_id}]`;
      lines.push(
        `      <text x="${badgeX}" y="${roundCentis(badgeY + 8.5)}" fill="${textHex}" font-size="8.2" font-weight="700">${escapeXml(labelText)}</text>`,
      );
    }

    // Front Ports of Parent Device
    for (const port of dev.ports) {
      if (port.world_face === 'front') {
        renderPortIcon(
          port,
          roundCentis(frontOriginX + px(port.world_position.x)),
          worldYToSvgY(port.world_position.y),
          'front',
          dev.u_position,
        );
      }
    }

    // Child Sub-Modules mounted inside this Carrier
    for (const childId of dev.child_instance_ids) {
      const child = scene.geometry.devices_by_id.get(childId);
      if (!child) continue;
      const cx = roundCentis(frontOriginX + px(child.chassis_box.min.x));
      const cy = worldYToSvgY(child.chassis_box.max.y);
      const cw = px(child.chassis_box.max.x - child.chassis_box.min.x);
      const ch = px(child.chassis_box.max.y - child.chassis_box.min.y);
      const cBg = child.blueprint.visuals.chassis_color_hex;
      const cFill = selectChassisFill(
        child.blueprint.visuals.material_preset,
        cBg,
      );
      const cText = getContrastingTextColor(cBg);

      lines.push(
        `      <g data-instance-id="${escapeXml(child.instance_id)}" data-parent-carrier="${escapeXml(dev.instance_id)}" data-slot-id="${escapeXml(child.slot_id ?? '')}">`,
      );
      lines.push(
        `        <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="2" fill="${cFill}" stroke="#38BDF8" stroke-width="1.3" />`,
      );

      if (child.blueprint.visuals.has_oled_display) {
        lines.push(
          `        <rect x="${roundCentis(cx + px(6))}" y="${roundCentis(cy + px(6))}" width="${px(14)}" height="${px(9)}" rx="1.5" fill="#082F49" stroke="#38BDF8" stroke-width="1" />`,
        );
      }

      if (cw > px(35)) {
        const labelOffsetX = child.blueprint.visuals.has_oled_display
          ? px(24)
          : px(5);
        lines.push(
          `        <text x="${roundCentis(cx + labelOffsetX)}" y="${roundCentis(cy + 10)}" fill="${cText}" font-size="8" font-weight="700">${escapeXml(child.hostname ?? child.instance_id)}</text>`,
        );
      }
      for (const port of child.ports) {
        if (port.world_face === 'front') {
          renderPortIcon(
            port,
            roundCentis(frontOriginX + px(port.world_position.x)),
            worldYToSvgY(port.world_position.y),
            'front',
            dev.u_position,
          );
        }
      }
      lines.push(`      </g>`);
    }

    lines.push(`    </g>`);
  }
  lines.push(`  </g>`);

  // =========================================================================
  // 2. Render Devices & Ports on REAR ELEVATION (Mirrored X)
  // =========================================================================
  const worldXToRearSvgX = (worldXMm: number): number =>
    roundCentis(rearOriginX + px(panelWidthMm - worldXMm));

  lines.push(`  <g data-view="rear-elevation" data-layer="rear-devices">`);
  for (const dev of scene.geometry.devices) {
    const isRearMounted = dev.face === 'rear';
    const hasRearPorts = dev.ports.some(
      (p) => p.world_face === 'rear' || p.is_passthrough_coupler,
    );
    const isBrushPanel = dev.blueprint.category === 'brush-panel';
    const isDeepEnoughToSee = dev.chassis_box.max.z >= railDepthMm * 0.35;

    if (!isRearMounted && !hasRearPorts && !isBrushPanel && !isDeepEnoughToSee) {
      continue;
    }

    const xSvg = worldXToRearSvgX(dev.chassis_box.max.x);
    const ySvg = worldYToSvgY(dev.chassis_box.max.y);
    const wSvg = px(dev.chassis_box.max.x - dev.chassis_box.min.x);
    const hSvg = px(dev.chassis_box.max.y - dev.chassis_box.min.y);
    const bgHex = dev.blueprint.visuals.chassis_color_hex;
    const fillPaint = selectChassisFill(
      dev.blueprint.visuals.material_preset,
      bgHex,
    );
    const textHex = getContrastingTextColor(bgHex);
    const opacity = isRearMounted ? '1.0' : '0.88';

    lines.push(
      `    <g data-instance-id="${escapeXml(dev.instance_id)}" data-rear-view-role="${isRearMounted ? 'rear-mounted' : 'front-device-rear-face'}">`,
    );
    if (isRearMounted && dev.blueprint.geometry.ear_mount_style !== 'none') {
      renderRackEars(rearOriginX, ySvg, hSvg, bgHex);
    }
    lines.push(
      `      <rect x="${xSvg}" y="${ySvg}" width="${wSvg}" height="${hSvg}" rx="2" fill="${fillPaint}" fill-opacity="${opacity}" stroke="${isRearMounted ? '#F59E0B' : '#475569'}" stroke-width="${isRearMounted ? '1.6' : '1.1'}" />`,
    );

    if (isBrushPanel) {
      const brushX = roundCentis(xSvg + px(10));
      const brushW = roundCentis(wSvg - px(20));
      const brushY = roundCentis(ySvg + px(8));
      const brushH = roundCentis(hSvg - px(16));
      lines.push(
        `      <rect x="${brushX}" y="${brushY}" width="${brushW}" height="${brushH}" rx="2" fill="#050811" stroke="#374151" stroke-width="1.2" />`,
      );
      for (let bx = brushX + 4; bx < brushX + brushW - 2; bx += 4) {
        lines.push(
          `      <line x1="${roundCentis(bx)}" y1="${brushY}" x2="${roundCentis(bx)}" y2="${roundCentis(brushY + brushH)}" stroke="#1E293B" stroke-width="1.2" />`,
        );
      }
    }

    if (wSvg > px(40) && dev.blueprint.category !== 'modular-carrier') {
      lines.push(
        `      <text x="${roundCentis(xSvg + 6)}" y="${roundCentis(ySvg + 9.5)}" fill="${textHex}" font-size="8" font-weight="700">${escapeXml(dev.hostname ?? dev.instance_id)} (${isRearMounted ? 'REAR MOUNT' : 'REAR FACE'})</text>`,
      );
    }

    for (const port of dev.ports) {
      if (port.world_face === 'rear' || port.is_passthrough_coupler) {
        renderPortIcon(
          port,
          worldXToRearSvgX(port.world_position.x),
          worldYToSvgY(port.world_position.y),
          'rear',
          dev.u_position,
        );
      }
    }
    lines.push(`    </g>`);
  }
  lines.push(`  </g>`);

  // =========================================================================
  // 3. Render SIDE-PROFILE DEPTH CUTAWAY (Z horizontal, Y vertical)
  // =========================================================================
  lines.push(`  <g data-view="side-cutaway" data-layer="side-cutaway-details">`);
  const frontRailSvgX = worldZToSideSvgX(0);
  const rearRailSvgX = worldZToSideSvgX(railDepthMm);

  // Z-Axis Vertical Grid Lines & Bottom Millimeter Ruler
  const zTicksMm = [-50, 0, 50, 100, 150, 200, railDepthMm, railDepthMm + 50];
  const uniqueZTicks = [...new Set(zTicksMm)].filter(
    (z) => z >= -frontDoorClearanceMm && z <= railDepthMm + rearClearanceMm,
  );
  for (const zVal of uniqueZTicks) {
    const gx = worldZToSideSvgX(zVal);
    lines.push(
      `    <line x1="${gx}" y1="${topMarginPx}" x2="${gx}" y2="${topMarginPx + rackHeightPx}" stroke="#1E293B" stroke-width="0.9" stroke-dasharray="2,4" />`,
    );
    lines.push(
      `    <line x1="${gx}" y1="${topMarginPx + rackHeightPx}" x2="${gx}" y2="${topMarginPx + rackHeightPx + 6}" stroke="#64748B" stroke-width="1.2" />`,
    );
    lines.push(
      `    <text x="${gx}" y="${topMarginPx + rackHeightPx + 17}" fill="#64748B" font-size="8" font-weight="600" text-anchor="middle">${zVal}mm</text>`,
    );
  }

  // Smoked-Glass Front Door Bar (4mm cross-section)
  if (scene.project.rack.enclosure_type !== 'open-frame') {
    const doorPlaneZ = -frontDoorClearanceMm;
    const doorSvgX = worldZToSideSvgX(doorPlaneZ);
    lines.push(
      `    <rect x="${roundCentis(doorSvgX - 2)}" y="${topMarginPx}" width="4" height="${rackHeightPx}" rx="1.5" fill="#0EA5E9" fill-opacity="0.28" stroke="#38BDF8" stroke-width="1.4" />`,
    );
    lines.push(
      `    <rect x="${roundCentis(doorSvgX + 5)}" y="${topMarginPx + 4}" width="128" height="15" rx="3" fill="#090D16" stroke="#38BDF8" stroke-width="0.9" />`,
    );
    lines.push(
      `    <text x="${roundCentis(doorSvgX + 69)}" y="${topMarginPx + 14.5}" fill="#38BDF8" font-size="8.2" font-weight="700" text-anchor="middle">GLASS DOOR (-${frontDoorClearanceMm}mm)</text>`,
    );
  }

  // Structural Front & Rear EIA-310 Rail Flanges in Cross-Section
  const railFlangeWidthPx = Math.max(4, px(3.5));
  lines.push(
    `    <rect x="${frontRailSvgX}" y="${topMarginPx}" width="${railFlangeWidthPx}" height="${rackHeightPx}" fill="#334155" stroke="#94A3B8" stroke-width="1.2" />`,
  );
  lines.push(
    `    <text x="${frontRailSvgX + 2}" y="${topMarginPx + rackHeightPx + 31}" fill="#CBD5E1" font-size="9" font-weight="700">Z=0mm (Front Rail)</text>`,
  );

  lines.push(
    `    <rect x="${roundCentis(rearRailSvgX - railFlangeWidthPx)}" y="${topMarginPx}" width="${railFlangeWidthPx}" height="${rackHeightPx}" fill="#334155" stroke="#94A3B8" stroke-width="1.2" />`,
  );
  lines.push(
    `    <text x="${rearRailSvgX - 2}" y="${topMarginPx + rackHeightPx + 31}" fill="#CBD5E1" font-size="9" font-weight="700" text-anchor="end">Z=${railDepthMm}mm (Rear Rail)</text>`,
  );

  // Render Devices in Side Cutaway (handling Carrier + Sub-Module L-Tray hierarchy without overlap)
  for (const dev of scene.geometry.devices) {
    if (dev.blueprint.category === 'keystone-module') continue;

    const zStartSvg = worldZToSideSvgX(dev.chassis_box.min.z);
    const zWidthSvg = Math.max(
      5,
      px(dev.chassis_box.max.z - dev.chassis_box.min.z),
    );
    const yTopSvg = worldYToSvgY(dev.chassis_box.max.y);
    const hSvg = px(dev.chassis_box.max.y - dev.chassis_box.min.y);
    const bgHex = dev.blueprint.visuals.chassis_color_hex;
    const fillPaint = selectChassisFill(
      dev.blueprint.visuals.material_preset,
      bgHex,
    );
    const textHex = getContrastingTextColor(bgHex);
    const isSubModule = dev.mount_target === 'carrier-slot';
    const isCarrier = dev.blueprint.category === 'modular-carrier';
    const isBrush = dev.blueprint.category === 'brush-panel';
    const hasMajorChild =
      isCarrier &&
      dev.child_instance_ids.some((cid) => {
        const c = scene.geometry.devices_by_id.get(cid);
        return c !== undefined && c.blueprint.category !== 'keystone-module';
      });

    lines.push(`    <g data-side-instance-id="${escapeXml(dev.instance_id)}">`);

    if (isCarrier && hasMajorChild) {
      // Draw 3D-Printed Carrier as a realistic L-Shaped Support Tray (Front Flange + Bottom 4.5mm Shelf)
      const trayFloorH = Math.max(5, px(4.5));
      const flangeW = Math.max(6, px(6));
      lines.push(
        `      <rect x="${zStartSvg}" y="${yTopSvg}" width="${flangeW}" height="${hSvg}" rx="1.5" fill="url(#carrier-infill)" stroke="#52525B" stroke-width="1.1" />`,
      );
      lines.push(
        `      <rect x="${zStartSvg}" y="${roundCentis(yTopSvg + hSvg - trayFloorH)}" width="${zWidthSvg}" height="${trayFloorH}" rx="1.5" fill="url(#carrier-infill)" stroke="#52525B" stroke-width="1.1" />`,
      );
    } else if (isBrush) {
      // Draw Brush Panel Cross-Section with bristle pass-through slot
      lines.push(
        `      <rect x="${zStartSvg}" y="${yTopSvg}" width="${zWidthSvg}" height="${hSvg}" rx="2" fill="${fillPaint}" stroke="#475569" stroke-width="1.3" />`,
      );
      lines.push(
        `      <rect x="${roundCentis(zStartSvg + 2)}" y="${roundCentis(yTopSvg + 8)}" width="${Math.max(4, zWidthSvg - 4)}" height="${Math.max(8, hSvg - 16)}" rx="1" fill="#050811" stroke="#38BDF8" stroke-width="0.9" stroke-dasharray="2,2" />`,
      );
      lines.push(
        `      <text x="${roundCentis(zStartSvg + zWidthSvg + 8)}" y="${roundCentis(yTopSvg + 14)}" fill="#94A3B8" font-size="8" font-weight="700">${escapeXml(dev.hostname ?? dev.instance_id)} (Brush Portal)</text>`,
      );
    } else {
      // Regular Rackmount Device or Child Sub-Module sitting on Carrier Tray
      const insetTop = isSubModule ? 3 : 1;
      const insetBottom = isSubModule ? Math.max(6, px(5)) : 1;
      const boxY = roundCentis(yTopSvg + insetTop);
      const boxH = Math.max(12, roundCentis(hSvg - insetTop - insetBottom));
      const strokeColor = isSubModule
        ? '#38BDF8'
        : dev.face === 'rear'
          ? '#F59E0B'
          : '#64748B';

      lines.push(
        `      <rect x="${zStartSvg}" y="${boxY}" width="${zWidthSvg}" height="${boxH}" rx="2.5" fill="${fillPaint}" fill-opacity="${isSubModule ? '0.96' : '0.90'}" stroke="${strokeColor}" stroke-width="1.4" />`,
      );

      // Subtle inner technical bevel
      if (zWidthSvg > 24 && boxH > 18) {
        lines.push(
          `      <rect x="${roundCentis(zStartSvg + 2.5)}" y="${roundCentis(boxY + 2.5)}" width="${roundCentis(zWidthSvg - 5)}" height="${roundCentis(boxH - 5)}" rx="1.5" fill="none" stroke="#94A3B8" stroke-opacity="0.22" stroke-width="0.9" />`,
        );
      }

      const depthMm = roundTenths(dev.chassis_box.max.z - dev.chassis_box.min.z);
      if (zWidthSvg > 65) {
        const labelText = `${dev.hostname ?? dev.instance_id} (${depthMm}mm)`;
        const subCaption = isSubModule
          ? `Slot in ${dev.parent_carrier_id} • Z: ${roundTenths(dev.chassis_box.min.z)}..${roundTenths(dev.chassis_box.max.z)}mm`
          : `${dev.blueprint.manufacturer} ${dev.blueprint.model} • Z: ${roundTenths(dev.chassis_box.min.z)}..${roundTenths(dev.chassis_box.max.z)}mm`;
        // Contrasting pill backing inside device box so text is 100% crisp
        const pillW = Math.min(zWidthSvg - 12, 215);
        lines.push(
          `      <rect x="${roundCentis(zStartSvg + 6)}" y="${roundCentis(boxY + 5)}" width="${pillW}" height="${boxH > 32 ? 26 : 16}" rx="3" fill="#090D16" fill-opacity="0.78" stroke="${strokeColor}" stroke-opacity="0.45" stroke-width="0.8" />`,
        );
        lines.push(
          `      <text x="${roundCentis(zStartSvg + 12)}" y="${roundCentis(boxY + 16)}" fill="#F8FAFC" font-size="8.5" font-weight="700">${escapeXml(labelText.slice(0, 32))}</text>`,
        );
        if (boxH > 32) {
          lines.push(
            `      <text x="${roundCentis(zStartSvg + 12)}" y="${roundCentis(boxY + 27)}" fill="#94A3B8" font-size="7.3">${escapeXml(subCaption.slice(0, 40))}</text>`,
          );
        }
      } else {
        // Shallow device (e.g. Patch Panel 30mm or Blank Panel): place compact tag beside it
        const tagX =
          dev.face === 'rear'
            ? roundCentis(zStartSvg - 6)
            : roundCentis(zStartSvg + zWidthSvg + 6);
        const anchor = dev.face === 'rear' ? 'end' : 'start';
        lines.push(
          `      <text x="${tagX}" y="${roundCentis(boxY + 12)}" fill="${textHex === '#0F172A' ? '#E2E8F0' : textHex}" font-size="8" font-weight="700" text-anchor="${anchor}">${escapeXml(dev.hostname ?? dev.instance_id)} (${depthMm}mm)</text>`,
        );
      }
    }

    // Consolidated Plug Clearance Envelope per Face (prevents 5 overlapping +35mm labels!)
    const frontClearances = dev.port_clearances.filter(
      (pc) => pc.world_normal.z < 0,
    );
    const rearClearances = dev.port_clearances.filter(
      (pc) => pc.world_normal.z > 0,
    );

    for (const group of [frontClearances, rearClearances]) {
      if (group.length === 0) continue;
      const minZ = Math.min(...group.map((g) => g.clearance_box.min.z));
      const maxZ = Math.max(...group.map((g) => g.clearance_box.max.z));
      const minY = Math.min(...group.map((g) => g.port_local_box.min.y));
      const maxY = Math.max(...group.map((g) => g.port_local_box.max.y));
      const maxDeltaZ = Math.max(...group.map((g) => g.delta_z_mm));

      const pcX = worldZToSideSvgX(minZ);
      const pcW = Math.max(6, px(maxZ - minZ));
      const pcY = worldYToSvgY(maxY);
      const pcH = Math.max(13, px(maxY - minY));

      lines.push(
        `      <rect x="${pcX}" y="${pcY}" width="${pcW}" height="${pcH}" rx="2" fill="#F59E0B" fill-opacity="0.22" stroke="#F59E0B" stroke-width="1.2" stroke-dasharray="3,2" />`,
      );
      const badgeLabel =
        group.length > 1
          ? `+${maxDeltaZ}mm (${group.length}x)`
          : `+${maxDeltaZ}mm`;
      lines.push(
        `      <text x="${roundCentis(pcX + pcW / 2)}" y="${roundCentis(pcY + pcH / 2 + 2.6)}" fill="#FDE68A" font-size="7.2" font-weight="700" text-anchor="middle">${badgeLabel}</text>`,
      );
    }

    lines.push(`    </g>`);
  }

  // Per-U Remaining Depth Clearance Dimension Arrows in Side-Cutaway (with dark pill backing)
  for (let u = 1; u <= uCount; u++) {
    const uDevs = scene.geometry.devices.filter(
      (d) =>
        u >= d.u_range[0] &&
        u <= d.u_range[1] &&
        d.blueprint.category !== 'keystone-module',
    );
    if (uDevs.length === 0) continue;

    const frontDevs = uDevs.filter((d) => d.face === 'front');
    const rearDevs = uDevs.filter((d) => d.face === 'rear');

    const frontMaxZ =
      frontDevs.length > 0
        ? Math.max(
            ...frontDevs.map((d) =>
              Math.max(
                d.chassis_box.max.z,
                d.plug_clearance_box?.max.z ?? d.chassis_box.max.z,
              ),
            ),
          )
        : 0;
    const rearMinZ =
      rearDevs.length > 0
        ? Math.min(
            ...rearDevs.map((d) =>
              Math.min(
                d.chassis_box.min.z,
                d.plug_clearance_box?.min.z ?? d.chassis_box.min.z,
              ),
            ),
          )
        : railDepthMm;

    const remainingMm = roundTenths(rearMinZ - frontMaxZ);
    if (remainingMm > 8) {
      const x1 = worldZToSideSvgX(frontMaxZ);
      const x2 = worldZToSideSvgX(rearMinZ);
      const midX = roundCentis((x1 + x2) / 2);
      const yDim = worldYToSvgY((u - 1) * MM_PER_U + 7.5);
      lines.push(
        `    <line x1="${x1}" y1="${yDim}" x2="${x2}" y2="${yDim}" stroke="#38BDF8" stroke-width="1.1" stroke-dasharray="3,2" marker-start="url(#ok-arrow-start)" marker-end="url(#ok-arrow-end)" />`,
      );
      if (x2 - x1 > 58) {
        lines.push(
          `    <rect x="${roundCentis(midX - 34)}" y="${roundCentis(yDim - 7)}" width="68" height="12" rx="3" fill="#090D16" stroke="#1E293B" stroke-width="0.8" />`,
        );
        lines.push(
          `    <text x="${midX}" y="${roundCentis(yDim + 1.8)}" fill="#7DD3FC" font-size="7.3" font-weight="600" text-anchor="middle">+${remainingMm}mm clear</text>`,
        );
      }
    }
  }

  // Collision Highlights
  const collisions = computeDepthCollisionHighlights(scene);
  for (const col of collisions) {
    const cx = worldZToSideSvgX(col.box.min.z);
    const cy = worldYToSvgY(col.box.max.y);
    const cw = Math.max(6, px(col.box.max.z - col.box.min.z));
    const ch = Math.max(8, px(col.box.max.y - col.box.min.y));

    lines.push(`    <g data-collision-code="${col.code}">`);
    lines.push(
      `      <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" fill="url(#collision-hatch)" stroke="#EF4444" stroke-width="2.2" />`,
    );
    lines.push(
      `      <line x1="${cx}" y1="${roundCentis(cy - 6)}" x2="${roundCentis(cx + cw)}" y2="${roundCentis(cy - 6)}" stroke="#EF4444" stroke-width="1.6" marker-start="url(#dim-arrow-start)" marker-end="url(#dim-arrow-end)" />`,
    );
    lines.push(
      `      <rect x="${roundCentis(cx + cw / 2 - 90)}" y="${roundCentis(cy - 22)}" width="180" height="14" rx="3" fill="#450A0A" stroke="#EF4444" stroke-width="1" />`,
    );
    lines.push(
      `      <text x="${roundCentis(cx + cw / 2)}" y="${roundCentis(cy - 12)}" fill="#FCA5A5" font-size="8.5" font-weight="700" text-anchor="middle">${escapeXml(col.label)}</text>`,
    );
    lines.push(`    </g>`);
  }
  lines.push(`  </g>`);

  // =========================================================================
  // 4. Deterministic 2D Cable Rendering Driven by PortAnchorRegistry
  // =========================================================================
  if (showCables && scene.project.cables.length > 0) {
    lines.push(`  <g data-layer="cables" filter="url(#cable-shadow)">`);

    const routesById = new Map(
      scene.cable_routes.map((r) => [r.cable_id, r]),
    );
    let frontDuctTrackIdx = 0;
    let rearDuctPowerTrackIdx = 0;
    let rearDuctDataTrackIdx = 0;
    let adjacentBridgeTrackIdx = 0;
    let crossFacePortalIdx = 0;
    let sideFrontTrackIdx = 0;
    let sideRearTrackIdx = 0;

    const renderCablePathWithHalo = (
      cableId: string,
      viewName: 'front' | 'rear' | 'side',
      d: string,
      colorHex: string,
      startAnchorKey: string,
      endAnchorKey: string,
      startXY: string,
      endXY: string,
      strokeW = 2.6,
    ): void => {
      lines.push(
        `    <path data-cable-id="${escapeXml(cableId)}" data-cable-view="${viewName}-halo" d="${d}" fill="none" stroke="#090D16" stroke-width="${roundCentis(strokeW + 1.8)}" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`,
      );
      lines.push(
        `    <path data-cable-id="${escapeXml(cableId)}" data-cable-view="${viewName}" data-start-anchor="${escapeXml(startAnchorKey)}" data-end-anchor="${escapeXml(endAnchorKey)}" data-start-xy="${startXY}" data-end-xy="${endXY}" d="${d}" fill="none" stroke="${colorHex}" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" opacity="0.96" />`,
      );
    };

    const renderPlugEndpointDot = (
      x: number,
      y: number,
      colorHex: string,
      cableId: string,
      anchorKey: string,
    ): void => {
      lines.push(
        `    <circle class="cable-plug-endpoint" data-cable-id="${escapeXml(cableId)}" data-anchor-key="${escapeXml(anchorKey)}" cx="${x}" cy="${y}" r="3.6" fill="${colorHex}" stroke="#090D16" stroke-width="1.4" />`,
      );
    };

    for (const cable of scene.project.cables) {
      const route = routesById.get(cable.cable_id);
      const fromDev = scene.geometry.devices_by_id.get(cable.from.instance_id);
      const toDev = scene.geometry.devices_by_id.get(cable.to.instance_id);
      if (!fromDev || !toDev) continue;

      const fromParent = fromDev.parent_carrier_id
        ? scene.geometry.devices_by_id.get(fromDev.parent_carrier_id)
        : undefined;
      const toParent = toDev.parent_carrier_id
        ? scene.geometry.devices_by_id.get(toDev.parent_carrier_id)
        : undefined;

      const port1 = resolveCableEndpointPortGeometry(
        fromDev,
        cable.from.port_id,
        cable.from.face,
        fromParent,
      );
      const port2 = resolveCableEndpointPortGeometry(
        toDev,
        cable.to.port_id,
        cable.to.face,
        toParent,
      );
      if (!port1 || !port2) continue;

      const fromFace: RackFace = cable.from.face ?? port1.world_face;
      const toFace: RackFace = cable.to.face ?? port2.world_face;
      const fromKey = `${cable.from.instance_id}:${cable.from.port_id}:${fromFace}`;
      const toKey = `${cable.to.instance_id}:${cable.to.port_id}:${toFace}`;

      const startAnchor = portAnchorRegistry.get(fromKey);
      const endAnchor = portAnchorRegistry.get(toKey);
      const isPower = isPowerCableType(cable.cable_type);

      if (fromFace === toFace && startAnchor && endAnchor) {
        // -------------------------------------------------------------------
        // CASE 1: Same-Face Cable (`front -> front` OR `rear -> rear`)
        // Path MUST begin at `M ${startAnchor.x} ${startAnchor.y}` and end at `L ${endAnchor.x} ${endAnchor.y}`!
        // -------------------------------------------------------------------
        const viewOriginX =
          fromFace === 'front' ? frontOriginX : rearOriginX;
        const uDiff = Math.abs(startAnchor.uPosition - endAnchor.uPosition);

        let pts: Array<{ readonly x: number; readonly y: number }>;
        if (uDiff <= 1) {
          // Adjacent-U patch bridge (e.g. U7 Patch Panel <-> U8 Switch)
          const tIdx = adjacentBridgeTrackIdx++;
          const lowerU = Math.min(startAnchor.uPosition, endAnchor.uPosition);
          const uBoundarySvgY =
            startAnchor.uPosition === endAnchor.uPosition
              ? roundCentis(Math.max(startAnchor.y, endAnchor.y) + 12 + (tIdx % 4) * 3.5)
              : roundCentis(
                  worldYToSvgY(lowerU * MM_PER_U) + ((tIdx % 5) - 2) * 3.8,
                );

          pts = [
            { x: startAnchor.x, y: startAnchor.y },
            { x: startAnchor.x, y: uBoundarySvgY },
            { x: endAnchor.x, y: uBoundarySvgY },
            { x: endAnchor.x, y: endAnchor.y },
          ];
        } else {
          // Multi-U Same-Face Duct Route (runs in dedicated vertical channel beside rail)
          let channelX: number;
          let trackOffsetPx: number;
          if (fromFace === 'front') {
            const idx = frontDuctTrackIdx++;
            trackOffsetPx = ((idx % 4) - 1.5) * 3.2;
            channelX = isPower
              ? roundCentis(viewOriginX + px(11) + idx * 3.8)
              : roundCentis(viewOriginX + rackWidthPx - px(11) - idx * 3.8);
          } else {
            if (isPower) {
              const idx = rearDuctPowerTrackIdx++;
              trackOffsetPx = ((idx % 5) - 2) * 3.2;
              channelX = roundCentis(viewOriginX + px(11) + idx * 4.2);
            } else {
              const idx = rearDuctDataTrackIdx++;
              trackOffsetPx = ((idx % 6) - 2.5) * 3.2;
              channelX = roundCentis(
                viewOriginX + rackWidthPx - px(11) - idx * 4.2,
              );
            }
          }

          const startExitY = roundCentis(startAnchor.y + 10 + trackOffsetPx);
          const endExitY = roundCentis(endAnchor.y + 10 + trackOffsetPx);

          pts = [
            { x: startAnchor.x, y: startAnchor.y },
            { x: startAnchor.x, y: startExitY },
            { x: channelX, y: startExitY },
            { x: channelX, y: endExitY },
            { x: endAnchor.x, y: endExitY },
            { x: endAnchor.x, y: endAnchor.y },
          ];
        }

        const pathD = buildRoundedOrthogonalPath(pts, 5.5);
        renderCablePathWithHalo(
          cable.cable_id,
          fromFace,
          pathD,
          cable.color_hex,
          fromKey,
          toKey,
          `${startAnchor.x},${startAnchor.y}`,
          `${endAnchor.x},${endAnchor.y}`,
        );
        renderPlugEndpointDot(
          startAnchor.x,
          startAnchor.y,
          cable.color_hex,
          cable.cable_id,
          fromKey,
        );
        renderPlugEndpointDot(
          endAnchor.x,
          endAnchor.y,
          cable.color_hex,
          cable.cable_id,
          toKey,
        );
      } else if (fromFace !== toFace && startAnchor && endAnchor) {
        // -------------------------------------------------------------------
        // CASE 2: Cross-Face Cable (`front <-> rear` through Brush-Panel Portal on U6)
        // Drawn as two connected halves meeting at a Brush-Panel Grommet Portal (`● -> REAR` / `FRONT -> ●`)
        // -------------------------------------------------------------------
        const pIdx = crossFacePortalIdx++;
        const portalU = route?.portal_u ?? 6;
        const portalSvgY = roundCentis(
          worldYToSvgY((portalU - 0.5) * MM_PER_U) + ((pIdx % 3) - 1) * 6,
        );

        const frontAnchor = fromFace === 'front' ? startAnchor : endAnchor;
        const rearAnchor = fromFace === 'rear' ? startAnchor : endAnchor;
        const frontKey = fromFace === 'front' ? fromKey : toKey;
        const rearKey = fromFace === 'rear' ? fromKey : toKey;

        const frontPortalX = roundCentis(
          frontOriginX + rackWidthPx - px(36) - pIdx * 24,
        );
        const frontPortalKey = `PORTAL:U${portalU}:front:${cable.cable_id}`;
        const frontChannelX = roundCentis(
          frontOriginX + rackWidthPx - px(12) - pIdx * 4.2,
        );

        // 2a. Front Half: frontAnchor -> frontChannel -> frontPortalGrommet
        const frontPts = [
          { x: frontAnchor.x, y: frontAnchor.y },
          { x: frontAnchor.x, y: roundCentis(frontAnchor.y + 11) },
          { x: frontChannelX, y: roundCentis(frontAnchor.y + 11) },
          { x: frontChannelX, y: portalSvgY },
          { x: frontPortalX, y: portalSvgY },
        ];
        const frontD = buildRoundedOrthogonalPath(frontPts, 5.5);
        renderCablePathWithHalo(
          cable.cable_id,
          'front',
          frontD,
          cable.color_hex,
          frontKey,
          frontPortalKey,
          `${frontAnchor.x},${frontAnchor.y}`,
          `${frontPortalX},${portalSvgY}`,
        );
        renderPlugEndpointDot(
          frontAnchor.x,
          frontAnchor.y,
          cable.color_hex,
          cable.cable_id,
          frontKey,
        );

        // Draw Front Brush-Panel Grommet Badge (`● -> REAR`)
        lines.push(
          `    <g data-portal-grommet="${escapeXml(frontPortalKey)}" transform="translate(${frontPortalX}, ${portalSvgY})">`,
        );
        lines.push(
          `      <rect x="-46" y="-8" width="54" height="16" rx="8" fill="#090D16" stroke="${cable.color_hex}" stroke-width="1.4" />`,
        );
        lines.push(
          `      <circle cx="0" cy="0" r="4.2" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1.2" />`,
        );
        lines.push(
          `      <text x="-22" y="3" fill="#F8FAFC" font-size="7.2" font-weight="700" text-anchor="middle">●-&gt;REAR</text>`,
        );
        lines.push(`    </g>`);

        // 2b. Rear Half: rearPortalGrommet -> rearChannel -> rearAnchor
        const rearPortalX = roundCentis(rearOriginX + px(36) + pIdx * 24);
        const rearPortalKey = `PORTAL:U${portalU}:rear:${cable.cable_id}`;
        const rearChannelX = roundCentis(rearOriginX + px(12) + pIdx * 4.2);

        const rearPts = [
          { x: rearPortalX, y: portalSvgY },
          { x: rearChannelX, y: portalSvgY },
          { x: rearChannelX, y: roundCentis(rearAnchor.y + 11) },
          { x: rearAnchor.x, y: roundCentis(rearAnchor.y + 11) },
          { x: rearAnchor.x, y: rearAnchor.y },
        ];
        const rearD = buildRoundedOrthogonalPath(rearPts, 5.5);
        renderCablePathWithHalo(
          cable.cable_id,
          'rear',
          rearD,
          cable.color_hex,
          rearPortalKey,
          rearKey,
          `${rearPortalX},${portalSvgY}`,
          `${rearAnchor.x},${rearAnchor.y}`,
        );
        renderPlugEndpointDot(
          rearAnchor.x,
          rearAnchor.y,
          cable.color_hex,
          cable.cable_id,
          rearKey,
        );

        // Draw Rear Brush-Panel Grommet Badge (`FRONT -> ●`)
        lines.push(
          `    <g data-portal-grommet="${escapeXml(rearPortalKey)}" transform="translate(${rearPortalX}, ${portalSvgY})">`,
        );
        lines.push(
          `      <rect x="-8" y="-8" width="58" height="16" rx="8" fill="#090D16" stroke="${cable.color_hex}" stroke-width="1.4" />`,
        );
        lines.push(
          `      <circle cx="0" cy="0" r="4.2" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1.2" />`,
        );
        lines.push(
          `      <text x="25" y="3" fill="#F8FAFC" font-size="7.2" font-weight="700" text-anchor="middle">FRONT-&gt;●</text>`,
        );
        lines.push(`    </g>`);
      }

      // -------------------------------------------------------------------
      // 3. Side-Profile Depth Cutaway Cable Harness (Orthogonal Z-Y Channels)
      // -------------------------------------------------------------------
      const sideStartX = worldZToSideSvgX(port1.world_position.z);
      const sideStartY = worldYToSvgY(port1.world_position.y);
      const sideEndX = worldZToSideSvgX(port2.world_position.z);
      const sideEndY = worldYToSvgY(port2.world_position.y);

      let sidePts: Array<{ readonly x: number; readonly y: number }>;
      if (fromFace === 'front' && toFace === 'front') {
        const sIdx = sideFrontTrackIdx++;
        const frontTrackZMm = -16 - (sIdx % 6) * 4.2;
        const trackX = worldZToSideSvgX(frontTrackZMm);
        sidePts = [
          { x: sideStartX, y: sideStartY },
          { x: trackX, y: sideStartY },
          { x: trackX, y: sideEndY },
          { x: sideEndX, y: sideEndY },
        ];
      } else if (fromFace === 'rear' && toFace === 'rear') {
        const sIdx = sideRearTrackIdx++;
        const isSameURearJumper = fromDev.u_position === toDev.u_position;
        const maxEndpointZ = Math.max(
          port1.world_position.z,
          port2.world_position.z,
        );
        const rearTrackZMm = isSameURearJumper
          ? maxEndpointZ + 12 + (sIdx % 3) * 3.5
          : railDepthMm - 8 + sIdx * 3.8;
        const stepOutY = isSameURearJumper
          ? roundCentis(Math.min(sideStartY, sideEndY) - 6 - (sIdx % 3) * 2.5)
          : sideEndY;
        const trackX = worldZToSideSvgX(rearTrackZMm);
        sidePts = isSameURearJumper
          ? [
              { x: sideStartX, y: sideStartY },
              { x: trackX, y: sideStartY },
              { x: trackX, y: stepOutY },
              { x: sideEndX, y: stepOutY },
              { x: sideEndX, y: sideEndY },
            ]
          : [
              { x: sideStartX, y: sideStartY },
              { x: trackX, y: sideStartY },
              { x: trackX, y: sideEndY },
              { x: sideEndX, y: sideEndY },
            ];
      } else {
        // Cross-Face Cable passing horizontally through U6 Brush Portal in Side Cutaway
        const portalU = route?.portal_u ?? 6;
        const portalSvgY = worldYToSvgY((portalU - 0.5) * MM_PER_U);
        const frontChannelX = worldZToSideSvgX(-24);
        const rearChannelX = worldZToSideSvgX(railDepthMm + 16);

        if (fromFace === 'front') {
          sidePts = [
            { x: sideStartX, y: sideStartY },
            { x: frontChannelX, y: sideStartY },
            { x: frontChannelX, y: portalSvgY },
            { x: rearChannelX, y: portalSvgY },
            { x: rearChannelX, y: sideEndY },
            { x: sideEndX, y: sideEndY },
          ];
        } else {
          sidePts = [
            { x: sideStartX, y: sideStartY },
            { x: rearChannelX, y: sideStartY },
            { x: rearChannelX, y: portalSvgY },
            { x: frontChannelX, y: portalSvgY },
            { x: frontChannelX, y: sideEndY },
            { x: sideEndX, y: sideEndY },
          ];
        }
      }

      const sideD = buildRoundedOrthogonalPath(sidePts, 5.0);
      lines.push(
        `    <path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="side-halo" d="${sideD}" fill="none" stroke="#090D16" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.85" />`,
      );
      lines.push(
        `    <path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="side" data-start-xy="${sideStartX},${sideStartY}" data-end-xy="${sideEndX},${sideEndY}" d="${sideD}" fill="none" stroke="${cable.color_hex}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.94" />`,
      );
      lines.push(
        `    <circle class="side-cable-plug" cx="${sideStartX}" cy="${sideStartY}" r="3.0" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1.2" />`,
      );
      lines.push(
        `    <circle class="side-cable-plug" cx="${sideEndX}" cy="${sideEndY}" r="3.0" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1.2" />`,
      );
    }

    lines.push(`  </g>`);
  }

  // =========================================================================
  // 5. Right-Side Port & Cable Callout Legend Column
  // =========================================================================
  lines.push(`  <g data-view="front-callout-legend" data-layer="callout-legend">`);
  lines.push(
    `    <rect x="${legendOriginX}" y="${topMarginPx - outerFramePadPx}" width="${legendWidthPx}" height="${Math.max(rackHeightPx + outerFramePadPx * 2, legendHeightPx)}" rx="6" fill="#090D16" stroke="#334155" stroke-width="1.6" />`,
  );
  lines.push(
    `    <text x="${legendOriginX + 16}" y="${topMarginPx + 14}" fill="#F8FAFC" font-size="12" font-weight="700">PORT &amp; CABLE CALLOUT LEGEND</text>`,
  );
  lines.push(
    `    <text x="${legendOriginX + 16}" y="${topMarginPx + 30}" fill="#94A3B8" font-size="9.5">Deterministic PortAnchorRegistry Mapping (${calloutList.length} Active Endpoints)</text>`,
  );
  lines.push(
    `    <line x1="${legendOriginX + 12}" y1="${topMarginPx + 38}" x2="${legendOriginX + legendWidthPx - 12}" y2="${topMarginPx + 38}" stroke="#1E293B" stroke-width="1" />`,
  );

  for (let idx = 0; idx < calloutList.length; idx++) {
    const item = calloutList[idx]!;
    const rowY = roundCentis(topMarginPx + 54 + idx * 19);

    lines.push(
      `    <circle cx="${legendOriginX + 24}" cy="${rowY - 3.5}" r="7.5" fill="#0F172A" stroke="${item.colorHex}" stroke-width="1.3" />`,
    );
    lines.push(
      `    <text x="${legendOriginX + 24}" y="${rowY - 0.8}" fill="#F8FAFC" font-size="7.5" font-weight="700" text-anchor="middle">${item.calloutNumber}</text>`,
    );
    lines.push(
      `    <text x="${legendOriginX + 38}" y="${rowY}" fill="#E2E8F0" font-size="8.8" font-weight="600">${escapeXml(`${item.instanceId}:${item.portId}`)} <tspan fill="#64748B">(${item.face})</tspan></text>`,
    );
    lines.push(
      `    <text x="${legendOriginX + 198}" y="${rowY}" fill="#94A3B8" font-size="8.3">-&gt; ${escapeXml(item.peerDesc)} [${escapeXml(item.cableId)}]</text>`,
    );
  }
  lines.push(`  </g>`);

  lines.push(`</svg>`);
  return lines.join('\n');
}
