/**
 * Color type representing the six faces of a Rubik's Cube
 */
export type Color = "W" | "O" | "G" | "R" | "B" | "Y";

/**
 * Face name type
 */
export type FaceName = "U" | "R" | "F" | "D" | "L" | "B";

/**
 * FaceArray is a fixed-length tuple of 9 colors representing a single face
 * Layout (index):
 *   0 1 2
 *   3 4 5
 *   6 7 8
 */
export type FaceArray = readonly [
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
  Color,
];

/**
 * Cube interface with all six faces explicitly defined
 */
export interface Cube {
  readonly White: FaceArray; // Up (White)
  readonly Red: FaceArray; // Right (Red)
  readonly Green: FaceArray; // Front (Green)
  readonly Yellow: FaceArray; // Down (Yellow)
  readonly Orange: FaceArray; // Left (Orange)
  readonly Blue: FaceArray; // Back (Blue)
}

/**
 * Move type representing valid Rubik's Cube moves
 */
export type Move =
  | "U"
  | "U'"
  | "U2"
  | "R"
  | "R'"
  | "R2"
  | "F"
  | "F'"
  | "F2"
  | "D"
  | "D'"
  | "D2"
  | "L"
  | "L'"
  | "L2"
  | "B"
  | "B'"
  | "B2";
