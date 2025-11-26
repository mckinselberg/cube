# GitHub Copilot Instructions for Rubik's Cube Engine

## Project Overview

This is a **pure TypeScript Rubik's Cube engine** with interactive 2D and 3D web visualizers. The project emphasizes type safety, immutability, and correct cube mechanics.

## Core Architecture

### Cube Representation

- **Facelet model**: 6 faces (U, R, F, D, L, B), each with 9 stickers
- **Type**: `FaceArray` is `readonly [Color, Color, Color, Color, Color, Color, Color, Color, Color]`
- **Immutability**: All operations return new cube instances, never mutate
- **Color scheme**: W (white), R (red), G (green), Y (yellow), O (orange), B (blue)

### File Structure

```
src/
  cube/       - Core types and utilities (types.ts, createSolved.ts, clone.ts, rotateFace.ts)
  moves/      - Move implementations (U.ts, R.ts, F.ts, D.ts, L.ts, B.ts)
  parser/     - Move parsing and application (parseMove.ts, applyMoves.ts)
  util/       - Helpers (printCube.ts, toJSON.ts)
  visualization/ - 2D and 3D renderers (canvas2D.ts, canvas3D.ts)
  app.ts      - Main web application
```

## Critical Rules

### 1. Type Safety

- **Strict mode**: Always maintain strict TypeScript (`"strict": true`)
- **No `any`**: Never use `any` type
- **No type casting**: Avoid type assertions (`as Type`) unless absolutely necessary; prefer type guards and proper typing
- **Explicit types**: Prefer explicit type annotations for function signatures
- **Readonly**: Use `readonly` for arrays that shouldn't be modified (especially `FaceArray`)

### 2. Immutability

- **All moves are pure functions**: `(cube: Cube) => Cube`
- **Clone before modify**: Always use `clone(cube)` before making changes
- **Never mutate parameters**: Original cube objects must remain unchanged
- **Spread operator**: Use `[...array]` when creating new arrays

### 3. Cube Logic

- **Face indices**: 0-8 grid layout: `[0,1,2, 3,4,5, 6,7,8]` (row-major)
- **Move notation**: Standard: U, R, F, D, L, B + prime (') and double (2)
- **Rotation direction**: Clockwise when viewing the face directly
- **Validation**: Every move ×4 must return to solved state (critical test)

### 4. 3D Visualization

**Status**: ✅ Working correctly! The 3D visualization now properly matches the 2D view.

#### Features

- ✅ All cube logic and move algorithms
- ✅ 2D visualization is perfect
- ✅ 3D visualization with correct color mapping
- ✅ Smooth animations (300ms ease-out)
- ✅ Mouse controls for rotation
- ✅ Animation queuing for sequences
- ✅ Tests pass (21/21)

#### Debug Tools Available

The 3D renderer includes debug utilities accessible via browser console:

```typescript
window.cubeDebug.enable(); // Enable debug logging
window.cubeDebug.setSlowMotion(2); // Half speed animations
window.cubeDebug.logAnimations(true); // Toggle animation logs
window.cubeDebug.highlightCubies(true); // Highlight animating cubies
```

#### When extending 3D visualization:

1. **Maintain coordinate consistency**: Grid (x,y,z) maps to positions (x-1, y-1, z-1)
2. **Test with both views**: Always verify 2D and 3D show the same result
3. **Use debug mode**: Enable logging to trace animation issues
4. **Preserve immutability**: Never mutate cube state during animations

### 5. Testing

- **Run tests frequently**: Use `npm test` or `npm run test:watch`
- **Critical test**: All moves ×4 must equal solved cube
- **Immutability test**: Original cube must remain unchanged after move
- **Use Vitest**: Preferred testing framework

### 6. Web Development

- **Vite for bundling**: Fast dev server with HMR
- **Three.js for 3D**: Version 0.160.0
- **No frameworks**: Pure TypeScript, no React/Vue/etc
- **Responsive**: Must work on desktop and mobile

## Code Style

### Imports

```typescript
// Use .ts extensions
import { createSolved } from "./cube/createSolved.ts";
import type { Cube, Move } from "./cube/types.ts";
```

### Function Signatures

```typescript
// Explicit return types
export function R(cube: Cube): Cube {
  const newCube = clone(cube);
  // ...
  return newCube;
}
```

### Cube Operations

```typescript
// Always clone first
const newCube = clone(cube);

// Rotate the face itself
newCube.R = rotateFaceClockwise(cube.R);

// Cycle affected edges
const [edge1, edge2, edge3, edge4] = [
  /* extract edges */
];
// Assign new positions
```

## Common Patterns

### Adding a New Move

1. Create file in `src/moves/`
2. Import `clone`, `rotateFaceClockwise`, and types
3. Implement as pure function
4. Export from `src/moves/index.ts`
5. Add test in `test/moves.test.ts` (×4 = solved)

### Debugging 3D Issues

```typescript
// Enable debug mode
window.cubeDebug.enable();
window.cubeDebug.setSlowMotion(2); // Half speed
window.cubeDebug.logAnimations(true);

// Compare states
console.log("Logical cube:", cube);
// Switch to 2D to verify colors
```

### Adding Visualization Features

- Update `src/app.ts` for UI interactions
- Update `canvas2D.ts` for 2D rendering
- Update `canvas3D.ts` for 3D rendering (be careful with coordinate mappings!)

## Performance Considerations

- **Clone is fast**: Uses spread operator, not deep recursion
- **Render on demand**: Only redraw when cube state changes
- **Animation queue**: 3D animations are queued, not concurrent

## Documentation

- **README.md**: User-facing documentation
- **3D_ANIMATION_DEBUGGING.md**: Detailed debugging notes on 3D issues
- **PROJECT_CHECKLIST.md**: Feature completion status

## Current Priorities

1. **Add solver algorithm** - Implement basic solving (layer-by-layer or CFOP)
2. **Enhance UI/UX** - Add keyboard shortcuts, touch gestures, custom themes
3. **Package for distribution** - Publish to npm, deploy demo to GitHub Pages
4. **Performance optimization** - Benchmark and optimize rendering/animations

## Resources

- Standard cube notation: https://ruwix.com/the-rubiks-cube/notation/
- Three.js docs: https://threejs.org/docs/
- TypeScript strict mode: https://www.typescriptlang.org/tsconfig#strict
