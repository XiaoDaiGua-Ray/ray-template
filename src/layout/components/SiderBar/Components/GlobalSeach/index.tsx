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

import { on, off } from '@/utils/element'
import { debounce } from 'lodash-es'
import { useMenu } from '@/store'
import { validRole } from '@/router/basic'

import type { MenuOption } from 'naive-ui'
import type { AppRouteMeta } from '@/router/type'

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

    const { menuModelValueChange } = menuStore
    const modelShow = computed({
      get: () => props.show,
      set: (val) => {
        emit('update:show', val)

        if (!val) {
          state.searchOptions = []
          state.searchValue = null
        }
      },
    })
    const modelMenuOptions = computed(() => menuStore.options)
    const state = reactive({
      searchValue: null,
      searchOptions: [] as IMenuOptions[],
    })

    const tiptextOptions = [
      {
        icon: 'cmd / ctrl + k',
        label: '唤起',
        plain: true,
      },
      {
        icon: 'esc',
        label: '关闭',
        plain: true,
      },
    ]

    /** 按下 ctrl + k 或者 command + k 激活搜索栏 */
    const registerKeyboard = (e: Event) => {
      const _e = e as KeyboardEvent

      if ((_e.ctrlKey || _e.metaKey) && _e.key === 'k') {
        modelShow.value = true
      }
    }

    /** 根据输入值模糊检索菜单 */
    const handleSearchMenuOptions = (value: string) => {
      const arr: IMenuOptions[] = []

      const filterArr = (options: IMenuOptions[]) => {
        options.forEach((curr) => {
          if (curr.children?.length) {
            filterArr(curr.children)
          }

          /** 处理菜单名与输入值, 不区分大小写 */
          const _breadcrumbLabel = curr.breadcrumbLabel?.toLocaleLowerCase()
          const _value = String(value).toLocaleLowerCase()

          if (
            _breadcrumbLabel?.includes(_value) &&
            validRole(curr) &&
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
    }

    const handleSearchItemClick = (option: MenuOption) => {
      const meta = option.meta as AppRouteMeta

      /** 如果配置站外跳转则不会关闭搜索框 */
      if (meta.windowOpen) {
        window.open(meta.windowOpen)
      } else {
        modelShow.value = false

        menuModelValueChange(option.key as string, option)
      }
    }

    onMounted(() => {
      on(window, 'keydown', registerKeyboard)
    })

    onBeforeUnmount(() => {
      off(window, 'keydown', registerKeyboard)
    })

    return {
      ...toRefs(state),
      modelShow,
      tiptextOptions,
      handleSearchMenuOptions: debounce(handleSearchMenuOptions, 300),
      handleSearchItemClick,
    }
  },
  render() {
    return (
      <NModal v-model:show={this.modelShow} transform-origin="center" show>
        <div class="global-seach">
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
                        }}
                      >
                        <div class="content-item-icon">
                          {curr?.meta?.icon ? (
                            <RayIcon name={curr.meta.icon} size="24" />
                          ) : (
                            <RayIcon name="table" size="24" />
                          )}
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
