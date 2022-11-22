import './index.scss'
import { NCard, NDescriptions, NDescriptionsItem, NTag } from 'naive-ui'

interface RelyDataOptions {
  name: string
  relyVersion: string
  relyAddress: string
}

interface TemplateOptions {
  name: string
  label: string
  url?: string
}

const RelyAbout = defineComponent({
  name: 'RelyAbout',
  setup() {
    const { pkg } = __APP_INFO__
    const { dependencies, devDependencies, name, version } = pkg

    const columns = [
      {
        title: '依赖名称',
        key: 'name',
      },
      {
        title: '依赖版本',
        key: 'relyVersion',
      },
      {
        title: '依赖地址',
        key: 'relyAddress',
      },
    ]
    const relyData = ref<RelyDataOptions[]>([])
    const templateOptions = [
      {
        name: '项目名称',
        label: name,
      },
      {
        name: '版本信息',
        label: version,
      },
      {
        name: '项目地址',
        label: 'GitHub',
        url: 'https://github.com/XiaoDaiGua-Ray/ray-template',
      },
    ]

    const handleGetRelyData = () => {
      const _arrayFrom = (obj: object) =>
        Object.keys(obj).reduce((pre, curr) => {
          pre.push({
            name: curr,
            relyVersion: obj[curr],
            relyAddress: '',
          })

          return pre
        }, [] as RelyDataOptions[])

      const arrDependencies = _arrayFrom(dependencies)
      const arrDevDependencies = _arrayFrom(devDependencies)

      relyData.value = [...arrDependencies, ...arrDevDependencies]
    }

    const handleTagClick = (item: TemplateOptions) => {
      if (item.url) {
        window.open(item.url)
      }
    }

    onBeforeMount(() => {
      handleGetRelyData()
    })

    return {
      columns,
      relyData,
      templateOptions,
      handleTagClick,
    }
  },
  render() {
    return (
      <div class="rely-about">
        <NCard title="关于项目">
          ray-template 是一个基于 vue3、vite3、TypeScript 的中后台解决方案,
          它可以帮助你快速搭建企业级中后台项目,
          相信不管是从新技术使用还是其他方面, 都能帮助到你,持续更新中.
        </NCard>
        <NCard title="项目信息">
          <NDescriptions bordered labelPlacement="left">
            {this.templateOptions.map((curr) => (
              <NDescriptionsItem key={curr.name} label={curr.name}>
                <NTag
                  bordered={false}
                  type="info"
                  onClick={this.handleTagClick.bind(this, curr)}
                  style={[curr.url ? 'cursor: pointer' : '']}
                >
                  {curr.label}
                </NTag>
              </NDescriptionsItem>
            ))}
          </NDescriptions>
        </NCard>
        <NCard title="项目依赖">
          <NDescriptions bordered labelPlacement="left">
            {this.relyData.map((curr) => (
              <NDescriptionsItem key={curr.name} label={curr.name}>
                {curr.relyVersion}
              </NDescriptionsItem>
            ))}
          </NDescriptions>
        </NCard>
      </div>
    )
  },
})

export default RelyAbout
