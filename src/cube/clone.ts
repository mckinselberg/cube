import type { Cube, FaceArray } from "./types.ts";

/**
 * Deep clones a cube, creating a new instance with copied face arrays
 */
export function clone(cube: Cube): Cube {
  return {
    White: [...cube.White] as FaceArray,
    Red: [...cube.Red] as FaceArray,
    Green: [...cube.Green] as FaceArray,
    Yellow: [...cube.Yellow] as FaceArray,
    Orange: [...cube.Orange] as FaceArray,
    Blue: [...cube.Blue] as FaceArray,
  };
}
