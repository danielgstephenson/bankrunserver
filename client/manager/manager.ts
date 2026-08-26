import { el } from '../builder.js'
import { io } from '/socket.io/socket.io.esm.min.js'

export class Manager {
  socket = io()

  constructor() {
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id)
    })
    el(document.body, 'div', {
      className: 'textBox',
      textContent: 'Manager',
    })
  }
}
