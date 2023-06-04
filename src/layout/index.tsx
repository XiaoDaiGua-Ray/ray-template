/**
 *
 * 页面布局入口文件
 *
 * 说明:
 *   - rayLayoutContentWrapperScopeSelector: 页面切换时重置滚动条注入 id(弃用)
 *
 * 该组件入口不做逻辑相关的处理, 仅做功能、组件、方法注入
 * 提供页面内 Layout 的一些注入(css vars 为主)
 */

import './index.scss'

import { NLayout, NLayoutContent } from 'naive-ui'
import Menu from './components/Menu/index'
import SiderBar from './components/SiderBar/index'
import MenuTag from './components/MenuTag/index'
import ContentWrapper from '@/layout/default/ContentWrapper'
import FooterWrapper from '@/layout/default/FooterWrapper'

import { useSetting, useMenu } from '@/store'
import {
  viewScrollContainerId,
  LAYOUT_CONTENT_REF,
} from '@/appConfig/routerConfig'
import { layoutHeaderCssVars } from '@/layout/layoutResize'

const Layout = defineComponent({
  name: 'RLayout',
  setup() {
    const layoutSiderBarRef = ref<HTMLElement>()
    const layoutMenuTagRef = ref<HTMLElement>()

    const settingStore = useSetting()
    const menuStore = useMenu()

    const { height: windowHeight } = useWindowSize()
    const { menuTagSwitch: modelMenuTagSwitch } = storeToRefs(settingStore)
    const { setupAppRoutes } = menuStore
    const isLock = useStorage('isLockScreen', false, sessionStorage, {
      mergeDefaults: true,
    })
    const cssVarsRef = layoutHeaderCssVars([
      layoutSiderBarRef,
      layoutMenuTagRef,
    ])

    nextTick().then(() => {
      setupAppRoutes()
    })

    return {
      windowHeight,
      modelMenuTagSwitch,
      cssVarsRef,
      isLock,
      LAYOUT_CONTENT_REF,
      layoutSiderBarRef,
      layoutMenuTagRef,
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
            <NLayout class="layout__view-container__layout">
              <SiderBar ref="layoutSiderBarRef" />
              {this.modelMenuTagSwitch ? (
                <MenuTag ref="layoutMenuTagRef" />
              ) : (
                ''
              )}
              <NLayoutContent
                ref="LAYOUT_CONTENT_REF"
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
