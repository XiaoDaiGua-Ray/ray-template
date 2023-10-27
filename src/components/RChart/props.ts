import type * as echarts from 'echarts/core' // `echarts` 核心模块
import type { PropType, VNode } from 'vue'
import type { MaybeArray } from '@/types/modules/utils'
import type {
  LoadingOptions,
  AutoResize,
  ChartTheme,
} from '@/components/RChart/type'
import type { ECharts, SetOptionOpts } from 'echarts/core'
import type { MaybeComputedElementRef, MaybeElement } from '@vueuse/core'
import type {
  EChartsExtensionInstallRegisters,
  RChartPresetType,
  RChartDownloadOptions,
} from './type'
import type { CardProps, DropdownProps, DropdownOption } from 'naive-ui'

import { loadingOptions } from './helper'

const props = {
  bordered: {
    /**
     *
     * 仅在 preset 为 card 时生效
     *
     * 设置边框
     */
    type: Boolean,
    default: true,
  },
  downloadOptions: {
    /**
     *
     * 仅在 preset 为 card 时生效
     *
     * type: 导出的格式，可选 png, jpg, svg。注意：png, jpg 只有在 canvas 渲染器的时候可使用，svg 只有在使用 svg 渲染器的时候可用
     * pixelRatio: 导出的图片分辨率比例，默认为 1
     * backgroundColor: 导出的图片背景色，默认使用 option 里的 backgroundColor
     * excludeComponents: 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox']
     */
    type: Object as PropType<RChartDownloadOptions>,
    default: () => ({}),
  },
  onDropdownSelect: {
    // 仅在 preset 为 card 时生效
    type: [Function, Array] as PropType<
      MaybeArray<(key: string | number, option: DropdownOption) => void>
    >,
  },
  dropdownOptions: {
    // 仅在 preset 为 card 时生效
    type: Array as PropType<DropdownProps['options']>,
  },
  preset: {
    type: String as PropType<RChartPresetType>,
  },
  contentStyle: {
    // 仅在 preset 为 card 时生效
    type: [String, Object] as PropType<CardProps['contentStyle']>,
  },
  title: {
    // 仅在 preset 为 card 时生效
    type: [String, Function] as PropType<string | (() => VNode)>,
  },
  width: {
    /**
     *
     * chart 容器初始化宽度
     *
     * 如果未能继承宽度, 则会以 200px 宽度填充
     */
    type: String,
    default: '100%',
  },
  height: {
    /**
     *
     * chart 容器初始化高度
     *
     * 如果未能继承高度, 则会以 200px 宽度填充
     */
    type: String,
    default: '100%',
  },
  autoResize: {
    /**
     *
     * `chart` 是否跟随窗口尺寸变化自动变化
     *
     * 如果为对象, 则可以指定其变化尺寸, 实现图表大小不等于容器大小的效果
     * 默认每秒触发一次的频率
     */
    type: [Boolean, Object] as PropType<AutoResize>,
    default: true,
  },
  showAria: {
    /**
     *
     * 是否开启 `chart` 无障碍访问
     *
     * 此选项会覆盖 `options` 中的 `aria` 配置
     */
    type: Boolean,
    default: false,
  },
  options: {
    type: Object as PropType<echarts.EChartsCoreOption>,
    default: () => ({}),
  },
  onSuccess: {
    /**
     *
     * 返回 chart 实例
     *
     * 渲染成功回调函数
     *
     * () => ECharts
     */
    type: [Function, Array] as PropType<MaybeArray<(e: ECharts) => void>>,
    default: null,
  },
  onError: {
    /**
     *
     * 渲染失败回调函数
     *
     * () => void
     */
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
    default: null,
  },
  theme: {
    /**
     *
     * 手动指定 chart theme
     */
    type: String as PropType<ChartTheme>,
    default: null,
  },
  autoChangeTheme: {
    /**
     *
     * 是否自动跟随模板主题切换
     * 如果开启此属性, 则会覆盖 `theme` 属性
     *
     * 注意: 这个属性重度依赖此模板
     */
    type: Boolean,
    default: true,
  },
  use: {
    /**
     *
     * 拓展 `echarts` 图表
     * 用于自己手动拓展相关的包
     */
    type: Array as PropType<EChartsExtensionInstallRegisters[]>,
    default: () => [],
  },
  watchOptions: {
    /** 主动监听 options 变化 */
    type: Boolean,
    default: true,
  },
  loading: {
    /** 加载动画 */
    type: Boolean,
    default: false,
  },
  loadingOptions: {
    /** 配置加载动画样式 */
    type: Object as PropType<LoadingOptions>,
    default: () => loadingOptions(),
  },
  observer: {
    /**
     *
     * 需要被监听尺寸的元素
     * 需要开启 autoResize 才能生效
     * 默认以父元素作为监听对象
     */
    type: Object as PropType<MaybeComputedElementRef<MaybeElement>>,
    default: null,
  },
  throttleWait: {
    /** 节流等待时间 */
    type: Number,
    default: 500,
  },
  animation: {
    /** 是否强制启用渲染动画 */
    type: Boolean,
    default: true,
  },
  setChartOptions: {
    /**
     *
     * 当 options 配置项更改时候，setOptions 方法配置项
     *
     * 默认值
     * notMerge: false,
     * lazyUpdate: true,
     * silent: false,
     * replaceMerge: [],
     *
     * 会自动进行合并配置项
     */
    type: Object as PropType<SetOptionOpts>,
    default: () => ({}),
  },
}

export default props
