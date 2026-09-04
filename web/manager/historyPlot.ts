import { mean, range } from '../../shared/math.js'
import { highColor, lowColor, maxPeriod } from '../../shared/parameters.js'
import type { SessionSummary } from '../../shared/summary.js'
import { el } from '../builder.js'
import type { Manager } from './manager.js'

export class HistoryPlot {
  manager: Manager
  div: HTMLDivElement
  axis: HTMLDivElement
  informedPoints: HTMLDivElement[] = []
  uninformedPoints: HTMLDivElement[] = []

  constructor(manager: Manager) {
    this.manager = manager
    this.div = el(document.body, 'div', { id: 'historyPlot' })
    this.axis = el(this.div, 'div', { id: 'axis' })
    range(maxPeriod).forEach(i => {
      const informedPoint = el(this.axis, 'div', { className: 'informedPoint' })
      const uninformedPoint = el(this.axis, 'div', { className: 'uninformedPoint' })
      const left = `${(100 * (i + 1)) / (maxPeriod + 1)}%`
      informedPoint.style.left = left
      uninformedPoint.style.left = left
      this.informedPoints.push(informedPoint)
      this.uninformedPoints.push(uninformedPoint)
    })
  }

  update(summary: SessionSummary) {
    range(maxPeriod).forEach(i => {
      const display = i + 1 < summary.period ? 'block' : 'none'
      this.informedPoints[i].style.display = display
      this.uninformedPoints[i].style.display = display
    })
    const informed = summary.participants.filter(p => p.informed)
    const uninformed = summary.participants.filter(p => !p.informed)
    const informedMean = mean(informed.map(p => p.action))
    const uninformedMean = mean(uninformed.map(p => p.action))
    const informedPoint = this.informedPoints[summary.period - 1]
    const uninformedPoint = this.uninformedPoints[summary.period - 1]
    informedPoint.style.top = `${50 * (3 - informedMean)}%`
    uninformedPoint.style.top = `${50 * (3 - uninformedMean)}%`
    informedPoint.style.outlineColor = summary.quality === 'high' ? highColor : lowColor
    uninformedPoint.style.outlineColor = summary.quality === 'high' ? highColor : lowColor
    informedPoint.style.display = summary.stage > 2 ? 'block' : 'none'
    uninformedPoint.style.display = summary.stage > 2 ? 'block' : 'none'
  }
}
