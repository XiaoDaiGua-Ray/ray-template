import { downloadAnyFile } from '../../src/utils/basic'

describe('downloadAnyFile', () => {
  const url = 'blob:test'

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(URL, 'createObjectURL').mockReturnValue(url)
    vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('requests a Data URL download without allocating an object URL', async () => {
    const data = 'data:text/plain;base64,dGVzdA=='
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(function (this: HTMLAnchorElement) {
        expect(this.href).toBe(data)
        expect(this.download).toBe('test.txt')
        expect(this.isConnected).toBe(true)
      })

    await downloadAnyFile(data, 'test.txt')
    expect(click).toHaveBeenCalledOnce()
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    expect(document.querySelector('a[download]')).toBeNull()
  })

  it.each([
    new Blob(['test'], { type: 'text/plain' }),
    new File(['test'], 'source.txt'),
    new Uint8Array([1, 2, 3, 4]).buffer,
  ])(
    'releases temporary resources after requesting a binary download',
    async (data) => {
      const click = vi
        .spyOn(HTMLAnchorElement.prototype, 'click')
        .mockImplementation(function (this: HTMLAnchorElement) {
          expect(this.href).toBe(url)
          expect(this.download).toBe('copy.txt')
        })

      await downloadAnyFile(data, 'copy.txt')
      const [blob] = vi.mocked(URL.createObjectURL).mock.calls[0]

      expect(click).toHaveBeenCalledOnce()
      expect(blob).toBeInstanceOf(Blob)

      if (data instanceof ArrayBuffer && blob instanceof Blob) {
        expect(new Uint8Array(await blob.arrayBuffer())).toEqual(
          new Uint8Array(data),
        )
      } else {
        expect(blob).toBe(data)
      }

      expect(document.querySelector('a[download]')).toBeNull()
      expect(URL.revokeObjectURL).not.toHaveBeenCalled()
      vi.runAllTimers()
      expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith(url)
    },
  )

  it('rejects invalid input and cleans up the object URL immediately on a click error', async () => {
    await expect(downloadAnyFile(42 as never, 'invalid')).rejects.toThrow(
      TypeError,
    )
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {
      throw new Error('click failed')
    })
    await expect(downloadAnyFile(new Blob(), 'failed')).rejects.toThrow(
      'click failed',
    )
    expect(URL.revokeObjectURL).toHaveBeenCalledExactlyOnceWith(url)
    expect(document.querySelector('a[download]')).toBeNull()
  })
})
