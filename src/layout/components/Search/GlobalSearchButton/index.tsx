import './index.scss'

import { NButton, NFlex } from 'naive-ui'
import { RIcon } from '@/components'

import { detectOperatingSystem, call } from '@/utils'

import type { PropType } from 'vue'
import type { MaybeArray } from '@/types'

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
        class="global-search__btn-wrapper"
        bordered={false}
        onClick={click.bind(this)}
      >
        {{
          icon: () => <RIcon name="search" size="16" />,
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
