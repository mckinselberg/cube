import * as THREE from "three";
import type { Cube, Color } from "../cube/types.ts";

const colorMap: Record<Color, number> = {
  W: 0xffffff,
  R: 0xff0000,
  G: 0x00ff00,
  Y: 0xffff00,
  O: 0xff8800,
  B: 0x0000ff,
};

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
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };
  private animation: AnimationState | null = null;
  private animationQueue: (() => void)[] = [];
  private canvas: HTMLCanvasElement;
  private debug: DebugConfig = {
    enabled: false,
    logAnimations: false,
    logCubiePositions: false,
    highlightAnimatingCubies: false,
    slowMotion: 1,
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    // Enable debug mode via URL parameter or window object
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("debug") === "true") {
      this.enableDebug();
    }

    // Expose debug controls to window for console access
    (window as any).cubeDebug = {
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
    this.scene.background = new THREE.Color(0x222222);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight1.position.set(10, 10, 10);
    this.scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-10, -10, -10);
    this.scene.add(directionalLight2);

    // Mouse controls
    this.setupMouseControls(canvas);

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

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    canvas.addEventListener("mouseup", () => {
      this.isDragging = false;
    });

    canvas.addEventListener("mouseleave", () => {
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

    console.log("Rendering 3D cube with", 26, "cubies");

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

    console.log(
      "3D cube rendered, total children:",
      this.cubeGroup.children.length,
    );
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
      x === 2 ? this.getFaceColor(cube.R, 2 - y, 2 - z) : 0x000000, // Right - try flipping z
      x === 0 ? this.getFaceColor(cube.L, 2 - y, z) : 0x000000, // Left - try flipping z
      y === 2 ? this.getFaceColor(cube.U, z, x) : 0x000000, // Top - try not flipping z
      y === 0 ? this.getFaceColor(cube.D, 2 - z, x) : 0x000000, // Bottom - try flipping z
      z === 2 ? this.getFaceColor(cube.F, 2 - y, x) : 0x000000, // Front
      z === 0 ? this.getFaceColor(cube.B, 2 - y, 2 - x) : 0x000000, // Back
    ];

    faceColors.forEach((color) => {
      materials.push(
        new THREE.MeshStandardMaterial({
          color,
          roughness: 0.4,
          metalness: 0.1,
        }),
      );
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
