import type { AppTheme } from '@/types/modules/vite-custom-config'
import {
  rayPrimaryColor,
  rayThemeOverrides,
} from '@ray-template/ui/theme-presets'

export const APP_THEME: AppTheme = {
  /**
   *
   * @description
   * 系统主题颜色预设色盘。
   * 支持 RGBA、RGB、十六进制。
   */
  appThemeColors: [
    '#3b63d9',
    '#3f9eff',
    '#ff42bc',
    '#ee4f12',
    '#dbcb02',
    '#18a058',
  ],
  // 系统主题色
  appPrimaryColor: rayPrimaryColor,
  /**
   *
   * @description
   * 配置系统 naive-ui 主题色。
   * 官网文档地址: <https://www.naiveui.com/zh-CN/dark/docs/customize-theme>。
   *
   * 注意:
   *   - appPrimaryColor common 配置优先级大于该配置
   *
   * 如果需要定制化整体组件样式，配置示例。
   * 具体自行查看官网，还有模式更佳丰富的 peers 主题变量配置。
   * 地址: <https://www.naiveui.com/zh-CN/dark/docs/customize-theme#%E4%BD%BF%E7%94%A8-peers-%E4%B8%BB%E9%A2%98%E5%8F%98%E9%87%8F>
   *
   * @example
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
   */
  appNaiveUIThemeOverrides: rayThemeOverrides,
  /**
   *
   * @description
   * 默认跟随界面风格；可指定已注册的 ECharts 主题名覆盖，暗色变体使用 -dark 后缀。
   */
  echartTheme: null,
}
