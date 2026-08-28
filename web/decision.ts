import { el } from './builder.js'
import type { Client } from './client.js'
import { OutcomePlot } from './outcomePlot.js'
import type { SessionSummary } from './shared/summary.js'

export class Decision {
  client: Client
  div: HTMLDivElement
  outcomePlot: OutcomePlot
  infoDiv: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'decisionDiv' })
    this.outcomePlot = new OutcomePlot(this)
    this.infoDiv = el(this.div, 'div', { id: 'infoDiv' })
    this.infoDiv.style.margin = '2vmin'
  }

  update(summary: SessionSummary): void {
    const visible = this.client.id !== '' && summary.state === 'game'
    this.div.style.display = visible ? 'flex' : 'none'
    this.infoDiv.replaceChildren()
    const player = summary.participants.find(p => p.id === this.client.id)
    if (player == null) return
    const game = summary.games[player.game]
    el(this.infoDiv, 'div', {
      className: 'textBox',
      textContent: `It is currently stage ${summary.stage}.`,
    })
    console.log('inform', player.inform)
    if (player.inform) {
      el(this.infoDiv, 'div', {
        className: 'textBox',
        innerHTML: `The quality is <b>${game.quality}</b>.`,
      })
    } else {
      el(this.infoDiv, 'div', {
        className: 'textBox',
        textContent: `You are uninformed.`,
      })
    }
  }
}
