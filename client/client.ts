import { Instructions } from './instructions.js'
import { Join } from './join.js'
import { io } from '/socket.io/socket.io.esm.min.js'

export class Client {
  socket = io()
  join = new Join(this)
  instructions = new Instructions(this)
  id = ''

  constructor() {
    this.socket.on('connect', () => {
      console.log('connected', this.socket.id)
    })
  }
}
