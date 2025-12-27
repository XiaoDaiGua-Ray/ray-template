import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const r: AppRouteRecordRaw = {
  path: '/flow',
  component: () => import('@/views/demo/flow-demo'),
  meta: {
    i18nKey: t('menu.Flow'),
    icon: 'other',
    order: 2,
  },
}

export default r
