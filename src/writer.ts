import { existsSync, mkdirSync, openSync, writeSync } from 'node:fs'
import { mkdir, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import type { Session } from './session.js'

export async function writeAtomic(dir: string, name: string, contents: string): Promise<string> {
  await mkdir(dir, { recursive: true })
  const target = join(dir, name)
  const tmp = `${target}.tmp`
  await writeFile(tmp, contents, 'utf8')
  await rename(tmp, target)
  return target
}

export async function writeJson(dir: string, name: string, data: unknown): Promise<string> {
  return writeAtomic(dir, name, `${JSON.stringify(data, null, 2)}\n`)
}

export type Row = Record<string, string | number | boolean | null | undefined>

function csvField(value: Row[string]): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : ''
  if (typeof value === 'boolean') return value ? '1' : '0'
  return /[",\r\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
}

class CsvWriter {
  readonly fd: number
  readonly columns: readonly string[]
  readonly session: Session
  constructor(session: Session, fileName: string, columns: readonly string[]) {
    this.session = session
    const path = join(session.dataDir, fileName)
    mkdirSync(dirname(path), { recursive: true })
    const fresh = !existsSync(path)
    this.fd = openSync(path, 'a')
    this.columns = columns
    if (fresh) writeSync(this.fd, `${columns.join(',')}\r\n`)
  }
  append(row: Row): void {
    writeSync(this.fd, `${this.columns.map(c => csvField(row[c])).join(',')}\r\n`)
  }
}

export class DecisionWriter extends CsvWriter {
  constructor(session: Session) {
    const fileName = `${session.dateString}-decisions.csv`
    const columns = ['date', 'period', 'quality', 'game', 'id', 'informed', 'action', 'payoff', 'pay1', 'pay2', 'pay3']
    super(session, fileName, columns)
  }
  write(): void {
    this.session.participants.forEach(participant => {
      const game = this.session.games[participant.game]
      const row = {
        date: this.session.dateString,
        period: this.session.period,
        quality: this.session.quality,
        game: participant.game,
        id: participant.id,
        informed: participant.informed,
        action: participant.action,
        payoff: game.payVec[participant.action],
        pay1: game.payVec[0],
        pay2: game.payVec[1],
        pay3: game.payVec[2],
      }
      this.append(row)
    })
  }
}
