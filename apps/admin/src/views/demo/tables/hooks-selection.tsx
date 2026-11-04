import { RTablePro, useTablePro } from '@/components'
import { listPeople } from '@/demo-data/people'
import type { Person } from '@/demo-data/people'
import { useI18n } from '@/hooks/template/useI18n'
import { NButton, NFlex } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'
import { createPeopleColumns } from './people'

export default defineComponent({
  name: 'TableDemoHooksSelection',
  setup() {
    const { t } = useI18n()
    const [register, { isReady, getCurrentPageData, getTableInstance }] =
      useTablePro()
    const { data } = listPeople()
    const checked = ref<(string | number)[]>([])
    const marked = shallowRef(new Set<string | number>())
    const columns = computed<DataTableColumns<Person>>(() => [
      { type: 'selection', width: 44 },
      ...createPeopleColumns((key) => t(`table.${key}`))
        .slice(0, 4)
        .map((column) =>
          'key' in column && column.key === 'age'
            ? {
                ...column,
                sorter: (left: Person, right: Person) => left.age - right.age,
              }
            : column,
        ),
      {
        title: t('tableHooks.markColumn'),
        key: 'marked',
        width: 110,
        render: ({ id }) =>
          t(marked.value.has(id) ? 'tableHooks.marked' : 'tableHooks.unmarked'),
      },
    ])

    const currentKeys = () =>
      getCurrentPageData()
        .map((row) => row.id)
        .filter((id): id is string => typeof id === 'string')

    const selectPage = () => {
      checked.value = [...new Set([...checked.value, ...currentKeys()])]
    }
    const unselectPage = () => {
      const pageKeys = new Set<string | number>(currentKeys())

      checked.value = checked.value.filter((id) => !pageKeys.has(id))
    }
    const markSelected = () => {
      marked.value = new Set([...marked.value, ...checked.value])
      checked.value = []
    }

    return () => (
      <DemoPage
        title={t('menu.TableHooksSelection')}
        description={t('tableHooks.selectionDescription')}
      >
        <NFlex>
          <NButton
            type="primary"
            disabled={!isReady.value}
            onClick={selectPage}
          >
            {t('tableHooks.selectPage')}
          </NButton>
          <NButton
            disabled={!isReady.value || !checked.value.length}
            onClick={unselectPage}
          >
            {t('tableHooks.unselectPage')}
          </NButton>
          <NButton
            disabled={!checked.value.length}
            onClick={() => {
              checked.value = []
            }}
          >
            {t('tableHooks.clearAll')}
          </NButton>
          <NButton disabled={!checked.value.length} onClick={markSelected}>
            {t('tableHooks.markSelected')}
          </NButton>
          <NButton
            disabled={!isReady.value}
            onClick={() => getTableInstance()?.clearSorter()}
          >
            {t('tableHooks.clearSort')}
          </NButton>
        </NFlex>
        <DemoResult label={t('tableHooks.selectionResult')}>
          {t('tableHooks.selectionDetails', {
            selected: checked.value.length,
            marked: marked.value.size,
          })}
        </DemoResult>
        <RTablePro
          onRegister={register}
          title={t('table.directory')}
          columns={columns.value}
          data={data}
          v-model:checkedRowKeys={checked.value}
          search={[
            {
              key: 'name',
              label: t('table.name'),
              placeholder: t('table.nameHint'),
            },
          ]}
          scrollX={716}
        />
      </DemoPage>
    )
  },
})
