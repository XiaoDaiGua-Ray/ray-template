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

/**
 *
 * 描述:
 *   - 自动导入所有路由模块
 *   - 平铺所有路由
 *
 * modules 模块下每一个 ts 文件视为一个路由模块(route)
 * 每个模块必须配置 meta 属性
 * 如果不设置 order 属性, 则会默认排在前面
 */

import { autoMergeRoute } from '@/router/helper/merge'
import { orderRoutes } from '@/router/helper/orderRoutes'

import type { AppRouteRecordRaw } from '@/router/type'

const routes: AppRouteRecordRaw[] = orderRoutes(autoMergeRoute())

export default routes
