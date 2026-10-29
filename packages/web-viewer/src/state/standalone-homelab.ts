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
        instance_id: 'cover-u2',
        blueprint_slug: '3dprint-10inch-cover-panel-lines-1u',
        hostname: 'cover-panel-u2',
        u_position: 2,
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
        cable_id: 'patch-front-p6-wan',
        cable_type: 'cat6a',
        color_hex: '#EC4899',
        label: 'Patch P6 -> U3 WAN Keystone (ISP Glasfaser-ONT 2.5G)',
        vlan_id: 900,
        from: { instance_id: 'patch-u7', port_id: 'p6', face: 'front' },
        to: { instance_id: 'ks-u3-wan', port_id: 'coupler', face: 'front' },
      },
      {
        cable_id: 'patch-front-p7-sw7',
        cable_type: 'cat6a',
        color_hex: '#0EA5E9',
        label: 'Patch P7 -> Switch Port 7 (PoE+ Wi-Fi 7 AP EG, 21W)',
        vlan_id: 20,
        from: { instance_id: 'patch-u7', port_id: 'p7', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth7', face: 'front' },
      },
      {
        cable_id: 'patch-front-p8-sw8',
        cable_type: 'cat6a',
        color_hex: '#F59E0B',
        label: 'Patch P8 -> Switch Port 8 (PoE+ 4K Kamera Einfahrt, 12.5W)',
        vlan_id: 30,
        from: { instance_id: 'patch-u7', port_id: 'p8', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth8', face: 'front' },
      },
      {
        cable_id: 'patch-front-p9-sw9',
        cable_type: 'cat6a',
        color_hex: '#14B8A6',
        label: 'Patch P9 -> Switch Port 9 (Home-Office 2.5G LAN)',
        vlan_id: 10,
        from: { instance_id: 'patch-u7', port_id: 'p9', face: 'front' },
        to: { instance_id: 'sw-u8', port_id: 'eth9', face: 'front' },
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
    external_endpoints: [
      {
        endpoint_id: 'ext-isp-wan',
        label: 'ISP Glasfaser-ONT (2.5G WAN-Uplink)',
        category: 'isp-wan-uplink',
        room_or_zone: 'Hausanschluss / Keller (Glasfaser-Übergabepunkt)',
        patch_panel_instance_id: 'patch-u7',
        patch_panel_port_id: 'p6',
        entry_position: 'top-rear',
        color_hex: '#EC4899',
        poe_draw_watts: 0,
        required_speed: '2.5gbe',
        vlan_id: 900,
      },
      {
        endpoint_id: 'ext-ap-eg',
        label: 'UniFi U7-Pro Wi-Fi 7 Decken-AP',
        category: 'wifi-ap',
        room_or_zone: 'Erdgeschoss Flur / Wohnbereich',
        patch_panel_instance_id: 'patch-u7',
        patch_panel_port_id: 'p7',
        entry_position: 'top-rear',
        color_hex: '#0EA5E9',
        poe_draw_watts: 21,
        required_speed: '2.5gbe',
        vlan_id: 20,
      },
      {
        endpoint_id: 'ext-cam-einfahrt',
        label: '4K PoE+ Überwachungskamera Einfahrt & Haustür',
        category: 'poe-camera',
        room_or_zone: 'Außenbereich Nord / Einfahrt',
        patch_panel_instance_id: 'patch-u7',
        patch_panel_port_id: 'p8',
        entry_position: 'top-rear',
        color_hex: '#F59E0B',
        poe_draw_watts: 12.5,
        required_speed: '1gbe',
        vlan_id: 30,
      },
      {
        endpoint_id: 'ext-office-lan',
        label: 'Home-Office 2.5G Workstation-Dose',
        category: 'workstation-dock',
        room_or_zone: 'Obergeschoss Arbeitszimmer',
        patch_panel_instance_id: 'patch-u7',
        patch_panel_port_id: 'p9',
        entry_position: 'top-rear',
        color_hex: '#14B8A6',
        poe_draw_watts: 0,
        required_speed: '2.5gbe',
        vlan_id: 10,
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
      let extraFrontSvg = '';
      if (dev.blueprint.category === 'nas') {
        const slug = dev.blueprint.slug;
        const bayCount =
          slug.includes('8bay') || slug.includes('rs1221')
            ? 8
            : slug.includes('7bay') || slug.includes('unas')
              ? 7
              : 4;
        const cols = 4;
        const rows = bayCount > 4 ? 2 : 1;
        const bayX0 = roundCentis(x + px(34));
        const bayW = Math.max(px(50), w - px(52));
        const bayY0 = roundCentis(y + px(7));
        const bayH = Math.max(px(16), h - px(12));
        const cellW = bayW / cols;
        const cellH = bayH / rows;
        const bayRects: string[] = [];
        for (let bi = 0; bi < bayCount; bi++) {
          const r = Math.floor(bi / cols);
          const c = bi % cols;
          const bx = roundCentis(bayX0 + c * cellW + 3);
          const bw = roundCentis(cellW - 6);
          const by = roundCentis(bayY0 + r * cellH + 2.5);
          const bh = roundCentis(cellH - 5);
          bayRects.push(
            `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="1.5" fill="#18181B" stroke="#52525B" stroke-width="1" /><circle cx="${roundCentis(bx + bw - 5)}" cy="${roundCentis(by + 5)}" r="1.5" fill="#10B981" />`,
          );
        }
        extraFrontSvg = bayRects.join('');
      } else if (
        dev.blueprint.category === 'blank-panel' ||
        dev.blueprint.category === 'blanking-panel'
      ) {
        const slug = dev.blueprint.slug;
        const innerX = roundCentis(x + px(8));
        const innerW = Math.max(20, roundCentis(w - px(16)));
        const innerY = roundCentis(y + px(4.5));
        const innerH = Math.max(8, roundCentis(h - px(9)));
        const patternParts: string[] = [
          `<rect x="${innerX}" y="${innerY}" width="${innerW}" height="${innerH}" rx="1.5" fill="#18181B" fill-opacity="0.55" stroke="#3F3F46" stroke-width="0.9" />`,
        ];
        if (slug.includes('-hex')) {
          const rows = dev.blueprint.geometry.u_height >= 2 ? 4 : 2;
          const cols = 8;
          const cellPitchX = (innerW - 12) / cols;
          const cellPitchY = (innerH - 8) / rows;
          for (let r = 0; r < rows; r++) {
            const cy = roundCentis(innerY + 4 + (r + 0.5) * cellPitchY);
            const shiftX = r % 2 === 1 ? 3 : -3;
            for (let c = 0; c < cols; c++) {
              const cx = roundCentis(innerX + 6 + (c + 0.5) * cellPitchX + shiftX);
              patternParts.push(
                `<circle cx="${cx}" cy="${cy}" r="3.4" fill="#09090B" stroke="#52525B" stroke-width="0.9" />`,
              );
            }
          }
        } else if (slug.includes('-ribs')) {
          const ribCount = 12;
          const stepX = (innerW - 12) / ribCount;
          for (let ri = 0; ri < ribCount; ri++) {
            const rx = roundCentis(innerX + 6 + (ri + 0.3) * stepX);
            patternParts.push(
              `<rect x="${rx}" y="${roundCentis(innerY + 3)}" width="${roundCentis(stepX * 0.42)}" height="${roundCentis(innerH - 6)}" rx="0.8" fill="#09090B" stroke="#71717A" stroke-width="0.8" />`,
            );
          }
        } else {
          const lineCount = dev.blueprint.geometry.u_height >= 2 ? 6 : 3;
          const stepY = lineCount > 1 ? (innerH - 12) / (lineCount - 1) : 0;
          for (let li = 0; li < lineCount; li++) {
            const ly = roundCentis(innerY + 6 + li * stepY);
            patternParts.push(
              `<line x1="${roundCentis(innerX + 8)}" y1="${ly}" x2="${roundCentis(innerX + innerW - 8)}" y2="${ly}" stroke="#52525B" stroke-width="2.0" stroke-linecap="round" />`,
            );
          }
        }
        extraFrontSvg = patternParts.join('');
      }
      lines.push(
        `<g data-instance-id="${escapeXml(dev.instance_id)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" stroke="${isSubModule ? '#3B82F6' : '#52525B'}" stroke-width="1.3" />${extraFrontSvg}${!isCarrier ? `<text x="${x + 6}" y="${y + 11}" fill="#E4E4E7" font-size="8.2" font-weight="700">${escapeXml(dev.hostname ?? dev.instance_id)}</text>` : ''}</g>`,
      );
    }

    const isShallowFrontBlankPanel =
      dev.face === 'front' &&
      (dev.blueprint.category === 'blank-panel' ||
        dev.blueprint.category === 'blanking-panel') &&
      dev.ports.length === 0;
    if (!isShallowFrontBlankPanel) {
      const rearX = roundCentis(
        rearOriginX + px(panelWidthMm - dev.chassis_box.max.x),
      );
      lines.push(
        `<g data-rear-instance="${escapeXml(dev.instance_id)}"><rect x="${rearX}" y="${y}" width="${w}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" fill-opacity="${dev.face === 'rear' ? '1' : '0.82'}" stroke="${dev.face === 'rear' ? '#F59E0B' : '#3F3F46'}" stroke-width="1.2" /></g>`,
      );
    }

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

  // Render External Building / ISP Drops (`external_endpoints`) entering from Top-Rear / Bottom-Rear
  const externalEndpoints = scene.project.external_endpoints ?? [];
  if (externalEndpoints.length > 0) {
    lines.push(`<g data-layer="external-building-drops">`);
    const collarWidthPx = Math.min(
      rackWidthPx * 0.56,
      Math.max(92, externalEndpoints.length * 16 + 34),
    );
    const rearCollarX = roundCentis(
      rearOriginX + (rackWidthPx - collarWidthPx) / 2,
    );
    const topCollarY = roundCentis(topMarginPx - 14);
    lines.push(
      `<rect x="${rearCollarX}" y="${topCollarY}" width="${collarWidthPx}" height="12" rx="3" fill="#18181D" stroke="#52525B" stroke-width="1.2" />`,
    );
    lines.push(
      `<text x="${roundCentis(rearOriginX + rackWidthPx / 2)}" y="${roundCentis(topCollarY + 8.5)}" fill="#E4E4E7" font-size="7.2" font-weight="700" text-anchor="middle">TOP-REAR ISP / BUILDING CONDUIT (${externalEndpoints.length}x)</text>`,
    );

    const sideConduitZMm = Math.min(
      railDepthMm - 18,
      Math.max(120, railDepthMm * 0.72),
    );
    const sideCollarX = worldZToSideSvgX(sideConduitZMm);
    lines.push(
      `<rect x="${roundCentis(sideCollarX - 34)}" y="${topCollarY}" width="68" height="12" rx="3" fill="#18181D" stroke="#52525B" stroke-width="1.2" />`,
    );
    lines.push(
      `<text x="${sideCollarX}" y="${roundCentis(topCollarY + 8.5)}" fill="#E4E4E7" font-size="7" font-weight="700" text-anchor="middle">ROOF ENTRY</text>`,
    );

    externalEndpoints.forEach((ext, idx) => {
      const rearAnchor =
        portAnchors.get(
          `${ext.patch_panel_instance_id}:${ext.patch_panel_port_id}:rear`,
        ) ??
        portAnchors.get(
          `${ext.patch_panel_instance_id}:${ext.patch_panel_port_id}:front`,
        );
      if (!rearAnchor) return;

      const entrySpreadX = roundCentis(
        rearOriginX +
          rackWidthPx / 2 +
          (idx - (externalEndpoints.length - 1) / 2) * 12,
      );
      const entryY =
        ext.entry_position === 'bottom-rear'
          ? roundCentis(topMarginPx + rackHeightPx + 10)
          : roundCentis(topCollarY + 12);
      const combY = roundCentis(rearAnchor.y - 10 - (idx % 3) * 2.8);

      const rearDropD = buildClientRoundedPath(
        [
          { x: entrySpreadX, y: entryY },
          { x: entrySpreadX, y: combY },
          { x: rearAnchor.x, y: combY },
          { x: rearAnchor.x, y: rearAnchor.y },
        ],
        4.5,
      );
      lines.push(
        `<path data-external-endpoint-id="${escapeXml(ext.endpoint_id)}" data-external-view="rear" d="${rearDropD}" fill="none" stroke="${ext.color_hex}" stroke-width="2.1" stroke-dasharray="5,2" stroke-linecap="round" stroke-linejoin="round" />`,
      );
      lines.push(
        `<circle cx="${rearAnchor.x}" cy="${rearAnchor.y}" r="3.0" fill="${ext.color_hex}" stroke="#09090B" stroke-width="1.1" />`,
      );

      // Side-Cutaway Top-Rear Drop Path
      const sideTrackX = worldZToSideSvgX(sideConduitZMm - 10 + idx * 4.5);
      const sidePortX = worldZToSideSvgX(rearAnchor.worldZ);
      const sideDropD = buildClientRoundedPath(
        [
          { x: sideTrackX, y: entryY },
          { x: sideTrackX, y: rearAnchor.y },
          { x: sidePortX, y: rearAnchor.y },
        ],
        4.5,
      );
      lines.push(
        `<path data-external-endpoint-id="${escapeXml(ext.endpoint_id)}" data-external-view="side" d="${sideDropD}" fill="none" stroke="${ext.color_hex}" stroke-width="2.0" stroke-dasharray="5,2" stroke-linecap="round" stroke-linejoin="round" />`,
      );
      lines.push(
        `<circle cx="${sidePortX}" cy="${rearAnchor.y}" r="2.8" fill="${ext.color_hex}" stroke="#09090B" stroke-width="1.1" />`,
      );
    });
    lines.push(`</g>`);
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
  if ((scene.project.external_endpoints ?? []).length > 0) {
    lines.push('');
    lines.push('## External Building & ISP Cable Drops (Top-Rear Entry)');
    for (const ext of scene.project.external_endpoints) {
      const poeBadge =
        ext.poe_draw_watts > 0 ? `PoE ${ext.poe_draw_watts}W` : 'Non-PoE';
      const roomSuffix = ext.room_or_zone ? ` (${ext.room_or_zone})` : '';
      lines.push(
        `- **${ext.label}**${roomSuffix} [\`${ext.category}\`, ${poeBadge}, \`${ext.entry_position}\`] -> \`${ext.patch_panel_instance_id}:${ext.patch_panel_port_id}\` (REAR)`,
      );
    }
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
  const effectiveStd: RackStandard =
    blueprint.mount_type === 'rackmount-19'
      ? '19inch'
      : blueprint.mount_type === 'rackmount-6'
        ? '6inch'
        : blueprint.mount_type === 'rackmount-10'
          ? '10inch'
          : rackStandard;
  const spec = EIA_310_SPECS[effectiveStd];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(
    blueprint.slots.length === 0 && blueprint.geometry.height_mm < 38.0
      ? uCount * MM_PER_U - 0.75
      : blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75,
  );
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);
  const isCoverPanel =
    blueprint.category === 'blank-panel' ||
    blueprint.category === 'blanking-panel';

  if (isCoverPanel) {
    const slug = blueprint.slug;
    const pattern = slug.includes('-hex')
      ? 'hex'
      : slug.includes('-ribs')
        ? 'ribs'
        : slug.includes('-lines')
          ? 'lines'
          : 'bevel';
    const totalDepthMm = roundCentis(Math.max(6.0, blueprint.geometry.depth_mm));
    const patX0 = roundCentis(earWidthMm + 10.0);
    const patW = roundCentis(apertureWidthMm - 20.0);
    const lines: string[] = [];
    lines.push(`// ============================================================================`);
    lines.push(`// RackArchitect MCP — Parametric 3D-Printable Slot Cover Panel (.scad)`);
    lines.push(`// Blueprint: ${blueprint.manufacturer} ${blueprint.model} (${blueprint.slug})`);
    lines.push(`// Standard:  ${effectiveStd.toUpperCase()} EIA-310 (${panelWidthMm}mm Total Width, ${uCount}U = ${panelHeightMm}mm)`);
    lines.push(`// Pattern:   ${pattern.toUpperCase()} (Closed Front Faceplate — Zero Cable Pass-Through)`);
    lines.push(`// Material:  ${blueprint.printable_metadata?.material_recommendation ?? 'PETG / PLA / ASA'}`);
    lines.push(`// ============================================================================`);
    lines.push(``);
    lines.push(`panel_width_mm = ${panelWidthMm};`);
    lines.push(`aperture_width_mm = ${apertureWidthMm};`);
    lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
    lines.push(`panel_height_mm = ${panelHeightMm};`);
    lines.push(`u_count = ${uCount};`);
    lines.push(`faceplate_thickness_mm = 4.2;`);
    lines.push(`stiffener_depth_mm = ${totalDepthMm};`);
    lines.push(`stiffener_wall_mm = 3.2;`);
    lines.push(`pattern_groove_depth_mm = 1.4;`);
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
    if (pattern === 'lines') {
      const lineCount = uCount * 3;
      const marginY = 8.0;
      const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
      for (let i = 0; i < lineCount; i++) {
        lines.push(`  translate([${patX0}, ${roundCentis(marginY + i * stepY - 1.2)}, -0.5]) cube([${patW}, 2.4, pattern_groove_depth_mm + 0.5]);`);
      }
    } else if (pattern === 'hex') {
      const rows = uCount * 2;
      const cols = Math.max(5, Math.min(14, Math.floor(patW / 20)));
      const pitchX = roundCentis(patW / cols);
      const pitchY = roundCentis((panelHeightMm - 12.0) / rows);
      for (let r = 0; r < rows; r++) {
        const cy = roundCentis(6.0 + (r + 0.5) * pitchY);
        const rowShift = r % 2 === 1 ? roundCentis(pitchX * 0.25) : -roundCentis(pitchX * 0.25);
        for (let c = 0; c < cols; c++) {
          const cx = roundCentis(patX0 + (c + 0.5) * pitchX + rowShift);
          lines.push(`  translate([${cx}, ${cy}, -0.5]) cylinder(d = ${roundCentis(Math.min(pitchX, pitchY) * 0.68)}, h = pattern_groove_depth_mm + 0.5, $fn = 6);`);
        }
      }
    } else if (pattern === 'ribs') {
      const ribCount = Math.max(8, Math.min(20, Math.floor(patW / 14)));
      const pitchX = patW / ribCount;
      const grooveW = roundCentis(Math.max(3.0, pitchX * 0.45));
      for (let i = 0; i < ribCount; i++) {
        lines.push(`  translate([${roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2)}, 6.0, -0.5]) cube([${grooveW}, ${roundCentis(panelHeightMm - 12.0)}, pattern_groove_depth_mm + 0.5]);`);
      }
    } else {
      lines.push(`  translate([${patX0}, ${roundCentis(panelHeightMm / 2 - 1.2)}, -0.5]) cube([${patW}, 2.4, pattern_groove_depth_mm + 0.5]);`);
    }
    lines.push(`}`);
    lines.push(``);
    lines.push(`union() {`);
    lines.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); eia310_ear_holes(); slot_bay_cutouts(); }`);
    lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
    lines.push(`  translate([${earWidthMm}, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
    lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
    lines.push(`  translate([${earWidthMm} + aperture_width_mm - stiffener_wall_mm, 0, faceplate_thickness_mm]) cube([stiffener_wall_mm, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
    lines.push(`}`);
    return lines.join('\n');
  }

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
  const effectiveStd: RackStandard =
    blueprint.mount_type === 'rackmount-19'
      ? '19inch'
      : blueprint.mount_type === 'rackmount-6'
        ? '6inch'
        : blueprint.mount_type === 'rackmount-10'
          ? '10inch'
          : rackStandard;
  const spec = EIA_310_SPECS[effectiveStd];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(
    blueprint.slots.length === 0 && blueprint.geometry.height_mm < 38.0
      ? uCount * MM_PER_U - 0.75
      : blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75,
  );
  const isCoverPanel =
    blueprint.category === 'blank-panel' ||
    blueprint.category === 'blanking-panel';
  const effectiveSlots =
    isCoverPanel
      ? []
      : blueprint.slots.length > 0
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
  const trayDepthMm = isCoverPanel
    ? roundCentis(Math.max(6.0, blueprint.geometry.depth_mm))
    : roundCentis(Math.max(40, blueprint.geometry.depth_mm));
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

  const topStiffenerBox = isCoverPanel
    ? normalizeClientBox({
        x0: earWidthMm,
        y0: roundCentis(panelHeightMm - trayFloorThicknessMm),
        z0: faceplateThicknessMm,
        x1: panelWidthMm - earWidthMm,
        y1: panelHeightMm,
        z1: trayDepthMm,
      })
    : null;

  const gussetHeightMm = isCoverPanel
    ? panelHeightMm
    : roundCentis(panelHeightMm * 0.65);
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

  const patternGrooveBoxes: ClientBox3DMm[] = [];
  if (isCoverPanel) {
    const slug = blueprint.slug;
    const pattern = slug.includes('-hex')
      ? 'hex'
      : slug.includes('-ribs')
        ? 'ribs'
        : slug.includes('-lines')
          ? 'lines'
          : 'bevel';
    const patX0 = roundCentis(earWidthMm + 10.0);
    const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
    const patW = roundCentis(patX1 - patX0);
    const grooveDepthMm = 1.4;

    if (pattern === 'lines') {
      const lineCount = uCount * 3;
      const marginY = 8.0;
      const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
      for (let i = 0; i < lineCount; i++) {
        const gy0 = roundCentis(marginY + i * stepY - 1.2);
        patternGrooveBoxes.push(
          normalizeClientBox({
            x0: patX0,
            y0: gy0,
            z0: -1,
            x1: patX1,
            y1: roundCentis(gy0 + 2.4),
            z1: grooveDepthMm,
          }),
        );
      }
    } else if (pattern === 'hex') {
      const rows = uCount * 2;
      const cols = Math.max(5, Math.min(10, Math.floor(patW / 24)));
      const pitchX = patW / cols;
      const pitchY = (panelHeightMm - 12.0) / rows;
      const cellW = roundCentis(pitchX * 0.62);
      const cellH = roundCentis(pitchY * 0.6);
      for (let r = 0; r < rows; r++) {
        const cy = 6.0 + (r + 0.5) * pitchY;
        const shiftX = r % 2 === 1 ? pitchX * 0.16 : -pitchX * 0.16;
        for (let c = 0; c < cols; c++) {
          const cx = patX0 + (c + 0.5) * pitchX + shiftX;
          const x0 = roundCentis(Math.max(patX0, cx - cellW / 2));
          const x1 = roundCentis(Math.min(patX1, cx + cellW / 2));
          const y0 = roundCentis(cy - cellH / 2);
          const y1 = roundCentis(cy + cellH / 2);
          if (x1 - x0 >= 3.0 && y1 - y0 >= 3.0) {
            patternGrooveBoxes.push(
              normalizeClientBox({
                x0,
                y0,
                z0: -1,
                x1,
                y1,
                z1: grooveDepthMm,
              }),
            );
          }
        }
      }
    } else if (pattern === 'ribs') {
      const ribCount = Math.max(8, Math.min(14, Math.floor(patW / 16)));
      const pitchX = patW / ribCount;
      const grooveW = roundCentis(Math.max(3.0, pitchX * 0.45));
      for (let i = 0; i < ribCount; i++) {
        const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
        patternGrooveBoxes.push(
          normalizeClientBox({
            x0: gx0,
            y0: 6.0,
            z0: -1,
            x1: roundCentis(gx0 + grooveW),
            y1: roundCentis(panelHeightMm - 6.0),
            z1: grooveDepthMm,
          }),
        );
      }
    } else {
      patternGrooveBoxes.push(
        normalizeClientBox({
          x0: patX0,
          y0: roundCentis(panelHeightMm / 2 - 1.2),
          z0: -1,
          x1: patX1,
          y1: roundCentis(panelHeightMm / 2 + 1.2),
          z1: grooveDepthMm,
        }),
      );
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
  if (!isCoverPanel) {
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
  }

  const allBoxes = [
    faceplateBox,
    trayFloorBox,
    ...(topStiffenerBox ? [topStiffenerBox] : []),
    ...gussetBoxes,
    ...earHoleBoxes,
    ...patternGrooveBoxes,
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
      !patternGrooveBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b)) &&
      !slotCutoutBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    const inTrayFloor =
      isPointInsideClientBox(mx, my, mz, trayFloorBox) &&
      !ventCutoutBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    const inTopStiffener =
      topStiffenerBox !== null &&
      isPointInsideClientBox(mx, my, mz, topStiffenerBox);
    const inGusset = gussetBoxes.some((b) =>
      isPointInsideClientBox(mx, my, mz, b),
    );
    const inRail = railBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    return (
      inFaceplate || inTrayFloor || inTopStiffener || inGusset || inRail
    );
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

export type CoverPanelPatternType =
  | 'lines'
  | 'hex'
  | 'ribs'
  | 'vented-slots'
  | 'solid';

export type CoverPanelUHeight = 0.5 | 1 | 2 | 3;

export interface CustomCoverPanelOptions {
  readonly standard: RackStandard;
  readonly u_height: CoverPanelUHeight;
  readonly pattern: CoverPanelPatternType;
  readonly label_text?: string | undefined;
}

const CLIENT_FONT_5X7_GLYPHS: Readonly<Record<string, readonly string[]>> = {
  A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  B: ['####.', '#...#', '#...#', '####.', '#...#', '#...#', '####.'],
  C: ['.####', '#....', '#....', '#....', '#....', '#....', '.####'],
  D: ['####.', '#...#', '#...#', '#...#', '#...#', '#...#', '####.'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  F: ['#####', '#....', '#....', '####.', '#....', '#....', '#....'],
  G: ['.####', '#....', '#....', '#..##', '#...#', '#...#', '.####'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  I: ['.###.', '..#..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  J: ['..###', '...#.', '...#.', '...#.', '#..#.', '#..#.', '.##..'],
  K: ['#...#', '#..#.', '#.#..', '##...', '#.#..', '#..#.', '#...#'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'],
  M: ['#...#', '##.##', '#.#.#', '#...#', '#...#', '#...#', '#...#'],
  N: ['#...#', '##..#', '#.#.#', '#..##', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  V: ['#...#', '#...#', '#...#', '#...#', '#...#', '.#.#.', '..#..'],
  W: ['#...#', '#...#', '#...#', '#...#', '#.#.#', '##.##', '#...#'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'],
  Y: ['#...#', '#...#', '.#.#.', '..#..', '..#..', '..#..', '..#..'],
  Z: ['#####', '....#', '...#.', '..#..', '.#...', '#....', '#####'],
  '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
  '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
  '2': ['.###.', '#...#', '....#', '..##.', '.#...', '#....', '#####'],
  '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
  '4': ['#...#', '#...#', '#...#', '#####', '....#', '....#', '....#'],
  '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
  '6': ['.###.', '#....', '####.', '#...#', '#...#', '#...#', '.###.'],
  '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
  '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
  '9': ['.###.', '#...#', '#...#', '.####', '....#', '....#', '.###.'],
  '-': ['.....', '.....', '.....', '#####', '.....', '.....', '.....'],
  '.': ['.....', '.....', '.....', '.....', '.....', '.##..', '.##..'],
  _: ['.....', '.....', '.....', '.....', '.....', '.....', '#####'],
  '/': ['....#', '...#.', '...#.', '..#..', '.#...', '.#...', '#....'],
  ' ': ['.....', '.....', '.....', '.....', '.....', '.....', '.....'],
};

export function sanitizeClientCoverPanelLabel(raw?: string): string {
  if (!raw) return '';
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9 ._/-]/g, '')
    .trim()
    .slice(0, 14);
}

interface ClientCoverPanelTextLayout {
  readonly label: string;
  readonly plateX0: number;
  readonly plateX1: number;
  readonly plateY0: number;
  readonly plateY1: number;
  readonly dotBoxes: readonly ClientBox3DMm[];
}

function buildClientCoverPanelTextLayout(
  rawLabel: string | undefined,
  panelWidthMm: number,
  panelHeightMm: number,
  patW: number,
  grooveDepthMm: number,
): ClientCoverPanelTextLayout | null {
  const label = sanitizeClientCoverPanelLabel(rawLabel);
  if (label.length === 0) return null;

  const totalCols = label.length * 6 - 1;
  const maxUsableW = Math.max(24, patW - 10);
  const dotPitch = roundCentis(
    Math.max(1.0, Math.min(1.55, maxUsableW / Math.max(1, totalCols))),
  );
  const dotSize = roundCentis(Math.max(0.68, dotPitch * 0.7));
  const textSpanW = (totalCols - 1) * dotPitch + dotSize;
  const textSpanH = 6 * dotPitch + dotSize;

  const centerX = panelWidthMm / 2;
  const centerY = panelHeightMm / 2;
  const viewerLeftStartCenter = centerX + ((totalCols - 1) * dotPitch) / 2;
  const topRowCenterY = centerY + (6 * dotPitch) / 2;

  const dotBoxes: ClientBox3DMm[] = [];
  for (let ci = 0; ci < label.length; ci++) {
    const ch = label[ci] ?? ' ';
    const glyph = CLIENT_FONT_5X7_GLYPHS[ch] ?? CLIENT_FONT_5X7_GLYPHS[' ']!;
    for (let r = 0; r < 7; r++) {
      const rowStr = glyph[r] ?? '.....';
      const dyCenter = topRowCenterY - r * dotPitch;
      for (let c = 0; c < 5; c++) {
        if (rowStr[c] !== '#') continue;
        const globalCol = ci * 6 + c;
        const dxCenter = viewerLeftStartCenter - globalCol * dotPitch;
        dotBoxes.push(
          normalizeClientBox({
            x0: dxCenter - dotSize / 2,
            y0: dyCenter - dotSize / 2,
            z0: -1,
            x1: dxCenter + dotSize / 2,
            y1: dyCenter + dotSize / 2,
            z1: grooveDepthMm,
          }),
        );
      }
    }
  }

  return {
    label,
    plateX0: roundCentis(centerX - textSpanW / 2 - 2.6),
    plateX1: roundCentis(centerX + textSpanW / 2 + 2.6),
    plateY0: roundCentis(centerY - textSpanH / 2 - 2.2),
    plateY1: roundCentis(centerY + textSpanH / 2 + 2.2),
    dotBoxes,
  };
}

function clientBoxesOverlap2D(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  ex0: number,
  ey0: number,
  ex1: number,
  ey1: number,
): boolean {
  return x1 > ex0 && x0 < ex1 && y1 > ey0 && y0 < ey1;
}

export function generateClientCustomCoverPanelOpenScad(
  options: CustomCoverPanelOptions,
): string {
  const spec = EIA_310_SPECS[options.standard];
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(options.u_height * MM_PER_U - 0.75);
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);
  const patX0 = roundCentis(earWidthMm + 10.0);
  const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
  const patW = roundCentis(patX1 - patX0);
  const stiffenerDepthMm = options.u_height >= 2 ? 12.0 : 10.0;
  const grooveDepthMm = 1.4;
  const faceplateThicknessMm = 4.2;

  const textLayout = buildClientCoverPanelTextLayout(
    options.label_text,
    panelWidthMm,
    panelHeightMm,
    patW,
    grooveDepthMm,
  );

  const lines: string[] = [];
  lines.push(`// ============================================================================`);
  lines.push(`// RackArchitect MCP — Custom Parametric 3D-Printable Slot Cover Panel (.scad)`);
  lines.push(`// Standard:  ${options.standard.toUpperCase()} EIA-310 (${panelWidthMm}mm Width, ${options.u_height}U = ${panelHeightMm}mm Height)`);
  lines.push(`// Pattern:   ${options.pattern.toUpperCase()}${textLayout ? ` | Engraved Label: "${textLayout.label}"` : ''}`);
  lines.push(`// Material:  PETG / PLA / ASA (Print Face-Down on Textured PEI Plate, Zero Supports)`);
  lines.push(`// ============================================================================`);
  lines.push(``);
  lines.push(`panel_width_mm = ${panelWidthMm};`);
  lines.push(`aperture_width_mm = ${apertureWidthMm};`);
  lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
  lines.push(`panel_height_mm = ${panelHeightMm};`);
  lines.push(`faceplate_thickness_mm = ${faceplateThicknessMm};`);
  lines.push(`stiffener_depth_mm = ${stiffenerDepthMm};`);
  lines.push(`stiffener_wall_mm = 3.2;`);
  lines.push(`pattern_groove_depth_mm = ${grooveDepthMm};`);
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
  if (options.u_height < 1) {
    const cy = roundCentis(panelHeightMm / 2);
    lines.push(`  translate([left_hole_x, ${cy}, 0]) oval_mounting_slot();`);
    lines.push(`  translate([right_hole_x, ${cy}, 0]) oval_mounting_slot();`);
  } else {
    const fullUs = Math.round(options.u_height);
    lines.push(`  for (u = [0 : ${fullUs - 1}]) {`);
    lines.push(`    base_y = u * 44.45;`);
    lines.push(`    for (offset_y = [6.35, 22.225, 38.10]) {`);
    lines.push(`      if (base_y + offset_y < panel_height_mm - 3.0) {`);
    lines.push(`        translate([left_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
    lines.push(`        translate([right_hole_x, base_y + offset_y, 0]) oval_mounting_slot();`);
    lines.push(`      }`);
    lines.push(`    }`);
    lines.push(`  }`);
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`module custom_surface_features() {`);
  if (options.pattern === 'lines') {
    const lineCount = Math.max(2, Math.round(options.u_height * 3));
    const marginY = options.u_height < 1 ? 5.2 : 8.0;
    const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
    for (let i = 0; i < lineCount; i++) {
      const gy0 = roundCentis(marginY + i * stepY - 1.1);
      const gy1 = roundCentis(gy0 + 2.2);
      if (
        textLayout &&
        clientBoxesOverlap2D(
          patX0,
          gy0,
          patX1,
          gy1,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1,
        )
      ) {
        const leftW = roundCentis(textLayout.plateX0 - patX0);
        const rightW = roundCentis(patX1 - textLayout.plateX1);
        if (leftW >= 6.0) {
          lines.push(`  translate([${patX0}, ${gy0}, -0.5]) cube([${leftW}, 2.2, pattern_groove_depth_mm + 0.5]);`);
        }
        if (rightW >= 6.0) {
          lines.push(`  translate([${textLayout.plateX1}, ${gy0}, -0.5]) cube([${rightW}, 2.2, pattern_groove_depth_mm + 0.5]);`);
        }
      } else {
        lines.push(`  translate([${patX0}, ${gy0}, -0.5]) cube([${patW}, 2.2, pattern_groove_depth_mm + 0.5]);`);
      }
    }
  } else if (options.pattern === 'hex') {
    const rows = Math.max(1, Math.round(options.u_height * 2));
    const cols = Math.max(5, Math.min(14, Math.floor(patW / 20)));
    const pitchX = patW / cols;
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const pitchY = (panelHeightMm - 2 * marginY) / rows;
    const diam = roundCentis(Math.min(pitchX, pitchY) * 0.66);
    for (let r = 0; r < rows; r++) {
      const cy = roundCentis(marginY + (r + 0.5) * pitchY);
      const shiftX = r % 2 === 1 ? pitchX * 0.2 : -pitchX * 0.2;
      for (let c = 0; c < cols; c++) {
        const cx = roundCentis(patX0 + (c + 0.5) * pitchX + shiftX);
        if (
          textLayout &&
          clientBoxesOverlap2D(
            cx - diam / 2,
            cy - diam / 2,
            cx + diam / 2,
            cy + diam / 2,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1,
          )
        ) {
          continue;
        }
        lines.push(`  translate([${cx}, ${cy}, -0.5]) cylinder(d = ${diam}, h = pattern_groove_depth_mm + 0.5, $fn = 6);`);
      }
    }
  } else if (options.pattern === 'ribs') {
    const ribCount = Math.max(8, Math.min(18, Math.floor(patW / 15)));
    const pitchX = patW / ribCount;
    const grooveW = roundCentis(Math.max(2.8, pitchX * 0.44));
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const grooveH = roundCentis(panelHeightMm - 2 * marginY);
    for (let i = 0; i < ribCount; i++) {
      const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
      const gx1 = roundCentis(gx0 + grooveW);
      if (
        textLayout &&
        clientBoxesOverlap2D(
          gx0,
          marginY,
          gx1,
          marginY + grooveH,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1,
        )
      ) {
        continue;
      }
      lines.push(`  translate([${gx0}, ${marginY}, -0.5]) cube([${grooveW}, ${grooveH}, pattern_groove_depth_mm + 0.5]);`);
    }
  } else if (options.pattern === 'vented-slots') {
    const colCount = options.standard === '19inch' ? 3 : 2;
    const bridgeMm = 6.0;
    const slotW = roundCentis((patW - (colCount - 1) * bridgeMm) / colCount);
    const slotH = 2.4;
    const pitchY = 5.6;
    const marginY = 5.2;
    for (let y = marginY; y + slotH <= panelHeightMm - marginY; y += pitchY) {
      const sy0 = roundCentis(y);
      const sy1 = roundCentis(y + slotH);
      for (let col = 0; col < colCount; col++) {
        const sx0 = roundCentis(patX0 + col * (slotW + bridgeMm));
        const sx1 = roundCentis(sx0 + slotW);
        if (
          textLayout &&
          clientBoxesOverlap2D(
            sx0,
            sy0,
            sx1,
            sy1,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1,
          )
        ) {
          continue;
        }
        lines.push(`  translate([${sx0}, ${sy0}, -1.0]) cube([${slotW}, ${slotH}, faceplate_thickness_mm + 2.0]);`);
      }
    }
  }

  if (textLayout) {
    const fontSizeMm = roundCentis(
      Math.min(
        options.u_height < 1 ? 7.5 : 10.5,
        (patW * 0.72) / Math.max(1, textLayout.label.length),
      ),
    );
    lines.push(
      `  translate([panel_width_mm / 2, panel_height_mm / 2, -0.5]) linear_extrude(height = pattern_groove_depth_mm + 0.5) mirror([1, 0, 0]) text("${textLayout.label}", size = ${fontSizeMm}, font = "Liberation Mono:style=Bold", halign = "center", valign = "center");`,
    );
  }
  lines.push(`}`);
  lines.push(``);
  lines.push(`union() {`);
  lines.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); eia310_ear_holes(); custom_surface_features(); }`);
  lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm}, panel_height_mm - stiffener_wall_mm, faceplate_thickness_mm]) cube([aperture_width_mm, stiffener_wall_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([3.5, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`  translate([${earWidthMm} + aperture_width_mm - 3.5, 0, faceplate_thickness_mm]) cube([3.5, panel_height_mm, stiffener_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`}`);
  return lines.join('\n');
}

export function generateClientCustomCoverPanelStl(
  options: CustomCoverPanelOptions,
): string {
  const spec = EIA_310_SPECS[options.standard];
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(options.u_height * MM_PER_U - 0.75);
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);
  const faceplateThicknessMm = 4.2;
  const stiffenerWallMm = 3.2;
  const sideGussetMm = 3.5;
  const totalDepthMm = options.u_height >= 2 ? 12.0 : 10.0;
  const grooveDepthMm = 1.4;

  const faceplateBox = normalizeClientBox({
    x0: 0,
    y0: 0,
    z0: 0,
    x1: panelWidthMm,
    y1: panelHeightMm,
    z1: faceplateThicknessMm,
  });

  const bottomStiffenerBox = normalizeClientBox({
    x0: earWidthMm,
    y0: 0,
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: stiffenerWallMm,
    z1: totalDepthMm,
  });

  const topStiffenerBox = normalizeClientBox({
    x0: earWidthMm,
    y0: roundCentis(panelHeightMm - stiffenerWallMm),
    z0: faceplateThicknessMm,
    x1: panelWidthMm - earWidthMm,
    y1: panelHeightMm,
    z1: totalDepthMm,
  });

  const gussetBoxes: ClientBox3DMm[] = [
    normalizeClientBox({
      x0: earWidthMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: earWidthMm + sideGussetMm,
      y1: panelHeightMm,
      z1: totalDepthMm,
    }),
    normalizeClientBox({
      x0: panelWidthMm - earWidthMm - sideGussetMm,
      y0: 0,
      z0: faceplateThicknessMm,
      x1: panelWidthMm - earWidthMm,
      y1: panelHeightMm,
      z1: totalDepthMm,
    }),
  ];

  const leftHoleX = roundCentis((panelWidthMm - holePitchXMm) / 2);
  const rightHoleX = roundCentis(panelWidthMm - leftHoleX);
  const earHoleBoxes: ClientBox3DMm[] = [];
  if (options.u_height < 1) {
    const cy = roundCentis(panelHeightMm / 2);
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
  } else {
    const fullUs = Math.round(options.u_height);
    for (let u = 0; u < fullUs; u++) {
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
  }

  const patX0 = roundCentis(earWidthMm + 10.0);
  const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
  const patW = roundCentis(patX1 - patX0);

  const textLayout = buildClientCoverPanelTextLayout(
    options.label_text,
    panelWidthMm,
    panelHeightMm,
    patW,
    grooveDepthMm,
  );

  const featureCutoutBoxes: ClientBox3DMm[] = [];

  if (options.pattern === 'lines') {
    const lineCount = Math.max(2, Math.round(options.u_height * 3));
    const marginY = options.u_height < 1 ? 5.2 : 8.0;
    const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
    for (let i = 0; i < lineCount; i++) {
      const gy0 = roundCentis(marginY + i * stepY - 1.1);
      const gy1 = roundCentis(gy0 + 2.2);
      if (
        textLayout &&
        clientBoxesOverlap2D(
          patX0,
          gy0,
          patX1,
          gy1,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1,
        )
      ) {
        if (textLayout.plateX0 - patX0 >= 6.0) {
          featureCutoutBoxes.push(
            normalizeClientBox({
              x0: patX0,
              y0: gy0,
              z0: -1,
              x1: textLayout.plateX0,
              y1: gy1,
              z1: grooveDepthMm,
            }),
          );
        }
        if (patX1 - textLayout.plateX1 >= 6.0) {
          featureCutoutBoxes.push(
            normalizeClientBox({
              x0: textLayout.plateX1,
              y0: gy0,
              z0: -1,
              x1: patX1,
              y1: gy1,
              z1: grooveDepthMm,
            }),
          );
        }
      } else {
        featureCutoutBoxes.push(
          normalizeClientBox({
            x0: patX0,
            y0: gy0,
            z0: -1,
            x1: patX1,
            y1: gy1,
            z1: grooveDepthMm,
          }),
        );
      }
    }
  } else if (options.pattern === 'hex') {
    const rows = Math.max(1, Math.round(options.u_height * 2));
    const cols = Math.max(5, Math.min(10, Math.floor(patW / 24)));
    const pitchX = patW / cols;
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const pitchY = (panelHeightMm - 2 * marginY) / rows;
    const cellW = roundCentis(pitchX * 0.62);
    const cellH = roundCentis(pitchY * 0.6);
    for (let r = 0; r < rows; r++) {
      const cy = marginY + (r + 0.5) * pitchY;
      const shiftX = r % 2 === 1 ? pitchX * 0.16 : -pitchX * 0.16;
      for (let c = 0; c < cols; c++) {
        const cx = patX0 + (c + 0.5) * pitchX + shiftX;
        const x0 = roundCentis(Math.max(patX0, cx - cellW / 2));
        const x1 = roundCentis(Math.min(patX1, cx + cellW / 2));
        const y0 = roundCentis(cy - cellH / 2);
        const y1 = roundCentis(cy + cellH / 2);
        if (x1 - x0 < 3.0 || y1 - y0 < 3.0) continue;
        if (
          textLayout &&
          clientBoxesOverlap2D(
            x0,
            y0,
            x1,
            y1,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1,
          )
        ) {
          continue;
        }
        featureCutoutBoxes.push(
          normalizeClientBox({ x0, y0, z0: -1, x1, y1, z1: grooveDepthMm }),
        );
      }
    }
  } else if (options.pattern === 'ribs') {
    const ribCount = Math.max(8, Math.min(14, Math.floor(patW / 16)));
    const pitchX = patW / ribCount;
    const grooveW = roundCentis(Math.max(2.8, pitchX * 0.44));
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    for (let i = 0; i < ribCount; i++) {
      const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
      const gx1 = roundCentis(gx0 + grooveW);
      const gy0 = marginY;
      const gy1 = roundCentis(panelHeightMm - marginY);
      if (
        textLayout &&
        clientBoxesOverlap2D(
          gx0,
          gy0,
          gx1,
          gy1,
          textLayout.plateX0,
          textLayout.plateY0,
          textLayout.plateX1,
          textLayout.plateY1,
        )
      ) {
        continue;
      }
      featureCutoutBoxes.push(
        normalizeClientBox({
          x0: gx0,
          y0: gy0,
          z0: -1,
          x1: gx1,
          y1: gy1,
          z1: grooveDepthMm,
        }),
      );
    }
  } else if (options.pattern === 'vented-slots') {
    const colCount = options.standard === '19inch' ? 3 : 2;
    const bridgeMm = 6.0;
    const slotW = roundCentis((patW - (colCount - 1) * bridgeMm) / colCount);
    const slotH = 2.4;
    const pitchY = 5.6;
    const marginY = 5.2;
    for (let y = marginY; y + slotH <= panelHeightMm - marginY; y += pitchY) {
      const sy0 = roundCentis(y);
      const sy1 = roundCentis(y + slotH);
      for (let col = 0; col < colCount; col++) {
        const sx0 = roundCentis(patX0 + col * (slotW + bridgeMm));
        const sx1 = roundCentis(sx0 + slotW);
        if (
          textLayout &&
          clientBoxesOverlap2D(
            sx0,
            sy0,
            sx1,
            sy1,
            textLayout.plateX0,
            textLayout.plateY0,
            textLayout.plateX1,
            textLayout.plateY1,
          )
        ) {
          continue;
        }
        featureCutoutBoxes.push(
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
    }
  }

  if (textLayout) {
    featureCutoutBoxes.push(...textLayout.dotBoxes);
  }

  const allBoxes = [
    faceplateBox,
    bottomStiffenerBox,
    topStiffenerBox,
    ...gussetBoxes,
    ...earHoleBoxes,
    ...featureCutoutBoxes,
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
      .filter((z) => z >= 0 && z <= totalDepthMm),
  );

  const nx = xs.length - 1;
  const ny = ys.length - 1;
  const nz = zs.length - 1;

  const isCellSolid = (ix: number, iy: number, iz: number): boolean => {
    if (ix < 0 || ix >= nx || iy < 0 || iy >= ny || iz < 0 || iz >= nz) {
      return false;
    }
    const mx = 0.5 * (xs[ix]! + xs[ix + 1]!);
    const my = 0.5 * (ys[iy]! + ys[iy + 1]!);
    const mz = 0.5 * (zs[iz]! + zs[iz + 1]!);

    const inFaceplate =
      isPointInsideClientBox(mx, my, mz, faceplateBox) &&
      !earHoleBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b)) &&
      !featureCutoutBoxes.some((b) => isPointInsideClientBox(mx, my, mz, b));

    const inBottomStiffener = isPointInsideClientBox(
      mx,
      my,
      mz,
      bottomStiffenerBox,
    );
    const inTopStiffener = isPointInsideClientBox(mx, my, mz, topStiffenerBox);
    const inGusset = gussetBoxes.some((b) =>
      isPointInsideClientBox(mx, my, mz, b),
    );

    return inFaceplate || inBottomStiffener || inTopStiffener || inGusset;
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

  const solidName = `custom_cover_${options.standard}_${String(options.u_height).replaceAll('.', 'p')}u_${options.pattern}`;
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

/**
 * Renders a live 2D CAD technical front-elevation SVG preview of the configured custom cover panel.
 */
export function renderClientCustomCoverPanelPreviewSvg(
  options: CustomCoverPanelOptions,
): string {
  const spec = EIA_310_SPECS[options.standard];
  const panelWidthMm = roundCentis(spec.W_panel);
  const apertureWidthMm = roundCentis(spec.W_aperture);
  const holePitchXMm = roundCentis(spec.W_holes);
  const panelHeightMm = roundCentis(options.u_height * MM_PER_U - 0.75);
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);
  const leftHoleX = roundCentis((panelWidthMm - holePitchXMm) / 2);
  const rightHoleX = roundCentis(panelWidthMm - leftHoleX);
  const patX0 = roundCentis(earWidthMm + 10.0);
  const patX1 = roundCentis(panelWidthMm - earWidthMm - 10.0);
  const patW = roundCentis(patX1 - patX0);
  const label = sanitizeClientCoverPanelLabel(options.label_text);

  const pad = 12;
  const vbW = roundCentis(panelWidthMm + pad * 2);
  const vbH = roundCentis(panelHeightMm + pad * 2);
  const ox = pad;
  const oy = pad;

  const parts: string[] = [];
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="100%" height="100%" style="max-height:132px;display:block">`,
  );
  parts.push(
    `<rect x="0" y="0" width="${vbW}" height="${vbH}" rx="4" fill="#0E0E11" />`,
  );
  // Main faceplate body
  parts.push(
    `<rect x="${ox}" y="${oy}" width="${panelWidthMm}" height="${panelHeightMm}" rx="1.8" fill="#18181D" stroke="#52525B" stroke-width="0.9" />`,
  );
  // Aperture inner bezel boundary
  parts.push(
    `<rect x="${roundCentis(ox + earWidthMm + 2)}" y="${roundCentis(oy + 2.5)}" width="${roundCentis(apertureWidthMm - 4)}" height="${roundCentis(panelHeightMm - 5)}" rx="1.2" fill="#121216" stroke="#27272A" stroke-width="0.7" />`,
  );

  // EIA-310 mounting holes
  const holeYs: number[] = [];
  if (options.u_height < 1) {
    holeYs.push(roundCentis(panelHeightMm / 2));
  } else {
    const fullUs = Math.round(options.u_height);
    for (let u = 0; u < fullUs; u++) {
      for (const off of [6.35, 22.225, 38.1]) {
        const yMm = roundCentis(u * MM_PER_U + off);
        if (yMm + 3.25 < panelHeightMm - 1.5 && yMm - 3.25 > 1.5) {
          holeYs.push(panelHeightMm - yMm);
        }
      }
    }
  }
  for (const hy of holeYs) {
    for (const hx of [leftHoleX, rightHoleX]) {
      parts.push(
        `<rect x="${roundCentis(ox + hx - 4.5)}" y="${roundCentis(oy + hy - 3.0)}" width="9.0" height="6.0" rx="3.0" fill="#09090B" stroke="#71717A" stroke-width="0.7" />`,
      );
    }
  }

  // Nameplate zone if label exists
  const hasLabel = label.length > 0;
  const totalCols = hasLabel ? label.length * 6 - 1 : 0;
  const dotPitch = hasLabel
    ? roundCentis(Math.max(1.0, Math.min(1.55, Math.max(24, patW - 10) / Math.max(1, totalCols))))
    : 0;
  const dotSize = hasLabel ? roundCentis(Math.max(0.68, dotPitch * 0.7)) : 0;
  const textSpanW = hasLabel ? (totalCols - 1) * dotPitch + dotSize : 0;
  const textSpanH = hasLabel ? 6 * dotPitch + dotSize : 0;
  const plateX0 = roundCentis(panelWidthMm / 2 - textSpanW / 2 - 2.6);
  const plateX1 = roundCentis(panelWidthMm / 2 + textSpanW / 2 + 2.6);
  const plateY0 = roundCentis(panelHeightMm / 2 - textSpanH / 2 - 2.2);
  const plateY1 = roundCentis(panelHeightMm / 2 + textSpanH / 2 + 2.2);

  if (options.pattern === 'lines') {
    const lineCount = Math.max(2, Math.round(options.u_height * 3));
    const marginY = options.u_height < 1 ? 5.2 : 8.0;
    const stepY = lineCount > 1 ? (panelHeightMm - 2 * marginY) / (lineCount - 1) : 0;
    for (let i = 0; i < lineCount; i++) {
      const gy0 = roundCentis(marginY + i * stepY - 1.1);
      const gy1 = roundCentis(gy0 + 2.2);
      if (
        hasLabel &&
        clientBoxesOverlap2D(patX0, gy0, patX1, gy1, plateX0, plateY0, plateX1, plateY1)
      ) {
        if (plateX0 - patX0 >= 6.0) {
          parts.push(
            `<rect x="${roundCentis(ox + patX0)}" y="${roundCentis(oy + gy0)}" width="${roundCentis(plateX0 - patX0)}" height="2.2" rx="0.8" fill="#3F3F46" />`,
          );
        }
        if (patX1 - plateX1 >= 6.0) {
          parts.push(
            `<rect x="${roundCentis(ox + plateX1)}" y="${roundCentis(oy + gy0)}" width="${roundCentis(patX1 - plateX1)}" height="2.2" rx="0.8" fill="#3F3F46" />`,
          );
        }
      } else {
        parts.push(
          `<rect x="${roundCentis(ox + patX0)}" y="${roundCentis(oy + gy0)}" width="${patW}" height="2.2" rx="0.8" fill="#3F3F46" />`,
        );
      }
    }
  } else if (options.pattern === 'hex') {
    const rows = Math.max(1, Math.round(options.u_height * 2));
    const cols = Math.max(5, Math.min(10, Math.floor(patW / 24)));
    const pitchX = patW / cols;
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const pitchY = (panelHeightMm - 2 * marginY) / rows;
    const rad = roundCentis(Math.min(pitchX, pitchY) * 0.3);
    for (let r = 0; r < rows; r++) {
      const cy = roundCentis(marginY + (r + 0.5) * pitchY);
      const shiftX = r % 2 === 1 ? pitchX * 0.16 : -pitchX * 0.16;
      for (let c = 0; c < cols; c++) {
        const cx = roundCentis(patX0 + (c + 0.5) * pitchX + shiftX);
        if (
          hasLabel &&
          clientBoxesOverlap2D(
            cx - rad,
            cy - rad,
            cx + rad,
            cy + rad,
            plateX0,
            plateY0,
            plateX1,
            plateY1,
          )
        ) {
          continue;
        }
        parts.push(
          `<circle cx="${roundCentis(ox + cx)}" cy="${roundCentis(oy + cy)}" r="${rad}" fill="#09090B" stroke="#52525B" stroke-width="0.8" />`,
        );
      }
    }
  } else if (options.pattern === 'ribs') {
    const ribCount = Math.max(8, Math.min(14, Math.floor(patW / 16)));
    const pitchX = patW / ribCount;
    const grooveW = roundCentis(Math.max(2.8, pitchX * 0.44));
    const marginY = options.u_height < 1 ? 4.5 : 6.0;
    const grooveH = roundCentis(panelHeightMm - 2 * marginY);
    for (let i = 0; i < ribCount; i++) {
      const gx0 = roundCentis(patX0 + (i + 0.5) * pitchX - grooveW / 2);
      if (
        hasLabel &&
        clientBoxesOverlap2D(
          gx0,
          marginY,
          gx0 + grooveW,
          marginY + grooveH,
          plateX0,
          plateY0,
          plateX1,
          plateY1,
        )
      ) {
        continue;
      }
      parts.push(
        `<rect x="${roundCentis(ox + gx0)}" y="${roundCentis(oy + marginY)}" width="${grooveW}" height="${grooveH}" rx="0.8" fill="#09090B" stroke="#3F3F46" stroke-width="0.7" />`,
      );
    }
  } else if (options.pattern === 'vented-slots') {
    const colCount = options.standard === '19inch' ? 3 : 2;
    const bridgeMm = 6.0;
    const slotW = roundCentis((patW - (colCount - 1) * bridgeMm) / colCount);
    const slotH = 2.4;
    const pitchY = 5.6;
    const marginY = 5.2;
    for (let y = marginY; y + slotH <= panelHeightMm - marginY; y += pitchY) {
      for (let col = 0; col < colCount; col++) {
        const sx0 = roundCentis(patX0 + col * (slotW + bridgeMm));
        if (
          hasLabel &&
          clientBoxesOverlap2D(
            sx0,
            y,
            sx0 + slotW,
            y + slotH,
            plateX0,
            plateY0,
            plateX1,
            plateY1,
          )
        ) {
          continue;
        }
        parts.push(
          `<rect x="${roundCentis(ox + sx0)}" y="${roundCentis(oy + y)}" width="${slotW}" height="${slotH}" rx="1.0" fill="#09090B" stroke="#3B82F6" stroke-opacity="0.45" stroke-width="0.6" />`,
        );
      }
    }
  }

  if (hasLabel) {
    parts.push(
      `<rect x="${roundCentis(ox + plateX0)}" y="${roundCentis(oy + plateY0)}" width="${roundCentis(plateX1 - plateX0)}" height="${roundCentis(plateY1 - plateY0)}" rx="1.4" fill="#141418" stroke="#3F3F46" stroke-width="0.6" />`,
    );
    const startX = panelWidthMm / 2 - ((totalCols - 1) * dotPitch) / 2;
    const startY = panelHeightMm / 2 - (6 * dotPitch) / 2;
    for (let ci = 0; ci < label.length; ci++) {
      const ch = label[ci] ?? ' ';
      const glyph = CLIENT_FONT_5X7_GLYPHS[ch] ?? CLIENT_FONT_5X7_GLYPHS[' ']!;
      for (let r = 0; r < 7; r++) {
        const rowStr = glyph[r] ?? '.....';
        for (let c = 0; c < 5; c++) {
          if (rowStr[c] !== '#') continue;
          const dx = roundCentis(ox + startX + (ci * 6 + c) * dotPitch - dotSize / 2);
          const dy = roundCentis(oy + startY + r * dotPitch - dotSize / 2);
          parts.push(
            `<rect x="${dx}" y="${dy}" width="${dotSize}" height="${dotSize}" rx="0.2" fill="#E4E4E7" />`,
          );
        }
      }
    }
  }

  parts.push(`</svg>`);
  return parts.join('');
}
