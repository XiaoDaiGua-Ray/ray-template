/* eslint-disable @typescript-eslint/no-explicit-any */
import print from 'print-js'
import { unrefElement } from '@/utils'

import type { BasicTarget } from '@/types/modules/vue'

export interface UsePrintOptions
  extends Omit<print.Configuration, 'printable'> {}

export type UsePrintTarget<T = any> =
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
 * 拓展 print-js 的 usePrint 方法，允许 ref Dom 直接调用打印，其余的不变
 *
 * @example
 * const refDom = ref<HTMLElement>()
 *
 * const { print } = usePrint(refDom, {})
 * @example
 * const { print } = usePrint('#id', {})
 * const { print } = usePrint('base64', {}) // 设置为 base64 时，一定要设置配置项 base64 为 true
 * const { print } = usePrint('https://xxx.com/xxx.png', {})
 * const { print } = usePrint(new Blob(), {})
 */
export const usePrint = (target: UsePrintTarget, options?: UsePrintOptions) => {
  const run = () => {
    const element = unrefElement(target as BasicTarget)

    if (element) {
      print({
        ...options,
        printable: element,
      })
    }
  }

  return {
    print: run,
  }
}

export type UsePrintReturnType = ReturnType<typeof usePrint>
