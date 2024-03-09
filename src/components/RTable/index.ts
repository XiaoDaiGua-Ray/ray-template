import RTable from './src/Table'
import tableProps from './src/props'

import type * as RTableType from './src/types'
import type { ExtractPublicPropTypes } from 'vue'

export type TableProps = ExtractPublicPropTypes<typeof tableProps>
export type { RTableType }

export { RTable, tableProps }
