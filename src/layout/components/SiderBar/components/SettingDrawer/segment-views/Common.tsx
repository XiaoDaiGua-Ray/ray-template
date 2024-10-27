import {
  NFlex,
  NFormItem,
  NDivider,
  NSwitch,
  NForm,
  NInputNumber,
  NDynamicTags,
} from 'naive-ui'
import { RIcon } from '@/components'

import { SETTING_DRAWER_INJECT_KEY } from '../constant'
import { useSettingActions } from '@/store'

export default defineComponent({
  name: 'SegmentViewsCommon',
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
          labelPlacement="left"
          class="setting-drawer__overrides-form"
          showFeedback={false}
        >
          <NFormItem label="页面缓存">
            <NSwitch
              v-model:value={model.keepAliveConfig!.setupKeepAlive}
              onUpdateValue={(bool) =>
                updateSettingState('keepAliveConfig', {
                  setupKeepAlive: bool,
                })
              }
            />
          </NFormItem>
          <NFormItem label="动态浏览器标题">
            <NSwitch
              v-model:value={model.dynamicDocumentTitle}
              onUpdateValue={(bool) =>
                updateSettingState('dynamicDocumentTitle', bool)
              }
            />
          </NFormItem>
        </NForm>
        <NDivider>缓存设置</NDivider>
        <NForm
          labelPlacement="top"
          showFeedback={true}
          showRequireMark={false}
          model={model.keepAliveConfig}
        >
          <NFormItem
            label="最大缓存数"
            feedback={
              computed(() => {
                if (model.keepAliveConfig!.maxKeepAliveLength <= 0) {
                  return '设置为【0】时，缓存将会失效'
                }

                return ''
              }).value
            }
          >
            <NInputNumber
              disabled={!model.keepAliveConfig!.setupKeepAlive}
              v-model:value={model.keepAliveConfig!.maxKeepAliveLength}
              min={0}
              precision={0}
              showButton={false}
              onUpdateValue={(val) =>
                updateSettingState('keepAliveConfig', {
                  maxKeepAliveLength: val!,
                })
              }
            />
          </NFormItem>
          <NFormItem label="排除缓存">
            <NDynamicTags
              type="success"
              v-model:value={model.keepAliveConfig!.keepAliveExclude}
            />
          </NFormItem>
        </NForm>
      </NFlex>
    )
  },
})
