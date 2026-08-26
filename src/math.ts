export function range(a: number, b?: number): number[] {
  if (b == null) return [...Array(a).keys()]
  return [...Array(b - a + 1).keys()].map(i => a + i)
}
