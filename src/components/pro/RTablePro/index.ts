import type { ExtractPropTypes } from 'vue'
import { useTablePro } from './src/hooks/useTablePro'
import tableProProps from './src/props'
import RTablePro from './src/TablePro'
import type {
  BasePagination,
  FormatRangeTime,
  TablePagination,
  TableProFieldNames,
  TableRequestConfig,
} from './src/types'

type TableProProps = ExtractPropTypes<typeof tableProProps>

export type {
  TableProProps,
  BasePagination,
  TablePagination,
  FormatRangeTime,
  TableRequestConfig,
  TableProFieldNames,
}

export { RTablePro, useTablePro, tableProProps }
