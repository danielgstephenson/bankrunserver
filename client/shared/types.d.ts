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
  game: number
  hold: boolean
  action: number
  inform: boolean
  joined: boolean
}

export interface SessionSummary {
  token: string
  state: string
  treatment: Treatment
  period: number
  stage: number
  participants: ParticipantSummary[]
  games: GameSummary[]
}

export interface GameSummary {
  id: number
  quality: string
  period: number
  stage: number
  payVec: number[]
}
