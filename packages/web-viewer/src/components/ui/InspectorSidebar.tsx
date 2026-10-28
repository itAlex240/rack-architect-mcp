import { useState } from 'react';
import {
  roundTenths,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import type { McpToolCallItem } from '../../state/useRackState.js';
import { SparklesAiIcon, TerminalFeedIcon } from './Icons.js';

export interface InspectorSidebarProps {
  readonly scene: SerializedRackScene;
  readonly connectionMode?: 'sidecar-live' | 'standalone-demo' | undefined;
  readonly projectPath?: string | null | undefined;
  readonly mcpToolLog?: readonly McpToolCallItem[] | undefined;
  readonly selectedDeviceId: string | null;
  readonly selectedCableId: string | null;
  readonly onSelectDevice: (instanceId: string | null) => void;
  readonly onSelectCable: (cableId: string | null) => void;
  readonly onMoveDeviceU: (instanceId: string, newU: number) => void;
  readonly onRemoveDevice?: (instanceId: string) => void;
  readonly onDisconnectCable?: (cableId: string) => void;
  readonly onClearToolLog?: (() => void) | undefined;
  readonly onSimulateAgentStep?:
    | ((stage: 'collision' | 'resolved') => void)
    | undefined;
}

type SidebarFilterTab = 'all' | 'inspector' | 'diagnostics' | 'agent';

export function InspectorSidebar({
  scene,
  connectionMode = 'standalone-demo',
  projectPath,
  mcpToolLog = [],
  selectedDeviceId,
  selectedCableId,
  onSelectDevice,
  onSelectCable,
  onMoveDeviceU,
  onRemoveDevice,
  onDisconnectCable,
  onClearToolLog,
  onSimulateAgentStep,
}: InspectorSidebarProps) {
  const [activeFilter, setActiveFilter] = useState<SidebarFilterTab>('all');

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

  const showInspector = activeFilter === 'all' || activeFilter === 'inspector';
  const showDiagnostics =
    activeFilter === 'all' || activeFilter === 'diagnostics';
  const showAgent = activeFilter === 'all' || activeFilter === 'agent';

  return (
    <aside
      data-testid="inspector-sidebar"
      style={{
        width: '368px',
        minWidth: '368px',
        maxWidth: '368px',
        height: '100%',
        background: '#0E0E11',
        borderLeft: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        flexShrink: 0,
      }}
    >
      {/* 1. Compact Rack Telemetry & Power Summary */}
      <section
        data-testid="telemetry-section"
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          background: '#111115',
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
              fontWeight: 600,
              color: '#E4E4E7',
              letterSpacing: '-0.01em',
            }}
          >
            Rack Telemetry &amp; Power
          </span>
          <span
            className="mono"
            style={{ fontSize: '10.5px', color: '#71717A' }}
          >
            {occupiedUs.size}/{uCount}U ({uOccupancyPct}%)
          </span>
        </div>

        {/* Dual Compact Load Bars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '10px',
          }}
        >
          {/* UPS Load Bar */}
          <div
            style={{
              minWidth: 0,
              overflow: 'hidden',
              padding: '8px 10px',
              borderRadius: '7px',
              background: '#17171C',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              className="mono"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                marginBottom: '5px',
              }}
            >
              <span style={{ color: '#A1A1AA' }}>UPS Load</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>
                {roundTenths(pwr.total_system_watts)}W /{' '}
                {upsSource?.capacity_watts ?? 300}W
              </span>
            </div>
            <div
              style={{
                height: '4px',
                borderRadius: '999px',
                background: '#272730',
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
          <div
            style={{
              minWidth: 0,
              overflow: 'hidden',
              padding: '8px 10px',
              borderRadius: '7px',
              background: '#17171C',
              border: '1px solid rgba(255, 255, 255, 0.06)',
            }}
          >
            <div
              className="mono"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '10px',
                marginBottom: '5px',
              }}
            >
              <span style={{ color: '#A1A1AA' }}>PoE Budget</span>
              <span style={{ color: '#F4F4F5', fontWeight: 600 }}>
                {roundTenths(pwr.total_poe_watts)}W /{' '}
                {pseSource?.poe_budget_watts ?? 196}W
              </span>
            </div>
            <div
              style={{
                height: '4px',
                borderRadius: '999px',
                background: '#272730',
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
                  background: '#3B82F6',
                }}
              />
            </div>
          </div>
        </div>

        {/* Mechanical, Thermal & Acoustic KPI Grid */}
        <div
          className="mono"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '6px',
          }}
        >
          <div
            style={{
              minWidth: 0,
              overflow: 'hidden',
              padding: '7px 8px',
              borderRadius: '6px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '9px', color: '#71717A' }}>MASS</div>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#F4F4F5',
                marginTop: '2px',
              }}
            >
              {roundTenths(mech.total_weight_grams / 1000)} kg
            </div>
          </div>
          <div
            style={{
              minWidth: 0,
              overflow: 'hidden',
              padding: '7px 8px',
              borderRadius: '6px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '9px', color: '#71717A' }}>CoG Y</div>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#F4F4F5',
                marginTop: '2px',
              }}
            >
              {roundTenths(mech.center_of_gravity_y_mm)} mm
            </div>
          </div>
          <div
            data-testid="kpi-thermal-btu"
            style={{
              minWidth: 0,
              overflow: 'hidden',
              padding: '7px 8px',
              borderRadius: '6px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '9px', color: '#71717A' }}>HEAT LOAD</div>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#F4F4F5',
                marginTop: '2px',
              }}
            >
              {roundTenths(mech.total_thermal_btu_hr)} BTU/h
            </div>
          </div>
          <div
            data-testid="kpi-acoustic-dba"
            style={{
              minWidth: 0,
              overflow: 'hidden',
              padding: '7px 8px',
              borderRadius: '6px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '9px', color: '#71717A' }}>ACOUSTICS</div>
            <div
              style={{
                fontSize: '11.5px',
                fontWeight: 600,
                color: '#F4F4F5',
                marginTop: '2px',
              }}
            >
              {roundTenths(mech.combined_noise_db_a)} dB(A)
            </div>
          </div>
          <div
            data-testid="kpi-airflow-profile"
            style={{
              minWidth: 0,
              overflow: 'hidden',
              gridColumn: 'span 2',
              padding: '7px 8px',
              borderRadius: '6px',
              background: '#16161B',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            <div style={{ fontSize: '9px', color: '#71717A' }}>
              AIRFLOW PROFILE
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#D4D4D8',
                marginTop: '2px',
              }}
            >
              {mech.airflow_profile}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Section Filter Switcher */}
      <div
        style={{
          padding: '8px 16px',
          background: '#0E0E11',
          borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px',
            padding: '2px',
            borderRadius: '7px',
            background: '#15151A',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'inspector', label: 'Element' },
              {
                id: 'diagnostics',
                label: `Checks (${scene.validation.error_count})`,
              },
              { id: 'agent', label: `MCP (${mcpToolLog.length})` },
            ] as const
          ).map((tab) => {
            const active = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                style={{
                  padding: '4px 6px',
                  borderRadius: '5px',
                  border: 'none',
                  background: active ? '#25252E' : 'transparent',
                  color: active ? '#F4F4F5' : '#A1A1AA',
                  fontSize: '10.5px',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Selection Inspector (Device or Cable) */}
      {showInspector && (
        <section
          data-testid="selection-inspector"
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
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
              style={{ fontSize: '12px', fontWeight: 600, color: '#E4E4E7' }}
            >
              Selected Element
            </span>
            {selectedDevice && (
              <span
                className="mono"
                style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: '#18181F',
                  color: '#93C5FD',
                  border: '1px solid rgba(59, 130, 246, 0.25)',
                }}
              >
                U{selectedDevice.u_position} ·{' '}
                {selectedDevice.face.toUpperCase()}
              </span>
            )}
          </div>

          {selectedDevice ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                minWidth: 0,
              }}
            >
              <div
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  padding: '12px',
                  borderRadius: '8px',
                  background: '#15151A',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#F4F4F5',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {selectedDevice.blueprint.manufacturer}{' '}
                  {selectedDevice.blueprint.model}
                </div>
                {selectedDevice.hostname && (
                  <div
                    className="mono"
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#93C5FD',
                      marginTop: '3px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Hostname / Rolle: {selectedDevice.hostname}
                  </div>
                )}
                <div
                  className="mono"
                  style={{
                    fontSize: '10.5px',
                    color: '#A1A1AA',
                    marginTop: '2px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedDevice.instance_id} · {selectedDevice.blueprint_slug}
                </div>

                {/* Physical Mounting Method Badge */}
                {(() => {
                  const isDesktopPrintedCradle =
                    selectedDevice.mount_target === 'rack-unit' &&
                    selectedDevice.blueprint.visuals.material_preset ===
                      'polycarbonate' &&
                    selectedDevice.blueprint.geometry.height_mm < 38.0;
                  const isPrintedCarrier =
                    selectedDevice.blueprint.category === 'modular-carrier' ||
                    selectedDevice.blueprint.printable_metadata !== null;
                  const isSubModule =
                    selectedDevice.mount_target === 'carrier-slot';

                  const badgeLabel = isDesktopPrintedCradle
                    ? '🖨️ Desktop-Gerät (benötigt 3D-Druck-Halterung / 1U-Fachboden)'
                    : isPrintedCarrier
                      ? '🖨️ 3D-gedruckter 1U-Modulträger (PETG / ABS)'
                      : isSubModule
                        ? `🧩 Sub-Modul im Carrier-Slot (${selectedDevice.slot_id ?? 'Bay'})`
                        : '🔩 Direktmontage (inklusive Metall-Rackohren)';

                  const badgeColor =
                    isDesktopPrintedCradle || isPrintedCarrier
                      ? {
                          bg: 'rgba(245, 158, 11, 0.12)',
                          border: 'rgba(245, 158, 11, 0.3)',
                          text: '#FDE68A',
                        }
                      : isSubModule
                        ? {
                            bg: 'rgba(59, 130, 246, 0.12)',
                            border: 'rgba(59, 130, 246, 0.3)',
                            text: '#93C5FD',
                          }
                        : {
                            bg: 'rgba(16, 185, 129, 0.1)',
                            border: 'rgba(16, 185, 129, 0.25)',
                            text: '#6EE7B7',
                          };

                  return (
                    <div
                      data-testid="device-mounting-badge"
                      style={{
                        marginTop: '7px',
                        padding: '4px 8px',
                        borderRadius: '5px',
                        background: badgeColor.bg,
                        border: `1px solid ${badgeColor.border}`,
                        color: badgeColor.text,
                        fontSize: '10.5px',
                        fontWeight: 600,
                        lineHeight: 1.35,
                      }}
                    >
                      {badgeLabel}
                    </div>
                  );
                })()}

                {/* Human-Readable Device Description ("Was ist dieses Gerät?") */}
                {selectedDevice.blueprint.description && (
                  <div
                    data-testid="selected-device-description"
                    style={{
                      marginTop: '8px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: '#111115',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      borderLeft: '2.5px solid #3B82F6',
                      fontSize: '11px',
                      color: '#D4D4D8',
                      lineHeight: 1.45,
                    }}
                  >
                    <div
                      style={{
                        fontSize: '9.5px',
                        fontWeight: 700,
                        letterSpacing: '0.03em',
                        textTransform: 'uppercase',
                        color: '#93C5FD',
                        marginBottom: '3px',
                      }}
                    >
                      Was ist dieses Gerät?
                    </div>
                    {selectedDevice.blueprint.description}
                  </div>
                )}

                <div
                  className="mono"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: '6px',
                    marginTop: '10px',
                    paddingTop: '10px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    fontSize: '10.5px',
                  }}
                >
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ color: '#71717A', fontSize: '9.5px' }}>
                      DIMENSIONS
                    </div>
                    <div style={{ color: '#E4E4E7', marginTop: '2px' }}>
                      {selectedDevice.blueprint.geometry.width_mm}×
                      {selectedDevice.blueprint.geometry.height_mm}×
                      {selectedDevice.blueprint.geometry.depth_mm}mm
                    </div>
                  </div>
                  <div style={{ minWidth: 0, overflow: 'hidden' }}>
                    <div style={{ color: '#71717A', fontSize: '9.5px' }}>
                      POWER DRAW
                    </div>
                    <div style={{ color: '#E4E4E7', marginTop: '2px' }}>
                      {selectedDevice.blueprint.power_and_thermal.idle_watts}W /{' '}
                      {
                        selectedDevice.blueprint.power_and_thermal
                          .max_system_watts
                      }
                      W Max
                    </div>
                  </div>
                </div>

                {/* Interactive U-Position Move Controls */}
                {selectedDevice.mount_target === 'rack-unit' && (
                  <div style={{ marginTop: '10px' }}>
                    <div
                      className="mono"
                      style={{
                        fontSize: '9.5px',
                        color: '#71717A',
                        marginBottom: '5px',
                      }}
                    >
                      RELOCATE RACK UNIT (LIVE AABB SOLVER)
                    </div>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                    >
                      {Array.from({ length: uCount }, (_, i) => i + 1).map(
                        (u) => {
                          const isCurrent = selectedDevice.u_position === u;
                          return (
                            <button
                              key={u}
                              type="button"
                              data-testid={`move-device-u-${u}`}
                              onClick={() =>
                                onMoveDeviceU(selectedDevice.instance_id, u)
                              }
                              className="mono"
                              style={{
                                padding: '3px 7px',
                                borderRadius: '5px',
                                border: isCurrent
                                  ? '1px solid rgba(59, 130, 246, 0.5)'
                                  : '1px solid rgba(255, 255, 255, 0.08)',
                                background: isCurrent
                                  ? 'rgba(59, 130, 246, 0.2)'
                                  : '#1C1C22',
                                color: isCurrent ? '#93C5FD' : '#D4D4D8',
                                fontSize: '10.5px',
                                fontWeight: isCurrent ? 600 : 400,
                                cursor: 'pointer',
                              }}
                            >
                              U{u}
                            </button>
                          );
                        },
                      )}
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
                      borderRadius: '6px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: '#FCA5A5',
                      fontSize: '11px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Remove Device ({selectedDevice.instance_id})
                  </button>
                )}
              </div>

              {/* Device Ports List */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  className="mono"
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: '#A1A1AA',
                  }}
                >
                  Ports ({selectedDevice.ports.length})
                </span>
                <span style={{ fontSize: '10px', color: '#71717A' }}>
                  Click linked port to inspect cable
                </span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '5px',
                  minWidth: 0,
                  width: '100%',
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
                  const connExt = scene.project.external_endpoints.find(
                    (ext) =>
                      ext.patch_panel_instance_id ===
                        selectedDevice.instance_id &&
                      ext.patch_panel_port_id === p.port_id,
                  );
                  return (
                    <div
                      key={`${p.port_id}-${p.world_face}`}
                      onClick={() => {
                        if (connCable) onSelectCable(connCable.cable_id);
                      }}
                      title={
                        connExt
                          ? `${p.port_id}: ${connExt.label} (${connExt.room_or_zone ?? 'Gebäude'})`
                          : connCable
                            ? `${p.port_id}: ${connCable.label ?? connCable.cable_id}`
                            : `${p.port_id} (${p.connector_type})`
                      }
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        background: '#15151A',
                        border:
                          connCable || connExt
                            ? '1px solid rgba(255, 255, 255, 0.14)'
                            : '1px solid rgba(255, 255, 255, 0.05)',
                        borderLeft: connCable
                          ? `2.5px solid ${connCable.color_hex}`
                          : connExt
                            ? `2.5px solid ${connExt.color_hex}`
                            : '1px solid rgba(255, 255, 255, 0.05)',
                        fontSize: '10.5px',
                        cursor: connCable ? 'pointer' : 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <div
                        className="mono"
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '4px',
                          minWidth: 0,
                          fontWeight: 600,
                          color: '#E4E4E7',
                        }}
                      >
                        <span
                          style={{
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {p.port_id}
                        </span>
                        <span
                          style={{
                            color: '#71717A',
                            fontSize: '9px',
                            flexShrink: 0,
                          }}
                        >
                          {connExt ? 'rear+front' : p.world_face}
                        </span>
                      </div>
                      <div
                        className="mono"
                        style={{
                          minWidth: 0,
                          color:
                            connCable || connExt ? '#A1A1AA' : '#52525B',
                          fontSize: '9.5px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {connExt
                          ? `🏠 ${connExt.label}`
                          : connCable
                            ? (connCable.label ?? connCable.cable_id)
                            : p.connector_type}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : selectedCable && selectedRoute ? (
            (() => {
              const linkedExt = scene.project.external_endpoints.find(
                (ext) =>
                  (selectedCable.from.instance_id ===
                    ext.patch_panel_instance_id &&
                    selectedCable.from.port_id === ext.patch_panel_port_id) ||
                  (selectedCable.to.instance_id ===
                    ext.patch_panel_instance_id &&
                    selectedCable.to.port_id === ext.patch_panel_port_id),
              );
              const swEnd =
                linkedExt &&
                selectedCable.from.instance_id ===
                  linkedExt.patch_panel_instance_id
                  ? selectedCable.to
                  : selectedCable.from;

              return (
                <div
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#15151A',
                    border: '1px solid rgba(255, 255, 255, 0.09)',
                    borderLeft: `3px solid ${selectedCable.color_hex}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '7px',
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: '#F4F4F5',
                    }}
                  >
                    {linkedExt
                      ? `🏠 ${linkedExt.label}`
                      : (selectedCable.label ?? selectedCable.cable_id)}
                  </div>
                  <div style={{ fontSize: '11px', color: '#A1A1AA' }}>
                    {linkedExt
                      ? `${linkedExt.room_or_zone ?? 'Gebäude'} · ${linkedExt.poe_draw_watts > 0 ? `PoE ${linkedExt.poe_draw_watts}W` : 'Standard LAN'} · ${linkedExt.required_speed.toUpperCase()}`
                      : `${selectedCable.cable_id} (${selectedCable.cable_type})`}
                  </div>

                  {linkedExt ? (
                    <div
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        background: '#111115',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                        fontSize: '11px',
                      }}
                    >
                      <div style={{ color: '#D4D4D8' }}>
                        <strong style={{ color: '#A1A1AA' }}>
                          Schritt 1 (Hinten):
                        </strong>{' '}
                        Hauskabel in{' '}
                        <span className="mono" style={{ color: '#38BDF8' }}>
                          {linkedExt.patch_panel_instance_id}:
                          {linkedExt.patch_panel_port_id}
                        </span>
                      </div>
                      <div style={{ color: '#D4D4D8' }}>
                        <strong style={{ color: '#A1A1AA' }}>
                          Schritt 2 (Vorne):
                        </strong>{' '}
                        Patchkabel in Switch{' '}
                        <span className="mono" style={{ color: '#10B981' }}>
                          {swEnd.instance_id}:{swEnd.port_id}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="mono"
                      style={{ fontSize: '11px', color: '#D4D4D8' }}
                    >
                      {selectedCable.from.instance_id}:
                      {selectedCable.from.port_id} →{' '}
                      {selectedCable.to.instance_id}:{selectedCable.to.port_id}
                    </div>
                  )}

                  <div
                    className="mono"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      fontSize: '11px',
                      color: '#A1A1AA',
                    }}
                  >
                    <span>
                      Spline: {roundTenths(selectedRoute.required_length_mm)}mm
                    </span>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>
                      SKU:{' '}
                      {(selectedRoute.recommended_commercial_mm / 1000).toFixed(
                        2,
                      )}
                      m
                    </span>
                  </div>
                  {onDisconnectCable && (
                    <button
                      type="button"
                      data-testid="btn-disconnect-cable"
                      onClick={() => onDisconnectCable(selectedCable.cable_id)}
                      style={{
                        marginTop: '4px',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        background: 'rgba(239, 68, 68, 0.08)',
                        color: '#FCA5A5',
                        fontSize: '11px',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Disconnect Cable ({selectedCable.cable_id})
                    </button>
                  )}
                </div>
              );
            })()
          ) : (
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                background: '#15151A',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '11.5px',
                color: '#A1A1AA',
              }}
            >
              Select any device, sub-module, or 3D cable spline in the viewport
              to inspect its dimensions, ports, and clearances.
            </div>
          )}

          {/* Beginner-Friendly Building / Room Patching Guide (`external_endpoints`) */}
          {scene.project.external_endpoints.length > 0 && (
            <div
              data-testid="external-endpoints-guide"
              style={{
                marginTop: '4px',
                padding: '11px 12px',
                borderRadius: '8px',
                background: '#15151A',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: '7px',
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
                    fontSize: '11.5px',
                    fontWeight: 600,
                    color: '#F4F4F5',
                  }}
                >
                  🏠 Haus- &amp; Raum-Verkabelung (Steckplan)
                </span>
                <span
                  className="mono"
                  style={{ fontSize: '10px', color: '#A1A1AA' }}
                >
                  {scene.project.external_endpoints.length} Leitungen
                </span>
              </div>
              <div style={{ fontSize: '10.5px', color: '#71717A' }}>
                Klicke auf eine Leitung, um das zugehörige Kabel im 3D-Rack
                hervorzuheben:
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                {scene.project.external_endpoints.map((ext, idx) => {
                  const frontCable = scene.project.cables.find(
                    (c) =>
                      (c.from.instance_id === ext.patch_panel_instance_id &&
                        c.from.port_id === ext.patch_panel_port_id &&
                        c.from.face !== 'rear') ||
                      (c.to.instance_id === ext.patch_panel_instance_id &&
                        c.to.port_id === ext.patch_panel_port_id &&
                        c.to.face !== 'rear'),
                  );
                  const swPeer = frontCable
                    ? frontCable.from.instance_id ===
                        ext.patch_panel_instance_id &&
                      frontCable.from.port_id === ext.patch_panel_port_id
                      ? `${frontCable.to.instance_id}:${frontCable.to.port_id}`
                      : `${frontCable.from.instance_id}:${frontCable.from.port_id}`
                    : 'Offen';
                  const isRowSelected =
                    frontCable !== undefined &&
                    selectedCableId === frontCable.cable_id;

                  return (
                    <div
                      key={ext.endpoint_id}
                      onClick={() => {
                        if (frontCable) {
                          onSelectCable(frontCable.cable_id);
                        }
                      }}
                      style={{
                        minWidth: 0,
                        overflow: 'hidden',
                        padding: '7px 9px',
                        borderRadius: '6px',
                        background: isRowSelected ? '#1E1E28' : '#111115',
                        border: isRowSelected
                          ? '1px solid rgba(59, 130, 246, 0.45)'
                          : '1px solid rgba(255, 255, 255, 0.05)',
                        borderLeft: `2.5px solid ${ext.color_hex}`,
                        cursor: frontCable ? 'pointer' : 'default',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '6px',
                          minWidth: 0,
                        }}
                      >
                        <span
                          style={{
                            minWidth: 0,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#F4F4F5',
                          }}
                        >
                          #{String(idx + 1).padStart(2, '0')} · {ext.label}
                        </span>
                        <span
                          className="mono"
                          style={{
                            flexShrink: 0,
                            fontSize: '9.5px',
                            padding: '1px 5px',
                            borderRadius: '4px',
                            background:
                              ext.poe_draw_watts > 0
                                ? 'rgba(245, 158, 11, 0.14)'
                                : 'rgba(16, 185, 129, 0.12)',
                            color:
                              ext.poe_draw_watts > 0 ? '#FBBF24' : '#34D399',
                          }}
                        >
                          {ext.poe_draw_watts > 0
                            ? `PoE ${ext.poe_draw_watts}W`
                            : 'LAN'}
                        </span>
                      </div>
                      <div
                        className="mono"
                        style={{
                          fontSize: '10px',
                          color: '#A1A1AA',
                          minWidth: 0,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        1. Hinten:{' '}
                        <span style={{ color: '#38BDF8' }}>
                          {ext.patch_panel_instance_id}:{ext.patch_panel_port_id}
                        </span>{' '}
                        → 2. Vorne:{' '}
                        <span style={{ color: '#10B981' }}>{swPeer}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 3. 5-Stage Validation Console */}
      {showDiagnostics && (
        <section
          data-testid="validation-console"
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
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
                fontWeight: 600,
                color: '#E4E4E7',
              }}
            >
              5-Stage Validation Checks
            </span>
            <span
              className="mono"
              style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: scene.validation.is_valid ? '#10B981' : '#EF4444',
              }}
            >
              {scene.validation.error_count} Errors ·{' '}
              {scene.validation.warning_count} Warnings
            </span>
          </div>

          {scene.validation.issues.length === 0 ? (
            <div
              style={{
                padding: '10px 12px',
                borderRadius: '7px',
                background: '#15151A',
                border: '1px solid rgba(255, 255, 255, 0.07)',
                borderLeft: '3px solid #10B981',
                fontSize: '11.5px',
                color: '#D4D4D8',
                lineHeight: 1.45,
              }}
            >
              All spatial AABB clearances, sub-module slots, PoE budgets, and 3D
              spline cable routes passed validation with 0 collisions.
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              {scene.validation.issues.map((issue, idx) => (
                <div
                  key={`${issue.code}-${idx}`}
                  data-testid={`diagnostic-issue-${issue.code}`}
                  onClick={() => {
                    const firstTarget = issue.affected_instances[0];
                    if (firstTarget) onSelectDevice(firstTarget);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '7px',
                    background: '#15151A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderLeft:
                      issue.severity === 'ERROR'
                        ? '3px solid #EF4444'
                        : '3px solid #F59E0B',
                    cursor: 'pointer',
                  }}
                >
                  <div
                    className="mono"
                    style={{
                      fontSize: '10.5px',
                      fontWeight: 600,
                      color:
                        issue.severity === 'ERROR' ? '#FCA5A5' : '#FDE68A',
                    }}
                  >
                    {issue.severity} · {issue.code}
                  </div>
                  <div
                    style={{
                      fontSize: '11.5px',
                      color: '#E4E4E7',
                      marginTop: '4px',
                      lineHeight: 1.4,
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
                        paddingTop: '6px',
                        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                      }}
                    >
                      Remediation: {issue.remediation_suggestions[0]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4. Live MCP Agent Tool-Call Feed & Self-Correction Replay */}
      {showAgent && (
        <section
          data-testid="mcp-agent-feed"
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#E4E4E7',
              }}
            >
              <TerminalFeedIcon size={13} style={{ color: '#3B82F6' }} />
              <span>MCP AGENT TOOL-CALL FEED</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                className="mono"
                style={{ color: '#71717A', fontSize: '10.5px' }}
              >
                {mcpToolLog.length} Calls
              </span>
              {connectionMode === 'sidecar-live' &&
                mcpToolLog.length > 0 &&
                onClearToolLog && (
                  <button
                    type="button"
                    data-testid="btn-clear-mcp-log"
                    onClick={onClearToolLog}
                    style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      background: '#16161B',
                      color: '#A1A1AA',
                      fontSize: '9.5px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                )}
            </div>
          </div>

          {connectionMode === 'sidecar-live' && projectPath && (
            <div
              className="mono"
              style={{
                padding: '6px 9px',
                borderRadius: '6px',
                background: '#141418',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                fontSize: '10px',
                color: '#93C5FD',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
              title={projectPath}
            >
              Bound File: {projectPath}
            </div>
          )}

          {connectionMode === 'standalone-demo' && onSimulateAgentStep && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '6px',
              }}
            >
              <button
                type="button"
                data-testid="agent-sim-step-collision"
                onClick={() => onSimulateAgentStep('collision')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  background: 'rgba(245, 158, 11, 0.08)',
                  color: '#FDE68A',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <SparklesAiIcon size={11} />
                <span>1. Trigger Collision</span>
              </button>
              <button
                type="button"
                data-testid="agent-sim-step-resolved"
                onClick={() => onSimulateAgentStep('resolved')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  color: '#A7F3D0',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>2. LLM Self-Correction</span>
              </button>
            </div>
          )}

          {/* Full-Height Non-Clipped Timeline Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {mcpToolLog.length === 0 ? (
              <div
                data-testid="mcp-agent-empty-feed"
                style={{
                  padding: '12px',
                  borderRadius: '7px',
                  background: '#141418',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  borderLeft: '2.5px solid #3B82F6',
                  fontSize: '11px',
                  color: '#A1A1AA',
                  lineHeight: 1.45,
                }}
              >
                <div
                  style={{
                    color: '#E4E4E7',
                    fontWeight: 600,
                    marginBottom: '4px',
                  }}
                >
                  Ready for External MCP Agent (`rack_architect_mcp`)
                </div>
                Connect your LLM agent via stdio or WebSocket to inspect live{' '}
                <span className="mono">init_rack</span>,{' '}
                <span className="mono">mount_equipment</span>,{' '}
                <span className="mono">connect_cables</span>, and{' '}
                <span className="mono">validate_rack</span> tool calls in real
                time.
              </div>
            ) : (
              mcpToolLog.map((entry) => {
                const shortTime = entry.timestamp.includes('T')
                  ? entry.timestamp.slice(11, 19)
                  : entry.timestamp;
                return (
                  <div
                    key={entry.id}
                    data-testid={`mcp-tool-call-${entry.tool}`}
                    style={{
                      padding: '9px 11px',
                      borderRadius: '7px',
                      background: '#15151A',
                      border: '1px solid rgba(255, 255, 255, 0.07)',
                      borderLeft:
                        entry.status === 'VALID'
                          ? '2.5px solid #10B981'
                          : '2.5px solid #EF4444',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span style={{ fontWeight: 600, color: '#F4F4F5' }}>
                          {entry.tool}()
                        </span>
                        <span style={{ fontSize: '9.5px', color: '#71717A' }}>
                          {shortTime}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '9.5px',
                          fontWeight: 600,
                          color:
                            entry.status === 'VALID' ? '#10B981' : '#EF4444',
                        }}
                      >
                        {entry.status}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: '#A1A1AA',
                        lineHeight: 1.4,
                      }}
                    >
                      {entry.summary}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}
    </aside>
  );
}
