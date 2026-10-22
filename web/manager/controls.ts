import { el } from '../builder.js'
import { range } from '../../shared/math.js'
import type { SessionSummary } from '../../shared/summary.js'
import type { Manager } from './manager.js'
import { maxPeriod, maxPracticePeriod } from '../../shared/parameters.js'

export class Controls {
  manager: Manager
  div: HTMLDivElement
  paramsDiv: HTMLDivElement
  sessionDiv: HTMLDivElement
  treatmentRow: HTMLDivElement
  beginQuizButton: HTMLButtonElement
  beginPracticeButton: HTMLButtonElement
  beginGameButton: HTMLButtonElement

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
    this.beginQuizButton = el(this.div, 'button', {
      id: 'beginQuizButton',
      textContent: 'Begin Quiz',
    })
    this.beginQuizButton.addEventListener('click', _ => {
      this.manager.socket.emit('beginQuiz')
    })
    this.beginPracticeButton = el(this.div, 'button', {
      id: 'beginPracticeButton',
      textContent: 'Begin Practice',
    })
    this.beginPracticeButton.addEventListener('click', _ => {
      this.manager.socket.emit('beginPractice')
    })
    this.beginGameButton = el(this.div, 'button', {
      id: 'beginGameButton',
      textContent: 'Begin Game',
    })
    this.beginGameButton.addEventListener('click', _ => {
      this.manager.socket.emit('beginGame')
    })
    this.sessionDiv = el(this.div, 'div', { className: 'controlsColumn' })
    this.sessionDiv.style.marginTop = '1vmin'
    this.sessionDiv.style.userSelect = 'none'
  }

  update(summary: SessionSummary): void {
    this.treatmentRow.style.visibility = summary.state === 'instructions' ? 'visible' : 'hidden'
    this.beginQuizButton.style.visibility = summary.state === 'instructions' ? 'visible' : 'hidden'
    this.beginPracticeButton.style.visibility = summary.state === 'quiz' ? 'visible' : 'hidden'
    this.beginGameButton.style.visibility = summary.state == 'practiceComplete' ? 'visible' : 'hidden'
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
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `practice: ${summary.practice}` })
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `state: ${summary.state}` })
    const M = summary.practice ? maxPracticePeriod : maxPeriod
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `period: ${summary.period} / ${M}` })
    el(this.sessionDiv, 'div', { className: `textBox`, textContent: `stage: ${summary.stage} / 3` })
  }
}
