import { printDom as print } from '@ray-template/composables/dom'
import type { PrintDomOptions } from '@ray-template/composables/dom'
import type { BasicTarget } from '@ray-template/composables/types'

export type { PrintDomOptions }
export const printDom = <T extends HTMLElement>(
  target: BasicTarget<T>,
  options?: PrintDomOptions<T>,
) => print(target, { ...options, loading: window.$loadingBar })
