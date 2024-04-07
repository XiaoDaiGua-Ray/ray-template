/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-08
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 操作说明:
 *   - 关闭全部: 关闭所有标签页，并且重定向至根页面 rootRoute.path
 *   - 关闭右侧: 关闭右侧所有标签，如果选中标签页与当前激活页不一致并且激活页在右侧，则会重定向至当前选中标签页
 *   - 关闭左侧: 关闭左侧所有标签，如果选中标签页与当前激活页不一致并且激活页在左侧，则会重定向至当前选中标签页
 *   - 关闭其他: 关闭其他所有标签，如果选中标签页与当前激活页不一致并且激活页在其中，则会重定向至当前选中标签页
 *   - 关闭所有: 关闭所有标签页，并且重定向至 root page
 *
 * root path 标签不可被关闭，所以不会显示关闭按钮
 * 页面刷新后，仅会保留刷新前激活 key 的 tag 标签
 *
 * 注入 MENU_TAG_DATA 属性，用于动态更新 MenuTag 标签所在的位置
 *
 * 该模板中引入了 Root Path 概念，在 MenuTag 中除了关闭左右侧标签操作能主动移除 Root Tag 之外其余的操作都不允许
 *
 * outsideClick 方法优先级不如 contextmenu 事件高，所以可能会出现重复右键菜单时，闪烁问题
 * 虽然使用 throttle 方法进行优化，但是该问题本质并没有解决
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

import CloseRight from '@/icons/close_right.svg?component'
import CloseLeft from '@/icons/close_left.svg?component'

import { useMenuGetters, useMenuActions } from '@/store'
import { hasClass, uuid, queryElements } from '@/utils'
import { useMaximize, useSpinning, useAppRoot, useSiderBar } from '@/hooks'
import { throttle } from 'lodash-es'
import { getVariableToRefs } from '@/global-variable'

import type { ScrollbarInst } from 'naive-ui'
import type { MenuTagOptions, AppMenuOption } from '@/types'

export default defineComponent({
  name: 'AppMenuTag',
  setup(_, { expose }) {
    const scrollRef = ref<ScrollbarInst | null>(null)

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

    const canDisabledOptions = [
      'closeAll',
      'closeRight',
      'closeLeft',
      'closeOther',
      'closeCurrentPage',
    ] // 哪些下拉框允许禁用
    let currentContextmenuIndex = Infinity // 当前右键标签页索引位置
    const iconConfig = {
      size: 16,
    }
    const moreOptions = ref([
      {
        label: '刷新页面',
        key: 'reloadCurrentPage',
        icon: () => <RIcon name="reload" size={iconConfig.size} />,
      },
      {
        label: '关闭当前页面',
        key: 'closeCurrentPage',
        icon: () => <RIcon name="close" size={iconConfig.size} />,
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: '关闭左侧标签页',
        key: 'closeLeft',
        icon: () => <CloseLeft class="menu-tag__icon" />,
      },
      {
        label: '关闭右侧标签页',
        key: 'closeRight',
        icon: () => <CloseRight class="menu-tag__icon" />,
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: '关闭其他标签页',
        key: 'closeOther',
        icon: () => <RIcon name="other" size={iconConfig.size} />,
      },
      {
        label: '关闭所有标签页',
        key: 'closeAll',
        icon: () => <RIcon name="resize_h" size={iconConfig.size} />,
        disabled: false,
      },
    ]) // 下拉菜单
    const uuidScrollBar = uuid(16) // scroll bar uuid
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
    }
    /** 右键菜单 */
    const actionState = reactive({
      x: 0,
      y: 0,
      actionDropdownShow: false,
    })
    const MENU_TAG_DATA = 'menu_tag_data' // 注入 tag 前缀
    const globalMainLayoutLoad = getVariableToRefs('globalMainLayoutLoad')
    const naiveScrollbarContainerClass = 'n-scrollbar-container' // naive scrollbar 容器 class

    /**
     *
     * @param idx 索引
     *
     * @remark 关闭 `tag` 菜单, 如果仅有一个则不能关闭
     */
    const closeCurrentMenuTag = (idx: number) => {
      close(idx)
    }

    const setMoreOptionsDisabled = (
      key: (typeof moreOptions.value)[number]['key'],
      disabled: boolean,
    ) => {
      moreOptions.value.forEach((curr) => {
        if (curr.key === key) {
          curr.disabled = disabled

          return
        }
      })
    }

    /**
     *
     * @param option 当前菜单值
     */
    const menuTagClick = (option: AppMenuOption) => {
      actionState.actionDropdownShow = false

      changeMenuModelValue(option.fullPath, option)
    }

    /**
     *
     * 获取滚动条容器
     */
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

      return
    }

    /**
     *
     * @param type 滚动方向
     *
     * 手动滚动容器
     */
    const scrollX = (type: 'left' | 'right') => {
      const el = getScrollElement()

      if (el) {
        /**
         *
         * 找到实际横向滚动元素(class: n-scrollbar-container)
         * 获取 scrollLeft 属性后, 用于左右滚动边界值进行处理
         */
        const scrollX = el!.scrollLeft || 0
        const rolling =
          type === 'left' ? Math.max(0, scrollX - 200) : scrollX + 200

        scrollRef.value?.scrollTo({
          left: rolling,
          behavior: 'smooth',
        })
      }
    }

    /** 更多操作操作栏 */
    const actionDropdownSelect = (key: string | number) => {
      actionState.actionDropdownShow = false

      const fn = actionMap[key as keyof typeof actionMap]

      if (fn) {
        fn()
      }
    }

    /**
     *
     * 右键点击标签页
     *
     * 缓存当前点击标签页索引值(用于关闭左或者右侧标签页操作)
     */
    const menuTagContextMenu = (idx: number, e: MouseEvent) => {
      e.preventDefault()

      actionState.actionDropdownShow = false
      currentContextmenuIndex = idx

      nextTick(() => {
        actionState.actionDropdownShow = true
        actionState.x = e.clientX
        actionState.y = e.clientY
      })
    }

    /**
     *
     * 动态设置某些项禁用
     */
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

    /**
     *
     * 如果通过更多按钮触发关闭事件, 则根据当前标签所在索引值为 currentContextmenuIndex
     *
     * 并且动态设置是否可操作状态
     */
    const setCurrentContextmenuIndex = () => {
      const index = getMenuTagOptions.value.findIndex(
        (curr) => curr.fullPath === getMenuKey.value,
      )

      currentContextmenuIndex = index

      setDisabledAccordionToIndex()
    }

    /** 仅有 getMenuTagOptions 长度大于 1 并且非 root path 时, 才激活关闭按钮 */
    const menuTagMouseenter = (option: MenuTagOptions) => {
      if (
        getMenuTagOptions.value.length > 1 &&
        option.fullPath !== getRootPath.value
      ) {
        option.closeable = true
      }
    }

    /** 移出 MenuTag 时, 判断是否为当前已激活 key */
    const menuTagMouseleave = (option: MenuTagOptions) => {
      if (option.fullPath !== getMenuKey.value) {
        option.closeable = false
      }
    }

    /**
     *
     * 每当新的页面打开后, 将滚动条横向滚到至底部
     * 使用 nextTick 避免元素未渲染挂载至页面
     */
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

    /** 动态更新 menu tag 所在位置 */
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

    /** 如果有且只有一个标签页时, 禁止全部关闭操作 */
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
      },
      {
        immediate: true,
      },
    )
    /** 动态设置关闭按钮是否可操作 */
    watch(
      () => actionState.actionDropdownShow,
      (ndata) => {
        // 使用节流函数，避免右键菜单闪烁问题
        if (ndata) {
          throttle(setDisabledAccordionToIndex, 100)?.()
        }
      },
    )

    expose({})

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
      iconConfig: {
        width: 22,
        height: 22,
      },
      maximize,
      getRootPath,
      reload,
      globalMainLayoutLoad,
    }
  },
  render() {
    const {
      iconConfig,
      getRootPath,
      uuidScrollBar,
      getMenuTagOptions,
      MENU_TAG_DATA,
      globalMainLayoutLoad,
    } = this
    const {
      maximize,
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
            onClickoutside={() => {
              this.actionState.actionDropdownShow = false
            }}
          />
          <NFlex
            class="menu-tag-space"
            wrap={false}
            align="center"
            justify="space-between"
            inline
            size={[16, 0]}
          >
            <RIcon
              name="expanded"
              width={iconConfig.width}
              height={iconConfig.height}
              customClassName="menu-tag__left-arrow"
              onClick={this.scrollX.bind(this, 'left')}
            />
            <NScrollbar
              xScrollable
              ref="scrollRef"
              {...{
                id: uuidScrollBar,
              }}
            >
              <NFlex
                ref="menuTagSpaceRef"
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
                      [MENU_TAG_DATA]: curr.path,
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
                          {(curr.closeable || getMenuTagOptions.length === 1) &&
                          curr.fullPath !== getRootPath ? (
                            <NIcon
                              class="menu-tag__btn-icon"
                              {...{
                                onMousedown: closeCurrentMenuTag.bind(
                                  this,
                                  idx,
                                ),
                              }}
                            >
                              <RIcon name="close" size="14" />
                            </NIcon>
                          ) : (
                            // 默认使用一个空 NIcon 占位，避免不能正确的触发动画
                            <NIcon
                              class={[
                                curr.fullPath !== getRootPath
                                  ? 'menu-tag__btn-icon'
                                  : 'menu-tag__btn-icon--hidden',
                              ]}
                            />
                          )}
                        </>
                      ),
                    }}
                  </NButton>
                ))}
              </NFlex>
            </NScrollbar>
            <NFlex
              class="menu-tag__right-wrapper"
              align="center"
              inline
              wrap={false}
              size={[8, 0]}
            >
              <RIcon
                name="expanded"
                width={iconConfig.width}
                height={iconConfig.height}
                customClassName="menu-tag__right-arrow"
                onClick={scrollX.bind(this, 'right')}
              />
              <RIcon
                name="fullscreen_fold"
                width={iconConfig.width}
                height={iconConfig.height}
                customClassName="menu-tag__right-setting"
                onClick={() => {
                  maximize(true)
                }}
              />
              <RIcon
                name="reload"
                width={iconConfig.width}
                height={iconConfig.height}
                customClassName={`menu-tag__right-setting ${
                  !globalMainLayoutLoad
                    ? 'menu-tag__right-setting--spinning'
                    : ''
                }`}
                onClick={() => {
                  reload()
                }}
              />
              <RMoreDropdown
                class="menu-tag__dropdown"
                options={this.moreOptions}
                trigger="click"
                onSelect={this.actionDropdownSelect.bind(this)}
                iconSize={20}
                keyboard={false}
              >
                <RIcon
                  name="more"
                  width={iconConfig.width}
                  height={iconConfig.height}
                  customClassName="menu-tag__right-setting"
                  onClick={this.setCurrentContextmenuIndex.bind(this)}
                />
              </RMoreDropdown>
            </NFlex>
          </NFlex>
        </div>
      </NLayoutHeader>
    )
  },
})
