import { playerCount } from './parameters.js'
import type { Treatment } from './treatment.js'

export function getPayVec(treatment: Treatment, quality: 'high' | 'low', withdrawCounts: number[]): number[] {
  const lambda = treatment.lambda
  const RH = treatment.RH
  const RL = treatment.RL
  const D = treatment.D
  const n = playerCount
  const [n1, n2, n3] = withdrawCounts
  const w1 = n1 / n
  const w2 = n2 / n
  const w12 = w1 + w2
  if (quality === 'high') {
    const pay1 = n1 === 0 ? 0 : D
    const pay2 = n2 === 0 ? 0 : D
    const pay3 = n3 === 0 ? 0 : RH
    return [pay1, pay2, pay3]
  }
  const pay1 = n1 === 0 ? 0 : w1 > (lambda * RL) / D ? (lambda * RL) / w1 : D
  const pay2 = n2 === 0 ? 0 : w1 > (lambda * RL) / D ? 0 : w12 > (lambda * RL) / D ? (lambda * RL - w1 * D) / w2 : D
  const pay3 = n3 === 0 ? 0 : w12 > (lambda * RL) / D ? 0 : (RL - (w12 * D) / lambda) / (1 - w12)
  return [pay1, pay2, pay3]
}
