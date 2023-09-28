/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-25
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NSpace, NCard, NPopover } from 'naive-ui'
import RayIcon from '@/components/RIcon/index'

const PreviewSVGIcons = defineComponent({
  name: 'PreviewSVGIcons',
  setup() {
    const icons = ref<string[]>([])
    const iconsModules = import.meta.glob('@/icons/**.svg')

    Object.keys(iconsModules).forEach((curr) => {
      const iconName = curr.match(/\/(\w+)\.svg/)![1]

      if (iconName) {
        icons.value.push(iconName)
      }
    })

    return {
      icons,
    }
  },
  render() {
    return (
      <NCard title="svg图标">
        {{
          'header-extra': () => '点击图标复制代码',
          default: () => (
            <NSpace wrapItem={false}>
              {this.icons.map((curr) => (
                <div
                  class="pre-view-icons__card"
                  v-copy={`<RayIcon name="${curr}" size="56" />`}
                >
                  <NPopover>
                    {{
                      trigger: () => (
                        <RayIcon name={curr} size="56" cursor="pointer" />
                      ),
                      default: () => curr,
                    }}
                  </NPopover>
                </div>
              ))}
            </NSpace>
          ),
        }}
      </NCard>
    )
  },
})

export default PreviewSVGIcons
