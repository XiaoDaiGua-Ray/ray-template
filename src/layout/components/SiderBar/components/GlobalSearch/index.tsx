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
} from 'naive-ui'
import { RIcon } from '@/components'

import { queryElements, addClass, removeClass } from '@/utils'
import { debounce } from 'lodash-es'
import { useMenuGetters, useMenuActions } from '@/store'
import { validMenuItemShow } from '@/router/helper/routerCopilot'
import { useDevice } from '@/hooks'
import { useEventListener } from '@vueuse/core'

import type { AppRouteMeta } from '@/router/type'
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
    const { changeMenuModelValue } = useMenuActions()
    const modelShow = computed({
      get: () => props.show,
      set: (val) => {
        emit('update:show', val)

        if (!val) {
          resetSearchSomeValue()
        }
      },
    })
    const { getMenuOptions } = useMenuGetters()

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

    /** 初始化一些值 */
    const resetSearchSomeValue = () => {
      state.searchOptions = []
      state.searchValue = null
      searchElementIndex = 0
      preSearchElementIndex = searchElementIndex
    }

    /** 按下 ctrl + k 或者 command + k 激活搜索栏 */
    const registerArouseKeyboard = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        e.stopPropagation()
        resetSearchSomeValue()

        modelShow.value = true
      }
    }

    /** 根据输入值模糊检索菜单 */
    const fuzzySearchMenuOptions = (value: string) => {
      const arr: AppMenuOption[] = []

      if (value) {
        loading.value = true
      } else {
        loading.value = false
        state.searchOptions = []

        return
      }

      const filterArr = (options: AppMenuOption[]) => {
        for (const curr of options) {
          if (curr.children?.length && validMenuItemShow(curr)) {
            filterArr(curr.children)

            continue
          }

          /** 处理菜单名与输入值, 不区分大小写 */
          const $breadcrumbLabel = curr.breadcrumbLabel?.toLocaleLowerCase()
          const $value = String(value).toLocaleLowerCase()

          // 是否模糊匹配字符、满足展示条件
          if (
            $breadcrumbLabel?.includes($value) &&
            validMenuItemShow(curr) &&
            !curr.children?.length
          ) {
            arr.push(curr)
          }
        }
      }

      setTimeout(() => {
        if (value) {
          filterArr(getMenuOptions.value)

          state.searchOptions = arr
        } else {
          state.searchOptions = []
        }

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
        }
      }
    }

    /** 自动聚焦检索项 */
    const autoFocusingSearchItem = () => {
      const currentOption = state.searchOptions[searchElementIndex] // 获取当前搜索项
      const preOption = state.searchOptions[preSearchElementIndex] // 获取上一搜索项
      const activeClass = 'content-item--active' // 激活样式 class name

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

            removeClass(el, activeClass)
          }

          if (searchElementOptions?.length) {
            const [el] = searchElementOptions

            addClass(el, activeClass)
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
        return <RIcon name="table" size="24" />
      }
    }

    /** 更新索引 */
    const updateIndex = (type: 'up' | 'down') => {
      if (type === 'up') {
        searchElementIndex =
          searchElementIndex - 1 < 0 ? 0 : searchElementIndex - 1
      } else if (type === 'down') {
        searchElementIndex =
          searchElementIndex + 1 >= state.searchOptions.length
            ? state.searchOptions.length - 1
            : searchElementIndex + 1
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
      fuzzySearchMenuOptions: debounce(fuzzySearchMenuOptions, 300),
      searchItemClick,
      RenderPreIcon,
      isTabletOrSmaller,
      SearchItem,
      loading,
    }
  },
  render() {
    const { isTabletOrSmaller, searchOptions, loading } = this
    const { SearchItem, fuzzySearchMenuOptions, $t } = this

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
                          {searchOptions.map((curr) => (
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
                                <RIcon name="empty" size="24" />
                                暂无搜索结果
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
