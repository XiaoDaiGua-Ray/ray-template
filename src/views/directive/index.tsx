/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-06-24
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import {
  NSpace,
  NCard,
  NInput,
  NInputGroup,
  NButton,
  NSwitch,
  NForm,
  NFormItem,
} from 'naive-ui'

import type { ConditionalPick } from '@/types/type-utils'

const RDirective = defineComponent({
  name: 'RDirective',
  setup() {
    const state = reactive({
      copyValueOne: '我是待复制内容区域一',
      copyValueTwo: '我是待复制内容区域二',
      throttleBtnClickCount: 0,
      debounceBtnClickCount: 0,
      disabledValue: false,
    })

    const updateDemoValue = (
      key: keyof ConditionalPick<typeof state, number>,
    ) => {
      state[key]++
    }

    return {
      ...toRefs(state),
      updateDemoValue,
    }
  },
  render() {
    return (
      <NSpace wrapItem={false}>
        <NCard title="指令">该页面展示如何使用已封装好的指令</NCard>
        <NCard title="文本复制示例一">
          <NInputGroup>
            <NInput v-model:value={this.copyValueOne} />
            <NButton v-copy={this.copyValueOne}>复制</NButton>
          </NInputGroup>
        </NCard>
        <NCard title="文本复制示例二">
          <NInputGroup>
            <NInput v-model:value={this.copyValueTwo} />
            <NButton v-copy={this.copyValueTwo}>复制</NButton>
          </NInputGroup>
        </NCard>
        <NCard title="节流">
          <NSpace wrapItem={true} vertical>
            <NButton
              v-throttle={{
                func: this.updateDemoValue.bind(null, 'debounceBtnClickCount'),
                trigger: 'click',
                wait: 1000,
                options: {},
              }}
            >
              点击执行
            </NButton>
            <p>我执行了{this.throttleBtnClickCount}次</p>
            <p>该方法 1s 内仅会执行一次</p>
          </NSpace>
        </NCard>
        <NCard title="防抖">
          <NSpace wrapItem={true} vertical>
            <NButton
              v-debounce={{
                func: this.updateDemoValue.bind(null, 'debounceBtnClickCount'),
                trigger: 'click',
                wait: 1000,
                options: {},
              }}
            >
              点击执行
            </NButton>
            <p>我执行了{this.debounceBtnClickCount}次</p>
            <p>该方法将延迟 1s 执行</p>
          </NSpace>
        </NCard>
        <NCard title="禁用">
          <NSpace vertical>
            <NSwitch v-model:value={this.disabledValue}>
              {{
                checked: () => '取消',
                unchecked: () => '禁用',
              }}
            </NSwitch>
            <NCard title="描述">
              <p>
                该指令会强制禁用（通过 css 层面）禁用元素交互。但是 naive ui
                组件提供了完整的 disabled
                属性，所以在组件库有禁用需求时，直接调用组件库 disabled
                属性即可。但是值得注意的是，该指令优先级最高，会覆盖组件
                disabled 属性。
              </p>
            </NCard>
            <NCard title="原生表单">
              <form v-disabled={this.disabledValue}>
                <input type="text" placeholder="请输入" />
                <button>提交</button>
              </form>
            </NCard>
            <NCard title="文本内容">
              <NSpace vertical>
                <p v-disabled={this.disabledValue}>我是可以被禁用的文本内容</p>
              </NSpace>
            </NCard>
            <NCard title="naive 组件">
              <NSpace vertical justify="start">
                <NForm v-disabled={this.disabledValue}>
                  <NFormItem>
                    <NInput />
                  </NFormItem>
                </NForm>
                <NButton v-disabled={this.disabledValue}>按钮</NButton>
                <NSwitch v-disabled={this.disabledValue}></NSwitch>
              </NSpace>
            </NCard>
          </NSpace>
        </NCard>
      </NSpace>
    )
  },
})

export default RDirective
