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
import { RTransitionComponent, RIcon } from '@/components'
import AppRequestCancelerProvider from '@/app-components/provider/AppRequestCancelerProvider'

import { getVariable } from '@/global-variable'
import { useSettingGetters } from '@/store'
import { useMaximize } from '@/hooks'
import { LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE } from '@/app-config'

import type { GlobalThemeOverrides } from 'naive-ui'

export default defineComponent({
  name: 'LayoutContentWrapper',
  setup() {
    const router = useRouter()

    const { maximize } = useMaximize()
    const { getContentTransition } = useSettingGetters()
    const spinning = ref(false)
    const themeOverridesSpin: GlobalThemeOverrides['Spin'] = {
      opacitySpinning: '0',
    }
    const {
      globalMainLayoutLoad,
      layoutContentMaximize,
      layoutContentSpinning,
    } = getVariable()

    const setupLayoutContentSpin = () => {
      router.beforeEach(() => {
        spinning.value = true
      })

      router.afterEach(() => {
        spinning.value = false
      })
    }

    if (LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE) {
      setupLayoutContentSpin()
    }

    return {
      globalMainLayoutLoad,
      spinning,
      themeOverridesSpin,
      getContentTransition,
      layoutContentMaximize,
      maximize,
      layoutContentSpinning,
    }
  },
  render() {
    const {
      globalMainLayoutLoad,
      layoutContentMaximize,
      layoutContentSpinning,
    } = this
    const { maximize } = this

    return (
      <NSpin
        show={this.spinning || !globalMainLayoutLoad || layoutContentSpinning}
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
