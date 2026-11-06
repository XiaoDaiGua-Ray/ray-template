import { RForm, useForm } from '@/components'
import { useI18n } from '@/hooks'
import {
  NButton,
  NCard,
  NDatePicker,
  NFlex,
  NFormItemGi,
  NGrid,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
} from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

interface FormModel {
  name: string | null
  age: number | null
  gender: string | null
  date: number | null
  remark: string | null
}

export default defineComponent({
  name: 'RFormDemo',
  setup() {
    const { t } = useI18n('demoDetails')
    const rules = computed(() => ({
      name: {
        required: true,
        message: t('form.nameRequired'),
        trigger: ['blur', 'change'],
        key: 'name',
      },
      age: {
        required: true,
        message: t('form.ageRequired'),
        trigger: ['blur', 'change'],
        type: 'number' as const,
        min: 0,
        max: 120,
      },
      date: {
        required: true,
        message: t('form.dateRequired'),
        trigger: ['blur', 'change'],
        type: 'number' as const,
      },
      gender: {
        required: true,
        message: t('form.genderRequired'),
        trigger: 'change',
      },
    }))
    const [
      register,
      {
        validate,
        restoreValidation,
        validateTargetField,
        reset,
        formConditionRef: model,
      },
    ] = useForm<FormModel>({
      name: null,
      age: null,
      gender: null,
      date: null,
      remark: null,
    })
    const ids = { name: useId(), age: useId(), remark: useId() }
    const submission = ref<string>()
    const status = ref('form.waiting')

    const finish = () => {
      submission.value = JSON.stringify(model.value, null, 2)
      status.value = 'form.submitted'
    }

    const submit = async (event: Event) => {
      event.preventDefault()

      try {
        await validate()
        finish()
      } catch {
        submission.value = void 0
        status.value = 'form.invalid'
      }
    }

    return () => (
      <DemoPage title={t('form.title')} description={t('form.intro')}>
        <div class="r-demo-grid">
          <NCard title={t('form.profile')}>
            <RForm
              model={model.value}
              rules={rules.value}
              onRegister={register}
              onSubmit={submit}
              submitWhenEnter
              onFinish={finish}
            >
              <NGrid cols="1 480:2" responsive="self" xGap={16}>
                <NFormItemGi
                  label={t('form.name')}
                  labelProps={{ for: ids.name }}
                  path="name"
                >
                  <NInput
                    v-model:value={model.value.name}
                    inputProps={{ id: ids.name }}
                  />
                </NFormItemGi>
                <NFormItemGi
                  label={t('form.age')}
                  labelProps={{ for: ids.age }}
                  path="age"
                >
                  <NInputNumber
                    v-model:value={model.value.age}
                    inputProps={{ id: ids.age }}
                    min={0}
                    max={120}
                  />
                </NFormItemGi>
                <NFormItemGi label={t('form.date')} path="date">
                  <NDatePicker v-model:value={model.value.date} type="date" />
                </NFormItemGi>
                <NFormItemGi label={t('form.gender')} path="gender">
                  <NRadioGroup
                    v-model:value={model.value.gender}
                    aria-label={t('form.gender')}
                  >
                    <NRadio value="female">{t('form.female')}</NRadio>
                    <NRadio value="male">{t('form.male')}</NRadio>
                  </NRadioGroup>
                </NFormItemGi>
                <NFormItemGi
                  label={t('form.notes')}
                  labelProps={{ for: ids.remark }}
                  span={2}
                >
                  <NInput
                    type="textarea"
                    v-model:value={model.value.remark}
                    inputProps={{ id: ids.remark }}
                  />
                </NFormItemGi>
              </NGrid>
              <NFlex>
                <NButton type="primary" attrType="submit">
                  {t('form.submit')}
                </NButton>
                <NButton
                  onClick={() => {
                    reset({
                      name: 'Ray',
                      age: 28,
                      gender: 'female',
                      date: new Date(1998, 6, 12).getTime(),
                      remark: null,
                    })
                    submission.value = void 0
                    status.value = 'form.waiting'
                  }}
                >
                  {t('form.sample')}
                </NButton>
                <NButton
                  onClick={() => {
                    void validateTargetField('name')
                      .then(() => {
                        status.value = 'form.nameValid'
                      })
                      .catch(() => {
                        status.value = 'form.nameRequired'
                      })
                  }}
                >
                  {t('form.validateName')}
                </NButton>
                <NButton
                  onClick={() => {
                    restoreValidation()
                    status.value = 'form.waiting'
                  }}
                >
                  {t('form.clear')}
                </NButton>
                <NButton
                  onClick={() => {
                    reset()
                    submission.value = void 0
                    status.value = 'form.waiting'
                  }}
                >
                  {t('form.reset')}
                </NButton>
              </NFlex>
            </RForm>
          </NCard>
          <NCard title={t('form.payload')}>
            <DemoResult
              label={t(status.value)}
              error={status.value === 'form.invalid'}
            >
              <pre>{submission.value ?? t('empty')}</pre>
            </DemoResult>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})
