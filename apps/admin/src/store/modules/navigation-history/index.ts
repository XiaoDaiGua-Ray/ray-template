import { APP_CATCH_KEY } from '@/app-config'
import { getStorageInstance } from '@/utils/cache-backend'
import { piniaSigningStore } from '../signing'

const validPath = (value: unknown): value is string =>
  typeof value === 'string' &&
  value.startsWith('/') &&
  !value.startsWith('//') &&
  value.length <= 512 &&
  !/[?#:]/u.test(value)

const readPaths = (value: unknown, limit: number): string[] =>
  Array.isArray(value)
    ? [...new Set(value.filter(validPath))].slice(0, limit)
    : []

export const piniaNavigationHistoryStore = defineStore(
  'navigation-history',
  () => {
    const signing = piniaSigningStore()
    const recentPaths = ref<string[]>([])
    const favoritePaths = ref<string[]>([])
    const storageUnavailable = ref(false)
    const account = computed(
      () => signing.signingCallback.id || signing.signingCallback.name || '',
    )
    const cacheKey = () =>
      `${APP_CATCH_KEY.appGlobalSearchOptions}:v1:${encodeURIComponent(account.value)}`

    watch(
      account,
      () => {
        recentPaths.value = []
        favoritePaths.value = []
        storageUnavailable.value = false

        if (!account.value) return

        try {
          const raw = getStorageInstance('localStorage').getItem(cacheKey())
          const value: unknown = raw === null ? null : JSON.parse(raw)

          if (
            value &&
            typeof value === 'object' &&
            'version' in value &&
            value.version === 1
          ) {
            recentPaths.value = readPaths(
              'recent' in value ? value.recent : null,
              10,
            )
            favoritePaths.value = readPaths(
              'favorites' in value ? value.favorites : null,
              300,
            )
          }
        } catch {
          storageUnavailable.value = true
        }
      },
      { immediate: true, flush: 'sync' },
    )

    const persist = () => {
      if (!account.value) return

      try {
        getStorageInstance('localStorage').setItem(
          cacheKey(),
          JSON.stringify({
            version: 1,
            recent: recentPaths.value,
            favorites: favoritePaths.value,
          }),
        )
        storageUnavailable.value = false
      } catch {
        storageUnavailable.value = true
      }
    }

    const recordVisit = (path: string) => {
      if (!account.value || !validPath(path) || recentPaths.value[0] === path)
        return

      recentPaths.value = [
        path,
        ...recentPaths.value.filter((item) => item !== path),
      ].slice(0, 10)
      persist()
    }

    const toggleFavorite = (path: string) => {
      if (!account.value || !validPath(path)) return

      favoritePaths.value = favoritePaths.value.includes(path)
        ? favoritePaths.value.filter((item) => item !== path)
        : [...favoritePaths.value, path].slice(0, 300)
      persist()
    }

    const clearRecent = () => {
      recentPaths.value = []
      persist()
    }

    return {
      recentPaths,
      favoritePaths,
      storageUnavailable,
      recordVisit,
      toggleFavorite,
      clearRecent,
    }
  },
)
