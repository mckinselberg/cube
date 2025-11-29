import type { Cube, Color } from "../cube/types.ts";

type CubeTheme = Record<Color, string>;

const cubeThemes: Record<string, CubeTheme> = {
  classic: {
    W: "#FFFFFF",
    R: "#FF0000",
    G: "#00FF00",
    Y: "#FFFF00",
    O: "#FF8800",
    B: "#0000FF",
  },
  ocean: {
    W: "#F0F4F8",
    R: "#FF6B9D",
    G: "#4ECDC4",
    Y: "#FFD93D",
    O: "#FF8966",
    B: "#667EEA",
  },
  forest: {
    W: "#FAF8F3",
    R: "#C1666B",
    G: "#52B788",
    Y: "#D4A373",
    O: "#D08C60",
    B: "#4A7C59",
  },
  sunset: {
    W: "#FFF8E7",
    R: "#FF6B6B",
    G: "#FFAB73",
    Y: "#FFD93D",
    O: "#FF8C42",
    B: "#F76C6C",
  },
  candy: {
    W: "#FFFFFF",
    R: "#FF6EC7",
    G: "#95E1D3",
    Y: "#FFD93D",
    O: "#FFA36C",
    B: "#A29BFE",
  },
  galaxy: {
    W: "#E8EAF6",
    R: "#9C27B0",
    G: "#00BCD4",
    Y: "#FFC107",
    O: "#FF5722",
    B: "#3F51B5",
  },
  retro: {
    W: "#FFF4E6",
    R: "#E63946",
    G: "#06FFA5",
    Y: "#FFBE0B",
    O: "#FB5607",
    B: "#1D3557",
  },
  cyberpunk: {
    W: "#F0F0F0",
    R: "#FF0080",
    G: "#00FF9F",
    Y: "#FFFF00",
    O: "#FF6600",
    B: "#00D9FF",
  },
  pastel: {
    W: "#FFFFFF",
    R: "#FFB3D9",
    G: "#B3E6CC",
    Y: "#FFFFB3",
    O: "#FFD9B3",
    B: "#B3D9FF",
  },
  mint: {
    W: "#F7FFF7",
    R: "#FF6F91",
    G: "#95E1D3",
    Y: "#FFD97D",
    O: "#FFB085",
    B: "#9ED4D1",
  },
};

let colorMap: CubeTheme = cubeThemes.classic;

export class Canvas2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private faceSize = 40;
  private gap = 4;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2D context");
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
    this.ctx.fillStyle = "#222222";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const s = this.faceSize * 3;
    const g = this.gap;

    // Net layout:
    //       [White]
    // [Orange] [Green] [Red] [Blue]
    //       [Yellow]

    this.drawFace(cube.White, s + g, 0); // Up (White)
    this.drawFace(cube.Orange, 0, s + g); // Left (Orange)
    this.drawFace(cube.Green, s + g, s + g); // Front (Green)
    this.drawFace(cube.Red, (s + g) * 2, s + g); // Right (Red)
    this.drawFace(cube.Blue, (s + g) * 3, s + g); // Back (Blue)
    this.drawFace(cube.Yellow, s + g, (s + g) * 2); // Down (Yellow)
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
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(px, py, this.faceSize, this.faceSize);
    });
  }

  resize(): void {
    // Recalculate size if needed
    this.render = this.render.bind(this);
  }

  setCubeTheme(themeName: string): void {
    if (cubeThemes[themeName]) {
      colorMap = cubeThemes[themeName];
    }
  }
}
