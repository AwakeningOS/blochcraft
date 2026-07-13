import { abs2, add, asComplex, complex, conj, mul, phase, scale } from "./complex.js";

const QUBITS = ["A", "B", "C"];
const MASK = [4, 2, 1];
const DEG = Math.PI / 180;

const tools = [
  { id:"x", label:"X", sphere:"東西軸180°回転", type:"single", kind:"x" },
  { id:"y", label:"Y", sphere:"東西軸と南北軸の複素位相反転", type:"single", kind:"y" },
  { id:"z", label:"Z", sphere:"南北軸180°回転", type:"single", kind:"z" },
  { id:"h", label:"H", sphere:"北東斜め軸180°回転", type:"single", kind:"h" },
  { id:"s", label:"S", sphere:"南北軸 +90°位相回転", type:"single", kind:"s" },
  { id:"sdg", label:"S†", sphere:"南北軸 −90°位相回転", type:"single", kind:"sdg" },
  { id:"t", label:"T", sphere:"南北軸 +45°位相回転", type:"single", kind:"t" },
  { id:"tdg", label:"T†", sphere:"南北軸 −45°位相回転", type:"single", kind:"tdg" },
  { id:"rx", label:"RX(θ)", sphere:"東西軸の角度指定回転", type:"rotation", kind:"rx", sync:"x" },
  { id:"ry", label:"RY(θ)", sphere:"表裏軸の角度指定回転", type:"rotation", kind:"ry", sync:"ry90" },
  { id:"rz", label:"RZ(θ)", sphere:"南北軸の角度指定回転", type:"rotation", kind:"rz", sync:"z" },
  ...[[0,1],[1,0],[0,2],[2,0],[1,2],[2,1]].map(([control,target])=>({id:`cx${control}${target}`,label:`CNOT ${QUBITS[control]}→${QUBITS[target]}`,sphere:`${QUBITS[control]}が南 |1⟩ のとき${QUBITS[target]}をX反転`,type:"controlled",kind:"cx",control,target,sync:"cx"})),
  { id:"ccx", label:"Toffoli A,B→C", sphere:"AとBが両方とも南 |1⟩ のときCをX反転", type:"controlled", kind:"ccx", controls:[0,1], target:2, sync:"ccx" },
  { id:"delete", label:"消す", sphere:"選んだマスの操作を削除", type:"delete" },
];

const blank = () => ({ singles:[null,null,null], multi:null });
const matrix = (operation) => {
  const c0=complex(0),c1=complex(1),i=complex(0,1),mi=complex(0,-1);
  if(operation.kind==="x")return[[c0,c1],[c1,c0]];
  if(operation.kind==="y")return[[c0,mi],[i,c0]];
  if(operation.kind==="z")return[[c1,c0],[c0,complex(-1)]];
  if(operation.kind==="h")return[[scale(c1,Math.SQRT1_2),scale(c1,Math.SQRT1_2)],[scale(c1,Math.SQRT1_2),scale(c1,-Math.SQRT1_2)]];
  if(operation.kind==="s")return[[c1,c0],[c0,i]];
  if(operation.kind==="sdg")return[[c1,c0],[c0,mi]];
  if(operation.kind==="t")return[[c1,c0],[c0,phase(Math.PI/4)]];
  if(operation.kind==="tdg")return[[c1,c0],[c0,phase(-Math.PI/4)]];
  const half=(operation.angle??90)*DEG/2,c=Math.cos(half),s=Math.sin(half);
  if(operation.kind==="rx")return[[complex(c),complex(0,-s)],[complex(0,-s),complex(c)]];
  if(operation.kind==="rz")return[[phase(-half),c0],[c0,phase(half)]];
  return[[complex(c),complex(-s)],[complex(s),complex(c)]];
};

function applySingle(state,qubit,operation){const mask=MASK[qubit],m=matrix(operation);for(let index=0;index<8;index++)if(!(index&mask)){const a=state[index],b=state[index|mask];state[index]=add(mul(m[0][0],a),mul(m[0][1],b));state[index|mask]=add(mul(m[1][0],a),mul(m[1][1],b))}}
function applyMulti(state,operation){const targetMask=MASK[operation.target];const active=operation.kind==="ccx"?(index)=>operation.controls.every(q=>index&MASK[q]):(index)=>Boolean(index&MASK[operation.control]);for(let index=0;index<8;index++)if(active(index)&&!(index&targetMask))[state[index],state[index|targetMask]]=[state[index|targetMask],state[index]]}

export function simulate(columns,steps=columns.length){const state=[complex(1),complex(),complex(),complex(),complex(),complex(),complex(),complex()];for(const column of columns.slice(0,steps)){if(column.multi)applyMulti(state,column.multi);else column.singles.forEach((operation,q)=>{if(operation)applySingle(state,q,operation)})}return state}

export function reducedSummary(state,qubit){const mask=MASK[qubit];let p0=0,p1=0,cross=complex();for(let index=0;index<8;index++)if(!(index&mask)){const a=asComplex(state[index]),b=asComplex(state[index|mask]);p0+=abs2(a);p1+=abs2(b);cross=add(cross,mul(a,conj(b)))}const x=2*cross.re,y=-2*cross.im,z=p0-p1,length=Math.hypot(x,y,z);return{p0,p1,x,y,z,length}}
const formatAmplitude=(value)=>{value=asComplex(value);const clean=n=>Math.abs(n)<1e-10?0:n;const re=clean(value.re),im=clean(value.im);if(!im)return re.toFixed(3);if(!re)return`${im.toFixed(3)}i`;return`${re.toFixed(3)} ${im<0?"−":"+"} ${Math.abs(im).toFixed(3)}i`};

export function initCircuit({onSelect,onState,onCircuit}){
  const toolBox=document.getElementById("circuit-tools"),grid=document.getElementById("circuit-grid"),step=document.getElementById("circuit-step"),stepOut=document.getElementById("circuit-step-out");
  let selected="h",selectedAngle=90,columns=Array.from({length:8},blank),selectedColumn=-1;
  function renderTools(){toolBox.innerHTML="";for(const tool of tools){const button=document.createElement("button");button.textContent=tool.label;button.className=selected===tool.id?"active":"";button.onclick=()=>{selected=tool.id;renderTools();if(tool.type!=="delete")onSelect?.(tool.sync||tool.id)};toolBox.append(button)}const clear=document.createElement("button");clear.textContent="全部消す";clear.onclick=()=>{columns=Array.from({length:8},blank);selectedColumn=-1;render()};toolBox.append(clear);const tool=tools.find(item=>item.id===selected),meaning=document.getElementById("circuit-tool-meaning");meaning.innerHTML=`<strong>${tool.label}</strong><span>球体上の意味：${tool.sphere}</span>${tool.type==="rotation"?`<label class="angle-control">回転角 <input id="circuit-angle" type="number" min="-360" max="360" step="5" value="${selectedAngle}"><span>°</span></label>`:""}`;const angle=meaning.querySelector("#circuit-angle");if(angle)angle.oninput=()=>{selectedAngle=Math.max(-360,Math.min(360,+angle.value||0))}}
  function operationLabel(operation){if(["rx","ry","rz"].includes(operation.kind))return`${operation.kind.toUpperCase()}(${operation.angle}°)`;return operation.label||operation.kind.toUpperCase()}
  function cellText(column,q){if(column.multi){if(column.multi.kind==="ccx"&&column.multi.controls.includes(q))return"●";if(column.multi.kind==="cx"&&column.multi.control===q)return"●";if(column.multi.target===q)return"⊕";return"│"}const operation=column.singles[q];return operation?operationLabel(operation):""}
  function renderGrid(){grid.innerHTML="";for(let q=0;q<3;q++){const label=document.createElement("div");label.className="wire-label";label.textContent=QUBITS[q];grid.append(label);for(let c=0;c<8;c++){const cell=document.createElement("button");cell.className="circuit-cell"+(selectedColumn===c?" selected-column":"");const text=document.createElement("span");text.className="gate-label";text.textContent=cellText(columns[c],q);cell.append(text);cell.onclick=()=>place(q,c);grid.append(cell)}}}
  function place(q,c){const tool=tools.find(item=>item.id===selected);selectedColumn=c;if(tool.type==="delete"){columns[c].multi=null;columns[c].singles[q]=null}else if(tool.type==="controlled"){columns[c]=blank();columns[c].multi={...tool}}else{columns[c].multi=null;columns[c].singles[q]={...tool,...(tool.type==="rotation"?{angle:selectedAngle}:{})}}render();syncSelection(c)}
  function syncSelection(c){const column=columns[c];let operation=column.multi||column.singles.find(Boolean);const card=document.getElementById("circuit-selection");if(!operation){card.textContent=`${c+1}列目：操作なし`;return}card.innerHTML=`<strong>${c+1}列目：${operationLabel(operation)}</strong><span>球体上の意味：${operation.sphere}</span>`;onSelect?.(operation.sync||operation.id)}
  function renderState(){const steps=+step.value,state=simulate(columns,steps);stepOut.textContent=`${step.value}列目まで`;document.getElementById("state-table").innerHTML=state.map((amplitude,index)=>{const probability=abs2(amplitude)*100,bits=index.toString(2).padStart(3,"0");return`<div class="state-row"><code>${bits}</code><span><i style="width:${probability}%"></i></span><b>${probability.toFixed(1)}%</b><small class="amplitude">振幅 ${formatAmplitude(amplitude)}</small></div>`}).join("");document.getElementById("qubit-summary").innerHTML=QUBITS.map((name,q)=>{const s=reducedSummary(state,q),mixed=s.length<.999;return`<div><strong>${name}</strong><span>北 |0⟩ ${(s.p0*100).toFixed(1)}% / 南 |1⟩ ${(s.p1*100).toFixed(1)}%</span><small>${mixed?`関係あり・単体矢印 ${(s.length*100).toFixed(1)}%`:`単体球で表現可能・(X,Y,Z)=(${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`}</small></div>`}).join("");onState?.(state);onCircuit?.(columns.map(column=>({singles:[...column.singles],multi:column.multi})),steps)}
  function render(){renderTools();renderGrid();renderState()}step.oninput=renderState;render();return{simulate:()=>simulate(columns,+step.value)};
}
