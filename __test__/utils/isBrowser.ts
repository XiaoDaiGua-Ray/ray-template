/**
 *
 * @description
 * 获取当前环境是否为浏览器环境。
 *
 * 如果是浏览器环境，则返回 true，否则返回 false。
 */
const isBrowser = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
export default isBrowser
