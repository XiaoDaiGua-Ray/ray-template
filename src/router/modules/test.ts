export default {
  path: 'app',
  name: 'app',
  component: () => import('@/App'),
  children: [{}], // 如果有子路由, 直接接着写就好
}
