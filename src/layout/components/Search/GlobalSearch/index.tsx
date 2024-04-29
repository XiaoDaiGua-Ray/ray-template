/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-16
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * app search 搜索功能
 * 递归模糊查找所有在 getMenuOptions 中匹配的项
 * 只有在满足 validMenuItemShow 的时候，才会出现在搜索结果中
 *
 * 该功能不会在小尺寸屏幕中启用（isTabletOrSmaller = true）
 */

import './index.scss'

import {
  NInput,
  NModal,
  NResult,
  NScrollbar,
  NFlex,
  NSpin,
  NCard,
  NText,
} from 'naive-ui'
import { RIcon } from '@/components'

import {
  queryElements,
  setClass,
  removeClass,
  positionSelectedMenuItem,
} from '@/utils'
import { throttle, pick } from 'lodash-es'
import { useMenuActions } from '@/store'
import { validMenuItemShow } from '@/router/utils'
import { useDevice } from '@/hooks'
import { useEventListener } from '@vueuse/core'

import type { AppRouteMeta } from '@/router/types'
import type { AppMenuOption } from '@/types'

export default defineComponent({
  name: 'GlobalSearch',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const { changeMenuModelValue, resolveOption } = useMenuActions()
    const { getRoutes } = useRouter()

    const modelShow = computed({
      get: () => props.show,
      set: (val) => {
        emit('update:show', val)

        if (!val) {
          resetSearchSomeValue()
        }
      },
    })
    const state = reactive({
      searchValue: null,
      searchOptions: [] as AppMenuOption[],
    })
    const helperTipOptions = [
      {
        icon: ['↑', '↓'],
        label: '切换',
        plain: true,
      },
      {
        icon: ['↵'],
        label: '选择',
        plain: true,
      },
      {
        icon: ['esc'],
        label: '关闭',
        plain: true,
      },
    ]
    /** 初始化索引 */
    let searchElementIndex = 0
    /** 缓存索引 */
    let preSearchElementIndex = searchElementIndex
    const { isTabletOrSmaller } = useDevice()
    const loading = ref(false)
    const ACTIVE_CLASS = 'content-item--active' // 激活样式 class name

    /** 初始化一些值 */
    const resetSearchSomeValue = () => {
      state.searchOptions = []
      state.searchValue = null
      searchElementIndex = 0
      preSearchElementIndex = searchElementIndex
    }

    /** 按下 ctrl + k 或者 command + k 激活搜索栏 */
    const registerArouseKeyboard = (e: KeyboardEvent) => {
      if (modelShow.value) {
        return
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        e.stopPropagation()
        resetSearchSomeValue()

        modelShow.value = true
      }
    }

    /** 根据输入值模糊检索菜单 */
    const fuzzySearchMenuOptions = (value: string) => {
      if (value) {
        loading.value = true
      } else {
        loading.value = false
        state.searchOptions = []

        return
      }

      const arr = getRoutes().reduce((pre, curr) => {
        const pickOption = pick(curr, [
          'children',
          'meta',
          'path',
          'name',
        ]) as unknown as AppMenuOption

        const res = resolveOption({
          ...pickOption,
          fullPath: curr.path,
        })
        const { breadcrumbLabel } = res

        // 是否模糊匹配字符、满足展示条件
        if (
          breadcrumbLabel
            ?.toLocaleLowerCase()
            ?.includes(value.toLocaleLowerCase()) &&
          validMenuItemShow(res)
        ) {
          pre.push(res)
        }

        return pre
      }, [] as AppMenuOption[])

      setTimeout(() => {
        state.searchOptions = arr

        nextTick().then(() => {
          autoFocusingSearchItem()
        })

        loading.value = false
      }, 500)
    }

    const searchItemClick = (option: AppMenuOption) => {
      if (option) {
        const { meta } = option

        /** 如果配置站外跳转则不会关闭搜索框 */
        if (meta.windowOpen) {
          window.open(meta.windowOpen)
        } else {
          modelShow.value = false

          changeMenuModelValue(option.fullPath, option)
          setTimeout(positionSelectedMenuItem, 300)
        }
      }
    }

    /** 自动聚焦检索项 */
    const autoFocusingSearchItem = () => {
      const currentOption = state.searchOptions[searchElementIndex] // 获取当前搜索项
      const preOption = state.searchOptions[preSearchElementIndex] // 获取上一搜索项

      if (currentOption) {
        nextTick().then(() => {
          const searchElementOptions = queryElements<HTMLElement>(
            `attr:data_path="${currentOption.path}"`,
          )
          const preSearchElementOptions = preOption
            ? queryElements<HTMLElement>(`attr:data_path="${preOption?.path}"`)
            : null

          if (preSearchElementOptions?.length) {
            const [el] = preSearchElementOptions

            removeClass(el, ACTIVE_CLASS)
          }

          if (searchElementOptions?.length) {
            const [el] = searchElementOptions

            setClass(el, ACTIVE_CLASS)
          }
        })
      }
    }

    /** 渲染搜索菜单前缀图标, 如果没有则用 icon table 代替 */
    const RenderPreIcon = (meta: AppRouteMeta) => {
      const { icon } = meta

      if (typeof icon === 'string') {
        return <RIcon name={icon} size="24" />
      } else if (typeof icon === 'function') {
        return () => icon
      } else {
        return <RIcon name="search" size="24" />
      }
    }

    /** 更新索引 */
    const updateIndex = (type: 'up' | 'down') => {
      if (type === 'up') {
        searchElementIndex -= 1

        if (searchElementIndex < 0) {
          searchElementIndex = state.searchOptions.length - 1
        }
      }

      if (type === 'down') {
        searchElementIndex += 1

        if (searchElementIndex >= state.searchOptions.length) {
          searchElementIndex = 0
        }
      }
    }

    /** 注册按键: 上、下、回车 */
    const registerChangeSearchElementIndex = (e: KeyboardEvent) => {
      const keyCode = e.key

      if (
        keyCode === 'ArrowUp' ||
        keyCode === 'ArrowDown' ||
        keyCode === 'Enter'
      ) {
        e.preventDefault()
        e.stopPropagation()
      }

      // 当初始化索引小于等于 0 时，缓存重置缓存索引
      preSearchElementIndex = searchElementIndex <= 0 ? 0 : searchElementIndex

      switch (keyCode) {
        case 'ArrowUp':
          updateIndex('up')

          break

        case 'ArrowDown':
          updateIndex('down')

          break

        case 'Enter':
          // eslint-disable-next-line no-case-declarations
          const option = state.searchOptions[searchElementIndex]

          if (option) {
            searchItemClick(option)
          }

          break

        default:
          break
      }

      autoFocusingSearchItem()
    }

    const SearchItem = ({ menuOption }: { menuOption: AppMenuOption }) => (
      <NFlex
        align="center"
        class="content-item"
        {...{
          onClick: searchItemClick.bind(this, menuOption),
          data_path: menuOption.path,
        }}
      >
        <div class="content-item-icon">{RenderPreIcon(menuOption.meta)}</div>
        <div class="content-item-label">{menuOption.breadcrumbLabel}</div>
        <RIcon
          name="enter"
          size="18"
          customClassName="content-item-icon__enter"
        />
      </NFlex>
    )

    watchEffect(() => {
      // 当处于小尺寸状态时，自动关闭搜索框
      if (isTabletOrSmaller.value) {
        modelShow.value = false
      }
    })

    useEventListener(
      window,
      'keydown',
      (e: KeyboardEvent) => {
        registerArouseKeyboard(e)
        registerChangeSearchElementIndex(e)
      },
      true,
    )

    return {
      ...toRefs(state),
      modelShow,
      helperTipOptions,
      fuzzySearchMenuOptions: throttle(fuzzySearchMenuOptions, 300),
      searchItemClick,
      RenderPreIcon,
      isTabletOrSmaller,
      SearchItem,
      loading,
    }
  },
  render() {
    const { isTabletOrSmaller, searchOptions, loading } = this
    const { SearchItem, fuzzySearchMenuOptions } = this

    return isTabletOrSmaller ? (
      <div style="display: none;"></div>
    ) : (
      <NModal
        v-model:show={this.modelShow}
        transformOrigin="center"
        displayDirective="if"
      >
        <div class="global-search global-search--dark global-search--light">
          <div class="global-search__wrapper">
            <NCard
              class="global-search__card"
              headerStyle={{
                padding: '12px 12px 0 12px',
              }}
              contentStyle={{
                padding: '12px',
              }}
              segmented={{
                action: 'soft',
              }}
            >
              {{
                header: () => (
                  <NInput
                    size="large"
                    v-model:value={this.searchValue}
                    clearable
                    onInput={fuzzySearchMenuOptions.bind(this)}
                  >
                    {{
                      prefix: () => <RIcon name="search" size="24" />,
                    }}
                  </NInput>
                ),
                default: () => (
                  <NScrollbar>
                    <NSpin show={loading}>
                      {searchOptions.length ? (
                        <NFlex
                          vertical
                          size={[0, 6]}
                          class="global-search__card-content"
                        >
                          {searchOptions.map((curr, idx) => (
                            <SearchItem menuOption={curr} key={curr.fullPath} />
                          ))}
                        </NFlex>
                      ) : (
                        <NResult size="large" class="global-search__empty">
                          {{
                            icon: () => null,
                            default: () => (
                              <NFlex
                                justify="center"
                                class="global-search__empty-content"
                              >
                                <NText>没有搜索结果</NText>
                              </NFlex>
                            ),
                          }}
                        </NResult>
                      )}
                    </NSpin>
                  </NScrollbar>
                ),
                action: () => (
                  <NFlex justify="flex-start" align="center" size={[16, 0]}>
                    {this.helperTipOptions.map((curr) => (
                      <NFlex key={curr.label} size={[4, 0]}>
                        {curr.icon.map((icon) => (
                          <NFlex
                            class="item-icon"
                            align="center"
                            justify="center"
                          >
                            {icon}
                          </NFlex>
                        ))}
                        <NFlex class="item-label" align="center">
                          {curr.label}
                        </NFlex>
                      </NFlex>
                    ))}
                  </NFlex>
                ),
              }}
            </NCard>
          </div>
        </div>
      </NModal>
    )
  },
})
