import {
  useContextmenuCoordinate,
  useDayjs,
  useDevice,
  useDomToImage,
  useElementFullscreen,
  useI18n,
  usePagination,
  usePrint,
  useVueRouter,
} from '@/hooks'
import { useSettingActions } from '@/store'
import {
  NAlert,
  NButton,
  NDropdown,
  NFlex,
  NInput,
  NPagination,
  NTag,
  useThemeVars,
} from 'naive-ui'
import DemoPage from '../components/DemoPage'
import HookExample from './HookExample'

export default defineComponent({
  name: 'WebHooks',
  setup() {
    const { t } = useI18n('hooks')
    const text = (key: string) => t<string>(key)
    const { t: showcaseT } = useI18n('showcase')
    const label = (key: string) => showcaseT<string>(key)
    const themeVars = useThemeVars()
    const device = useDevice()
    const dayjs = useDayjs()
    const { router } = useVueRouter()
    const { updateLocale: changeLocale } = useSettingActions()
    const [pagination, pages] = usePagination(void 0, {
      itemCount: 95,
      pageSize: 10,
    })
    const date = ref('2026-11-03')
    const dayRange = ref(dayjs.getStartAndEndOfDay())
    const target = ref<HTMLElement>()
    const fullscreen = useElementFullscreen(target)
    const capture = useDomToImage(target, { imageType: 'png', cacheBust: true })
    const printer = usePrint(target, { type: 'html', targetStyles: ['*'] })
    const image = ref('')
    const error = ref('')
    const busy = ref(false)
    const contextTarget = ref<HTMLElement>()
    const context = useContextmenuCoordinate(contextTarget)
    const contextStopped = ref(false)
    const selected = ref('')
    const rows = computed(() => {
      const start = (pages.getPage() - 1) * pages.getPageSize()

      return Array.from(
        {
          length: Math.min(
            pages.getPageSize(),
            Math.max(0, pages.getItemCount() - start),
          ),
        },
        (_, index) => start + index + 1,
      )
    })
    const createImage = async () => {
      busy.value = true
      error.value = ''

      try {
        image.value = await capture.create()
      } catch (cause) {
        error.value = cause instanceof Error ? cause.message : String(cause)
      } finally {
        busy.value = false
      }
    }
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
        title={label('webTitle')}
        description={text('webIntro')}
        eyebrow={label('webEyebrow')}
        meta="9 Hooks"
      >
        <h2 class="r-demo-section-heading">{label('commonUtilities')}</h2>
        <div class="r-hook-grid">
          {example(
            'useDevice',
            `const { width, height, isTabletOrSmaller } = useDevice({ media: 768 })\n// Refs update when the viewport changes; listeners are released with the scope.`,
            () => (
              <NFlex>
                <NTag>
                  {device.width.value} × {device.height.value}
                </NTag>
                <NTag>
                  {device.isTabletOrSmaller.value
                    ? text('smallScreen')
                    : text('desktop')}
                </NTag>
              </NFlex>
            ),
          )}
          {example(
            'usePagination',
            `const [pagination, { getPage, setPage, setPageSize, resetPagination }] = usePagination(loadRows, { itemCount: 95 })\n<NPagination {...pagination.value} />\n// Changing page size resets the page to 1.`,
            () => (
              <NFlex vertical>
                <NFlex>
                  {rows.value.map((row) => (
                    <NTag key={row}>#{row}</NTag>
                  ))}
                </NFlex>
                <div style="overflow-x: auto">
                  <NPagination {...pagination.value} />
                </div>
                <NFlex>
                  <NButton onClick={() => pages.setPage(2)}>
                    {text('pageTwo')}
                  </NButton>
                  <NButton onClick={() => pages.setPageSize(20)}>
                    {text('pageSize20')}
                  </NButton>
                  <NButton onClick={pages.resetPagination}>
                    {text('reset')}
                  </NButton>
                </NFlex>
              </NFlex>
            ),
          )}
          {example(
            'useDayjs',
            `const { format, daysDiff, isDateInRange, getStartAndEndOfDay, isDayjs, locale } = useDayjs()\nformat('2026-11-03', { format: 'YYYY/MM/DD' })\ndaysDiff('2026-11-01', '2026-11-03')\nisDateInRange('2026-11-03', { start: '2026-11-01', end: '2026-11-30' })`,
            () => (
              <NFlex vertical>
                <NInput
                  value={date.value}
                  onUpdateValue={(value) => {
                    date.value = value
                  }}
                  aria-label={text('date')}
                />
                <pre class="r-demo-code">
                  <code>
                    {JSON.stringify(
                      {
                        format: dayjs.format(date.value),
                        daysDiff: dayjs.daysDiff('2026-11-01', date.value),
                        inRange: dayjs.isDateInRange(date.value, {
                          start: '2026-11-01',
                          end: '2026-11-30',
                        }),
                        startOfDay: dayRange.value.formatStartOfDay,
                        endOfDay: dayRange.value.formatEndOfDay,
                      },
                      null,
                      2,
                    )}
                  </code>
                </pre>
                <NButton
                  onClick={() => {
                    dayRange.value = dayjs.getStartAndEndOfDay()
                  }}
                >
                  {text('refreshDate')}
                </NButton>
              </NFlex>
            ),
          )}
          {example(
            'useI18n',
            `const { t } = useI18n('hooks')\nt('webIntro')\nt('hooks.webIntro')\nconst { updateLocale } = useSettingActions()\nupdateLocale('en-US')`,
            () => (
              <NFlex vertical>
                <span>{text('webIntro')}</span>
                <NFlex>
                  <NButton onClick={() => changeLocale('zh-CN')}>
                    简体中文
                  </NButton>
                  <NButton onClick={() => changeLocale('en-US')}>
                    English
                  </NButton>
                </NFlex>
              </NFlex>
            ),
          )}
          {example(
            'useVueRouter',
            `const { router } = useVueRouter()\nrouter.currentRoute.value.fullPath\nrouter.replace({ path: '/web-hooks', query: { example: 'router' } })`,
            () => (
              <NFlex vertical>
                <code style="overflow-wrap: anywhere">
                  {router.currentRoute.value.fullPath}
                </code>
                <NFlex>
                  <NButton
                    onClick={() =>
                      router.replace({
                        path: '/web-hooks',
                        query: { example: 'router' },
                      })
                    }
                  >
                    {text('updateQuery')}
                  </NButton>
                  <NButton onClick={() => router.push('/template-hooks')}>
                    {text('openTemplate')}
                  </NButton>
                </NFlex>
              </NFlex>
            ),
          )}
        </div>
        <h2 class="r-demo-section-heading">{label('browserCapabilities')}</h2>
        <div
          ref={target}
          class="r-hook-capture-target"
          style={{ backgroundColor: themeVars.value.cardColor }}
        >
          <h2>Ray Template</h2>
          <p>{text('captureTarget')}</p>
          <p class="r-hook-capture-target__stack">
            Vue 3 · TypeScript · Naive UI
          </p>
          {fullscreen.isFullscreen.value ? (
            <NButton onClick={fullscreen.exit}>
              {text('exitFullscreen')}
            </NButton>
          ) : null}
        </div>
        <div class="r-hook-grid">
          {example(
            'useElementFullscreen',
            `const target = ref<HTMLElement>()\nconst { enter, exit, toggleFullscreen, isFullscreen } = useElementFullscreen(target)\n// CSS fullscreen: no browser permission required.\n<div ref={target} />`,
            () => (
              <NFlex align="center">
                <NTag>{String(fullscreen.isFullscreen.value)}</NTag>
                <NButton onClick={fullscreen.toggleFullscreen}>
                  {text('toggleElementFullscreen')}
                </NButton>
              </NFlex>
            ),
          )}
          {example(
            'useDomToImage',
            `const { create } = useDomToImage(target, { imageType: 'png' })\nconst png: string = await create()\nconst blob: Blob | null = await create('blob')`,
            () => (
              <NFlex vertical>
                <NButton loading={busy.value} onClick={createImage}>
                  {text('capture')}
                </NButton>
                {error.value ? (
                  <NAlert type="error">{error.value}</NAlert>
                ) : null}
                {image.value ? (
                  <img
                    src={image.value}
                    alt={text('capturePreview')}
                    style="max-width: 100%; height: auto"
                  />
                ) : null}
              </NFlex>
            ),
          )}
          {example(
            'usePrint',
            `const target = ref<HTMLElement>()\nconst { print } = usePrint(target, { type: 'html', targetStyles: ['*'] })\n// Call from a button click.`,
            () => (
              <NButton onClick={printer.print}>{text('print')}</NButton>
            ),
          )}
          {example(
            'useContextmenuCoordinate',
            `const { x, y, show, updateShow, stop } = useContextmenuCoordinate(target)\n<NDropdown show={show.value} x={x.value} y={y.value} trigger="manual" />\nstop() // Hides the menu and removes all listeners.`,
            () => (
              <NFlex vertical>
                <div
                  ref={contextTarget}
                  tabindex={0}
                  style="padding: 32px; border: 1px dashed var(--n-border-color)"
                  onKeydown={(event) => {
                    if (event.key === 'Escape') context.updateShow(false)
                  }}
                >
                  {text('rightClick')}
                </div>
                <code>
                  x: {context.x.value}, y: {context.y.value}, show:{' '}
                  {String(context.show.value)} {selected.value}
                </code>
                <NButton
                  disabled={contextStopped.value}
                  onClick={() => {
                    context.stop()
                    contextStopped.value = true
                  }}
                >
                  {contextStopped.value ? text('stopped') : text('stop')}
                </NButton>
                <NDropdown
                  show={context.show.value}
                  x={context.x.value}
                  y={context.y.value}
                  trigger="manual"
                  placement="bottom-start"
                  options={[
                    { key: 'copy', label: text('contextCopy') },
                    { key: 'inspect', label: text('contextInspect') },
                  ]}
                  onSelect={(key) => {
                    selected.value = String(key)
                    context.updateShow(false)
                  }}
                  onClickoutside={() => context.updateShow(false)}
                />
              </NFlex>
            ),
          )}
        </div>
      </DemoPage>
    )
  },
})
