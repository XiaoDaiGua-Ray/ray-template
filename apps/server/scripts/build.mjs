import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { build, context } from 'esbuild'

const tests = process.argv.includes('--tests')
const watch = process.argv.includes('--watch')
const options = {
  absWorkingDir: fileURLToPath(new URL('../', import.meta.url)),
  entryPoints: tests
    ? {
        'unit.test': 'test/unit.test.ts',
        'integration.test': 'test/integration.test.ts',
        'platform.test': 'test/platform.test.ts',
      }
    : { main: 'src/main.ts', cli: 'src/cli.ts' },
  outdir: tests ? 'dist-test' : 'dist',
  outExtension: { '.js': '.mjs' },
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node26',
  packages: 'external',
  sourcemap: true,
  tsconfig: 'tsconfig.json',
  plugins: [
    {
      name: 'workspace-source',
      setup(builder) {
        // workspace 包导出源码；服务端产物内联这些入口，运行时只加载 npm 依赖。
        builder.onResolve({ filter: /^@ray-template\// }, (args) => ({
          path: fileURLToPath(import.meta.resolve(args.path)),
          external: false,
        }))
      },
    },
  ],
}

if (watch) {
  let child
  let stopping = false
  const stopChild = async () => {
    const running = child

    child = void 0

    if (!running || running.exitCode !== null || running.signalCode !== null)
      return

    await new Promise((resolve) => {
      const timeout = setTimeout(() => running.kill('SIGKILL'), 5000)

      running.once('exit', () => {
        clearTimeout(timeout)
        resolve()
      })
      running.kill('SIGTERM')
    })
  }

  options.plugins.push({
    name: 'restart-server',
    setup(builder) {
      builder.onEnd(async (result) => {
        if (result.errors.length || stopping) return

        await stopChild()

        if (stopping) return

        const running = spawn(process.execPath, ['dist/main.mjs'], {
          cwd: options.absWorkingDir,
          stdio: 'inherit',
          env: process.env,
        })

        child = running
        const failed = (code) => {
          if (child === running && !stopping) {
            process.exitCode = code || 1
            void close()
          }
        }

        running.once('error', () => failed(1))
        running.once('exit', failed)
      })
    },
  })
  const watcher = await context(options)
  const close = async () => {
    if (stopping) return

    stopping = true
    await watcher.dispose()
    await stopChild()
  }

  process.once('SIGINT', () => void close())
  process.once('SIGTERM', () => void close())
  await watcher.watch()
} else {
  await build(options)
}
