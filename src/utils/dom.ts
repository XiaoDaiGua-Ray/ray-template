/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-12-14
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { omit } from './basic'
import { useDomToImage, usePrint } from '@/hooks'

import type { UsePrintOptions, UseDomToImageOptions } from '@/hooks'
import type { BasicTarget } from '@/types'

export interface PrintDomOptions {
  printOptions?: Omit<UsePrintOptions, 'printable' | 'type' | 'base64'>
  domToImageOptions?: Omit<UseDomToImageOptions, 'imageType'>
}

/**
 *
 * @param target ref dom
 * @param options print-dom options, dom-to-image options
 *
 * @description
 * 基于 useDomToImage 和 print-js 封装，允许 Ref 注册 Dom 直接调用打印。
 * 避免直接打印 dom 时出现一些诡异的问题。
 *
 * 该方法会强制剔除 printOptions 中的 printable, type, base64 属性，即使忽略了 ts 的类型检查。
 * 并且在绘制图片的时候，强制使用 jpeg 格式，即使是指定了其他格式。
 *
 * 支持 useDomToImage 方法的所有配置项，除了 imageType。
 * 支持 print-js 的所有配置项，除了 printable 和 type。
 *
 * @example
 * const refDom = ref<HTMLElement>()
 *
 * printDom(refDom, {
 *  printOptions: { title: 'Demo Print', ... },
 *  domToImageOptions: { ... }
 * })
 */
export const printDom = <T extends HTMLElement>(
  target: BasicTarget<T>,
  options?: PrintDomOptions,
) => {
  const { domToImageOptions, printOptions } = options ?? {}

  const { create } = useDomToImage<T>(target, {
    ...domToImageOptions,
    beforeCreate: (element) => {
      domToImageOptions?.beforeCreate?.(element)
      window.$loadingBar?.start()
    },
    created(result, element) {
      domToImageOptions?.created?.(result, element)
      window.$loadingBar?.finish()
    },
    createdError(error) {
      domToImageOptions?.createdError?.(error)
      window.$loadingBar?.error()
    },
  })

  create('jpeg')?.then((res) => {
    const { print } = usePrint(res, {
      type: 'image',
      base64: true,
      targetStyles: ['*'],
      ...omit(printOptions as UsePrintOptions, ['type', 'base64']),
    })

    print()
  })
}
