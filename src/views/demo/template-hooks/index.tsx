/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-11-03
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

import { NSpace, NCard, NButton } from 'naive-ui'

import { useAppMenu, useMainPage } from '@/hooks/template/index'

export default defineComponent({
  name: 'TemplateHooks',
  setup() {
    const currentMenuOption = ref('')
    const maximizeRef = ref(false)

    const { navigationTo } = useAppMenu()
    const { reload, maximize } = useMainPage()

    return {
      navigationTo,
      reload,
      currentMenuOption,
      maximize,
      maximizeRef,
    }
  },
  render() {
    const { navigationTo, reload, maximize } = this

    return (
      <NSpace wrapItem={false} vertical>
        <NCard title="useAppMenu 导航方法">
          <h3>
            navigationTo
            参数为正整数时，会更具当前的菜单顺序进行自动导航匹配。但是此方法仅能导航一级菜单。并且如果导航菜单非根菜单项，会自动递归导航至一子菜单。
          </h3>
          <br />
          <NButton onClick={() => navigationTo(14)}>跳转至多级菜单</NButton>
        </NCard>
        <NCard title="useMainPage 主页面方法">
          <NCard title="reload 加载函数">
            <h3>
              手动刷新内容区域，会使得当前路由页面内容强制重新加载（会执行完整的
              vue 生命周期）。默认 800ms 延迟。
            </h3>
            <br />
            <NButton
              onClick={() => {
                reload()
              }}
            >
              刷新
            </NButton>
          </NCard>
          <NCard title="maximize 内容区域最大化">
            <NButton
              onClick={() => {
                this.maximizeRef = !this.maximizeRef

                maximize(this.maximizeRef)
              }}
            >
              最大化内容区域
            </NButton>
          </NCard>
        </NCard>
      </NSpace>
    )
  },
})
