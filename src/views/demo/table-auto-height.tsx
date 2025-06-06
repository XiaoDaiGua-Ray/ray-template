import { RTablePro, RCollapse } from '@/components'
import {
  NFlex,
  NFormItemGi,
  NInput,
  NSelect,
  NDatePicker,
  NButton,
  NTag,
  NSwitch,
} from 'naive-ui'

import dayjs from 'dayjs'
import { uuid } from '@/utils'
import Mock from 'mockjs'
import { useDayjs } from '@/hooks'

type RowData = {
  key: number | string
  name: string
  age: number
  address: string
  tags: string[]
  remark: string
  status: string
  statusText: string
  signTimeEnd: number
  signTimeStart: number
}

export default defineComponent({
  name: 'TableAutoHeight',
  setup() {
    const { format } = useDayjs()

    const baseColumns = ref<GlobalDataTableColumns<RowData>>([
      {
        type: 'selection',
      },
      {
        title: 'Name',
        key: 'name',
      },
      {
        title: 'Sign Status',
        key: 'statusText',
      },
      {
        title: 'Sign Time',
        key: 'signTimeStart',
        render: (row: RowData) =>
          format(row.signTimeStart) + ' ~ ' + format(row.signTimeEnd),
      },
      {
        title: 'Age',
        key: 'age',
      },
      {
        title: 'Address',
        key: 'address',
      },
      {
        title: 'Tags',
        key: 'tags',
        render: (row: RowData) => {
          const tags = row.tags.map((tagKey) => {
            return (
              <NTag type="info" bordered={false} style="margin-right: 6px">
                {tagKey}
              </NTag>
            )
          })

          return tags
        },
      },
      {
        title: 'Remark',
        key: 'remark',
      },
    ])
    const mockPersonList = ref<RowData[]>(
      (() => {
        const length = 30
        const list: RowData[] = []
        const time = dayjs().valueOf()

        for (let i = 0; i < length; i++) {
          list.push({
            key: uuid(),
            name: Mock.Random.cname(),
            age: i + 20,
            address: Mock.Random.city(),
            tags: ['nice', 'developer'],
            remark: '我是一条很长很长的备注',
            status: i % 2 === 0 ? 'success' : 'error',
            statusText: i % 2 === 0 ? '在线' : '离线',
            signTimeStart: dayjs(time)
              .add(i * 2, 'year')
              .valueOf(),
            signTimeEnd: dayjs(time)
              .add(i + 5, 'day')
              .valueOf(),
          })
        }

        return list
      })(),
    )
    const switchRef = ref({
      footer: false,
      action: false,
      flexAutoHeight: true,
    })

    return {
      mockPersonList,
      baseColumns,
      switchRef,
    }
  },
  render() {
    const { mockPersonList, baseColumns, switchRef } = this

    return (
      <NFlex vertical class="flex-vertical">
        <RCollapse bordered>
          {{
            default: () => (
              <>
                <NFormItemGi label="用户名">
                  <NInput clearable />
                </NFormItemGi>
                <NFormItemGi label="状态">
                  <NSelect
                    clearable
                    options={[
                      {
                        label: '成功',
                        value: 'success',
                      },
                      {
                        label: '失败',
                        value: 'error',
                      },
                    ]}
                  />
                </NFormItemGi>
                <NFormItemGi label="登陆时间">
                  <NDatePicker type="datetimerange" clearable />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput clearable />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput clearable />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput clearable />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput clearable />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput clearable />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput clearable />
                </NFormItemGi>
              </>
            ),
            action: () => (
              <NFlex>
                <NButton type="primary">查询</NButton>
              </NFlex>
            ),
          }}
        </RCollapse>
        <RTablePro
          data={mockPersonList}
          v-model:columns={baseColumns}
          showPagination
          paginationCount={mockPersonList.length}
          remote={false}
          flexAutoHeight={switchRef.flexAutoHeight}
          title={
            <NFlex>
              <NFlex align="center">
                <NButton text focusable={false}>
                  流体高度
                </NButton>
                <NSwitch v-model:value={switchRef.flexAutoHeight} />
              </NFlex>
              <NFlex align="center">
                <NButton text focusable={false}>
                  底部区域插槽
                </NButton>
                <NSwitch v-model:value={switchRef.footer} />
              </NFlex>
              <NFlex align="center">
                <NButton text focusable={false}>
                  操作区域插槽
                </NButton>
                <NSwitch v-model:value={switchRef.action} />
              </NFlex>
            </NFlex>
          }
        >
          {{
            tableFooter: () =>
              switchRef.footer
                ? '表格的底部内容区域插槽，有时候你可能会用上'
                : null,
            tableAction: () =>
              switchRef.action
                ? '表格的操作区域内容插槽，有时候可能会用上'
                : null,
          }}
        </RTablePro>
      </NFlex>
    )
  },
})
