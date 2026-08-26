import type { Summary } from '../shared/summary.js'
import { Session } from './session.js'

export function summarize(session: Session): Summary {
  const summary = {
    token: session.token,
    state: session.state,
  }
  return summary
}
