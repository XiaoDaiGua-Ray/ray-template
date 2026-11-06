import './index.scss'
import { RIcon, RMoreDropdown } from '@/components'
import { useI18n, useMaximize, useSiderBar, useSpinning } from '@/hooks'
import { FORBIDDEN_ROUTE_PATH } from '@/router/constant'
import { useMenuActions, useMenuGetters, useRuntimeGetters } from '@/store'
import type { AppMenuOption, MenuTagOptions } from '@/types'
import { ShellTab } from '@ray-template/admin-shell'
import { usePreferredReducedMotion, useResizeObserver } from '@vueuse/core'
import { NDropdown, NFlex, NLayoutHeader, NScrollbar } from 'naive-ui'
import type { ScrollbarInst } from 'naive-ui'
import { useTemplateRef } from 'vue'

const Chevron = ({ direction }: { direction: 'left' | 'right' }) => (
  <RIcon
    name="directional/expanded"
    size={18}
    customClassName={`menu-tag__chevron--${direction}`}
  />
)

export default defineComponent({
  name: 'AppMenuTag',
  setup(_, { expose }) {
    const scrollRef = useTemplateRef<ScrollbarInst | null>('scrollRef')
    const tagsRef = useTemplateRef<HTMLElement>('tags')
    const actionsButton = useTemplateRef<HTMLButtonElement>('actionsButton')
    const route = useRoute()
    const showingForbidden = computed(() => route.path === FORBIDDEN_ROUTE_PATH)
    const { t } = useI18n('menuTag')
    const { getCurrentMenuOption, getMenuTagOptions } = useMenuGetters()
    const getMenuKey = computed(
      () => getCurrentMenuOption.value?.fullPath ?? null,
    )
    const { changeMenuModelValue } = useMenuActions()
    const { maximize } = useMaximize()
    const { reload } = useSpinning()
    const {
      close,
      closeForbiddenPage,
      closeAll: $closeAll,
      closeRight: $closeRight,
      closeLeft: $closeLeft,
      closeOther: $closeOther,
      checkCloseLeft,
      checkCloseRight,
    } = useSiderBar()
    // 当前右键标签页索引位置
    const currentContextmenuIndex = ref(-1)
    const closeStatus = async (restoreFocus: boolean) => {
      const navigation = closeForbiddenPage()

      if (!navigation || (await navigation) || !restoreFocus) return

      await nextTick()
      const active = tagsRef.value?.querySelector<HTMLButtonElement>(
        '.menu-tag__tab[aria-current="page"]',
      )
      const focus = active ?? actionsButton.value

      focus?.focus()
    }
    // 下拉菜单
    const moreOptions = computed(() => [
      {
        label: t('closeCurrent'),
        key: 'closeCurrentPage',
        disabled:
          !(showingForbidden.value && currentContextmenuIndex.value === -1) &&
          !canClose(getMenuTagOptions.value[currentContextmenuIndex.value]),
        icon: () => <RIcon name="action/close" size="1em" />,
      },
      {
        label: t('maximize'),
        key: 'maximizeLayoutContent',
        icon: () => <RIcon name="action/fullscreen" size="1em" />,
      },
      {
        label: t('reload'),
        key: 'reloadCurrentPage',
        icon: () => <RIcon name="action/reload" size="1em" />,
      },
      {
        label: t('newWindow'),
        key: 'windowOpenTab',
        disabled: !getMenuTagOptions.value[currentContextmenuIndex.value],
        icon: () => <RIcon name="navigation/window" size="1em" />,
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
        disabled:
          getMenuTagOptions.value.length < 2 ||
          !getMenuTagOptions.value[currentContextmenuIndex.value],
        icon: () => <RIcon name="action/close_other" size="1em" />,
      },
      {
        label: t('closeAll'),
        key: 'closeAll',
        icon: () => <RIcon name="action/close_all" size="1em" />,
        disabled: getMenuTagOptions.value.length === 0,
      },
    ])
    const actionMap = {
      closeCurrentPage: () => {
        if (showingForbidden.value && currentContextmenuIndex.value === -1)
          return closeStatus(true)

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
    const canClose = (option?: MenuTagOptions) => !!option

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

    const scroller = computed(() =>
      tagsRef.value?.closest<HTMLElement>('.n-scrollbar-container'),
    )
    const scrollState = reactive({ left: false, right: false })
    const reducedMotion = usePreferredReducedMotion()
    const syncScroll = () => {
      const element = scroller.value

      if (!element) return

      scrollState.left = element.scrollLeft > 1
      scrollState.right =
        element.scrollWidth - element.clientWidth - element.scrollLeft > 1
    }

    useResizeObserver([scroller, tagsRef], syncScroll)

    const scrollX = (direction: 'left' | 'right') => {
      const element = scroller.value

      if (!element || !scrollState[direction]) return

      const distance = Math.max(100, element.clientWidth * 0.75)

      scrollRef.value?.scrollTo({
        left:
          element.scrollLeft + (direction === 'left' ? -distance : distance),
        behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth',
      })
    }

    // 更多操作操作栏
    const actionDropdownSelect = (key: string | number) => {
      actionState.actionDropdownShow = false

      const fn = actionMap[key as keyof typeof actionMap]

      return fn?.()
    }

    // 右键点击标签页
    // 缓存当前点击标签页索引值（用于关闭左或者右侧标签页操作）
    const menuTagContextMenu = (idx: number, e: MouseEvent) => {
      e.preventDefault()

      currentContextmenuIndex.value = idx
      actionState.x = e.clientX
      actionState.y = e.clientY
      actionState.actionDropdownShow = true
    }

    const dismissContextMenu = (event: MouseEvent | TouchEvent) => {
      // clickoutside 在 mouseup 触发；标签上的同一次右键抬起不能关闭刚切换的菜单。
      if (
        event instanceof MouseEvent &&
        event.button === 2 &&
        event.target instanceof Element &&
        tagsRef.value?.contains(event.target.closest('.menu-tag__item'))
      )
        return

      actionState.actionDropdownShow = false
    }

    const setCurrentContextmenuIndex = () => {
      currentContextmenuIndex.value = getMenuTagOptions.value.findIndex(
        ({ fullPath }) => fullPath === getMenuKey.value,
      )
    }

    const positionMenuTag = () => {
      const element = scroller.value
      const active = tagsRef.value?.querySelector('.menu-tag__item--active')

      syncScroll()

      if (!active || !element) return

      const tab = active.getBoundingClientRect()
      const viewport = element.getBoundingClientRect()
      const delta =
        tab.left < viewport.left
          ? tab.left - viewport.left
          : Math.max(0, tab.right - viewport.right)

      if (delta)
        scrollRef.value?.scrollTo({
          left: element.scrollLeft + delta,
          behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth',
        })
    }

    watch(
      [getMenuKey, () => getMenuTagOptions.value.length, tagsRef],
      positionMenuTag,
      { flush: 'post' },
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
      scrollState,
      syncScroll,
      scrollRef,
      tagsRef,
      showingForbidden,
      closeStatus,
      actionDropdownSelect,
      actionState,
      menuTagContextMenu,
      dismissContextMenu,
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
            show={this.actionState.actionDropdownShow}
            trigger="manual"
            placement="bottom-start"
            onSelect={actionDropdownSelect}
            onUpdateShow={(show) => {
              this.actionState.actionDropdownShow = show
            }}
            onClickoutside={this.dismissContextMenu}
          />
          <NFlex
            class="menu-tag-space"
            size={4}
            wrap={false}
            align="center"
            justify="space-between"
            inline
          >
            <button
              type="button"
              class="menu-tag__control menu-tag__control--scroll"
              aria-label={$t('menuTag.scrollLeft')}
              aria-disabled={!this.scrollState.left}
              title={$t('menuTag.scrollLeft')}
              onClick={() => this.scrollX('left')}
            >
              <Chevron direction="left" />
            </button>
            <NScrollbar
              xScrollable
              onScroll={this.syncScroll}
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
            <button
              type="button"
              class="menu-tag__control menu-tag__control--scroll"
              aria-label={$t('menuTag.scrollRight')}
              aria-disabled={!this.scrollState.right}
              title={$t('menuTag.scrollRight')}
              onClick={() => this.scrollX('right')}
            >
              <Chevron direction="right" />
            </button>
            <div class="menu-tag__tools">
              {this.showingForbidden && (
                <button
                  type="button"
                  class="menu-tag__control"
                  aria-label={$t('menuTag.closeCurrent')}
                  title={$t('menuTag.closeCurrent')}
                  onClick={(event) => this.closeStatus(event.detail === 0)}
                >
                  <RIcon name="action/close" size={16} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                class="menu-tag__control"
                aria-label={$t('layout.maximize')}
                title={$t('layout.maximize')}
                onClick={() => this.maximize(true)}
              >
                <RIcon name="action/fullscreen" size={16} />
              </button>
              <button
                type="button"
                class="menu-tag__control"
                aria-label={$t('menuTag.reload')}
                title={$t('menuTag.reload')}
                onClick={() => reload()}
              >
                <RIcon
                  name="action/reload"
                  size={16}
                  customClassName={
                    globalMainLayoutLoad
                      ? ''
                      : 'menu-tag__right-setting--spinning'
                  }
                />
              </button>
              <RMoreDropdown
                class="menu-tag__dropdown"
                options={this.moreOptions}
                trigger="click"
                onSelect={actionDropdownSelect}
              >
                <button
                  ref="actionsButton"
                  type="button"
                  class="menu-tag__control"
                  aria-label={$t('menuTag.actions')}
                  title={$t('menuTag.actions')}
                  onClick={this.setCurrentContextmenuIndex}
                >
                  <RIcon name="action/more" size={16} />
                </button>
              </RMoreDropdown>
            </div>
          </NFlex>
        </div>
      </NLayoutHeader>
    )
  },
})
