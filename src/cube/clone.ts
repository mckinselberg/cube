import type { Cube, FaceArray } from './types.ts';

/**
 * Deep clones a cube, creating a new instance with copied face arrays
 */
export function clone(cube: Cube): Cube {
  return {
    U: [...cube.U] as FaceArray,
    R: [...cube.R] as FaceArray,
    F: [...cube.F] as FaceArray,
    D: [...cube.D] as FaceArray,
    L: [...cube.L] as FaceArray,
    B: [...cube.B] as FaceArray,
  };
}
