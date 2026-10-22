import { getPayVec } from '../../../shared/payoff.js'
import type { SessionSummary } from '../../../shared/summary.js'
import { el } from '../../builder.js'
import { Question } from '../question.js'
import type { Quiz } from '../quiz.js'

export class Question5 extends Question {
  input: HTMLInputElement
  errorDiv: HTMLDivElement
  errorOpacity = 0
  correctAnswer = 1

  constructor(quiz: Quiz) {
    super(quiz, 5)
    const textBox = el(this.div, 'div')
    textBox.innerText =
      'Suppose the quality is High and 3 creditors withdrew in Stage 2. What would your earnings for the period be if you wait until Stage 3 to withdraw?'
    this.input = el(this.div, 'input', { id: 'idInput', type: 'text' })
    this.input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return
      this.submit()
    })
    const button = el(this.div, 'button', { textContent: 'Submit', className: 'answerButton' })
    button.onclick = () => this.submit()
    this.errorDiv = el(this.div, 'div', { className: 'questionErrorDiv' })
    this.errorDiv.innerHTML = 'Incorrect <br> Please try again'
    setInterval(() => {
      this.errorOpacity *= 0.95
      this.errorDiv.style.opacity = `${this.errorOpacity}`
    }, 100)
  }

  override update(summary: SessionSummary): void {
    super.update(summary)
    if (this.quiz.questionId === this.id) this.input.focus()
    const payVec = getPayVec(summary.treatment, 'high', [0, 3, 7])
    this.correctAnswer = Number(payVec[2].toFixed(2))
  }

  submit(): void {
    const answer = Number(this.input.value)
    console.log('answer', answer)
    console.log('correctAnswer', this.correctAnswer)
    if (answer === this.correctAnswer) {
      this.quiz.questionId += 1
    } else {
      this.error()
    }
  }

  error(): void {
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
