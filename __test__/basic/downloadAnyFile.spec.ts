import { downloadAnyFile } from '../../src/utils/basic'

describe('downloadAnyFile', () => {
  it('should download data when data is a string', () => {
    const data = 'test data'
    const fileName = 'test.txt'

    expect(downloadAnyFile(data, fileName)).resolves.toBeUndefined()
  })

  // it('should download data when data is a ArrayBuffer', () => {
  //   const data = new ArrayBuffer(8)
  //   const fileName = 'test.txt'

  //   expect(downloadAnyFile(data, fileName)).resolves.toBeUndefined()
  // })

  // it('should download data when data is a Blob', () => {
  //   const data = new Blob(['hello', 'world'], {
  //     type: 'text/plain',
  //   })
  //   const fileName = 'test.txt'

  //   expect(downloadAnyFile(data, fileName)).resolves.toBeUndefined()
  // })

  // it('should download data when data is a File', () => {
  //   const data = new File(['hello', 'world'], 'test.txt')
  //   const fileName = 'test.txt'

  //   expect(downloadAnyFile(data, fileName)).resolves.toBeUndefined()
  // })
})
