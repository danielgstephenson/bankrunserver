import { app, BrowserWindow, dialog } from 'electron'
import { Session } from '../session.js'
import { dirname, join } from 'node:path'
import { existsSync } from 'node:fs'

const PORT = 3000

function errorCode(err: unknown): string | undefined {
  return err instanceof Error && 'code' in err && typeof err.code === 'string' ? err.code : undefined
}

function getDataRoot(): string {
  const portableDir = process.env.PORTABLE_EXECUTABLE_DIR
  if (portableDir !== undefined) return join(portableDir, 'data')
  const appRoot = app.isPackaged ? dirname(app.getPath('exe')) : app.getAppPath()
  return join(appRoot, '..', 'data')
}

async function main(): Promise<void> {
  const session = new Session(join(getDataRoot(), 'BankRun'))
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
}

void app
  .whenReady()
  .then(main)
  .catch(err => {
    dialog.showErrorBox('Startup failed', String(err))
    app.quit()
  })

app.on('window-all-closed', () => {
  app.quit()
})
