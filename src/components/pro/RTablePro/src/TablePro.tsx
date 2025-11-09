import { RTable } from '../../../base/RTable'
import { NFlex } from 'naive-ui'

import props from './props'
import useTable from '../../../base/RTable/src/hooks/useTable'
import { call, removeDuplicateKeys } from '@/utils'
import { usePagination } from '@/hooks'
import { omit } from 'lodash-es'

import type { TablePagination, TableRequestConfig, TableProInst } from './types'
import type { RTableInst } from '../../..'
import type { Recordable } from '@/types'

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
    // 获取最新 pagination 值 - 使用 computed 避免函数重新创建
    const tablePagination = computed<TablePagination>(() => ({
      page: getPage(),
      pageSize: getPageSize(),
      itemCount: getItemCount(),
    }))

    // 派发表格更新事件
    const emitTableUpdate = () => {
      const { onTablePaginationUpdate } = props

      if (onTablePaginationUpdate) {
        call(onTablePaginationUpdate, tablePagination.value)
      }
    }

    // 合并请求参数
    const combineRequestParams = <T extends Recordable>(
      extraConfig?: TableRequestConfig<T>,
    ) => {
      const config = Object.assign({}, props.requestConfig, extraConfig)

      const {
        formatRangeTime,
        excludeParams,
        autoDeleteDuplicateKeys = true,
      } = config
      let params: Recordable = config.params || {}

      // 转换时间范围，该功能仅支持 NDatePicker range 模式参数
      if (formatRangeTime?.length && params) {
        formatRangeTime.forEach(({ key, target }) => {
          const val = params[key] as [number, number] | null

          if (val && target?.length === 2) {
            params[target[0]] = val[0]
            params[target[1]] = val[1]
          }

          // 清空时间参数的 key
          delete params[key]
        })
      }

      if (autoDeleteDuplicateKeys) {
        params = removeDuplicateKeys(params)
      }

      // 排除指定的请求参数
      if (excludeParams) {
        params = omit(params, excludeParams)
      }

      const requestParams = Object.assign({}, params, {
        page: getPage(),
        pageSize: getPageSize(),
      })

      return requestParams as T & { page: number; pageSize: number }
    }

    // 同步执行 request 请求，允许重置 pagination 请求
    const runResetPaginationRequest: TableProInst['runTableRequest'] = (
      extraConfig,
      reset = true,
    ) => {
      if (reset) {
        resetPagination()
      }

      const requestParams = combineRequestParams(extraConfig)

      props.request?.(requestParams)
    }

    // 异步执行 request 请求，允许重置 pagination 请求，返回 Promise 对象
    const runResetPaginationRequestAsync: TableProInst['runAsyncTableRequest'] =
      async (extraConfig, reset = true) => {
        if (reset) {
          resetPagination()
        }

        const requestParams = combineRequestParams(extraConfig)

        await props.request?.(requestParams)
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
          getTablePagination: () => tablePagination.value,
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
    const { collapse, ...restSlots } = $slots
    const baseProps = {
      onRegister: register,
      pagination: showPagination ? paginationRef : void 0,
      flexAutoHeight: takeoverAutoHeight || flexAutoHeight,
      ...rest,
    }

    if (takeoverAutoHeight) {
      return (
        <NFlex vertical class="h-full">
          {collapse?.()}
          <RTable {...baseProps}>{restSlots}</RTable>
        </NFlex>
      )
    }

    return <RTable {...baseProps}>{restSlots}</RTable>
  },
})
