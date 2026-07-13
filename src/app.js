import { gates, gateName, conditionDescription } from "./gates.js";
import { DEG, axisVector, project, rotate, startVector, vec } from "./math3d.js";
import { initCircuit, reducedSummary, simulate } from "./circuit.js";
import { renderRelationship } from "./relationship.js";
import { initMeasurement } from "./measurement.js";
import { generateQiskit } from "./codegen.js";

const $ = (id) => document.getElementById(id);
const ui = {
  gate: $("gate"), globe: $("globe"), y: $("start-y"), x: $("start-x"),
  progress: $("progress"), condition: $("condition"),
  conditionRow: $("condition-row"), conditionHelp: $("condition-help"), facts: $("facts"),
};
let timer = null;
const camera = { yaw: 25 * DEG, pitch: -8 * DEG };
let circuitGateOverride = null;
let circuitStartOverride = null;

function name(gate) { return gateName(gate); }
function currentGate() { return circuitGateOverride || gates.find((gate) => gate.id === ui.gate.value) || gates[0]; }
function opposite(v) { return vec(-v.x, -v.y, -v.z); }

function refreshNames() {
  const keep = ui.gate.value || "h";
  ui.gate.innerHTML = "";
  for (const gate of gates) {
    const option = document.createElement("option");
    option.value = gate.id;
    option.textContent = name(gate);
    ui.gate.append(option);
  }
  ui.gate.value = gates.some((gate) => gate.id === keep) ? keep : "h";
  draw();
}

function svgArrow(from, to) {
  const heading = Math.atan2(to.y - from.y, to.x - from.x);
  const head = 24, base = 18;
  const bx = to.x - base * Math.cos(heading), by = to.y - base * Math.sin(heading);
  return `<line x1="${from.x}" y1="${from.y}" x2="${bx}" y2="${by}" stroke="var(--text)" stroke-width="3" stroke-linecap="round"/><polygon points="${to.x},${to.y} ${to.x-head*Math.cos(heading-.55)},${to.y-head*Math.sin(heading-.55)} ${to.x-head*Math.cos(heading+.55)},${to.y-head*Math.sin(heading+.55)}" fill="var(--text)"/>`;
}

function gridSegments(vectors, cx, cy, radius, yaw, pitch, frontColor, backColor) {
  let back = "", front = "";
  for (let i = 1; i < vectors.length; i++) {
    const a = project(vectors[i - 1], cx, cy, radius, yaw, pitch);
    const b = project(vectors[i], cx, cy, radius, yaw, pitch);
    const visible = (a.depth + b.depth) < 0;
    const line = `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${visible ? frontColor : backColor}" stroke-width="${visible ? 1 : .7}" ${visible ? "" : 'stroke-dasharray="3,4"'} opacity="${visible ? .42 : .13}"/>`;
    if (visible) front += line; else back += line;
  }
  return back + front;
}

function pathFor(start, axis, angle, cx, cy, radius, yaw, pitch, steps = 120) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const p = project(rotate(start, axis, angle * i / steps), cx, cy, radius, yaw, pitch);
    points.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return points.join(" ");
}

function draw() {
  const gate = currentGate();
  const axis = axisVector(gate.axis);
  const conditional = Boolean(gate.controls);
  const enabled = !conditional || ui.condition.checked;
  const start = circuitStartOverride || startVector(+ui.y.value, +ui.x.value);
  const progress = +ui.progress.value / 100;
  const { yaw, pitch } = camera;
  const angle = enabled ? gate.angle * DEG : 0;
  const current = rotate(start, axis, angle * progress);
  const end = rotate(start, axis, angle);
  const cx = 380, cy = 278, radius = 205;

  $("start-y-out").textContent = circuitStartOverride ? "回路" : `${ui.y.value}°`;
  $("start-x-out").textContent = circuitStartOverride ? "回路" : `${ui.x.value}°`;
  $("progress-out").textContent = `${ui.progress.value}%`;
  $("gate-badge").textContent = name(gate);
  ui.conditionRow.hidden = !conditional;
  ui.conditionHelp.hidden = !conditional;
  ui.conditionHelp.textContent = conditionDescription(gate);

  let svg = `<defs><radialGradient id="globe-light" cx="34%" cy="27%" r="72%"><stop offset="0%" stop-color="#fff" stop-opacity=".38"/><stop offset="58%" stop-color="#9ec5df" stop-opacity=".12"/><stop offset="100%" stop-color="#536b84" stop-opacity=".25"/></radialGradient><radialGradient id="tip-bead" cx="30%" cy="24%" r="72%"><stop offset="0%" stop-color="#fff"/><stop offset="28%" stop-color="#f7f5ef"/><stop offset="72%" stop-color="#9aa8b8"/><stop offset="100%" stop-color="#485665"/></radialGradient></defs>`;
  svg += `<ellipse cx="${cx+18}" cy="${cy+radius+24}" rx="${radius*.78}" ry="18" fill="#26384b" opacity=".13"/><circle cx="${cx}" cy="${cy}" r="${radius}" fill="url(#globe-light)" stroke="#687583" stroke-width="1" stroke-opacity=".35"/>`;

  for (const [index, z] of [-.5, 0, .5].entries()) {
    const rr = Math.sqrt(1 - z * z), vectors = [];
    for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; vectors.push(vec(rr * Math.cos(a), rr * Math.sin(a), z)); }
    svg += gridSegments(vectors, cx, cy, radius, yaw, pitch, index === 1 ? "#3d91c9" : "#66a8cf", "#7893a6");
  }
  for (const [index, degrees] of [0, 45, 90, 135].entries()) {
    const longitude = degrees * DEG, vectors = [];
    for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2; vectors.push(vec(Math.sin(a) * Math.cos(longitude), Math.sin(a) * Math.sin(longitude), Math.cos(a))); }
    svg += gridSegments(vectors, cx, cy, radius, yaw, pitch, index % 2 ? "#d19a3b" : "#bd744e", "#9b8d76");
  }
  svg += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#687583" stroke-width="1.2" opacity=".48"/>`;

  const fixedAxes=[
    [vec(0,0,1),"#4f708f","南北軸"],
    [vec(1,0,0),"#98703d","東西軸"],
    [vec(0,1,0),"#795f82","表裏軸"],
  ];
  for(const [fixedAxis,color,axisLabel] of fixedAxes){
    const a=project(fixedAxis,cx,cy,radius*1.28,yaw,pitch),b=project(opposite(fixedAxis),cx,cy,radius*1.28,yaw,pitch);
    svg+=`<line x1="${b.x}" y1="${b.y}" x2="${a.x}" y2="${a.y}" stroke="${color}" stroke-width="2" opacity=".88"/><title>${axisLabel}</title>`;
  }

  const directions = [
    ["北 |0⟩", vec(0,0,1), "#2a78d6"], ["南 |1⟩", vec(0,0,-1), "#d1495b"],
    ["東 |+⟩", vec(1,0,0), "#1baf7a"], ["西 |−⟩", vec(-1,0,0), "#c98500"],
    ["表 |+i⟩", vec(0,1,0), "#d43791"], ["裏 |−i⟩", vec(0,-1,0), "#008ca8"],
  ];
  for (const [label, vector, color] of directions) {
    const point = project(vector, cx, cy, radius, yaw, pitch);
    let dx=point.x-cx,dy=point.y-cy,length=Math.hypot(dx,dy);
    if(length<1){dx=label.startsWith("表")?1:-1;dy=label.startsWith("表")?-.35:.35;length=Math.hypot(dx,dy)}
    const text={x:cx+(radius+82)*dx/length,y:cy+(radius+82)*dy/length};
    const front=point.depth<0,opacity=front?1:.3,dash=front?"":'stroke-dasharray="4,4"';
    svg += `<circle cx="${point.x}" cy="${point.y}" r="4.5" fill="${color}" opacity="${opacity}"/><line x1="${point.x}" y1="${point.y}" x2="${text.x}" y2="${text.y}" stroke="${color}" opacity="${front?.65:.25}" ${dash}/><text x="${text.x}" y="${text.y+6}" font-size="18" font-weight="700" fill="${color}" opacity="${opacity}" text-anchor="middle">${label}</text>`;
  }

  const axisA = project(axis, cx, cy, radius * 1.32, yaw, pitch), axisB = project(opposite(axis), cx, cy, radius * 1.32, yaw, pitch);
  svg += `<line x1="${axisB.x}" y1="${axisB.y}" x2="${axisA.x}" y2="${axisA.y}" stroke="#8e55bd" stroke-width="2.3" stroke-dasharray="14,5,2,5" opacity=".88"/><text x="${axisA.x}" y="${axisA.y-10}" font-size="14" font-weight="700" fill="#8e55bd" text-anchor="middle">回転軸</text>`;
  svg += `<polyline points="${pathFor(start, axis, Math.PI * 2, cx, cy, radius, yaw, pitch)}" fill="none" stroke="#1baf7a" stroke-width="1.2" stroke-dasharray="4,5" opacity=".62"/>`;
  if (enabled && progress > 0) svg += `<polyline points="${pathFor(start, axis, angle * progress, cx, cy, radius, yaw, pitch, 80)}" fill="none" stroke="#d4537e" stroke-width="1.8" stroke-dasharray="4,4"/>`;

  const origin = { x: cx, y: cy }, tip = project(current, cx, cy, radius, yaw, pitch), finish = project(end, cx, cy, radius, yaw, pitch);
  svg += `<circle cx="${finish.x}" cy="${finish.y}" r="6" fill="#1baf7a" opacity=".72"/>${svgArrow(origin, tip)}`;
  svg += `<ellipse cx="${tip.x+4}" cy="${tip.y+7}" rx="15" ry="7" fill="#1b2633" opacity=".22"/><circle cx="${tip.x}" cy="${tip.y}" r="16" fill="none" stroke="#fff" stroke-width="2" opacity=".34"/><circle cx="${tip.x}" cy="${tip.y}" r="11" fill="url(#tip-bead)" stroke="#fff"/><circle cx="${tip.x-3}" cy="${tip.y-4}" r="2.8" fill="#fff" opacity=".92"/>`;
  ui.globe.innerHTML = svg;

  const blochTheta=Math.acos(Math.max(-1,Math.min(1,current.z)))/DEG;
  const radial=Math.hypot(current.x,current.y);
  const blochPhi=radial<1e-8?null:(Math.atan2(current.y,current.x)/DEG+360)%360;
  ui.facts.innerHTML = [
    ["回転軸", gate.axis === "x" ? "東西軸" : gate.axis === "z" ? "南北軸" : gate.axis === "h" ? "北東斜め軸" : "表裏軸"],
    ["回転量", `${Math.abs(gate.angle)}°`],
    ["条件", conditional ? (enabled ? "成立" : "不成立") : "なし"],
    ["現在位置（球体語）", `X 東西 ${current.x.toFixed(3)} / Y 表裏 ${current.y.toFixed(3)} / Z 南北 ${current.z.toFixed(3)}`],
    ["標準Bloch表記", `r=(⟨X⟩,⟨Y⟩,⟨Z⟩)=(${current.x.toFixed(3)}, ${current.y.toFixed(3)}, ${current.z.toFixed(3)})<br>(θ, φ)=(${blochTheta.toFixed(1)}°, ${blochPhi===null?"未定義":blochPhi.toFixed(1)+"°"})`],
  ].map(([key, value]) => `<div class="fact"><small>${key}</small><strong>${value}</strong></div>`).join("");
}

function preset(name) {
  const values = { north:[0,0], south:[180,0], east:[90,0], west:[270,0], front:[0,270], back:[0,90] }[name];
  circuitStartOverride=null;[ui.y.value, ui.x.value] = values; ui.progress.value = 0; draw();
}

ui.gate.addEventListener("input",()=>{circuitGateOverride=null;draw()});
for (const element of [ui.y,ui.x]) element.addEventListener("input",()=>{circuitStartOverride=null;draw()});
for (const element of [ui.progress,ui.condition]) element.addEventListener("input",draw);
for (const button of document.querySelectorAll("[data-preset]")) button.addEventListener("click", () => preset(button.dataset.preset));
$("play").onclick = () => { if (timer) return; if (+ui.progress.value >= 100) ui.progress.value = 0; timer = setInterval(() => { ui.progress.value = Math.min(100, +ui.progress.value + 1); draw(); if (+ui.progress.value >= 100) { clearInterval(timer); timer = null; } }, 25); };
$("stop").onclick = () => { if (timer) clearInterval(timer); timer = null; };
const resetSingleView = () => { camera.yaw = 25 * DEG; camera.pitch = -8 * DEG; draw(); };
$("reset-view").onclick = resetSingleView;
$("reset-view-controls").onclick = resetSingleView;

let drag = null;
ui.globe.addEventListener("pointerdown", (event) => {
  drag = { x: event.clientX, y: event.clientY, yaw: camera.yaw, pitch: camera.pitch };
  ui.globe.setPointerCapture(event.pointerId);
  ui.globe.classList.add("dragging");
});
ui.globe.addEventListener("pointermove", (event) => {
  if (!drag) return;
  camera.yaw = drag.yaw + (event.clientX - drag.x) * 0.008;
  camera.pitch = drag.pitch - (event.clientY - drag.y) * 0.008;
  draw();
});
const endDrag = () => { drag = null; ui.globe.classList.remove("dragging"); };
ui.globe.addEventListener("pointerup", endDrag);
ui.globe.addEventListener("pointercancel", endDrag);

refreshNames();
let circuitSnapshot=[],circuitSteps=8,measurementFilters=Array.from({length:3},()=>({theta:0,phi:0}));
const refreshCode=()=>{$("qiskit-code").textContent=generateQiskit(circuitSnapshot,circuitSteps,measurementFilters)};
const measurement=initMeasurement({onFilters(filters){measurementFilters=filters;refreshCode()}});
initCircuit({
  onSelect({operation,target=0,startState=null,source}) {
    if (!operation) return;
    const axes={rx:"x",x:"x",cx:"x",ccx:"x",ry:"y",y:"y",rz:"z",z:"z",s:"z",sdg:"z",t:"z",tdg:"z",h:"h"};
    const angles={x:180,y:180,z:180,h:180,s:90,sdg:-90,t:45,tdg:-45,cx:180,ccx:180};
    circuitGateOverride={id:operation.id||operation.kind,standard:operation.label||operation.kind.toUpperCase(),sphere:operation.sphere||"回路エディターの操作",axis:axes[operation.kind]||"y",angle:operation.angle??angles[operation.kind]??90,...(operation.kind==="cx"?{controls:["control"],target:"target"}:{})};
    const operationTabId=operation.id||operation.kind;
    if(gates.some(gate=>gate.id===operationTabId))ui.gate.value=operationTabId;
    if(source==="circuit"&&startState){const summary=reducedSummary(startState,target);circuitStartOverride=vec(summary.x,summary.y,summary.z)}
    ui.progress.value = 0;
    draw();
  },
  onState(state) {
    measurement.update(state);
  },
  onCircuit(columns,steps){circuitSnapshot=columns;circuitSteps=steps;const history=Array.from({length:steps+1},(_,i)=>simulate(columns,i));renderRelationship(history.at(-1),{svg:$("relationship-view"),cards:$("relationship-cards"),history});refreshCode()},
});
$("copy-code").onclick=async()=>{try{await navigator.clipboard.writeText($("qiskit-code").textContent);$("copy-code").textContent="コピーしました";setTimeout(()=>$("copy-code").textContent="コードをコピー",1200)}catch{$("copy-code").textContent="選択してコピーしてください"}};
