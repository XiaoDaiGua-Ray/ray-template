import { NPopselect } from 'naive-ui'
import { defineComponent } from 'vue'
import { useTableLocale } from '../locale'
import type { PropsComponentPopselectKeys } from '../types'
import ToolButton from './ToolButton'

export default defineComponent({
  name: 'TablePropsSelect',
  props: { striped: Boolean, bordered: Boolean },
  emits: { change: (_value: PropsComponentPopselectKeys[]) => true },
  setup(props, { emit }) {
    const { t } = useTableLocale()
    const keys = ['striped', 'bordered'] as const

    return () => (
      <NPopselect
        value={keys.filter((key) => props[key])}
        options={keys.map((key) => ({ label: t(key), value: key }))}
        trigger="click"
        multiple
        onUpdateValue={(value) =>
          emit('change', value as PropsComponentPopselectKeys[])
        }
      >
        <ToolButton icon="action/more" label={t('appearance')} />
      </NPopselect>
    )
  },
})
