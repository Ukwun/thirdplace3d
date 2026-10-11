export type MovementInput = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
};

export type WorldPoint = { x: number; z: number };
export type WorldObstacle = { x: number; z: number; halfWidth: number; halfDepth: number };

export const PLAYER_SPEED = 5.2;
export const PLAYER_RADIUS = 0.42;

// Building footprints and fixed plaza props. Keep these in sync with the scene layout.
export const WORLD_OBSTACLES: WorldObstacle[] = [
  { x: -15, z: -13, halfWidth: 4.25, halfDepth: 3.8 },
  { x: -15, z: 13, halfWidth: 4.25, halfDepth: 3.8 },
  { x: 15, z: -13, halfWidth: 4.25, halfDepth: 3.8 },
  { x: -15, z: 0, halfWidth: 4.25, halfDepth: 3.8 },
  { x: 10.5, z: 9.5, halfWidth: 0.9, halfDepth: 0.35 },
  { x: 16, z: 9.5, halfWidth: 0.9, halfDepth: 0.35 },
  { x: 12.2, z: 12, halfWidth: 1.6, halfDepth: 1.6 },
];

function isBlocked(x: number, z: number, obstacles: WorldObstacle[]) {
  return obstacles.some(
    (obstacle) =>
      Math.abs(x - obstacle.x) < obstacle.halfWidth + PLAYER_RADIUS &&
      Math.abs(z - obstacle.z) < obstacle.halfDepth + PLAYER_RADIUS,
  );
}

/** Normalize input and resolve each axis independently so players can slide along walls. */
export function movePlayer(
  position: WorldPoint,
  input: MovementInput,
  deltaSeconds: number,
  obstacles: WorldObstacle[] = WORLD_OBSTACLES,
): WorldPoint {
  const dx = Number(input.right) - Number(input.left);
  const dz = Number(input.backward) - Number(input.forward);
  const magnitude = Math.hypot(dx, dz);
  if (!magnitude) return position;

  const step = Math.min(deltaSeconds, 0.05) * PLAYER_SPEED / magnitude;
  const nextX = position.x + dx * step;
  const nextZ = position.z + dz * step;
  const x = isBlocked(nextX, position.z, obstacles) ? position.x : nextX;
  const z = isBlocked(x, nextZ, obstacles) ? position.z : nextZ;

  return {
    x: Math.max(-34, Math.min(34, x)),
    z: Math.max(-34, Math.min(34, z)),
  };
}
