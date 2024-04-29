import { loadingOptions } from './utils'

import type * as echarts from 'echarts/core' // echarts 核心模块
import type { PropType, VNode } from 'vue'
import type { MaybeArray } from '@/types'
import type { ECharts, SetOptionOpts } from 'echarts/core'
import type {
  MaybeComputedElementRef,
  MaybeElement,
  UseIntersectionObserverOptions,
} from '@vueuse/core'
import type {
  LoadingOptions,
  ChartTheme,
  EChartsExtensionInstallRegisters,
  RChartPresetType,
  RChartDownloadOptions,
} from './types'
import type { CardProps, DropdownProps, DropdownOption } from 'naive-ui'
import type { VoidFC } from '@/types'

const props = {
  /**
   *
   * @description
   * 是否开启 IntersectionObserver 监听，用于监听图表是否在可视区域内再进行渲染。
   * 默认监听图表容器是否在可视区域内，也可以配置 intersectionObserverTarget 属性监听指定元素。
   *
   * 该方法需要浏览器支持 IntersectionObserver API。
   *
   * @default true
   */
  intersectionObserver: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 指定 IntersectionObserver 监听的目标元素。
   *
   * 该属性需要开启 intersectionObserver 才能生效。
   *
   * @default null
   */
  intersectionObserverTarget: {
    type: Object as PropType<MaybeComputedElementRef<MaybeElement>>,
    default: null,
  },
  /**
   *
   * @description
   * IntersectionObserver 配置项。
   *
   * 该属性需要开启 intersectionObserver 才能生效。
   *
   * @see https://www.vueusejs.com/core/useIntersectionObserver/
   *
   * @default {threshold:0.1}
   */
  intersectionOptions: {
    type: Object as PropType<UseIntersectionObserverOptions>,
    default: {
      threshold: 0.1,
    },
  },
  /**
   *
   * @description
   * 仅在 preset 为 card 时生效。
   *
   * @default true
   */
  bordered: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 仅在 preset 为 card 时生效。
   *
   * type: 导出的格式，可选 png, jpg, svg。注意: png, jpg 只有在 canvas 渲染器的时候可使用，svg 只有在使用 svg 渲染器的时候可用。
   * pixelRatio: 导出的图片分辨率比例，默认为 1。
   * backgroundColor: 导出的图片背景色，默认使用 option 里的 backgroundColor。
   * excludeComponents: 忽略组件的列表，例如要忽略 toolbox 就是 ['toolbox']。
   *
   * @default {}
   */
  downloadOptions: {
    type: Object as PropType<RChartDownloadOptions>,
    default: () => ({}),
  },
  /**
   *
   * @description
   * dropdown 选中回调。
   *
   * 仅在 preset 为 card 时生效。
   *
   * @default undefined
   */
  onDropdownSelect: {
    type: [Function, Array] as PropType<
      MaybeArray<(key: string | number, option: DropdownOption) => void>
    >,
  },
  /**
   *
   * @description
   * dropdown 列表。
   *
   * 仅在 preset 为 card 时生效。
   *
   * @default []
   */
  dropdownOptions: {
    type: Array as PropType<DropdownProps['options']>,
  },
  /**
   *
   * @description
   * 是否启用预设样式。
   *
   * @default undefined
   */
  preset: {
    type: String as PropType<RChartPresetType>,
  },
  /**
   *
   * @description
   * 设置 content 区域的样式。
   *
   * 仅在 preset 为 card 时生效。
   *
   * @default undefined
   */
  contentStyle: {
    type: [String, Object] as PropType<CardProps['contentStyle']>,
  },
  /**
   *
   * @description
   * 设置预设样式的标题。
   *
   * 仅在 preset 为 card 时生效。
   *
   * @default undefined
   */
  title: {
    type: [String, Function] as PropType<string | (() => VNode)>,
  },
  /**
   *
   * @description
   * chart 默认宽度，默认为 100%。
   *
   * 但是，如果未获取到实际宽度，那么会以 200px 宽度填充。
   *
   * @default 100%
   */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  /**
   *
   * @description
   * chart 默认高度，默认为 100%。
   *
   * 但是，如果未获取到实际高度，那么会以 200px 高度填充。
   *
   * @default 100%
   */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  /**
   *
   * @description
   * 是否启用自动调整大小，默认跟随图表容器尺寸变化。
   *
   * @default true
   */
  autoResize: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 是否启用 chart 无障碍模式。
   * 启用该配置项后会覆盖 options 中的 aria。
   *
   * @default false
   */
  showAria: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * chart 图表配置项。
   *
   * @default {}
   */
  options: {
    type: Object as PropType<echarts.EChartsCoreOption>,
    default: () => ({}),
  },
  /**
   *
   * @description
   * chart 渲染成功回调函数。
   *
   * @default null
   */
  onSuccess: {
    type: [Function, Array] as PropType<MaybeArray<(e: ECharts) => void>>,
    default: null,
  },
  /**
   *
   * @description
   * chart 渲染失败回调函数。
   *
   * @default null
   */
  onError: {
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
    default: null,
  },
  /**
   *
   * @description
   * chart 渲染结束后的回调函数，不论是否成功都会执行。
   */
  onFinally: {
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
    default: null,
  },
  /**
   *
   * @description
   * 手动指定 chart 主题配置项。
   *
   * @default null
   */
  theme: {
    type: String as PropType<ChartTheme>,
    default: null,
  },
  /**
   *
   * @description
   * 是否自动跟随模板主题切换。
   * 该配置项会覆盖 theme 配置项。
   *
   * @default true
   */
  autoChangeTheme: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 手动拓展 chart 图的相关组件。
   *
   * 该配置项不支持动态调用，及时动态更新了该属性，也不会生效。
   * 并且，该配置项必须在 RChart 组件初始化时候配置。
   *
   * @default []
   */
  use: {
    type: Array as PropType<EChartsExtensionInstallRegisters[]>,
    default: () => [],
  },
  /**
   *
   * @description
   * 是否开启 watch 监听 options 配置项。
   *
   * @default true
   */
  watchOptions: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 是否启用 chart 加载动画。
   *
   * @default false
   */
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * chart 加载动画配置项。
   *
   * @default {}
   */
  loadingOptions: {
    type: Object as PropType<LoadingOptions>,
    default: () => loadingOptions(),
  },
  /**
   *
   * @description
   * 手动设置 autoResize 监听的元素。
   * 该元素必须是一个有效的 DOM 元素，并且需要开启 autoResize 才能生效。
   *
   * 默认以图表容器元素作为监听对象。
   *
   * @default null
   */
  autoResizeObserverTarget: {
    type: Object as PropType<MaybeComputedElementRef<MaybeElement>>,
    default: null,
  },
  /**
   *
   * @description
   * 是否开启 watchThrottle 监听 options 配置项更新。
   * 该配置项适合在需要频繁更新 chart options 的场景下使用。
   *
   * 但是该配置项需要开启 watchOptions 才能生效。
   *
   * @default 500
   */
  watchOptionsThrottleWait: {
    type: Number,
    default: 500,
  },
  /**
   *
   * @description
   * 是否将渲染放置下一个队列。
   *
   * @default true
   */
  nextTick: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 设置 setOptions 方法配置项。
   *
   * @default {notMerge:false,lazyUpdate:true,silent:false,replaceMerge:[]}
   */
  setChartOptions: {
    type: Object as PropType<SetOptionOpts>,
    default: () => ({
      notMerge: false,
      lazyUpdate: true,
      silent: false,
      replaceMerge: [],
    }),
  },
  /**
   *
   * @description
   * RChart 注册挂载成功后触发的事件。
   * 可以结合 useChart 方法中的 register 方法使用，然后便捷的使用 hooks。
   *
   * @default null
   */
  onRegister: {
    type: [Function, Array] as PropType<
      MaybeArray<(chartInst: ECharts, render: VoidFC, dispose: VoidFC) => void>
    >,
    default: null,
  },
} as const

export default props
