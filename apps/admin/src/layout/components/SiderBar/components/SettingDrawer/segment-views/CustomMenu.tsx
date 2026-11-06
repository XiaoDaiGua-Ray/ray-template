import { useDevice, useI18n, useSiderScroll } from '@/hooks'
import { findMenuRoot } from '@/layout/navigation'
import {
  useMenuActions,
  useMenuGetters,
  useSettingActions,
  useSettingGetters,
} from '@/store'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import {
  NButton,
  NForm,
  NFormItem,
  NInputNumber,
  NRadioButton,
  NRadioGroup,
  NSwitch,
} from 'naive-ui'
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
const sizePresets = {
  compact: {
    menuWidth: 224,
    collapsedWidth: 56,
    collapsedIndent: 16,
    iconSize: 18,
    collapsedIconSize: 20,
  },
  comfortable: {
    menuWidth: 272,
    collapsedWidth: 64,
    collapsedIndent: 24,
    iconSize: 20,
    collapsedIconSize: 22,
  },
} as const

export default defineComponent({
  name: 'SegmentViewsCustomMenu',
  setup() {
    const { t } = useI18n('preferences')
    const { getMenuConfig, getLayoutConfig } = useSettingGetters()
    const { getCollapsed, getMenuOptions, getMenuKey } = useMenuGetters()
    const { updateSettingState } = useSettingActions()
    const { setupAppMenu, collapsedMenu } = useMenuActions()
    const { isTabletOrSmaller } = useDevice()
    const scrollSider = useSiderScroll()
    const refreshing = ref(false)
    const id = useId()
    const hasDesktopSidebar = computed(() => {
      if (isTabletOrSmaller.value) return false

      const { mode } = getLayoutConfig.value

      if (mode === 'side' || mode === 'right') return true

      if (mode === 'top') return false

      return !!findMenuRoot(
        getMenuOptions.value,
        String(getMenuKey.value),
      )?.children?.some((option) => option.show !== false)
    })

    const refreshMenu = async () => {
      if (refreshing.value) return

      refreshing.value = true

      try {
        await setupAppMenu()
        window.$message.success(t('menu.refreshed'))
      } catch {
        window.$message.error(t('menu.refreshFailed'))
      } finally {
        refreshing.value = false
      }
    }
    const resetMenu = async () => {
      if (refreshing.value) return

      updateSettingState('menuConfig', {
        ...getDefaultSettingConfig().menuConfig,
      })
      await refreshMenu()
    }

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('menu.size')}>
          <div
            class="r-settings-actions"
            role="group"
            aria-label={t('menu.sizePreset')}
          >
            {(['compact', 'comfortable'] as const).map((preset) => (
              <NButton
                key={preset}
                secondary
                aria-pressed={sizes.every(
                  (key) =>
                    getMenuConfig.value[key] === sizePresets[preset][key],
                )}
                onClick={() =>
                  updateSettingState('menuConfig', sizePresets[preset])
                }
              >
                {t(`menu.${preset}`)}
              </NButton>
            ))}
          </div>
          <p class="r-settings-hint">{t('menu.sizeHint')}</p>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-settings-fields"
          >
            {sizes.map((key) => (
              <NFormItem
                label={t(`menu.${key}`)}
                labelProps={{ for: `${id}-${key}` }}
                key={key}
              >
                <NInputNumber
                  value={getMenuConfig.value[key]}
                  min={
                    key === 'collapsedIndent'
                      ? 0
                      : key === 'menuWidth'
                        ? Math.max(1, getMenuConfig.value.collapsedWidth)
                        : 1
                  }
                  max={
                    key === 'collapsedWidth'
                      ? Math.max(1, getMenuConfig.value.menuWidth)
                      : void 0
                  }
                  precision={0}
                  inputProps={{ id: `${id}-${key}` }}
                  onUpdateValue={(value) => {
                    if (value !== null && Number.isFinite(value))
                      updateSettingState('menuConfig', { [key]: value })
                  }}
                />
              </NFormItem>
            ))}
          </NForm>
        </SettingsSection>
        <SettingsSection title={t('menu.behavior')}>
          <NForm labelPlacement="top" showFeedback={false}>
            <NFormItem label={t('menu.collapsedMode')}>
              <NRadioGroup
                value={getMenuConfig.value.collapsedMode}
                aria-label={t('menu.collapsedMode')}
                aria-describedby={`${id}-mode-hint`}
                onUpdateValue={(value) => {
                  if (value === 'width' || value === 'transform')
                    updateSettingState('menuConfig', { collapsedMode: value })
                }}
              >
                <NRadioButton value="width">{t('menu.widthMode')}</NRadioButton>
                <NRadioButton value="transform">
                  {t('menu.transformMode')}
                </NRadioButton>
              </NRadioGroup>
            </NFormItem>
          </NForm>
          <p id={`${id}-mode-hint`} class="r-settings-hint">
            {t('menu.collapsedModeHint')}
          </p>
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
        <SettingsSection title={t('menu.actions')}>
          <p id={`${id}-sidebar-hint`} class="r-settings-hint">
            {t(
              hasDesktopSidebar.value
                ? 'menu.sidebarHint'
                : 'menu.noSidebarHint',
            )}
          </p>
          <div class="r-settings-action-grid">
            <NButton
              disabled={!hasDesktopSidebar.value}
              aria-describedby={`${id}-sidebar-hint`}
              onClick={() => collapsedMenu(!getCollapsed.value)}
            >
              {t(getCollapsed.value ? 'menu.expand' : 'menu.collapse')}
            </NButton>
            <NButton
              disabled={!hasDesktopSidebar.value}
              onClick={() => scrollSider({ top: 0, left: 0, behavior: 'auto' })}
            >
              {t('menu.scrollTop')}
            </NButton>
            <NButton loading={refreshing.value} onClick={refreshMenu}>
              {t('menu.refresh')}
            </NButton>
            <NButton disabled={refreshing.value} onClick={resetMenu}>
              {t('menu.reset')}
            </NButton>
          </div>
        </SettingsSection>
      </div>
    )
  },
})
