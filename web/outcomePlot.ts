import { el } from './builder.js'
import type { Client } from './client.js'
import type { Decision } from './decision.js'
import { range } from '../shared/math.js'
import type { SessionSummary } from '../shared/summary.js'

export class OutcomePlot {
  decision: Decision
  client: Client
  div: HTMLDivElement
  bars: HTMLDivElement[] = []
  stageLabels: HTMLDivElement[] = []
  withdrawLabels: HTMLDivElement[] = []
  earnLabels: HTMLDivElement[] = []

  constructor(decision: Decision) {
    this.decision = decision
    this.client = this.decision.client
    this.div = el(this.decision.div, 'div', { id: 'outcomePlot' })
    const barRow = el(this.div, 'div', { className: 'plotRow' })
    const barArea1 = el(barRow, 'div', { className: 'barArea' })
    const barArea2 = el(barRow, 'div', { className: 'barArea' })
    const barArea3 = el(barRow, 'div', { className: 'barArea' })
    this.bars.push(el(barArea1, 'div', { className: 'bar' }))
    this.bars.push(el(barArea2, 'div', { className: 'bar' }))
    this.bars.push(el(barArea3, 'div', { className: 'bar' }))
    const stageRow = el(this.div, 'div', { className: 'plotRow' })
    this.stageLabels.push(el(stageRow, 'div', { className: 'plotLabel', textContent: 'Stage 1' }))
    this.stageLabels.push(el(stageRow, 'div', { className: 'plotLabel', textContent: 'Stage 2' }))
    this.stageLabels.push(el(stageRow, 'div', { className: 'plotLabel', textContent: 'Stage 3' }))
    const withdrawRow = el(this.div, 'div', { className: 'plotRow' })
    this.withdrawLabels.push(el(withdrawRow, 'div', { className: 'plotLabel', textContent: '10 Withdrew' }))
    this.withdrawLabels.push(el(withdrawRow, 'div', { className: 'plotLabel', textContent: '10 Withdrew' }))
    this.withdrawLabels.push(el(withdrawRow, 'div', { className: 'plotLabel', textContent: '10 Withdrew' }))
    const earnRow = el(this.div, 'div', { className: 'plotRow' })
    this.earnLabels.push(el(earnRow, 'div', { className: 'plotLabel', textContent: 'Earned $10.00' }))
    this.earnLabels.push(el(earnRow, 'div', { className: 'plotLabel', textContent: 'Earned $10.00' }))
    this.earnLabels.push(el(earnRow, 'div', { className: 'plotLabel', textContent: 'Earned $10.00' }))
  }

  update(summary: SessionSummary): void {
    const player = summary.participants.find(p => p.id === this.client.id)
    if (player == null) return
    const game = summary.games[player.game]
    const labelGreen = 'hwb(130 0% 50% / 0.2)'
    const barGreen = 'hwb(130 0% 30% / 1)'
    const barGray = 'hwb(130 100% 60% / 1)'
    const stageOutline = '0.5vmin solid hwb(215 0% 0%)'
    const RH = summary.treatment.RH
    range(3).forEach(i => {
      const stageLabel = this.stageLabels[i]
      const withdrawLabel = this.withdrawLabels[i]
      const earnLabel = this.earnLabels[i]
      const withdrawCount = game.withdrawCounts[i]
      const bar = this.bars[i]
      const pay = game.payVec[i]
      const labelFilled = summary.stage > i && player.action == i + 1
      const labelBackground = labelFilled ? labelGreen : 'none'
      const present = summary.stage === i + 1
      const past = summary.stage > Math.min(i + 1, 2)
      stageLabel.style.outline = present ? stageOutline : 'none'
      stageLabel.style.background = labelBackground
      withdrawLabel.style.background = labelBackground
      withdrawLabel.textContent = past ? `${withdrawCount} Withdrew` : ''
      earnLabel.style.background = labelBackground
      earnLabel.textContent = summary.stage === 3 ? `Earned $${pay.toFixed(2)}` : ''
      bar.style.height = summary.stage < 3 ? '0%' : `${(100 * pay) / RH}%`
      bar.style.background = player.action === i + 1 ? barGreen : barGray
    })
  }
}
