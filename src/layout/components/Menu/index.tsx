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

import { APP_MENU_CONFIG, LAYOUT_SIDER_REF } from '@/app-config'
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

    const { changeMenuModelValue, collapsedMenu, updateMenuState } =
      useMenuActions()
    const { getMenuOptions, getCollapsed, getMenuKey } = useMenuGetters()

    const modelMenuKey = computed({
      get: () => {
        // eslint-disable-next-line vue/no-async-in-computed-properties
        nextTick().then(() => {
          /**
           *
           * @description
           * 禁用该 eslint 规则，因为在 computed 中使用了异步操作。
           * 该规则只是为了避免异步的 computed get 获取值出现问题；
           * 但是，在这里获取值的操作是同步行为，只是为了在获取值以后将对应菜单项展开；
           * 所以，这里不会出现异步获取值的问题，所以可以禁用该规则。
           */
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
    const { isTabletOrSmaller } = useDevice({
      observer: (isSmaller) => {
        if (isSmaller) {
          // 避免菜单折叠时，在小尺寸屏幕导致菜单显示不完整
          updateMenuState('collapsed', false)
        }
      },
    })
    const modelGlobalDrawerValue = computed({
      get: () => getVariableToRefs('globalDrawerValue').value,
      set: (val) => {
        setVariable('globalDrawerValue', val)
      },
    })

    /**
     *
     * @description
     * 手动展开当前激活菜单项。
     */
    const showMenuOption = () => {
      const key = modelMenuKey.value

      if (key !== void 0 && key !== null) {
        nextTick(() => menuRef.value?.showOption?.(key))
      }
    }

    const BasicMenu = () => (
      <NLayoutSider
        class="app-menu__sider"
        showTrigger={!isTabletOrSmaller.value}
        collapseMode={APP_MENU_CONFIG.menuCollapsedMode}
        collapsedWidth={APP_MENU_CONFIG.menuCollapsedWidth}
        onUpdateCollapsed={collapsedMenu.bind(this)}
        nativeScrollbar={false}
        ref={LAYOUT_SIDER_REF}
        collapsed={getCollapsed.value}
        onExpand={() => {
          updateMenuState('collapsed', false)
        }}
        onCollapse={() => {
          updateMenuState('collapsed', true)
        }}
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
      BasicMenu,
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
