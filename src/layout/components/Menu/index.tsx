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
import SiderBarLogo from './components/SiderBarLogo'

import { APP_MENU_CONFIG } from '@/app-config'
import { useDevice } from '@/hooks'
import { getVariableToRefs, setVariable } from '@/global-variable'
import { useMenuGetters, useMenuActions } from '@/store'

import type { MenuInst } from 'naive-ui'
import type { NaiveMenuOptions } from '@/types'
import type { AppMenuOption } from '@/types'

export default defineComponent({
  name: 'AppMenu',
  setup() {
    const menuRef = ref<MenuInst | null>(null)

    const { changeMenuModelValue, collapsedMenu } = useMenuActions()
    const { getMenuOptions, getCollapsed, getMenuKey } = useMenuGetters()

    const modelMenuKey = computed({
      get: () => {
        nextTick().then(() => {
          showMenuOption()
        })

        return getMenuKey.value
      },
      set: () => {
        if (isTabletOrSmaller.value) {
          setVariable('globalDrawerValue', false)
        }
      },
    })
    const { isTabletOrSmaller } = useDevice()
    const modelGlobalDrawerValue = computed({
      get: () => getVariableToRefs('globalDrawerValue').value,
      set: (val) => {
        setVariable('globalDrawerValue', val)
      },
    })

    /**
     *
     * 手动展开当前激活菜单项
     */
    const showMenuOption = () => {
      const key = modelMenuKey.value as string

      nextTick().then(() => {
        menuRef.value?.showOption?.(key)
      })
    }

    const BasicMenu = () => (
      <NLayoutSider
        bordered
        showTrigger={!isTabletOrSmaller.value}
        collapseMode={APP_MENU_CONFIG.menuCollapsedMode}
        collapsedWidth={APP_MENU_CONFIG.menuCollapsedWidth}
        onUpdateCollapsed={collapsedMenu.bind(this)}
        nativeScrollbar={false}
      >
        <SiderBarLogo collapsed={getCollapsed.value} />
        <NMenu
          ref={menuRef}
          class="r-menu--app"
          keyField="fullPath"
          v-model:value={modelMenuKey.value}
          options={getMenuOptions.value as NaiveMenuOptions[]}
          indent={APP_MENU_CONFIG.menuCollapsedIndent}
          collapsed={getCollapsed.value}
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
      isTabletOrSmaller,
      BasicMenu: BasicMenu,
      modelGlobalDrawerValue,
    }
  },
  render() {
    const { isTabletOrSmaller, BasicMenu } = this

    return !isTabletOrSmaller ? (
      <BasicMenu />
    ) : (
      <NDrawer
        class="app-menu__drawer"
        v-model:show={this.modelGlobalDrawerValue}
        placement="left"
        displayDirective="show"
        autoFocus={false}
      >
        <BasicMenu />
      </NDrawer>
    )
  },
})
