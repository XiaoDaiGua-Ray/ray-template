import { call } from '@ray-template/composables/vue/call'
import { isEqual } from 'lodash-es'
import type { PaginationProps } from 'naive-ui'
import {
  computed,
  defineComponent,
  onBeforeUpdate,
  onMounted,
  ref,
  shallowRef,
  useTemplateRef,
  watch,
} from 'vue'
import type { ExtractPublicPropTypes, PropType } from 'vue'
import { useUiServices } from '../../services'
import Search from './components/Search'
import type { TableSearchFormInst } from './components/Search'
import { useTableLocale } from './locale'
import { splitPaginationOptions } from './pagination'
import tableProps, { toPanelProps } from './props'
import {
  copySearchValues,
  createSearchPredicate,
  isSearchArray,
  normalizeSearchValues,
  resolveSearchFields,
  resolveSearchOptions,
  sameSearchBehavior,
  sameSearchField,
  toSearchParams,
  visibleSearchFields,
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
import { useTableRequest } from './useTableRequest'
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
    const { reportError } = useUiServices()
    const table = shallowRef<TablePanelInst>()
    const searchForm = useTemplateRef<TableSearchFormInst>('searchForm')
    const customFilters = ref(!!slots.filters)
    const searchFailed = ref(false)
    let lastSearchError: unknown
    const reportSearchError = (error: unknown): false => {
      if (!searchFailed.value || error !== lastSearchError) {
        lastSearchError = error
        searchFailed.value = true
        emit('search-error', error)
      }

      return false
    }
    const searchOptions = computed(() => resolveSearchOptions(props.search))
    const searchFields = computed(() => {
      const options = searchOptions.value

      if (customFilters.value || !options) return emptySearchFields

      return resolveSearchFields(options, props.columns).map((field) => ({
        ...field,
      }))
    })
    const searchModel = useTableSearch(
      () => searchFields.value,
      () => searchOptions.value,
      (isCurrent) =>
        searchFields.value.some((field) => field.type && field.rules)
          ? (searchForm.value?.validate(isCurrent) ?? true)
          : true,
      () => searchForm.value?.restoreValidation(),
      reportSearchError,
      (values, reason) => applySearch(values, searchFields.value, reason),
    )
    const applied = shallowRef(createSearchSnapshot({}, emptySearchFields))

    const draftFields = computed(
      (
        previous:
          | { fields: typeof searchFields.value; error?: { cause: unknown } }
          | undefined,
      ) => {
        try {
          return {
            fields: visibleSearchFields(
              searchFields.value,
              searchModel.draft.value,
            ),
          }
        } catch (cause) {
          return {
            fields: previous?.fields ?? emptySearchFields,
            error: { cause },
          }
        }
      },
    )

    try {
      const values = searchModel.draft.value

      applied.value = createSearchSnapshot(
        normalizeSearchValues(
          visibleSearchFields(searchFields.value, values),
          values,
        ),
        searchFields.value,
      )
    } catch (error) {
      reportSearchError(error)
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
    const pager = computed(() => splitPaginationOptions(pagerOptions.value))
    const firstPage = pagerOptions.value?.defaultPage ?? 1
    const page = ref(positiveInteger(firstPage) ? firstPage : 1)
    const pageSize = ref(configuredPageSize.value)
    const displayedPage = computed(() =>
      props.request ? page.value : (pagerOptions.value?.page ?? page.value),
    )
    const displayedPageSize = computed(() =>
      props.request
        ? pageSize.value
        : (pagerOptions.value?.pageSize ?? pageSize.value),
    )

    const updatePage = (value: number) => {
      if (
        !paginated.value ||
        !positiveInteger(value) ||
        displayedPage.value === value
      )
        return false

      page.value = value
      pager.value.notifyPage(value)

      for (const handler of [
        props.onUpdatePage,
        props['onUpdate:page'],
        props.onPageChange,
      ])
        if (handler) call(handler, value)

      return true
    }

    const {
      reload: load,
      activeResult,
      total,
      phase: requestPhase,
      state: queryState,
    } = useTableRequest({
      request: () => props.request,
      filters: () => ({ ...props.params, ...applied.value.params }),
      paging: () =>
        paginated.value
          ? { page: page.value, pageSize: pageSize.value }
          : void 0,
      updatePage,
      reportError: (error) => {
        emit('request-error', error)

        if (!slots.error) reportError?.(t('requestError'))
      },
    })
    const reload = (resetPage = false) => {
      if (resetPage) updatePage(1)

      return load()
    }

    type LocalRows = {
      source: typeof props.data
      rows: typeof props.data
      error?: { cause: unknown }
    }
    const localRows = computed<LocalRows>((previous) => {
      const source = props.data
      const { matches } = applied.value

      if (!matches || props.request || manualSearch.value)
        return { source, rows: source }

      try {
        return { source, rows: source.filter(matches) }
      } catch (cause) {
        return {
          source,
          rows: previous?.source === source ? previous.rows : [],
          error: { cause },
        }
      }
    })

    watch(
      [() => draftFields.value.error, () => localRows.value.error],
      (errors, previous) => {
        errors.forEach((error, index) => {
          if (error && error !== previous[index]) reportSearchError(error.cause)
        })
      },
      { immediate: true },
    )
    const setPage = async (value: number) => {
      if (updatePage(value)) await reload()
    }

    const setPageSize = async (value: number) => {
      if (
        !paginated.value ||
        !positiveInteger(value) ||
        displayedPageSize.value === value
      )
        return

      pageSize.value = value
      pager.value.notifyPageSize(value)

      for (const handler of [
        props.onPageSizeChange,
        props.onUpdatePageSize,
        props['onUpdate:pageSize'],
      ])
        if (handler) call(handler, value)

      await reload(true)
    }

    async function applySearch(
      values: TableProSearchValues,
      fields: readonly TableProSearchFieldConfig[],
      reason?: TableProSearchSubmission['reason'],
      normalize = true,
    ) {
      const previous = applied.value

      try {
        const normalized = normalize
          ? normalizeSearchValues(visibleSearchFields(fields, values), values)
          : values

        applied.value = createSearchSnapshot(
          copySearchValues(normalized),
          fields,
        )

        const error = localRows.value.error

        if (error) throw error.cause
      } catch (error) {
        applied.value = previous

        return reportSearchError(error)
      }

      searchFailed.value = false
      const snapshot = applied.value

      if (!reason && props.request && isEqual(previous.params, snapshot.params))
        return true

      updatePage(1)

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

      await applySearch(values, fields, 'submit', false)
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
        fields.length === previous.length &&
        fields.every((field) =>
          sameSearchBehavior(field, previousByKey.get(field.key)),
        )
      )
        return

      searchModel.reconcile(retainedKeys)
      const retained = Object.fromEntries(
        Object.entries(applied.value.values).filter(([key]) =>
          retainedKeys.has(key),
        ),
      )

      if (Object.keys(applied.value.values).length)
        void applySearch(retained, fields)
    })

    watch(
      [() => props.request, () => props.params, paginated, configuredPageSize],
      ([, , , configuredSize], previous) => {
        if (configuredSize !== previous[3]) pageSize.value = configuredSize

        if (!previous.length && searchFailed.value) return

        void reload(previous.length > 0)
      },
      { deep: true, immediate: true },
    )

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
      getTableInstance: () =>
        props.request && !activeResult.value
          ? null
          : (table.value?.getTableInstance() ?? null),
      getCurrentPageData: () =>
        props.request
          ? (activeResult.value?.data ?? emptyRemoteRows)
          : (table.value?.getTableInstance()?.getCurrentPageData() ?? []),
      print: (options) =>
        (!props.request || activeResult.value
          ? table.value?.print(options)
          : void 0) ?? Promise.resolve(false),
      downloadCsv: (options) => {
        if (!props.request || activeResult.value)
          table.value?.downloadCsv(options)
      },
    }

    expose(instance)
    onMounted(() => props.onRegister?.(instance))

    const panelProps = computed(() => toPanelProps(props))

    return () => {
      const { request, search, loading: externalLoading, remote } = props
      const { filters, error, notice, ...panelSlots } = slots
      const paginationProps: false | PaginationProps =
        pagination.value === false
          ? false
          : {
              showSizePicker: true,
              pageSizes: [10, 20, 50, 100],
              prefix: ({ itemCount }) => t('total', { count: itemCount }),
              ...pager.value.view,
              page: displayedPage.value,
              pageSize: displayedPageSize.value,
              ...(request
                ? { itemCount: total.value ?? 0, pageCount: void 0 }
                : {}),
            }

      return (
        <TablePanel
          {...attrs}
          {...panelProps.value}
          ref={table}
          remote={!!request || remote}
          data={
            request
              ? (activeResult.value?.data ?? emptyRemoteRows)
              : localRows.value.rows
          }
          rowActionsDisabled={!!request && !activeResult.value}
          loading={requestPhase.value === 'loading' || externalLoading}
          pagination={paginationProps}
          onUpdatePage={setPage}
          onUpdatePageSize={setPageSize}
        >
          {{
            ...panelSlots,
            filters: filters
              ? () => filters({ submit: submitFilters })
              : searchFields.value.length
                ? () => (
                    <Search
                      ref="searchForm"
                      fields={draftFields.value.fields}
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
            notice:
              requestPhase.value === 'failed' && error
                ? () => error({ reload })
                : notice,
          }}
        </TablePanel>
      )
    }
  },
})
