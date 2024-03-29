import RTable from './src/Table'
import tableProps from './src/props'
import useTable from './src/hooks/useTable'

import type * as RTableType from './src/types'
import type { UseTableReturn } from './src/hooks/useTable'
import type { ExtractPublicPropTypes } from 'vue'

export type TableProps = ExtractPublicPropTypes<typeof tableProps>
export type { RTableType, UseTableReturn }

export { RTable, tableProps, useTable }
