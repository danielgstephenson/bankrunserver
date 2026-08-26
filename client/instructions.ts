import type { Summary } from '../shared/summary.js'
import { el } from './builder.js'
import type { Client } from './client.js'

export class Instructions {
  client: Client
  div: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'instructionsDiv' })
    el(this.div, 'div', {
      className: 'textBox',
      textContent: 'Instructions',
    })
    el(this.div, 'div', {
      className: 'textBox',
      textContent: 'Quiz',
    })
    this.client.socket.on('summary', (summary: Summary) => {
      const show = this.client.id !== '' && summary.state === 'instructions'
      this.div.style.display = show ? 'flex' : 'none'
    })
  }
}
