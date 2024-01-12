import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const mockDemo: AppRouteRecordRaw = {
  path: '/modal-demo',
  name: 'ModalDemo',
  component: () => import('@/views/demo/modal-demo/index'),
  meta: {
    i18nKey: t('menu.Modal'),
    icon: 'other',
    order: 3,
  },
}

export default mockDemo
