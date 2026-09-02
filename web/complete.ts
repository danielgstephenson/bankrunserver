import type { SessionSummary } from '../shared/summary.js'
import { el } from './builder.js'
import type { Client } from './client.js'

export class Complete {
  client: Client
  div: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'completeDiv' })
    el(this.div, 'div', {
      className: 'textBox',
      textContent: 'The experiment is complete.',
    })
    el(this.div, 'div', {
      className: 'textBox',
      textContent: 'Please wait while your payment is prepared.',
    })
  }

  update(summary: SessionSummary): void {
    this.div.style.display = summary.state === 'complete' ? 'flex' : 'none'
  }
}
