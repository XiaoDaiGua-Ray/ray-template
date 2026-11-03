import { RIcon } from '@/components'
import {
  useAppNavigation,
  useAppRoot,
  useBadge,
  useContentScroll,
  useI18n,
  useMaximize,
  useSiderBar,
  useSiderScroll,
  useSpinning,
  useTheme,
  useVueRouter,
  useWatermark,
} from '@/hooks'
import { useMenuGetters, useRuntimeGetters, useSettingGetters } from '@/store'
import { useTimeoutFn } from '@vueuse/core'
import { NButton, NFlex, NInput, NTag } from 'naive-ui'
import DemoPage from '../components/DemoPage'
import HookExample from '../hooks/HookExample'

export default defineComponent({
  name: 'TemplateHooks',
  setup() {
    const { t } = useI18n('hooks')
    const text = (key: string) => t<string>(key)
    const { t: showcaseT } = useI18n('showcase')
    const label = (key: string) => showcaseT<string>(key)
    const { router } = useVueRouter()
    const theme = useTheme()
    const watermark = useWatermark()
    const badge = useBadge()
    const spinning = useSpinning()
    const maximize = useMaximize()
    const root = useAppRoot()
    const tags = useSiderBar()
    const { navigationTo } = useAppNavigation()
    const contentScrollTo = useContentScroll()
    const siderScrollTo = useSiderScroll()
    const settings = useSettingGetters()
    const { getMenuTagOptions } = useMenuGetters()
    const runtime = useRuntimeGetters()
    const badgeLabel = ref('new')
    const watermarkText = ref(settings.getWatermarkConfig.value.content)
    const { start: stopSpinLater } = useTimeoutFn(spinning.closeSpin, 800, {
      immediate: false,
    })

    onBeforeUnmount(spinning.closeSpin)
    // 过渡期间组件仍可能渲染，操作目标保持为本示例页面。
    const currentPath = router.currentRoute.value.path
    const current = () => currentPath
    const hasCurrentTag = computed(() =>
      getMenuTagOptions.value.some((tag) => tag.fullPath === currentPath),
    )
    const example = (
      name: string,
      code: string,
      children: () => JSX.Element,
    ) => (
      <HookExample
        name={name}
        description={text(`descriptions.${name}`)}
        code={code}
      >
        {children()}
      </HookExample>
    )

    return () => (
      <DemoPage
        title={label('templateTitle')}
        description={text('templateIntro')}
        eyebrow={label('templateEyebrow')}
        meta="10 Hooks"
      >
        <h2 class="r-demo-section-heading">{label('appearanceAndPage')}</h2>
        <div class="r-hook-grid">
          {example(
            'useTheme',
            `const { darkTheme, lightTheme, toggleTheme, syncSystemTheme, getAppTheme } = useTheme()\ntoggleTheme()\ngetAppTheme().themeLabel`,
            () => (
              <NFlex align="center">
                <NTag>{theme.getAppTheme().themeI18nLabel}</NTag>
                <NButton onClick={theme.darkTheme}>{text('dark')}</NButton>
                <NButton onClick={theme.lightTheme}>{text('light')}</NButton>
                <NButton onClick={theme.syncSystemTheme}>
                  {text('system')}
                </NButton>
                <NButton onClick={theme.toggleTheme}>{text('toggle')}</NButton>
              </NFlex>
            ),
          )}
          {example(
            'useSpinning',
            `const { openSpin, closeSpin, reload } = useSpinning()\nopenSpin()\n// Call closeSpin() when work finishes.\nreload(800)`,
            () => (
              <NFlex>
                <NButton
                  onClick={() => {
                    spinning.openSpin()
                    stopSpinLater()
                  }}
                >
                  {text('spin')}
                </NButton>
                <NButton onClick={() => spinning.reload()}>
                  {text('reload')}
                </NButton>
                <NTag>{String(runtime.layoutContentSpinning.value)}</NTag>
              </NFlex>
            ),
          )}
          {example(
            'useMaximize',
            `const { maximize, isLayoutContentMaximized, toggleFullscreen } = useMaximize()\nmaximize(true, { scrollToOptions: { top: 0 } })\nmaximize(false)`,
            () => (
              <NFlex align="center">
                <NTag>{String(maximize.isLayoutContentMaximized.value)}</NTag>
                <NButton onClick={maximize.toggleFullscreen}>
                  {text('maximize')}
                </NButton>
              </NFlex>
            ),
          )}
        </div>
        <h2 class="r-demo-section-heading">{label('globalMarkers')}</h2>
        <div class="r-hook-grid">
          {example(
            'useBadge',
            `const { show, update, hidden } = useBadge()\nshow('/template-hooks', { label: 'new' })\nupdate('/template-hooks', { label: '3', type: 'warning' })\nhidden('/template-hooks')`,
            () => (
              <NFlex vertical>
                <NInput
                  value={badgeLabel.value}
                  onUpdateValue={(value) => {
                    badgeLabel.value = value
                  }}
                  aria-label={text('badgeLabel')}
                />
                <NFlex>
                  <NButton
                    onClick={() =>
                      badge.show(current(), { label: badgeLabel.value })
                    }
                  >
                    {text('show')}
                  </NButton>
                  <NButton
                    onClick={() =>
                      badge.update(current(), {
                        label: badgeLabel.value,
                        icon: <RIcon name="status/error" />,
                        type: 'warning',
                      })
                    }
                  >
                    {text('update')}
                  </NButton>
                  <NButton
                    onClick={() => badge.update(current(), { icon: void 0 })}
                  >
                    {text('clearIcon')}
                  </NButton>
                  <NButton onClick={() => badge.hidden(current())}>
                    {text('hide')}
                  </NButton>
                </NFlex>
              </NFlex>
            ),
          )}
          {example(
            'useWatermark',
            `const { setWatermarkContent, showWatermark, hiddenWatermark, toggleWatermark } = useWatermark()\nsetWatermarkContent('Ray Template')\nshowWatermark()`,
            () => (
              <NFlex vertical>
                <NInput
                  value={watermarkText.value}
                  onUpdateValue={(value) => {
                    watermarkText.value = value
                    watermark.setWatermarkContent(value)
                  }}
                  aria-label={text('watermarkText')}
                />
                <NFlex>
                  <NButton onClick={watermark.showWatermark}>
                    {text('show')}
                  </NButton>
                  <NButton onClick={watermark.hiddenWatermark}>
                    {text('hide')}
                  </NButton>
                  <NButton onClick={watermark.toggleWatermark}>
                    {text('toggle')}
                  </NButton>
                </NFlex>
              </NFlex>
            ),
          )}
        </div>
        <h2 class="r-demo-section-heading">{label('navigationAndTabs')}</h2>
        <div class="r-hook-grid">
          {example(
            'useAppNavigation',
            `const { navigationTo } = useAppNavigation()\nawait navigationTo('/web-hooks', { query: { from: 'hooks' } })\n// A zero-based index navigates to the first child of that section.\nawait navigationTo(0)`,
            () => (
              <NFlex>
                <NButton
                  onClick={() =>
                    navigationTo('/web-hooks', { query: { from: 'hooks' } })
                  }
                >
                  {text('openWeb')}
                </NButton>
                <NButton onClick={() => navigationTo('/multi/multi-menu-one')}>
                  {text('openNested')}
                </NButton>
                <NButton onClick={() => navigationTo(0)}>
                  {text('firstMenu')}
                </NButton>
              </NFlex>
            ),
          )}
          {example(
            'useAppRoot',
            `const { getRootRoute, getRootPath, getRootName, setRootRoute } = useAppRoot()\nsetRootRoute({ name: 'TemplateHooks', path: '/template-hooks' })`,
            () => (
              <NFlex vertical>
                <code>{JSON.stringify(root.getRootRoute.value)}</code>
                <NFlex>
                  <NButton
                    onClick={() =>
                      root.setRootRoute({
                        name: 'TemplateHooks',
                        path: '/template-hooks',
                      })
                    }
                  >
                    {text('useCurrentHome')}
                  </NButton>
                  <NButton
                    onClick={() =>
                      root.setRootRoute({
                        name: 'Dashboard',
                        path: '/dashboard',
                      })
                    }
                  >
                    {text('restoreHome')}
                  </NButton>
                </NFlex>
              </NFlex>
            ),
          )}
          {example(
            'useSiderBar',
            `const { close, closeAll, closeLeft, closeRight, closeOther, getCurrentTagIndex } = useSiderBar()\ncloseOther('/template-hooks')`,
            () => (
              <NFlex vertical>
                <code>
                  {getMenuTagOptions.value
                    .map((tag) => tag.fullPath)
                    .join(' · ')}
                </code>
                <NFlex>
                  <NButton onClick={() => tags.closeOther(current())}>
                    {text('closeOther')}
                  </NButton>
                  <NButton
                    disabled={
                      !hasCurrentTag.value || !tags.checkCloseLeft(current())
                    }
                    onClick={() => tags.closeLeft(current())}
                  >
                    {text('closeLeft')}
                  </NButton>
                  <NButton
                    disabled={
                      !hasCurrentTag.value || !tags.checkCloseRight(current())
                    }
                    onClick={() => tags.closeRight(current())}
                  >
                    {text('closeRight')}
                  </NButton>
                  <NButton onClick={() => tags.close(current())}>
                    {text('closeCurrent')}
                  </NButton>
                  <NButton onClick={tags.closeAll}>{text('closeAll')}</NButton>
                </NFlex>
              </NFlex>
            ),
          )}
        </div>
        <h2 class="r-demo-section-heading">{label('scrollControls')}</h2>
        <div class="r-hook-grid">
          {example(
            'useContentScroll',
            `const contentScrollTo = useContentScroll()\ncontentScrollTo({ top: 0, behavior: 'smooth' })\ncontentScrollTo(0, 300)`,
            () => (
              <NFlex>
                <NButton
                  onClick={() =>
                    contentScrollTo({ top: 0, behavior: 'smooth' })
                  }
                >
                  {text('contentTop')}
                </NButton>
                <NButton onClick={() => contentScrollTo(0, 300)}>
                  {text('content300')}
                </NButton>
              </NFlex>
            ),
          )}
          {example(
            'useSiderScroll',
            `const siderScrollTo = useSiderScroll()\nsiderScrollTo({ top: 0, behavior: 'smooth' })\nsiderScrollTo(0, 300)`,
            () => (
              <NFlex>
                <NButton
                  disabled={settings.getLayoutConfig.value.mode === 'top'}
                  onClick={() => siderScrollTo({ top: 0, behavior: 'smooth' })}
                >
                  {text('siderTop')}
                </NButton>
                <NButton
                  disabled={settings.getLayoutConfig.value.mode === 'top'}
                  onClick={() => siderScrollTo(0, 300)}
                >
                  {text('sider300')}
                </NButton>
              </NFlex>
            ),
          )}
        </div>
      </DemoPage>
    )
  },
})
