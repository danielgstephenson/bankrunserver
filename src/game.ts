import type { GameSummary } from '../shared/summary.js'
import type { Participant } from './participant.js'
import type { Session } from './session.js'
import { shuffle } from '../shared/math.js'

export class Game {
  session: Session
  players: Participant[] = []
  id: number
  payVec = [0, 0, 0]
  withdrawCounts = [0, 0, 0]

  constructor(session: Session) {
    this.session = session
    this.id = this.session.games.length
    this.session.games.push(this)
  }

  setup(): void {
    this.setTypes()
    this.players.forEach(player => {
      player.game = this.id
      player.ready = false
      player.action = 3
    })
  }

  setTypes(): void {
    const treatment = this.session.treatment
    const informCount = Math.round(this.players.length * treatment.pi)
    shuffle(this.players).forEach((player, i) => {
      player.informed = i < informCount
    })
  }

  getWithdrawCounts() {
    const n1 = this.players.filter(p => p.action === 1).length
    const n2 = this.players.filter(p => p.action === 2).length
    const n3 = this.players.filter(p => p.action === 3).length
    return [n1, n2, n3]
  }

  summarize(): GameSummary {
    return {
      id: this.id,
      payVec: this.payVec,
      withdrawCounts: this.withdrawCounts,
    }
  }
}
