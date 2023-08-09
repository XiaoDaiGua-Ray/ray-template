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

import { NEllipsis } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

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

    return {
      sideBarLogo,
      handleSideBarLogoClick,
    }
  },
  render() {
    return this.sideBarLogo?.icon && this.sideBarLogo?.title ? (
      <div
        class={[
          'ray-menu__logo',
          this.sideBarLogo?.url ? 'ray-menu__logo-url' : '',
        ]}
        onClick={this.handleSideBarLogoClick.bind(this)}
      >
        {this.sideBarLogo?.icon ? (
          <RayIcon name={this.sideBarLogo.icon} size="30" />
        ) : (
          ''
        )}
        <h1
          class={[
            !this.collapsed ? 'ray-menu__logo-title--open' : '',
            'ray-menu__logo-title',
          ]}
        >
          <NEllipsis>{this.sideBarLogo?.title}</NEllipsis>
        </h1>
      </div>
    ) : (
      ''
    )
  },
})

export default SiderBarLogo
