import { useDomToImage } from '@/hooks/web/useDomToImage'
import type { UseDomToImageOptions } from '@/hooks/web/useDomToImage'
import { usePrint } from '@/hooks/web/usePrint'
import type { UsePrintOptions } from '@/hooks/web/usePrint'
import type { BasicTarget } from '@/types'

export interface PrintDomOptions<T extends HTMLElement = HTMLElement> {
  printOptions?: Omit<UsePrintOptions, 'type' | 'base64'>
  domToImageOptions?: Omit<UseDomToImageOptions<T>, 'imageType'>
}

/**
 *
 * @param target 截图的 DOM 目标，执行时解包
 * @param options 截图与打印配置
 *
 * @description
 * 将目标转成 JPEG 后交给打印预览，并同步全局加载条。
 *
 * @returns 已调用打印预览时返回 true；截图或调用失败时记录错误并返回 false。
 */
export const printDom = async <T extends HTMLElement>(
  target: BasicTarget<T>,
  options?: PrintDomOptions<T>,
) => {
  const loading = window.$loadingBar

  try {
    loading?.start()

    const { create } = useDomToImage(target, options?.domToImageOptions)
    const image = await create('jpeg')

    await usePrint(image, {
      targetStyles: ['*'],
      ...options?.printOptions,
      type: 'image',
      base64: true,
    }).print()

    loading?.finish()

    return true
  } catch (error) {
    loading?.error()
    console.error('[printDom]: Could not open print preview.', error)

    return false
  }
}
