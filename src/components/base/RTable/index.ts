import type { ExtractPublicPropTypes } from 'vue'
import useCheckedRowKeys from './src/hooks/useCheckedRowKeys'
import type { UseCheckedRowKeysReturn } from './src/hooks/useCheckedRowKeys'
import useTable from './src/hooks/useTable'
import type { UseTableReturn } from './src/hooks/useTable'
import tableProps from './src/props'
import RTable from './src/Table'
import type * as RTableType from './src/types'

export type TableProps = ExtractPublicPropTypes<typeof tableProps>
export type { RTableType, UseTableReturn, UseCheckedRowKeysReturn }

export { RTable, tableProps, useTable, useCheckedRowKeys }
