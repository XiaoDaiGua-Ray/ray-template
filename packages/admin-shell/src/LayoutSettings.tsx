import './LayoutSettings.scss'
import {
  NButton,
  NFlex,
  NForm,
  NFormItem,
  NInputNumber,
  NSelect,
  NSwitch,
} from 'naive-ui'
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { LAYOUT_MODES } from './AdminShell'
import type { LayoutConfig } from './AdminShell'

export const LayoutSettings = defineComponent({
  name: 'LayoutSettings',
  props: {
    showDescription: Boolean,
    layout: { type: Object as PropType<LayoutConfig>, required: true },
    defaults: { type: Object as PropType<LayoutConfig>, required: true },
    translate: {
      type: Function as PropType<(key: string) => string>,
      required: true,
    },
    update: {
      type: Function as PropType<(value: Partial<LayoutConfig>) => void>,
      required: true,
    },
  },
  setup(props) {
    const text = props.translate
    const update = props.update

    return () => (
      <NFlex vertical size={16} class="r-layout-settings">
        {props.showDescription ? (
          <p class="r-layout-settings__hint">{text('description')}</p>
        ) : null}
        <div class="r-layout-presets" role="group" aria-label={text('tab')}>
          {LAYOUT_MODES.map((mode) => (
            <button
              type="button"
              class="r-layout-preset"
              key={mode}
              aria-label={text(mode)}
              title={text(mode)}
              aria-pressed={props.layout.mode === mode}
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
              <span class="r-layout-preset__label">{text(mode)}</span>
              {props.layout.mode === mode ? (
                <span class="r-layout-preset__selected" aria-hidden="true">
                  ✓
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {props.showDescription ? (
          <p class="r-layout-settings__hint">
            {text(`modeHint.${props.layout.mode}`)}
          </p>
        ) : null}
        <NForm labelPlacement="top" showFeedback={false}>
          <NFormItem label={text('contentWidth')}>
            <NSelect
              value={props.layout.contentWidth}
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
              value={props.layout.contentMaxWidth}
              disabled={props.layout.contentWidth !== 'fixed'}
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
              value={props.layout.contentPadding}
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
              value={props.layout.fixedHeader}
              onUpdateValue={(fixedHeader) => update({ fixedHeader })}
            />
          </NFormItem>
          <NFormItem label={text('fixedFooter')}>
            <NSwitch
              value={props.layout.fixedFooter}
              onUpdateValue={(fixedFooter) => update({ fixedFooter })}
            />
          </NFormItem>
        </NForm>
        <NButton onClick={() => update({ ...props.defaults })}>
          {text('reset')}
        </NButton>
      </NFlex>
    )
  },
})
