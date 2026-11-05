import { APP_THEME, CONTENT_TRANSITION_OPTIONS } from '@/app-config'
import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import { themeStyles } from '@ray-template/ui/theme-presets'
import type { ThemeStyle } from '@ray-template/ui/theme-presets'
import {
  NButton,
  NColorPicker,
  NForm,
  NFormItem,
  NSelect,
  NSwitch,
  useThemeVars,
} from 'naive-ui'
import SettingsSection from '../components/SettingsSection'
import ThemeSegment from '../components/ThemeSegment'

export default defineComponent({
  name: 'SegmentViewsAppearance',
  setup() {
    const { t } = useI18n('preferences')
    const { changePrimaryColor, updateSettingState, toggleColorWeakness } =
      useSettingActions()
    const {
      getThemeStyle,
      getCustomPrimaryColor,
      getDrawerPlacement,
      getContentTransition,
      getMenuTagSwitch,
      getBreadcrumbSwitch,
      getCopyrightSwitch,
      getColorWeakness,
    } = useSettingGetters()
    const themeVars = useThemeVars()
    const styleOptions = computed(() =>
      themeStyles.map((value) => ({
        value,
        label: t(`themeStyle.${value}`),
      })),
    )
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
            <NFormItem label={t('appearance.themeStyle')}>
              <NSelect
                aria-label={t('appearance.themeStyle')}
                value={getThemeStyle.value}
                options={styleOptions.value}
                onUpdateValue={(value: ThemeStyle) =>
                  updateSettingState('themeStyle', value)
                }
              />
            </NFormItem>
            <NFormItem label={t('appearance.primaryColor')}>
              <NColorPicker
                showPreview
                swatches={APP_THEME.appThemeColors}
                value={themeVars.value.primaryColor}
                onUpdateValue={(value) => {
                  if (value) changePrimaryColor(value)
                }}
              />
            </NFormItem>
            {getCustomPrimaryColor.value && (
              <NButton text type="primary" onClick={() => changePrimaryColor()}>
                {t('appearance.resetColor')}
              </NButton>
            )}
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
