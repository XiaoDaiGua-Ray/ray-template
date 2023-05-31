/**
 *
 * 页面布局入口文件
 *
 * 说明:
 *   - rayLayoutContentWrapperScopeSelector: 页面切换时重置滚动条注入 id
 */

import './index.scss'

import { NLayout, NLayoutContent } from 'naive-ui'
import Menu from './components/Menu/index'
import SiderBar from './components/SiderBar/index'
import MenuTag from './components/MenuTag/index'
import ContentWrapper from '@/layout/default/ContentWrapper'
import FooterWrapper from '@/layout/default/FooterWrapper'

import { useSetting, useMenu } from '@/store'
import { viewScrollContainerId } from '@/appConfig/routerConfig'

const Layout = defineComponent({
  name: 'Layout',
  setup() {
    const settingStore = useSetting()
    const menuStore = useMenu()

    const { height: windowHeight } = useWindowSize()
    const { menuTagSwitch: modelMenuTagSwitch } = storeToRefs(settingStore)
    const { setupAppRoutes } = menuStore
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
    const isLock = useStorage('isLockScreen', false, sessionStorage, {
      mergeDefaults: true,
    })

    setupAppRoutes()

    return {
      windowHeight,
      modelMenuTagSwitch,
      cssVarsRef,
      isLock,
    }
  },
  render() {
    return (
      <div
        class={['layout']}
        style={[`height: ${this.windowHeight}px`, this.cssVarsRef]}
      >
        {!this.isLock ? (
          <NLayout class="layout-full" hasSider>
            <Menu />
            <NLayout>
              <SiderBar />
              {this.modelMenuTagSwitch ? <MenuTag /> : ''}
              <NLayoutContent
                class="layout-content__router-view"
                nativeScrollbar={false}
                {...{ id: viewScrollContainerId }}
              >
                <ContentWrapper />
                <FooterWrapper />
              </NLayoutContent>
            </NLayout>
          </NLayout>
        ) : (
          ''
        )}
      </div>
    )
  },
})

export default Layout
