import { t } from '@/hooks'
import { LAYOUT } from '@/router/constant'

import type { AppRouteRecordRaw } from '@/router/type'

const previewSVGIcons: AppRouteRecordRaw = {
  path: '/svg-icons',
  name: 'PreviewSVGIcons',
  component: () => import('@/views/demo/svg-icons/index'),
  meta: {
    i18nKey: t('menu.SvgIcon'),
    icon: 'other',
    order: 3,
  },
}

export default previewSVGIcons
