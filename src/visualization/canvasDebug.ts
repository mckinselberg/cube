import type { Cube } from "../cube/types.ts";

/**
 * Renders a debug view of the cube, showing face names and indices instead of colors.
 * Each face is rendered as a 3x3 grid with cell labels like "White[0]", "Red[4]", etc.
 * @param cube - The cube to render
 * @param ctx - The canvas 2D context
 * @param x - X offset
 * @param y - Y offset
 * @param size - Size of each sticker
 */
export function renderCubeDebug(
  cube: Cube,
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number = 32,
) {
  const faces: Array<keyof Cube> = [
    "White",
    "Red",
    "Green",
    "Yellow",
    "Orange",
    "Blue",
  ];
  // Layout: White (U) on top, then Green (F), Red (R), Blue (B), Orange (L), Yellow (D)
  const layout = {
    White: { x: x + size * 3, y: y },
    Green: { x: x + size * 3, y: y + size * 3 },
    Red: { x: x + size * 6, y: y + size * 3 },
    Blue: { x: x, y: y + size * 3 },
    Orange: { x: x - size * 3, y: y + size * 3 },
    Yellow: { x: x + size * 3, y: y + size * 6 },
  };
  ctx.font = `${size / 2}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const face of faces) {
    const { x: fx, y: fy } = layout[face];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      const cx = fx + col * size;
      const cy = fy + row * size;
      ctx.strokeStyle = "#888";
      ctx.strokeRect(cx, cy, size, size);
      ctx.fillStyle = "#222";
      ctx.fillText(`${face}[${i}]`, cx + size / 2, cy + size / 2);
    }
  }
}

/**
 * Returns true if debug mode is enabled (via window.cubeDebug or URL query string)
 */
export function isDebugMode(): boolean {
  if (typeof window !== "undefined") {
    if (window.cubeDebug && window.cubeDebug.enabled) return true;
    if (window.location && window.location.search.includes("debug=true"))
      return true;
  }
  return false;
}
