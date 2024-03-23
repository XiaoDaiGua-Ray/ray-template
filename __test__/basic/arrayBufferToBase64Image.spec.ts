import { arrayBufferToBase64Image } from '../../src/utils/basic'

describe('arrayBufferToBase64Image', () => {
  const arrayBuffer = new ArrayBuffer(8)
  const base64ImagePrefix = 'data:image/png;base64,'

  it('should convert array buffer to base64 image', () => {
    const base64Image = arrayBufferToBase64Image(arrayBuffer)

    expect(base64Image).toBe(`${base64ImagePrefix}AAAAAAAAAAA=`)
  })

  it('should convert array buffer to base64 image with prefix', () => {
    const base64Image = arrayBufferToBase64Image(arrayBuffer)

    expect(base64Image.startsWith(base64ImagePrefix)).toBe(true)
  })
})
