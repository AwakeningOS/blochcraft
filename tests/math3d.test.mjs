import assert from "node:assert/strict";
import { DEG, axisVector, project, rotate, startVector, vec } from "../src/math3d.js";

const close = (actual, expected, message) => {
  assert.ok(Math.abs(actual.x - expected.x) < 1e-10, `${message}: x`);
  assert.ok(Math.abs(actual.y - expected.y) < 1e-10, `${message}: y`);
  assert.ok(Math.abs(actual.z - expected.z) < 1e-10, `${message}: z`);
};

close(startVector(0, 0), vec(0, 0, 1), "north preset");
close(startVector(90, 0), vec(1, 0, 0), "east preset");
close(startVector(180, 0), vec(0, 0, -1), "south preset");
close(startVector(270, 0), vec(-1, 0, 0), "west preset");
assert.ok(project(vec(0,1,0),0,0,1,0,0).depth<0,"表 |+i⟩ must be camera-facing");
assert.ok(project(vec(0,-1,0),0,0,1,0,0).depth>0,"裏 |−i⟩ must be camera-away");
const frontAtDefaultView=project(vec(0,1,0),0,0,1,25*DEG,-8*DEG);
const backAtDefaultView=project(vec(0,-1,0),0,0,1,25*DEG,-8*DEG);
assert.ok(frontAtDefaultView.depth<backAtDefaultView.depth,"表 |+i⟩ must be layered in front of 裏 |−i⟩");

const arbitrary = startVector(65, 40);
const afterH = rotate(arbitrary, axisVector("h"), Math.PI);
const afterH2 = rotate(afterH, axisVector("h"), Math.PI);
close(afterH2, arbitrary, "H twice returns the state");

const afterFullTurn = rotate(arbitrary, axisVector("y"), 360 * DEG);
close(afterFullTurn, arbitrary, "full turn returns the state");

console.log("math3d tests: OK");
