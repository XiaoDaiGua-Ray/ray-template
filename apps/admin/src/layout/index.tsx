import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import UnlockScreen from '@/app-components/app/AppLockScreen/components/UnlockScreen'
import { LAYOUT_CONTENT_REF } from '@/app-config'
import { useDevice, useI18n, useMaximize } from '@/hooks'
import { useMenuGetters, useRuntimeGetters, useSettingGetters } from '@/store'
import { AdminShell } from '@ray-template/admin-shell'
import Menu from './components/Menu'
import TopNavigation from './components/TopNavigation'
import {
  ContentWrapper,
  FeatureWrapper,
  FooterWrapper,
  HeaderWrapper,
} from './default'
import ContentLoading from './default/ContentWrapper/ContentLoading'
import { findMenuRoot } from './navigation'

export default defineComponent({
  name: 'RLayout',
  setup(_, { slots }) {
    const { getMenuTagSwitch, getCopyrightSwitch, getLayoutConfig } =
      useSettingGetters()
    const { getMenuOptions, getMenuKey } = useMenuGetters()
    const {
      globalMainLayoutLoad,
      layoutContentSpinning,
      layoutContentMaximize,
      layoutContentMaximizeStyle,
    } = useRuntimeGetters()
    const { maximize } = useMaximize()
    const { t } = useI18n('layout')
    const { isTabletOrSmaller } = useDevice()
    const { getLockAppScreen } = useAppLockScreen()
    const mode = computed(() =>
      isTabletOrSmaller.value ? 'side' : getLayoutConfig.value.mode,
    )
    const mixedChildren = computed(
      () =>
        findMenuRoot(
          getMenuOptions.value,
          String(getMenuKey.value),
        )?.children?.filter((option) => option.show !== false) ?? [],
    )

    return () => {
      if (getLockAppScreen()) return <UnlockScreen />

      const grouped = mode.value === 'mixed' || mode.value === 'split'

      return (
        <AdminShell
          layout={getLayoutConfig.value}
          mode={mode.value}
          groupedSidebar={mixedChildren.value.length > 0}
          showTabs={getMenuTagSwitch.value}
          showFooter={getCopyrightSwitch.value}
          busy={
            !slots.default &&
            (!globalMainLayoutLoad.value || layoutContentSpinning.value)
          }
          maximized={layoutContentMaximize.value}
          maximizedStyle={layoutContentMaximizeStyle.value}
          contentRef={LAYOUT_CONTENT_REF}
          restore={() => maximize(false)}
          restoreLabel={t('restore')}
        >
          {{
            header:
              slots.header ??
              (() => (
                <>
                  <HeaderWrapper />
                  {mode.value === 'top' || grouped ? <TopNavigation /> : null}
                </>
              )),
            sidebar:
              slots.sidebar ??
              (() => (
                <Menu
                  options={grouped ? mixedChildren.value : void 0}
                  showLogo={!grouped}
                  end={mode.value === 'right'}
                  inert={layoutContentMaximize.value}
                />
              )),
            tabs: slots.tabs ?? (() => <FeatureWrapper />),
            footer: slots.footer ?? (() => <FooterWrapper />),
            default: slots.default ?? (() => <ContentWrapper />),
            loading: slots.default ? void 0 : () => <ContentLoading />,
          }}
        </AdminShell>
      )
    }
  },
})
