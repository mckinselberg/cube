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

export class Canvas3DRenderer {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private cubeGroup: THREE.Group;
  private isDragging = false;
  private previousMousePosition = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
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
    const faceColors = [
      x === 2 ? this.getFaceColor(cube.R, 2 - y, z) : 0x000000, // Right
      x === 0 ? this.getFaceColor(cube.L, 2 - y, 2 - z) : 0x000000, // Left
      y === 2 ? this.getFaceColor(cube.U, 2 - z, x) : 0x000000, // Top
      y === 0 ? this.getFaceColor(cube.D, z, x) : 0x000000, // Bottom
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
    this.renderer.render(this.scene, this.camera);
  };

  resize(width: number, height: number): void {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  destroy(): void {
    this.renderer.dispose();
  }
}
