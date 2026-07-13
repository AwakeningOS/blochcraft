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
