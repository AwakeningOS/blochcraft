import { evaluateQuest } from "./quest-engine.js";

const $ = (id) => document.getElementById(id);
const questId = new URLSearchParams(location.search).get("quest") || "shared-secret";
const quests = {
  "shared-secret": {
    number:"01", title:"離れた二つの球に、同じ秘密の合図を持たせたい。",
    lead:"南北どちらが出るかは決まっていない。でもAとBを測ると、必ず同じ合図が出る回路を作ろう。",
    orbs:["A","B"], conditions:[["結果は一つに決めない","北北と南南の両方が現れる"],["AとBは必ず同じ結果","北南、南北は現れない"],["Cはそっとしておく","Cは北のまま"]],
    hints:["まずAに北と南の二つの可能性を作ろう。","Aが南のときだけBを動かす操作を探そう。"], complete:"秘密の合図が共有された。"
  },
  "flip-a": {
    number:"02", title:"Aだけを、確実に北から南へ移動させたい。",
    lead:"BとCには触れず、Aの向きだけを完全に反転させる操作を見つけよう。",
    orbs:["A","南"], conditions:[["Aを南へ移動","Aが100%南になる"],["Bは北のまま","Bを動かさない"],["Cは北のまま","Cを動かさない"]],
    hints:["半分だけではなく、球をちょうど180°回す操作を探そう。"], complete:"Aだけが南へ移動した。"
  },
  "open-choice": {
    number:"03", title:"Aの答えを、一つに決められなくしたい。",
    lead:"北と南のどちらにも可能性を残し、BとCはそのままにしよう。",
    orbs:["A","?"], conditions:[["Aに南の可能性がある","南が0%ではない"],["Aに北の可能性もある","北も0%ではない"],["BとCは北のまま","他の球を動かさない"]],
    hints:["Aの球を南まで回しきらず、北と南が半分ずつになる操作を探そう。"], complete:"Aに二つの可能性が開かれた。"
  }
};
const quest=quests[questId]||quests["shared-secret"];
let labWindow=window.opener&&!window.opener.closed?window.opener:null,hintIndex=0;

$("quest-number").textContent=`BlochCraft Quest ${quest.number}`;$("quest-title").textContent=quest.title;$("quest-lead").textContent=quest.lead;$("orb-a").textContent=quest.orbs[0];$("orb-b").textContent=quest.orbs[1];
quest.conditions.forEach(([title,detail],i)=>{const row=$(`condition-${i}`);row.querySelector("strong").textContent=title;row.querySelector("small").textContent=detail});
function render(result){result.checks.forEach((passed,i)=>{const row=$(`condition-${i}`);row.classList.toggle("passed",passed);row.querySelector("span").textContent=passed?"✓":"○"});const feedback=$("feedback");feedback.className=`feedback ${result.complete?"complete":result.connected?"active":"waiting"}`;feedback.querySelector(".status-label").textContent=result.complete?"MISSION COMPLETE":result.connected?"LABから観測中":"LABとつながっていません";feedback.querySelector("h2").textContent=result.complete?quest.complete:"まだ三つの条件はそろっていない。";$("feedback-text").textContent=result.complete?"何をしたか、実験用ウィンドウで回路と状態の変化を確かめよう。":"実験用ウィンドウの回路を変えると、この条件がすぐに更新されます。"}
function requestState(target){if(target&&!target.closed)target.postMessage({type:"blochcraft:request-state"},location.origin)}
$("open-lab").onclick=()=>{if(labWindow&&!labWindow.closed){labWindow.focus();requestState(labWindow)}else{labWindow=window.open("./index.html?mode=lab","blochcraft-lab","width=1280,height=900");setTimeout(()=>requestState(labWindow),700)}};
$("hint").onclick=()=>{$("hint-text").hidden=false;$("hint-text").textContent=quest.hints[Math.min(hintIndex++,quest.hints.length-1)]};
window.addEventListener("message",event=>{if(event.origin!==location.origin||event.data?.type!=="blochcraft:lab-state")return;labWindow=event.source;render(evaluateQuest(questId,event.data.state))});
requestState(labWindow);
