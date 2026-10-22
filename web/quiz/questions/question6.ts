import { el } from '../../builder.js'
import { Question } from '../question.js'
import type { Quiz } from '../quiz.js'

export class Question6 extends Question {
  errorDiv: HTMLDivElement
  errorOpacity = 0

  constructor(quiz: Quiz) {
    super(quiz, 6)
    const textBox = el(this.div, 'div')
    textBox.innerText = 'If a creditor withdraws, do they always earn more by withdrawing in stage 1 than withdrawing in stage 2?'
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
    this.error()
  }

  no(): void {
    const socket = this.quiz.client.socket
    const id = this.quiz.client.id
    socket.emit('quizComplete', id)
    this.quiz.questionId += 1
  }

  error(): void {
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
