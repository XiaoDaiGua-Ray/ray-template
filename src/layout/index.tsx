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
import Menu from './components/Menu'
import {
  ContentWrapper,
  FooterWrapper,
  HeaderWrapper,
  FeatureWrapper,
} from './default'
import UnlockScreen from '@/app-components/app/AppLockScreen/components/UnlockScreen'

import { LAYOUT_CONTENT_REF } from '@/app-config'
import { layoutCssVars } from '@/layout/layout-css-vars'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import { useSettingGetters } from '@/store'

export default defineComponent({
  name: 'RLayout',
  setup() {
    const layoutSiderBarRef = shallowRef<HTMLElement>() // 顶部操作栏 shallowRef
    const layoutMenuTagRef = shallowRef<HTMLElement>() // 标签页 shallowRef
    const layoutFooterRef = shallowRef<HTMLElement>() // 底部版权 shallowRef

    const { getMenuTagSwitch, getCopyrightSwitch } = useSettingGetters()
    const { getLockAppScreen } = useAppLockScreen()
    const cssVarsRef = layoutCssVars([
      layoutSiderBarRef,
      layoutMenuTagRef,
      layoutFooterRef,
    ])

    return {
      getMenuTagSwitch,
      cssVarsRef,
      getLockAppScreen,
      layoutSiderBarRef,
      layoutMenuTagRef,
      layoutFooterRef,
      getCopyrightSwitch,
    }
  },
  render() {
    const { getMenuTagSwitch, cssVarsRef, getCopyrightSwitch } = this
    const { getLockAppScreen } = this

    return !getLockAppScreen() ? (
      <NLayout class="r-layout-full" style={[cssVarsRef]} hasSider embedded>
        <Menu />
        <NLayoutContent class="r-layout-full__viewer">
          <HeaderWrapper ref="layoutSiderBarRef" />
          {getMenuTagSwitch ? <FeatureWrapper ref="layoutMenuTagRef" /> : null}
          <NLayoutContent
            ref={LAYOUT_CONTENT_REF}
            class={['r-layout-full__viewer-content']}
            nativeScrollbar={false}
          >
            <ContentWrapper />
          </NLayoutContent>
          {getCopyrightSwitch ? <FooterWrapper ref="layoutFooterRef" /> : null}
        </NLayoutContent>
      </NLayout>
    ) : (
      <UnlockScreen />
    )
  },
})
