import {
  RCollapse,
  RIcon,
  RMoreDropdown,
  RTable,
  useCheckedRowKeys,
  useTable,
} from '@/components'
import { uuid } from '@/utils'
import {
  NAlert,
  NButton,
  NCard,
  NDatePicker,
  NFlex,
  NGridItem,
  NInput,
  NPopover,
  NSelect,
  NSwitch,
  NTag,
} from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

type RowData = {
  key: number | string
  name: string
  age: number
  address: string
  tags: string[]
  remark: string
}

const TableView = defineComponent({
  name: 'TableView',
  setup() {
    // 使用以下 hooks 的时候，应该注意调用时机
    const [
      register,
      {
        getTableInstance,
        clearFilters,
        clearSorter,
        scrollTo,
        filters,
        sort,
        downloadCsv,
        print,
      },
    ] = useTable()

    const baseColumns: DataTableColumns<RowData> = [
      {
        type: 'selection',
      },
      {
        title: 'Name',
        key: 'name',
        filterOptions: [
          {
            label: 'John Brown',
            value: 'John Brown',
          },
          {
            label: 'Jim Green',
            value: 'Jim Green',
          },
        ],
        filter: (value, row) => row.name.includes(value.toString()),
      },

      {
        title: 'Age',
        key: 'age',
        sorter: (a, b) => a.age - b.age,
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
      {
        title: 'Action',
        key: 'actions',
        render: (row: RowData) => (
          <NFlex align="center">
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
          </NFlex>
        ),
      },
    ]
    const actionColumns = ref<DataTableColumns<RowData>>(
      [...baseColumns].map((curr, idx) => ({
        ...curr,
      })),
    )
    const tableData = ref<RowData[]>([])
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
    const [
      checkedRowKeys,
      { checkedRowKeysBind, getKeys, getRows, clearKey, clearAll, selectKey },
    ] = useCheckedRowKeys(tableData, actionColumns, {
      rowKey: 'key',
      onChange: (keys, rows, meta) => {},
    })

    const createTableData = () => {
      for (let i = 0; i < 10; i++) {
        tableData.value.push({
          key: uuid(),
          name: i % 2 === 0 ? 'John Brown' : 'Jim Green',
          age: i + 20,
          address: 'New York No. 1 Lake Park',
          tags: ['nice', 'developer'],
          remark: '我是一条很长很长的备注',
        })
      }
    }

    const menuSelect = (key: string | number) => {
      window.$message.info(`${key}`)
    }

    const clearSecondIndexRow = () => {
      const { key } = tableData.value[1]

      clearKey(key)
    }

    const selectAll = () => {
      const keys = tableData.value.map((curr) => curr.key)

      keys.forEach((curr) => selectKey(curr))
    }

    const selectSecondIndexRow = () => {
      const { key } = tableData.value[1]

      selectKey(key)
    }

    createTableData()

    return {
      ...toRefs(state),
      tableData,
      actionColumns,
      baseColumns,
      tableMenuOptions,
      menuSelect,
      register,
      getKeys,
      getRows,
      clearKey,
      clearAll,
      checkedRowKeysBind,
      checkedRowKeys,
      clearSecondIndexRow,
      selectAll,
      selectSecondIndexRow,
      clearFilters,
      clearSorter,
      scrollTo,
      filters,
      sort,
      downloadCsv,
      getTableInstance,
      print,
    }
  },
  render() {
    const {
      register,
      clearAll,
      checkedRowKeysBind,
      clearSecondIndexRow,
      selectAll,
      selectSecondIndexRow,
      clearFilters,
      clearSorter,
      scrollTo,
      filters,
      sort,
      downloadCsv,
      getTableInstance,
      getRows,
      getKeys,
      print,
    } = this

    return (
      <NFlex vertical>
        <NCard title="RTable">
          基于 NDataTable 封装，继承该组件所有 props 属性。查看 RTable props
          文件即可查看该组件拓展项
        </NCard>
        <NCard title="useTable">
          <NFlex vertical style="width: 100%">
            <NAlert title="DataTable Methods" type="info">
              其余的方法查看{' '}
              <a
                style="color: transparent"
                href="https://www.naiveui.com/zh-CN/dark/components/data-table#DataTable-Methods"
              >
                Naive UI
              </a>
              官网，保持一致。
            </NAlert>
            <NFlex>
              <NButton onClick={clearSorter.bind(this)}>清除所有排序</NButton>
              <NButton onClick={clearFilters.bind(this)}>清除所有过滤</NButton>
              <NButton
                onClick={() => {
                  downloadCsv()
                }}
              >
                下载 CSV
              </NButton>
              <NButton onClick={() => getTableInstance()}>
                getTableInstance
              </NButton>
              <NButton onClick={() => print()}>打印</NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NCard title="useCheckedRowKeys">
          <NFlex vertical>
            <NFlex>
              <NButton onClick={selectAll.bind(this)}>选中所有行</NButton>
              <NButton onClick={clearAll.bind(this)}>取消所有已选中行</NButton>
              <NButton onClick={selectSecondIndexRow.bind(this)}>
                选中第二行
              </NButton>
              <NButton onClick={clearSecondIndexRow.bind(this)}>
                取消第二行选中
              </NButton>
            </NFlex>
            <NFlex>
              {this.checkedRowKeys.map((curr) => (
                <NTag type="success" key={curr}>
                  {curr}
                </NTag>
              ))}
            </NFlex>
          </NFlex>
        </NCard>
        <RCollapse
          collapsedRows={this.gridCollapsedRows}
          cols={this.gridItemCount}
          onUpdateOpen={(value: boolean) =>
            window.$message.info(
              `我是 RCollapse 组件${value ? '收起' : '展开'}的回调函数`,
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
        </RCollapse>
        <RTable
          v-model:checkedRowKeys={this.checkedRowKeys}
          onUpdateCheckedRowKeys={checkedRowKeysBind.bind(this)}
          onRegister={register.bind(this)}
          scrollX={1000}
          title={
            <NFlex align="center">
              <span>标题插槽:</span>
              <NSwitch
                onUpdateValue={(value: boolean) => (this.tableLoading = value)}
              ></NSwitch>
            </NFlex>
          }
          data={this.tableData}
          v-model:columns={this.actionColumns}
          pagination={{
            pageSize: 10,
          }}
          contextMenuOptions={this.tableMenuOptions}
          loading={this.tableLoading}
          onContextMenuClick={this.menuSelect.bind(this)}
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
          rowKey={(row) => row.key}
          striped
        >
          {{
            tableFooter: () => '表格的底部内容区域插槽，有时候你可能会用上',
            tableAction: () => '表格的操作区域内容插槽，有时候可能会用上',
          }}
        </RTable>
      </NFlex>
    )
  },
})

export default TableView
