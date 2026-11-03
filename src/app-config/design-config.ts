import type { AppTheme } from '@/types/modules/vite-custom-config'

/** 明暗主题共用的菜单尺寸与前景色配置。 */
const menuThemeOverrides = {
  itemHeight: '40px',
  borderRadius: '8px',
  itemTextColorActive: 'var(--r-selected-text)',
  itemTextColorActiveHover: 'var(--r-selected-text)',
  itemTextColorChildActive: 'var(--r-selected-text)',
  itemTextColorChildActiveHover: 'var(--r-selected-text)',
  itemTextColorActiveHorizontal: 'var(--r-selected-text)',
  itemTextColorChildActiveHorizontal: 'var(--r-selected-text)',
  itemTextColorHoverHorizontal: 'var(--r-selected-text)',
  itemIconColorActive: 'var(--r-selected-text)',
  itemIconColorActiveHover: 'var(--r-selected-text)',
  itemIconColorChildActive: 'var(--r-selected-text)',
  itemIconColorChildActiveHover: 'var(--r-selected-text)',
  itemIconColorActiveHorizontal: 'var(--r-selected-text)',
  itemIconColorChildActiveHorizontal: 'var(--r-selected-text)',
}

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
  appPrimaryColor: {
    // 主题色
    primaryColor: '#3b63d9',
    // 主题辅助色(用于整体 hover、active 等之类颜色)
    primaryFadeColor: 'rgba(59, 99, 217, 0.85)',
  },
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
  appNaiveUIThemeOverrides: {
    dark: {
      common: {
        borderRadius: '8px',
        fontWeightStrong: '600',
        lineHeight: '1.6',
        heightMedium: '36px',
        heightSmall: '30px',
        baseColor: '#172131',
        bodyColor: '#101722',
        cardColor: '#172131',
        modalColor: '#192638',
        popoverColor: '#192638',
        actionColor: '#1c293b',
        textColor1: '#e9eef7',
        textColor2: '#b3c0d3',
        textColor3: '#a0b0c6',
        placeholderColor: '#a0b0c6',
        borderColor: '#687b96',
        dividerColor: '#2c394d',
        hoverColor: 'rgba(179, 192, 211, 0.08)',
      },
      Card: {
        borderRadius: '12px',
        titleFontSizeMedium: '16px',
        paddingMedium: '20px 24px',
      },
      Menu: menuThemeOverrides,
      Button: { fontWeight: '500' },
      Tag: { borderRadius: '5px', textColorPrimary: 'var(--r-primary-text)' },
      Layout: { siderColor: '#172131', headerColor: '#172131' },
    },
    light: {
      common: {
        borderRadius: '8px',
        fontWeightStrong: '600',
        lineHeight: '1.6',
        heightMedium: '36px',
        heightSmall: '30px',
        baseColor: '#ffffff',
        bodyColor: '#f5f7fb',
        cardColor: '#ffffff',
        modalColor: '#ffffff',
        popoverColor: '#ffffff',
        actionColor: '#f7f9fc',
        textColor1: '#1d2a3e',
        textColor2: '#52647c',
        textColor3: '#617187',
        placeholderColor: '#617187',
        borderColor: '#8492a8',
        dividerColor: '#e4e9f1',
        hoverColor: 'rgba(82, 100, 124, 0.06)',
      },
      Card: {
        borderRadius: '12px',
        titleFontSizeMedium: '16px',
        paddingMedium: '20px 24px',
      },
      Menu: menuThemeOverrides,
      Button: { fontWeight: '500' },
      Tag: { borderRadius: '5px', textColorPrimary: 'var(--r-primary-text)' },
      Layout: { siderColor: '#ffffff', headerColor: '#ffffff' },
    },
  },
  /**
   *
   * @description
   * 配置 echart 主题颜色。
   * 约定配置时以：主题名称为文件名，其文件夹下两个主题风格的 json 文件。并且暗色主题必须为 xxx-dark.json。
   *
   * [文档地址](https://xiaodaigua-ray.github.io/ray-template-doc/ray-template-docs/advanced/echart-themes.html)
   */
  echartTheme: 'macarons',
}
