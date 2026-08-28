import type { Treatment } from './treatment.js'

export interface ParticipantSummary {
  id: string
  game: number
  ready: boolean
  action: number
  informed: boolean
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
  payVec: number[]
}
