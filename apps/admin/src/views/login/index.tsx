import './index.scss'
import { apiMockEnabled } from '@/api/admin/client'
import AppShareLink from '@/app-components/app/AppShareLink'
import { LOCAL_OPTIONS } from '@/app-config'
import { RIcon } from '@/components'
import { useI18n } from '@/hooks'
import ThemeSwitch from '@/layout/components/SiderBar/components/SettingDrawer/components/ThemeSwitch'
import { useSettingActions } from '@/store'
import { NButton, NDropdown, NFlex, NTabPane, NTabs } from 'naive-ui'
import QRCodeSigning from './components/QRCodeSigning'
import Register from './components/Register'
import Signing from './components/Signing'
import SSOSigning from './components/SSOSigning'

export default defineComponent({
  name: 'RLogin',
  setup() {
    const { updateLocale } = useSettingActions()
    const { t } = useI18n('views.login.index')
    const tabsValue = ref('signing')

    watchEffect(() => {
      document.title = t('PageTitle')
    })

    return { updateLocale, tabsValue, copyright: __APP_CFG__.layout.copyright }
  },
  render() {
    const { $t } = this
    const copy = (key: string) => $t(`views.login.index.${key}`)

    return (
      <main class="login">
        <header class="login__header">
          <div class="login__brand">
            <RIcon name="logo/ray" size={36} />
            <span>Ray Admin</span>
          </div>
          <NFlex align="center">
            <ThemeSwitch />
            <NDropdown
              options={LOCAL_OPTIONS}
              onSelect={this.updateLocale}
              trigger="click"
            >
              <NButton quaternary circle aria-label={copy('Language')}>
                <RIcon name="system/language" />
              </NButton>
            </NDropdown>
          </NFlex>
        </header>

        <div class="login__grid">
          <section class="login__story" aria-labelledby="login-intro">
            <div class="login__story-copy">
              <p class="login__eyebrow">RAY TEMPLATE / WORKSPACE</p>
              <h1 id="login-intro">{copy('RayTemplate')}</h1>
              <p>{copy('TemplateDescription')}</p>
              <ul class="login__stack" aria-label={copy('Stack')}>
                <li>Vue 3</li>
                <li>TypeScript</li>
                <li>Naive UI</li>
              </ul>
            </div>
            <div class="login__mark" aria-hidden="true">
              <RIcon name="logo/ray" size={128} />
            </div>
          </section>

          <section class="login__panel" aria-labelledby="login-panel-heading">
            <div class="login__panel-heading">
              <p class="login__eyebrow">{copy('Access')}</p>
              <h2 id="login-panel-heading">{copy('Welcome')}</h2>
              <p>
                {copy(
                  apiMockEnabled ? 'AccessDescription' : 'AccountDescription',
                )}
              </p>
            </div>
            {apiMockEnabled ? (
              <>
                <NTabs v-model:value={this.tabsValue} type="line" size="medium">
                  <NTabPane tab={copy('Signing')} name="signing">
                    <Signing />
                  </NTabPane>
                  <NTabPane tab={copy('Register')} name="register">
                    <Register />
                  </NTabPane>
                  <NTabPane tab={copy('QRCodeSigning')} name="qrcodeSigning">
                    <QRCodeSigning />
                  </NTabPane>
                </NTabs>
                <div class="login__secondary">
                  <span>{copy('OtherSignInOptions')}</span>
                  <SSOSigning />
                </div>
              </>
            ) : (
              <Signing />
            )}
          </section>
        </div>

        <footer class="login__footer">
          <span>{this.copyright}</span>
          <div aria-label={copy('Resources')}>
            <AppShareLink />
          </div>
        </footer>
      </main>
    )
  },
})
