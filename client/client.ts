import { Disconnected } from './disconnected.js'
import { Instructions } from './instructions.js'
import { Join } from './join.js'
import { io } from '/socket.io/socket.io.esm.min.js'
import type { SessionSummary } from '../shared/types.js'

export class Client {
  socket = io()
  join = new Join(this)
  instructions = new Instructions(this)
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
      console.log('state', summary.state)
      this.checkToken(summary.token)
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
