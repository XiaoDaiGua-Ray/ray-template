import { RTablePro, useTablePro } from '@/components'
import { listPeople } from '@/demo-data/people'
import { useI18n } from '@/hooks/template/useI18n'
import { NButton, NFlex } from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'
import { createPeopleColumns } from './people'

export default defineComponent({
  name: 'TableDemoHooksOutput',
  setup() {
    const { t } = useI18n()
    const [register, { isReady, downloadCsv, print }] = useTablePro()
    const { data } = listPeople()
    const mounted = ref(true)
    const printResult = ref<boolean>()
    const columns = computed(() =>
      createPeopleColumns((key) => t(`table.${key}`)).slice(0, 4),
    )

    return () => (
      <DemoPage
        title={t('menu.TableHooksOutput')}
        description={t('tableHooks.outputDescription')}
      >
        <NFlex>
          <NButton
            onClick={() => {
              mounted.value = !mounted.value
              printResult.value = void 0
            }}
          >
            {t(mounted.value ? 'tableHooks.unmount' : 'tableHooks.mount')}
          </NButton>
          <NButton
            disabled={!isReady.value}
            onClick={() => downloadCsv({ fileName: 'people-page' })}
          >
            {t('tableHooks.csvPage')}
          </NButton>
          <NButton
            disabled={!isReady.value}
            onClick={() =>
              downloadCsv({ fileName: 'people-loaded', keepOriginalData: true })
            }
          >
            {t('tableHooks.csvLoaded')}
          </NButton>
          <NButton
            disabled={!isReady.value}
            onClick={async () => {
              printResult.value = await print({
                title: t('table.printDemoTitle'),
              })
            }}
          >
            {t('table.printDemoTitle')}
          </NButton>
        </NFlex>
        <DemoResult
          label={t('tableHooks.mountStatus')}
          error={printResult.value === false}
        >
          {t(isReady.value ? 'tableHooks.ready' : 'tableHooks.notReady')}
          {printResult.value === void 0 ? null : (
            <div>
              {t(
                printResult.value
                  ? 'tableHooks.printOpened'
                  : 'table.printError',
              )}
            </div>
          )}
        </DemoResult>
        {mounted.value ? (
          <RTablePro
            onRegister={register}
            title={t('table.directory')}
            columns={columns.value}
            data={data}
            search={[
              {
                key: 'name',
                label: t('table.name'),
                placeholder: t('table.nameHint'),
              },
            ]}
            columnStateKey="demo:hooks-output"
            scrollX={562}
          />
        ) : null}
      </DemoPage>
    )
  },
})
