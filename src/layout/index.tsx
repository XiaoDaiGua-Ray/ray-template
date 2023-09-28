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
import ContentWrapper from '@/layout/default/ContentWrapper'
import FooterWrapper from '@/layout/default/FooterWrapper'
import HeaderWrapper from './default/HeaderWrapper'
import FeatureWrapper from './default/FeatureWrapper'

import { useSetting } from '@/store'
import { LAYOUT_CONTENT_REF } from '@/app-config/routerConfig'
import { layoutHeaderCssVars } from '@/layout/layoutResize'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'

const RLayout = defineComponent({
  name: 'RLayout',
  setup() {
    const layoutSiderBarRef = ref<HTMLElement>()
    const layoutMenuTagRef = ref<HTMLElement>()
    const layoutFooterRef = ref<HTMLElement>()

    const settingStore = useSetting()

    const { menuTagSwitch: modelMenuTagSwitch, footerSwitch } =
      storeToRefs(settingStore)
    const { getLockAppScreen } = useAppLockScreen()
    const cssVarsRef = layoutHeaderCssVars([
      layoutSiderBarRef,
      layoutMenuTagRef,
      layoutFooterRef,
    ])

    return {
      modelMenuTagSwitch,
      cssVarsRef,
      getLockAppScreen,
      LAYOUT_CONTENT_REF,
      layoutSiderBarRef,
      layoutMenuTagRef,
      layoutFooterRef,
      footerSwitch,
    }
  },
  render() {
    return !this.getLockAppScreen() ? (
      <NLayout class="r-layout-full" style={[this.cssVarsRef]} hasSider>
        <Menu />
        <NLayoutContent class="r-layout-full__viewer">
          <HeaderWrapper ref="layoutSiderBarRef" />
          {this.modelMenuTagSwitch ? (
            <FeatureWrapper ref="layoutMenuTagRef" />
          ) : null}
          <NLayoutContent
            ref="LAYOUT_CONTENT_REF"
            class="r-layout-full__viewer-content"
            nativeScrollbar={false}
          >
            <ContentWrapper />
          </NLayoutContent>
          {this.footerSwitch ? <FooterWrapper ref="layoutFooterRef" /> : ''}
        </NLayoutContent>
      </NLayout>
    ) : null
  },
})

export default RLayout
