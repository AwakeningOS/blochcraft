import assert from "node:assert/strict";
import { insertBlankColumn, simulate } from "../src/circuit.js";
import { abs2 } from "../src/complex.js";

const blank=()=>({singles:[null,null,null],multi:null});
const close=(value,re,im=0)=>{assert.ok(Math.abs(value.re-re)<1e-12,`${value.re} != ${re}`);assert.ok(Math.abs(value.im-im)<1e-12,`${value.im} != ${im}`)};
const beforeColumns=[{id:"left"},{id:"selected"},{id:"right"}];
let keptSelection=insertBlankColumn(beforeColumns,1,false);
assert.deepEqual(beforeColumns.map(column=>column.id||"blank"),["left","blank","selected","right"]);
assert.equal(keptSelection,2);
const afterColumns=[{id:"left"},{id:"selected"},{id:"right"}];
keptSelection=insertBlankColumn(afterColumns,1,true);
assert.deepEqual(afterColumns.map(column=>column.id||"blank"),["left","selected","blank","right"]);
assert.equal(keptSelection,1);
const columns=Array.from({length:8},blank);
columns[0].singles[0]={kind:"h"};
columns[1].multi={kind:"cx",control:0,target:1};
let state=simulate(columns);
close(state[0],Math.SQRT1_2);close(state[6],Math.SQRT1_2);
assert.equal(state.filter((value)=>abs2(value)>1e-24).length,2);

columns[2].multi={kind:"cx",control:0,target:2};
state=simulate(columns);
close(state[0],Math.SQRT1_2);close(state[7],Math.SQRT1_2);
assert.equal(state.filter((value)=>abs2(value)>1e-24).length,2);

const phaseColumns=[blank(),blank()];phaseColumns[0].singles[0]={kind:"h"};phaseColumns[1].singles[0]={kind:"s"};
state=simulate(phaseColumns);close(state[0],Math.SQRT1_2);close(state[4],0,Math.SQRT1_2);
phaseColumns[1].singles[0]={kind:"sdg"};state=simulate(phaseColumns);close(state[4],0,-Math.SQRT1_2);
phaseColumns[0].singles[0]={kind:"y"};phaseColumns[1].singles[0]=null;state=simulate(phaseColumns);close(state[4],0,1);

const rotations=[blank(),blank(),blank()];rotations[0].singles[0]={kind:"rx",angle:180};rotations[1].singles[1]={kind:"ry",angle:180};rotations[2].singles[2]={kind:"rz",angle:90};state=simulate(rotations);close(state[6],-Math.SQRT1_2,-Math.SQRT1_2);close(state[7],0,0);

for(const operation of [{kind:"x"},{kind:"y"},{kind:"z"},{kind:"h"},{kind:"s"},{kind:"sdg"},{kind:"t"},{kind:"tdg"},{kind:"rx",angle:37},{kind:"ry",angle:-123},{kind:"rz",angle:271}]){
  const trial=[blank(),blank()];trial[0].singles[0]={kind:"h"};trial[1].singles[0]=operation;
  const norm=simulate(trial).reduce((sum,value)=>sum+abs2(value),0);
  assert.ok(Math.abs(norm-1)<1e-12,`${operation.kind} norm ${norm}`);
}

console.log("circuit tests: OK");
