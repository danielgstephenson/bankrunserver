import { Disconnected } from './disconnected.js'
import { Instructions } from './instructions.js'
import { Join } from './join.js'
import { io } from 'socket.io-client'
import type { SessionSummary } from '../shared/summary.js'
import { Decision } from './decision.js'
import { Complete } from './complete.js'

export class Client {
  socket = io()
  join = new Join(this)
  instructions = new Instructions(this)
  decision = new Decision(this)
  complete = new Complete(this)
  disconnected = new Disconnected(this)
  token = ''
  id = ''

  constructor() {
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id)
    })
    this.socket.on('disconnected', () => {
      console.log('disconnected', this.socket.id)
      this.disconnected.div.style.display = 'flex'
    })
    this.socket.on('summary', (summary: SessionSummary) => {
      this.checkToken(summary.token)
      this.decision.update(summary)
      this.complete.update(summary)
    })
    this.socket.on('joined', (id: string) => {
      this.id = id
      this.join.div.style.display = 'none'
      console.log('joined', id)
      document.title = `Client ${id}`
    })
  }

  checkToken(token: string): void {
    if (this.token === '') {
      this.token = token
      return
    }
    if (token !== this.token) {
      location.reload()
    }
  }
}
