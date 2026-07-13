import assert from "node:assert/strict";
import { generateQiskit } from "../src/codegen.js";
const blank=()=>({singles:[null,null,null],multi:null});
const columns=[blank(),blank()];columns[0].singles[0]={kind:"h"};columns[1].multi={kind:"cx",control:0,target:1};
const code=generateQiskit(columns,2,[{theta:0,phi:0},{theta:90,phi:0},{theta:90,phi:225}]);
for(const text of ["qc.h(0)","qc.cx(0, 1)","qc.ry(-90 * pi / 180, 1)","qc.rz(-225 * pi / 180, 2)","qc.measure_all()","StatevectorSampler"])assert.ok(code.includes(text),text);
console.log("codegen tests passed");
