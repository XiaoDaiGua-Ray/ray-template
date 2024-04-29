/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-07
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NLayout, NCard, NDynamicTags, NFlex, NInputNumber } from 'naive-ui'

import { add, subtract, multiply, divide, distribute, format } from '@/utils'

const CalculatePrecision = defineComponent({
  name: 'CalculatePrecision',
  setup() {
    const state = reactive({
      addOptions: ['1', '0.2', '0.1', '1.1'],
      subtractOptions: ['1', '0.2', '0.1', '1.1'],
      multiplyOptions: ['1', '0.2', '0.1', '1.1'],
      divideOptions: ['1', '0.2', '0.1', '1.1'],
      distributeValue: 12,
      distributeOutputValue: [] as unknown[],
      distributeLength: 3,
    })
    const actionMap = {
      addOptions: add,
      subtractOptions: subtract,
      multiplyOptions: multiply,
      divideOptions: divide,
    }

    const copilotFunc = (value: string[], path: keyof typeof actionMap) => {
      const action = actionMap[path]
      const result = action(...value)

      return '结果: ' + format(result)
    }

    const updateDistributeValue = () => {
      nextTick().then(() => {
        state.distributeOutputValue = distribute(
          state.distributeValue,
          state.distributeLength,
        )
      })
    }

    updateDistributeValue()

    return {
      ...toRefs(state),
      copilotFunc,
      updateDistributeValue,
    }
  },
  render() {
    return (
      <NLayout>
        <h2 style="margin: 0 0 20px 0">
          计算方法，默认都保留八位小数与四舍五入，可以根据 format 方法自行转换
        </h2>
        <h3 style="margin: 0 0 20px 0">
          示例方法都基于 currency.js
          封装，利用其精度处理能力封装了常用的一些计算方法，解决精度问题。如果需要其他的方法请阅读官方文档
          https://currency.js.org/#subtract
        </h3>

        <NFlex vertical>
          <NCard title="加法">
            {{
              default: () => (
                <NDynamicTags
                  v-model:value={this.addOptions}
                  onUpdateValue={(value: string[]) => {
                    this.copilotFunc(value, 'addOptions')
                  }}
                />
              ),
              footer: () => {
                return this.copilotFunc(this.addOptions, 'addOptions')
              },
            }}
          </NCard>
          <NCard title="减法">
            {{
              default: () => (
                <NDynamicTags
                  v-model:value={this.subtractOptions}
                  onUpdateValue={(value: string[]) => {
                    this.copilotFunc(value, 'subtractOptions')
                  }}
                />
              ),
              footer: () => {
                return this.copilotFunc(this.subtractOptions, 'subtractOptions')
              },
            }}
          </NCard>
          <NCard title="乘法">
            {{
              default: () => (
                <NDynamicTags
                  v-model:value={this.multiplyOptions}
                  onUpdateValue={(value: string[]) => {
                    this.copilotFunc(value, 'multiplyOptions')
                  }}
                />
              ),
              footer: () => {
                return this.copilotFunc(this.multiplyOptions, 'multiplyOptions')
              },
            }}
          </NCard>
          <NCard title="除法（非取模）">
            {{
              default: () => (
                <NDynamicTags
                  v-model:value={this.divideOptions}
                  onUpdateValue={(value: string[]) => {
                    this.copilotFunc(value, 'divideOptions')
                  }}
                />
              ),
              footer: () => {
                return this.copilotFunc(this.divideOptions, 'divideOptions')
              },
            }}
          </NCard>
          <NCard title="平分一个值">
            {{
              default: () => (
                <NFlex>
                  <NInputNumber
                    v-model:value={this.distributeValue}
                    onUpdateValue={() => {
                      this.updateDistributeValue()
                    }}
                  />
                  <NInputNumber
                    v-model:value={this.distributeLength}
                    onUpdateValue={() => {
                      this.updateDistributeValue()
                    }}
                  />
                </NFlex>
              ),
              footer: () => {
                return '结果: ' + this.distributeOutputValue.join(', ')
              },
            }}
          </NCard>
        </NFlex>
      </NLayout>
    )
  },
})

export default CalculatePrecision
