import { useI18n } from '@/hooks'
import { useSettingActions, useSettingGetters } from '@/store'
import { getDefaultSettingConfig } from '@/store/modules/setting/constant'
import type { LayoutConfig } from '@/store/modules/setting/types'
import {
  NButton,
  NFlex,
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NSwitch,
} from 'naive-ui'

export default defineComponent({
  name: 'LayoutSettings',
  props: { showDescription: { type: Boolean, default: true } },
  setup(props) {
    const { t } = useI18n('layout')
    const { getLayoutConfig } = useSettingGetters()
    const { updateSettingState } = useSettingActions()
    const text = (key: string) => t<string>(key)
    const modes = ['side', 'top', 'mixed'] as const
    const update = (value: Partial<LayoutConfig>) =>
      updateSettingState('layoutConfig', value)

    return () => (
      <NFlex vertical size={16} class="r-layout-settings">
        {props.showDescription ? (
          <p class="r-layout-settings__hint">{text('description')}</p>
        ) : null}
        <NFlex wrap={false} class="r-layout-presets">
          {modes.map((mode) => (
            <NButton
              class="r-layout-preset"
              key={mode}
              aria-pressed={getLayoutConfig.value.mode === mode}
              type={getLayoutConfig.value.mode === mode ? 'primary' : 'default'}
              secondary
              onClick={() => update({ mode })}
            >
              <span
                class={['r-layout-preview', `r-layout-preview--${mode}`]}
                aria-hidden="true"
              >
                <span class="r-layout-preview__header" />
                <span class="r-layout-preview__aside" />
                <span class="r-layout-preview__body" />
              </span>
              <span>{text(mode)}</span>
              {getLayoutConfig.value.mode === mode ? (
                <span class="r-layout-preset__selected" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </NButton>
          ))}
        </NFlex>
        <NForm labelPlacement="top" showFeedback={false}>
          <NFormItem label={text('contentWidth')}>
            <NSelect
              value={getLayoutConfig.value.contentWidth}
              options={['fluid', 'fixed'].map((value) => ({
                value,
                label: text(value),
              }))}
              onUpdateValue={(value: LayoutConfig['contentWidth']) =>
                update({ contentWidth: value })
              }
            />
          </NFormItem>
          <NFormItem label={text('maxWidth')}>
            <NInputNumber
              value={getLayoutConfig.value.contentMaxWidth}
              disabled={getLayoutConfig.value.contentWidth !== 'fixed'}
              min={640}
              max={2560}
              step={40}
              precision={0}
              onUpdateValue={(value) => {
                if (value !== null) update({ contentMaxWidth: value })
              }}
            />
          </NFormItem>
          <NFormItem label={text('padding')}>
            <NInputNumber
              value={getLayoutConfig.value.contentPadding}
              min={0}
              max={48}
              step={4}
              precision={0}
              onUpdateValue={(value) => {
                if (value !== null) update({ contentPadding: value })
              }}
            />
          </NFormItem>
          <NFormItem label={text('fixedHeader')}>
            <NSwitch
              value={getLayoutConfig.value.fixedHeader}
              onUpdateValue={(fixedHeader) => update({ fixedHeader })}
            />
          </NFormItem>
          <NFormItem label={text('fixedFooter')}>
            <NSwitch
              value={getLayoutConfig.value.fixedFooter}
              onUpdateValue={(fixedFooter) => update({ fixedFooter })}
            />
          </NFormItem>
        </NForm>
        <NButton
          onClick={() => update({ ...getDefaultSettingConfig().layoutConfig })}
        >
          {text('reset')}
        </NButton>
      </NFlex>
    )
  },
})
