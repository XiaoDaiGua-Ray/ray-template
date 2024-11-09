import { getDefaultFlowOptions } from './constant'

import type { FlowGraphData, FlowOptions, ExtensionType } from './types'
import type LogicFlow from '@logicflow/core'
import type { MaybeArray } from '@/types'

const props = {
  /**
   *
   * @description
   * 自定义全局插件。
   * 需要在流程图初始化之前注册，否则无效。
   *
   * 需要在引入插件之前，导入对应的基础 css 文件。
   *
   * @see https://site.logic-flow.cn/tutorial/extension/intro
   */
  use: {
    type: Array as PropType<ExtensionType[]>,
    default: void 0,
  },
  /**
   *
   * @description
   * 是否主动监听 data 变化，重新渲染流程图。
   */
  watchData: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 流程图是否可以编辑与操作。
   *
   * 该配置项会覆盖 options 配置项，拥有最高的优先级。
   *
   * @default false
   */
  readonly: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 流程图宽度。
   *
   * @default '100%'
   */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  /**
   *
   * @description
   * 流程图高度。
   *
   * @default '100%'
   */
  height: {
    type: [String, Number] as PropType<string | number>,
    default: '100%',
  },
  /**
   *
   * @description
   * 流程图数据。
   *
   * @default undefined
   */
  data: {
    type: Object as PropType<FlowGraphData>,
    default: void 0,
  },
  /**
   *
   * @description
   * 流程图配置项。
   *
   * @default undefined
   */
  options: {
    type: Object as PropType<FlowOptions>,
    default: getDefaultFlowOptions(),
  },
  /**
   *
   * @description
   * RFlow 注册挂载成功后触发的事件。
   * 可以结合 useFlow 方法中的 register 方法使用，然后便捷的使用 hooks。
   *
   * @default undefined
   */
  onRegister: {
    type: [Function, Array] as PropType<
      MaybeArray<(flowInst: LogicFlow) => void>
    >,
    default: void 0,
  },
}

export default props
