import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  EIA_310_SPECS,
  MM_PER_U,
  isPowerCableType,
  type ComputedDeviceGeometry,
  type SerializedRackScene,
} from '@rack-mcp/core-domain';
import type {
  CableFilterMode,
  CameraPresetMode,
  HoveredPortInfo,
} from '../../state/useRackState.js';
import { RackFrame3D } from './RackFrame3D.js';
import { MountedDevice3D } from './MountedDevice3D.js';
import { CableTube3D } from './CableTube3D.js';

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
          'radial-gradient(circle at 50% 35%, #131c31 0%, #090d16 75%)',
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
          <ambientLight intensity={0.75} />
          <directionalLight position={[320, 620, -480]} intensity={1.35} />
          <directionalLight position={[-280, 420, 620]} intensity={0.95} />
          <pointLight position={[panelWidthMm / 2, totalHeightMm / 2, -120]} intensity={0.6} color="#38BDF8" />

          <CameraPresetController
            preset={cameraPreset}
            center={center}
            panelWidthMm={panelWidthMm}
            totalHeightMm={totalHeightMm}
            railDepthMm={railDepthMm}
          />

          {/* Reference Floor Grid in Millimeters */}
          <gridHelper
            args={[1200, 24, '#1E293B', '#0F172A']}
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
              xrayMode={xrayMode}
              explodeZMm={explodeZMm}
              showClearanceBoxes={showClearanceBoxes}
              isSelected={selectedDeviceId === dev.instance_id}
              onSelectDevice={(id) => onSelectDevice(id)}
              onHoverPort={onHoverPort}
            />
          ))}

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
