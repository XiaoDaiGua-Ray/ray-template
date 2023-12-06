import { t } from '@/hooks/web'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const mockDemo: AppRouteRecordRaw = {
  path: '/mock-demo',
  name: 'MockDemo',
  component: () => import('@/views/demo/mock-demo/index'),
  meta: {
    i18nKey: t('menu.Mock'),
    icon: 'other',
    order: 3,
    keepAlive: true,
  },
}

export default mockDemo
