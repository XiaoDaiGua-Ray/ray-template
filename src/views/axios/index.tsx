import './index.scss'
import {
  NCard,
  NLayout,
  NDataTable,
  NLayoutContent,
  NLayoutHeader,
  NSpace,
  NInput,
  NButton,
} from 'naive-ui'
import { onAxiosTest } from '@use-api/test'

const Axios = defineComponent({
  name: 'RAxios',
  setup() {
    const state = reactive({
      weatherData: [] as IUnknownObjectKey[],
      inputCityValue: '',
    })
    const columns = [
      {
        title: '空气指数',
        key: 'air',
      },
      {
        title: '风速',
        key: 'win_meter',
      },
      {
        title: '能见度',
        key: 'visibility',
      },
      {
        title: '天气情况',
        key: 'wea_day',
      },
      {
        title: '提示',
        key: 'air_tips',
      },
    ]

    const handleInputCityValue = async (value: string) => {
      try {
        const cb = await onAxiosTest(value)

        state.weatherData = cb.data
      } catch (e) {
        window.$message.error('请求已被取消')
      }
    }

    onBeforeMount(async () => {
      const cb = await onAxiosTest('成都')

      state.weatherData = cb.data
    })

    return {
      ...toRefs(state),
      columns,
      handleInputCityValue,
    }
  },
  render() {
    return (
      <NLayout>
        <NLayoutHeader bordered>
          <NCard title="请求函数">
            基于 axios 封装，能够自动取消连续请求，避免重复渲染造成问题
            <p>
              打开控制台 =&gt; 网络 =&gt; 使用低速3g网络 =&gt;
              查看控制台被取消的请求
            </p>
          </NCard>
        </NLayoutHeader>
        <NLayoutHeader bordered>
          <NSpace class="axios-header__btn" align="center">
            <NInput
              v-model:value={this.inputCityValue}
              onInput={this.handleInputCityValue.bind(this)}
              placeholder="请输入城市"
            />
            <NButton onClick={this.handleInputCityValue.bind(this, '')}>
              搜索
            </NButton>
          </NSpace>
        </NLayoutHeader>
        <NLayoutContent>
          <NDataTable data={this.weatherData} columns={this.columns} />
        </NLayoutContent>
      </NLayout>
    )
  },
})

export default Axios
