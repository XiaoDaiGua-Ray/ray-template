import { t } from '@/locales/useI18n'
import { LAYOUT } from '@/router/constant/index'

import type { AppRouteRecordRaw } from '@/router/type'

const docLocal: AppRouteRecordRaw = {
  path: '/doc',
  name: 'RDocLocal',
  component: () => import('@/views/doc/index'),
  meta: {
    i18nKey: t('menu.DocLocal'),
    icon: 'doc',
    windowOpen: 'https://ray-template.yunkuangao.com/ray-template-doc/',
    order: 6,
  },
}

export default docLocal
