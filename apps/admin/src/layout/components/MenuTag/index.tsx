import { RIcon, RMoreDropdown } from '@/components'
import {
  useAppRoot,
  useI18n,
  useMaximize,
  useSiderBar,
  useSpinning,
} from '@/hooks'
import { useMenuActions, useMenuGetters, useRuntimeGetters } from '@/store'
import type { AppMenuOption, MenuTagOptions } from '@/types'
import { ShellTab } from '@ray-template/admin-shell'
import { NButton, NDropdown, NFlex, NLayoutHeader, NScrollbar } from 'naive-ui'
import type { ScrollbarInst } from 'naive-ui'
import { useTemplateRef } from 'vue'

export default defineComponent({
  name: 'AppMenuTag',
  setup(_, { expose }) {
    const scrollRef = useTemplateRef<ScrollbarInst | null>('scrollRef')
    const tagsRef = useTemplateRef<HTMLElement>('tags')
    const { t } = useI18n('menuTag')
    const { getMenuKey, getMenuTagOptions } = useMenuGetters()
    const { changeMenuModelValue } = useMenuActions()
    const { getRootPath } = useAppRoot()
    const { maximize } = useMaximize()
    const { reload } = useSpinning()
    const {
      close,
      closeAll: $closeAll,
      closeRight: $closeRight,
      closeLeft: $closeLeft,
      closeOther: $closeOther,
      checkCloseLeft,
      checkCloseRight,
    } = useSiderBar()
    // 当前右键标签页索引位置
    const currentContextmenuIndex = ref(-1)
    // 下拉菜单
    const moreOptions = computed(() => [
      {
        label: t('closeCurrent'),
        key: 'closeCurrentPage',
        disabled: !canClose(
          getMenuTagOptions.value[currentContextmenuIndex.value],
        ),
        icon: () => <RIcon name="action/close" size="1em" />,
      },
      {
        label: t('maximize'),
        key: 'maximizeLayoutContent',
        icon: () => <RIcon name="action/fullscreen_fold" size="1em" />,
      },
      {
        label: t('reload'),
        key: 'reloadCurrentPage',
        icon: () => <RIcon name="action/reload" size="1em" />,
      },
      {
        label: t('newWindow'),
        key: 'windowOpenTab',
        icon: () => <RIcon name="action/shared" size="1em" />,
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: t('closeLeft'),
        key: 'closeLeft',
        disabled:
          !getMenuTagOptions.value[currentContextmenuIndex.value] ||
          !checkCloseLeft(currentContextmenuIndex.value),
        icon: () => <RIcon name="action/close_left" size="1em" />,
      },
      {
        label: t('closeRight'),
        key: 'closeRight',
        disabled:
          !getMenuTagOptions.value[currentContextmenuIndex.value] ||
          !checkCloseRight(currentContextmenuIndex.value),
        icon: () => <RIcon name="action/close_right" size="1em" />,
      },
      {
        type: 'divider',
        key: 'd2',
      },
      {
        label: t('closeOther'),
        key: 'closeOther',
        disabled: getMenuTagOptions.value.length < 2,
        icon: () => <RIcon name="action/close_other" size="1em" />,
      },
      {
        label: t('closeAll'),
        key: 'closeAll',
        icon: () => <RIcon name="directional/resize_h" size="1em" />,
        disabled: getMenuTagOptions.value.length < 2,
      },
    ])
    const actionMap = {
      closeCurrentPage: () => {
        closeCurrentMenuTag(currentContextmenuIndex.value)
      },
      reloadCurrentPage: () => {
        reload()
      },
      closeAll: () => {
        $closeAll()
      },
      closeRight: () => {
        $closeRight(currentContextmenuIndex.value)
      },
      closeLeft: () => {
        $closeLeft(currentContextmenuIndex.value)
      },
      closeOther: () => {
        $closeOther(currentContextmenuIndex.value)
      },
      windowOpenTab: () => {
        const option = getMenuTagOptions.value[currentContextmenuIndex.value]

        if (!option?.fullPath) {
          return
        }

        // 兼容配置 hash 前缀的情况
        const path = option.fullPath.startsWith('#')
          ? option.fullPath
          : `#${option.fullPath}`

        window.open(path, '_blank', 'noopener')
      },
      maximizeLayoutContent: () => {
        const option = getMenuTagOptions.value[currentContextmenuIndex.value]

        maximize(true)
        option && menuTagClick(option)
      },
    }
    // 右键菜单
    const actionState = reactive({
      x: 0,
      y: 0,
      actionDropdownShow: false,
    })
    const globalMainLayoutLoad = useRuntimeGetters().globalMainLayoutLoad
    const canClose = (option?: MenuTagOptions) =>
      !!option &&
      getMenuTagOptions.value.length > 1 &&
      option.fullPath !== getRootPath.value

    const closeCurrentMenuTag = (index: number, restoreFocus = false) => {
      const option = getMenuTagOptions.value[index]

      if (!option || !canClose(option)) return

      const focusIndex =
        option.fullPath === getMenuKey.value ? Math.max(0, index - 1) : index

      close(index)

      if (restoreFocus) {
        void nextTick(() => {
          const tabs =
            tagsRef.value?.querySelectorAll<HTMLButtonElement>('.menu-tag__tab')

          tabs?.[Math.min(focusIndex, tabs.length - 1)]?.focus()
        })
      }
    }

    // 菜单标签点击更新当前菜单激活项
    const menuTagClick = (option: AppMenuOption) => {
      actionState.actionDropdownShow = false

      changeMenuModelValue(option.fullPath, option)
    }

    const getScrollElement = () =>
      tagsRef.value?.closest<HTMLElement>('.n-scrollbar-container')

    const scrollX = (direction: 'left' | 'right') => {
      const scroller = getScrollElement()

      if (!scroller) return

      scrollRef.value?.scrollTo({
        left: Math.max(
          0,
          scroller.scrollLeft + (direction === 'left' ? -200 : 200),
        ),
        behavior: 'smooth',
      })
    }

    // 更多操作操作栏
    const actionDropdownSelect = (key: string | number) => {
      actionState.actionDropdownShow = false

      const fn = actionMap[key as keyof typeof actionMap]

      fn?.()
    }

    // 右键点击标签页
    // 缓存当前点击标签页索引值（用于关闭左或者右侧标签页操作）
    const menuTagContextMenu = (idx: number, e: MouseEvent) => {
      e.preventDefault()

      currentContextmenuIndex.value = idx
      actionState.actionDropdownShow = false

      nextTick(() => {
        actionState.x = e.clientX
        actionState.y = e.clientY
        actionState.actionDropdownShow = true
      })
    }

    const setCurrentContextmenuIndex = () => {
      currentContextmenuIndex.value = getMenuTagOptions.value.findIndex(
        ({ fullPath }) => fullPath === getMenuKey.value,
      )
    }

    const positionMenuTag = () => {
      const scroller = getScrollElement()
      const active = tagsRef.value?.querySelector('.menu-tag__item--active')

      if (!active || !scroller) return

      const tab = active.getBoundingClientRect()
      const viewport = scroller.getBoundingClientRect()
      const delta =
        tab.left < viewport.left
          ? tab.left - viewport.left
          : Math.max(0, tab.right - viewport.right)

      if (delta)
        scrollRef.value?.scrollTo({
          left: scroller.scrollLeft + delta,
          behavior: 'smooth',
        })
    }

    watch(
      [getMenuKey, () => getMenuTagOptions.value.length, tagsRef],
      positionMenuTag,
      {
        flush: 'post',
      },
    )

    expose()

    return {
      getMenuTagOptions,
      canClose,
      closeCurrentMenuTag,
      getMenuKey,
      menuTagClick,
      moreOptions,
      scrollX,
      scrollRef,
      tagsRef,
      actionDropdownSelect,
      actionState,
      menuTagContextMenu,
      setCurrentContextmenuIndex,
      maximize,
      reload,
      globalMainLayoutLoad,
    }
  },
  render() {
    const { getMenuTagOptions, globalMainLayoutLoad } = this
    const {
      canClose,
      closeCurrentMenuTag,
      $t,
      menuTagClick,
      menuTagContextMenu,
      actionDropdownSelect,
      reload,
    } = this

    return (
      <NLayoutHeader>
        <div class="menu-tag">
          <NDropdown
            class="menu-tag__dropdown"
            options={this.moreOptions}
            x={this.actionState.x}
            y={this.actionState.y}
            keyboard={false}
            show={this.actionState.actionDropdownShow}
            trigger="manual"
            placement="bottom-start"
            onSelect={actionDropdownSelect}
            onClickoutside={() => {
              this.actionState.actionDropdownShow = false
            }}
          />
          <NFlex
            class="menu-tag-space"
            size={4}
            wrap={false}
            align="center"
            justify="space-between"
            inline
          >
            <NButton
              quaternary
              class="override-button__menu-tag"
              aria-label={$t('menuTag.scrollLeft')}
              onClick={() => this.scrollX('left')}
            >
              {{
                icon: () => <RIcon name="directional/left_arrow" />,
              }}
            </NButton>
            <NScrollbar
              xScrollable
              ref="scrollRef"
              class="menu-tag__scroll"
              themeOverrides={{ width: '0px', height: '0px' }}
            >
              <div
                ref="tags"
                class="menu-tag-wrapper"
                role="group"
                aria-label={$t('menuTag.pages')}
              >
                {getMenuTagOptions.map((curr, idx) => {
                  const active = curr.fullPath === this.getMenuKey
                  const label = curr.meta.i18nKey
                    ? $t(curr.meta.i18nKey)
                    : curr.breadcrumbLabel || curr.fullPath

                  return (
                    <ShellTab
                      key={curr.fullPath}
                      label={label}
                      active={active}
                      select={() => menuTagClick(curr)}
                      closeLabel={$t('menuTag.closeNamed', { name: label })}
                      close={
                        canClose(curr)
                          ? (restoreFocus) =>
                              closeCurrentMenuTag(idx, restoreFocus)
                          : void 0
                      }
                      contextMenu={(event) => menuTagContextMenu(idx, event)}
                    />
                  )
                })}
              </div>
            </NScrollbar>
            <NFlex align="center" inline wrap={false} size={[0, 0]}>
              <NButton
                quaternary
                class="override-button__menu-tag"
                aria-label={$t('menuTag.scrollRight')}
                onClick={() => this.scrollX('right')}
              >
                {{
                  icon: () => <RIcon name="directional/right_arrow" />,
                }}
              </NButton>
              <NButton
                quaternary
                class="override-button__menu-tag"
                aria-label={$t('layout.maximize')}
                {...{ title: $t('layout.maximize') }}
                onClick={() => this.maximize(true)}
              >
                {{
                  icon: () => <RIcon name="action/fullscreen_fold" />,
                }}
              </NButton>
              <NButton
                quaternary
                class="override-button__menu-tag"
                aria-label={$t('menuTag.reload')}
                onClick={() => {
                  reload()
                }}
              >
                {{
                  icon: () => (
                    <RIcon
                      name="action/reload"
                      customClassName={`${
                        !globalMainLayoutLoad
                          ? 'menu-tag__right-setting--spinning'
                          : ''
                      }`}
                    />
                  ),
                }}
              </NButton>
              <RMoreDropdown
                class="menu-tag__dropdown"
                options={this.moreOptions}
                trigger="click"
                onSelect={this.actionDropdownSelect.bind(this)}
              >
                <NButton
                  quaternary
                  class="override-button__menu-tag"
                  aria-label={$t('menuTag.actions')}
                  onClick={this.setCurrentContextmenuIndex}
                >
                  {{
                    icon: () => <RIcon name="action/more" />,
                  }}
                </NButton>
              </RMoreDropdown>
            </NFlex>
          </NFlex>
        </div>
      </NLayoutHeader>
    )
  },
})
