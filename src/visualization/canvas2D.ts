import type { Cube, Color } from '../cube/types.ts';

const colorMap: Record<Color, string> = {
  W: '#FFFFFF',
  R: '#FF0000',
  G: '#00FF00',
  Y: '#FFFF00',
  O: '#FF8800',
  B: '#0000FF',
};

export class Canvas2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private faceSize = 40;
  private gap = 4;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;

    // Set canvas size for net layout
    // Layout: 3 faces wide, 4 faces tall
    const width = this.faceSize * 3 * 4 + this.gap * 3;
    const height = this.faceSize * 3 * 4 + this.gap * 4;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  render(cube: Cube): void {
    // Clear canvas
    this.ctx.fillStyle = '#222222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const s = this.faceSize * 3;
    const g = this.gap;

    // Net layout:
    //       [U]
    //  [L]  [F]  [R]  [B]
    //       [D]

    this.drawFace(cube.U, s + g, 0);           // U: top center
    this.drawFace(cube.L, 0, s + g);           // L: middle left
    this.drawFace(cube.F, s + g, s + g);       // F: middle center
    this.drawFace(cube.R, (s + g) * 2, s + g); // R: middle right
    this.drawFace(cube.B, (s + g) * 3, s + g); // B: middle far right
    this.drawFace(cube.D, s + g, (s + g) * 2); // D: bottom center
  }

  private drawFace(face: readonly Color[], x: number, y: number): void {
    face.forEach((color, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const px = x + col * this.faceSize;
      const py = y + row * this.faceSize;

      // Fill facelet
      this.ctx.fillStyle = colorMap[color];
      this.ctx.fillRect(px, py, this.faceSize, this.faceSize);

      // Draw border
      this.ctx.strokeStyle = '#000000';
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(px, py, this.faceSize, this.faceSize);
    });
  }

  resize(): void {
    // Recalculate size if needed
    this.render = this.render.bind(this);
  }
}
