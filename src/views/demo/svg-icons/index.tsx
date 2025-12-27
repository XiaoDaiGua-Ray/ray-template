import './index.scss'
import { RIcon } from '@/components'
import { NCard, NFlex, NPopover } from 'naive-ui'

const PreviewSVGIcons = defineComponent({
  name: 'PreviewSVGIcons',
  setup() {
    const icons = ref<string[]>([])
    const iconsModules = import.meta.glob('@/icons/**/**.svg')

    Object.keys(iconsModules).forEach((curr) => {
      const iconName = curr.match(/\/(\w+)\.svg/)?.[1]

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
            <NFlex>
              {this.icons.map((curr) => (
                <div
                  class="pre-view-icons__card"
                  v-copy={`<RIcon name="${curr}" size="56" />`}
                  key={curr}
                >
                  <NPopover>
                    {{
                      trigger: () => (
                        <RIcon name={curr} size="56" cursor="pointer" />
                      ),
                      default: () => curr,
                    }}
                  </NPopover>
                </div>
              ))}
            </NFlex>
          ),
        }}
      </NCard>
    )
  },
})

export default PreviewSVGIcons
