import type { Cube } from "../cube/types.ts";
import { clone } from "../cube/clone.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";

/**
 * D move: Rotate the Down face clockwise 90 degrees
 */
export function D(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: [...cube.White] as const,
    Green: [
      cube.Green[0],
      cube.Green[1],
      cube.Green[2],
      cube.Green[3],
      cube.Green[4],
      cube.Green[5],
      cube.Orange[6],
      cube.Orange[7],
      cube.Orange[8],
    ] as const,
    Red: [
      cube.Red[0],
      cube.Red[1],
      cube.Red[2],
      cube.Red[3],
      cube.Red[4],
      cube.Red[5],
      cube.Green[6],
      cube.Green[7],
      cube.Green[8],
    ] as const,
    Blue: [
      cube.Blue[0],
      cube.Blue[1],
      cube.Blue[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.Blue[5],
      cube.Red[6],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Orange: [
      cube.Orange[0],
      cube.Orange[1],
      cube.Orange[2],
      cube.Orange[3],
      cube.Orange[4],
      cube.Orange[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.Blue[8],
    ] as const,
    Yellow: rotateFaceClockwise(cube.Yellow),
  };
}

/**
 * D' move: Rotate the Down face counter-clockwise 90 degrees
 */
export function DPrime(cube: Cube): Cube {
  // Cycle the bottom row of F, R, B, L (reverse of D)
  return {
    U: cube.U,
    R: [
      cube.R[0],
      cube.R[1],
      cube.R[2],
      cube.R[3],
      cube.R[4],
      cube.R[5],
      cube.B[6],
      cube.B[7],
      cube.B[8],
    ],
    F: [
      cube.F[0],
      cube.F[1],
      cube.F[2],
      cube.F[3],
      cube.F[4],
      cube.F[5],
      cube.R[6],
      cube.R[7],
      cube.R[8],
    ],
    D: rotateFaceCounterClockwise(cube.D),
    L: [
      cube.L[0],
      cube.L[1],
      cube.L[2],
      cube.L[3],
      cube.L[4],
      cube.L[5],
      cube.F[6],
      cube.F[7],
      cube.F[8],
    ],
    B: [
      cube.B[0],
      cube.B[1],
      cube.B[2],
      cube.B[3],
      cube.B[4],
      cube.B[5],
      cube.L[6],
      cube.L[7],
      cube.L[8],
    ],
  };
}

/**
 * D2 move: Rotate the Down face 180 degrees
 */
export function D2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: cube.U,
    R: [
      cube.R[0],
      cube.R[1],
      cube.R[2],
      cube.R[3],
      cube.R[4],
      cube.R[5],
      cube.L[6],
      cube.L[7],
      cube.L[8],
    ],
    F: [
      cube.F[0],
      cube.F[1],
      cube.F[2],
      cube.F[3],
      cube.F[4],
      cube.F[5],
      cube.B[6],
      cube.B[7],
      cube.B[8],
    ],
    D: rotateFace180(cube.D),
    L: [
      cube.L[0],
      cube.L[1],
      cube.L[2],
      cube.L[3],
      cube.L[4],
      cube.L[5],
      cube.R[6],
      cube.R[7],
      cube.R[8],
    ],
    B: [
      cube.B[0],
      cube.B[1],
      cube.B[2],
      cube.B[3],
      cube.B[4],
      cube.B[5],
      cube.F[6],
      cube.F[7],
      cube.F[8],
    ],
  };
}
