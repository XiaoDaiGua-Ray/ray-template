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

import domToImage from 'dom-to-image'
import { unrefElement } from '@/utils'

import type { Options as ReDomToImageOptions } from 'dom-to-image'
import type { BasicTarget, TargetType } from '@/types/modules/vue'

export type ImageType = keyof typeof domToImageMethods

export interface UseDomToImageOptions extends ReDomToImageOptions {
  /**
   *
   *
   * 指定图片类型，允许传递 imageType 参数，用于指定图片类型
   *
   * @default jpeg
   */
  imageType: ImageType
  /**
   *
   *
   * 在 dom 转换为图片之前执行
   *
   * @param element current dom
   */
  beforeCreate?: <T extends TargetType = Element>(
    element: T | null | undefined,
  ) => void
  /**
   *
   * @param element current dom
   * @param result dom to image result
   *
   * 在 dom 转换为图片之后执行
   */
  created?: <T extends TargetType = Element>(
    element: T,
    result: string | Blob | Uint8ClampedArray | undefined,
  ) => void
  /**
   *
   * @param element current dom
   * @param error dom to image error
   *
   * 在 dom 转换为图片失败时执行
   */
  createdError?: <T extends TargetType = Element>(
    element: T,
    error: Error,
  ) => void
  /**
   *
   * @param element current dom
   *
   * 无论 dom 转换为图片成功或失败，都会执行
   */
  finally?: <T extends TargetType = Element>(element: T) => void
}

const domToImageMethods = {
  svg: domToImage.toSvg,
  png: domToImage.toPng,
  jpeg: domToImage.toJpeg,
  blob: domToImage.toBlob,
  pixelData: domToImage.toPixelData,
}

/**
 *
 * @param target ref dom
 * @param options dom-to-image options
 *
 * 使用 dom-to-image 将 dom 转换为图片，基于 dom-to-image v2.6.0
 * 拓展了 imageType 参数，用于指定图片类型
 *
 * create 方法支持在执行时传递 imageType 参数，用于指定图片类型。并且优先级大于 options.imageType
 * 当然，你也可以不传递 imageType 参数，此时会使用 options.imageType
 * 如果都未传递，则默认使用 jpeg
 *
 * @example
 * const refDom = ref<HTMLElement>()
 * const { create, stop } = useDomToImage(refDom, {
 *   beforeCreate: (element) => { ... },
 *   created: (element, result) => { ... },
 *   createdError: (element, error) => { ... },
 * })
 */
export const useDomToImage = <T extends HTMLElement>(
  target: BasicTarget<T>,
  options?: UseDomToImageOptions,
) => {
  const { beforeCreate, created, createdError } = options ?? {}

  const run = (imageType: UseDomToImageOptions['imageType'] = 'jpeg') => {
    const element = unrefElement(target)

    beforeCreate?.(element)

    if (element) {
      const type = imageType ?? options?.imageType
      const matchFc = domToImageMethods[type] || domToImageMethods['jpeg']

      return matchFc(element, options)
        .then((res) => {
          created?.(element, res)

          return Promise.resolve(res)
        })
        .catch((error) => {
          createdError?.(element, error as Error)

          return Promise.reject(error as Error)
        })
    }
  }

  return {
    create: run,
  }
}

export type UseDomToImageReturnType = ReturnType<typeof useDomToImage>
