import { APP_THEME, CONTENT_TRANSITION_OPTIONS } from '@/app-config'
import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import {
  DEFAULT_THEME_STYLE,
  themeStyleOverrides,
  themeStyles,
} from '@ray-template/ui/theme-presets'
import {
  darkTheme,
  lightTheme,
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

type ColorTriggerProps = Parameters<
  NonNullable<InstanceType<typeof NColorPicker>['$slots']['trigger']>
>[0]

export default defineComponent({
  name: 'SegmentViewsAppearance',
  setup() {
    const { t } = useI18n('preferences')
    const { changePrimaryColor, updateSettingState, toggleColorWeakness } =
      useSettingActions()
    const {
      getAppTheme,
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
    const styleName = useId()
    const colorOpen = ref(false)
    const previews = computed(() => {
      const mode = getAppTheme.value ? 'dark' : 'light'
      const base = mode === 'dark' ? darkTheme : lightTheme

      return themeStyles.map((value) => {
        const { primaryColor, bodyColor, cardColor, borderRadius } = {
          ...base.common,
          ...themeStyleOverrides[value][mode].common,
        }

        return {
          value,
          style: {
            '--preset-accent': primaryColor,
            '--preset-background': bodyColor,
            '--preset-surface': cardColor,
            '--preset-radius': borderRadius,
          },
        }
      })
    })
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
          <fieldset class="r-appearance-presets">
            <legend>{t('appearance.themeStyle')}</legend>
            <div class="r-appearance-presets__grid">
              {previews.value.map(({ value, style }) => (
                <label class="r-appearance-preset" key={value}>
                  <input
                    type="radio"
                    name={styleName}
                    value={value}
                    checked={getThemeStyle.value === value}
                    onChange={() => updateSettingState('themeStyle', value)}
                  />
                  <span
                    class="r-appearance-preset__preview"
                    style={style}
                    aria-hidden="true"
                  >
                    <span />
                  </span>
                  <span class="r-appearance-preset__name">
                    {t(`themeStyle.${value}`)}
                  </span>
                  {value === DEFAULT_THEME_STYLE && (
                    <span class="r-appearance-preset__note">
                      {t('appearance.defaultStyle')}
                    </span>
                  )}
                </label>
              ))}
            </div>
          </fieldset>
          <div class="r-appearance-color">
            <span>{t('appearance.primaryColor')}</span>
            <div class="r-appearance-color__controls">
              <NColorPicker
                showPreview
                show={colorOpen.value}
                onUpdateShow={(show) => (colorOpen.value = show)}
                swatches={APP_THEME.appThemeColors}
                value={themeVars.value.primaryColor}
                onUpdateValue={(value) => {
                  if (value) changePrimaryColor(value)
                }}
              >
                {{
                  trigger: ({
                    value,
                    onClick,
                    ref: triggerRef,
                  }: ColorTriggerProps) => (
                    <button
                      type="button"
                      ref={triggerRef}
                      class="r-appearance-color__trigger"
                      aria-label={`${t('appearance.primaryColor')}: ${value}`}
                      aria-expanded={colorOpen.value}
                      onClick={onClick}
                    >
                      <span
                        aria-hidden="true"
                        style={{ background: value ?? void 0 }}
                      />
                      {value}
                    </button>
                  ),
                }}
              </NColorPicker>
              <NButton
                size="small"
                quaternary
                disabled={!getCustomPrimaryColor.value}
                onClick={() => changePrimaryColor()}
              >
                {t('appearance.resetColor')}
              </NButton>
            </div>
          </div>
        </SettingsSection>
        <SettingsSection title={t('appearance.workspace')}>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-settings-fields"
          >
            <NFormItem label={t('appearance.transition')}>
              <NSelect
                aria-label={t('appearance.transition')}
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
                aria-label={t('appearance.placement')}
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
