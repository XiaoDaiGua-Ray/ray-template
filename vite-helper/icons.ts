import { normalizePath } from 'vite'
import type { Plugin } from 'vite'
import { generateIcons, iconsRoot, scanIcons } from '../scripts/icons.mjs'

export function iconManifestPlugin(
  registeredPackages = [
    ...new Set(scanIcons().map((name) => name.split('/')[0])),
  ],
): Plugin {
  let cleanup: (() => void) | undefined

  return {
    name: 'ray-icon-manifest',
    buildStart() {
      return generateIcons()
    },
    configureServer(server) {
      const packages = new Set(registeredPackages)
      let pending = Promise.resolve()
      let disposed = false
      let restarting = false
      const update = (file: string) => {
        if (
          !normalizePath(file).startsWith(`${normalizePath(iconsRoot)}/`) ||
          !file.endsWith('.svg')
        )
          return

        // 文件移动可能连续产生多个事件，按顺序生成，避免旧结果覆盖新清单。
        pending = pending
          .then(async () => {
            if (disposed) return

            const currentPackages = new Set(
              scanIcons().map((name) => name.split('/')[0]),
            )

            if (
              currentPackages.size !== packages.size ||
              [...currentPackages].some((name) => !packages.has(name))
            ) {
              // 新服务在 buildStart 生成清单，避免旧模块图先收到不完整的分包引用。
              if (!restarting) {
                restarting = true
                await server.restart()
                server.ws.send({ type: 'full-reload', path: '*' })
              }

              return
            }

            await generateIcons()
          })
          .catch((cause: unknown) => {
            const error =
              cause instanceof Error ? cause : new Error(String(cause))

            server.config.logger.error(error.message)
            server.ws.send({
              type: 'error',
              err: {
                message: error.message,
                stack: error.stack ?? '',
                plugin: 'ray-icon-manifest',
                id: file,
              },
            })
          })
      }

      cleanup = () => {
        disposed = true
        server.watcher
          .off('add', update)
          .off('change', update)
          .off('unlink', update)
      }
      server.watcher.add(iconsRoot)
      server.watcher.on('add', update).on('change', update).on('unlink', update)
      server.httpServer?.once('close', cleanup)
    },
    closeBundle() {
      cleanup?.()
    },
  }
}
