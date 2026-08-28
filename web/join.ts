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
    this.input = el(this.div, 'input', { id: 'idInput', type: 'text' })
    this.input.focus()
    this.input.addEventListener('keydown', event => {
      if (event.key !== 'Enter') return
      this.onButtonClick()
    })
    this.button = el(this.div, 'button', { id: 'joinButton', textContent: 'Join'})
    this.button.addEventListener('click', _ => this.onButtonClick())
    this.errorDiv = el(this.div, 'div', { id: 'joinErrorDiv' })
    setInterval(() => {
      this.errorOpacity *= 0.95
      this.errorDiv.style.opacity = `${this.errorOpacity}`
    }, 100)
    this.client.socket.on('invalid id', () => {
      this.error('Invalid ID')
    })
    this.checkURLParams()
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

  checkURLParams(): void {
    const id = new URLSearchParams(location.search).get('id')
    if (id == null) return
    this.client.socket.emit('join', id)
  }

  error(msg: string): void {
    this.errorDiv.textContent = msg
    this.errorOpacity = 1
    this.errorDiv.style.opacity = `${this.errorOpacity}`
  }
}
