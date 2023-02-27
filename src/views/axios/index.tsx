import './index.scss'
import {
  NCard,
  NLayout,
  NDataTable,
  NLayoutContent,
  NLayoutHeader,
  NSpace,
  NInput,
} from 'naive-ui'
import { onAxiosTest } from '@use-api/test'

const Axios = defineComponent({
  name: 'Axios',
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
      const cb = await onAxiosTest(value)

      state.weatherData = cb.data as unknown as IUnknownObjectKey[]
    }

    onBeforeMount(async () => {
      const cb = await onAxiosTest('成都')
      state.weatherData = cb.data as unknown as IUnknownObjectKey[]
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
            基于 axios 封装, 能够自动取消连续请求, 避免重复渲染造成问题.
          </NCard>
        </NLayoutHeader>
        <NLayoutHeader bordered>
          <NSpace
            class="axios-header__btn"
            align="center"
            justify="space-between"
          >
            <NInput
              v-model:value={this.inputCityValue}
              onInput={this.handleInputCityValue.bind(this)}
              placeholder="请输入城市"
            />
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
