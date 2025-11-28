import type { Cube } from "../cube/types.ts";
import { clone } from "../cube/clone.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";

/**
 * F move: Rotate the Front face clockwise 90 degrees
 */
export function F(cube: Cube): Cube {
  // Use clone for immutability
  const newCube = clone(cube);
  // Rotate F face
  newCube.F = rotateFaceClockwise(cube.F);
  // Save affected stickers
  // U[6,7,8] → R[0,3,6]
  newCube.R[0] = cube.U[6];
  newCube.R[3] = cube.U[7];
  newCube.R[6] = cube.U[8];
  // R[0,3,6] → D[2,1,0]
  newCube.D[2] = cube.R[0];
  newCube.D[1] = cube.R[3];
  newCube.D[0] = cube.R[6];
  // D[2,1,0] → L[8,5,2]
  newCube.L[8] = cube.D[2];
  newCube.L[5] = cube.D[1];
  newCube.L[2] = cube.D[0];
  // L[8,5,2] → U[6,7,8]
  newCube.U[6] = cube.L[8];
  newCube.U[7] = cube.L[5];
  newCube.U[8] = cube.L[2];
  return newCube;
}

/**
 * F' move: Rotate the Front face counter-clockwise 90 degrees
 */
export function FPrime(cube: Cube): Cube {
  // Cycle: U bottom -> L right -> D top -> R left -> U bottom (reverse of F)
  return {
    U: [
      cube.U[0],
      cube.U[1],
      cube.U[2],
      cube.U[3],
      cube.U[4],
      cube.U[5],
      cube.R[0],
      cube.R[3],
      cube.R[6],
    ],
    R: [
      cube.D[2],
      cube.R[1],
      cube.R[2],
      cube.D[1],
      cube.R[4],
      cube.R[5],
      cube.D[0],
      cube.R[7],
      cube.R[8],
    ],
    F: rotateFaceCounterClockwise(cube.F),
    D: [
      cube.L[2],
      cube.L[5],
      cube.L[8],
      cube.D[3],
      cube.D[4],
      cube.D[5],
      cube.D[6],
      cube.D[7],
      cube.D[8],
    ],
    L: [
      cube.L[0],
      cube.L[1],
      cube.U[6],
      cube.L[3],
      cube.L[4],
      cube.U[7],
      cube.L[6],
      cube.L[7],
      cube.U[8],
    ],
    B: cube.B,
  };
}

/**
 * F2 move: Rotate the Front face 180 degrees
 */
export function F2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: [
      cube.U[0],
      cube.U[1],
      cube.U[2],
      cube.U[3],
      cube.U[4],
      cube.U[5],
      cube.D[2],
      cube.D[1],
      cube.D[0],
    ],
    R: [
      cube.L[8],
      cube.R[1],
      cube.R[2],
      cube.L[5],
      cube.R[4],
      cube.R[5],
      cube.L[2],
      cube.R[7],
      cube.R[8],
    ],
    F: rotateFace180(cube.F),
    D: [
      cube.U[8],
      cube.U[7],
      cube.U[6],
      cube.D[3],
      cube.D[4],
      cube.D[5],
      cube.D[6],
      cube.D[7],
      cube.D[8],
    ],
    L: [
      cube.L[0],
      cube.L[1],
      cube.R[6],
      cube.L[3],
      cube.L[4],
      cube.R[3],
      cube.L[6],
      cube.L[7],
      cube.R[0],
    ],
    B: cube.B,
  };
}
