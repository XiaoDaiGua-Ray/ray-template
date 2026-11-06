import { createRouteParser } from '@ray-template/api-contracts/route-validation'
import { isIconName, replaceRetiredIconName } from '@ray-template/icons'
import type { RouteConfig, RouteConfigRecord } from './schema'
import type { AppRouteRecordRaw } from './types'

export interface RouteCatalog {
  layout: AppRouteRecordRaw['component']
  findRouteView(
    id: string,
  ):
    | { name: string; load: NonNullable<AppRouteRecordRaw['component']> }
    | undefined
  findRouteViewId(loader: unknown): string | undefined
  viewPermission?(id: string): string | undefined
  /**
   *
   * @deprecated 首页不再具有路由校验或默认导航特权，保留字段仅兼容旧调用方。
   */
  homePath?: string
  managementPath: string
  reservedPaths?: readonly string[]
  reservedNames?: readonly string[]
}

export function createRouteContract(catalog: RouteCatalog) {
  const { layout: LAYOUT, findRouteView, findRouteViewId } = catalog
  const parseRouteConfig = createRouteParser({
    ...catalog,
    isIconName,
    normalizeIcon: replaceRetiredIconName,
  })

  function toRuntimeRoutes(config: RouteConfig): AppRouteRecordRaw[] {
    const toRoute = ({
      component,
      children,
      meta,
      ...record
    }: RouteConfigRecord): AppRouteRecordRaw => {
      const requiredPermission =
        component && catalog.viewPermission?.(component)

      return {
        ...record,
        meta: {
          ...meta,
          ...(requiredPermission ? { requiredPermission } : {}),
        } as AppRouteRecordRaw['meta'],
        component:
          component === 'layout'
            ? LAYOUT
            : component
              ? findRouteView(component)?.load
              : void 0,
        children: children?.map(toRoute),
      } as AppRouteRecordRaw
    }

    return config.routes.map(toRoute)
  }

  function exportRouteConfig(routes: AppRouteRecordRaw[]): RouteConfig {
    const toRecord = ({
      path,
      name,
      meta: { requiredPermission: _permission, ...meta },
      component,
      children,
      props,
      alias,
      redirect,
    }: AppRouteRecordRaw): RouteConfigRecord => {
      const id = component === LAYOUT ? 'layout' : findRouteViewId(component)

      if (component && !id)
        throw new Error(
          `${path}: Register the view in router/config/views.ts before exporting.`,
        )

      if (redirect && typeof redirect !== 'string')
        throw new Error(`${path}: Export requires a string redirect.`)

      return {
        path,
        name,
        meta: meta as RouteConfigRecord['meta'],
        component: id,
        alias,
        redirect,
        props,
        children: children?.map(toRecord),
      }
    }

    return parseRouteConfig(
      JSON.stringify({ version: 1, routes: routes.map(toRecord) }),
    )
  }

  return { parseRouteConfig, toRuntimeRoutes, exportRouteConfig }
}
