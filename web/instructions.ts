import { bonus, maxPeriod } from '../shared/parameters.js'
import type { SessionSummary } from '../shared/summary.js'
import { el } from './builder.js'
import type { Client } from './client.js'
import instructionsText from './instructions.txt'

export class Instructions {
  client: Client
  div: HTMLDivElement
  scrollBox: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'instructionsDiv' })
    this.scrollBox = el(this.div, 'div', { className: 'scrollBox' })
    this.client.socket.on('summary', (summary: SessionSummary) => {
      const show = this.client.id !== '' && summary.state === 'instructions'
      this.div.style.display = show ? 'flex' : 'none'
    })
  }

  update(summary: SessionSummary): void {
    let html = instructionsText.replaceAll('[D]', summary.treatment.D.toFixed(0))
    html = html.replaceAll('[maxPeriod]', maxPeriod.toFixed(0))
    html = html.replaceAll('[bonus]', bonus.toFixed(0))
    this.scrollBox.innerHTML = html
  }
}
