import type { ParticipantSummary } from '../shared/types.js'
import type { IOSocket } from './server.js'
import type { Session } from './session.js'

export class Participant {
  session: Session
  socket?: IOSocket
  id: string
  hold = true
  inform = true
  action = 3

  constructor(session: Session, id: string) {
    this.session = session
    this.id = id
    this.session.participants.set(id, this)
  }

  summarize(): ParticipantSummary {
    return {
      id: this.id,
      inform: this.inform,
      hold: this.hold,
      action: this.action,
    }
  }
}
