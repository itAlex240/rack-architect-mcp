import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import type {
  CableConnection,
  ComputedPortGeometry,
  ExternalEndpoint,
} from '@rack-mcp/core-domain';
import type { HoveredPortInfo } from '../../state/useRackState.js';

export interface PortMesh3DProps {
  readonly port: ComputedPortGeometry;
  readonly cables: readonly CableConnection[];
  readonly externalEndpoints?: readonly ExternalEndpoint[];
  readonly faceSurfaceZMm?: number;
  readonly explodeOffsetZMm: number;
  readonly isHighlighted: boolean;
  readonly onHoverPort: (info: HoveredPortInfo | null) => void;
}

function getPortBoxSizeMm(connectorType: ComputedPortGeometry['connector_type']): {
  readonly w: number;
  readonly h: number;
  readonly d: number;
  readonly color: string;
} {
  switch (connectorType) {
    case 'rj45':
    case 'rj45-serial-console':
      return { w: 12.2, h: 10.0, d: 3.2, color: '#0F172A' };
    case 'sfp-plus':
      return { w: 14.5, h: 9.2, d: 3.6, color: '#334155' };
    case 'iec-c13':
    case 'iec-c14':
      return { w: 24.0, h: 16.0, d: 3.8, color: '#111827' };
    case 'schuko-cee7':
      return { w: 34.0, h: 34.0, d: 4.2, color: '#1E293B' };
    case 'usb-c':
      return { w: 9.0, h: 3.6, d: 2.6, color: '#475569' };
    case 'usb-a':
      return { w: 12.5, h: 5.5, d: 2.8, color: '#1E3A8A' };
    case 'dc-5525':
      return { w: 8.5, h: 8.5, d: 3.0, color: '#1F2937' };
    case 'audio-35mm':
    default:
      return { w: 6.0, h: 6.0, d: 2.5, color: '#3F6212' };
  }
}

/**
 * Renders a 3D port socket mesh extruded `1.8 mm` along `world_normal` (`-Z` front, `+Z` rear)
 * to eliminate Z-fighting with the device faceplate, complete with RJ45 link/PoE LEDs.
 */
export function PortMesh3D({
  port,
  cables,
  externalEndpoints = [],
  faceSurfaceZMm,
  explodeOffsetZMm,
  isHighlighted,
  onHoverPort,
}: PortMesh3DProps) {
  const size = useMemo(
    () => getPortBoxSizeMm(port.connector_type),
    [port.connector_type],
  );

  const connectedCable = useMemo(
    () =>
      cables.find(
        (c) =>
          (c.from.instance_id === port.instance_id &&
            c.from.port_id === port.port_id &&
            (c.from.face ?? port.world_face) === port.world_face) ||
          (c.to.instance_id === port.instance_id &&
            c.to.port_id === port.port_id &&
            (c.to.face ?? port.world_face) === port.world_face),
      ),
    [cables, port.instance_id, port.port_id, port.world_face],
  );

  const connectedExternalEndpoint = useMemo(
    () =>
      externalEndpoints.find(
        (ext) =>
          ext.patch_panel_instance_id === port.instance_id &&
          ext.patch_panel_port_id === port.port_id,
      ),
    [externalEndpoints, port.instance_id, port.port_id],
  );

  const isOccupied = Boolean(connectedCable || connectedExternalEndpoint);

  const peerDescription = useMemo(() => {
    if (connectedCable) {
      const isFrom =
        connectedCable.from.instance_id === port.instance_id &&
        connectedCable.from.port_id === port.port_id;
      const peer = isFrom ? connectedCable.to : connectedCable.from;
      const extSuffix = connectedExternalEndpoint
        ? ` · 🏠 ${connectedExternalEndpoint.label}${connectedExternalEndpoint.room_or_zone ? ` (${connectedExternalEndpoint.room_or_zone})` : ''}`
        : '';
      return `${peer.instance_id}:${peer.port_id}${extSuffix}`;
    }
    if (connectedExternalEndpoint) {
      return `🏠 ${connectedExternalEndpoint.label}${connectedExternalEndpoint.room_or_zone ? ` (${connectedExternalEndpoint.room_or_zone})` : ''} [Rear Drop]`;
    }
    return undefined;
  }, [connectedCable, connectedExternalEndpoint, port.instance_id, port.port_id]);

  const hasPoe = useMemo(
    () =>
      port.capabilities.some((cap) => cap.startsWith('poe')) ||
      (connectedExternalEndpoint?.poe_draw_watts ?? 0) > 0,
    [connectedExternalEndpoint, port.capabilities],
  );

  // Project onto the outer faceplate surface so front_protrusion_mm never buries ports inside the chassis
  const normalZ = port.world_normal.z !== 0 ? port.world_normal.z : -1;
  const baseZ = faceSurfaceZMm ?? port.world_position.z;
  const cx = port.world_position.x;
  const cy = port.world_position.y;
  const cz = baseZ + explodeOffsetZMm + normalZ * (size.d * 0.45);

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHoverPort({
      instanceId: port.instance_id,
      portId: port.port_id,
      label: port.label,
      connectorType: port.connector_type,
      worldFace: port.world_face,
      worldPosMm: port.world_position,
      connectedCableId:
        connectedCable?.cable_id ?? connectedExternalEndpoint?.endpoint_id,
      peerDescription,
    });
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHoverPort(null);
  };

  return (
    <group
      position={[cx, cy, cz]}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      {/* Metallic Shielded Port Rim */}
      <mesh>
        <boxGeometry args={[size.w + 1.0, size.h + 1.0, size.d * 0.7]} />
        <meshStandardMaterial
          color={isHighlighted ? '#38BDF8' : '#52525B'}
          metalness={0.78}
          roughness={0.28}
        />
      </mesh>

      {/* Raised Port Housing */}
      <mesh position={[0, 0, normalZ * 0.35]}>
        <boxGeometry args={[size.w, size.h, size.d]} />
        <meshStandardMaterial
          color={isHighlighted ? '#38BDF8' : size.color}
          metalness={0.55}
          roughness={0.35}
          emissive={
            isHighlighted
              ? '#0284C7'
              : isOccupied
                ? '#0F172A'
                : '#000000'
          }
          emissiveIntensity={isHighlighted ? 0.5 : 0.15}
        />
      </mesh>

      {/* Inner Socket Cavity */}
      <mesh position={[0, 0, normalZ * (size.d * 0.52)]}>
        <boxGeometry args={[size.w * 0.74, size.h * 0.68, size.d * 0.48]} />
        <meshStandardMaterial color="#020617" roughness={0.9} metalness={0.08} />
      </mesh>

      {/* RJ45 / SFP+ Top Left Link LED & Right PoE LED */}
      {(port.connector_type === 'rj45' || port.connector_type === 'sfp-plus') && (
        <>
          <mesh
            position={[
              -size.w * 0.3,
              size.h * 0.34,
              normalZ * (size.d * 0.72),
            ]}
          >
            <boxGeometry args={[2.2, 1.4, 0.7]} />
            <meshStandardMaterial
              color={isOccupied ? '#22C55E' : '#334155'}
              emissive={isOccupied ? '#22C55E' : '#000000'}
              emissiveIntensity={isOccupied ? 0.95 : 0}
            />
          </mesh>
          <mesh
            position={[
              size.w * 0.3,
              size.h * 0.34,
              normalZ * (size.d * 0.72),
            ]}
          >
            <boxGeometry args={[2.2, 1.4, 0.7]} />
            <meshStandardMaterial
              color={
                isOccupied && hasPoe
                  ? '#F59E0B'
                  : isOccupied
                    ? '#10B981'
                    : '#334155'
              }
              emissive={
                isOccupied && hasPoe
                  ? '#F59E0B'
                  : isOccupied
                    ? '#10B981'
                    : '#000000'
              }
              emissiveIntensity={isOccupied ? 0.9 : 0}
            />
          </mesh>
        </>
      )}
    </group>
  );
}
