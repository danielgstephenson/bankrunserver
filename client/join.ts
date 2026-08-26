import { el } from './builder.js'
import type { Client } from './client.js'

export class Join {
  client: Client
  div: HTMLDivElement
  input: HTMLInputElement
  button: HTMLButtonElement
  errorDiv: HTMLDivElement
  errorOpacity = 0

  constructor(client: Client) {
    this.client = client
    this.div = el(document.body, 'div', { id: 'joinDiv' })
    this.input = el(this.div, 'input', { id: 'idInput' })
    this.input.type = 'text'
    this.input.focus()
    this.input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return
      this.onButtonClick()
    })
    this.button = el(this.div, 'button', { id: 'joinButton' })
    this.button.textContent = 'Join'
    this.button.addEventListener('click', _ => this.onButtonClick())
    this.errorDiv = el(this.div, 'div', { id: 'joinErrorDiv' })
    setInterval(() => {
      this.errorOpacity *= 0.95
      this.errorDiv.style.opacity = `${this.errorOpacity}`
    }, 100)
    this.client.socket.on('invalid id', () => {
      this.error('Invalid ID')
    })
    this.client.socket.on('joined', (id: string) => {
      this.client.id = id
      this.div.style.display = 'none'
      this.client.instructions.div.style.display = 'flex'
      console.log('joined', id)
    })
  }

  onButtonClick(): void {
    const id = this.input.value
    if (id === '') {
      this.error('Missing ID')
      return
    }
    this.error('')
    this.client.socket.emit('join', id)
  }

  setupInput(): void {}

  error(msg: string): void {
    this.errorDiv.textContent = msg
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
