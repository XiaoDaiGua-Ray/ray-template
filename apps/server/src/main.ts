import { createApp } from './app'
import { loadServerConfig, standardLogSink, writeLog } from './platform/index'

try {
  const config = loadServerConfig()
  const app = await createApp(config)

  try {
    app.enableShutdownHooks()
    await app.listen(config.port, config.host)
  } catch (error) {
    await app.close()
    throw error
  }

  writeLog(standardLogSink, 'info', 'server.started')
} catch (error) {
  writeLog(standardLogSink, 'error', 'server.start_failed', {
    code: error instanceof Error ? error.name : 'UnknownError',
  })
  process.exitCode = 1
}
