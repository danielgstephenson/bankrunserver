import type { SessionSummary } from '../../../shared/summary.js'
import { el } from '../../builder.js'
import { Question } from '../question.js'
import type { Quiz } from '../quiz.js'

export class Question3 extends Question {
  errorDiv: HTMLDivElement
  errorOpacity = 0
  theta = 0.5

  constructor(quiz: Quiz) {
    super(quiz, 3)
    const textBox = el(this.div, 'div')
    textBox.innerText = 'Prior to Stage 1, will the period’s investment quality be revealed to 5 creditors?'
    const answerRow = el(this.div, 'div', { className: 'answerRow' })
    const yesButton = el(answerRow, 'button', { textContent: 'Yes', className: 'answerButton' })
    yesButton.onclick = () => this.yes()
    const noButton = el(answerRow, 'button', { textContent: 'No', className: 'answerButton' })
    noButton.onclick = () => this.no()
    this.errorDiv = el(this.div, 'div', { className: 'questionErrorDiv' })
    this.errorDiv.innerHTML = 'Incorrect <br> Please try again'
    setInterval(() => {
      this.errorOpacity *= 0.95
      this.errorDiv.style.opacity = `${this.errorOpacity}`
    }, 100)
  }

  override update(summary: SessionSummary): void {
    super.update(summary)
    this.theta = summary.treatment.theta
  }

  yes(): void {
    this.error()
  }

  no(): void {
    this.quiz.questionId += 1
  }

  error(): void {
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
