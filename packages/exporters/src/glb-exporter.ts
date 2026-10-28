import {
  EIA_310_SPECS,
  evaluateCentripetalCatmullRomSpline,
  vec3Add,
  vec3Scale,
  vec3Sub,
  type BoundingBox3D,
  type ComputedRackScene,
  type ConnectorType,
  type MaterialPreset,
  type Vector3D,
} from '@rack-mcp/core-domain';

/** Scale factor from internal millimeters (mm) to glTF 2.0 standard meters (m). */
const MM_TO_METERS = 0.001;

function vec3Normalize(v: Vector3D): Vector3D {
  const len = Math.hypot(v.x, v.y, v.z);
  if (len <= 1e-9) {
    return { x: 0, y: 1, z: 0 };
  }
  return { x: v.x / len, y: v.y / len, z: v.z / len };
}

function vec3Cross(a: Vector3D, b: Vector3D): Vector3D {
  return {
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  };
}

function vec3Dot(a: Vector3D, b: Vector3D): number {
  return a.x * b.x + a.y * b.y + a.z * b.z;
}

interface MeshGeometryData {
  readonly name: string;
  readonly materialIndex: number;
  readonly positions: Float32Array;
  readonly normals: Float32Array;
  readonly indices: Uint32Array;
  readonly minPos: readonly [number, number, number];
  readonly maxPos: readonly [number, number, number];
  readonly extras?: Record<string, unknown>;
}

interface GltfMaterialDef {
  readonly name: string;
  readonly alphaMode?: 'OPAQUE' | 'BLEND';
  readonly doubleSided?: boolean;
  readonly pbrMetallicRoughness: {
    readonly baseColorFactor: readonly [number, number, number, number];
    readonly metallicFactor: number;
    readonly roughnessFactor: number;
  };
}

function hexToRgba(
  hex: string,
  alpha = 1.0,
): readonly [number, number, number, number] {
  const clean = hex.replace(/#/g, '');
  if (clean.length !== 6) {
    return [0.5, 0.5, 0.5, alpha];
  }
  const r = Number.parseInt(clean.slice(0, 2), 16) / 255;
  const g = Number.parseInt(clean.slice(2, 4), 16) / 255;
  const b = Number.parseInt(clean.slice(4, 6), 16) / 255;
  return [
    Number(r.toFixed(4)),
    Number(g.toFixed(4)),
    Number(b.toFixed(4)),
    alpha,
  ];
}

function pbrFactorsForPreset(preset: MaterialPreset): {
  metallic: number;
  roughness: number;
} {
  switch (preset) {
    case 'coated-aluminum':
      return { metallic: 0.75, roughness: 0.35 };
    case 'matte-black-steel':
      return { metallic: 0.55, roughness: 0.65 };
    case '3d-printed-petg':
      return { metallic: 0.05, roughness: 0.55 };
    case '3d-printed-abs':
      return { metallic: 0.05, roughness: 0.7 };
    case 'polycarbonate':
      return { metallic: 0.1, roughness: 0.25 };
  }
}

function computeMinMax(positions: Float32Array): {
  minPos: readonly [number, number, number];
  maxPos: readonly [number, number, number];
} {
  let minX = Infinity;
  let minY = Infinity;
  let minZ = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let maxZ = -Infinity;

  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]!;
    const y = positions[i + 1]!;
    const z = positions[i + 2]!;
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }

  if (!Number.isFinite(minX)) {
    return { minPos: [0, 0, 0], maxPos: [0, 0, 0] };
  }
  return {
    minPos: [minX, minY, minZ],
    maxPos: [maxX, maxY, maxZ],
  };
}

/**
 * Builds a 24-vertex, 12-triangle axis-aligned 3D box mesh (`mode: 4 TRIANGLES`) in meters.
 */
function buildBoxMesh(
  name: string,
  boxMm: BoundingBox3D,
  materialIndex: number,
  extras?: Record<string, unknown>,
): MeshGeometryData {
  const x0 = boxMm.min.x * MM_TO_METERS;
  const y0 = boxMm.min.y * MM_TO_METERS;
  const z0 = boxMm.min.z * MM_TO_METERS;
  const x1 = boxMm.max.x * MM_TO_METERS;
  const y1 = boxMm.max.y * MM_TO_METERS;
  const z1 = boxMm.max.z * MM_TO_METERS;

  const positions = new Float32Array([
    // Front (-Z)
    x0, y0, z0,  x1, y0, z0,  x1, y1, z0,  x0, y1, z0,
    // Rear (+Z)
    x1, y0, z1,  x0, y0, z1,  x0, y1, z1,  x1, y1, z1,
    // Top (+Y)
    x0, y1, z0,  x1, y1, z0,  x1, y1, z1,  x0, y1, z1,
    // Bottom (-Y)
    x0, y0, z1,  x1, y0, z1,  x1, y0, z0,  x0, y0, z0,
    // Right (+X)
    x1, y0, z0,  x1, y0, z1,  x1, y1, z1,  x1, y1, z0,
    // Left (-X)
    x0, y0, z1,  x0, y0, z0,  x0, y1, z0,  x0, y1, z1,
  ]);

  const normals = new Float32Array([
    0, 0, -1,  0, 0, -1,  0, 0, -1,  0, 0, -1,
    0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
    0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
    0, -1, 0,  0, -1, 0,  0, -1, 0,  0, -1, 0,
    1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
    -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,
  ]);

  const indices = new Uint32Array(36);
  for (let f = 0; f < 6; f++) {
    const baseV = f * 4;
    const baseI = f * 6;
    indices[baseI] = baseV;
    indices[baseI + 1] = baseV + 1;
    indices[baseI + 2] = baseV + 2;
    indices[baseI + 3] = baseV;
    indices[baseI + 4] = baseV + 2;
    indices[baseI + 5] = baseV + 3;
  }

  const { minPos, maxPos } = computeMinMax(positions);
  return {
    name,
    materialIndex,
    positions,
    normals,
    indices,
    minPos,
    maxPos,
    ...(extras !== undefined ? { extras } : {}),
  };
}

/**
 * Extrudes an 8-sided cylindrical tube mesh (`mode: 4 TRIANGLES`) using a twist-free
 * Parallel Transport Frame (PTF) along `splinePointsMm`, with closed end-caps.
 */
function buildParallelTransportTubeMesh(
  name: string,
  splinePointsMm: readonly Vector3D[],
  radiusMm: number,
  materialIndex: number,
  extras?: Record<string, unknown>,
): MeshGeometryData {
  const radialSegments = 8;
  const ringCount = splinePointsMm.length;
  // Ring vertices + 2 center vertices for start/end caps
  const vertexCount = ringCount * radialSegments + 2;
  const sideTriangleCount = Math.max(0, (ringCount - 1) * radialSegments * 2);
  const capTriangleCount = radialSegments * 2;
  const totalTriangles = sideTriangleCount + capTriangleCount;

  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const indices = new Uint32Array(totalTriangles * 3);

  const rMeters = radiusMm * MM_TO_METERS;

  // Compute tangents at each spline point
  const tangents: Vector3D[] = [];
  for (let i = 0; i < ringCount; i++) {
    const prev = splinePointsMm[Math.max(0, i - 1)]!;
    const next = splinePointsMm[Math.min(ringCount - 1, i + 1)]!;
    tangents.push(vec3Normalize(vec3Sub(next, prev)));
  }

  // Initialize Parallel Transport Frame at i = 0
  const t0 = tangents[0]!;
  const arbitraryUp: Vector3D =
    Math.abs(t0.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 };
  let frameNormal = vec3Normalize(vec3Cross(t0, arbitraryUp));
  let frameBinormal = vec3Normalize(vec3Cross(t0, frameNormal));

  for (let i = 0; i < ringCount; i++) {
    if (i > 0) {
      const tPrev = tangents[i - 1]!;
      const tCurr = tangents[i]!;
      const axis = vec3Cross(tPrev, tCurr);
      const axisLen = Math.hypot(axis.x, axis.y, axis.z);
      if (axisLen > 1e-6) {
        const unitAxis = vec3Scale(axis, 1 / axisLen);
        const cosTheta = Math.max(-1, Math.min(1, vec3Dot(tPrev, tCurr)));
        const sinTheta = Math.sqrt(Math.max(0, 1 - cosTheta * cosTheta));
        // Rodrigues' rotation formula to transport frameNormal without torsion
        const term1 = vec3Scale(frameNormal, cosTheta);
        const term2 = vec3Scale(vec3Cross(unitAxis, frameNormal), sinTheta);
        const term3 = vec3Scale(
          unitAxis,
          vec3Dot(unitAxis, frameNormal) * (1 - cosTheta),
        );
        frameNormal = vec3Normalize(vec3Add(vec3Add(term1, term2), term3));
        frameBinormal = vec3Normalize(vec3Cross(tCurr, frameNormal));
      }
    }

    const pt = splinePointsMm[i]!;
    const cx = pt.x * MM_TO_METERS;
    const cy = pt.y * MM_TO_METERS;
    const cz = pt.z * MM_TO_METERS;

    for (let s = 0; s < radialSegments; s++) {
      const angle = (s / radialSegments) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const nx = frameNormal.x * cosA + frameBinormal.x * sinA;
      const ny = frameNormal.y * cosA + frameBinormal.y * sinA;
      const nz = frameNormal.z * cosA + frameBinormal.z * sinA;

      const vIdx = (i * radialSegments + s) * 3;
      positions[vIdx] = cx + nx * rMeters;
      positions[vIdx + 1] = cy + ny * rMeters;
      positions[vIdx + 2] = cz + nz * rMeters;

      normals[vIdx] = nx;
      normals[vIdx + 1] = ny;
      normals[vIdx + 2] = nz;
    }
  }

  // Start cap center vertex
  const startCapIdx = ringCount * radialSegments;
  const pStart = splinePointsMm[0]!;
  positions[startCapIdx * 3] = pStart.x * MM_TO_METERS;
  positions[startCapIdx * 3 + 1] = pStart.y * MM_TO_METERS;
  positions[startCapIdx * 3 + 2] = pStart.z * MM_TO_METERS;
  normals[startCapIdx * 3] = -t0.x;
  normals[startCapIdx * 3 + 1] = -t0.y;
  normals[startCapIdx * 3 + 2] = -t0.z;

  // End cap center vertex
  const endCapIdx = startCapIdx + 1;
  const pEnd = splinePointsMm[ringCount - 1]!;
  const tEnd = tangents[ringCount - 1]!;
  positions[endCapIdx * 3] = pEnd.x * MM_TO_METERS;
  positions[endCapIdx * 3 + 1] = pEnd.y * MM_TO_METERS;
  positions[endCapIdx * 3 + 2] = pEnd.z * MM_TO_METERS;
  normals[endCapIdx * 3] = tEnd.x;
  normals[endCapIdx * 3 + 1] = tEnd.y;
  normals[endCapIdx * 3 + 2] = tEnd.z;

  let idxOffset = 0;
  for (let i = 0; i < ringCount - 1; i++) {
    const ringA = i * radialSegments;
    const ringB = (i + 1) * radialSegments;
    for (let s = 0; s < radialSegments; s++) {
      const sNext = (s + 1) % radialSegments;
      const a0 = ringA + s;
      const a1 = ringA + sNext;
      const b0 = ringB + s;
      const b1 = ringB + sNext;

      indices[idxOffset++] = a0;
      indices[idxOffset++] = b0;
      indices[idxOffset++] = b1;

      indices[idxOffset++] = a0;
      indices[idxOffset++] = b1;
      indices[idxOffset++] = a1;
    }
  }

  // Start cap triangles
  for (let s = 0; s < radialSegments; s++) {
    const sNext = (s + 1) % radialSegments;
    indices[idxOffset++] = startCapIdx;
    indices[idxOffset++] = sNext;
    indices[idxOffset++] = s;
  }

  // End cap triangles
  const lastRingBase = (ringCount - 1) * radialSegments;
  for (let s = 0; s < radialSegments; s++) {
    const sNext = (s + 1) % radialSegments;
    indices[idxOffset++] = endCapIdx;
    indices[idxOffset++] = lastRingBase + s;
    indices[idxOffset++] = lastRingBase + sNext;
  }

  const { minPos, maxPos } = computeMinMax(positions);
  return {
    name,
    materialIndex,
    positions,
    normals,
    indices,
    minPos,
    maxPos,
    ...(extras !== undefined ? { extras } : {}),
  };
}

function getPortPbrColorAndFactors(
  connectorType: ConnectorType,
  isCoupler: boolean,
): { colorHex: string; metallic: number; roughness: number } {
  if (isCoupler) {
    return { colorHex: '#60A5FA', metallic: 0.65, roughness: 0.3 };
  }
  switch (connectorType) {
    case 'rj45':
    case 'rj45-serial-console':
      return { colorHex: '#D4AF37', metallic: 0.8, roughness: 0.25 };
    case 'sfp-plus':
      return { colorHex: '#CBD5E1', metallic: 0.85, roughness: 0.2 };
    case 'iec-c13':
    case 'iec-c14':
    case 'schuko-cee7':
      return { colorHex: '#1F2937', metallic: 0.15, roughness: 0.7 };
    case 'dc-5525':
      return { colorHex: '#FACC15', metallic: 0.7, roughness: 0.3 };
    case 'usb-c':
    case 'usb-a':
    case 'audio-35mm':
      return { colorHex: '#38BDF8', metallic: 0.6, roughness: 0.3 };
  }
}

/**
 * Generates a CAD-grade binary glTF 2.0 (`.glb`) 3D scene representation in standard meters (`1.0 = 1m`):
 * - `RackFrame` node group (4x `20x20mm` aluminum corner posts, top & bottom frame bars, 4x EIA-310 mounting rails, and smoked glass front door when `closed-glass-front`)
 * - `Device_<instance_id>` and `SubDevice_<instance_id>` nodes with Z-fighting prevention, rack ears, and glowing cyan OLED displays
 * - `Port_<instance_id>_<port_id>` nodes extruded by `1.8 mm` outward from the chassis face
 * - `Cable_<cable_id>` 8-sided Parallel Transport Frame tube meshes (`r = 3.2 mm`, `mode: 4 TRIANGLES`) + `r = 5.0 mm` connector boot sleeves at start and target ports
 */
export function generateGlbBinary(scene: ComputedRackScene): Uint8Array {
  const materials: GltfMaterialDef[] = [];
  const materialIndexByKey = new Map<string, number>();

  const getOrCreateMaterial = (
    name: string,
    colorHex: string,
    metallic: number,
    roughness: number,
    alpha = 1.0,
  ): number => {
    const key = `${colorHex.toUpperCase()}|${metallic}|${roughness}|${alpha}`;
    const existing = materialIndexByKey.get(key);
    if (existing !== undefined) {
      return existing;
    }
    const idx = materials.length;
    materials.push({
      name,
      ...(alpha < 1.0 ? { alphaMode: 'BLEND', doubleSided: true } : {}),
      pbrMetallicRoughness: {
        baseColorFactor:
          alpha < 1.0 && name === 'RackGlassFrontDoor'
            ? [0.15, 0.22, 0.3, 0.22]
            : hexToRgba(colorHex, alpha),
        metallicFactor: metallic,
        roughnessFactor: roughness,
      },
    });
    materialIndexByKey.set(key, idx);
    return idx;
  };

  const meshes: MeshGeometryData[] = [];
  const rackFrameMeshIndices: number[] = [];

  const pushMesh = (m: MeshGeometryData): number => {
    const idx = meshes.length;
    meshes.push(m);
    return idx;
  };

  // =========================================================================
  // 1. Detailed 3D Rack Enclosure Cage & Rails (`RackFrame`)
  // =========================================================================
  const spec = EIA_310_SPECS[scene.project.rack.standard];
  const aluProfileMatIdx = getOrCreateMaterial(
    'RackAluminum2020',
    '#27272A',
    0.75,
    0.4,
  );
  const railMatIdx = getOrCreateMaterial(
    'RackMountingRails',
    '#3F3F46',
    0.8,
    0.35,
  );
  const oledMatIdx = getOrCreateMaterial('CyanOledScreen', '#38BDF8', 0.1, 0.2);

  const railW = spec.X_aperture_min;
  const railThicknessZ = 10.0;
  const hMm = scene.geometry.total_height_mm;
  const dMm = scene.geometry.rail_depth_mm;
  const pW = scene.geometry.panel_width_mm;
  const postSize = 20.0;
  const zFrontCage = -scene.project.rack.front_door_clearance_mm;
  const zRearCage = dMm + scene.project.rack.rear_clearance_mm;

  // 4 Vertical 20x20mm Corner Extrusion Posts
  rackFrameMeshIndices.push(
    pushMesh(
      buildBoxMesh(
        'RackCornerPost_FL',
        {
          min: { x: -postSize, y: -postSize, z: zFrontCage },
          max: { x: 0, y: hMm + postSize, z: zFrontCage + postSize },
        },
        aluProfileMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackCornerPost_FR',
        {
          min: { x: pW, y: -postSize, z: zFrontCage },
          max: { x: pW + postSize, y: hMm + postSize, z: zFrontCage + postSize },
        },
        aluProfileMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackCornerPost_RL',
        {
          min: { x: -postSize, y: -postSize, z: zRearCage - postSize },
          max: { x: 0, y: hMm + postSize, z: zRearCage },
        },
        aluProfileMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackCornerPost_RR',
        {
          min: { x: pW, y: -postSize, z: zRearCage - postSize },
          max: { x: pW + postSize, y: hMm + postSize, z: zRearCage },
        },
        aluProfileMatIdx,
      ),
    ),
    // Bottom & Top Frame Crossbars
    pushMesh(
      buildBoxMesh(
        'RackBaseFrame',
        {
          min: { x: -postSize, y: -postSize, z: zFrontCage },
          max: { x: pW + postSize, y: 0, z: zRearCage },
        },
        aluProfileMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackRoofFrame',
        {
          min: { x: -postSize, y: hMm, z: zFrontCage },
          max: { x: pW + postSize, y: hMm + postSize, z: zRearCage },
        },
        aluProfileMatIdx,
      ),
    ),
    // 4 Vertical EIA-310 Mounting Rails
    pushMesh(
      buildBoxMesh(
        'RackRail_FL',
        { min: { x: 0, y: 0, z: 0 }, max: { x: railW, y: hMm, z: railThicknessZ } },
        railMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackRail_FR',
        {
          min: { x: pW - railW, y: 0, z: 0 },
          max: { x: pW, y: hMm, z: railThicknessZ },
        },
        railMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackRail_RL',
        {
          min: { x: 0, y: 0, z: dMm - railThicknessZ },
          max: { x: railW, y: hMm, z: dMm },
        },
        railMatIdx,
      ),
    ),
    pushMesh(
      buildBoxMesh(
        'RackRail_RR',
        {
          min: { x: pW - railW, y: 0, z: dMm - railThicknessZ },
          max: { x: pW, y: hMm, z: dMm },
        },
        railMatIdx,
      ),
    ),
  );

  // Smoked Glass Front Door when closed-glass-front
  if (scene.project.rack.enclosure_type === 'closed-glass-front') {
    const glassMatIdx = getOrCreateMaterial(
      'RackGlassFrontDoor',
      '#26384D',
      0.1,
      0.1,
      0.22,
    );
    rackFrameMeshIndices.push(
      pushMesh(
        buildBoxMesh(
          'RackGlassFrontDoorMesh',
          {
            min: { x: 0, y: 0, z: zFrontCage - 4.0 },
            max: { x: pW, y: hMm, z: zFrontCage },
          },
          glassMatIdx,
        ),
      ),
    );
  }

  // =========================================================================
  // 2. Mounted Devices (`Device_<id>`) & Sub-Modules (`SubDevice_<id>`) + Raised 3D Ports (`1.8 mm`)
  // =========================================================================
  const deviceNodeSpecs: Array<{
    readonly nodeName: string;
    readonly meshIndex: number;
    readonly childMeshIndices: number[];
    readonly extras: Record<string, unknown>;
  }> = [];

  for (const dev of scene.geometry.devices) {
    const isSubModule = dev.mount_target === 'carrier-slot';
    const nodeName = isSubModule
      ? `SubDevice_${dev.instance_id}`
      : `Device_${dev.instance_id}`;

    const pbr = pbrFactorsForPreset(dev.blueprint.visuals.material_preset);
    const matIdx = getOrCreateMaterial(
      `Mat_${dev.blueprint_slug}`,
      dev.blueprint.visuals.chassis_color_hex,
      pbr.metallic,
      pbr.roughness,
    );

    // Prevent Z-fighting between parent carrier and nested child sub-module by slight 0.4mm front relief
    const adjustedBox: BoundingBox3D = isSubModule
      ? {
          min: {
            x: dev.chassis_box.min.x + 0.2,
            y: dev.chassis_box.min.y + 0.2,
            z: dev.chassis_box.min.z - 0.4,
          },
          max: {
            x: dev.chassis_box.max.x - 0.2,
            y: dev.chassis_box.max.y - 0.2,
            z: dev.chassis_box.max.z,
          },
        }
      : dev.chassis_box;

    const mainMeshIdx = pushMesh(
      buildBoxMesh(nodeName, adjustedBox, matIdx, {
        instance_id: dev.instance_id,
        blueprint_slug: dev.blueprint_slug,
        mount_target: dev.mount_target,
        u_position: dev.u_position,
        face: dev.face,
      }),
    );

    const childMeshIndices: number[] = [];

    // Separate Rack Ear flanges for top-level rackmount units
    if (!isSubModule && dev.blueprint.geometry.ear_mount_style !== 'none') {
      const zEarFront = dev.face === 'front' ? -2.5 : dMm;
      const zEarRear = dev.face === 'front' ? 0.5 : dMm + 2.5;
      childMeshIndices.push(
        pushMesh(
          buildBoxMesh(
            `EarLeft_${dev.instance_id}`,
            {
              min: { x: 0, y: adjustedBox.min.y, z: zEarFront },
              max: { x: railW, y: adjustedBox.max.y, z: zEarRear },
            },
            matIdx,
          ),
        ),
        pushMesh(
          buildBoxMesh(
            `EarRight_${dev.instance_id}`,
            {
              min: { x: pW - railW, y: adjustedBox.min.y, z: zEarFront },
              max: { x: pW, y: adjustedBox.max.y, z: zEarRear },
            },
            matIdx,
          ),
        ),
      );
    }

    // Separate Raised OLED Display Mesh (`1.2 mm` relief) when `has_oled_display === true`
    if (dev.blueprint.visuals.has_oled_display) {
      const oledZ0 =
        dev.face === 'front'
          ? adjustedBox.min.z - 1.2
          : adjustedBox.max.z;
      const oledZ1 =
        dev.face === 'front'
          ? adjustedBox.min.z
          : adjustedBox.max.z + 1.2;
      childMeshIndices.push(
        pushMesh(
          buildBoxMesh(
            `OLED_${dev.instance_id}`,
            {
              min: {
                x: adjustedBox.min.x + 8.0,
                y: adjustedBox.max.y - 16.0,
                z: oledZ0,
              },
              max: {
                x: adjustedBox.min.x + 26.0,
                y: adjustedBox.max.y - 5.0,
                z: oledZ1,
              },
            },
            oledMatIdx,
          ),
        ),
      );
    }

    // 3D-Printed / Anodized Cover Panel Decorative Relief (`blank-panel` / `blanking-panel`)
    if (
      dev.blueprint.category === 'blank-panel' ||
      dev.blueprint.category === 'blanking-panel'
    ) {
      const patternMatIdx = getOrCreateMaterial(
        'CoverPanelReliefMat',
        '#3F3F46',
        0.38,
        0.45,
      );
      const patZ0 =
        dev.face === 'front' ? adjustedBox.min.z - 1.2 : adjustedBox.max.z;
      const patZ1 =
        dev.face === 'front' ? adjustedBox.min.z : adjustedBox.max.z + 1.2;
      const devW = adjustedBox.max.x - adjustedBox.min.x;
      const devH = adjustedBox.max.y - adjustedBox.min.y;
      const slug = dev.blueprint.slug;

      if (slug.includes('ribs')) {
        const ribCount = devW > 300 ? 18 : 10;
        const innerW = Math.max(20, devW - 30);
        const stepX = ribCount > 1 ? innerW / (ribCount - 1) : 0;
        for (let i = 0; i < ribCount; i++) {
          const rx = adjustedBox.min.x + 15 + i * stepX;
          childMeshIndices.push(
            pushMesh(
              buildBoxMesh(
                `CoverRib_${dev.instance_id}_${i}`,
                {
                  min: { x: rx - 1.6, y: adjustedBox.min.y + 6.5, z: patZ0 },
                  max: { x: rx + 1.6, y: adjustedBox.max.y - 6.5, z: patZ1 },
                },
                patternMatIdx,
              ),
            ),
          );
        }
      } else {
        const lineCount = devH > 60 ? 6 : 3;
        const innerH = Math.max(10, devH - 14);
        const stepY = lineCount > 1 ? innerH / (lineCount - 1) : 0;
        for (let i = 0; i < lineCount; i++) {
          const ly = adjustedBox.min.y + 7 + i * stepY;
          childMeshIndices.push(
            pushMesh(
              buildBoxMesh(
                `CoverLine_${dev.instance_id}_${i}`,
                {
                  min: { x: adjustedBox.min.x + 14, y: ly - 1.1, z: patZ0 },
                  max: { x: adjustedBox.max.x - 14, y: ly + 1.1, z: patZ1 },
                },
                patternMatIdx,
              ),
            ),
          );
        }
      }
    }

    // Raised 3D Ports (`1.8 mm` outward protrusion along `world_normal` to eliminate Z-fighting)
    for (const port of dev.ports) {
      const portPbr = getPortPbrColorAndFactors(
        port.connector_type,
        port.is_passthrough_coupler,
      );
      const portMatIdx = getOrCreateMaterial(
        `PortMat_${port.connector_type}_${port.is_passthrough_coupler ? 'coupler' : 'std'}`,
        portPbr.colorHex,
        portPbr.metallic,
        portPbr.roughness,
      );

      const px = port.world_position.x;
      const py = port.world_position.y;
      const pz = port.world_position.z;
      const nz = port.world_normal.z;
      const halfW =
        port.connector_type === 'iec-c13' ||
        port.connector_type === 'iec-c14' ||
        port.connector_type === 'schuko-cee7'
          ? 6.5
          : 4.8;
      const halfH = 4.0;

      // Extrude 1.8mm outward from the chassis surface
      const zStart = pz;
      const zEnd = pz + nz * 1.8;

      const portBox: BoundingBox3D = {
        min: {
          x: px - halfW,
          y: py - halfH,
          z: Math.min(zStart, zEnd),
        },
        max: {
          x: px + halfW,
          y: py + halfH,
          z: Math.max(zStart, zEnd),
        },
      };

      childMeshIndices.push(
        pushMesh(
          buildBoxMesh(
            `Port_${dev.instance_id}_${port.port_id}`,
            portBox,
            portMatIdx,
            {
              instance_id: dev.instance_id,
              port_id: port.port_id,
              connector_type: port.connector_type,
            },
          ),
        ),
      );
    }

    deviceNodeSpecs.push({
      nodeName,
      meshIndex: mainMeshIdx,
      childMeshIndices,
      extras: {
        instance_id: dev.instance_id,
        blueprint_slug: dev.blueprint_slug,
        u_position: dev.u_position,
        face: dev.face,
      },
    });
  }

  // =========================================================================
  // 3. 3D Parallel Transport Cable Tubes (`r = 3.2 mm`) & Boot Cylinders (`r = 5.0 mm`)
  // =========================================================================
  const bootMatIdx = getOrCreateMaterial('CableBootStrainRelief', '#18181B', 0.1, 0.8);
  const cableNodeSpecs: Array<{
    readonly nodeName: string;
    readonly tubeMeshIndex: number;
    readonly bootMeshIndices: number[];
    readonly extras: Record<string, unknown>;
  }> = [];

  for (const route of scene.cable_routes) {
    if (route.spline_points.length < 2) continue;
    const cableMatIdx = getOrCreateMaterial(
      `CableMat_${route.color_hex}`,
      route.color_hex,
      0.1,
      0.42,
    );

    const tubeMeshIdx = pushMesh(
      buildParallelTransportTubeMesh(
        `Cable_${route.cable_id}`,
        route.spline_points,
        3.2,
        cableMatIdx,
        {
          cable_id: route.cable_id,
          cable_type: route.cable_type,
          recommended_commercial_mm: route.recommended_commercial_mm,
        },
      ),
    );

    // Build start & end strain-relief boot cylinders (r = 5.0 mm) along the first & last 10mm segment
    const bootMeshIndices: number[] = [];
    if (route.waypoints.length >= 2) {
      const pStart = route.waypoints[0]!;
      const pStartExit = route.waypoints[1]!;
      bootMeshIndices.push(
        pushMesh(
          buildParallelTransportTubeMesh(
            `CableBootStart_${route.cable_id}`,
            [pStart, pStartExit],
            5.0,
            bootMatIdx,
          ),
        ),
      );

      const pEndExit = route.waypoints[route.waypoints.length - 2]!;
      const pEnd = route.waypoints[route.waypoints.length - 1]!;
      bootMeshIndices.push(
        pushMesh(
          buildParallelTransportTubeMesh(
            `CableBootEnd_${route.cable_id}`,
            [pEndExit, pEnd],
            5.0,
            bootMatIdx,
          ),
        ),
      );
    }

    cableNodeSpecs.push({
      nodeName: `Cable_${route.cable_id}`,
      tubeMeshIndex: tubeMeshIdx,
      bootMeshIndices,
      extras: {
        cable_id: route.cable_id,
        cable_type: route.cable_type,
        recommended_commercial_mm: route.recommended_commercial_mm,
      },
    });
  }

  // 3b. External Building & ISP Drop Tubes (`ExternalDrop_<endpoint_id>`) entering from Top-Rear / Bottom-Rear
  const externalEndpoints = scene.project.external_endpoints ?? [];
  if (externalEndpoints.length > 0) {
    const firstPpDev = scene.geometry.devices_by_id.get(
      externalEndpoints[0]?.patch_panel_instance_id ?? '',
    );
    const firstRearZ = (firstPpDev?.chassis_box.max.z ?? 35) + 2.2;
    const collarZ = Math.min(dMm - 22, Math.max(firstRearZ + 88, dMm * 0.56));
    const isBottomEntry =
      externalEndpoints[0]?.entry_position === 'bottom-rear';
    const collarY = isBottomEntry ? -3.0 : hMm + 3.0;
    const collarHalfW = Math.min(
      pW * 0.26,
      Math.max(35, externalEndpoints.length * 3.25 + 14),
    );
    rackFrameMeshIndices.push(
      pushMesh(
        buildBoxMesh(
          'ExternalConduitCollar',
          {
            min: {
              x: pW / 2 - collarHalfW,
              y: collarY - 5.0,
              z: collarZ - 14.0,
            },
            max: {
              x: pW / 2 + collarHalfW,
              y: collarY + 5.0,
              z: collarZ + 14.0,
            },
          },
          aluProfileMatIdx,
        ),
      ),
    );

    externalEndpoints.forEach((ext, idx) => {
      const ppDev = scene.geometry.devices_by_id.get(
        ext.patch_panel_instance_id,
      );
      if (!ppDev) return;
      const ppPort = ppDev.ports.find(
        (p) => p.port_id === ext.patch_panel_port_id,
      );
      if (!ppPort) return;

      const portX = ppPort.world_position.x;
      const portY = ppPort.world_position.y;
      const rearFaceZ = ppDev.chassis_box.max.z + 2.2;
      const conduitZ = Math.min(
        dMm - 22,
        Math.max(rearFaceZ + 88, dMm * 0.56),
      );
      const isBottom = ext.entry_position === 'bottom-rear';
      const entryY = isBottom ? -24.0 : hMm + 30.0;
      const collarPassY = isBottom ? 4.0 : hMm - 2.0;
      const combY = isBottom
        ? Math.max(8.0, portY - 9.5 - (idx % 3) * 2.0)
        : Math.min(hMm - 8.0, portY + 9.5 + (idx % 3) * 2.0);
      const spreadX =
        pW / 2 +
        (idx - (externalEndpoints.length - 1) / 2) *
          Math.min(8.0, (pW * 0.62) / Math.max(1, externalEndpoints.length));
      const dropZ = conduitZ + (idx % 2) * 4.5;
      const combZ = rearFaceZ + 30 + (idx % 4) * 5.0;

      const dropSplinePts = evaluateCentripetalCatmullRomSpline(
        [
          { x: spreadX, y: entryY, z: dropZ },
          { x: spreadX, y: collarPassY, z: dropZ },
          { x: spreadX, y: combY, z: dropZ },
          { x: spreadX, y: combY, z: combZ },
          { x: portX, y: combY, z: combZ },
          { x: portX, y: portY, z: rearFaceZ + 14 },
          { x: portX, y: portY, z: rearFaceZ },
        ],
        12,
      );

      const extMatIdx = getOrCreateMaterial(
        `ExtDropMat_${ext.color_hex}`,
        ext.color_hex,
        0.1,
        0.45,
      );
      const dropMeshIdx = pushMesh(
        buildParallelTransportTubeMesh(
          `ExternalDrop_${ext.endpoint_id}`,
          dropSplinePts,
          2.6,
          extMatIdx,
          {
            endpoint_id: ext.endpoint_id,
            label: ext.label,
            category: ext.category,
            poe_draw_watts: ext.poe_draw_watts,
          },
        ),
      );

      cableNodeSpecs.push({
        nodeName: `ExternalDrop_${ext.endpoint_id}`,
        tubeMeshIndex: dropMeshIdx,
        bootMeshIndices: [],
        extras: {
          endpoint_id: ext.endpoint_id,
          label: ext.label,
          category: ext.category,
          poe_draw_watts: ext.poe_draw_watts,
        },
      });
    });
  }

  // =========================================================================
  // 4. Pack Binary Buffer & Build Hierarchical glTF 2.0 Scene Graph
  // =========================================================================
  interface BufferViewRecord {
    readonly buffer: number;
    readonly byteOffset: number;
    readonly byteLength: number;
    readonly target: number;
  }

  interface AccessorRecord {
    readonly bufferView: number;
    readonly byteOffset: number;
    readonly componentType: number;
    readonly count: number;
    readonly type: 'VEC3' | 'SCALAR';
    readonly min?: readonly number[];
    readonly max?: readonly number[];
  }

  const bufferViews: BufferViewRecord[] = [];
  const accessors: AccessorRecord[] = [];
  const gltfMeshes: Array<{
    readonly name: string;
    readonly primitives: Array<{
      readonly attributes: { readonly POSITION: number; readonly NORMAL: number };
      readonly indices: number;
      readonly material: number;
      readonly mode: 4;
    }>;
    readonly extras?: Record<string, unknown>;
  }> = [];

  let totalBinBytes = 0;
  for (const m of meshes) {
    totalBinBytes +=
      m.positions.byteLength + m.normals.byteLength + m.indices.byteLength;
  }
  const paddedBinBytes = Math.ceil(totalBinBytes / 4) * 4;
  const binBuffer = new ArrayBuffer(paddedBinBytes);
  const binUint8 = new Uint8Array(binBuffer);

  let currentOffset = 0;
  for (let i = 0; i < meshes.length; i++) {
    const m = meshes[i]!;

    const posOffset = currentOffset;
    binUint8.set(
      new Uint8Array(
        m.positions.buffer,
        m.positions.byteOffset,
        m.positions.byteLength,
      ),
      posOffset,
    );
    currentOffset += m.positions.byteLength;
    const posBvIdx = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset: posOffset,
      byteLength: m.positions.byteLength,
      target: 34962,
    });
    const posAccIdx = accessors.length;
    accessors.push({
      bufferView: posBvIdx,
      byteOffset: 0,
      componentType: 5126,
      count: m.positions.length / 3,
      type: 'VEC3',
      min: m.minPos,
      max: m.maxPos,
    });

    const normOffset = currentOffset;
    binUint8.set(
      new Uint8Array(
        m.normals.buffer,
        m.normals.byteOffset,
        m.normals.byteLength,
      ),
      normOffset,
    );
    currentOffset += m.normals.byteLength;
    const normBvIdx = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset: normOffset,
      byteLength: m.normals.byteLength,
      target: 34962,
    });
    const normAccIdx = accessors.length;
    accessors.push({
      bufferView: normBvIdx,
      byteOffset: 0,
      componentType: 5126,
      count: m.normals.length / 3,
      type: 'VEC3',
    });

    const idxOffset = currentOffset;
    binUint8.set(
      new Uint8Array(
        m.indices.buffer,
        m.indices.byteOffset,
        m.indices.byteLength,
      ),
      idxOffset,
    );
    currentOffset += m.indices.byteLength;
    const idxBvIdx = bufferViews.length;
    bufferViews.push({
      buffer: 0,
      byteOffset: idxOffset,
      byteLength: m.indices.byteLength,
      target: 34963,
    });
    const idxAccIdx = accessors.length;
    accessors.push({
      bufferView: idxBvIdx,
      byteOffset: 0,
      componentType: 5125,
      count: m.indices.length,
      type: 'SCALAR',
    });

    gltfMeshes.push({
      name: m.name,
      primitives: [
        {
          attributes: {
            POSITION: posAccIdx,
            NORMAL: normAccIdx,
          },
          indices: idxAccIdx,
          material: m.materialIndex,
          mode: 4, // Explicit TRIANGLES mode (never LINE_STRIP)
        },
      ],
      ...(m.extras !== undefined ? { extras: m.extras } : {}),
    });
  }

  // Build hierarchical glTF nodes (`RackFrame`, `Device_<id>`, `SubDevice_<id>`, `Cable_<id>`)
  interface GltfNodeRecord {
    readonly name: string;
    readonly mesh?: number;
    readonly children?: readonly number[];
    readonly extras?: Record<string, unknown>;
  }

  const gltfNodes: GltfNodeRecord[] = [];
  const rootSceneNodeIndices: number[] = [];

  // 1. RackFrame group node + child nodes
  const rackChildNodeIndices: number[] = [];
  for (const mIdx of rackFrameMeshIndices) {
    const childNodeIdx = gltfNodes.length;
    gltfNodes.push({
      name: gltfMeshes[mIdx]!.name,
      mesh: mIdx,
    });
    rackChildNodeIndices.push(childNodeIdx);
  }
  const rackFrameNodeIdx = gltfNodes.length;
  gltfNodes.push({
    name: 'RackFrame',
    children: rackChildNodeIndices,
    extras: {
      panel_width_m: Number((pW * MM_TO_METERS).toFixed(4)),
      total_height_m: Number((hMm * MM_TO_METERS).toFixed(4)),
      rail_depth_m: Number((dMm * MM_TO_METERS).toFixed(4)),
    },
  });
  rootSceneNodeIndices.push(rackFrameNodeIdx);

  // 2. Device_<id> & SubDevice_<id> nodes
  for (const specItem of deviceNodeSpecs) {
    const subChildNodeIndices: number[] = [];
    for (const cMeshIdx of specItem.childMeshIndices) {
      const cNodeIdx = gltfNodes.length;
      gltfNodes.push({
        name: gltfMeshes[cMeshIdx]!.name,
        mesh: cMeshIdx,
      });
      subChildNodeIndices.push(cNodeIdx);
    }
    const devNodeIdx = gltfNodes.length;
    gltfNodes.push({
      name: specItem.nodeName,
      mesh: specItem.meshIndex,
      ...(subChildNodeIndices.length > 0
        ? { children: subChildNodeIndices }
        : {}),
      extras: specItem.extras,
    });
    rootSceneNodeIndices.push(devNodeIdx);
  }

  // 3. Cable_<id> nodes (with start/end boot cylinder child nodes)
  for (const cSpec of cableNodeSpecs) {
    const bootNodeIndices: number[] = [];
    for (const bMeshIdx of cSpec.bootMeshIndices) {
      const bNodeIdx = gltfNodes.length;
      gltfNodes.push({
        name: gltfMeshes[bMeshIdx]!.name,
        mesh: bMeshIdx,
      });
      bootNodeIndices.push(bNodeIdx);
    }
    const cableNodeIdx = gltfNodes.length;
    gltfNodes.push({
      name: cSpec.nodeName,
      mesh: cSpec.tubeMeshIndex,
      ...(bootNodeIndices.length > 0 ? { children: bootNodeIndices } : {}),
      extras: cSpec.extras,
    });
    rootSceneNodeIndices.push(cableNodeIdx);
  }

  const gltfJson = {
    asset: {
      version: '2.0',
      generator: '@rack-mcp/exporters glb-exporter (Meters, PTF Tubes)',
    },
    scene: 0,
    scenes: [
      {
        name: scene.project.project_name,
        nodes: rootSceneNodeIndices,
        extras: {
          units: 'meters',
          rack_standard: scene.project.rack.standard,
          u_height: scene.project.rack.u_height,
          validation_status: scene.validation.status,
        },
      },
    ],
    nodes: gltfNodes,
    meshes: gltfMeshes,
    materials,
    accessors,
    bufferViews,
    buffers: [
      {
        byteLength: paddedBinBytes,
      },
    ],
  };

  const jsonString = JSON.stringify(gltfJson);
  const encoder = new TextEncoder();
  const rawJsonBytes = encoder.encode(jsonString);
  const paddedJsonByteLength = Math.ceil(rawJsonBytes.byteLength / 4) * 4;
  const jsonChunkBytes = new Uint8Array(paddedJsonByteLength);
  jsonChunkBytes.fill(0x20);
  jsonChunkBytes.set(rawJsonBytes, 0);

  const totalGlbByteLength =
    12 + 8 + paddedJsonByteLength + 8 + paddedBinBytes;
  const glbBuffer = new ArrayBuffer(totalGlbByteLength);
  const view = new DataView(glbBuffer);
  const outBytes = new Uint8Array(glbBuffer);

  view.setUint32(0, 0x46546c67, true); // "glTF"
  view.setUint32(4, 2, true); // version 2
  view.setUint32(8, totalGlbByteLength, true);

  view.setUint32(12, paddedJsonByteLength, true);
  view.setUint32(16, 0x4e4f534a, true); // "JSON"
  outBytes.set(jsonChunkBytes, 20);

  const binChunkHeaderOffset = 20 + paddedJsonByteLength;
  view.setUint32(binChunkHeaderOffset, paddedBinBytes, true);
  view.setUint32(binChunkHeaderOffset + 4, 0x004e4942, true); // "BIN\0"
  outBytes.set(binUint8, binChunkHeaderOffset + 8);

  return outBytes;
}
