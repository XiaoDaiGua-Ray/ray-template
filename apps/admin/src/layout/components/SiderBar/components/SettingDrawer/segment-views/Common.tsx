import { LOCAL_OPTIONS } from '@/app-config'
import { useContentScroll, useI18n, useSpinning } from '@/hooks'
import {
  useKeepAliveActions,
  useKeepAliveGetters,
  useNavigationHistoryActions,
  useNavigationHistoryGetters,
  useRuntimeGetters,
  useSettingActions,
  useSettingGetters,
} from '@/store'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import { cloneDeep } from 'lodash-es'
import {
  NButton,
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NSwitch,
  useModal,
} from 'naive-ui'
import SettingsSection from '../components/SettingsSection'

export default defineComponent({
  name: 'SegmentViewsCommon',
  setup() {
    const { t } = useI18n('preferences')
    const { create } = useModal()
    const { getKeepAliveConfig, getDynamicDocumentTitle, getLocaleLanguage } =
      useSettingGetters()
    const { updateSettingState, updateLocale } = useSettingActions()
    const { getKeepAliveInclude } = useKeepAliveGetters()
    const { retainKeepAliveInclude } = useKeepAliveActions()
    const { recentPaths, storageUnavailable } = useNavigationHistoryGetters()
    const { clearRecent } = useNavigationHistoryActions()
    const { globalMainLayoutLoad } = useRuntimeGetters()
    const { reload } = useSpinning()
    const scrollTo = useContentScroll()
    const cacheHintId = useId()
    const status = ref('')
    const confirm = (title: string, content: string, action: () => void) =>
      create({
        preset: 'dialog',
        type: 'warning',
        title,
        content,
        positiveText: title,
        negativeText: t('cancel'),
        style: { width: 'min(420px, calc(100vw - 32px))' },
        onPositiveClick: action,
      })
    const clearCache = () =>
      confirm(t('general.clearCache'), t('general.clearCacheConfirm'), () => {
        retainKeepAliveInclude(new Set())
        status.value = 'general.cacheCleared'
      })
    const clearHistory = () =>
      confirm(t('general.clearRecent'), t('general.clearRecentConfirm'), () => {
        clearRecent()
        status.value = storageUnavailable.value
          ? 'general.historyStorageUnavailable'
          : 'general.recentCleared'
      })
    const reset = () => {
      const defaults = getDefaultSettingConfig()

      updateSettingState('dynamicDocumentTitle', defaults.dynamicDocumentTitle)
      updateSettingState('keepAliveConfig', cloneDeep(defaults.keepAliveConfig))
      status.value = 'general.resetDone'
    }

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('section.general')}>
          <NForm labelPlacement="top" showFeedback={false}>
            <NFormItem label={t('general.language')}>
              <NSelect
                value={getLocaleLanguage.value}
                aria-label={t('general.language')}
                options={LOCAL_OPTIONS.map(({ key, label }) => ({
                  value: key,
                  label,
                }))}
                onUpdateValue={updateLocale}
              />
            </NFormItem>
          </NForm>
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
        <SettingsSection title={t('general.workspaceActions')}>
          <p class="r-settings-hint">{t('general.refreshHint')}</p>
          <div class="r-settings-actions">
            <NButton
              loading={!globalMainLayoutLoad.value}
              onClick={() => reload()}
            >
              {t('general.refresh')}
            </NButton>
            <NButton
              onClick={() => {
                scrollTo({ top: 0, left: 0, behavior: 'auto' })
              }}
            >
              {t('general.scrollTop')}
            </NButton>
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
            <NFormItem
              label={t('general.cacheLimit')}
              class="r-settings-fields__wide"
            >
              <NInputNumber
                value={getKeepAliveConfig.value.maxKeepAliveLength}
                disabled={!getKeepAliveConfig.value.setupKeepAlive}
                inputProps={{
                  'aria-label': t('general.cacheLimit'),
                  'aria-describedby': cacheHintId,
                }}
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
          </NForm>
          <p class="r-settings-hint" id={cacheHintId}>
            {t('general.cacheLimitHint')}
          </p>
          <NButton
            disabled={!getKeepAliveInclude.value.length}
            onClick={clearCache}
          >
            {t('general.clearCache')}
          </NButton>
        </SettingsSection>
        <SettingsSection title={t('general.history')}>
          <p class="r-settings-hint">
            {t('general.recentCount', { count: recentPaths.value.length })}
          </p>
          <NButton disabled={!recentPaths.value.length} onClick={clearHistory}>
            {t('general.clearRecent')}
          </NButton>
          {storageUnavailable.value && (
            <p class="r-settings-hint" role="alert">
              {t('general.historyStorageUnavailable')}
            </p>
          )}
        </SettingsSection>
        <SettingsSection title={t('general.resetSection')}>
          <p class="r-settings-hint">{t('general.resetHint')}</p>
          <NButton onClick={reset}>{t('general.reset')}</NButton>
        </SettingsSection>
        {status.value && <p role="status">{t(status.value)}</p>}
      </div>
    )
  },
})
