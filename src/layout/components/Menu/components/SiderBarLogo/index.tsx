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
import { RIcon } from '@/components'

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

    const {
      layout: { sideBarLogo },
    } = __APP_CFG__

    /**
     *
     * 点击 logo 跳转页面
     * jumpType:
     *   - station: 模板内跳转
     *   - outsideStation: 新开页面跳转
     */
    const handleSideBarLogoClick = () => {
      if (sideBarLogo && sideBarLogo.url) {
        sideBarLogo.jumpType === 'station'
          ? router.push(sideBarLogo.url)
          : window.open(sideBarLogo.url)
      }
    }

    const TemplateLogo = ({ cursor }: { cursor: string }) => (
      <RIcon name={sideBarLogo!.icon as string} size="30" cursor={cursor} />
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
