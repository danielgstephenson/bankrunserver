import { el } from '../builder.js'
import { range } from '../shared/math.js'
import type { Manager } from './manager.js'

export class Controls {
  manager: Manager
  div: HTMLDivElement

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'controlsDiv' })
    range(1, 3).forEach(T => {
      const treatmentButton = el(this.div, 'button', {
        id: `treatmentButton${T}`,
        textContent: `Treatment ${T}`,
      })
      treatmentButton.addEventListener('click', _ => {
        console.log(`treatment ${T}`)
        this.manager.socket.emit('treatment', T)
      })
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
