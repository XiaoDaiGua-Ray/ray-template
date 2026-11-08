import { useI18n, useMaximize } from '@/hooks'
import LayoutSettings from '@/layout/components/LayoutSettings'
import { useSettingActions, useSettingGetters } from '@/store'
import type { LayoutConfig } from '@/store/modules/setting/types'
import { NButton, NSwitch } from 'naive-ui'
import SettingsSection from '../components/SettingsSection'

const workspacePresets = {
  spacious: { contentWidth: 'fluid', contentPadding: 24 },
  compact: { contentWidth: 'fluid', contentPadding: 8 },
  reading: {
    contentWidth: 'fixed',
    contentMaxWidth: 960,
    contentPadding: 24,
  },
} satisfies Record<string, Partial<LayoutConfig>>

export default defineComponent({
  name: 'SegmentViewsLayout',
  setup() {
    const { t } = useI18n('preferences')
    const { getLayoutConfig } = useSettingGetters()
    const { updateSettingState } = useSettingActions()
    const { isLayoutContentMaximized, maximize } = useMaximize()
    const maximizeHintId = useId()
    const activePreset = computed(
      () =>
        Object.entries(workspacePresets).find(([, config]) =>
          Object.entries(config).every(
            ([field, value]) =>
              getLayoutConfig.value[field as keyof LayoutConfig] === value,
          ),
        )?.[0],
    )

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('layout.presets')}>
          <p class="r-settings-hint">{t('layout.presetsHint')}</p>
          <div
            class="r-settings-actions r-workspace-presets"
            role="group"
            aria-label={t('layout.presets')}
          >
            {Object.entries(workspacePresets).map(([key, config]) => (
              <NButton
                key={key}
                secondary
                type={activePreset.value === key ? 'primary' : 'default'}
                aria-pressed={activePreset.value === key}
                onClick={() => updateSettingState('layoutConfig', config)}
              >
                {t(`layout.${key}`)}
                <span class="r-workspace-presets__check" aria-hidden="true">
                  {activePreset.value === key ? '✓' : ''}
                </span>
              </NButton>
            ))}
          </div>
          <p class="r-workspace-presets__current">
            <span>{t('layout.current')}</span>
            <strong>{t(`layout.${activePreset.value ?? 'custom'}`)}</strong>
            <span>{getLayoutConfig.value.contentPadding} px</span>
          </p>
        </SettingsSection>
        <SettingsSection title={t('section.layout')}>
          <LayoutSettings showDescription />
        </SettingsSection>
        <SettingsSection title={t('layout.focus')}>
          <div class="r-settings-switches">
            <label class="r-settings-switch">
              <span>{t('layout.maximize')}</span>
              <NSwitch
                value={isLayoutContentMaximized.value}
                aria-label={t('layout.maximize')}
                aria-describedby={maximizeHintId}
                onUpdateValue={(value) => maximize(value)}
              />
            </label>
          </div>
          <p id={maximizeHintId} class="r-settings-hint">
            {t('layout.maximizeHint')}
          </p>
        </SettingsSection>
      </div>
    )
  },
})
