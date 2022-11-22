import './index.scss'
import { Transition } from 'vue'
import { NLayout, NLayoutContent } from 'naive-ui'
import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue'
import LayoutMenu from './Menu/index'
import SiderBar from './SiderBar/index'
import { useMenu } from '@/store'

const Layout = defineComponent({
  name: 'Layout',
  props: {},
  setup() {
    const menuStore = useMenu()
    const { height: windowHeight } = useWindowSize()
    const modelReloadRoute = computed(() => menuStore.reloadRouteLog)

    return {
      windowHeight,
      modelReloadRoute,
    }
  },
  render() {
    return (
      <div class="layout" style={[`height: ${this.windowHeight}px`]}>
        <NLayout class="layout-full" hasSider>
          <LayoutMenu />
          <NLayout>
            <SiderBar />
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
