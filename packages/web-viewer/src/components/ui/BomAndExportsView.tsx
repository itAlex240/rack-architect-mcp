import { useEffect, useMemo, useRef, useState } from 'react';
import { stringify as stringifyYaml } from 'yaml';
import {
  deserializeRackScene,
  EIA_310_SPECS,
  MM_PER_U,
  roundCentis,
  roundTenths,
  type RackStandard,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import {
  extractCableLabelEntries,
  generateBomMarkdown,
  generateCableLabelsCsv,
  generateCableLabelsSvg,
  generateCustomBracketOpenScad,
  generateCustomBracketStl,
  renderCustomBracketPreviewSvg,
  validateCustomBracketOptions,
  type BracketSplitHalf,
  type CustomBracketOptions,
} from '@rack-mcp/exporters';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';
import { exportRackShareCardPng } from '../../state/share-card-renderer.js';
import {
  generateClientCustomCoverPanelOpenScad,
  generateClientCustomCoverPanelStl,
  generateClientSideCarrierOpenScad,
  generateClientSideCarrierStl,
  renderClientCustomCoverPanelPreviewSvg,
  sanitizeClientCoverPanelLabel,
  type CoverPanelPatternType,
  type CoverPanelUHeight,
  type CustomCoverPanelOptions,
} from '../../state/standalone-homelab.js';
import { trackUiEvent } from '../../state/ui-telemetry.js';
import { StlPreview3D } from '../canvas/StlPreview3D.js';

export interface BomAndExportsViewProps {
  readonly scene: SerializedRackScene;
  readonly elevationSvg: string;
  readonly wiringSvg: string;
  readonly bomMarkdown: string;
  readonly labelsCsv?: string | undefined;
  readonly labelsSvg?: string | undefined;
  readonly projectYaml?: string | undefined;
  readonly electricityPricePerKwhEur?: number | undefined;
  readonly onChangeElectricityPricePerKwhEur?:
    | ((rateEur: number) => void)
    | undefined;
  readonly onExportShareCard?: (() => void) | undefined;
}

function triggerBlobDownload(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function toAsciiKebabSlug(raw: string): string {
  let out = '';
  let prevHyphen = true;
  const lower = raw.toLowerCase();
  for (let i = 0; i < lower.length; i++) {
    const code = lower.charCodeAt(i);
    const isAlnum =
      (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
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

export function BomAndExportsView({
  scene,
  elevationSvg,
  wiringSvg,
  bomMarkdown,
  labelsCsv,
  labelsSvg,
  projectYaml,
  electricityPricePerKwhEur,
  onChangeElectricityPricePerKwhEur,
  onExportShareCard,
}: BomAndExportsViewProps) {
  const customBracketRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location.hash === '#custom-bracket'
    ) {
      customBracketRef.current?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, []);
  const printableDevices = scene.geometry.devices.filter(
    (d) =>
      (d.blueprint.printable_metadata !== undefined &&
        d.blueprint.printable_metadata !== null) ||
      (d.mount_target === 'rack-unit' &&
        d.blueprint.visuals.material_preset === 'polycarbonate' &&
        d.blueprint.geometry.height_mm < 38.0),
  );
  const totalFilamentGrams = printableDevices.reduce(
    (sum, d) =>
      sum + (d.blueprint.printable_metadata?.filament_grams ?? 95),
    0,
  );

  const printableCoverPanelBlueprints = defaultCatalogRegistry
    .getAllBlueprints()
    .filter(
      (bp) =>
        bp.category === 'blank-panel' &&
        bp.printable_metadata !== undefined &&
        bp.printable_metadata !== null,
    );

  const routesById = new Map(scene.cable_routes.map((r) => [r.cable_id, r]));
  const pwr = scene.validation.power_summary;
  const computedScene = useMemo(() => deserializeRackScene(scene), [scene]);

  const [localRateEur, setLocalRateEur] = useState<number>(
    electricityPricePerKwhEur ?? 0.32,
  );
  useEffect(() => {
    if (electricityPricePerKwhEur !== undefined) {
      setLocalRateEur(electricityPricePerKwhEur);
    }
  }, [electricityPricePerKwhEur]);

  const activeRateEur = electricityPricePerKwhEur ?? localRateEur;
  const handleRateChange = (nextRate: number) => {
    const clamped = Number.isFinite(nextRate)
      ? Math.max(0, Math.min(5, roundCentis(nextRate)))
      : 0.32;
    setLocalRateEur(clamped);
    onChangeElectricityPricePerKwhEur?.(clamped);
  };

  const effectiveProjectYaml = useMemo(
    () =>
      projectYaml ??
      stringifyYaml(scene.project, { indent: 2, lineWidth: 120 }),
    [projectYaml, scene.project],
  );
  const effectiveBomMarkdown = useMemo(
    () =>
      onChangeElectricityPricePerKwhEur
        ? bomMarkdown
        : generateBomMarkdown(computedScene, undefined, {
            electricityPricePerKwhEur: activeRateEur,
          }),
    [activeRateEur, bomMarkdown, computedScene, onChangeElectricityPricePerKwhEur],
  );

  const [labelTapeWidthMm, setLabelTapeWidthMm] = useState<12 | 18 | 24>(18);
  const [labelsSectionOpen, setLabelsSectionOpen] = useState<boolean>(true);
  const effectiveLabelsCsv = useMemo(
    () => labelsCsv ?? generateCableLabelsCsv(computedScene),
    [computedScene, labelsCsv],
  );
  const effectiveLabelsSvg = useMemo(
    () =>
      labelsSvg && labelTapeWidthMm === 18
        ? labelsSvg
        : generateCableLabelsSvg(computedScene, {
            tapeWidthMm: labelTapeWidthMm,
          }),
    [computedScene, labelTapeWidthMm, labelsSvg],
  );
  const labelEntries = useMemo(
    () => extractCableLabelEntries(computedScene),
    [computedScene],
  );

  const [customStandard, setCustomStandard] = useState<RackStandard>(
    scene.project.rack.standard,
  );
  const [customUHeight, setCustomUHeight] = useState<CoverPanelUHeight>(1);
  const [customPattern, setCustomPattern] =
    useState<CoverPanelPatternType>('hex');
  const [customLabel, setCustomLabel] = useState<string>('');
  const [coverPreviewMode, setCoverPreviewMode] = useState<'svg' | 'stl'>(
    'svg',
  );

  useEffect(() => {
    setCustomStandard(scene.project.rack.standard);
  }, [scene.project.rack.standard]);

  const customCoverOpts = useMemo<CustomCoverPanelOptions>(
    () => ({
      standard: customStandard,
      u_height: customUHeight,
      pattern: customPattern,
      label_text: customLabel,
    }),
    [customLabel, customPattern, customStandard, customUHeight],
  );

  const customPreviewSvg = useMemo(
    () => renderClientCustomCoverPanelPreviewSvg(customCoverOpts),
    [customCoverOpts],
  );
  const customCoverStl = useMemo(
    () =>
      coverPreviewMode === 'stl'
        ? generateClientCustomCoverPanelStl(customCoverOpts)
        : '',
    [coverPreviewMode, customCoverOpts],
  );

  const customSpec = EIA_310_SPECS[customStandard];
  const customWidthMm = roundCentis(customSpec.W_panel);
  const customHeightMm = roundCentis(customUHeight * MM_PER_U - 0.75);
  const customDepthMm = 14.0;
  const customEstimatedGrams = roundTenths(
    Math.max(
      12,
      customWidthMm *
        customHeightMm *
        4.2 *
        0.00115 *
        (customPattern === 'vented-slots' ? 0.78 : 0.94),
    ),
  );
  const sanitizedCustomLabel = sanitizeClientCoverPanelLabel(customLabel);
  const customLabelSlug = sanitizedCustomLabel
    ? toAsciiKebabSlug(sanitizedCustomLabel)
    : '';
  const customFileStem = `custom-${customStandard}-cover-${String(customUHeight).replaceAll('.', 'p')}u-${customPattern}${
    customLabelSlug ? `-${customLabelSlug}` : ''
  }`;

  // Parametric Custom Device Bracket state (B4)
  const [bracketStandard, setBracketStandard] = useState<RackStandard>(
    scene.project.rack.standard,
  );
  useEffect(() => {
    setBracketStandard(scene.project.rack.standard);
  }, [scene.project.rack.standard]);
  const [bracketUHeight, setBracketUHeight] = useState<1 | 2 | 3>(1);
  const [bracketDeviceName, setBracketDeviceName] =
    useState<string>('Custom Mini-PC');
  const [bracketWidthMm, setBracketWidthMm] = useState<number>(127);
  const [bracketHeightMm, setBracketHeightMm] = useState<number>(30);
  const [bracketDepthMm, setBracketDepthMm] = useState<number>(127);
  const [bracketTolMm, setBracketTolMm] = useState<number>(0.4);
  const [bracketKeystones, setBracketKeystones] = useState<number>(2);
  const [bracketRetainerLip, setBracketRetainerLip] = useState<boolean>(true);
  const [bracketVentSlots, setBracketVentSlots] = useState<boolean>(true);
  const [bracketLabel, setBracketLabel] = useState<string>('NODE-01');
  const [bracketSplitHalf, setBracketSplitHalf] =
    useState<BracketSplitHalf>('full');
  const [bracketPreviewMode, setBracketPreviewMode] = useState<'svg' | 'stl'>(
    'svg',
  );
  const effectiveBracketSplitHalf: BracketSplitHalf =
    bracketStandard === '19inch' ? bracketSplitHalf : 'full';

  const bracketOpts = useMemo<CustomBracketOptions>(
    () => ({
      standard: bracketStandard,
      u_height: bracketUHeight,
      device_name: bracketDeviceName.trim() || 'Custom Device',
      device_width_mm: bracketWidthMm,
      device_height_mm: bracketHeightMm,
      device_depth_mm: bracketDepthMm,
      clearance_tolerance_mm: bracketTolMm,
      keystone_count: bracketKeystones,
      rear_retainer_lip: bracketRetainerLip,
      ventilation_slots: bracketVentSlots,
      ...(bracketLabel.trim().length > 0
        ? { engraved_label: bracketLabel.trim() }
        : {}),
      ...(effectiveBracketSplitHalf !== 'full'
        ? { split_half: effectiveBracketSplitHalf }
        : {}),
    }),
    [
      bracketDepthMm,
      bracketDeviceName,
      bracketHeightMm,
      bracketKeystones,
      bracketLabel,
      bracketRetainerLip,
      bracketStandard,
      bracketTolMm,
      bracketUHeight,
      bracketVentSlots,
      bracketWidthMm,
      effectiveBracketSplitHalf,
    ],
  );
  const bracketValidation = useMemo(
    () => validateCustomBracketOptions(bracketOpts),
    [bracketOpts],
  );
  const bracketPreviewSvg = useMemo(
    () => renderCustomBracketPreviewSvg(bracketOpts),
    [bracketOpts],
  );
  const bracketStl = useMemo(
    () =>
      bracketValidation.valid && bracketPreviewMode === 'stl'
        ? generateCustomBracketStl(bracketOpts)
        : '',
    [bracketOpts, bracketPreviewMode, bracketValidation.valid],
  );
  const bracketFileStem = `custom-${bracketStandard}-bracket-${bracketUHeight}u-${
    toAsciiKebabSlug(bracketDeviceName) || 'device'
  }${effectiveBracketSplitHalf !== 'full' ? `-${effectiveBracketSplitHalf}` : ''}`;

  const rawSessionParam =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('session')?.trim() ?? ''
      : '';
  const safeSessionId = /^[a-zA-Z0-9_-]{1,128}$/.test(rawSessionParam)
    ? rawSessionParam
    : '';

  return (
    <div
      data-testid="bom-and-exports-view"
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        padding: '24px 28px',
        background: '#09090b',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      {/* Export & Deliverables Bar */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '10px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#F4F4F5' }}>
            Deterministic CAD &amp; Procurement Deliverables
          </div>
          <div style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '3px' }}>
            Export synchronized 2D SVG elevations, wiring schematics, Markdown
            BOM, and 3D glTF 2.0 (.glb) assets.
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          <button
            type="button"
            data-testid="export-elevation-svg"
            onClick={() =>
              triggerBlobDownload(
                elevationSvg,
                'elevation.svg',
                'image/svg+xml;charset=utf-8',
              )
            }
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#93C5FD',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Download elevation.svg
          </button>

          <button
            type="button"
            data-testid="export-wiring-svg"
            onClick={() =>
              triggerBlobDownload(
                wiringSvg,
                'wiring-schematic.svg',
                'image/svg+xml;charset=utf-8',
              )
            }
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#6EE7B7',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Download wiring-schematic.svg
          </button>

          <button
            type="button"
            data-testid="export-bom-md"
            onClick={() =>
              triggerBlobDownload(
                effectiveBomMarkdown,
                'BOM.md',
                'text/markdown;charset=utf-8',
              )
            }
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#18181d',
              color: '#F4F4F5',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Download BOM.md
          </button>

          <button
            type="button"
            data-testid="export-rack-yaml"
            onClick={() =>
              triggerBlobDownload(
                effectiveProjectYaml,
                'rack.yaml',
                'text/yaml;charset=utf-8',
              )
            }
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#93C5FD',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Download rack.yaml
          </button>

          <button
            type="button"
            data-testid="export-rack-json"
            onClick={() =>
              triggerBlobDownload(
                JSON.stringify(scene.project, null, 2),
                'rack.json',
                'application/json;charset=utf-8',
              )
            }
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#18181d',
              color: '#A1A1AA',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Download rack.json
          </button>

          <button
            type="button"
            data-testid="export-labels-csv"
            onClick={() => {
              trackUiEvent('labels_download');
              triggerBlobDownload(
                effectiveLabelsCsv,
                'labels.csv',
                'text/csv;charset=utf-8',
              );
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#18181d',
              color: '#E4E4E7',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Download labels.csv
          </button>

          <button
            type="button"
            data-testid="export-labels-svg"
            onClick={() => {
              trackUiEvent('labels_download');
              triggerBlobDownload(
                effectiveLabelsSvg,
                'labels.svg',
                'image/svg+xml;charset=utf-8',
              );
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: '#18181d',
              color: '#E4E4E7',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Download labels.svg
          </button>

          <a
            href={
              safeSessionId
                ? `/api/export/scene.glb?session=${encodeURIComponent(safeSessionId)}`
                : '/api/export/scene.glb'
            }
            download="rack-scene.glb"
            data-testid="export-scene-glb"
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#D8B4FE',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Download rack-scene.glb
          </a>

          <button
            type="button"
            data-testid="export-share-card-png"
            onClick={() => {
              if (onExportShareCard) {
                onExportShareCard();
              } else {
                trackUiEvent('share_card_export');
                void exportRackShareCardPng(scene, elevationSvg);
              }
            }}
            style={{
              padding: '7px 12px',
              borderRadius: '6px',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              background: 'rgba(59, 130, 246, 0.12)',
              color: '#93C5FD',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Export Share Card (PNG)
          </button>
        </div>
      </div>

      {/* Power, UPS Runtime, Energy Cost & Indicative Budget Summary Bar (B6) */}
      <div
        data-testid="bom-energy-budget-bar"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
          gap: '12px',
        }}
      >
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase' }}>
            Power Draw (Idle / Peak)
          </div>
          <div
            className="mono"
            style={{ fontSize: '16px', fontWeight: 600, color: '#F4F4F5', marginTop: '4px' }}
          >
            {roundTenths(pwr.total_idle_watts)} W / {roundTenths(pwr.total_system_watts)} W
          </div>
          <div className="mono" style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '2px' }}>
            PoE Load: {roundTenths(pwr.total_poe_watts)} W ({pwr.power_sources.length} sources)
          </div>
        </div>

        <div
          data-testid="bom-ups-runtime-card"
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase' }}>
            UPS Backup Runtime (85% eff.)
          </div>
          {(() => {
            const upsSources = pwr.power_sources.filter(
              (s) => (s.battery_wh ?? 0) > 0,
            );
            const totalWh = upsSources.reduce(
              (sum, s) => sum + (s.battery_wh ?? 0),
              0,
            );
            const peakMin = upsSources[0]?.estimated_runtime_minutes_peak ?? 0;
            const runtimeMin = pwr.estimated_ups_runtime_minutes;
            return (
              <>
                <div
                  className="mono"
                  style={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color:
                      runtimeMin === null || upsSources.length === 0
                        ? '#71717A'
                        : runtimeMin < 15
                          ? '#F59E0B'
                          : '#10B981',
                    marginTop: '4px',
                  }}
                >
                  {runtimeMin !== null && upsSources.length > 0
                    ? `~${roundTenths(runtimeMin)} min typical`
                    : 'No UPS Detected'}
                </div>
                <div className="mono" style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '2px' }}>
                  {upsSources.length > 0
                    ? `${roundTenths(totalWh)} Wh • ~${roundTenths(peakMin)} min @ peak`
                    : 'Mount a UPS to compute outage autonomy'}
                </div>
              </>
            );
          })()}
        </div>

        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase' }}>
            Annual Energy &amp; Cost (24/7)
          </div>
          <div
            className="mono"
            data-testid="bom-annual-energy-cost"
            style={{ fontSize: '16px', fontWeight: 600, color: '#93C5FD' }}
          >
            {roundTenths(pwr.annual_energy_kwh_typical)} kWh/yr • ~€
            {roundCentis(pwr.annual_energy_kwh_typical * activeRateEur).toFixed(2)}
          </div>
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: '#A1A1AA',
            }}
          >
            <span>Electricity Rate (€/kWh):</span>
            <input
              type="number"
              step="0.01"
              min="0"
              max="5"
              data-testid="input-electricity-rate"
              aria-label="Electricity Rate (€/kWh)"
              value={activeRateEur}
              onChange={(e) => handleRateChange(Number(e.target.value))}
              className="mono"
              style={{
                width: '72px',
                padding: '2px 6px',
                borderRadius: '4px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: '#0E0E11',
                color: '#F4F4F5',
                fontSize: '11px',
              }}
            />
          </label>
        </div>

        <div
          data-testid="bom-hardware-budget-card"
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div style={{ fontSize: '10px', color: '#71717A', textTransform: 'uppercase' }}>
            Indicative Hardware Budget
          </div>
          <div
            className="mono"
            style={{ fontSize: '16px', fontWeight: 600, color: '#F4F4F5', marginTop: '4px' }}
          >
            €{roundCentis(pwr.estimated_hardware_budget_eur).toFixed(2)}
          </div>
          <div style={{ fontSize: '11px', color: '#A1A1AA', marginTop: '2px' }}>
            Catalog EUR street-price estimate
          </div>
        </div>
      </div>

      {/* Section 1: Commercial & Mounted Hardware BOM */}
      <section
        style={{
          padding: '18px 20px',
          borderRadius: '10px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '12.5px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#A1A1AA',
          }}
        >
          1. Mounted Equipment &amp; Sub-Module Schedule (
          {scene.geometry.devices.length} Units)
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
                color: '#71717A',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px', fontWeight: 500 }}>U / Slot</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Face</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Instance / Hostname</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Manufacturer &amp; Model</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Dimensions (mm)</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Max Draw</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Est. Price</th>
            </tr>
          </thead>
          <tbody>
            {scene.geometry.devices.map((dev) => (
              <tr
                key={dev.instance_id}
                style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <td className="mono" style={{ padding: '8px', color: '#93C5FD' }}>
                  U{dev.u_position}
                  {dev.slot_id ? ` • ${dev.slot_id}` : ''}
                </td>
                <td className="mono" style={{ padding: '8px', color: '#A1A1AA' }}>
                  {dev.face.toUpperCase()}
                </td>
                <td className="mono" style={{ padding: '8px', fontWeight: 600, color: '#F4F4F5' }}>
                  {dev.hostname ?? dev.instance_id}{' '}
                  <span style={{ color: '#71717A', fontWeight: 400 }}>
                    ({dev.instance_id})
                  </span>
                </td>
                <td style={{ padding: '8px', color: '#E4E4E7' }}>
                  <div style={{ fontWeight: 600 }}>
                    {dev.blueprint.manufacturer} {dev.blueprint.model}
                  </div>
                  {dev.blueprint.description && (
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#A1A1AA',
                        marginTop: '3px',
                        lineHeight: 1.4,
                      }}
                    >
                      {dev.blueprint.description}
                    </div>
                  )}
                </td>
                <td className="mono" style={{ padding: '8px', color: '#A1A1AA' }}>
                  {dev.blueprint.geometry.width_mm} ×{' '}
                  {dev.blueprint.geometry.height_mm} ×{' '}
                  {dev.blueprint.geometry.depth_mm} mm
                </td>
                <td className="mono" style={{ padding: '8px', color: '#F4F4F5' }}>
                  {dev.blueprint.power_and_thermal.max_system_watts} W
                </td>
                <td className="mono" style={{ padding: '8px', color: '#D4D4D8' }}>
                  {dev.blueprint.estimated_price_eur !== undefined
                    ? `€${dev.blueprint.estimated_price_eur.toFixed(0)}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section 2: 3D-Print Fabrication Queue */}
      <section
        style={{
          padding: '18px 20px',
          borderRadius: '10px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '12.5px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#A1A1AA',
          }}
        >
          2. 3D-Print Fabrication Queue ({printableDevices.length} Carriers •{' '}
          {totalFilamentGrams}g Total Filament)
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
                color: '#71717A',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px', fontWeight: 500 }}>Carrier Instance</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Blueprint Slug</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Material</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Filament</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Join Mechanism</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>3D CAD Export (.SCAD / .STL)</th>
            </tr>
          </thead>
          <tbody>
            {printableDevices.map((dev) => {
              const pm = dev.blueprint.printable_metadata ?? {
                material_recommendation: 'PETG / ABS',
                filament_grams: 95,
                fasteners: '4x M6 Cage Nuts (3D-Printed 10" Cradle)',
              };
              return (
                <tr
                  key={dev.instance_id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td
                    className="mono"
                    style={{ padding: '8px', fontWeight: 600, color: '#6EE7B7' }}
                  >
                    U{dev.u_position} • {dev.instance_id}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#E4E4E7' }}>
                    {dev.blueprint_slug}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#A1A1AA' }}>
                    {pm.material_recommendation}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#F4F4F5' }}>
                    {pm.filament_grams} g
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#71717A' }}>
                    {pm.fasteners ?? 'M4 Rack Screws'}
                  </td>
                  <td style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        data-testid={`download-scad-${dev.instance_id}`}
                        onClick={() =>
                          triggerBlobDownload(
                            generateClientSideCarrierOpenScad(
                              dev.blueprint,
                              scene.project.rack.standard,
                            ),
                            `${dev.blueprint_slug}.scad`,
                            'text/plain;charset=utf-8',
                          )
                        }
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: '1px solid rgba(59, 130, 246, 0.35)',
                          background: 'rgba(59, 130, 246, 0.12)',
                          color: '#93C5FD',
                          fontSize: '10.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        .SCAD
                      </button>
                      <button
                        type="button"
                        data-testid={`download-stl-${dev.instance_id}`}
                        onClick={() => {
                          trackUiEvent('stl_download');
                          triggerBlobDownload(
                            generateClientSideCarrierStl(
                              dev.blueprint,
                              scene.project.rack.standard,
                            ),
                            `${dev.blueprint_slug}.stl`,
                            'model/stl;charset=utf-8',
                          );
                        }}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '5px',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          background: 'rgba(16, 185, 129, 0.12)',
                          color: '#6EE7B7',
                          fontSize: '10.5px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        .STL
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 2.1 Interactive Custom 3D-Print Slot Cover-Panel Configurator */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#A1A1AA',
            }}
          >
            2.1 Custom 3D-Print Slot Cover-Panel Configurator (0.5U – 3U •
            Engraved Label • Watertight 2-Manifold .STL)
          </h4>

          <form
            data-testid="cover-panel-customizer-form"
            onSubmit={(e) => e.preventDefault()}
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div>
                <label
                  htmlFor="custom-cover-standard"
                  style={{
                    display: 'block',
                    fontSize: '10.5px',
                    color: '#A1A1AA',
                    marginBottom: '4px',
                  }}
                >
                  Rack Standard
                </label>
                <select
                  id="custom-cover-standard"
                  data-testid="custom-cover-standard"
                  value={customStandard}
                  onChange={(e) =>
                    setCustomStandard(e.target.value as RackStandard)
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                >
                  <option value="10inch">10-Inch Mini-Rack (254.0 mm)</option>
                  <option value="19inch">19-Inch Enterprise (482.6 mm)</option>
                  <option value="6inch">6-Inch Micro-Lab (152.4 mm)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-cover-u-height"
                  style={{
                    display: 'block',
                    fontSize: '10.5px',
                    color: '#A1A1AA',
                    marginBottom: '4px',
                  }}
                >
                  Slot Height (U)
                </label>
                <select
                  id="custom-cover-u-height"
                  data-testid="custom-cover-u-height"
                  value={String(customUHeight)}
                  onChange={(e) =>
                    setCustomUHeight(
                      Number(e.target.value) as CoverPanelUHeight,
                    )
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                >
                  <option value="0.5">0.5U Half-Slot (21.48 mm)</option>
                  <option value="1">1U Single Slot (43.70 mm)</option>
                  <option value="2">2U Double Slot (88.15 mm)</option>
                  <option value="3">3U Triple Slot (132.60 mm)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-cover-pattern"
                  style={{
                    display: 'block',
                    fontSize: '10.5px',
                    color: '#A1A1AA',
                    marginBottom: '4px',
                  }}
                >
                  Surface Pattern
                </label>
                <select
                  id="custom-cover-pattern"
                  data-testid="custom-cover-pattern"
                  value={customPattern}
                  onChange={(e) =>
                    setCustomPattern(e.target.value as CoverPanelPatternType)
                  }
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                >
                  <option value="lines">Horizontal Lines (Blind Relief)</option>
                  <option value="hex">Hex-Grid Matrix (Blind Relief)</option>
                  <option value="ribs">Vertical Tech-Ribs (Blind Relief)</option>
                  <option value="vented-slots">
                    Vented Airflow Slots (Through-Cut)
                  </option>
                  <option value="solid">Solid Minimalist Bezel</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-cover-label"
                  style={{
                    display: 'block',
                    fontSize: '10.5px',
                    color: '#A1A1AA',
                    marginBottom: '4px',
                  }}
                >
                  Engraved Front Text (Optional)
                </label>
                <input
                  id="custom-cover-label"
                  data-testid="custom-cover-label"
                  type="text"
                  maxLength={14}
                  value={customLabel}
                  placeholder="e.g. HOMELAB-01"
                  onChange={(e) => setCustomLabel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingTop: '4px',
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: '11px', color: '#A1A1AA' }}
                >
                  {customWidthMm} × {customHeightMm} × {customDepthMm} mm • ~
                  {customEstimatedGrams} g PETG • Face-Down No-Support Print
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    data-testid="download-custom-cover-scad"
                    onClick={() =>
                      triggerBlobDownload(
                        generateClientCustomCoverPanelOpenScad(customCoverOpts),
                        `${customFileStem}.scad`,
                        'text/plain;charset=utf-8',
                      )
                    }
                    style={{
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
                    Download Custom .SCAD
                  </button>
                  <button
                    type="button"
                    data-testid="download-custom-cover-stl"
                    onClick={() => {
                      trackUiEvent('stl_download');
                      triggerBlobDownload(
                        generateClientCustomCoverPanelStl(customCoverOpts),
                        `${customFileStem}.stl`,
                        'model/stl;charset=utf-8',
                      );
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#6EE7B7',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Download Custom .STL
                  </button>
                </div>
              </div>
            </div>

            {/* Live 2D CAD / 3D STL Preview */}
            <div
              data-testid="custom-cover-svg-preview"
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: '#0E0E11',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '116px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  data-testid="cover-preview-mode-svg"
                  onClick={() => setCoverPreviewMode('svg')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background:
                      coverPreviewMode === 'svg'
                        ? 'rgba(59, 130, 246, 0.18)'
                        : '#16161B',
                    color: coverPreviewMode === 'svg' ? '#93C5FD' : '#A1A1AA',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  2D CAD
                </button>
                <button
                  type="button"
                  data-testid="cover-preview-mode-stl"
                  onClick={() => setCoverPreviewMode('stl')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background:
                      coverPreviewMode === 'stl'
                        ? 'rgba(16, 185, 129, 0.18)'
                        : '#16161B',
                    color: coverPreviewMode === 'stl' ? '#6EE7B7' : '#A1A1AA',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  3D STL
                </button>
              </div>
              {coverPreviewMode === 'stl' ? (
                <StlPreview3D
                  stlAscii={customCoverStl}
                  fallbackSvg={customPreviewSvg}
                  dataTestId="custom-cover-stl-preview"
                  heightPx={132}
                />
              ) : (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(customPreviewSvg)}`}
                  alt="Live 2D CAD Front-Elevation Preview"
                  draggable={false}
                  style={{
                    width: '100%',
                    maxHeight: '132px',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />
              )}
            </div>
          </form>
        </div>

        {/* 2.2 Parametric Custom Device Bracket / Tray Configurator (B4) */}
        <div
          ref={customBracketRef}
          data-testid="custom-bracket-configurator"
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '10px',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: '11.5px',
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                color: '#A1A1AA',
              }}
            >
              2.2 Parametric Custom Device Bracket Generator (Any Non-Catalog Box • OpenSCAD + Watertight .STL)
            </h4>
            <span
              data-testid="custom-bracket-validation-badge"
              className="mono"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 8px',
                borderRadius: '999px',
                fontSize: '10.5px',
                fontWeight: 600,
                background: bracketValidation.valid
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(239, 68, 68, 0.12)',
                color: bracketValidation.valid ? '#6EE7B7' : '#FCA5A5',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: bracketValidation.valid ? '#10B981' : '#EF4444',
                }}
              />
              {bracketValidation.valid
                ? `Fit OK (Max Aperture ${bracketValidation.max_device_width_mm.toFixed(1)}×${bracketValidation.max_device_height_mm.toFixed(1)}mm)`
                : bracketValidation.errors[0] ?? 'Dimension error'}
            </span>
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            style={{
              padding: '14px 16px',
              borderRadius: '8px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '10px',
              }}
            >
              <div>
                <label
                  htmlFor="custom-bracket-standard"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Rack Standard
                </label>
                <select
                  id="custom-bracket-standard"
                  data-testid="custom-bracket-standard"
                  value={bracketStandard}
                  onChange={(e) => setBracketStandard(e.target.value as RackStandard)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                >
                  <option value="10inch">10-Inch Mini-Rack</option>
                  <option value="19inch">19-Inch Enterprise</option>
                  <option value="6inch">6-Inch Micro-Lab</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-u-height"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Slot Height (U)
                </label>
                <select
                  id="custom-bracket-u-height"
                  data-testid="custom-bracket-u-height"
                  value={String(bracketUHeight)}
                  onChange={(e) => setBracketUHeight(Number(e.target.value) as 1 | 2 | 3)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                >
                  <option value="1">1U (43.7 mm)</option>
                  <option value="2">2U (88.1 mm)</option>
                  <option value="3">3U (132.6 mm)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-name"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Device Name
                </label>
                <input
                  id="custom-bracket-name"
                  data-testid="custom-bracket-name"
                  type="text"
                  maxLength={40}
                  value={bracketDeviceName}
                  onChange={(e) => setBracketDeviceName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-label"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Engraved Faceplate Label
                </label>
                <input
                  id="custom-bracket-label"
                  data-testid="custom-bracket-label"
                  type="text"
                  maxLength={24}
                  value={bracketLabel}
                  onChange={(e) => setBracketLabel(e.target.value)}
                  className="mono"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-width"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Device Width (mm)
                </label>
                <input
                  id="custom-bracket-width"
                  data-testid="custom-bracket-width"
                  type="number"
                  step="0.5"
                  min={15}
                  max={480}
                  value={bracketWidthMm}
                  onChange={(e) => setBracketWidthMm(Number(e.target.value))}
                  className="mono"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-height"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Device Height (mm)
                </label>
                <input
                  id="custom-bracket-height"
                  data-testid="custom-bracket-height"
                  type="number"
                  step="0.5"
                  min={8}
                  max={140}
                  value={bracketHeightMm}
                  onChange={(e) => setBracketHeightMm(Number(e.target.value))}
                  className="mono"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-depth"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Device Depth (mm)
                </label>
                <input
                  id="custom-bracket-depth"
                  data-testid="custom-bracket-depth"
                  type="number"
                  step="1"
                  min={20}
                  max={450}
                  value={bracketDepthMm}
                  onChange={(e) => setBracketDepthMm(Number(e.target.value))}
                  className="mono"
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background: '#121216',
                    color: '#F4F4F5',
                    fontSize: '11.5px',
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="custom-bracket-tolerance"
                  style={{ display: 'block', fontSize: '10.5px', color: '#A1A1AA', marginBottom: '4px' }}
                >
                  Fit Tolerance (mm) · Keystones
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    id="custom-bracket-tolerance"
                    data-testid="custom-bracket-tolerance"
                    type="number"
                    step="0.1"
                    min={0.1}
                    max={2}
                    value={bracketTolMm}
                    onChange={(e) => setBracketTolMm(Number(e.target.value))}
                    className="mono"
                    style={{
                      width: '50%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#121216',
                      color: '#F4F4F5',
                      fontSize: '11.5px',
                    }}
                  />
                  <input
                    id="custom-bracket-keystones"
                    data-testid="custom-bracket-keystones"
                    aria-label="Keystone Count"
                    type="number"
                    step="1"
                    min={0}
                    max={Math.max(0, bracketValidation.max_keystones)}
                    value={bracketKeystones}
                    onChange={(e) => setBracketKeystones(Number(e.target.value))}
                    className="mono"
                    style={{
                      width: '50%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#121216',
                      color: '#F4F4F5',
                      fontSize: '11.5px',
                    }}
                  />
                </div>
              </div>

              {bracketStandard === '19inch' && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label
                    htmlFor="custom-bracket-split-half"
                    style={{
                      display: 'block',
                      fontSize: '10.5px',
                      color: '#A1A1AA',
                      marginBottom: '4px',
                    }}
                  >
                    19&quot; Print-Bed Split (&le; 245 mm Bambu / Prusa · M3 Joiner Lug)
                  </label>
                  <select
                    id="custom-bracket-split-half"
                    data-testid="custom-bracket-split-half"
                    value={bracketSplitHalf}
                    onChange={(e) =>
                      setBracketSplitHalf(e.target.value as BracketSplitHalf)
                    }
                    style={{
                      width: '100%',
                      padding: '6px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: '#121216',
                      color: '#F4F4F5',
                      fontSize: '11.5px',
                    }}
                  >
                    <option value="full">
                      Full 19&quot; Panel (482.6 mm Single Piece)
                    </option>
                    <option value="left">
                      Left Half (241.3 mm · Print Bed &le; 245 mm + M3 Lug)
                    </option>
                    <option value="right">
                      Right Half (241.3 mm · Print Bed &le; 245 mm + M3 Lug)
                    </option>
                  </select>
                </div>
              )}

              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '14px',
                  fontSize: '11px',
                  color: '#D4D4D8',
                }}
              >
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={bracketRetainerLip}
                    onChange={(e) => setBracketRetainerLip(e.target.checked)}
                  />
                  Rear Retention Lip
                </label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={bracketVentSlots}
                    onChange={(e) => setBracketVentSlots(e.target.checked)}
                  />
                  Ventilation Side Slots
                </label>
              </div>

              <div
                style={{
                  gridColumn: '1 / -1',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  paddingTop: '4px',
                }}
              >
                <span className="mono" style={{ fontSize: '11px', color: '#A1A1AA' }}>
                  {bracketValidation.panel_width_mm} × {bracketValidation.panel_height_mm} ×{' '}
                  {bracketValidation.tray_depth_mm} mm • ~{bracketValidation.estimated_filament_grams} g PETG
                  {effectiveBracketSplitHalf !== 'full'
                    ? ` • ${effectiveBracketSplitHalf.toUpperCase()} HALF (<= 241.3 mm)`
                    : ''}
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <button
                    type="button"
                    data-testid="download-custom-bracket-scad"
                    disabled={!bracketValidation.valid}
                    onClick={() =>
                      triggerBlobDownload(
                        generateCustomBracketOpenScad(bracketOpts),
                        `${bracketFileStem}.scad`,
                        'text/plain;charset=utf-8',
                      )
                    }
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(59, 130, 246, 0.35)',
                      background: 'rgba(59, 130, 246, 0.12)',
                      color: '#93C5FD',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: bracketValidation.valid ? 'pointer' : 'not-allowed',
                      opacity: bracketValidation.valid ? 1 : 0.45,
                    }}
                  >
                    Download Bracket .SCAD
                  </button>
                  <button
                    type="button"
                    data-testid="download-custom-bracket-stl"
                    disabled={!bracketValidation.valid}
                    onClick={() => {
                      trackUiEvent('bracket_stl_download');
                      triggerBlobDownload(
                        generateCustomBracketStl(bracketOpts),
                        `${bracketFileStem}.stl`,
                        'model/stl;charset=utf-8',
                      );
                    }}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      background: 'rgba(16, 185, 129, 0.12)',
                      color: '#6EE7B7',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: bracketValidation.valid ? 'pointer' : 'not-allowed',
                      opacity: bracketValidation.valid ? 1 : 0.45,
                    }}
                  >
                    Download Bracket .STL
                  </button>
                  {bracketStandard === '19inch' && (
                    <>
                      <button
                        type="button"
                        data-testid="download-custom-bracket-stl-left"
                        disabled={!bracketValidation.valid}
                        onClick={() => {
                          trackUiEvent('bracket_stl_download');
                          triggerBlobDownload(
                            generateCustomBracketStl({
                              ...bracketOpts,
                              split_half: 'left',
                            }),
                            `custom-${bracketStandard}-bracket-${bracketUHeight}u-${
                              toAsciiKebabSlug(bracketDeviceName) || 'device'
                            }-left.stl`,
                            'model/stl;charset=utf-8',
                          );
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#FCD34D',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: bracketValidation.valid
                            ? 'pointer'
                            : 'not-allowed',
                          opacity: bracketValidation.valid ? 1 : 0.45,
                        }}
                      >
                        Left Half .STL
                      </button>
                      <button
                        type="button"
                        data-testid="download-custom-bracket-stl-right"
                        disabled={!bracketValidation.valid}
                        onClick={() => {
                          trackUiEvent('bracket_stl_download');
                          triggerBlobDownload(
                            generateCustomBracketStl({
                              ...bracketOpts,
                              split_half: 'right',
                            }),
                            `custom-${bracketStandard}-bracket-${bracketUHeight}u-${
                              toAsciiKebabSlug(bracketDeviceName) || 'device'
                            }-right.stl`,
                            'model/stl;charset=utf-8',
                          );
                        }}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '6px',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#FCD34D',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: bracketValidation.valid
                            ? 'pointer'
                            : 'not-allowed',
                          opacity: bracketValidation.valid ? 1 : 0.45,
                        }}
                      >
                        Right Half .STL
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Live 2D CAD / 3D STL Preview */}
            <div
              data-testid="custom-bracket-preview"
              style={{
                padding: '10px',
                borderRadius: '8px',
                background: '#0E0E11',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '156px',
              }}
            >
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '4px',
                }}
              >
                <button
                  type="button"
                  data-testid="bracket-preview-mode-svg"
                  onClick={() => setBracketPreviewMode('svg')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background:
                      bracketPreviewMode === 'svg'
                        ? 'rgba(59, 130, 246, 0.18)'
                        : '#16161B',
                    color: bracketPreviewMode === 'svg' ? '#93C5FD' : '#A1A1AA',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  2D CAD
                </button>
                <button
                  type="button"
                  data-testid="bracket-preview-mode-stl"
                  onClick={() => setBracketPreviewMode('stl')}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    background:
                      bracketPreviewMode === 'stl'
                        ? 'rgba(16, 185, 129, 0.18)'
                        : '#16161B',
                    color: bracketPreviewMode === 'stl' ? '#6EE7B7' : '#A1A1AA',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  3D STL
                </button>
              </div>
              {bracketPreviewMode === 'stl' && bracketValidation.valid ? (
                <StlPreview3D
                  stlAscii={bracketStl}
                  fallbackSvg={bracketPreviewSvg}
                  alt="Custom Device Bracket 3D STL Preview"
                  dataTestId="custom-bracket-stl-preview"
                  heightPx={156}
                />
              ) : (
                <img
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(bracketPreviewSvg)}`}
                  alt="Custom Device Bracket 2D CAD Preview"
                  draggable={false}
                  style={{
                    width: '100%',
                    maxHeight: '156px',
                    display: 'block',
                    userSelect: 'none',
                  }}
                />
              )}
            </div>
          </form>
        </div>

        {/* 2.3 Printable Slot Cover Panels Library (1U & 2U • Lines / Hex / Tech-Ribs) */}
        <div
          style={{
            marginTop: '18px',
            paddingTop: '14px',
            borderTop: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: '11.5px',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#A1A1AA',
            }}
          >
            2.3 3D-Printable Slot Cover Panels Library (
            {printableCoverPanelBlueprints.length} Variants • 1U &amp; 2U •
            Lines / Hex / Tech-Ribs)
          </h4>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
                  color: '#71717A',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>
                  Standard / Size
                </th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>
                  Blueprint Slug
                </th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>
                  Pattern &amp; Model
                </th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>
                  Dimensions (mm)
                </th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>
                  Filament
                </th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>
                  3D CAD Export (.SCAD / .STL)
                </th>
              </tr>
            </thead>
            <tbody>
              {printableCoverPanelBlueprints.map((bp) => {
                const rackStd: RackStandard =
                  bp.mount_type === 'rackmount-19'
                    ? '19inch'
                    : bp.mount_type === 'rackmount-6'
                      ? '6inch'
                      : '10inch';
                const uHeight = bp.geometry.u_height ?? 1;
                const filament = bp.printable_metadata?.filament_grams ?? 45;
                return (
                  <tr
                    key={bp.slug}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <td
                      className="mono"
                      style={{
                        padding: '7px 8px',
                        fontWeight: 600,
                        color: '#93C5FD',
                      }}
                    >
                      {rackStd.toUpperCase()} • {uHeight}U
                    </td>
                    <td
                      className="mono"
                      style={{ padding: '7px 8px', color: '#E4E4E7' }}
                    >
                      {bp.slug}
                    </td>
                    <td style={{ padding: '7px 8px', color: '#A1A1AA' }}>
                      {bp.model}
                    </td>
                    <td
                      className="mono"
                      style={{ padding: '7px 8px', color: '#A1A1AA' }}
                    >
                      {bp.geometry.width_mm} × {bp.geometry.height_mm} ×{' '}
                      {bp.geometry.depth_mm} mm
                    </td>
                    <td
                      className="mono"
                      style={{ padding: '7px 8px', color: '#F4F4F5' }}
                    >
                      {filament} g
                    </td>
                    <td style={{ padding: '7px 8px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          data-testid={`download-cover-scad-${bp.slug}`}
                          onClick={() =>
                            triggerBlobDownload(
                              generateClientSideCarrierOpenScad(bp, rackStd),
                              `${bp.slug}.scad`,
                              'text/plain;charset=utf-8',
                            )
                          }
                          style={{
                            padding: '4px 8px',
                            borderRadius: '5px',
                            border: '1px solid rgba(59, 130, 246, 0.35)',
                            background: 'rgba(59, 130, 246, 0.12)',
                            color: '#93C5FD',
                            fontSize: '10.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          .SCAD
                        </button>
                        <button
                          type="button"
                          data-testid={`download-cover-stl-${bp.slug}`}
                          onClick={() => {
                            trackUiEvent('stl_download');
                            triggerBlobDownload(
                              generateClientSideCarrierStl(bp, rackStd),
                              `${bp.slug}.stl`,
                              'model/stl;charset=utf-8',
                            );
                          }}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '5px',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            background: 'rgba(16, 185, 129, 0.12)',
                            color: '#6EE7B7',
                            fontSize: '10.5px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          .STL
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Cable Patching Checklist */}
      <section
        style={{
          padding: '18px 20px',
          borderRadius: '10px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.07)',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '12.5px',
            fontWeight: 600,
            letterSpacing: '0.03em',
            textTransform: 'uppercase',
            color: '#A1A1AA',
          }}
        >
          3. Step-by-Step Cable Patching Schedule ({scene.project.cables.length}{' '}
          Cables)
        </h3>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '12px',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
                color: '#71717A',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px', fontWeight: 500 }}>Cable ID</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Label / Purpose</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Type</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>From Port</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>To Port</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>3D Spline Length</th>
              <th style={{ padding: '8px', fontWeight: 500 }}>Commercial Bin</th>
            </tr>
          </thead>
          <tbody>
            {scene.project.cables.map((cable) => {
              const route = routesById.get(cable.cable_id);
              return (
                <tr
                  key={cable.cable_id}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td
                    className="mono"
                    style={{
                      padding: '8px',
                      fontWeight: 600,
                      color: cable.color_hex,
                    }}
                  >
                    ● {cable.cable_id}
                  </td>
                  <td style={{ padding: '8px', color: '#F4F4F5', fontWeight: 500 }}>
                    {cable.label ?? '—'}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#A1A1AA' }}>
                    {cable.cable_type}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#E4E4E7' }}>
                    {cable.from.instance_id}:{cable.from.port_id}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#E4E4E7' }}>
                    {cable.to.instance_id}:{cable.to.port_id}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#A1A1AA' }}>
                    {route ? `${roundTenths(route.required_length_mm)} mm` : '—'}
                  </td>
                  <td
                    className="mono"
                    style={{ padding: '8px', fontWeight: 600, color: '#F4F4F5' }}
                  >
                    {route
                      ? `${(route.recommended_commercial_mm / 1000).toFixed(2)} m (${route.recommended_commercial_mm} mm)`
                      : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Section 4: Haus- & Raum-Verkabelung (Steck-für-Steck-Anleitung) */}
      {(scene.project.external_endpoints ?? []).length > 0 && (
        <section
          data-testid="bom-external-patching-guide"
          style={{
            padding: '18px 20px',
            borderRadius: '10px',
            background: '#121216',
            border: '1px solid rgba(255, 255, 255, 0.07)',
          }}
        >
          <h3
            style={{
              margin: '0 0 6px 0',
              fontSize: '12.5px',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
              color: '#F4F4F5',
            }}
          >
            4. 🏠 Haus- &amp; Raum-Verkabelung — Steck-für-Steck-Anleitung (
            {(scene.project.external_endpoints ?? []).length} Gebäude-Leitungen)
          </h3>
          <div style={{ fontSize: '11.5px', color: '#A1A1AA', marginBottom: '12px' }}>
            So schließt du alle ankommenden Verlegekabel aus dem Gebäude (Kameras,
            Access Points, Büros, Beamer, PCs) Schritt für Schritt an dein Rack an:
          </div>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
                  color: '#71717A',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px', fontWeight: 500 }}>#</th>
                <th style={{ padding: '8px', fontWeight: 500 }}>Raum / Gerät</th>
                <th style={{ padding: '8px', fontWeight: 500 }}>Typ &amp; PoE</th>
                <th style={{ padding: '8px', fontWeight: 500 }}>
                  Schritt 1: Hinten auflegen (Rückseite)
                </th>
                <th style={{ padding: '8px', fontWeight: 500 }}>
                  Schritt 2: Vorne patchen (Vorderseite)
                </th>
              </tr>
            </thead>
            <tbody>
              {(scene.project.external_endpoints ?? []).map((ext, idx) => {
                const frontPatch = scene.project.cables.find(
                  (c) =>
                    (c.from.instance_id === ext.patch_panel_instance_id &&
                      c.from.port_id === ext.patch_panel_port_id &&
                      (c.from.face ?? 'front') === 'front') ||
                    (c.to.instance_id === ext.patch_panel_instance_id &&
                      c.to.port_id === ext.patch_panel_port_id &&
                      (c.to.face ?? 'front') === 'front'),
                );
                const swEnd = frontPatch
                  ? frontPatch.from.instance_id ===
                      ext.patch_panel_instance_id &&
                    frontPatch.from.port_id === ext.patch_panel_port_id
                    ? frontPatch.to
                    : frontPatch.from
                  : null;
                return (
                  <tr
                    key={ext.endpoint_id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <td className="mono" style={{ padding: '8px', color: '#71717A' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#F4F4F5' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: ext.color_hex,
                          marginRight: '8px',
                        }}
                      />
                      {ext.label}
                      {ext.room_or_zone ? ` (${ext.room_or_zone})` : ''}
                    </td>
                    <td className="mono" style={{ padding: '8px', color: '#A1A1AA' }}>
                      {ext.category} •{' '}
                      {ext.poe_draw_watts > 0 ? (
                        <span style={{ color: '#FCD34D', fontWeight: 600 }}>
                          PoE {ext.poe_draw_watts} W
                        </span>
                      ) : (
                        'Ohne PoE'
                      )}
                    </td>
                    <td className="mono" style={{ padding: '8px', color: '#E4E4E7' }}>
                      Wandkabel →{' '}
                      <strong>
                        {ext.patch_panel_instance_id}:
                        {ext.patch_panel_port_id.toUpperCase()}
                      </strong>{' '}
                      (Hinten)
                    </td>
                    <td className="mono" style={{ padding: '8px', color: '#6EE7B7' }}>
                      {swEnd && frontPatch
                        ? `Patchkabel (${frontPatch.cable_id}) von ${ext.patch_panel_port_id.toUpperCase()} (Vorne) → ${swEnd.instance_id}:${swEnd.port_id.toUpperCase()}`
                        : 'Noch kein Patchkabel vorne gesteckt'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {/* Section 5: Printable Cable & Port Wrap-Around Labels (B5: Brother P-Touch / DYMO / Niimbot) */}
      <section
        data-testid="cable-labels-section"
        style={{
          padding: '18px 20px',
          borderRadius: '10px',
          background: '#121216',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <button
            type="button"
            data-testid="toggle-cable-labels-section"
            onClick={() => setLabelsSectionOpen((prev) => !prev)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#F4F4F5',
              fontSize: '12.5px',
              fontWeight: 600,
              letterSpacing: '0.03em',
              textTransform: 'uppercase',
            }}
          >
            <span>{labelsSectionOpen ? '▾' : '▸'}</span>
            <span>
              5. Cable &amp; Port Labels — Brother P-Touch / DYMO / Niimbot ({labelEntries.length} Labels)
            </span>
          </button>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#A1A1AA',
              }}
            >
              <span>Tape Width:</span>
              <select
                data-testid="select-label-tape-width"
                aria-label="Tape Width (mm)"
                value={String(labelTapeWidthMm)}
                onChange={(e) =>
                  setLabelTapeWidthMm(Number(e.target.value) as 12 | 18 | 24)
                }
                className="mono"
                style={{
                  padding: '4px 8px',
                  borderRadius: '5px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  background: '#0E0E11',
                  color: '#F4F4F5',
                  fontSize: '11px',
                }}
              >
                <option value="12">12 mm Tape</option>
                <option value="18">18 mm Tape</option>
                <option value="24">24 mm Tape</option>
              </select>
            </label>

            <button
              type="button"
              data-testid="section-download-labels-csv"
              onClick={() =>
                triggerBlobDownload(
                  effectiveLabelsCsv,
                  'labels.csv',
                  'text/csv;charset=utf-8',
                )
              }
              style={{
                padding: '5px 10px',
                borderRadius: '5px',
                border: '1px solid rgba(59, 130, 246, 0.35)',
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#93C5FD',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              CSV (P-Touch / DYMO)
            </button>

            <button
              type="button"
              data-testid="section-download-labels-svg"
              onClick={() =>
                triggerBlobDownload(
                  effectiveLabelsSvg,
                  `labels-${labelTapeWidthMm}mm.svg`,
                  'image/svg+xml;charset=utf-8',
                )
              }
              style={{
                padding: '5px 10px',
                borderRadius: '5px',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#6EE7B7',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              SVG Label Sheet ({labelTapeWidthMm}mm)
            </button>
          </div>
        </div>

        {labelsSectionOpen && (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11.5px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.09)',
                  color: '#71717A',
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>#</th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>Cable ID</th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>Wrap-Around Flag Text</th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>From</th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>To</th>
                <th style={{ padding: '7px 8px', fontWeight: 500 }}>Type / Bin</th>
              </tr>
            </thead>
            <tbody>
              {labelEntries.map((entry, idx) => (
                <tr
                  key={`${entry.cableId}-${idx}`}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td className="mono" style={{ padding: '7px 8px', color: '#71717A' }}>
                    {idx + 1}
                  </td>
                  <td className="mono" style={{ padding: '7px 8px', color: entry.colorHex, fontWeight: 600 }}>
                    {entry.cableId}
                  </td>
                  <td className="mono" style={{ padding: '7px 8px', color: '#F4F4F5', fontWeight: 600 }}>
                    {entry.wrapLabel}
                  </td>
                  <td className="mono" style={{ padding: '7px 8px', color: '#E4E4E7' }}>
                    {entry.fromEndpoint}
                  </td>
                  <td className="mono" style={{ padding: '7px 8px', color: '#E4E4E7' }}>
                    {entry.toEndpoint}
                  </td>
                  <td className="mono" style={{ padding: '7px 8px', color: '#A1A1AA' }}>
                    {entry.cableTypeLabel}
                    {entry.vlanTag ? ` • ${entry.vlanTag}` : ''}
                    {entry.commercialLengthMm > 0
                      ? ` • ${(entry.commercialLengthMm / 1000).toFixed(2)}m`
                      : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
