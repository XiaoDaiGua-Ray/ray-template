import type { RouteRecordRaw } from 'vue-router'

const route = import.meta.glob('./*.ts', { eager: true }) as IUnknownObjectKey

const routes = Object.keys(route).reduce((modules, modulePath) => {
  const _default = route[modulePath]

  modules.push(_default as unknown as RouteRecordRaw)

  return modules
}, [] as RouteRecordRaw[])

export default routes

/**
 *
 * 这个方法可以自动载入路由表, 不需要手动进行导入
 * 单个路由表格式可以参考 `test.ts`
 * 但是如果需要控制路由顺序, 则需要自行处理
 */
