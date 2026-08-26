export type Treatment = {
  n: number
  lambda: number
  RL: number
  RH: number
  D: number
  pi: number
  theta: number
}

export const getTreatment = (): Treatment => ({
  n: 10,
  lambda: 0.5,
  RH: 2.1,
  RL: 1,
  D: 1.04,
  pi: 0.4,
  theta: 0.5,
})
