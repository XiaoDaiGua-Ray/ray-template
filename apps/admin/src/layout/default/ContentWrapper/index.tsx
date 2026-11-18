import AppRequestCancelerProvider from '@/app-components/provider/AppRequestCancelerProvider'
import { RTransitionComponent } from '@/components/RTransitionComponent'
import { useRuntimeGetters, useSettingGetters } from '@/store'

export default defineComponent({
  name: 'LayoutContentWrapper',
  setup() {
    const { globalMainLayoutLoad, refreshingPath } = useRuntimeGetters()
    const { getContentTransition } = useSettingGetters()

    return () => (
      <>
        <AppRequestCancelerProvider />
        {globalMainLayoutLoad.value || refreshingPath.value !== null ? (
          <RTransitionComponent
            class="content-wrapper"
            transitionPropName={`${getContentTransition.value}-transform`}
            transitionAppear={false}
            refreshingPath={refreshingPath.value}
          />
        ) : null}
      </>
    )
  },
})
