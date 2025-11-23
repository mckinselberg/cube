import { createSolved, applyMoves, printCube, U, R } from './src/index.ts';

console.log('=== Rubik\'s Cube Engine Demo ===\n');

// Create a solved cube
const solved = createSolved();
console.log('Solved Cube:');
console.log(printCube(solved));
console.log();

// Apply a single U move
const afterU = U(solved);
console.log('After U move:');
console.log(printCube(afterU));
console.log();

// Apply R U R' U' sequence (sexy move)
const scrambled = applyMoves(solved, "R U R' U'");
console.log("After R U R' U':");
console.log(printCube(scrambled));
console.log();

// Verify U×4 = identity
const identity = applyMoves(solved, 'U U U U');
console.log('After U×4 (should be solved):');
console.log(printCube(identity));
console.log();
console.log('Is solved?', JSON.stringify(identity) === JSON.stringify(solved));
