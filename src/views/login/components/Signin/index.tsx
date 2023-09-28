import { NForm, NFormItem, NInput, NButton, NSpace, NDivider } from 'naive-ui'

import { setStorage } from '@/utils/cache'
import { useSignin } from '@/store'
import { useI18n } from '@/hooks/web/index'
import { APP_CATCH_KEY, ROOT_ROUTE } from '@/app-config/appConfig'
import { useVueRouter } from '@/hooks/web/index'
import { setVariable } from '@/hooks/variable/index'

import type { FormInst } from 'naive-ui'

const Signin = defineComponent({
  name: 'RSignin',
  setup() {
    const loginFormRef = ref<FormInst>()

    const { t } = useI18n()
    const signinStore = useSignin()

    const { signin } = signinStore
    const { path } = ROOT_ROUTE

    const useSigninForm = () => ({
      name: 'Ray Admin',
      pwd: '123456',
    })

    const { router } = useVueRouter()
    const signinForm = ref(useSigninForm())

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

          signin(signinForm.value)
            .then((res) => {
              if (res.code === 0) {
                setTimeout(() => {
                  setVariable('globalSpinning', false)

                  window.$message.success(`欢迎${signinForm.value.name}登陆~`)

                  setStorage(APP_CATCH_KEY.token, 'tokenValue')
                  setStorage(APP_CATCH_KEY.signin, res.data)

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
      signinForm,
      loginFormRef,
      handleLogin,
      rules,
      t,
    }
  },
  render() {
    const { t } = this

    return (
      <NForm model={this.signinForm} ref="loginFormRef" rules={this.rules}>
        <NFormItem label={t('views.login.index.Name')} path="name">
          <NInput
            v-model:value={this.signinForm.name}
            placeholder={t('views.login.index.NamePlaceholder')}
          />
        </NFormItem>
        <NFormItem label={t('views.login.index.Password')} path="pwd">
          <NInput
            v-model:value={this.signinForm.pwd}
            type="password"
            placeholder={t('views.login.index.PasswordPlaceholder')}
          />
        </NFormItem>
        <NButton
          style={['width: 100%', 'margin-to: 18px']}
          type="primary"
          onClick={this.handleLogin.bind(this)}
        >
          {t('views.login.index.Login')}
        </NButton>
      </NForm>
    )
  },
})

export default Signin
