import './index.scss'
import type { MaybeArray } from '@/types'
import { call, detectOperatingSystem } from '@/utils'
import { RIcon } from '@ray-template/ui/icon'
import { NButton, NFlex } from 'naive-ui'
import type { PropType } from 'vue'

export default defineComponent({
  name: 'GlobalSearchButton',
  props: {
    onClick: {
      type: [Function, Array] as PropType<MaybeArray<(e: MouseEvent) => void>>,
      default: null,
    },
  },
  setup(props) {
    const getShortcutKeyAboutSystem = () => {
      const operatingSystem = detectOperatingSystem()

      if (operatingSystem === 'MacOS') {
        return '⌘ + K'
      }

      if (operatingSystem === 'Windows') {
        return 'CTRL + K'
      }

      return 'CTRL + K'
    }

    const click = (e: MouseEvent) => {
      const { onClick } = props

      if (onClick) {
        call(onClick, e)
      }
    }

    return {
      getShortcutKeyAboutSystem,
      click,
    }
  },
  render() {
    const { getShortcutKeyAboutSystem, click, $t } = this

    return (
      <NButton
        bordered={false}
        onClick={click.bind(this)}
        round
        tertiary
        style="margin-right: 16px"
      >
        {{
          icon: () => <RIcon name="action/search" />,
          default: () => (
            <NFlex align="center">
              {$t('headerTooltip.Search')}
              <div class="global-search-btn__label">
                {getShortcutKeyAboutSystem()}
              </div>
            </NFlex>
          ),
        }}
      </NButton>
    )
  },
})
