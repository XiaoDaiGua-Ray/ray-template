import type { DefaultTheme } from 'vitepress'

const entry = (text: string, link: string): DefaultTheme.SidebarItem => ({
  text,
  link,
})

const guide = [
  {
    text: '入门',
    items: [
      entry('快速开始', '/guide/start'),
      entry('v6 Monorepo 架构', '/guide/architecture'),
      entry('v5 与 v6 的版本分界', '/migration'),
      entry('第一个业务页面', '/guide/first-page'),
    ],
  },
  {
    text: '开发指南',
    items: [
      entry('路由、菜单与权限', '/guide/routing'),
      entry('应用布局与状态', '/guide/layout'),
      entry('接口、取消与 Mock', '/guide/requests'),
      entry('主题与国际化', '/guide/appearance'),
      entry('工程检查与部署', '/guide/tooling'),
    ],
  },
  entry('API 参考', '/reference/'),
]

const reference = [
  entry('API 参考总览', '/reference/'),
  {
    ...entry('组件', '/reference/components'),
    collapsed: true,
    items: [
      entry('TablePro', '/reference/table-pro'),
      entry('RForm 与 useForm', '/reference/components/form'),
      entry('RModal', '/reference/components/modal'),
      entry('RChart 与 useChart', '/reference/components/chart'),
      entry('RFlow 与 useFlow', '/reference/components/flow'),
      entry('RCollapseGrid', '/reference/components/collapse-grid'),
      entry('RSegment', '/reference/components/segment'),
      entry('RMoreDropdown', '/reference/components/more-dropdown'),
      entry('RIframe', '/reference/components/iframe'),
      entry('RBarcode', '/reference/components/barcode'),
      entry('RDraggableCard', '/reference/components/draggable-card'),
      entry('RTransitionComponent', '/reference/components/route-transition'),
      entry('RIcon 与 SVG 图标', '/reference/icons'),
      entry('二维码', '/reference/components/qr-code'),
      entry('应用组件与 Provider', '/reference/components/app'),
    ],
  },
  {
    ...entry('Hooks', '/reference/hooks'),
    collapsed: true,
    items: [
      entry('导航与菜单', '/reference/hooks/navigation'),
      entry('布局与滚动', '/reference/hooks/layout'),
      entry('主题、语言和水印', '/reference/hooks/appearance'),
      entry('分页与右键菜单', '/reference/hooks/interaction'),
      entry('窗口、全屏和日期', '/reference/hooks/browser'),
      entry('DOM 截图与打印', '/reference/hooks/output'),
    ],
  },
  entry('指令', '/reference/directives'),
  {
    ...entry('Store', '/reference/store'),
    collapsed: true,
    items: [
      entry('Setting', '/reference/store/setting'),
      entry('Menu 与 KeepAlive', '/reference/store/navigation'),
      entry('Runtime 与 Lock Screen', '/reference/store/runtime'),
      entry('Signing', '/reference/store/signing'),
    ],
  },
  {
    ...entry('工具函数', '/reference/utils'),
    collapsed: true,
    items: [
      entry('基础、日期和数值', '/reference/utils/core'),
      entry('缓存与兼容加密', '/reference/utils/storage'),
      entry('Vue 与浏览器工具', '/reference/utils/browser'),
    ],
  },
  entry('应用配置', '/reference/configuration'),
  entry('文档与源码版本', '/reference/source'),
]

export const sidebar: DefaultTheme.Sidebar = {
  '/reference/': reference,
  '/': guide,
}
