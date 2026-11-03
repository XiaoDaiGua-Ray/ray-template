import { useI18n } from '@/hooks/template/useI18n'
import { useFullscreen } from 'vue-hooks-plus'
import { config } from '../shared'
import ToolButton from './ToolButton'

export default defineComponent({
  name: 'TableFullscreen',
  setup() {
    const wrapper = inject(config.wrapperKey)
    const [isFullscreen, { toggleFullscreen, isEnabled }] =
      useFullscreen(wrapper)
    const { t } = useI18n('headerTooltip')

    return () => (
      <ToolButton
        icon={
          isFullscreen.value ? 'action/fullscreen_fold' : 'action/fullscreen'
        }
        label={t(isFullscreen.value ? 'CancelFullScreen' : 'FullScreen')}
        disabled={!isEnabled}
        onClick={toggleFullscreen}
      />
    )
  },
})
