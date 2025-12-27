import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const rely: AppRouteRecordRaw = {
  path: 'rely-about',
  component: () => import('@/views/demo/rely/views/rely-about/index'),
  meta: {
    i18nKey: t('menu.RelyAbout'),
    icon: 'rely',
    order: 999,
  },
}

export default rely
