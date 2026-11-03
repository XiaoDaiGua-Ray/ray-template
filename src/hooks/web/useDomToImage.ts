import type { BasicTarget, TargetType } from '@/types'
import { unrefElement } from '@/utils'
import {
  toBlob,
  toCanvas,
  toJpeg,
  toPixelData,
  toPng,
  toSvg,
} from 'html-to-image'

// html-to-image 方法
const domToImageMethods = {
  svg: toSvg,
  png: toPng,
  jpeg: toJpeg,
  blob: toBlob,
  pixelData: toPixelData,
  canvas: toCanvas,
} as const

// 获取 html-to-image Options
type HtmlToImageOptions = Partial<NonNullable<Parameters<typeof toPng>[1]>>

// 获取 html-to-image 方法 keys
type DomToImageMethodKeys = keyof typeof domToImageMethods

// 获取 html-to-image 方法返回值
type DomToImageReturnType<ImageType extends DomToImageMethodKeys> = Awaited<
  ReturnType<(typeof domToImageMethods)[ImageType]>
>

// 自定义拓展 Options
type Options<
  T extends TargetType = Element,
  ImageType extends DomToImageMethodKeys = DomToImageMethodKeys,
> = {
  /**
   *
   * @description
   * 指定图片类型，允许传递 imageType 参数，用于指定图片类型。
   *
   * @default jpeg
   */
  imageType?: ImageType
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
  created?: (
    result: DomToImageReturnType<DomToImageMethodKeys>,
    element: T,
  ) => void
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
  finally?: (element: T | null | undefined) => void
}

export type UseDomToImageOptions<
  T extends TargetType = Element,
  ImageType extends DomToImageMethodKeys = 'jpeg',
> = Options<T, ImageType> & HtmlToImageOptions

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
 * create 的返回类型跟随配置或本次传入的格式；created 可能接收覆盖格式后的结果，
 * 因此应先用 typeof / instanceof 判断回调中的结果类型。
 *
 * @example
 * const refDom = ref<HTMLElement>()
 * const { create } = useDomToImage(refDom, {
 *   beforeCreate: (element) => { ... },
 *   created: (result, element) => { ... },
 *   createdError: (error) => { ... },
 *   finally: () => { ... },
 * })
 */
export const useDomToImage = <
  T extends HTMLElement,
  ImageType extends DomToImageMethodKeys = 'jpeg',
>(
  target: BasicTarget<T>,
  options?: UseDomToImageOptions<T, ImageType>,
) => {
  const {
    beforeCreate,
    created,
    createdError,
    finally: _finally,
    imageType: _imageType,
  } = options ?? {}

  const run = async <OutputType extends DomToImageMethodKeys = ImageType>(
    imageType?: OutputType,
  ): Promise<DomToImageReturnType<OutputType>> => {
    const element = unrefElement(target)

    try {
      beforeCreate?.(element)

      if (!element)
        throw new Error('[useDomToImage]: target element is undefined.')

      const imageTypeKey = imageType ?? _imageType ?? 'jpeg'
      const result = await domToImageMethods[imageTypeKey](element, options)

      // 分发映射的返回类型与传入的 imageType 一一对应。
      created?.(result, element)

      return result as DomToImageReturnType<OutputType>
    } catch (error) {
      createdError?.(error instanceof Error ? error : new Error(String(error)))
      throw error
    } finally {
      _finally?.(element)
    }
  }

  return {
    create: run,
  }
}

export type UseDomToImageReturnType = ReturnType<typeof useDomToImage>
