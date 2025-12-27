import { RIcon } from '@/components'
import { getVariableToRefs } from '@/global-variable'
import {
  useAppNavigation,
  useBadge,
  useMaximize,
  useSpinning,
  useTheme,
  useWatermark,
} from '@/hooks'
import { useSettingGetters } from '@/store'
import { NButton, NCard, NFlex, NInput } from 'naive-ui'

export default defineComponent({
  name: 'TemplateHooks',
  setup() {
    const currentMenuOption = ref('')
    const maximizeRef = getVariableToRefs('layoutContentMaximize')
    const watermark = ref(useSettingGetters().getWatermarkConfig.value.content)
    const badgeValue = ref('new')

    const { navigationTo } = useAppNavigation()
    const { maximize, isLayoutContentMaximized } = useMaximize()
    const { reload, openSpin, closeSpin } = useSpinning()
    const {
      showWatermark,
      hiddenWatermark,
      setWatermarkContent,
      toggleWatermark,
    } = useWatermark()
    const { darkTheme, lightTheme, toggleTheme, getAppTheme, syncSystemTheme } =
      useTheme()
    const {
      hidden: badgeHidden,
      show: badgeShow,
      update: badgeUpdateLabel,
    } = useBadge()

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
      darkTheme,
      lightTheme,
      toggleTheme,
      getAppTheme,
      isLayoutContentMaximized,
      badgeHidden,
      badgeShow,
      badgeUpdateLabel,
      badgeValue,
      syncSystemTheme,
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
      darkTheme,
      lightTheme,
      toggleTheme,
      getAppTheme,
      isLayoutContentMaximized,
      badgeHidden,
      badgeShow,
      badgeUpdateLabel,
      syncSystemTheme,
    } = this

    return (
      <NFlex vertical>
        <NCard title="接口说明">
          <h3>
            hooks/template 包存放模板专属 hook
            方法。这里不做过多的赘述，可以查看文档具体描述。
          </h3>
        </NCard>
        <NCard title="useBadge 菜单标记">
          <NFlex vertical>
            <NInput v-model:value={this.badgeValue} />
            <NFlex>
              <NButton onClick={() => badgeHidden('/template-hooks')}>
                隐藏当前菜单标记
              </NButton>
              <NButton
                onClick={() =>
                  badgeShow('/template-hooks', {
                    label: this.badgeValue,
                  })
                }
              >
                显示当前菜单标记
              </NButton>
              <NButton
                onClick={() =>
                  badgeUpdateLabel('/template-hooks', {
                    label: this.badgeValue,
                  })
                }
              >
                更新当前菜单标记
              </NButton>
              <NButton
                onClick={() => {
                  badgeUpdateLabel('/template-hooks', {
                    label: this.badgeValue,
                    icon: <RIcon name="error" size="18" />,
                  })
                }}
              >
                添加标记图标
              </NButton>
              <NButton
                onClick={() => {
                  badgeUpdateLabel('/template-hooks', {
                    label: this.badgeValue,
                    icon: void 0,
                  })
                }}
              >
                隐藏标记图标
              </NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NCard title="useTheme 主题">
          <NFlex vertical>
            <h3>getAppTheme 获取当前主题色: {getAppTheme().themeLabel}</h3>
            <NFlex>
              <NButton onClick={() => darkTheme()}>切换暗黑主题</NButton>
              <NButton onClick={() => lightTheme()}>切换明亮主题</NButton>
              <NButton onClick={() => syncSystemTheme()}>跟随主题</NButton>
              <NButton onClick={() => toggleTheme()}>切换主题</NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NCard title="useWatermark 水印">
          <NFlex vertical>
            <NInput
              v-model:value={this.watermark}
              onInput={(val) => {
                setWatermarkContent(val)
              }}
            />
            <NFlex>
              <NButton onClick={() => showWatermark()}>显示水印</NButton>
              <NButton onClick={() => hiddenWatermark()}>隐藏水印</NButton>
              <NButton onClick={() => toggleWatermark()}>切换水印</NButton>
            </NFlex>
          </NFlex>
        </NCard>
        <NCard title="useSpinning">
          <h3>
            手动刷新内容区域，会使得当前路由页面内容强制重新加载（会执行完整的
            vue 生命周期）。默认 800ms 延迟。
          </h3>
          <br />
          <NFlex>
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
          </NFlex>
        </NCard>
        <NCard title="useMaximize 内容区域最大化">
          <h3>
            isLayoutContentMaximized 检测当前内容区域是否最大化:
            {isLayoutContentMaximized ? '最大化' : '正常尺寸'}
          </h3>
          <NButton
            onClick={() => {
              maximize(!this.maximizeRef, {
                scrollToOptions: {
                  left: 0,
                  top: -9999,
                },
              })
            }}
          >
            最大化内容区域，并且滚动至顶部
          </NButton>
        </NCard>
        <NCard title="useAppNavigation 导航方法">
          <h3>
            navigationTo
            参数为正整数时，会更具当前的菜单顺序进行自动导航匹配。但是此方法仅能导航一级菜单。并且如果导航菜单非根菜单项，会自动递归导航至一子菜单。
            支持传入完整的菜单路径，如：/multi/multi-menu-one。
          </h3>
          <br />
          <NButton onClick={() => navigationTo('/multi/multi-menu-one')}>
            跳转至多级菜单
          </NButton>
        </NCard>
      </NFlex>
    )
  },
})
