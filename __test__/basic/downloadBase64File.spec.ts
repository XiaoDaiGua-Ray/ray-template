import { downloadBase64File } from '../../src/utils/basic'

describe('downloadBase64File', () => {
  const base64 =
    'data:image/png;base64,AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAE'

  it('download base64 to file', () => {
    const result = downloadBase64File(base64, 'test.png')

    expect(result).toBe(void 0)
  })
})
