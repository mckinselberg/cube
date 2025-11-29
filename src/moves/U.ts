import type { Cube } from "../cube/types.ts";
import {
  rotateFaceClockwise,
  rotateFaceCounterClockwise,
  rotateFace180,
} from "../cube/rotateFace.ts";
import { clone } from "../cube/clone.ts";

/**
 * U move: Rotate the Up face clockwise 90 degrees
 */
export function U(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: rotateFaceClockwise(cube.White),
    Green: [
      cube.Red[0],
      cube.Red[1],
      cube.Red[2],
      cube.Green[3],
      cube.Green[4],
      cube.Green[5],
      cube.Green[6],
      cube.Green[7],
      cube.Green[8],
    ] as const,
    Red: [
      cube.Blue[0],
      cube.Blue[1],
      cube.Blue[2],
      cube.Red[3],
      cube.Red[4],
      cube.Red[5],
      cube.Red[6],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Blue: [
      cube.Orange[0],
      cube.Orange[1],
      cube.Orange[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.Blue[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.Blue[8],
    ] as const,
    Orange: [
      cube.Green[0],
      cube.Green[1],
      cube.Green[2],
      cube.Orange[3],
      cube.Orange[4],
      cube.Orange[5],
      cube.Orange[6],
      cube.Orange[7],
      cube.Orange[8],
    ] as const,
    Yellow: [...cube.Yellow] as const,
  };
}

/**
 * U' move: Rotate the Up face counter-clockwise 90 degrees
 */
export function UPrime(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: rotateFaceCounterClockwise(cube.White),
    Green: [
      cube.Orange[0],
      cube.Orange[1],
      cube.Orange[2],
      cube.Green[3],
      cube.Green[4],
      cube.Green[5],
      cube.Green[6],
      cube.Green[7],
      cube.Green[8],
    ] as const,
    Red: [
      cube.Green[0],
      cube.Green[1],
      cube.Green[2],
      cube.Red[3],
      cube.Red[4],
      cube.Red[5],
      cube.Red[6],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Blue: [
      cube.Red[0],
      cube.Red[1],
      cube.Red[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.Blue[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.Blue[8],
    ] as const,
    Orange: [
      cube.Blue[0],
      cube.Blue[1],
      cube.Blue[2],
      cube.Orange[3],
      cube.Orange[4],
      cube.Orange[5],
      cube.Orange[6],
      cube.Orange[7],
      cube.Orange[8],
    ] as const,
    Yellow: [...cube.Yellow] as const,
  };
}

/**
 * U2 move: Rotate the Up face 180 degrees
 */
export function U2(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: rotateFace180(cube.White),
    Green: [
      cube.Blue[0],
      cube.Blue[1],
      cube.Blue[2],
      cube.Green[3],
      cube.Green[4],
      cube.Green[5],
      cube.Green[6],
      cube.Green[7],
      cube.Green[8],
    ] as const,
    Red: [
      cube.Orange[0],
      cube.Orange[1],
      cube.Orange[2],
      cube.Red[3],
      cube.Red[4],
      cube.Red[5],
      cube.Red[6],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Blue: [
      cube.Green[0],
      cube.Green[1],
      cube.Green[2],
      cube.Blue[3],
      cube.Blue[4],
      cube.Blue[5],
      cube.Blue[6],
      cube.Blue[7],
      cube.Blue[8],
    ] as const,
    Orange: [
      cube.Red[0],
      cube.Red[1],
      cube.Red[2],
      cube.Orange[3],
      cube.Orange[4],
      cube.Orange[5],
      cube.Orange[6],
      cube.Orange[7],
      cube.Orange[8],
    ] as const,
    Yellow: [...cube.Yellow] as const,
  };
}
