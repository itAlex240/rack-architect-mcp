import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
  lookupBlueprint,
  RackProjectSchema,
  type BlueprintCatalogMap,
  type HardwareBlueprint,
  type RackProjectInput,
  type RackStandard,
} from '@rack-mcp/core-domain';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';

export type ExternalImportFormat = 'netbox' | 'unifi' | 'proxmox';

export interface ImportRackOptions {
  readonly format: ExternalImportFormat;
  readonly projectName?: string | undefined;
  readonly rackStandard?: RackStandard | undefined;
  readonly uHeight?: number | undefined;
  readonly railDepthMm?: number | undefined;
  readonly catalog?: BlueprintCatalogMap | undefined;
}

export interface ImportRackResult {
  readonly format: ExternalImportFormat;
  readonly project: RackProjectInput;
  readonly yaml: string;
  readonly matchedDevices: number;
  readonly fallbackDevices: number;
  readonly importedCables: number;
  readonly warnings: readonly string[];
}

function asRecord(val: unknown): Record<string, unknown> | null {
  if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
    return val as Record<string, unknown>;
  }
  return null;
}

function asString(val: unknown): string | undefined {
  return typeof val === 'string' && val.trim().length > 0 ? val.trim() : undefined;
}

function asNumber(val: unknown): number | undefined {
  return typeof val === 'number' && Number.isFinite(val) ? val : undefined;
}

function toSlugToken(raw: string): string {
  let out = '';
  let prevHyphen = true;
  const lower = raw.toLowerCase();
  for (let i = 0; i < lower.length && out.length < 64; i++) {
    const code = lower.charCodeAt(i);
    const isAlnum = (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
    if (isAlnum) {
      out += lower.charAt(i);
      prevHyphen = false;
    } else if (!prevHyphen) {
      out += '-';
      prevHyphen = true;
    }
  }
  return out.endsWith('-') ? out.slice(0, -1) : out;
}

/**
 * Sniffs raw JSON/YAML data from NetBox DCIM, Ubiquiti UniFi Network API,
 * or Proxmox VE cluster status (`/nodes`) exports.
 */
export function detectExternalImportFormat(
  raw: unknown,
): ExternalImportFormat | null {
  if (Array.isArray(raw)) {
    const first = asRecord(raw[0]);
    if (!first) return null;
    if (typeof first['node'] === 'string' || first['type'] === 'node') {
      return 'proxmox';
    }
    if (
      typeof first['mac'] === 'string' &&
      (typeof first['model'] === 'string' || Array.isArray(first['port_table']))
    ) {
      return 'unifi';
    }
    if (first['device_type'] !== undefined || first['position'] !== undefined) {
      return 'netbox';
    }
    return null;
  }

  const obj = asRecord(raw);
  if (!obj) return null;

  if (Array.isArray(obj['nodes'])) {
    return 'proxmox';
  }
  if (Array.isArray(obj['data'])) {
    const first = asRecord(obj['data'][0]);
    if (
      first &&
      (typeof first['mac'] === 'string' ||
        typeof first['model'] === 'string' ||
        Array.isArray(first['port_table']) ||
        first['uplink'] !== undefined)
    ) {
      return 'unifi';
    }
  }
  if (Array.isArray(obj['devices']) || Array.isArray(obj['results']) || obj['rack'] !== undefined) {
    return 'netbox';
  }
  return null;
}

function tokenizeModel(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 2);
}

function matchBlueprintInCatalog(
  query: string,
  catalogList: readonly HardwareBlueprint[],
  preferredStandard?: RackStandard,
): HardwareBlueprint | undefined {
  const qLower = query.toLowerCase();
  const qTokens = tokenizeModel(query);
  if (qTokens.length === 0) return undefined;

  let bestBp: HardwareBlueprint | undefined;
  let bestScore = 0;

  for (const bp of catalogList) {
    const hay = `${bp.slug} ${bp.manufacturer} ${bp.model}`.toLowerCase();
    if (hay === qLower || bp.slug === toSlugToken(query)) {
      return bp;
    }
    let score = 0;
    for (const tok of qTokens) {
      if (hay.includes(tok)) {
        score += tok.length >= 4 ? 3 : 2;
      }
    }
    if (preferredStandard) {
      const expectedMount =
        preferredStandard === '19inch'
          ? 'rackmount-19'
          : preferredStandard === '6inch'
            ? 'rackmount-6'
            : 'rackmount-10';
      if (bp.mount_type === expectedMount) {
        score += 1;
      }
    }
    if (score > bestScore && score >= 4) {
      bestScore = score;
      bestBp = bp;
    }
  }

  return bestBp;
}

const UNIFI_MODEL_MAP: Readonly<Record<string, string>> = {
  UDMPRO: 'ubiquiti-udm-pro',
  UDMPROSE: 'ubiquiti-udm-se',
  'UDM-SE': 'ubiquiti-udm-se',
  'UDM-PRO': 'ubiquiti-udm-pro',
  UCGMAX: 'ubiquiti-ucg-max',
  'UCG-MAX': 'ubiquiti-ucg-max',
  UCGFIBER: 'ubiquiti-ucg-fiber',
  'UCG-FIBER': 'ubiquiti-ucg-fiber',
  USWAGG: 'ubiquiti-usw-aggregation',
  USWPROMAX24P: 'ubiquiti-usw-pro-max-24-poe',
  USWPROMAX16P: 'ubiquiti-usw-pro-max-16-poe-rack-1u',
  USWFLEX25G8P: 'ubiquiti-usw-flex-2-5g-8-poe',
  USWFLEXMINI: 'ubiquiti-usw-flex-mini-6inch',
  USWL8P: 'ubiquiti-usw-lite-8-poe',
  USWULTRA: 'ubiquiti-usw-ultra-60w',
  USWPROXG8P: 'ubiquiti-usw-pro-xg-8-poe',
  UNVR: 'ubiquiti-unvr-4bay-1u',
  UNASPRO: 'ubiquiti-unas-pro-2u',
};

function findFirstFreePort(
  bp: HardwareBlueprint,
  usedPorts: Set<string>,
  instanceId: string,
  connectorFilter?: 'rj45' | 'sfp-plus',
): string | undefined {
  for (const p of bp.ports) {
    if (connectorFilter && p.connector_type !== connectorFilter) continue;
    if (p.direction === 'input') continue;
    const key = `${instanceId}:${p.port_id}`;
    if (!usedPorts.has(key)) {
      return p.port_id;
    }
  }
  return undefined;
}

/**
 * Imports rack inventory exports from NetBox DCIM, Ubiquiti UniFi Network, or Proxmox VE
 * into a schema-validated `RackProjectInput` and formatted `rack.yaml`.
 */
export function importExternalInventory(
  rawInput: string | Record<string, unknown> | unknown[],
  options: ImportRackOptions,
): ImportRackResult {
  const parsedRaw: unknown =
    typeof rawInput === 'string' ? parseYaml(rawInput) : rawInput;

  const catalogMap: BlueprintCatalogMap =
    options.catalog ?? defaultCatalogRegistry.toRecord();
  const catalogList: HardwareBlueprint[] =
    catalogMap instanceof Map
      ? [...catalogMap.values()]
      : Object.values(catalogMap);

  const warnings: string[] = [];
  let matchedDevices = 0;
  let fallbackDevices = 0;
  let importedCables = 0;

  const mountedDevices: NonNullable<RackProjectInput['mounted_devices']> = [];
  const cables: NonNullable<RackProjectInput['cables']> = [];
  const usedIds = new Set<string>();
  const usedPorts = new Set<string>();

  const allocInstanceId = (base: string): string => {
    const clean = toSlugToken(base) || 'device';
    let cand = clean;
    let idx = 2;
    while (usedIds.has(cand)) {
      cand = `${clean}-${idx++}`;
    }
    usedIds.add(cand);
    return cand;
  };

  let rackStandard: RackStandard = options.rackStandard ?? '19inch';
  let uHeight = options.uHeight ?? 12;
  let railDepthMm = options.railDepthMm ?? 450;
  let projectName = options.projectName ?? `Imported ${options.format.toUpperCase()} Rack`;

  if (options.format === 'netbox') {
    const rootObj = asRecord(parsedRaw);
    const rackMeta = asRecord(rootObj?.['rack']);
    if (rackMeta) {
      projectName =
        options.projectName ?? asString(rackMeta['name']) ?? projectName;
      const netboxU = asNumber(rackMeta['u_height']);
      if (netboxU && netboxU >= 4 && netboxU <= 60 && !options.uHeight) {
        uHeight = Math.round(netboxU);
      }
      const widthIn = asNumber(rackMeta['width']);
      if (widthIn === 10 && !options.rackStandard) {
        rackStandard = '10inch';
        railDepthMm = options.railDepthMm ?? 240;
      }
      const depthMm = asNumber(rackMeta['outer_depth']) ?? asNumber(rackMeta['mounting_depth']);
      if (depthMm && depthMm >= 180 && depthMm <= 2000 && !options.railDepthMm) {
        railDepthMm = Math.round(depthMm);
      }
    }

    const rawDevices: unknown[] = Array.isArray(parsedRaw)
      ? parsedRaw
      : Array.isArray(rootObj?.['devices'])
        ? (rootObj['devices'] as unknown[])
        : Array.isArray(rootObj?.['results'])
          ? (rootObj['results'] as unknown[])
          : [];

    const fallbackSlug =
      rackStandard === '10inch'
        ? 'generic-10inch-shelf-1u'
        : rackStandard === '6inch'
          ? 'generic-6inch-patch-panel-6port'
          : 'generic-19inch-shelf-1u';

    const occupiedFront = new Set<number>();
    const occupiedRear = new Set<number>();
    const nameToInstance = new Map<string, { id: string; bp: HardwareBlueprint }>();

    for (const item of rawDevices) {
      const rec = asRecord(item);
      if (!rec) continue;
      const devName = asString(rec['name']) ?? 'netbox-dev';
      const devTypeRec = asRecord(rec['device_type']);
      const modelStr =
        asString(devTypeRec?.['model']) ??
        asString(rec['device_type']) ??
        asString(rec['model']) ??
        devName;
      const mfrStr =
        asString(asRecord(devTypeRec?.['manufacturer'])?.['name']) ??
        asString(rec['manufacturer']) ??
        '';
      const searchStr = `${mfrStr} ${modelStr}`.trim();

      let bp = matchBlueprintInCatalog(searchStr, catalogList, rackStandard);
      if (bp && bp.mount_type === 'sub-module') {
        // Sub-modules must sit inside a carrier; pack onto shelf fallback when uncarriered
        bp = undefined;
      }
      if (bp) {
        matchedDevices++;
      } else {
        fallbackDevices++;
        bp = lookupBlueprint(catalogMap, fallbackSlug);
        warnings.push(
          `NetBox device '${devName}' (${searchStr}) matched fallback '${fallbackSlug}'.`,
        );
      }
      if (!bp) continue;

      const rawFace = asString(rec['face'])?.toLowerCase() === 'rear' ? 'rear' : 'front';
      const faceSet = rawFace === 'rear' ? occupiedRear : occupiedFront;
      const spanU = Math.max(1, Math.ceil(bp.geometry.u_height));
      let uPos = Math.max(1, Math.min(uHeight, Math.round(asNumber(rec['position']) ?? 1)));
      while (uPos + spanU - 1 <= uHeight) {
        let free = true;
        for (let u = uPos; u < uPos + spanU; u++) {
          if (faceSet.has(u)) {
            free = false;
            break;
          }
        }
        if (free) break;
        uPos++;
      }
      if (uPos + spanU - 1 > uHeight) {
        uHeight = uPos + spanU - 1;
      }
      for (let u = uPos; u < uPos + spanU; u++) {
        faceSet.add(u);
      }

      const instanceId = allocInstanceId(devName);
      mountedDevices.push({
        instance_id: instanceId,
        blueprint_slug: bp.slug,
        u_position: uPos,
        face: rawFace,
        hostname: devName,
        children: [],
      });
      nameToInstance.set(devName, { id: instanceId, bp });
    }

    const rawCables = Array.isArray(rootObj?.['cables'])
      ? (rootObj['cables'] as unknown[])
      : [];
    rawCables.forEach((rawCable, idx) => {
      const crec = asRecord(rawCable);
      if (!crec) return;
      const aTerm = asRecord(crec['a_terminations'] ? (crec['a_terminations'] as unknown[])[0] : crec['from']);
      const bTerm = asRecord(crec['b_terminations'] ? (crec['b_terminations'] as unknown[])[0] : crec['to']);
      const aDevName = asString(asRecord(aTerm?.['device'])?.['name']) ?? asString(aTerm?.['device']);
      const bDevName = asString(asRecord(bTerm?.['device'])?.['name']) ?? asString(bTerm?.['device']);
      if (!aDevName || !bDevName) return;
      const aEntry = nameToInstance.get(aDevName);
      const bEntry = nameToInstance.get(bDevName);
      if (!aEntry || !bEntry) return;
      const aPortId =
        asString(aTerm?.['name']) ??
        findFirstFreePort(aEntry.bp, usedPorts, aEntry.id, 'rj45');
      const bPortId =
        asString(bTerm?.['name']) ??
        findFirstFreePort(bEntry.bp, usedPorts, bEntry.id, 'rj45');
      if (!aPortId || !bPortId) return;
      if (
        !aEntry.bp.ports.some((p) => p.port_id === aPortId) ||
        !bEntry.bp.ports.some((p) => p.port_id === bPortId)
      ) {
        return;
      }
      usedPorts.add(`${aEntry.id}:${aPortId}`);
      usedPorts.add(`${bEntry.id}:${bPortId}`);
      cables.push({
        cable_id: asString(crec['label']) ?? `netbox-cable-${idx + 1}`,
        from: { instance_id: aEntry.id, port_id: aPortId },
        to: { instance_id: bEntry.id, port_id: bPortId },
        cable_type: 'cat6a',
        color_hex: '#3B82F6',
      });
      importedCables++;
    });
  } else if (options.format === 'unifi') {
    const rootObj = asRecord(parsedRaw);
    const rawList: unknown[] = Array.isArray(parsedRaw)
      ? parsedRaw
      : Array.isArray(rootObj?.['data'])
        ? (rootObj['data'] as unknown[])
        : [];
    if (!options.rackStandard) {
      rackStandard = '19inch';
    }
    const macToInstance = new Map<string, { id: string; bp: HardwareBlueprint }>();
    const pendingUplinks: Array<{
      readonly childId: string;
      readonly childBp: HardwareBlueprint;
      readonly uplinkMac: string;
    }> = [];
    let nextU = 2;

    // Optionally reserve U1 for a 10" or 19" UPS
    const upsSlug =
      rackStandard === '10inch'
        ? 'cyberpower-10inch-ups-1u'
        : 'apc-smart-ups-li-ion-short-depth-2u';
    const upsBp = lookupBlueprint(catalogMap, upsSlug);
    if (upsBp) {
      mountedDevices.push({
        instance_id: allocInstanceId('ups-core-01'),
        blueprint_slug: upsBp.slug,
        u_position: 1,
        face: 'front',
        children: [],
      });
      nextU = 1 + Math.ceil(upsBp.geometry.u_height);
    }

    for (const item of rawList) {
      const rec = asRecord(item);
      if (!rec) continue;
      const modelCode = asString(rec['model']) ?? 'unifi-device';
      const name = asString(rec['name']) ?? modelCode;
      const mac = asString(rec['mac'])?.toLowerCase();
      const mappedSlug = UNIFI_MODEL_MAP[modelCode.toUpperCase()];
      let bp =
        (mappedSlug ? lookupBlueprint(catalogMap, mappedSlug) : undefined) ??
        matchBlueprintInCatalog(`Ubiquiti ${modelCode} ${name}`, catalogList, rackStandard);

      if (bp && bp.mount_type === 'sub-module') {
        // Place sub-module into its 10" gateway carrier if available
        const carrierBp = lookupBlueprint(
          catalogMap,
          '3dprint-10inch-ucg-ultra-plus-3keystone',
        );
        if (carrierBp) {
          const carrierId = allocInstanceId(`carrier-${name}`);
          const childId = allocInstanceId(name);
          const spanU = Math.max(1, Math.ceil(carrierBp.geometry.u_height));
          if (nextU + spanU - 1 > uHeight) uHeight = nextU + spanU - 1;
          mountedDevices.push({
            instance_id: carrierId,
            blueprint_slug: carrierBp.slug,
            u_position: nextU,
            face: 'front',
            children: [
              {
                instance_id: childId,
                blueprint_slug: bp.slug,
                slot_id: carrierBp.slots[0]!.slot_id,
                hostname: name,
              },
            ],
          });
          nextU += spanU;
          matchedDevices++;
          if (mac) macToInstance.set(mac, { id: childId, bp });
          continue;
        }
      }

      if (bp) {
        matchedDevices++;
      } else {
        fallbackDevices++;
        const fb =
          rackStandard === '10inch'
            ? 'generic-10inch-shelf-1u'
            : 'generic-19inch-shelf-1u';
        bp = lookupBlueprint(catalogMap, fb);
        warnings.push(
          `UniFi device '${name}' (model '${modelCode}') mapped to shelf fallback '${fb}'.`,
        );
      }
      if (!bp) continue;

      const spanU = Math.max(1, Math.ceil(bp.geometry.u_height));
      if (nextU + spanU - 1 > uHeight) uHeight = nextU + spanU - 1;
      const id = allocInstanceId(name);
      mountedDevices.push({
        instance_id: id,
        blueprint_slug: bp.slug,
        u_position: nextU,
        face: 'front',
        hostname: name,
        children: [],
      });
      nextU += spanU;
      if (mac) macToInstance.set(mac, { id, bp });
      const uplinkRec = asRecord(rec['uplink']);
      const uplinkMac = asString(uplinkRec?.['uplink_mac'])?.toLowerCase();
      if (uplinkMac) {
        pendingUplinks.push({ childId: id, childBp: bp, uplinkMac });
      }
    }

    pendingUplinks.forEach((up, idx) => {
      const parent = macToInstance.get(up.uplinkMac);
      if (!parent || parent.id === up.childId) return;
      const portA = findFirstFreePort(up.childBp, usedPorts, up.childId, 'rj45');
      const portB = findFirstFreePort(parent.bp, usedPorts, parent.id, 'rj45');
      if (!portA || !portB) return;
      usedPorts.add(`${up.childId}:${portA}`);
      usedPorts.add(`${parent.id}:${portB}`);
      cables.push({
        cable_id: `unifi-uplink-${idx + 1}`,
        from: { instance_id: up.childId, port_id: portA },
        to: { instance_id: parent.id, port_id: portB },
        cable_type: 'cat6a',
        color_hex: '#38BDF8',
        label: 'UniFi Uplink',
      });
      importedCables++;
    });
  } else {
    // Proxmox VE cluster node export
    const rootObj = asRecord(parsedRaw);
    const rawNodes: unknown[] = Array.isArray(parsedRaw)
      ? parsedRaw
      : Array.isArray(rootObj?.['nodes'])
        ? (rootObj['nodes'] as unknown[])
        : [];
    if (!options.rackStandard) {
      rackStandard = rawNodes.length <= 4 ? '10inch' : '19inch';
      railDepthMm = options.railDepthMm ?? (rackStandard === '10inch' ? 240 : 450);
    }

    const upsSlug =
      rackStandard === '10inch'
        ? 'cyberpower-10inch-ups-1u'
        : 'apc-smart-ups-li-ion-short-depth-2u';
    const upsBp = lookupBlueprint(catalogMap, upsSlug);
    let nextU = 1;
    if (upsBp) {
      mountedDevices.push({
        instance_id: allocInstanceId('ups-core-01'),
        blueprint_slug: upsBp.slug,
        u_position: nextU,
        face: 'front',
        children: [],
      });
      nextU += Math.max(1, Math.ceil(upsBp.geometry.u_height));
    }

    const carrierSlug =
      rackStandard === '19inch'
        ? '3dprint-19inch-dual-minipc-poe-carrier-1u'
        : '3dprint-10inch-lenovo-tiny-plus-2keystone';
    const carrierBp = lookupBlueprint(catalogMap, carrierSlug);
    const nodeDefaultBp = lookupBlueprint(catalogMap, 'lenovo-thinkcentre-m920q');
    const mountedNodeEndpoints: Array<{ id: string; bp: HardwareBlueprint }> = [];

    if (carrierBp && nodeDefaultBp) {
      const miniPcSlots = carrierBp.slots.filter(
        (s) => s.accepted_slot_type === 'mini-pc-1liter',
      );
      const slotsPerCarrier = Math.max(1, miniPcSlots.length);
      for (let i = 0; i < rawNodes.length; i += slotsPerCarrier) {
        const chunk = rawNodes.slice(i, i + slotsPerCarrier);
        const carrierId = allocInstanceId(`pve-carrier-${Math.floor(i / slotsPerCarrier) + 1}`);
        const children: NonNullable<
          NonNullable<RackProjectInput['mounted_devices']>[number]['children']
        > = [];
        chunk.forEach((rawNode, slotIdx) => {
          const rec = asRecord(rawNode);
          const nodeName = asString(rec?.['node']) ?? asString(rec?.['name']) ?? `pve-${i + slotIdx + 1}`;
          const modelHint = asString(rec?.['model']) ?? asString(rec?.['cpu_model']) ?? '';
          const matchedNodeBp = modelHint
            ? matchBlueprintInCatalog(modelHint, catalogList)
            : undefined;
          const childBp =
            matchedNodeBp &&
            matchedNodeBp.mount_type === 'sub-module' &&
            matchedNodeBp.slot_compatibility === 'mini-pc-1liter'
              ? matchedNodeBp
              : nodeDefaultBp;
          matchedDevices++;
          const childId = allocInstanceId(nodeName);
          children.push({
            instance_id: childId,
            blueprint_slug: childBp.slug,
            slot_id: miniPcSlots[slotIdx]!.slot_id,
            hostname: nodeName,
          });
          mountedNodeEndpoints.push({ id: childId, bp: childBp });
        });
        if (nextU > uHeight) uHeight = nextU;
        mountedDevices.push({
          instance_id: carrierId,
          blueprint_slug: carrierBp.slug,
          u_position: nextU,
          face: 'front',
          children,
        });
        nextU += Math.max(1, Math.ceil(carrierBp.geometry.u_height));
      }
    }

    // Reserve a brush pass-through portal + cluster switch at top
    const brushSlug =
      rackStandard === '19inch'
        ? 'generic-19inch-brush-panel-1u'
        : 'generic-10inch-brush-panel-1u';
    if (lookupBlueprint(catalogMap, brushSlug)) {
      if (nextU > uHeight) uHeight = nextU;
      mountedDevices.push({
        instance_id: allocInstanceId('cable-brush-portal'),
        blueprint_slug: brushSlug,
        u_position: nextU,
        face: 'front',
        children: [],
      });
      nextU++;
    }

    const switchSlug =
      rackStandard === '19inch'
        ? 'ubiquiti-usw-pro-max-24-poe'
        : 'ubiquiti-usw-flex-2-5g-8-poe';
    const switchBp = lookupBlueprint(catalogMap, switchSlug);
    if (switchBp) {
      if (nextU > uHeight) uHeight = nextU;
      const swId = allocInstanceId('sw-cluster-01');
      mountedDevices.push({
        instance_id: swId,
        blueprint_slug: switchBp.slug,
        u_position: nextU,
        face: 'front',
        hostname: 'Proxmox Cluster Switch',
        children: [],
      });
      mountedNodeEndpoints.forEach((node, idx) => {
        const swPort = findFirstFreePort(switchBp, usedPorts, swId, 'rj45');
        const nodePort = findFirstFreePort(node.bp, usedPorts, node.id, 'rj45');
        if (!swPort || !nodePort) return;
        usedPorts.add(`${swId}:${swPort}`);
        usedPorts.add(`${node.id}:${nodePort}`);
        cables.push({
          cable_id: `pve-lan-${idx + 1}`,
          from: { instance_id: node.id, port_id: nodePort },
          to: { instance_id: swId, port_id: swPort },
          cable_type: 'cat6a',
          color_hex: '#10B981',
          label: `${node.id} Mgmt/Cluster`,
        });
        importedCables++;
      });
    }
  }

  const candidateProject: RackProjectInput = {
    schema_version: '1.0',
    project_name: projectName,
    rack: {
      standard: rackStandard,
      u_height: Math.max(4, Math.min(60, uHeight)),
      rail_depth_mm: Math.max(150, Math.min(2000, railDepthMm)),
      enclosure_type: 'open-frame',
      front_door_clearance_mm: rackStandard === '19inch' ? 55 : 45,
      rear_clearance_mm: rackStandard === '19inch' ? 60 : 45,
    },
    mounted_devices: mountedDevices,
    cables,
    external_endpoints: [],
  };

  const validated = RackProjectSchema.parse(candidateProject);
  const yamlText = stringifyYaml(validated);

  return {
    format: options.format,
    project: validated,
    yaml: yamlText,
    matchedDevices,
    fallbackDevices,
    importedCables,
    warnings,
  };
}
