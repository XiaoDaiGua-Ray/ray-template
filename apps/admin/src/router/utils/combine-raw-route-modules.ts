import type { AppRouteRecordRaw, RouteModules } from '@/router/types'

/**
 *
 * @returns 所有路由模块
 *
 * @description
 * 自动合并所有路由模块，每一个 ts 文件都视为一个 route module 与 views 一一对应。
 * 会将 modules 中每一个 ts 文件当作一个路由模块，即使你以分包的形式创建了路由模块。
 *
 * 请注意，如果更改了 modules 的目录位置或者该方法的位置，需要同步更改 import.meta.glob 方法的路径。
 * 该方法会以本文件为起始位置去查找对应 URL 目录的资源。
 *
 * 如果组件的 name 属性出现重复或者冲突，会导致一些意想不到的情况。
 */
export const combineRawRouteModules = () => {
  const modulesFiles: RouteModules = import.meta.glob(
    '@/router/modules/**/*.ts',
    {
      eager: true,
    },
  )

  const modules = Object.keys(modulesFiles).reduce((pre, curr) => {
    const module = modulesFiles[curr].default

    if (module) {
      pre.push(module)
    } else {
      throw new Error(
        `[combineRawRouteModules]: ${curr} module must export default.`,
      )
    }

    return pre
  }, [] as AppRouteRecordRaw[])

  return modules
}
