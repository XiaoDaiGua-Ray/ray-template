import './index.scss'
import { LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE } from '@/app-config'
import { useI18n } from '@/hooks'
import { useRuntimeGetters } from '@/store'
import { NSpin } from 'naive-ui'

export default defineComponent({
  name: 'ContentLoading',
  setup() {
    const { t } = useI18n('layout')
    const { globalMainLayoutLoad, layoutContentSpinning } = useRuntimeGetters()
    const routePending = ref(false)
    const visible = ref(false)

    if (LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE) {
      const router = useRouter()
      const stop = () => (routePending.value = false)

      onScopeDispose(
        router.beforeEach(() => {
          routePending.value = true
        }),
      )
      onScopeDispose(router.afterEach(stop))
      onScopeDispose(router.onError(stop))
    }

    watch(
      [globalMainLayoutLoad, layoutContentSpinning, routePending],
      ([mounted, spinning, navigating], _, onCleanup) => {
        if (!mounted) {
          visible.value = true
        } else if (!spinning && !navigating) {
          visible.value = false
        } else if (!visible.value) {
          const timer = setTimeout(() => (visible.value = true), 120)

          onCleanup(() => clearTimeout(timer))
        }
      },
      { immediate: true },
    )

    return () => (
      <div
        role="status"
        class={[
          'layout-content-loading',
          { 'layout-content-loading--visible': visible.value },
        ]}
      >
        {visible.value ? (
          <div class="layout-content-loading__indicator">
            <NSpin size="small" aria-hidden="true" />
            <span>{t('loading')}</span>
          </div>
        ) : null}
      </div>
    )
  },
})
