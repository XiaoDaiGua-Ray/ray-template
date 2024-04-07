import './index.scss'

import {
  NFlex,
  NCard,
  NTabs,
  NTabPane,
  NGradientText,
  NDropdown,
  NDivider,
  NGrid,
  NGridItem,
} from 'naive-ui'
import Signing from './components/Signing'
import Register from './components/Register'
import QRCodeSigning from './components/QRCodeSigning'
import SSOSigning from './components/SSOSigning'
import { RIcon } from '@/components'
import AppShareLink from '@/app-components/app/AppShareLink'
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch'

import { LOCAL_OPTIONS } from '@/app-config'
import { useWindowSize } from '@vueuse/core'
import { useSettingActions } from '@/store'

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
      <div
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
              <RIcon name="ray" size="48" />
              <NGradientText class="login-title" type="info" size={28}>
                Ray Template
              </NGradientText>
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
                  name="language"
                  size="18"
                  cursor="pointer"
                />
              </NDropdown>
            </NFlex>
            <NGrid
              cols={'s:1 m:1 l:2 xl:2 2xl:2'}
              itemResponsive={false}
              responsive="screen"
            >
              <NGridItem
                span={'s:0 m:0 l:1 xl:1 2xl:1'}
                class="login__left-wrapper"
              >
                <NFlex align="center" vertical>
                  <RIcon name="login_bg" width="368" height="368" />
                  <NGradientText class="login-title" type="info" size={36}>
                    {$t('views.login.index.RayTemplate')}
                  </NGradientText>
                </NFlex>
              </NGridItem>
              <NGridItem span={1} class="login__right-wrapper">
                <NCard
                  class="login__right-wrapper__content"
                  embedded
                  bordered={false}
                >
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
                  <NDivider>其他登陆方式</NDivider>
                  <SSOSigning />
                  <NDivider>友情链接</NDivider>
                  <AppShareLink />
                </NCard>
              </NGridItem>
            </NGrid>
            <NFlex
              align="center"
              justify="center"
              class="login-copyright__wrapper"
            >
              {this.copyright}
            </NFlex>
          </div>
        </div>
      </div>
    )
  },
})

export default Login
