import { NForm, NFormItem, NInput, NButton, NSpace, NDivider } from 'naive-ui'

import { setCache } from '@/utils/cache'
import { useSpin } from '@/spin'
import { useSignin } from '@/store'

import type { FormInst } from 'naive-ui'

const Signin = defineComponent({
  name: 'Signin',
  setup() {
    const loginFormRef = ref<FormInst>()

    const { t } = useI18n()
    const signinStore = useSignin()

    const { signin } = signinStore
    const {
      rootRoute: { path },
    } = __APP_CFG__

    const useSigninForm = () => ({
      name: 'ray',
      pwd: '123456',
    })

    const router = useRouter()
    const signinForm = ref(useSigninForm())

    const rules = {
      name: {
        required: true,
        message: t('LoginModule.NamePlaceholder'),
        trigger: ['blur', 'input'],
      },
      pwd: {
        required: true,
        message: t('LoginModule.PasswordPlaceholder'),
        trigger: ['blur', 'input'],
      },
    }

    /** 普通登陆形式 */
    const handleLogin = () => {
      loginFormRef.value?.validate((valid) => {
        if (!valid) {
          useSpin(true)

          if (signin(signinForm.value) === 0) {
            setTimeout(() => {
              useSpin(false)

              window.$message.success(`欢迎${signinForm.value.name}登陆~`)

              setCache('token', 'tokenValue')
              setCache('person', signinForm.value)

              router.push(path)
            }, 2 * 1000)
          }
        } else {
          window.$message.error('不可以这样哟, 不可以哟')
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
        <NFormItem label={t('LoginModule.Name')} path="name">
          <NInput
            v-model:value={this.signinForm.name}
            placeholder={t('LoginModule.NamePlaceholder')}
          />
        </NFormItem>
        <NFormItem label={t('LoginModule.Password')} path="pwd">
          <NInput
            v-model:value={this.signinForm.pwd}
            type="password"
            placeholder={t('LoginModule.PasswordPlaceholder')}
          />
        </NFormItem>
        <NButton
          style={['width: 100%', 'margin-to: 18px']}
          type="primary"
          onClick={this.handleLogin.bind(this)}
        >
          {t('LoginModule.Login')}
        </NButton>
      </NForm>
    )
  },
})

export default Signin