import { defineResolve } from 'vite-plugin-cdn2/resolve'

/**
 *
 * @description
 * 自定义 vite-plugin-cdn2 resolve 方法。
 * 默认按 npm 精确版本从 jsDelivr 加载发布包中的文件。
 *
 * @see https://www.jsdelivr.com/
 */
export const cdnResolve = (
  cdnBaseURL: string = 'https://cdn.jsdelivr.net/npm/',
) =>
  defineResolve({
    name: 'RayTemplateCdnResolve',
    setup({ extra }) {
      const { version, name, relativeModule } = extra
      const url = new URL(`${name}@${version}/${relativeModule}`, cdnBaseURL)

      return {
        url: url.href,
        injectTo: 'head-prepend',
        attrs: {
          defer: true,
          crossorigin: 'anonymous',
        },
      }
    },
  })
