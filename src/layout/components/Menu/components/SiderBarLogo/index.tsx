import './index.scss'

import { NEllipsis, NTooltip, NGradientText } from 'naive-ui'
import { RIcon } from '@/components'

import { isValueType, renderNode } from '@/utils'
import { useSettingGetters } from '@/store'

export const SIDER_BAR_LOGO = ref<HTMLElement>()

export default defineComponent({
  name: 'SiderBarLogo',
  props: {
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const router = useRouter()
    const { getSideBarLogo } = useSettingGetters()

    /**
     *
     * 点击 logo 跳转页面
     * jumpType:
     *   - station: 模板内跳转
     *   - outsideStation: 新开页面跳转
     */
    const sideBarLogoClick = () => {
      if (getSideBarLogo.value && getSideBarLogo.value.url) {
        getSideBarLogo.value.jumpType === 'station'
          ? router.push(getSideBarLogo.value.url)
          : window.open(getSideBarLogo.value.url)
      }
    }

    const TemplateLogo = ({ cursor }: { cursor: string }) => {
      if (!getSideBarLogo.value) {
        return null
      }

      if (typeof getSideBarLogo.value.icon === 'string') {
        return (
          <RIcon
            name={getSideBarLogo.value.icon as string}
            size="30"
            cursor={cursor}
          />
        )
      }

      if (isValueType<object>(getSideBarLogo.value.icon, 'Object')) {
        return renderNode(getSideBarLogo.value.icon)
      }
    }

    return {
      sideBarLogo: getSideBarLogo,
      sideBarLogoClick,
      TemplateLogo,
    }
  },
  render() {
    const { sideBarLogo, collapsed, TemplateLogo, sideBarLogoClick } = this

    return sideBarLogo?.title ? (
      <div
        class={[
          'ray-menu__logo',
          sideBarLogo?.url ? 'ray-menu__logo-url' : null,
        ]}
        onClick={sideBarLogoClick.bind(this)}
        ref={SIDER_BAR_LOGO}
      >
        {sideBarLogo?.icon ? (
          collapsed ? (
            <NTooltip placement="right">
              {{
                trigger: () =>
                  TemplateLogo({
                    cursor: 'pointer',
                  }),
                default: () => sideBarLogo.title,
              }}
            </NTooltip>
          ) : (
            TemplateLogo({
              cursor: 'pointer',
            })
          )
        ) : collapsed ? (
          <NTooltip placement="right">
            {{
              trigger: () => (
                <h1 class="n-menu-item-content">
                  {sideBarLogo.title?.[0] || null}
                </h1>
              ),
              default: () => sideBarLogo.title,
            }}
          </NTooltip>
        ) : null}
        <NGradientText
          class={[
            !collapsed ? 'ray-menu__logo-title--open' : null,
            'ray-menu__logo-title',
            'class="n-menu-item-content"',
          ]}
          type="primary"
          size={18}
        >
          <NEllipsis>{sideBarLogo.title}</NEllipsis>
        </NGradientText>
      </div>
    ) : null
  },
})
