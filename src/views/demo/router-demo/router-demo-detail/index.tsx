import { NCard, NFlex } from 'naive-ui'

const RouterDemoDetail = defineComponent({
  name: 'RouterDemoDetail',
  setup() {
    const route = useRoute()

    return {
      route,
    }
  },
  render() {
    const { route } = this

    return (
      <NFlex>
        <NCard title={(route.query.name as string) || 'hello'}>
          你好 {route.query.name}
        </NCard>
        <NCard title="平层路由详情页面">我是平层路由详情页面</NCard>
        <NCard title="TIP">
          <h2>1. 可以点击面包屑或者菜单返回到主页面</h2>
          <h2>
            2. 如果这个页面需要配置多个详情页面，只需将该路由所在的 children
            中，将所需页面配置为 sameLevel 即可。
          </h2>
        </NCard>
      </NFlex>
    )
  },
})

export default RouterDemoDetail
