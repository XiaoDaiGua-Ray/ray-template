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

import { NSpace, NCard, NInput, NInputGroup, NButton, NSwitch } from 'naive-ui'

const RDirective = defineComponent({
  name: 'RDirective',
  setup() {
    const state = reactive({
      copyValueOne: '我是待复制内容区域一',
      copyValueTwo: '我是待复制内容区域二',
      throttleBtnClickCount: 0,
      debounceBtnClickCount: 0,
    })

    const updateDemoValue = (key: keyof typeof state) => {
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
        <NCard title="指令示代码">该页面展示如何使用已封装好的指令</NCard>
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
        <NCard title="节流指令">
          <NSpace wrapItem={true} vertical>
            <NButton
              v-throttle={{
                func: this.updateDemoValue.bind(null, 'throttleBtnClickCount'),
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
        <NCard title="防抖指令">
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
      </NSpace>
    )
  },
})

export default RDirective
