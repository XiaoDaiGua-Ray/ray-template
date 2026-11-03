import { useI18n } from '@/hooks/template/useI18n'
import { NButton, NInput, NSelect } from 'naive-ui'
import { useId } from 'vue'
import type { PropType } from 'vue'
import type { TableProSearchField, TableSearchValues } from '../types'

export default defineComponent({
  name: 'TableProSearch',
  props: {
    fields: { type: Array as PropType<TableProSearchField[]>, required: true },
  },
  emits: { search: (_values: TableSearchValues) => true },
  setup(props, { emit }) {
    const { t } = useI18n('table')
    const id = useId()
    const values = reactive<Record<string, string | number | null>>({})
    const submit = (event: SubmitEvent) => {
      event.preventDefault()
      const result: TableSearchValues = {}

      for (const { key } of props.fields) {
        const value = values[key]
        const normalized = typeof value === 'string' ? value.trim() : value

        if (normalized != null && normalized !== '') result[key] = normalized
      }

      emit('search', result)
    }

    const reset = () => {
      Object.keys(values).forEach((key) => delete values[key])
      emit('search', {})
    }

    return () => (
      <form class="r-table-search" onSubmit={submit}>
        {props.fields.map(({ key, label, placeholder, options }, index) => {
          const fieldId = `${id}-${index}`

          return (
            <div class="r-table-search__field" key={key}>
              <label
                for={options ? void 0 : fieldId}
                id={options ? fieldId : void 0}
              >
                {label}
              </label>
              {options ? (
                <NSelect
                  clearable
                  aria-labelledby={fieldId}
                  value={values[key] ?? null}
                  options={options}
                  placeholder={placeholder}
                  onUpdateValue={(value) => {
                    values[key] = value
                  }}
                />
              ) : (
                <NInput
                  clearable
                  inputProps={{ id: fieldId }}
                  value={String(values[key] ?? '')}
                  placeholder={placeholder}
                  onUpdateValue={(value) => {
                    values[key] = value
                  }}
                />
              )}
            </div>
          )
        })}
        <div class="r-table-search__actions">
          <NButton onClick={reset}>{t('reset')}</NButton>
          <NButton
            attrType="submit"
            type="primary"
            class="r-table-search__submit"
          >
            {t('search')}
          </NButton>
        </div>
      </form>
    )
  },
})
