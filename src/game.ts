import type { GameSummary } from '../web/shared/summary.js'
import type { Participant } from './participant.js'
import type { Session } from './session.js'
import { shuffle } from '../web/shared/math.js'

export class Game {
  session: Session
  players: Participant[] = []
  id: number
  quality = 'low'
  payVec = [0, 0, 0]

  constructor(session: Session) {
    this.session = session
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
    const treatment = this.session.treatment
    const informCount = Math.round(this.players.length * treatment.pi)
    shuffle(this.players).forEach((player, i) => {
      player.inform = i < informCount
    })
    console.log(this.players.map(p => (p.inform ? 1 : 0)))
  }

  setQuality(): void {
    const theta = this.session.treatment.theta
    const rand = Math.random()
    this.quality = rand < theta ? 'high' : 'low'
    console.log('check', rand.toFixed(3), theta, this.quality)
  }

  summarize(): GameSummary {
    return {
      id: this.id,
      quality: this.quality,
      payVec: this.payVec,
    }
  }
}
