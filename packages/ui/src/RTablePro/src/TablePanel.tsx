import {
  computed,
  defineComponent,
  provide,
  reactive,
  ref,
  toRef,
  watch,
} from 'vue'
import { useUiServices } from '../../services'
import './index.scss'
import { useElementSize } from '@vueuse/core'
import { NDataTable, NDropdown } from 'naive-ui'
import type { DataTableInst, DataTableProps } from 'naive-ui'
import { useTemplateRef } from 'vue'
import { useColumnLayout, useColumnVisibility } from './columns'
import C from './components/C'
import Fullscreen from './components/Fullscreen'
import TablePropsSelect from './components/Props'
import Size from './components/Size'
import ToolButton from './components/ToolButton'
import { buildTableCsv, downloadTableCsv } from './csv'
import { useTableLocale } from './locale'
import {
  buildPrintableTable,
  printTableContent,
  resolvePrintContent,
} from './printing'
import props from './props'
import { config } from './shared'
import type { PropsComponentPopselectKeys, TablePanelInst } from './types'

export default defineComponent({
  name: 'TablePanel',
  inheritAttrs: false,
  props,
  setup(props, { attrs, slots, expose }) {
    const { t } = useTableLocale()
    const { columnStorage, reportError } = useUiServices()
    const table = useTemplateRef<DataTableInst>('dataTable')
    const wrapper = useTemplateRef<HTMLElement>('wrapper')
    const responsivePager = computed(() =>
      typeof props.pagination === 'object' && props.pagination.simple == null
        ? wrapper.value
        : null,
    )
    const { width } = useElementSize(responsivePager)
    const { layoutColumns, reorderColumns, patchColumn } = useColumnLayout(
      toRef(props, 'columns'),
      toRef(props, 'onUpdate:columns'),
    )
    const { hiddenKeys, visibleColumns, setColumnVisible, resetColumns } =
      useColumnVisibility(
        layoutColumns,
        toRef(props, 'columnStateKey'),
        columnStorage,
      )
    const printing = ref(false)

    provide(config.wrapperKey, wrapper)
    const size = ref(props.size)
    const appearance = reactive({
      striped: props.striped,
      bordered: props.bordered,
    })
    const context = reactive({ x: 0, y: 0, show: false })

    watch(
      () => props.size,
      (value) => {
        size.value = value
      },
    )
    watch(
      () => props.striped,
      (value) => {
        appearance.striped = value
      },
    )
    watch(
      () => props.bordered,
      (value) => {
        appearance.bordered = value
      },
    )

    const handle: TablePanelInst = {
      getTableInstance: () => table.value,
      downloadCsv: (options) => {
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
        if (printing.value || props.loading) return false

        const printOptions = {
          title: typeof props.title === 'string' ? props.title : '',
          formatCell: props.getCsvCell,
          formatHeader: props.getCsvHeader,
          ...props.printTableOptions,
          ...options,
        }

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

          return !!content && (await printTableContent(content, printOptions))
        } catch (error) {
          console.error('[TablePro]: Could not open print preview.', error)

          return false
        } finally {
          printing.value = false
        }
      },
    }

    expose(handle)

    const rowProps: NonNullable<DataTableProps['rowProps']> = (row, index) => {
      const original = props.rowProps?.(row, index)

      if (!props.contextMenuOptions?.length) return original ?? {}

      return {
        ...original,
        onContextmenu: (event: PointerEvent) => {
          original?.onContextmenu?.(event)

          if (event.defaultPrevented) return

          event.preventDefault()
          Object.assign(context, {
            x: event.clientX,
            y: event.clientY,
            show: true,
          })
        },
      }
    }

    const changeAppearance = (values: PropsComponentPopselectKeys[]) => {
      appearance.striped = values.includes('striped')
      appearance.bordered = values.includes('bordered')
    }

    return () => {
      const {
        bare,
        autoHeight,
        title,
        tool,
        contextMenuOptions,
        onContextMenuClick,
        'onUpdate:columns': updateColumns,
        downloadCsvTableOptions,
        printTableOptions,
        columnStateKey,
        pagination,
        ...dataTableProps
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
      const mergedPagination =
        typeof pagination === 'object' && width.value > 0 && width.value < 600
          ? { simple: true, ...pagination }
          : pagination

      return (
        <section
          {...attrs}
          ref="wrapper"
          class={['r-table', { 'r-table--fill': autoHeight }, attrs.class]}
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
                          disabled={props.loading || printing.value}
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
                          <C
                            columns={layoutColumns.value}
                            hiddenKeys={hiddenKeys.value}
                            onReorderColumns={reorderColumns}
                            onPatchColumn={patchColumn}
                            onToggleColumn={setColumnVisible}
                            onResetColumns={resetColumns}
                          />
                        ) : null}
                        <TablePropsSelect
                          {...appearance}
                          onChange={changeAppearance}
                        />
                      </>
                    ) : null}
                  </div>
                ) : null}
              </header>
            ) : null}
            <NDataTable
              {...dataTableProps}
              {...appearance}
              ref="dataTable"
              columns={visibleColumns.value}
              pagination={mergedPagination}
              flexHeight={autoHeight || dataTableProps.flexHeight}
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
              show={context.show}
              placement="bottom-start"
              trigger="manual"
              x={context.x}
              y={context.y}
              options={contextMenuOptions}
              onClickoutside={() => {
                context.show = false
              }}
              onSelect={(key, option) => {
                context.show = false
                onContextMenuClick?.(key, option)
              }}
            />
          ) : null}
        </section>
      )
    }
  },
})
