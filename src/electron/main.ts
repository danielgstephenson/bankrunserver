import { app, BrowserWindow, dialog } from 'electron'
import { Session } from '../session.js'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const PORT = 3000

function errorCode(err: unknown): string | undefined {
  return err instanceof Error && 'code' in err && typeof err.code === 'string' ? err.code : undefined
}

void app.whenReady().then(async () => {
  const appRoot = app.isPackaged ? dirname(app.getPath('exe')) : app.getAppPath()
  const session = new Session(join(appRoot, '..', 'data', 'BankRun'))

  try {
    await session.listen(PORT)
  } catch (err) {
    const message = errorCode(err) === 'EADDRINUSE' ? `Port ${PORT} is already in use. Is the experiment already running?` : String(err)
    dialog.showErrorBox('Cannot start the server', message)
    app.quit()
    return
  }

  const iconPath = join(import.meta.dirname, '..', '..', '..', 'public', 'circle.ico')
  if (!existsSync(iconPath)) console.warn(`icon not found: ${iconPath}`)

  const win = new BrowserWindow({
    width: 600,
    height: 400,
    icon: iconPath,
  })
  await win.loadURL(`http://localhost:${PORT}/manager/`)
})

app.on('window-all-closed', () => {
  app.quit()
})
