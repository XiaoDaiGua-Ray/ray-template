import AppRequestCancelerProvider from '@/app-components/provider/AppRequestCancelerProvider'
import { RTransitionComponent } from '@/components/RTransitionComponent'
import { useRuntimeGetters, useSettingGetters } from '@/store'

export default defineComponent({
  name: 'LayoutContentWrapper',
  setup() {
    const { globalMainLayoutLoad } = useRuntimeGetters()
    const { getContentTransition } = useSettingGetters()

    return () => (
      <>
        <AppRequestCancelerProvider />
        {globalMainLayoutLoad.value ? (
          <RTransitionComponent
            class="content-wrapper"
            transitionPropName={`${getContentTransition.value}-transform`}
            transitionAppear={false}
          />
        ) : null}
      </>
    )
  },
})
