import { defineResolve } from 'vite-plugin-cdn2/resolve'

/**
 *
 * @description
 * 自定义 vite-plugin-cdn2 resolve 方法。
 * 默认使用 cdnjs 作为 cdn 服务商。
 *
 * @see https://cdnjs.cloudflare.com/ajax/libs/
 */
export const cdnResolve = (
  cdnBaseURL: string = 'https://cdnjs.cloudflare.com/ajax/libs/',
) =>
  defineResolve({
    name: 'RayTemplateCdnResolve',
    setup({ extra }) {
      const { version, name, relativeModule } = extra
      const url = new URL(`${name}/${version}/${relativeModule}`, cdnBaseURL)

      return {
        url: url.href,
        injectTo: 'head-prepend',
        attrs: {},
      }
    },
  })
