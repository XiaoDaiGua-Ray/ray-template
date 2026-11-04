import { call } from '@ray-template/composables/vue/call'
import { NAlert, NButton } from 'naive-ui'
import type { PaginationProps } from 'naive-ui'
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  ref,
  shallowRef,
  watch,
} from 'vue'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import Search from './components/Search'
import { useTableLocale } from './locale'
import tableProps from './props'
import TablePanel from './TablePanel'
import type {
  TablePanelInst,
  TableProParams,
  TableProRequest,
  TableProResult,
  TableProSearchField,
  TableSearchValues,
} from './types'

const positiveInteger = (value: number) =>
  Number.isSafeInteger(value) && value > 0

const props = {
  ...tableProps,
  pagination: {
    type: [Boolean, Object] as PropType<boolean | PaginationProps>,
    default: void 0,
  },
  pageSize: { type: Number, default: 10 },
  request: Function as PropType<TableProRequest>,
  params: Object,
  search: Array as PropType<TableProSearchField[]>,
  rowKey: {
    type: tableProps.rowKey,
    default: (row: { id?: string | number; key?: string | number }) =>
      row.id ?? row.key,
  },
}

export type TableProProps = ExtractPublicPropTypes<typeof props>

export interface TableProInst extends TablePanelInst {
  reload: (resetPage?: boolean) => Promise<void>
  setPage: (page: number) => Promise<void>
  setPageSize: (pageSize: number) => Promise<void>
}

export default defineComponent({
  name: 'RTablePro',
  inheritAttrs: false,
  props,
  emits: { 'request-error': (_error: unknown) => true },
  setup(props, { attrs, slots, expose, emit }) {
    const { t } = useTableLocale()
    const table = shallowRef<TablePanelInst>()
    const result = shallowRef<TableProResult>({ data: [], total: 0 })
    const loading = ref(false)
    const failed = ref(false)
    const searchValues = shallowRef<TableSearchValues>({})
    const pagination = computed(() => props.pagination ?? !props.bare)
    const pagerOptions = computed(() =>
      typeof props.pagination === 'object' ? props.pagination : void 0,
    )
    const configuredPageSize = computed(() => {
      const size =
        pagerOptions.value?.pageSize ??
        pagerOptions.value?.defaultPageSize ??
        props.pageSize

      return positiveInteger(size) ? size : 10
    })
    const firstPage = pagerOptions.value?.defaultPage ?? 1
    const page = ref(positiveInteger(firstPage) ? firstPage : 1)
    const pageSize = ref(configuredPageSize.value)
    const localRows = computed(() => {
      const entries = Object.entries(searchValues.value)

      if (!entries.length) return props.data

      const selects = new Set(
        props.search?.filter(({ options }) => options).map(({ key }) => key),
      )

      return props.data.filter((row) =>
        entries.every(([key, value]) => {
          const cell = row[key]

          return typeof value === 'number' || selects.has(key)
            ? cell === value
            : String(cell ?? '')
                .toLowerCase()
                .includes(value.toLowerCase())
        }),
      )
    })
    let pending: AbortController | undefined

    const reload = async (resetPage = false) => {
      if (resetPage) page.value = 1

      pending?.abort()
      failed.value = false
      const { request, params } = props

      if (!request) {
        pending = void 0
        loading.value = false

        return
      }

      const current = new AbortController()

      pending = current
      loading.value = true

      // 分页字段由表格统一管理，筛选参数不能覆盖当前页码。
      const query: TableProParams = { ...params, ...searchValues.value }

      if (pagination.value !== false) {
        query.page = page.value
        query.pageSize = pageSize.value
      } else {
        delete query.page
        delete query.pageSize
      }

      try {
        const response = await request(query, current.signal)

        // 快速切页或筛选时，只接收最后一次请求的结果。
        if (current.signal.aborted) return

        if (
          !Array.isArray(response.data) ||
          !Number.isSafeInteger(response.total) ||
          response.total < 0
        ) {
          throw new TypeError(
            '[RTablePro] Expected { data: Row[], total: number }.',
          )
        }

        const lastPage = Math.max(1, Math.ceil(response.total / pageSize.value))

        if (pagination.value !== false && page.value > lastPage) {
          page.value = lastPage

          if (response.total) {
            await reload()

            return
          }
        }

        result.value = response
      } catch (error) {
        if (current.signal.aborted) return

        failed.value = true
        emit('request-error', error)
      } finally {
        if (pending === current) {
          pending = void 0
          loading.value = false
        }
      }
    }

    const setPage = async (value: number) => {
      if (!positiveInteger(value) || page.value === value) return

      page.value = value
      await reload()
    }

    const setPageSize = async (value: number) => {
      if (!positiveInteger(value) || pageSize.value === value) return

      pageSize.value = value
      await reload(true)
    }

    const submitSearch = (values: TableSearchValues) => {
      searchValues.value = values

      return reload(true)
    }

    watch(
      [
        () => props.request,
        () => props.params,
        () => pagination.value === false,
        configuredPageSize,
      ],
      (_values, previous) => {
        void reload(previous.length > 0)
      },
      { deep: true, immediate: true },
    )
    watch(
      configuredPageSize,
      (value) => {
        pageSize.value = value
      },
      { flush: 'sync' },
    )
    onBeforeUnmount(() => {
      pending?.abort()
      pending = void 0
    })

    const instance: TableProInst = {
      reload,
      setPage,
      setPageSize,
      getTableInstance: () => table.value?.getTableInstance() ?? null,
      print: (options) => table.value?.print(options) ?? Promise.resolve(false),
      downloadCsv: (options) => table.value?.downloadCsv(options),
    }

    expose(instance)

    return () => {
      const {
        request,
        params,
        pagination: _pagination,
        pageSize: _pageSize,
        search,
        loading: externalLoading,
        remote,
        onUpdatePage,
        onUpdatePageSize,
        ...rest
      } = props
      const options = pagerOptions.value
      const { filters, error, notice, ...panelSlots } = slots
      const paginationProps: false | PaginationProps =
        pagination.value === false
          ? false
          : {
              showSizePicker: true,
              pageSizes: [10, 20, 50, 100],
              prefix: ({ itemCount }) => t('total', { count: itemCount }),
              ...options,
              page: request ? page.value : (options?.page ?? page.value),
              pageSize: request
                ? pageSize.value
                : (options?.pageSize ?? pageSize.value),
              ...(request
                ? { itemCount: result.value.total, pageCount: void 0 }
                : {}),
            }

      return (
        <TablePanel
          {...attrs}
          {...rest}
          ref={table}
          remote={!!request || remote}
          data={request ? result.value.data : localRows.value}
          loading={loading.value || externalLoading}
          pagination={paginationProps}
          onUpdatePage={(value) => {
            void setPage(value)

            if (onUpdatePage) call(onUpdatePage, value)
          }}
          onUpdatePageSize={(value) => {
            void setPageSize(value)

            if (onUpdatePageSize) call(onUpdatePageSize, value)
          }}
        >
          {{
            ...panelSlots,
            filters: filters
              ? () => filters({ submit: submitSearch })
              : search?.length
                ? () => <Search fields={search} onSearch={submitSearch} />
                : void 0,
            notice: () =>
              failed.value
                ? (error?.({ reload }) ?? (
                    <NAlert type="error" title={t('requestError')}>
                      <NButton size="small" secondary onClick={() => reload()}>
                        {t('retry')}
                      </NButton>
                    </NAlert>
                  ))
                : notice?.(),
          }}
        </TablePanel>
      )
    }
  },
})
