export default {
  path: '/doc',
  name: 'doc',
  component: () => import('@/views/doc/index'),
  meta: {
    i18nKey: 'Doc',
    icon: 'doc',
    windowOpen: 'https://xiaodaigua-ray.github.io/ray-template-doc/',
  },
}
