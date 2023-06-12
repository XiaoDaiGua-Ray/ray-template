/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { permissionRouter } from './permission'

import {
  SETUP_ROUTER_LOADING_BAR,
  SETUP_ROUTER_GUARD,
  WHITE_ROUTES,
  SUPER_ADMIN,
} from '@/appConfig/routerConfig'
import { useSignin } from '@/store'
import { useVueRouter } from '@/router/helper/useVueRouter'
import { ROOT_ROUTE } from '@/appConfig/appConfig'
import { setCache } from '@/utils/cache'

import type { Router } from 'vue-router'

/**
 *
 * @remark 校验当前路由
 */
export const validRole = (option: IMenuOptions) => {
  const { signinCallback } = storeToRefs(useSignin())
  const role = computed(() => signinCallback.value.role)

  const { meta, name } = option
  const hidden =
    meta?.hidden === undefined || meta?.hidden === false ? false : meta?.hidden

  // 如果是超级管理员(预设为 admin), 则根据其菜单栏(hidden)字段判断是否显示
  if (SUPER_ADMIN.length && SUPER_ADMIN.includes(role.value)) {
    return true && !hidden
  } else {
    // 如果为基础路由, 不进行鉴权则根据其菜单栏(hidden)字段判断是否显示
    if (WHITE_ROUTES.includes(name)) {
      return true && !hidden
    }

    // 判断权限是否匹配和菜单栏(hidden)字段判断是否显示
    if (meta?.role) {
      return meta.role.includes(role.value) && !hidden
    }

    return true && !hidden
  }
}

/**
 *
 * @remark 路由切换启用顶部加载条
 * @remark 路由切换启用加载动画
 */
export const setupRouterLoadingBar = (router: Router) => {
  router.beforeEach(() => {
    window?.$loadingBar?.start()
  })

  router.afterEach(() => {
    window?.$loadingBar?.finish()
  })

  router.onError(() => {
    window?.$loadingBar?.error()
  })
}

/**
 *
 * @param router vue router instance
 *
 * @remark 统一的路由相关功能配置, 虽然该方法有点蠢...
 */
export const vueRouterRegister = (router: Router) => {
  if (SETUP_ROUTER_LOADING_BAR) {
    setupRouterLoadingBar(router)
  }

  if (SETUP_ROUTER_GUARD) {
    permissionRouter(router)
  }
}

/**
 *
 * @param replace 是否使用
 *
 * @remark 重定向路由至首页, 默认采用替换方法重定向
 */
export const redirectRouterToDashboard = (isReplace = true) => {
  const { router } = useVueRouter()

  const { push, replace } = router
  const { path } = ROOT_ROUTE

  isReplace ? push(path) : replace(path)

  setCache('menuKey', path)
}
