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
        background: '#090D16',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {/* Export & Deliverables Bar */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '10px',
          background: '#0F172A',
          border: '1px solid #1E293B',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#F8FAFC' }}>
            Deterministic CAD &amp; Procurement Deliverables
          </div>
          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '3px' }}>
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
              border: '1px solid #38BDF8',
              background: '#082F49',
              color: '#38BDF8',
              fontSize: '12px',
              fontWeight: 700,
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
              border: '1px solid #10B981',
              background: '#064E3B',
              color: '#34D399',
              fontSize: '12px',
              fontWeight: 700,
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
              border: '1px solid #F59E0B',
              background: '#78350F',
              color: '#FDE68A',
              fontSize: '12px',
              fontWeight: 700,
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
              border: '1px solid #475569',
              background: '#1E293B',
              color: '#E2E8F0',
              fontSize: '12px',
              fontWeight: 600,
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
              border: '1px solid #A855F7',
              background: '#3B0764',
              color: '#E9D5FF',
              fontSize: '12px',
              fontWeight: 700,
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
          background: '#0F172A',
          border: '1px solid #1E293B',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            color: '#38BDF8',
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
                borderBottom: '1px solid #334155',
                color: '#94A3B8',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px' }}>U / Slot</th>
              <th style={{ padding: '8px' }}>Face</th>
              <th style={{ padding: '8px' }}>Instance / Hostname</th>
              <th style={{ padding: '8px' }}>Manufacturer &amp; Model</th>
              <th style={{ padding: '8px' }}>Dimensions (mm)</th>
              <th style={{ padding: '8px' }}>Max Draw</th>
            </tr>
          </thead>
          <tbody>
            {scene.geometry.devices.map((dev) => (
              <tr
                key={dev.instance_id}
                style={{ borderBottom: '1px solid #1E293B' }}
              >
                <td className="mono" style={{ padding: '8px', color: '#38BDF8' }}>
                  U{dev.u_position}
                  {dev.slot_id ? ` • ${dev.slot_id}` : ''}
                </td>
                <td className="mono" style={{ padding: '8px' }}>
                  {dev.face.toUpperCase()}
                </td>
                <td className="mono" style={{ padding: '8px', fontWeight: 700 }}>
                  {dev.hostname ?? dev.instance_id}{' '}
                  <span style={{ color: '#64748B' }}>({dev.instance_id})</span>
                </td>
                <td style={{ padding: '8px' }}>
                  {dev.blueprint.manufacturer} {dev.blueprint.model}
                </td>
                <td className="mono" style={{ padding: '8px', color: '#CBD5E1' }}>
                  {dev.blueprint.geometry.width_mm} ×{' '}
                  {dev.blueprint.geometry.height_mm} ×{' '}
                  {dev.blueprint.geometry.depth_mm} mm
                </td>
                <td className="mono" style={{ padding: '8px', color: '#FDE68A' }}>
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
          background: '#0F172A',
          border: '1px solid #1E293B',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            color: '#10B981',
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
                borderBottom: '1px solid #334155',
                color: '#94A3B8',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px' }}>Carrier Instance</th>
              <th style={{ padding: '8px' }}>Blueprint Slug</th>
              <th style={{ padding: '8px' }}>Material</th>
              <th style={{ padding: '8px' }}>Filament</th>
              <th style={{ padding: '8px' }}>Join Mechanism</th>
              <th style={{ padding: '8px' }}>3D CAD Export (.SCAD / .STL)</th>
            </tr>
          </thead>
          <tbody>
            {printableDevices.map((dev) => {
              const pm = dev.blueprint.printable_metadata!;
              return (
                <tr
                  key={dev.instance_id}
                  style={{ borderBottom: '1px solid #1E293B' }}
                >
                  <td
                    className="mono"
                    style={{ padding: '8px', fontWeight: 700, color: '#34D399' }}
                  >
                    U{dev.u_position} • {dev.instance_id}
                  </td>
                  <td className="mono" style={{ padding: '8px' }}>
                    {dev.blueprint_slug}
                  </td>
                  <td className="mono" style={{ padding: '8px' }}>
                    {pm.material_recommendation}
                  </td>
                  <td className="mono" style={{ padding: '8px' }}>
                    {pm.filament_grams} g
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#94A3B8' }}>
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
                          borderRadius: '4px',
                          border: '1px solid #38BDF8',
                          background: '#082F49',
                          color: '#38BDF8',
                          fontSize: '10.5px',
                          fontWeight: 700,
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
                          borderRadius: '4px',
                          border: '1px solid #10B981',
                          background: '#064E3B',
                          color: '#34D399',
                          fontSize: '10.5px',
                          fontWeight: 700,
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
          background: '#0F172A',
          border: '1px solid #1E293B',
        }}
      >
        <h3
          style={{
            margin: '0 0 12px 0',
            fontSize: '14px',
            color: '#F59E0B',
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
                borderBottom: '1px solid #334155',
                color: '#94A3B8',
                textAlign: 'left',
              }}
            >
              <th style={{ padding: '8px' }}>Cable ID</th>
              <th style={{ padding: '8px' }}>Type</th>
              <th style={{ padding: '8px' }}>From Port</th>
              <th style={{ padding: '8px' }}>To Port</th>
              <th style={{ padding: '8px' }}>3D Spline Length</th>
              <th style={{ padding: '8px' }}>Commercial Bin</th>
            </tr>
          </thead>
          <tbody>
            {scene.project.cables.map((cable) => {
              const route = routesById.get(cable.cable_id);
              return (
                <tr
                  key={cable.cable_id}
                  style={{ borderBottom: '1px solid #1E293B' }}
                >
                  <td
                    className="mono"
                    style={{
                      padding: '8px',
                      fontWeight: 700,
                      color: cable.color_hex,
                    }}
                  >
                    ● {cable.cable_id}
                  </td>
                  <td className="mono" style={{ padding: '8px' }}>
                    {cable.cable_type}
                  </td>
                  <td className="mono" style={{ padding: '8px' }}>
                    {cable.from.instance_id}:{cable.from.port_id}
                  </td>
                  <td className="mono" style={{ padding: '8px' }}>
                    {cable.to.instance_id}:{cable.to.port_id}
                  </td>
                  <td className="mono" style={{ padding: '8px', color: '#94A3B8' }}>
                    {route ? `${roundTenths(route.required_length_mm)} mm` : '—'}
                  </td>
                  <td
                    className="mono"
                    style={{ padding: '8px', fontWeight: 700, color: '#38BDF8' }}
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
