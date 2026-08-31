import { el } from '../builder.js'
import type { Manager } from './manager.js'

export class HistoryPlot {
  manager: Manager
  div: HTMLDivElement

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'historyPlot' })
  }
}
