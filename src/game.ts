import type { Treatment } from '../web/shared/treatment.js'
import type { GameSummary } from '../web/shared/types.js'
import type { Participant } from './participant.js'
import type { Session } from './session.js'

export class Game {
  session: Session
  treatment: Treatment
  players: Participant[] = []
  id: number
  quality = 'low'
  period = 0
  stage = 0
  payVec = [0, 0, 0]

  constructor(session: Session) {
    this.session = session
    this.treatment = session.treatment
    this.id = this.session.games.length
    this.session.games.push(this)
  }

  setup(): void {
    this.setTypes()
    this.setQuality()
    this.players.forEach(player => {
      player.game = this.id
    })
  }

  setTypes(): void {
    const informCount = Math.round(this.players.length * this.treatment.pi)
    this.players.forEach((player, i) => {
      player.inform = i < informCount
    })
  }

  setQuality(): void {
    const theta = this.treatment.theta
    this.quality = Math.random() < theta ? 'high' : 'low'
  }

  summarize(): GameSummary {
    return {
      id: this.id,
      quality: this.quality,
      period: this.period,
      stage: this.stage,
      payVec: this.payVec,
    }
  }
}
