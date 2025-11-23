# Changelog

## [1.1.0] - 2025-11-23

### Added

- Interactive web visualizer with 2D and 3D modes
- 2D net layout renderer showing all 6 faces
- 3D interactive WebGL renderer with Three.js
- Mouse drag controls for 3D rotation
- UI controls for all 18 moves (U, U', U2, R, R', R2, etc.)
- Move sequence input supporting standard notation
- Random scramble generator (20-move sequences)
- Undo functionality with move history display
- Mode switcher between 2D and 3D views
- Vite development server setup

### Technical

- Added Three.js for 3D rendering
- Added Vite for bundling and dev server
- Created canvas2D.ts and canvas3D.ts renderers
- Created web application entry point (app.ts)
- Added HTML/CSS for web interface
- Configured separate tsconfig for web with DOM types

## [1.0.0] - Initial Release

### Features

- Pure TypeScript Rubik's Cube engine
- Immutable cube operations
- Complete move set (18 moves)
- ASCII visualizer
- Move parser and sequencer
- Comprehensive test suite with Vitest
- Strict TypeScript configuration
