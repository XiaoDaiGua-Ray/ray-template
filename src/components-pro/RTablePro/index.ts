import RTablePro from './src/TablePro'
import tableProProps from './src/props'
import { useTablePro } from './src/hooks/useTablePro'

import type { ExtractPropTypes } from 'vue'

type TableProProps = ExtractPropTypes<typeof tableProProps>

export type { TableProProps }

export { RTablePro, useTablePro, tableProProps }
