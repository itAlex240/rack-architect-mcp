import {
  EIA_310_SPECS,
  MM_PER_U,
  evaluateRackScene,
  isPowerCableType,
  roundCentis,
  roundTenths,
  serializeRackScene,
  type ComputedDeviceGeometry,
  type HardwareBlueprint,
  type RackProjectInput,
  type RackStandard,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';

/**
 * Returns the 8U 10-Inch Homelab reference `RackProjectInput` for Standalone / Demo fallback mode.
 */
export function createStandaloneHomelabProjectInput(): RackProjectInput {
  return {
    schema_version: '1.0',
    project_name: '8U 10-Inch Proxmox & UniFi Homelab',
    rack: {
      standard: '10inch',
      u_height: 8,
      rail_depth_mm: 240,
      enclosure_type: 'closed-glass-front',
      front_door_clearance_mm: 50,
      rear_clearance_mm: 60,
    },
    mounted_devices: [
      {
        instance_id: 'ups-u1',
        blueprint_slug: 'cyberpower-10inch-ups-1u',
        hostname: 'ups-core-01',
        u_position: 1,
        face: 'front',
        children: [],
      },
      {
        instance_id: 'pdu-u2-rear',
        blueprint_slug: 'digitus-10inch-pdu-4way-schuko',
        hostname: 'pdu-rear-01',
        u_position: 2,
        face: 'rear',
        children: [],
      },
      {
        instance_id: 'carrier-u3',
        blueprint_slug: '3dprint-10inch-ucg-ultra-plus-3keystone',
        hostname: 'carrier-gateway-u3',
        u_position: 3,
        face: 'front',
        children: [
          {
            instance_id: 'ucg-max',
            blueprint_slug: 'ubiquiti-ucg-max',
            hostname: 'gw-unifi-max',
            slot_id: 'gateway-bay',
          },
          {
            instance_id: 'ks-u3-wan',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'WAN-ISP',
            slot_id: 'keystone-1',
          },
          {
            instance_id: 'ks-u3-uplink',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'UCG-LAN1',
            slot_id: 'keystone-2',
          },
          {
            instance_id: 'ks-u3-aux',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'UCG-LAN2',
            slot_id: 'keystone-3',
          },
        ],
      },
      {
        instance_id: 'carrier-u4',
        blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
        hostname: 'carrier-pve01-u4',
        u_position: 4,
        face: 'front',
        children: [
          {
            instance_id: 'pve-node-01',
            blueprint_slug: 'lenovo-thinkcentre-m920q',
            hostname: 'pve-node-01',
            slot_id: 'left-mini-pc-bay',
          },
          {
            instance_id: 'ks-u4-eth1',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'PVE1-2.5G',
            slot_id: 'keystone-1',
          },
          {
            instance_id: 'ks-u4-ceph',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'PVE1-CEPH',
            slot_id: 'keystone-2',
          },
        ],
      },
      {
        instance_id: 'carrier-u5',
        blueprint_slug: '3dprint-10inch-lenovo-tiny-plus-2keystone',
        hostname: 'carrier-pve02-u5',
        u_position: 5,
        face: 'front',
        children: [
          {
            instance_id: 'pve-node-02',
            blueprint_slug: 'lenovo-thinkcentre-m920q',
            hostname: 'pve-node-02',
            slot_id: 'left-mini-pc-bay',
          },
          {
            instance_id: 'ks-u5-eth1',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'PVE2-2.5G',
            slot_id: 'keystone-1',
          },
          {
            instance_id: 'ks-u5-ceph',
            blueprint_slug: 'keystone-rj45-cat6a-coupler',
            hostname: 'PVE2-CEPH',
            slot_id: 'keystone-2',
          },
        ],
      },
      {
        instance_id: 'brush-u6',
        blueprint_slug: 'generic-10inch-brush-panel-1u',
        hostname: 'cable-brush-u6',
        u_position: 6,
        face: 'front',
        children: [],
      },
      {
        instance_id: 'patch-u7',
        blueprint_slug: 'deskpi-10inch-patch-panel-12port',
        hostname: 'patch-panel-u7',
        u_position: 7,
        face: 'front',
        children: [],
      },
      {
        instance_id: 'sw-u8',
        blueprint_slug: 'ubiquiti-usw-flex-2-5g-8-poe',
        hostname: 'sw-core-flex25g',
        u_position: 8,
        face: 'front',
        children: [],
      },
    ],
    cables: [
      {
        cable_id: 'pwr-ups-to-pdu',
        cable_type: 'power-schuko-c13',
        color_hex: '#EF4444',
        label: 'UPS C13-1 -> Rear PDU Input',
        from: { instance_id: 'ups-u1', port_id: 'iec_out1', face: 'rear' },
        to: { instance_id: 'pdu-u2-rear', port_id: 'mains_in' },
      },
      {
        cable_id: 'pwr-ups-to-sw',
        cable_type: 'power-c13-c14',
        color_hex: '#EF4444',
        label: 'UPS C13-2 -> USW-Flex-2.5G',
        from: { instance_id: 'ups-u1', port_id: 'iec_out2', face: 'rear' },
        to: { instance_id: 'sw-u8', port_id: 'pwr_in', face: 'rear' },
      },
      {
        cable_id: 'pwr-pdu-to-ucg',
        cable_type: 'power-usb-c',
        color_hex: '#F97316',
        label: 'PDU Schuko 1 -> UCG-Max USB-C PD',
        from: { instance_id: 'pdu-u2-rear', port_id: 'outlet1' },
        to: { instance_id: 'ucg-max', port_id: 'usbc_pwr', face: 'rear' },
      },
      {
        cable_id: 'pwr-pdu-to-pve1',
        cable_type: 'power-dc-5525',
        color_hex: '#F59E0B',
        label: 'PDU Schuko 2 -> PVE-01 20V DC Brick',
        from: { instance_id: 'pdu-u2-rear', port_id: 'outlet2' },
        to: { instance_id: 'pve-node-01', port_id: 'dc_in', face: 'rear' },
      },
      {
        cable_id: 'pwr-pdu-to-pve2',
        cable_type: 'power-dc-5525',
        color_hex: '#F59E0B',
        label: 'PDU Schuko 3 -> PVE-02 20V DC Brick',
        from: { instance_id: 'pdu-u2-rear', port_id: 'outlet3' },
        to: { instance_id: 'pve-node-02', port_id: 'dc_in', face: 'rear' },
      },
      {
        cable_id: 'trunk-ucg-lan1-to-patch1',
        cable_type: 'cat6a',
        color_hex: '#3B82F6',
        label: 'UCG-Max LAN1 -> Patch P1 (Rear)',
        vlan_id: 1,
        ip_cidr: '10.10.0.1/24',
        from: { instance_id: 'ucg-max', port_id: 'lan1', face: 'rear' },
        to: { instance_id: 'patch-u7', port_id: 'p1', face: 'rear' },
      },
      {
        cable_id: 'trunk-pve1-eth1-to-patch2',
        cable_type: 'cat6a',
        color_hex: '#10B981',
        label: 'PVE-01 2.5G ETH1 -> Patch P2 (Rear)',
        from: { instance_id: 'pve-node-01', port_id: 'eth1', face: 'rear' },
        to: { instance_id: 'patch-u7', port_id: 'p2', face: 'rear' },
      },
      {
        cable_id: 'trunk-pve2-eth1-to-patch3',
        cable_type: 'cat6a',
        color_hex: '#10B981',
        label: 'PVE-02 2.5G ETH1 -> Patch P3 (Rear)',
        from: { instance_id: 'pve-node-02', port_id: 'eth1', face: 'rear' },
        to: { instance_id: 'patch-u7', port_id: 'p3', face: 'rear' },
      },
      {
        cable_id: 'trunk-pve1-eth0-to-patch4',
        cable_type: 'cat6a',
        color_hex: '#6366F1',
        label: 'PVE-01 Mgmt ETH0 -> Patch P4 (Rear)',
        from: { instance_id: 'pve-node-01', port_id: 'eth0', face: 'rear' },
        to: { instance_id: 'patch-u7', port_id: 'p4', face: 'rear' },
      },
      {
        cable_id: 'trunk-pve2-eth0-to-patch5',
        cable_type: 'cat6a',
        color_hex: '#6366F1',
        label: 'PVE-02 Mgmt ETH0 -> Patch P5 (Rear)',
        from: { instance_id: 'pve-node-02', port_id: 'eth0', face: 'rear' },
        to: { instance_id: 'patch-u7', port_id: 'p5', face: 'rear' },
      },
      {
        cable_id: 'trunk-ucg-wan-to-ks',
        cable_type: 'cat6a',
        color_hex: '#EC4899',
        label: 'UCG-Max WAN -> U3 Keystone 1 (Rear)',
        from: { instance_id: 'ucg-max', port_id: 'wan', face: 'rear' },
        to: { instance_id: 'ks-u3-wan', port_id: 'coupler', face: 'rear' },
      },
      {
        cable_id: 'trunk-pve-ceph-direct',
        cable_type: 'cat6a',
        color_hex: '#A855F7',
        label: 'PVE-01 ETH2 <-> PVE-02 ETH2 (2.5G Ceph Cluster)',
        vlan_id: 50,
        ip_cidr: '10.50.0.0/24',
        from: { instance_id: 'pve-node-01', port_id: 'eth2', face: 'rear' },
        to: { instance_id: 'pve-node-02', port_id: 'eth2', face: 'rear' },
      },
      {
        cable_id: 'patch-front-p1-sw1',
        cable_type: 'cat6a',
        color_hex: '#3B82F6',
        label: 'Patch P1 -> Switch Port 1 (Gateway Uplink)',
        from: { instance_id: 'patch-u7', port_id: 'p1', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth1', face: 'front' },
      },
      {
        cable_id: 'patch-front-p2-sw2',
        cable_type: 'cat6a',
        color_hex: '#10B981',
        label: 'Patch P2 -> Switch Port 2 (PVE-01 2.5G)',
        from: { instance_id: 'patch-u7', port_id: 'p2', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth2', face: 'front' },
      },
      {
        cable_id: 'patch-front-p3-sw3',
        cable_type: 'cat6a',
        color_hex: '#10B981',
        label: 'Patch P3 -> Switch Port 3 (PVE-02 2.5G)',
        from: { instance_id: 'patch-u7', port_id: 'p3', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth3', face: 'front' },
      },
      {
        cable_id: 'patch-front-p4-sw4',
        cable_type: 'cat6a',
        color_hex: '#6366F1',
        label: 'Patch P4 -> Switch Port 4 (PVE-01 Mgmt)',
        from: { instance_id: 'patch-u7', port_id: 'p4', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth4', face: 'front' },
      },
      {
        cable_id: 'patch-front-p5-sw5',
        cable_type: 'cat6a',
        color_hex: '#6366F1',
        label: 'Patch P5 -> Switch Port 5 (PVE-02 Mgmt)',
        from: { instance_id: 'patch-u7', port_id: 'p5', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth5', face: 'front' },
      },
      {
        cable_id: 'cross-sw6-to-ucg-lan2',
        cable_type: 'cat6a',
        color_hex: '#06B6D4',
        label: 'Switch Port 6 (Front) -> U6 Brush Portal -> UCG-Max LAN2 (Rear)',
        preferred_portal_u: 6,
        from: { instance_id: 'sw-u8', port_id: 'eth6', face: 'front' },
        to: { instance_id: 'ucg-max', port_id: 'lan2', face: 'rear' },
      },
    ],
  };
}

/**
 * Evaluates and serializes a `RackProjectInput` using `@rack-mcp/core-domain` and `@rack-mcp/hardware-catalog`.
 */
export function evaluateStandaloneScene(
  projectInput: RackProjectInput = createStandaloneHomelabProjectInput(),
  catalogRecord: Readonly<Record<string, HardwareBlueprint>> = defaultCatalogRegistry.toRecord(),
): SerializedRackScene {
  const computed = evaluateRackScene(projectInput, catalogRecord);
  return serializeRackScene(computed);
}

function escapeXml(raw: string): string {
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildClientRoundedPath(
  points: ReadonlyArray<{ readonly x: number; readonly y: number }>,
  radiusPx = 5.0,
): string {
  const pts: Array<{ readonly x: number; readonly y: number }> = [];
  for (const pt of points) {
    const prev = pts[pts.length - 1];
    if (
      prev === undefined ||
      Math.hypot(pt.x - prev.x, pt.y - prev.y) > 0.4
    ) {
      pts.push(pt);
    }
  }
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0]!.x} ${pts[0]!.y}`;

  const parts: string[] = [`M ${pts[0]!.x} ${pts[0]!.y}`];
  for (let i = 1; i < pts.length - 1; i++) {
    const prev = pts[i - 1]!;
    const curr = pts[i]!;
    const next = pts[i + 1]!;
    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const len1 = Math.hypot(v1x, v1y);
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;
    const len2 = Math.hypot(v2x, v2y);
    const r = Math.min(radiusPx, len1 * 0.42, len2 * 0.42);
    if (r < 0.8) {
      parts.push(`L ${curr.x} ${curr.y}`);
      continue;
    }
    const pInX = roundCentis(curr.x - (v1x / len1) * r);
    const pInY = roundCentis(curr.y - (v1y / len1) * r);
    const pOutX = roundCentis(curr.x + (v2x / len2) * r);
    const pOutY = roundCentis(curr.y + (v2y / len2) * r);
    parts.push(`L ${pInX} ${pInY}`);
    parts.push(`Q ${curr.x} ${curr.y} ${pOutX} ${pOutY}`);
  }
  const last = pts[pts.length - 1]!;
  parts.push(`L ${last.x} ${last.y}`);
  return parts.join(' ');
}

/**
 * Generates a standalone 2D Elevation & Depth Cutaway SVG from a `SerializedRackScene`
 * including Front, Rear (Mirrored X), and Side-Profile Depth Cutaway (Z-Y) with all cable harnesses.
 */
export function renderClientSideElevationSvg(scene: SerializedRackScene): string {
  const scale = 2.6;
  const px = (mm: number): number => roundCentis(mm * scale);
  const spec = EIA_310_SPECS[scene.project.rack.standard];
  const uCount = scene.project.rack.u_height;
  const panelWidthMm = spec.W_panel;
  const totalHeightMm = uCount * MM_PER_U;
  const railDepthMm = scene.project.rack.rail_depth_mm;
  const frontDoorClearanceMm = scene.project.rack.front_door_clearance_mm;
  const rearClearanceMm = Math.max(scene.project.rack.rear_clearance_mm, 55);
  const sideTotalDepthMm =
    frontDoorClearanceMm + railDepthMm + rearClearanceMm;

  const topMarginPx = 110;
  const rackWidthPx = px(panelWidthMm);
  const rackHeightPx = px(totalHeightMm);
  const frontOriginX = 80;
  const rearOriginX = frontOriginX + rackWidthPx + 110;
  const sideOriginX = rearOriginX + rackWidthPx + 110;
  const sideWidthPx = px(sideTotalDepthMm);
  const svgWidth = roundCentis(sideOriginX + sideWidthPx + 80);
  const svgHeight = roundCentis(topMarginPx + rackHeightPx + 96);

  const worldYToSvgY = (yMm: number): number =>
    roundCentis(topMarginPx + (totalHeightMm - yMm) * scale);
  const worldZToSideSvgX = (worldZMm: number): number =>
    roundCentis(sideOriginX + (worldZMm + frontDoorClearanceMm) * scale);

  const portAnchors = new Map<
    string,
    { x: number; y: number; u: number; worldZ: number; worldY: number }
  >();
  const devicesById = new Map<string, ComputedDeviceGeometry>(
    scene.geometry.devices.map((d) => [d.instance_id, d]),
  );
  const routesById = new Map(scene.cable_routes.map((r) => [r.cable_id, r]));

  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" font-family="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">`,
  );
  lines.push(
    `<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#09090B" />`,
  );
  lines.push(
    `<text x="32" y="36" fill="#F4F4F5" font-size="16" font-weight="700">${escapeXml(scene.project.project_name)} — 2D CAD Elevation &amp; Depth Cutaway</text>`,
  );
  lines.push(
    `<text x="32" y="58" fill="#A1A1AA" font-size="11">Standard: ${scene.project.rack.standard} (${panelWidthMm}mm) • Height: ${uCount}U (${roundTenths(totalHeightMm)}mm) • Rail Depth: ${railDepthMm}mm • Cables: ${scene.project.cables.length}</text>`,
  );

  const drawRackFrame = (originX: number, label: string, widthPx: number) => {
    lines.push(
      `<text x="${roundCentis(originX + widthPx / 2)}" y="${topMarginPx - 16}" fill="#E4E4E7" font-size="12" font-weight="700" text-anchor="middle">${escapeXml(label)}</text>`,
    );
    lines.push(
      `<rect x="${originX - 8}" y="${topMarginPx - 8}" width="${widthPx + 16}" height="${rackHeightPx + 16}" rx="6" fill="#0E0E11" stroke="#3F3F46" stroke-width="2" />`,
    );
    for (let u = 1; u <= uCount; u++) {
      const yTop = worldYToSvgY(u * MM_PER_U);
      const h = px(MM_PER_U);
      lines.push(
        `<rect x="${originX}" y="${yTop}" width="${widthPx}" height="${h}" fill="${u % 2 === 1 ? '#121216' : '#18181D'}" stroke="#27272A" stroke-width="0.9" stroke-dasharray="4,2" />`,
      );
      lines.push(
        `<text x="${originX - 18}" y="${roundCentis(yTop + h / 2 + 4)}" fill="#A1A1AA" font-size="10" font-weight="700" text-anchor="middle">U${u}</text>`,
      );
    }
  };

  drawRackFrame(frontOriginX, 'FRONT ELEVATION (Z = 0mm)', rackWidthPx);
  drawRackFrame(
    rearOriginX,
    `REAR ELEVATION (Z = ${railDepthMm}mm, MIRRORED X)`,
    rackWidthPx,
  );
  drawRackFrame(
    sideOriginX,
    'SIDE-PROFILE DEPTH CUTAWAY (Z-Y)',
    sideWidthPx,
  );

  // Z-Axis ticks & Front/Rear Rails in Side-Profile Cutaway
  const zTicksMm = [-50, 0, 50, 100, 150, 200, railDepthMm, railDepthMm + 50];
  for (const zVal of [...new Set(zTicksMm)].filter(
    (z) => z >= -frontDoorClearanceMm && z <= railDepthMm + rearClearanceMm,
  )) {
    const gx = worldZToSideSvgX(zVal);
    lines.push(
      `<line x1="${gx}" y1="${topMarginPx}" x2="${gx}" y2="${topMarginPx + rackHeightPx}" stroke="#27272A" stroke-width="0.8" stroke-dasharray="2,4" />`,
    );
    lines.push(
      `<text x="${gx}" y="${topMarginPx + rackHeightPx + 20}" fill="#71717A" font-size="8.5" font-weight="600" text-anchor="middle">${zVal}mm</text>`,
    );
  }
  if (scene.project.rack.enclosure_type !== 'open-frame') {
    const doorSvgX = worldZToSideSvgX(-frontDoorClearanceMm);
    lines.push(
      `<rect x="${roundCentis(doorSvgX - 2)}" y="${topMarginPx}" width="4" height="${rackHeightPx}" rx="1.5" fill="#3B82F6" fill-opacity="0.25" stroke="#3B82F6" stroke-width="1.2" />`,
    );
  }
  const frontRailSvgX = worldZToSideSvgX(0);
  const rearRailSvgX = worldZToSideSvgX(railDepthMm);
  lines.push(
    `<rect x="${frontRailSvgX}" y="${topMarginPx}" width="5" height="${rackHeightPx}" fill="#3F3F46" stroke="#71717A" stroke-width="1" />`,
  );
  lines.push(
    `<rect x="${roundCentis(rearRailSvgX - 5)}" y="${topMarginPx}" width="5" height="${rackHeightPx}" fill="#3F3F46" stroke="#71717A" stroke-width="1" />`,
  );

  // Render Front, Rear & Side-Cutaway Devices + Port Anchors
  for (const dev of scene.geometry.devices) {
    const w = px(dev.chassis_box.max.x - dev.chassis_box.min.x);
    const h = px(dev.chassis_box.max.y - dev.chassis_box.min.y);
    const y = worldYToSvgY(dev.chassis_box.max.y);
    const isSubModule = dev.mount_target === 'carrier-slot';
    const isCarrier = dev.blueprint.category === 'modular-carrier';
    const hasMajorChild =
      isCarrier &&
      dev.child_instance_ids.some((cid) => {
        const c = devicesById.get(cid);
        return c !== undefined && c.blueprint.category !== 'keystone-module';
      });

    if (dev.face === 'front') {
      const x = roundCentis(frontOriginX + px(dev.chassis_box.min.x));
      lines.push(
        `<g data-instance-id="${escapeXml(dev.instance_id)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" stroke="${isSubModule ? '#3B82F6' : '#52525B'}" stroke-width="1.3" />${!isCarrier ? `<text x="${x + 6}" y="${y + 11}" fill="#E4E4E7" font-size="8.2" font-weight="700">${escapeXml(dev.hostname ?? dev.instance_id)}</text>` : ''}</g>`,
      );
    }

    const rearX = roundCentis(
      rearOriginX + px(panelWidthMm - dev.chassis_box.max.x),
    );
    lines.push(
      `<g data-rear-instance="${escapeXml(dev.instance_id)}"><rect x="${rearX}" y="${y}" width="${w}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" fill-opacity="${dev.face === 'rear' ? '1' : '0.82'}" stroke="${dev.face === 'rear' ? '#F59E0B' : '#3F3F46'}" stroke-width="1.2" /></g>`,
    );

    for (const p of dev.ports) {
      const py = worldYToSvgY(p.world_position.y);
      if (p.world_face === 'front' || p.is_passthrough_coupler) {
        const pxFront = roundCentis(frontOriginX + px(p.world_position.x));
        portAnchors.set(`${dev.instance_id}:${p.port_id}:front`, {
          x: pxFront,
          y: py,
          u: dev.u_position,
          worldZ: p.world_position.z,
          worldY: p.world_position.y,
        });
        lines.push(
          `<rect x="${pxFront - 4}" y="${py - 3.5}" width="8" height="7" rx="1" fill="#09090B" stroke="#3B82F6" stroke-width="1.1" />`,
        );
      }
      if (p.world_face === 'rear' || p.is_passthrough_coupler) {
        const pxRear = roundCentis(
          rearOriginX + px(panelWidthMm - p.world_position.x),
        );
        portAnchors.set(`${dev.instance_id}:${p.port_id}:rear`, {
          x: pxRear,
          y: py,
          u: dev.u_position,
          worldZ: p.world_position.z,
          worldY: p.world_position.y,
        });
        lines.push(
          `<rect x="${pxRear - 4}" y="${py - 3.5}" width="8" height="7" rx="1" fill="#09090B" stroke="#F59E0B" stroke-width="1.1" />`,
        );
      }
    }

    // Side Cutaway Box (with L-shaped tray for Modular Carriers)
    if (dev.blueprint.category !== 'keystone-module') {
      const sx = worldZToSideSvgX(dev.chassis_box.min.z);
      const sw = Math.max(5, px(dev.chassis_box.max.z - dev.chassis_box.min.z));
      if (isCarrier && hasMajorChild) {
        const trayFloorH = Math.max(5, px(4.2));
        const flangeW = Math.max(6, px(5.5));
        lines.push(
          `<g data-side-instance-id="${escapeXml(dev.instance_id)}"><rect x="${sx}" y="${y}" width="${flangeW}" height="${h}" rx="1.5" fill="#27272A" stroke="#52525B" stroke-width="1" /><rect x="${sx}" y="${roundCentis(y + h - trayFloorH)}" width="${sw}" height="${trayFloorH}" rx="1.5" fill="#27272A" stroke="#52525B" stroke-width="1" /></g>`,
        );
      } else {
        const insetTop = isSubModule ? 3 : 1;
        const insetBottom = isSubModule ? Math.max(5, px(4.5)) : 1;
        const boxY = roundCentis(y + insetTop);
        const boxH = Math.max(12, roundCentis(h - insetTop - insetBottom));
        const strokeCol = isSubModule
          ? '#3B82F6'
          : dev.face === 'rear'
            ? '#F59E0B'
            : '#52525B';
        const depthMm = roundTenths(
          dev.chassis_box.max.z - dev.chassis_box.min.z,
        );
        lines.push(
          `<g data-side-instance-id="${escapeXml(dev.instance_id)}"><rect x="${sx}" y="${boxY}" width="${sw}" height="${boxH}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" fill-opacity="0.9" stroke="${strokeCol}" stroke-width="1.2" />${sw > 60 ? `<rect x="${sx + 5}" y="${boxY + 4}" width="${Math.min(sw - 10, 175)}" height="15" rx="2.5" fill="#09090B" fill-opacity="0.82" /><text x="${sx + 10}" y="${boxY + 14}" fill="#F4F4F5" font-size="8" font-weight="700">${escapeXml(`${dev.hostname ?? dev.instance_id} (${depthMm}mm)`)}</text>` : ''}</g>`,
        );
      }

      // Plug Clearance Box in Side-Profile Cutaway
      if (dev.plug_clearance_box) {
        const pcX = worldZToSideSvgX(dev.plug_clearance_box.min.z);
        const pcW = Math.max(
          6,
          px(dev.plug_clearance_box.max.z - dev.plug_clearance_box.min.z),
        );
        const pcY = worldYToSvgY(dev.plug_clearance_box.max.y);
        const pcH = Math.max(
          12,
          px(dev.plug_clearance_box.max.y - dev.plug_clearance_box.min.y),
        );
        lines.push(
          `<rect x="${pcX}" y="${pcY}" width="${pcW}" height="${pcH}" rx="2" fill="#F59E0B" fill-opacity="0.18" stroke="#F59E0B" stroke-width="1.1" stroke-dasharray="3,2" />`,
        );
      }
    }
  }

  // Render Front, Rear, and Side-Profile Cables
  let frontDuctIdx = 0;
  let rearPowerIdx = 0;
  let rearDataIdx = 0;
  let bridgeIdx = 0;
  let portalIdx = 0;
  const portalCountByU = new Map<number, number>();
  let sideFrontIdx = 0;
  let sideRearIdx = 0;

  for (const cable of scene.project.cables) {
    const d1 = devicesById.get(cable.from.instance_id);
    const d2 = devicesById.get(cable.to.instance_id);
    if (!d1 || !d2) continue;
    const p1 = d1.ports.find((p) => p.port_id === cable.from.port_id);
    const p2 = d2.ports.find((p) => p.port_id === cable.to.port_id);
    const f1 =
      cable.from.face ?? p1?.world_face ?? (d1.face === 'rear' ? 'rear' : 'front');
    const f2 =
      cable.to.face ?? p2?.world_face ?? (d2.face === 'rear' ? 'rear' : 'front');
    const a1 =
      portAnchors.get(`${cable.from.instance_id}:${cable.from.port_id}:${f1}`) ??
      portAnchors.get(`${cable.from.instance_id}:${cable.from.port_id}:front`) ??
      portAnchors.get(`${cable.from.instance_id}:${cable.from.port_id}:rear`);
    const a2 =
      portAnchors.get(`${cable.to.instance_id}:${cable.to.port_id}:${f2}`) ??
      portAnchors.get(`${cable.to.instance_id}:${cable.to.port_id}:front`) ??
      portAnchors.get(`${cable.to.instance_id}:${cable.to.port_id}:rear`);
    if (!a1 || !a2) continue;

    const isPower = isPowerCableType(cable.cable_type);
    const route = routesById.get(cable.cable_id);

    // 1. Front & Rear Elevation Cable Paths
    if (f1 === f2) {
      const viewOriginX = f1 === 'front' ? frontOriginX : rearOriginX;
      const uDiff = Math.abs(a1.u - a2.u);
      let pts: Array<{ readonly x: number; readonly y: number }>;
      if (uDiff <= 1) {
        if (a1.u !== a2.u && Math.abs(a1.x - a2.x) <= 2.0) {
          pts = [
            { x: a1.x, y: a1.y },
            { x: a2.x, y: a2.y },
          ];
        } else {
          const bIdx = bridgeIdx++;
          const midY =
            a1.u === a2.u
              ? roundCentis(Math.max(a1.y, a2.y) + 11 + (bIdx % 4) * 3.2)
              : roundCentis(
                  worldYToSvgY(Math.min(a1.u, a2.u) * MM_PER_U) +
                    ((bIdx % 7) - 3) * 2.4,
                );
          pts = [
            { x: a1.x, y: a1.y },
            { x: a1.x, y: midY },
            { x: a2.x, y: midY },
            { x: a2.x, y: a2.y },
          ];
        }
      } else {
        let channelX: number;
        let offsetPx: number;
        if (f1 === 'front') {
          const idx = frontDuctIdx++;
          offsetPx = ((idx % 4) - 1.5) * 3.0;
          channelX = isPower
            ? roundCentis(viewOriginX + px(11) + idx * 3.6)
            : roundCentis(viewOriginX + rackWidthPx - px(11) - idx * 3.6);
        } else if (isPower) {
          const idx = rearPowerIdx++;
          offsetPx = ((idx % 5) - 2) * 3.0;
          channelX = roundCentis(viewOriginX + px(11) + idx * 4.0);
        } else {
          const idx = rearDataIdx++;
          offsetPx = ((idx % 6) - 2.5) * 3.0;
          channelX = roundCentis(
            viewOriginX + rackWidthPx - px(11) - idx * 4.0,
          );
        }
        const yExit1 = roundCentis(a1.y + 10 + offsetPx);
        const yExit2 = roundCentis(a2.y + 10 + offsetPx);
        pts = [
          { x: a1.x, y: a1.y },
          { x: a1.x, y: yExit1 },
          { x: channelX, y: yExit1 },
          { x: channelX, y: yExit2 },
          { x: a2.x, y: yExit2 },
          { x: a2.x, y: a2.y },
        ];
      }
      const d = buildClientRoundedPath(pts, 5.0);
      lines.push(
        `<path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="${f1}-halo" d="${d}" fill="none" stroke="#09090B" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.88" />`,
      );
      lines.push(
        `<path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="${f1}" d="${d}" fill="none" stroke="${cable.color_hex}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`,
      );
      lines.push(
        `<circle cx="${a1.x}" cy="${a1.y}" r="3.2" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
      );
      lines.push(
        `<circle cx="${a2.x}" cy="${a2.y}" r="3.2" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
      );
    } else {
      // Cross-Face Cable via Brush-Panel Portal Grommets
      const pIdx = portalIdx++;
      const portalU = route?.portal_u ?? 6;
      const uPortalIdx = portalCountByU.get(portalU) ?? 0;
      portalCountByU.set(portalU, uPortalIdx + 1);
      const portalSvgY = roundCentis(
        worldYToSvgY((portalU - 0.5) * MM_PER_U) +
          (uPortalIdx % 2 === 0 ? -1 : 1) * 3.5,
      );
      const frontAnchor = f1 === 'front' ? a1 : a2;
      const rearAnchor = f1 === 'rear' ? a1 : a2;
      const frontPortalX = roundCentis(
        frontOriginX + rackWidthPx - px(38) - uPortalIdx * 68,
      );
      const frontChannelX = roundCentis(
        frontOriginX + rackWidthPx - px(12) - pIdx * 4.0,
      );
      const frontD = buildClientRoundedPath(
        [
          { x: frontAnchor.x, y: frontAnchor.y },
          { x: frontAnchor.x, y: roundCentis(frontAnchor.y + 10) },
          { x: frontChannelX, y: roundCentis(frontAnchor.y + 10) },
          { x: frontChannelX, y: portalSvgY },
          { x: frontPortalX, y: portalSvgY },
        ],
        5.0,
      );
      lines.push(
        `<path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="front" d="${frontD}" fill="none" stroke="${cable.color_hex}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`,
      );
      lines.push(
        `<circle cx="${frontAnchor.x}" cy="${frontAnchor.y}" r="3.2" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
      );
      lines.push(
        `<circle cx="${frontPortalX}" cy="${portalSvgY}" r="4.0" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
      );

      const rearPortalX = roundCentis(
        rearOriginX + px(38) + uPortalIdx * 68,
      );
      const rearChannelX = roundCentis(rearOriginX + px(12) + pIdx * 4.0);
      const rearD = buildClientRoundedPath(
        [
          { x: rearPortalX, y: portalSvgY },
          { x: rearChannelX, y: portalSvgY },
          { x: rearChannelX, y: roundCentis(rearAnchor.y + 10) },
          { x: rearAnchor.x, y: roundCentis(rearAnchor.y + 10) },
          { x: rearAnchor.x, y: rearAnchor.y },
        ],
        5.0,
      );
      lines.push(
        `<path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="rear" d="${rearD}" fill="none" stroke="${cable.color_hex}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`,
      );
      lines.push(
        `<circle cx="${rearPortalX}" cy="${portalSvgY}" r="4.0" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
      );
      lines.push(
        `<circle cx="${rearAnchor.x}" cy="${rearAnchor.y}" r="3.2" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
      );
    }

    // 2. Side-Profile Depth Cutaway Cable Harness (Z-Y Plane)
    const sideStartX = worldZToSideSvgX(a1.worldZ);
    const sideStartY = a1.y;
    const sideEndX = worldZToSideSvgX(a2.worldZ);
    const sideEndY = a2.y;

    let sidePts: Array<{ readonly x: number; readonly y: number }>;
    if (f1 === 'front' && f2 === 'front') {
      const sIdx = sideFrontIdx++;
      const trackX = worldZToSideSvgX(-15 - (sIdx % 6) * 4.0);
      sidePts = [
        { x: sideStartX, y: sideStartY },
        { x: trackX, y: sideStartY },
        { x: trackX, y: sideEndY },
        { x: sideEndX, y: sideEndY },
      ];
    } else if (f1 === 'rear' && f2 === 'rear') {
      const sIdx = sideRearIdx++;
      const isSameURearJumper = a1.u === a2.u;
      const maxZ = Math.max(a1.worldZ, a2.worldZ);
      const rearTrackZMm = isSameURearJumper
        ? maxZ + 12 + (sIdx % 3) * 3.5
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
      const portalU = route?.portal_u ?? 6;
      const portalSvgY = worldYToSvgY((portalU - 0.5) * MM_PER_U);
      const frontChannelX = worldZToSideSvgX(-24);
      const rearChannelX = worldZToSideSvgX(railDepthMm + 16);
      sidePts =
        f1 === 'front'
          ? [
              { x: sideStartX, y: sideStartY },
              { x: frontChannelX, y: sideStartY },
              { x: frontChannelX, y: portalSvgY },
              { x: rearChannelX, y: portalSvgY },
              { x: rearChannelX, y: sideEndY },
              { x: sideEndX, y: sideEndY },
            ]
          : [
              { x: sideStartX, y: sideStartY },
              { x: rearChannelX, y: sideStartY },
              { x: rearChannelX, y: portalSvgY },
              { x: frontChannelX, y: portalSvgY },
              { x: frontChannelX, y: sideEndY },
              { x: sideEndX, y: sideEndY },
            ];
    }

    const sideD = buildClientRoundedPath(sidePts, 5.0);
    lines.push(
      `<path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="side-halo" d="${sideD}" fill="none" stroke="#09090B" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" opacity="0.86" />`,
    );
    lines.push(
      `<path data-cable-id="${escapeXml(cable.cable_id)}" data-cable-view="side" data-start-xy="${sideStartX},${sideStartY}" data-end-xy="${sideEndX},${sideEndY}" d="${sideD}" fill="none" stroke="${cable.color_hex}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />`,
    );
    lines.push(
      `<circle class="side-cable-plug" cx="${sideStartX}" cy="${sideStartY}" r="3.0" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
    );
    lines.push(
      `<circle class="side-cable-plug" cx="${sideEndX}" cy="${sideEndY}" r="3.0" fill="${cable.color_hex}" stroke="#09090B" stroke-width="1.2" />`,
    );
  }

  lines.push(`</svg>`);
  return lines.join('\n');
}

/**
 * Generates a standalone 2D Wiring & Power Schematic SVG from a `SerializedRackScene`.
 */
export function renderClientSideWiringSvg(scene: SerializedRackScene): string {
  const rowPitch = 30;
  const cables = scene.project.cables;
  const routesById = new Map(scene.cable_routes.map((r) => [r.cable_id, r]));
  const svgWidth = 1360;
  const svgHeight = Math.max(580, 180 + cables.length * rowPitch + 60);

  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">`,
  );
  lines.push(`<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#090D16" />`);
  lines.push(
    `<text x="32" y="36" fill="#F8FAFC" font-size="16" font-weight="700">${escapeXml(scene.project.project_name)} — 2D Wiring &amp; Power Schematic</text>`,
  );
  lines.push(
    `<text x="32" y="58" fill="#94A3B8" font-size="11">Total System Draw: ${roundTenths(scene.validation.power_summary.total_system_watts)}W • PoE Load: ${roundTenths(scene.validation.power_summary.total_poe_watts)}W • Active Connections: ${cables.length}</text>`,
  );

  const leftCardX = 48;
  const leftCardW = 300;
  const rightCardX = 990;
  const rightCardW = 320;
  const baseChannelX = 640;

  for (let i = 0; i < cables.length; i++) {
    const cable = cables[i]!;
    const route = routesById.get(cable.cable_id);
    const commMeters = ((route?.recommended_commercial_mm ?? 500) / 1000).toFixed(2);
    const pinY = 120 + i * rowPitch;
    const startPinX = leftCardX + leftCardW;
    const endPinX = rightCardX;
    const channelX = baseChannelX + i * 14;

    lines.push(
      `<rect x="${leftCardX}" y="${pinY - 12}" width="${leftCardW}" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="1.2" />`,
    );
    lines.push(
      `<text x="${startPinX - 14}" y="${pinY + 4}" fill="#F8FAFC" font-size="10" font-weight="600" text-anchor="end">${escapeXml(`${cable.from.instance_id}:${cable.from.port_id}`)}</text>`,
    );
    lines.push(
      `<circle cx="${startPinX}" cy="${pinY}" r="3.6" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1.2" />`,
    );

    lines.push(
      `<rect x="${rightCardX}" y="${pinY - 12}" width="${rightCardW}" height="24" rx="4" fill="#1E293B" stroke="#334155" stroke-width="1.2" />`,
    );
    lines.push(
      `<text x="${endPinX + 14}" y="${pinY + 4}" fill="#F8FAFC" font-size="10" font-weight="600">${escapeXml(`${cable.to.instance_id}:${cable.to.port_id}`)}</text>`,
    );
    lines.push(
      `<circle cx="${endPinX}" cy="${pinY}" r="3.6" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1.2" />`,
    );

    const d = `M ${startPinX} ${pinY} L ${channelX} ${pinY} L ${endPinX} ${pinY}`;
    lines.push(
      `<path data-schematic-cable="${escapeXml(cable.cable_id)}" d="${d}" fill="none" stroke="${cable.color_hex}" stroke-width="2.2" />`,
    );

    const netParts: string[] = [];
    if (cable.vlan_id !== undefined) netParts.push(`VLAN${cable.vlan_id}`);
    if (cable.ip_cidr !== undefined) netParts.push(cable.ip_cidr);
    const netSuffix = netParts.length > 0 ? ` • ${netParts.join(' ')}` : '';
    const tagText = `${cable.cable_id} | ${commMeters}m ${cable.cable_type}${netSuffix}`;
    const pillW = netSuffix.length > 0 ? 304 : 250;
    lines.push(
      `<rect x="${startPinX + 16}" y="${pinY - 9}" width="${pillW}" height="18" rx="9" fill="#090D16" stroke="${cable.color_hex}" stroke-width="1.2" />`,
    );
    lines.push(
      `<text x="${startPinX + 16 + pillW / 2}" y="${pinY + 3}" fill="#F8FAFC" font-size="8.5" font-weight="600" text-anchor="middle">${escapeXml(tagText.slice(0, 48))}</text>`,
    );
  }

  lines.push(`</svg>`);
  return lines.join('\n');
}

/**
 * Generates a standalone Markdown BOM from a `SerializedRackScene`.
 */
export function renderClientSideBomMarkdown(scene: SerializedRackScene): string {
  const lines: string[] = [];
  lines.push(`# Bill of Materials & Assembly Guide — ${scene.project.project_name}`);
  lines.push('');
  lines.push(
    `- **Validation Status:** \`${scene.validation.status}\` (${scene.validation.error_count} Errors, ${scene.validation.warning_count} Warnings)`,
  );
  lines.push(
    `- **Total Power Load:** \`${roundTenths(scene.validation.power_summary.total_system_watts)} W\` (PoE: \`${roundTenths(scene.validation.power_summary.total_poe_watts)} W\`)`,
  );
  lines.push(
    `- **Total Weight:** \`${roundTenths(scene.validation.mechanical_summary.total_weight_grams / 1000)} kg\``,
  );
  lines.push(
    `- **Thermal & Acoustics:** \`${roundTenths(scene.validation.mechanical_summary.total_thermal_btu_hr)} BTU/hr\` • \`${roundTenths(scene.validation.mechanical_summary.combined_noise_db_a)} dB(A)\` (\`${scene.validation.mechanical_summary.airflow_profile}\`)`,
  );
  lines.push('');
  lines.push('## Mounted Hardware & Sub-Modules');
  for (const dev of scene.geometry.devices) {
    lines.push(
      `- **U${dev.u_position} [${dev.face.toUpperCase()}]** \`${dev.instance_id}\` (${dev.hostname ?? dev.blueprint.model}) — \`${dev.blueprint_slug}\``,
    );
  }
  lines.push('');
  lines.push('## Cable Patch Schedule');
  for (const route of scene.cable_routes) {
    const cable = scene.project.cables.find((c) => c.cable_id === route.cable_id);
    if (!cable) continue;
    const pwrTag = isPowerCableType(cable.cable_type) ? 'POWER' : 'DATA';
    const vlanTag = cable.vlan_id !== undefined ? ` [VLAN ${cable.vlan_id}${cable.ip_cidr ? ` ${cable.ip_cidr}` : ''}]` : '';
    lines.push(
      `- \`${cable.cable_id}\` [${pwrTag}]${vlanTag} \`${cable.from.instance_id}:${cable.from.port_id}\` -> \`${cable.to.instance_id}:${cable.to.port_id}\` (${(route.recommended_commercial_mm / 1000).toFixed(2)}m \`${cable.cable_type}\`)`,
    );
  }
  return lines.join('\n');
}

/**
 * Generates a parametric OpenSCAD (`.scad`) script directly in the browser for any 3D-printable modular carrier.
 */
export function generateClientSideCarrierOpenScad(
  blueprint: HardwareBlueprint,
  rackStandard: RackStandard = '10inch',
): string {
  const spec = EIA_310_SPECS[rackStandard];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(
    blueprint.slots.length === 0 && blueprint.geometry.height_mm < 38.0
      ? uCount * MM_PER_U - 0.75
      : blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75,
  );
  const effectiveSlots =
    blueprint.slots.length > 0
      ? blueprint.slots
      : blueprint.geometry.height_mm < 38.0
        ? [
            {
              slot_id: `${blueprint.slug}-cradle-bay`,
              accepted_slot_type: 'desktop-switch-cradle',
              offset_mm: {
                x: roundCentis((panelWidthMm - blueprint.geometry.width_mm) / 2),
                y: 3.2,
                z: 0,
              },
              max_dimensions_mm: {
                width: blueprint.geometry.width_mm,
                height: blueprint.geometry.height_mm,
                depth: blueprint.geometry.depth_mm,
              },
            },
          ]
        : [];
  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  const lines: string[] = [];
  lines.push(`// ============================================================================`);
  lines.push(`// RackArchitect MCP — Parametric 3D-Printable Rack Carrier (.scad)`);
  lines.push(`// Blueprint: ${blueprint.manufacturer} ${blueprint.model} (${blueprint.slug})`);
  lines.push(`// Standard:  ${rackStandard.toUpperCase()} EIA-310 (${panelWidthMm}mm Total Width, ${uCount}U = ${panelHeightMm}mm)`);
  lines.push(`// Material:  ${blueprint.printable_metadata?.material_recommendation ?? 'PETG / ABS / ASA (4 Perimeters, 25% Gyroid Infill)'}`);
  lines.push(`// ============================================================================`);
  lines.push(``);
  lines.push(`panel_width_mm = ${panelWidthMm};`);
  lines.push(`aperture_width_mm = ${apertureWidthMm};`);
  lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
  lines.push(`panel_height_mm = ${panelHeightMm};`);
  lines.push(`u_count = ${uCount};`);
  lines.push(`faceplate_thickness_mm = 4.2;`);
  lines.push(`tray_depth_mm = ${trayDepthMm};`);
  lines.push(`tray_floor_thickness_mm = 3.2;`);
  lines.push(`side_gusset_thickness_mm = 3.5;`);
  lines.push(`print_tolerance_mm = 0.35;`);
  lines.push(`$fn = 36;`);
  lines.push(``);
  lines.push(`module oval_mounting_slot(slot_w = 10.0, slot_h = 6.5, thickness = 10.0) {`);
  lines.push(`  hull() {`);
  lines.push(`    translate([-(slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`);
  lines.push(`    translate([ (slot_w - slot_h) / 2, 0, -1]) cylinder(d = slot_h, h = thickness);`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`module eia310_ear_holes() {`);
  lines.push(`  left_hole_x = (panel_width_mm - hole_center_pitch_x_mm) / 2;`);
  lines.push(`  right_hole_x = panel_width_mm - left_hole_x;`);
  lines.push(`  for (u = [0 : u_count - 1]) {`);
  lines.push(`    base_y = u * 44.45;`);
  lines.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`);
  lines.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`);
  lines.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
  lines.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
  lines.push(`      }`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`module slot_bay_cutouts() {`);
  for (const slot of effectiveSlots) {
    lines.push(
      `  translate([${roundCentis(slot.offset_mm.x)} - print_tolerance_mm, ${roundCentis(slot.offset_mm.y)} - print_tolerance_mm, -1.0]) cube([${roundCentis(slot.max_dimensions_mm.width)} + 2 * print_tolerance_mm, ${roundCentis(slot.max_dimensions_mm.height)} + 2 * print_tolerance_mm, faceplate_thickness_mm + 2.0]);`,
    );
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`module slot_retention_rails() {`);
  for (const slot of effectiveSlots) {
    if (slot.accepted_slot_type === 'standard-keystone') continue;
    const sx = roundCentis(slot.offset_mm.x);
    const sy = roundCentis(slot.offset_mm.y);
    const sw = roundCentis(slot.max_dimensions_mm.width);
    const sd = roundCentis(Math.min(trayDepthMm - 6, slot.max_dimensions_mm.depth));
    const railHeightMm = roundCentis(Math.min(panelHeightMm, Math.max(8.0, sy + 6.0)));
    lines.push(`  translate([${sx} - print_tolerance_mm - 2.2, 0, faceplate_thickness_mm]) cube([2.2, ${railHeightMm}, ${sd}]);`);
    lines.push(`  translate([${roundCentis(sx + sw)} + print_tolerance_mm, 0, faceplate_thickness_mm]) cube([2.2, ${railHeightMm}, ${sd}]);`);
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`module honeycomb_vent_cutouts() {`);
  lines.push(`  tray_x0 = ${earWidthMm} + 14;`);
  lines.push(`  tray_x1 = panel_width_mm - ${earWidthMm} - 14;`);
  lines.push(`  for (z = [24 : 22 : tray_depth_mm - 18]) {`);
  lines.push(`    for (x = [tray_x0 : 22 : tray_x1]) {`);
  lines.push(`      translate([x, -1.0, z]) rotate([-90, 0, 0]) cylinder(d = 14, h = tray_floor_thickness_mm + 2.0, $fn = 6);`);
  lines.push(`    }`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`union() {`);
  lines.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); eia310_ear_holes(); slot_bay_cutouts(); }`);
  lines.push(`  difference() { translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, tray_floor_thickness_mm, tray_depth_mm - faceplate_thickness_mm]); honeycomb_vent_cutouts(); }`);
  lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm} + aperture_width_mm - side_gusset_thickness_mm, 0, faceplate_thickness_mm]) cube([side_gusset_thickness_mm, panel_height_mm * 0.65, tray_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  slot_retention_rails();`);
  lines.push(`}`);
  return lines.join('\n');
}

interface ClientBox3DMm {
  readonly x0: number;
  readonly y0: number;
  readonly z0: number;
  readonly x1: number;
  readonly y1: number;
  readonly z1: number;
}

function normalizeClientBox(b: ClientBox3DMm): ClientBox3DMm {
  return {
    x0: roundCentis(Math.min(b.x0, b.x1)),
    y0: roundCentis(Math.min(b.y0, b.y1)),
    z0: roundCentis(Math.min(b.z0, b.z1)),
    x1: roundCentis(Math.max(b.x0, b.x1)),
    y1: roundCentis(Math.max(b.y0, b.y1)),
    z1: roundCentis(Math.max(b.z0, b.z1)),
  };
}

function isPointInsideClientBox(
  x: number,
  y: number,
  z: number,
  b: ClientBox3DMm,
): boolean {
  return (
    x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1 && z > b.z0 && z < b.z1
  );
}

function collectUniqueClientCoords(values: readonly number[]): number[] {
  const sorted = [...values].map((v) => roundCentis(v)).sort((a, b) => a - b);
  const unique: number[] = [];
  for (const val of sorted) {
    const prev = unique[unique.length - 1];
    if (prev === undefined || Math.abs(val - prev) > 1e-3) {
      unique.push(val);
    }
  }
  return unique;
}

/**
 * Generates a watertight, 2-manifold ASCII `.stl` mesh directly in the browser for any 3D-printable modular carrier.
 */
export function generateClientSideCarrierStl(
  blueprint: HardwareBlueprint,
  rackStandard: RackStandard = '10inch',
): string {
  const spec = EIA_310_SPECS[rackStandard];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(
    blueprint.slots.length === 0 && blueprint.geometry.height_mm < 38.0
      ? uCount * MM_PER_U - 0.75
      : blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75,
  );
  const effectiveSlots =
    blueprint.slots.length > 0
      ? blueprint.slots
      : blueprint.geometry.height_mm < 38.0
        ? [
            {
              slot_id: `${blueprint.slug}-cradle-bay`,
              accepted_slot_type: 'desktop-switch-cradle',
              offset_mm: {
                x: roundCentis((panelWidthMm - blueprint.geometry.width_mm) / 2),
                y: 3.2,
                z: 0,
              },
              max_dimensions_mm: {
                width: blueprint.geometry.width_mm,
                height: blueprint.geometry.height_mm,
                depth: blueprint.geometry.depth_mm,
              },
            },
          ]
        : [];
  const faceplateThicknessMm = 4.2;
  const trayFloorThicknessMm = 3.2;
  const sideGussetThicknessMm = 3.5;
  const printToleranceMm = 0.35;
  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  const faceplateBox = normalizeClientBox({
    x0: 0,
    y0: 0,
    z0: 0,
    x1: panelWidthMm,
    y1: panelHeightMm,
    z1: faceplateThicknessMm,
  });

  const trayFloorBox = normalizeClientBox({
    x0: earWidthMm,
    y0: 0,
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: trayFloorThicknessMm,
    z1: trayDepthMm,
  });

  const gussetHeightMm = roundCentis(panelHeightMm * 0.65);
  const gussetBoxes: ClientBox3DMm[] = [
    normalizeClientBox({
      x0: earWidthMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: earWidthMm + sideGussetThicknessMm,
      y1: gussetHeightMm,
      z1: trayDepthMm,
    }),
    normalizeClientBox({
      x0: panelWidthMm - earWidthMm - sideGussetThicknessMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: panelWidthMm - earWidthMm,
      y1: gussetHeightMm,
      z1: trayDepthMm,
    }),
  ];

  const leftHoleX = roundCentis((panelWidthMm - holePitchXMm) / 2);
  const rightHoleX = roundCentis(panelWidthMm - leftHoleX);
  const earHoleBoxes: ClientBox3DMm[] = [];
  for (let u = 0; u < uCount; u++) {
    const baseY = u * MM_PER_U;
    for (const offsetY of [6.35, 22.225, 38.1]) {
      const cy = roundCentis(baseY + offsetY);
      if (cy + 3.25 < panelHeightMm - 1.5 && cy - 3.25 > 1.5) {
        earHoleBoxes.push(
          normalizeClientBox({
            x0: Math.max(1.2, leftHoleX - 5.0),
            y0: cy - 3.25,
            z0: -1,
            x1: Math.min(earWidthMm - 1.2, leftHoleX + 5.0),
            y1: cy + 3.25,
            z1: faceplateThicknessMm + 1,
          }),
          normalizeClientBox({
            x0: Math.max(panelWidthMm - earWidthMm + 1.2, rightHoleX - 5.0),
            y0: cy - 3.25,
            z0: -1,
            x1: Math.min(panelWidthMm - 1.2, rightHoleX + 5.0),
            y1: cy + 3.25,
            z1: faceplateThicknessMm + 1,
          }),
        );
      }
    }
  }

  const slotCutoutBoxes: ClientBox3DMm[] = [];
  const railBoxes: ClientBox3DMm[] = [];
  for (const slot of effectiveSlots) {
    const sx0 = roundCentis(
      Math.max(earWidthMm + 1.0, slot.offset_mm.x - printToleranceMm),
    );
    const sx1 = roundCentis(
      Math.min(
        panelWidthMm - earWidthMm - 1.0,
        slot.offset_mm.x + slot.max_dimensions_mm.width + printToleranceMm,
      ),
    );
    const sy0 = roundCentis(Math.max(1.2, slot.offset_mm.y - printToleranceMm));
    const sy1 = roundCentis(
      Math.min(
        panelHeightMm - 1.2,
        slot.offset_mm.y + slot.max_dimensions_mm.height + printToleranceMm,
      ),
    );
    if (sx1 > sx0 && sy1 > sy0) {
      slotCutoutBoxes.push(
        normalizeClientBox({
          x0: sx0,
          y0: sy0,
          z0: -1,
          x1: sx1,
          y1: sy1,
          z1: faceplateThicknessMm + 1,
        }),
      );
    }

    if (slot.accepted_slot_type !== 'standard-keystone') {
      const sd = roundCentis(
        Math.min(trayDepthMm - 6, slot.max_dimensions_mm.depth),
      );
      const railHeightMm = roundCentis(
        Math.min(panelHeightMm, Math.max(8.0, slot.offset_mm.y + 6.0)),
      );
      const leftRailX0 = roundCentis(
        Math.max(earWidthMm + sideGussetThicknessMm, sx0 - 2.2),
      );
      if (sx0 - leftRailX0 >= 1.0) {
        railBoxes.push(
          normalizeClientBox({
            x0: leftRailX0,
            y0: 0,
            z0: faceplateThicknessMm,
            x1: sx0,
            y1: railHeightMm,
            z1: faceplateThicknessMm + sd,
          }),
        );
      }
      const rightRailX1 = roundCentis(
        Math.min(panelWidthMm - earWidthMm - sideGussetThicknessMm, sx1 + 2.2),
      );
      if (rightRailX1 - sx1 >= 1.0) {
        railBoxes.push(
          normalizeClientBox({
            x0: sx1,
            y0: 0,
            z0: faceplateThicknessMm,
            x1: rightRailX1,
            y1: railHeightMm,
            z1: faceplateThicknessMm + sd,
          }),
        );
      }
    }
  }

  const ventCutoutBoxes: ClientBox3DMm[] = [];
  const ventXMin = roundCentis(earWidthMm + sideGussetThicknessMm + 10);
  const ventXMax = roundCentis(
    panelWidthMm - earWidthMm - sideGussetThicknessMm - 10,
  );
  for (let z = 20; z + 12 <= trayDepthMm - 12; z += 22) {
    for (let x = ventXMin; x + 12 <= ventXMax; x += 22) {
      const vx0 = roundCentis(x);
      const vx1 = roundCentis(x + 12);
      const vz0 = roundCentis(z);
      const vz1 = roundCentis(z + 12);
      const overlapsRail = railBoxes.some(
        (r) =>
          vx1 > r.x0 - 2.0 &&
          vx0 < r.x1 + 2.0 &&
          vz1 > r.z0 - 2.0 &&
          vz0 < r.z1 + 2.0,
      );
      if (!overlapsRail) {
        ventCutoutBoxes.push(
          normalizeClientBox({
            x0: vx0,
            y0: -1,
            z0: vz0,
            x1: vx1,
            y1: trayFloorThicknessMm + 1,
            z1: vz1,
          }),
        );
      }
    }
  }

  const allBoxes = [
    faceplateBox,
    trayFloorBox,
    ...gussetBoxes,
    ...earHoleBoxes,
    ...slotCutoutBoxes,
    ...railBoxes,
    ...ventCutoutBoxes,
  ];

  const xs = collectUniqueClientCoords(
    allBoxes
      .flatMap((b) => [b.x0, b.x1])
      .filter((x) => x >= 0 && x <= panelWidthMm),
  );
  const ys = collectUniqueClientCoords(
    allBoxes
      .flatMap((b) => [b.y0, b.y1])
      .filter((y) => y >= 0 && y <= panelHeightMm),
  );
  const zs = collectUniqueClientCoords(
    allBoxes
      .flatMap((b) => [b.z0, b.z1])
      .filter((z) => z >= 0 && z <= trayDepthMm),
  );

  const nx = xs.length - 1;
  const ny = ys.length - 1;
  const nz = zs.length - 1;

  const isCellSolid = (ix: number, iy: number, iz: number): boolean => {
    if (ix < 0 || ix >= nx || iy < 0 || iy >= ny || iz < 0 || iz >= nz) {
      return false;
    }
    const x0 = xs[ix]!;
    const x1 = xs[ix + 1]!;
    const y0 = ys[iy]!;
    const y1 = ys[iy + 1]!;
    const z0 = zs[iz]!;
    const z1 = zs[iz + 1]!;
    const mx = 0.5 * (x0 + x1);
    const my = 0.5 * (y0 + y1);
    const mz = 0.5 * (z0 + z1);

    const inFaceplate =
      isPointInsideClientBox(mx, my, mz, faceplateBox) &&
      !earHoleBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b)) &&
      !slotCutoutBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    const inTrayFloor =
      isPointInsideClientBox(mx, my, mz, trayFloorBox) &&
      !ventCutoutBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    const inGusset = gussetBoxes.some((b) =>
      isPointInsideClientBox(mx, my, mz, b),
    );
    const inRail = railBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    return inFaceplate || inTrayFloor || inGusset || inRail;
  };

  const solidGrid: boolean[][][] = [];
  for (let ix = 0; ix < nx; ix++) {
    const ySlice: boolean[][] = [];
    for (let iy = 0; iy < ny; iy++) {
      const zRow: boolean[] = [];
      for (let iz = 0; iz < nz; iz++) {
        zRow.push(isCellSolid(ix, iy, iz));
      }
      ySlice.push(zRow);
    }
    solidGrid.push(ySlice);
  }

  const getSolid = (ix: number, iy: number, iz: number): boolean =>
    solidGrid[ix]?.[iy]?.[iz] ?? false;

  const solidName = blueprint.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
  const lines: string[] = [`solid ${solidName}`];

  const emitTri = (
    normX: number,
    normY: number,
    normZ: number,
    v1: readonly [number, number, number],
    v2: readonly [number, number, number],
    v3: readonly [number, number, number],
  ) => {
    lines.push(`  facet normal ${normX} ${normY} ${normZ}`);
    lines.push(`    outer loop`);
    lines.push(`      vertex ${v1[0]} ${v1[1]} ${v1[2]}`);
    lines.push(`      vertex ${v2[0]} ${v2[1]} ${v2[2]}`);
    lines.push(`      vertex ${v3[0]} ${v3[1]} ${v3[2]}`);
    lines.push(`    endloop`);
    lines.push(`  endfacet`);
  };

  for (let ix = 0; ix < nx; ix++) {
    const x0 = xs[ix]!;
    const x1 = xs[ix + 1]!;
    for (let iy = 0; iy < ny; iy++) {
      const y0 = ys[iy]!;
      const y1 = ys[iy + 1]!;
      for (let iz = 0; iz < nz; iz++) {
        if (!getSolid(ix, iy, iz)) continue;
        const z0 = zs[iz]!;
        const z1 = zs[iz + 1]!;

        if (!getSolid(ix, iy, iz - 1)) {
          emitTri(0, 0, -1, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);
          emitTri(0, 0, -1, [x0, y0, z0], [x1, y1, z0], [x1, y0, z0]);
        }
        if (!getSolid(ix, iy, iz + 1)) {
          emitTri(0, 0, 1, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1]);
          emitTri(0, 0, 1, [x0, y0, z1], [x1, y1, z1], [x0, y1, z1]);
        }
        if (!getSolid(ix, iy - 1, iz)) {
          emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]);
          emitTri(0, -1, 0, [x0, y0, z0], [x1, y0, z1], [x0, y0, z1]);
        }
        if (!getSolid(ix, iy + 1, iz)) {
          emitTri(0, 1, 0, [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]);
          emitTri(0, 1, 0, [x0, y1, z0], [x1, y1, z1], [x1, y1, z0]);
        }
        if (!getSolid(ix - 1, iy, iz)) {
          emitTri(-1, 0, 0, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]);
          emitTri(-1, 0, 0, [x0, y0, z0], [x0, y1, z1], [x0, y1, z0]);
        }
        if (!getSolid(ix + 1, iy, iz)) {
          emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
          emitTri(1, 0, 0, [x1, y0, z0], [x1, y1, z1], [x1, y0, z1]);
        }
      }
    }
  }

  lines.push(`endsolid ${solidName}`);
  return lines.join('\n');
}
