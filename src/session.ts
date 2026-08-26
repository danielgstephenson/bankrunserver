import express from 'express'
import { type Express } from 'express'
import { makeServer } from './server.js'
import { type IOServer } from './server.js'
import { getDateString } from './dateString.js'
import { Participant } from './participant.js'
import { range } from './math.js'
import { once } from 'node:events'
import type { SessionSummary } from '../shared/types.js'
import { treatment1 } from './treatment.js'

export class Session {
  token = `${Math.random()}`
  app: Express
  io: IOServer
  dateString: string
  participants = new Map<string, Participant>()
  state = 'instructions'
  treatment = treatment1
  period = 1
  stage = 1

  constructor() {
    this.app = express()
    this.io = makeServer(this.app)
    this.dateString = getDateString()
    range(1, 10).forEach(i => new Participant(this, `${i}`))
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
      socket.on('begin', _ => {
        console.log('begin')
        if (this.state !== 'instructions') return
        this.state = 'game'
      })
    })
  }

  sendUpdates(): void {
    const summary = this.summarize()
    this.io.emit('summary', summary)
  }

  summarize(): SessionSummary {
    const participants = [...this.participants.values()]
    const summary = {
      token: this.token,
      state: this.state,
      treatment: this.treatment,
      period: this.period,
      stage: this.stage,
      participants: participants.map(p => p.summarize()),
    }
    return summary
  }

  async listen(port: number): Promise<void> {
    const server = this.io.httpServer
    server.listen(port)
    await once(server, 'listening')
  }
}
