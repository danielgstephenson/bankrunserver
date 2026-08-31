export function range(a: number, b?: number): number[] {
  if (b == null) return [...Array(a).keys()]
  return [...Array(b - a + 1).keys()].map(i => a + i)
}

export function shuffle<T>(array: T[]): T[] {
  return array
    .map(item => ({ value: item, priority: Math.random() }))
    .sort((a, b) => a.priority - b.priority)
    .map(x => x.value)
}

export function sum(array: number[]): number {
  let total = 0
  array.forEach(x => {
    total = total + x
  })
  return total
}

export function mean(array: number[]): number {
  if (array.length === 0) return 0
  return sum(array) / array.length
}
