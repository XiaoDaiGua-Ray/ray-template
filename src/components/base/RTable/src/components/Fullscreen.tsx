import { RIcon } from '@/components'
import { useFullscreen } from 'vue-hooks-plus'
import { config } from '../shared'
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
