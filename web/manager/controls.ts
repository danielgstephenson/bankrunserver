import { el } from '../builder.js'
import { range } from '../../shared/math.js'
import type { SessionSummary } from '../../shared/summary.js'
import type { Manager } from './manager.js'
import { maxPeriod } from '../../shared/parameters.js'

export class Controls {
  manager: Manager
  div: HTMLDivElement
  treatmentDiv: HTMLDivElement
  sessionDiv: HTMLDivElement

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'controlsDiv' })
    el(this.div, 'div', { className: `textBox`, textContent: 'Set Treatment: ' })
    const treatmentRow = el(this.div, 'div', { className: `controlsRow` })
    treatmentRow.style.marginBottom = '1vmin'
    range(1, 4).forEach(T => {
      const treatmentButton = el(treatmentRow, 'button', { textContent: `${T}` })
      treatmentButton.style.paddingLeft = '1vmin'
      treatmentButton.style.paddingRight = '1vmin'
      treatmentButton.style.marginLeft = '0.5vmin'
      treatmentButton.style.marginRight = '0vmin'
      treatmentButton.addEventListener('click', _ => this.manager.socket.emit('treatment', T))
    })
    this.treatmentDiv = el(this.div, 'div', { className: 'controlsColumn' })
    this.treatmentDiv.style.marginBottom = '1vmin'
    this.treatmentDiv.style.userSelect = 'none'
    const instructionsButton = el(this.div, 'button', {
      id: 'instructionsButton',
      textContent: 'Instructions',
    })
    instructionsButton.addEventListener('click', _ => {
      console.log('begin')
      this.manager.socket.emit('instructions')
    })
    const gameButton = el(this.div, 'button', {
      id: 'gameButton',
      textContent: 'Game',
    })
    gameButton.addEventListener('click', _ => {
      console.log('game')
      this.manager.socket.emit('game')
    })
    this.sessionDiv = el(this.div, 'div', { className: 'controlsColumn' })
    this.sessionDiv.style.marginTop = '1vmin'
    this.sessionDiv.style.userSelect = 'none'
  }

  update(summary: SessionSummary): void {
    this.treatmentDiv.replaceChildren()
    const treat = summary.treatment
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `treatment ${treat.id}` })
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `pi: ${treat.pi}` })
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `theta: ${treat.theta}` })
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `lambda: ${treat.lambda}` })
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `RH: ${treat.RH}` })
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `D: ${treat.D}` })
    el(this.treatmentDiv, 'div', { className: `textBox`, textContent: `RL: ${treat.RL}` })
    this.sessionDiv.replaceChildren()
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `state: ${summary.state}` })
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `period: ${summary.period} / ${maxPeriod}` })
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `stage: ${summary.stage} / 3` })
  }
}
