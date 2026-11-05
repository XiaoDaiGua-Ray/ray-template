export function createMockConnection(
  probe: () => Promise<boolean>,
  restart: () => Promise<void>,
) {
  let checking: Promise<void> | undefined

  return () => {
    checking ??= (async () => {
      if (await probe().catch(() => false)) return

      await restart()

      if (!(await probe().catch(() => false)))
        throw new Error('Mock connection could not be restored.')
    })().finally(() => {
      checking = void 0
    })

    return checking
  }
}
