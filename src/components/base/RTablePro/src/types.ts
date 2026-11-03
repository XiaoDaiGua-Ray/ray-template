import type { BasicTarget } from '@/types'
import type { DataTableInst, DataTableProps, SelectOption } from 'naive-ui'
import type { LeafColumn } from './columns'

export interface TableProPrintOptions {
  target?: BasicTarget<HTMLElement>
  title?: string
  style?: string
  formatHeader?: (column: LeafColumn) => string
  formatCell?: (
    value: unknown,
    row: Record<string, unknown>,
    column: LeafColumn,
  ) => string
}

export interface TablePanelInst {
  getTableInstance: () => DataTableInst | null
  print: (options?: TableProPrintOptions) => Promise<boolean>
  downloadCsv: DataTableInst['downloadCsv']
}

export interface TableProParams extends Record<string, unknown> {
  page?: number
  pageSize?: number
}

export interface TableProResult {
  data: NonNullable<DataTableProps['data']>
  total: number
}

export type TableProRequest = (
  params: TableProParams,
  signal: AbortSignal,
) => Promise<TableProResult>

export type TableProSearchField = {
  key: string
  label: string
  placeholder?: string
  options?: SelectOption[]
}

export type TableSearchValues = Record<string, string | number>
export type PropsComponentPopselectKeys = 'striped' | 'bordered'
