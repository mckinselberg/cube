import type { Cube } from '../cube/types.ts';

/**
 * Prints a cube in ASCII net layout
 *
 * Layout:
 *       U U U
 *       U U U
 *       U U U
 * L L L F F F R R R B B B
 * L L L F F F R R R B B B
 * L L L F F F R R R B B B
 *       D D D
 *       D D D
 *       D D D
 */
export function printCube(cube: Cube): string {
  const lines: string[] = [];

  // Top face (U)
  for (let row = 0; row < 3; row++) {
    const start = row * 3;
    lines.push('      ' + cube.U[start] + ' ' + cube.U[start + 1] + ' ' + cube.U[start + 2]);
  }

  // Middle row (L, F, R, B)
  for (let row = 0; row < 3; row++) {
    const start = row * 3;
    lines.push(
      cube.L[start] +
        ' ' +
        cube.L[start + 1] +
        ' ' +
        cube.L[start + 2] +
        ' ' +
        cube.F[start] +
        ' ' +
        cube.F[start + 1] +
        ' ' +
        cube.F[start + 2] +
        ' ' +
        cube.R[start] +
        ' ' +
        cube.R[start + 1] +
        ' ' +
        cube.R[start + 2] +
        ' ' +
        cube.B[start] +
        ' ' +
        cube.B[start + 1] +
        ' ' +
        cube.B[start + 2]
    );
  }

  // Bottom face (D)
  for (let row = 0; row < 3; row++) {
    const start = row * 3;
    lines.push('      ' + cube.D[start] + ' ' + cube.D[start + 1] + ' ' + cube.D[start + 2]);
  }

  return lines.join('\n');
}
