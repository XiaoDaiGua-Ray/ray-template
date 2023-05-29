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

/** 系统颜色风格配置入口 */

import type { AppPrimaryColor } from '../types/cfg'

/**
 *
 * 系统主题颜色预设色盘
 * 支持 RGBA、RGB、十六进制
 */
export const APP_THEME_COLOR = [
  '#2d8cf0',
  '#0960bd',
  '#536dfe',
  '#ff5c93',
  '#ee4f12',
  '#9c27b0',
  '#ff9800',
  '#18A058',
]

/** 系统主题色 */
export const APP_PRIMARY_COLOR: AppPrimaryColor = {
  /** 主题色 */
  primaryColor: '#2d8cf0',
  /** 主题辅助色(用于整体 hover、active 等之类颜色) */
  primaryFadeColor: 'rgba(45, 140, 240, 0.3)',
}
