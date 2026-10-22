import { el } from '../../builder.js'
import { Question } from '../question.js'
import type { Quiz } from '../quiz.js'

export class QuizComplete extends Question {
  constructor(quiz: Quiz) {
    super(quiz, 7)
    const textBox = el(this.div, 'div')
    textBox.innerHTML = 'You have now completed the quiz. <br> Please wait for everyone else to complete it.'
  }
}
