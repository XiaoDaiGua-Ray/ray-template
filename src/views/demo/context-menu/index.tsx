/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-12-01
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NFlex, NCard, NDropdown } from 'naive-ui'

import { useContextmenuCoordinate } from '@/hooks'

export default defineComponent({
  name: 'ContextMenuDemo',
  setup() {
    const demoOneRef = ref<HTMLElement>()
    const demoOneShow = ref(false)
    const options = ref([
      {
        label: '杰·盖茨比',
        key: 'jay gatsby',
      },
      {
        label: '黛西·布坎南',
        key: 'daisy buchanan',
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: '尼克·卡拉威',
        key: 'nick carraway',
      },
    ])

    const { x, y, show } = useContextmenuCoordinate(demoOneRef)

    return {
      demoOneRef,
      demoOneShow,
      x,
      y,
      show,
      options,
    }
  },
  render() {
    const { x, y, show } = this

    return (
      <NFlex vertical>
        <NCard title="useContextmenuCoordinate + NDropdown 实现右键菜单">
          <NFlex vertical>
            <h3>默认点击元素外部会关闭菜单。</h3>
            <div
              ref="demoOneRef"
              style="width: 100%; height: 200px; background-color: rgba(0, 128, 0, 0.5)"
            >
              右击
            </div>
          </NFlex>
        </NCard>
        <NDropdown
          show={show}
          x={x}
          y={y}
          options={this.options}
          trigger="manual"
          placement="bottom-start"
        />
      </NFlex>
    )
  },
})
