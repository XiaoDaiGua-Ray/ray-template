import { DEFAULT_HOME_PATH, NOT_FOUND_ROUTE_PATH } from '@/router/constant'
import type { Router } from 'vue-router'
import { validRole } from './valid-role'

export function resolveLandingPath(router: Router, preferredPath: string) {
  const home = router.resolve(preferredPath)
  const record = home.matched.at(-1)

  if (
    home.path === '/' ||
    !record ||
    record.path === NOT_FOUND_ROUTE_PATH ||
    record.redirect ||
    (home.path !== DEFAULT_HOME_PATH && !validRole(home.meta))
  )
    return DEFAULT_HOME_PATH

  return home.fullPath
}
