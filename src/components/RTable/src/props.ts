/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { dataTableProps } from 'naive-ui'

import type { PropType, VNode, VNodeChild } from 'vue'
import type { MaybeArray } from '@/types/modules/utils'
import type { DropdownOption, DataTableColumn } from 'naive-ui'
import type { DownloadTableOptions, PrintTableOptions } from './type'

const props = {
  ...dataTableProps,
  title: {
    /**
     *
     * 表格标题
     * 支持自定义渲染
     */
    type: [String, Number, Object] as PropType<VNode | string | number>,
    default: null,
  },
  toolOptions: {
    /** 自定义拓展工具栏 */
    type: Array as PropType<(VNode | (() => VNode))[]>,
  },
  coverTool: {
    /** 当 toolOptions 配置时，是否覆盖原工具栏 */
    type: Boolean,
    default: false,
  },
  contextMenuOptions: {
    /**
     *
     * 右键菜单配置项
     * 基于 `NDropdown` 实现
     */
    type: Array as PropType<DropdownOption[]>,
  },
  disabledContextMenu: {
    /**
     *
     * 是否禁用右键菜单
     * 如果设置为 false 则不会唤起右键菜单
     */
    type: Boolean,
    default: false,
  },
  onContextMenuClick: {
    /** 右键菜单点击 */
    type: [Function, Array] as PropType<
      MaybeArray<(key: string | number, option: DropdownOption) => void>
    >,
    default: null,
  },
  downloadTableOptions: {
    /**
     *
     * 配置下载表格内容为 excel 的配置项
     */
    type: Object as PropType<DownloadTableOptions>,
    default: () => ({}),
  },
  wrapperBordered: {
    /**
     *
     * 表格容器边框
     * 与表格边框为两个不同配置项
     */
    type: Boolean,
    default: false,
  },
  printTableOptions: {
    /**
     *
     * 配置打印表格配置项
     */
    type: Object as PropType<PrintTableOptions>,
    default: () => ({}),
  },
  onDownloadSuccess: {
    /** 导出表格成功回调 */
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
    default: null,
  },
  onDownloadError: {
    /** 导出表格失败回调 */
    type: [Function, Array] as PropType<MaybeArray<() => void>>,
    default: null,
  },
  onUpdateColumns: {
    type: [Function, Array] as PropType<
      MaybeArray<(arr: DataTableColumn[]) => void>
    >,
    default: null,
  },
  'onUpdate:columns': {
    type: [Function, Array] as PropType<
      MaybeArray<(arr: DataTableColumn[]) => void>
    >,
    default: null,
  },
}

export default props
