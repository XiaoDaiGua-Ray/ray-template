import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const r: AppRouteRecordRaw = {
  path: '/table-pro',
  component: () => import('@/views/demo/table-pro-demo'),
  meta: {
    i18nKey: t('menu.TablePro'),
    icon: 'other',
    order: 2,
    extra: {
      label: 'TablePro',
    },
  },
}

export default r
