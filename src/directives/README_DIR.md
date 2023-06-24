## 全局自定义指令

### v-copy

- 参数类型: any（参数会强制被 String 方法转换）
- 默认值: ''

#### 示例

```tsx
import { NSpace, NCard, NInput, NInputGroup, NButton, NSwitch } from 'naive-ui'

const Demo = defineComponent({
  name: 'Demo',
  setup() {
    const dmeoCopyValue = ref('hello copy')

    return {
      dmeoCopyValue,
    }
  },
  render() {
    return (
      <NInputGroup>
        <NInput v-model:value={this.dmeoCopyValue} />
        <NButton v-copy={this.dmeoCopyValue}>复制</NButton>
      </NInputGroup>
    )
  },
})
```

### v-debounce

- 参数类型: DebounceBindingOptions
- 默认值:

```ts
{
  trigger: 'click',
  wait: 500,
  options: null
}
```

#### 示例

```tsx
import { NSpace, NCard, NInput, NInputGroup, NButton, NSwitch } from 'naive-ui'

const Demo = defineComponent({
  name: 'Demo',
  setup() {
    const demoValue = ref(0)

    const updateDemoValue = () => {
      demoValue.value++
    }

    return {
      demoValue,
      updateDemoValue,
    }
  },
  render() {
    return (
      <NSpace wrapItem={true} vertical>
        <NButton
          v-debounce={{
            func: this.updateDemoValue,
            trigger: 'click',
            wait: 1000,
            options: {},
          }}
        >
          点击执行
        </NButton>
        <p>我执行了{this.demoValue}次</p>
        <p>该方法将延迟 1s 执行</p>
      </NSpace>
    )
  },
})
```

### v-throttle

- 参数类型: ThrottleBindingOptions
- 默认值:

```ts
{
  trigger: 'click',
  wait: 500,
  options: null
}
```

#### 示例

```tsx
import { NSpace, NCard, NInput, NInputGroup, NButton, NSwitch } from 'naive-ui'

const Demo = defineComponent({
  name: 'Demo',
  setup() {
    const demoValue = ref(0)

    const updateDemoValue = () => {
      demoValue.value++
    }

    return {
      demoValue,
      updateDemoValue,
    }
  },
  render() {
    return (
      <NSpace wrapItem={true} vertical>
        <NButton
          v-throttle={{
            func: this.updateDemoValue,
            trigger: 'click',
            wait: 1000,
            options: {},
          }}
        >
          点击执行
        </NButton>
        <p>我执行了{this.demoValue}次</p>
        <p>该方法 1s 内仅会执行一次</p>
      </NSpace>
    )
  },
})
```
