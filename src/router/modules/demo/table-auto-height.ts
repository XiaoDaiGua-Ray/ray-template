import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const axios: AppRouteRecordRaw = {
  path: '/table-auto-height',
  name: 'RTableAutoHeight',
  component: () => import('@/views/demo/table-auto-height'),
  meta: {
    i18nKey: t('menu.TableAutoHeight'),
    icon: 'other',
    order: 3,
    extra: {
      label: 'new',
    },
  },
}

export default axios
