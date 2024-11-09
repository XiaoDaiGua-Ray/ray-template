import { unrefElement } from '@/utils'
import {
  toPng,
  toJpeg,
  toBlob,
  toPixelData,
  toSvg,
  toCanvas,
} from 'html-to-image'

import type { BasicTarget, TargetType } from '@/types'

type HtmlToImageOptions = Partial<NonNullable<Parameters<typeof toPng>[1]>>

interface Options<
  T extends TargetType = Element,
  ImageType extends DomToImageMethodKeys = 'jpeg',
> {
  /**
   *
   * @description
   * 指定图片类型，允许传递 imageType 参数，用于指定图片类型。
   *
   * @default jpeg
   */
  imageType?: DomToImageReturnType<ImageType>
  /**
   *
   * @param element current dom
   *
   * @description
   * 在 dom 转换为图片之前执行。
   *
   * @default undefined
   */
  beforeCreate?: (element: T | null | undefined) => void
  /**
   *
   * @param element current dom
   * @param result dom to image result
   *
   * @description
   * 在 dom 转换为图片之后执行。
   *
   * @default undefined
   */
  created?: (result: DomToImageReturnType<ImageType>, element: T) => void
  /**
   *
   * @param error dom to image error
   *
   * 在 dom 转换为图片失败时执行
   *
   * @default undefined
   */
  createdError?: (error?: Error) => void
  /**
   *
   * @param element current dom
   *
   * @description
   * 无论 dom 转换为图片成功或失败，都会执行。
   *
   * @default undefined
   */
  finally?: (element: T) => void
}

export type UseDomToImageOptions<T extends TargetType = Element> = Options<T> &
  HtmlToImageOptions

export type DomToImageMethodKeys = keyof typeof domToImageMethods

type DomToImageReturnType<ImageType extends DomToImageMethodKeys = 'jpeg'> =
  Awaited<ReturnType<(typeof domToImageMethods)[ImageType]>>

const domToImageMethods = {
  svg: toSvg,
  png: toPng,
  jpeg: toJpeg,
  blob: toBlob,
  pixelData: toPixelData,
  canvas: toCanvas,
} as const

/**
 *
 * @param target ref dom
 * @param options html-to-image options
 *
 * @see https://github.com/bubkoo/html-to-image
 *
 * @description
 * 使用 html-to-image 将 dom 转换为图片。
 * 拓展了 imageType 参数，用于指定图片类型。
 *
 * create 方法支持在执行时传递 imageType 参数，用于指定图片类型。并且优先级大于 options.imageType；
 * 当然，你也可以不传递 imageType 参数，此时会使用 options.imageType，
 * 如果都未传递，则默认使用 jpeg。
 *
 * @example
 * const refDom = ref<HTMLElement>()
 * const { create, stop } = useDomToImage(refDom, {
 *   beforeCreate: (element) => { ... },
 *   created: (element, result) => { ... },
 *   createdError: (error) => { ... },
 *   finally: () => { ... },
 * })
 */
export const useDomToImage = <T extends HTMLElement>(
  target: BasicTarget<T>,
  options?: UseDomToImageOptions,
) => {
  const {
    beforeCreate,
    created,
    createdError,
    finally: _finally,
    imageType: _imageType,
  } = options ?? {}

  const run = <ImageType extends DomToImageMethodKeys = 'jpeg'>(
    imageType?: ImageType,
  ): Promise<DomToImageReturnType<ImageType>> => {
    return new Promise((resolve, reject) => {
      const element = unrefElement(target)

      beforeCreate?.(element)

      if (!element) {
        createdError?.()

        return reject('useDomToImage: element is undefined.')
      }

      const imageTypeKey = (imageType ??
        _imageType ??
        'jpeg') as keyof typeof domToImageMethods

      domToImageMethods[imageTypeKey]?.(element, options)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          created?.(res, element)

          return resolve(res)
        })
        .catch((error: Error) => {
          createdError?.(error)

          return reject(error)
        })
        .finally(() => {
          _finally?.(element)
        })
    })
  }

  return {
    create: run,
  }
}

export type UseDomToImageReturnType = ReturnType<typeof useDomToImage>
