import './index.scss'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import UnlockScreen from '@/app-components/app/AppLockScreen/components/UnlockScreen'
import { LAYOUT_CONTENT_REF } from '@/app-config'
import { useDevice, useMaximize } from '@/hooks'
import { layoutCssVars } from '@/layout/layout-css-vars'
import {
  useMenuGetters,
  useRuntimeActions,
  useRuntimeGetters,
  useSettingGetters,
} from '@/store'
import { useEventListener } from '@vueuse/core'
import { NLayout, NLayoutContent } from 'naive-ui'
import Menu from './components/Menu'
import TopNavigation from './components/TopNavigation'
import {
  ContentWrapper,
  FeatureWrapper,
  FooterWrapper,
  HeaderWrapper,
} from './default'
import { findMenuRoot } from './navigation'

export default defineComponent({
  name: 'RLayout',
  setup(_, { slots }) {
    const headerRef = shallowRef<HTMLElement>()
    const tagsRef = shallowRef<HTMLElement>()
    const footerRef = shallowRef<HTMLElement>()
    const { getMenuTagSwitch, getCopyrightSwitch, getLayoutConfig } =
      useSettingGetters()
    const { getMenuOptions, getMenuKey } = useMenuGetters()
    const { layoutContentMaximize, layoutContentMaximizeStyle } =
      useRuntimeGetters()
    const { setRuntimeState } = useRuntimeActions()
    const { maximize } = useMaximize()
    const { isTabletOrSmaller } = useDevice()
    const { getLockAppScreen } = useAppLockScreen()
    const cssVars = layoutCssVars([headerRef, tagsRef, footerRef])
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

    useEventListener(window, 'keydown', (event) => {
      if (event.key === 'Escape' && layoutContentMaximize.value) maximize(false)
    })
    onBeforeUnmount(() => setRuntimeState('layoutContentMaximize', false))

    const header = () => (
      <div ref={headerRef} class="r-layout-header-region">
        {slots.header ? (
          slots.header()
        ) : (
          <>
            <HeaderWrapper />
            {mode.value !== 'side' ? <TopNavigation /> : null}
          </>
        )}
      </div>
    )
    const tabs = () =>
      getMenuTagSwitch.value ? (
        <div ref={tagsRef}>{slots.tabs?.() ?? <FeatureWrapper />}</div>
      ) : null
    const footer = () =>
      getCopyrightSwitch.value ? (
        <div ref={footerRef}>{slots.footer?.() ?? <FooterWrapper />}</div>
      ) : null

    return () => {
      if (getLockAppScreen()) return <UnlockScreen />

      const config = getLayoutConfig.value
      const hasSider =
        mode.value === 'side' ||
        (mode.value === 'mixed' && mixedChildren.value.length > 0)

      return (
        <NLayout
          class="r-layout-full"
          style={[
            cssVars.value,
            {
              '--layout-content-padding': `${config.contentPadding}px`,
              '--layout-content-max-width':
                config.contentWidth === 'fixed'
                  ? `${config.contentMaxWidth}px`
                  : '100%',
            },
          ]}
          hasSider
          embedded
        >
          {hasSider
            ? (slots.sidebar?.() ?? (
                <Menu
                  options={
                    mode.value === 'mixed' ? mixedChildren.value : void 0
                  }
                  showLogo={mode.value === 'side'}
                />
              ))
            : null}
          <NLayoutContent class="r-layout-full__viewer">
            {config.fixedHeader ? (
              <>
                {header()}
                {tabs()}
              </>
            ) : null}
            <NLayoutContent
              ref={LAYOUT_CONTENT_REF}
              class={[
                'r-layout-full__viewer-content',
                { 'r-layout-content--maximized': layoutContentMaximize.value },
              ]}
              style={
                layoutContentMaximize.value
                  ? layoutContentMaximizeStyle.value
                  : void 0
              }
              nativeScrollbar={false}
            >
              {!config.fixedHeader ? (
                <>
                  {header()}
                  {tabs()}
                </>
              ) : null}
              <main class="r-layout-content-inner">
                {slots.default?.() ?? <ContentWrapper />}
              </main>
              {!config.fixedFooter ? footer() : null}
            </NLayoutContent>
            {config.fixedFooter ? footer() : null}
          </NLayoutContent>
        </NLayout>
      )
    }
  },
})
