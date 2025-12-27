import './index.scss'
import { LAYOUT_SIDER_REF } from '@/app-config'
import { getVariableToRefs, setVariable } from '@/global-variable'
import { useDevice } from '@/hooks'
import { useMenuActions, useMenuGetters, useSettingGetters } from '@/store'
import type { AppMenuOption, NaiveMenuOptions } from '@/types'
import { positionSelectedMenuItem } from '@/utils'
import { NDrawer, NLayoutSider, NMenu } from 'naive-ui'
import type { MenuInst } from 'naive-ui'
import SiderBarLogo from './components/SiderBarLogo'

export default defineComponent({
  name: 'AppMenu',
  setup() {
    // 这里使用 shallowRef 而不是 useTemplateRef 是因为在这里有一个特殊情况，会导致一个 readonly 的警告
    const menuRef = shallowRef<MenuInst | null>()

    const { changeMenuModelValue, collapsedMenu, updateMenuState } =
      useMenuActions()
    const { getMenuConfig } = useSettingGetters()
    const { getMenuOptions, getCollapsed, getMenuKey } = useMenuGetters()
    const modelMenuKey = computed({
      get: () => {
        /**
         *
         * @description
         * 禁用该 eslint 规则，因为在 computed 中使用了异步操作。
         * 该规则只是为了避免异步的 computed get 获取值出现问题；
         * 但是，在这里获取值的操作是同步行为，只是为了在获取值以后将对应菜单项展开；
         * 所以，这里不会出现异步获取值的问题，所以可以禁用该规则。
         */
        // eslint-disable-next-line vue/no-async-in-computed-properties
        setTimeout(() => {
          showMenuOption()
          positionSelectedMenuItem()
        }, 300)

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
        collapseMode={getMenuConfig.value.collapsedMode}
        collapsedWidth={getMenuConfig.value.collapsedWidth}
        onUpdateCollapsed={collapsedMenu.bind(this)}
        width={getMenuConfig.value.menuWidth}
        nativeScrollbar={getMenuConfig.value.nativeScrollbar}
        ref={LAYOUT_SIDER_REF}
        collapsed={getCollapsed.value}
        onExpand={() => {
          updateMenuState('collapsed', false)
        }}
        onCollapse={() => {
          updateMenuState('collapsed', true)
        }}
        inverted={getMenuConfig.value.inverted}
      >
        {getMenuConfig.value.menuSiderBarLogo ? (
          <SiderBarLogo collapsed={getCollapsed.value} />
        ) : null}
        <NMenu
          ref={menuRef}
          class="r-menu--app"
          keyField="fullPath"
          v-model:value={modelMenuKey.value}
          options={getMenuOptions.value as NaiveMenuOptions[]}
          indent={getMenuConfig.value.collapsedIndent}
          collapsed={getCollapsed.value}
          collapsedIconSize={getMenuConfig.value.collapsedIconSize}
          collapsedWidth={getMenuConfig.value.collapsedWidth}
          onUpdateValue={(key, op) => {
            changeMenuModelValue(key, op as unknown as AppMenuOption)
          }}
          accordion={getMenuConfig.value.accordion}
          iconSize={getMenuConfig.value.iconSize}
          inverted={getMenuConfig.value.inverted}
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
