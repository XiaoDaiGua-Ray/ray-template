/* eslint-disable @typescript-eslint/no-explicit-any */
import { set } from 'lodash-es'

import type { Recordable } from '@/types/type-utils'

export const mergeMessage = (langs: Record<string, any>, prefix = 'lang') => {
  const langsGather: Recordable = {}

  Object.keys(langs).forEach((key) => {
    const langFileModule = langs[key].default

    let fileName = key.replace(`./${prefix}/`, '').replace(/^\.\//, '')
    const lastIndex = fileName.lastIndexOf('.')

    fileName = fileName.substring(0, lastIndex)

    const keyList = fileName.split('/')
    const moduleName = keyList.shift()
    const objKey = keyList.join('.')

    if (moduleName) {
      if (objKey) {
        set(langsGather, moduleName, langsGather[moduleName] || {})
        set(langsGather[moduleName], objKey, langFileModule)
      } else {
        set(langsGather, moduleName, langFileModule || {})
      }
    }
  })

  return langsGather
}
