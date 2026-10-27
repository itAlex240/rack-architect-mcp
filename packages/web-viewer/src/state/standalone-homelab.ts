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
    .replace(/"/g, '&quot;');
}

/**
 * Generates a standalone 2D Elevation & Depth Cutaway SVG from a `SerializedRackScene`
 * when the backend Sidecar SVG endpoint is offline.
 */
export function renderClientSideElevationSvg(scene: SerializedRackScene): string {
  const scale = 2.6;
  const px = (mm: number): number => roundCentis(mm * scale);
  const spec = EIA_310_SPECS[scene.project.rack.standard];
  const uCount = scene.project.rack.u_height;
  const panelWidthMm = spec.W_panel;
  const totalHeightMm = uCount * MM_PER_U;
  const railDepthMm = scene.project.rack.rail_depth_mm;

  const topMarginPx = 110;
  const rackWidthPx = px(panelWidthMm);
  const rackHeightPx = px(totalHeightMm);
  const frontOriginX = 80;
  const rearOriginX = frontOriginX + rackWidthPx + 110;
  const sideOriginX = rearOriginX + rackWidthPx + 110;
  const sideWidthPx = px(railDepthMm + 110);
  const svgWidth = roundCentis(sideOriginX + sideWidthPx + 80);
  const svgHeight = roundCentis(topMarginPx + rackHeightPx + 90);

  const worldYToSvgY = (yMm: number): number =>
    roundCentis(topMarginPx + (totalHeightMm - yMm) * scale);

  const portAnchors = new Map<string, { x: number; y: number; u: number }>();
  const devicesById = new Map<string, ComputedDeviceGeometry>(
    scene.geometry.devices.map((d) => [d.instance_id, d]),
  );

  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="${svgWidth}" height="${svgHeight}" font-family="ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace">`,
  );
  lines.push(`<rect x="0" y="0" width="${svgWidth}" height="${svgHeight}" fill="#090D16" />`);
  lines.push(
    `<text x="32" y="36" fill="#F8FAFC" font-size="16" font-weight="700">${escapeXml(scene.project.project_name)} — 2D CAD Elevation &amp; Depth Cutaway</text>`,
  );
  lines.push(
    `<text x="32" y="58" fill="#94A3B8" font-size="11">Standard: ${scene.project.rack.standard} (${panelWidthMm}mm) • Height: ${uCount}U (${roundTenths(totalHeightMm)}mm) • Rail Depth: ${railDepthMm}mm • Cables: ${scene.project.cables.length}</text>`,
  );

  const drawRackFrame = (originX: number, label: string, widthPx: number) => {
    lines.push(
      `<text x="${roundCentis(originX + widthPx / 2)}" y="${topMarginPx - 16}" fill="#38BDF8" font-size="12" font-weight="700" text-anchor="middle">${escapeXml(label)}</text>`,
    );
    lines.push(
      `<rect x="${originX - 8}" y="${topMarginPx - 8}" width="${widthPx + 16}" height="${rackHeightPx + 16}" rx="6" fill="#0B1120" stroke="#475569" stroke-width="2" />`,
    );
    for (let u = 1; u <= uCount; u++) {
      const yTop = worldYToSvgY(u * MM_PER_U);
      const h = px(MM_PER_U);
      lines.push(
        `<rect x="${originX}" y="${yTop}" width="${widthPx}" height="${h}" fill="${u % 2 === 1 ? '#0F172A' : '#162033'}" stroke="#334155" stroke-width="0.8" stroke-dasharray="4,2" />`,
      );
      lines.push(
        `<text x="${originX - 18}" y="${roundCentis(yTop + h / 2 + 4)}" fill="#94A3B8" font-size="10" font-weight="700" text-anchor="middle">U${u}</text>`,
      );
    }
  };

  drawRackFrame(frontOriginX, 'FRONT ELEVATION (Z = 0mm)', rackWidthPx);
  drawRackFrame(rearOriginX, `REAR ELEVATION (Z = ${railDepthMm}mm, MIRRORED X)`, rackWidthPx);
  drawRackFrame(sideOriginX, 'SIDE-PROFILE DEPTH CUTAWAY (Z-Y)', sideWidthPx);

  // Render Front & Rear Devices + Port Anchors
  for (const dev of scene.geometry.devices) {
    const w = px(dev.chassis_box.max.x - dev.chassis_box.min.x);
    const h = px(dev.chassis_box.max.y - dev.chassis_box.min.y);
    const y = worldYToSvgY(dev.chassis_box.max.y);

    if (dev.face === 'front') {
      const x = roundCentis(frontOriginX + px(dev.chassis_box.min.x));
      lines.push(
        `<g data-instance-id="${escapeXml(dev.instance_id)}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" stroke="#64748B" stroke-width="1.3" /><text x="${x + 6}" y="${y + 11}" fill="#E2E8F0" font-size="8.5" font-weight="700">${escapeXml(dev.hostname ?? dev.instance_id)}</text></g>`,
      );
    }

    const rearX = roundCentis(rearOriginX + px(panelWidthMm - dev.chassis_box.max.x));
    lines.push(
      `<g data-rear-instance="${escapeXml(dev.instance_id)}"><rect x="${rearX}" y="${y}" width="${w}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" fill-opacity="${dev.face === 'rear' ? '1' : '0.82'}" stroke="${dev.face === 'rear' ? '#F59E0B' : '#475569'}" stroke-width="1.2" /></g>`,
    );

    for (const p of dev.ports) {
      const py = worldYToSvgY(p.world_position.y);
      if (p.world_face === 'front' || p.is_passthrough_coupler) {
        const pxFront = roundCentis(frontOriginX + px(p.world_position.x));
        portAnchors.set(`${dev.instance_id}:${p.port_id}:front`, {
          x: pxFront,
          y: py,
          u: dev.u_position,
        });
        lines.push(
          `<rect x="${pxFront - 4}" y="${py - 3.5}" width="8" height="7" rx="1" fill="#090D16" stroke="#38BDF8" stroke-width="1.1" />`,
        );
      }
      if (p.world_face === 'rear' || p.is_passthrough_coupler) {
        const pxRear = roundCentis(rearOriginX + px(panelWidthMm - p.world_position.x));
        portAnchors.set(`${dev.instance_id}:${p.port_id}:rear`, {
          x: pxRear,
          y: py,
          u: dev.u_position,
        });
        lines.push(
          `<rect x="${pxRear - 4}" y="${py - 3.5}" width="8" height="7" rx="1" fill="#090D16" stroke="#F59E0B" stroke-width="1.1" />`,
        );
      }
    }

    // Side Cutaway Box
    if (dev.blueprint.category !== 'keystone-module') {
      const sx = roundCentis(sideOriginX + px(dev.chassis_box.min.z + 45));
      const sw = Math.max(4, px(dev.chassis_box.max.z - dev.chassis_box.min.z));
      lines.push(
        `<rect x="${sx}" y="${y}" width="${sw}" height="${h}" rx="2" fill="${dev.blueprint.visuals.chassis_color_hex}" fill-opacity="0.85" stroke="#38BDF8" stroke-width="1" />`,
      );
    }
  }

  // Render Cables from PortAnchors
  let trackIdx = 0;
  for (const cable of scene.project.cables) {
    const d1 = devicesById.get(cable.from.instance_id);
    const d2 = devicesById.get(cable.to.instance_id);
    if (!d1 || !d2) continue;
    const f1 = cable.from.face ?? (d1.face === 'rear' ? 'rear' : 'front');
    const f2 = cable.to.face ?? (d2.face === 'rear' ? 'rear' : 'front');
    const a1 =
      portAnchors.get(`${cable.from.instance_id}:${cable.from.port_id}:${f1}`) ??
      portAnchors.get(`${cable.from.instance_id}:${cable.from.port_id}:front`) ??
      portAnchors.get(`${cable.from.instance_id}:${cable.from.port_id}:rear`);
    const a2 =
      portAnchors.get(`${cable.to.instance_id}:${cable.to.port_id}:${f2}`) ??
      portAnchors.get(`${cable.to.instance_id}:${cable.to.port_id}:front`) ??
      portAnchors.get(`${cable.to.instance_id}:${cable.to.port_id}:rear`);
    if (!a1 || !a2) continue;

    const idx = trackIdx++;
    const midY = roundCentis((a1.y + a2.y) / 2 + ((idx % 5) - 2) * 4);
    const d = `M ${a1.x} ${a1.y} L ${a1.x} ${midY} L ${a2.x} ${midY} L ${a2.x} ${a2.y}`;
    lines.push(
      `<path data-cable-id="${escapeXml(cable.cable_id)}" d="${d}" fill="none" stroke="${cable.color_hex}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />`,
    );
    lines.push(
      `<circle cx="${a1.x}" cy="${a1.y}" r="3.2" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1" />`,
    );
    lines.push(
      `<circle cx="${a2.x}" cy="${a2.y}" r="3.2" fill="${cable.color_hex}" stroke="#090D16" stroke-width="1" />`,
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
    blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75,
  );
  const trayDepthMm = roundCentis(Math.max(40, blueprint.geometry.depth_mm));
  const earWidthMm = roundCentis((panelWidthMm - apertureWidthMm) / 2);

  const lines: string[] = [];
  lines.push(`// RackArchitect MCP — Parametric 3D-Printable Rack Carrier (.scad)`);
  lines.push(`// Blueprint: ${blueprint.manufacturer} ${blueprint.model} (${blueprint.slug})`);
  lines.push(`panel_width_mm = ${panelWidthMm};`);
  lines.push(`aperture_width_mm = ${apertureWidthMm};`);
  lines.push(`hole_center_pitch_x_mm = ${holePitchXMm};`);
  lines.push(`panel_height_mm = ${panelHeightMm};`);
  lines.push(`u_count = ${uCount};`);
  lines.push(`faceplate_thickness_mm = 4.2;`);
  lines.push(`tray_depth_mm = ${trayDepthMm};`);
  lines.push(`tray_floor_thickness_mm = 3.2;`);
  lines.push(`print_tolerance_mm = 0.35;`);
  lines.push(`$fn = 36;`);
  lines.push(`module slot_bay_cutouts() {`);
  for (const slot of blueprint.slots) {
    lines.push(
      `  translate([${roundCentis(slot.offset_mm.x)} - print_tolerance_mm, ${roundCentis(slot.offset_mm.y)} - print_tolerance_mm, -1]) cube([${roundCentis(slot.max_dimensions_mm.width)} + 2*print_tolerance_mm, ${roundCentis(slot.max_dimensions_mm.height)} + 2*print_tolerance_mm, faceplate_thickness_mm + 2]);`,
    );
  }
  lines.push(`}`);
  lines.push(`union() {`);
  lines.push(`  difference() { cube([panel_width_mm, panel_height_mm, faceplate_thickness_mm]); slot_bay_cutouts(); }`);
  lines.push(`  translate([${earWidthMm}, 0, faceplate_thickness_mm]) cube([aperture_width_mm, tray_floor_thickness_mm, tray_depth_mm - faceplate_thickness_mm]);`);
  lines.push(`}`);
  return lines.join('\n');
}

/**
 * Generates an ASCII `.stl` mesh directly in the browser for any 3D-printable modular carrier.
 */
export function generateClientSideCarrierStl(
  blueprint: HardwareBlueprint,
  rackStandard: RackStandard = '10inch',
): string {
  const spec = EIA_310_SPECS[rackStandard];
  const uCount = Math.max(1, Math.round(blueprint.geometry.u_height || 1));
  const panelWidthMm = roundCentis(spec.W_panel);
  const panelHeightMm = roundCentis(
    blueprint.geometry.height_mm || uCount * MM_PER_U - 0.75,
  );
  const solidName = blueprint.slug.replace(/[^a-zA-Z0-9_-]/g, '_');
  const lines: string[] = [`solid ${solidName}`];
  lines.push(`  facet normal 0 0 -1`);
  lines.push(`    outer loop`);
  lines.push(`      vertex 0 0 0`);
  lines.push(`      vertex 0 ${panelHeightMm} 0`);
  lines.push(`      vertex ${panelWidthMm} ${panelHeightMm} 0`);
  lines.push(`    endloop`);
  lines.push(`  endfacet`);
  lines.push(`  facet normal 0 0 -1`);
  lines.push(`    outer loop`);
  lines.push(`      vertex 0 0 0`);
  lines.push(`      vertex ${panelWidthMm} ${panelHeightMm} 0`);
  lines.push(`      vertex ${panelWidthMm} 0 0`);
  lines.push(`    endloop`);
  lines.push(`  endfacet`);
  lines.push(`endsolid ${solidName}`);
  return lines.join('\n');
}
