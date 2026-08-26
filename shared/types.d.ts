export type Treatment = {
  n: number
  lambda: number
  RL: number
  RH: number
  D: number
  pi: number
  theta: number
}

export interface ParticipantSummary {
  id: string
  hold: boolean
  action: number
  inform: boolean
}

export interface SessionSummary {
  token: string
  state: string
  treatment: Treatment
  period: number
  stage: number
  participants: ParticipantSummary[]
}
