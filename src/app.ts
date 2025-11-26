import { createSolved, applyMove, parseMove, clone } from "./index.ts";
import type { Cube } from "./cube/types.ts";
import { Canvas2DRenderer } from "./visualization/canvas2D.ts";
import { Canvas3DRenderer } from "./visualization/canvas3D.ts";

class CubeApp {
  private cube: Cube;
  private history: Cube[] = [];
  private renderer2D: Canvas2DRenderer;
  private renderer3D: Canvas3DRenderer;
  private currentMode: "2d" | "3d" = "2d";

  constructor() {
    this.cube = createSolved();
    this.history.push(clone(this.cube));

    // Initialize renderers
    const canvas2D = document.getElementById("canvas-2d") as HTMLCanvasElement;
    const canvas3D = document.getElementById("canvas-3d") as HTMLCanvasElement;

    // Set 3D canvas size BEFORE creating renderer
    canvas3D.width = 600;
    canvas3D.height = 600;

    this.renderer2D = new Canvas2DRenderer(canvas2D);
    this.renderer3D = new Canvas3DRenderer(canvas3D);

    this.setupEventListeners();
    this.render();
  }

  private setupEventListeners(): void {
    // Mode switching
    document.getElementById("mode-2d")?.addEventListener("click", () => {
      this.switchMode("2d");
    });

    document.getElementById("mode-3d")?.addEventListener("click", () => {
      this.switchMode("3d");
    });

    // Move buttons
    document.querySelectorAll(".move-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const move = btn.getAttribute("data-move");
        if (move) this.applyMoveString(move);
      });
    });

    // Apply sequence
    document.getElementById("apply-sequence")?.addEventListener("click", () => {
      const input = document.getElementById(
        "move-sequence",
      ) as HTMLInputElement;
      const sequence = input.value.trim();
      if (sequence) {
        this.applySequence(sequence);
        input.value = "";
      }
    });

    // Sequence input - Enter key
    document
      .getElementById("move-sequence")
      ?.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const input = e.target as HTMLInputElement;
          const sequence = input.value.trim();
          if (sequence) {
            this.applySequence(sequence);
            input.value = "";
          }
        }
      });

    // Scramble
    document.getElementById("scramble")?.addEventListener("click", () => {
      this.scramble();
    });

    // Reset
    document.getElementById("reset")?.addEventListener("click", () => {
      this.reset();
    });

    // Undo
    document.getElementById("undo")?.addEventListener("click", () => {
      this.undo();
    });
  }

  private switchMode(mode: "2d" | "3d"): void {
    this.currentMode = mode;

    const canvas2D = document.getElementById("canvas-2d");
    const canvas3D = document.getElementById("canvas-3d");
    const hint = document.getElementById("hint-3d");
    const btn2D = document.getElementById("mode-2d");
    const btn3D = document.getElementById("mode-3d");

    if (mode === "2d") {
      canvas2D?.classList.add("active");
      canvas3D?.classList.remove("active");
      hint?.classList.remove("visible");
      btn2D?.classList.add("active");
      btn3D?.classList.remove("active");
    } else {
      canvas2D?.classList.remove("active");
      canvas3D?.classList.add("active");
      hint?.classList.add("visible");
      btn2D?.classList.remove("active");
      btn3D?.classList.add("active");
    }

    this.render();
  }

  private applyMoveString(moveStr: string): void {
    try {
      const move = parseMove(moveStr);

      // If 3D mode, animate the move
      if (this.currentMode === "3d") {
        // Animate first with current state, then update
        this.renderer3D.animateMove(moveStr, () => {
          // Update cube state AFTER animation completes
          this.cube = applyMove(this.cube, move);
          this.history.push(clone(this.cube));
          console.log(`After ${moveStr}:`, this.cube);
          this.render(); // Rebuild with new colors
        });
        // Update history immediately for UI feedback
        this.updateHistory(moveStr);
      } else {
        // 2D mode - instant update
        this.cube = applyMove(this.cube, move);
        this.history.push(clone(this.cube));
        console.log(`After ${moveStr}:`, this.cube);
        this.updateHistory(moveStr);
        this.render();
      }
    } catch (error) {
      console.error("Invalid move:", moveStr);
    }
  }

  private applySequence(sequence: string): void {
    const moves = sequence.split(/\s+/).filter((m) => m.length > 0);

    if (this.currentMode === "3d") {
      // Animate each move in sequence
      let index = 0;

      const animateNext = () => {
        if (index >= moves.length) {
          this.history.push(clone(this.cube));
          return;
        }

        const moveStr = moves[index];
        try {
          const move = parseMove(moveStr);
          // Update history immediately for UI feedback
          this.updateHistory(moveStr);

          // Animate first, then update state
          this.renderer3D.animateMove(moveStr, () => {
            // Update state AFTER animation
            this.cube = applyMove(this.cube, move);
            this.render(); // Rebuild with new colors
            index++;
            animateNext();
          });
        } catch (error) {
          console.error("Invalid move in sequence:", moveStr);
          return;
        }
      };

      animateNext();
    } else {
      // 2D mode - instant updates
      for (const moveStr of moves) {
        try {
          const move = parseMove(moveStr);
          this.cube = applyMove(this.cube, move);
          this.updateHistory(moveStr);
        } catch (error) {
          console.error("Invalid move in sequence:", moveStr);
          return;
        }
      }

      this.history.push(clone(this.cube));
      this.render();
    }
  }

  private scramble(): void {
    const moves = [
      "U",
      "U'",
      "U2",
      "R",
      "R'",
      "R2",
      "F",
      "F'",
      "F2",
      "D",
      "D'",
      "D2",
      "L",
      "L'",
      "L2",
      "B",
      "B'",
      "B2",
    ];
    const scrambleLength = 20;
    const scrambleSequence: string[] = [];

    for (let i = 0; i < scrambleLength; i++) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      scrambleSequence.push(randomMove);
    }

    this.applySequence(scrambleSequence.join(" "));
  }

  private reset(): void {
    this.cube = createSolved();
    this.history = [clone(this.cube)];
    this.clearHistory();
    this.render();
  }

  private undo(): void {
    if (this.history.length > 1) {
      this.history.pop();
      this.cube = clone(this.history[this.history.length - 1]);
      this.removeLastHistoryItem();
      this.render();
    }
  }

  private updateHistory(move: string): void {
    const historyDiv = document.getElementById("move-history");
    if (historyDiv) {
      const moveSpan = document.createElement("span");
      moveSpan.className = "history-move";
      moveSpan.textContent = move;
      historyDiv.appendChild(moveSpan);
    }

    const undoBtn = document.getElementById("undo") as HTMLButtonElement;
    if (undoBtn) undoBtn.disabled = false;
  }

  private removeLastHistoryItem(): void {
    const historyDiv = document.getElementById("move-history");
    if (historyDiv && historyDiv.lastChild) {
      historyDiv.removeChild(historyDiv.lastChild);
    }

    const undoBtn = document.getElementById("undo") as HTMLButtonElement;
    if (undoBtn && this.history.length <= 1) {
      undoBtn.disabled = true;
    }
  }

  private clearHistory(): void {
    const historyDiv = document.getElementById("move-history");
    if (historyDiv) {
      historyDiv.innerHTML = "";
    }

    const undoBtn = document.getElementById("undo") as HTMLButtonElement;
    if (undoBtn) undoBtn.disabled = true;
  }

  private render(): void {
    if (this.currentMode === "2d") {
      this.renderer2D.render(this.cube);
    } else {
      this.renderer3D.render(this.cube);
    }
  }
}

// Initialize app when DOM is loaded
new CubeApp();
