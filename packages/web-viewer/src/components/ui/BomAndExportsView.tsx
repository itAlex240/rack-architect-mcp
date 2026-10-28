import {
  roundTenths,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import {
  generateClientSideCarrierOpenScad,
  generateClientSideCarrierStl,
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
      d.blueprint.printable_metadata !== undefined &&
      d.blueprint.printable_metadata !== null,
  );
  const totalFilamentGrams = printableDevices.reduce(
    (sum, d) =>
      sum + (d.blueprint.printable_metadata?.filament_grams ?? 0),
    0,
  );

  const routesById = new Map(scene.cable_routes.map((r) => [r.cable_id, r]));

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
            href="/api/export/scene.glb"
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
                  {dev.blueprint.manufacturer} {dev.blueprint.model}
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
              const pm = dev.blueprint.printable_metadata!;
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
    </div>
  );
}
