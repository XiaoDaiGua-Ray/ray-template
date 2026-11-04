import { call } from '@ray-template/composables/vue/call'
import { NAlert, NButton } from 'naive-ui'
import type { PaginationProps } from 'naive-ui'
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onBeforeUpdate,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import Search from './components/Search'
import type { TableSearchFormInst } from './components/Search'
import { useTableLocale } from './locale'
import tableProps from './props'
import {
  copySearchValues,
  createSearchPredicate,
  isSearchArray,
  normalizeSearchValues,
  resolveSearchFields,
  resolveSearchOptions,
  sameSearchField,
  toSearchParams,
} from './search'
import TablePanel from './TablePanel'
import type {
  TablePanelInst,
  TableProColumn,
  TableProParams,
  TableProQueryState,
  TableProRequest,
  TableProResult,
  TableProSearchConfig,
  TableProSearchFieldConfig,
  TableProSearchSubmission,
  TableProSearchValues,
} from './types'
import { useTableSearch } from './useTableSearch'

const positiveInteger = (value: number) =>
  Number.isSafeInteger(value) && value > 0

const emptyRemoteRows: TableProResult['data'] = []
const emptySearchFields: readonly TableProSearchFieldConfig[] = []

const props = {
  ...tableProps,
  columns: {
    ...tableProps.columns,
    type: Array as PropType<TableProColumn[]>,
  },
  pagination: {
    type: [Boolean, Object] as PropType<boolean | PaginationProps>,
    default: void 0,
  },
  pageSize: { type: Number, default: 10 },
  request: Function as PropType<TableProRequest>,
  onRegister: Function as PropType<(instance: TableProInst) => void>,
  params: Object,
  search: {
    type: [Array, Object, Boolean] as PropType<TableProSearchConfig>,
    default: void 0,
  },
  rowKey: {
    type: tableProps.rowKey,
    default: (row: { id?: string | number; key?: string | number }) =>
      row.id ?? row.key,
  },
}

export type TableProProps = ExtractPublicPropTypes<typeof props>

export interface TableProInst extends TablePanelInst {
  readonly queryState: TableProQueryState | null
  reload: (resetPage?: boolean) => Promise<void>
  setPage: (page: number) => Promise<void>
  setPageSize: (pageSize: number) => Promise<void>
  getCurrentPageData: () => readonly Readonly<Record<string, unknown>>[]
  getSearchValues: (source?: 'draft' | 'applied') => TableProSearchValues
  setSearchValues: (values: TableProSearchValues) => void
  submitSearch: () => Promise<boolean>
  resetSearch: () => Promise<boolean>
}

function createSearchSnapshot(
  values: TableProSearchValues,
  fields: readonly TableProSearchFieldConfig[],
) {
  return {
    values,
    params: toSearchParams(fields, copySearchValues(values)),
    matches: createSearchPredicate(fields, values),
  }
}

export default defineComponent({
  name: 'RTablePro',
  inheritAttrs: false,
  props,
  emits: {
    'request-error': (_error: unknown) => true,
    'search-error': (_error: unknown) => true,
    search: (_submission: TableProSearchSubmission) => true,
  },
  setup(props, { attrs, slots, expose, emit }) {
    const { t } = useTableLocale()
    const table = shallowRef<TablePanelInst>()
    const result = shallowRef<TableProResult>()
    const requestPhase = ref<'idle' | 'loading' | 'failed'>('idle')
    const searchForm = useTemplateRef<TableSearchFormInst>('searchForm')
    const customFilters = ref(!!slots.filters)
    const searchFailed = ref(false)
    const searchOptions = computed(() => resolveSearchOptions(props.search))
    const searchFields = computed(() => {
      const options = searchOptions.value

      if (customFilters.value || !options) return emptySearchFields

      return resolveSearchFields(options, props.columns)
    })
    const searchModel = useTableSearch(
      () => searchFields.value,
      () => searchOptions.value,
      (isCurrent) =>
        searchFields.value.some((field) => field.type && field.rules)
          ? (searchForm.value?.validate(isCurrent) ?? true)
          : true,
      () => searchForm.value?.restoreValidation(),
      (values, reason) => applySearch(values, searchFields.value, reason),
    )
    const applied = shallowRef(createSearchSnapshot({}, emptySearchFields))

    try {
      applied.value = createSearchSnapshot(
        normalizeSearchValues(searchFields.value, searchModel.draft.value),
        searchFields.value,
      )
    } catch (error) {
      searchFailed.value = true
      emit('search-error', error)
    }

    const manualSearch = computed(
      () =>
        props.remote &&
        !!searchOptions.value &&
        !isSearchArray(props.search) &&
        !customFilters.value,
    )
    const pagination = computed(() => props.pagination ?? !props.bare)
    const paginated = computed(() => pagination.value !== false)
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
    const queryState = computed<TableProQueryState | null>(() => {
      if (!props.request) return null

      return Object.freeze({
        loading: requestPhase.value === 'loading',
        failed: requestPhase.value === 'failed',
        page: paginated.value ? page.value : null,
        pageSize: paginated.value ? pageSize.value : null,
        total: result.value?.total ?? null,
      })
    })
    const localRows = computed(() => {
      const { matches } = applied.value

      return matches && !manualSearch.value
        ? props.data.filter(matches)
        : props.data
    })
    let pending: AbortController | undefined

    const reload = async (resetPage = false) => {
      if (resetPage) page.value = 1

      pending?.abort()
      const { request, params } = props

      if (!request) {
        pending = void 0
        requestPhase.value = 'idle'

        return
      }

      const current = new AbortController()

      pending = current
      requestPhase.value = 'loading'

      // 分页字段由表格统一管理，筛选参数不能覆盖当前页码。
      const query: TableProParams = {
        ...params,
        ...copySearchValues(applied.value.params),
      }

      if (paginated.value) {
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

        if (paginated.value && page.value > lastPage) {
          page.value = lastPage

          if (response.total) {
            await reload()

            return
          }
        }

        result.value = response
      } catch (error) {
        if (current.signal.aborted) return

        requestPhase.value = 'failed'
        emit('request-error', error)
      } finally {
        if (pending === current) {
          pending = void 0

          if (requestPhase.value === 'loading') requestPhase.value = 'idle'
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

    async function applySearch(
      values: TableProSearchValues,
      fields: readonly TableProSearchFieldConfig[],
      reason?: TableProSearchSubmission['reason'],
    ) {
      let snapshot: ReturnType<typeof createSearchSnapshot>

      try {
        snapshot = createSearchSnapshot(copySearchValues(values), fields)
      } catch (error) {
        searchFailed.value = true
        emit('search-error', error)

        return false
      }

      searchFailed.value = false
      applied.value = snapshot
      page.value = 1

      if (reason) {
        emit('search', {
          values: copySearchValues(snapshot.values),
          params: copySearchValues(snapshot.params),
          reason,
        })
      }

      await reload()

      return true
    }

    const submitFilters = async (values: Record<string, string | number>) => {
      const fields =
        searchOptions.value?.fields?.filter(({ type }) => !type) ??
        emptySearchFields

      await applySearch(values, fields, 'submit')
    }

    onBeforeUpdate(() => {
      customFilters.value = !!slots.filters
    })
    watch(searchFields, (fields, previous) => {
      const previousByKey = new Map(previous.map((field) => [field.key, field]))
      const retainedKeys = new Set(
        fields
          .filter((field) =>
            sameSearchField(field, previousByKey.get(field.key)),
          )
          .map(({ key }) => key),
      )

      if (
        retainedKeys.size === fields.length &&
        fields.length === previous.length
      )
        return

      searchModel.reconcile(retainedKeys)
      const retained = Object.fromEntries(
        Object.entries(applied.value.values).filter(([key]) =>
          retainedKeys.has(key),
        ),
      )

      if (
        Object.keys(retained).length !==
        Object.keys(applied.value.values).length
      )
        void applySearch(normalizeSearchValues(fields, retained), fields)
    })

    watch(
      [() => props.request, () => props.params, paginated, configuredPageSize],
      (_values, previous) => {
        if (!previous.length && searchFailed.value) return

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
      get queryState() {
        return queryState.value
      },
      reload,
      setPage,
      setPageSize,
      getSearchValues: (source = 'draft') =>
        source === 'applied'
          ? copySearchValues(applied.value.values)
          : searchModel.getValues(),
      setSearchValues: (values) => {
        if (searchFields.value.length) searchModel.setValues(values)
      },
      submitSearch: () =>
        searchFields.value.length
          ? searchModel.submit()
          : Promise.resolve(false),
      resetSearch: () =>
        searchFields.value.length
          ? searchModel.reset()
          : Promise.resolve(false),
      getTableInstance: () => table.value?.getTableInstance() ?? null,
      getCurrentPageData: () =>
        table.value?.getTableInstance()?.getCurrentPageData() ?? [],
      print: (options) => table.value?.print(options) ?? Promise.resolve(false),
      downloadCsv: (options) => table.value?.downloadCsv(options),
    }

    expose(instance)
    onMounted(() => props.onRegister?.(instance))

    return () => {
      const {
        request,
        onRegister: _onRegister,
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
                ? { itemCount: result.value?.total ?? 0, pageCount: void 0 }
                : {}),
            }

      return (
        <TablePanel
          {...attrs}
          {...rest}
          ref={table}
          remote={!!request || remote}
          data={
            request ? (result.value?.data ?? emptyRemoteRows) : localRows.value
          }
          loading={requestPhase.value === 'loading' || externalLoading}
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
              ? () => filters({ submit: submitFilters })
              : searchFields.value.length
                ? () => (
                    <Search
                      ref="searchForm"
                      fields={searchFields.value}
                      values={searchModel.draft.value}
                      options={searchOptions.value}
                      legacy={isSearchArray(search)}
                      failed={searchFailed.value}
                      submit={instance.submitSearch}
                      reset={instance.resetSearch}
                      setValue={(key, value) =>
                        searchModel.setValues({ [key]: value })
                      }
                    />
                  )
                : void 0,
            notice: () =>
              requestPhase.value === 'failed'
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
