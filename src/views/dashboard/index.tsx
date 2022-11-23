import './index.scss'
import {
  NCard,
  NLayout,
  NDescriptions,
  NDescriptionsItem,
  NTag,
  NSpace,
} from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

const Dashboard = defineComponent({
  name: 'Dashboard',
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

    return {
      coverLetterOptions,
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
      </NLayout>
    )
  },
})

export default Dashboard
