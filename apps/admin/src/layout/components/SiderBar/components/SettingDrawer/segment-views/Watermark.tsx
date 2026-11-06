import { useI18n, useWatermark } from '@/hooks'
import {
  useSettingActions,
  useSettingGetters,
  useSigningGetters,
} from '@/store'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import type { WatermarkConfig } from '@/store/modules/setting/types'
import {
  NButton,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NSwitch,
  NWatermark,
} from 'naive-ui'
import SettingsSection from '../components/SettingsSection'

const dimensionGroups = [
  { key: 'textStyle', fields: ['fontSize', 'lineHeight', 'rotate'] },
  { key: 'tileSize', fields: ['width', 'height'] },
  { key: 'positionAndSpacing', fields: ['xOffset', 'yOffset', 'xGap', 'yGap'] },
] as const

type Dimension = (typeof dimensionGroups)[number]['fields'][number]

const presets = {
  spacious: { width: 384, height: 256, rotate: -15, cross: false },
  compact: { width: 256, height: 192, rotate: -15, cross: true },
  horizontal: { width: 280, height: 160, rotate: 0, cross: false },
} as const

export default defineComponent({
  name: 'SegmentViewsWatermark',
  setup() {
    const { t } = useI18n('preferences')
    const { getWatermarkSwitch, getWatermarkConfig, getSideBarLogo } =
      useSettingGetters()
    const { getSigningCallback } = useSigningGetters()
    const { updateSettingState } = useSettingActions()
    const { showWatermark, hiddenWatermark, setWatermarkContent } =
      useWatermark()
    const id = useId()
    const accountName = computed(() => getSigningCallback.value.name?.trim())
    const applicationTitle = computed(() => getSideBarLogo.value?.title?.trim())

    const setContent = (content: string) => {
      if (content) setWatermarkContent(content)
      else updateSettingState('watermarkConfig', { content })
    }
    const applyPreset = (preset: keyof typeof presets) =>
      updateSettingState('watermarkConfig', {
        fontSize: 16,
        lineHeight: 22,
        xOffset: 16,
        yOffset: 48,
        xGap: 0,
        yGap: 0,
        ...presets[preset],
      })
    const reset = () => {
      const defaults = getDefaultSettingConfig()

      updateSettingState('watermarkConfig', { ...defaults.watermarkConfig })
      updateSettingState('watermarkSwitch', defaults.watermarkSwitch)
    }
    const bounds = (key: Dimension) => {
      const config = getWatermarkConfig.value
      const pair = {
        width: 'xGap',
        height: 'yGap',
        xGap: 'width',
        yGap: 'height',
      } as const

      if (key in pair) {
        const other = config[pair[key as keyof typeof pair]]

        return {
          min:
            key === 'width' || key === 'height'
              ? Math.max(1, 1 - other)
              : 1 - other,
          max: 4096 - other,
        }
      }

      return key === 'fontSize' || key === 'lineHeight' ? { min: 1 } : {}
    }
    const updateDimension = (key: Dimension, value: number | null) => {
      if (value === null || !Number.isFinite(value)) return

      const config: WatermarkConfig = {
        ...getWatermarkConfig.value,
        [key]: value,
      }

      // 单元与间距共同决定 Canvas 尺寸，沿用偏好配置的有效范围。
      if (
        [config.width + config.xGap, config.height + config.yGap].some(
          (edge) => edge <= 0 || edge > 4096,
        )
      )
        return

      updateSettingState('watermarkConfig', { [key]: value })
    }

    return () => (
      <div class="r-settings-stack">
        <SettingsSection title={t('section.watermark')}>
          {{
            action: () => (
              <NButton size="small" quaternary onClick={reset}>
                {t('watermark.reset')}
              </NButton>
            ),
            default: () => (
              <div class="r-settings-switches">
                <label class="r-settings-switch">
                  <span>{t('watermark.enabled')}</span>
                  <NSwitch
                    value={getWatermarkSwitch.value}
                    aria-label={t('watermark.enabled')}
                    onUpdateValue={(enabled) =>
                      enabled ? showWatermark() : hiddenWatermark()
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
            ),
          }}
        </SettingsSection>
        <SettingsSection title={t('watermark.presets')}>
          <p class="r-settings-hint">{t('watermark.presetsHint')}</p>
          <div class="r-settings-actions">
            {(Object.keys(presets) as (keyof typeof presets)[]).map(
              (preset) => (
                <NButton
                  key={preset}
                  secondary
                  onClick={() => applyPreset(preset)}
                >
                  {t(`watermark.${preset}`)}
                </NButton>
              ),
            )}
          </div>
          <p class="r-settings-hint">{t('watermark.previewHint')}</p>
          <NWatermark
            {...getWatermarkConfig.value}
            class="r-watermark-preview"
            fullscreen={false}
            zIndex={1}
            aria-hidden="true"
          />
        </SettingsSection>
        <SettingsSection title={t('watermark.style')}>
          <NForm
            labelPlacement="top"
            showFeedback={false}
            class="r-watermark-form"
          >
            <div class="r-settings-stack">
              <NFormItem
                label={t('watermark.content')}
                labelProps={{ for: `${id}-content` }}
              >
                <NInput
                  type="textarea"
                  autosize={{ minRows: 2, maxRows: 4 }}
                  value={getWatermarkConfig.value.content}
                  inputProps={{ id: `${id}-content` }}
                  onUpdateValue={setContent}
                />
              </NFormItem>
              <div class="r-settings-actions">
                <NButton
                  size="small"
                  secondary
                  disabled={!applicationTitle.value}
                  onClick={() =>
                    setWatermarkContent(applicationTitle.value ?? '')
                  }
                >
                  {t('watermark.useApplicationTitle')}
                </NButton>
                <NButton
                  size="small"
                  secondary
                  disabled={!accountName.value}
                  onClick={() => setWatermarkContent(accountName.value ?? '')}
                >
                  {t('watermark.useAccountName')}
                </NButton>
              </div>
            </div>
            {dimensionGroups.map((group) => (
              <fieldset key={group.key} class="r-watermark-fieldset">
                <legend>{t(`watermark.${group.key}`)}</legend>
                <div
                  class={[
                    'r-settings-fields',
                    group.key === 'textStyle' && 'r-settings-fields--three',
                  ]}
                >
                  {group.fields.map((key) => (
                    <NFormItem
                      label={t(`watermark.${key}`)}
                      labelProps={{ for: `${id}-${key}` }}
                      key={key}
                    >
                      <NInputNumber
                        value={getWatermarkConfig.value[key]}
                        {...bounds(key)}
                        precision={0}
                        inputProps={{
                          id: `${id}-${key}`,
                          'aria-describedby': [
                            'width',
                            'height',
                            'xGap',
                            'yGap',
                          ].includes(key)
                            ? `${id}-bounds`
                            : void 0,
                        }}
                        onUpdateValue={(value) => updateDimension(key, value)}
                      />
                    </NFormItem>
                  ))}
                </div>
              </fieldset>
            ))}
            <p id={`${id}-bounds`} class="r-settings-hint">
              {t('watermark.dimensionsHint')}
            </p>
          </NForm>
        </SettingsSection>
      </div>
    )
  },
})
