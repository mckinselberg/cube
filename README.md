# 🎲 Rubik's Cube Engine — Pure TypeScript

A fully-typed, immutable Rubik's Cube engine written in pure TypeScript with interactive 2D and 3D visualizers.

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Three.js](https://img.shields.io/badge/Three.js-0.160-green)
![Tests](https://img.shields.io/badge/tests-21%20passing-brightgreen)

## ✨ Features

### Engine

- ✅ **Pure TypeScript** - No JavaScript files, strict type checking
- ✅ **Immutable Operations** - All moves return new cube states
- ✅ **Complete Move Set** - U, R, F, D, L, B + prime and double variants (18 total)
- ✅ **Move Parser** - Parse and apply move sequences (e.g., "R U R' U'")
- ✅ **ASCII Visualizer** - Terminal-based cube display
- ✅ **Comprehensive Tests** - 21 tests passing, full coverage with Vitest

### Web Visualizer

- 🎨 **2D Net View** - Classic unfolded cube layout showing all faces
- 🎮 **3D Interactive** - WebGL-powered 3D cube with mouse/touch rotation (fully working!)
- ✨ **Smooth Animations** - Animated face rotations in 3D mode (300ms ease-out)
- 🐛 **Debug Mode** - Built-in debugging tools for development
- ⌨️ **Keyboard Shortcuts** - U/R/F/D/L/B keys + modifiers for fast moves
- 👆 **Touch Gestures** - Swipe to rotate cube on mobile devices
- 🎨 **Theme System** - 5 color themes with localStorage persistence
- 🎲 **Move Controls** - Click buttons or type move sequences
- 🎲 **Scrambler** - Random 20-move scrambles
- ↩️ **Undo/History** - Full move history with undo functionality
- 📱 **Responsive** - Works on desktop and mobile browsers

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start the web visualizer
npm run web:dev
```

Opens at `http://localhost:3000` with hot-reload enabled.

## 💻 CLI Usage

```typescript
import { createSolved, applyMoves, printCube } from "./src/index.ts";

// Create a solved cube
const cube = createSolved();

// Apply a sequence of moves
const scrambled = applyMoves(cube, "R U R' U'");

// Visualize the cube
console.log(printCube(scrambled));
```

## Project Structure

```
src/
  index.ts                  # Main entry point
  cube/
    types.ts               # Type definitions (Cube, FaceArray, Move, etc.)
    createSolved.ts        # Creates a solved cube
    clone.ts               # Deep clone utility
    rotateFace.ts          # Face rotation functions
  moves/
    U.ts, R.ts, F.ts       # Move implementations
    D.ts, L.ts, B.ts
    index.ts               # Move exports
  parser/
    parseMove.ts           # Parse and apply single moves
    applyMoves.ts          # Apply move sequences
  util/
    printCube.ts           # ASCII visualization
    toJSON.ts              # JSON serialization
test/
  cube.test.ts             # Core cube tests
  moves.test.ts            # Move validation tests
  parser.test.ts           # Parser tests
```

## 📜 Scripts

```bash
# Web Visualizer
npm run web:dev       # Start dev server at localhost:3000
npm run web:build     # Build for production
npm run web:preview   # Preview production build

# CLI/Library
npm run dev          # Run demo with ASCII output
npm test             # Run test suite
npm run test:watch   # Run tests in watch mode
npm run build        # Build TypeScript library
```

## 🌐 Web Visualizer

The project includes an interactive web-based visualizer with both 2D and 3D views.

### Features

- **Mode Switcher** - Toggle between 2D net and 3D interactive views
- **18 Move Buttons** - All standard moves (U, U', U2, R, R', R2, etc.)
- **Keyboard Shortcuts** - Press U/R/F/D/L/B keys for moves, Shift for prime, Shift+Ctrl for double
- **Touch Gestures** - Swipe to rotate cube on mobile and tablets
- **Sequence Input** - Type move sequences like "R U R' U'" and press Enter
- **Random Scramble** - Generate 20-move scrambles
- **Undo** - Step backward through move history (Ctrl+Z)
- **Move History Display** - Visual timeline of all applied moves
- **Mouse/Touch Controls** - Drag or swipe to rotate 3D cube
- **Theme System** - 5 color themes with localStorage persistence

### Technology

- **Vite** - Fast dev server and bundler
- **Three.js** - 3D WebGL rendering
- **Native Canvas 2D** - 2D net visualization
- **Pure TypeScript** - No framework dependencies

## API

### Core Functions

- `createSolved()` - Creates a solved cube
- `clone(cube)` - Deep clones a cube

### Moves

All moves are pure functions that return a new cube:

- `U`, `U'`, `U2` - Up face
- `R`, `R'`, `R2` - Right face
- `F`, `F'`, `F2` - Front face
- `D`, `D'`, `D2` - Down face
- `L`, `L'`, `L2` - Left face
- `B`, `B'`, `B2` - Back face

### Parser

- `parseMove(moveStr)` - Parse a single move string
- `applyMove(cube, move)` - Apply a single move
- `applyMoves(cube, sequence)` - Apply a space-separated sequence

### Utilities

- `printCube(cube)` - Returns ASCII representation
- `cubeToJSON(cube)` - Serializes to JSON

## Color Scheme

- **U** (Up) = White (W)
- **R** (Right) = Red (R)
- **F** (Front) = Green (G)
- **D** (Down) = Yellow (Y)
- **L** (Left) = Orange (O)
- **B** (Back) = Blue (B)

## License

MIT
