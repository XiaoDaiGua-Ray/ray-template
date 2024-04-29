/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2024-04-14
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { RBarcode } from '@/components'
import {
  NAlert,
  NCard,
  NFlex,
  NGrid,
  NGridItem,
  NInput,
  NSwitch,
} from 'naive-ui'

export default defineComponent({
  name: 'BarcodeDemo',
  setup() {
    const baseOptions = {
      width: 4,
    }
    const loading = ref(false)
    const text = ref('RayTemplate')

    return {
      baseOptions,
      loading,
      text,
    }
  },
  render() {
    const { baseOptions } = this

    return (
      <NGrid cols={2} xGap={12} yGap={12}>
        <NGridItem span={2}>
          <NCard title="详细配置项说明">
            点击查看详细配置项：
            <a href="https://github.com/lindell/JsBarcode/wiki/Options">
              js-barcode options
            </a>
            。
          </NCard>
        </NGridItem>
        <NGridItem span={1}>
          <NCard title="基础条形码">
            <RBarcode
              text="RayTemplate"
              options={{
                ...baseOptions,
              }}
            />
          </NCard>
        </NGridItem>
        <NGridItem span={1}>
          <NCard title="自定义颜色条形码">
            <RBarcode
              text="RayTemplate"
              options={{
                ...baseOptions,
                lineColor: 'red',
              }}
            />
          </NCard>
        </NGridItem>
        <NGridItem span={1}>
          <NCard title="pharmacode 模式">
            <NFlex vertical>
              <NAlert type="warning" title="注意">
                该模式下，条形码只能渲染有效数值，否则将会渲染失败。可以查看官网说明：
                <a href="https://github.com/lindell/JsBarcode/wiki/pharmacode">
                  pharmacode
                </a>
                。
              </NAlert>
              <RBarcode
                text="1234"
                format="pharmacode"
                options={{
                  width: 4,
                  height: 40,
                  displayValue: false,
                  background: '#eee',
                }}
              />
            </NFlex>
          </NCard>
        </NGridItem>
        <NGridItem span={1}>
          <NCard title="codabar 模式">
            <NFlex vertical>
              <NAlert type="warning" title="注意">
                该模式下，需要注意 text 中的特殊字符，可以查看官网说明：
                <a href="https://github.com/lindell/JsBarcode/wiki/codabar">
                  codabar
                </a>
                。
              </NAlert>
              <RBarcode
                text="1234"
                format="codabar"
                options={{
                  width: 4,
                  height: 40,
                  displayValue: false,
                  background: '#eee',
                }}
              />
            </NFlex>
          </NCard>
        </NGridItem>
        <NGridItem span={1}>
          <NCard title="有状态的条形码">
            <NFlex vertical size="large" justify="flex-start" inline>
              <NSwitch v-model:value={this.loading} style="width: fit-content">
                {{
                  checked: () => 'loading...',
                  unchecked: () => 'success!',
                }}
              </NSwitch>
              <RBarcode text="RayTemplate" loading={this.loading} />
            </NFlex>
          </NCard>
        </NGridItem>
        <NGridItem span={1}>
          <NCard title="watchText 主动监听 text 变化">
            <NFlex vertical>
              <NInput v-model:value={this.text} />
              <RBarcode text={this.text} watchText />
            </NFlex>
          </NCard>
        </NGridItem>
      </NGrid>
    )
  },
})
