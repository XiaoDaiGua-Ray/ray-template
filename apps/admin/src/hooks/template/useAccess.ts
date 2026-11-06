import { useSigningGetters } from '@/store'

/**
 *
 * @description
 * 读取当前会话的权限；集合随权限列表更新，并复用于同一实例的多次判断。
 *
 * @returns 只读权限列表及权限匹配方法；界面检查不能替代服务端授权。
 */
export function useAccess() {
  const { getPermissions } = useSigningGetters()
  const permissionSet = computed(() => new Set(getPermissions.value))

  /**
   *
   * @param codes 单个权限码或权限码列表
   * @param mode all 要求全部匹配，any 要求至少匹配一个
   *
   * @returns 是否满足要求；空列表在 all 模式下为 true，在 any 模式下为 false。
   */
  const hasPermission = (
    codes: string | readonly string[],
    mode: 'all' | 'any' = 'all',
  ) => {
    const permissions = permissionSet.value

    if (typeof codes === 'string') return permissions.has(codes)

    return mode === 'all'
      ? codes.every((code) => permissions.has(code))
      : codes.some((code) => permissions.has(code))
  }

  return { hasPermission, permissions: getPermissions }
}
