import { useMemo, useState } from 'react';
import { stringify as stringifyYaml } from 'yaml';
import {
  HardwareBlueprintSchema,
  type CableType,
  type ConnectorType,
  type ElectricalRole,
  type HardwareBlueprint,
  type HardwareCategory,
  type MountType,
  type PortDefinition,
  type PortDirection,
  type RackFace,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import type { CustomBlueprintRegisterResult } from '../../state/useRackState.js';

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
  readonly onRegisterCustomBlueprint?:
    | ((rawBlueprint: unknown) => CustomBlueprintRegisterResult)
    | undefined;
}

const CUSTOM_CATEGORY_OPTIONS: readonly HardwareCategory[] = [
  'switch',
  'router',
  'mini-pc',
  'compute-node',
  'nas',
  'patch-panel',
  'pdu',
  'ups',
  'modular-carrier',
  'shelf',
];

const CUSTOM_MOUNT_OPTIONS: readonly MountType[] = [
  'rackmount-10',
  'rackmount-19',
  'rackmount-6',
  'sub-module',
  'shelf-standing',
];

const CUSTOM_ROLE_OPTIONS: readonly ElectricalRole[] = [
  'consumer',
  'pse-switch',
  'pdu',
  'ups',
  'passive',
];

const CUSTOM_CONNECTOR_OPTIONS: readonly ConnectorType[] = [
  'rj45',
  'sfp-plus',
  'iec-c14',
  'iec-c13',
  'schuko-cee7',
  'dc-5525',
  'usb-c',
  'rj45-serial-console',
];

function triggerYamlDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/yaml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

interface WizardPortDraft {
  readonly port_id: string;
  readonly label: string;
  readonly face: RackFace;
  readonly connector_type: ConnectorType;
  readonly direction: PortDirection;
}

const WIZARD_INPUT_STYLE = {
  width: '100%',
  padding: '6px 8px',
  borderRadius: '6px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: '#18181d',
  color: '#F4F4F5',
  fontSize: '11.5px',
} as const;

function CustomBlueprintWizardForm({
  onRegisterCustomBlueprint,
  onMountEquipment,
  targetU,
  targetFace,
}: {
  readonly onRegisterCustomBlueprint?:
    | ((rawBlueprint: unknown) => CustomBlueprintRegisterResult)
    | undefined;
  readonly onMountEquipment: (
    blueprintSlug: string,
    targetU: number,
    face: RackFace,
    hostname?: string,
  ) => void;
  readonly targetU: number;
  readonly targetFace: RackFace;
}) {
  const [slug, setSlug] = useState<string>('custom-lab-appliance-1u');
  const [manufacturer, setManufacturer] = useState<string>('Custom Lab');
  const [model, setModel] = useState<string>('Edge Appliance 1U');
  const [category, setCategory] = useState<HardwareCategory>('mini-pc');
  const [mountType, setMountType] = useState<MountType>('rackmount-10');
  const [uHeight, setUHeight] = useState<number>(1);
  const [widthMm, setWidthMm] = useState<number>(220);
  const [heightMm, setHeightMm] = useState<number>(43.7);
  const [depthMm, setDepthMm] = useState<number>(145);
  const [weightGrams, setWeightGrams] = useState<number>(1150);
  const [electricalRole, setElectricalRole] =
    useState<ElectricalRole>('consumer');
  const [maxWatts, setMaxWatts] = useState<number>(35);
  const [priceEur, setPriceEur] = useState<string>('249');
  const [chassisColorHex, setChassisColorHex] = useState<string>('#27272A');
  const [ports, setPorts] = useState<readonly WizardPortDraft[]>([
    {
      port_id: 'eth0',
      label: 'LAN1',
      face: 'front',
      connector_type: 'rj45',
      direction: 'bidirectional',
    },
    {
      port_id: 'pwr-in',
      label: 'DC-IN',
      face: 'rear',
      connector_type: 'dc-5525',
      direction: 'input',
    },
  ]);
  const [statusFeedback, setStatusFeedback] = useState<{
    readonly ok: boolean;
    readonly text: string;
    readonly registeredSlug?: string | undefined;
  } | null>(null);

  const draftBlueprint = useMemo(() => {
    const parsedPrice = Number(priceEur);
    const expandedPorts: PortDefinition[] = ports.map((p, idx) => ({
      port_id: p.port_id.trim() || `port-${idx + 1}`,
      label: p.label.trim() || `P${idx + 1}`,
      face: p.face,
      connector_type: p.connector_type,
      direction: p.direction,
      capabilities:
        p.connector_type === 'rj45'
          ? ['2500base-t', '1000base-t']
          : p.connector_type === 'sfp-plus'
            ? ['10gbase-sr', '10gbase-dac']
            : p.connector_type === 'dc-5525'
              ? ['dc-power']
              : p.connector_type === 'usb-c'
                ? ['usb-pd']
                : p.connector_type === 'iec-c13' ||
                    p.connector_type === 'iec-c14' ||
                    p.connector_type === 'schuko-cee7'
                  ? ['ac-mains']
                  : ['serial-rs232'],
      coordinates: {
        x_mm: Math.min(Math.max(12, widthMm - 14), 16 + idx * 24),
        y_mm: Math.max(8, Math.min(heightMm - 8, heightMm * 0.5)),
        orientation: 'upright',
      },
    }));

    return {
      slug: slug.trim(),
      manufacturer: manufacturer.trim(),
      model: model.trim(),
      category,
      mount_type: mountType,
      ...(mountType === 'sub-module'
        ? { slot_compatibility: 'mini-pc-1liter' }
        : {}),
      geometry: {
        u_height: mountType === 'sub-module' ? 0 : uHeight,
        width_mm: widthMm,
        height_mm: heightMm,
        depth_mm: depthMm,
        ear_mount_style:
          mountType === 'rackmount-19'
            ? 'included-19inch-ears'
            : mountType === 'rackmount-10'
              ? 'included-10inch-ears'
              : mountType === 'rackmount-6'
                ? 'included-6inch-ears'
                : mountType === 'sub-module'
                  ? 'sub-module-clip'
                  : 'none',
        weight_grams: weightGrams,
      },
      power_and_thermal: {
        electrical_role: electricalRole,
        idle_watts: Math.round(maxWatts * 0.35),
        max_system_watts: maxWatts,
        ...(electricalRole === 'pse-switch'
          ? { poe_budget_watts: Math.max(30, maxWatts) }
          : {}),
        airflow: 'front-to-rear',
      },
      ports: expandedPorts,
      visuals: {
        chassis_color_hex: /^#[0-9A-Fa-f]{6}$/.test(chassisColorHex)
          ? chassisColorHex
          : '#27272A',
        material_preset: 'matte-black-steel',
        has_oled_display: false,
      },
      ...(Number.isFinite(parsedPrice) && parsedPrice >= 0 && priceEur.trim() !== ''
        ? { estimated_price_eur: parsedPrice }
        : {}),
    };
  }, [
    category,
    chassisColorHex,
    depthMm,
    electricalRole,
    heightMm,
    manufacturer,
    maxWatts,
    model,
    mountType,
    ports,
    priceEur,
    slug,
    uHeight,
    weightGrams,
    widthMm,
  ]);

  const schemaCheck = useMemo(
    () => HardwareBlueprintSchema.safeParse(draftBlueprint),
    [draftBlueprint],
  );

  const handleRegister = () => {
    if (!schemaCheck.success) {
      setStatusFeedback({
        ok: false,
        text: schemaCheck.error.issues
          .map((i) => `${i.path.join('.')}: ${i.message}`)
          .join('; '),
      });
      return;
    }
    if (!onRegisterCustomBlueprint) {
      setStatusFeedback({
        ok: false,
        text: 'Blueprint registration callback is not connected.',
      });
      return;
    }
    const res = onRegisterCustomBlueprint(draftBlueprint);
    if (res.ok && res.slug) {
      setStatusFeedback({
        ok: true,
        text: `Registered '${res.slug}' in live catalog.`,
        registeredSlug: res.slug,
      });
    } else {
      setStatusFeedback({
        ok: false,
        text: res.error ?? 'Failed to register custom blueprint.',
      });
    }
  };

  return (
    <form
      data-testid="custom-blueprint-wizard"
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
      }}
      style={{
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#93C5FD',
          }}
        >
          Custom Hardware Blueprint Wizard
        </span>
        <span
          data-testid="custom-bp-validation-status"
          className="mono"
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            background: schemaCheck.success
              ? 'rgba(16, 185, 129, 0.14)'
              : 'rgba(239, 68, 68, 0.14)',
            color: schemaCheck.success ? '#6EE7B7' : '#FCA5A5',
          }}
        >
          {schemaCheck.success ? 'Zod Valid' : 'Schema Error'}
        </span>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
          Catalog Slug (kebab-case)
        </label>
        <input
          data-testid="custom-bp-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="mono"
          style={WIZARD_INPUT_STYLE}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Manufacturer
          </label>
          <input
            data-testid="custom-bp-manufacturer"
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            style={WIZARD_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Model
          </label>
          <input
            data-testid="custom-bp-model"
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            style={WIZARD_INPUT_STYLE}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Category
          </label>
          <select
            data-testid="custom-bp-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as HardwareCategory)}
            style={WIZARD_INPUT_STYLE}
          >
            {CUSTOM_CATEGORY_OPTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Mount Form Factor
          </label>
          <select
            data-testid="custom-bp-mount-type"
            value={mountType}
            onChange={(e) => setMountType(e.target.value as MountType)}
            style={WIZARD_INPUT_STYLE}
          >
            {CUSTOM_MOUNT_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Width (mm)
          </label>
          <input
            data-testid="custom-bp-width"
            type="number"
            step="0.5"
            min={10}
            max={999}
            value={widthMm}
            onChange={(e) => setWidthMm(Number(e.target.value))}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Height (mm)
          </label>
          <input
            data-testid="custom-bp-height"
            type="number"
            step="0.1"
            min={5}
            max={1000}
            value={heightMm}
            onChange={(e) => setHeightMm(Number(e.target.value))}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Depth (mm)
          </label>
          <input
            data-testid="custom-bp-depth"
            type="number"
            step="1"
            min={5}
            max={1500}
            value={depthMm}
            onChange={(e) => setDepthMm(Number(e.target.value))}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            U-Span
          </label>
          <input
            type="number"
            step="0.5"
            min={0}
            max={12}
            value={uHeight}
            onChange={(e) => setUHeight(Number(e.target.value))}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Watts
          </label>
          <input
            data-testid="custom-bp-watts"
            type="number"
            min={0}
            max={10000}
            value={maxWatts}
            onChange={(e) => setMaxWatts(Number(e.target.value))}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Mass (g)
          </label>
          <input
            type="number"
            min={0}
            max={100000}
            value={weightGrams}
            onChange={(e) => setWeightGrams(Number(e.target.value))}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Est. €
          </label>
          <input
            type="number"
            min={0}
            value={priceEur}
            onChange={(e) => setPriceEur(e.target.value)}
            className="mono"
            style={WIZARD_INPUT_STYLE}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', alignItems: 'end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Electrical Role
          </label>
          <select
            value={electricalRole}
            onChange={(e) => setElectricalRole(e.target.value as ElectricalRole)}
            style={WIZARD_INPUT_STYLE}
          >
            {CUSTOM_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '10px', color: '#A1A1AA', marginBottom: '3px' }}>
            Color
          </label>
          <input
            type="color"
            value={chassisColorHex}
            onChange={(e) => setChassisColorHex(e.target.value)}
            style={{
              width: '42px',
              height: '29px',
              padding: '2px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#18181d',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#D4D4D8' }}>
            Ports ({ports.length})
          </span>
          <button
            type="button"
            data-testid="btn-wizard-add-port"
            onClick={() =>
              setPorts((prev) => [
                ...prev,
                {
                  port_id: `port-${prev.length + 1}`,
                  label: `P${prev.length + 1}`,
                  face: 'front',
                  connector_type: 'rj45',
                  direction: 'bidirectional',
                },
              ])
            }
            style={{
              padding: '3px 8px',
              borderRadius: '5px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: '#18181d',
              color: '#93C5FD',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            + Add Port
          </button>
        </div>

        {ports.map((p, idx) => (
          <div
            key={`wiz-port-${idx}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 68px auto',
              gap: '4px',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              value={p.port_id}
              onChange={(e) =>
                setPorts((prev) =>
                  prev.map((item, i) =>
                    i === idx ? { ...item, port_id: e.target.value } : item,
                  ),
                )
              }
              className="mono"
              style={WIZARD_INPUT_STYLE}
              aria-label={`Port ${idx + 1} ID`}
            />
            <select
              value={p.connector_type}
              onChange={(e) =>
                setPorts((prev) =>
                  prev.map((item, i) =>
                    i === idx
                      ? {
                          ...item,
                          connector_type: e.target.value as ConnectorType,
                        }
                      : item,
                  ),
                )
              }
              style={WIZARD_INPUT_STYLE}
              aria-label={`Port ${idx + 1} Connector`}
            >
              {CUSTOM_CONNECTOR_OPTIONS.map((ct) => (
                <option key={ct} value={ct}>
                  {ct}
                </option>
              ))}
            </select>
            <select
              value={p.face}
              onChange={(e) =>
                setPorts((prev) =>
                  prev.map((item, i) =>
                    i === idx ? { ...item, face: e.target.value as RackFace } : item,
                  ),
                )
              }
              style={WIZARD_INPUT_STYLE}
              aria-label={`Port ${idx + 1} Face`}
            >
              <option value="front">front</option>
              <option value="rear">rear</option>
            </select>
            <button
              type="button"
              onClick={() =>
                setPorts((prev) => prev.filter((_, i) => i !== idx))
              }
              style={{
                padding: '4px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#18181d',
                color: '#A1A1AA',
                fontSize: '10px',
                cursor: 'pointer',
              }}
              aria-label={`Remove port ${idx + 1}`}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {statusFeedback && (
        <div
          data-testid="custom-bp-feedback"
          style={{
            padding: '7px 9px',
            borderRadius: '6px',
            fontSize: '11px',
            background: '#18181d',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            borderLeft: `2.5px solid ${statusFeedback.ok ? '#10B981' : '#EF4444'}`,
            color: statusFeedback.ok ? '#6EE7B7' : '#FCA5A5',
          }}
        >
          <div>{statusFeedback.text}</div>
          {statusFeedback.ok &&
            statusFeedback.registeredSlug &&
            mountType !== 'sub-module' && (
              <button
                type="button"
                data-testid="btn-mount-registered-custom-bp"
                onClick={() =>
                  onMountEquipment(
                    statusFeedback.registeredSlug as string,
                    targetU,
                    targetFace,
                  )
                }
                style={{
                  marginTop: '6px',
                  padding: '4px 8px',
                  borderRadius: '5px',
                  border: '1px solid rgba(59, 130, 246, 0.35)',
                  background: 'rgba(59, 130, 246, 0.14)',
                  color: '#93C5FD',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                + Mount on U{targetU}
              </button>
            )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
        <button
          type="button"
          data-testid="btn-register-custom-blueprint"
          onClick={handleRegister}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            background: 'rgba(16, 185, 129, 0.14)',
            color: '#6EE7B7',
            fontSize: '11.5px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Register &amp; Add to Catalog
        </button>
        <button
          type="button"
          data-testid="btn-download-custom-blueprint-yaml"
          onClick={() =>
            triggerYamlDownload(
              stringifyYaml(draftBlueprint, { indent: 2 }),
              `${slug.trim() || 'custom-hardware'}.yaml`,
            )
          }
          style={{
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background: '#18181d',
            color: '#E4E4E7',
            fontSize: '11.5px',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          Download .yaml
        </button>
        <a
          href={`https://github.com/itAlex240/rack-architect-mcp/issues/new?${new URLSearchParams({
            title: `Catalog Request: ${manufacturer.trim() || 'Hardware'} ${model.trim() || slug.trim() || 'Custom Device'}`,
            labels: 'hardware-catalog',
            body: `### Hardware Blueprint Submission\n\nSlug: \`${slug.trim() || 'custom-hardware'}\`\n\n\`\`\`yaml\n${stringifyYaml(draftBlueprint, { indent: 2 }).slice(0, 1800)}\n\`\`\`\n\n_Submitted via RackArchitect MCP Custom Blueprint Wizard_`,
          }).toString()}`}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="btn-submit-blueprint-github"
          title="Open pre-filled GitHub Issue to contribute this hardware blueprint"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '8px 10px',
            borderRadius: '6px',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#93C5FD',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          GitHub Catalog
        </a>
      </div>
    </form>
  );
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
  onRegisterCustomBlueprint,
}: CatalogBuilderDrawerProps) {
  const [activeDrawerTab, setActiveDrawerTab] = useState<'catalog' | 'custom'>(
    'catalog',
  );
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
        background: '#121216',
        borderRight: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          background: '#0e0e11',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: '11.5px',
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: '#F4F4F5',
          }}
        >
          Hardware Catalog &amp; Patcher
        </div>
        <button
          type="button"
          data-testid="btn-close-catalog-drawer"
          onClick={onClose}
          style={{
            padding: '4px 8px',
            borderRadius: '5px',
            border: '1px solid rgba(255, 255, 255, 0.09)',
            background: '#18181d',
            color: '#A1A1AA',
            fontSize: '11px',
            cursor: 'pointer',
          }}
        >
          Close ✕
        </button>
      </div>

      {/* Mode Switcher: Hardware Catalog & Patcher vs. Custom Blueprint Wizard */}
      <div
        style={{
          padding: '8px 16px',
          background: '#0e0e11',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '4px',
        }}
      >
        <button
          type="button"
          data-testid="tab-catalog-patcher"
          onClick={() => setActiveDrawerTab('catalog')}
          style={{
            padding: '5px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background:
              activeDrawerTab === 'catalog'
                ? 'rgba(59, 130, 246, 0.16)'
                : '#15151a',
            color: activeDrawerTab === 'catalog' ? '#93C5FD' : '#A1A1AA',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Devices &amp; Cables
        </button>
        <button
          type="button"
          data-testid="tab-custom-blueprint"
          onClick={() => setActiveDrawerTab('custom')}
          style={{
            padding: '5px 8px',
            borderRadius: '6px',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            background:
              activeDrawerTab === 'custom'
                ? 'rgba(16, 185, 129, 0.16)'
                : '#15151a',
            color: activeDrawerTab === 'custom' ? '#6EE7B7' : '#A1A1AA',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Custom Blueprint
        </button>
      </div>

      {activeDrawerTab === 'custom' ? (
        <CustomBlueprintWizardForm
          onRegisterCustomBlueprint={onRegisterCustomBlueprint}
          onMountEquipment={onMountEquipment}
          targetU={targetU}
          targetFace={targetFace}
        />
      ) : (
        <>
          {/* Section 1: Interactive Point-to-Point Cable Patcher */}
      <section
        data-testid="interactive-cable-patcher"
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: '#0e0e11',
        }}
      >
        <div
          style={{
            fontSize: '10.5px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#A1A1AA',
          }}
        >
          Point-to-Point 3D Cable Patcher
        </div>

        <label style={{ fontSize: '11px', color: '#A1A1AA' }}>
          From Port
          <select
            data-testid="select-cable-from"
            value={fromEndpoint}
            onChange={(e) => setFromEndpoint(e.target.value)}
            style={{
              width: '100%',
              marginTop: '4px',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#F4F4F5',
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

        <label style={{ fontSize: '11px', color: '#A1A1AA' }}>
          To Port
          <select
            data-testid="select-cable-to"
            value={toEndpoint}
            onChange={(e) => setToEndpoint(e.target.value)}
            style={{
              width: '100%',
              marginTop: '4px',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#F4F4F5',
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

        <label style={{ fontSize: '11px', color: '#A1A1AA' }}>
          Cable Assembly Type
          <select
            data-testid="select-cable-type"
            value={selectedCableType}
            onChange={(e) => setSelectedCableType(e.target.value as CableType)}
            style={{
              width: '100%',
              marginTop: '4px',
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#F4F4F5',
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
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#F4F4F5',
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
              padding: '6px 8px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#F4F4F5',
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
            border: '1px solid rgba(16, 185, 129, 0.35)',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#6EE7B7',
            fontSize: '11.5px',
            fontWeight: 600,
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
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: '#A1A1AA',
            }}
          >
            Hardware Catalog
          </span>
          <span
            className="mono"
            style={{ fontSize: '10.5px', color: '#71717A' }}
          >
            {filteredCatalog.length} blueprints
          </span>
        </div>

        {/* Target U & Face Selector */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '8px 10px',
            borderRadius: '6px',
            background: '#18181d',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <label style={{ fontSize: '11px', color: '#A1A1AA', flex: 1 }}>
            Target U:
            <select
              data-testid="select-mount-u"
              value={targetU}
              onChange={(e) => setTargetU(Number(e.target.value))}
              style={{
                marginLeft: '6px',
                padding: '3px 6px',
                borderRadius: '5px',
                background: '#0e0e11',
                color: '#F4F4F5',
                border: '1px solid rgba(255, 255, 255, 0.09)',
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

          <label style={{ fontSize: '11px', color: '#A1A1AA', flex: 1 }}>
            Face:
            <select
              data-testid="select-mount-face"
              value={targetFace}
              onChange={(e) => setTargetFace(e.target.value as RackFace)}
              style={{
                marginLeft: '6px',
                padding: '3px 6px',
                borderRadius: '5px',
                background: '#0e0e11',
                color: '#F4F4F5',
                border: '1px solid rgba(255, 255, 255, 0.09)',
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
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#F4F4F5',
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
              border: '1px solid rgba(255, 255, 255, 0.09)',
              background: '#18181d',
              color: '#A1A1AA',
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
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: '#18181d',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
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
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#F4F4F5',
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
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#A1A1AA',
                      flexShrink: 0,
                    }}
                  >
                    {bp.category}
                  </span>
                </div>
                <div
                  className="mono"
                  style={{ fontSize: '10.5px', color: '#71717A' }}
                >
                  {bp.geometry.width_mm}×{bp.geometry.height_mm}×
                  {bp.geometry.depth_mm}mm • {bp.ports.length} Ports •{' '}
                  {bp.power_and_thermal.max_system_watts}W
                </div>
                {bp.description && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#A1A1AA',
                      lineHeight: 1.4,
                    }}
                  >
                    {bp.description}
                  </div>
                )}
                {!isSubModule && (
                  <button
                    type="button"
                    data-testid={`mount-blueprint-${bp.slug}`}
                    onClick={() =>
                      onMountEquipment(bp.slug, targetU, targetFace)
                    }
                    style={{
                      marginTop: '3px',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: '#93C5FD',
                      fontSize: '11px',
                      fontWeight: 600,
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
        </>
      )}
    </aside>
  );
}
