/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-19
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** vue-router 相关配置入口 */

import type { LayoutInst } from 'naive-ui'

/** 路由切换容器区域 id 配置 */
export const viewScrollContainerId = 'rayLayoutContentWrapperScopeSelector'

/**
 *
 * 内容区域 ref 注册
 * 可以控制内容区域当前滚动位置
 */
export const LAYOUT_CONTENT_REF = ref<LayoutInst>()

/** 是否启用路由切换时顶部加载条 */
export const SETUP_ROUTER_LOADING_BAR = true

/** 是否启用路由守卫, 如果设置为 false 则不会触发路由切换校验 */
export const SETUP_ROUTER_GUARD = true

/**
 *
 * 路由白名单(不进行权限校验路由)
 *
 * 路由表单白名单
 *
 * 如果需要启用该功能, 则需要配置路由 name 属性, 并且需要一一对应(对大小写敏感)
 * 如果未设置, 则不会生效
 *
 * 配置该路由白名单列表后, 则不会对配置中的路由列表进行鉴权处理(配合 basic.ts 中的方法进行使用)
 *
 * 配置动态路由菜单
 * 可以根据权限与白名单进行过滤, 但是 meta hidden 属性拥有最高的控制权限
 * 如果 mete hidden 设置为 false 则永远不会显示菜单选项
 */
export const WHITE_ROUTES = ['RLogin', 'ErrorPage', 'RayTemplateDoc']

/**
 *
 * 超级管理员
 * 配置默认超级管理员, 默认拥有全部最高权限
 */
export const SUPER_ADMIN: (string | number)[] = ['admin']
