import print from 'print-js'
import { unrefElement } from '@/utils'

import type { BasicTarget } from '@/types'

export interface UsePrintOptions
  extends Omit<print.Configuration, 'printable'> {}

export type UsePrintTarget<T = unknown> =
  | BasicTarget
  | string
  | Blob
  | Uint8ClampedArray
  | T[]

/**
 *
 * @param target ref dom
 * @param options print-js options
 *
 * @see https://printjs.crabbly.com/
 *
 * @description
 * 拓展 print-js 的 usePrint 方法，允许 ref Dom 直接调用打印，其余的不变。
 *
 * @example
 * const refDom = ref<HTMLElement>()
 *
 * const { print } = usePrint(refDom, {})
 *
 * @example
 * const { print } = usePrint('#id', {})
 * const { print } = usePrint('base64', {}) // 设置为 base64 时，一定要设置配置项 base64 为 true
 * const { print } = usePrint('https://xxx.com/xxx.png', {})
 * const { print } = usePrint(new Blob(), {})
 */
export const usePrint = (target: UsePrintTarget, options?: UsePrintOptions) => {
  const run = () => {
    // 为了兼容 ref 注册的 dom；如果未获取到 dom，则会视为其他的输出方式，交由 print-js 处理
    const _target = unrefElement(target as BasicTarget) || target

    print({
      ...options,
      printable: _target,
    })
  }

  return {
    print: run,
  }
}

export type UsePrintReturnType = ReturnType<typeof usePrint>
