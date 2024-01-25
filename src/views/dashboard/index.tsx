import './index.scss'

import {
  NCard,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NFlex,
  NP,
  NH6,
} from 'naive-ui'
import { RIcon } from '@/components'
import RayLink from '@/app-components/app/RayLink'

const Dashboard = defineComponent({
  name: 'RDashboard',
  setup() {
    const coverLetterOptions = [
      {
        label: '掌握搬砖框架',
        des: () => (
          <NFlex>
            <NTag type="success">Vue3.x</NTag>
            <NTag type="info">React</NTag>
          </NFlex>
        ),
      },
      {
        label: '从事搬砖时长',
        des: () => (
          <NFlex>
            <NTag type="success">练习时长两年半的小白前端搬砖师</NTag>
          </NFlex>
        ),
      },
      {
        label: '个人',
        des: () => (
          <NFlex align="center">
            <RIcon name="ray" size="22" />
            努力搬砖、努力摸鱼, 建设美丽家园
          </NFlex>
        ),
        span: 2,
      },
      {
        label: '补充说明',
        des: () => (
          <NFlex align="center">
            如果有希望补充的功能可以在
            <a
              class="dashboard-link"
              href="https://github.com/XiaoDaiGua-Ray/ray-template"
            >
              GitHub
            </a>
            提一个 Issues
          </NFlex>
        ),
        span: 2,
      },
    ]
    const technologyTagOptions = [
      {
        label: 'Vue3.x',
        value: 'Vue3.x',
      },
      {
        label: 'Vite4.0',
        value: 'Vite4.0',
      },
      {
        label: 'Pinia',
        value: 'Pinia',
      },
      {
        label: 'TSX',
        value: 'TSX',
      },
    ]

    return {
      coverLetterOptions,
      technologyTagOptions,
    }
  },
  render() {
    return (
      <NFlex vertical>
        <NCard>
          {{
            header: () => <RIcon name="ray" size="64" />,
            default: () => '当你看见这个页面后, 就说明项目已经启动成功了~',
          }}
        </NCard>
        <NCard title="个人介绍">
          <NDescriptions bordered labelPlacement="left" column={2}>
            {this.coverLetterOptions.map((curr) => (
              <NDescriptionsItem
                key={curr.label}
                label={curr.label}
                span={curr?.span}
              >
                {curr.des()}
              </NDescriptionsItem>
            ))}
          </NDescriptions>
        </NCard>
        <NCard title="项目介绍">
          <NH6>技术栈</NH6>
          <NP>
            <NFlex>
              {this.technologyTagOptions.map((curr) => (
                <NTag key={curr.value} type="info">
                  {curr.label}
                </NTag>
              ))}
            </NFlex>
          </NP>
          <NH6>项目介绍</NH6>
          <NP>
            预设了最佳构建体验的配置与常用搬砖工具。意在提供一个简洁、快速上手的模板。
          </NP>
        </NCard>
        <NCard title="友情链接">
          <RayLink />
        </NCard>
      </NFlex>
    )
  },
})

export default Dashboard
