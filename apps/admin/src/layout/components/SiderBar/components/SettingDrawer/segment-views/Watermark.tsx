import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import { NForm, NFormItem, NInput, NInputNumber, NSwitch } from 'naive-ui'
import SettingsSection from '../components/SettingsSection'

const dimensions = [
  'fontSize',
  'lineHeight',
  'width',
  'height',
  'xOffset',
  'yOffset',
  'xGap',
  'yGap',
  'rotate',
] as const

export default defineComponent({
  name: 'SegmentViewsWatermark',
  setup() {
    const { t } = useI18n('preferences')
    const { getWatermarkSwitch, getWatermarkConfig } = useSettingGetters()
    const { updateSettingState } = useSettingActions()

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('section.watermark')}>
          <div class="r-settings-switches">
            <label class="r-settings-switch">
              <span>{t('watermark.enabled')}</span>
              <NSwitch
                value={getWatermarkSwitch.value}
                aria-label={t('watermark.enabled')}
                onUpdateValue={(enabled) =>
                  updateSettingState('watermarkSwitch', enabled)
                }
              />
            </label>
            <label class="r-settings-switch">
              <span>{t('watermark.cross')}</span>
              <NSwitch
                value={getWatermarkConfig.value.cross}
                aria-label={t('watermark.cross')}
                onUpdateValue={(cross) =>
                  updateSettingState('watermarkConfig', { cross })
                }
              />
            </label>
          </div>
        </SettingsSection>
        <SettingsSection title={t('watermark.style')}>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-settings-fields"
          >
            <NFormItem
              label={t('watermark.content')}
              class="r-settings-fields__wide"
            >
              <NInput
                value={getWatermarkConfig.value.content}
                inputProps={{ 'aria-label': t('watermark.content') }}
                onUpdateValue={(content) =>
                  updateSettingState('watermarkConfig', { content })
                }
              />
            </NFormItem>
            {dimensions.map((key) => (
              <NFormItem label={t(`watermark.${key}`)} key={key}>
                <NInputNumber
                  value={getWatermarkConfig.value[key]}
                  precision={0}
                  showButton={false}
                  inputProps={{ 'aria-label': t(`watermark.${key}`) }}
                  onUpdateValue={(value) => {
                    if (value !== null)
                      updateSettingState('watermarkConfig', { [key]: value })
                  }}
                />
              </NFormItem>
            ))}
          </NForm>
        </SettingsSection>
      </div>
    )
  },
})
