import type { SessionSummary } from '../../shared/summary.js'
import { el } from '../builder.js'
import type { Client } from '../client.js'
import type { Question } from './question.js'
import { Question1 } from './questions/question1.js'
import { Question2 } from './questions/question2.js'
import { Question3 } from './questions/question3.js'
import { Question4 } from './questions/question4.js'
import { Question5 } from './questions/question5.js'
import { Question6 } from './questions/question6.js'
import { QuizComplete } from './questions/quizComplete.js'

export class Quiz {
  client: Client
  div: HTMLDivElement
  questionId = 1
  questions: Question[] = []

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'quizDiv' })
    void new Question1(this)
    void new Question2(this)
    void new Question3(this)
    void new Question4(this)
    void new Question5(this)
    void new Question6(this)
    void new QuizComplete(this)
  }

  update(summary: SessionSummary): void {
    const visible = this.client.id !== '' && summary.state === 'quiz'
    this.div.style.display = visible ? 'flex' : 'none'
    this.questions.forEach(question => question.update(summary))
  }
}
