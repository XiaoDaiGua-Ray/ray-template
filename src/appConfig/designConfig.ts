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

import type { AppPrimaryColor } from '@/types/cfg'
import type { GlobalThemeOverrides } from 'naive-ui'

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

/**
 *
 * 配置系统 naive-ui 主题色
 * 官网文档地址: <https://www.naiveui.com/zh-CN/dark/docs/customize-theme>
 *
 * 注意:
 *   - APP_PRIMARY_COLOR common 配置优先级大于该配置
 *
 * 如果需要定制化整体组件样式, 配置示例
 * ```
 * const themeOverrides: GlobalThemeOverrides = {
 *   common: {
 *     primaryColor: '#FF0000',
 *   },
 *   Button: {
 *     textColor: '#FF0000',
 *   },
 * }
 * ```
 *
 * 具体自行查看官网, 还有模式更佳丰富的 peers 主题变量配置
 * 地址: <https://www.naiveui.com/zh-CN/dark/docs/customize-theme#%E4%BD%BF%E7%94%A8-peers-%E4%B8%BB%E9%A2%98%E5%8F%98%E9%87%8F>
 */
export const APP_NAIVE_UI_THEME_OVERRIDES: GlobalThemeOverrides = {}
