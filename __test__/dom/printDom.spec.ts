import { toJpeg } from 'html-to-image'
import print from 'print-js'
import { printDom } from '../../apps/admin/src/utils/dom'

vi.mock('html-to-image', () => ({
  toSvg: vi.fn(),
  toPng: vi.fn(),
  toJpeg: vi.fn(),
  toBlob: vi.fn(),
  toPixelData: vi.fn(),
  toCanvas: vi.fn(),
}))
vi.mock('print-js', () => ({ default: vi.fn() }))

describe('printDom', () => {
  const loading = { start: vi.fn(), finish: vi.fn(), error: vi.fn() }

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubGlobal('$loadingBar', loading)
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('prints the captured JPEG and prevents runtime overrides of printable and type', async () => {
    const element = document.createElement('div')
    const jpeg = 'data:image/jpeg;base64,test'
    const created = vi.fn()

    vi.mocked(toJpeg).mockResolvedValue(jpeg)

    await expect(
      printDom(element, {
        printOptions: {
          documentTitle: 'Report',
          type: 'pdf',
          printable: 'other',
        } as never,
        domToImageOptions: { created, quality: 0.8 },
      }),
    ).resolves.toBe(true)

    expect(toJpeg).toHaveBeenCalledExactlyOnceWith(element, { quality: 0.8 })
    expect(created).toHaveBeenCalledExactlyOnceWith(jpeg, element)
    expect(print).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        documentTitle: 'Report',
        type: 'image',
        printable: jpeg,
        base64: true,
      }),
    )
    expect(loading.start).toHaveBeenCalledOnce()
    expect(loading.finish).toHaveBeenCalledOnce()
    expect(loading.error).not.toHaveBeenCalled()
  })

  it('reports capture failure and does not print', async () => {
    const error = new Error('cannot capture')
    const createdError = vi.fn()
    const done = vi.fn()

    vi.mocked(toJpeg).mockRejectedValue(error)

    await expect(
      printDom(document.createElement('div'), {
        domToImageOptions: { createdError, finally: done },
      }),
    ).resolves.toBe(false)
    expect(createdError).toHaveBeenCalledWith(error)
    expect(done).toHaveBeenCalledOnce()
    expect(print).not.toHaveBeenCalled()
    expect(loading.error).toHaveBeenCalledOnce()
    expect(loading.finish).not.toHaveBeenCalled()
  })

  it('reports synchronous print failures', async () => {
    vi.mocked(toJpeg).mockResolvedValue('data:image/jpeg;base64,test')
    vi.mocked(print).mockImplementation(() => {
      throw new Error('print refused')
    })

    await expect(printDom(document.createElement('div'))).resolves.toBe(false)
    expect(loading.error).toHaveBeenCalledOnce()
    expect(loading.finish).not.toHaveBeenCalled()
  })
})
