import type { SessionSummary } from '../../shared/summary.js'
import { Controls } from './controls.js'
import { HistoryPlot } from './historyPlot.js'
import { Table } from './table.js'
import { io } from 'socket.io-client'

export class Manager {
  socket = io()
  token = ''
  table = new Table(this)
  controls = new Controls(this)
  historyPlot = new HistoryPlot(this)
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
      this.controls.update(summary)
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
