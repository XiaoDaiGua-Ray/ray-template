/**
 *
 * @description
 * 操作说明:
 *   - 关闭全部: 关闭所有标签页，并且重定向至根页面 rootRoute.path
 *   - 关闭右侧: 关闭右侧所有标签，如果选中标签页与当前激活页不一致并且激活页在右侧，则会重定向至当前选中标签页
 *   - 关闭左侧: 关闭左侧所有标签，如果选中标签页与当前激活页不一致并且激活页在左侧，则会重定向至当前选中标签页
 *   - 关闭其他: 关闭其他所有标签，如果选中标签页与当前激活页不一致并且激活页在其中，则会重定向至当前选中标签页
 *   - 关闭所有: 关闭所有标签页，并且重定向至 root page
 *
 * root path 标签不可被关闭。
 * 页面刷新后，仅会保留刷新前激活 key 的 tag 标签。
 *
 * 注入 MENU_TAG_DATA 属性，用于动态更新 MenuTag 标签所在的位置。
 *
 * 该模板中引入了 Root Path 概念，在 MenuTag 中除了关闭左右侧标签操作能主动移除 Root Tag 之外其余的操作都不允许。
 *
 * outsideClick 方法优先级不如 contextmenu 事件高，所以可能会出现重复右键菜单时，闪烁问题；
 * 虽然使用 throttle 方法进行优化，但是该问题本质并没有解决（v5.0.1 版本修复了该问题）。
 */

import './index.scss'

import {
  NScrollbar,
  NFlex,
  NLayoutHeader,
  NDropdown,
  NButton,
  NIcon,
} from 'naive-ui'
import { RIcon, RMoreDropdown } from '@/components'

import { useMenuGetters, useMenuActions } from '@/store'
import { hasClass, uuid, queryElements } from '@/utils'
import { useMaximize, useSpinning, useAppRoot, useSiderBar } from '@/hooks'
import { throttle } from 'lodash-es'
import { getVariableToRefs } from '@/global-variable'
import { useTemplateRef } from 'vue'

import type { ScrollbarInst } from 'naive-ui'
import type { MenuTagOptions, AppMenuOption } from '@/types'

export default defineComponent({
  name: 'AppMenuTag',
  setup(_, { expose }) {
    const scrollRef = useTemplateRef<ScrollbarInst | null>('scrollRef')
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
    // 哪些下拉框允许禁用
    const canDisabledOptions = [
      'closeAll',
      'closeRight',
      'closeLeft',
      'closeOther',
      'closeCurrentPage',
    ]
    // 当前右键标签页索引位置
    let currentContextmenuIndex = Infinity
    const iconConfig = {
      size: 16,
    }
    // 下拉菜单
    const moreOptions = ref([
      {
        label: '关闭当前页面',
        key: 'closeCurrentPage',
        icon: () => <RIcon name="close" size={iconConfig.size} />,
      },
      {
        label: '最大化当前页面',
        key: 'maximizeLayoutContent',
        icon: () => <RIcon name="fullscreen_fold" size={iconConfig.size} />,
      },
      {
        label: '刷新当前页面',
        key: 'reloadCurrentPage',
        icon: () => <RIcon name="reload" size={iconConfig.size} />,
      },
      {
        label: '新窗口打开',
        key: 'windowOpenTab',
        icon: () => <RIcon name="shared" size={iconConfig.size} />,
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: '关闭左侧标签页',
        key: 'closeLeft',
        icon: () => <RIcon name="close_left" size={iconConfig.size} />,
      },
      {
        label: '关闭右侧标签页',
        key: 'closeRight',
        icon: () => <RIcon name="close_right" size={iconConfig.size} />,
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: '关闭其他标签页',
        key: 'closeOther',
        icon: () => <RIcon name="close_other" size={iconConfig.size} />,
      },
      {
        label: '关闭所有标签页',
        key: 'closeAll',
        icon: () => <RIcon name="resize_h" size={iconConfig.size} />,
        disabled: false,
      },
    ])
    // scroll bar uuid
    const uuidScrollBar = uuid(16)
    const actionMap = {
      closeCurrentPage: () => {
        getMenuKey.value !== getRootPath.value && close(currentContextmenuIndex)
      },
      reloadCurrentPage: () => {
        reload()
      },
      closeAll: () => {
        $closeAll()
      },
      closeRight: () => {
        $closeRight(currentContextmenuIndex)
      },
      closeLeft: () => {
        $closeLeft(currentContextmenuIndex)
      },
      closeOther: () => {
        $closeOther(currentContextmenuIndex)
      },
      windowOpenTab: () => {
        const option = getMenuTagOptions.value[currentContextmenuIndex]

        if (!option?.fullPath) {
          return
        }

        // 兼容配置 hash 前缀的情况
        const path = option.fullPath.startsWith('#')
          ? option.fullPath
          : `#${option.fullPath}`

        window.open(path, '_blank')
      },
      maximizeLayoutContent: () => {
        const option = getMenuTagOptions.value[currentContextmenuIndex]

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
    // 注入 tag 前缀
    const MENU_TAG_DATA = 'menu_tag_data'
    const globalMainLayoutLoad = getVariableToRefs('globalMainLayoutLoad')
    // naive scrollbar 容器 class
    const naiveScrollbarContainerClass = 'n-scrollbar-container'
    // 缓存上一次的菜单 key
    let catchMenuKey = getMenuKey.value

    // 关闭当前菜单标签，如果只有一个标签，则不允许关闭
    const closeCurrentMenuTag = (idx: number) => {
      close(idx)
    }

    // 动态设置右键菜单的禁用项
    const setMoreOptionsDisabled = (
      key: (typeof moreOptions.value)[number]['key'],
      disabled: boolean,
    ) => {
      for (const curr of moreOptions.value) {
        if (curr.key === key) {
          curr.disabled = disabled

          break
        }
      }
    }

    // 菜单标签点击更新当前菜单激活项
    const menuTagClick = (option: AppMenuOption) => {
      actionState.actionDropdownShow = false

      changeMenuModelValue(option.fullPath, option)
    }

    // 获取滚动条容器
    const getScrollElement = () => {
      const scroll = document.getElementById(uuidScrollBar) // 获取滚动条容器

      if (scroll) {
        const scrollContentElement = Array.from(
          scroll.childNodes,
        ) as HTMLElement[]
        const findElement = scrollContentElement.find((el) => {
          const has = hasClass(el, naiveScrollbarContainerClass)

          return has.value
        })

        return findElement
      }
    }

    // 手动滚动容器
    const scrollX = (type: 'left' | 'right') => {
      const el = getScrollElement()

      if (el) {
        // 找到实际横向滚动元素（class：n-scrollbar-container）
        // 获取 scrollLeft 属性后, 用于左右滚动边界值进行处理
        const scrollX = el!.scrollLeft || 0
        const rolling =
          type === 'left' ? Math.max(0, scrollX - 200) : scrollX + 200

        scrollRef.value?.scrollTo({
          left: rolling,
          behavior: 'smooth',
        })
      }
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

      currentContextmenuIndex = idx
      actionState.actionDropdownShow = false

      nextTick(() => {
        actionState.actionDropdownShow = true
        actionState.x = e.clientX
        actionState.y = e.clientY
      })
    }

    // 动态设置某些项禁用
    const setDisabledAccordionToIndex = () => {
      const { closeable } =
        getMenuTagOptions.value[currentContextmenuIndex] ??
        ({} as MenuTagOptions)

      // 是否需要禁用关闭当前标签页
      setMoreOptionsDisabled('closeCurrentPage', !closeable ?? false)

      // 是否需要禁用关闭右侧标签页
      checkCloseRight(currentContextmenuIndex)
        ? setMoreOptionsDisabled('closeRight', false)
        : setMoreOptionsDisabled('closeRight', true)

      // 是否需要禁用关闭左侧标签页
      checkCloseLeft(currentContextmenuIndex)
        ? setMoreOptionsDisabled('closeLeft', false)
        : setMoreOptionsDisabled('closeLeft', true)
    }

    // 如果通过更多按钮触发关闭事件，则根据当前标签所在索引值为 currentContextmenuIndex
    // 并且动态设置是否可操作状态
    const setCurrentContextmenuIndex = () => {
      const index = getMenuTagOptions.value.findIndex(
        (curr) => curr.fullPath === getMenuKey.value,
      )

      currentContextmenuIndex = index

      setDisabledAccordionToIndex()
    }

    // 仅有 getMenuTagOptions 长度大于 1 并且非 root path 时，才激活关闭按钮
    const menuTagMouseenter = (option: MenuTagOptions) => {
      if (
        getMenuTagOptions.value.length > 1 &&
        option.fullPath !== getRootPath.value
      ) {
        option.closeable = true
      }
    }

    // 移出 MenuTag 时，判断是否为当前已激活 key
    const menuTagMouseleave = (option: MenuTagOptions) => {
      if (option.fullPath !== getMenuKey.value) {
        option.closeable = false
      }
    }

    // 每当新的页面打开后，将滚动条横向滚到至底部，使用 nextTick 避免元素未渲染挂载至页面
    const updateScrollBarPosition = () => {
      const el = getScrollElement()

      if (el) {
        nextTick().then(() => {
          scrollRef.value?.scrollTo({
            left: 99999,
            behavior: 'smooth',
          })
        })
      }
    }

    // 动态更新 menu tag 所在位置
    const positionMenuTag = () => {
      nextTick().then(() => {
        const tags = queryElements<HTMLElement>(
          `attr:${MENU_TAG_DATA}="${getMenuKey.value}"`,
        )

        if (tags?.length) {
          const [menuTag] = tags

          nextTick().then(() => {
            scrollRef.value?.scrollTo({
              left: menuTag.offsetLeft,
              behavior: 'smooth',
            })
          })
        }
      })
    }

    // 最大化内容区域按钮点击
    const maximizeBtnClick = () => {
      maximize(true)
    }

    watch(
      () => getMenuTagOptions.value,
      (ndata, odata) => {
        // 当 menuTagOptions 长度为 1时，禁用所有 canDisabledOptions 匹配的项
        moreOptions.value.forEach((curr) => {
          if (canDisabledOptions.includes(curr.key)) {
            ndata.length > 1 ? (curr.disabled = false) : (curr.disabled = true)
          }
        })

        // 更新当前激活标签定位
        if (odata?.length) {
          if (ndata.length > odata?.length) {
            updateScrollBarPosition()
          } else if (ndata.length === odata?.length) {
            positionMenuTag()
          }
        }

        // 初始化时，滚动到当前激活标签页
        if (odata === void 0) {
          positionMenuTag()
        }
      },
      {
        immediate: true,
      },
    )
    watchEffect(() => {
      if (actionState.actionDropdownShow) {
        // 使用节流函数，避免右键菜单闪烁问题
        throttle(setDisabledAccordionToIndex, 300)?.()
      }

      if (catchMenuKey !== getMenuKey.value) {
        catchMenuKey = getMenuKey.value

        positionMenuTag()
      }
    })

    expose()

    return {
      getMenuTagOptions,
      closeCurrentMenuTag,
      getMenuKey,
      menuTagClick,
      moreOptions,
      scrollX,
      scrollRef,
      uuidScrollBar,
      actionDropdownSelect,
      actionState,
      menuTagContextMenu,
      setCurrentContextmenuIndex,
      menuTagMouseenter,
      menuTagMouseleave,
      MENU_TAG_DATA,
      iconConfig,
      maximize,
      reload,
      globalMainLayoutLoad,
      maximizeBtnClick,
    }
  },
  render() {
    const {
      iconConfig,
      uuidScrollBar,
      getMenuTagOptions,
      MENU_TAG_DATA,
      globalMainLayoutLoad,
    } = this
    const {
      maximizeBtnClick,
      closeCurrentMenuTag,
      scrollX,
      $t,
      menuTagClick,
      menuTagContextMenu,
      menuTagMouseenter,
      menuTagMouseleave,
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
            onSelect={actionDropdownSelect.bind(this)}
          />
          <NFlex
            class="menu-tag-space"
            wrap={false}
            align="center"
            justify="space-between"
            inline
          >
            <NButton
              quaternary
              class="override-button__menu-tag"
              focusable={false}
              onClick={this.scrollX.bind(this, 'left')}
            >
              {{
                icon: () => (
                  <RIcon
                    name="expanded"
                    width={iconConfig.size}
                    height={iconConfig.size}
                    customClassName="menu-tag__left-arrow"
                  />
                ),
              }}
            </NButton>
            <NScrollbar
              xScrollable
              ref="scrollRef"
              {...{
                id: uuidScrollBar,
              }}
              themeOverrides={{
                width: '0px',
                height: '0px',
              }}
            >
              <NFlex
                class="menu-tag-wrapper"
                wrap={false}
                align="center"
                justify="start"
              >
                {getMenuTagOptions.map((curr, idx) => (
                  <NButton
                    key={curr.fullPath}
                    class={['menu-tag__btn']}
                    strong
                    secondary
                    type={
                      curr.fullPath === this.getMenuKey ? 'primary' : 'default'
                    }
                    {...{
                      onClick: menuTagClick.bind(this, curr),
                      onContextmenu: menuTagContextMenu.bind(this, idx),
                      onMouseenter: menuTagMouseenter.bind(this, curr),
                      onMouseleave: menuTagMouseleave.bind(this, curr),
                      onBlur: () => {
                        this.actionState.actionDropdownShow = false
                      },
                      [MENU_TAG_DATA]: curr.fullPath,
                    }}
                    size="small"
                  >
                    {{
                      default: () => (
                        <>
                          <span>
                            {{
                              default: () => {
                                const {
                                  breadcrumbLabel,
                                  meta: { i18nKey },
                                } = curr

                                return i18nKey ? $t(i18nKey) : breadcrumbLabel
                              },
                            }}
                          </span>
                          <NIcon
                            class="menu-tag__btn-icon"
                            {...{
                              onMousedown: closeCurrentMenuTag.bind(this, idx),
                            }}
                          >
                            <RIcon name="close" size="14" />
                          </NIcon>
                        </>
                      ),
                    }}
                  </NButton>
                ))}
              </NFlex>
            </NScrollbar>
            <NFlex align="center" inline wrap={false} size={[0, 0]}>
              <NButton
                quaternary
                class="override-button__menu-tag"
                focusable={false}
                onClick={scrollX.bind(this, 'right')}
              >
                {{
                  icon: () => (
                    <RIcon
                      name="expanded"
                      width={iconConfig.size}
                      height={iconConfig.size}
                      style={{
                        transform: 'rotate(180deg)',
                      }}
                    />
                  ),
                }}
              </NButton>
              <NButton
                quaternary
                class="override-button__menu-tag"
                focusable={false}
                onClick={maximizeBtnClick}
              >
                {{
                  icon: () => (
                    <RIcon
                      name="fullscreen_fold"
                      width={iconConfig.size}
                      height={iconConfig.size}
                    />
                  ),
                }}
              </NButton>
              <NButton
                quaternary
                class="override-button__menu-tag"
                focusable={false}
                onClick={() => {
                  reload()
                }}
              >
                {{
                  icon: () => (
                    <RIcon
                      name="reload"
                      width={iconConfig.size}
                      height={iconConfig.size}
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
                iconSize={18}
                keyboard={false}
              >
                <NButton
                  quaternary
                  class="override-button__menu-tag"
                  focusable={false}
                  onClick={this.setCurrentContextmenuIndex.bind(this)}
                >
                  {{
                    icon: () => (
                      <RIcon
                        name="more"
                        width={iconConfig.size}
                        height={iconConfig.size}
                      />
                    ),
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
