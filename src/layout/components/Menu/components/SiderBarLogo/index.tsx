/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-08-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import './index.scss'

import { NEllipsis, NPopover } from 'naive-ui'
import RayIcon from '@/components/RIcon/index'

const SiderBarLogo = defineComponent({
  name: 'SiderBarLogo',
  props: {
    collapsed: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const router = useRouter()

    const {
      layout: { sideBarLogo },
    } = __APP_CFG__

    const handleSideBarLogoClick = () => {
      if (sideBarLogo && sideBarLogo.url) {
        sideBarLogo.jumpType === 'station'
          ? router.push(sideBarLogo.url)
          : window.open(sideBarLogo.url)
      }
    }

    const TemplateLogo = ({ cursor }: { cursor: string }) => (
      <RayIcon name={sideBarLogo!.icon as string} size="30" cursor={cursor} />
    )

    return {
      sideBarLogo,
      handleSideBarLogoClick,
      TemplateLogo,
    }
  },
  render() {
    return this.sideBarLogo?.icon && this.sideBarLogo?.title ? (
      <div
        class={[
          'ray-menu__logo',
          this.sideBarLogo?.url ? 'ray-menu__logo-url' : null,
        ]}
        onClick={this.handleSideBarLogoClick.bind(this)}
      >
        {this.sideBarLogo?.icon ? (
          this.collapsed ? (
            <NPopover placement="right">
              {{
                trigger: () => <this.TemplateLogo cursor="pointer" />,
                default: () => this.sideBarLogo?.title,
              }}
            </NPopover>
          ) : (
            <this.TemplateLogo cursor="pointer" />
          )
        ) : null}
        <h1
          class={[
            !this.collapsed ? 'ray-menu__logo-title--open' : null,
            'ray-menu__logo-title',
          ]}
        >
          <NEllipsis>{this.sideBarLogo?.title}</NEllipsis>
        </h1>
      </div>
    ) : null
  },
})

export default SiderBarLogo
