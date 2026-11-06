import { getRouteDemoPeople } from '@/api/demo/data'
import { RTablePro } from '@/components'
import { useI18n } from '@/hooks'
import type {
  RouteDemoPerson,
  RoutePeopleQuery,
} from '@ray-template/api-contracts/demo'
import { NButton, NFlex } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const RouterDemoHome = defineComponent({
  name: 'RouterDemoHome',
  setup() {
    const router = useRouter()
    const { t } = useI18n('demoDetails')

    const columns = computed<DataTableColumns<RouteDemoPerson>>(() => [
      {
        title: t('detail.name'),
        key: 'name',
      },
      {
        title: t('detail.address'),
        key: 'address',
      },
      {
        title: t('detail.phone'),
        key: 'phone',
      },
      {
        title: t('detail.action'),
        key: '',
        render: (row) => {
          return (
            <NFlex align="center">
              <NButton
                type="info"
                text
                size="tiny"
                onClick={() => {
                  router.push({
                    path: '/router-demo/router-demo-detail',
                    query: {
                      id: String(row.key),
                      name: row.name,
                    },
                  })
                }}
              >
                {t('detail.open')}
              </NButton>
            </NFlex>
          )
        },
      },
    ])

    return {
      request: async (params: RoutePeopleQuery, signal: AbortSignal) => {
        const { items, total } = await getRouteDemoPeople(params, signal)

        return { data: items, total }
      },
      columns,
    }
  },
  render() {
    return (
      <NFlex>
        <RTablePro bare columns={this.columns} request={this.request} />
      </NFlex>
    )
  },
})

export default RouterDemoHome
