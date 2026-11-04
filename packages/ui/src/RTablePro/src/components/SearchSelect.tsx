import { call } from '@ray-template/composables/vue/call'
import { NButton, NSelect } from 'naive-ui'
import type { SelectProps } from 'naive-ui'
import { defineComponent, ref, shallowRef, watch } from 'vue'
import type { PropType } from 'vue'
import { useTableLocale } from '../locale'
import { copySearchValues } from '../search'
import type {
  TableProSearchFieldConfig,
  TableProSearchValue,
  TableProSearchValues,
} from '../types'

export default defineComponent({
  name: 'TableProSearchSelect',
  props: {
    field: {
      type: Object as PropType<
        Extract<TableProSearchFieldConfig, { type: 'select' }>
      >,
      required: true,
    },
    values: { type: Object as PropType<TableProSearchValues>, required: true },
    inputId: { type: String, required: true },
    labelId: { type: String, required: true },
    setValue: {
      type: Function as PropType<(value: TableProSearchValue | null) => void>,
      required: true,
    },
  },
  setup(props) {
    const { t } = useTableLocale()
    const keyword = ref('')
    const retry = ref(0)
    const options = shallowRef<SelectProps['options']>()
    const loading = ref(false)
    const failed = ref(false)

    watch(
      [() => props.field.loadOptions, keyword, retry],
      (
        [load, query, attempt],
        [previousLoad, previousQuery, previousAttempt],
        onCleanup,
      ) => {
        options.value = void 0
        failed.value = false
        loading.value = !!load

        if (!load) return

        const controller = new AbortController()
        const values = copySearchValues(props.values)
        const run = async () => {
          try {
            const result = await load({
              keyword: query,
              values,
              signal: controller.signal,
            })

            if (!controller.signal.aborted) options.value = result
          } catch {
            if (!controller.signal.aborted) failed.value = true
          } finally {
            if (!controller.signal.aborted) loading.value = false
          }
        }
        const delay =
          load === previousLoad &&
          attempt === previousAttempt &&
          query !== previousQuery
            ? (props.field.optionDebounce ?? 250)
            : 0
        const timer = delay > 0 ? setTimeout(() => void run(), delay) : void 0

        onCleanup(() => {
          clearTimeout(timer)
          controller.abort()
        })

        if (timer === void 0) void run()
      },
      { immediate: true },
    )

    return () => {
      const { field, values, inputId, labelId, setValue } = props
      const { loadOptions, fieldProps } = field

      return (
        <div class="r-table-search__select">
          <NSelect
            clearable
            placeholder={field.placeholder}
            aria-labelledby={labelId}
            {...fieldProps}
            inputProps={{
              ...fieldProps?.inputProps,
              id: inputId,
              'aria-labelledby': labelId,
            }}
            multiple={field.multiple}
            filterable={fieldProps?.filterable ?? !!loadOptions}
            remote={loadOptions ? true : fieldProps?.remote}
            loading={loading.value || (fieldProps?.loading ?? false)}
            options={options.value ?? field.options}
            value={
              (values[field.key] ?? null) as
                string | number | (string | number)[] | null
            }
            onUpdateValue={setValue}
            onSearch={(value) => {
              if (loadOptions) keyword.value = value

              if (fieldProps?.onSearch) call(fieldProps.onSearch, value)
            }}
          />
          {failed.value && (
            <div class="r-table-search__option-error" role="status">
              <span>{t('searchOptionsError')}</span>
              <NButton
                text
                attrType="button"
                onClick={() => {
                  retry.value += 1
                }}
              >
                {t('retry')}
              </NButton>
            </div>
          )}
        </div>
      )
    }
  },
})
