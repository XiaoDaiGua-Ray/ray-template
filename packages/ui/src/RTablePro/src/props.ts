import { omit, pick } from 'lodash-es'
import { dataTableProps } from 'naive-ui'
import type { DataTableColumn, DataTableInst, DropdownOption } from 'naive-ui'
import type { ExtractPropTypes, PropType, VNode } from 'vue'
import type { TableProPrintOptions, TableProRowContext } from './types'

const panelControls = {
  bare: Boolean,
  autoHeight: Boolean,
  tool: { type: Boolean, default: true },
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
  ...dataTableProps,
  ...panelControls,
  rowActionsDisabled: Boolean,
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
  ]),
)

export const toNativeTableProps = (
  props: ExtractPropTypes<typeof tablePanelProps>,
) => pick(props, nativeTableKeys)

const managedPanelKeys = [
  'data',
  'pagination',
  'remote',
  'loading',
  'rowActionsDisabled',
  'onUpdatePage',
  'onUpdate:page',
  'onPageChange',
  'onUpdatePageSize',
  'onUpdate:pageSize',
  'onPageSizeChange',
] as const

const panelKeys = keysOf(omit(tablePanelProps, managedPanelKeys))

export const toPanelProps = <
  Props extends Pick<
    ExtractPropTypes<typeof tablePanelProps>,
    (typeof panelKeys)[number]
  >,
>(
  props: Props,
) => pick(props, panelKeys)

export default omit(tablePanelProps, ['rowActionsDisabled'])
