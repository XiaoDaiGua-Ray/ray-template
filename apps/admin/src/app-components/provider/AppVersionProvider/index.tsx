import { APP_CATCH_KEY } from '@/app-config'
import { RModal } from '@/components'
import { useI18n } from '@/hooks'
import { useSigningActions } from '@/store'
import { getStorage, setStorage } from '@/utils'

export default defineComponent({
  name: 'AppVersionProvider',
  setup() {
    const { t } = useI18n('appComponents.version')
    const {
      pkg: { version },
    } = __APP_CFG__
    const cacheVersion = getStorage<string>(
      APP_CATCH_KEY.appVersionProvider,
      'localStorage',
    )
    const modalShow = ref(false)
    const { logout } = useSigningActions()

    // 如果获取缓存版本号为 null，则说明是第一次访问，直接缓存版本号
    if (cacheVersion !== null) {
      if (version !== cacheVersion) {
        modalShow.value = true

        setStorage(APP_CATCH_KEY.appVersionProvider, version, 'localStorage')
      }
    } else {
      setStorage(APP_CATCH_KEY.appVersionProvider, version, 'localStorage')
    }

    return {
      modalShow,
      logout,
      t,
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
          title={this.t('title')}
          content={this.t('description')}
          zIndex={999999999}
          draggable
          positiveText={this.t('confirm')}
          negativeText={this.t('cancel')}
          onPositiveClick={logout}
          onNegativeClick={() => {
            this.modalShow = false
          }}
        />
      </div>
    )
  },
})
