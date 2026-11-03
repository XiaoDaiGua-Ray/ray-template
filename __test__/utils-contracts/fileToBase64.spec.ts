import { fileToBase64 } from '../../src/utils/files'

it('encodes a file with its MIME type and preserves raw byte values', async () => {
  const file = new File([new Uint8Array([0, 128, 255])], 'binary', {
    type: 'application/octet-stream',
  })

  await expect(fileToBase64(file)).resolves.toBe(
    'data:application/octet-stream;base64,AID/',
  )
})

it.each(['error', 'abort'] as const)(
  'rejects when FileReader emits %s',
  async (event) => {
    const error = new DOMException('failed', 'NotReadableError')
    const read = vi
      .spyOn(FileReader.prototype, 'readAsDataURL')
      .mockImplementation(function (this: FileReader) {
        Object.defineProperty(this, 'error', { value: error })
        this.dispatchEvent(new Event(event))
      })

    try {
      const promise = fileToBase64(new File([], 'test'))

      if (event === 'error') await expect(promise).rejects.toBe(error)
      else await expect(promise).rejects.toMatchObject({ name: 'AbortError' })
    } finally {
      read.mockRestore()
    }
  },
)
