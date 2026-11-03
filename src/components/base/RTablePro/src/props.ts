import { dataTableProps } from 'naive-ui'
import type { DataTableColumn, DataTableInst, DropdownOption } from 'naive-ui'
import type { PropType, VNode } from 'vue'
import type { TableProPrintOptions } from './types'

const props = {
  ...dataTableProps,
  bare: Boolean,
  autoHeight: Boolean,
  tool: { type: Boolean, default: true },
  title: [String, Object] as PropType<string | VNode>,
  downloadCsvTableOptions: Object as PropType<
    Parameters<DataTableInst['downloadCsv']>[0]
  >,
  printTableOptions: Object as PropType<TableProPrintOptions>,
  columnStateKey: String,
  contextMenuOptions: Array as PropType<DropdownOption[]>,
  onContextMenuClick: Function as PropType<
    (key: string | number, option: DropdownOption) => void
  >,
  'onUpdate:columns': Function as PropType<
    (columns: DataTableColumn[]) => void
  >,
} as const

export default props
