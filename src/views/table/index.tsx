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

import { NLayout, NCard } from 'naive-ui'
import RayTable from '@/components/RayTable/index'

const TableView = defineComponent({
  name: 'TableView',
  setup() {
    return {}
  },
  render() {
    return (
      <NLayout>
        <NCard title="RayTable">
          该组件基于 Naive UI DataTable 组件封装. 实现右键菜单, 表格标题,
          操作栏等功能
        </NCard>
        <NCard title="基础使用" style={['margin-top: 18px']}>
          <RayTable title="基础表格" />
        </NCard>
        <NCard style={['margin-top: 18px']}>
          <RayTable />
        </NCard>
      </NLayout>
    )
  },
})

export default TableView
