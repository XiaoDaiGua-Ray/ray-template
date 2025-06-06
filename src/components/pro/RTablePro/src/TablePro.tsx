import { RTable } from '../../../base/RTable'

import props from './props'
import useTable from '../../../base/RTable/src/hooks/useTable'
import { call, removeDuplicateKeys } from '@/utils'
import { usePagination } from '@/hooks'
import { omit } from 'lodash-es'

import type { TablePagination, TableRequestConfig, TableProInst } from './types'

export default defineComponent({
  name: 'RTablePro',
  props,
  setup(props) {
    const [register, tableFns] = useTable()
    const [
      paginationRef,
      {
        getPage,
        getPageSize,
        setCallback,
        setItemCount,
        resetPagination,
        getItemCount,
      },
    ] = usePagination(void 0, {
      prefix: props.paginationPrefix,
    })
    const tableRequestRef = computed(() => props.request)

    // 获取最新 statistics 和 pagination 值
    const update = (): TablePagination => {
      const page = getPage()
      const pageSize = getPageSize()
      const itemCount = getItemCount()

      return {
        page,
        pageSize,
        itemCount,
      }
    }

    // 派发表格更新事件
    const emitTableUpdate = () => {
      const { onTablePaginationUpdate } = props

      if (onTablePaginationUpdate) {
        call(onTablePaginationUpdate, update())
      }
    }

    // 合并请求参数
    const combineRequestParams = (extraConfig?: TableRequestConfig) => {
      const config = Object.assign({}, props.requestConfig, extraConfig)

      const { formatRangeTime, excludeParams } = config
      let params = config.params || {}

      // 转换时间范围，该功能仅支持 NDatePicker range 模式参数
      if (formatRangeTime?.length && params) {
        formatRangeTime.forEach((curr) => {
          const { key, target } = curr
          const val = params[key] as [number, number] | null

          if (val && target?.length) {
            const [start, end] = val

            params[target[0]] = start
            params[target[1]] = end
          } else {
            // 当传递时间参数被清空时，则清空对应 time key
            params[key] = null
            params[target[0]] = null
            params[target[1]] = null
          }
        })
      }

      params = removeDuplicateKeys(params)

      // 排除指定的请求参数
      if (excludeParams) {
        params = omit(params, excludeParams)
      }

      const requestParams = Object.assign({}, params, {
        page: getPage(),
        pageSize: getPageSize(),
      })

      return requestParams
    }

    // 会重置 pagination 的请求，默认会重置
    const runResetPaginationRequest = (
      extraConfig?: TableRequestConfig,
      reset = true,
    ) => {
      if (reset) {
        resetPagination()
      }

      const requestParams = combineRequestParams(extraConfig)

      tableRequestRef.value?.(requestParams)
    }

    watchEffect(() => {
      setItemCount(props.paginationCount)
      setCallback(() => {
        const { manual } = props

        if (!manual) {
          runResetPaginationRequest(void 0, false)
        }

        emitTableUpdate()
      })
    })

    onMounted(() => {
      const { onRegister } = props

      if (onRegister) {
        call(onRegister, {
          ...tableFns,
          getTablePagination: update,
          runTableRequest: runResetPaginationRequest,
          getCurrentTableRequestParams: combineRequestParams,
          resetTablePagination: resetPagination,
        } as unknown as TableProInst)
      }
    })

    return {
      register,
      paginationRef,
    }
  },
  render() {
    const { register, $props, paginationRef, $slots } = this
    const { onRegister, showPagination, ...rest } = $props

    return (
      <RTable
        {...rest}
        onRegister={register}
        pagination={showPagination ? paginationRef : void 0}
      >
        {$slots}
      </RTable>
    )
  },
})
