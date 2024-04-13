import { validAppRootPath } from './valid/valid-app-root-path'
import { validLocal } from './valid/valid-local'

/**
 *
 * @description
 * 该方法用于初始化 ray-template 配置。
 */
export const setupRayTemplateCore = async () => {
  if (!__DEV__) {
    return
  }

  await validAppRootPath()
  await validLocal()
}
