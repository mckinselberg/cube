import type { Cube } from "../cube/types.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";

/**
 * R move: Rotate the Right face clockwise 90 degrees
 */
export function R(cube: Cube): Cube {
  // Build new arrays for each face
  return {
    White: [
      cube.White[0],
      cube.White[1],
      cube.Green[2],
      cube.White[3],
      cube.White[4],
      cube.Green[5],
      cube.White[6],
      cube.White[7],
      cube.Green[8],
    ] as const,
    Red: rotateFaceClockwise(cube.Red),
    Green: [
      cube.Green[0],
      cube.Green[1],
      cube.Yellow[2],
      cube.Green[3],
      cube.Green[4],
      cube.Yellow[5],
      cube.Green[6],
      cube.Green[7],
      cube.Yellow[8],
    ] as const,
    Yellow: [
      cube.Yellow[0],
      cube.Yellow[1],
      cube.Blue[2],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.Blue[5],
      cube.Yellow[6],
      cube.Yellow[7],
      cube.Blue[8],
    ] as const,
    Blue: [
      cube.Blue[0],
      cube.Blue[1],
      cube.White[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.White[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.White[8],
    ] as const,
    Orange: [...cube.Orange] as const,
  };
}

/**
 * R' move: Rotate the Right face counter-clockwise 90 degrees
 */
export function RPrime(cube: Cube): Cube {
  // Cycle the right column: F -> D -> B -> U -> F (reverse of R)
  // Build new arrays for each face
  return {
    White: [
      cube.White[0],
      cube.White[1],
      cube.Blue[2],
      cube.White[3],
      cube.White[4],
      cube.Blue[5],
      cube.White[6],
      cube.White[7],
      cube.Blue[8],
    ] as const,
    Red: rotateFaceCounterClockwise(cube.Red),
    Green: [
      cube.Green[0],
      cube.Green[1],
      cube.White[2],
      cube.Green[3],
      cube.Green[4],
      cube.White[5],
      cube.Green[6],
      cube.Green[7],
      cube.White[8],
    ] as const,
    Yellow: [
      cube.Yellow[0],
      cube.Yellow[1],
      cube.Green[2],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.Green[5],
      cube.Yellow[6],
      cube.Yellow[7],
      cube.Green[8],
    ] as const,
    Blue: [
      cube.Blue[0],
      cube.Blue[1],
      cube.Yellow[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.Yellow[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.Yellow[8],
    ] as const,
    Orange: [...cube.Orange] as const,
  };
  // ...existing code...
}

/**
 * R2 move: Rotate the Right face 180 degrees
 */
export function R2(cube: Cube): Cube {
  // Swap opposite edges
  // Build new arrays for each face
  return {
    White: [
      cube.White[0],
      cube.White[1],
      cube.Yellow[2],
      cube.White[3],
      cube.White[4],
      cube.Yellow[5],
      cube.White[6],
      cube.White[7],
      cube.Yellow[8],
    ] as const,
    Red: rotateFace180(cube.Red),
    Green: [
      cube.Green[0],
      cube.Green[1],
      cube.Blue[2],
      cube.Green[3],
      cube.Green[4],
      cube.Blue[5],
      cube.Green[6],
      cube.Green[7],
      cube.Blue[8],
    ] as const,
    Yellow: [
      cube.Yellow[0],
      cube.Yellow[1],
      cube.White[2],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.White[5],
      cube.Yellow[6],
      cube.Yellow[7],
      cube.White[8],
    ] as const,
    Blue: [
      cube.Blue[0],
      cube.Blue[1],
      cube.Green[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.Green[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.Green[8],
    ] as const,
    Orange: [...cube.Orange] as const,
  };
}
