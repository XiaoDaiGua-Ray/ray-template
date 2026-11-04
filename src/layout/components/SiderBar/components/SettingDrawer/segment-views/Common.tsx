import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import { NDynamicTags, NForm, NFormItem, NInputNumber, NSwitch } from 'naive-ui'
import SettingsSection from '../components/SettingsSection'

export default defineComponent({
  name: 'SegmentViewsCommon',
  setup() {
    const { t } = useI18n('preferences')
    const { getKeepAliveConfig, getDynamicDocumentTitle } = useSettingGetters()
    const { updateSettingState } = useSettingActions()

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('section.general')}>
          <div class="r-settings-switches">
            <label class="r-settings-switch">
              <span>{t('general.title')}</span>
              <NSwitch
                value={getDynamicDocumentTitle.value}
                aria-label={t('general.title')}
                onUpdateValue={(value) =>
                  updateSettingState('dynamicDocumentTitle', value)
                }
              />
            </label>
          </div>
        </SettingsSection>
        <SettingsSection title={t('general.cache')}>
          <div class="r-settings-switches">
            <label class="r-settings-switch">
              <span>{t('general.enableCache')}</span>
              <NSwitch
                value={getKeepAliveConfig.value.setupKeepAlive}
                aria-label={t('general.enableCache')}
                onUpdateValue={(setupKeepAlive) =>
                  updateSettingState('keepAliveConfig', { setupKeepAlive })
                }
              />
            </label>
          </div>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-settings-fields"
          >
            <NFormItem label={t('general.cacheLimit')}>
              <NInputNumber
                value={getKeepAliveConfig.value.maxKeepAliveLength}
                disabled={!getKeepAliveConfig.value.setupKeepAlive}
                inputProps={{ 'aria-label': t('general.cacheLimit') }}
                min={0}
                precision={0}
                showButton={false}
                onUpdateValue={(value) => {
                  if (value !== null)
                    updateSettingState('keepAliveConfig', {
                      maxKeepAliveLength: value,
                    })
                }}
              />
            </NFormItem>
            <NFormItem
              label={t('general.cacheExcluded')}
              class="r-settings-fields__wide"
            >
              <NDynamicTags
                value={getKeepAliveConfig.value.keepAliveExclude}
                onUpdateValue={(keepAliveExclude: string[]) =>
                  updateSettingState('keepAliveConfig', { keepAliveExclude })
                }
              />
            </NFormItem>
          </NForm>
        </SettingsSection>
      </div>
    )
  },
})
