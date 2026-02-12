import type { ChairTransform } from "../types";
import * as THREE from "three"

function rectangleLikeLayout(
  count: number,
  tableWidth: number,
  tableLength: number,

): ChairTransform[] {
  const result: ChairTransform[] = [];
    const chairOffset = 1;
    const minChairGap = 0.75; 

  if (count <= 0) return result;

  // distribution logic
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;

  if (count === 2) {
    top = 1;
    bottom = 1;
  } else if (count === 4) {
    top = bottom = left = right = 1;
  } else {
    top = Math.floor(count / 2) - 1;
    bottom = top;

    const remaining = count - (top + bottom);
    left = Math.floor(remaining / 2);
    right = remaining - left;
  }

  const spacingTop = Math.max( tableWidth / (top + 1)  , minChairGap);
  console.log("spacing top ",spacingTop)
  const spacingBottom =Math.max( tableWidth / (bottom + 1)  , minChairGap)  ;
  const spacingLeft = tableLength / (left + 1) ;
  const spacingRight = tableLength / (right + 1);

  // top
// top
for (let i = 0; i < top; i++) {
  const totalWidth = (top - 1) * spacingTop;
  const startX = -totalWidth / 2;

  const x = startX + i * spacingTop;
  const z = tableLength / 2 + chairOffset;

  result.push({
    position: [x, 0, z -0.75],
    rotation: [0, Math.PI, 0],
  });
}


  // bottom
  for (let i = 0; i < bottom; i++) {
    const totalWidth = (top - 1) * spacingBottom;
    const startX = -totalWidth / 2;

    const x = startX + i * spacingBottom;
    const z = -tableLength / 2 - chairOffset;

    result.push({
      position: [x, 0, z + 0.75],
      rotation: [0, 0, 0],
    });
  }

  // left
  for (let i = 0; i < left; i++) {
    const z = -tableLength / 2 + spacingLeft * (i + 1);
    const x = (-tableWidth / 2 - chairOffset ) - 1;

    result.push({
      position: [x+1.8, 0, z],
      rotation: [0, Math.PI / 2, 0],
    });
  }

  // right
  for (let i = 0; i < right; i++) {
    const z = -tableLength / 2 + spacingRight * (i + 1);
    const x = tableWidth / 2 + chairOffset;

    result.push({
      position: [x - 0.75, 0, z],
      rotation: [0, -Math.PI / 2, 0],
    });
  }

  return result;
}

export function computeAngleLayout(
  count: number,
  tableWidth: number,
  tableLength: number,
  

): ChairTransform[] {
    const result: ChairTransform[] = [];
    if (count <= 0) return result;
    const chairOffset = 0.5
  const radiusX = tableWidth / 2 + chairOffset;
  const radiusZ = tableLength / 2 +chairOffset ;

  const step = (2 * Math.PI) / count;

  for (let i = 0; i < count; i++) {
    const angle = i * step;

    const x = Math.cos(angle) * radiusX;
    const z = Math.sin(angle) * radiusZ;

    // face toward center
    const rotationY = Math.atan2(-x,-z);

    result.push({
      position: [x, 0, z],
      rotation: [0, rotationY, 0],
    });
  }

  return result;
}

export function squareLayout(
  count: number,
  tableLength: number,
  tableWidth:number
): ChairTransform[] {
  const result: ChairTransform[] = [];
  const chairOffset = 1;
  const minChairGap = 0.75;

  if (count <= 0) return result;

  // distribution logic for square
  let top = 0;
  let bottom = 0;
  let left = 0;
  let right = 0;

  if (count === 2) {
    top = 1;
    bottom = 1;
  } 
  else if (count === 4) {
    top = bottom = left = right = 1;
  } 
  else if (count === 6) {
    top = bottom = 2;
    left = right = 1;
  } 
  else if (count === 8) {
    top = bottom = left = right = 2;
  }
  tableLength = tableWidth
  const tableSize = tableLength 

  const spacingTop = Math.max(tableSize / (top + 1), minChairGap);
  const spacingBottom = Math.max(tableSize / (bottom + 1), minChairGap);
  const spacingLeft = Math.max(tableSize / (left + 1), minChairGap);
  const spacingRight = Math.max(tableSize / (right + 1), minChairGap);

  // TOP
  for (let i = 0; i < top; i++) {
    const totalWidth = (top - 1) * spacingTop;
    const startX = -totalWidth / 2;

    const x = startX + i * spacingTop;
    const z = tableSize / 2 + chairOffset;

    result.push({
      position: [x, 0, z - 0.75],
      rotation: [0, Math.PI, 0],
    });
  }

  // BOTTOM
  for (let i = 0; i < bottom; i++) {
    const totalWidth = (bottom - 1) * spacingBottom;
    const startX = -totalWidth / 2;

    const x = startX + i * spacingBottom;
    const z = -tableSize / 2 - chairOffset;

    result.push({
      position: [x, 0, z + 0.8],
      rotation: [0, 0, 0],
    });
  }

  // LEFT
  for (let i = 0; i < left; i++) {
    const totalLength = (left - 1) * spacingLeft;
    const startZ = -totalLength / 2;

    const z = startZ + i * spacingLeft;
    const x = -tableSize / 2 - chairOffset;

    result.push({
      position: [x + 0.8, 0, z],
      rotation: [0, Math.PI / 2, 0],
    });
  }

  // RIGHT
  for (let i = 0; i < right; i++) {
    const totalLength = (right - 1) * spacingRight;
    const startZ = -totalLength / 2;

    const z = startZ + i * spacingRight;
    const x = tableSize / 2 + chairOffset;

    result.push({
      position: [x - 0.8, 0, z],
      rotation: [0, -Math.PI / 2, 0],
    });
  }

  return result;
}

export function ellipseLayout(
  count: number,
  tableWidth: number,
  tableLength: number
): ChairTransform[] {
  const result: ChairTransform[] = [];

  if (count <= 0) return result;

  const chairOffset = 0.25;
  const radiusX = tableWidth / 2 + chairOffset;
  const radiusZ = tableLength / 2 + chairOffset;
  const segments = Math.max(240, count * 80);

  // Sample the ellipse and distribute chairs by arc length.
  const points: THREE.Vector2[] = [];
  const cumulative: number[] = [];

  let totalPerimeter = 0;
  let prev = new THREE.Vector2(radiusX, 0);

  cumulative.push(0);
  points.push(prev.clone());

  for (let i = 1; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    const p = new THREE.Vector2(Math.cos(t) * radiusX, Math.sin(t) * radiusZ);

    totalPerimeter += p.distanceTo(prev);
    cumulative.push(totalPerimeter);
    points.push(p);

    prev = p;
  }

  for (let i = 0; i < count; i++) {
    const targetLength = ((i + 0.5) / count) * totalPerimeter;

    let index = 1;
    while (index < cumulative.length && cumulative[index] < targetLength) {
      index++;
    }

    const currIndex = Math.min(index, points.length - 1);
    const prevIndex = Math.max(currIndex - 1, 0);
    const segmentLength = cumulative[currIndex] - cumulative[prevIndex] || 1;
    const t = (targetLength - cumulative[prevIndex]) / segmentLength;
    const point = points[prevIndex].clone().lerp(points[currIndex], t);
    const rotationY = Math.atan2(-point.x, -point.y);

    result.push({
      position: [point.x, 0, point.y],
      rotation: [0, rotationY, 0],
    });
  }

  return result;
}
export function computeChairLayoutByShape(
  shape: string,
  count: number,
  tableWidth: number,
  tableLength: number,
) {
  switch (shape) {
    case "rectangle":
    case "capsule":
    case "oblong":
      return rectangleLikeLayout(
        count,
        tableWidth,
        tableLength,
      );

    case "round":
      return computeAngleLayout(
        count,
        tableWidth,
        tableLength,
      );

    case "square":
      return squareLayout(
        count,
        tableLength,
        tableWidth
      );

    case "oval":
      return ellipseLayout(
        count,
        tableWidth,
        tableLength
      );
  }
}
