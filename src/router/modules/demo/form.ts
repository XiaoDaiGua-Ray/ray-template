import { t } from '@/hooks/web/useI18n'
import { LAYOUT } from '@/router/constant'
import type { AppRouteRecordRaw } from '@/router/types'

const form: AppRouteRecordRaw = {
  path: '/form',
  component: () => import('@/views/demo/form'),
  meta: {
    i18nKey: t('menu.Form'),
    icon: 'other',
    order: 2,
    extra: {
      label: 'useForm',
    },
  },
}

export default form
