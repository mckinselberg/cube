import { createSolved, applyMove, parseMove, clone } from "./index.ts";
import type { Cube } from "./cube/types.ts";
import { Canvas2DRenderer } from "./visualization/canvas2D.ts";
import { Canvas3DRenderer } from "./visualization/canvas3D.ts";
import { Tooltip } from "./meta/Tooltip.ts";
import { CubeSoundEffects } from "./audio/CubeSoundEffects.ts";

class CubeApp {
  private cube: Cube;
  private history: Cube[] = [];
  private renderer2D: Canvas2DRenderer;
  private renderer3D: Canvas3DRenderer;
  private currentMode: "2d" | "3d" = "3d";
  private soundEffects: CubeSoundEffects;
  private algorithms = {
    beginner: {
      "Sexy Move": {
        sequence: "R U R' U'",
        description: "Basic move used in many beginner algorithms",
      },
      "Right Trigger": {
        sequence: "R U R' U'",
        description: "Brings edge pieces into position",
      },
      "Left Trigger": {
        sequence: "L' U' L U",
        description: "Mirror of right trigger",
      },
      Sune: {
        sequence: "R U R' U R U2 R'",
        description: "Orients last layer corners",
      },
      "Anti-Sune": {
        sequence: "R U2 R' U' R U' R'",
        description: "Reverse of Sune",
      },
    },
    oll: {
      "OLL 21 (H)": {
        sequence: "F R U R' U' R U R' U' F'",
        description: "Orients edges in H pattern",
      },
      "OLL 27 (Line)": {
        sequence: "F R U R' U' F'",
        description: "Orients edges in line pattern",
      },
      "OLL 45 (T)": {
        sequence: "F R U R' U' F'",
        description: "T-shaped pattern",
      },
      "OLL 57 (Gun)": {
        sequence: "R U R' U' R' F R F'",
        description: "Small lightning bolt shape",
      },
    },
    pll: {
      "T-Perm": {
        sequence: "R U R' U' R' F R2 U' R' U' R U R' F'",
        description: "Swaps adjacent corners and edges",
      },
      "Y-Perm": {
        sequence: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
        description: "Diagonal corner swap",
      },
      "Ua-Perm": {
        sequence: "R U' R U R U R U' R' U' R2",
        description: "3-edge cycle clockwise",
      },
      "Ub-Perm": {
        sequence: "R2 U R U R' U' R' U' R' U R'",
        description: "3-edge cycle counter-clockwise",
      },
      "H-Perm": {
        sequence: "M2 U M2 U2 M2 U M2",
        description: "Opposite edge swap (Note: M moves not supported)",
      },
    },
    f2l: {
      "Basic F2L #1": {
        sequence: "U R U' R'",
        description: "Corner and edge already paired",
      },
      "Basic F2L #2": {
        sequence: "U' F' U F",
        description: "Left-hand version",
      },
      "Split Pair": {
        sequence: "R U' R' U R U R'",
        description: "Separate and rejoin corner-edge pair",
      },
      "Corner Up Edge Front": {
        sequence: "U R U2 R' U R U' R'",
        description: "Corner in U, edge in front slot",
      },
    },
    tricks: {
      Superflip: {
        sequence: "U R2 F B R B2 R U2 L B2 R U' D' R2 F R' L B2 U2 F2",
        description: "Flips all edges while keeping corners solved",
      },
      Checkerboard: {
        sequence: "M2 E2 S2",
        description:
          "Creates checkerboard pattern (Note: M,E,S moves not supported, use alternative)",
      },
      "Cube in Cube": {
        sequence: "F L F U' R U F2 L2 U' L' B D' B' L2 U",
        description: "Creates cube within cube pattern",
      },
      "6 Dots": {
        sequence: "U D' R L' F B' U D'",
        description: "Creates 6 dot pattern",
      },
      "4 Crosses": {
        sequence: "U R L' U2 R' L U R L' U2 R' L",
        description: "Creates cross pattern on all faces",
      },
    },
  };

  constructor() {
    this.cube = createSolved();
    this.history.push(clone(this.cube));

    // Initialize sound effects
    this.soundEffects = new CubeSoundEffects();
    this.soundEffects.loadPreferences();

    // Initialize renderers
    const canvas2D = document.getElementById("canvas-2d") as HTMLCanvasElement;
    const canvas3D = document.getElementById("canvas-3d") as HTMLCanvasElement;

    // Set 3D canvas size BEFORE creating renderer
    canvas3D.width = 600;
    canvas3D.height = 600;

    this.renderer2D = new Canvas2DRenderer(canvas2D);
    this.renderer3D = new Canvas3DRenderer(canvas3D);

    this.loadThemePreference();
    this.loadPanelStates();
    this.loadViewMode();
    this.loadAlgorithmSelection();
    this.setupMobileMoveButtons();
    this.setupResizableColumns();
    this.setupEventListeners();
    this.render();
  }

  private savePanelState(panelId: string, isOpen: boolean): void {
    localStorage.setItem(`panel-state-${panelId}`, isOpen.toString());
  }

  private loadPanelStates(): void {
    // Find all details elements and restore their states
    const panels = document.querySelectorAll("details");
    panels.forEach((panel, index) => {
      const summary = panel.querySelector("summary");
      if (!summary) return;

      // Create a unique ID based on summary text
      const panelId =
        summary.textContent
          ?.trim()
          .replace(/[^a-zA-Z0-9]/g, "-")
          .toLowerCase() || `panel-${index}`;
      const savedState = localStorage.getItem(`panel-state-${panelId}`);

      if (savedState !== null) {
        panel.open = savedState === "true";
      }

      // Add toggle listener to save state
      panel.addEventListener("toggle", () => {
        this.savePanelState(panelId, panel.open);
      });
    });
  }

  private saveViewMode(mode: "2d" | "3d"): void {
    localStorage.setItem("view-mode", mode);
  }

  private loadViewMode(): void {
    const savedMode = localStorage.getItem("view-mode") as "2d" | "3d" | null;
    if (savedMode && (savedMode === "2d" || savedMode === "3d")) {
      this.switchMode(savedMode);
    }
  }

  private saveAlgorithmSelection(category: string, algorithm: string): void {
    if (category) {
      localStorage.setItem("algorithm-category", category);
    }
    if (algorithm) {
      localStorage.setItem("algorithm-selection", algorithm);
    }
  }

  private loadAlgorithmSelection(): void {
    const savedCategory = localStorage.getItem("algorithm-category");
    const savedAlgorithm = localStorage.getItem("algorithm-selection");

    if (savedCategory) {
      const categorySelect = document.getElementById(
        "algorithm-category",
      ) as HTMLSelectElement;
      if (categorySelect) {
        categorySelect.value = savedCategory;
        this.updateAlgorithmList(savedCategory);

        // After updating the list, restore the algorithm selection
        if (savedAlgorithm) {
          setTimeout(() => {
            const algorithmSelect = document.getElementById(
              "algorithm-select",
            ) as HTMLSelectElement;
            if (algorithmSelect) {
              algorithmSelect.value = savedAlgorithm;
              this.showAlgorithmInfo(savedAlgorithm);
            }
          }, 0);
        }
      }
    }
  }

  private setupResizableColumns(): void {
    const leftColumn = document.querySelector(".controls-left") as HTMLElement;
    const rightColumn = document.querySelector(
      ".controls-right",
    ) as HTMLElement;

    if (!leftColumn || !rightColumn) return;

    // Setup left column resize
    const leftHandle = leftColumn.querySelector(
      ".resize-handle",
    ) as HTMLElement;
    if (leftHandle) {
      this.setupResizeHandle(leftHandle, leftColumn, "left");
    }

    // Setup right column resize
    const rightHandle = rightColumn.querySelector(
      ".resize-handle",
    ) as HTMLElement;
    if (rightHandle) {
      this.setupResizeHandle(rightHandle, rightColumn, "right");
    }

    // Load saved widths
    const savedLeftWidth = localStorage.getItem("left-column-width");
    if (savedLeftWidth) {
      leftColumn.style.flexBasis = savedLeftWidth;
    }

    const savedRightWidth = localStorage.getItem("right-column-width");
    if (savedRightWidth) {
      rightColumn.style.flexBasis = savedRightWidth;
    }
  }

  private setupResizeHandle(
    handle: HTMLElement,
    column: HTMLElement,
    side: "left" | "right",
  ): void {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    const startResize = (e: MouseEvent) => {
      isResizing = true;
      startX = e.clientX;
      startWidth = column.offsetWidth;
      handle.classList.add("dragging");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      e.preventDefault();
    };

    const resize = (e: MouseEvent) => {
      if (!isResizing) return;

      const delta = side === "left" ? e.clientX - startX : startX - e.clientX;
      const newWidth = Math.max(200, Math.min(500, startWidth + delta));

      column.style.flexBasis = `${newWidth}px`;
    };

    const stopResize = () => {
      if (!isResizing) return;

      isResizing = false;
      handle.classList.remove("dragging");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      // Save width to localStorage
      const storageKey =
        side === "left" ? "left-column-width" : "right-column-width";
      localStorage.setItem(storageKey, column.style.flexBasis);
    };

    handle.addEventListener("mousedown", startResize);
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  }

  private setupMobileMoveButtons(): void {
    const canvasContainer = document.querySelector(".canvas-container");
    if (!canvasContainer) return;

    // Create left column (U, F, D)
    const leftMoves = document.createElement("div");
    leftMoves.className = "mobile-moves-left";
    leftMoves.innerHTML = `
      <button class="mobile-move-btn" data-move="U">U</button>
      <button class="mobile-move-btn" data-move="F">F</button>
      <button class="mobile-move-btn" data-move="D">D</button>
    `;

    // Create right column (R, B, L)
    const rightMoves = document.createElement("div");
    rightMoves.className = "mobile-moves-right";
    rightMoves.innerHTML = `
      <button class="mobile-move-btn" data-move="R">R</button>
      <button class="mobile-move-btn" data-move="B">B</button>
      <button class="mobile-move-btn" data-move="L">L</button>
    `;

    // Insert before and after canvas
    const canvas = canvasContainer.querySelector("canvas");
    if (canvas) {
      canvasContainer.insertBefore(leftMoves, canvas);
      canvasContainer.appendChild(rightMoves);
    }

    // Setup tap/long-press behavior for mobile buttons
    document.querySelectorAll(".mobile-move-btn").forEach((btn) => {
      let pressTimer: number | null = null;
      let lastTap = 0;
      let isPressing = false;

      const handleStart = (e: Event) => {
        if (e.type === "touchstart") e.preventDefault();
        const button = btn as HTMLElement;
        const move = button.getAttribute("data-move") || "";

        const now = Date.now();
        const timeSinceLastTap = now - lastTap;

        // Double tap detection (< 300ms)
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
          if (pressTimer) clearTimeout(pressTimer);
          this.applyMoveString(move + "2");
          button.style.background = "var(--accent-color)";
          setTimeout(() => {
            button.style.background = "";
          }, 200);
          lastTap = 0;
          isPressing = false;
          return;
        }

        lastTap = now;
        isPressing = true;

        // Long press detection (> 500ms)
        pressTimer = window.setTimeout(() => {
          if (isPressing) {
            this.applyMoveString(move + "'");
            button.style.background = "var(--secondary-color)";
            setTimeout(() => {
              button.style.background = "";
            }, 200);
            isPressing = false;
          }
          pressTimer = null;
        }, 500);
      };

      const handleEnd = (e: Event) => {
        if (e.type === "touchend") e.preventDefault();
        const button = btn as HTMLElement;
        const move = button.getAttribute("data-move") || "";

        // If still pressing and timer exists, it's a short tap
        if (isPressing && pressTimer !== null) {
          clearTimeout(pressTimer);
          this.applyMoveString(move);
          button.style.background = "var(--primary-color)";
          setTimeout(() => {
            button.style.background = "";
          }, 200);
        }

        isPressing = false;
        pressTimer = null;
      };

      const handleCancel = () => {
        if (pressTimer) clearTimeout(pressTimer);
        isPressing = false;
        pressTimer = null;
      };

      // Touch events for mobile
      btn.addEventListener("touchstart", handleStart);
      btn.addEventListener("touchend", handleEnd);
      btn.addEventListener("touchcancel", handleCancel);

      // Mouse events for desktop testing
      btn.addEventListener("mousedown", handleStart);
      btn.addEventListener("mouseup", handleEnd);
      btn.addEventListener("mouseleave", handleCancel);
    });

    // Add tooltip to first mobile button only - with longer delay to ensure DOM is ready
    setTimeout(() => {
      const firstMobileBtn = document.querySelector(".mobile-move-btn");
      if (firstMobileBtn && window.innerWidth <= 1200) {
        console.log("Creating tooltip on:", firstMobileBtn);
        new Tooltip(firstMobileBtn as HTMLElement, {
          id: "mobile-moves-gestures",
          message:
            "💡 <strong>Tip:</strong> Tap for normal move, long press for prime ('), double tap for double move (2)",
          position: "bottom",
          arrowPosition: "start",
          autoDismiss: 8000,
          delay: 500,
        });
      } else {
        console.log(
          "Tooltip not created - button not found or not mobile view",
        );
      }
    }, 1000);
  }

  private setupMobileCollapsible(): void {
    // Make control sections collapsible on mobile
    if (window.innerWidth <= 1200) {
      document.querySelectorAll(".control-section").forEach((section) => {
        const heading = section.querySelector("h3");
        if (!heading) return;

        // Don't make these sections collapsible (keep them accessible above fold)
        const importantSections = [
          "View Mode",
          "Actions",
          "Sequence Input",
          "🧩 Algorithms",
        ];
        if (
          importantSections.some((text) => heading.textContent?.includes(text))
        ) {
          section.classList.add("important");
          return;
        }

        // Collapse sections below the fold by default
        const collapsedByDefault = [
          "Cube Moves",
          "🎨 Cube Colors",
          "Move History",
        ];
        if (
          collapsedByDefault.some((text) => heading.textContent?.includes(text))
        ) {
          section.classList.add("collapsed");
        }

        heading.addEventListener("click", () => {
          section.classList.toggle("collapsed");
        });
      });
    }
  }

  private setupEventListeners(): void {
    // Setup collapsible sections for mobile
    this.setupMobileCollapsible();

    // Theme switching
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const theme = btn.getAttribute("data-theme");
        if (theme) this.switchTheme(theme);
      });
    });

    // Cube theme switching
    document.querySelectorAll(".cube-theme-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cubeTheme = btn.getAttribute("data-cube-theme");
        if (cubeTheme) this.switchCubeTheme(cubeTheme, btn);
      });
    });

    // Mode switching
    document.getElementById("mode-2d")?.addEventListener("click", () => {
      this.switchMode("2d");
    });

    document.getElementById("mode-3d")?.addEventListener("click", () => {
      this.switchMode("3d");
    });

    // Toggle face labels
    document.getElementById("toggle-labels")?.addEventListener("click", () => {
      this.toggleLabels();
    });

    // Lighting controls
    const brightnessSlider = document.getElementById(
      "brightness-slider",
    ) as HTMLInputElement;
    const brightnessValue = document.getElementById("brightness-value");
    brightnessSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.renderer3D.setBrightness(value);
      if (brightnessValue) {
        brightnessValue.textContent = `${Math.round(value * 100)}%`;
      }
    });

    const lightAngleSlider = document.getElementById(
      "light-angle-slider",
    ) as HTMLInputElement;
    const lightAngleValue = document.getElementById("light-angle-value");
    lightAngleSlider?.addEventListener("input", (e) => {
      const value = parseInt((e.target as HTMLInputElement).value);
      this.renderer3D.setLightAngle(value);
      if (lightAngleValue) {
        lightAngleValue.textContent = `${value}°`;
      }
    });

    // Move buttons (desktop only - mobile has custom handling)
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

    // Algorithm controls
    const categorySelect = document.getElementById(
      "algorithm-category",
    ) as HTMLSelectElement;
    const algorithmSelect = document.getElementById(
      "algorithm-select",
    ) as HTMLSelectElement;
    const applyAlgorithmBtn = document.getElementById("apply-algorithm");

    categorySelect?.addEventListener("change", (e) => {
      const category = (e.target as HTMLSelectElement).value;
      this.updateAlgorithmList(category);
      this.saveAlgorithmSelection(category, "");
    });

    algorithmSelect?.addEventListener("change", (e) => {
      const algorithmName = (e.target as HTMLSelectElement).value;
      this.showAlgorithmInfo(algorithmName);
      const category = categorySelect?.value || "";
      this.saveAlgorithmSelection(category, algorithmName);
    });

    applyAlgorithmBtn?.addEventListener("click", () => {
      const category = categorySelect?.value;
      const algorithmName = algorithmSelect?.value;
      if (category && algorithmName) {
        this.applyAlgorithm(category, algorithmName);
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

    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      this.handleKeyPress(e);
    });

    // Sound controls
    this.setupSoundControls();
  }

  private setupSoundControls(): void {
    // Preset selector
    const presetSelect = document.getElementById(
      "sound-preset",
    ) as HTMLSelectElement;
    presetSelect?.addEventListener("change", (e) => {
      const preset = (e.target as HTMLSelectElement).value as
        | "balanced"
        | "enhanced";
      this.soundEffects.setPreset(preset);
    });

    // Volume
    const volumeSlider = document.getElementById(
      "sound-volume",
    ) as HTMLInputElement;
    const volumeValue = document.getElementById("sound-volume-value");
    volumeSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setVolume(value);
      if (volumeValue) volumeValue.textContent = `${Math.round(value * 100)}%`;
    });

    // 3-Band EQ
    const lowSlider = document.getElementById("sound-low") as HTMLInputElement;
    const lowValue = document.getElementById("sound-low-value");
    lowSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setLowGain(value);
      if (lowValue) lowValue.textContent = `${value.toFixed(1)} dB`;
    });

    const midSlider = document.getElementById("sound-mid") as HTMLInputElement;
    const midValue = document.getElementById("sound-mid-value");
    midSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setMidGain(value);
      if (midValue) midValue.textContent = `${value.toFixed(1)} dB`;
    });

    const highSlider = document.getElementById(
      "sound-high",
    ) as HTMLInputElement;
    const highValue = document.getElementById("sound-high-value");
    highSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setHighGain(value);
      if (highValue) highValue.textContent = `${value.toFixed(1)} dB`;
    });

    // Brightness filter
    const brightnessSlider = document.getElementById(
      "sound-brightness",
    ) as HTMLInputElement;
    const brightnessValue = document.getElementById("sound-brightness-value");
    brightnessSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setBrightness(value);
      if (brightnessValue)
        brightnessValue.textContent = `${Math.round(value * 100)}%`;
    });

    // Envelope
    const attackSlider = document.getElementById(
      "sound-attack",
    ) as HTMLInputElement;
    const attackValue = document.getElementById("sound-attack-value");
    attackSlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setAttack(value);
      if (attackValue)
        attackValue.textContent = `${(value * 1000).toFixed(1)} ms`;
    });

    const decaySlider = document.getElementById(
      "sound-decay",
    ) as HTMLInputElement;
    const decayValue = document.getElementById("sound-decay-value");
    decaySlider?.addEventListener("input", (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value);
      this.soundEffects.setDecay(value);
      if (decayValue) decayValue.textContent = `${Math.round(value * 1000)} ms`;
    });

    // Export Settings button
    const exportBtn = document.getElementById("export-sound-settings");
    exportBtn?.addEventListener("click", () => {
      this.soundEffects.exportCurrentSettings();
    });

    // Load saved values and update UI
    this.loadSoundPreferences();
  }

  private loadSoundPreferences(): void {
    // Restore preset selector
    const presetSelect = document.getElementById(
      "sound-preset",
    ) as HTMLSelectElement;
    if (presetSelect) {
      presetSelect.value = this.soundEffects.getPreset();
    }

    // Update slider values from saved preferences
    const volumeSlider = document.getElementById(
      "sound-volume",
    ) as HTMLInputElement;
    const volumeValue = document.getElementById("sound-volume-value");
    if (volumeSlider) {
      volumeSlider.value = this.soundEffects.getVolume().toString();
      if (volumeValue)
        volumeValue.textContent = `${Math.round(this.soundEffects.getVolume() * 100)}%`;
    }

    const lowSlider = document.getElementById("sound-low") as HTMLInputElement;
    const lowValue = document.getElementById("sound-low-value");
    if (lowSlider) {
      lowSlider.value = this.soundEffects.getLowGain().toString();
      if (lowValue)
        lowValue.textContent = `${this.soundEffects.getLowGain().toFixed(1)} dB`;
    }

    const midSlider = document.getElementById("sound-mid") as HTMLInputElement;
    const midValue = document.getElementById("sound-mid-value");
    if (midSlider) {
      midSlider.value = this.soundEffects.getMidGain().toString();
      if (midValue)
        midValue.textContent = `${this.soundEffects.getMidGain().toFixed(1)} dB`;
    }

    const highSlider = document.getElementById(
      "sound-high",
    ) as HTMLInputElement;
    const highValue = document.getElementById("sound-high-value");
    if (highSlider) {
      highSlider.value = this.soundEffects.getHighGain().toString();
      if (highValue)
        highValue.textContent = `${this.soundEffects.getHighGain().toFixed(1)} dB`;
    }

    const brightnessSlider = document.getElementById(
      "sound-brightness",
    ) as HTMLInputElement;
    const brightnessValue = document.getElementById("sound-brightness-value");
    if (brightnessSlider) {
      brightnessSlider.value = this.soundEffects.getBrightness().toString();
      if (brightnessValue)
        brightnessValue.textContent = `${Math.round(this.soundEffects.getBrightness() * 100)}%`;
    }

    const attackSlider = document.getElementById(
      "sound-attack",
    ) as HTMLInputElement;
    const attackValue = document.getElementById("sound-attack-value");
    if (attackSlider) {
      attackSlider.value = this.soundEffects.getAttack().toString();
      if (attackValue)
        attackValue.textContent = `${(this.soundEffects.getAttack() * 1000).toFixed(1)} ms`;
    }

    const decaySlider = document.getElementById(
      "sound-decay",
    ) as HTMLInputElement;
    const decayValue = document.getElementById("sound-decay-value");
    if (decaySlider) {
      decaySlider.value = this.soundEffects.getDecay().toString();
      if (decayValue)
        decayValue.textContent = `${Math.round(this.soundEffects.getDecay() * 1000)} ms`;
    }
  }

  private handleKeyPress(e: KeyboardEvent): void {
    // Ignore if typing in input field
    if (e.target instanceof HTMLInputElement) return;

    // Prevent default for our shortcuts
    const validKeys = ["u", "r", "f", "d", "l", "b", "z"];
    if (validKeys.includes(e.key.toLowerCase())) {
      e.preventDefault();
    }

    const shift = e.shiftKey;
    const ctrl = e.ctrlKey || e.metaKey;
    const key = e.key.toLowerCase();

    // Special shortcuts
    if (ctrl && key === "z") {
      this.undo();
      return;
    }

    // Move shortcuts
    const moveMap: Record<string, string> = {
      u: "U",
      r: "R",
      f: "F",
      d: "D",
      l: "L",
      b: "B",
    };

    const baseMove = moveMap[key];
    if (!baseMove) return;

    let move = baseMove;
    if (shift && ctrl) {
      // Shift + Ctrl = double move (U2, R2, etc.)
      move = baseMove + "2";
    } else if (shift) {
      // Shift = prime move (U', R', etc.)
      move = baseMove + "'";
    }

    this.applyMoveString(move);
  }

  private switchTheme(theme: string): void {
    // Remove active class from all theme buttons
    document.querySelectorAll(".theme-btn").forEach((btn) => {
      btn.classList.remove("active");
    });

    // Add active class to selected theme button
    const selectedBtn = document.querySelector(
      `.theme-btn[data-theme="${theme}"]`,
    );
    selectedBtn?.classList.add("active");

    // Apply theme to document
    if (theme === "cyber-blue") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", theme);
    }

    // Save theme preference
    localStorage.setItem("cube-theme", theme);
  }

  private loadThemePreference(): void {
    const savedTheme = localStorage.getItem("cube-theme");
    if (savedTheme && savedTheme !== "cyber-blue") {
      this.switchTheme(savedTheme);
    }

    // Load cube color theme
    const savedCubeTheme = localStorage.getItem("cube-color-theme");
    if (savedCubeTheme) {
      const btn = document.querySelector(
        `[data-cube-theme="${savedCubeTheme}"]`,
      );
      if (btn) this.switchCubeTheme(savedCubeTheme, btn);
    }
  }

  private switchCubeTheme(themeName: string, btn: Element): void {
    // Remove active class from all cube theme buttons
    document.querySelectorAll(".cube-theme-btn").forEach((b) => {
      b.classList.remove("active");
    });

    // Add active class to selected button
    btn.classList.add("active");

    // Apply theme to both renderers
    this.renderer3D.setCubeTheme(themeName);
    this.renderer2D.setCubeTheme(themeName);

    // Re-render to show new colors
    this.render();

    // Save preference
    localStorage.setItem("cube-color-theme", themeName);
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

    // Save view mode preference
    this.saveViewMode(mode);

    this.render();
  }

  private applyMoveString(moveStr: string): void {
    try {
      const move = parseMove(moveStr);

      // Play appropriate sound effect
      this.playSoundForMove(moveStr);

      // If 3D mode, animate the move
      if (this.currentMode === "3d") {
        // Animate first with current state, then update
        this.renderer3D.animateMove(moveStr, () => {
          // Update cube state AFTER animation completes
          this.cube = applyMove(this.cube, move);
          this.history.push(clone(this.cube));
          this.render(); // Rebuild with new colors
        });
        // Update history immediately for UI feedback
        this.updateHistory(moveStr);
      } else {
        // 2D mode - instant update
        this.cube = applyMove(this.cube, move);
        this.history.push(clone(this.cube));
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
      // 2D mode - animate with delays
      let index = 0;
      const animationDelay = 150; // ms between moves

      const animateNext = () => {
        if (index >= moves.length) {
          this.history.push(clone(this.cube));
          return;
        }

        const moveStr = moves[index];
        try {
          const move = parseMove(moveStr);
          this.cube = applyMove(this.cube, move);
          this.updateHistory(moveStr);
          this.render();

          index++;
          setTimeout(animateNext, animationDelay);
        } catch (error) {
          console.error("Invalid move in sequence:", moveStr);
          return;
        }
      };

      animateNext();
    }
  }

  private playSoundForMove(moveStr: string): void {
    // Extract face from move notation (U, R, F, D, L, B)
    const face = moveStr.charAt(0);
    const isPrime = moveStr.includes("'");
    const isDouble = moveStr.includes("2");

    this.soundEffects.playMoveForFace(face, isPrime, isDouble);
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

    // Play scramble sound
    this.soundEffects.playScrambleSound();

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

  private toggleLabels(): void {
    const labelsVisible = this.renderer3D.toggleLabels();
    const btn = document.getElementById("toggle-labels");
    if (btn) {
      if (labelsVisible) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  }

  private updateAlgorithmList(category: string): void {
    const algorithmSelect = document.getElementById(
      "algorithm-select",
    ) as HTMLSelectElement;
    const applyBtn = document.getElementById(
      "apply-algorithm",
    ) as HTMLButtonElement;
    const algorithmInfo = document.getElementById("algorithm-info");

    if (!algorithmSelect) return;

    // Clear previous options
    algorithmSelect.innerHTML =
      '<option value="">Choose an algorithm...</option>';

    if (!category) {
      algorithmSelect.disabled = true;
      applyBtn.disabled = true;
      algorithmInfo?.classList.remove("visible");
      return;
    }

    // Populate with algorithms from selected category
    const algorithms =
      this.algorithms[category as keyof typeof this.algorithms];
    Object.keys(algorithms).forEach((name) => {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      algorithmSelect.appendChild(option);
    });

    algorithmSelect.disabled = false;
    algorithmInfo?.classList.remove("visible");
  }

  private showAlgorithmInfo(algorithmName: string): void {
    const categorySelect = document.getElementById(
      "algorithm-category",
    ) as HTMLSelectElement;
    const applyBtn = document.getElementById(
      "apply-algorithm",
    ) as HTMLButtonElement;
    const algorithmInfo = document.getElementById("algorithm-info");

    if (!algorithmName || !algorithmInfo) {
      algorithmInfo?.classList.remove("visible");
      if (applyBtn) applyBtn.disabled = true;
      return;
    }

    const category = categorySelect.value as keyof typeof this.algorithms;
    const algorithms = this.algorithms[category];

    // Type-safe algorithm lookup
    type AlgorithmEntry = { sequence: string; description: string };
    const algorithm = (algorithms as Record<string, AlgorithmEntry>)[
      algorithmName
    ];

    if (algorithm) {
      algorithmInfo.innerHTML = `
        <strong>${algorithmName}</strong>
        ${algorithm.description}<br>
        <code>${algorithm.sequence}</code>
      `;
      algorithmInfo.classList.add("visible");
      if (applyBtn) applyBtn.disabled = false;
    }
  }

  private applyAlgorithm(category: string, algorithmName: string): void {
    const algorithms =
      this.algorithms[category as keyof typeof this.algorithms];
    type AlgorithmEntry = { sequence: string; description: string };
    const algorithm = (algorithms as Record<string, AlgorithmEntry>)[
      algorithmName
    ];

    if (algorithm) {
      this.applySequence(algorithm.sequence);
    }
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
const app = new CubeApp();

// Expose sound effects to console for debugging
(window as unknown as { cubeSound: CubeSoundEffects }).cubeSound = app[
  "soundEffects"
] as CubeSoundEffects;
(window as unknown as { testSound: () => void }).testSound = () => {
  console.log(
    "Audio State:",
    (app["soundEffects"] as CubeSoundEffects).getAudioState(),
  );
  (app["soundEffects"] as CubeSoundEffects).playMoveForFace("U", false, false);
  console.log("Played test sound for U move");
};
