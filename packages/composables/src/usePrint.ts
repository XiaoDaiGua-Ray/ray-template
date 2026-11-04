import { fileToBase64 } from '@ray-template/utils/files'
import print from 'print-js'
import type { BasicTarget } from './types'
import { unrefElement } from './vue/unref-element'

export type UsePrintOptions = Omit<print.Configuration, 'printable'>

export type UsePrintTarget<T = unknown> =
  BasicTarget | string | Blob | Uint8ClampedArray | T[]

/**
 *
 * @param target DOM、元素引用或可打印的数据
 * @param options print-js 配置；DOM 默认使用 html 模式
 *
 * @returns print 方法；无目标时跳过，二进制内容需先读取。
 */
export const usePrint = (target: UsePrintTarget, options?: UsePrintOptions) => {
  /**
   *
   * @description
   * 以执行时的目标打开打印预览，始终使用当前目标作为 printable。
   *
   * @returns 二进制内容返回读取并提交打印的 Promise；其余在当前调用中提交。
   *
   * @throws 读取失败或 print-js 不能打开预览时传递原始错误。
   */
  const run = () => {
    const printable = unrefElement(target as BasicTarget) as UsePrintTarget

    if (printable == null || printable === '') return

    if (printable instanceof Blob || printable instanceof Uint8ClampedArray) {
      const type =
        options?.type ??
        (printable instanceof Blob && printable.type.startsWith('image/')
          ? 'image'
          : 'pdf')
      const file =
        printable instanceof Blob
          ? new File([printable], '', { type: printable.type })
          : new File([Uint8Array.from(printable)], '', {
              type: 'application/pdf',
            })

      return fileToBase64(file).then((url) => {
        print({
          ...options,
          type,
          base64: type === 'pdf',
          printable: type === 'pdf' ? url.slice(url.indexOf(',') + 1) : url,
        })
      })
    }

    print({
      ...options,
      type: options?.type ?? (printable instanceof Element ? 'html' : 'pdf'),
      printable,
    })
  }

  return { print: run }
}

export type UsePrintReturnType = ReturnType<typeof usePrint>
