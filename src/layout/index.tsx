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

import { useSetting } from '@/store'

const Layout = defineComponent({
  name: 'Layout',
  setup() {
    const settingStore = useSetting()

    const { height: windowHeight } = useWindowSize()
    const { menuTagSwitch: modelMenuTagSwitch } = storeToRefs(settingStore)
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

    return {
      windowHeight,
      modelMenuTagSwitch,
      cssVarsRef,
    }
  },
  render() {
    return (
      <div
        class={['layout']}
        style={[`height: ${this.windowHeight}px`, this.cssVarsRef]}
      >
        <NLayout class="layout-full" hasSider>
          <Menu />
          <NLayout>
            <SiderBar />
            {this.modelMenuTagSwitch ? <MenuTag /> : ''}
            <NLayoutContent
              class="layout-content__router-view"
              nativeScrollbar={false}
              {...{ id: 'rayLayoutContentWrapperScopeSelector' }}
            >
              <ContentWrapper />
              <FooterWrapper />
            </NLayoutContent>
          </NLayout>
        </NLayout>
      </div>
    )
  },
})

export default Layout
