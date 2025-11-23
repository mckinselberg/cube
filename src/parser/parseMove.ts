import type { Cube, Move } from '../cube/types.ts';
import {
  U,
  UPrime,
  U2,
  R,
  RPrime,
  R2,
  F,
  FPrime,
  F2,
  D,
  DPrime,
  D2,
  L,
  LPrime,
  L2,
  B,
  BPrime,
  B2,
} from '../moves/index.ts';

/**
 * Parses a move string and returns the Move type
 * @throws Error if the move is invalid
 */
export function parseMove(moveStr: string): Move {
  const normalized = moveStr.trim();

  const validMoves: Move[] = [
    'U',
    "U'",
    'U2',
    'R',
    "R'",
    'R2',
    'F',
    "F'",
    'F2',
    'D',
    "D'",
    'D2',
    'L',
    "L'",
    'L2',
    'B',
    "B'",
    'B2',
  ];

  if (validMoves.includes(normalized as Move)) {
    return normalized as Move;
  }

  throw new Error(`Invalid move: ${moveStr}`);
}

/**
 * Applies a single move to a cube
 */
export function applyMove(cube: Cube, move: Move): Cube {
  switch (move) {
    case 'U':
      return U(cube);
    case "U'":
      return UPrime(cube);
    case 'U2':
      return U2(cube);
    case 'R':
      return R(cube);
    case "R'":
      return RPrime(cube);
    case 'R2':
      return R2(cube);
    case 'F':
      return F(cube);
    case "F'":
      return FPrime(cube);
    case 'F2':
      return F2(cube);
    case 'D':
      return D(cube);
    case "D'":
      return DPrime(cube);
    case 'D2':
      return D2(cube);
    case 'L':
      return L(cube);
    case "L'":
      return LPrime(cube);
    case 'L2':
      return L2(cube);
    case 'B':
      return B(cube);
    case "B'":
      return BPrime(cube);
    case 'B2':
      return B2(cube);
  }
}
