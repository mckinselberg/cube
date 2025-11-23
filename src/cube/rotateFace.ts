import type { FaceArray } from './types.ts';

/**
 * Rotates a face 90 degrees clockwise
 *
 * Original:     Rotated CW:
 *   0 1 2         6 3 0
 *   3 4 5   =>    7 4 1
 *   6 7 8         8 5 2
 */
export function rotateFaceClockwise(face: FaceArray): FaceArray {
  return [face[6], face[3], face[0], face[7], face[4], face[1], face[8], face[5], face[2]];
}

/**
 * Rotates a face 90 degrees counter-clockwise
 */
export function rotateFaceCounterClockwise(face: FaceArray): FaceArray {
  return [face[2], face[5], face[8], face[1], face[4], face[7], face[0], face[3], face[6]];
}

/**
 * Rotates a face 180 degrees
 */
export function rotateFace180(face: FaceArray): FaceArray {
  return [face[8], face[7], face[6], face[5], face[4], face[3], face[2], face[1], face[0]];
}
