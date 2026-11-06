import type { DownloadAnyFileDataType } from '../types'

/**
 *
 * @param data PNG 图像的原始字节
 *
 * @returns PNG Data URL。
 */
export const arrayBufferToBase64Image = (data: ArrayBuffer) => {
  const bytes = new Uint8Array(data)

  // 原生编码避免中间二进制字符串；旧浏览器继续使用分块回退。
  if (typeof bytes.toBase64 === 'function') {
    return 'data:image/png;base64,' + bytes.toBase64()
  }

  const chunks: string[] = []

  // 分块限制函数参数个数，也避免为每个字节分配一个字符串数组项。
  for (let offset = 0; offset < bytes.length; offset += 0x8000) {
    chunks.push(String.fromCharCode(...bytes.subarray(offset, offset + 0x8000)))
  }

  return 'data:image/png;base64,' + btoa(chunks.join(''))
}

/**
 *
 * @param base64 待下载的 Data URL
 * @param fileName 建议文件名
 *
 * @description
 * 触发浏览器下载并清理临时链接。
 */
export const downloadBase64File = (base64: string, fileName: string) => {
  const link = document.createElement('a')

  link.href = base64
  link.download = fileName
  link.hidden = true

  document.body.appendChild(link)

  try {
    link.click()
  } finally {
    link.remove()
  }
}

/**
 *
 * @param data Data URL、Blob、File 或 ArrayBuffer
 * @param fileName 建议文件名
 *
 * @description
 * 发起浏览器下载请求，不等待磁盘写入。为二进制内容创建临时对象 URL，
 * 并延迟释放，以便浏览器开始读取。
 *
 * @throws 数据类型不支持或下载链接无法触发时拒绝。
 */
export const downloadAnyFile = async (
  data: DownloadAnyFileDataType,
  fileName: string,
): Promise<void> => {
  if (typeof data === 'string') {
    downloadBase64File(data, fileName)

    return
  }

  const blob =
    data instanceof ArrayBuffer
      ? new Blob([data], { type: 'application/octet-stream' })
      : data

  if (!(blob instanceof Blob)) {
    throw new TypeError('[downloadAnyFile]: Unsupported data type.')
  }

  const url = URL.createObjectURL(blob)

  try {
    downloadBase64File(url, fileName)
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }

  // 锚点下载不会触发 load；留出时间给浏览器接管对象 URL。
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 *
 * @param file 待读取的文件
 *
 * @returns 包含 MIME 类型的 Data URL。
 *
 * @throws 文件读取失败或中止时拒绝。
 */
export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.onabort = () =>
      reject(new DOMException('File read aborted', 'AbortError'))
    reader.readAsDataURL(file)
  })
