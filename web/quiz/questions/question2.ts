import type { SessionSummary } from '../../../shared/summary.js'
import { el } from '../../builder.js'
import { Question } from '../question.js'
import type { Quiz } from '../quiz.js'

export class Question2 extends Question {
  errorDiv: HTMLDivElement
  errorOpacity = 0
  theta = 0.5

  constructor(quiz: Quiz) {
    super(quiz, 2)
    const textBox = el(this.div, 'div')
    textBox.innerText = 'Is the investment quality equally likely to be High or Low in each period?'
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
    if (this.theta === 0.5) {
      this.quiz.questionId += 1
    } else {
      this.error()
    }
  }

  no(): void {
    if (this.theta === 0.5) {
      this.error()
    } else {
      this.quiz.questionId += 1
    }
  }

  error(): void {
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
