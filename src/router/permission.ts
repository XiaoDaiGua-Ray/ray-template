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
 * 路由守卫, 进行路由鉴权操作
 *
 * 根据 meta role 与 BASIC_ROUTER 结合进行跳转路由鉴权操作
 *
 * 如果 meta role 为空则会默认认为全局可用
 *
 * 如果需要指定角色, 则添加该属性并且添加角色
 *
 * 当然, 你可以指定一个超级管理员角色, 默认获取全部路由
 */

import { getCache, setCache } from '@/utils/cache'
import { useSignin } from '@/store'
import { APP_CATCH_KEY } from '@/appConfig/appConfig'

import type { Router, NavigationGuardNext } from 'vue-router'

export const permissionRouter = (router: Router) => {
  const { beforeEach } = router

  const {
    rootRoute: { path },
  } = __APP_CFG__

  /** 如果没有权限, 则重定向至首页 */
  const redirectToDashboard = (next: NavigationGuardNext) => {
    next(path)

    setCache('menuKey', path)
  }

  beforeEach((to, from, next) => {
    const token = getCache(APP_CATCH_KEY.token)
    const route = getCache('menuKey')
    const { signinCallback } = storeToRefs(useSignin())
    const role = computed(() => signinCallback.value.role)
    const { meta } = to

    /**
     *
     * 检查是否有权限, 如果权限不匹配则重定向至首页(默认为 dashboard)
     * 权限匹配使用严格比对, 对大小写、空格等敏感
     */
    const hasRole = () => {
      /** 如果未设置权限则默认无需鉴权 */
      if (meta.role) {
        /** 空权限列表默认无需鉴权 */
        if (meta.role.length === 0) {
          return true
        } else {
          return meta.role.includes(role.value)
        }
      } else {
        return true
      }
    }

    if (token !== 'no') {
      if (hasRole()) {
        if (to.path === '/' || from.path === '/login') {
          if (route !== 'no') {
            next(route)
          } else {
            redirectToDashboard(next)
          }
        } else {
          next()
        }
      } else {
        redirectToDashboard(next)
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
