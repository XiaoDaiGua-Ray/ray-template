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

import { NLayout, NCard, NTag, NButton } from 'naive-ui'
import RayTable from '@/components/RayTable/index'

import type { DataTableColumns } from 'naive-ui'

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
            return h(
              NTag,
              {
                style: {
                  marginRight: '6px',
                },
                type: 'info',
                bordered: false,
              },
              {
                default: () => tagKey,
              },
            )
          })

          return tags
        },
      },
      {
        title: 'Action',
        key: 'actions',
        render: (row: RowData) =>
          h(
            NButton,
            {
              size: 'small',
            },
            { default: () => 'Send Email' },
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
      },
      {
        key: 1,
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['wow'],
      },
      {
        key: 2,
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
      },
    ])
    const tableMenuOptions = [
      {
        label: '编辑',
        key: 'edit',
      },
      {
        label: () => h('span', { style: { color: 'red' } }, '删除'),
        key: 'delete',
      },
    ]

    const handleMenuSelect = (key: string | number, idx: number) => {
      if (key === 'delete') {
        tableData.value.splice(idx, 1)
      }
    }

    return {
      tableData,
      actionColumns,
      baseColumns,
      tableMenuOptions,
      handleMenuSelect,
    }
  },
  render() {
    return (
      <NLayout>
        <NCard title="RayTable">
          <p>
            该组件基于 Naive UI DataTable 组件封装. 实现右键菜单, 表格标题,
            操作栏等功能
          </p>
          <p>RayTable 完全继承 DataTable 的所有属性与方法</p>
          <p>
            相关拓展 props 属性, 可以在源码位置
            src/components/RayTable/src/props.ts 中查看相关代码与注释
          </p>
        </NCard>
        <NCard title="基础使用" style={['margin-top: 18px']}>
          <RayTable
            title="基础表格"
            data={this.tableData}
            columns={this.baseColumns}
            action={false}
          />
        </NCard>
        <NCard style={['margin-top: 18px']}>
          {{
            header: () => (
              <div>
                <p>
                  使用响应式方法代理 columns 并且打开 action
                  则可以启用操作栏(v-model:columns)
                </p>
                <p>拖拽操作栏动态切换表格列</p>
                <p>点击左右固定按钮, 即可动态固定列</p>
                <p>点击修改列宽度, 即可拖动列修改宽度</p>
              </div>
            ),
            default: () => (
              <RayTable
                title="带有拓展功能的表格"
                data={this.tableData}
                v-model:columns={this.actionColumns}
              />
            ),
          }}
        </NCard>
        <NCard title="右键菜单" style={['margin-top: 18px']}>
          <RayTable
            title="右键菜单表格"
            action={false}
            data={this.tableData}
            columns={this.baseColumns}
            rightClickMenu={this.tableMenuOptions}
            onMenuSelect={this.handleMenuSelect.bind(this)}
          />
        </NCard>
      </NLayout>
    )
  },
})

export default TableView
