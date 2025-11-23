import type { Cube } from '../cube/types.ts';

/**
 * Serializes a cube to JSON string
 */
export function cubeToJSON(cube: Cube): string {
  return JSON.stringify(cube, null, 2);
}
