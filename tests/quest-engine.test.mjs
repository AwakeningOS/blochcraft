import assert from "node:assert/strict";
import { evaluateSharedSecret } from "../src/quest-engine.js";

const blank = evaluateSharedSecret([1,0,0,0,0,0,0,0]);
assert.equal(blank.complete, false);
assert.equal(blank.together, true);
assert.equal(blank.calm, true);

const bell = evaluateSharedSecret([Math.SQRT1_2,0,0,0,0,0,Math.SQRT1_2,0]);
assert.equal(bell.complete, true);
assert.equal(bell.random, true);
assert.equal(bell.together, true);
assert.equal(bell.calm, true);

const mismatch = evaluateSharedSecret([Math.SQRT1_2,0,Math.SQRT1_2,0,0,0,0,0]);
assert.equal(mismatch.complete, false);
assert.equal(mismatch.together, false);

console.log("quest engine tests: OK");
