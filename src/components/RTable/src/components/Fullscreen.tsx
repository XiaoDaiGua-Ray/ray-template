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
import { RIcon } from '@/components'

import config from '../config'
import { useFullscreen } from 'vue-hooks-plus'

import type { TableProvider } from '../type'

export default defineComponent({
  name: 'TableFullscreen',
  setup() {
    const { wrapperRef } = inject<TableProvider>(
      config.tableKey,
      {} as TableProvider,
    )
    const [isFullscreen, { toggleFullscreen, isEnabled }] =
      useFullscreen(wrapperRef)

    return {
      toggleFullscreen,
      isFullscreen,
      isEnabled,
    }
  },
  render() {
    const { toggleFullscreen, isEnabled, $t } = this

    return (
      <NPopover showArrow={false}>
        {{
          trigger: () => (
            <RIcon
              name="fullscreen"
              size={config.tableIconSize}
              cursor="pointer"
              onClick={() => {
                if (!isEnabled) {
                  $t('globalMessage.isEnabledFullscreen')
                }

                toggleFullscreen()
              }}
            />
          ),
          default: () => (this.isFullscreen ? '取消全屏' : '全屏表格'),
        }}
      </NPopover>
    )
  },
})
