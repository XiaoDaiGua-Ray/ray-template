import { omit, pick } from 'lodash-es'
import { dataTableProps } from 'naive-ui'
import type { DataTableColumn, DataTableInst, DropdownOption } from 'naive-ui'
import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type {
  TableProImageOptions,
  TableProPrintOptions,
  TableProRowContext,
} from './types'

const panelControls = {
  bare: Boolean,
  autoHeight: Boolean,
  tool: { type: Boolean, default: true },
  /** 是否在更多操作菜单显示打印，实例 print 方法始终可按需调用 */
  showPrint: Boolean,
  /** 是否显示复制表格图片按钮，默认显示；实例 copyImage 方法不受该开关影响 */
  showCopyImage: { type: Boolean, default: true },
  copyImageOptions: Object as PropType<TableProImageOptions>,
  title: [String, Object] as PropType<string | VNode>,
  downloadCsvTableOptions: Object as PropType<
    Parameters<DataTableInst['downloadCsv']>[0]
  >,
  printTableOptions: Object as PropType<TableProPrintOptions>,
  columnStateKey: String,
  onResetColumnLayout: Function as PropType<() => void>,
  contextMenuOptions: Array as PropType<DropdownOption[]>,
  onContextMenuClick: Function as PropType<
    (
      key: string | number,
      option: DropdownOption,
      context: TableProRowContext,
    ) => void
  >,
  'onUpdate:columns': Function as PropType<
    (columns: DataTableColumn[]) => void
  >,
} as const

export const tablePanelProps = {
  ...omit(dataTableProps, ['onPageChange', 'onPageSizeChange']),
  ...panelControls,
  rowActionsDisabled: Boolean,
  /** 由查询层提供；手动 data 模式通过自定义工具栏提供刷新 */
  reload: Function as PropType<() => Promise<void>>,
}

const keysOf = <T extends object>(value: T) => Object.keys(value) as (keyof T)[]

const nativeTableKeys = keysOf(
  omit(dataTableProps, [
    'columns',
    'pagination',
    'rowProps',
    'size',
    'striped',
    'bordered',
    'flexHeight',
    'onPageChange',
    'onPageSizeChange',
  ]),
)

/**
 *
 * @param props 表格面板接收的完整属性
 *
 * @returns 交给 NDataTable 的原生属性，排除面板拥有的状态和包装参数
 */
export const toNativeTableProps = (
  props: ExtractPropTypes<typeof tablePanelProps>,
) => pick(props, nativeTableKeys)

const managedPanelKeys = [
  'data',
  'pagination',
  'remote',
  'loading',
  'rowActionsDisabled',
  'reload',
  'onUpdatePage',
  'onUpdate:page',
  'onUpdatePageSize',
  'onUpdate:pageSize',
] as const

const panelKeys = keysOf(omit(tablePanelProps, managedPanelKeys))

/**
 *
 * @param props RTablePro 接收的完整属性
 *
 * @returns 交给面板的属性，排除查询层负责的数据、分页和事件
 */
export const toPanelProps = <
  Props extends Pick<
    ExtractPropTypes<typeof tablePanelProps>,
    (typeof panelKeys)[number]
  >,
>(
  props: Props,
) => pick(props, panelKeys)

export default omit(tablePanelProps, ['rowActionsDisabled', 'reload'])
