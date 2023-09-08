/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-10-11
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NMenu, NLayoutSider } from 'naive-ui'
import SiderBarLogo from './components/SiderBarLogo/index'

import { useMenu } from '@/store'
import { APP_MENU_CONFIG } from '@/app-config/appConfig'

import type { MenuInst } from 'naive-ui'
import type { NaiveMenuOptions } from '@/types/modules/component'
import type { AppMenuOption } from '@/types/modules/app'

const LayoutMenu = defineComponent({
  name: 'LayoutMenu',
  setup() {
    const menuRef = ref<MenuInst | null>(null)

    const menuStore = useMenu()

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
        <SiderBarLogo collapsed={this.modelCollapsed} />
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
