import type { SessionSummary } from '../shared/summary.js'
import { el } from '../builder.js'
import type { Manager } from './manager.js'

export class Table {
  manager: Manager
  div: HTMLDivElement

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'tableGrid' })
  }

  update(summary: SessionSummary): void {
    this.div.innerHTML = ''
    el(this.div, 'div', { className: 'gridCell header', textContent: 'id' })
    el(this.div, 'div', { className: 'gridCell header', textContent: 'join' })
    el(this.div, 'div', { className: 'gridCell header', textContent: 'hold' })
    el(this.div, 'div', { className: 'gridCell header', textContent: 'action' })
    summary.participants.forEach(p => {
      el(this.div, 'div', { className: 'gridCell', textContent: `${p.id}` })
      el(this.div, 'div', { className: 'gridCell', textContent: `${p.joined ? 1 : 0}` })
      el(this.div, 'div', { className: 'gridCell', textContent: `${p.ready ? 1 : 0}` })
      el(this.div, 'div', { className: 'gridCell', textContent: `${p.action}` })
    })
  }
}
