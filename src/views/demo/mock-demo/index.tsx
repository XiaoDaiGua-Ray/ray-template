/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NFlex, NCard, NButton, NFormItemGi, NInput, NForm } from 'naive-ui'
import { RCollapseGrid, RTable } from '@/components'

import { useHookPlusRequest } from '@/axios'
import { getPersonList } from '@/api/demo/mock/person'
import { usePagination } from '@/hooks'
import { useCheckedRowKeys } from '@/components'

import type { Person } from '@/api/demo/mock/person'

const MockDemo = defineComponent({
  name: 'MockDemo',
  setup() {
    const columns = [
      {
        type: 'selection',
        multiple: true,
      },
      {
        title: 'id',
        key: 'id',
      },
      {
        title: '邮箱',
        key: 'email',
      },
      {
        title: '地址',
        key: 'address',
      },
      {
        title: '姓名',
        key: 'name',
      },
      {
        title: '年龄',
        key: 'age',
      },
      {
        title: '创建时间',
        key: 'createDate',
      },
      {
        title: '操作',
        key: 'action',
        render: (row: Person) => {
          return (
            <NFlex align="center">
              <NButton
                type="primary"
                text
                onClick={() => {
                  window.$message.info('查看')
                }}
              >
                查看
              </NButton>
              <NButton
                type="primary"
                text
                onClick={() => {
                  window.$message.warning('编辑')
                }}
              >
                编辑
              </NButton>
              <NButton
                type="error"
                text
                onClick={() => {
                  window.$message.error('删除')
                }}
              >
                删除
              </NButton>
            </NFlex>
          )
        },
      },
    ]
    const condition = reactive({
      email: null,
    })

    const [
      paginationRef,
      { getPage, getPageSize, setItemCount, getCallback, setPage, setPageSize },
    ] = usePagination(() => {
      personFetchRun({
        page: getPage(),
        pageSize: getPageSize(),
        email: condition.email,
      })
    })
    const {
      data: personData,
      loading: personLoading,
      run: personFetchRun,
    } = useHookPlusRequest(getPersonList, {
      defaultParams: [
        {
          page: getPage(),
          pageSize: getPageSize(),
          email: condition.email,
        },
      ],
      onSuccess: (res) => {
        const { total } = res

        setItemCount(total)
      },
    })

    return {
      personData,
      personLoading,
      columns,
      ...toRefs(condition),
      getCallback,
      paginationRef,
    }
  },
  render() {
    return (
      <NFlex vertical>
        <NCard title="Mock 数据">
          <h2>
            mock
            数据使用。但是，并没有启用生产环境的部署，所以生产环境结果为空。
          </h2>
        </NCard>
        <NCard title="提示">
          <h2>
            RTable
            组件有一个比较值得注意的地方就是，该组件会自动的按照数据量计算分页条数。所以你在异步获取数据的时候，一定要手动设置
            remote 属性为 true，并且设置 itemCount 或者 pageCount。
          </h2>
        </NCard>
        <NForm labelPlacement="left">
          <RCollapseGrid bordered={false} cols={3}>
            {{
              default: () => (
                <>
                  <NFormItemGi label="邮箱">
                    <NInput v-model:value={this.email} clearable />
                  </NFormItemGi>
                </>
              ),
              action: () => (
                <NButton type="primary" onClick={this.getCallback.bind(this)}>
                  搜索
                </NButton>
              ),
            }}
          </RCollapseGrid>
        </NForm>
        <RTable
          title="Mock数据表格"
          data={this.personData?.data}
          loading={this.personLoading}
          v-model:columns={this.columns}
          pagination={this.paginationRef}
          remote
          rowKey={(row) => row.id}
        />
      </NFlex>
    )
  },
})

export default MockDemo
