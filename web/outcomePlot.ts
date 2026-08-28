import { el } from './builder.js'
import type { Client } from './client.js'
import type { Decision } from './decision.js'

export class OutcomePlot {
  decision: Decision
  client: Client
  div: HTMLDivElement

  constructor(decision: Decision) {
    this.decision = decision
    this.client = this.decision.client
    this.div = el(this.decision.div, 'div', { id: 'outcomePlot' })
    el(this.div, 'div', { className: 'textBox', textContent: 'Outcome Plot' })
  }
}
