import type { AppRouteMeta, AppRouteRecordRaw } from '@/router/types'
import { joinRoutePath } from './join-route-path'

export const expandRoutes = (routes: AppRouteRecordRaw[]) => {
  const leaves: AppRouteRecordRaw[] = []

  const visit = (
    records: AppRouteRecordRaw[],
    parentPath = '',
    ancestors: AppRouteMeta[] = [],
  ) => {
    for (const record of records) {
      const path = joinRoutePath(parentPath, record.path)

      if (record.children?.length) {
        visit(record.children, path, [...ancestors, record.meta])
      } else {
        leaves.push({
          ...record,
          path,
          meta: {
            ...record.meta,
            ancestorRoles: ancestors.flatMap(({ role }) =>
              role?.length ? [role] : [],
            ),
          },
        } as AppRouteRecordRaw)
      }
    }
  }

  if (Array.isArray(routes)) visit(routes)

  return leaves
}
