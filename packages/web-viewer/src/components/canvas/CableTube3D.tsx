import { useMemo } from 'react';
import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import {
  isPowerCableType,
  type CableConnection,
  type ComputedCableRoute,
  type ComputedDeviceGeometry,
} from '@rack-mcp/core-domain';

export interface CableTube3DProps {
  readonly route: ComputedCableRoute;
  readonly cable: CableConnection;
  readonly devicesById: ReadonlyMap<string, ComputedDeviceGeometry>;
  readonly explodeZMm: number;
  readonly isHighlighted: boolean;
  readonly isDimmed: boolean;
  readonly onSelectCable: (cableId: string) => void;
}

export function computeDeviceExplodeOffsetZMm(
  dev: ComputedDeviceGeometry | undefined,
  explodeZMm: number,
): number {
  if (!dev || explodeZMm === 0) return 0;
  if (dev.face === 'rear') {
    return explodeZMm;
  }
  if (dev.mount_target === 'carrier-slot') {
    return explodeZMm * 0.25;
  }
  return -explodeZMm * 0.65;
}

/**
 * Renders a 3D Catmull-Rom Cable Tube (`TubeGeometry`, `radialSegments = 12`)
 * with modeled strain-relief Boot Sleeves at both `P_start` and `P_end` ports.
 */
export function CableTube3D({
  route,
  cable,
  devicesById,
  explodeZMm,
  isHighlighted,
  isDimmed,
  onSelectCable,
}: CableTube3DProps) {
  const isPower = isPowerCableType(cable.cable_type);
  const tubeRadiusMm = isPower ? 3.2 : 2.3;

  const fromDev = devicesById.get(cable.from.instance_id);
  const toDev = devicesById.get(cable.to.instance_id);
  const startOffsetZ = computeDeviceExplodeOffsetZMm(fromDev, explodeZMm);
  const endOffsetZ = computeDeviceExplodeOffsetZMm(toDev, explodeZMm);

  const { tubeGeo, startBootPos, startBootQuat, endBootPos, endBootQuat } =
    useMemo(() => {
      const pts = route.spline_points;
      const n = pts.length;
      const vectors = pts.map((p, idx) => {
        const t = n > 1 ? idx / (n - 1) : 0;
        const zShift = startOffsetZ * (1 - t) + endOffsetZ * t;
        return new THREE.Vector3(p.x, p.y, p.z + zShift);
      });

      const curve = new THREE.CatmullRomCurve3(
        vectors.length >= 2
          ? vectors
          : [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 10, 0)],
        false,
        'centripetal',
        0.5,
      );

      const geometry = new THREE.TubeGeometry(
        curve,
        64,
        tubeRadiusMm,
        12,
        false,
      );

      const pStart = vectors[0]!;
      const wp = route.waypoints;
      const dirStart =
        wp.length >= 2
          ? new THREE.Vector3(
              wp[1]!.x - wp[0]!.x,
              wp[1]!.y - wp[0]!.y,
              wp[1]!.z - wp[0]!.z,
            ).normalize()
          : new THREE.Vector3()
              .subVectors(vectors[Math.min(1, vectors.length - 1)]!, pStart)
              .normalize();
      if (dirStart.lengthSq() < 1e-6) {
        dirStart.set(0, 0, -1);
      }
      const qStart = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dirStart,
      );
      const posStart = pStart.clone().addScaledVector(dirStart, 4.5);

      const pEnd = vectors[vectors.length - 1]!;
      const dirEnd =
        wp.length >= 2
          ? new THREE.Vector3(
              wp[wp.length - 2]!.x - wp[wp.length - 1]!.x,
              wp[wp.length - 2]!.y - wp[wp.length - 1]!.y,
              wp[wp.length - 2]!.z - wp[wp.length - 1]!.z,
            ).normalize()
          : new THREE.Vector3()
              .subVectors(vectors[Math.max(0, vectors.length - 2)]!, pEnd)
              .normalize();
      if (dirEnd.lengthSq() < 1e-6) {
        dirEnd.set(0, 0, -1);
      }
      const qEnd = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        dirEnd,
      );
      const posEnd = pEnd.clone().addScaledVector(dirEnd, 4.5);

      return {
        tubeGeo: geometry,
        startBootPos: [posStart.x, posStart.y, posStart.z] as const,
        startBootQuat: qStart,
        endBootPos: [posEnd.x, posEnd.y, posEnd.z] as const,
        endBootQuat: qEnd,
      };
    }, [
      endOffsetZ,
      route.spline_points,
      route.waypoints,
      startOffsetZ,
      tubeRadiusMm,
    ]);

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelectCable(route.cable_id);
  };

  const opacity = isDimmed ? 0.2 : 1.0;

  return (
    <group onClick={handleClick}>
      {/* Main 3D Spline Cable Jacket */}
      <mesh geometry={tubeGeo}>
        <meshStandardMaterial
          color={cable.color_hex}
          roughness={0.42}
          metalness={0.12}
          emissive={isHighlighted ? cable.color_hex : '#000000'}
          emissiveIntensity={isHighlighted ? 0.45 : 0}
          transparent={isDimmed}
          opacity={opacity}
        />
      </mesh>

      {/* Start Strain-Relief Boot Cylinder */}
      <mesh position={startBootPos} quaternion={startBootQuat}>
        <cylinderGeometry
          args={[tubeRadiusMm * 1.15, tubeRadiusMm * 1.48, 10, 12]}
        />
        <meshStandardMaterial
          color={isHighlighted ? cable.color_hex : '#1E293B'}
          roughness={0.5}
          metalness={0.3}
          transparent={isDimmed}
          opacity={opacity}
        />
      </mesh>

      {/* End Strain-Relief Boot Cylinder */}
      <mesh position={endBootPos} quaternion={endBootQuat}>
        <cylinderGeometry
          args={[tubeRadiusMm * 1.15, tubeRadiusMm * 1.48, 10, 12]}
        />
        <meshStandardMaterial
          color={isHighlighted ? cable.color_hex : '#1E293B'}
          roughness={0.5}
          metalness={0.3}
          transparent={isDimmed}
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}
