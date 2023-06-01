/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-01
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import type { AppRouteRecordRaw, AutoImportRouteModule } from '@/router/type'

/**
 *
 * @returns 所有路由模块
 *
 * @remark 自动合并所有路由模块, 每一个 ts 文件都视为一个 route module 与 views 一一对应
 */
export const autoMergeRoute = () => {
  const modulesFiles = import.meta.glob('../modules/**/*.ts', {
    eager: true,
  })

  const modules = Object.keys(modulesFiles).reduce((modules, modulePath) => {
    const value = modulesFiles[modulePath] as AutoImportRouteModule

    modules.push(value.default)

    return modules
  }, [] as AppRouteRecordRaw[])

  return modules
}
