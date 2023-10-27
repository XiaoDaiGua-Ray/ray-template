/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-07-22
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import type { ECharts, EChartsCoreOption } from 'echarts/core'
import type { CanvasRenderer } from 'echarts/renderers' // `echarts` 渲染器

export interface ChartThemeRawModules {
  default: Record<string, UnknownObjectKey>
}

export interface ChartThemeRawArray {
  name: string
  theme: UnknownObjectKey
}

export interface LoadingOptions {
  text: string // 文本内容
  color: string // 颜色
  textColor: string // 字体颜色
  maskColor: string // 遮罩颜色
  zlevel: number // 水平
  fontSize: number // 字体大小
  showSpinner: boolean // 是否显示旋转动画(`spinner`)
  spinnerRadius: number // 旋转动画(`spinner`)的半径
  lineWidth: number // 旋转动画(`spinner`)的线宽
  fontWeight: string // 字体粗细
  fontStyle: string // 字体风格
  fontFamily: string // 字体系列
}

export type AutoResize =
  | boolean
  | {
      width: number
      height: number
    }

export type ChartTheme =
  | 'macarons-dark'
  | 'macarons'
  | 'default'
  | string
  | null

export interface RayChartInst {
  /**
   *
   * echart 实例
   * 访问当前 chart 图所有方法与属性
   *
   * @default undefined
   */
  echart: Ref<ECharts | undefined>
  /**
   *
   * 手动卸载当前 chart 图
   * 注意：不会卸载当前组件，仅仅是卸载 chart
   *
   * @default () => void
   */
  dispose: () => void
  /**
   *
   * 手动渲染 chart 图
   * 注意：会根据当前的 options 配置项与 props 配置项重新渲染 chart
   *
   * @default () => void
   */
  render: () => void
}

export type EChartsExtensionInstallRegisters = typeof CanvasRenderer

export type RChartPresetType = 'card' | 'default' | null | undefined

export type RChartDownloadOptions = {
  filename?: string
} & Parameters<ECharts['getDataURL']>[0]
