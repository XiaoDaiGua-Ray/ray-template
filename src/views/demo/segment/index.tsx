import { RIcon, RSegment } from '@/components'
import type {
  RSegmentOptions,
  RSegmentPopover,
  RSegmentWidth,
} from '@/components'
import type { ComponentSize } from '@/types'
import {
  NAlert,
  NCard,
  NFlex,
  NGrid,
  NGridItem,
  NRadio,
  NRadioGroup,
} from 'naive-ui'

export default defineComponent({
  name: 'SegmentDemo',
  setup() {
    const baseOptions = [
      {
        label: '这是一',
        key: 'this is one',
      },
      {
        label: '这是二',
        key: 'this is two',
      },
      {
        label: '这是三',
        key: 'this is three',
      },
    ]
    const options = [
      ...baseOptions,
      {
        label: '这是四',
        key: 'this is four',
        slots: {
          default: () => '我是自定义',
        },
      },
    ]
    const disabledOptions: RSegmentOptions[] = [
      ...baseOptions,
      {
        label: '不许点',
        key: 'disabled option',
        disabled: true,
      },
      {
        label: 'popover',
        key: 'popover',
        popover: '我是 popover',
      },
      {
        label: 'popover options',
        key: 'popover options',
        popover: {
          label: '我是配置项的 popover',
        },
      },
    ]
    const iconOptions = [
      {
        label: '设置',
        key: 'setting',
        icon: <RIcon name="setting" />,
      },
      {
        label: '刷新',
        key: 'reload',
        icon: <RIcon name="reload" />,
      },
      {
        label: '搜索',
        key: 'search',
        icon: <RIcon name="search" />,
        popover: '我是搜索',
      },
    ]
    const segmentValueOne = ref('this is three')
    const size = ref<ComponentSize>('medium')
    const width = ref<RSegmentWidth>('block')

    const segmentChange = (value: string | number) => {
      window.$message.info(String(value))
    }

    return {
      baseOptions,
      options,
      segmentValueOne,
      segmentChange,
      size,
      width,
      disabledOptions,
      iconOptions,
    }
  },
  render() {
    const { options, baseOptions, disabledOptions, iconOptions } = this
    const { segmentChange } = this

    return (
      <NFlex vertical>
        <NAlert title="警告⚠️" type="warning">
          n-tabs 默认情况下会从 slot 获取默认展示的 tab 值，因此会产生一个 vue
          slot 的 warning。如果你不想看到这个 warning，请设定一个
          default-value。
        </NAlert>
        <NAlert title="已知问题" type="warning">
          由于 NTabs 设计缘故，手动设置 width 为 fitContent 后，配置了 disabled,
          popover 的配置项，会丢失过度效果。具体可以看下面的例子。
          <br />
          解决方法，在该组件外层包一层 div，设置宽度，但是不能为 fit-content。
        </NAlert>
        <NCard title="分段器">
          <h3>
            该组件基于 NTabs + NTabPane 封装，所以保留了一些该组件的特性。
          </h3>
        </NCard>
        <NGrid cols={2} xGap={8} yGap={12}>
          <NGridItem span={1}>
            <NCard title="基础非受控分段器">
              <RSegment defaultValue="this is two" options={baseOptions} />
            </NCard>
          </NGridItem>
          <NGridItem span={1}>
            <NCard title="自定义分段器插槽">
              <RSegment defaultValue={this.segmentValueOne} options={options} />
            </NCard>
          </NGridItem>
          <NGridItem span={1}>
            <NCard title="updateValue 事件">
              <RSegment
                v-model:value={this.segmentValueOne}
                defaultValue="this is two"
                options={disabledOptions}
                onUpdateValue={segmentChange.bind(this)}
                width="block"
              />
            </NCard>
          </NGridItem>
          <NGridItem span={1}>
            <NCard title="自适应宽度">
              <RSegment
                defaultValue="setting"
                options={iconOptions}
                width="block"
              />
            </NCard>
          </NGridItem>
          <NGridItem span={2}>
            <NCard title="尺寸">
              <NFlex vertical size="large">
                <NRadioGroup v-model:value={this.size}>
                  <NRadio value="small">小</NRadio>
                  <NRadio value="medium">不小</NRadio>
                  <NRadio value="large">不太小</NRadio>
                </NRadioGroup>
                <RSegment
                  defaultValue="this is two"
                  options={baseOptions}
                  size={this.size}
                  width="block"
                />
              </NFlex>
            </NCard>
          </NGridItem>
          <NGridItem span={2}>
            <NCard title="宽度">
              <NFlex vertical size="large">
                <NAlert title="注意" type="info">
                  RSegment 组件宽度默认为
                  fitContent，按照内容自适应宽度；如果需要自适应宽度，请设置
                  width 为 block；如果需要手动指定宽度请设置一个数字。
                </NAlert>
                <NRadioGroup v-model:value={this.width}>
                  <NRadio value="fitContent">fitContent</NRadio>
                  <NRadio value="block">block</NRadio>
                  <NRadio value={800}>800</NRadio>
                </NRadioGroup>
                <RSegment
                  defaultValue="this is two"
                  options={disabledOptions}
                  width={this.width}
                />
              </NFlex>
            </NCard>
          </NGridItem>
        </NGrid>
      </NFlex>
    )
  },
})
