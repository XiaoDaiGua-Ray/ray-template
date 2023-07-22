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

export type ChartTheme = 'dark' | string | object | 'macarons'
