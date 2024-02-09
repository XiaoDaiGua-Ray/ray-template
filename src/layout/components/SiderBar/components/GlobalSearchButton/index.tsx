/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-01-23
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

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
      <NButton bordered={false} onClick={click.bind(this)}>
        {{
          icon: () => <RIcon name="search" size="16" />,
          default: () => (
            <NFlex align="center">
              {$t('headerTooltip.Search')}
              <NButton size="tiny">{getShortcutKeyAboutSystem()}</NButton>
            </NFlex>
          ),
        }}
      </NButton>
    )
  },
})
