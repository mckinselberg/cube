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
  // Use clone for immutability
  const newCube = clone(cube);
  // Rotate L face
  newCube.L = rotateFaceClockwise(cube.L);
  // Save left columns
  const f = [cube.F[0], cube.F[3], cube.F[6]];
  const u = [cube.U[0], cube.U[3], cube.U[6]];
  const b = [cube.B[8], cube.B[5], cube.B[2]]; // B's left column reversed
  const d = [cube.D[0], cube.D[3], cube.D[6]];
  // Cycle left columns: F->U->B->D->F
  newCube.F[0] = u[0];
  newCube.F[3] = u[1];
  newCube.F[6] = u[2];
  newCube.U[0] = b[0];
  newCube.U[3] = b[1];
  newCube.U[6] = b[2];
  newCube.B[8] = d[0];
  newCube.B[5] = d[1];
  newCube.B[2] = d[2];
  newCube.D[0] = f[0];
  newCube.D[3] = f[1];
  newCube.D[6] = f[2];
  return newCube;
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
