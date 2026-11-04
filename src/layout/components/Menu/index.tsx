import './index.scss'
import { LAYOUT_SIDER_REF } from '@/app-config'
import { useDevice } from '@/hooks'
import { positionSelectedMenuItem } from '@/layout/utils/position-selected-menu-item'
import {
  useMenuActions,
  useMenuGetters,
  useRuntimeActions,
  useRuntimeGetters,
  useSettingGetters,
} from '@/store'
import type { AppMenuOption, NaiveMenuOptions } from '@/types'
import { NDrawer, NLayoutContent, NLayoutSider, NMenu } from 'naive-ui'
import type { MenuInst } from 'naive-ui'
import type { PropType } from 'vue'
import SiderBarLogo from './components/SiderBarLogo'

export default defineComponent({
  name: 'AppMenu',
  props: {
    options: { type: Array as PropType<AppMenuOption[]>, default: void 0 },
    showLogo: { type: Boolean, default: true },
    end: Boolean,
    inert: Boolean,
  },
  setup(props) {
    const menuRef = shallowRef<MenuInst | null>(null)
    const { changeMenuModelValue, collapsedMenu, updateMenuState } =
      useMenuActions()
    const { getAppTheme, getMenuConfig } = useSettingGetters()
    const { getMenuOptions, getCollapsed, getMenuKey } = useMenuGetters()
    const { globalDrawerValue } = useRuntimeGetters()
    const { setRuntimeState } = useRuntimeActions()
    const { isTabletOrSmaller, width } = useDevice({
      observer: (isSmaller) => {
        if (isSmaller) updateMenuState('collapsed', false)
        else setRuntimeState('globalDrawerValue', false)
      },
    })
    const menuWidth = computed(() =>
      isTabletOrSmaller.value
        ? Math.min(getMenuConfig.value.menuWidth, width.value - 32)
        : getMenuConfig.value.menuWidth,
    )
    const collapsed = computed(
      () => !isTabletOrSmaller.value && getCollapsed.value,
    )

    watch(
      [getMenuKey, () => props.options, menuRef],
      async () => {
        await nextTick()

        if (getMenuKey.value != null)
          menuRef.value?.showOption(String(getMenuKey.value))

        positionSelectedMenuItem()
      },
      { flush: 'post' },
    )

    const basicMenu = () => (
      <NLayoutSider
        class={['app-menu__sider', { 'app-menu__sider--end': props.end }]}
        {...{ inert: props.inert }}
        showTrigger={!isTabletOrSmaller.value}
        collapseMode={getMenuConfig.value.collapsedMode}
        collapsedWidth={getMenuConfig.value.collapsedWidth}
        onUpdateCollapsed={collapsedMenu}
        width={menuWidth.value}
        contentClass="app-menu__body"
        contentStyle={{ overflow: 'clip' }}
        collapsed={collapsed.value}
        inverted={getMenuConfig.value.inverted}
      >
        {props.showLogo && getMenuConfig.value.menuSiderBarLogo ? (
          <SiderBarLogo collapsed={collapsed.value} />
        ) : null}
        <NLayoutContent
          class="app-menu__scroll"
          nativeScrollbar={getMenuConfig.value.nativeScrollbar}
          themeOverrides={
            getMenuConfig.value.inverted && !getAppTheme.value
              ? {
                  peers: {
                    Scrollbar: {
                      color: 'rgb(255 255 255 / 30%)',
                      colorHover: 'rgb(255 255 255 / 40%)',
                    },
                  },
                }
              : void 0
          }
          ref={LAYOUT_SIDER_REF}
        >
          <NMenu
            ref={menuRef}
            class="r-menu--app"
            keyField="fullPath"
            value={getMenuKey.value}
            options={
              (props.options ??
                getMenuOptions.value) as unknown as NaiveMenuOptions[]
            }
            indent={getMenuConfig.value.collapsedIndent}
            collapsed={collapsed.value}
            collapsedIconSize={getMenuConfig.value.collapsedIconSize}
            collapsedWidth={getMenuConfig.value.collapsedWidth}
            onUpdateValue={(key, option) => {
              changeMenuModelValue(key, option as unknown as AppMenuOption)

              if (isTabletOrSmaller.value)
                setRuntimeState('globalDrawerValue', false)
            }}
            accordion={getMenuConfig.value.accordion}
            iconSize={getMenuConfig.value.iconSize}
            inverted={getMenuConfig.value.inverted}
          />
        </NLayoutContent>
      </NLayoutSider>
    )

    return () =>
      isTabletOrSmaller.value ? (
        <NDrawer
          class="app-menu__drawer"
          width={menuWidth.value}
          show={globalDrawerValue.value}
          onUpdateShow={(value) => setRuntimeState('globalDrawerValue', value)}
          placement="left"
          displayDirective="show"
          autoFocus={false}
        >
          {basicMenu()}
        </NDrawer>
      ) : (
        basicMenu()
      )
  },
})
