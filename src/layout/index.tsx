import './index.scss'

import { NLayout, NLayoutContent, NSpin } from 'naive-ui'
import RayTransitionComponent from '@/components/RayTransitionComponent/index.vue'
import LayoutMenu from './components/Menu/index'
import SiderBar from './components/SiderBar/index'
import MenuTag from './components/MenuTag/index'

import { useSetting } from '@/store'
import { addClass, removeClass } from '@/utils/element'

const Layout = defineComponent({
  name: 'Layout',
  setup() {
    const settingStore = useSetting()

    const { height: windowHeight } = useWindowSize()
    const {
      themeValue,
      reloadRouteSwitch: modelReloadRoute,
      menuTagSwitch: modelMenuTagSwitch,
    } = storeToRefs(settingStore)
    const cssVarsRef = computed(() => {
      let cssVar = {}

      if (settingStore.menuTagSwitch) {
        cssVar = {
          '--layout-content-height': 'calc(100% - 111px)',
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

    watch(
      () => themeValue.value,
      (newData) => {
        /**
         *
         * 初始化时根据当前主题色进行初始化 body 的 class 属性
         *
         * 根据 themeValue 进行初始化
         */
        const body = document.body
        const darkClassName = 'ray-template--dark'
        const lightClassName = 'ray-template--light'

        newData
          ? removeClass(body, lightClassName)
          : removeClass(body, darkClassName)

        addClass(body, newData ? darkClassName : lightClassName)
      },
      {
        immediate: true,
      },
    )

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
        class={['layout']}
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
