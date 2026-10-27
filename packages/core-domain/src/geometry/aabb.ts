import { AABB_INTERSECTION_EPSILON_MM, roundMm } from './precision.js';
import type { BoundingBox3D, Vector3D } from './types.js';

export function vec3(x: number, y: number, z: number): Vector3D {
  return {
    x: roundMm(x),
    y: roundMm(y),
    z: roundMm(z)
  };
}

export function vec3Add(a: Vector3D, b: Vector3D): Vector3D {
  return vec3(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function vec3Sub(a: Vector3D, b: Vector3D): Vector3D {
  return vec3(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function vec3Scale(v: Vector3D, s: number): Vector3D {
  return vec3(v.x * s, v.y * s, v.z * s);
}

export function vec3Distance(a: Vector3D, b: Vector3D): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function createBoundingBox(a: Vector3D, b: Vector3D): BoundingBox3D {
  return {
    min: vec3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z)),
    max: vec3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z))
  };
}

export function boxCenter(box: BoundingBox3D): Vector3D {
  return vec3(
    (box.min.x + box.max.x) / 2,
    (box.min.y + box.max.y) / 2,
    (box.min.z + box.max.z) / 2
  );
}

export function boxDimensions(box: BoundingBox3D): Vector3D {
  return vec3(
    box.max.x - box.min.x,
    box.max.y - box.min.y,
    box.max.z - box.min.z
  );
}

/**
 * Checks whether two 3D Axis-Aligned Bounding Boxes strictly overlap (with a small epsilon tolerance
 * so touching faces at exact boundaries like U1 top = 44.45 and U2 bottom = 44.45 do NOT count as collision).
 */
export function boxesIntersect(
  a: BoundingBox3D,
  b: BoundingBox3D,
  epsilon = AABB_INTERSECTION_EPSILON_MM
): boolean {
  const overlapX = Math.min(a.max.x, b.max.x) - Math.max(a.min.x, b.min.x);
  const overlapY = Math.min(a.max.y, b.max.y) - Math.max(a.min.y, b.min.y);
  const overlapZ = Math.min(a.max.z, b.max.z) - Math.max(a.min.z, b.min.z);
  return overlapX > epsilon && overlapY > epsilon && overlapZ > epsilon;
}

/**
 * Computes the overlapping 3D intersection box of two AABBs, or null if they do not strictly intersect.
 */
export function getBoxIntersection(
  a: BoundingBox3D,
  b: BoundingBox3D,
  epsilon = AABB_INTERSECTION_EPSILON_MM
): BoundingBox3D | null {
  if (!boxesIntersect(a, b, epsilon)) {
    return null;
  }
  return {
    min: vec3(
      Math.max(a.min.x, b.min.x),
      Math.max(a.min.y, b.min.y),
      Math.max(a.min.z, b.min.z)
    ),
    max: vec3(
      Math.min(a.max.x, b.max.x),
      Math.min(a.max.y, b.max.y),
      Math.min(a.max.z, b.max.z)
    )
  };
}

/**
 * Computes the bounding box union of multiple AABBs.
 */
export function mergeBoundingBoxes(
  boxes: readonly BoundingBox3D[]
): BoundingBox3D | null {
  const first = boxes[0];
  if (!first) {
    return null;
  }
  let minX = first.min.x;
  let minY = first.min.y;
  let minZ = first.min.z;
  let maxX = first.max.x;
  let maxY = first.max.y;
  let maxZ = first.max.z;

  for (let i = 1; i < boxes.length; i++) {
    const b = boxes[i]!;
    if (b.min.x < minX) minX = b.min.x;
    if (b.min.y < minY) minY = b.min.y;
    if (b.min.z < minZ) minZ = b.min.z;
    if (b.max.x > maxX) maxX = b.max.x;
    if (b.max.y > maxY) maxY = b.max.y;
    if (b.max.z > maxZ) maxZ = b.max.z;
  }

  return {
    min: vec3(minX, minY, minZ),
    max: vec3(maxX, maxY, maxZ)
  };
}
