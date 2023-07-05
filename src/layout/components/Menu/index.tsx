import './index.scss'

import { NMenu, NLayoutSider, NEllipsis } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import { useMenu } from '@/store'
import { APP_MENU_CONFIG } from '@/appConfig/appConfig'
import { useVueRouter } from '@/router/helper/useVueRouter'

import type { MenuInst } from 'naive-ui'
import type { NaiveMenuOptions } from '@/types/modules/component'
import type { AppMenuOption } from '@/types/modules/app'

const LayoutMenu = defineComponent({
  name: 'LayoutMenu',
  setup() {
    const menuRef = ref<MenuInst | null>(null)

    const menuStore = useMenu()
    const { router } = useVueRouter()

    const { changeMenuModelValue, collapsedMenu } = menuStore
    const modelMenuKey = computed({
      get: () => {
        nextTick().then(() => {
          showMenuOption()
        })

        return menuStore.menuKey
      },
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

    const showMenuOption = () => {
      const key = modelMenuKey.value as string

      nextTick().then(() => {
        menuRef.value?.showOption?.(key)
      })
    }

    return {
      modelMenuKey,
      changeMenuModelValue,
      modelMenuOptions,
      modelCollapsed,
      collapsedMenu,
      sideBarLogo,
      handleSideBarLogoClick,
      menuRef,
    }
  },
  render() {
    return (
      <NLayoutSider
        bordered
        showTrigger
        collapseMode={APP_MENU_CONFIG.MENU_COLLAPSED_MODE}
        collapsedWidth={APP_MENU_CONFIG.MENU_COLLAPSED_WIDTH}
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
          ref="menuRef"
          v-model:value={this.modelMenuKey}
          options={this.modelMenuOptions as NaiveMenuOptions[]}
          indent={APP_MENU_CONFIG.MENU_COLLAPSED_INDENT}
          collapsed={this.modelCollapsed}
          collapsedIconSize={APP_MENU_CONFIG.MENU_COLLAPSED_ICON_SIZE}
          collapsedWidth={APP_MENU_CONFIG.MENU_COLLAPSED_WIDTH}
          onUpdateValue={(key, op) => {
            this.changeMenuModelValue(key, op as unknown as AppMenuOption)
          }}
          accordion={APP_MENU_CONFIG.MENU_ACCORDION}
        />
      </NLayoutSider>
    )
  },
})

export default LayoutMenu
