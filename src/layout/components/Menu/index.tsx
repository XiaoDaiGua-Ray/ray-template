import './index.scss'

import { NMenu, NLayoutSider } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import { useMenu } from '@/store'

const LayoutMenu = defineComponent({
  name: 'LayoutMenu',
  setup() {
    const menuStore = useMenu()
    const router = useRouter()

    const { menuModelValueChange, setupAppRoutes, collapsedMenu } = menuStore
    const modelMenuKey = computed({
      get: () => menuStore.menuKey,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      set: () => {},
    })
    const modelMenuOptions = computed(() => menuStore.options)
    const modelCollapsed = computed(() => menuStore.collapsed)
    const collapsedWidth = 64
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

    setupAppRoutes()

    return {
      modelMenuKey,
      menuModelValueChange,
      modelMenuOptions,
      modelCollapsed,
      collapsedMenu,
      collapsedWidth,
      sideBarLogo,
      handleSideBarLogoClick,
    }
  },
  render() {
    return (
      <NLayoutSider
        bordered
        showTrigger
        collapseMode="width"
        collapsedWidth={this.collapsedWidth}
        onUpdateCollapsed={this.collapsedMenu.bind(this)}
      >
        {this.sideBarLogo ? (
          <div
            class={[
              'ray-menu__logo',
              this.sideBarLogo.url ? 'ray-menu__logo-url' : '',
            ]}
            onClick={this.handleSideBarLogoClick.bind(this)}
          >
            <RayIcon name={this.sideBarLogo.icon as string} size="30" />
            <h1
              class={[
                !this.modelCollapsed ? 'ray-menu__logo-title--open' : '',
                'ray-menu__logo-title',
              ]}
            >
              {this.sideBarLogo.title}
            </h1>
          </div>
        ) : (
          ''
        )}
        <NMenu
          v-model:value={this.modelMenuKey}
          options={this.modelMenuOptions as NaiveMenuOptions[]}
          indent={24}
          collapsed={this.modelCollapsed}
          collapsedIconSize={22}
          collapsedWidth={this.collapsedWidth}
          onUpdateValue={this.menuModelValueChange.bind(this)}
        />
      </NLayoutSider>
    )
  },
})

export default LayoutMenu
