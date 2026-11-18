## 全局自定义指令

### v-copy

- 参数类型: any（参数会强制被 String 方法强制转换）
- 默认值: ''

#### 示例

```tsx
import { NButton, NCard, NFlex, NInput, NInputGroup, NSwitch } from 'naive-ui'

const Demo = defineComponent({
  name: 'Demo',
  setup() {
    const demoCopyValue = ref('hello copy')

    return {
      demoCopyValue,
    }
  },
  render() {
    return (
      <NInputGroup>
        <NInput v-model:value={this.demoCopyValue} />
        <NButton v-copy={this.demoCopyValue}>复制</NButton>
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
import { NButton, NCard, NFlex, NInput, NInputGroup, NSwitch } from 'naive-ui'

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
      <NFlex wrapItem={true} vertical>
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
      </NFlex>
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
import { NButton, NCard, NFlex, NInput, NInputGroup, NSwitch } from 'naive-ui'

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
      <NFlex wrapItem={true} vertical>
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
      </NFlex>
    )
  },
})
```

### v-disabled

- 参数类型: boolean
- 默认值: false

#### Tip

> 原生表单控件使用 `disabled` 属性。表单和其他容器使用 `inert` 暂停整棵子树的键盘和指针交互。组件提供 `disabled` prop 时优先使用组件自身的接口。

#### 示例

```tsx
import {
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NSwitch,
} from 'naive-ui'

const Demo = defineComponent({
  name: 'Demo',
  setup() {
    const disabledValue = ref(false)

    return {
      disabledValue,
    }
  },
  render() {
    return (
      <NFlex vertical>
        <NSwitch v-model:value={this.disabledValue}>
          {{
            checked: () => '取消',
            unchecked: () => '禁用',
          }}
        </NSwitch>
        <p>
          该指令会强制禁用（通过 css 层面）禁用元素交互。但是 naive ui
          组件提供了完整的 disabled
          属性，所以在组件库有禁用需求时，直接调用组件库 disabled 属性即可
        </p>
        <NFlex vertical wrapItem={false}>
          <NCard title="原生表单" bordered={false}>
            <NFlex vertical wrapItem={false}>
              <form v-disabled={this.disabledValue}>
                <input type="text" placeholder="请输入" />
                <button>提交</button>
              </form>
            </NFlex>
          </NCard>
          <NCard title="文本内容" bordered={false}>
            <NFlex vertical wrapItem={false}>
              <p v-disabled={this.disabledValue}>我是可以被禁用的文本内容</p>
            </NFlex>
          </NCard>
          <NCard title="naive 组件" bordered={false}>
            <NFlex vertical wrapItem={false} justify="start">
              <NButton v-disabled={this.disabledValue}>按钮</NButton>
              <NForm v-disabled={this.disabledValue}>
                <NFormItem label="名称">
                  <NInput />
                </NFormItem>
              </NForm>
              <NSwitch v-disabled={this.disabledValue}></NSwitch>
            </NFlex>
          </NCard>
        </NFlex>
      </NFlex>
    )
  },
})
```
