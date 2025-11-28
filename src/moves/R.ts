import type { Cube } from "../cube/types.ts";
import { clone } from "../cube/clone.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";

/**
 * R move: Rotate the Right face clockwise 90 degrees
 */
export function R(cube: Cube): Cube {
  // Use clone for immutability
  const newCube = clone(cube);
  // Rotate R face
  newCube.R = rotateFaceClockwise(cube.R);
  // Save right columns
  const f = [cube.F[2], cube.F[5], cube.F[8]];
  const u = [cube.U[2], cube.U[5], cube.U[8]];
  const b = [cube.B[2], cube.B[5], cube.B[8]]; // B's right column (normal order)
  const d = [cube.D[2], cube.D[5], cube.D[8]];
  // Cycle right columns: F->U->B->D->F
  newCube.F[2] = d[0];
  newCube.F[5] = d[1];
  newCube.F[8] = d[2];
  newCube.U[2] = f[0];
  newCube.U[5] = f[1];
  newCube.U[8] = f[2];
  newCube.B[2] = u[0];
  newCube.B[5] = u[1];
  newCube.B[8] = u[2];
  newCube.D[2] = b[0];
  newCube.D[5] = b[1];
  newCube.D[8] = b[2];
  return newCube;
}

/**
 * R' move: Rotate the Right face counter-clockwise 90 degrees
 */
export function RPrime(cube: Cube): Cube {
  // Cycle the right column: F -> D -> B -> U -> F (reverse of R)
  return {
    U: [
      cube.U[0],
      cube.U[1],
      cube.B[6],
      cube.U[3],
      cube.U[4],
      cube.B[3],
      cube.U[6],
      cube.U[7],
      cube.B[0],
    ],
    R: rotateFaceCounterClockwise(cube.R),
    F: [
      cube.F[0],
      cube.F[1],
      cube.U[2],
      cube.F[3],
      cube.F[4],
      cube.U[5],
      cube.F[6],
      cube.F[7],
      cube.U[8],
    ],
    D: [
      cube.D[0],
      cube.D[1],
      cube.F[2],
      cube.D[3],
      cube.D[4],
      cube.F[5],
      cube.D[6],
      cube.D[7],
      cube.F[8],
    ],
    L: cube.L,
    B: [
      cube.D[8],
      cube.B[1],
      cube.B[2],
      cube.D[5],
      cube.B[4],
      cube.B[5],
      cube.D[2],
      cube.B[7],
      cube.B[8],
    ],
  };
}

/**
 * R2 move: Rotate the Right face 180 degrees
 */
export function R2(cube: Cube): Cube {
  // Swap opposite edges
  return {
    U: [
      cube.U[0],
      cube.U[1],
      cube.D[2],
      cube.U[3],
      cube.U[4],
      cube.D[5],
      cube.U[6],
      cube.U[7],
      cube.D[8],
    ],
    R: rotateFace180(cube.R),
    F: [
      cube.F[0],
      cube.F[1],
      cube.B[6],
      cube.F[3],
      cube.F[4],
      cube.B[3],
      cube.F[6],
      cube.F[7],
      cube.B[0],
    ],
    D: [
      cube.D[0],
      cube.D[1],
      cube.U[2],
      cube.D[3],
      cube.D[4],
      cube.U[5],
      cube.D[6],
      cube.D[7],
      cube.U[8],
    ],
    L: cube.L,
    B: [
      cube.F[8],
      cube.B[1],
      cube.B[2],
      cube.F[5],
      cube.B[4],
      cube.B[5],
      cube.F[2],
      cube.B[7],
      cube.B[8],
    ],
  };
}
