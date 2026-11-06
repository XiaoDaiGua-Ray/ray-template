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
import { unrefElement } from '@ray-template/composables/vue'
import { useElementSize } from '@vueuse/core'
import { NDataTable, NDropdown, useThemeVars } from 'naive-ui'
import type { DataTableInst, DataTableProps, DropdownProps } from 'naive-ui'
import { useTemplateRef } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { RIcon } from '../../RIcon'
import { useColumnLayout, useColumnVisibility } from './columns'
import ColumnSettings from './components/ColumnSettings'
import Fullscreen from './components/Fullscreen'
import ToolButton from './components/ToolButton'
import { buildTableCsv, downloadTableCsv } from './csv'
import { copyTableImage } from './image'
import { useTableLocale } from './locale'
import {
  buildPrintableTable,
  printTableContent,
  resolvePrintContent,
} from './printing'
import { tablePanelProps, toNativeTableProps } from './props'
import { config } from './shared'
import type { TablePanelInst, TableProRowContext } from './types'

/**
 *
 * @param prop 外部属性读取器
 *
 * @description
 * 外部值改变前允许面板持有本地覆盖，外部更新后自动回归调用方配置。
 *
 * @returns 可写的当前展示值
 */
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
    const { columnStorage, reportError, reportSuccess } = useUiServices()
    const theme = useThemeVars()
    const cardStyle = computed(() => ({
      '--r-table-card-surface': theme.value.cardColor,
      '--r-table-card-divider': theme.value.dividerColor,
      '--r-table-card-radius': theme.value.borderRadius,
      '--r-table-card-text': theme.value.textColor1,
      '--r-table-card-muted': theme.value.textColor2,
    }))
    const table = useTemplateRef<DataTableInst & ComponentPublicInstance>(
      'dataTable',
    )
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
    const copyingImage = ref(false)
    const imageFeedback = shallowRef<{ key: string; error: boolean }>()
    let pendingPrint: AbortController | undefined
    let pendingImage: AbortController | undefined
    let disposed = false
    const cancelPrint = () => pendingPrint?.abort()
    const cancelImage = () => pendingImage?.abort()

    onBeforeUnmount(() => {
      disposed = true
      cancelPrint()
      cancelImage()
    })

    const reportImageResult = (key: string, error: boolean) => {
      const notify = error ? reportError : reportSuccess

      imageFeedback.value = { key, error }

      if (notify) {
        try {
          notify(t(key))
          imageFeedback.value = void 0
        } catch {
          // 宿主消息服务不可用时保留局部反馈，不改变已经完成的剪贴板结果。
        }
      }
    }

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
        () => props.loading,
      ],
      ([data, disabled, , loading], [previousData, previouslyDisabled]) => {
        closeContext()

        if (data !== previousData || disabled !== previouslyDisabled) {
          cancelPrint()
          cancelImage()
          imageFeedback.value = void 0
        }

        if (loading) cancelImage()
      },
    )

    const handle: TablePanelInst = {
      getTableInstance: () => table.value,
      copyImage: async (options) => {
        if (
          disposed ||
          copyingImage.value ||
          props.loading ||
          props.rowActionsDisabled
        )
          return false

        const target = unrefElement(table)

        if (!(target instanceof HTMLElement)) return false

        const current = new AbortController()

        pendingImage = current
        copyingImage.value = true
        imageFeedback.value = void 0

        try {
          await copyTableImage(
            target,
            {
              backgroundColor: theme.value.cardColor,
              ...props.copyImageOptions,
              ...options,
            },
            current.signal,
          )

          if (!disposed && !current.signal.aborted)
            reportImageResult('copyImageSuccess', false)

          return true
        } catch (error) {
          const name = error instanceof Error ? error.name : ''

          if (!disposed && !current.signal.aborted) {
            if (name === 'AbortError') return false

            reportImageResult(
              name === 'NotSupportedError'
                ? 'copyImageUnsupported'
                : name === 'NotAllowedError'
                  ? 'copyImagePermission'
                  : 'copyImageError',
              true,
            )
          }

          return false
        } finally {
          if (pendingImage === current) {
            pendingImage = void 0
            copyingImage.value = false
          }
        }
      },
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

    const renderCheckedActionLabel = (label: string, checked: boolean) => (
      <span class="r-table-action-label">
        <span>{label}</span>
        <span class="r-table-action-label__check" aria-hidden="true">
          {checked ? '✓' : ''}
        </span>
      </span>
    )

    const actionOptions = computed<NonNullable<DropdownProps['options']>>(
      () => [
        {
          key: 'density',
          label: t('density'),
          icon: () => <RIcon name="action/adjustment" size={16} />,
          children: (['small', 'medium', 'large'] as const).map(
            (value, index) => ({
              key: `density:${value}`,
              label: t(['compact', 'standard', 'comfortable'][index]),
              icon: () => (
                <span aria-hidden="true">
                  {size.value === value ? '✓' : ''}
                </span>
              ),
              props: {
                role: 'menuitemradio',
                'aria-checked': size.value === value,
              },
            }),
          ),
        },
        ...(['striped', 'bordered'] as const).map((key) => {
          const checked = key === 'striped' ? striped.value : bordered.value

          return {
            key,
            label: () => renderCheckedActionLabel(t(key), !!checked),
            icon: () => <RIcon name={`action/table-${key}`} size={16} />,
            props: { role: 'menuitemcheckbox', 'aria-checked': checked },
          }
        }),
        { key: 'output-divider', type: 'divider' },
        {
          key: 'csv',
          label: t('csv'),
          icon: () => <RIcon name="action/download" size={16} />,
          disabled:
            props.rowActionsDisabled || props.loading || !props.columns.length,
        },
        ...(props.showPrint
          ? [
              {
                key: 'print',
                label: t('print'),
                icon: () => <RIcon name="action/print" size={16} />,
                disabled:
                  props.rowActionsDisabled || props.loading || printing.value,
              },
            ]
          : []),
      ],
    )

    /**
     *
     * @param key 工具菜单操作键
     *
     * @description
     * 复用实例导出和打印路径；外观只更新本地覆盖，不改变调用方列或数据。
     */
    const selectAction = async (key: string | number) => {
      switch (key) {
        case 'density:small':
          size.value = 'small'
          break
        case 'density:medium':
          size.value = 'medium'
          break
        case 'density:large':
          size.value = 'large'
          break
        case 'striped':
          striped.value = !striped.value
          break
        case 'bordered':
          bordered.value = !bordered.value
          break
        case 'csv':
          if (!props.loading) handle.downloadCsv()

          break
        case 'print':
          if (props.showPrint && !(await handle.print()))
            reportError?.(t('printError'))

          break
        default:
          break
      }
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
                    {toolbar ? (
                      <div class="r-table__business-actions">{toolbar()}</div>
                    ) : null}
                    {tool ? (
                      <div
                        class={[
                          'r-table__utilities',
                          { 'r-table__utilities--separated': !!toolbar },
                        ]}
                        role="group"
                        aria-label={t('tableControls')}
                      >
                        {props.reload ? (
                          <ToolButton
                            icon="action/reload"
                            label={t('reload')}
                            disabled={props.loading}
                            onClick={props.reload}
                          />
                        ) : null}
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
                        {props.showCopyImage ? (
                          <ToolButton
                            icon="action/copy-image"
                            label={t(
                              copyingImage.value ? 'copyingImage' : 'copyImage',
                            )}
                            loading={copyingImage.value}
                            disabled={
                              props.rowActionsDisabled ||
                              props.loading ||
                              copyingImage.value
                            }
                            onClick={() => {
                              void handle.copyImage()
                            }}
                          />
                        ) : null}
                        <Fullscreen />
                        <NDropdown
                          class="r-table__action-menu"
                          trigger="click"
                          placement="bottom-end"
                          options={actionOptions.value}
                          onSelect={selectAction}
                        >
                          <ToolButton
                            icon="action/more"
                            label={t('moreActions')}
                            aria-haspopup="menu"
                          />
                        </NDropdown>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </header>
            ) : null}
            {imageFeedback.value ? (
              <p
                class="r-table__image-feedback"
                role={imageFeedback.value.error ? 'alert' : 'status'}
                style={{
                  color: imageFeedback.value.error
                    ? theme.value.errorColor
                    : theme.value.successColor,
                }}
              >
                {t(imageFeedback.value.key)}
              </p>
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
