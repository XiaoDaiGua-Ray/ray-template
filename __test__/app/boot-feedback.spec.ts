import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { runInNewContext } from 'node:vm'

const html = readFileSync(
  resolve(process.cwd(), 'apps/admin/index.html'),
  'utf8',
)
const source = new DOMParser()
  .parseFromString(html, 'text/html')
  .querySelector('script:not([type])')!.textContent!

describe('pre-bundle startup failure feedback', () => {
  let splash: HTMLElement
  let listener: EventListener

  beforeEach(() => {
    splash = document.createElement('div')
    splash.id = 'pre-loading-animation'
    document.body.append(splash)
    const subscribe = vi.spyOn(window, 'addEventListener')

    runInNewContext(source, {
      window,
      document,
      localStorage,
      HTMLScriptElement,
      ErrorEvent,
    })
    listener = subscribe.mock.calls.find(
      ([type]) => type === 'error',
    )![1] as EventListener
    subscribe.mockRestore()
  })

  afterEach(() => {
    window.removeEventListener('error', listener, true)
    splash.remove()
    vi.restoreAllMocks()
  })

  it('captures a non-bubbling entry/module-graph load error', () => {
    const script = document.createElement('script')

    script.type = 'module'
    document.body.append(script)
    script.dispatchEvent(new Event('error'))
    expect(splash.dataset.state).toBe('failed')
    script.remove()
  })

  it('handles parse, link, or evaluation errors reported on the window', () => {
    window.dispatchEvent(
      new ErrorEvent('error', {
        message: 'The requested module does not provide an export',
        error: new SyntaxError('Missing export'),
      }),
    )
    expect(splash.dataset.state).toBe('failed')
  })

  it('does not mistake a decorative image failure for a startup failure', () => {
    const image = document.createElement('img')

    document.body.append(image)
    image.dispatchEvent(new Event('error'))
    expect(splash.dataset.state).toBeUndefined()
    image.remove()
  })

  it('stops observing after the mounted application has removed the splash', () => {
    const unsubscribe = vi.spyOn(window, 'removeEventListener')

    splash.remove()
    window.dispatchEvent(new ErrorEvent('error'))
    expect(unsubscribe).toHaveBeenCalledWith('error', listener, true)
    expect(document.getElementById('pre-loading-animation')).toBeNull()
  })
})
