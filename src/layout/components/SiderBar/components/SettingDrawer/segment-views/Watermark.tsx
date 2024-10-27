import {
  NFlex,
  NFormItem,
  NDivider,
  NSwitch,
  NForm,
  NInputNumber,
  NInput,
} from 'naive-ui'

import { SETTING_DRAWER_INJECT_KEY } from '../constant'
import { useSettingActions } from '@/store'

export default defineComponent({
  name: 'SegmentViewsWatermark',
  setup() {
    const model = inject(SETTING_DRAWER_INJECT_KEY, {})
    const { updateSettingState } = useSettingActions()

    return {
      model,
      updateSettingState,
    }
  },
  render() {
    const { model, updateSettingState } = this

    return (
      <NFlex vertical style="width: 100%;" size={[0, 0]}>
        <NDivider>基础设置</NDivider>
        <NForm
          showFeedback={false}
          showRequireMark={false}
          class="setting-drawer__overrides-form"
          labelPlacement="left"
        >
          <NFormItem label="全屏水印">
            <NSwitch
              v-model:value={model.watermarkSwitch}
              onUpdateValue={(bool) =>
                updateSettingState('watermarkSwitch', bool)
              }
            />
          </NFormItem>
          <NFormItem label="跨边界显示">
            <NSwitch
              v-model:value={model.watermarkConfig!.cross}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  cross: val,
                })
              }
            />
          </NFormItem>
        </NForm>
        <NDivider>个性化水印</NDivider>
        <NForm
          showFeedback={true}
          showRequireMark={false}
          class="setting-drawer__overrides-form"
        >
          <NFormItem label="水印内容">
            <NInput
              v-model:value={model.watermarkConfig!.content}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  content: val,
                })
              }
            />
          </NFormItem>
          <NFormItem label="字体尺寸">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.fontSize}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  fontSize: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="字体行高">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.lineHeight}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  lineHeight: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="字体宽度">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.width}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  width: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="字体高度">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.height}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  height: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="x轴偏移">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.xOffset}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  xOffset: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="x轴间隙">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.xGap}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  xGap: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="y轴偏移">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.yOffset}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  yOffset: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="y轴间隙">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.yGap}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  yGap: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="旋转角度">
            <NInputNumber
              precision={0}
              showButton={false}
              v-model:value={model.watermarkConfig!.rotate}
              onUpdateValue={(val) =>
                updateSettingState('watermarkConfig', {
                  rotate: val!,
                })
              }
            />
          </NFormItem>
        </NForm>
      </NFlex>
    )
  },
})
