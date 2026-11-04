import { positionSelectedMenuItem } from '@/layout/utils/position-selected-menu-item'
import './index.scss'
import { RIcon } from '@/components'
import { useDevice } from '@/hooks'
import type { AppRouteMeta } from '@/router/types'
import { useMenuActions, useMenuGetters } from '@/store'
import type { AppMenuOption } from '@/types'
import { useEventListener } from '@vueuse/core'
import {
  NCard,
  NFlex,
  NInput,
  NModal,
  NResult,
  NScrollbar,
  NText,
} from 'naive-ui'

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
    const { getMenuOptions } = useMenuGetters()

    const modelShow = computed({
      get: () => props.show,
      set: (val) => {
        emit('update:show', val)

        if (!val) {
          resetSearchSomeValue()
        }
      },
    })
    const searchValue = ref('')
    const searchElementIndex = ref(0)
    const visibleLeaves = computed(() => {
      const leaves: AppMenuOption[] = []
      const visit = (items: AppMenuOption[]) => {
        for (const item of items) {
          if (item.show === false) continue

          if (item.children?.length) visit(item.children)
          else leaves.push(item)
        }
      }

      visit(getMenuOptions.value)

      return leaves
    })
    const searchOptions = computed(() => {
      const term = searchValue.value.trim().toLocaleLowerCase()

      return term
        ? visibleLeaves.value.filter(({ breadcrumbLabel }) =>
            breadcrumbLabel?.toLocaleLowerCase().includes(term),
          )
        : []
    })

    watch(searchOptions, () => {
      searchElementIndex.value = 0
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
    const resetSearchSomeValue = () => {
      searchValue.value = ''
      searchElementIndex.value = 0
    }

    // 断点 observer 会同步执行，先初始化其调用的重置函数。
    const { isTabletOrSmaller } = useDevice({
      observer: (val) => {
        // 当处于小尺寸状态时，自动关闭搜索框
        if (val) {
          modelShow.value = false
        }
      },
    })

    // 按下 ctrl + k 或者 command + k 激活搜索栏
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

    const searchItemClick = async (option: AppMenuOption) => {
      if (!option.meta.windowOpen) modelShow.value = false

      await changeMenuModelValue(option.fullPath, option)

      if (!option.meta.windowOpen) positionSelectedMenuItem()
    }

    // 渲染搜索菜单前缀图标，如果没有则用 icon table 代替
    const RenderPreIcon = (meta: AppRouteMeta) => {
      const { icon } = meta

      if (typeof icon === 'string' && icon) {
        return <RIcon name={icon} size="24" />
      } else if (typeof icon === 'function') {
        return <icon />
      } else {
        return <RIcon name="action/search" size="24" />
      }
    }

    const registerChangeSearchElementIndex = (event: KeyboardEvent) => {
      const { key } = event

      if (!['ArrowUp', 'ArrowDown', 'Enter'].includes(key)) return

      event.preventDefault()
      event.stopPropagation()

      const options = searchOptions.value

      if (!options.length) return

      if (key === 'Enter') {
        const selected = options[searchElementIndex.value]

        if (selected) void searchItemClick(selected)

        return
      }

      const offset = key === 'ArrowUp' ? -1 : 1

      searchElementIndex.value =
        (searchElementIndex.value + offset + options.length) % options.length
    }

    const SearchItem = ({
      menuOption,
      active,
    }: {
      menuOption: AppMenuOption
      active: boolean
    }) => (
      <NFlex
        align="center"
        class={['content-item', { 'content-item--active': active }]}
        {...{ onClick: () => searchItemClick(menuOption) }}
      >
        <div class="content-item-icon">{RenderPreIcon(menuOption.meta)}</div>
        <div class="content-item-label">{menuOption.breadcrumbLabel}</div>
        <RIcon
          name="directional/enter"
          size="18"
          customClassName="content-item-icon__enter"
        />
      </NFlex>
    )

    useEventListener(window, 'keydown', registerArouseKeyboard)

    return {
      searchValue,
      searchOptions,
      searchElementIndex,
      modelShow,
      helperTipOptions,
      isTabletOrSmaller,
      SearchItem,
      registerChangeSearchElementIndex,
    }
  },
  render() {
    const {
      isTabletOrSmaller,
      searchOptions,
      searchElementIndex,
      SearchItem,
      registerChangeSearchElementIndex,
    } = this

    return isTabletOrSmaller ? (
      <div style="display: none;"></div>
    ) : (
      <NModal
        v-model:show={this.modelShow}
        transformOrigin="center"
        displayDirective="if"
      >
        <div
          class="global-search global-search--dark global-search--light"
          tabindex="-1"
          onKeydown={registerChangeSearchElementIndex}
        >
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
                  >
                    {{
                      prefix: () => <RIcon name="action/search" size="24" />,
                    }}
                  </NInput>
                ),
                default: () => (
                  <NScrollbar>
                    {searchOptions.length ? (
                      <NFlex
                        vertical
                        size={[0, 6]}
                        class="global-search__card-content"
                      >
                        {searchOptions.map((curr, idx) => (
                          <SearchItem
                            menuOption={curr}
                            key={curr.fullPath}
                            active={idx === searchElementIndex}
                          />
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
