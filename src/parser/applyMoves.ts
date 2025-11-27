import type { Cube } from "../cube/types.ts";
import { parseMove, applyMove } from "./parseMove.ts";

/**
 * Applies a sequence of moves to a cube
 * @param cube - The initial cube state
 * @param sequence - A space-separated string of moves (e.g., "R U R' U'" or "RUR'U'")
 * @returns The resulting cube state after applying all moves
 */
export function applyMoves(cube: Cube, sequence: string): Cube {
  // Remove all whitespace and split into individual moves
  // Handle formats like "R U R' U'" or "RUR'U'" or "R  U   R'  U'"
  const normalized = sequence
    .replace(/\s+/g, " ") // Replace multiple spaces with single space
    .trim();

  const moves = normalized.split(/\s+/).filter((m) => m.length > 0);

  let currentCube = cube;
  for (const moveStr of moves) {
    const move = parseMove(moveStr);
    currentCube = applyMove(currentCube, move);
  }

  return currentCube;
}
