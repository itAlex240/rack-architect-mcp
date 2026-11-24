import { useEffect, useMemo, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { roundTenths } from '@rack-mcp/core-domain';

export type PrintBedPresetId =
  | 'none'
  | 'bambu-256'
  | 'prusa-mk4'
  | 'ender3'
  | 'a1-mini';

export interface PrintBedDimensions {
  readonly widthMm: number;
  readonly heightMm: number;
}

export interface PrintBedPreset extends PrintBedDimensions {
  readonly id: PrintBedPresetId;
  readonly label: string;
  readonly shortLabel: string;
}

export interface StlBoundsMm {
  readonly widthMm: number;
  readonly heightMm: number;
  readonly depthMm: number;
  readonly triangleCount: number;
}

export interface StlBedFitResult {
  readonly fits: boolean;
  readonly rotated: boolean;
}

export const STL_PRINT_BED_PRESETS: Readonly<
  Record<PrintBedPresetId, PrintBedPreset>
> = {
  none: {
    id: 'none',
    label: 'No Bed Overlay',
    shortLabel: 'None',
    widthMm: 0,
    heightMm: 0,
  },
  'bambu-256': {
    id: 'bambu-256',
    label: '256 × 256 mm (Bambu A1 / P1S / X1C)',
    shortLabel: '256×256',
    widthMm: 256,
    heightMm: 256,
  },
  'prusa-mk4': {
    id: 'prusa-mk4',
    label: '250 × 210 mm (Prusa MK4 / Core One)',
    shortLabel: '250×210',
    widthMm: 250,
    heightMm: 210,
  },
  ender3: {
    id: 'ender3',
    label: '220 × 220 mm (Ender 3 / Standard)',
    shortLabel: '220×220',
    widthMm: 220,
    heightMm: 220,
  },
  'a1-mini': {
    id: 'a1-mini',
    label: '180 × 180 mm (Bambu A1 mini)',
    shortLabel: '180×180',
    widthMm: 180,
    heightMm: 180,
  },
};

const STL_PRINT_BED_PRESET_LIST: readonly PrintBedPreset[] = Object.values(
  STL_PRINT_BED_PRESETS,
);

function isPrintBedPresetId(value: string): value is PrintBedPresetId {
  return Object.prototype.hasOwnProperty.call(STL_PRINT_BED_PRESETS, value);
}

export interface StlPreview3DProps {
  readonly stlAscii: string;
  readonly fallbackSvg?: string | undefined;
  readonly alt?: string | undefined;
  readonly heightPx?: number | undefined;
  readonly color?: string | undefined;
  readonly dataTestId?: string | undefined;
  readonly defaultBedPreset?: PrintBedPresetId | undefined;
  readonly showBedControls?: boolean | undefined;
}

function isWebGlSupported(): boolean {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return false;
  }
  if (typeof navigator !== 'undefined') {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes('jsdom') || ua.includes('happydom')) {
      return false;
    }
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

interface ParsedAsciiStl {
  readonly positions: Float32Array;
  readonly bounds: StlBoundsMm;
}

function parseAsciiStlVertices(stlAscii: string): ParsedAsciiStl {
  const coords: number[] = [];
  const lines = stlAscii.split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line || !line.startsWith('vertex')) continue;
    const parts = line.split(/\s+/);
    if (parts[0] !== 'vertex' || parts.length < 4) continue;
    const x = Number(parts[1]);
    const y = Number(parts[2]);
    const z = Number(parts[3]);
    if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
      coords.push(x, y, z);
    }
  }

  const usableFloats = coords.length - (coords.length % 9);
  const triangleCount = usableFloats / 9;
  if (usableFloats === 0) {
    return {
      positions: new Float32Array(0),
      bounds: { widthMm: 0, heightMm: 0, depthMm: 0, triangleCount: 0 },
    };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  const positions = new Float32Array(usableFloats);

  for (let i = 0; i < usableFloats; i += 3) {
    const x = coords[i];
    const y = coords[i + 1];
    const z = coords[i + 2];
    if (x === undefined || y === undefined || z === undefined) continue;
    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }

  return {
    positions,
    bounds: {
      widthMm: roundTenths(maxX - minX),
      heightMm: roundTenths(maxY - minY),
      depthMm: roundTenths(maxZ - minZ),
      triangleCount,
    },
  };
}

/**
 * Measures the axis-aligned bounding box extents (in mm) and triangle count of an ASCII `.stl` solid.
 */
export function measureAsciiStlBoundsMm(stlAscii: string): StlBoundsMm {
  return parseAsciiStlVertices(stlAscii).bounds;
}

/**
 * Checks whether a face-down STL footprint (`widthMm × heightMm`) fits inside a 3D printer build plate
 * in either `0°` or `90°` XY orientation.
 */
export function checkStlFitsPrintBed(
  bounds: Pick<StlBoundsMm, 'widthMm' | 'heightMm'>,
  bed: PrintBedDimensions | PrintBedPresetId,
): StlBedFitResult {
  const resolvedBed =
    typeof bed === 'string' ? STL_PRINT_BED_PRESETS[bed] : bed;
  if (
    resolvedBed.widthMm <= 0 ||
    resolvedBed.heightMm <= 0 ||
    bounds.widthMm <= 0 ||
    bounds.heightMm <= 0
  ) {
    return { fits: false, rotated: false };
  }
  const fitsNormal =
    bounds.widthMm <= resolvedBed.widthMm &&
    bounds.heightMm <= resolvedBed.heightMm;
  if (fitsNormal) {
    return { fits: true, rotated: false };
  }
  const fitsRotated =
    bounds.heightMm <= resolvedBed.widthMm &&
    bounds.widthMm <= resolvedBed.heightMm;
  return { fits: fitsRotated, rotated: fitsRotated };
}

/**
 * Parses an ASCII `.stl` solid into a centered Three.js `BufferGeometry` with computed vertex normals.
 */
export function parseAsciiStlToBufferGeometry(
  stlAscii: string,
): THREE.BufferGeometry {
  const { positions } = parseAsciiStlVertices(stlAscii);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  if (positions.length > 0) {
    geometry.center();
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
  }
  return geometry;
}

function PrintBedOverlay3D({
  plateWidthMm,
  plateDepthMm,
  surfaceY,
  fits,
}: {
  readonly plateWidthMm: number;
  readonly plateDepthMm: number;
  readonly surfaceY: number;
  readonly fits: boolean;
}) {
  const { plateGeometry, gridGeometry, axisGeometry, borderGeometry } =
    useMemo(() => {
      const halfW = plateWidthMm / 2;
      const halfD = plateDepthMm / 2;

      const plate = new THREE.BoxGeometry(plateWidthMm, 1.2, plateDepthMm);

      const gridVerts: number[] = [];
      const stepMm = 20;
      const gridY = 0.04;
      for (let x = stepMm; x < halfW - 0.1; x += stepMm) {
        gridVerts.push(x, gridY, -halfD, x, gridY, halfD);
        gridVerts.push(-x, gridY, -halfD, -x, gridY, halfD);
      }
      for (let z = stepMm; z < halfD - 0.1; z += stepMm) {
        gridVerts.push(-halfW, gridY, z, halfW, gridY, z);
        gridVerts.push(-halfW, gridY, -z, halfW, gridY, -z);
      }
      const grid = new THREE.BufferGeometry();
      grid.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(gridVerts, 3),
      );

      const axisY = 0.06;
      const axis = new THREE.BufferGeometry();
      axis.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          [
            0, axisY, -halfD, 0, axisY, halfD,
            -halfW, axisY, 0, halfW, axisY, 0,
          ],
          3,
        ),
      );

      const borderY = 0.1;
      const border = new THREE.BufferGeometry();
      border.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(
          [
            -halfW, borderY, -halfD, halfW, borderY, -halfD,
            halfW, borderY, -halfD, halfW, borderY, halfD,
            halfW, borderY, halfD, -halfW, borderY, halfD,
            -halfW, borderY, halfD, -halfW, borderY, -halfD,
          ],
          3,
        ),
      );

      return {
        plateGeometry: plate,
        gridGeometry: grid,
        axisGeometry: axis,
        borderGeometry: border,
      };
    }, [plateWidthMm, plateDepthMm]);

  useEffect(() => {
    return () => {
      plateGeometry.dispose();
      gridGeometry.dispose();
      axisGeometry.dispose();
      borderGeometry.dispose();
    };
  }, [plateGeometry, gridGeometry, axisGeometry, borderGeometry]);

  return (
    <group position={[0, surfaceY, 0]}>
      <mesh geometry={plateGeometry} position={[0, -0.6, 0]}>
        <meshStandardMaterial
          color={fits ? '#141418' : '#1b1214'}
          metalness={0.22}
          roughness={0.78}
        />
      </mesh>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color="#27272A" />
      </lineSegments>
      <lineSegments geometry={axisGeometry}>
        <lineBasicMaterial color="#3F3F46" />
      </lineSegments>
      <lineSegments geometry={borderGeometry}>
        <lineBasicMaterial color={fits ? '#10B981' : '#EF4444'} />
      </lineSegments>
    </group>
  );
}

function StlMeshScene({
  stlAscii,
  color,
  bounds,
  bedPreset,
  fitResult,
}: {
  readonly stlAscii: string;
  readonly color: string;
  readonly bounds: StlBoundsMm;
  readonly bedPreset: PrintBedPresetId;
  readonly fitResult: StlBedFitResult | null;
}) {
  const { camera } = useThree();
  const geometry = useMemo(
    () => parseAsciiStlToBufferGeometry(stlAscii),
    [stlAscii],
  );

  const activeBed =
    bedPreset !== 'none' ? STL_PRINT_BED_PRESETS[bedPreset] : null;
  const hasBed = activeBed !== null && activeBed.widthMm > 0;
  const rotatedOnBed = fitResult?.rotated === true;
  const plateWidthMm =
    activeBed !== null
      ? rotatedOnBed
        ? activeBed.heightMm
        : activeBed.widthMm
      : 0;
  const plateDepthMm =
    activeBed !== null
      ? rotatedOnBed
        ? activeBed.widthMm
        : activeBed.heightMm
      : 0;

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useEffect(() => {
    const meshRadius = geometry.boundingSphere?.radius ?? 80;
    const bedRadius = hasBed
      ? Math.hypot(plateWidthMm / 2, plateDepthMm / 2)
      : 0;
    const effectiveRadius = Math.max(meshRadius, bedRadius * 0.88);
    const dist = Math.max(90, effectiveRadius * 2.5);
    if (hasBed) {
      camera.position.set(dist * 0.62, dist * 0.62, dist * 0.82);
    } else {
      camera.position.set(dist * 0.72, dist * 0.42, dist * 0.85);
    }
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, geometry, hasBed, plateWidthMm, plateDepthMm]);

  const bedSurfaceY = -bounds.depthMm / 2 - 0.2;

  return (
    <>
      <ambientLight intensity={0.95} />
      <directionalLight position={[180, 260, 220]} intensity={1.45} />
      <directionalLight position={[-180, -140, -180]} intensity={0.65} />
      <mesh
        geometry={geometry}
        rotation={hasBed ? [-Math.PI / 2, 0, 0] : [0, 0, 0]}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.18}
          roughness={0.42}
        />
      </mesh>
      {hasBed && (
        <PrintBedOverlay3D
          plateWidthMm={plateWidthMm}
          plateDepthMm={plateDepthMm}
          surfaceY={bedSurfaceY}
          fits={fitResult?.fits === true}
        />
      )}
      <OrbitControls makeDefault enableDamping dampingFactor={0.1} />
    </>
  );
}

/**
 * Interactive Three.js `.STL` preview widget with automatic JSDOM / headless WebGL SVG fallback
 * and an optional 3D printer build-plate fit overlay.
 */
export function StlPreview3D({
  stlAscii,
  fallbackSvg,
  alt = '3D STL Geometry Preview',
  heightPx = 156,
  color = '#60A5FA',
  dataTestId = 'stl-preview-3d',
  defaultBedPreset,
  showBedControls = true,
}: StlPreview3DProps) {
  const webGlAvailable = useMemo(() => isWebGlSupported(), []);
  const bounds = useMemo(() => measureAsciiStlBoundsMm(stlAscii), [stlAscii]);
  const initialBedPreset: PrintBedPresetId =
    defaultBedPreset ?? (showBedControls ? 'bambu-256' : 'none');
  const [bedPreset, setBedPreset] =
    useState<PrintBedPresetId>(initialBedPreset);

  const activeBed = STL_PRINT_BED_PRESETS[bedPreset];
  const fitResult = useMemo(
    () =>
      bedPreset !== 'none' && bounds.triangleCount > 0
        ? checkStlFitsPrintBed(bounds, activeBed)
        : null,
    [activeBed, bedPreset, bounds],
  );

  return (
    <div
      data-testid={dataTestId}
      data-triangles={bounds.triangleCount}
      data-bed-preset={bedPreset}
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
      {showBedControls && (
        <div
          data-testid="stl-bed-toolbar"
          style={{
            position: 'absolute',
            top: '6px',
            left: '6px',
            right: '6px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '6px',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        >
          <select
            data-testid="stl-bed-preset-select"
            aria-label="3D Print Bed Preset"
            className="mono"
            value={bedPreset}
            onChange={(e) => {
              const next = e.target.value;
              if (isPrintBedPresetId(next)) {
                setBedPreset(next);
              }
            }}
            style={{
              pointerEvents: 'auto',
              height: '22px',
              maxWidth: '175px',
              padding: '0 6px',
              borderRadius: '5px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(18, 18, 22, 0.9)',
              color: '#F4F4F5',
              fontSize: '10px',
              fontVariantNumeric: 'tabular-nums',
              colorScheme: 'dark',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            {STL_PRINT_BED_PRESET_LIST.map((preset) => (
              <option
                key={preset.id}
                value={preset.id}
                style={{ background: '#121216', color: '#F4F4F5' }}
              >
                {preset.label}
              </option>
            ))}
          </select>

          {bedPreset !== 'none' && fitResult !== null && (
            <span
              data-testid="stl-bed-fit-badge"
              className="mono"
              style={{
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 7px',
                borderRadius: '999px',
                fontSize: '10px',
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1.35,
                whiteSpace: 'nowrap',
                backdropFilter: 'blur(8px)',
                background: fitResult.fits
                  ? 'rgba(16, 185, 129, 0.14)'
                  : 'rgba(239, 68, 68, 0.15)',
                border: fitResult.fits
                  ? '1px solid rgba(16, 185, 129, 0.28)'
                  : '1px solid rgba(239, 68, 68, 0.3)',
                color: fitResult.fits ? '#6EE7B7' : '#FCA5A5',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: fitResult.fits ? '#10B981' : '#EF4444',
                }}
              />
              <span>
                {fitResult.fits
                  ? `Fits ${activeBed.shortLabel}${fitResult.rotated ? ' (90°)' : ''}`
                  : `Exceeds ${activeBed.shortLabel} — Split STL`}
                {' · '}
                {bounds.widthMm}×{bounds.heightMm} mm
              </span>
            </span>
          )}
        </div>
      )}

      {webGlAvailable && bounds.triangleCount > 0 ? (
        <Canvas
          camera={{ fov: 36, near: 0.5, far: 4000, position: [140, 90, 180] }}
        >
          <StlMeshScene
            stlAscii={stlAscii}
            color={color}
            bounds={bounds}
            bedPreset={bedPreset}
            fitResult={fitResult}
          />
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
          Watertight ASCII STL Mesh Ready ({bounds.triangleCount} triangles)
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
          fontVariantNumeric: 'tabular-nums',
          color: '#A1A1AA',
          pointerEvents: 'none',
        }}
      >
        3D STL • {bounds.triangleCount} tris
        {webGlAvailable ? ' • Drag to orbit' : ''}
      </span>
    </div>
  );
}
