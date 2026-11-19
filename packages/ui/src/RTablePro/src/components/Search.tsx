import { useElementSize, useRafFn } from '@vueuse/core'
import { NButton, NForm, NFormItem, NGrid, NGridItem } from 'naive-ui'
import type { FormInst } from 'naive-ui'
import {
  computed,
  defineComponent,
  nextTick,
  ref,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import type { PropType, VNode } from 'vue'
import { useTableLocale } from '../locale'
import { normalizeSearchValues } from '../search'
import type {
  TableProSearchFieldConfig,
  TableProSearchOptions,
  TableProSearchValue,
  TableProSearchValues,
} from '../types'
import SearchControl from './SearchControl'

export interface TableSearchFormInst {
  validate: (isCurrent: () => boolean) => Promise<boolean>
  restoreValidation: () => void
}

const gridSize = (size: number | undefined, fallback: number) =>
  size && Number.isSafeInteger(size) && size > 0 ? size : fallback

export default defineComponent({
  name: 'TableProSearch',
  props: {
    fields: {
      type: Array as PropType<readonly TableProSearchFieldConfig[]>,
      required: true,
    },
    options: {
      type: Object as PropType<TableProSearchOptions>,
      default: void 0,
    },
    values: {
      type: Object as PropType<TableProSearchValues>,
      required: true,
    },
    legacy: Boolean,
    failed: Boolean,
    submit: {
      type: Function as PropType<() => Promise<boolean>>,
      required: true,
    },
    reset: {
      type: Function as PropType<() => Promise<boolean>>,
      required: true,
    },
    setValue: {
      type: Function as PropType<
        (key: string, value: TableProSearchValue | null) => void
      >,
      required: true,
    },
  },
  setup(props, { expose }) {
    const { t } = useTableLocale()
    const id = useId()
    const wrapper = useTemplateRef<HTMLElement>('wrapper')
    const form = useTemplateRef<FormInst>('form')
    const { width } = useElementSize(wrapper)
    const collapsed = ref(props.options?.defaultCollapsed ?? false)
    const measuredColumns = computed(() =>
      Math.min(
        gridSize(props.options?.maxColumns, 4),
        width.value >= 1320
          ? 4
          : width.value >= 960
            ? 3
            : width.value >= 600
              ? 2
              : 1,
      ),
    )
    const columns = ref(measuredColumns.value)
    const { resume: scheduleColumnUpdate } = useRafFn(
      () => {
        columns.value = measuredColumns.value
      },
      { immediate: false, once: true },
    )

    watch(measuredColumns, scheduleColumnUpdate)

    const collapsedRows = computed(() =>
      gridSize(props.options?.collapsedRows, 1),
    )
    const items = computed(() =>
      props.fields.map((field, index) => ({
        field,
        path: `field-${index}`,
        span: Math.min(
          columns.value,
          gridSize(field.type ? field.span : void 0, 1),
        ),
      })),
    )
    const canCollapse = computed(() => {
      if (props.legacy) return false

      const cols = columns.value
      let used = 0

      for (const { span } of items.value) {
        const row = used % cols

        if (row + span > cols) used += cols - row

        used += span
      }

      return used > cols * collapsedRows.value
    })
    const model = computed(() => {
      const values = normalizeSearchValues(props.fields, props.values)

      return Object.fromEntries(
        items.value.map(({ field, path }) => [path, values[field.key]]),
      )
    })
    const validate = async (isCurrent: () => boolean) => {
      // 实例方法可以先更新草稿再提交，等待表单接收到最新 model 和规则。
      await nextTick()

      if (!isCurrent()) return false

      try {
        await form.value?.validate()

        return true
      } catch (errors) {
        if (!isCurrent()) {
          form.value?.restoreValidation()

          return false
        }

        collapsed.value = false
        await nextTick()

        if (Array.isArray(errors)) {
          const path: unknown = errors[0]?.[0]?.field

          if (typeof path === 'string' && /^field-\d+$/.test(path)) {
            wrapper.value
              ?.querySelector<HTMLElement>(
                `[data-search-field="${path}"] :is(input, textarea, button, [tabindex="0"])`,
              )
              ?.focus()
          }
        }

        return false
      }
    }

    let pendingValidation = Promise.resolve(true)
    const instance: TableSearchFormInst = {
      validate: (isCurrent) => {
        // Naive UI 的异步规则会直接更新表单提示，串行校验避免旧结果覆盖新提示。
        pendingValidation = pendingValidation.then(() => validate(isCurrent))

        return pendingValidation
      },
      restoreValidation: () => form.value?.restoreValidation(),
    }

    expose(instance)

    const renderItem = ({ field, path }: (typeof items.value)[number]) => {
      const labelId = `${id}-${path}-label`
      const inputId = `${id}-${path}-input`
      const hasInput =
        field.type === 'text' ||
        field.type === 'number' ||
        (!field.type && !field.options)
      const dateOrTime = field.type === 'time' || field.type?.startsWith('date')
      const compound =
        dateOrTime || field.type === 'cascader' || field.type === 'treeSelect'
      const range = field.type === 'dateRange' || field.type === 'datetimeRange'
      // 这些控件没有向内部输入框透传标签的接口。范围两端分别命名，保留同一字段的上下文。
      const labelControls = (node: VNode) => {
        const root = node.el

        if (!(root instanceof HTMLElement)) return

        const inputs = root.querySelectorAll<HTMLInputElement>(
          'input:not([type="hidden"])',
        )

        inputs.forEach((input, index) => {
          if (dateOrTime) input.id = index ? `${inputId}-end` : inputId

          if (range) {
            input.setAttribute(
              'aria-label',
              t(index ? 'searchRangeEnd' : 'searchRangeStart', {
                field: field.label,
              }),
            )
          } else {
            input.setAttribute('aria-labelledby', labelId)
          }
        })

        for (const trigger of root.querySelectorAll('div[tabindex="0"]')) {
          trigger.setAttribute('aria-labelledby', labelId)
        }
      }

      return (
        <NFormItem
          class="r-table-search__item"
          data-search-field={path}
          label={field.label}
          labelProps={{
            id: labelId,
            for: hasInput || dateOrTime ? inputId : void 0,
          }}
          onVnodeMounted={compound ? labelControls : void 0}
          onVnodeUpdated={compound ? labelControls : void 0}
          path={path}
          rule={field.type ? field.rules : void 0}
          showFeedback={!!(field.type && field.rules)}
        >
          <SearchControl
            field={field}
            values={props.values}
            labelId={labelId}
            inputId={inputId}
            setValue={(value) => props.setValue(field.key, value)}
          />
        </NFormItem>
      )
    }

    const renderActions = () => {
      const defaultActions = [
        canCollapse.value && (
          <NButton
            attrType="button"
            text
            aria-expanded={!collapsed.value}
            aria-controls={`${id}-fields`}
            onClick={() => {
              collapsed.value = !collapsed.value
            }}
          >
            {t(collapsed.value ? 'expandSearch' : 'collapseSearch')}
          </NButton>
        ),
        <NButton attrType="button" onClick={() => void props.reset()}>
          {props.options?.resetText ?? t('reset')}
        </NButton>,
        <NButton
          attrType="submit"
          type="primary"
          class="r-table-search__submit"
        >
          {props.options?.searchText ?? t('search')}
        </NButton>,
      ]

      return (
        <div class="r-table-search__actions">
          {props.options?.renderActions
            ? props.options.renderActions({
                submit: props.submit,
                reset: props.reset,
                collapsed: collapsed.value,
                canCollapse: canCollapse.value,
                setCollapsed: (value) => {
                  collapsed.value = value
                },
                defaultActions,
              })
            : defaultActions}
        </div>
      )
    }

    return () => (
      <div ref="wrapper" class="r-table-search-shell">
        <NForm
          ref="form"
          class={props.legacy ? 'r-table-search' : 'r-table-search--advanced'}
          model={model.value}
          labelPlacement={props.options?.labelPlacement ?? 'top'}
          labelWidth={props.options?.labelWidth}
          onSubmit={(event) => {
            event.preventDefault()
            void props.submit()
          }}
        >
          {props.legacy ? (
            items.value.map((item) => (
              <div class="r-table-search__field" key={item.field.key}>
                {renderItem(item)}
              </div>
            ))
          ) : (
            <div id={`${id}-fields`}>
              <NGrid
                cols={columns.value}
                xGap={12}
                yGap={12}
                collapsed={canCollapse.value && collapsed.value}
                collapsedRows={collapsedRows.value}
              >
                {items.value.map((item) => (
                  <NGridItem key={item.field.key} span={item.span}>
                    {renderItem(item)}
                  </NGridItem>
                ))}
              </NGrid>
            </div>
          )}
          {renderActions()}
          {props.failed && <div role="alert">{t('searchError')}</div>}
        </NForm>
      </div>
    )
  },
})
