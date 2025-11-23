import { describe, it, expect } from 'vitest';
import { createSolved } from '../src/cube/createSolved.ts';
import { U, R, F, D, L, B } from '../src/moves/index.ts';
import { applyMoves } from '../src/parser/applyMoves.ts';

describe('Moves', () => {
  describe('U move', () => {
    it('should return to solved state after U × 4', () => {
      let cube = createSolved();

      cube = U(cube);
      cube = U(cube);
      cube = U(cube);
      cube = U(cube);

      const solved = createSolved();
      expect(cube).toEqual(solved);
    });

    it('should not mutate the original cube', () => {
      const original = createSolved();
      const moved = U(original);

      expect(moved).not.toEqual(original);
      expect(original.U).toEqual(['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'W']);
    });
  });

  describe('R move', () => {
    it('should return to solved state after R × 4', () => {
      let cube = createSolved();

      cube = R(cube);
      cube = R(cube);
      cube = R(cube);
      cube = R(cube);

      const solved = createSolved();
      expect(cube).toEqual(solved);
    });

    it('should not mutate the original cube', () => {
      const original = createSolved();
      const moved = R(original);

      expect(moved).not.toEqual(original);
      expect(original.R).toEqual(['R', 'R', 'R', 'R', 'R', 'R', 'R', 'R', 'R']);
    });
  });

  describe('F move', () => {
    it('should return to solved state after F × 4', () => {
      let cube = createSolved();

      cube = F(cube);
      cube = F(cube);
      cube = F(cube);
      cube = F(cube);

      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe('D move', () => {
    it('should return to solved state after D × 4', () => {
      let cube = createSolved();

      cube = D(cube);
      cube = D(cube);
      cube = D(cube);
      cube = D(cube);

      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe('L move', () => {
    it('should return to solved state after L × 4', () => {
      let cube = createSolved();

      cube = L(cube);
      cube = L(cube);
      cube = L(cube);
      cube = L(cube);

      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe('B move', () => {
    it('should return to solved state after B × 4', () => {
      let cube = createSolved();

      cube = B(cube);
      cube = B(cube);
      cube = B(cube);
      cube = B(cube);

      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe('Move sequences', () => {
    it('should apply a sequence of moves correctly', () => {
      const cube = createSolved();
      const result = applyMoves(cube, "R U R' U'");

      // Just check it doesn't throw and produces a valid cube
      expect(result.U).toHaveLength(9);
      expect(result).not.toEqual(cube);
    });
  });
});
