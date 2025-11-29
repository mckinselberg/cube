import type { Cube } from "../cube/types.ts";
import { clone } from "../cube/clone.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";

/**
 * L move: Rotate the Left face clockwise 90 degrees
 */
export function L(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: [
      cube.Blue[0],
      cube.White[1],
      cube.White[2],
      cube.Blue[3],
      cube.White[4],
      cube.White[5],
      cube.Blue[6],
      cube.White[7],
      cube.White[8],
    ] as const,
    Red: [...cube.Red] as const,
    Green: [
      cube.White[0],
      cube.Green[1],
      cube.Green[2],
      cube.White[3],
      cube.Green[4],
      cube.Green[5],
      cube.White[6],
      cube.Green[7],
      cube.Green[8],
    ] as const,
    Yellow: [
      cube.Green[0],
      cube.Yellow[1],
      cube.Yellow[2],
      cube.Green[3],
      cube.Yellow[4],
      cube.Yellow[5],
      cube.Green[6],
      cube.Yellow[7],
      cube.Yellow[8],
    ] as const,
    Orange: rotateFaceClockwise(cube.Orange),
    Blue: [
      cube.Yellow[0],
      cube.Blue[1],
      cube.Blue[2],
      cube.Yellow[3],
      cube.Blue[4],
      cube.Blue[5],
      cube.Yellow[6],
      cube.Blue[7],
      cube.Blue[8],
    ] as const,
  };
}

/**
 * L' move: Rotate the Left face counter-clockwise 90 degrees
 */
export function LPrime(cube: Cube): Cube {
  // Cycle the left column: F -> U -> B -> D -> F (reverse of L)
  return {
    U: [
      cube.F[0],
      cube.U[1],
      cube.U[2],
      cube.F[3],
      cube.U[4],
      cube.U[5],
      cube.F[6],
      cube.U[7],
      cube.U[8],
    ],
    R: cube.R,
    F: [
      cube.D[0],
      cube.F[1],
      cube.F[2],
      cube.D[3],
      cube.F[4],
      cube.F[5],
      cube.D[6],
      cube.F[7],
      cube.F[8],
    ],
    D: [
      cube.B[8],
      cube.D[1],
      cube.D[2],
      cube.B[5],
      cube.D[4],
      cube.D[5],
      cube.B[2],
      cube.D[7],
      cube.D[8],
    ],
    L: rotateFaceCounterClockwise(cube.L),
    B: [
      cube.B[0],
      cube.B[1],
      cube.U[6],
      cube.B[3],
      cube.B[4],
      cube.U[3],
      cube.B[6],
      cube.B[7],
      cube.U[0],
    ],
  };
}

/**
 * L2 move: Rotate the Left face 180 degrees
 */
export function L2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: [
      cube.D[0],
      cube.U[1],
      cube.U[2],
      cube.D[3],
      cube.U[4],
      cube.U[5],
      cube.D[6],
      cube.U[7],
      cube.U[8],
    ],
    R: cube.R,
    F: [
      cube.B[8],
      cube.F[1],
      cube.F[2],
      cube.B[5],
      cube.F[4],
      cube.F[5],
      cube.B[2],
      cube.F[7],
      cube.F[8],
    ],
    D: [
      cube.U[0],
      cube.D[1],
      cube.D[2],
      cube.U[3],
      cube.D[4],
      cube.D[5],
      cube.U[6],
      cube.D[7],
      cube.D[8],
    ],
    L: rotateFace180(cube.L),
    B: [
      cube.B[0],
      cube.B[1],
      cube.F[6],
      cube.B[3],
      cube.B[4],
      cube.F[3],
      cube.B[6],
      cube.B[7],
      cube.F[0],
    ],
  };
}
