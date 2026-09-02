import express from 'express'
import { type Express } from 'express'
import { makeServer } from './server.js'
import { type IOServer } from './server.js'
import { getDateString } from './dateString.js'
import { Participant } from './participant.js'
import { range, shuffle } from '../shared/math.js'
import { once } from 'node:events'
import type { SessionSummary } from '../shared/summary.js'
import { treatment1, treatments } from '../shared/treatment.js'
import { Game } from './game.js'
import { gameCount, maxPeriod, participantCount, playerCount } from '../shared/parameters.js'
import { getPayVec, getWithdrawCounts } from './payoff.js'

export class Session {
  token = `${Math.random()}`
  app: Express
  io: IOServer
  dateString = getDateString()
  treatment = treatment1
  participants = new Map<string, Participant>()
  games: Game[] = []
  state = 'instructions'
  period = 1
  stage = 1
  quality = 'low'

  constructor() {
    this.app = express()
    this.io = makeServer(this.app)
    range(1, participantCount).forEach(i => new Participant(this, `${i}`))
    range(gameCount).forEach(_ => new Game(this))
    this.setupIo()
    setInterval(() => this.update(), 100)
  }

  setupIo(): void {
    this.io.on('connection', socket => {
      socket.on('join', (id: string) => {
        const participant = this.participants.get(id)
        if (participant == null) {
          socket.emit('invalid id')
          return
        }
        if (participant.socket != null) {
          participant.socket.emit('disconnected')
          participant.socket.disconnect()
        }
        participant.socket = socket
        socket.emit('joined', id)
      })
      socket.on('treatment', (id: number) => {
        this.treatment = treatments[id - 1]
      })
      socket.on('instructions', _ => {
        this.state = 'instructions'
      })
      socket.on('game', _ => {
        this.setupGames()
        this.state = 'game'
      })
      socket.on('withdraw', (id: string) => {
        const participant = this.participants.get(id)
        if (participant == null) return
        participant.action = this.stage
        participant.ready = true
      })
      socket.on('hold', (id: string) => {
        const participant = this.participants.get(id)
        if (participant == null) return
        participant.ready = true
      })
      socket.on('continue', (id: string) => {
        const participant = this.participants.get(id)
        if (participant == null) return
        participant.ready = true
      })
    })
  }

  setupGames(): void {
    const participants = shuffle([...this.participants.values()])
    const games = [...this.games.values()]
    for (const game of games) {
      game.players = []
      for (const _ of range(playerCount)) {
        const player = participants.pop()
        if (player == null) return
        game.players.push(player)
      }
    }
    games.forEach(game => game.setup())
  }

  update(): void {
    const summary = this.summarize()
    this.io.emit('summary', summary)
    const participants = shuffle([...this.participants.values()])
    const ready = participants.every(p => p.ready)
    if (ready) this.advanceStage()
  }

  setQuality(): void {
    const theta = this.treatment.theta
    const rand = Math.random()
    this.quality = rand < theta ? 'high' : 'low'
  }

  advanceStage(): void {
    this.games.forEach(game => {
      game.withdrawCounts = getWithdrawCounts(game)
      game.payVec = getPayVec(game)
    })
    this.stage += 1
    this.participants.forEach(p => {
      p.ready = false
    })
    if (this.stage > 3) {
      this.advancePeriod()
      return
    }
  }

  advancePeriod(): void {
    this.stage = 1
    if (this.period >= maxPeriod) {
      this.state = 'complete'
      this.stage = 3
      return
    }
    this.period += 1
    this.setQuality()
    this.participants.forEach(p => {
      p.ready = false
      p.action = 3
    })
  }

  summarize(): SessionSummary {
    const participants = [...this.participants.values()]
    return {
      token: this.token,
      state: this.state,
      treatment: this.treatment,
      period: this.period,
      stage: this.stage,
      quality: this.quality,
      participants: participants.map(p => p.summarize()),
      games: this.games.map(game => game.summarize()),
    }
  }

  async listen(port: number): Promise<void> {
    const server = this.io.httpServer
    server.listen(port)
    await once(server, 'listening')
  }
}
