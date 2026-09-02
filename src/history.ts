import { mean } from '../shared/math.js'
import type { Game } from './game.js'

export interface Entry {
  period: number
  quality: string
  informedMean: number
  uninformedMean: number
}

export class History {
  game: Game
  entries: Entry[] = []

  constructor(game: Game) {
    this.game = game
  }

  update(): void {
    const informedPlayers = this.game.players.filter(p => p.informed)
    const uninformedPlayers = this.game.players.filter(p => !p.informed)
    const informedActions = informedPlayers.map(p => p.action)
    const uninformedActions = uninformedPlayers.map(p => p.action)
    this.entries.push({
      period: this.game.session.period,
      quality: this.game.quality,
      informedMean: mean(informedActions),
      uninformedMean: mean(uninformedActions),
    })
  }
}
