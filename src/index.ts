import { Session } from './session.js'

export const session = new Session()

try {
  const port = 3000
  await session.listen(port)
  console.log(`listening on http://localhost:${port}`)
} catch (err) {
  console.error(err)
  process.exit(1)
}
