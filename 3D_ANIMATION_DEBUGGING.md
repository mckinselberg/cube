# 3D Animation Debugging Summary

## Problem Overview

The 3D visualization of the Rubik's Cube has issues where the rotation animations don't produce the correct final state, even though the underlying cube logic is correct.

## Key Findings

### Verified Working
- ✅ **Cube logic is 100% correct** - All moves (U, R, F, D, L, B) work correctly in 2D mode
- ✅ **R×4, U×4, F×4, etc. all return to solved state** - Confirmed via console logging
- ✅ **Move parser and state management** - No issues with applying moves or tracking history

### Current Issues
- ❌ **3D visualization doesn't match 2D** - After moves, the 3D cube shows incorrect colors
- ❌ **Color mapping is wrong** - The mapping between logical cube faces (U,R,F,D,L,B) and 3D geometry faces is incorrect
- ❌ **All moves affected** - Initially R worked, but after changes, all moves now display incorrectly

## Technical Details

### Cube Coordinate System
```
Grid coordinates: x,y,z ∈ [0,1,2]
3D positions: (x-1, y-1, z-1) ∈ [-1,0,1]

Positions:
- Right face: x=2 → position.x=1
- Left face: x=0 → position.x=-1
- Top face: y=2 → position.y=1
- Bottom face: y=0 → position.y=-1
- Front face: z=2 → position.z=1
- Back face: z=0 → position.z=-1
```

### Standard Cube Notation
```
U = White (top)
D = Yellow (bottom)
F = Green (front)
R = Red (right)
L = Orange (left)
B = Blue (back)
```

### Animation Flow
1. User clicks move button (e.g., "R")
2. `animateMove()` selects cubies and rotates them visually
3. After animation completes, callback updates logical cube state
4. `render()` rebuilds ALL 26 cubies from scratch using new state
5. **Issue occurs here** - Colors don't match expected result

### Current Color Mapping (canvas3D.ts lines 195-202)
```typescript
const faceColors = [
  x === 2 ? this.getFaceColor(cube.R, 2 - y, 2 - z) : 0x000000, // Right
  x === 0 ? this.getFaceColor(cube.L, 2 - y, z) : 0x000000, // Left
  y === 2 ? this.getFaceColor(cube.U, z, x) : 0x000000, // Top
  y === 0 ? this.getFaceColor(cube.D, 2 - z, x) : 0x000000, // Bottom
  z === 2 ? this.getFaceColor(cube.F, 2 - y, x) : 0x000000, // Front
  z === 0 ? this.getFaceColor(cube.B, 2 - y, 2 - x) : 0x000000, // Back
];
```

Note: This mapping has been modified multiple times. The z-coordinate flipping for R/L/U/D was the most recent change.

### Rotation Logic (canvas3D.ts lines 450-492)
```typescript
// Pattern: Positive positions get angle negated, negative positions don't
case "U": axis = (0,1,0), angle = -angle  // Top
case "D": axis = (0,1,0), angle unchanged // Bottom
case "R": axis = (1,0,0), angle = -angle  // Right
case "L": axis = (1,0,0), angle unchanged // Left
case "F": axis = (0,0,1), angle = -angle  // Front
case "B": axis = (0,0,1), angle unchanged // Back
```

This pattern is based on THREE.js right-hand rule and should be correct.

### Camera Setup
```typescript
camera.position.set(6, 6, 6);
camera.lookAt(0, 0, 0);
```
Isometric view from front-right-top corner.

## Changes Made During Debugging

### Session 1: Animation Timing Fix
- **Problem**: Cube state updated before animation, showing wrong colors during rotation
- **Solution**: Changed to update state AFTER animation completes
- **File**: `src/app.ts`
- **Result**: Animation shows correct colors during rotation, but final state still wrong for some moves

### Session 2: Rotation Direction Fix for R
- **Problem**: R move rotating in wrong direction (behaving like R')
- **Solution**: Applied right-hand rule corrections - negate angles for U, R, F (positive positions)
- **Files**: `src/visualization/canvas3D.ts`
- **Result**: R moves worked correctly

### Session 3: F and B Issues
- **Problem**: F and B not working correctly
- **Attempts**:
  - Tried swapping F/B in material array ❌
  - Tried adding initial cube rotation ❌
  - Reverted both changes
- **Result**: R broke again, all moves now incorrect

### Session 4: Color Mapping Investigation
- **Finding**: Logical cube state is correct (verified with console logs)
- **Conclusion**: Issue is purely in the color-to-geometry mapping
- **Current attempt**: Flipped z-coordinates for R, L, U, D faces in color mapping
- **Status**: Unknown - needs testing

## Root Cause Analysis

The disconnect is between:
1. **Logical model** - U/R/F/D/L/B faces in cube state (working correctly)
2. **3D geometry** - Physical positions and material assignments (broken)

The mapping from (x,y,z) grid coordinates to cube face indices `(row, col)` is incorrect for some faces.

## Next Steps to Try

### Option 1: Systematic Testing
Test each face individually with a known pattern:
1. Create a cube with unique colors on each sticker
2. Verify which logical face appears where in 3D
3. Correct the mapping one face at a time

### Option 2: Reference Implementation
Look at how other 3D Rubik's Cube visualizations handle this:
- three-js examples
- Open source cube simulators
- Compare coordinate systems

### Option 3: Rebuild Color Mapping from Scratch
1. For each cubie at (x,y,z), determine which faces are visible
2. For each visible face, determine which logical face it represents
3. Calculate the correct row/col indices accounting for:
   - Face orientation (which way is "up" for that face)
   - Mirroring (viewing from outside vs inside)
   - Coordinate transformations

### Option 4: Match 2D Layout
Since 2D works perfectly:
1. Study the 2D renderer's coordinate system
2. Ensure 3D uses the same logical mapping
3. Only difference should be the visual representation (flat vs 3D)

## Files Modified

- `src/app.ts` - Animation timing fixes, debug logging
- `src/visualization/canvas3D.ts` - Rotation directions, color mapping

## Test Case

```javascript
// In browser console after moves:
// 1. Switch to 2D mode
// 2. Click R four times → should return to solved ✅
// 3. Switch to 3D mode
// 4. Click R four times → should return to solved ✅
// 5. But visual appearance doesn't match 2D ❌

// Console shows correct state:
// After R: {U: Array(9), R: Array(9), F: Array(9), D: Array(9), L: Array(9), B: Array(9)}
```

## Debug Features Available

Enable debug mode via:
```javascript
window.cubeDebug.enable()
window.cubeDebug.setSlowMotion(2)  // Half speed
window.cubeDebug.highlightCubies(true)
window.cubeDebug.logAnimations(true)
```

## Key Insight

The cube is **logically correct but visually wrong**. The issue is **not** in:
- Move algorithms
- State management
- Animation rotation axes/angles
- Parser

The issue **is** in:
- Color-to-material assignment in `createCubie()`
- Row/column index calculations for each face
- Coordinate transformation logic

## Recommendation

Focus exclusively on the `createCubie()` function and verify the mapping for ONE face at a time, starting with the simplest case (likely U or F). Once one face is proven correct, apply the same logic pattern to the others.
