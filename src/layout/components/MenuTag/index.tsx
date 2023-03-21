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

import './index.scss'

import { NScrollbar, NTag, NSpace, NLayoutHeader, NDropdown } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

import { useMenu, useSetting } from '@/store'
import { uuid } from '@/utils/hook'
import { hasClass } from '@/utils/element'

import type { MenuOption, ScrollbarInst } from 'naive-ui'

const MenuTag = defineComponent({
  name: 'MenuTag',
  setup() {
    const scrollRef = ref<ScrollbarInst | null>(null)

    const menuStore = useMenu()
    const settingStore = useSetting()
    const router = useRouter()

    const { menuKey, menuTagOptions } = storeToRefs(menuStore)
    const {
      menuModelValueChange,
      spliceMenTagOptions,
      emptyMenuTagOptions,
      setMenuTagOptions,
    } = menuStore
    const { changeSwitcher } = settingStore
    const {
      rootRoute: { path },
    } = __APP_CFG__

    const exclude = ['closeAll', 'closeRight', 'closeLeft', 'closeOther']
    let currentContentmenuIndex = -1 // 当前右键标签页索引位置
    const modelMenuTagOptions = computed(() => menuTagOptions.value)
    const moreOptions = ref([
      {
        label: '重新加载',
        key: 'reloadCurrentPage',
        icon: () =>
          h(
            RayIcon,
            {
              size: 16,
              name: 'reload',
            },
            {},
          ),
      },
      {
        label: '关闭其他',
        key: 'closeOther',
        icon: () =>
          h(
            RayIcon,
            {
              size: 16,
              name: 'other',
            },
            {},
          ),
      },
      {
        label: '关闭右侧',
        key: 'closeRight',
        icon: () =>
          h(
            RayIcon,
            {
              size: 16,
              name: 'right_arrow',
            },
            {},
          ),
      },
      {
        label: '关闭左侧',
        key: 'closeLeft',
        icon: () =>
          h(
            RayIcon,
            {
              size: 16,
              name: 'left_arrow',
            },
            {},
          ),
      },
      {
        type: 'divider',
        key: 'd1',
      },
      {
        label: '全部关闭',
        key: 'closeAll',
        icon: () =>
          h(
            RayIcon,
            {
              size: 16,
              name: 'close',
            },
            {},
          ),
        disabled: false,
      },
    ])
    const scrollBarUUID = uuid()
    const actionMap = {
      reloadCurrentPage: () => {
        changeSwitcher(false, 'reloadRouteSwitch')

        setTimeout(() => changeSwitcher(true, 'reloadRouteSwitch'))
      },
      closeAll: () => {
        /**
         *
         * 关闭全部标签页, 然后重定向至首页(dashboard)
         * 如果做了相关更改, 则需要手动更新
         */
        if (moreOptions.value.length > 1) {
          emptyMenuTagOptions()
          router.replace({
            path: path,
          })
        }
      },
      closeRight: () => {
        /**
         *
         * 关闭右侧标签
         *
         * 如果当前选择标签与 menuKey 不匹配, 则会关闭当前标签右侧所有变迁并且跳转至该页面
         */
        const length = moreOptions.value.length
        const routeItem = modelMenuTagOptions.value[currentContentmenuIndex]

        spliceMenTagOptions(currentContentmenuIndex + 1, length - 1)

        if (menuKey.value !== routeItem.key) {
          menuModelValueChange(routeItem.key, routeItem)
        }
      },
      closeLeft: () => {
        spliceMenTagOptions(0, currentContentmenuIndex)
      },
      closeOther: () => {
        /**
         *
         * 关闭其他标签
         *
         * 如果关闭标签与当前 menuKey 不匹配, 则会关闭当前选择标签页以外的所有标签页并且跳转至该页面
         */
        const routeItem = modelMenuTagOptions.value[currentContentmenuIndex]

        if (menuKey.value !== routeItem.key) {
          emptyMenuTagOptions()
          menuModelValueChange(routeItem.key, routeItem)
        } else {
          setMenuTagOptions(routeItem, false)
        }
      },
    }
    /** 右键菜单 */
    const actionState = reactive({
      x: 0,
      y: 0,
      actionDropdownShow: false,
    })

    /**
     *
     * @param idx 索引
     *
     * @remark 关闭 `tag` 菜单, 如果仅有一个则不能关闭
     */
    const closeCurrentMenuTag = (idx: number) => {
      spliceMenTagOptions(idx)

      if (menuKey.value !== path) {
        const options = modelMenuTagOptions.value
        const length = options.length

        const tag = options[length - 1]

        menuModelValueChange(tag.key as string, tag)
      }
    }

    const setMoreOptionsDisabled = (
      key: string | number,
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
     * @param item 当前菜单值
     */
    const handleTagClick = (item: MenuOption) => {
      menuModelValueChange(item.key as string, item)
    }

    const handleScrollX = (type: 'left' | 'right') => {
      const scroll = document.getElementById(scrollBarUUID) // 获取滚动条容器

      if (scroll) {
        /**
         *
         * 找到实际横向滚动元素(class: n-scrollbar-container)
         * 获取 scrollLeft 属性后, 用于左右滚动边界值进行处理
         */
        const scrollContentElement = Array.from(
          scroll.childNodes,
        ) as HTMLElement[]
        const findElement = scrollContentElement.find((el) =>
          hasClass(el, 'n-scrollbar-container'),
        )
        const scrollX = findElement!.scrollLeft || 0
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

      actionMap[key]?.()
    }

    /**
     *
     * 右键点击标签页
     *
     * 缓存当前点击标签页索引值(用于关闭左或者右侧标签页操作)
     */
    const handleContextMenu = (idx: number, e: MouseEvent) => {
      e.preventDefault()

      actionState.actionDropdownShow = false
      currentContentmenuIndex = idx

      nextTick().then(() => {
        actionState.actionDropdownShow = true
        actionState.x = e.clientX
        actionState.y = e.clientY
      })
    }

    const setDisabledAccordionToIndex = () => {
      const length = modelMenuTagOptions.value.length - 1

      if (currentContentmenuIndex === length) {
        setMoreOptionsDisabled('closeRight', true)
      } else if (currentContentmenuIndex < length) {
        setMoreOptionsDisabled('closeRight', false)
      }

      if (currentContentmenuIndex === 0) {
        setMoreOptionsDisabled('closeLeft', true)
      } else if (currentContentmenuIndex > 0) {
        setMoreOptionsDisabled('closeLeft', false)
      }
    }

    /**
     *
     * 如果通过更多按钮触发关闭事件, 则根据当前标签所在索引值为 currentContentmenuIndex
     *
     * 并且动态设置是否可操作状态
     */
    const setCurrentContentmenuIndex = () => {
      const index = modelMenuTagOptions.value.findIndex(
        (curr) => curr.key === menuKey.value,
      )

      currentContentmenuIndex = index

      setDisabledAccordionToIndex()
    }

    /** 如果有且只有一个标签页时, 禁止全部关闭操作 */
    watch(
      () => modelMenuTagOptions.value,
      (newData) => {
        moreOptions.value.forEach((curr) => {
          if (exclude.includes(curr.key)) {
            newData.length > 1
              ? (curr.disabled = false)
              : (curr.disabled = true)
          }
        })
      },
      {
        immediate: true,
        deep: true,
      },
    )

    /** 动态设置关闭按钮是否可操作 */
    watch(
      () => actionState.actionDropdownShow,
      () => {
        setDisabledAccordionToIndex()
      },
    )

    return {
      modelMenuTagOptions,
      menuModelValueChange,
      closeCurrentMenuTag,
      menuKey,
      handleTagClick,
      moreOptions,
      handleScrollX,
      scrollRef,
      scrollBarUUID,
      actionDropdownSelect,
      rootPath: path,
      actionState,
      handleContextMenu,
      setCurrentContentmenuIndex,
    }
  },
  render() {
    return (
      <NLayoutHeader>
        <div class="menu-tag">
          <NDropdown
            options={this.moreOptions}
            x={this.actionState.x}
            y={this.actionState.y}
            show={this.actionState.actionDropdownShow}
            trigger="manual"
            placement="bottom-start"
            onClickoutside={() => {
              this.actionState.actionDropdownShow = false
            }}
            onSelect={this.actionDropdownSelect.bind(this)}
          />
          <NSpace
            class="menu-tag-sapce"
            wrap={false}
            align="center"
            justify="space-between"
            inline
            wrapItem={false}
          >
            <RayIcon
              name="expanded"
              width="20"
              height="28"
              customClassName="menu-tag__left-arrow"
              onClick={this.handleScrollX.bind(this, 'left')}
            />
            <NScrollbar xScrollable ref="scrollRef" id={this.scrollBarUUID}>
              <NSpace
                class="menu-tag-wrapper"
                wrap={false}
                align="center"
                justify="start"
              >
                {this.modelMenuTagOptions.map((curr, idx) => (
                  <NTag
                    closable={
                      curr.key !== this.rootPath &&
                      this.modelMenuTagOptions.length > 1
                    }
                    onClose={() => this.closeCurrentMenuTag(idx)}
                    type={curr.key === this.menuKey ? 'success' : 'info'}
                    onClick={this.handleTagClick.bind(this, curr)}
                    bordered={false}
                    onContextmenu={this.handleContextMenu.bind(this, idx)}
                  >
                    {typeof curr.label === 'function'
                      ? curr.label()
                      : curr.label}
                  </NTag>
                ))}
              </NSpace>
            </NScrollbar>
            <div class="menu-tag__right-wrapper">
              <RayIcon
                name="expanded"
                width="20"
                height="28"
                customClassName="menu-tag__right-arrow"
                onClick={this.handleScrollX.bind(this, 'right')}
              />
              <NDropdown
                options={this.moreOptions}
                trigger="click"
                onSelect={this.actionDropdownSelect.bind(this)}
              >
                <RayIcon
                  name="more"
                  width="20"
                  height="28"
                  customClassName="menu-tag__right-setting"
                  onClick={this.setCurrentContentmenuIndex.bind(this)}
                />
              </NDropdown>
            </div>
          </NSpace>
        </div>
      </NLayoutHeader>
    )
  },
})

export default MenuTag
