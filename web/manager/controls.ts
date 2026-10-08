import { el } from '../builder.js'
import { range } from '../../shared/math.js'
import type { SessionSummary } from '../../shared/summary.js'
import type { Manager } from './manager.js'
import { maxPeriod } from '../../shared/parameters.js'

export class Controls {
  manager: Manager
  div: HTMLDivElement
  paramsDiv: HTMLDivElement
  sessionDiv: HTMLDivElement
  treatmentRow: HTMLDivElement
  beginButton: HTMLButtonElement

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'controlsDiv' })
    el(this.div, 'div', { className: `textBox`, textContent: 'Set Treatment: ' })
    this.treatmentRow = el(this.div, 'div', { className: `controlsRow` })
    this.treatmentRow.style.marginBottom = '1vmin'
    range(1, 4).forEach(T => {
      const treatmentButton = el(this.treatmentRow, 'button', { textContent: `${T}` })
      treatmentButton.style.paddingLeft = '1vmin'
      treatmentButton.style.paddingRight = '1vmin'
      treatmentButton.style.marginLeft = '0.5vmin'
      treatmentButton.style.marginRight = '0vmin'
      treatmentButton.addEventListener('click', _ => this.manager.socket.emit('treatment', T))
    })
    this.paramsDiv = el(this.div, 'div', { className: 'controlsColumn' })
    this.paramsDiv.style.marginBottom = '1vmin'
    this.paramsDiv.style.userSelect = 'none'
    this.beginButton = el(this.div, 'button', {
      id: 'beginButton',
      textContent: 'Begin',
    })
    this.beginButton.addEventListener('click', _ => {
      this.manager.socket.emit('begin')
    })
    this.sessionDiv = el(this.div, 'div', { className: 'controlsColumn' })
    this.sessionDiv.style.marginTop = '1vmin'
    this.sessionDiv.style.userSelect = 'none'
  }

  update(summary: SessionSummary): void {
    const instructions = summary.state === 'instructions'
    this.treatmentRow.style.visibility = instructions ? 'visible' : 'hidden'
    this.beginButton.style.visibility = instructions ? 'visible' : 'hidden'
    this.paramsDiv.replaceChildren()
    const treat = summary.treatment
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `treatment ${treat.id}` })
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `pi: ${treat.pi}` })
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `theta: ${treat.theta}` })
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `lambda: ${treat.lambda}` })
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `RH: ${treat.RH}` })
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `D: ${treat.D}` })
    el(this.paramsDiv, 'div', { className: `textBox`, textContent: `RL: ${treat.RL}` })
    this.sessionDiv.replaceChildren()
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `state: ${summary.state}` })
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `period: ${summary.period} / ${maxPeriod}` })
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `stage: ${summary.stage} / 3` })
  }
}
