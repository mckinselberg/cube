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
  // Use immutable assignment for all faces
  return {
    White: [
      cube.White[0],
      cube.White[1],
      cube.White[2],
      cube.White[3],
      cube.White[4],
      cube.White[5],
      cube.Orange[2],
      cube.Orange[5],
      cube.Orange[8],
    ] as const,
    Red: [
      cube.White[6],
      cube.Red[1],
      cube.Red[2],
      cube.White[7],
      cube.Red[4],
      cube.Red[5],
      cube.White[8],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Green: rotateFaceClockwise(cube.Green),
    Yellow: [
      cube.Red[0],
      cube.Red[3],
      cube.Red[6],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.Yellow[5],
      cube.Yellow[6],
      cube.Yellow[7],
      cube.Yellow[8],
    ] as const,
    Orange: [
      cube.Orange[0],
      cube.Orange[1],
      cube.Yellow[2],
      cube.Orange[3],
      cube.Orange[4],
      cube.Yellow[1],
      cube.Orange[6],
      cube.Orange[7],
      cube.Yellow[0],
    ] as const,
    Blue: [...cube.Blue] as const,
  };
}

/**
 * F' move: Rotate the Front face counter-clockwise 90 degrees
 */
export function FPrime(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: [
      cube.White[0],
      cube.White[1],
      cube.White[2],
      cube.White[3],
      cube.White[4],
      cube.White[5],
      cube.Red[0],
      cube.Red[3],
      cube.Red[6],
    ] as const,
    Red: [
      cube.Yellow[2],
      cube.Red[1],
      cube.Red[2],
      cube.Yellow[1],
      cube.Red[4],
      cube.Red[5],
      cube.Yellow[0],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Green: rotateFaceCounterClockwise(cube.Green),
    Yellow: [
      cube.Yellow[0],
      cube.Yellow[1],
      cube.Orange[8],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.Orange[5],
      cube.Yellow[6],
      cube.Yellow[7],
      cube.Orange[2],
    ] as const,
    Orange: [
      cube.Orange[0],
      cube.Orange[1],
      cube.White[6],
      cube.Orange[3],
      cube.Orange[4],
      cube.White[7],
      cube.Orange[6],
      cube.Orange[7],
      cube.White[8],
    ] as const,
    Blue: [...cube.Blue] as const,
  };
}

/**
 * F2 move: Rotate the Front face 180 degrees
 */
export function F2(cube: Cube): Cube {
  // Use immutable assignment for all faces
  return {
    White: [
      cube.White[0],
      cube.White[1],
      cube.White[2],
      cube.White[3],
      cube.White[4],
      cube.White[5],
      cube.Yellow[2],
      cube.Yellow[1],
      cube.Yellow[0],
    ] as const,
    Red: [
      cube.Orange[8],
      cube.Red[1],
      cube.Red[2],
      cube.Orange[5],
      cube.Red[4],
      cube.Red[5],
      cube.Orange[2],
      cube.Red[7],
      cube.Red[8],
    ] as const,
    Green: rotateFace180(cube.Green),
    Yellow: [
      cube.White[8],
      cube.White[7],
      cube.White[6],
      cube.Yellow[3],
      cube.Yellow[4],
      cube.Yellow[5],
      cube.Yellow[6],
      cube.Yellow[7],
      cube.Yellow[8],
    ] as const,
    Orange: [
      cube.Orange[0],
      cube.Orange[1],
      cube.Red[6],
      cube.Orange[3],
      cube.Orange[4],
      cube.Red[3],
      cube.Orange[6],
      cube.Orange[7],
      cube.Red[0],
    ] as const,
    Blue: [...cube.Blue] as const,
  };
}
