import { APP_CATCH_KEY } from '@/app-config'
import { piniaNavigationHistoryStore } from '@/store/modules/navigation-history'
import { piniaSigningStore } from '@/store/modules/signing'
import { createPinia, disposePinia, setActivePinia } from 'pinia'

let pinia: ReturnType<typeof createPinia>

beforeEach(() => {
  localStorage.clear()
  pinia = createPinia()
  setActivePinia(pinia)
})
afterEach(() => {
  disposePinia(pinia)
  localStorage.clear()
})
const account = (id: string) => {
  piniaSigningStore().signingCallback = { id, name: id, role: 'admin' }
}

it('restores recent pages in order, deduplicates them and clears history independently of favorites', () => {
  account('one')
  const store = piniaNavigationHistoryStore()

  for (let index = 0; index < 15; index++) store.recordVisit(`/page-${index}`)

  store.recordVisit('/page-10')
  store.toggleFavorite('/page-10')
  expect(store.recentPaths).toHaveLength(10)
  expect(store.recentPaths[0]).toBe('/page-10')
  disposePinia(pinia)
  pinia = createPinia()
  setActivePinia(pinia)
  account('one')
  const restored = piniaNavigationHistoryStore()

  expect(restored.recentPaths[0]).toBe('/page-10')
  expect(restored.favoritePaths).toEqual(['/page-10'])
  restored.clearRecent()
  expect(restored.recentPaths).toEqual([])
  expect(restored.favoritePaths).toEqual(['/page-10'])
})

it('isolates accounts and restores each account without storing titles or URL parameters', () => {
  account('one')
  const store = piniaNavigationHistoryStore()

  store.recordVisit('/system/users')
  store.recordVisit('/search?private=value')
  store.toggleFavorite('/system/users')
  account('two')
  expect(store.recentPaths).toEqual([])
  expect(store.favoritePaths).toEqual([])
  store.toggleFavorite('/dashboard')
  account('one')
  expect(store.favoritePaths).toEqual(['/system/users'])
  expect(
    JSON.parse(
      localStorage.getItem(`${APP_CATCH_KEY.appGlobalSearchOptions}:v1:one`)!,
    ),
  ).toEqual({
    version: 1,
    recent: ['/system/users'],
    favorites: ['/system/users'],
  })
  account('')
  expect(store.favoritePaths).toEqual([])
})

it('recovers from malformed cached data and filters external or parameterized paths', () => {
  localStorage.setItem(
    `${APP_CATCH_KEY.appGlobalSearchOptions}:v1:one`,
    JSON.stringify({
      version: 1,
      recent: ['/ok', '//example.com', '/:id', '/ok', 42],
      favorites: 'invalid',
    }),
  )
  account('one')
  const store = piniaNavigationHistoryStore()

  expect(store.recentPaths).toEqual(['/ok'])
  expect(store.favoritePaths).toEqual([])
  store.toggleFavorite('https://example.com')
  expect(store.favoritePaths).toEqual([])
})
