import { evaluateSharedSecret } from "./quest-engine.js";

const $ = (id) => document.getElementById(id);
let labWindow = null;
let hintIndex = 0;
const hints = [
  "まずAに「北と南のどちらとも言えない状態」を作れないか試そう。",
  "次に、Aが南のときだけBを動かす条件付き操作を探そう。",
  "操作の順番が大事。先に可能性を広げ、その後でBをAに連動させよう。",
];

function mark(id, passed) {
  const row = $(id);
  row.classList.toggle("passed", passed);
  row.querySelector("span").textContent = passed ? "✓" : "○";
}

function render(result) {
  mark("condition-random", result.random);
  mark("condition-together", result.together);
  mark("condition-calm", result.calm);
  const feedback = $("feedback");
  feedback.className = `feedback ${result.complete ? "complete" : result.connected ? "active" : "waiting"}`;
  if (result.complete) {
    feedback.querySelector(".status-label").textContent = "MISSION COMPLETE";
    feedback.querySelector("h2").textContent = "秘密の合図が共有された。";
    $("feedback-text").textContent = `北北 ${(result.northNorth*100).toFixed(1)}% / 南南 ${(result.southSouth*100).toFixed(1)}%。単体の球ではなく、AとBの関係に合図が保存されている。`;
  } else if (result.connected) {
    feedback.querySelector(".status-label").textContent = "LABから観測中";
    feedback.querySelector("h2").textContent = "まだ三つの条件はそろっていない。";
    $("feedback-text").textContent = result.random
      ? "二つの可能性は生まれた。その可能性をBと連動させられるか？"
      : "今は結果がほぼ一つに決っている。まずAに二つの可能性を作れるだろうか？";
  }
}

function requestState(target) {
  if (target && !target.closed) target.postMessage({type:"blochcraft:request-state"}, location.origin);
}

$("open-lab").onclick = () => {
  labWindow = window.open("./index.html?mode=lab", "blochcraft-lab", "width=1280,height=900");
  setTimeout(() => requestState(labWindow), 700);
};

$("hint").onclick = () => {
  $("hint-text").hidden = false;
  $("hint-text").textContent = hints[Math.min(hintIndex++, hints.length - 1)];
};

window.addEventListener("message", (event) => {
  if (event.origin !== location.origin || event.data?.type !== "blochcraft:lab-state") return;
  labWindow = event.source;
  render(evaluateSharedSecret(event.data.state));
});

if (window.opener && !window.opener.closed) {
  labWindow = window.opener;
  requestState(labWindow);
}
