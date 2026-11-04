import './index.scss'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import UnlockScreen from '@/app-components/app/AppLockScreen/components/UnlockScreen'
import { LAYOUT_CONTENT_REF } from '@/app-config'
import { RIcon } from '@/components/RIcon'
import { useDevice, useI18n, useMaximize } from '@/hooks'
import { layoutCssVars } from '@/layout/layout-css-vars'
import {
  useMenuGetters,
  useRuntimeActions,
  useRuntimeGetters,
  useSettingGetters,
} from '@/store'
import { useEventListener } from '@vueuse/core'
import { NLayout, NLayoutContent } from 'naive-ui'
import type { VNode } from 'vue'
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
    const headerRef = shallowRef<HTMLElement>()
    const tagsRef = shallowRef<HTMLElement>()
    const footerRef = shallowRef<HTMLElement>()
    const { getMenuTagSwitch, getCopyrightSwitch, getLayoutConfig } =
      useSettingGetters()
    const { getMenuOptions, getMenuKey } = useMenuGetters()
    const {
      globalMainLayoutLoad,
      layoutContentSpinning,
      layoutContentMaximize,
      layoutContentMaximizeStyle,
    } = useRuntimeGetters()
    const { setRuntimeState } = useRuntimeActions()
    const { maximize } = useMaximize()
    const { t } = useI18n('layout')
    let previouslyFocused: HTMLElement | null = null
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
      if (
        event.key === 'Escape' &&
        !event.defaultPrevented &&
        layoutContentMaximize.value
      )
        maximize(false)
    })
    watch(
      layoutContentMaximize,
      (active) => {
        if (!active) return

        const focused = document.activeElement

        previouslyFocused = focused instanceof HTMLElement ? focused : null
      },
      { flush: 'sync' },
    )
    watch(
      layoutContentMaximize,
      (active) => {
        if (!active && previouslyFocused?.isConnected) {
          previouslyFocused.focus({ preventScroll: true })
        }
      },
      { flush: 'post' },
    )
    onBeforeUnmount(() => setRuntimeState('layoutContentMaximize', false))

    const header = () => (
      <div
        ref={headerRef}
        class="r-layout-header-region"
        inert={layoutContentMaximize.value}
      >
        {slots.header ? (
          slots.header()
        ) : (
          <>
            <HeaderWrapper />
            {mode.value === 'top' ||
            mode.value === 'mixed' ||
            mode.value === 'split' ? (
              <TopNavigation />
            ) : null}
          </>
        )}
      </div>
    )
    const tabs = () =>
      getMenuTagSwitch.value ? (
        <div
          ref={tagsRef}
          class="r-layout-tabs-region"
          inert={layoutContentMaximize.value}
        >
          {slots.tabs?.() ?? <FeatureWrapper />}
        </div>
      ) : null
    const footer = () =>
      getCopyrightSwitch.value ? (
        <div
          ref={footerRef}
          class="r-layout-footer-region"
          inert={layoutContentMaximize.value}
        >
          {slots.footer?.() ?? <FooterWrapper />}
        </div>
      ) : null

    return () => {
      if (getLockAppScreen()) return <UnlockScreen />

      const config = getLayoutConfig.value
      const grouped = mode.value === 'mixed' || mode.value === 'split'
      const wideHeader = mode.value === 'split' && config.fixedHeader
      const hasSider =
        mode.value === 'side' ||
        mode.value === 'right' ||
        (grouped && mixedChildren.value.length > 0)
      const sidebar = () =>
        hasSider
          ? (slots.sidebar?.() ?? (
              <Menu
                options={grouped ? mixedChildren.value : void 0}
                showLogo={!grouped}
                end={mode.value === 'right'}
                inert={layoutContentMaximize.value}
              />
            ))
          : null

      return (
        <div
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
        >
          {wideHeader ? header() : null}
          <NLayout
            class="r-layout-full__body"
            hasSider={hasSider}
            siderPlacement={mode.value === 'right' ? 'right' : 'left'}
            embedded
          >
            {mode.value !== 'right' ? sidebar() : null}
            <NLayoutContent class="r-layout-full__viewer">
              {config.fixedHeader ? (
                <>
                  {!wideHeader ? header() : null}
                  {tabs()}
                </>
              ) : null}
              <div
                class={[
                  'r-layout-content-viewport',
                  {
                    'r-layout-content--maximized': layoutContentMaximize.value,
                  },
                ]}
                style={
                  layoutContentMaximize.value
                    ? layoutContentMaximizeStyle.value
                    : void 0
                }
              >
                <NLayoutContent
                  ref={LAYOUT_CONTENT_REF}
                  class="r-layout-full__viewer-content"
                  nativeScrollbar={false}
                  contentClass="r-layout-content-scroll"
                >
                  {!config.fixedHeader ? (
                    <>
                      {header()}
                      {tabs()}
                    </>
                  ) : null}
                  <main
                    class="r-layout-content-inner"
                    aria-busy={
                      !slots.default &&
                      (!globalMainLayoutLoad.value ||
                        layoutContentSpinning.value)
                    }
                  >
                    {slots.default?.() ?? <ContentWrapper />}
                  </main>
                  {!config.fixedFooter ? footer() : null}
                </NLayoutContent>
                {!slots.default ? <ContentLoading /> : null}
                {layoutContentMaximize.value ? (
                  <button
                    type="button"
                    class="r-layout-content-restore__button"
                    aria-label={t('restore')}
                    title={t('restore')}
                    {...{
                      onVnodeMounted: ({ el }: VNode) => {
                        if (el instanceof HTMLElement)
                          el.focus({ preventScroll: true })
                      },
                    }}
                    onClick={() => maximize(false)}
                  >
                    <RIcon name="action/fullscreen_fold" size={16} />
                  </button>
                ) : null}
              </div>
              {config.fixedFooter ? footer() : null}
            </NLayoutContent>
            {mode.value === 'right' ? sidebar() : null}
          </NLayout>
        </div>
      )
    }
  },
})
