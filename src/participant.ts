import type { ParticipantSummary } from '../shared/summary.js'
import type { IOSocket } from './server.js'
import type { Session } from './session.js'

export class Participant {
  session: Session
  socket?: IOSocket
  id: string
  game = 0
  ready = false
  informed = false
  action = 3

  constructor(session: Session, id: string) {
    this.session = session
    this.id = id
    this.session.participants.set(id, this)
  }

  summarize(): ParticipantSummary {
    return {
      id: this.id,
      game: this.game,
      informed: this.informed,
      ready: this.ready,
      action: this.action,
      joined: this.socket != null,
    }
  }
}
