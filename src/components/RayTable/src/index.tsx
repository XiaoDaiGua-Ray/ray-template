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

import './index.scss'
import { NDataTable, NCard } from 'naive-ui'
import props from './props'
import RayIcon from '@/components/RayIcon/index'

const RayTable = defineComponent({
  name: 'RayTable',
  props: props,
  setup(props) {
    const modelRightClickMenu = computed(() => props.rightClickMenu)

    provide('rayTableProvider', {
      modelRightClickMenu,
    })

    return {}
  },
  render() {
    return (
      <NCard bordered={false}>
        {{
          default: () => (
            <NDataTable {...this.$props}>
              {{
                empty: () => this.$slots?.empty,
                loading: () => this.$slots?.loading,
              }}
            </NDataTable>
          ),
          header: () => this.title,
          'header-extra': () => (
            <RayIcon
              customClassName="ray-table__setting"
              name="setting"
              size="18"
            />
          ),
        }}
      </NCard>
    )
  },
})

export default RayTable
