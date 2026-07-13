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
export function insertBlankColumn(columns,selectedColumn,after){const original=selectedColumn<0?columns.length:selectedColumn,index=selectedColumn<0?columns.length:selectedColumn+(after?1:0);columns.splice(index,0,blank());return selectedColumn<0?index:original+(after?0:1)}

export function reducedSummary(state,qubit){const mask=MASK[qubit];let p0=0,p1=0,cross=complex();for(let index=0;index<8;index++)if(!(index&mask)){const a=asComplex(state[index]),b=asComplex(state[index|mask]);p0+=abs2(a);p1+=abs2(b);cross=add(cross,mul(a,conj(b)))}const x=2*cross.re,y=-2*cross.im,z=p0-p1,length=Math.hypot(x,y,z);return{p0,p1,x,y,z,length}}
const formatAmplitude=(value)=>{value=asComplex(value);const clean=n=>Math.abs(n)<1e-10?0:n;const re=clean(value.re),im=clean(value.im);if(!im)return re.toFixed(3);if(!re)return`${im.toFixed(3)}i`;return`${re.toFixed(3)} ${im<0?"−":"+"} ${Math.abs(im).toFixed(3)}i`};

export function initCircuit({onSelect,onState,onCircuit}){
  const toolBox=document.getElementById("circuit-tools"),grid=document.getElementById("circuit-grid"),step=document.getElementById("circuit-step"),stepOut=document.getElementById("circuit-step-out");
  const stats=document.getElementById("circuit-column-stats"),MAX_COLUMNS=64;
  let selected="h",selectedAngle=90,columns=Array.from({length:8},blank),selectedColumn=-1;
  function renderTools(){
    toolBox.innerHTML="";
    for(const tool of tools){const button=document.createElement("button");button.textContent=tool.label;button.className=selected===tool.id?"active":"";button.onclick=()=>{selected=tool.id;renderTools();if(tool.type!=="delete")onSelect?.({operation:{...tool,...(tool.type==="rotation"?{angle:selectedAngle}:{})},source:"tool"})};toolBox.append(button)}
    const clear=document.createElement("button");clear.textContent="全部消す";clear.onclick=()=>{columns=Array.from({length:columns.length},blank);selectedColumn=-1;render()};toolBox.append(clear);
    const tool=tools.find(item=>item.id===selected),meaning=document.getElementById("circuit-tool-meaning");
    const marks=[-360,-270,-180,-90,-45,0,45,90,180,270,360];
    meaning.classList.toggle("has-angle-editor",tool.type==="rotation");
    meaning.innerHTML=`<strong>${tool.label}</strong><span>球体上の意味：${tool.sphere}</span>${tool.type==="rotation"?`<div class="angle-editor"><label class="angle-number">回転角 <input id="circuit-angle" type="number" min="-360" max="360" step="1" value="${selectedAngle}"><span>°</span></label><input id="circuit-angle-slider" type="range" min="-360" max="360" step="1" value="${selectedAngle}" list="circuit-angle-marks"><datalist id="circuit-angle-marks">${marks.map(value=>`<option value="${value}"></option>`).join("")}</datalist><div class="angle-presets" aria-label="代表的な回転角">${marks.map(value=>`<button type="button" data-angle="${value}" class="${value===selectedAngle?"active":""}">${value}°</button>`).join("")}</div></div>`:""}`;
    const number=meaning.querySelector("#circuit-angle"),slider=meaning.querySelector("#circuit-angle-slider");
    if(number&&slider){
      const update=(value)=>{selectedAngle=Math.max(-360,Math.min(360,Number(value)||0));number.value=selectedAngle;slider.value=selectedAngle;for(const button of meaning.querySelectorAll("[data-angle]"))button.classList.toggle("active",+button.dataset.angle===selectedAngle);onSelect?.({operation:{...tool,angle:selectedAngle},source:"tool"})};
      number.oninput=()=>update(number.value);slider.oninput=()=>update(slider.value);for(const button of meaning.querySelectorAll("[data-angle]"))button.onclick=()=>update(button.dataset.angle);
    }
  }
  function operationLabel(operation){if(["rx","ry","rz"].includes(operation.kind))return`${operation.kind.toUpperCase()}(${operation.angle}°)`;return operation.label||operation.kind.toUpperCase()}
  function cellText(column,q){if(column.multi){if(column.multi.kind==="ccx"&&column.multi.controls.includes(q))return"●";if(column.multi.kind==="cx"&&column.multi.control===q)return"●";if(column.multi.target===q)return"⊕";return"│"}const operation=column.singles[q];return operation?operationLabel(operation):""}
  function selectColumn(c,q=0){selectedColumn=c;render();syncSelection(c,q)}
  function renderGrid(){grid.innerHTML="";grid.style.setProperty("--circuit-columns",columns.length);const corner=document.createElement("div");corner.className="column-corner";grid.append(corner);for(let c=0;c<columns.length;c++){const number=document.createElement("button");number.type="button";number.className="column-number"+(selectedColumn===c?" selected-column":"");number.textContent=c+1;number.title=`${c+1}列目を選択`;number.setAttribute("aria-label",`${c+1}列目を選択`);number.onclick=()=>selectColumn(c);grid.append(number)}for(let q=0;q<3;q++){const label=document.createElement("div");label.className="wire-label";label.textContent=QUBITS[q];grid.append(label);for(let c=0;c<columns.length;c++){const cell=document.createElement("button");cell.className="circuit-cell"+(selectedColumn===c?" selected-column":"");const text=document.createElement("span");text.className="gate-label";text.textContent=cellText(columns[c],q);cell.append(text);cell.onclick=()=>cellText(columns[c],q)&&selected!=="delete"?selectColumn(c,q):place(q,c);grid.append(cell)}}}
  function place(q,c){const tool=tools.find(item=>item.id===selected);selectedColumn=c;if(tool.type==="delete"){columns[c].multi=null;columns[c].singles[q]=null}else if(tool.type==="controlled"){columns[c]=blank();columns[c].multi={...tool}}else{columns[c].multi=null;columns[c].singles[q]={...tool,...(tool.type==="rotation"?{angle:selectedAngle}:{})}}render();syncSelection(c,q)}
  function syncSelection(c,q){const column=columns[c];let operation=column.multi||column.singles[q]||column.singles.find(Boolean);const card=document.getElementById("circuit-selection");if(!operation){card.textContent=`${c+1}列目：操作なし`;return}card.innerHTML=`<strong>${c+1}列目：${operationLabel(operation)}</strong><span>球体上の意味：${operation.sphere}</span>`;onSelect?.({operation,target:operation.target??q,column:c,startState:simulate(columns,c),source:"circuit"})}
  function columnUsed(column){return Boolean(column.multi||column.singles.some(Boolean))}
  function updateColumnControls(){step.max=columns.length;if(+step.value>columns.length)step.value=columns.length;const used=columns.filter(columnUsed).length;stats.textContent=`使用 ${used}列 / 全 ${columns.length}列 / 深さ ${used}`;const full=columns.length>=MAX_COLUMNS;document.getElementById("column-add-one").disabled=full;document.getElementById("column-add-four").disabled=full;document.getElementById("column-insert-before").disabled=full;document.getElementById("column-insert-after").disabled=full;document.getElementById("column-delete").disabled=selectedColumn<0||columns.length<=1}
  function moveStepToEnd(){step.max=columns.length;step.value=columns.length}
  function addColumns(count){const available=MAX_COLUMNS-columns.length;if(available<=0)return;columns.push(...Array.from({length:Math.min(count,available)},blank));moveStepToEnd();render()}
  function insertColumn(after){if(columns.length>=MAX_COLUMNS)return;selectedColumn=insertBlankColumn(columns,selectedColumn,after);moveStepToEnd();render()}
  function deleteColumn(){if(selectedColumn<0||columns.length<=1)return;columns.splice(selectedColumn,1);selectedColumn=Math.min(selectedColumn,columns.length-1);step.value=Math.min(+step.value,columns.length);render()}
  document.getElementById("column-add-one").onclick=()=>addColumns(1);document.getElementById("column-add-four").onclick=()=>addColumns(4);document.getElementById("column-insert-before").onclick=()=>insertColumn(false);document.getElementById("column-insert-after").onclick=()=>insertColumn(true);document.getElementById("column-delete").onclick=deleteColumn;
  function renderState(){const steps=+step.value,state=simulate(columns,steps);stepOut.textContent=steps===columns.length?"最後まで":steps===0?"入力前":`${steps}列目の後`;document.getElementById("state-table").innerHTML=state.map((amplitude,index)=>{const probability=abs2(amplitude)*100,bits=index.toString(2).padStart(3,"0");return`<div class="state-row"><code>${bits}</code><span><i style="width:${probability}%"></i></span><b>${probability.toFixed(1)}%</b><small class="amplitude">振幅 ${formatAmplitude(amplitude)}</small></div>`}).join("");document.getElementById("qubit-summary").innerHTML=QUBITS.map((name,q)=>{const s=reducedSummary(state,q),mixed=s.length<.999;return`<div><strong>${name}</strong><span>北 |0⟩ ${(s.p0*100).toFixed(1)}% / 南 |1⟩ ${(s.p1*100).toFixed(1)}%</span><small>${mixed?`関係あり・単体矢印 ${(s.length*100).toFixed(1)}%`:`単体球で表現可能・(X,Y,Z)=(${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)})`}</small></div>`}).join("");onState?.(state);onCircuit?.(columns.map(column=>({singles:[...column.singles],multi:column.multi})),steps)}
  function render(){renderTools();updateColumnControls();renderGrid();renderState()}step.oninput=renderState;step.value=columns.length;render();return{simulate:()=>simulate(columns,+step.value)};
}
