# Web Visualizer Implementation

This document describes the web-based visualizer for the Rubik's Cube Engine.

## Architecture

### Rendering Modes

1. **2D Canvas Renderer** (`src/visualization/canvas2D.ts`)
   - Displays cube in "net" layout (unfolded view)
   - Shows all 6 faces simultaneously
   - Simple, clear view of current state

2. **3D WebGL Renderer** (`src/visualization/canvas3D.ts`)
   - Interactive 3D cube using Three.js
   - Mouse drag to rotate
   - Individual cubie rendering with proper face colors

### Application Structure

- **index.html** - Main entry point with UI controls
- **styles.css** - Styling for the interface
- **src/app.ts** - Main application logic
  - Manages cube state
  - Handles user input
  - Coordinates rendering
  - Move history & undo

### Features

- **Mode Switching**: Toggle between 2D and 3D views
- **Move Buttons**: 18 buttons for all standard moves
- **Sequence Input**: Type move sequences like "R U R' U'"
- **Scramble**: Random 20-move scrambles
- **Reset**: Return to solved state
- **Undo**: Step backward through moves
- **Move History**: Visual display of all applied moves

## Running

```bash
# Development server with hot reload
npm run web:dev

# Production build
npm run web:build

# Preview production build
npm run web:preview
```

## Technology Stack

- **Vite** - Build tool and dev server
- **Three.js** - 3D rendering
- **Native Canvas 2D** - 2D rendering
- **Pure TypeScript** - No framework dependencies
