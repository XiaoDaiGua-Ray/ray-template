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

import { WHITE_ROUTES, APP_CATCH_KEY } from '@/app-config'
import { redirectRouterToDashboard } from '@/router/helper/routerCopilot'
import { validRole } from '@/router/helper/routerCopilot'
import { isValueType, getStorage } from '@/utils'
import { useAppRoot } from '@/hooks'

import type { Router, RouteLocationNormalized } from 'vue-router'
import type { AppRouteMeta } from '@/router/type'

/** 路由守卫 */
export const permissionRouter = (router: Router) => {
  const { beforeEach } = router
  const { getRootPath } = useAppRoot()

  const isToLogin = (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
  ) => to.path === '/' || from.path === '/login'

  beforeEach((to, from, next) => {
    const token = getStorage<string>(APP_CATCH_KEY.token)
    const catchRoutePath = getStorage(
      APP_CATCH_KEY.appMenuKey,
      'sessionStorage',
      {
        defaultValue: getRootPath.value,
      },
    )
    const { meta, name } = to

    /** 是否含有 token */
    if (token !== null) {
      /** 是否在有 token 时去到登陆页 */
      if (isToLogin(to, from)) {
        redirectRouterToDashboard(true)
      } else {
        /** 是否为白名单 */
        if (
          !isValueType<symbol>(name, 'Symbol') &&
          name &&
          WHITE_ROUTES.includes(name)
        ) {
          next()
        } else {
          /** 是否有权限 */
          if (validRole(meta as AppRouteMeta)) {
            /** 是否在有权限时去到登陆页 */
            if (isToLogin(to, from)) {
              /** 容错处理, 如果没有预设地址与获取到缓存地址, 则重定向到首页去 */
              if (catchRoutePath) {
                next(catchRoutePath)
              } else {
                redirectRouterToDashboard(true)
              }
            } else {
              next()
            }
          } else {
            redirectRouterToDashboard(true)
          }
        }
      }
    } else {
      if (isToLogin(to, from)) {
        next()
      } else {
        next('/')
      }
    }
  })
}
