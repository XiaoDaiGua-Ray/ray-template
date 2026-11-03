import './index.scss'
import useAppLockScreen from '@/app-components/app/AppLockScreen/appLockVar'
import UnlockScreen from '@/app-components/app/AppLockScreen/components/UnlockScreen'
import { LAYOUT_CONTENT_REF } from '@/app-config'
import { RIcon } from '@/components/base/RIcon'
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
            {mode.value !== 'side' ? <TopNavigation /> : null}
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
              contentClass="r-layout-content-scroll"
            >
              {layoutContentMaximize.value ? (
                <div class="r-layout-content-restore">
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
                    <RIcon name="action/out" size={16} />
                    {t('restoreButton')}
                  </button>
                </div>
              ) : null}
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
