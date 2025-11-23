import type { Cube, FaceArray } from './types.ts';

/**
 * Creates a solved Rubik's Cube with standard color scheme
 * U=White, R=Red, F=Green, D=Yellow, L=Orange, B=Blue
 */
export function createSolved(): Cube {
  const white: FaceArray = ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W'];
  const red: FaceArray = ['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R'];
  const green: FaceArray = ['G', 'G', 'G', 'G', 'G', 'G', 'G', 'G', 'G'];
  const yellow: FaceArray = ['Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y', 'Y'];
  const orange: FaceArray = ['O', 'O', 'O', 'O', 'O', 'O', 'O', 'O', 'O'];
  const blue: FaceArray = ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'];

  return {
    U: white,
    R: red,
    F: green,
    D: yellow,
    L: orange,
    B: blue,
  };
}
