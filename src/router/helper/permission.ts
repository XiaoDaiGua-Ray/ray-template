/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-01-28
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 路由守卫
 * 进行路由鉴权操作
 *
 * 根据 meta role 与 BASIC_ROUTER 结合进行跳转路由鉴权操作
 * 如果 meta role 为空则会默认认为全局可用
 * 如果需要指定角色, 则添加该属性并且添加角色
 * 当然, 你可以指定一个超级管理员角色, 默认获取全部路由
 */

import { getCache, setCache } from '@/utils/cache'
import { useSignin } from '@/store'
import { APP_CATCH_KEY, ROOT_ROUTE } from '@/appConfig/appConfig'
import { redirectRouterToDashboard } from '@/router/helper/routerCopilot'
import { validRole, validMenuItemShow } from '@/router/helper/routerCopilot'

import type {
  Router,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'
import type { AppMenuOption } from '@/types/modules/app'
import type { AppRouteMeta } from '@/router/type'

export const permissionRouter = (router: Router) => {
  const { beforeEach } = router

  beforeEach((to, from, next) => {
    const token = getCache<string>(APP_CATCH_KEY.token)
    const route = getCache<string>('menuKey') || ROOT_ROUTE.path
    const { meta } = to

    if (token !== null) {
      if (validRole(meta as AppRouteMeta)) {
        if (to.path === '/' || from.path === '/login') {
          if (route !== 'no') {
            next(route)
          } else {
            redirectRouterToDashboard(true)
          }
        } else {
          next()
        }
      } else {
        redirectRouterToDashboard(true)
      }
    } else {
      if (to.path === '/' || from.path === '/login') {
        next()
      } else {
        next('/')
      }
    }
  })
}
