import { app, BrowserWindow, dialog } from 'electron'
import { Session } from '../session.js'
import { join } from 'node:path'

const PORT = 3000

function errorCode(err: unknown): string | undefined {
  return err instanceof Error && 'code' in err && typeof err.code === 'string'
    ? err.code
    : undefined
}

void app.whenReady().then(async () => {
  const session = new Session()

  try {
    await session.listen(PORT)
  } catch (err) {
    const message =
      errorCode(err) === 'EADDRINUSE'
        ? `Port ${PORT} is already in use. Is the experiment already running?`
        : String(err)
    dialog.showErrorBox('Cannot start the server', message)
    app.quit()
    return
  }

  const win = new BrowserWindow({ 
    width: 1200, 
    height: 800,
    icon: join(import.meta.dirname, '..', '..', 'public', 'circle.ico')
  })
  await win.loadURL(`http://localhost:${PORT}/manager/`)
})

app.on('window-all-closed', () => {
  app.quit()
})
