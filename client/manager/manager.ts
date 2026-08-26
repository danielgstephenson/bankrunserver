import type { Summary } from '../../shared/summary.js'
import { el } from '../builder.js'
import { io } from '/socket.io/socket.io.esm.min.js'

export class Manager {
  socket = io()
  token = ''

  constructor() {
    this.setupSocket()
    el(document.body, 'div', {
      className: 'textBox',
      textContent: 'Manager',
    })
    const beginButton = el(document.body, 'button', {
      id: 'beginButton',
      textContent: 'Begin',
    })
    beginButton.addEventListener('click', _ => {
      console.log('begin')
      this.socket.emit('begin')
    })
  }

  setupSocket(): void {
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id)
    })
    this.socket.on('summary', (summary: Summary) => {
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
