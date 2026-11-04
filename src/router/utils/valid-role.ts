import { SUPER_ADMIN } from '@/app-config'
import type { AppRouteMeta } from '@/router/types'
import { piniaSigningStore } from '@/store'

export const validRole = (
  { role, ancestorRoles }: AppRouteMeta,
  currentRole?: string | number,
) => {
  if (!role?.length && !ancestorRoles?.length) return true

  const userRole = currentRole ?? piniaSigningStore().signingCallback.role

  return (
    SUPER_ADMIN.includes(userRole) ||
    ((!role?.length || role.includes(userRole)) &&
      (!ancestorRoles?.length ||
        ancestorRoles.every((roles) => roles.includes(userRole))))
  )
}
