import type { Cube } from '../cube/types.ts';
import { rotateFaceClockwise, rotateFaceCounterClockwise, rotateFace180 } from '../cube/rotateFace.ts';

/**
 * B move: Rotate the Back face clockwise 90 degrees
 */
export function B(cube: Cube): Cube {
  // Cycle: U top -> L left -> D bottom -> R right -> U top
  return {
    U: [cube.R[2], cube.R[5], cube.R[8], cube.U[3], cube.U[4], cube.U[5], cube.U[6], cube.U[7], cube.U[8]],
    R: [cube.R[0], cube.R[1], cube.D[8], cube.R[3], cube.R[4], cube.D[7], cube.R[6], cube.R[7], cube.D[6]],
    F: cube.F,
    D: [cube.D[0], cube.D[1], cube.D[2], cube.D[3], cube.D[4], cube.D[5], cube.L[0], cube.L[3], cube.L[6]],
    L: [cube.U[2], cube.L[1], cube.L[2], cube.U[1], cube.L[4], cube.L[5], cube.U[0], cube.L[7], cube.L[8]],
    B: rotateFaceClockwise(cube.B),
  };
}

/**
 * B' move: Rotate the Back face counter-clockwise 90 degrees
 */
export function BPrime(cube: Cube): Cube {
  // Cycle: U top -> R right -> D bottom -> L left -> U top (reverse of B)
  return {
    U: [cube.L[6], cube.L[3], cube.L[0], cube.U[3], cube.U[4], cube.U[5], cube.U[6], cube.U[7], cube.U[8]],
    R: [cube.R[0], cube.R[1], cube.U[0], cube.R[3], cube.R[4], cube.U[1], cube.R[6], cube.R[7], cube.U[2]],
    F: cube.F,
    D: [cube.D[0], cube.D[1], cube.D[2], cube.D[3], cube.D[4], cube.D[5], cube.R[8], cube.R[5], cube.R[2]],
    L: [cube.D[6], cube.L[1], cube.L[2], cube.D[7], cube.L[4], cube.L[5], cube.D[8], cube.L[7], cube.L[8]],
    B: rotateFaceCounterClockwise(cube.B),
  };
}

/**
 * B2 move: Rotate the Back face 180 degrees
 */
export function B2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: [cube.D[8], cube.D[7], cube.D[6], cube.U[3], cube.U[4], cube.U[5], cube.U[6], cube.U[7], cube.U[8]],
    R: [cube.R[0], cube.R[1], cube.L[6], cube.R[3], cube.R[4], cube.L[3], cube.R[6], cube.R[7], cube.L[0]],
    F: cube.F,
    D: [cube.D[0], cube.D[1], cube.D[2], cube.D[3], cube.D[4], cube.D[5], cube.U[2], cube.U[1], cube.U[0]],
    L: [cube.R[8], cube.L[1], cube.L[2], cube.R[5], cube.L[4], cube.L[5], cube.R[2], cube.L[7], cube.L[8]],
    B: rotateFace180(cube.B),
  };
}
