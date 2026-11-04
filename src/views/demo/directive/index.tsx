import type { ConditionalPick } from '@/types'
import {
  NAlert,
  NButton,
  NCard,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NInputGroup,
  NInputNumber,
  NSwitch,
} from 'naive-ui'
import DemoPage from '../components/DemoPage'
import DemoResult from '../components/DemoResult'

const RDirective = defineComponent({
  name: 'RDirective',
  setup() {
    const state = reactive({
      copyValueOne: '我是待复制内容区域一',
      copyValueTwo: '我是待复制内容区域二',
      throttleBtnClickCount: 0,
      debounceBtnClickCount: 0,
      disabledValue: false,
      formCount: 0,
    })
    const ellipsisLineClamp = ref(2)

    const updateDemoValue = (
      key: keyof ConditionalPick<typeof state, number>,
    ) => {
      state[key]++
    }

    return {
      ...toRefs(state),
      updateDemoValue,
      ellipsisLineClamp,
    }
  },
  render() {
    return (
      <DemoPage
        title={this.$t('menu.Directive')}
        description={this.$t('showcase.directiveDescription')}
        eyebrow="RAY TEMPLATE / EXAMPLES"
      >
        <div class="r-demo-grid">
          <NCard title={this.$t('demoDetails.directive.ripple')}>
            <NFlex vertical>
              <NFlex>
                <NButton v-ripple type="info">
                  {this.$t('demoDetails.directive.ripplePointer')}
                </NButton>
                <NButton v-ripple={[true, ['center']]}>
                  {this.$t('demoDetails.directive.rippleCenter')}
                </NButton>
              </NFlex>
            </NFlex>
          </NCard>
          <NCard title={this.$t('demoDetails.directive.ellipsis')}>
            <NFlex vertical>
              <NCard title={this.$t('demoDetails.directive.single')}>
                <div
                  v-ellipsis={{
                    type: 'block',
                    width: '100px',
                  }}
                >
                  我是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本。
                </div>
              </NCard>
              <NCard title={this.$t('demoDetails.directive.multi')}>
                <NFlex vertical size="large">
                  <NAlert title="注意" type="warning">
                    该方法基于非标准属性实现（-webkit-line-clamp），可能会有兼容性问题，所以请谨慎使用。
                    详情参考：
                    <a href="https://caniuse.com/?search=line-clamp">
                      can i use
                    </a>
                  </NAlert>
                  <div
                    v-ellipsis={{
                      type: 'line',
                      width: '100px',
                      line: this.ellipsisLineClamp,
                    }}
                  >
                    我是一段很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长很长的文本。
                  </div>
                  <NInputNumber
                    v-model:value={this.ellipsisLineClamp}
                    min={1}
                  />
                </NFlex>
              </NCard>
            </NFlex>
          </NCard>
          <NCard title={this.$t('demoDetails.directive.copy1')}>
            <NInputGroup>
              <NInput v-model:value={this.copyValueOne} />
              <NButton v-copy={this.copyValueOne}>
                {this.$t('demoDetails.directive.copy')}
              </NButton>
            </NInputGroup>
          </NCard>
          <NCard title={this.$t('demoDetails.directive.copy2')}>
            <NInputGroup>
              <NInput v-model:value={this.copyValueTwo} />
              <NButton v-copy={this.copyValueTwo}>
                {this.$t('demoDetails.directive.copy')}
              </NButton>
            </NInputGroup>
          </NCard>
          <NCard title={this.$t('demoDetails.directive.throttle')}>
            <NFlex vertical>
              <NButton
                v-throttle={{
                  func: this.updateDemoValue.bind(
                    null,
                    'throttleBtnClickCount',
                  ),
                  trigger: 'click',
                  wait: 3000,
                  options: {},
                }}
              >
                {this.$t('demoDetails.directive.run')}
              </NButton>
              <DemoResult label={this.$t('demoDetails.directive.calls')}>
                {this.throttleBtnClickCount}
              </DemoResult>
            </NFlex>
          </NCard>
          <NCard title={this.$t('demoDetails.directive.debounce')}>
            <NFlex vertical>
              <NButton
                v-debounce={{
                  func: this.updateDemoValue.bind(
                    null,
                    'debounceBtnClickCount',
                  ),
                  trigger: 'click',
                  wait: 3000,
                  options: {},
                }}
              >
                {this.$t('demoDetails.directive.run')}
              </NButton>
              <DemoResult label={this.$t('demoDetails.directive.calls')}>
                {this.debounceBtnClickCount}
              </DemoResult>
            </NFlex>
          </NCard>
          <NCard title={this.$t('demoDetails.directive.disabled')}>
            <NFlex vertical>
              <NSwitch v-model:value={this.disabledValue}>
                {{
                  checked: () => '取消',
                  unchecked: () => '禁用',
                }}
              </NSwitch>
              <NCard title={this.$t('demoDetails.directive.nativeForm')}>
                <form
                  v-disabled={this.disabledValue}
                  onSubmit={(event) => {
                    event.preventDefault()
                    this.formCount += 1
                  }}
                >
                  <NInputGroup>
                    <NInput
                      inputProps={{
                        'aria-label': this.$t(
                          'demoDetails.directive.formInput',
                        ),
                      }}
                    />
                    <NButton attrType="submit">
                      {this.$t('demoDetails.directive.submit')}
                    </NButton>
                  </NInputGroup>
                </form>
                <DemoResult label={this.$t('demoDetails.directive.calls')}>
                  {this.formCount}
                </DemoResult>
              </NCard>
              <NCard title={this.$t('demoDetails.directive.text')}>
                <NFlex vertical>
                  <p v-disabled={this.disabledValue}>
                    我是可以被禁用的文本内容
                  </p>
                </NFlex>
              </NCard>
              <NCard title={this.$t('demoDetails.directive.naive')}>
                <NFlex vertical justify="start">
                  <NForm v-disabled={this.disabledValue}>
                    <NFormItem>
                      <NInput />
                    </NFormItem>
                  </NForm>
                  <NButton v-disabled={this.disabledValue}>按钮</NButton>
                  <NSwitch v-disabled={this.disabledValue}></NSwitch>
                </NFlex>
              </NCard>
            </NFlex>
          </NCard>
        </div>
      </DemoPage>
    )
  },
})

export default RDirective
