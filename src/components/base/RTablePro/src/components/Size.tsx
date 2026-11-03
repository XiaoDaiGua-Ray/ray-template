import { useI18n } from '@/hooks/template/useI18n'
import { NPopselect } from 'naive-ui'
import type { DataTableProps } from 'naive-ui'
import tableProps from '../props'
import ToolButton from './ToolButton'

export default defineComponent({
  name: 'TableSizeSelect',
  props: { size: tableProps.size },
  emits: { change: (_size: DataTableProps['size']) => true },
  setup(props, { emit }) {
    const { t } = useI18n('table')

    return () => (
      <NPopselect
        value={props.size ?? 'medium'}
        options={[
          { label: t('compact'), value: 'small' },
          { label: t('standard'), value: 'medium' },
          { label: t('comfortable'), value: 'large' },
        ]}
        trigger="click"
        onUpdateValue={(value) => {
          if (value === 'small' || value === 'medium' || value === 'large')
            emit('change', value)
        }}
      >
        <ToolButton icon="action/adjustment" label={t('density')} />
      </NPopselect>
    )
  },
})
