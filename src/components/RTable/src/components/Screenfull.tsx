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

import screenfull from 'screenfull'
import config from '../config'

import type { TableProvider } from '../type'

export default defineComponent({
  name: 'TableScreenfull',
  setup() {
    const { uuidWrapper } = inject<TableProvider>(
      'tableProvider',
      {} as TableProvider,
    )
    const currentTableIsFullscreen = ref(screenfull.isFullscreen) // 缓存当前是否处于全屏状态

    const fullscreenTableClick = () => {
      const el = document.getElementById(uuidWrapper)

      currentTableIsFullscreen.value = !currentTableIsFullscreen.value

      if (el && screenfull.isEnabled && currentTableIsFullscreen.value) {
        screenfull.request(el)
      } else {
        screenfull.exit()
      }
    }

    return {
      fullscreenTableClick,
      currentTableIsFullscreen,
    }
  },
  render() {
    return (
      <NPopover>
        {{
          trigger: () => (
            <RIcon
              name="fullscreen"
              size={config.tableIconSize}
              cursor="pointer"
              onClick={this.fullscreenTableClick.bind(this)}
            />
          ),
          default: () =>
            this.currentTableIsFullscreen ? '取消全屏' : '全屏表格',
        }}
      </NPopover>
    )
  },
})
