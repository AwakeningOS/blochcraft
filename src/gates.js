export const gates = [
  { id: "ry30", sphere: "表裏軸回転 +15°", standard: "RY(30°)", axis: "y", angle: 30 },
  { id: "ry60", sphere: "表裏軸回転 +30°", standard: "RY(60°)", axis: "y", angle: 60 },
  { id: "ry90", sphere: "表裏軸回転 +45°", standard: "RY(90°)", axis: "y", angle: 90 },
  { id: "rym90", sphere: "表裏軸回転 −45°", standard: "RY(−90°)", axis: "y", angle: -90 },
  { id: "x", sphere: "東西軸180°回転", standard: "X", axis: "x", angle: 180 },
  { id: "z", sphere: "南北軸180°回転", standard: "Z", axis: "z", angle: 180 },
  { id: "h", sphere: "北東斜め軸180°回転", standard: "H (Hadamard)", axis: "h", angle: 180 },
  { id: "cx", sphere: "条件付き東西軸回転 A→B", standard: "CNOT A→B", axis: "x", angle: 180, controls: ["A"], target: "B" },
  { id: "ccx", sphere: "2条件付き東西軸回転 A・B→C", standard: "Toffoli (CCNOT) A,B→C", axis: "x", angle: 180, controls: ["A", "B"], target: "C" },
];

export function gateName(gate) {
  return `${gate.standard} / ${gate.sphere}`;
}

export function conditionDescription(gate) {
  if (!gate.controls) return "";
  const controls = gate.controls.join("と");
  if (gate.controls.length === 1) {
    return `条件役：${controls}。${controls}が南極 |1⟩ のときだけ、標的${gate.target}を東西軸で180°回転する。${controls}が北極 |0⟩ なら${gate.target}は動かない。`;
  }
  return `条件役：${controls}。条件役が両方とも南極 |1⟩ のときだけ、標的${gate.target}を東西軸で180°回転する。どちらかが北極 |0⟩ なら${gate.target}は動かない。`;
}
