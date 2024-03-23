/**
 *
 * @description
 * 判断是否可以操作 DOM。
 *
 * 如果可以操作 DOM，则返回 true，否则返回 false。
 */
const canUseDom = () => {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  )
}
export default canUseDom
