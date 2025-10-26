import { RTable } from '../../../base/RTable'
import { NFlex } from 'naive-ui'

import props from './props'
import useTable from '../../../base/RTable/src/hooks/useTable'
import { call, removeDuplicateKeys } from '@/utils'
import { usePagination } from '@/hooks'
import { omit } from 'lodash-es'

import type { TablePagination, TableRequestConfig, TableProInst } from './types'
import type { RTableInst } from '../../..'

export default defineComponent({
  name: 'RTablePro',
  props,
  setup(props, ctx) {
    const { expose } = ctx
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
        setPage,
        setPageSize,
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

    // 同步执行 request 请求，允许重置 pagination 请求，返回 Promise 对象
    const runResetPaginationRequest: TableProInst['runTableRequest'] = (
      extraConfig,
      reset = true,
    ) => {
      if (reset) {
        resetPagination()
      }

      const requestParams = combineRequestParams(extraConfig)

      tableRequestRef.value?.(requestParams)
    }

    // 异步执行 request 请求，允许重置 pagination 请求，返回 Promise 对象
    const runResetPaginationRequestAsync: TableProInst['runAsyncTableRequest'] =
      (extraConfig, reset = true) => {
        return new Promise((resolve, reject) => {
          try {
            runResetPaginationRequest(extraConfig, reset)

            resolve(void 0)
          } catch (e) {
            reject(e)
          }
        })
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
          ...(tableFns as unknown as RTableInst),
          getTablePagination: update,
          runTableRequest: runResetPaginationRequest,
          runAsyncTableRequest: runResetPaginationRequestAsync,
          getCurrentTableRequestParams: combineRequestParams,
          resetTablePagination: resetPagination,
          setPage,
          setPageSize,
          getPage,
          getPageSize,
        })
      }
    })
    expose()

    return {
      register,
      paginationRef,
    }
  },
  render() {
    const { register, $props, paginationRef, $slots } = this
    const {
      onRegister,
      showPagination,
      takeoverAutoHeight,
      flexAutoHeight,
      ...rest
    } = $props
    const baseProps = {
      onRegister: register,
      pagination: showPagination ? paginationRef : void 0,
    }
    const { collapse, ...restSlots } = $slots

    if (takeoverAutoHeight) {
      return (
        <NFlex vertical class="flex-vertical">
          {{
            default: () => (
              <>
                {collapse?.()}
                <RTable {...baseProps} {...rest} flexAutoHeight>
                  {{
                    ...restSlots,
                  }}
                </RTable>
              </>
            ),
          }}
        </NFlex>
      )
    } else {
      return (
        <RTable {...baseProps} {...rest} flexAutoHeight={flexAutoHeight}>
          {{
            ...restSlots,
          }}
        </RTable>
      )
    }
  },
})
