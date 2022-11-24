import { NMenu, NLayoutSider } from 'naive-ui'
import { useMenu } from '@/store'

const LayoutMenu = defineComponent({
  name: 'LayoutMenu',
  setup() {
    const menuStore = useMenu()
    const { menuModelValueChange, setupAppRoutes, collapsedMenu } = menuStore
    const modelMenuKey = computed({
      get: () => menuStore.menuKey,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      set: () => {},
    })
    const modelMenuOptions = computed(() => menuStore.options)
    const modelCollapsed = computed(() => menuStore.collapsed)

    setupAppRoutes()

    return {
      modelMenuKey,
      menuModelValueChange,
      modelMenuOptions,
      modelCollapsed,
      collapsedMenu,
    }
  },
  render() {
    return (
      <NLayoutSider
        bordered
        showTrigger
        collapseMode="width"
        collapsedWidth={64}
        onUpdateCollapsed={this.collapsedMenu.bind(this)}
      >
        <NMenu
          v-model:value={this.modelMenuKey}
          options={this.modelMenuOptions as NaiveMenuOptions[]}
          indent={24}
          collapsed={this.modelCollapsed}
          collapsedIconSize={22}
          collapsedWidth={64}
          onUpdateValue={this.menuModelValueChange.bind(this)}
        />
      </NLayoutSider>
    )
  },
})

export default LayoutMenu
