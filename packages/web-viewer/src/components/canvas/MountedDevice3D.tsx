import type { ThreeEvent } from '@react-three/fiber';
import {
  EIA_310_SPECS,
  type CableConnection,
  type ComputedDeviceGeometry,
  type RackStandardSlug,
} from '@rack-mcp/core-domain';
import type { HoveredPortInfo } from '../../state/useRackState.js';
import { computeDeviceExplodeOffsetZMm } from './CableTube3D.js';
import { PortMesh3D } from './PortMesh3D.js';

export interface MountedDevice3DProps {
  readonly device: ComputedDeviceGeometry;
  readonly rackStandard: RackStandardSlug;
  readonly cables: readonly CableConnection[];
  readonly xrayMode: boolean;
  readonly explodeZMm: number;
  readonly showClearanceBoxes: boolean;
  readonly isSelected: boolean;
  readonly onSelectDevice: (instanceId: string) => void;
  readonly onHoverPort: (info: HoveredPortInfo | null) => void;
}

function getMaterialParams(preset: string): {
  readonly metalness: number;
  readonly roughness: number;
} {
  switch (preset) {
    case 'coated-aluminum':
      return { metalness: 0.65, roughness: 0.28 };
    case 'matte-black-steel':
      return { metalness: 0.48, roughness: 0.45 };
    case '3d-printed-petg':
    case '3d-printed-asa':
    case '3d-printed-pla':
      return { metalness: 0.08, roughness: 0.72 };
    default:
      return { metalness: 0.35, roughness: 0.5 };
  }
}

/**
 * Renders a 3D rackmount device, modular carrier, or child sub-module
 * with PBR materials, mounting ears, rack screws, OLED displays, and raised 3D ports.
 */
export function MountedDevice3D({
  device,
  rackStandard,
  cables,
  xrayMode,
  explodeZMm,
  showClearanceBoxes,
  isSelected,
  onSelectDevice,
  onHoverPort,
}: MountedDevice3DProps) {
  const spec = EIA_310_SPECS[rackStandard];
  const offsetZ = computeDeviceExplodeOffsetZMm(device, explodeZMm);

  const box = device.chassis_box;
  const w = box.max.x - box.min.x;
  const h = box.max.y - box.min.y;
  const d = box.max.z - box.min.z;
  const cx = (box.min.x + box.max.x) / 2;
  const cy = (box.min.y + box.max.y) / 2;
  const cz = (box.min.z + box.max.z) / 2 + offsetZ;

  const matParams = getMaterialParams(device.blueprint.visuals.material_preset);
  const chassisColor = device.blueprint.visuals.chassis_color_hex;
  const hasEars =
    device.mount_target === 'rack-unit' &&
    device.blueprint.geometry.ear_mount_style !== 'none';
  const earWidth = spec.X_aperture_min;
  const earThickness = 3.2;
  const earZ =
    (device.face === 'front' ? box.min.z + earThickness / 2 : box.max.z - earThickness / 2) +
    offsetZ;

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectDevice(device.instance_id);
  };

  return (
    <group>
      {/* Main Device Chassis */}
      <mesh position={[cx, cy, cz]} onClick={handleClick}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={chassisColor}
          metalness={matParams.metalness}
          roughness={matParams.roughness}
          emissive={isSelected ? '#0284C7' : '#000000'}
          emissiveIntensity={isSelected ? 0.32 : 0}
          transparent={xrayMode}
          opacity={xrayMode ? 0.15 : 1.0}
          depthWrite={!xrayMode}
        />
      </mesh>

      {/* Selection Wireframe Outline */}
      {isSelected && (
        <mesh position={[cx, cy, cz]}>
          <boxGeometry args={[w + 1.5, h + 1.5, d + 1.5]} />
          <meshBasicMaterial color="#38BDF8" wireframe />
        </mesh>
      )}

      {/* Left & Right Mounting Ears + 3D Rack Screws */}
      {hasEars && (
        <>
          <mesh position={[earWidth / 2, cy, earZ]} onClick={handleClick}>
            <boxGeometry args={[earWidth, h, earThickness]} />
            <meshStandardMaterial
              color={chassisColor}
              metalness={matParams.metalness}
              roughness={matParams.roughness}
              transparent={xrayMode}
              opacity={xrayMode ? 0.15 : 1.0}
              depthWrite={!xrayMode}
            />
          </mesh>
          <mesh
            position={[spec.W_panel - earWidth / 2, cy, earZ]}
            onClick={handleClick}
          >
            <boxGeometry args={[earWidth, h, earThickness]} />
            <meshStandardMaterial
              color={chassisColor}
              metalness={matParams.metalness}
              roughness={matParams.roughness}
              transparent={xrayMode}
              opacity={xrayMode ? 0.15 : 1.0}
              depthWrite={!xrayMode}
            />
          </mesh>
          {/* 4 Metallic Rack Screws */}
          {[earWidth / 2, spec.W_panel - earWidth / 2].map((sx) =>
            [box.min.y + 6.35, box.max.y - 6.35].map((sy) => (
              <mesh
                key={`${sx}-${sy}`}
                position={[
                  sx,
                  sy,
                  earZ + (device.face === 'front' ? -2.0 : 2.0),
                ]}
                rotation={[Math.PI / 2, 0, 0]}
              >
                <cylinderGeometry args={[2.8, 2.8, 2.2, 12]} />
                <meshStandardMaterial
                  color="#E2E8F0"
                  metalness={0.85}
                  roughness={0.2}
                />
              </mesh>
            )),
          )}
        </>
      )}

      {/* Glowing Cyan OLED Display (e.g., Ubiquiti Switch / UCG-Max / CyberPower UPS) */}
      {device.blueprint.visuals.has_oled_display && (
        <mesh
          position={[
            box.min.x + Math.min(22, w * 0.2),
            cy,
            (device.face === 'front' ? box.min.z - 0.8 : box.max.z + 0.8) +
              offsetZ,
          ]}
        >
          <boxGeometry args={[18, Math.min(14, h * 0.42), 1.4]} />
          <meshStandardMaterial
            color="#0EA5E9"
            emissive="#38BDF8"
            emissiveIntensity={0.95}
            roughness={0.15}
          />
        </mesh>
      )}

      {/* Brush-Panel Bristle Slot */}
      {device.blueprint.category === 'brush-panel' && (
        <mesh
          position={[
            cx,
            cy,
            (device.face === 'front' ? box.min.z - 0.6 : box.max.z + 0.6) +
              offsetZ,
          ]}
        >
          <boxGeometry args={[w - 22, h - 14, 2.2]} />
          <meshStandardMaterial color="#020617" roughness={0.95} />
        </mesh>
      )}

      {/* Optional Plug Clearance Box (`B_clearance`) Wireframe */}
      {showClearanceBoxes && device.plug_clearance_box && (
        <mesh
          position={[
            (device.plug_clearance_box.min.x +
              device.plug_clearance_box.max.x) /
              2,
            (device.plug_clearance_box.min.y +
              device.plug_clearance_box.max.y) /
              2,
            (device.plug_clearance_box.min.z +
              device.plug_clearance_box.max.z) /
              2 +
              offsetZ,
          ]}
        >
          <boxGeometry
            args={[
              device.plug_clearance_box.max.x -
                device.plug_clearance_box.min.x,
              device.plug_clearance_box.max.y -
                device.plug_clearance_box.min.y,
              device.plug_clearance_box.max.z -
                device.plug_clearance_box.min.z,
            ]}
          />
          <meshBasicMaterial color="#F59E0B" wireframe transparent opacity={0.75} />
        </mesh>
      )}

      {/* Raised 3D Ports (`1.8mm` extrusion along `world_normal`) */}
      {device.ports.map((port) => (
        <PortMesh3D
          key={`${device.instance_id}:${port.port_id}:${port.world_face}`}
          port={port}
          cables={cables}
          explodeOffsetZMm={offsetZ}
          isHighlighted={isSelected}
          onHoverPort={onHoverPort}
        />
      ))}
    </group>
  );
}
