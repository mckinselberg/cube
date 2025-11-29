import type { Cube } from "../cube/types.ts";
import { clone } from "../cube/clone.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";

/**
 * B move: Rotate the Back face clockwise 90 degrees
 */
export function B(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: [
      cube.Red[2],
      cube.Red[5],
      cube.Red[8],
      cube.White[3],
      cube.White[4],
      cube.White[5],
      cube.White[6],
      cube.White[7],
      cube.White[8],
    ] as const,
    Red: [
      cube.Red[0],
      cube.Red[1],
      cube.Yellow[6],
      cube.Red[3],
      cube.Red[4],
      cube.Yellow[7],
      cube.Red[6],
      cube.Red[7],
      cube.Yellow[8],
    ] as const,
    Green: [...cube.Green] as const,
    Yellow: [
      cube.Yellow[0],
      cube.Yellow[1],
      cube.Yellow[2],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.Yellow[5],
      cube.Orange[6],
      cube.Orange[3],
      cube.Orange[0],
    ] as const,
    Orange: [
      cube.White[2],
      cube.Orange[1],
      cube.Orange[2],
      cube.White[1],
      cube.Orange[4],
      cube.Orange[5],
      cube.White[0],
      cube.Orange[7],
      cube.Orange[8],
    ] as const,
    Blue: rotateFaceClockwise(cube.Blue),
  };
}

/**
 * B' move: Rotate the Back face counter-clockwise 90 degrees
 */
export function BPrime(cube: Cube): Cube {
  // Cycle: U top -> R right -> D bottom -> L left -> U top (reverse of B)
  return {
    U: [
      cube.L[6],
      cube.L[3],
      cube.L[0],
      cube.U[3],
      cube.U[4],
      cube.U[5],
      cube.U[6],
      cube.U[7],
      cube.U[8],
    ],
    R: [
      cube.R[0],
      cube.R[1],
      cube.U[0],
      cube.R[3],
      cube.R[4],
      cube.U[1],
      cube.R[6],
      cube.R[7],
      cube.U[2],
    ],
    F: cube.F,
    D: [
      cube.D[0],
      cube.D[1],
      cube.D[2],
      cube.D[3],
      cube.D[4],
      cube.D[5],
      cube.R[8],
      cube.R[5],
      cube.R[2],
    ],
    L: [
      cube.D[6],
      cube.L[1],
      cube.L[2],
      cube.D[7],
      cube.L[4],
      cube.L[5],
      cube.D[8],
      cube.L[7],
      cube.L[8],
    ],
    B: rotateFaceCounterClockwise(cube.B),
  };
}

/**
 * B2 move: Rotate the Back face 180 degrees
 */
export function B2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: [
      cube.D[8],
      cube.D[7],
      cube.D[6],
      cube.U[3],
      cube.U[4],
      cube.U[5],
      cube.U[6],
      cube.U[7],
      cube.U[8],
    ],
    R: [
      cube.R[0],
      cube.R[1],
      cube.L[6],
      cube.R[3],
      cube.R[4],
      cube.L[3],
      cube.R[6],
      cube.R[7],
      cube.L[0],
    ],
    F: cube.F,
    D: [
      cube.D[0],
      cube.D[1],
      cube.D[2],
      cube.D[3],
      cube.D[4],
      cube.D[5],
      cube.U[2],
      cube.U[1],
      cube.U[0],
    ],
    L: [
      cube.R[8],
      cube.L[1],
      cube.L[2],
      cube.R[5],
      cube.L[4],
      cube.L[5],
      cube.R[2],
      cube.L[7],
      cube.L[8],
    ],
    B: rotateFace180(cube.B),
  };
}
