import { useI18n, useSiderScroll } from '@/hooks'
import {
  arrayBufferToBase64Image,
  autoPrefixStyle,
  call,
  colorToRgba,
  completeSize,
  downloadAnyFile,
  downloadBase64File,
  effectDispose,
  fileToBase64,
  hasClass,
  positionSelectedMenuItem,
  printDom,
  queryElements,
  removeClass,
  removeStyle,
  renderNode,
  setClass,
  setStyle,
  unrefElement,
  watchEffectWithTarget,
} from '@/utils'
import { NButton, NCard, NFlex, NInput, NSwitch } from 'naive-ui'
import { effectScope } from 'vue'
import DemoPage from './components/DemoPage'
import DemoResult from './components/DemoResult'

const png =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j9x0AAAAASUVORK5CYII='

export default defineComponent({
  name: 'DocsBrowserUtils',
  setup() {
    const { t } = useI18n('docsExamples')
    const text = (key: string) => t<string>(key)
    const target = ref<HTMLElement>()
    const result = ref('')
    const color = ref('#3b63d9')
    const size = ref('150')
    const zero = ref(true)
    const log = ref<string[]>([])
    const count = ref(0)
    const observed = ref<number>()
    const cleaned = ref(false)
    const running = ref(false)
    const dataUrl = ref('')
    const fileResult = ref('')
    const scrollSidebar = useSiderScroll()
    let scope: ReturnType<typeof effectScope> | undefined

    const change = (apply: boolean) => {
      const node = unrefElement(target)

      if (!node) return

      const actionScope = effectScope()

      actionScope.run(() => {
        if (apply) {
          setClass(node, 'docs-utility-marked')
          setStyle(node, {
            color: colorToRgba(color.value, 1, '#3b63d9'),
            width: completeSize(size.value),
          })
        } else {
          removeClass(node, 'docs-utility-marked')
          removeStyle(node, ['color', 'width'])
        }

        result.value = JSON.stringify(
          {
            hasClass: hasClass(node, 'docs-utility-marked').value,
            matched: queryElements('attr:data-docs-utility')?.length,
            style: node.getAttribute('style'),
            prefixes: autoPrefixStyle('transform'),
          },
          null,
          2,
        )
      })
      actionScope.stop()
    }

    const start = () => {
      if (running.value) return

      scope = effectScope()
      cleaned.value = false
      running.value = true
      scope.run(() => {
        watchEffectWithTarget(() => {
          observed.value = count.value
        })
        effectDispose(() => {
          cleaned.value = true
          running.value = false
        })
      })
    }
    const stop = () => scope?.stop()

    onScopeDispose(stop)

    const convert = async () => {
      try {
        const bytes = Uint8Array.from(atob(png), (char) => char.charCodeAt(0))

        dataUrl.value = arrayBufferToBase64Image(bytes.buffer)
        const data = await fileToBase64(
          new File([bytes], 'ray-example.png', { type: 'image/png' }),
        )

        fileResult.value =
          data === dataUrl.value ? text('browser.matchingDataUrl') : data
      } catch (error) {
        fileResult.value = String(error)
      }
    }

    return () => (
      <DemoPage
        title={text('browser.title')}
        description={text('browser.intro')}
      >
        <div class="r-demo-grid">
          <NCard title={text('browser.dom')}>
            <NFlex>
              <NInput
                v-model:value={color.value}
                aria-label={text('browser.color')}
              />
              <NInput
                v-model:value={size.value}
                aria-label={text('browser.width')}
              />
              <NButton onClick={() => change(true)}>
                {text('browser.apply')}
              </NButton>
              <NButton onClick={() => change(false)}>
                {text('browser.remove')}
              </NButton>
            </NFlex>
            <p ref={target} data-docs-utility="">
              {text('browser.target')}
            </p>
            <DemoResult label={text('browser.domResult')}>
              <pre>{result.value}</pre>
            </DemoResult>
            <NFlex>
              <NButton onClick={() => scrollSidebar(0, 0)}>
                {text('browser.sidebarTop')}
              </NButton>
              <NButton onClick={positionSelectedMenuItem}>
                {text('browser.locateMenu')}
              </NButton>
            </NFlex>
          </NCard>
          <NCard title={text('browser.vue')}>
            <NFlex align="center">
              <NSwitch
                v-model:value={zero.value}
                aria-label={text('browser.renderZero')}
              />
              <span>
                {renderNode(zero.value ? 0 : null, {
                  defaultElement: text('browser.fallback'),
                })()}
              </span>
              <NButton
                onClick={() => {
                  log.value = []
                  call(
                    [
                      (n: number) => log.value.push(`A:${n}`),
                      (n: number) => log.value.push(`B:${n}`),
                    ],
                    count.value,
                  )
                }}
              >
                {text('browser.callBoth')}
              </NButton>
            </NFlex>
            <NFlex>
              <NButton disabled={running.value} onClick={start}>
                {text('browser.start')}
              </NButton>
              <NButton onClick={() => count.value++}>
                {text('browser.increment')}
              </NButton>
              <NButton disabled={!running.value} onClick={stop}>
                {text('browser.stop')}
              </NButton>
            </NFlex>
            <DemoResult label={text('browser.vueResult')}>
              <code>
                {JSON.stringify({
                  count: count.value,
                  observed: observed.value,
                  cleaned: cleaned.value,
                  calls: log.value,
                })}
              </code>
            </DemoResult>
          </NCard>
          <NCard title={text('browser.files')}>
            <NFlex>
              <NButton onClick={convert}>{text('browser.convert')}</NButton>
              <NButton
                disabled={!dataUrl.value}
                onClick={() =>
                  downloadBase64File(dataUrl.value, 'ray-example.png')
                }
              >
                {text('browser.downloadPng')}
              </NButton>
              <NButton
                onClick={() =>
                  downloadAnyFile(
                    new Blob(['Ray Template\n'], { type: 'text/plain' }),
                    'ray-example.txt',
                  )
                }
              >
                {text('browser.downloadBlob')}
              </NButton>
              <NButton
                onClick={async () => {
                  fileResult.value = String(await printDom(target))
                }}
              >
                {text('browser.print')}
              </NButton>
            </NFlex>
            <DemoResult label={text('browser.fileResult')}>
              {fileResult.value}
            </DemoResult>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
