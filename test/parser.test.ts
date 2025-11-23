import { describe, it, expect } from 'vitest';
import { parseMove, applyMove } from '../src/parser/parseMove.ts';
import { applyMoves } from '../src/parser/applyMoves.ts';
import { createSolved } from '../src/cube/createSolved.ts';

describe('Parser', () => {
  describe('parseMove', () => {
    it('should parse valid moves', () => {
      expect(parseMove('U')).toBe('U');
      expect(parseMove("U'")).toBe("U'");
      expect(parseMove('U2')).toBe('U2');
      expect(parseMove('R')).toBe('R');
      expect(parseMove('F')).toBe('F');
      expect(parseMove('D')).toBe('D');
      expect(parseMove('L')).toBe('L');
      expect(parseMove('B')).toBe('B');
    });

    it('should parse moves with whitespace', () => {
      expect(parseMove('  U  ')).toBe('U');
      expect(parseMove(" R' ")).toBe("R'");
    });

    it('should reject invalid moves', () => {
      expect(() => parseMove('X')).toThrow('Invalid move: X');
      expect(() => parseMove('U3')).toThrow('Invalid move: U3');
      expect(() => parseMove('u')).toThrow('Invalid move: u');
      expect(() => parseMove('')).toThrow('Invalid move: ');
    });
  });

  describe('applyMove', () => {
    it('should apply a single move', () => {
      const cube = createSolved();
      const moved = applyMove(cube, 'U');

      expect(moved).not.toEqual(cube);
      expect(moved.U[0]).toBe('W'); // U face should have rotated
    });
  });

  describe('applyMoves', () => {
    it('should apply multiple moves', () => {
      const cube = createSolved();
      const result = applyMoves(cube, "R U R' U'");

      expect(result).not.toEqual(cube);
    });

    it('should handle empty string', () => {
      const cube = createSolved();
      const result = applyMoves(cube, '');

      expect(result).toEqual(cube);
    });

    it('should handle moves with extra whitespace', () => {
      const cube = createSolved();
      const result = applyMoves(cube, '  R   U  ');

      expect(result).not.toEqual(cube);
    });

    it('should throw on invalid moves in sequence', () => {
      const cube = createSolved();

      expect(() => applyMoves(cube, 'R X U')).toThrow('Invalid move: X');
    });

    it('should verify that U×4 equals identity', () => {
      const cube = createSolved();
      const result = applyMoves(cube, 'U U U U');

      expect(result).toEqual(cube);
    });
  });
});
