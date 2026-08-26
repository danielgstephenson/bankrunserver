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
