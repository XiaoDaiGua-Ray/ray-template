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

import { LAYOUT_CONTENT_REF } from '@/app-config'
import { layoutHeaderCssVars } from '@/layout/layoutResize'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import { useSettingGetters } from '@/store'

export default defineComponent({
  name: 'RLayout',
  setup() {
    const layoutSiderBarRef = ref<HTMLElement>() // 顶部操作栏 ref
    const layoutMenuTagRef = ref<HTMLElement>() // 标签页 ref
    const layoutFooterRef = ref<HTMLElement>() // 底部版权 ref

    const { getMenuTagSwitch, getCopyrightSwitch } = useSettingGetters()
    const { getLockAppScreen } = useAppLockScreen()
    const cssVarsRef = layoutHeaderCssVars([
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
      <NLayout class="r-layout-full" style={[cssVarsRef]} hasSider>
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
    ) : null
  },
})
