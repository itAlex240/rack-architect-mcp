import {
  EIA_310_SPECS,
  MM_PER_U,
  U_HOLE_OFFSETS_MM,
  type RackConfig,
} from '@rack-mcp/core-domain';

export interface RackFrame3DProps {
  readonly rack: RackConfig;
  readonly xrayMode: boolean;
  readonly doorOpen: boolean;
}

/**
 * Renders the 3D EIA-310 Rack Enclosure Frame (`20x20mm` anodized aluminum posts,
 * vented top/bottom plates, 4 EIA-310 rails with square cage-nut markers, and hinged smoked-glass door).
 */
export function RackFrame3D({ rack, xrayMode, doorOpen }: RackFrame3DProps) {
  const spec = EIA_310_SPECS[rack.standard];
  const panelWidth = spec.W_panel;
  const railWidth = spec.X_aperture_min;
  const totalHeight = rack.u_height * MM_PER_U;
  const railDepth = rack.rail_depth_mm;
  const postSize = 20;
  const frameOpacity = xrayMode ? 0.15 : 1.0;

  const doorZ = -rack.front_door_clearance_mm;
  const doorHingeX = -postSize / 2;
  const doorAngleRad = doorOpen ? (-105 * Math.PI) / 180 : 0;

  return (
    <group>
      {/* 4 Vertical 20x20mm Anodized Aluminum Corner Extrusions */}
      {[
        [-postSize / 2, totalHeight / 2, -postSize / 2],
        [panelWidth + postSize / 2, totalHeight / 2, -postSize / 2],
        [-postSize / 2, totalHeight / 2, railDepth + postSize / 2],
        [
          panelWidth + postSize / 2,
          totalHeight / 2,
          railDepth + postSize / 2,
        ],
      ].map(([px, py, pz], idx) => (
        <mesh key={`post-${idx}`} position={[px!, py!, pz!]}>
          <boxGeometry args={[postSize, totalHeight + postSize * 2, postSize]} />
          <meshStandardMaterial
            color="#3F3F46"
            metalness={0.68}
            roughness={0.32}
            transparent={xrayMode}
            opacity={frameOpacity}
            depthWrite={!xrayMode}
          />
        </mesh>
      ))}

      {/* Top & Bottom Perforated Steel Enclosure Plates */}
      {[-postSize / 2, totalHeight + postSize / 2].map((py, idx) => (
        <mesh
          key={`plate-${idx}`}
          position={[panelWidth / 2, py, railDepth / 2]}
        >
          <boxGeometry
            args={[
              panelWidth + postSize * 2,
              postSize * 0.65,
              railDepth + postSize * 2,
            ]}
          />
          <meshStandardMaterial
            color="#27272A"
            metalness={0.58}
            roughness={0.42}
            transparent={xrayMode}
            opacity={frameOpacity}
            depthWrite={!xrayMode}
          />
        </mesh>
      ))}

      {/* 4 EIA-310 Vertical Mounting Rails */}
      {[
        [railWidth / 2, totalHeight / 2, 1.5],
        [panelWidth - railWidth / 2, totalHeight / 2, 1.5],
        [railWidth / 2, totalHeight / 2, railDepth - 1.5],
        [panelWidth - railWidth / 2, totalHeight / 2, railDepth - 1.5],
      ].map(([rx, ry, rz], idx) => (
        <mesh key={`rail-${idx}`} position={[rx!, ry!, rz!]}>
          <boxGeometry args={[railWidth, totalHeight, 3.0]} />
          <meshStandardMaterial
            color="#71717A"
            metalness={0.78}
            roughness={0.26}
            transparent={xrayMode}
            opacity={frameOpacity}
            depthWrite={!xrayMode}
          />
        </mesh>
      ))}

      {/* EIA-310 Cage-Nut Holes & U Boundary Tick Marks on Front Rails */}
      {Array.from({ length: rack.u_height }, (_, i) => i + 1).map((u) => {
        const uBottom = (u - 1) * MM_PER_U;
        return (
          <group key={`u-ticks-${u}`}>
            {/* U Divider Line across Front Left Rail */}
            <mesh position={[-postSize * 0.5, uBottom + MM_PER_U / 2, -0.5]}>
              <boxGeometry args={[10, 14, 2]} />
              <meshStandardMaterial color="#0EA5E9" roughness={0.4} />
            </mesh>
            {U_HOLE_OFFSETS_MM.map((holeOffset, hIdx) => (
              <group key={`hole-${u}-${hIdx}`}>
                <mesh
                  position={[railWidth / 2, uBottom + holeOffset, -0.2]}
                >
                  <boxGeometry args={[4.5, 4.5, 1.2]} />
                  <meshStandardMaterial color="#020617" />
                </mesh>
                <mesh
                  position={[
                    panelWidth - railWidth / 2,
                    uBottom + holeOffset,
                    -0.2,
                  ]}
                >
                  <boxGeometry args={[4.5, 4.5, 1.2]} />
                  <meshStandardMaterial color="#020617" />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Hinged Smoked-Glass Front Door (when enclosure_type !== 'open-frame') */}
      {rack.enclosure_type !== 'open-frame' && (
        <group
          position={[doorHingeX, totalHeight / 2, doorZ]}
          rotation={[0, doorAngleRad, 0]}
        >
          <mesh position={[(panelWidth + postSize) / 2, 0, 0]}>
            <boxGeometry args={[panelWidth + postSize, totalHeight, 4.0]} />
            <meshPhysicalMaterial
              color="#38BDF8"
              transparent
              opacity={xrayMode ? 0.05 : 0.16}
              roughness={0.1}
              metalness={0.1}
              transmission={0.65}
              depthWrite={false}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
