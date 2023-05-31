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
