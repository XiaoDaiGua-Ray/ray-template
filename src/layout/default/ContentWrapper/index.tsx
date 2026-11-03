import { useRuntimeGetters } from '@/store'
import './index.scss'
import AppRequestCancelerProvider from '@/app-components/provider/AppRequestCancelerProvider'
import { LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE } from '@/app-config'
import { RTransitionComponent } from '@/components'
import { useI18n } from '@/hooks'
import { useSettingGetters } from '@/store'
import { NSpin } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

export default defineComponent({
  name: 'LayoutContentWrapper',
  setup() {
    const router = useRouter()
    const { t } = useI18n()

    const { getContentTransition } = useSettingGetters()
    const spinning = ref(false)
    const themeOverridesSpin: GlobalThemeOverrides['Spin'] = {
      opacitySpinning: '0',
    }
    const { globalMainLayoutLoad, layoutContentSpinning } = useRuntimeGetters()

    const setupLayoutContentSpin = () => {
      const removeBefore = router.beforeEach(() => {
        spinning.value = true
      })

      const removeAfter = router.afterEach(() => {
        spinning.value = false
      })
      const removeError = router.onError(() => {
        spinning.value = false
      })

      onScopeDispose(removeBefore)
      onScopeDispose(removeAfter)
      onScopeDispose(removeError)
    }

    if (LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE) {
      setupLayoutContentSpin()
    }

    return {
      t,
      globalMainLayoutLoad,
      spinning,
      themeOverridesSpin,
      getContentTransition,
      layoutContentSpinning,
    }
  },
  render() {
    const {
      globalMainLayoutLoad,
      layoutContentSpinning,
      spinning,
      themeOverridesSpin,
      getContentTransition,
    } = this

    return (
      <NSpin
        show={spinning || !globalMainLayoutLoad || layoutContentSpinning}
        delay={300}
        description={this.t('layout.loading')}
        size="large"
        themeOverrides={themeOverridesSpin}
        class="layout-content-spin"
      >
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
