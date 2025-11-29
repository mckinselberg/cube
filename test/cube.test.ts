import { describe, it, expect } from "vitest";
import { createSolved } from "../src/cube/createSolved.ts";
import { clone } from "../src/cube/clone.ts";
import { rotateFaceClockwise } from "../src/cube/rotateFace.ts";

describe("Cube", () => {
  it("should create a solved cube", () => {
    const cube = createSolved();

    expect(cube.White).toEqual(["W", "W", "W", "W", "W", "W", "W", "W", "W"]);
    expect(cube.Red).toEqual(["R", "R", "R", "R", "R", "R", "R", "R", "R"]);
    expect(cube.Green).toEqual(["G", "G", "G", "G", "G", "G", "G", "G", "G"]);
    expect(cube.Yellow).toEqual(["Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y", "Y"]);
    expect(cube.Orange).toEqual(["O", "O", "O", "O", "O", "O", "O", "O", "O"]);
    expect(cube.Blue).toEqual(["B", "B", "B", "B", "B", "B", "B", "B", "B"]);
  });

  it("should clone a cube without mutation", () => {
    const original = createSolved();
    const cloned = clone(original);

    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
    expect(cloned.White).not.toBe(original.White);
  });

  it("should rotate face clockwise correctly", () => {
    const face = ["A", "B", "C", "D", "E", "F", "G", "H", "I"] as const;
    const rotated = rotateFaceClockwise(face);

    // Original:  A B C    Rotated:  G D A
    //            D E F              H E B
    //            G H I              I F C
    expect(rotated).toEqual(["G", "D", "A", "H", "E", "B", "I", "F", "C"]);
  });
});
