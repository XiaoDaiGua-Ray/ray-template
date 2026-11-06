/**
 *
 * @param storage 由宿主提供的同步存储后端
 * @param prefix 直接拼接在每个键前的命名空间
 *
 * @description
 * 使用 JSON 读写；不缓存副本，读取始终反映存储后端的当前值。
 *
 * @returns 不向调用方抛出存储异常的读取、写入和删除方法。
 */
export function createStorage(
  storage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
  prefix = '',
) {
  return {
    /**
     *
     * @param key 未加前缀的键
     *
     * @returns 解析后的 JSON；缺键、内容损坏或存储不可读时返回 null。
     */
    get(key: string): unknown {
      try {
        return JSON.parse(storage.getItem(prefix + key) ?? 'null')
      } catch {
        return null
      }
    },
    /**
     *
     * @param key 未加前缀的键
     * @param value 可序列化为 JSON 的值
     *
     * @description
     * 序列化成功后再写入；无法序列化或存储拒绝写入时保留已有值。
     */
    set(key: string, value: unknown) {
      try {
        const serialized = JSON.stringify(value)

        if (serialized !== void 0) storage.setItem(prefix + key, serialized)
      } catch {
        // 不覆盖调用方的内存状态，也不删除此前保存的值。
      }
    },
    /**
     *
     * @param key 未加前缀的键
     *
     * @description
     * 删除对应键；存储后端拒绝操作时忽略异常。
     */
    remove(key: string) {
      try {
        storage.removeItem(prefix + key)
      } catch {
        // 删除失败时仍允许界面继续使用当前状态。
      }
    },
  }
}
