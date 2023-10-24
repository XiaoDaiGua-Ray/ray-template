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

import './index.scss'

import { NMenu, NLayoutSider, NDrawer } from 'naive-ui'
import SiderBarLogo from './components/SiderBarLogo/index'

import { useMenu } from '@/store'
import { APP_MENU_CONFIG } from '@/app-config/appConfig'
import { useDevice } from '@/hooks/web/index'
import { globalVariableToRefs, setVariable } from '@/hooks/variable/index'

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
      set: () => {
        if (isTabletOrSmaller.value) {
          setVariable('globalDrawerValue', false)
        }
      },
    })
    const modelMenuOptions = computed(() => menuStore.options)
    const modelCollapsed = computed(() => menuStore.collapsed)
    const { isTabletOrSmaller } = useDevice()
    const modelGlobalDrawerValue = computed({
      get: () => globalVariableToRefs('globalDrawerValue').value,
      set: (val) => {
        setVariable('globalDrawerValue', val)
      },
    })

    const showMenuOption = () => {
      const key = modelMenuKey.value as string

      nextTick().then(() => {
        menuRef.value?.showOption?.(key)
      })
    }

    const BaseicMenu = () => (
      <NLayoutSider
        bordered
        showTrigger={!isTabletOrSmaller.value}
        collapseMode={APP_MENU_CONFIG.menuCollapsedMode}
        collapsedWidth={APP_MENU_CONFIG.menuCollapsedWidth}
        onUpdateCollapsed={collapsedMenu.bind(this)}
        nativeScrollbar={false}
      >
        <SiderBarLogo collapsed={modelCollapsed.value} />
        <NMenu
          ref="menuRef"
          class="r-menu--app"
          v-model:value={modelMenuKey.value}
          options={modelMenuOptions.value as NaiveMenuOptions[]}
          indent={APP_MENU_CONFIG.menuCollapsedIndent}
          collapsed={modelCollapsed.value}
          collapsedIconSize={APP_MENU_CONFIG.menuCollapsedIconSize}
          collapsedWidth={APP_MENU_CONFIG.menuCollapsedWidth}
          onUpdateValue={(key, op) => {
            changeMenuModelValue(key, op as unknown as AppMenuOption)
          }}
          accordion={APP_MENU_CONFIG.menuAccordion}
        />
      </NLayoutSider>
    )

    return {
      menuRef,
      isTabletOrSmaller,
      BaseicMenu,
      modelGlobalDrawerValue,
    }
  },
  render() {
    const { isTabletOrSmaller, BaseicMenu } = this

    return !isTabletOrSmaller ? (
      <BaseicMenu />
    ) : (
      <NDrawer
        class="app-menu__drawer"
        v-model:show={this.modelGlobalDrawerValue}
        placement="left"
        displayDirective="show"
      >
        <BaseicMenu />
      </NDrawer>
    )
  },
})

export default LayoutMenu
