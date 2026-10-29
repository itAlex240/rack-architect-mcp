import { useEffect, useMemo, useState } from 'react';
import {
  EIA_310_SPECS,
  MM_PER_U,
  roundCentis,
  roundTenths,
  type RackStandard,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import { defaultCatalogRegistry } from '@rack-mcp/hardware-catalog';
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

export interface BomAndExportsViewProps {
  readonly scene: SerializedRackScene;
  readonly elevationSvg: string;
  readonly wiringSvg: string;
  readonly bomMarkdown: string;
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

export function BomAndExportsView({
  scene,
  elevationSvg,
  wiringSvg,
  bomMarkdown,
}: BomAndExportsViewProps) {
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

  const [customStandard, setCustomStandard] = useState<RackStandard>(
    scene.project.rack.standard,
  );
  const [customUHeight, setCustomUHeight] = useState<CoverPanelUHeight>(1);
  const [customPattern, setCustomPattern] =
    useState<CoverPanelPatternType>('hex');
  const [customLabel, setCustomLabel] = useState<string>('');

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

  const customSpec = EIA_310_SPECS[customStandard];
  const customWidthMm = roundCentis(customSpec.W_panel);
  const customHeightMm = roundCentis(customUHeight * MM_PER_U - 0.75);
  const customDepthMm = 14.0;
  const customEstimatedGrams = roundTenths(
    Math.max(
      12,
      (customWidthMm * customHeightMm * 4.2 * 0.00115) *
        (customPattern === 'vented-slots' ? 0.78 : 0.94),
    ),
  );
  const sanitizedCustomLabel = sanitizeClientCoverPanelLabel(customLabel);
  const customFileStem = `custom-${customStandard}-cover-${String(customUHeight).replace('.', 'p')}u-${customPattern}${
    sanitizedCustomLabel
      ? `-${sanitizedCustomLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`
      : ''
  }`;

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
                bomMarkdown,
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

          <a
            href={
              typeof window !== 'undefined' &&
              new URLSearchParams(window.location.search).get('session')
                ? `/api/export/scene.glb?session=${encodeURIComponent(
                    new URLSearchParams(window.location.search).get('session')!,
                  )}`
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
                        onClick={() =>
                          triggerBlobDownload(
                            generateClientSideCarrierStl(
                              dev.blueprint,
                              scene.project.rack.standard,
                            ),
                            `${dev.blueprint_slug}.stl`,
                            'model/stl;charset=utf-8',
                          )
                        }
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
                    onClick={() =>
                      triggerBlobDownload(
                        generateClientCustomCoverPanelStl(customCoverOpts),
                        `${customFileStem}.stl`,
                        'model/stl;charset=utf-8',
                      )
                    }
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

            {/* Live 2D CAD Front-Elevation Preview */}
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
                minHeight: '116px',
              }}
              dangerouslySetInnerHTML={{ __html: customPreviewSvg }}
            />
          </form>
        </div>

        {/* 2.2 Printable Slot Cover Panels Library (1U & 2U • Lines / Hex / Tech-Ribs) */}
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
            2.2 3D-Printable Slot Cover Panels Library (
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
                          onClick={() =>
                            triggerBlobDownload(
                              generateClientSideCarrierStl(bp, rackStd),
                              `${bp.slug}.stl`,
                              'model/stl;charset=utf-8',
                            )
                          }
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
    </div>
  );
}
