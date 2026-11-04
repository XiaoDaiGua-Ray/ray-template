import { APP_THEME, CONTENT_TRANSITION_OPTIONS } from '@/app-config'
import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import { NColorPicker, NForm, NFormItem, NSelect, NSwitch } from 'naive-ui'
import SettingsSection from '../components/SettingsSection'
import ThemeSegment from '../components/ThemeSegment'

export default defineComponent({
  name: 'SegmentViewsAppearance',
  setup() {
    const { t } = useI18n('preferences')
    const { changePrimaryColor, updateSettingState, toggleColorWeakness } =
      useSettingActions()
    const {
      getPrimaryColorOverride,
      getDrawerPlacement,
      getContentTransition,
      getMenuTagSwitch,
      getBreadcrumbSwitch,
      getCopyrightSwitch,
      getColorWeakness,
    } = useSettingGetters()
    const switches = [
      ['breadcrumbSwitch', getBreadcrumbSwitch],
      ['menuTagSwitch', getMenuTagSwitch],
      ['copyrightSwitch', getCopyrightSwitch],
      ['colorWeakness', getColorWeakness],
    ] as const

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('appearance.theme')}>
          <ThemeSegment />
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-settings-fields"
          >
            <NFormItem label={t('appearance.primaryColor')}>
              <NColorPicker
                showPreview
                swatches={APP_THEME.appThemeColors}
                value={getPrimaryColorOverride.value.common?.primaryColor}
                onUpdateValue={(value) => {
                  if (value) changePrimaryColor(value)
                }}
              />
            </NFormItem>
            <NFormItem label={t('appearance.transition')}>
              <NSelect
                value={getContentTransition.value}
                options={CONTENT_TRANSITION_OPTIONS.map(({ value }) => ({
                  value,
                  label: t(`transition.${value}`),
                }))}
                onUpdateValue={(value) =>
                  updateSettingState('contentTransition', value)
                }
              />
            </NFormItem>
            <NFormItem label={t('appearance.placement')}>
              <NSelect
                value={getDrawerPlacement.value}
                options={['right', 'left'].map((value) => ({
                  value,
                  label: t(`placement.${value}`),
                }))}
                onUpdateValue={(value: 'right' | 'left') =>
                  updateSettingState('drawerPlacement', value)
                }
              />
            </NFormItem>
          </NForm>
        </SettingsSection>
        <SettingsSection title={t('appearance.display')}>
          <div class="r-settings-switches">
            {switches.map(([key, value]) => (
              <label class="r-settings-switch" key={key}>
                <span>{t(`appearance.${key}`)}</span>
                <NSwitch
                  value={value.value}
                  aria-label={t(`appearance.${key}`)}
                  onUpdateValue={(enabled) =>
                    key === 'colorWeakness'
                      ? toggleColorWeakness(enabled)
                      : updateSettingState(key, enabled)
                  }
                />
              </label>
            ))}
          </div>
        </SettingsSection>
      </div>
    )
  },
})
