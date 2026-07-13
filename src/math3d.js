export const DEG = Math.PI / 180;

export const vec = (x, y, z) => ({ x, y, z });

export function normalize(v) {
  const length = Math.hypot(v.x, v.y, v.z) || 1;
  return vec(v.x / length, v.y / length, v.z / length);
}

export function axisVector(name) {
  if (name === "x") return vec(1, 0, 0);
  if (name === "z") return vec(0, 0, 1);
  if (name === "h") return normalize(vec(1, 0, 1));
  return vec(0, 1, 0);
}

export function rotate(v, axis, angle) {
  const a = normalize(axis);
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const d = v.x * a.x + v.y * a.y + v.z * a.z;
  return vec(
    v.x * c + (a.y * v.z - a.z * v.y) * s + a.x * d * (1 - c),
    v.y * c + (a.z * v.x - a.x * v.z) * s + a.y * d * (1 - c),
    v.z * c + (a.x * v.y - a.y * v.x) * s + a.z * d * (1 - c),
  );
}

export function startVector(frontBackDegrees, eastWestDegrees) {
  const north = vec(0, 0, 1);
  const afterFrontBack = rotate(north, vec(0, 1, 0), frontBackDegrees * DEG);
  return rotate(afterFrontBack, vec(1, 0, 0), eastWestDegrees * DEG);
}

export function project(v, cx, cy, radius, yaw, pitch = 0) {
  const cyaw = Math.cos(yaw), syaw = Math.sin(yaw);
  // Screen-space front/back is mirrored so +Y (表 |+i⟩) is the near side.
  // X (east/west) and Z (north/south) are intentionally unchanged.
  const viewY = -v.y;
  const x1 = v.x * cyaw - viewY * syaw;
  const depth1 = v.x * syaw + viewY * cyaw;
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const z2 = v.z * cp - depth1 * sp;
  const depth2 = v.z * sp + depth1 * cp;
  return { x: cx + radius * x1, y: cy - radius * z2, depth: depth2 };
}
