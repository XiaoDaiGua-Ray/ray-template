import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

const echart: AppRouteRecordRaw = {
  path: '/echart',
  name: 'Echart',
  component: () => import('@/views/echart/index'),
  meta: {
    i18nKey: t('menu.Echart'),
    icon: 'echart',
    order: 1,
  },
}

export default echart
