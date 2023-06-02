import './index.scss'

import { NMenu, NLayoutSider, NEllipsis } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import { useMenu } from '@/store'
import { MENU_COLLAPSED_CONFIG, MENU_ACCORDION } from '@/appConfig/appConfig'
import { useVueRouter } from '@/router/helper/useVueRouter'

const LayoutMenu = defineComponent({
  name: 'LayoutMenu',
  setup() {
    const menuStore = useMenu()
    const { router } = useVueRouter()

    const { menuModelValueChange, collapsedMenu } = menuStore
    const modelMenuKey = computed({
      get: () => menuStore.menuKey,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      set: () => {},
    })
    const modelMenuOptions = computed(() => menuStore.options)
    const modelCollapsed = computed(() => menuStore.collapsed)
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
      modelMenuKey,
      menuModelValueChange,
      modelMenuOptions,
      modelCollapsed,
      collapsedMenu,
      sideBarLogo,
      handleSideBarLogoClick,
    }
  },
  render() {
    return (
      <NLayoutSider
        bordered
        showTrigger
        collapseMode={MENU_COLLAPSED_CONFIG.MENU_COLLAPSED_MODE}
        collapsedWidth={MENU_COLLAPSED_CONFIG.MENU_COLLAPSED_WIDTH}
        onUpdateCollapsed={this.collapsedMenu.bind(this)}
        nativeScrollbar={false}
      >
        {this.sideBarLogo ? (
          <div
            class={[
              'ray-menu__logo',
              this.sideBarLogo.url ? 'ray-menu__logo-url' : '',
            ]}
            onClick={this.handleSideBarLogoClick.bind(this)}
          >
            {this.sideBarLogo.icon ? (
              <RayIcon name={this.sideBarLogo.icon} size="30" />
            ) : (
              ''
            )}
            <h1
              class={[
                !this.modelCollapsed ? 'ray-menu__logo-title--open' : '',
                'ray-menu__logo-title',
              ]}
            >
              <NEllipsis>{this.sideBarLogo.title}</NEllipsis>
            </h1>
          </div>
        ) : (
          ''
        )}
        <NMenu
          v-model:value={this.modelMenuKey}
          options={this.modelMenuOptions as NaiveMenuOptions[]}
          indent={MENU_COLLAPSED_CONFIG.MENU_COLLAPSED_INDENT}
          collapsed={this.modelCollapsed}
          collapsedIconSize={MENU_COLLAPSED_CONFIG.MENU_COLLAPSED_ICON_SIZE}
          collapsedWidth={MENU_COLLAPSED_CONFIG.MENU_COLLAPSED_WIDTH}
          onUpdateValue={this.menuModelValueChange.bind(this)}
          accordion={MENU_ACCORDION}
        />
      </NLayoutSider>
    )
  },
})

export default LayoutMenu
