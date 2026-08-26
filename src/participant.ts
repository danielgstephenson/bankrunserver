import type { IOSocket } from './server.js'
import type { Session } from './session.js'

export class Participant {
  session: Session
  socket?: IOSocket
  id: string

  constructor(session: Session, id: string) {
    this.session = session
    this.id = id
    this.session.participants.set(id, this)
  }
}
