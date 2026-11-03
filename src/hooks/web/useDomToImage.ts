import type { BasicTarget, TargetType } from '@/types'
import { unrefElement } from '@/utils/vue/unref-element'
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
  /** 默认输出格式，可由 create 覆盖，缺省为 JPEG。 */
  imageType?: ImageType
  /** 渲染前调用；目标未挂载时可能为空。 */
  beforeCreate?: (element: T | null | undefined) => void
  /** 渲染成功后的回调；结果类型随本次格式变化。 */
  created?: (
    result: DomToImageReturnType<DomToImageMethodKeys>,
    element: T,
  ) => void
  /** 渲染、目标解析或前置回调抛错时通知。 */
  createdError?: (error?: Error) => void
  /** 一次创建结束时执行；目标解析失败时参数为空。 */
  finally?: (element: T | null | undefined) => void
}

export type UseDomToImageOptions<
  T extends TargetType = Element,
  ImageType extends DomToImageMethodKeys = 'jpeg',
> = Options<T, ImageType> & HtmlToImageOptions

/**
 *
 * @param target 截图目标，执行时解包
 * @param options 默认格式、渲染配置与生命周期回调
 *
 * @description
 * 本次 create 的格式覆盖默认配置，缺省为 JPEG；created 可能收到不同格式的结果。
 *
 * @returns create 方法，其 Promise 结果类型跟随所选格式。
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
    ...imageOptions
  } = options ?? {}

  /**
   *
   * @param imageType 仅覆盖本次创建的输出格式
   *
   * @returns 对应格式的渲染结果。
   *
   * @throws 解析目标或渲染失败时拒绝，并调用错误与清理回调。
   */
  const run = async <OutputType extends DomToImageMethodKeys = ImageType>(
    imageType?: OutputType,
  ): Promise<DomToImageReturnType<OutputType>> => {
    let element: T | null | undefined

    try {
      element = unrefElement(target)
      beforeCreate?.(element)

      if (!element)
        throw new Error('[useDomToImage]: target element is undefined.')

      const imageTypeKey = imageType ?? _imageType ?? 'jpeg'
      const result = await domToImageMethods[imageTypeKey](
        element,
        imageOptions,
      )

      // 分发映射的返回类型与传入的 imageType 一一对应。
      created?.(result, element)

      return result as DomToImageReturnType<OutputType>
    } catch (error) {
      const cause = error instanceof Error ? error : new Error(String(error))

      createdError?.(cause)
      throw cause
    } finally {
      _finally?.(element)
    }
  }

  return {
    create: run,
  }
}

export type UseDomToImageReturnType = ReturnType<typeof useDomToImage>
