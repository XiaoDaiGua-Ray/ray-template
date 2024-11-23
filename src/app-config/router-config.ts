import type { LayoutInst } from 'naive-ui'
import type { Ref } from 'vue'

/**
 *
 * @description
 * 内容区域 shallowRef 注册
 * 可以控制内容区域当前滚动位置
 * 如果你需要在切换路由时候配置自定义滚动到某个视图区域时, 可以使用该属性提供的方法(scrollTo)
 *
 * 请注意
 * 如果你动态的添加了某个属性后, 希望控制滚动条滚动到某个区域时, 应该注意 dom 挂载后再执行该方法
 * @example
 * nextTick().then(() => {
 *  LAYOUT_CONTENT_REF.value?.scrollTo()
 * })
 */
export const LAYOUT_CONTENT_REF: Readonly<Ref<LayoutInst | null>> =
  shallowRef<LayoutInst | null>(null)

/**
 *
 * @description
 * 侧边滚动栏滚动 shallowRef 注册。
 * 可以控制侧边滚动栏滚动位置。
 *
 * 请注意使用时机。建议使用 nextTick() 等待 dom 挂载后再执行该方法。
 * @example
 * nextTick().then(() => {
 *   LAYOUT_SIDER_REF.value?.scrollTo({ top: 0 })
 * })
 */
export const LAYOUT_SIDER_REF: Readonly<Ref<LayoutInst | null>> =
  shallowRef<LayoutInst | null>(null)

export const SETUP_ROUTER_ACTION = {
  /** 是否启用路由切换时顶部加载条 */
  setupRouterLoadingBar: true,
  /** 是否启用路由守卫, 如果设置为 false 则不会触发路由切换校验 */
  setupRouterGuard: true,
} as const

/**
 *
 * @description
 * 路由白名单(不进行权限校验路由)
 *
 * 路由表单白名单
 *
 * 如果需要启用该功能, 则需要配置路由 name 属性, 并且需要一一对应(对大小写敏感)
 * 并且在配置 route name 属性时, 如果 name 类型为 symbol 的话, 会认为该路由永远不与白名单列表进行匹配
 */
export const WHITE_ROUTES: string[] = ['RLogin', 'ErrorPage', 'RayTemplateDoc']

/**
 *
 * @description
 * 超级管理员
 * 配置默认超级管理员, 默认拥有全部最高权限
 */
export const SUPER_ADMIN: (string | number)[] = []
