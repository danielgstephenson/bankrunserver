import type { SessionSummary } from '../shared/summary.js'
import { el } from './builder.js'
import type { Client } from './client.js'

export class Instructions {
  client: Client
  div: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'instructionsDiv', innerText: 'Instructions' })
  }

  update(summary: SessionSummary): void {
    const visible = this.client.id !== '' && summary.state === 'instructions'
    this.div.style.display = visible ? 'flex' : 'none'
  }
}
