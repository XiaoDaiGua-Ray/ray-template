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
import RayIcon from '@/components/RayIcon/index'

import { on, off, queryElements, addClass, removeClass } from '@/utils/element'
import { debounce } from 'lodash-es'
import { useMenu } from '@/store'
import { validMenuItemShow } from '@/router/helper/routerCopilot'

import type { AppRouteMeta } from '@/router/type'
import type { AppMenuOption } from '@/types/modules/app'

const GlobalSeach = defineComponent({
  name: 'GlobalSeach',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:show'],
  setup(props, { emit }) {
    const menuStore = useMenu()

    const { changeMenuModelValue } = menuStore
    const modelShow = computed({
      get: () => props.show,
      set: (val) => {
        emit('update:show', val)

        if (!val) {
          resetSearchSomeValue()
        }
      },
    })
    const modelMenuOptions = computed(() => menuStore.options)
    const state = reactive({
      searchValue: null,
      searchOptions: [] as AppMenuOption[],
    })
    const tiptextOptions = [
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
        filterArr(modelMenuOptions.value)

        state.searchOptions = arr
      } else {
        state.searchOptions = []
      }

      nextTick().then(() => {
        autoFouceSearchItem()
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
    const autoFouceSearchItem = () => {
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
        return <RayIcon name={icon} size="24" />
      } else if (typeof icon === 'function') {
        return () => icon
      } else {
        return <RayIcon name="table" size="24" />
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

      autoFouceSearchItem()
    }

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
      tiptextOptions,
      handleSearchMenuOptions: debounce(handleSearchMenuOptions, 300),
      handleSearchItemClick,
      RenderPreIcon,
    }
  },
  render() {
    return (
      <NModal v-model:show={this.modelShow} transform-origin="center" show>
        <div class="global-seach global-seach--dark global-seach--light">
          <div class="global-seach__wrapper">
            <div class="global-seach__card">
              <div class="global-seach__card-header">
                <NInput
                  size="large"
                  v-model:value={this.searchValue}
                  clearable
                  onInput={this.handleSearchMenuOptions.bind(this)}
                >
                  {{
                    prefix: () => <RayIcon name="search" size="24" />,
                  }}
                </NInput>
              </div>
              <NScrollbar class="global-seach__card-content">
                {this.searchOptions.length ? (
                  <NSpace vertical wrapItem={false} size={[8, 8]}>
                    {this.searchOptions.map((curr) => (
                      <NSpace
                        align="center"
                        wrapItem={false}
                        class="content-item"
                        {...{
                          onClick: this.handleSearchItemClick.bind(this, curr),
                          data_path: curr.path,
                        }}
                      >
                        <div class="content-item-icon">
                          {this.RenderPreIcon(curr.meta)}
                        </div>
                        <div class="content-item-label">
                          {curr.breadcrumbLabel}
                        </div>
                      </NSpace>
                    ))}
                  </NSpace>
                ) : (
                  <NResult size="large" description="暂无搜索结果">
                    {{
                      icon: () => '',
                    }}
                  </NResult>
                )}
              </NScrollbar>
              <div class="global-seach__card-footer">
                <NSpace
                  class="card-footer__tip-wrapper"
                  align="center"
                  wrapItem={false}
                  size={[24, 8]}
                >
                  {this.tiptextOptions.map((curr) => (
                    <div class="tip-wrapper-item">
                      <div class="item-icon">
                        {curr.plain ? (
                          <span>{curr.icon}</span>
                        ) : (
                          <RayIcon name={curr.icon} size="18" />
                        )}
                      </div>
                      <div class="item-laebl">{curr.label}</div>
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

export default GlobalSeach
