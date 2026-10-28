import {
  roundTenths,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import type { McpToolCallItem } from '../../state/useRackState.js';

export interface InspectorSidebarProps {
  readonly scene: SerializedRackScene;
  readonly mcpToolLog?: readonly McpToolCallItem[] | undefined;
  readonly selectedDeviceId: string | null;
  readonly selectedCableId: string | null;
  readonly onSelectDevice: (instanceId: string | null) => void;
  readonly onSelectCable: (cableId: string | null) => void;
  readonly onMoveDeviceU: (instanceId: string, newU: number) => void;
  readonly onRemoveDevice?: (instanceId: string) => void;
  readonly onDisconnectCable?: (cableId: string) => void;
  readonly onSimulateAgentStep?:
    | ((stage: 'collision' | 'resolved') => void)
    | undefined;
}

export function InspectorSidebar({
  scene,
  mcpToolLog = [],
  selectedDeviceId,
  selectedCableId,
  onSelectDevice,
  onSelectCable,
  onMoveDeviceU,
  onRemoveDevice,
  onDisconnectCable,
  onSimulateAgentStep,
}: InspectorSidebarProps) {
  const pwr = scene.validation.power_summary;
  const mech = scene.validation.mechanical_summary;
  const uCount = scene.project.rack.u_height;

  const upsSource = pwr.power_sources.find((s) => s.role === 'ups');
  const pseSource = pwr.pse_budgets[0];

  const occupiedUs = new Set<number>();
  for (const dev of scene.geometry.devices) {
    if (dev.mount_target === 'rack-unit') {
      for (let u = dev.u_range[0]; u <= dev.u_range[1]; u++) {
        occupiedUs.add(u);
      }
    }
  }
  const uOccupancyPct = Math.min(
    100,
    Math.round((occupiedUs.size / Math.max(1, uCount)) * 100),
  );

  const selectedDevice = selectedDeviceId
    ? scene.geometry.devices.find((d) => d.instance_id === selectedDeviceId)
    : undefined;

  const selectedCable = selectedCableId
    ? scene.project.cables.find((c) => c.cable_id === selectedCableId)
    : undefined;
  const selectedRoute = selectedCableId
    ? scene.cable_routes.find((r) => r.cable_id === selectedCableId)
    : undefined;

  return (
    <aside
      data-testid="inspector-sidebar"
      style={{
        width: '360px',
        height: '100%',
        background: '#0F172A',
        borderLeft: '1px solid #1E293B',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      {/* 1. Rack-Health & Power Telemetry */}
      <section
        data-testid="telemetry-section"
        style={{
          padding: '16px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div
          className="mono"
          style={{
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#38BDF8',
            letterSpacing: '0.04em',
          }}
        >
          RACK TELEMETRY &amp; POWER DAG
        </div>

        {/* UPS Load Bar */}
        <div>
          <div
            className="mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              marginBottom: '4px',
            }}
          >
            <span style={{ color: '#CBD5E1' }}>System / UPS Load</span>
            <span style={{ color: '#34D399', fontWeight: 700 }}>
              {roundTenths(pwr.total_system_watts)}W /{' '}
              {upsSource?.capacity_watts ?? 300}W
            </span>
          </div>
          <div
            style={{
              height: '7px',
              borderRadius: '4px',
              background: '#090D16',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(100, upsSource?.utilization_percent ?? 50)}%`,
                height: '100%',
                background: '#10B981',
              }}
            />
          </div>
        </div>

        {/* PoE Budget Bar */}
        <div>
          <div
            className="mono"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '11px',
              marginBottom: '4px',
            }}
          >
            <span style={{ color: '#CBD5E1' }}>PoE++ Switch Budget</span>
            <span style={{ color: '#FBBF24', fontWeight: 700 }}>
              {roundTenths(pwr.total_poe_watts)}W /{' '}
              {pseSource?.poe_budget_watts ?? 196}W
            </span>
          </div>
          <div
            style={{
              height: '7px',
              borderRadius: '4px',
              background: '#090D16',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${Math.min(
                  100,
                  pseSource && pseSource.poe_budget_watts > 0
                    ? (pseSource.consumed_poe_watts /
                        pseSource.poe_budget_watts) *
                        100
                    : 0,
                )}%`,
                height: '100%',
                background: '#F59E0B',
              }}
            />
          </div>
        </div>

        {/* Mechanical KPIs */}
        <div
          className="mono"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '8px',
            marginTop: '4px',
          }}
        >
          <div
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: '#1E293B',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>OCCUPIED</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
              {occupiedUs.size}/{uCount}U ({uOccupancyPct}%)
            </div>
          </div>
          <div
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: '#1E293B',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>MASS</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}>
              {roundTenths(mech.total_weight_grams / 1000)} kg
            </div>
          </div>
          <div
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: '#1E293B',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>CoG Y</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#38BDF8' }}>
              {roundTenths(mech.center_of_gravity_y_mm)} mm
            </div>
          </div>
          <div
            data-testid="kpi-thermal-btu"
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: '#1E293B',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>HEAT LOAD</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#F59E0B' }}>
              {roundTenths(mech.total_thermal_btu_hr)} BTU/h
            </div>
          </div>
          <div
            data-testid="kpi-acoustic-dba"
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: '#1E293B',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>ACOUSTICS</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#34D399' }}>
              {roundTenths(mech.combined_noise_db_a)} dB(A)
            </div>
          </div>
          <div
            data-testid="kpi-airflow-profile"
            style={{
              padding: '8px',
              borderRadius: '6px',
              background: '#1E293B',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '9.5px', color: '#94A3B8' }}>AIRFLOW</div>
            <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#CBD5E1' }}>
              {mech.airflow_profile}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Validation & Self-Correction Console */}
      <section
        data-testid="validation-console"
        style={{
          padding: '16px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          className="mono"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            fontWeight: 700,
            color: scene.validation.is_valid ? '#34D399' : '#FCA5A5',
          }}
        >
          <span>5-STAGE VALIDATION CONSOLE</span>
          <span>
            {scene.validation.error_count}E / {scene.validation.warning_count}W
          </span>
        </div>

        {scene.validation.issues.length === 0 ? (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              background: '#064E3B',
              border: '1px solid #10B981',
              fontSize: '11.5px',
              color: '#D1FAE5',
            }}
          >
            ✓ All spatial AABB clearances, sub-module slots, PoE budgets, and
            3D spline cable routes are 100% collision-free.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {scene.validation.issues.map((issue, idx) => (
              <div
                key={`${issue.code}-${idx}`}
                data-testid={`diagnostic-issue-${issue.code}`}
                onClick={() => {
                  const firstTarget = issue.affected_instances[0];
                  if (firstTarget) onSelectDevice(firstTarget);
                }}
                style={{
                  padding: '10px',
                  borderRadius: '6px',
                  background:
                    issue.severity === 'ERROR' ? '#450A0A' : '#451A03',
                  border:
                    issue.severity === 'ERROR'
                      ? '1px solid #EF4444'
                      : '1px solid #F59E0B',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: issue.severity === 'ERROR' ? '#FCA5A5' : '#FDE68A',
                  }}
                >
                  [{issue.severity.toUpperCase()}] {issue.code}
                </div>
                <div
                  style={{
                    fontSize: '11.5px',
                    color: '#F8FAFC',
                    marginTop: '4px',
                  }}
                >
                  {issue.message}
                </div>
                {issue.remediation_suggestions.length > 0 && (
                  <div
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: '#93C5FD',
                      marginTop: '6px',
                    }}
                  >
                    Fix: {issue.remediation_suggestions[0]}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 2b. Live MCP Agent Tool-Call Feed & Self-Correction Replay */}
      <section
        data-testid="mcp-agent-feed"
        style={{
          padding: '16px',
          borderBottom: '1px solid #1E293B',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <div
          className="mono"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#38BDF8',
          }}
        >
          <span>MCP AGENT TOOL-CALL FEED</span>
          <span style={{ color: '#94A3B8', fontSize: '10.5px' }}>
            {mcpToolLog.length} Calls
          </span>
        </div>

        {onSimulateAgentStep && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              data-testid="agent-sim-step-collision"
              onClick={() => onSimulateAgentStep('collision')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '5px',
                border: '1px solid #F59E0B',
                background: '#451A03',
                color: '#FDE68A',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ⚡ 1. Trigger Plug Collision
            </button>
            <button
              type="button"
              data-testid="agent-sim-step-resolved"
              onClick={() => onSimulateAgentStep('resolved')}
              style={{
                flex: 1,
                padding: '6px 8px',
                borderRadius: '5px',
                border: '1px solid #10B981',
                background: '#064E3B',
                color: '#34D399',
                fontSize: '10.5px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ✓ 2. LLM Self-Correction
            </button>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            maxHeight: '165px',
            overflowY: 'auto',
          }}
        >
          {mcpToolLog.map((entry) => (
            <div
              key={entry.id}
              data-testid={`mcp-tool-call-${entry.tool}`}
              style={{
                padding: '7px 9px',
                borderRadius: '6px',
                background: '#1E293B',
                border:
                  entry.status === 'VALID'
                    ? '1px solid #334155'
                    : '1px solid #EF4444',
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
              }}
            >
              <div
                className="mono"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '10.5px',
                }}
              >
                <span style={{ fontWeight: 700, color: '#F8FAFC' }}>
                  {entry.tool}()
                </span>
                <span
                  style={{
                    fontWeight: 700,
                    color: entry.status === 'VALID' ? '#34D399' : '#FCA5A5',
                  }}
                >
                  {entry.status}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1' }}>
                {entry.summary}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Selection Inspector (Device or Cable) */}
      <section
        data-testid="selection-inspector"
        style={{
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          flex: 1,
        }}
      >
        <div
          className="mono"
          style={{ fontSize: '11.5px', fontWeight: 700, color: '#38BDF8' }}
        >
          SELECTION INSPECTOR
        </div>

        {selectedDevice ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#1E293B',
                border: '1px solid #334155',
              }}
            >
              <div
                style={{ fontSize: '13.5px', fontWeight: 700, color: '#F8FAFC' }}
              >
                {selectedDevice.hostname ?? selectedDevice.blueprint.model}
              </div>
              <div
                className="mono"
                style={{ fontSize: '11px', color: '#38BDF8', marginTop: '2px' }}
              >
                {selectedDevice.instance_id} • {selectedDevice.blueprint_slug}
              </div>
              <div
                className="mono"
                style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}
              >
                Mount: U{selectedDevice.u_position}{' '}
                {selectedDevice.face.toUpperCase()} (
                {selectedDevice.mount_target})
              </div>
              <div
                className="mono"
                style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '2px' }}
              >
                Dimensions: {selectedDevice.blueprint.geometry.width_mm} ×{' '}
                {selectedDevice.blueprint.geometry.height_mm} ×{' '}
                {selectedDevice.blueprint.geometry.depth_mm} mm
              </div>
              <div
                className="mono"
                style={{ fontSize: '11px', color: '#FDE68A', marginTop: '2px' }}
              >
                Power: {selectedDevice.blueprint.power_and_thermal.idle_watts}W
                Idle /{' '}
                {selectedDevice.blueprint.power_and_thermal.max_system_watts}W
                Max
              </div>

              {/* Interactive U-Position Move Controls for Top-Level Rackmount Units */}
              {selectedDevice.mount_target === 'rack-unit' && (
                <div style={{ marginTop: '10px' }}>
                  <div
                    className="mono"
                    style={{
                      fontSize: '10px',
                      color: '#94A3B8',
                      marginBottom: '5px',
                    }}
                  >
                    MOVE RACK UNIT (LIVE AABB SOLVER):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {Array.from({ length: uCount }, (_, i) => i + 1).map((u) => (
                      <button
                        key={u}
                        type="button"
                        data-testid={`move-device-u-${u}`}
                        onClick={() =>
                          onMoveDeviceU(selectedDevice.instance_id, u)
                        }
                        style={{
                          padding: '3px 7px',
                          borderRadius: '4px',
                          border:
                            selectedDevice.u_position === u
                              ? '1px solid #38BDF8'
                              : '1px solid #334155',
                          background:
                            selectedDevice.u_position === u
                              ? '#0284C7'
                              : '#0F172A',
                          color: '#F8FAFC',
                          fontSize: '10.5px',
                          cursor: 'pointer',
                        }}
                      >
                        U{u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {onRemoveDevice && (
                <button
                  type="button"
                  data-testid="btn-remove-device"
                  onClick={() => onRemoveDevice(selectedDevice.instance_id)}
                  style={{
                    marginTop: '10px',
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '5px',
                    border: '1px solid #EF4444',
                    background: '#450A0A',
                    color: '#FCA5A5',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Remove Device ({selectedDevice.instance_id})
                </button>
              )}
            </div>

            {/* Device Ports List */}
            <div
              className="mono"
              style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8' }}
            >
              PORTS ({selectedDevice.ports.length})
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '5px',
                maxHeight: '220px',
                overflowY: 'auto',
              }}
            >
              {selectedDevice.ports.map((p) => {
                const connCable = scene.project.cables.find(
                  (c) =>
                    (c.from.instance_id === selectedDevice.instance_id &&
                      c.from.port_id === p.port_id) ||
                    (c.to.instance_id === selectedDevice.instance_id &&
                      c.to.port_id === p.port_id),
                );
                return (
                  <div
                    key={`${p.port_id}-${p.world_face}`}
                    onClick={() => {
                      if (connCable) onSelectCable(connCable.cable_id);
                    }}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '5px',
                      background: '#1E293B',
                      border: connCable
                        ? `1px solid ${connCable.color_hex}`
                        : '1px solid #334155',
                      fontSize: '11px',
                      cursor: connCable ? 'pointer' : 'default',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span className="mono" style={{ fontWeight: 700 }}>
                      {p.port_id} [{p.world_face}]
                    </span>
                    <span
                      className="mono"
                      style={{
                        color: connCable ? '#38BDF8' : '#64748B',
                        fontSize: '10px',
                      }}
                    >
                      {connCable ? connCable.cable_id : p.connector_type}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : selectedCable && selectedRoute ? (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#1E293B',
              border: `1.5px solid ${selectedCable.color_hex}`,
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              className="mono"
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: selectedCable.color_hex,
              }}
            >
              ● {selectedCable.cable_id}
            </div>
            <div style={{ fontSize: '12px', color: '#F8FAFC' }}>
              {selectedCable.label ?? selectedCable.cable_type}
            </div>
            <div className="mono" style={{ fontSize: '11px', color: '#CBD5E1' }}>
              From: {selectedCable.from.instance_id}:
              {selectedCable.from.port_id} ({selectedCable.from.face ?? 'auto'})
            </div>
            <div className="mono" style={{ fontSize: '11px', color: '#CBD5E1' }}>
              To: {selectedCable.to.instance_id}:{selectedCable.to.port_id} (
              {selectedCable.to.face ?? 'auto'})
            </div>
            <div className="mono" style={{ fontSize: '11px', color: '#38BDF8' }}>
              3D Spline Length: {roundTenths(selectedRoute.required_length_mm)}{' '}
              mm
            </div>
            <div
              className="mono"
              style={{ fontSize: '11.5px', fontWeight: 700, color: '#34D399' }}
            >
              Commercial Bin:{' '}
              {(selectedRoute.recommended_commercial_mm / 1000).toFixed(2)} m (
              {selectedRoute.recommended_commercial_mm} mm)
            </div>
            <div className="mono" style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              Route Case: {selectedRoute.route_case}
              {selectedRoute.portal_u ? ` (Portal U${selectedRoute.portal_u})` : ''}
            </div>
            {(selectedCable.vlan_id !== undefined ||
              selectedCable.ip_cidr !== undefined) && (
              <div
                className="mono"
                style={{ fontSize: '11px', color: '#FDE68A', fontWeight: 700 }}
              >
                VLAN / Subnet:{' '}
                {selectedCable.vlan_id !== undefined
                  ? `VLAN ${selectedCable.vlan_id}`
                  : ''}{' '}
                {selectedCable.ip_cidr ?? ''}
              </div>
            )}
            {onDisconnectCable && (
              <button
                type="button"
                data-testid="btn-disconnect-cable"
                onClick={() => onDisconnectCable(selectedCable.cable_id)}
                style={{
                  marginTop: '6px',
                  padding: '6px 10px',
                  borderRadius: '5px',
                  border: '1px solid #EF4444',
                  background: '#450A0A',
                  color: '#FCA5A5',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Disconnect Cable ({selectedCable.cable_id})
              </button>
            )}
          </div>
        ) : (
          <div
            style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#1E293B',
              fontSize: '12px',
              color: '#94A3B8',
            }}
          >
            Click any device, sub-module, or 3D cable tube in the viewport to
            inspect its coordinates, ports, and clearance zones.
          </div>
        )}
      </section>
    </aside>
  );
}
