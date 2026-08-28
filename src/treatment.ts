import type { Treatment } from '../client/shared/types.js'

const baseline: Treatment = {
  n: 10,
  lambda: 0.5,
  RH: 2.1,
  RL: 1,
  D: 1.04,
  pi: 0.2,
  theta: 0.7,
}

export const treatment1 = structuredClone(baseline)
treatment1.pi = 0.6
treatment1.theta = 0.7

export const treatment2 = structuredClone(baseline)
treatment2.pi = 0.2
treatment2.theta = 0.7

export const treatment3 = structuredClone(baseline)
treatment3.pi = 0.6
treatment3.theta = 0.4

export const treatment4 = structuredClone(baseline)
treatment4.pi = 0.2
treatment4.theta = 0.4
