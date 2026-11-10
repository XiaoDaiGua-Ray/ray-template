import './index.scss'
import { useI18n } from '@/hooks'
import { useMenuActions, useSettingActions } from '@/store'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import { PREFERENCE_FILE_LIMIT } from '@/store/modules/setting/preference-file'
import type { SettingState } from '@/store/modules/setting/types'
import { downloadAnyFile } from '@/utils/files'
import { RIcon } from '@ray-template/ui/icon'
import { useModal } from '@ray-template/ui/modal'
import { cloneDeep, forIn } from 'lodash-es'
import {
  drawerProps,
  NButton,
  NDrawer,
  NDrawerContent,
  NTabPane,
  NTabs,
} from 'naive-ui'
import Appearance from './segment-views/Appearance'
import Common from './segment-views/Common'
import CustomMenu from './segment-views/CustomMenu'
import Layout from './segment-views/Layout'
import Watermark from './segment-views/Watermark'

export default defineComponent({
  name: 'SettingDrawer',
  props: drawerProps,
  setup(props) {
    const categories = [
      { key: 'layout', icon: 'navigation/layout', view: Layout },
      { key: 'appearance', icon: 'navigation/appearance', view: Appearance },
      { key: 'menu', icon: 'navigation/menu', view: CustomMenu },
      { key: 'watermark', icon: 'system/watermark', view: Watermark },
      { key: 'general', icon: 'action/setting', view: Common },
    ] as const
    const { t } = useI18n('preferences')
    const { create } = useModal()
    const {
      updateSettingState,
      changePrimaryColor,
      exportPreferences,
      importPreferences,
    } = useSettingActions()
    const { setupAppMenu } = useMenuActions()
    const fileInput = useTemplateRef<HTMLInputElement>('preferenceFile')
    const importing = ref(false)
    const configError = (key: string) =>
      window.$message.error(() => <span role="alert">{t(key)}</span>)

    const exportConfig = async () => {
      try {
        const blob = new Blob(
          [JSON.stringify(exportPreferences(), null, 2) + '\n'],
          { type: 'application/json' },
        )

        if (blob.size > PREFERENCE_FILE_LIMIT) {
          configError('config.fileLimit')

          return
        }

        await downloadAnyFile(blob, 'ray-template-preferences.json')
      } catch {
        configError('config.exportError')
      }
    }

    const importConfig = async (event: Event) => {
      const input = event.currentTarget as HTMLInputElement
      const file = input.files?.[0]

      input.value = ''

      if (!file || importing.value) return

      if (file.size > PREFERENCE_FILE_LIMIT) {
        configError('config.fileLimit')

        return
      }

      importing.value = true

      try {
        importPreferences(await file.text())
        void setupAppMenu()
        window.$message.success(() => (
          <span role="status">{t('config.imported')}</span>
        ))
      } catch {
        configError('config.importError')
      } finally {
        importing.value = false
      }
    }

    const reset = () =>
      create({
        preset: 'dialog',
        title: t('reset'),
        type: 'warning',
        content: t('resetDescription'),
        positiveText: t('reset'),
        negativeText: t('cancel'),
        dialogWidth: 'min(420px, calc(100vw - 32px))',
        onPositiveClick: () => {
          forIn(cloneDeep(getDefaultSettingConfig()), (value, key) => {
            updateSettingState(key as keyof SettingState, value)
          })
          changePrimaryColor()
          void setupAppMenu()
        },
      })

    return () => (
      <NDrawer
        {...props}
        width={props.width ?? 'min(580px, 100vw)'}
        class="r-settings-drawer"
      >
        <NDrawerContent
          title={t('title')}
          closable
          headerClass="r-settings-drawer__header"
          bodyContentClass="r-settings-drawer__body"
          footerClass="r-settings-drawer__footer"
          nativeScrollbar={props.nativeScrollbar}
        >
          {{
            header: () => (
              <div class="r-settings-heading">
                <span class="r-settings-heading__icon">
                  <RIcon
                    name="action/adjustment"
                    size={20}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h2>{t('title')}</h2>
                  <p>{t('subtitle')}</p>
                </div>
              </div>
            ),
            default: () => (
              <NTabs
                type="line"
                defaultValue="appearance"
                class="r-settings-tabs"
                tabClass="r-settings-tabs__tab"
                tabsPadding={14}
                themeOverrides={{
                  tabGapMediumLine: '16px',
                  tabPaddingMediumLine: '10px 4px',
                  tabTextColorActiveLine: 'var(--r-primary-text)',
                  tabTextColorHoverLine: 'var(--r-primary-text)',
                  barColor: 'var(--r-primary-text)',
                }}
              >
                {categories.map(({ key, icon, view: View }) => (
                  <NTabPane
                    key={key}
                    name={key}
                    tab={() => (
                      <span class="r-settings-tabs__label">
                        <RIcon
                          class="r-settings-tabs__icon"
                          name={icon}
                          size={16}
                          aria-hidden="true"
                        />
                        <span class="r-settings-tabs__text">
                          {t(`section.${key}`)}
                        </span>
                      </span>
                    )}
                  >
                    <View />
                  </NTabPane>
                ))}
              </NTabs>
            ),
            footer: () => (
              <div class="r-settings-drawer__actions">
                <NButton type="warning" secondary onClick={reset}>
                  {t('reset')}
                </NButton>
                <div class="r-settings-drawer__file-actions">
                  <NButton onClick={exportConfig}>{t('config.export')}</NButton>
                  <NButton
                    type="primary"
                    secondary
                    loading={importing.value}
                    onClick={() => fileInput.value?.click()}
                  >
                    {t('config.import')}
                  </NButton>
                  <input
                    ref="preferenceFile"
                    type="file"
                    accept=".json,application/json"
                    hidden
                    onChange={importConfig}
                  />
                </div>
              </div>
            ),
          }}
        </NDrawerContent>
      </NDrawer>
    )
  },
})
