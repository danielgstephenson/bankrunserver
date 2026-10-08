export type Treatment = {
  id: number
  lambda: number
  RL: number
  RH: number
  D: number
  pi: number
  theta: number
}

const baseline: Treatment = {
  id: 1,
  lambda: 0.75,
  RH: 28,
  D: 12,
  RL: 10,
  pi: 0.1,
  theta: 0.5,
}

export const treatment1 = structuredClone(baseline)
treatment1.id = 1
treatment1.pi = 0.1
treatment1.theta = 0.5

export const treatment2 = structuredClone(baseline)
treatment2.id = 2
treatment2.pi = 0.4
treatment2.theta = 0.5

export const treatment3 = structuredClone(baseline)
treatment3.id = 3
treatment3.pi = 0.1
treatment3.theta = 0.8

export const treatment4 = structuredClone(baseline)
treatment4.id = 4
treatment4.pi = 0.4
treatment4.theta = 0.8

export const treatments = [treatment1, treatment2, treatment3, treatment4]
