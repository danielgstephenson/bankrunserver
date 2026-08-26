import express from 'express'
import { type Express } from 'express'
import { makeServer } from './server.js'
import { type IOServer } from './server.js'
import { getDateString } from './dateString.js'
import { Participant } from './participant.js'
import { range } from './math.js'
import { once } from 'node:events'

export class Session {
  token = `${Math.random()}`
  app: Express
  io: IOServer
  dateString: string
  participants = new Map<string, Participant>()

  constructor() {
    this.app = express()
    this.io = makeServer(this.app)
    this.dateString = getDateString()
    range(1, 10).forEach(i => new Participant(this, `${i}`))
    this.setupIo()
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
        participant.socket = socket
        socket.emit('joined', id)
      })
    })
  }

  async listen(port: number): Promise<void> {
    const server = this.io.httpServer
    server.listen(port)
    await once(server, 'listening')
  }
}
