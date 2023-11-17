/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-21
 *
 * @workspace ray-template-mine
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 使用 NSpin 组件实现 loading 效果
 * 默认添加 300ms 延迟
 */

import './index.scss'

import { NSpin } from 'naive-ui'
import RTransitionComponent from '@/components/RTransitionComponent/index.vue'
import AppRequestCancelerProvider from '@/app-components/provider/AppRequestCancelerProvider/index'
import RIcon from '@/components/RIcon/index'

import { getVariableToRefs } from '@/global-variable/index'
import { useSettingGetters } from '@/store'
import { useMainPage } from '@/hooks/template/index'

import type { GlobalThemeOverrides } from 'naive-ui'

export default defineComponent({
  name: 'LayoutContentWrapper',
  setup() {
    const router = useRouter()

    const { getContentTransition } = useSettingGetters()
    const spinning = ref(false)
    const themeOverridesSpin: GlobalThemeOverrides['Spin'] = {
      opacitySpinning: '0',
    }
    const globalMainLayoutLoad = getVariableToRefs('globalMainLayoutLoad')
    const layoutContentMaximize = getVariableToRefs('layoutContentMaximize')
    const { maximize } = useMainPage()

    const setupLayoutContentSpin = () => {
      router.beforeEach(() => {
        spinning.value = true
      })

      router.afterEach(() => {
        spinning.value = false
      })
    }

    setupLayoutContentSpin()

    return {
      globalMainLayoutLoad,
      spinning,
      themeOverridesSpin,
      getContentTransition,
      layoutContentMaximize,
      maximize,
    }
  },
  render() {
    const { globalMainLayoutLoad, layoutContentMaximize } = this
    const { maximize } = this

    return (
      <NSpin
        show={this.spinning || !globalMainLayoutLoad}
        description="loading..."
        size="large"
        themeOverrides={this.themeOverridesSpin}
        class={[
          layoutContentMaximize
            ? 'r-layout-full__viewer-content--maximize'
            : null,
          'r-layout-full__viewer-content--maximize--light',
          'r-layout-full__viewer-content--maximize--dark',
        ]}
      >
        {layoutContentMaximize ? (
          <div
            class="layout-content__maximize-out"
            onClick={() => {
              maximize(false)
            }}
          >
            <RIcon name="out" size="16" cursor="pointer" />
          </div>
        ) : null}
        <AppRequestCancelerProvider />
        {globalMainLayoutLoad ? (
          <RTransitionComponent
            class="content-wrapper"
            transitionPropName={this.getContentTransition + '-transform'}
          />
        ) : null}
      </NSpin>
    )
  },
})
