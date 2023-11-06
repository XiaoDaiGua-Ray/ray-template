import { NForm, NFormItem, NInput, NButton } from 'naive-ui'

import { setStorage } from '@/utils/cache'
import { useI18n } from '@/hooks/web/index'
import { APP_CATCH_KEY, ROOT_ROUTE } from '@/app-config/appConfig'
import { useVueRouter } from '@/hooks/web/index'
import { setVariable, getVariableToRefs } from '@/global-variable/index'
import { useSigningActions, useSigningGetters } from '@/store'

import type { FormInst } from 'naive-ui'

export default defineComponent({
  name: 'RSigning',
  setup() {
    const loginFormRef = ref<FormInst>()

    const { t } = useI18n()
    const { signing } = useSigningActions()
    const { path } = ROOT_ROUTE
    const globalSpinning = getVariableToRefs('globalSpinning')

    const useSigningForm = () => ({
      name: 'Ray Admin',
      pwd: '123456',
    })

    const { router } = useVueRouter()
    const signingForm = ref(useSigningForm())

    const rules = {
      name: {
        required: true,
        message: t('views.login.index.NamePlaceholder'),
        trigger: ['blur', 'input'],
      },
      pwd: {
        required: true,
        message: t('views.login.index.PasswordPlaceholder'),
        trigger: ['blur', 'input'],
      },
    }

    /** 普通登陆形式 */
    const handleLogin = () => {
      loginFormRef.value?.validate((valid) => {
        if (!valid) {
          setVariable('globalSpinning', true)

          signing(signingForm.value)
            .then((res) => {
              if (res.code === 0) {
                setTimeout(() => {
                  setVariable('globalSpinning', false)

                  window.$message.success(`欢迎${signingForm.value.name}登陆~`)

                  setStorage(APP_CATCH_KEY.token, 'tokenValue')
                  setStorage(APP_CATCH_KEY.signing, res.data)

                  router.push(path)
                }, 2 * 1000)
              }
            })
            .catch(() => {
              window.$message.error('不可以这样哟, 不可以哟')
            })
        }
      })
    }

    return {
      signingForm,
      loginFormRef,
      handleLogin,
      rules,
      globalSpinning,
    }
  },
  render() {
    const { $t, globalSpinning } = this

    return (
      <NForm model={this.signingForm} ref="loginFormRef" rules={this.rules}>
        <NFormItem label={$t('views.login.index.Name')} path="name">
          <NInput
            v-model:value={this.signingForm.name}
            placeholder={$t('views.login.index.NamePlaceholder')}
          />
        </NFormItem>
        <NFormItem label={$t('views.login.index.Password')} path="pwd">
          <NInput
            v-model:value={this.signingForm.pwd}
            type="password"
            showPasswordOn="click"
            placeholder={$t('views.login.index.PasswordPlaceholder')}
          />
        </NFormItem>
        <NButton
          style={['width: 100%', 'margin-to: 18px']}
          type="primary"
          onClick={this.handleLogin.bind(this)}
          loading={globalSpinning}
        >
          {$t('views.login.index.Login')}
        </NButton>
      </NForm>
    )
  },
})
