import { getAdminRoutes, updateAdminRoutes } from '@/api/admin'
import { apiUrl } from '@/api/admin/client'
import { APP_CATCH_KEY } from '@/app-config'
import type { RouteConfig } from './schema'

export type RouteSource = 'static' | 'local' | 'remote'

interface Preference {
  source: RouteSource
  local?: RouteConfig
}

const storageKey = 'rayRouteConfig.v1'

export const remoteRouteUrl =
  import.meta.env.VITE_ROUTE_CONFIG_URL?.trim() || apiUrl('admin/route-config')

function readPreference(): Preference {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(storageKey) ?? 'null',
    )

    if (
      stored &&
      typeof stored === 'object' &&
      'source' in stored &&
      (stored.source === 'static' ||
        stored.source === 'local' ||
        stored.source === 'remote')
    ) {
      return stored as Preference
    }
  } catch {
    // 损坏的浏览器偏好回退到部署默认值。
  }

  return { source: remoteRouteUrl ? 'remote' : 'static' }
}

const preference = readPreference()

export const routeSourceStatus: {
  requested: RouteSource
  active: RouteSource
  error?: string
  config?: RouteConfig
} = { requested: preference.source, active: 'static' }

export async function fetchRemoteRouteConfig(): Promise<RouteConfig> {
  if (!import.meta.env.VITE_ROUTE_CONFIG_URL?.trim()) {
    const { parseRouteConfig } = await import('./contract')

    return parseRouteConfig(JSON.stringify(await getAdminRoutes()))
  }

  if (!remoteRouteUrl) throw new Error('VITE_ROUTE_CONFIG_URL is missing.')

  const url = new URL(remoteRouteUrl, document.baseURI)

  if (url.origin !== location.origin && url.protocol !== 'https:') {
    throw new Error('The route endpoint must be same-origin or HTTPS.')
  }

  const { parseRouteConfig } = await import('./contract')
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(5000),
    cache: 'no-cache',
    redirect: 'error',
    credentials: 'same-origin',
  })

  if (!response.ok)
    throw new Error(`Route endpoint returned HTTP ${response.status}.`)

  return parseRouteConfig(await response.text())
}

export async function saveRemoteRouteConfig(config: RouteConfig) {
  if (import.meta.env.VITE_ROUTE_CONFIG_URL?.trim())
    throw new Error(
      'VITE_ROUTE_CONFIG_URL is a read-only legacy endpoint. Configure VITE_API_BASE_URL for route writes.',
    )

  await updateAdminRoutes(config)
  saveRouteSource('remote')
}

export async function loadRouteConfig(): Promise<RouteConfig | undefined> {
  if (preference.source === 'static') return

  try {
    const config =
      preference.source === 'remote'
        ? await fetchRemoteRouteConfig()
        : (await import('./contract')).parseRouteConfig(
            JSON.stringify(preference.local ?? null),
          )

    routeSourceStatus.active = preference.source
    routeSourceStatus.config = config

    return config
  } catch (error) {
    routeSourceStatus.error =
      error instanceof Error ? error.message : String(error)
  }
}

export function saveRouteSource(source: RouteSource, local = preference.local) {
  localStorage.setItem(storageKey, JSON.stringify({ source, local }))
  sessionStorage.removeItem(APP_CATCH_KEY.appMenuTagOptions)
  sessionStorage.removeItem(APP_CATCH_KEY.appMenuKey)
  sessionStorage.removeItem(APP_CATCH_KEY.appPiniaKeepAliveStore)
  location.reload()
}
