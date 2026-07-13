import assert from "node:assert/strict";
import { relationshipMetrics } from "../src/relationship.js";

const close=(actual,expected,label)=>assert.ok(Math.abs(actual-expected)<1e-10,`${label}: ${actual}`);

let state=[1,0,0,0,0,0,0,0];
let metrics=relationshipMetrics(state);
metrics.forEach((m)=>{close(m.visible,1,`${m.name} product visible`);close(m.vault,0,`${m.name} product vault`)});

state=[Math.SQRT1_2,0,0,0,0,0,Math.SQRT1_2,0];
metrics=relationshipMetrics(state);
close(metrics[0].vault,1,"Bell A vault");close(metrics[1].vault,1,"Bell B vault");close(metrics[2].vault,0,"Bell C vault");

state=[Math.SQRT1_2,0,0,0,0,0,0,Math.SQRT1_2];
metrics=relationshipMetrics(state);
metrics.forEach((m)=>close(m.vault,1,`GHZ ${m.name} vault`));

console.log("relationship tests: OK");

