import './shell.scss'
import { RIcon } from '@ray-template/ui/icon'
import { useEventListener } from '@vueuse/core'
import { NLayout, NLayoutContent } from 'naive-ui'
import { defineComponent, onBeforeUnmount, shallowRef, watch } from 'vue'
import type { CSSProperties, PropType, VNode, VNodeRef } from 'vue'
import { layoutCssVars } from './layout-css-vars'

export const LAYOUT_MODES = ['side', 'top', 'mixed', 'right', 'split'] as const
export type LayoutMode = (typeof LAYOUT_MODES)[number]
export interface LayoutConfig {
  mode: LayoutMode
  contentWidth: 'fluid' | 'fixed'
  contentMaxWidth: number
  contentPadding: number
  fixedHeader: boolean
  fixedFooter: boolean
}

export const AdminShell = defineComponent({
  name: 'RayAdminShell',
  props: {
    layout: { type: Object as PropType<LayoutConfig>, required: true },
    mode: { type: String as PropType<LayoutMode>, default: void 0 },
    groupedSidebar: Boolean,
    showTabs: Boolean,
    showFooter: Boolean,
    busy: Boolean,
    contentRef: { type: Object as PropType<VNodeRef>, default: void 0 },
    maximized: Boolean,
    maximizedStyle: {
      type: Object as PropType<CSSProperties>,
      default: void 0,
    },
    restore: { type: Function as PropType<() => void>, default: void 0 },
    restoreLabel: { type: String, default: 'Restore layout' },
  },
  setup(props, { slots }) {
    const headerRef = shallowRef<HTMLElement>()
    const tagsRef = shallowRef<HTMLElement>()
    const footerRef = shallowRef<HTMLElement>()
    const cssVars = layoutCssVars([headerRef, tagsRef, footerRef])
    let previouslyFocused: HTMLElement | null = null

    useEventListener(
      typeof window === 'undefined' ? void 0 : window,
      'keydown',
      (event) => {
        if (
          event instanceof KeyboardEvent &&
          event.key === 'Escape' &&
          !event.defaultPrevented &&
          props.maximized
        )
          props.restore?.()
      },
    )
    watch(
      () => props.maximized,
      (active) => {
        if (!active) return

        const focused = document.activeElement

        previouslyFocused = focused instanceof HTMLElement ? focused : null
      },
      { flush: 'sync' },
    )
    watch(
      () => props.maximized,
      (active) => {
        if (!active && previouslyFocused?.isConnected) {
          previouslyFocused.focus({ preventScroll: true })
        }
      },
      { flush: 'post' },
    )
    onBeforeUnmount(() => {
      if (props.maximized) props.restore?.()
    })

    const header = () => (
      <div
        ref={headerRef}
        class="r-layout-header-region"
        inert={props.maximized}
      >
        {slots.header?.()}
      </div>
    )
    const tabs = () =>
      props.showTabs ? (
        <div ref={tagsRef} class="r-layout-tabs-region" inert={props.maximized}>
          {slots.tabs?.()}
        </div>
      ) : null
    const footer = () =>
      props.showFooter ? (
        <div
          ref={footerRef}
          class="r-layout-footer-region"
          inert={props.maximized}
        >
          {slots.footer?.()}
        </div>
      ) : null

    return () => {
      const config = props.layout
      const mode = props.mode ?? config.mode
      const wideHeader = mode === 'split' && config.fixedHeader
      const hasSider =
        mode === 'side' ||
        mode === 'right' ||
        ((mode === 'mixed' || mode === 'split') && props.groupedSidebar)
      const sidebar = () => (hasSider ? slots.sidebar?.() : null)

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
            siderPlacement={mode === 'right' ? 'right' : 'left'}
            embedded
          >
            {mode !== 'right' ? sidebar() : null}
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
                    'r-layout-content--maximized': props.maximized,
                  },
                ]}
                style={props.maximized ? props.maximizedStyle : void 0}
              >
                {props.maximized ? (
                  <button
                    type="button"
                    class="r-layout-content-restore__button"
                    aria-label={props.restoreLabel}
                    title={props.restoreLabel}
                    {...{
                      onVnodeMounted: ({ el }: VNode) => {
                        if (el instanceof HTMLElement)
                          el.focus({ preventScroll: true })
                      },
                    }}
                    onClick={() => props.restore?.()}
                  >
                    <RIcon name="action/fullscreen_fold" size={18} />
                  </button>
                ) : null}
                <NLayoutContent
                  ref={props.contentRef}
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
                  <main class="r-layout-content-inner" aria-busy={props.busy}>
                    {slots.default?.()}
                  </main>
                  {!config.fixedFooter ? footer() : null}
                </NLayoutContent>
                {slots.loading?.()}
              </div>
              {config.fixedFooter ? footer() : null}
            </NLayoutContent>
            {mode === 'right' ? sidebar() : null}
          </NLayout>
        </div>
      )
    }
  },
})
