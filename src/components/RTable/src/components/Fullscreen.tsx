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

import { RIcon } from '@/components'

import { config } from '../shared'
import { useFullscreen } from 'vue-hooks-plus'

import type { TableProvider } from '../types'

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
      isEnabled,
    }
  },
  render() {
    const { toggleFullscreen, isEnabled, $t } = this

    return (
      <RIcon
        name="fullscreen"
        size={config.tableIconSize}
        cursor="pointer"
        onClick={() => {
          if (!isEnabled) {
            window.$message.warning($t('globalMessage.isEnabledFullscreen'))
          }

          toggleFullscreen()
        }}
      />
    )
  },
})
