import type { RouteRecordRaw } from 'vue-router'

const route = import.meta.glob('./*.ts', { eager: true }) as IUnknownObjectKey

const routes = Object.keys(route).reduce((modules, modulePath) => {
  modules.push(route[modulePath].default)

  return modules
}, [] as RouteRecordRaw[])

export default routes
