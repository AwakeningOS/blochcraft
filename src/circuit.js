const QUBITS = ["A", "B", "C"];
const MASK = [4, 2, 1];
const DEG = Math.PI / 180;

const tools = [
  { id:"ry30", label:"RY(30°)", sphere:"表裏軸回転 +15°", type:"single", kind:"ry", angle:30 },
  { id:"ry60", label:"RY(60°)", sphere:"表裏軸回転 +30°", type:"single", kind:"ry", angle:60 },
  { id:"ry90", label:"RY(90°)", sphere:"表裏軸回転 +45°", type:"single", kind:"ry", angle:90 },
  { id:"rym90", label:"RY(−90°)", sphere:"表裏軸回転 −45°", type:"single", kind:"ry", angle:-90 },
  { id:"x", label:"X", sphere:"東西軸180°回転", type:"single", kind:"x" }, { id:"z", label:"Z", sphere:"南北軸180°回転", type:"single", kind:"z" },
  { id:"h", label:"H", sphere:"北東斜め軸180°回転", type:"single", kind:"h" },
  ...[[0,1],[1,0],[0,2],[2,0],[1,2],[2,1]].map(([control,target])=>({id:`cx${control}${target}`,label:`CNOT ${QUBITS[control]}→${QUBITS[target]}`,sphere:`条件付き東西軸180°回転：${QUBITS[control]}が南極 |1⟩ なら${QUBITS[target]}を回す`,type:"controlled",kind:"cx",control,target,sync:"cx"})),
  { id:"ccx", label:"Toffoli A,B→C", sphere:"2条件付き東西軸180°回転：AとBが両方とも南極 |1⟩ ならCを回す", type:"controlled", kind:"ccx",controls:[0,1],target:2,sync:"ccx" },
  { id:"delete", label:"消す", sphere:"選んだマスの操作を削除", type:"delete" },
];

const blank = () => ({ singles:[null,null,null], multi:null });

function applySingle(state, qubit, operation) {
  const mask = MASK[qubit];
  if (operation.kind === "z") { for (let i=0;i<8;i++) if (i&mask) state[i] = -state[i]; return; }
  if (operation.kind === "x") { for (let i=0;i<8;i++) if (!(i&mask)) [state[i],state[i|mask]]=[state[i|mask],state[i]]; return; }
  const angle = operation.kind === "h" ? null : operation.angle * DEG / 2;
  const c = operation.kind === "h" ? Math.SQRT1_2 : Math.cos(angle);
  const s = operation.kind === "h" ? Math.SQRT1_2 : Math.sin(angle);
  for (let i=0;i<8;i++) if (!(i&mask)) {
    const a=state[i],b=state[i|mask];
    if (operation.kind === "h") { state[i]=(a+b)*c; state[i|mask]=(a-b)*c; }
    else { state[i]=c*a-s*b; state[i|mask]=s*a+c*b; }
  }
}

function applyMulti(state, operation) {
  const targetMask=MASK[operation.target];
  const active = operation.kind === "ccx"
    ? (i)=>operation.controls.every((q)=>i&MASK[q])
    : (i)=>Boolean(i&MASK[operation.control]);
  for(let i=0;i<8;i++) if(active(i)&&!(i&targetMask)) [state[i],state[i|targetMask]]=[state[i|targetMask],state[i]];
}

export function simulate(columns, steps=columns.length) {
  const state=[1,0,0,0,0,0,0,0];
  for(const column of columns.slice(0,steps)) {
    if(column.multi) applyMulti(state,column.multi);
    else column.singles.forEach((operation,q)=>{if(operation)applySingle(state,q,operation)});
  }
  return state;
}

function reducedSummary(state, qubit) {
  const mask=MASK[qubit];let p0=0,p1=0,cross=0;
  for(let i=0;i<8;i++) if(!(i&mask)){const a=state[i],b=state[i|mask];p0+=a*a;p1+=b*b;cross+=a*b}
  const x=2*cross,z=p0-p1,length=Math.hypot(x,z);
  return {p0,p1,x,z,length};
}

export function initCircuit({ onSelect, onState, onCircuit }) {
  const toolBox=document.getElementById("circuit-tools"),grid=document.getElementById("circuit-grid");
  const step=document.getElementById("circuit-step"),stepOut=document.getElementById("circuit-step-out");
  let selected="ry90",columns=Array.from({length:8},blank),selectedColumn=-1;

  function renderTools(){toolBox.innerHTML="";for(const tool of tools){const button=document.createElement("button");button.textContent=tool.label;button.className=selected===tool.id?"active":"";button.onclick=()=>{selected=tool.id;renderTools();if(tool.type!=="delete")onSelect?.(tool.sync||tool.id)};toolBox.append(button)}const clear=document.createElement("button");clear.textContent="全部消す";clear.onclick=()=>{columns=Array.from({length:8},blank);selectedColumn=-1;render()};toolBox.append(clear);const tool=tools.find(item=>item.id===selected);document.getElementById("circuit-tool-meaning").innerHTML=`<strong>${tool.label}</strong><span>球体名：${tool.sphere}</span>`}
  function cellText(column,q){if(column.multi){if(column.multi.kind==="ccx"&&column.multi.controls.includes(q))return"●";if(column.multi.kind==="cx"&&column.multi.control===q)return"●";if(column.multi.target===q)return"⊕";return"│"}const op=column.singles[q];if(!op)return"";return op.kind==="ry"?`RY${op.angle>0?"+":""}${op.angle}°`:op.kind.toUpperCase()}
  function renderGrid(){grid.innerHTML="";for(let q=0;q<3;q++){const label=document.createElement("div");label.className="wire-label";label.textContent=QUBITS[q];grid.append(label);for(let c=0;c<8;c++){const cell=document.createElement("button");cell.className="circuit-cell"+(selectedColumn===c?" selected-column":"");const text=document.createElement("span");text.className="gate-label";text.textContent=cellText(columns[c],q);cell.append(text);cell.onclick=()=>place(q,c);grid.append(cell)}}}
  function place(q,c){const tool=tools.find((item)=>item.id===selected);selectedColumn=c;if(tool.type==="delete"){columns[c].multi=null;columns[c].singles[q]=null}else if(tool.type==="controlled"){columns[c]=blank();columns[c].multi={...tool}}else{columns[c].multi=null;columns[c].singles[q]={...tool}}render();syncSelection(c)}
  function syncSelection(c){const column=columns[c];let operation=column.multi;if(!operation)operation=column.singles.find(Boolean);const card=document.getElementById("circuit-selection");if(!operation){card.textContent=`${c+1}列目：操作なし`;return}card.innerHTML=`<strong>${c+1}列目：${operation.label}</strong><span>球体名：${operation.sphere}</span>`;onSelect?.(operation.sync||operation.id)}
  function renderState(){const steps=+step.value,state=simulate(columns,steps);stepOut.textContent=`${step.value}列目まで`;document.getElementById("state-table").innerHTML=state.map((amplitude,i)=>{const probability=amplitude*amplitude*100,bits=i.toString(2).padStart(3,"0");return`<div class="state-row"><code>${bits}</code><span><i style="width:${probability}%"></i></span><b>${amplitude<-.000001?"−":""}${probability.toFixed(1)}%</b></div>`}).join("");document.getElementById("qubit-summary").innerHTML=QUBITS.map((name,q)=>{const s=reducedSummary(state,q),mixed=s.length<.999;return`<div><strong>${name}</strong><span>北 |0⟩ ${(s.p0*100).toFixed(1)}% / 南 |1⟩ ${(s.p1*100).toFixed(1)}%</span><small>${mixed?`関係あり・単体矢印 ${(s.length*100).toFixed(1)}%`:"単体球で表現可能"}</small></div>`}).join("");onState?.(state);onCircuit?.(columns.map(c=>({singles:[...c.singles],multi:c.multi})),steps)}
  function render(){renderTools();renderGrid();renderState()}
  step.oninput=renderState;
  render();
  return { simulate:()=>simulate(columns,+step.value) };
}
