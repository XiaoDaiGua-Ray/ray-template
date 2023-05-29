/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-23
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/** 系统配置 */

import type {
  LayoutSideBarLogo,
  PreloadingConfig,
  RootRoute,
} from '../types/cfg'

/** 首屏加载信息配置 */
export const PRE_LOADING_CONFIG: PreloadingConfig = {
  title: 'Ray Template',
  tagColor: '#ff6700',
  titleColor: '#2d8cf0',
}

/**
 *
 * 配置根页面
 * 该项目所有重定向至首页, 都依赖该配置项
 *
 * 如果修改了该项目的首页路由配置, 需要更改该配置项, 以免重定向首页操作出现错误
 */
export const ROOT_ROUTE: RootRoute = {
  name: 'Dashboard',
  path: '/dashboard',
}

/**
 *
 * icon: LOGO 图标, 依赖 `RayIcon` 实现(如果为空则不会渲染图标)
 * title: LOGO 标题
 * url: 点击跳转地址, 如果不配置该属性, 则不会触发跳转
 * jumpType: 跳转类型(station: 项目内跳转, outsideStation: 新页面打开)
 *
 * 如果不设置该属性或者为空, 则不会渲染 LOGO
 */
export const SIDE_BAR_LOGO: LayoutSideBarLogo = {
  icon: 'ray',
  title: 'Ray Template',
  url: '/dashboard',
  jumpType: 'station',
}
