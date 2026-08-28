import { el } from './builder.js'
import type { Client } from './client.js'

export class Disconnected {
  client: Client
  div: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'disconnectedDiv' })
    const label = el(this.div, 'div', {
      className: 'textBox',
      textContent: 'Disconnected',
    })
    label.style.color = 'red'
  }
}
