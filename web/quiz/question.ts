import type { SessionSummary } from '../../shared/summary.js'
import { el } from '../builder.js'
import type { Quiz } from './quiz.js'

export class Question {
  quiz: Quiz
  div: HTMLDivElement
  id: number

  constructor(quiz: Quiz, id: number) {
    this.quiz = quiz
    this.id = id
    this.div = el(this.quiz.div, 'div', { id: `questionDiv${this.id}`, className: 'questionDiv' })
    this.quiz.questions.push(this)
  }

  update(_summary: SessionSummary): void {
    const visible = this.quiz.questionId === this.id
    this.div.style.display = visible ? 'flex' : 'none'
  }
}
