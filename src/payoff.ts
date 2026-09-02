import type { Game } from './game.js'

export function getWithdrawCounts(game: Game) {
  const n1 = game.players.filter(p => p.action === 1).length
  const n2 = game.players.filter(p => p.action === 2).length
  const n3 = game.players.filter(p => p.action === 3).length
  return [n1, n2, n3]
}

export function getPayVec(game: Game): number[] {
  const treatment = game.session.treatment
  const lambda = treatment.lambda
  const RH = treatment.RH
  const RL = treatment.RL
  const D = treatment.D
  const n = game.players.length
  const [n1, n2, n3] = getWithdrawCounts(game)
  const w1 = n1 / n
  const w2 = n2 / n
  const w12 = w1 + w2
  const quality = game.session.quality
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
