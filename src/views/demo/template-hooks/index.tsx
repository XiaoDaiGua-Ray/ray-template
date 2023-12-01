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

import { NSpace, NCard, NButton, NInput } from 'naive-ui'

import {
  useAppNavigation,
  useMaximize,
  useSpinning,
  useWatermark,
  useTheme,
} from '@/hooks/template'
import { getVariableToRefs } from '@/global-variable'
import { useSettingGetters } from '@/store'

export default defineComponent({
  name: 'TemplateHooks',
  setup() {
    const currentMenuOption = ref('')
    const maximizeRef = getVariableToRefs('layoutContentMaximize')
    const watermark = ref(useSettingGetters().getWatermarkConfig.value.content)

    const { navigationTo } = useAppNavigation()
    const { maximize, isLayoutContentMaximized } = useMaximize()
    const { reload, openSpin, closeSpin } = useSpinning()
    const {
      showWatermark,
      hiddenWatermark,
      setWatermarkContent,
      toggleWatermark,
    } = useWatermark()
    const { changeDarkTheme, changeLightTheme, toggleTheme, getAppTheme } =
      useTheme()

    return {
      navigationTo,
      reload,
      currentMenuOption,
      maximize,
      maximizeRef,
      openSpin,
      closeSpin,
      showWatermark,
      hiddenWatermark,
      setWatermarkContent,
      watermark,
      toggleWatermark,
      changeDarkTheme,
      changeLightTheme,
      toggleTheme,
      getAppTheme,
      isLayoutContentMaximized,
    }
  },
  render() {
    const {
      navigationTo,
      reload,
      maximize,
      openSpin,
      closeSpin,
      showWatermark,
      hiddenWatermark,
      setWatermarkContent,
      toggleWatermark,
      changeDarkTheme,
      changeLightTheme,
      toggleTheme,
      getAppTheme,
      isLayoutContentMaximized,
    } = this

    return (
      <NSpace wrapItem={false} vertical>
        <NCard title="接口说明">
          <h3>
            hooks/template 包存放模板专属 hook
            方法。这里不做过多的赘述，可以查看文档具体描述。
          </h3>
        </NCard>
        <NCard title="useTheme 主题">
          <NSpace vertical>
            <h3>getAppTheme 获取当前主题色: {getAppTheme().themeLabel}</h3>
            <NSpace>
              <NButton onClick={() => changeDarkTheme()}>切换暗黑主题</NButton>
              <NButton onClick={() => changeLightTheme()}>切换明亮主题</NButton>
              <NButton onClick={() => toggleTheme()}>切换主题</NButton>
            </NSpace>
          </NSpace>
        </NCard>
        <NCard title="useWatermark 水印">
          <NSpace vertical>
            <NInput
              v-model:value={this.watermark}
              onInput={(val) => {
                setWatermarkContent(val)
              }}
            />
            <NSpace>
              <NButton onClick={() => showWatermark()}>显示水印</NButton>
              <NButton onClick={() => hiddenWatermark()}>隐藏水印</NButton>
              <NButton onClick={() => toggleWatermark()}>切换水印</NButton>
            </NSpace>
          </NSpace>
        </NCard>
        <NCard title="useSpinning">
          <h3>
            手动刷新内容区域，会使得当前路由页面内容强制重新加载（会执行完整的
            vue 生命周期）。默认 800ms 延迟。
          </h3>
          <br />
          <NSpace>
            <NButton
              onClick={() => {
                reload()
              }}
            >
              刷新（强制刷新）
            </NButton>
            <NButton
              onClick={() => {
                openSpin()

                setTimeout(() => {
                  closeSpin()
                }, 800)
              }}
            >
              触发加载动画（不强制刷新）
            </NButton>
          </NSpace>
        </NCard>
        <NCard title="useMaximize 内容区域最大化">
          <h3>
            isLayoutContentMaximized 检测当前内容区域是否最大化:
            {isLayoutContentMaximized ? '最大化' : '正常尺寸'}
          </h3>
          <NButton
            onClick={() => {
              maximize(!this.maximizeRef)
            }}
          >
            最大化内容区域
          </NButton>
        </NCard>
        <NCard title="useAppNavigation 导航方法">
          <h3>
            navigationTo
            参数为正整数时，会更具当前的菜单顺序进行自动导航匹配。但是此方法仅能导航一级菜单。并且如果导航菜单非根菜单项，会自动递归导航至一子菜单。
          </h3>
          <br />
          <NButton onClick={() => navigationTo(16)}>跳转至多级菜单</NButton>
        </NCard>
      </NSpace>
    )
  },
})
