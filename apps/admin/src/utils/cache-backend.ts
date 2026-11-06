/**
 *
 * @returns 生命周期仅限当前文档的独立 Storage 后端；保留插入顺序供 key(index) 枚举。
 */
const memoryStorage = (): Storage => {
  const entries = new Map<string, string>()

  return {
    get length() {
      return entries.size
    },
    key: (index) => Array.from(entries.keys())[index] ?? null,
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => {
      entries.set(key, value)
    },
    removeItem: (key) => {
      entries.delete(key)
    },
    clear: () => entries.clear(),
  }
}

let exampleStorage:
  { localStorage: Storage; sessionStorage: Storage } | undefined

/**
 *
 * @description
 * 将当前页面的两种缓存后端切换为独立内存实例；再次调用会清空此前的演示缓存。
 * 文档示例启动时调用，避免示例写入宿主应用的浏览器存储。
 */
export function useMemoryCache() {
  exampleStorage = {
    localStorage: memoryStorage(),
    sessionStorage: memoryStorage(),
  }
}

/**
 *
 * @param type 存储区域，默认 sessionStorage
 *
 * @returns 当前演示内存后端，或浏览器对应的 Storage 实例。
 *
 * @throws 未启用内存后端且浏览器拒绝访问存储时传播异常。
 */
export const getStorageInstance = (
  type: 'localStorage' | 'sessionStorage' = 'sessionStorage',
): Storage =>
  type === 'localStorage'
    ? (exampleStorage?.localStorage ?? window.localStorage)
    : (exampleStorage?.sessionStorage ?? window.sessionStorage)
