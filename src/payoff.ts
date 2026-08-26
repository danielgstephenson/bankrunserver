import type { Treatment } from "../shared/types.js"


export function getPayoff(
  action: number,
  n1: number,
  n2: number,
  quality: string,
  treatment: Treatment,
): number {
  const n = treatment.n
  const lambda = treatment.lambda
  const RH = treatment.RH
  const RL = treatment.RL
  const D = treatment.D
  const w1 = n1 / n
  const w2 = n2 / n
  const w12 = w1 + w2
  if (quality === 'high') {
    return action === 3 ? RH : D
  }
  if (action === 1) {
    return w1 > (lambda * RL) / D ? (lambda * RL) / w1 : D
  }
  if (action === 2) {
    if (w1 > (lambda * RL) / D) return 0
    if (w12 > (lambda * RL) / D) return (lambda * RL - w1 * D) / w2
    return D
  }
  if (w12 > (lambda * RL) / D) return 0
  return (RL - (w12 * D) / lambda) / (1 - w12)
}
