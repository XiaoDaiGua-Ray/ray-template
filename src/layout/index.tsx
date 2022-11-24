import './index.scss'
import { NLayout, NLayoutContent } from 'naive-ui'
import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue'
import LayoutMenu from './components/Menu/index'
import SiderBar from './components/SiderBar/index'
import MenuTag from './components/MenuTag/index'
import { useSetting } from '@/store'

const Layout = defineComponent({
  name: 'Layout',
  props: {},
  setup() {
    const menuStore = useSetting()
    const { height: windowHeight } = useWindowSize()
    const modelReloadRoute = computed(() => menuStore.reloadRouteLog)
    const modelMenuTagLog = computed(() => menuStore.menuTagLog)
    const cssVarsRef = computed(() => {
      let cssVar = {}

      if (menuStore.menuTagLog) {
        cssVar = {
          '--layout-content-height': 'calc(100% - 110px)',
        }
      } else {
        cssVar = {
          '--layout-content-height': 'calc(100% - 64px)',
        }
      }

      return cssVar
    })

    return {
      windowHeight,
      modelReloadRoute,
      modelMenuTagLog,
      cssVarsRef,
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
            {this.modelMenuTagLog ? <MenuTag /> : ''}
            <NLayoutContent
              class="layout-content__router-view"
              nativeScrollbar={false}
            >
              {this.modelReloadRoute ? <RayTransitionComponent /> : ''}
            </NLayoutContent>
          </NLayout>
        </NLayout>
      </div>
    )
  },
})

export default Layout
