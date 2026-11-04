import { toBlob, toPng } from 'html-to-image'
import { useDomToImage } from '../../apps/admin/src/hooks/web/useDomToImage'

vi.mock('html-to-image', () => ({
  toSvg: vi.fn(),
  toPng: vi.fn(),
  toJpeg: vi.fn(),
  toBlob: vi.fn(),
  toPixelData: vi.fn(),
  toCanvas: vi.fn(),
}))

describe('useDomToImage', () => {
  afterEach(() => vi.clearAllMocks())

  it('infers the configured format and supports typed per-call overrides', async () => {
    vi.mocked(toPng).mockResolvedValue('data:image/png;base64,test')
    const blob = new Blob(['test'])

    vi.mocked(toBlob).mockResolvedValue(blob)
    const created = vi.fn()
    const element = document.createElement('div')
    const { create } = useDomToImage(element, {
      imageType: 'png',
      created,
    })
    const png = await create()
    const result = await create('blob')

    expectTypeOf(png).toEqualTypeOf<string>()
    expectTypeOf(result).toEqualTypeOf<Blob | null>()
    expect(png).toBe('data:image/png;base64,test')
    expect(result).toBe(blob)
    expect(created).toHaveBeenLastCalledWith(blob, element)
  })

  it('rejects with an Error and runs cleanup when the target is missing', async () => {
    const failed = vi.fn()
    const finished = vi.fn()
    const { create } = useDomToImage(null, {
      createdError: failed,
      finally: finished,
    })

    await expect(create()).rejects.toThrow('target element is undefined')
    expect(failed).toHaveBeenCalledWith(expect.any(Error))
    expect(finished).toHaveBeenCalledTimes(1)
    expect(toPng).not.toHaveBeenCalled()
  })

  it('propagates renderer failures and completes cleanup before settling', async () => {
    const error = new Error('capture failed')
    const finished = vi.fn()
    const failed = vi.fn()

    vi.mocked(toPng).mockRejectedValue(error)
    const created = vi.fn()
    const element = document.createElement('div')
    const { create } = useDomToImage(element, {
      imageType: 'png',
      created,
      createdError: failed,
      finally: finished,
    })

    await expect(create()).rejects.toThrow('capture failed')
    expect(failed).toHaveBeenCalledWith(error)
    expect(finished).toHaveBeenCalledTimes(1)
  })
})

it('notifies errors and cleanup even if the target getter throws', async () => {
  const createdError = vi.fn()
  const done = vi.fn()
  const { create } = useDomToImage(
    () => {
      throw 'getter failed'
    },
    {
      createdError,
      finally: done,
    },
  )

  await expect(create()).rejects.toThrow('getter failed')
  expect(createdError).toHaveBeenCalledWith(expect.any(Error))
  expect(done).toHaveBeenCalledExactlyOnceWith(void 0)
})
