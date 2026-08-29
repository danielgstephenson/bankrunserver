import { el } from './builder.js'
import type { Client } from './client.js'
import { OutcomePlot } from './outcomePlot.js'
import type { SessionSummary } from './shared/summary.js'

export class Decision {
  client: Client
  div: HTMLDivElement
  outcomePlot: OutcomePlot
  infoDiv: HTMLDivElement
  actionRow: HTMLDivElement
  withdrawButton: HTMLButtonElement
  holdButton: HTMLButtonElement
  continueButton: HTMLButtonElement
  waitingDiv: HTMLDivElement

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'decisionDiv' })
    this.outcomePlot = new OutcomePlot(this)
    this.infoDiv = el(this.div, 'div', { id: 'infoDiv' })
    this.infoDiv.style.margin = '1vmin'
    this.actionRow = el(this.div, 'div', { id: 'actionRow' })
    this.actionRow.style.margin = '1vmin'
    this.withdrawButton = el(this.actionRow, 'button', { id: 'withdrawButton', textContent: 'Withdraw' })
    this.withdrawButton.style.width = '40vmin'
    this.withdrawButton.style.height = '10vmin'
    this.withdrawButton.style.borderRadius = '1.5vmin'
    this.withdrawButton.style.textAlign = 'center'
    this.withdrawButton.addEventListener('click', _ => this.client.socket.emit('withdraw', this.client.id))
    this.holdButton = el(this.actionRow, 'button', { id: 'holdButton', textContent: 'Hold' })
    this.holdButton.style.width = '40vmin'
    this.holdButton.style.height = '10vmin'
    this.holdButton.style.borderRadius = '1.5vmin'
    this.holdButton.style.textAlign = 'center'
    this.holdButton.addEventListener('click', _ => this.client.socket.emit('hold', this.client.id))
    this.continueButton = el(this.actionRow, 'button', { id: 'continueButton', textContent: 'Continue' })
    this.continueButton.style.width = '40vmin'
    this.continueButton.style.height = '10vmin'
    this.continueButton.style.borderRadius = '1.5vmin'
    this.continueButton.style.textAlign = 'center'
    this.continueButton.style.display = 'none'
    this.continueButton.addEventListener('click', _ => this.client.socket.emit('continue', this.client.id))
    this.waitingDiv = el(this.actionRow, 'div', { className: 'textBox', textContent: `Waiting for others...` })
    this.waitingDiv.style.display = 'none'
  }

  update(summary: SessionSummary): void {
    const visible = this.client.id !== '' && summary.state === 'game'
    this.div.style.display = visible ? 'flex' : 'none'
    this.updateInfoDiv(summary)
    this.updateActionRow(summary)
  }

  updateActionRow(summary: SessionSummary): void {
    const player = summary.participants.find(p => p.id === this.client.id)
    if (player == null) return
    this.withdrawButton.style.display = summary.stage < 3 && !player.ready ? 'block' : 'none'
    this.holdButton.style.display = summary.stage < 3 && !player.ready ? 'block' : 'none'
    this.continueButton.style.display = summary.stage === 3 && !player.ready ? 'block' : 'none'
    this.waitingDiv.style.display = player.ready ? 'block' : 'none'
  }

  updateInfoDiv(summary: SessionSummary): void {
    this.infoDiv.replaceChildren()
    const player = summary.participants.find(p => p.id === this.client.id)
    if (player == null) return
    const game = summary.games[player.game]
    el(this.infoDiv, 'div', {
      className: 'textBox',
      textContent: `It is currently stage ${summary.stage}.`,
    })
    console.log('inform', player.informed)
    if (player.informed) {
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
    if (summary.stage === 3) {
      const payoff = game.payVec[player.action - 1]
      el(this.infoDiv, 'div', {
        className: 'textBox',
        textContent: `You withdrew in stage ${player.action} and earned $${payoff.toFixed(2)}`,
      })
    } else if (player.ready && player.action > summary.stage) {
      el(this.infoDiv, 'div', {
        className: 'textBox',
        textContent: `You held.`,
      })
    } else if (player.ready && player.action == summary.stage) {
      el(this.infoDiv, 'div', {
        className: 'textBox',
        textContent: `You withdrew.`,
      })
    } else if (player.ready && player.action < summary.stage) {
      el(this.infoDiv, 'div', {
        className: 'textBox',
        textContent: `You withdrew in stage ${player.action}.`,
      })
    } else {
      el(this.infoDiv, 'div', {
        className: 'textBox',
        textContent: `What will you do in this stage?`,
      })
    }
  }
}
