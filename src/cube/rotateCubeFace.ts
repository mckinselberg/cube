import type { Cube, FaceArray } from "./types.ts";
import { clone } from "./clone.ts";
import { rotateFaceClockwise } from "./rotateFace.ts";

/**
 * Rotates a given face of the cube clockwise and cycles adjacent stickers
 * @param face - The face to rotate ("White", "Red", "Green", "Yellow", "Orange", "Blue")
 * @param cube - The cube to operate on
 */
export function rotateFace(face: keyof Cube, cube: Cube): Cube {
  const newCube = clone(cube);
  switch (face) {
    case "White": {
      newCube.White = rotateFaceClockwise(cube.White);
      // Cycle top rows: Green->Red->Blue->Orange->Green
      const green = cube.Green.slice(0, 3);
      const red = cube.Red.slice(0, 3);
      const blue = cube.Blue.slice(0, 3);
      const orange = cube.Orange.slice(0, 3);
      newCube.Green = [...red, ...cube.Green.slice(3)];
      newCube.Red = [...blue, ...cube.Red.slice(3)];
      newCube.Blue = [...orange, ...cube.Blue.slice(3)];
      newCube.Orange = [...green, ...cube.Orange.slice(3)];
      break;
    }
    // TODO: Implement cases for Red, Green, Yellow, Orange, Blue
    default:
      throw new Error(`rotateFace: Unsupported face '${face}'`);
  }
  return newCube;
}
