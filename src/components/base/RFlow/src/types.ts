import type LogicFlow from '@logicflow/core'
import type { Recordable, SetRequired } from '@/types'

/**
 *
 * @description
 * 因为 Omit 剔除属性，会导致类型提示丢失。
 * 所以，这里手动的声明 Options 所需属性，避免这个问题。
 *
 * 后期改动的时候，需要关注官方的文档变更情况，及时的同步跟新。
 */
type OptionsPickKeys =
  | 'width'
  | 'height'
  | 'background'
  | 'grid'
  | 'partial'
  | 'keyboard'
  | 'style'
  | 'edgeType'
  | 'adjustEdge'
  | 'textMode'
  | 'edgeTextMode'
  | 'nodeTextMode'
  | 'allowRotate'
  | 'allowResize'
  | 'isSilentMode'
  | 'stopScrollGraph'
  | 'stopZoomGraph'
  | 'stopMoveGraph'
  | 'animation'
  | 'history'
  | 'outline'
  | 'snapline'
  | 'textEdit'
  | 'guards'
  | 'overlapMode'
  | 'plugins'
  | 'pluginsOptions'
  | 'disabledPlugins'
  | 'disabledTools'
  | 'idGenerator'
  | 'edgeGenerator'
  | 'customTrajectory'

export type G = Parameters<LogicFlow['render']>[0]

export type NodeConfig = SetRequired<NonNullable<G['nodes']>[0], 'id'> &
  Recordable

export type EdgeConfig = SetRequired<NonNullable<G['edges']>[0], 'id'> &
  Recordable

export interface FlowGraphData {
  nodes?: NodeConfig[]
  edges?: EdgeConfig[]
}

export type FlowOptions = Pick<LogicFlow['options'], OptionsPickKeys>

export type ExtensionType = Parameters<typeof LogicFlow.use>[0]
