import { describe, it, expect } from "vitest";
import { createSolved } from "../src/cube/createSolved.ts";
import { U, R, F, D, L, B } from "../src/moves/index.ts";
import { applyMoves } from "../src/parser/applyMoves.ts";
import type { Cube } from "../src/cube/types.ts";

const scramble = "R U R' U' F2 D L B";

const expected: Cube = {
  White: ["W", "W", "G", "W", "W", "G", "W", "W", "G"],
  Red: ["R", "R", "Y", "R", "R", "Y", "R", "R", "Y"],
  Green: ["G", "G", "Y", "G", "G", "Y", "G", "G", "Y"],
  Yellow: ["Y", "Y", "B", "Y", "Y", "B", "Y", "Y", "B"],
  Orange: ["O", "O", "B", "O", "O", "B", "O", "O", "B"],
  Blue: ["B", "B", "O", "B", "B", "O", "B", "B", "O"],
};

function cubeEquals(a: Cube, b: Cube): boolean {
  return (
    a.White.join("") === b.White.join("") &&
    a.Red.join("") === b.Red.join("") &&
    a.Green.join("") === b.Green.join("") &&
    a.Yellow.join("") === b.Yellow.join("") &&
    a.Orange.join("") === b.Orange.join("") &&
    a.Blue.join("") === b.Blue.join("")
  );
}

describe("Moves", () => {
  describe("U move", () => {
    it("should return to solved state after U × 4", () => {
      let cube = createSolved();
      cube = U(cube);
      cube = U(cube);
      cube = U(cube);
      cube = U(cube);
      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
    it("should not mutate the original cube", () => {
      const original = createSolved();
      const moved = U(original);
      expect(moved).not.toEqual(original);
      expect(original.White).toEqual([
        "W",
        "W",
        "W",
        "W",
        "W",
        "W",
        "W",
        "W",
        "W",
      ]);
    });
  });

  describe("R move", () => {
    it("should return to solved state after R × 4", () => {
      let cube = createSolved();
      cube = R(cube);
      cube = R(cube);
      cube = R(cube);
      cube = R(cube);
      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
    it("should not mutate the original cube", () => {
      const original = createSolved();
      const moved = R(original);
      expect(moved).not.toEqual(original);
      expect(original.Red).toEqual([
        "R",
        "R",
        "R",
        "R",
        "R",
        "R",
        "R",
        "R",
        "R",
      ]);
    });
  });

  describe("F move", () => {
    it("should return to solved state after F × 4", () => {
      let cube = createSolved();
      cube = F(cube);
      cube = F(cube);
      cube = F(cube);
      cube = F(cube);
      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe("D move", () => {
    it("should return to solved state after D × 4", () => {
      let cube = createSolved();
      cube = D(cube);
      cube = D(cube);
      cube = D(cube);
      cube = D(cube);
      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe("L move", () => {
    it("should return to solved state after L × 4", () => {
      let cube = createSolved();
      cube = L(cube);
      cube = L(cube);
      cube = L(cube);
      cube = L(cube);
      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe("B move", () => {
    it("should return to solved state after B × 4", () => {
      let cube = createSolved();
      cube = B(cube);
      cube = B(cube);
      cube = B(cube);
      cube = B(cube);
      const solved = createSolved();
      expect(cube).toEqual(solved);
    });
  });

  describe("Move sequences", () => {
    it("should apply a sequence of moves correctly", () => {
      const cube = createSolved();
      const result = applyMoves(cube, scramble);
      expect(result.White).toHaveLength(9);
      expect(result).not.toEqual(cube);
    });
  });

  describe("Scrambled cube ×4 move invariance", () => {
    it("should return to scrambled state after U × 4", () => {
      let cube = applyMoves(createSolved(), scramble);
      cube = U(cube);
      cube = U(cube);
      cube = U(cube);
      cube = U(cube);
      const scrambled = applyMoves(createSolved(), scramble);
      expect(cube).toEqual(scrambled);
    });
    it("should return to scrambled state after R × 4", () => {
      let cube = applyMoves(createSolved(), scramble);
      cube = R(cube);
      cube = R(cube);
      cube = R(cube);
      cube = R(cube);
      const scrambled = applyMoves(createSolved(), scramble);
      expect(cube).toEqual(scrambled);
    });
    it("should return to scrambled state after F × 4", () => {
      let cube = applyMoves(createSolved(), scramble);
      cube = F(cube);
      cube = F(cube);
      cube = F(cube);
      cube = F(cube);
      const scrambled = applyMoves(createSolved(), scramble);
      expect(cube).toEqual(scrambled);
    });
    it("should return to scrambled state after D × 4", () => {
      let cube = applyMoves(createSolved(), scramble);
      cube = D(cube);
      cube = D(cube);
      cube = D(cube);
      cube = D(cube);
      const scrambled = applyMoves(createSolved(), scramble);
      expect(cube).toEqual(scrambled);
    });
    it("should return to scrambled state after L × 4", () => {
      let cube = applyMoves(createSolved(), scramble);
      cube = L(cube);
      cube = L(cube);
      cube = L(cube);
      cube = L(cube);
      const scrambled = applyMoves(createSolved(), scramble);
      expect(cube).toEqual(scrambled);
    });
    it("should return to scrambled state after B × 4", () => {
      let cube = applyMoves(createSolved(), scramble);
      cube = B(cube);
      cube = B(cube);
      cube = B(cube);
      cube = B(cube);
      const scrambled = applyMoves(createSolved(), scramble);
      expect(cube).toEqual(scrambled);
    });
  });

  describe("Cube scramble accuracy", () => {
    it("produces the expected state for a known scramble", () => {
      const solved = createSolved();
      const scrambled = applyMoves(solved, scramble);
      expect(cubeEquals(scrambled, expected)).toBe(true);
    });
  });
});
