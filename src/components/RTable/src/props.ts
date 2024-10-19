import { dataTableProps } from 'naive-ui'

import type { PropType, VNode } from 'vue'
import type { MaybeArray } from '@/types'
import type { DropdownOption, DataTableColumn } from 'naive-ui'
import type {
  DownloadCsvTableOptions,
  PrintTableOptions,
  RTableInst,
  RTableCardProps,
  UseTableRegister,
} from './types'
import type { Recordable } from '@/types'

const props = {
  ...dataTableProps,
  /**
   *
   * @description
   * 是否渲染外层容器 header，默认渲染。
   * 如果配置为 false，则不会显示外层容器的头部。
   *
   * @default true
   */
  renderWrapperHeader: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 配置表格外层容器 props，也就是 NCard 的配置项。
   */
  cardProps: {
    type: Object as PropType<RTableCardProps>,
    default: () => ({}),
  },
  /**
   *
   * @description
   * 是否启用表格工具栏。
   *
   * 当设置为 false 时，不会显示表格工具栏。不论是否配置了 toolOptions。
   *
   * @default true
   */
  tool: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 下载表格配置项。
   *
   * @default {}
   */
  downloadCsvTableOptions: {
    type: Object as PropType<DownloadCsvTableOptions>,
    default: () => ({}),
  },
  /**
   *
   * @description
   * 表格标题，支持 VNode。
   *
   * @default null
   */
  title: {
    type: [String, Number, Object] as PropType<VNode | string | number>,
    default: null,
  },
  /**
   *
   * @description
   * 自定义工具栏配置项。
   *
   * @default undefined
   */
  toolOptions: {
    type: Array as PropType<(VNode | (() => VNode))[]>,
  },
  /**
   *
   * @description
   * 是否覆盖原工具栏功能按钮。
   *
   * @default false
   */
  coverTool: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 右键菜单配置项。
   *
   * 基于 NDropdown 实现。
   *
   * @default undefined
   */
  contextMenuOptions: {
    type: Array as PropType<DropdownOption[]>,
  },
  /**
   *
   * @description
   * 是否禁用右键菜单。
   *
   * 如果设置为 false 则不会唤起右键菜单。
   *
   * @default false
   */
  disabledContextMenu: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 右键菜单点击事件回调。
   *
   * 该属性用于配置右键菜单点击事件。
   *
   * @default null
   */
  onContextMenuClick: {
    type: [Function, Array] as PropType<
      MaybeArray<(key: string | number, option: DropdownOption) => void>
    >,
    default: null,
  },
  /**
   *
   * @description
   * 表格容器边框。
   *
   * 与表格边框为两个不同配置项。
   *
   * @default true
   */
  wrapperBordered: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 表格边框。
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
   * 打印表格配置项。
   *
   * 基于 dom printDom 实现。
   *
   * @default {}
   */
  printTableOptions: {
    type: Object as PropType<PrintTableOptions>,
    default: () => ({}),
  },
  /**
   *
   * @description
   * 双向绑定列表列配置项事件。
   *
   * 当配置为 v-model:columns 时，或者是单独调用 onUpdateColumns 时，该属性生效。
   * 双向绑定语法糖事件。
   *
   * @default null
   */
  onUpdateColumns: {
    type: [Function, Array] as PropType<
      MaybeArray<(arr: DataTableColumn[]) => void>
    >,
    default: null,
  },
  /**
   *
   * @description
   * 双向绑定列表列配置项事件。
   *
   * 当配置为 v-model:columns 时，或者是单独调用 onUpdateColumns 时，该属性生效。
   * 双向绑定语法糖事件。
   *
   * @default null
   */
  'onUpdate:columns': {
    type: [Function, Array] as PropType<
      MaybeArray<(arr: DataTableColumn[]) => void>
    >,
    default: null,
  },
  /**
   *
   * @description
   * 该属性用于启用右键菜单后被 Table 强行代理后的右键点击事件回调。
   *
   * 当右键菜单不启用时，不生效。只需要使用 rowProps 属性配置右键菜单事件即可。
   *
   * @default null
   */
  onContextmenu: {
    type: [Function, Array] as PropType<
      MaybeArray<(row: Recordable, index: number, e: MouseEvent) => void>
    >,
    default: null,
  },
  /**
   *
   * @description
   * RTable 注册挂载成功后触发的事件。
   * 可以结合 useTable 方法中的 register 方法使用，然后便捷的使用 hooks。
   *
   * @default null
   */
  onRegister: {
    type: [Function, Array] as PropType<MaybeArray<UseTableRegister>>,
    default: null,
  },
} as const

export default props
