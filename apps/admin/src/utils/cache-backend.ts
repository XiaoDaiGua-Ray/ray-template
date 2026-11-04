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

export function useMemoryCache() {
  exampleStorage = {
    localStorage: memoryStorage(),
    sessionStorage: memoryStorage(),
  }
}

export const getStorageInstance = (
  type: 'localStorage' | 'sessionStorage' = 'sessionStorage',
): Storage =>
  type === 'localStorage'
    ? (exampleStorage?.localStorage ?? window.localStorage)
    : (exampleStorage?.sessionStorage ?? window.sessionStorage)
