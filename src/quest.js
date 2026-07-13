import { evaluateQuest } from "./quest-engine.js";

const $ = (id) => document.getElementById(id);
const questId = new URLSearchParams(location.search).get("quest") || "shared-secret";
const quests = {
  "shared-secret": {
    number:"01", title:"AとBの測定結果を連動させる",
    lead:"AとBの結果が北と南のどちらにもなり得る一方で、二つを測ると必ず同じ結果になる回路を作ります。",
    orbs:["A","B"], conditions:[["AとBに二つの可能性がある","北北と南南の両方が現れる"],["AとBは必ず同じ結果","北南、南北は現れない"],["Cの状態は変えない","Cは北 |0⟩ のまま"]],
    hints:["まず、Aに北と南の両方の可能性を作る方法を試してください。","Aの状態をBの操作条件として使えるゲートを探してください。"], complete:"AとBの測定結果が連動しています。"
  },
  "flip-a": {
    number:"02", title:"Aだけを北から南へ移動させる",
    lead:"BとCの状態は変えず、Aのみを北 |0⟩ から南 |1⟩ へ確実に移動させる回路を作ります。",
    orbs:["A","南"], conditions:[["Aを南へ移動","Aが100%南になる"],["Bは北のまま","Bを動かさない"],["Cは北のまま","Cを動かさない"]],
    hints:["球を180°回転させ、北と南を入れ替えるゲートを探してください。"], complete:"Aのみが北から南へ移動しています。"
  },
  "open-choice": {
    number:"03", title:"Aに北と南の両方の可能性を持たせる",
    lead:"BとCの状態は変えず、Aの測定結果が北と南のどちらにもなり得る回路を作ります。",
    orbs:["A","?"], conditions:[["Aに南の可能性がある","南が0%ではない"],["Aに北の可能性もある","北も0%ではない"],["BとCは北のまま","他の球を動かさない"]],
    hints:["Aの北と南の測定確率が同じになるような回転を探してください。"], complete:"Aに北と南の両方の可能性があります。"
  }
};
const quest=quests[questId]||quests["shared-secret"];
let labWindow=window.opener&&!window.opener.closed?window.opener:null,hintIndex=0;

$("quest-number").textContent=`目的別の実験 ${quest.number}`;$("quest-title").textContent=quest.title;$("quest-lead").textContent=quest.lead;$("orb-a").textContent=quest.orbs[0];$("orb-b").textContent=quest.orbs[1];
quest.conditions.forEach(([title,detail],i)=>{const row=$(`condition-${i}`);row.querySelector("strong").textContent=title;row.querySelector("small").textContent=detail});
function render(result){result.checks.forEach((passed,i)=>{const row=$(`condition-${i}`);row.classList.toggle("passed",passed);row.querySelector("span").textContent=passed?"✓":"○"});const feedback=$("feedback");feedback.className=`feedback ${result.complete?"complete":result.connected?"active":"waiting"}`;feedback.querySelector(".status-label").textContent=result.complete?"すべての成立条件を確認しました":result.connected?"実験画面の回路を確認しています":"実験画面と接続していません";feedback.querySelector("h2").textContent=result.complete?quest.complete:"成立していない条件があります。";$("feedback-text").textContent=result.complete?"実験画面で回路の各列を確認し、どの操作で状態が変わったかを確かめてください。":"実験画面で回路を変更し、成立条件がどのように変わるかを確かめてください。"}
function requestState(target){if(target&&!target.closed)target.postMessage({type:"blochcraft:request-state"},location.origin)}
$("hint").onclick=()=>{$("hint-text").hidden=false;$("hint-text").textContent=quest.hints[Math.min(hintIndex++,quest.hints.length-1)]};
window.addEventListener("message",event=>{if(event.origin!==location.origin||event.data?.type!=="blochcraft:lab-state")return;labWindow=event.source;render(evaluateQuest(questId,event.data.state))});
requestState(labWindow);
