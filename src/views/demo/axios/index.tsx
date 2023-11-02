import './index.scss'

import { NCard, NLayout, NSpace, NInput, NButton } from 'naive-ui'
import { getWeather, getTypicode } from '@/api/demo/test'
import { useRequest, useHookPlusRequest } from '@/axios/index'

const Axios = defineComponent({
  name: 'RAxios',
  setup() {
    const state = reactive({
      weatherData: [],
      inputCityValue: null,
      throttleDemoInputValue: null,
      debounceDemoInputValue: null,
      weatherDemoInputValue: null,
    })

    const {
      data: throttleDemoValue,
      loading: throttleDemoLoading,
      run: throttleDemoRun,
    } = useHookPlusRequest(getTypicode, {
      throttleWait: 1000,
      manual: true,
    })
    const {
      data: debounceDemoValue,
      loading: debounceDemoLoading,
      run: debounceDemoRun,
    } = useHookPlusRequest(getTypicode, {
      debounceWait: 1000,
      manual: true,
    })
    const {
      data: weatherDemoValue,
      loading: weatherDemoLoading,
      run: weatherDemoRun,
    } = useHookPlusRequest(getWeather, {
      throttleWait: 1000,
      manual: true,
    })
    const {
      data: demoData,
      loading: demoLoading,
      run: demoRun,
    } = useRequest<{
      title: string
    }>(
      {
        url: 'https://jsonplaceholder.typicode.com/todos/1',
        method: 'get',
        cancelConfig: {
          needCancel: true,
        },
      },
      {
        manual: true,
      },
    )

    return {
      ...toRefs(state),
      throttleDemoValue,
      throttleDemoLoading,
      throttleDemoRun,
      debounceDemoValue,
      debounceDemoLoading,
      debounceDemoRun,
      weatherDemoValue,
      weatherDemoLoading,
      weatherDemoRun,
      demoData,
      demoLoading,
      demoRun,
    }
  },
  render() {
    return (
      <NLayout>
        <NSpace vertical>
          <h1>请求</h1>
          <NCard>
            <h2>useRequest</h2>
            <p>支持配置化请求数据</p>
            <h2>useHookPlusRequest</h2>
            <p>
              支持包裹一个拥有 promise 状态的异步函数，可以用来包裹一个 axios
              请求返回值方法
            </p>
          </NCard>
          <h1>使用 useRequest 获取</h1>
          <NCard title="请求函数">
            <h3>
              1.基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题
            </h3>
            <h3>
              2.打开控制台 =&gt; 网络 =&gt; 使用低速3g网络 =&gt;
              查看控制台被取消的请求
            </h3>
            <h3>3.详情请查看文档</h3>
          </NCard>
          <NCard title="useRequest示例（手动触发）">
            <NSpace vertical>
              <NButton onClick={this.demoRun.bind(this)}>获取数据</NButton>
              <h3>
                结果:&nbsp;
                {this.demoLoading ? '获取中...' : this.demoData?.title}
              </h3>
            </NSpace>
          </NCard>
          <h1>使用 useHookPlusRequest 获取</h1>
          <NCard title="节流">
            <NSpace vertical>
              <NInput
                v-model:value={this.throttleDemoInputValue}
                onUpdateValue={() => {
                  this.throttleDemoRun()
                }}
              />
              <h3>不论触发多少次，一秒钟之内仅会触发一次</h3>
              <h3>
                当前状态:&nbsp;
                {this.throttleDemoLoading ? '获取中...' : '获取成功!!!'}
              </h3>
            </NSpace>
          </NCard>
          <NCard title="防抖">
            <NSpace vertical>
              <NInput
                v-model:value={this.debounceDemoInputValue}
                onUpdateValue={() => {
                  this.debounceDemoRun()
                }}
              />
              <h3>一秒后才会执行，如果中途重新请求，则会重新计时</h3>
              <h3>
                当前状态:&nbsp;
                {this.debounceDemoLoading ? '获取中...' : '获取成功!!!'}
              </h3>
            </NSpace>
          </NCard>
          <NCard title="获取气候">
            <NSpace vertical>
              <NInput
                v-model:value={this.weatherDemoInputValue}
                onUpdateValue={(val) => {
                  this.weatherDemoRun(val)
                }}
              />
              <h3>该示例演示了如何根据动态值获取数据</h3>
              <h3>
                当前状态:&nbsp;
                {this.weatherDemoLoading ? '获取中...' : '获取成功!!!'}
              </h3>
            </NSpace>
          </NCard>
        </NSpace>
      </NLayout>
    )
  },
})

export default Axios
