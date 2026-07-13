import assert from "node:assert/strict";
import { simulate } from "../src/circuit.js";

const blank=()=>({singles:[null,null,null],multi:null});
const columns=Array.from({length:8},blank);
columns[0].singles[0]={kind:"h"};
columns[1].multi={kind:"cx",control:0,target:1};
let state=simulate(columns);
assert.ok(Math.abs(state[0]-Math.SQRT1_2)<1e-12);
assert.ok(Math.abs(state[6]-Math.SQRT1_2)<1e-12);
assert.equal(state.filter((x)=>Math.abs(x)>1e-12).length,2);

columns[2].multi={kind:"cx",control:0,target:2};
state=simulate(columns);
assert.ok(Math.abs(state[0]-Math.SQRT1_2)<1e-12);
assert.ok(Math.abs(state[7]-Math.SQRT1_2)<1e-12);
assert.equal(state.filter((x)=>Math.abs(x)>1e-12).length,2);

console.log("circuit tests: OK");
