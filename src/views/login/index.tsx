import './index.scss'

import {
  NSpace,
  NCard,
  NTabs,
  NTabPane,
  NGradientText,
  NDropdown,
  NDivider,
  NGrid,
  NGridItem,
} from 'naive-ui'
import Signin from './components/Signin/index'
import Register from './components/Register/index'
import QRCodeSignin from './components/QRCodeSignin/index'
import SSOSignin from './components/SSOSignin/index'
import RayIcon from '@/components/RIcon'
import RayLink from '@/app-components/app/RayLink/index'
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch/index'

import { useSetting } from '@/store'
import { LOCAL_OPTIONS } from '@/app-config/localConfig'
import { useI18n } from '@/hooks/web/index'

const Login = defineComponent({
  name: 'RLogin',
  setup() {
    const { t } = useI18n()
    const {
      layout: { copyright },
    } = __APP_CFG__

    const state = reactive({
      tabsValue: 'signin',
    })

    const { height: windowHeight, width: windowWidth } = useWindowSize()
    const settingStore = useSetting()
    const { updateLocale } = settingStore

    return {
      ...toRefs(state),
      windowHeight,
      updateLocale,
      t,
      copyright,
      windowWidth,
    }
  },
  render() {
    const { t } = this

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
            <NSpace align="center" class="login-title__wrapper">
              <RayIcon name="ray" size="48" />
              <NGradientText class="login-title" type="info" size={28}>
                Ray Template
              </NGradientText>
            </NSpace>
            <NSpace
              align="center"
              class="login-action__wrapper"
              itemStyle={{
                display: 'flex',
              }}
            >
              <ThemeSwitch />
              <NDropdown
                options={LOCAL_OPTIONS}
                onSelect={(key) => this.updateLocale(key)}
              >
                <RayIcon
                  customClassName="login-icon"
                  name="language"
                  size="18"
                  cursor="pointer"
                />
              </NDropdown>
            </NSpace>
            <NGrid
              cols={'s:1 m:1 l:2 xl:2 2xl:2'}
              itemResponsive={false}
              responsive="screen"
            >
              <NGridItem
                span={'s:0 m:0 l:1 xl:1 2xl:1'}
                class="login__left-wrapper"
              >
                <NSpace align="center" vertical>
                  <RayIcon name="login_bg" width="368" height="368" />
                  <NGradientText class="login-title" type="info" size={36}>
                    开箱即用的中后台管理系统
                  </NGradientText>
                </NSpace>
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
                            tab={t('views.login.index.Signin')}
                            name="signin"
                          >
                            <Signin />
                          </NTabPane>
                          <NTabPane
                            tab={t('views.login.index.Register')}
                            name="register"
                          >
                            <Register />
                          </NTabPane>
                          <NTabPane
                            tab={t('views.login.index.QRCodeSignin')}
                            name="qrcodeSignin"
                          >
                            <QRCodeSignin />
                          </NTabPane>
                        </>
                      ),
                    }}
                  </NTabs>
                  <NDivider>其他登陆方式</NDivider>
                  <SSOSignin />
                  <NDivider>友情链接</NDivider>
                  <RayLink />
                </NCard>
              </NGridItem>
            </NGrid>
            <NSpace
              align="center"
              justify="center"
              class="login-copyright__wrapper"
              wrapItem={false}
            >
              {this.copyright}
            </NSpace>
          </div>
        </div>
      </div>
    )
  },
})

export default Login
