import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const directive: AppRouteRecordRaw = {
  path: '/directive',
  component: () => import('@/views/demo/directive/index'),
  meta: {
    i18nKey: t('menu.Directive'),
    icon: 'other',
    order: 2,
    extra: {
      label: 'ellipsis',
    },
  },
}

export default directive
