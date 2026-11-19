import type { DefaultTheme } from 'vitepress'

export function createSidebar(english: boolean): DefaultTheme.Sidebar {
  const prefix = english ? '/en' : ''
  const label = (zh: string, en: string) => (english ? en : zh)
  const entry = (
    zh: string,
    en: string,
    path: string,
  ): DefaultTheme.SidebarItem => ({
    text: label(zh, en),
    link: prefix + path,
  })

  const guide = [
    {
      text: label('入门', 'Get started'),
      items: [
        entry('快速开始', 'Quick start', '/guide/start'),
        entry(
          '发行版本与快速启动',
          'Source distributions',
          '/guide/distributions',
        ),
        entry(
          'v6 Monorepo 架构',
          'v6 Monorepo Architecture',
          '/guide/architecture',
        ),
        entry('v5 与 v6 的版本分界', 'Moving from v5 to v6', '/migration'),
        entry(
          '第一个业务页面',
          'Your first business page',
          '/guide/first-page',
        ),
      ],
    },
    {
      text: label('开发指南', 'Development'),
      items: [
        entry(
          '路由、菜单与权限',
          'Routes, menus, and permissions',
          '/guide/routing',
        ),
        entry('应用布局与状态', 'Layout and state', '/guide/layout'),
        entry(
          '接口、取消与 Mock',
          'Requests, cancellation, and mocks',
          '/guide/requests',
        ),
        entry('服务端接入与标准契约', 'Backend integration', '/guide/backend'),
        entry('主题与国际化', 'Themes and localization', '/guide/appearance'),
        entry('工程检查与部署', 'Checks and deployment', '/guide/tooling'),
      ],
    },
    entry('API 参考', 'API Reference', '/reference/'),
  ]

  const reference = [
    entry('API 参考总览', 'API Reference Overview', '/reference/'),
    {
      ...entry('组件', 'Components', '/reference/components'),
      collapsed: true,
      items: [
        entry('TablePro', 'TablePro', '/reference/table-pro'),
        entry(
          'TablePro 在线示例',
          'TablePro Live Examples',
          '/reference/table-pro-examples',
        ),
        entry(
          'RForm 与 useForm',
          'RForm and useForm',
          '/reference/components/form',
        ),
        entry('RModal', 'RModal', '/reference/components/modal'),
        entry(
          'RChart 与 useChart',
          'RChart and useChart',
          '/reference/components/chart',
        ),
        entry(
          'RFlow 与 useFlow',
          'RFlow and useFlow',
          '/reference/components/flow',
        ),
        entry(
          'RCollapseGrid',
          'RCollapseGrid',
          '/reference/components/collapse-grid',
        ),
        entry('RSegment', 'RSegment', '/reference/components/segment'),
        entry(
          'RMoreDropdown',
          'RMoreDropdown',
          '/reference/components/more-dropdown',
        ),
        entry('RIframe', 'RIframe', '/reference/components/iframe'),
        entry('RBarcode', 'RBarcode', '/reference/components/barcode'),
        entry(
          'RDraggableCard',
          'RDraggableCard',
          '/reference/components/draggable-card',
        ),
        entry(
          'RTransitionComponent',
          'RTransitionComponent',
          '/reference/components/route-transition',
        ),
        entry('RIcon 与 SVG 图标', 'RIcon and SVG Icons', '/reference/icons'),
        entry('二维码', 'QR Codes', '/reference/components/qr-code'),
        entry(
          '应用组件与 Provider',
          'App Components and Providers',
          '/reference/components/app',
        ),
      ],
    },
    {
      ...entry('Hooks', 'Hooks', '/reference/hooks'),
      collapsed: true,
      items: [
        entry(
          '导航与菜单',
          'Navigation and Menus',
          '/reference/hooks/navigation',
        ),
        entry('布局与滚动', 'Layout and Scrolling', '/reference/hooks/layout'),
        entry(
          '主题、语言和水印',
          'Themes, Language, and Watermarks',
          '/reference/hooks/appearance',
        ),
        entry(
          '分页与右键菜单',
          'Pagination and Context Menus',
          '/reference/hooks/interaction',
        ),
        entry(
          '窗口、全屏和日期',
          'Viewport, Fullscreen, and Dates',
          '/reference/hooks/browser',
        ),
        entry(
          'DOM 截图与打印',
          'DOM Capture and Printing',
          '/reference/hooks/output',
        ),
      ],
    },
    entry('指令', 'Directives', '/reference/directives'),
    {
      ...entry('Store', 'Stores', '/reference/store'),
      collapsed: true,
      items: [
        entry('Setting', 'Settings', '/reference/store/setting'),
        entry(
          'Menu 与 KeepAlive',
          'Menu and KeepAlive',
          '/reference/store/navigation',
        ),
        entry(
          'Runtime 与 Lock Screen',
          'Runtime and Lock Screen',
          '/reference/store/runtime',
        ),
        entry('Signing', 'Signing', '/reference/store/signing'),
      ],
    },
    {
      ...entry('工具函数', 'Utilities', '/reference/utils'),
      collapsed: true,
      items: [
        entry(
          '基础、日期和数值',
          'Core, Dates, and Numbers',
          '/reference/utils/core',
        ),
        entry(
          '缓存与兼容加密',
          'Storage and Legacy Encryption',
          '/reference/utils/storage',
        ),
        entry(
          'Vue 与浏览器工具',
          'Vue and Browser Utilities',
          '/reference/utils/browser',
        ),
      ],
    },
    entry('应用配置', 'Application Configuration', '/reference/configuration'),
    entry(
      '文档与源码版本',
      'Documentation and Source Versions',
      '/reference/source',
    ),
  ]

  return {
    [prefix + '/reference/']: reference,
    [prefix + '/']: guide,
  }
}
