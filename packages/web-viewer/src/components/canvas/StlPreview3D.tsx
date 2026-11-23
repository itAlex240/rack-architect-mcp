import { useEffect, useMemo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface StlPreview3DProps {
  readonly stlAscii: string;
  readonly fallbackSvg?: string | undefined;
  readonly alt?: string | undefined;
  readonly heightPx?: number | undefined;
  readonly color?: string | undefined;
  readonly dataTestId?: string | undefined;
}

function isWebGlSupported(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (
    typeof navigator !== 'undefined' &&
    navigator.userAgent.toLowerCase().includes('jsdom')
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

/**
 * Parses an ASCII `.stl` solid into a centered Three.js `BufferGeometry` with computed vertex normals.
 */
export function parseAsciiStlToBufferGeometry(
  stlAscii: string,
): THREE.BufferGeometry {
  const coords: number[] = [];
  const lines = stlAscii.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line || !line.startsWith('vertex')) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 4) continue;
    const x = Number(parts[1]);
    const y = Number(parts[2]);
    const z = Number(parts[3]);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      coords.push(x, y, z);
    }
  }

  const usableFloats = coords.length - (coords.length % 9);
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(
    usableFloats > 0 ? coords.slice(0, usableFloats) : [],
  );
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  if (usableFloats > 0) {
    geometry.center();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }
  return geometry;
}

function StlMeshScene({
  stlAscii,
  color,
}: {
  readonly stlAscii: string;
  readonly color: string;
}) {
  const { camera } = useThree();
  const geometry = useMemo(
    () => parseAsciiStlToBufferGeometry(stlAscii),
    [stlAscii],
  );

  useEffect(() => {
    const radius = geometry.boundingSphere?.radius ?? 80;
    const dist = Math.max(90, radius * 2.55);
    camera.position.set(dist * 0.72, dist * 0.42, dist * 0.85);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    return () => {
      geometry.dispose();
    };
  }, [camera, geometry]);

  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[180, 260, 220]} intensity={1.45} />
      <directionalLight position={[-180, -140, -180]} intensity={0.65} />
      <mesh geometry={geometry}>
        <meshStandardMaterial
          color={color}
          metalness={0.18}
          roughness={0.42}
        />
      </mesh>
      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
    </>
  );
}

/**
 * Interactive Three.js `.STL` preview widget with automatic JSDOM / headless WebGL SVG fallback.
 */
export function StlPreview3D({
  stlAscii,
  fallbackSvg,
  alt = '3D STL Geometry Preview',
  heightPx = 156,
  color = '#60A5FA',
  dataTestId = 'stl-preview-3d',
}: StlPreview3DProps) {
  const webGlAvailable = useMemo(() => isWebGlSupported(), []);
  const triangleCount = useMemo(() => {
    const matches = stlAscii.match(/\bfacet\s+normal\b/g);
    return matches ? matches.length : 0;
  }, [stlAscii]);

  return (
    <div
      data-testid={dataTestId}
      data-triangles={triangleCount}
      style={{
        position: 'relative',
        width: '100%',
        height: `${heightPx}px`,
        borderRadius: '7px',
        background: '#09090b',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {webGlAvailable && triangleCount > 0 ? (
        <Canvas camera={{ fov: 36, near: 0.5, far: 4000, position: [140, 90, 180] }}>
          <StlMeshScene stlAscii={stlAscii} color={color} />
        </Canvas>
      ) : fallbackSvg ? (
        <img
          src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(fallbackSvg)}`}
          alt={alt}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
            userSelect: 'none',
          }}
        />
      ) : (
        <div
          className="mono"
          style={{ fontSize: '11px', color: '#A1A1AA', textAlign: 'center' }}
        >
          Watertight ASCII STL Mesh Ready ({triangleCount} triangles)
        </div>
      )}

      <span
        className="mono"
        style={{
          position: 'absolute',
          right: '8px',
          bottom: '6px',
          padding: '2px 6px',
          borderRadius: '4px',
          background: 'rgba(18, 18, 22, 0.88)',
          border: '1px solid rgba(255, 255, 255, 0.09)',
          fontSize: '10px',
          color: '#A1A1AA',
          pointerEvents: 'none',
        }}
      >
        3D STL • {triangleCount} tris{webGlAvailable ? ' • Drag to orbit' : ''}
      </span>
    </div>
  );
}
