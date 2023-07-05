import './index.scss'
import {
  NCard,
  NLayout,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NSpace,
  NP,
  NH6,
} from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'
import RayLink from '@/components/RayLink/index'

const Dashboard = defineComponent({
  name: 'RDashboard',
  setup() {
    const coverLetterOptions = [
      {
        label: '掌握搬砖框架',
        des: () => (
          <NSpace>
            <NTag type="success">Vue3.x</NTag>
            <NTag type="info">React</NTag>
          </NSpace>
        ),
      },
      {
        label: '从事搬砖时长',
        des: () => (
          <NSpace>
            <NTag type="success">练习时长两年半的小白前端搬砖师</NTag>
          </NSpace>
        ),
      },
      {
        label: '个人',
        des: () => (
          <NSpace align="center">
            <RayIcon name="ray" size="22" />
            努力搬砖、努力摸鱼, 建设美丽家园
          </NSpace>
        ),
        span: 2,
      },
      {
        label: '补充说明',
        des: () => (
          <NSpace align="center">
            如果有希望补充的功能可以在
            <a
              class="dashboard-link"
              href="https://github.com/XiaoDaiGua-Ray/ray-template"
            >
              GitHub
            </a>
            提一个 Issues
          </NSpace>
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
      <NLayout class="dashboard-layout layout-full">
        <NCard>
          {{
            header: () =>
              h(
                RayIcon,
                {
                  name: 'ray',
                  size: '64',
                },
                {},
              ),
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
            <NSpace>
              {this.technologyTagOptions.map((curr) => (
                <NTag key={curr.value} type="info">
                  {curr.label}
                </NTag>
              ))}
            </NSpace>
          </NP>
          <NH6>项目介绍</NH6>
          <NP>
            预设了最佳构建体验的配置与常用搬砖工具。意在提供一个简洁、快速上手的模板。
          </NP>
        </NCard>
        <NCard title="友情链接">
          <RayLink />
        </NCard>
      </NLayout>
    )
  },
})

export default Dashboard
