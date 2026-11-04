import { useI18n } from '@/hooks'
import { useMenuActions, useSettingActions, useSettingGetters } from '@/store'
import { NButton, NForm, NFormItem, NInputNumber, NSwitch } from 'naive-ui'
import SettingsSection from '../components/SettingsSection'

const sizes = [
  'menuWidth',
  'collapsedWidth',
  'collapsedIndent',
  'iconSize',
  'collapsedIconSize',
] as const
const switches = [
  'inverted',
  'menuSiderBarLogo',
  'accordion',
  'nativeScrollbar',
] as const

export default defineComponent({
  name: 'SegmentViewsCustomMenu',
  setup() {
    const { t } = useI18n('preferences')
    const { getMenuConfig } = useSettingGetters()
    const { updateSettingState } = useSettingActions()
    const { setupAppMenu } = useMenuActions()

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('menu.size')}>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-settings-fields"
          >
            {sizes.map((key) => (
              <NFormItem label={t(`menu.${key}`)} key={key}>
                <NInputNumber
                  value={getMenuConfig.value[key]}
                  min={0}
                  precision={0}
                  inputProps={{ 'aria-label': t(`menu.${key}`) }}
                  onUpdateValue={(value) => {
                    if (value !== null)
                      updateSettingState('menuConfig', { [key]: value })
                  }}
                />
              </NFormItem>
            ))}
          </NForm>
          <NButton secondary type="primary" onClick={setupAppMenu}>
            {t('menu.refresh')}
          </NButton>
        </SettingsSection>
        <SettingsSection title={t('menu.behavior')}>
          <div class="r-settings-switches">
            {switches.map((key) => (
              <label key={key} class="r-settings-switch">
                <span>{t(`menu.${key}`)}</span>
                <NSwitch
                  value={getMenuConfig.value[key]}
                  aria-label={t(`menu.${key}`)}
                  onUpdateValue={(enabled) =>
                    updateSettingState('menuConfig', { [key]: enabled })
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
