import express from 'express'
import { type Express } from 'express'
import { makeServer } from './server.js'
import { type IOServer } from './server.js'
import { getDateString } from './dateString.js'
import { Participant } from './participant.js'
import { range, shuffle } from '../web/shared/math.js'
import { once } from 'node:events'
import type { SessionSummary } from '../web/shared/types.js'
import { treatment1, treatments } from '../web/shared/treatment.js'
import { Game } from './game.js'
import { gameCount, participantCount, playerCount } from '../web/shared/parameters.js'

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

  constructor() {
    this.app = express()
    this.io = makeServer(this.app)
    range(1, participantCount).forEach(i => new Participant(this, `${i}`))
    range(gameCount).forEach(_ => new Game(this))
    this.setupIo()
    setInterval(() => this.sendUpdates(), 100)
  }

  setupIo(): void {
    this.io.on('connection', socket => {
      console.log(`connected: ${socket.id}`)
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
        console.log(`joined: ${id}`)
        socket.emit('joined', id)
      })
      socket.on('treatment', (id: number) => {
        console.log(`treatment ${id}`)
        this.treatment = treatments[id - 1]
      })
      socket.on('begin', _ => {
        console.log('begin')
        if (this.state !== 'instructions') return
        this.state = 'game'
      })
    })
  }

  setupGames(): void {
    const participants = shuffle([...this.participants.values()])
    const games = [...this.games.values()]
    for (const game of games) {
      for (const _ of range(playerCount)) {
        const player = participants.pop()
        if (player == null) return
        game.players.push(player)
      }
    }
    games.forEach(game => game.setup())
  }

  sendUpdates(): void {
    const summary = this.summarize()
    this.io.emit('summary', summary)
  }

  summarize(): SessionSummary {
    const participants = [...this.participants.values()]
    return {
      token: this.token,
      state: this.state,
      treatment: this.treatment,
      period: this.period,
      stage: this.stage,
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
