import { join } from 'node:path'
import { Session } from './session.js'

const dataDir = join(import.meta.dirname, '..', '..', '..', 'data', 'BankRun')
const session = new Session(dataDir)

try {
  const port = 3000
  await session.listen(port)
  console.log(`listening on http://localhost:${port}`)
} catch (err) {
  console.error(err)
  process.exit(1)
}
