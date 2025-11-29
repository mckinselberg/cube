import { createSolved } from "../src/cube/createSolved.ts";
import { applyMoves } from "../src/parser/applyMoves.ts";
import type { Cube } from "../src/cube/types.ts";

const scramble = "R U R' U' F2 D L B";
const scrambled: Cube = applyMoves(createSolved(), scramble);
console.log(JSON.stringify(scrambled, null, 2));
