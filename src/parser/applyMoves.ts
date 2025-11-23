import type { Cube } from '../cube/types.ts';
import { parseMove, applyMove } from './parseMove.ts';

/**
 * Applies a sequence of moves to a cube
 * @param cube - The initial cube state
 * @param sequence - A space-separated string of moves (e.g., "R U R' U'")
 * @returns The resulting cube state after applying all moves
 */
export function applyMoves(cube: Cube, sequence: string): Cube {
  const moves = sequence
    .trim()
    .split(/\s+/)
    .filter((m) => m.length > 0);

  let currentCube = cube;
  for (const moveStr of moves) {
    const move = parseMove(moveStr);
    currentCube = applyMove(currentCube, move);
  }

  return currentCube;
}
