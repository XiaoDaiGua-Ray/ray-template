/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-03-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NPopover } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import screenfull from 'screenfull'

import type { TableSettingProvider } from '@/components/RayTable/src/type'

const TableScreenfull = defineComponent({
  name: 'TableScreenfull',
  setup() {
    const tableSettingProvider = inject(
      'tableSettingProvider',
      {} as TableSettingProvider,
    )

    const rayTableUUID = computed(() => tableSettingProvider.rayTableUUID)
    let currentTableIsFullscreen = screenfull.isFullscreen // 缓存当前是否处于全屏状态

    const handleScreenfull = () => {
      const el = document.getElementById(rayTableUUID.value)

      currentTableIsFullscreen = !currentTableIsFullscreen

      if (el && screenfull.isEnabled && currentTableIsFullscreen) {
        screenfull.request(el)
      } else {
        screenfull.exit()
      }
    }

    return {
      handleScreenfull,
    }
  },
  render() {
    return (
      <NPopover>
        {{
          trigger: () => (
            <RayIcon
              name="fullscreen"
              size="18"
              customClassName="ray-table-icon tay-table-icon__screenfull"
              onClick={this.handleScreenfull.bind(this)}
            />
          ),
          default: () => '全屏表格',
        }}
      </NPopover>
    )
  },
})

export default TableScreenfull
