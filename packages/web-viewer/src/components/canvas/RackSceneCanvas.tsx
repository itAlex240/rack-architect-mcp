import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  EIA_310_SPECS,
  MM_PER_U,
  isPowerCableType,
  type CableConnection,
  type ComputedDeviceGeometry,
  type ExternalEndpoint,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import type {
  CableFilterMode,
  CameraPresetMode,
  HoveredPortInfo,
} from '../../state/useRackState.js';
import { RackFrame3D } from './RackFrame3D.js';
import { MountedDevice3D } from './MountedDevice3D.js';
import { CableTube3D, computeDeviceExplodeOffsetZMm } from './CableTube3D.js';

export interface RackSceneCanvasProps {
  readonly scene: SerializedRackScene;
  readonly xrayMode: boolean;
  readonly explodeZMm: number;
  readonly cableFilter: CableFilterMode;
  readonly cameraPreset: CameraPresetMode;
  readonly showClearanceBoxes: boolean;
  readonly doorOpen: boolean;
  readonly selectedDeviceId: string | null;
  readonly selectedCableId: string | null;
  readonly hoveredPort: HoveredPortInfo | null;
  readonly onSelectDevice: (instanceId: string | null) => void;
  readonly onSelectCable: (cableId: string | null) => void;
  readonly onHoverPort: (info: HoveredPortInfo | null) => void;
}

function isWebGlSupported(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (
    window.navigator.userAgent.includes('jsdom') ||
    window.navigator.userAgent.includes('HappyDOM')
  ) {
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ?? canvas.getContext('webgl'),
    );
  } catch {
    return false;
  }
}

interface CameraPresetControllerProps {
  readonly preset: CameraPresetMode;
  readonly center: readonly [number, number, number];
  readonly panelWidthMm: number;
  readonly totalHeightMm: number;
  readonly railDepthMm: number;
}

function CameraPresetController({
  preset,
  center,
  panelWidthMm,
  totalHeightMm,
  railDepthMm,
}: CameraPresetControllerProps) {
  const { camera } = useThree();
  const [cx, cy, cz] = center;

  useEffect(() => {
    switch (preset) {
      case 'front':
        camera.position.set(cx, cy, -520);
        break;
      case 'rear':
        camera.position.set(cx, cy, railDepthMm + 520);
        break;
      case 'side-cutaway':
        camera.position.set(panelWidthMm + 560, cy, cz);
        break;
      case 'top':
        camera.position.set(cx, totalHeightMm + 560, cz - 10);
        break;
      case 'isometric':
      default:
        camera.position.set(
          panelWidthMm + 340,
          totalHeightMm * 0.88 + 140,
          -420,
        );
        break;
    }
    camera.lookAt(cx, cy, cz);
    camera.updateProjectionMatrix();
  }, [camera, cx, cy, cz, panelWidthMm, preset, railDepthMm, totalHeightMm]);

  return <OrbitControls target={[cx, cy, cz]} makeDefault enableDamping dampingFactor={0.08} />;
}

interface ExternalBuildingDrops3DProps {
  readonly externalEndpoints: readonly ExternalEndpoint[];
  readonly cables: readonly CableConnection[];
  readonly devicesById: ReadonlyMap<string, ComputedDeviceGeometry>;
  readonly panelWidthMm: number;
  readonly totalHeightMm: number;
  readonly railDepthMm: number;
  readonly explodeZMm: number;
  readonly cableFilter: CableFilterMode;
  readonly selectedCableId: string | null;
  readonly onSelectCable: (cableId: string | null) => void;
}

/**
 * Renders the incoming rear building cable conduit (`top-rear` or `bottom-rear`)
 * and smooth 3D drop tubes terminating onto the rear face of the patch panel (`0U` consumed).
 */
function ExternalBuildingDrops3D({
  externalEndpoints,
  cables,
  devicesById,
  panelWidthMm,
  totalHeightMm,
  railDepthMm,
  explodeZMm,
  cableFilter,
  selectedCableId,
  onSelectCable,
}: ExternalBuildingDrops3DProps) {
  const dropItems = useMemo(() => {
    if (cableFilter === 'none' || cableFilter === 'power') return [];
    const items: Array<{
      readonly ext: ExternalEndpoint;
      readonly linkedFrontCableId: string | null;
      readonly tubeGeo: THREE.TubeGeometry;
      readonly bootPos: readonly [number, number, number];
    }> = [];

    externalEndpoints.forEach((ext, idx) => {
      if (cableFilter === 'poe' && ext.poe_draw_watts <= 0) {
        return;
      }
      const ppDev = devicesById.get(ext.patch_panel_instance_id);
      if (!ppDev) return;
      const ppPort = ppDev.ports.find(
        (p) => p.port_id === ext.patch_panel_port_id,
      );
      if (!ppPort) return;

      const linkedCable = cables.find(
        (c) =>
          (c.from.instance_id === ext.patch_panel_instance_id &&
            c.from.port_id === ext.patch_panel_port_id &&
            c.from.face !== 'rear') ||
          (c.to.instance_id === ext.patch_panel_instance_id &&
            c.to.port_id === ext.patch_panel_port_id &&
            c.to.face !== 'rear'),
      );

      const offsetZ = computeDeviceExplodeOffsetZMm(ppDev, explodeZMm);
      const portX = ppPort.world_position.x;
      const portY = ppPort.world_position.y;
      const rearFaceZ = ppDev.chassis_box.max.z + offsetZ + 2.2;

      const conduitZ = Math.min(
        railDepthMm - 25,
        Math.max(rearFaceZ + 85, railDepthMm * 0.42),
      );
      const conduitY =
        ext.entry_position === 'bottom-rear' ? -18 : totalHeightMm + 22;
      const spreadX =
        panelWidthMm / 2 +
        (idx - (externalEndpoints.length - 1) / 2) *
          Math.min(8.5, (panelWidthMm * 0.68) / Math.max(1, externalEndpoints.length));
      const dropZ = conduitZ + (idx % 2) * 5.5;

      const pts = [
        new THREE.Vector3(spreadX, conduitY, dropZ),
        new THREE.Vector3(
          spreadX * 0.5 + portX * 0.5,
          portY + (ext.entry_position === 'bottom-rear' ? -18 : 22),
          dropZ - 14,
        ),
        new THREE.Vector3(portX, portY, rearFaceZ + 22),
        new THREE.Vector3(portX, portY, rearFaceZ),
      ];

      const curve = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
      const tubeGeo = new THREE.TubeGeometry(curve, 36, 1.95, 10, false);

      items.push({
        ext,
        linkedFrontCableId: linkedCable?.cable_id ?? null,
        tubeGeo,
        bootPos: [portX, portY, rearFaceZ + 4.5] as const,
      });
    });

    return items;
  }, [
    cableFilter,
    cables,
    devicesById,
    explodeZMm,
    externalEndpoints,
    panelWidthMm,
    railDepthMm,
    totalHeightMm,
  ]);

  if (dropItems.length === 0) return null;

  const firstPpDev = devicesById.get(
    externalEndpoints[0]?.patch_panel_instance_id ?? '',
  );
  const firstRearZ =
    (firstPpDev?.chassis_box.max.z ?? 35) +
    computeDeviceExplodeOffsetZMm(firstPpDev, explodeZMm);
  const collarZ = Math.min(
    railDepthMm - 25,
    Math.max(firstRearZ + 85, railDepthMm * 0.42),
  );
  const collarY =
    externalEndpoints[0]?.entry_position === 'bottom-rear'
      ? -18
      : totalHeightMm + 22;
  const collarWidth = Math.min(
    panelWidthMm * 0.52,
    Math.max(70, externalEndpoints.length * 6.5 + 28),
  );

  return (
    <group>
      {/* Rear Building Cable Entry Conduit Collar (`0U` Overhead Trunk) */}
      <group position={[panelWidthMm / 2, collarY, collarZ]}>
        <mesh>
          <boxGeometry args={[collarWidth, 10, 28]} />
          <meshStandardMaterial color="#27272A" metalness={0.68} roughness={0.32} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[collarWidth - 8, 11.2, 20]} />
          <meshStandardMaterial color="#09090B" roughness={0.92} />
        </mesh>
      </group>

      {/* Individual Rear Building Drop Tubes into Patch Panel Rear Ports */}
      {dropItems.map(({ ext, linkedFrontCableId, tubeGeo, bootPos }) => {
        const isHighlighted =
          selectedCableId !== null && selectedCableId === linkedFrontCableId;
        return (
          <group
            key={`ext-drop-${ext.endpoint_id}`}
            onClick={(e) => {
              e.stopPropagation();
              if (linkedFrontCableId) {
                onSelectCable(linkedFrontCableId);
              }
            }}
          >
            <mesh geometry={tubeGeo}>
              <meshStandardMaterial
                color={ext.color_hex}
                roughness={0.45}
                metalness={0.1}
                emissive={isHighlighted ? ext.color_hex : '#000000'}
                emissiveIntensity={isHighlighted ? 0.5 : 0}
              />
            </mesh>
            {/* Rear Punchdown Strain-Relief Boot */}
            <mesh position={bootPos} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[2.3, 2.8, 9, 10]} />
              <meshStandardMaterial
                color={isHighlighted ? ext.color_hex : '#18181B'}
                roughness={0.5}
                metalness={0.3}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/**
 * Interactive 3D Rack Scene Canvas with HiDPI `ResizeObserver` management (`AGENTS.md` Section 8.4),
 * camera presets, X-Ray Ghost View, Exploded Z-Depth, and 3D Spline Cable Tubes with Boot Sleeves.
 */
export function RackSceneCanvas({
  scene,
  xrayMode,
  explodeZMm,
  cableFilter,
  cameraPreset,
  showClearanceBoxes,
  doorOpen,
  selectedDeviceId,
  selectedCableId,
  hoveredPort,
  onSelectDevice,
  onSelectCable,
  onHoverPort,
}: RackSceneCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [pixelSize, setPixelSize] = useState<{
    readonly width: number;
    readonly height: number;
  }>({ width: 1280, height: 800 });

  // Single ResizeObserver outside the render loop using devicePixelContentBoxSize (AGENTS.md Section 8.4)
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const dpBox = entry.devicePixelContentBoxSize?.[0];
        const dpr =
          typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
        const width = dpBox
          ? dpBox.inlineSize
          : Math.max(1, Math.round(entry.contentRect.width * dpr));
        const height = dpBox
          ? dpBox.blockSize
          : Math.max(1, Math.round(entry.contentRect.height * dpr));
        setPixelSize({ width, height });
      }
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  const spec = EIA_310_SPECS[scene.project.rack.standard];
  const panelWidthMm = spec.W_panel;
  const totalHeightMm = scene.project.rack.u_height * MM_PER_U;
  const railDepthMm = scene.project.rack.rail_depth_mm;
  const center: readonly [number, number, number] = [
    panelWidthMm / 2,
    totalHeightMm / 2,
    railDepthMm / 2,
  ];

  const devicesById = useMemo(
    () =>
      new Map<string, ComputedDeviceGeometry>(
        scene.geometry.devices.map((d) => [d.instance_id, d]),
      ),
    [scene.geometry.devices],
  );

  const cablesById = useMemo(
    () =>
      new Map(scene.project.cables.map((c) => [c.cable_id, c])),
    [scene.project.cables],
  );

  const visibleRoutes = useMemo(() => {
    if (cableFilter === 'none') return [];
    return scene.cable_routes.filter((route) => {
      const cable = cablesById.get(route.cable_id);
      if (!cable) return false;
      const isPower = isPowerCableType(cable.cable_type);
      if (cableFilter === 'power') return isPower;
      if (cableFilter === 'network') return !isPower;
      if (cableFilter === 'poe') {
        if (isPower) return false;
        const fromDev = devicesById.get(cable.from.instance_id);
        const toDev = devicesById.get(cable.to.instance_id);
        const fromPort = fromDev?.ports.find(
          (p) => p.port_id === cable.from.port_id,
        );
        const toPort = toDev?.ports.find(
          (p) => p.port_id === cable.to.port_id,
        );
        const hasPoe =
          (fromPort?.capabilities.some((c) => c.startsWith('poe')) ?? false) ||
          (toPort?.capabilities.some((c) => c.startsWith('poe')) ?? false);
        return hasPoe;
      }
      return true;
    });
  }, [cableFilter, cablesById, devicesById, scene.cable_routes]);

  const webGlAvailable = useMemo(() => isWebGlSupported(), []);

  return (
    <div
      ref={containerRef}
      data-testid="rack-3d-viewport"
      data-pixel-size={`${pixelSize.width}x${pixelSize.height}`}
      data-camera-preset={cameraPreset}
      data-xray={String(xrayMode)}
      data-explode-z={String(explodeZMm)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background:
          'radial-gradient(circle at 50% 38%, #18181f 0%, #09090b 78%)',
        overflow: 'hidden',
      }}
    >
      {webGlAvailable ? (
        <Canvas
          camera={{
            fov: 38,
            near: 1,
            far: 5000,
            position: [
              panelWidthMm + 340,
              totalHeightMm * 0.88 + 140,
              -420,
            ],
          }}
          onPointerMissed={() => {
            onSelectDevice(null);
            onSelectCable(null);
          }}
        >
          <ambientLight intensity={1.05} />
          <directionalLight position={[360, 680, -520]} intensity={1.65} />
          <directionalLight position={[-320, 480, 640]} intensity={1.15} />
          <pointLight
            position={[panelWidthMm / 2, totalHeightMm / 2, -160]}
            intensity={0.75}
            color="#E4E4E7"
          />

          <CameraPresetController
            preset={cameraPreset}
            center={center}
            panelWidthMm={panelWidthMm}
            totalHeightMm={totalHeightMm}
            railDepthMm={railDepthMm}
          />

          {/* Reference Floor Grid in Millimeters */}
          <gridHelper
            args={[1200, 24, '#27272A', '#141418']}
            position={[panelWidthMm / 2, -22, railDepthMm / 2]}
          />

          {/* 3D Rack Frame, Posts, EIA-310 Rails & Smoked Glass Door */}
          <RackFrame3D
            rack={scene.project.rack}
            xrayMode={xrayMode}
            doorOpen={doorOpen}
          />

          {/* All Rackmount Devices, Carriers & Sub-Modules */}
          {scene.geometry.devices.map((dev) => (
            <MountedDevice3D
              key={dev.instance_id}
              device={dev}
              rackStandard={scene.project.rack.standard}
              cables={scene.project.cables}
              cableRoutes={scene.cable_routes}
              externalEndpoints={scene.project.external_endpoints}
              xrayMode={xrayMode}
              explodeZMm={explodeZMm}
              showClearanceBoxes={showClearanceBoxes}
              isSelected={selectedDeviceId === dev.instance_id}
              onSelectDevice={(id) => onSelectDevice(id)}
              onHoverPort={onHoverPort}
            />
          ))}

          {/* Rear Building / House Cable Conduit & Patch Panel Rear Drops (`external_endpoints`) */}
          {scene.project.external_endpoints.length > 0 && (
            <ExternalBuildingDrops3D
              externalEndpoints={scene.project.external_endpoints}
              cables={scene.project.cables}
              devicesById={devicesById}
              panelWidthMm={panelWidthMm}
              totalHeightMm={totalHeightMm}
              railDepthMm={railDepthMm}
              explodeZMm={explodeZMm}
              cableFilter={cableFilter}
              selectedCableId={selectedCableId}
              onSelectCable={(cid) => onSelectCable(cid)}
            />
          )}

          {/* Clamped 3D Catmull-Rom Cable Tubes + Strain-Relief Boots */}
          {visibleRoutes.map((route) => {
            const cable = cablesById.get(route.cable_id);
            if (!cable) return null;

            const isAttachedToSelectedDevice =
              selectedDeviceId !== null &&
              (cable.from.instance_id === selectedDeviceId ||
                cable.to.instance_id === selectedDeviceId);
            const isSelectedCable = selectedCableId === route.cable_id;
            const isHighlighted =
              isSelectedCable || isAttachedToSelectedDevice;
            const hasAnySelection =
              selectedDeviceId !== null || selectedCableId !== null;
            const isDimmed = hasAnySelection && !isHighlighted;

            return (
              <CableTube3D
                key={route.cable_id}
                route={route}
                cable={cable}
                devicesById={devicesById}
                explodeZMm={explodeZMm}
                isHighlighted={isHighlighted}
                isDimmed={isDimmed}
                onSelectCable={(cid) => onSelectCable(cid)}
              />
            );
          })}
        </Canvas>
      ) : (
        /* Deterministic Accessible Scene Fallback for Headless / JSDOM Tests */
        <div
          data-testid="rack-3d-scene-summary"
          style={{
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#38BDF8' }}>
            3D Procedural Scene Graph ({scene.geometry.devices.length} Devices •{' '}
            {visibleRoutes.length} Visible Cable Tubes)
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            {scene.geometry.devices.map((dev) => (
              <button
                key={dev.instance_id}
                type="button"
                data-testid={`scene-device-${dev.instance_id}`}
                onClick={() => onSelectDevice(dev.instance_id)}
                style={{
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border:
                    selectedDeviceId === dev.instance_id
                      ? '1.5px solid #38BDF8'
                      : '1px solid #334155',
                  background: '#0F172A',
                  color: '#F8FAFC',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                U{dev.u_position} {dev.hostname ?? dev.instance_id}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {visibleRoutes.map((route) => (
              <button
                key={route.cable_id}
                type="button"
                data-testid={`scene-cable-${route.cable_id}`}
                onClick={() => onSelectCable(route.cable_id)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border:
                    selectedCableId === route.cable_id
                      ? '1.5px solid #38BDF8'
                      : '1px solid #1E293B',
                  background: '#1E293B',
                  color: '#CBD5E1',
                  cursor: 'pointer',
                  fontSize: '11px',
                }}
              >
                {route.cable_id} ({route.recommended_commercial_mm}mm)
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Cable Step-by-Step Patching Guide Banner (3D Overlay) */}
      {selectedCableId !== null &&
        (() => {
          const selCable = cablesById.get(selectedCableId);
          if (!selCable) return null;
          const linkedExt = scene.project.external_endpoints.find(
            (ext) =>
              (selCable.from.instance_id === ext.patch_panel_instance_id &&
                selCable.from.port_id === ext.patch_panel_port_id) ||
              (selCable.to.instance_id === ext.patch_panel_instance_id &&
                selCable.to.port_id === ext.patch_panel_port_id),
          );
          const swEnd =
            linkedExt &&
            selCable.from.instance_id === linkedExt.patch_panel_instance_id
              ? selCable.to
              : selCable.from;

          return (
            <div
              data-testid="selected-cable-guide-banner"
              style={{
                position: 'absolute',
                top: '16px',
                left: '16px',
                maxWidth: '440px',
                padding: '12px 14px',
                background: 'rgba(18, 18, 22, 0.92)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255, 255, 255, 0.09)',
                borderLeft: `3px solid ${selCable.color_hex}`,
                borderRadius: '8px',
                boxShadow: '0 10px 28px rgba(0,0,0,0.65)',
                zIndex: 20,
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
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#F4F4F5',
                  }}
                >
                  {linkedExt
                    ? `🏠 ${linkedExt.label}${linkedExt.room_or_zone ? ` (${linkedExt.room_or_zone})` : ''}`
                    : (selCable.label ?? selCable.cable_id)}
                </span>
                <span
                  className="mono"
                  style={{
                    fontSize: '10px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    background: 'rgba(255,255,255,0.06)',
                    color: '#A1A1AA',
                  }}
                >
                  {linkedExt && linkedExt.poe_draw_watts > 0
                    ? `PoE ${linkedExt.poe_draw_watts}W · ${linkedExt.required_speed.toUpperCase()}`
                    : selCable.cable_type}
                </span>
              </div>

              {linkedExt ? (
                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '11px',
                    color: '#D4D4D8',
                  }}
                >
                  <div>
                    <strong style={{ color: '#A1A1AA' }}>
                      1. Hinten auflegen:
                    </strong>{' '}
                    Hauskabel aus{' '}
                    <span style={{ color: '#F4F4F5' }}>
                      {linkedExt.room_or_zone ?? 'Gebäude'}
                    </span>{' '}
                    in{' '}
                    <span className="mono" style={{ color: '#38BDF8' }}>
                      {linkedExt.patch_panel_instance_id}:
                      {linkedExt.patch_panel_port_id} (Rear)
                    </span>
                  </div>
                  <div>
                    <strong style={{ color: '#A1A1AA' }}>
                      2. Vorne patchen:
                    </strong>{' '}
                    Patchkabel von{' '}
                    <span className="mono" style={{ color: '#38BDF8' }}>
                      {linkedExt.patch_panel_instance_id}:
                      {linkedExt.patch_panel_port_id} (Front)
                    </span>{' '}
                    →{' '}
                    <span className="mono" style={{ color: '#10B981' }}>
                      {swEnd.instance_id}:{swEnd.port_id}
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  className="mono"
                  style={{
                    marginTop: '6px',
                    fontSize: '11px',
                    color: '#A1A1AA',
                  }}
                >
                  {selCable.from.instance_id}:{selCable.from.port_id} →{' '}
                  {selCable.to.instance_id}:{selCable.to.port_id}
                </div>
              )}
            </div>
          );
        })()}

      {/* Floating 3D Port Hover Tooltip Badge */}
      {hoveredPort && (
        <div
          data-testid="port-hover-tooltip"
          style={{
            position: 'absolute',
            bottom: '22px',
            left: '22px',
            padding: '10px 14px',
            background: 'rgba(9, 13, 22, 0.94)',
            border: '1px solid #38BDF8',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.65)',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          <div
            className="mono"
            style={{ fontSize: '12px', fontWeight: 700, color: '#F8FAFC' }}
          >
            {hoveredPort.instanceId} • {hoveredPort.portId}{' '}
            <span style={{ color: '#38BDF8' }}>
              [{hoveredPort.connectorType.toUpperCase()} /{' '}
              {hoveredPort.worldFace.toUpperCase()}]
            </span>
          </div>
          <div
            className="mono"
            style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}
          >
            {hoveredPort.peerDescription
              ? `Connected -> ${hoveredPort.peerDescription} (${hoveredPort.connectedCableId})`
              : 'Unconnected Port — Available'}
          </div>
          <div
            className="mono"
            style={{ fontSize: '10px', color: '#64748B', marginTop: '2px' }}
          >
            3D World Pos: ({hoveredPort.worldPosMm.x}mm,{' '}
            {hoveredPort.worldPosMm.y}mm, {hoveredPort.worldPosMm.z}mm)
          </div>
        </div>
      )}
    </div>
  );
}
