import { el } from '../builder.js'
import type { Manager } from './manager.js'

export class Controls {
  manager: Manager
  div: HTMLDivElement

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'controlsDiv' })
    el(this.div, 'div', {
      className: 'textBox',
      textContent: 'Manager',
    })
    const treatmentButton1 = el(this.div, 'button', {
      id: 'treatmentButton1',
      textContent: 'Treatment 1',
    })
    treatmentButton1.addEventListener('click', _ => {
      console.log('treatment1')
      this.manager.socket.emit('treatment', 1)
    })
    const beginButton = el(this.div, 'button', {
      id: 'beginButton',
      textContent: 'Begin',
    })
    beginButton.addEventListener('click', _ => {
      console.log('begin')
      this.manager.socket.emit('begin')
    })
  }
}
