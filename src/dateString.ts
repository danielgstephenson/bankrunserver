export function formatTwo(x: number): string {
  let y = x.toFixed(0)
  if (x < 10) y = '0' + y
  return y
}

export function getDateString(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = formatTwo(d.getMonth() + 1)
  const day = formatTwo(d.getDate())
  const hours = formatTwo(d.getHours())
  const minutes = formatTwo(d.getMinutes())
  const seconds = formatTwo(d.getSeconds())
  const dateString = year + '-' + month + '-' + day + '-' + hours + minutes + seconds
  return dateString
}
