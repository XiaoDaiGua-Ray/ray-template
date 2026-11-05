import {
  computed,
  defineComponent,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
  toRef,
  watch,
} from 'vue'
import { useUiServices } from '../../services'
import './index.scss'
import { useElementSize } from '@vueuse/core'
import { NDataTable, NDropdown, useThemeVars } from 'naive-ui'
import type { DataTableInst, DataTableProps } from 'naive-ui'
import { useTemplateRef } from 'vue'
import { useColumnLayout, useColumnVisibility } from './columns'
import AppearanceSettings from './components/AppearanceSettings'
import ColumnSettings from './components/ColumnSettings'
import Fullscreen from './components/Fullscreen'
import Size from './components/Size'
import ToolButton from './components/ToolButton'
import { buildTableCsv, downloadTableCsv } from './csv'
import { useTableLocale } from './locale'
import {
  buildPrintableTable,
  printTableContent,
  resolvePrintContent,
} from './printing'
import { tablePanelProps, toNativeTableProps } from './props'
import { config } from './shared'
import type {
  PropsComponentPopselectKeys,
  TablePanelInst,
  TableProRowContext,
} from './types'

const useLocalOverride = <Value,>(prop: () => Value) => {
  const source = computed(() => ({ value: prop() }))
  const local = shallowRef<{ source: typeof source.value; value: Value }>()

  return computed({
    get: () =>
      local.value?.source === source.value
        ? local.value.value
        : source.value.value,
    set: (value: Value) => {
      local.value = { source: source.value, value }
    },
  })
}

export default defineComponent({
  name: 'TablePanel',
  inheritAttrs: false,
  props: tablePanelProps,
  setup(props, { attrs, slots, expose }) {
    const { t } = useTableLocale()
    const { columnStorage, reportError } = useUiServices()
    const theme = useThemeVars()
    const cardStyle = computed(() => ({
      '--r-table-card-surface': theme.value.cardColor,
      '--r-table-card-divider': theme.value.dividerColor,
      '--r-table-card-radius': theme.value.borderRadius,
      '--r-table-card-text': theme.value.textColor1,
      '--r-table-card-muted': theme.value.textColor2,
    }))
    const table = useTemplateRef<DataTableInst>('dataTable')
    const wrapper = useTemplateRef<HTMLElement>('wrapper')
    const responsivePager = computed(() =>
      typeof props.pagination === 'object' && props.pagination.simple == null
        ? wrapper.value
        : null,
    )
    const { width } = useElementSize(responsivePager)
    const narrowPager = computed(() => width.value > 0 && width.value < 600)
    const mergedPagination = computed(() =>
      typeof props.pagination === 'object' &&
      props.pagination.simple == null &&
      narrowPager.value
        ? { ...props.pagination, simple: true }
        : props.pagination,
    )
    const {
      layoutColumns,
      reorderColumns,
      patchColumn,
      resetLayout,
      layoutChanged,
    } = useColumnLayout(
      toRef(props, 'columns'),
      toRef(props, 'onUpdate:columns'),
      toRef(props, 'onResetColumnLayout'),
    )
    const { hiddenKeys, visibleColumns, setColumnVisible, resetColumns } =
      useColumnVisibility(
        layoutColumns,
        toRef(props, 'columnStateKey'),
        columnStorage,
      )
    const printing = ref(false)
    let pendingPrint: AbortController | undefined
    const cancelPrint = () => pendingPrint?.abort()

    onBeforeUnmount(cancelPrint)

    provide(config.wrapperKey, wrapper)
    const size = useLocalOverride(() => props.size)
    const striped = useLocalOverride(() => props.striped)
    const bordered = useLocalOverride(() => props.bordered)
    const context = shallowRef<TableProRowContext & { x: number; y: number }>()
    const closeContext = () => {
      context.value = void 0
    }

    watch(
      [
        () => props.data,
        () => props.rowActionsDisabled,
        () => props.contextMenuOptions,
      ],
      ([data, disabled], [previousData, previouslyDisabled]) => {
        closeContext()

        if (data !== previousData || disabled !== previouslyDisabled)
          cancelPrint()
      },
    )

    const handle: TablePanelInst = {
      getTableInstance: () => table.value,
      downloadCsv: (options) => {
        if (props.rowActionsDisabled) return

        const { fileName, keepOriginalData } = {
          ...props.downloadCsvTableOptions,
          ...options,
        }
        const rows = keepOriginalData
          ? props.data
          : table.value?.getCurrentPageData()

        if (rows)
          downloadTableCsv(
            buildTableCsv(
              visibleColumns.value,
              rows,
              props.getCsvCell,
              props.getCsvHeader,
            ),
            fileName,
          )
      },
      print: async (options) => {
        if (printing.value || props.loading || props.rowActionsDisabled)
          return false

        const printOptions = {
          title: typeof props.title === 'string' ? props.title : '',
          formatCell: props.getCsvCell,
          formatHeader: props.getCsvHeader,
          ...props.printTableOptions,
          ...options,
        }

        const current = new AbortController()

        pendingPrint = current
        printing.value = true

        try {
          const content = resolvePrintContent(printOptions, () => {
            const rows = table.value?.getCurrentPageData()

            return rows
              ? buildPrintableTable(
                  document,
                  visibleColumns.value,
                  rows,
                  printOptions,
                )
              : null
          })

          return (
            !!content &&
            (await printTableContent(content, printOptions, current.signal))
          )
        } catch (error) {
          console.error('[TablePro]: Could not open print preview.', error)

          return false
        } finally {
          pendingPrint = void 0
          printing.value = false
        }
      },
    }

    expose(handle)

    const rowProps: NonNullable<DataTableProps['rowProps']> = (row, index) => {
      const original = props.rowProps?.(row, index)

      if (!props.contextMenuOptions?.length || props.rowActionsDisabled)
        return original ?? {}

      return {
        ...original,
        class: [original?.class, 'r-table__context-row'],
        tabindex: original?.tabindex ?? 0,
        'aria-keyshortcuts': original?.['aria-keyshortcuts'] ?? 'Shift+F10',
        onContextmenu: (event) => {
          original?.onContextmenu?.(event)

          if (event.defaultPrevented) return

          event.preventDefault()
          context.value = { row, index, x: event.clientX, y: event.clientY }
        },
        onKeydown: (event) => {
          original?.onKeydown?.(event)

          if (
            event.defaultPrevented ||
            event.target !== event.currentTarget ||
            (event.key !== 'ContextMenu' &&
              !(event.shiftKey && event.key === 'F10'))
          )
            return

          const rect = (
            event.currentTarget as HTMLElement
          ).getBoundingClientRect()

          event.preventDefault()
          context.value = { row, index, x: rect.left, y: rect.bottom }
        },
      }
    }

    const changeAppearance = (values: PropsComponentPopselectKeys[]) => {
      striped.value = values.includes('striped')
      bordered.value = values.includes('bordered')
    }

    const nativeProps = computed(() => toNativeTableProps(props))

    return () => {
      const {
        bare,
        autoHeight,
        title,
        tool,
        contextMenuOptions,
        onContextMenuClick,
        rowActionsDisabled,
      } = props
      const {
        filters,
        title: titleSlot,
        toolbar,
        notice,
        tableFooter,
        tableAction,
        ...dataTableSlots
      } = slots
      const showToolbar = !bare && (tool || toolbar)
      const headerTitle = bare ? null : titleSlot ? (
        titleSlot()
      ) : typeof title === 'string' && title ? (
        <h2>{title}</h2>
      ) : (
        title
      )
      const extras = tableFooter?.()
      const actions = tableAction?.()

      return (
        <section
          {...attrs}
          ref="wrapper"
          class={[
            'r-table',
            { 'r-table--card': !bare, 'r-table--fill': autoHeight },
            attrs.class,
          ]}
          style={[cardStyle.value, attrs.style]}
        >
          {filters?.()}
          {notice?.()}
          <div class="r-table__result">
            {headerTitle || showToolbar ? (
              <header class="r-table__header">
                {headerTitle ? (
                  <div class="r-table__heading">{headerTitle}</div>
                ) : null}
                {showToolbar ? (
                  <div class="r-table__toolbar">
                    {toolbar?.()}
                    {tool ? (
                      <>
                        <ToolButton
                          icon="action/print"
                          label={t('print')}
                          disabled={
                            rowActionsDisabled ||
                            props.loading ||
                            printing.value
                          }
                          onClick={async () => {
                            if (!(await handle.print()))
                              reportError?.(t('printError'))
                          }}
                        />
                        <Size
                          size={size.value}
                          onChange={(value) => {
                            size.value = value
                          }}
                        />
                        <Fullscreen />
                        {props.columns.length ? (
                          <ColumnSettings
                            columns={layoutColumns.value}
                            hiddenKeys={hiddenKeys.value}
                            onReorderColumns={reorderColumns}
                            onPatchColumn={patchColumn}
                            onToggleColumn={setColumnVisible}
                            onResetColumns={resetColumns}
                            canResetLayout={layoutChanged.value}
                            onResetLayout={resetLayout}
                          />
                        ) : null}
                        <AppearanceSettings
                          striped={striped.value}
                          bordered={bordered.value}
                          onChange={changeAppearance}
                        />
                      </>
                    ) : null}
                  </div>
                ) : null}
              </header>
            ) : null}
            <NDataTable
              {...nativeProps.value}
              striped={striped.value}
              bordered={bordered.value}
              ref="dataTable"
              columns={visibleColumns.value}
              pagination={mergedPagination.value}
              flexHeight={autoHeight || props.flexHeight}
              rowProps={rowProps}
              size={size.value}
            >
              {dataTableSlots}
            </NDataTable>
          </div>
          {extras ? <div class="r-table__footer">{extras}</div> : null}
          {actions ? <div class="r-table__action">{actions}</div> : null}
          {contextMenuOptions?.length ? (
            <NDropdown
              show={!!context.value}
              placement="bottom-start"
              trigger="manual"
              x={context.value?.x ?? 0}
              y={context.value?.y ?? 0}
              options={contextMenuOptions}
              onClickoutside={closeContext}
              onUpdateShow={(show) => {
                if (!show) closeContext()
              }}
              onSelect={(key, option) => {
                const current = context.value

                closeContext()

                if (current && !rowActionsDisabled) {
                  const { row, index } = current

                  onContextMenuClick?.(key, option, { row, index })
                }
              }}
            />
          ) : null}
        </section>
      )
    }
  },
})
