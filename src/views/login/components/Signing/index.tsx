import { NForm, NFormItem, NInput, NButton } from 'naive-ui'
import { RForm } from '@/components'

import { setStorage } from '@/utils'
import { useI18n, useAppRoot } from '@/hooks'
import { APP_CATCH_KEY } from '@/app-config'
import { useSigningActions } from '@/store'
import { useForm } from '@/components'

import type { FormInst } from 'naive-ui'

export default defineComponent({
  name: 'RSigning',
  setup() {
    const [register, { validate }] = useForm()

    const { t } = useI18n()
    const { signing } = useSigningActions()
    const { getRootPath } = useAppRoot()
    const loading = ref(false)

    const useSigningForm = () => ({
      name: 'Ray Admin',
      pwd: '123456',
    })

    const router = useRouter()
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
      validate().then(() => {
        loading.value = true

        signing(signingForm.value)
          .then((res) => {
            if (res.code === 0) {
              setTimeout(() => {
                window.$message.success(`欢迎${signingForm.value.name}登陆~`)

                setStorage(APP_CATCH_KEY.token, 'tokenValue', 'localStorage')
                setStorage(APP_CATCH_KEY.signing, res.data, 'localStorage')

                router.push(getRootPath.value)

                loading.value = false
              }, 2 * 1000)
            }
          })
          .catch(() => {
            window.$message.error('不可以这样哟, 不可以哟')
          })
      })
    }

    return {
      signingForm,
      register,
      handleLogin,
      rules,
      loading,
    }
  },
  render() {
    const { $t, loading, register } = this

    return (
      <RForm model={this.signingForm} onRegister={register} rules={this.rules}>
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
            onKeydown={(e) => e.key === 'Enter' && this.handleLogin()}
          />
        </NFormItem>
        <NButton
          style={['width: 100%', 'margin-to: 18px']}
          type="primary"
          onClick={this.handleLogin.bind(this)}
          loading={loading}
        >
          {$t('views.login.index.Login')}
        </NButton>
      </RForm>
    )
  },
})
