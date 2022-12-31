import './index.scss'

import { NLayout, NLayoutContent } from 'naive-ui'
import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue'
import LayoutMenu from './components/Menu/index'
import SiderBar from './components/SiderBar/index'
import MenuTag from './components/MenuTag/index'

import { useSetting } from '@/store'

const Layout = defineComponent({
  name: 'Layout',
  setup() {
    const menuStore = useSetting()
    const { height: windowHeight } = useWindowSize()
    const modelReloadRoute = computed(() => menuStore.reloadRouteSwitch)
    const modelMenuTagSwitch = computed(() => menuStore.menuTagSwitch)
    const cssVarsRef = computed(() => {
      let cssVar = {}

      if (menuStore.menuTagSwitch) {
        cssVar = {
          '--layout-content-height': 'calc(100% - 109px)',
        }
      } else {
        cssVar = {
          '--layout-content-height': 'calc(100% - 64px)',
        }
      }

      return cssVar
    })
    const {
      layout: { copyright },
    } = __APP_CFG__

    return {
      windowHeight,
      modelReloadRoute,
      modelMenuTagSwitch,
      cssVarsRef,
      copyright,
    }
  },
  render() {
    return (
      <div
        class="layout"
        style={[`height: ${this.windowHeight}px`, this.cssVarsRef]}
      >
        <NLayout class="layout-full" hasSider>
          <LayoutMenu />
          <NLayout>
            <SiderBar />
            {this.modelMenuTagSwitch ? <MenuTag /> : ''}
            <NLayoutContent
              class="layout-content__router-view"
              nativeScrollbar={false}
            >
              {this.modelReloadRoute ? <RayTransitionComponent /> : ''}
              {this.copyright ? (
                <div class="layout-footer">{this.copyright}</div>
              ) : (
                ''
              )}
            </NLayoutContent>
          </NLayout>
        </NLayout>
      </div>
    )
  },
})

export default Layout
