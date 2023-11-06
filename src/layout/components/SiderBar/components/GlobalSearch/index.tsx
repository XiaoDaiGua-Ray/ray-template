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

import './index.scss'

import { NInput, NModal, NResult, NScrollbar, NSpace } from 'naive-ui'
import RIcon from '@/components/RIcon/index'

import { on, off, queryElements, addClass, removeClass } from '@/utils/element'
import { debounce } from 'lodash-es'
import { useMenuGetters, useMenuActions } from '@/store'
import { validMenuItemShow } from '@/router/helper/routerCopilot'
import { useDevice } from '@/hooks/web/index'

import type { AppRouteMeta } from '@/router/type'
import type { AppMenuOption } from '@/types/modules/app'

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
        icon: 'cmd / ctrl + k',
        label: '唤起',
        plain: true,
      },
      {
        icon: '↑ ↓',
        label: '切换',
        plain: true,
      },
      {
        icon: '↵',
        label: '选择',
        plain: true,
      },
      {
        icon: 'esc',
        label: '关闭',
        plain: true,
      },
    ]
    /** 初始化索引 */
    let searchElementIndex = 0
    /** 缓存索引 */
    let preSearchElementIndex = searchElementIndex
    const { isTabletOrSmaller } = useDevice()

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
    const handleSearchMenuOptions = (value: string) => {
      const arr: AppMenuOption[] = []

      const filterArr = (options: AppMenuOption[]) => {
        options.forEach((curr) => {
          if (curr.children?.length && validMenuItemShow(curr)) {
            filterArr(curr.children)
          }

          /** 处理菜单名与输入值, 不区分大小写 */
          const _breadcrumbLabel = curr.breadcrumbLabel?.toLocaleLowerCase()
          const _value = String(value).toLocaleLowerCase()

          if (
            _breadcrumbLabel?.includes(_value) &&
            validMenuItemShow(curr) &&
            !curr.children?.length
          ) {
            arr.push(curr)
          }
        })
      }

      if (value) {
        filterArr(getMenuOptions.value)

        state.searchOptions = arr
      } else {
        state.searchOptions = []
      }

      nextTick().then(() => {
        autoFocusingSearchItem()
      })
    }

    const handleSearchItemClick = (option: AppMenuOption) => {
      if (option) {
        const { meta } = option

        /** 如果配置站外跳转则不会关闭搜索框 */
        if (meta.windowOpen) {
          window.open(meta.windowOpen)
        } else {
          modelShow.value = false

          changeMenuModelValue(option.key, option)
        }
      }
    }

    /** 自动聚焦检索项 */
    const autoFocusingSearchItem = () => {
      const currentOption = state.searchOptions[searchElementIndex]
      const preOption = state.searchOptions[preSearchElementIndex]

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

            removeClass(el, 'content-item--active')
          }

          if (searchElementOptions?.length) {
            const [el] = searchElementOptions

            addClass(el, 'content-item--active')
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

    /** 注册按键: 上、下、回车 */
    const registerChangeSearchElementIndex = (e: KeyboardEvent) => {
      const keyCode = e.key

      if (keyCode === 'ArrowUp' || keyCode === 'ArrowDown') {
        e.preventDefault()
        e.stopPropagation()
      }

      preSearchElementIndex = searchElementIndex <= 0 ? 0 : searchElementIndex

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
            handleSearchItemClick(option)
          }

          break

        default:
          break
      }

      autoFocusingSearchItem()
    }

    const SearchItem = ({ menuOption }: { menuOption: AppMenuOption }) => (
      <NSpace
        align="center"
        wrapItem={false}
        class="content-item"
        {...{
          onClick: handleSearchItemClick.bind(this, menuOption),
          data_path: menuOption.path,
        }}
      >
        <div class="content-item-icon">{RenderPreIcon(menuOption.meta)}</div>
        <div class="content-item-label">{menuOption.breadcrumbLabel}</div>
      </NSpace>
    )

    watchEffect(() => {
      if (isTabletOrSmaller.value) {
        modelShow.value = false
      }
    })

    onMounted(() => {
      on(window, 'keydown', (e: Event) => {
        registerArouseKeyboard(e as KeyboardEvent)
        registerChangeSearchElementIndex(e as KeyboardEvent)
      })
    })
    onBeforeUnmount(() => {
      off(window, 'keydown', (e: Event) => {
        registerArouseKeyboard(e as KeyboardEvent)
        registerChangeSearchElementIndex(e as KeyboardEvent)
      })
    })

    return {
      ...toRefs(state),
      modelShow,
      helperTipOptions,
      handleSearchMenuOptions: debounce(handleSearchMenuOptions, 300),
      handleSearchItemClick,
      RenderPreIcon,
      isTabletOrSmaller,
      SearchItem,
    }
  },
  render() {
    const { isTabletOrSmaller, searchOptions } = this
    const { SearchItem } = this

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
            <div class="global-search__card">
              <div class="global-search__card-header">
                <NInput
                  size="large"
                  v-model:value={this.searchValue}
                  clearable
                  onInput={this.handleSearchMenuOptions.bind(this)}
                >
                  {{
                    prefix: () => <RIcon name="search" size="24" />,
                  }}
                </NInput>
              </div>
              <NScrollbar class="global-search__card-content">
                {searchOptions.length ? (
                  <NSpace vertical wrapItem={false} size={[8, 8]}>
                    {searchOptions.map((curr) => (
                      <SearchItem menuOption={curr} key={curr.key} />
                    ))}
                  </NSpace>
                ) : (
                  <NResult size="large" class="global-search__empty">
                    {{
                      icon: () => null,
                      default: () => (
                        <NSpace
                          wrapItem={false}
                          justify="center"
                          class="global-search__empty-content"
                        >
                          <RIcon name="empty" size="24" />
                          暂无搜索结果
                        </NSpace>
                      ),
                    }}
                  </NResult>
                )}
              </NScrollbar>
              <div class="global-search__card-footer">
                <NSpace
                  class="card-footer__tip-wrapper"
                  align="center"
                  wrapItem={false}
                  size={[24, 8]}
                >
                  {this.helperTipOptions.map((curr) => (
                    <div class="tip-wrapper-item" key={curr.label}>
                      <div class="item-icon">
                        {curr.plain ? (
                          <span>{curr.icon}</span>
                        ) : (
                          <RIcon name={curr.icon} size="18" />
                        )}
                      </div>
                      <div class="item-label">{curr.label}</div>
                    </div>
                  ))}
                </NSpace>
              </div>
            </div>
          </div>
        </div>
      </NModal>
    )
  },
})
