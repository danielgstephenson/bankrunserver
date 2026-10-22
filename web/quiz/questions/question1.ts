import { el } from '../../builder.js'
import { Question } from '../question.js'
import type { Quiz } from '../quiz.js'

export class Question1 extends Question {
  errorDiv: HTMLDivElement
  errorOpacity = 0

  constructor(quiz: Quiz) {
    super(quiz, 1)
    const textBox = el(this.div, 'div')
    textBox.innerText = 'Will the same group of 10 investors be matched together in each period?'
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

  yes(): void {
    this.quiz.questionId += 1
  }

  no(): void {
    this.error()
  }

  error(): void {
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
