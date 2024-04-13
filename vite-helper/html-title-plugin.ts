/**
 *
 * @param title 浏览器 title 名称
 *
 * @description
 * 注入浏览器标题。
 */
export const htmlTitlePlugin = (title: string) => {
  return {
    name: 'html-transform',
    transformIndexHtml: (html: string) => {
      return html.replace(/<title>(.*?)<\/title>/, `<title>${title}</title>`)
    },
  }
}
