export function createStorage(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
  prefix = '',
) {
  return {
    get(key: string): unknown {
      try {
        return JSON.parse(storage.getItem(prefix + key) ?? 'null')
      } catch {
        return null
      }
    },
    set(key: string, value: unknown) {
      try {
        storage.setItem(prefix + key, JSON.stringify(value))
      } catch {
        // 存储不可用时保留当前实例的状态。
      }
    },
    remove(key: string) {
      try {
        storage.removeItem(prefix + key)
      } catch {
        // 存储不可用时保留当前实例的状态。
      }
    },
  }
}
