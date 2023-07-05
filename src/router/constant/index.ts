/**
 *
 * default layout
 *
 * 默认布局, 统一使用该组件管理右侧现实内容区域展示
 *
 * @example
 * 使用示例:
 * ```
 * {
 *   path: '/axios',
 *   name: 'Axios',
 *   component: LAYOUT,
 *   meta: { ... },
 *   children: [ { ... } ]
 * }
 * ```
 */
export const LAYOUT = () => import('@/layout/default/ContentWrapper/index')
