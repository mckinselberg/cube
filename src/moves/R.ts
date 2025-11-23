import type { Cube } from '../cube/types.ts';
import { rotateFaceClockwise, rotateFaceCounterClockwise, rotateFace180 } from '../cube/rotateFace.ts';

/**
 * R move: Rotate the Right face clockwise 90 degrees
 */
export function R(cube: Cube): Cube {
  // Cycle the right column: F -> U -> B -> D -> F
  return {
    U: [cube.U[0], cube.U[1], cube.F[2], cube.U[3], cube.U[4], cube.F[5], cube.U[6], cube.U[7], cube.F[8]],
    R: rotateFaceClockwise(cube.R),
    F: [cube.F[0], cube.F[1], cube.D[2], cube.F[3], cube.F[4], cube.D[5], cube.F[6], cube.F[7], cube.D[8]],
    D: [cube.D[0], cube.D[1], cube.B[6], cube.D[3], cube.D[4], cube.B[3], cube.D[6], cube.D[7], cube.B[0]],
    L: cube.L,
    B: [cube.U[8], cube.B[1], cube.B[2], cube.U[5], cube.B[4], cube.B[5], cube.U[2], cube.B[7], cube.B[8]],
  };
}

/**
 * R' move: Rotate the Right face counter-clockwise 90 degrees
 */
export function RPrime(cube: Cube): Cube {
  // Cycle the right column: F -> D -> B -> U -> F (reverse of R)
  return {
    U: [cube.U[0], cube.U[1], cube.B[6], cube.U[3], cube.U[4], cube.B[3], cube.U[6], cube.U[7], cube.B[0]],
    R: rotateFaceCounterClockwise(cube.R),
    F: [cube.F[0], cube.F[1], cube.U[2], cube.F[3], cube.F[4], cube.U[5], cube.F[6], cube.F[7], cube.U[8]],
    D: [cube.D[0], cube.D[1], cube.F[2], cube.D[3], cube.D[4], cube.F[5], cube.D[6], cube.D[7], cube.F[8]],
    L: cube.L,
    B: [cube.D[8], cube.B[1], cube.B[2], cube.D[5], cube.B[4], cube.B[5], cube.D[2], cube.B[7], cube.B[8]],
  };
}

/**
 * R2 move: Rotate the Right face 180 degrees
 */
export function R2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: [cube.U[0], cube.U[1], cube.D[2], cube.U[3], cube.U[4], cube.D[5], cube.U[6], cube.U[7], cube.D[8]],
    R: rotateFace180(cube.R),
    F: [cube.F[0], cube.F[1], cube.B[6], cube.F[3], cube.F[4], cube.B[3], cube.F[6], cube.F[7], cube.B[0]],
    D: [cube.D[0], cube.D[1], cube.U[2], cube.D[3], cube.D[4], cube.U[5], cube.D[6], cube.D[7], cube.U[8]],
    L: cube.L,
    B: [cube.F[8], cube.B[1], cube.B[2], cube.F[5], cube.B[4], cube.B[5], cube.F[2], cube.B[7], cube.B[8]],
  };
}
