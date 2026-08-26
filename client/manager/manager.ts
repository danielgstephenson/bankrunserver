import type { SessionSummary } from '../../shared/types.js'
import { Controls } from './controls.js'
import { Table } from './table.js'
import { io } from '/socket.io/socket.io.esm.min.js'

export class Manager {
  socket = io()
  token = ''
  table = new Table(this)
  controls = new Controls(this)
  summary?: SessionSummary

  constructor() {
    this.setupSocket()
  }

  setupSocket(): void {
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id)
    })
    this.socket.on('summary', (summary: SessionSummary) => {
      console.log('state', summary.state)
      this.checkToken(summary.token)
      this.summary = summary
      this.table.update(summary)
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
