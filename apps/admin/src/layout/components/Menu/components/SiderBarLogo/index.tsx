import { resolveIconName } from '@/icons'
import './index.scss'
import { useSettingGetters } from '@/store'
import { isValueType, renderNode } from '@/utils'
import { RIcon } from '@ray-template/ui/icon'
import { NEllipsis, NTooltip } from 'naive-ui'

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
            name={resolveIconName(getSideBarLogo.value.icon) ?? 'logo/ray'}
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
      <button
        type="button"
        disabled={!sideBarLogo?.url}
        class={[
          'r-menu__logo',
          {
            'r-menu__logo-url': sideBarLogo.url,
            'r-menu__logo--collapsed': collapsed,
          },
        ]}
        onClick={sideBarLogoClick.bind(this)}
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
                <span class="r-menu__logo-initial">
                  {sideBarLogo.title?.[0] || null}
                </span>
              ),
              default: () => sideBarLogo.title,
            }}
          </NTooltip>
        ) : null}
        <span
          class={[
            !collapsed ? 'r-menu__logo-title--open' : null,
            'r-menu__logo-title',
          ]}
        >
          <NEllipsis>{sideBarLogo.title}</NEllipsis>
        </span>
      </button>
    ) : null
  },
})
