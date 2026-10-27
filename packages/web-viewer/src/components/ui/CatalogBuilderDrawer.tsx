import { useState } from 'react';
import type {
  CableType,
  HardwareBlueprint,
  RackFace,
  SerializedRackScene,
} from '@rack-mcp/core-domain';

export interface CatalogBuilderDrawerProps {
  readonly open: boolean;
  readonly catalog: readonly HardwareBlueprint[];
  readonly scene: SerializedRackScene;
  readonly onClose: () => void;
  readonly onMountEquipment: (
    blueprintSlug: string,
    targetU: number,
    face: RackFace,
    hostname?: string,
  ) => void;
  readonly onConnectCable: (
    fromInstanceId: string,
    fromPortId: string,
    toInstanceId: string,
    toPortId: string,
    cableType: CableType,
    vlanId?: number,
    ipCidr?: string,
  ) => void;
}

const CABLE_TYPE_OPTIONS: ReadonlyArray<{
  readonly value: CableType;
  readonly label: string;
}> = [
  { value: 'cat6a', label: 'Cat6A (10G / 2.5G RJ45)' },
  { value: 'cat6', label: 'Cat6 (1G / 2.5G RJ45)' },
  { value: 'cat5e', label: 'Cat5e (1G Legacy — Speed Bottleneck Test)' },
  { value: 'sfp-plus-dac', label: '10G SFP+ DAC Twinax' },
  { value: 'power-c13-c14', label: 'IEC C13 -> C14 Mains Cord' },
  { value: 'power-schuko-c13', label: 'Schuko CEE7 -> IEC C13' },
  { value: 'power-dc-5525', label: 'DC 5.5x2.5mm Power Lead' },
  { value: 'power-usb-c', label: 'USB-C PD Power Cable' },
];

export function CatalogBuilderDrawer({
  open,
  catalog,
  scene,
  onClose,
  onMountEquipment,
  onConnectCable,
}: CatalogBuilderDrawerProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [targetU, setTargetU] = useState<number>(6);
  const [targetFace, setTargetFace] = useState<RackFace>('front');

  const firstDev = scene.geometry.devices[0];
  const secondDev = scene.geometry.devices[1] ?? firstDev;
  const [fromEndpoint, setFromEndpoint] = useState<string>(() =>
    firstDev && firstDev.ports[0]
      ? `${firstDev.instance_id}::${firstDev.ports[0].port_id}`
      : '',
  );
  const [toEndpoint, setToEndpoint] = useState<string>(() =>
    secondDev && secondDev.ports[0]
      ? `${secondDev.instance_id}::${secondDev.ports[0].port_id}`
      : '',
  );
  const [selectedCableType, setSelectedCableType] =
    useState<CableType>('cat6a');
  const [vlanInput, setVlanInput] = useState<string>('');
  const [cidrInput, setCidrInput] = useState<string>('');

  if (!open) {
    return null;
  }

  const uCount = scene.project.rack.u_height;
  const filteredCatalog = catalog.filter((bp) => {
    if (categoryFilter !== 'all' && bp.category !== categoryFilter) {
      return false;
    }
    if (!searchQuery.trim()) {
      return true;
    }
    const q = searchQuery.toLowerCase();
    return (
      bp.slug.toLowerCase().includes(q) ||
      bp.manufacturer.toLowerCase().includes(q) ||
      bp.model.toLowerCase().includes(q) ||
      bp.category.toLowerCase().includes(q)
    );
  });

  const allPortOptions = scene.geometry.devices.flatMap((dev) =>
    dev.ports.map((p) => ({
      key: `${dev.instance_id}::${p.port_id}`,
      label: `U${dev.u_position} ${dev.instance_id}:${p.port_id} (${p.connector_type} • ${p.world_face})`,
    })),
  );

  return (
    <aside
      data-testid="catalog-builder-drawer"
      style={{
        width: '360px',
        height: '100%',
        background: '#0F172A',
        borderRight: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          className="mono"
          style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}
        >
          HARDWARE CATALOG &amp; CABLE BUILDER
        </div>
        <button
          type="button"
          data-testid="btn-close-catalog-drawer"
          onClick={onClose}
          style={{
            padding: '3px 8px',
            borderRadius: '4px',
            border: '1px solid #334155',
            background: '#1E293B',
            color: '#94A3B8',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          Close ✕
        </button>
      </div>

      {/* Section 1: Interactive Point-to-Point Cable Patcher */}
      <section
        data-testid="interactive-cable-patcher"
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: '#0B1120',
        }}
      >
        <div
          className="mono"
          style={{ fontSize: '11px', fontWeight: 700, color: '#10B981' }}
        >
          1. POINT-TO-POINT 3D CABLE PATCHER
        </div>

        <label style={{ fontSize: '10.5px', color: '#94A3B8' }}>
          From Port:
          <select
            data-testid="select-cable-from"
            value={fromEndpoint}
            onChange={(e) => setFromEndpoint(e.target.value)}
            style={{
              width: '100%',
              marginTop: '3px',
              padding: '5px 8px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '11px',
            }}
          >
            {allPortOptions.map((opt) => (
              <option key={`from-${opt.key}`} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: '10.5px', color: '#94A3B8' }}>
          To Port:
          <select
            data-testid="select-cable-to"
            value={toEndpoint}
            onChange={(e) => setToEndpoint(e.target.value)}
            style={{
              width: '100%',
              marginTop: '3px',
              padding: '5px 8px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '11px',
            }}
          >
            {allPortOptions.map((opt) => (
              <option key={`to-${opt.key}`} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label style={{ fontSize: '10.5px', color: '#94A3B8' }}>
          Cable Assembly Type:
          <select
            data-testid="select-cable-type"
            value={selectedCableType}
            onChange={(e) => setSelectedCableType(e.target.value as CableType)}
            style={{
              width: '100%',
              marginTop: '3px',
              padding: '5px 8px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '11px',
            }}
          >
            {CABLE_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="number"
            min={1}
            max={4094}
            placeholder="VLAN ID (e.g. 20)"
            data-testid="input-cable-vlan"
            value={vlanInput}
            onChange={(e) => setVlanInput(e.target.value)}
            style={{
              flex: 1,
              padding: '5px 8px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '11px',
            }}
          />
          <input
            type="text"
            placeholder="IP CIDR (10.20.0.0/24)"
            data-testid="input-cable-cidr"
            value={cidrInput}
            onChange={(e) => setCidrInput(e.target.value)}
            style={{
              flex: 1,
              padding: '5px 8px',
              borderRadius: '5px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '11px',
            }}
          />
        </div>

        <button
          type="button"
          data-testid="btn-add-cable"
          onClick={() => {
            const [fromInst, fromPort] = fromEndpoint.split('::');
            const [toInst, toPort] = toEndpoint.split('::');
            if (!fromInst || !fromPort || !toInst || !toPort) return;
            const parsedVlan = Number(vlanInput);
            const validVlan =
              vlanInput.trim().length > 0 &&
              !Number.isNaN(parsedVlan) &&
              parsedVlan >= 1 &&
              parsedVlan <= 4094
                ? Math.round(parsedVlan)
                : undefined;
            onConnectCable(
              fromInst,
              fromPort,
              toInst,
              toPort,
              selectedCableType,
              validVlan,
              cidrInput,
            );
          }}
          style={{
            padding: '7px 12px',
            borderRadius: '6px',
            border: '1px solid #10B981',
            background: '#064E3B',
            color: '#34D399',
            fontSize: '11.5px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Route 3D Spline Cable
        </button>
      </section>

      {/* Section 2: Hardware Catalog Browser & 1-Click Mount */}
      <section
        style={{
          padding: '14px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          flex: 1,
        }}
      >
        <div
          className="mono"
          style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8' }}
        >
          2. HARDWARE CATALOG ({filteredCatalog.length} BLUEPRINTS)
        </div>

        {/* Target U & Face Selector */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '8px',
            borderRadius: '6px',
            background: '#1E293B',
            border: '1px solid #334155',
          }}
        >
          <label style={{ fontSize: '11px', color: '#CBD5E1', flex: 1 }}>
            Target U:
            <select
              data-testid="select-mount-u"
              value={targetU}
              onChange={(e) => setTargetU(Number(e.target.value))}
              style={{
                marginLeft: '6px',
                padding: '3px 6px',
                borderRadius: '4px',
                background: '#090D16',
                color: '#38BDF8',
                border: '1px solid #334155',
                fontSize: '11px',
              }}
            >
              {Array.from({ length: uCount }, (_, i) => i + 1).map((u) => (
                <option key={u} value={u}>
                  U{u}
                </option>
              ))}
            </select>
          </label>

          <label style={{ fontSize: '11px', color: '#CBD5E1', flex: 1 }}>
            Face:
            <select
              data-testid="select-mount-face"
              value={targetFace}
              onChange={(e) => setTargetFace(e.target.value as RackFace)}
              style={{
                marginLeft: '6px',
                padding: '3px 6px',
                borderRadius: '4px',
                background: '#090D16',
                color: '#F59E0B',
                border: '1px solid #334155',
                fontSize: '11px',
              }}
            >
              <option value="front">FRONT</option>
              <option value="rear">REAR</option>
            </select>
          </label>
        </div>

        {/* Search & Category Filter */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <input
            type="search"
            placeholder="Search Ubiquiti, Lenovo, 10inch..."
            data-testid="catalog-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '6px 9px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#F8FAFC',
              fontSize: '11.5px',
            }}
          />
          <select
            data-testid="catalog-category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid #334155',
              background: '#1E293B',
              color: '#CBD5E1',
              fontSize: '11px',
            }}
          >
            <option value="all">All Categories</option>
            <option value="switch">Switches</option>
            <option value="router">Routers / Gateways</option>
            <option value="modular-carrier">3D-Print Carriers</option>
            <option value="compute-node">Compute / Mini-PC</option>
            <option value="patch-panel">Patch Panels</option>
            <option value="pdu">PDUs</option>
            <option value="ups">UPS Units</option>
          </select>
        </div>

        {/* Blueprint Cards */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {filteredCatalog.map((bp) => {
            const isSubModule = bp.mount_type === 'sub-module';
            return (
              <div
                key={bp.slug}
                data-testid={`catalog-card-${bp.slug}`}
                style={{
                  padding: '10px',
                  borderRadius: '7px',
                  background: '#1E293B',
                  border: '1px solid #334155',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#F8FAFC',
                    }}
                  >
                    {bp.manufacturer} {bp.model}
                  </span>
                  <span
                    className="mono"
                    style={{
                      fontSize: '9.5px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: '#090D16',
                      color: '#38BDF8',
                    }}
                  >
                    {bp.category}
                  </span>
                </div>
                <div
                  className="mono"
                  style={{ fontSize: '10px', color: '#94A3B8' }}
                >
                  {bp.geometry.width_mm}×{bp.geometry.height_mm}×
                  {bp.geometry.depth_mm}mm • {bp.ports.length} Ports •{' '}
                  {bp.power_and_thermal.max_system_watts}W
                </div>
                {!isSubModule && (
                  <button
                    type="button"
                    data-testid={`mount-blueprint-${bp.slug}`}
                    onClick={() =>
                      onMountEquipment(bp.slug, targetU, targetFace)
                    }
                    style={{
                      marginTop: '3px',
                      padding: '5px 9px',
                      borderRadius: '5px',
                      border: '1px solid #0284C7',
                      background: '#082F49',
                      color: '#38BDF8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + Mount on U{targetU} ({targetFace.toUpperCase()})
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
