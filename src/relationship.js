import { DEG, project, vec } from "./math3d.js";

const MASK=[4,2,1],NAMES=["A","B","C"],COLORS=["#d9a900","#ef233c","#9b4f00"];
const camera={yaw:25*DEG,pitch:-8*DEG};
let lastState=null,lastTargets=null,lastHistory=null,drag=null,installed=false;

export function relationshipMetrics(state){
  return NAMES.map((name,q)=>{const mask=MASK[q];let p0=0,p1=0,cross=0;for(let i=0;i<8;i++)if(!(i&mask)){const a=state[i],b=state[i|mask];p0+=a*a;p1+=b*b;cross+=a*b}const x=2*cross,z=p0-p1,visible=Math.min(1,Math.hypot(x,z)),vault=Math.sqrt(Math.max(0,1-visible*visible));return{name,p0,p1,x,y:0,z,visible,vault,color:COLORS[q]}});
}

const opposite=v=>vec(-v.x,-v.y,-v.z);
function line(a,b,color,width=1,opacity=1,dash=""){return`<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${color}" stroke-width="${width}" ${dash?`stroke-dasharray="${dash}"`:""} opacity="${opacity}"/>`}
function grid(vectors,cx,cy,r,front,back){let s="";for(let i=1;i<vectors.length;i++){const a=project(vectors[i-1],cx,cy,r,camera.yaw,camera.pitch),b=project(vectors[i],cx,cy,r,camera.yaw,camera.pitch),f=(a.depth+b.depth)<0;s+=line(a,b,f?front:back,f?1:.65,f?.4:.12,f?"":"3,4")}return s}
function arrow(cx,cy,tip){const h=Math.atan2(tip.y-cy,tip.x-cx),head=16,base=12,bx=tip.x-base*Math.cos(h),by=tip.y-base*Math.sin(h);return`<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="var(--text)" stroke-width="3" stroke-linecap="round"/><polygon points="${tip.x},${tip.y} ${tip.x-head*Math.cos(h-.55)},${tip.y-head*Math.sin(h-.55)} ${tip.x-head*Math.cos(h+.55)},${tip.y-head*Math.sin(h+.55)}" fill="var(--text)"/>`}

function historyTrail(history,q,cx,cy,r,color){if(!history?.length)return"";const points=[],marks=[];let previous="";history.forEach((state,step)=>{const m=relationshipMetrics(state)[q],p=project(vec(m.x,0,m.z),cx,cy,r,camera.yaw,camera.pitch),key=`${p.x.toFixed(1)},${p.y.toFixed(1)}`;points.push(key);if(key!==previous)marks.push(`<circle cx="${p.x}" cy="${p.y}" r="3" fill="${color}" stroke="var(--panel)" stroke-width="1"/><text x="${p.x+5}" y="${p.y-5}" font-size="8" font-weight="800" fill="${color}">${step}</text>`);previous=key});return`<polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="1.8" stroke-dasharray="5,4" opacity=".82"/>${marks.join("")}`}
function sphere(metric,cx,cy,r,index,history){
  let s=`<ellipse cx="${cx}" cy="${cy+r+13}" rx="${r*.7}" ry="10" fill="#26384b" opacity=".12"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#rel-globe)" stroke="#687583" stroke-width="1" opacity=".95"/>`;
  for(const z of[-.5,0,.5]){const vs=[],rr=Math.sqrt(1-z*z);for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;vs.push(vec(rr*Math.cos(a),rr*Math.sin(a),z))}s+=grid(vs,cx,cy,r,"#4c94bd","#8396a3")}
  for(const pd of[0,60,120]){const vs=[],p=pd*DEG;for(let i=0;i<=72;i++){const a=i/72*Math.PI*2;vs.push(vec(Math.sin(a)*Math.cos(p),Math.sin(a)*Math.sin(p),Math.cos(a)))}s+=grid(vs,cx,cy,r,"#c58c49","#9d9080")}
  const axes=[[vec(0,0,1),"#4f708f"],[vec(1,0,0),"#98703d"],[vec(0,1,0),"#795f82"]];
  for(const[a,color]of axes){const p=project(a,cx,cy,r*1.16,camera.yaw,camera.pitch),m=project(opposite(a),cx,cy,r*1.16,camera.yaw,camera.pitch);s+=line(m,p,color,1.25,.72)}
  const dirs=[["北 |0⟩",vec(0,0,1),"#2a78d6"],["南 |1⟩",vec(0,0,-1),"#d1495b"],["東 |+⟩",vec(1,0,0),"#1baf7a"],["西 |−⟩",vec(-1,0,0),"#c98500"],["表 |+i⟩",vec(0,1,0),"#d43791"],["裏 |−i⟩",vec(0,-1,0),"#008ca8"]];
  for(const[label,v,color]of dirs){const p=project(v,cx,cy,r,camera.yaw,camera.pitch);let dx=p.x-cx,dy=p.y-cy,l=Math.hypot(dx,dy);if(l<1){dx=label.startsWith("表")?1:-1;dy=.3;l=Math.hypot(dx,dy)}const t={x:cx+(r+27)*dx/l,y:cy+(r+27)*dy/l};s+=`<circle cx="${p.x}" cy="${p.y}" r="2.8" fill="${color}"/>${line(p,t,color,.7,.5)}<text x="${t.x}" y="${t.y+4}" text-anchor="middle" font-size="9.5" font-weight="700" fill="${color}">${label}</text>`}
  s+=historyTrail(history,index,cx,cy,r,metric.color);
  if(metric.visible>.005){const unit=metric.visible?vec(metric.x/metric.visible,0,metric.z/metric.visible):vec(0,0,1),tip=project(unit,cx,cy,r*metric.visible,camera.yaw,camera.pitch);s+=arrow(cx,cy,tip);s+=`<circle cx="${tip.x+2}" cy="${tip.y+3}" r="8" fill="#26384b" opacity=".18"/><circle cx="${tip.x}" cy="${tip.y}" r="7" fill="url(#rel-tip)" stroke="#fff" stroke-width=".8"/>`}
  else s+=`<circle cx="${cx}" cy="${cy}" r="6" fill="none" stroke="var(--text)" stroke-width="1.5"/>`;
  s+=`<text x="${cx}" y="28" text-anchor="middle" font-size="22" font-weight="800" fill="${metric.color}">${metric.name}</text>`;
  const w=200*metric.vault;s+=`<rect x="${cx-110}" y="318" width="220" height="70" rx="11" fill="var(--panel)" stroke="#9aa5ae"/><text x="${cx}" y="341" text-anchor="middle" font-size="12" font-weight="700" fill="var(--text)">${metric.name} 対 残り全体の関係金庫</text><line x1="${cx-100}" y1="361" x2="${cx+100}" y2="361" stroke="#7b8791" stroke-width="9" stroke-linecap="round" opacity=".18"/><line x1="${cx-w/2}" y1="361" x2="${cx+w/2}" y2="361" stroke="${metric.color}" stroke-width="9" stroke-linecap="round"/><text x="${cx}" y="382" text-anchor="middle" font-size="12" font-weight="800" fill="${metric.color}">${(metric.vault*100).toFixed(1)}%</text>`;
  return s;
}

function installInteraction(svg,cards){if(installed)return;installed=true;svg.style.touchAction="none";svg.addEventListener("pointerdown",e=>{drag={x:e.clientX,y:e.clientY,yaw:camera.yaw,pitch:camera.pitch};svg.setPointerCapture(e.pointerId);svg.classList.add("dragging")});svg.addEventListener("pointermove",e=>{if(!drag)return;camera.yaw=drag.yaw+(e.clientX-drag.x)*.008;camera.pitch=drag.pitch-(e.clientY-drag.y)*.008;renderRelationship(lastState,{svg,cards})});const end=()=>{drag=null;svg.classList.remove("dragging")};svg.addEventListener("pointerup",end);svg.addEventListener("pointercancel",end);document.getElementById("relationship-reset-view").onclick=()=>{camera.yaw=25*DEG;camera.pitch=-8*DEG;renderRelationship(lastState,{svg,cards})}}

export function renderRelationship(state,{svg,cards,history=lastHistory}){lastState=state;lastHistory=history;lastTargets={svg,cards};installInteraction(svg,cards);const metrics=relationshipMetrics(state),centers=[180,540,900],cy=165,r=92;let out='<defs><radialGradient id="rel-globe" cx="34%" cy="27%" r="72%"><stop offset="0%" stop-color="#fff" stop-opacity=".4"/><stop offset="100%" stop-color="#58728a" stop-opacity=".22"/></radialGradient><radialGradient id="rel-tip" cx="30%" cy="25%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#52616f"/></radialGradient></defs>';metrics.forEach((m,i)=>out+=sphere(m,centers[i],cy,r,i,history));svg.innerHTML=out;cards.innerHTML=metrics.map(m=>`<div class="relationship-card"><strong style="color:${m.color}">${m.name}</strong><span>単体矢印 ${(m.visible*100).toFixed(1)}%</span><span>関係金庫 ${(m.vault*100).toFixed(1)}%</span><small>北 |0⟩ ${(m.p0*100).toFixed(1)}% / 南 |1⟩ ${(m.p1*100).toFixed(1)}%</small></div>`).join("")}
