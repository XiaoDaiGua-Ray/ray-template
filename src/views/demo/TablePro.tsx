import { RTablePro, RCollapse } from '@/components-pro'
import {
  NFlex,
  NTag,
  NButton,
  NFormItemGi,
  NInput,
  NCard,
  NRadioGroup,
  NRadioButton,
  NFormItem,
  NSelect,
  NDatePicker,
  NText,
} from 'naive-ui'
import { RIcon } from '@/components'

import { uuid } from '@/utils'
import { useHookPlusRequest } from '@/axios'
import Mock from 'mockjs'
import dayjs from 'dayjs'
import { useTablePro } from '@/components-pro'
import { useCheckedRowKeys } from '@/components'
import { useDayjs } from '@/hooks'

import type { DataTableColumns } from 'naive-ui'

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

interface ParamsRef
  extends Partial<
    Pick<RowData, 'name' | 'status' | 'signTimeStart' | 'signTimeEnd'>
  > {
  page?: number
  pageSize?: number
  RangeTime?: [number, number] | null
}

interface BasicResponse<T = unknown> {
  /**
   *
   * @description
   * 返回数据。
   */
  data: T
  /**
   *
   * @description
   * 返回描述信息。
   */
  message: string
  /**
   *
   * @description
   * 返回状态码。
   */
  code: number
  /**
   *
   * @description
   * 额外的错误描述信息。
   */
  exceptionMessage: string
}

interface PaginationResponse<T = unknown> extends BasicResponse<T> {
  /**
   *
   * @description
   * 分页总条数。
   */
  total: number
  /**
   *
   * @description
   * 分页页数。
   */
  pageSize: number
  /**
   *
   * @description
   * 当前页数。
   */
  page: number
}

export default defineComponent({
  name: 'TableProDemo',
  setup() {
    const { format } = useDayjs()

    /**
     *
     * @description
     * register: 注册表格实例
     * runTableRequest: 获取 TablePro 内部管理的请求方法，会自动合并 page, pageSize 等参数，如果有。
     * getUpdateInfo: 如果需要自定义请求情况，可以使用该方法获取最新的 page, pageSize 等参数。
     */
    const [
      tableProRegister,
      { runTableRequest, getCurrentTableRequestParams, print, downloadCsv },
    ] = useTablePro()
    // 表格数据
    const tableDataRef = ref<RowData[]>([])
    // 表格列
    const baseColumns: DataTableColumns<RowData> = [
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
    ]
    // 表格分页数据
    const itemCountRef = ref(0)
    // 查询条件
    const conditionRef = ref<ParamsRef>({})
    // 缓存模拟数据，不用关心
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
    const radioRef = ref({
      pagination: true,
      manual: false,
    })
    const [
      checkedRowKeys,
      { checkedRowKeysBind, getKeys, getRows, clearKey, clearAll, selectKey },
    ] = useCheckedRowKeys(tableDataRef, baseColumns, {
      rowKey: 'key',
      onChange: (keys, rows, meta) => {},
    })
    const collapseRef = ref(true)

    const isNullOrUndefined = (value: unknown) => {
      return value === null || value === void 0
    }

    // 模拟请求
    const getPersonList = (
      params: ParamsRef,
    ): Promise<PaginationResponse<RowData[]>> => {
      return new Promise((resolve) => {
        const {
          page = 1,
          pageSize = 10,
          name,
          status,
          signTimeStart,
          signTimeEnd,
        } = params || {}
        let list: RowData[] = mockPersonList.value
        const defaultLength = mockPersonList.value.length

        if (name) {
          list = list.filter((curr) => curr.name.includes(name))
        }

        if (status) {
          list = list.filter((curr) => curr.status === status)
        }

        if (signTimeStart && signTimeEnd) {
          list = list.filter((curr) => {
            return (
              curr.signTimeStart >= signTimeStart &&
              curr.signTimeEnd <= signTimeEnd
            )
          })
        }

        list = list.slice((page - 1) * pageSize, page * pageSize)

        setTimeout(() => {
          resolve({
            code: 0,
            data: list,
            total:
              isNullOrUndefined(status) &&
              isNullOrUndefined(name) &&
              (isNullOrUndefined(signTimeStart) ||
                isNullOrUndefined(signTimeEnd))
                ? defaultLength
                : list.length,
            message: 'success',
            page,
            pageSize,
          } as PaginationResponse<RowData[]>)
        }, 1000)
      })
    }

    const { run: runGetPersonList, loading: loadingGetPersonList } =
      useHookPlusRequest(getPersonList, {
        onSuccess: (res) => {
          const { data, total } = res

          tableDataRef.value = data
          itemCountRef.value = total
        },
      })

    return {
      tableDataRef,
      baseColumns,
      itemCountRef,
      loadingGetPersonList,
      runGetPersonList,
      conditionRef,
      radioRef,
      runTableRequest,
      tableProRegister,
      print,
      downloadCsv,
      checkedRowKeysBind,
      checkedRowKeys,
      getKeys,
      getRows,
      clearKey,
      clearAll,
      collapseRef,
      selectKey,
    }
  },
  render() {
    const {
      tableDataRef,
      baseColumns,
      itemCountRef,
      loadingGetPersonList,
      runGetPersonList,
      conditionRef,
      radioRef,
      runTableRequest,
      tableProRegister,
      print,
      downloadCsv,
      checkedRowKeysBind,
      getKeys,
      getRows,
      clearKey,
      clearAll,
      selectKey,
    } = this

    return (
      <NFlex vertical>
        <RCollapse open={this.collapseRef} bordered>
          {{
            default: () => (
              <>
                <NFormItemGi label="用户名">
                  <NInput v-model:value={conditionRef.name} clearable />
                </NFormItemGi>
                <NFormItemGi label="状态">
                  <NSelect
                    v-model:value={conditionRef.status}
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
                  <NDatePicker
                    type="datetimerange"
                    v-model:value={conditionRef.RangeTime}
                    clearable
                  />
                </NFormItemGi>
                <NFormItemGi label="演示折叠的条件框">
                  <NInput readonly placeholder="我只是为了占位" />
                </NFormItemGi>
              </>
            ),
            action: () => (
              <NFlex>
                <NButton
                  type="primary"
                  onClick={() => runTableRequest()}
                  loading={loadingGetPersonList}
                >
                  查询
                </NButton>
              </NFlex>
            ),
            collapse: (open: boolean) =>
              open ? (
                <NButton onClick={() => (this.collapseRef = true)} secondary>
                  {{
                    default: () => '受控展开',
                    icon: () => <RIcon name="dark" size="18" />,
                  }}
                </NButton>
              ) : (
                <NButton onClick={() => (this.collapseRef = false)} secondary>
                  {{
                    default: () => '受控收起',
                    icon: () => <RIcon name="light" size="18" />,
                  }}
                </NButton>
              ),
          }}
        </RCollapse>
        <NCard title="常用高级拓展功能">
          <NFlex>
            <NFormItem label="分页">
              <NRadioGroup v-model:value={radioRef.pagination}>
                <NRadioButton value={true}>显示分页</NRadioButton>
                <NRadioButton value={false}>隐藏分页</NRadioButton>
              </NRadioGroup>
            </NFormItem>
            <NFormItem label="自动更新">
              <NRadioGroup v-model:value={radioRef.manual}>
                <NRadioButton value={false}>自动更新</NRadioButton>
                <NRadioButton value={true}>取消自动</NRadioButton>
              </NRadioGroup>
            </NFormItem>
          </NFlex>
        </NCard>
        <NCard title="useTablePro 部分方法">
          <NFlex>
            <NButton type="primary" onClick={() => print()}>
              打印
            </NButton>
            <NButton type="primary" onClick={() => downloadCsv()}>
              下载 csv
            </NButton>
          </NFlex>
        </NCard>
        <NCard title="useCheckedRowKeys 部分方法">
          <NFlex>
            <NButton
              type="primary"
              onClick={() => {
                const key = tableDataRef[1].key

                selectKey(key)
              }}
            >
              选中第二行
            </NButton>
            <NButton
              type="primary"
              onClick={() => {
                const key = tableDataRef[1].key

                clearKey(key)
              }}
            >
              取消选中第二行
            </NButton>
            <NButton
              type="primary"
              onClick={() => {
                tableDataRef?.forEach((curr) => selectKey(curr.key))
              }}
            >
              选中当前页面所有行
            </NButton>
            <NButton
              type="primary"
              onClick={() => {
                clearAll()
              }}
            >
              取消所有已选中行
            </NButton>
          </NFlex>
        </NCard>
        <RTablePro
          onRegister={tableProRegister}
          data={tableDataRef}
          columns={baseColumns}
          loading={loadingGetPersonList}
          // 如果需要设置分页功能，则该参数必传
          paginationCount={itemCountRef}
          request={runGetPersonList}
          requestConfig={{
            params: conditionRef,
            // 这是后台的统计字段，根据实际情况配置
            formatRangeTime: [
              {
                key: 'RangeTime',
                target: ['signTimeStart', 'signTimeEnd'],
              },
            ],
          }}
          showPagination={radioRef.pagination}
          manual={radioRef.manual}
          rowKey={(row) => row.key}
          v-model:checkedRowKeys={this.checkedRowKeys}
          onUpdateCheckedRowKeys={checkedRowKeysBind}
        />
      </NFlex>
    )
  },
})
