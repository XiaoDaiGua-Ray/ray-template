import './index.scss'
import { LAYOUT_CONTENT_SPIN_WHEN_ROUTE_CHANGE } from '@/app-config'
import { useI18n } from '@/hooks'
import { useRuntimeGetters } from '@/store'

export default defineComponent({
  name: 'ContentLoading',
  setup() {
    const { t } = useI18n('layout')
    const { globalMainLayoutLoad, layoutContentSpinning } = useRuntimeGetters()
    const routePending = ref(false)
    const visible = ref(false)
    const labelId = useId()

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
        class={[
          'layout-content-loading',
          { 'layout-content-loading--visible': visible.value },
        ]}
      >
        {visible.value ? (
          <div class="layout-content-loading__indicator">
            <progress aria-labelledby={labelId} />
            <span class="layout-content-loading__track" aria-hidden="true" />
            <span id={labelId}>{t('loading')}</span>
          </div>
        ) : null}
      </div>
    )
  },
})
