import './index.scss'
import AppShareLink from '@/app-components/app/AppShareLink'
import { LOCAL_OPTIONS } from '@/app-config'
import { RIcon } from '@/components'
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch'
import { useSettingActions } from '@/store'
import { useWindowSize } from '@vueuse/core'
import {
  NCard,
  NDivider,
  NDropdown,
  NFlex,
  NGradientText,
  NTabPane,
  NTabs,
} from 'naive-ui'
import QRCodeSigning from './components/QRCodeSigning'
import Register from './components/Register'
import Signing from './components/Signing'
import SSOSigning from './components/SSOSigning'

const Login = defineComponent({
  name: 'RLogin',
  setup() {
    const {
      layout: { copyright },
    } = __APP_CFG__

    const state = reactive({
      tabsValue: 'signing',
    })

    const { height: windowHeight, width: windowWidth } = useWindowSize()
    const { updateLocale } = useSettingActions()

    return {
      ...toRefs(state),
      windowHeight,
      updateLocale,
      copyright,
      windowWidth,
    }
  },
  render() {
    const { $t } = this

    return (
      <main
        class={['login']}
        style={[
          `height: ${this.windowHeight}px`,
          `--login-height: ${this.windowHeight}px`,
        ]}
      >
        <div
          class={[
            'login-wrapper',
            this.windowWidth >= 1440 ? 'login-wrapper--divider' : '',
          ]}
        >
          <div class={['login-wrapper__content']}>
            <NFlex align="center" class="login-title__wrapper">
              <RIcon name="logo/ray" size="48" />
              <h1 class="login-heading">
                <NGradientText class="login-title" type="info" size={28}>
                  Ray Template
                </NGradientText>
              </h1>
            </NFlex>
            <NFlex align="center" class="login-action__wrapper">
              <ThemeSwitch />
              <NDropdown
                options={LOCAL_OPTIONS}
                onSelect={(key) => this.updateLocale(key)}
                trigger="click"
              >
                <RIcon
                  customClassName="login-icon"
                  name="system/language"
                  size="18"
                  cursor="pointer"
                />
              </NDropdown>
            </NFlex>
            <div class="login-grid">
              <div class="login__left-wrapper">
                <NFlex align="center" vertical>
                  <RIcon
                    name="illustration/login_bg"
                    width="368"
                    height="368"
                  />
                  <NGradientText class="login-title" type="info" size={36}>
                    {$t('views.login.index.RayTemplate')}
                  </NGradientText>
                </NFlex>
              </div>
              <div class="login__right-wrapper">
                <NCard
                  class="login__right-wrapper__content"
                  embedded
                  bordered={false}
                >
                  <p class="login-template-description">
                    {$t('views.login.index.TemplateDescription')}
                  </p>
                  <NTabs
                    v-model:value={this.tabsValue}
                    type="line"
                    animated
                    size="large"
                  >
                    {{
                      default: () => (
                        <>
                          <NTabPane
                            tab={$t('views.login.index.Signing')}
                            name="signing"
                          >
                            <Signing />
                          </NTabPane>
                          <NTabPane
                            tab={$t('views.login.index.Register')}
                            name="register"
                          >
                            <Register />
                          </NTabPane>
                          <NTabPane
                            tab={$t('views.login.index.QRCodeSigning')}
                            name="qrcodeSigning"
                          >
                            <QRCodeSigning />
                          </NTabPane>
                        </>
                      ),
                    }}
                  </NTabs>
                  <NDivider>
                    {$t('views.login.index.OtherSignInOptions')}
                  </NDivider>
                  <SSOSigning />
                  <NDivider>{$t('views.login.index.Resources')}</NDivider>
                  <AppShareLink />
                </NCard>
              </div>
            </div>
            <NFlex
              align="center"
              justify="center"
              class="login-copyright__wrapper"
            >
              {this.copyright}
            </NFlex>
          </div>
        </div>
      </main>
    )
  },
})

export default Login
