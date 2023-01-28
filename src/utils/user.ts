import { removeCache } from '@/utils/cache'

/**
 *
 * @remark 退出登陆并且清除所有非 localStorage 里所有缓存数据
 */
export const logout = () => {
  window.$message.info('账号退出中...')

  removeCache('all-sessionStorage')

  setTimeout(() => window.location.reload(), 300)
}
