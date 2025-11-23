import type { Cube } from '../cube/types.ts';
import { rotateFaceClockwise, rotateFaceCounterClockwise, rotateFace180 } from '../cube/rotateFace.ts';

/**
 * U move: Rotate the Up face clockwise 90 degrees
 */
export function U(cube: Cube): Cube {
  // Cycle the top row of F, R, B, L
  return {
    U: rotateFaceClockwise(cube.U),
    R: [cube.B[0], cube.B[1], cube.B[2], cube.R[3], cube.R[4], cube.R[5], cube.R[6], cube.R[7], cube.R[8]],
    F: [cube.R[0], cube.R[1], cube.R[2], cube.F[3], cube.F[4], cube.F[5], cube.F[6], cube.F[7], cube.F[8]],
    D: cube.D,
    L: [cube.F[0], cube.F[1], cube.F[2], cube.L[3], cube.L[4], cube.L[5], cube.L[6], cube.L[7], cube.L[8]],
    B: [cube.L[0], cube.L[1], cube.L[2], cube.B[3], cube.B[4], cube.B[5], cube.B[6], cube.B[7], cube.B[8]],
  };
}

/**
 * U' move: Rotate the Up face counter-clockwise 90 degrees
 */
export function UPrime(cube: Cube): Cube {
  // Cycle the top row of F, L, B, R (reverse of U)
  return {
    U: rotateFaceCounterClockwise(cube.U),
    R: [cube.F[0], cube.F[1], cube.F[2], cube.R[3], cube.R[4], cube.R[5], cube.R[6], cube.R[7], cube.R[8]],
    F: [cube.L[0], cube.L[1], cube.L[2], cube.F[3], cube.F[4], cube.F[5], cube.F[6], cube.F[7], cube.F[8]],
    D: cube.D,
    L: [cube.B[0], cube.B[1], cube.B[2], cube.L[3], cube.L[4], cube.L[5], cube.L[6], cube.L[7], cube.L[8]],
    B: [cube.R[0], cube.R[1], cube.R[2], cube.B[3], cube.B[4], cube.B[5], cube.B[6], cube.B[7], cube.B[8]],
  };
}

/**
 * U2 move: Rotate the Up face 180 degrees
 */
export function U2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: rotateFace180(cube.U),
    R: [cube.L[0], cube.L[1], cube.L[2], cube.R[3], cube.R[4], cube.R[5], cube.R[6], cube.R[7], cube.R[8]],
    F: [cube.B[0], cube.B[1], cube.B[2], cube.F[3], cube.F[4], cube.F[5], cube.F[6], cube.F[7], cube.F[8]],
    D: cube.D,
    L: [cube.R[0], cube.R[1], cube.R[2], cube.L[3], cube.L[4], cube.L[5], cube.L[6], cube.L[7], cube.L[8]],
    B: [cube.F[0], cube.F[1], cube.F[2], cube.B[3], cube.B[4], cube.B[5], cube.B[6], cube.B[7], cube.B[8]],
  };
}
