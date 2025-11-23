import type { Cube } from '../cube/types.ts';
import { rotateFaceClockwise, rotateFaceCounterClockwise, rotateFace180 } from '../cube/rotateFace.ts';

/**
 * D move: Rotate the Down face clockwise 90 degrees
 */
export function D(cube: Cube): Cube {
  // Cycle the bottom row of F, L, B, R
  return {
    U: cube.U,
    R: [cube.R[0], cube.R[1], cube.R[2], cube.R[3], cube.R[4], cube.R[5], cube.F[6], cube.F[7], cube.F[8]],
    F: [cube.F[0], cube.F[1], cube.F[2], cube.F[3], cube.F[4], cube.F[5], cube.L[6], cube.L[7], cube.L[8]],
    D: rotateFaceClockwise(cube.D),
    L: [cube.L[0], cube.L[1], cube.L[2], cube.L[3], cube.L[4], cube.L[5], cube.B[6], cube.B[7], cube.B[8]],
    B: [cube.B[0], cube.B[1], cube.B[2], cube.B[3], cube.B[4], cube.B[5], cube.R[6], cube.R[7], cube.R[8]],
  };
}

/**
 * D' move: Rotate the Down face counter-clockwise 90 degrees
 */
export function DPrime(cube: Cube): Cube {
  // Cycle the bottom row of F, R, B, L (reverse of D)
  return {
    U: cube.U,
    R: [cube.R[0], cube.R[1], cube.R[2], cube.R[3], cube.R[4], cube.R[5], cube.B[6], cube.B[7], cube.B[8]],
    F: [cube.F[0], cube.F[1], cube.F[2], cube.F[3], cube.F[4], cube.F[5], cube.R[6], cube.R[7], cube.R[8]],
    D: rotateFaceCounterClockwise(cube.D),
    L: [cube.L[0], cube.L[1], cube.L[2], cube.L[3], cube.L[4], cube.L[5], cube.F[6], cube.F[7], cube.F[8]],
    B: [cube.B[0], cube.B[1], cube.B[2], cube.B[3], cube.B[4], cube.B[5], cube.L[6], cube.L[7], cube.L[8]],
  };
}

/**
 * D2 move: Rotate the Down face 180 degrees
 */
export function D2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: cube.U,
    R: [cube.R[0], cube.R[1], cube.R[2], cube.R[3], cube.R[4], cube.R[5], cube.L[6], cube.L[7], cube.L[8]],
    F: [cube.F[0], cube.F[1], cube.F[2], cube.F[3], cube.F[4], cube.F[5], cube.B[6], cube.B[7], cube.B[8]],
    D: rotateFace180(cube.D),
    L: [cube.L[0], cube.L[1], cube.L[2], cube.L[3], cube.L[4], cube.L[5], cube.R[6], cube.R[7], cube.R[8]],
    B: [cube.B[0], cube.B[1], cube.B[2], cube.B[3], cube.B[4], cube.B[5], cube.F[6], cube.F[7], cube.F[8]],
  };
}
