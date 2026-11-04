import { defineComponent, inject } from 'vue'
import { useFullscreen } from 'vue-hooks-plus'
import { useTableLocale } from '../locale'
import { config } from '../shared'
import ToolButton from './ToolButton'

export default defineComponent({
  name: 'TableFullscreen',
  setup() {
    const wrapper = inject(config.wrapperKey)
    const [isFullscreen, { toggleFullscreen, isEnabled }] =
      useFullscreen(wrapper)
    const { t } = useTableLocale()

    return () => (
      <ToolButton
        icon={
          isFullscreen.value ? 'action/fullscreen_fold' : 'action/fullscreen'
        }
        label={t(isFullscreen.value ? 'exitFullscreen' : 'fullscreen')}
        disabled={!isEnabled}
        onClick={toggleFullscreen}
      />
    )
  },
})
