import { piniaNavigationHistoryStore } from '../modules/navigation-history'

export const useNavigationHistoryGetters = () => {
  const store = piniaNavigationHistoryStore()

  return {
    recentPaths: computed(() => store.recentPaths),
    favoritePaths: computed(() => store.favoritePaths),
    storageUnavailable: computed(() => store.storageUnavailable),
  }
}

export const useNavigationHistoryActions = () => {
  const { recordVisit, toggleFavorite, clearRecent } =
    piniaNavigationHistoryStore()

  return { recordVisit, toggleFavorite, clearRecent }
}
