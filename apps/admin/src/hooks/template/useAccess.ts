import { useSigningGetters } from '@/store'

export function useAccess() {
  const { getPermissions } = useSigningGetters()
  const hasPermission = (
    codes: string | readonly string[],
    mode: 'all' | 'any' = 'all',
  ) => {
    const required = typeof codes === 'string' ? [codes] : codes

    return mode === 'all'
      ? required.every((code) => getPermissions.value.includes(code))
      : required.some((code) => getPermissions.value.includes(code))
  }

  return { hasPermission, permissions: getPermissions }
}
