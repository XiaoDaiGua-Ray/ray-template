import { t } from '@/locales/useI18n'

import type { AppRouteRecordRaw } from '@/router/type'

const doc: AppRouteRecordRaw = {
  path: '/doc',
  name: 'Doc',
  component: () => import('@/views/doc/index'),
  meta: {
    i18nKey: t('menu.Doc'),
    icon: 'doc',
    windowOpen: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
    order: 5,
  },
}

export default doc
