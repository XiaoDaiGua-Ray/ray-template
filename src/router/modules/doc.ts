import type { AppRouteRecordRaw } from '@/router/type'

const doc: AppRouteRecordRaw = {
  path: '/doc',
  name: 'Doc',
  component: () => import('@/views/doc/index'),
  meta: {
    i18nKey: 'Doc',
    icon: 'doc',
    windowOpen: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
  },
}

export default doc
