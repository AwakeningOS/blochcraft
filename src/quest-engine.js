const probability = (amplitude) => amplitude * amplitude;

export function evaluateSharedSecret(state, tolerance = 1e-8) {
  if (!Array.isArray(state) || state.length !== 8) {
    return { connected:false, random:false, together:false, calm:false, complete:false };
  }
  const probabilities = state.map(probability);
  const northNorth = probabilities[0];
  const southSouth = probabilities[6];
  const mismatched = probabilities[2] + probabilities[4];
  const cSouth = probabilities[1] + probabilities[3] + probabilities[5] + probabilities[7];
  const random = northNorth > .15 && southSouth > .15;
  const together = mismatched < tolerance;
  const calm = cSouth < tolerance;
  return { connected:true, random, together, calm, complete:random && together && calm, northNorth, southSouth, mismatched, cSouth };
}

export function evaluateQuest(questId, state, tolerance = 1e-8) {
  if (questId === "shared-secret") {
    const result = evaluateSharedSecret(state, tolerance);
    return {...result, checks:[result.random,result.together,result.calm]};
  }
  if (!Array.isArray(state) || state.length !== 8) {
    return {connected:false,checks:[false,false,false],complete:false};
  }
  const p = state.map(probability);
  const aSouth = p.slice(4).reduce((sum,value)=>sum+value,0);
  const bSouth = p[2]+p[3]+p[6]+p[7];
  const cSouth = p[1]+p[3]+p[5]+p[7];
  if (questId === "flip-a") {
    const checks=[aSouth>1-tolerance,bSouth<tolerance,cSouth<tolerance];
    return {connected:true,checks,complete:checks.every(Boolean),aSouth,bSouth,cSouth};
  }
  const checks=[aSouth>.15,aSouth<.85,bSouth<tolerance&&cSouth<tolerance];
  return {connected:true,checks,complete:checks.every(Boolean),aSouth,bSouth,cSouth};
}
