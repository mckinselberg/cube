import * as THREE from "three";
import type { Cube, Color } from "../cube/types.ts";

type CubeTheme = Record<Color, number>;

const cubeThemes: Record<string, CubeTheme> = {
  classic: {
    W: 0xffffff,
    R: 0xff0000,
    G: 0x00ff00,
    Y: 0xffff00,
    O: 0xff8800,
    B: 0x0000ff,
  },
  ocean: {
    W: 0xf0f4f8,
    R: 0xff6b9d,
    G: 0x4ecdc4,
    Y: 0xffd93d,
    O: 0xff8966,
    B: 0x667eea,
  },
  forest: {
    W: 0xfaf8f3,
    R: 0xc1666b,
    G: 0x52b788,
    Y: 0xd4a373,
    O: 0xd08c60,
    B: 0x4a7c59,
  },
  sunset: {
    W: 0xfff8e7,
    R: 0xff6b6b,
    G: 0xffab73,
    Y: 0xffd93d,
    O: 0xff8c42,
    B: 0xf76c6c,
  },
  candy: {
    W: 0xffffff,
    R: 0xff6ec7,
    G: 0x95e1d3,
    Y: 0xffd93d,
    O: 0xffa36c,
    B: 0xa29bfe,
  },
  galaxy: {
    W: 0xe8eaf6,
    R: 0x9c27b0,
    G: 0x00bcd4,
    Y: 0xffc107,
    O: 0xff5722,
    B: 0x3f51b5,
  },
  retro: {
    W: 0xfff4e6,
    R: 0xe63946,
    G: 0x06ffa5,
    Y: 0xffbe0b,
    O: 0xfb5607,
    B: 0x1d3557,
  },
  cyberpunk: {
    W: 0xf0f0f0,
    R: 0xff0080,
    G: 0x00ff9f,
    Y: 0xffff00,
    O: 0xff6600,
    B: 0x00d9ff,
  },
  pastel: {
    W: 0xffffff,
    R: 0xffb3d9,
    G: 0xb3e6cc,
    Y: 0xffffb3,
    O: 0xffd9b3,
    B: 0xb3d9ff,
  },
  mint: {
    W: 0xf7fff7,
    R: 0xff6f91,
    G: 0x95e1d3,
    Y: 0xffd97d,
    O: 0xffb085,
    B: 0x9ed4d1,
  },
};

let colorMap: CubeTheme = cubeThemes.classic;

type TextureType = "matte" | "glossy" | "metallic" | "plastic" | "satin";

interface MaterialConfig {
  roughness: number;
  metalness: number;
  emissiveIntensity: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
}

const textureConfigs: Record<TextureType, MaterialConfig> = {
  matte: {
    roughness: 0.9,
    metalness: 0.0,
    emissiveIntensity: 0.05,
  },
  glossy: {
    roughness: 0.1,
    metalness: 0.1,
    emissiveIntensity: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
  },
  metallic: {
    roughness: 0.2,
    metalness: 0.9,
    emissiveIntensity: 0.2,
  },
  plastic: {
    roughness: 0.3,
    metalness: 0.2,
    emissiveIntensity: 0.1,
  },
  satin: {
    roughness: 0.5,
    metalness: 0.3,
    emissiveIntensity: 0.12,
  },
};

let currentTexture: TextureType = "plastic";

type BackgroundType = "solid" | "gradient" | "particles" | "grid" | "space";

let currentBackground: BackgroundType = "gradient";

interface AnimationState {
  group: THREE.Group;
  axis: THREE.Vector3;
  targetAngle: number;
  currentAngle: number;
  duration: number;
  elapsed: number;
  onComplete: () => void;
}

interface DebugConfig {
  enabled: boolean;
  logAnimations: boolean;
  logCubiePositions: boolean;
  highlightAnimatingCubies: boolean;
  slowMotion: number; // 1 = normal, 2 = half speed, etc.
}

export class Canvas3DRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cubeGroup: THREE.Group;
  private labelsGroup: THREE.Group;
  private ambientLight: THREE.AmbientLight;
  private keyLight: THREE.DirectionalLight;
  private fillLight: THREE.DirectionalLight;
  private rimLight: THREE.DirectionalLight;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private animation: AnimationState | null = null;
  private animationQueue: (() => void)[] = [];
  private canvas: HTMLCanvasElement;
  private lightBrightness = 1.0;
  private lightAngle = 45;
  private currentCubeTheme = "classic";
  private particles: THREE.Points | null = null;
  private gridHelper: THREE.GridHelper | null = null;
  private stars: THREE.Points | null = null;
  private debug: DebugConfig = {
    enabled: false,
    logAnimations: false,
    logCubiePositions: false,
    highlightAnimatingCubies: false,
    slowMotion: 1,
  };
  /**
   * Print a debug comparison of the logical cube state and the rendered cubies.
   * Call this after a scramble to verify mapping correctness.
   */
  public debugCompareCubeState(cube: Cube): void {
    // Print logical cube state
    console.log("--- Logical Cube State ---");
    for (const face of ["U", "R", "F", "D", "L", "B"] as const) {
      // @ts-expect-error: dynamic access
      console.log(`${face}:`, cube[face]);
    }

    // Print rendered cubie face colors
    console.log("--- Rendered Cubies ---");
    this.cubeGroup.children.forEach((cubie, idx) => {
      const pos = cubie.position;
      // @ts-expect-error: mesh material
      const mesh = cubie;
      let faceColors: string[] = [];
      if (Array.isArray(mesh.material)) {
        faceColors = mesh.material.map((mat: any) => {
          // Try to get color hex
          if (mat.color && mat.color.getHexString) {
            return "#" + mat.color.getHexString();
          }
          return String(mat.color);
        });
      }
      console.log(
        `Cubie ${idx} pos(${pos.x.toFixed(1)},${pos.y.toFixed(1)},${pos.z.toFixed(1)}):`,
        faceColors,
      );
    });
    console.log("-------------------------");
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Enable debug mode via URL parameter or window object
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("debug") === "true") {
      this.enableDebug();
    }

    // Expose debug controls to window for console access
    interface CubeDebug {
      enable: () => void;
      disable: () => void;
      setSlowMotion: (factor: number) => void;
      logAnimations: (val: boolean) => void;
      logPositions: (val: boolean) => void;
      highlightCubies: (val: boolean) => void;
      getState: () => {
        enabled: boolean;
        slowMotion: number;
        logAnimations: boolean;
        logCubiePositions: boolean;
        highlightAnimatingCubies: boolean;
      };
    }

    (window as unknown as { cubeDebug: CubeDebug }).cubeDebug = {
      enable: () => this.enableDebug(),
      disable: () => this.disableDebug(),
      setSlowMotion: (factor: number) => {
        this.debug.slowMotion = factor;
      },
      logAnimations: (val: boolean) => {
        this.debug.logAnimations = val;
      },
      logPositions: (val: boolean) => {
        this.debug.logCubiePositions = val;
      },
      highlightCubies: (val: boolean) => {
        this.debug.highlightAnimatingCubies = val;
      },
      getState: () => this.debug,
    };
    // Scene setup
    this.scene = new THREE.Scene();
    this.setupBackground(currentBackground);

    // Camera setup
    this.camera = new THREE.PerspectiveCamera(
      50,
      canvas.width / canvas.height,
      0.1,
      1000,
    );
    this.camera.position.set(6, 6, 6);
    this.camera.lookAt(0, 0, 0);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.width, canvas.height);

    // Cube group
    this.cubeGroup = new THREE.Group();
    this.scene.add(this.cubeGroup);

    // Labels group
    this.labelsGroup = new THREE.Group();
    this.scene.add(this.labelsGroup);
    this.createFaceLabels();

    // Enhanced three-point lighting setup
    // Ambient light - base illumination
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    // Key light - main directional light
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    this.keyLight.position.set(10, 10, 10);
    this.keyLight.castShadow = false;
    this.scene.add(this.keyLight);

    // Fill light - softer light from opposite side
    this.fillLight = new THREE.DirectionalLight(0xaaccff, 0.6);
    this.fillLight.position.set(-8, 5, -8);
    this.scene.add(this.fillLight);

    // Rim light - highlights edges
    this.rimLight = new THREE.DirectionalLight(0xffccaa, 0.4);
    this.rimLight.position.set(0, -10, -10);
    this.scene.add(this.rimLight);

    // Mouse controls
    this.setupMouseControls(canvas);

    // Touch controls
    this.setupTouchControls(canvas);

    // Initial render
    this.animate();
  }

  private setupMouseControls(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("mousedown", (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;

      // Disable rotation during animation to prevent coordinate system conflicts
      if (this.animation) return;

      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.cubeGroup.rotation.y += deltaX * 0.01;
      this.cubeGroup.rotation.x += deltaY * 0.01;

      // Rotate labels with cube
      this.labelsGroup.rotation.copy(this.cubeGroup.rotation);

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
      this.isDragging = false;
    });
  }

  private setupTouchControls(canvas: HTMLCanvasElement): void {
    let previousTouchPosition = { x: 0, y: 0 };

    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        previousTouchPosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        e.preventDefault();
      }
    });

    canvas.addEventListener("touchmove", (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;

      // Disable rotation during animation
      if (this.animation) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - previousTouchPosition.x;
      const deltaY = touch.clientY - previousTouchPosition.y;

      this.cubeGroup.rotation.y += deltaX * 0.01;
      this.cubeGroup.rotation.x += deltaY * 0.01;

      // Rotate labels with cube
      this.labelsGroup.rotation.copy(this.cubeGroup.rotation);

      previousTouchPosition = { x: touch.clientX, y: touch.clientY };
      e.preventDefault();
    });

    canvas.addEventListener("touchend", () => {
      this.isDragging = false;
    });

    canvas.addEventListener("touchcancel", () => {
      this.isDragging = false;
    });
  }

  render(cube: Cube): void {
    // Clear previous cube
    while (this.cubeGroup.children.length > 0) {
      this.cubeGroup.remove(this.cubeGroup.children[0]);
    }

    // Create 3x3x3 grid of cubies - MUCH LARGER
    const size = 0.98;
    const spacing = 1.0;

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        for (let z = 0; z < 3; z++) {
          // Skip center cubie (not visible)
          if (x === 1 && y === 1 && z === 1) continue;

          const cubie = this.createCubie(cube, x, y, z, size);
          cubie.position.set(
            (x - 1) * spacing,
            (y - 1) * spacing,
            (z - 1) * spacing,
          );
          this.cubeGroup.add(cubie);
        }
      }
    }
  }

  private createFaceLabels(): void {
    const labels = [
      { text: "U", position: new THREE.Vector3(0, 2.2, 0), color: "#ffffff" },
      { text: "D", position: new THREE.Vector3(0, -2.2, 0), color: "#ffff00" },
      { text: "R", position: new THREE.Vector3(2.2, 0, 0), color: "#ff0000" },
      { text: "L", position: new THREE.Vector3(-2.2, 0, 0), color: "#ff8800" },
      { text: "F", position: new THREE.Vector3(0, 0, 2.2), color: "#00ff00" },
      { text: "B", position: new THREE.Vector3(0, 0, -2.2), color: "#0000ff" },
    ];

    labels.forEach(({ text, position, color }) => {
      const sprite = this.createTextSprite(text, color);
      sprite.position.copy(position);
      this.labelsGroup.add(sprite);
    });
  }

  private createTextSprite(text: string, color: string): THREE.Sprite {
    // Create canvas for text
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not get canvas context");

    // Set canvas size
    canvas.width = 128;
    canvas.height = 128;

    // Draw text
    context.fillStyle = "rgba(0, 0, 0, 0.6)";
    context.fillRect(0, 0, 128, 128);

    context.font = "bold 72px Arial";
    context.fillStyle = color;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, 64, 64);

    // Add border
    context.strokeStyle = "#000000";
    context.lineWidth = 4;
    context.strokeText(text, 64, 64);

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);

    // Create sprite material
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 0.8,
    });

    // Create sprite
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.8, 0.8, 1);

    return sprite;
  }

  private createCubie(
    cube: Cube,
    x: number,
    y: number,
    z: number,
    size: number,
  ): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(size, size, size);

    // Create materials for each face
    const materials: THREE.MeshStandardMaterial[] = [];

    // Right (+X), Left (-X), Top (+Y), Bottom (-Y), Front (+Z), Back (-Z)
    // Material array order for THREE.js BoxGeometry
    const faceColors = [
      x === 2 ? this.getFaceColor(cube.Red, 2 - y, 2 - z) : 0x000000, // Right (Red)
      x === 0 ? this.getFaceColor(cube.Orange, 2 - y, z) : 0x000000, // Left (Orange)
      y === 2 ? this.getFaceColor(cube.White, z, x) : 0x000000, // Top (White)
      y === 0 ? this.getFaceColor(cube.Yellow, 2 - z, x) : 0x000000, // Bottom (Yellow)
      z === 2 ? this.getFaceColor(cube.Green, 2 - y, x) : 0x000000, // Front (Green)
      z === 0 ? this.getFaceColor(cube.Blue, 2 - y, 2 - x) : 0x000000, // Back (Blue)
    ];

    const textureConfig = textureConfigs[currentTexture];
    faceColors.forEach((color) => {
      const materialProps: THREE.MeshStandardMaterialParameters = {
        color,
        roughness: textureConfig.roughness,
        metalness: textureConfig.metalness,
        emissive: color,
        emissiveIntensity: textureConfig.emissiveIntensity,
      };

      if (textureConfig.clearcoat !== undefined) {
        materialProps.clearcoat = textureConfig.clearcoat;
        materialProps.clearcoatRoughness = textureConfig.clearcoatRoughness;
      }

      materials.push(new THREE.MeshStandardMaterial(materialProps));
    });

    const mesh = new THREE.Mesh(geometry, materials);
    return mesh;
  }

  private getFaceColor(
    face: readonly Color[],
    row: number,
    col: number,
  ): number {
    // Map 3D position to face index
    // Face layout: [0,1,2] top row, [3,4,5] middle, [6,7,8] bottom
    const index = row * 3 + col;
    return colorMap[face[index]];
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);

    // Update animation if active
    if (this.animation) {
      const deltaTime = 16; // ~60fps
      this.animation.elapsed += deltaTime;

      const progress = Math.min(
        this.animation.elapsed / this.animation.duration,
        1,
      );
      // Ease-out cubic for smooth animation
      const eased = 1 - Math.pow(1 - progress, 3);

      const targetRotation = eased * this.animation.targetAngle;
      const deltaRotation = targetRotation - this.animation.currentAngle;

      this.animation.currentAngle = targetRotation;

      // Apply rotation to the group
      if (this.animation.axis.x !== 0) {
        this.animation.group.rotateX(deltaRotation);
      } else if (this.animation.axis.y !== 0) {
        this.animation.group.rotateY(deltaRotation);
      } else if (this.animation.axis.z !== 0) {
        this.animation.group.rotateZ(deltaRotation);
      }

      // Debug: Log progress
      if (
        this.debug.logAnimations &&
        progress > 0 &&
        progress < 1 &&
        Math.random() < 0.1
      ) {
        console.log(
          `   Progress: ${(progress * 100).toFixed(0)}% | Rotation: ${((this.animation.currentAngle * 180) / Math.PI).toFixed(1)}°`,
        );
      }

      // Check if animation is complete
      if (progress >= 1) {
        this.animation.onComplete();
        this.animation = null;

        // Process next animation in queue
        if (this.animationQueue.length > 0) {
          const nextAnimation = this.animationQueue.shift();
          if (nextAnimation) {
            if (this.debug.logAnimations) {
              console.log(
                `▶️  Starting next queued animation (${this.animationQueue.length} remaining)`,
              );
            }
            nextAnimation();
          }
        }
      }
    }

    this.renderer.render(this.scene, this.camera);
  };

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animateMove(move: string, onComplete: () => void): void {
    const executeAnimation = () => {
      if (this.animation) {
        // Queue if already animating
        this.animationQueue.push(() => this.animateMove(move, onComplete));
        if (this.debug.logAnimations) {
          console.log(
            `⏸️  Animation queued: ${move} (queue size: ${this.animationQueue.length})`,
          );
        }
        return;
      }

      // Determine which cubies to rotate and the axis
      const { cubies, axis, angle } = this.getMoveAnimation(move);

      if (this.debug.logAnimations) {
        console.log(`🎬 Starting animation: ${move}`);
        console.log(`   Cubies to rotate: ${cubies.length}`);
        console.log(`   Axis: (${axis.x}, ${axis.y}, ${axis.z})`);
        console.log(`   Angle: ${((angle * 180) / Math.PI).toFixed(1)}°`);
      }

      if (cubies.length === 0) {
        if (this.debug.logAnimations) {
          console.warn(`⚠️  No cubies found for move: ${move}`);
        }
        onComplete();
        return;
      }

      // Create a temporary group for rotation as a child of cubeGroup
      // This ensures it inherits the cubeGroup's rotation from mouse controls
      const rotationGroup = new THREE.Group();
      this.cubeGroup.add(rotationGroup);

      // Move cubies to rotation group using local positions
      cubies.forEach((cubie, index) => {
        const localPosition = cubie.position.clone();
        const localQuaternion = cubie.quaternion.clone();

        if (this.debug.logCubiePositions && index < 3) {
          console.log(
            `   Cubie ${index}: pos(${localPosition.x.toFixed(2)}, ${localPosition.y.toFixed(2)}, ${localPosition.z.toFixed(2)})`,
          );
        }

        this.cubeGroup.remove(cubie);
        rotationGroup.add(cubie);

        cubie.position.copy(localPosition);
        cubie.quaternion.copy(localQuaternion);

        // Highlight animating cubies
        if (this.debug.highlightAnimatingCubies) {
          const mesh = cubie as THREE.Mesh;
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((mat) => {
              const m = (mat as THREE.MeshStandardMaterial).clone();
              m.emissive = new THREE.Color(0x00ff00);
              m.emissiveIntensity = 0.3;
              return m;
            });
          }
        }
      });

      // Add animating class for visual feedback
      this.canvas.classList.add("animating");

      // Start animation
      const duration = 300 * this.debug.slowMotion;
      this.animation = {
        group: rotationGroup,
        axis,
        targetAngle: angle,
        currentAngle: 0,
        duration: duration,
        elapsed: 0,
        onComplete: () => {
          if (this.debug.logAnimations) {
            console.log(`✅ Animation complete: ${move}`);
          }

          // Move cubies back to main group
          const cubiesToMove = [...rotationGroup.children];
          cubiesToMove.forEach((cubie) => {
            // Get position and rotation relative to cubeGroup
            const worldPosition = new THREE.Vector3();
            const worldQuaternion = new THREE.Quaternion();

            cubie.getWorldPosition(worldPosition);
            cubie.getWorldQuaternion(worldQuaternion);

            // Convert back to cubeGroup local space
            const cubeGroupWorldPosition = new THREE.Vector3();
            const cubeGroupWorldQuaternion = new THREE.Quaternion();
            this.cubeGroup.getWorldPosition(cubeGroupWorldPosition);
            this.cubeGroup.getWorldQuaternion(cubeGroupWorldQuaternion);

            rotationGroup.remove(cubie);
            this.cubeGroup.add(cubie);

            // Set position in cubeGroup's local space
            this.cubeGroup.worldToLocal(worldPosition);
            cubie.position.copy(worldPosition);

            // Set rotation in cubeGroup's local space
            const inverseParentQuaternion = cubeGroupWorldQuaternion
              .clone()
              .invert();
            cubie.quaternion.copy(
              worldQuaternion.premultiply(inverseParentQuaternion),
            );
          });

          this.cubeGroup.remove(rotationGroup);

          // Remove animating class
          this.canvas.classList.remove("animating");

          onComplete();
        },
      };
    };

    executeAnimation();
  }

  private getMoveAnimation(move: string): {
    cubies: THREE.Object3D[];
    axis: THREE.Vector3;
    angle: number;
  } {
    const cubies: THREE.Object3D[] = [];
    let axis = new THREE.Vector3(0, 1, 0);
    let angle = Math.PI / 2; // 90 degrees

    const face = move[0];
    const modifier = move[1];

    // Determine if prime (counter-clockwise) or double
    if (modifier === "'") {
      angle = -Math.PI / 2;
    } else if (modifier === "2") {
      angle = Math.PI;
    }

    // Select cubies based on face
    this.cubeGroup.children.forEach((cubie) => {
      const pos = cubie.position;
      const threshold = 0.5;

      switch (face) {
        case "U": // Top layer (y = 1)
          if (pos.y > threshold) {
            cubies.push(cubie);
            axis = new THREE.Vector3(0, 1, 0);
            angle = -angle; // Reverse for U (right-hand rule correction)
          }
          break;
        case "D": // Bottom layer (y = -1)
          if (pos.y < -threshold) {
            cubies.push(cubie);
            axis = new THREE.Vector3(0, 1, 0);
          }
          break;
        case "R": // Right layer (x = 1)
          if (pos.x > threshold) {
            cubies.push(cubie);
            axis = new THREE.Vector3(1, 0, 0);
            angle = -angle; // Reverse for right (right-hand rule correction)
          }
          break;
        case "L": // Left layer (x = -1)
          if (pos.x < -threshold) {
            cubies.push(cubie);
            axis = new THREE.Vector3(1, 0, 0);
          }
          break;
        case "F": // Front layer (z = 1)
          if (pos.z > threshold) {
            cubies.push(cubie);
            axis = new THREE.Vector3(0, 0, 1);
            angle = -angle; // Reverse for F (right-hand rule correction)
          }
          break;
        case "B": // Back layer (z = -1)
          if (pos.z < -threshold) {
            cubies.push(cubie);
            axis = new THREE.Vector3(0, 0, 1);
          }
          break;
      }
    });

    return { cubies, axis, angle };
  }

  toggleLabels(): boolean {
    this.labelsGroup.visible = !this.labelsGroup.visible;
    return this.labelsGroup.visible;
  }

  setBrightness(value: number): void {
    this.lightBrightness = value;
    this.ambientLight.intensity = 0.5 * value;
    this.keyLight.intensity = 1.2 * value;
    this.fillLight.intensity = 0.6 * value;
    this.rimLight.intensity = 0.4 * value;
  }

  setLightAngle(angle: number): void {
    this.lightAngle = angle;
    const rad = (angle * Math.PI) / 180;
    const distance = 10;

    // Rotate key light around the cube
    this.keyLight.position.set(
      Math.cos(rad) * distance,
      distance,
      Math.sin(rad) * distance,
    );

    // Position fill light opposite to key light
    this.fillLight.position.set(-Math.cos(rad) * 8, 5, -Math.sin(rad) * 8);
  }

  public setCubeTheme(themeName: string): void {
    if (cubeThemes[themeName]) {
      this.currentCubeTheme = themeName;
      colorMap = cubeThemes[themeName];
    }
  }

  public setTexture(texture: TextureType): void {
    if (textureConfigs[texture]) {
      currentTexture = texture;
      localStorage.setItem("cube-texture", texture);
    }
  }

  public getTexture(): TextureType {
    return currentTexture;
  }

  private setupBackground(type: BackgroundType): void {
    // Clear existing background effects
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles = null;
    }
    if (this.gridHelper) {
      this.scene.remove(this.gridHelper);
      this.gridHelper = null;
    }
    if (this.stars) {
      this.scene.remove(this.stars);
      this.stars = null;
    }

    switch (type) {
      case "solid":
        this.scene.background = new THREE.Color(0x1a1a2e);
        break;

      case "gradient":
        // Create gradient using canvas
        const canvas = document.createElement("canvas");
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const gradient = ctx.createLinearGradient(0, 0, 0, 512);
          gradient.addColorStop(0, "#1a1a2e");
          gradient.addColorStop(0.5, "#16213e");
          gradient.addColorStop(1, "#0f3460");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 512, 512);
          const texture = new THREE.CanvasTexture(canvas);
          this.scene.background = texture;
        }
        break;

      case "particles":
        this.scene.background = new THREE.Color(0x0a0a0f);
        this.createParticles();
        break;

      case "grid":
        this.scene.background = new THREE.Color(0x1a1a2e);
        this.createGrid();
        break;

      case "space":
        this.scene.background = new THREE.Color(0x000510);
        this.createStarfield();
        break;
    }
  }

  private createParticles(): void {
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Random positions in a sphere around the cube
      const radius = 15 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Cyan/blue particle colors
      const brightness = 0.5 + Math.random() * 0.5;
      colors[i3] = 0.2 * brightness;
      colors[i3 + 1] = 0.8 * brightness;
      colors[i3 + 2] = 1.0 * brightness;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createGrid(): void {
    // Ground grid
    this.gridHelper = new THREE.GridHelper(20, 20, 0x00d4ff, 0x0f3460);
    this.gridHelper.position.y = -5;
    this.scene.add(this.gridHelper);

    // Add some vertical grid lines for depth
    const verticalLinesGeometry = new THREE.BufferGeometry();
    const verticalPositions: number[] = [];

    for (let x = -10; x <= 10; x += 2) {
      for (let z = -10; z <= 10; z += 2) {
        verticalPositions.push(x, -5, z);
        verticalPositions.push(x, 10, z);
      }
    }

    verticalLinesGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(verticalPositions, 3),
    );

    const verticalLinesMaterial = new THREE.LineBasicMaterial({
      color: 0x0f3460,
      transparent: true,
      opacity: 0.2,
    });

    const verticalLines = new THREE.LineSegments(
      verticalLinesGeometry,
      verticalLinesMaterial,
    );
    this.scene.add(verticalLines);
  }

  private createStarfield(): void {
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const sizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Random positions in a large sphere
      const radius = 30 + Math.random() * 70;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Star colors (white with slight color variations)
      const colorVariation = Math.random();
      if (colorVariation > 0.97) {
        // Blue stars
        colors[i3] = 0.7;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 1.0;
      } else if (colorVariation > 0.94) {
        // Orange stars
        colors[i3] = 1.0;
        colors[i3 + 1] = 0.7;
        colors[i3 + 2] = 0.5;
      } else {
        // White stars
        const brightness = 0.8 + Math.random() * 0.2;
        colors[i3] = brightness;
        colors[i3 + 1] = brightness;
        colors[i3 + 2] = brightness;
      }

      // Varying star sizes
      sizes[i] = Math.random() * 0.3 + 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 0.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });

    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  public setBackground(type: BackgroundType): void {
    currentBackground = type;
    this.setupBackground(type);
    localStorage.setItem("cube-background", type);
  }

  public getBackground(): BackgroundType {
    return currentBackground;
  }

  destroy(): void {
    this.renderer.dispose();
  }

  enableDebug(): void {
    this.debug.enabled = true;
    this.debug.logAnimations = true;
    this.debug.logCubiePositions = true;
    console.log("🔧 Cube debug mode ENABLED");
    console.log("Available commands:");
    console.log("  window.cubeDebug.setSlowMotion(2) - Half speed animations");
    console.log(
      "  window.cubeDebug.highlightCubies(true) - Highlight animating cubies",
    );
    console.log(
      "  window.cubeDebug.logAnimations(false) - Toggle animation logs",
    );
    console.log("  window.cubeDebug.getState() - View current debug state");
  }

  disableDebug(): void {
    this.debug.enabled = false;
    this.debug.logAnimations = false;
    this.debug.logCubiePositions = false;
    this.debug.highlightAnimatingCubies = false;
    console.log("🔧 Cube debug mode DISABLED");
  }
}
