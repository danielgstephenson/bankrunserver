import type { SessionSummary } from '../shared/summary.js'
import { el } from './builder.js'
import type { Client } from './client.js'

export class PracticeComplete {
  client: Client
  div: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'practiceCompleteDiv' })
    this.div.innerText = 'The practice periods are now complete.'
  }

  update(summary: SessionSummary): void {
    const visible = this.client.id !== '' && summary.state === 'practiceComplete'
    this.div.style.display = visible ? 'flex' : 'none'
  }
}
