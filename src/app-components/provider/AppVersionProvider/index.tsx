/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-01-01
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 检测当前版本是否为最新版本
 * 如果不是最新版本则弹出提示框，提示用户更新，点击确认后退出登录并且刷新资源
 */

import { RModal } from '@/components'

import { getStorage, setStorage } from '@/utils'
import { useSigningActions } from '@/store'

export default defineComponent({
  name: 'AppVersionProvider',
  setup() {
    const storageKey = 'appVersionProvider'
    const {
      pkg: { version },
    } = __APP_CFG__
    const cacheVersion = getStorage<string>(storageKey, 'localStorage')
    const modalShow = ref(false)
    const { logout } = useSigningActions()

    // 如果获取缓存版本号为 null，则说明是第一次访问，直接缓存版本号
    if (cacheVersion !== null) {
      if (version !== cacheVersion) {
        modalShow.value = true

        setStorage<string>(storageKey, version, 'localStorage')
      }
    }

    return {
      modalShow,
      logout,
    }
  },
  render() {
    const { logout } = this

    return (
      <div class="app-style-provider">
        <RModal
          v-model:show={this.modalShow}
          closeOnEsc={false}
          maskClosable={false}
          preset="dialog"
          closable={false}
          title="发现新版本"
          content="当前版本已更新，点击确认加载新版本~"
          zIndex={999999999}
          dad
          positiveText="确认"
          negativeText="取消"
          onPositiveClick={logout}
          onNegativeClick={() => {
            this.modalShow = false
          }}
        />
      </div>
    )
  },
})
