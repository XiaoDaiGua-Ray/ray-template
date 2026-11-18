import { AdminApiError, apiMockEnabled } from '@/api/admin/client'
import { useI18n } from '@/hooks'

export function useUserErrorMessage() {
  const { t, te } = useI18n('userManagement')

  return (reason: unknown) => {
    const key = reason instanceof AdminApiError ? reason.key : 'requestFailed'
    const message = key === 'storage' && !apiMockEnabled ? 'serverStorage' : key

    return t(
      te?.(`userManagement.errors.${message}`)
        ? `errors.${message}`
        : 'errors.requestFailed',
    )
  }
}
