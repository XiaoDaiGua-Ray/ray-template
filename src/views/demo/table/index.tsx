/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import {
  NTag,
  NButton,
  NGridItem,
  NSelect,
  NInput,
  NDatePicker,
  NSwitch,
  NSpace,
  NPopover,
  NCard,
} from 'naive-ui'
import { RCollapseGrid, RTable, RIcon, RMoreDropdown } from '@/components'

import type { DataTableColumns } from 'naive-ui'
import type { RTableType } from '@/components'

type RowData = {
  key: number
  name: string
  age: number
  address: string
  tags: string[]
}

const TableView = defineComponent({
  name: 'TableView',
  setup() {
    const baseColumns = [
      {
        title: 'Name',
        key: 'name',
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
        width: 300,
      },
      {
        title: 'Action',
        key: 'actions',
        render: (row: RowData) => (
          <NSpace align="center">
            <NButton size="tiny">查看</NButton>
            <RMoreDropdown
              options={[
                {
                  label: '编辑',
                  key: 'edit',
                },
                {
                  label: '新增',
                  key: 'add',
                },
              ]}
              onSelect={(key) => {
                window.$message.info(`当前选择: ${key}`)
              }}
            />
          </NSpace>
        ),
      },
    ]
    const actionColumns = ref<DataTableColumns<RowData>>(
      [...baseColumns].map((curr) => ({ ...curr, width: 400 })),
    )
    const tableData = ref([
      {
        key: 0,
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
        remark: '我是一条很长很长的备注',
      },
      {
        key: 1,
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['wow'],
        remark: '我是一条很长很长的备注',
      },
      {
        key: 2,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
        remark: '我是一条很长很长的备注',
      },
    ])
    const tableMenuOptions = [
      {
        label: '编辑',
        key: 'edit',
      },
      {
        label: () => <span style="color: red;">删除</span>,
        key: 'delete',
      },
    ]
    const state = reactive({
      gridItemCount: 4,
      gridCollapsedRows: 1,
      tableLoading: false,
    })

    const handleMenuSelect = (key: string | number) => {
      window.$message.info(`${key}`)
    }

    return {
      ...toRefs(state),
      tableData,
      actionColumns,
      baseColumns,
      tableMenuOptions,
      handleMenuSelect,
    }
  },
  render() {
    return (
      <NSpace vertical>
        <NCard title="RTable">
          基于 NDataTable 封装，继承该组件所有 props 属性。查看 RTable props
          文件即可查看该组件拓展项
        </NCard>
        <RCollapseGrid
          bordered={false}
          collapsedRows={this.gridCollapsedRows}
          cols={this.gridItemCount}
          onUpdateValue={(value: boolean) =>
            window.$message.info(
              `我是 RCollapseGrid 组件${value ? '收起' : '展开'}的回调函数`,
            )
          }
        >
          {{
            action: () => (
              <>
                <NButton type="primary">搜索</NButton>
                <NButton>重置</NButton>
              </>
            ),
            default: () => (
              <>
                <NGridItem>
                  <NSelect />
                </NGridItem>
                <NGridItem>
                  <NInput />
                </NGridItem>
                <NGridItem>
                  <NDatePicker type="datetimerange" clearable />
                </NGridItem>
                <NGridItem>
                  <NInput />
                </NGridItem>
                <NGridItem>
                  <NInput />
                </NGridItem>
              </>
            ),
          }}
        </RCollapseGrid>
        <RTable
          scrollX={2000}
          title={
            <NSpace align="center">
              <span>标题插槽:</span>
              <NSwitch
                onUpdateValue={(value: boolean) => (this.tableLoading = value)}
              ></NSwitch>
            </NSpace>
          }
          data={this.tableData}
          v-model:columns={this.actionColumns}
          pagination={{
            pageSize: 10,
          }}
          contextMenuOptions={this.tableMenuOptions}
          loading={this.tableLoading}
          onContextMenuClick={this.handleMenuSelect.bind(this)}
          toolOptions={[
            <NPopover>
              {{
                trigger: () => (
                  <RIcon
                    name="search"
                    size="18"
                    cursor="pointer"
                    onClick={() => {
                      window.$message.info('点击了搜索按钮')
                    }}
                  />
                ),
                default: () => '我是自定义工具栏示例',
              }}
            </NPopover>,
          ]}
        >
          {{
            tableFooter: () => '表格的底部内容区域插槽，有时候你可能会用上',
            tableAction: () => '表格的操作区域内容插槽，有时候可能会用上',
          }}
        </RTable>
      </NSpace>
    )
  },
})

export default TableView
