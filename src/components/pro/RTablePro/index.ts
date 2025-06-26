import RTablePro from './src/TablePro'
import tableProProps from './src/props'
import { useTablePro } from './src/hooks/useTablePro'

import type { ExtractPropTypes } from 'vue'
import type {
  BasePagination,
  TablePagination,
  FormatRangeTime,
  TableRequestConfig,
  TableProFieldNames,
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
