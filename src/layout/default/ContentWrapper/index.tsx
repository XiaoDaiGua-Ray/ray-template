/**
 *
 * 使用 NSpin 组件实现 loading 效果
 * 默认添加 300ms 延迟
 */

import './index.scss'
import AppRequestCancelerProvider from '@/app-components/provider/AppRequestCancelerProvider'
import { LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE } from '@/app-config'
import { RIcon, RTransitionComponent } from '@/components'
import { getVariable } from '@/global-variable'
import { useMaximize } from '@/hooks'
import { useSettingGetters } from '@/store'
import { NSpin } from 'naive-ui'
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
      maximize,
      spinning,
      themeOverridesSpin,
      getContentTransition,
    } = this

    return (
      <NSpin
        show={spinning || !globalMainLayoutLoad || layoutContentSpinning}
        description="loading..."
        size="large"
        themeOverrides={themeOverridesSpin}
        class={[
          layoutContentMaximize
            ? 'r-layout-full__viewer-content--maximize'
            : null,
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
            transitionPropName={getContentTransition + '-transform'}
          />
        ) : null}
      </NSpin>
    )
  },
})
