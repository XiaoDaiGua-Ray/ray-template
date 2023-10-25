/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-10-04
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NPopover } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import config from '../config'
import { useFullscreen } from '@/hooks/web/index'

import type { TableProvider } from '../type'

export default defineComponent({
  name: 'TableFullscreen',
  setup() {
    const { wrapperRef } = inject<TableProvider>(
      config.tableKey,
      {} as TableProvider,
    )
    const [isFullscreen, { toggleFullscreen }] = useFullscreen(wrapperRef)

    return {
      toggleFullscreen,
      isFullscreen,
    }
  },
  render() {
    return (
      <NPopover showArrow={false}>
        {{
          trigger: () => (
            <RIcon
              name="fullscreen"
              size={config.tableIconSize}
              cursor="pointer"
              onClick={this.toggleFullscreen.bind(this)}
            />
          ),
          default: () => (this.isFullscreen ? '取消全屏' : '全屏表格'),
        }}
      </NPopover>
    )
  },
})
