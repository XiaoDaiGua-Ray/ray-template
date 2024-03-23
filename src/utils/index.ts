// export * from './basic'
// export * from './cache'
// export * from './dom'
// export * from './element'
// export * from './precision'
// export * from './vue'
// export * from './app'

import {
  getAppEnvironment,
  arrayBufferToBase64Image,
  downloadBase64File,
  isValueType,
  uuid,
  downloadAnyFile,
  omit,
  pick,
  isAsyncFunction,
  isPromise,
  callWithErrorHandling,
  callWithAsyncErrorHandling,
  detectOperatingSystem,
  equalRouterPath,
} from './basic'
import { hasStorage, getStorage, setStorage, removeStorage } from './cache'
import { printDom } from './dom'
import {
  setClass,
  removeClass,
  hasClass,
  autoPrefixStyle,
  setStyle,
  removeStyle,
  colorToRgba,
  queryElements,
  completeSize,
} from './element'
import {
  isCurrency,
  format,
  add,
  subtract,
  multiply,
  divide,
  distribute,
} from './precision'
import {
  call,
  unrefElement,
  renderNode,
  effectDispose,
  watchEffectWithTarget,
} from './vue'
import { prefixCacheKey } from './app'

export {
  getAppEnvironment,
  arrayBufferToBase64Image,
  downloadBase64File,
  isValueType,
  uuid,
  downloadAnyFile,
  omit,
  pick,
  isAsyncFunction,
  isPromise,
  callWithErrorHandling,
  callWithAsyncErrorHandling,
  detectOperatingSystem,
  equalRouterPath,
  hasStorage,
  getStorage,
  setStorage,
  removeStorage,
  printDom,
  setClass,
  removeClass,
  hasClass,
  autoPrefixStyle,
  setStyle,
  removeStyle,
  colorToRgba,
  queryElements,
  completeSize,
  isCurrency,
  format,
  add,
  subtract,
  multiply,
  divide,
  distribute,
  call,
  unrefElement,
  renderNode,
  effectDispose,
  watchEffectWithTarget,
  prefixCacheKey,
}
