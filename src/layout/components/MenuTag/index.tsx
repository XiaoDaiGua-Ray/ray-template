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
import { NScrollbar, NTag, NSpace } from 'naive-ui'
import { useMenu } from '@/store'

import type { MenuOption } from 'naive-ui'

const MenuTag = defineComponent({
  name: 'MenuTag',
  setup() {
    const menuStore = useMenu()
    const { menuTagOptions, menuKey } = storeToRefs(menuStore)
    const { menuModelValueChange, spliceMenTagOptions } = menuStore

    /**
     *
     * @param idx 索引
     *
     * @remark 关闭 `tag` 菜单, 如果仅有一个则不能关闭
     */
    const handleCloseTag = (idx: number) => {
      spliceMenTagOptions(idx)

      if (menuKey.value !== '/dashboard') {
        const options = menuTagOptions.value as MenuOption[]
        const length = options.length

        const tag = options[length - 1]

        menuModelValueChange(tag.key as string, tag)
      }
    }

    /**
     *
     * @param item 当前菜单值
     */
    const handleTagClick = (item: MenuOption) => {
      menuModelValueChange(item.key as string, item)
    }

    return {
      menuTagOptions,
      menuModelValueChange,
      handleCloseTag,
      menuKey,
      handleTagClick,
    }
  },
  render() {
    return (
      <NScrollbar class="menu-tag" xScrollable>
        <NSpace class="menu-tag-sapce" wrap={false} align="center">
          {this.menuTagOptions.map((curr: MenuOption, idx) => (
            <NTag
              closable={
                curr.key !== '/dashboard' && this.menuTagOptions.length > 1
              }
              onClose={() => this.handleCloseTag(idx)}
              type={curr.key === this.menuKey ? 'success' : 'info'}
              onClick={this.handleTagClick.bind(this, curr)}
              bordered={false}
            >
              {typeof curr.label === 'function' ? curr.label() : curr.label}
            </NTag>
          ))}
        </NSpace>
      </NScrollbar>
    )
  },
})

export default MenuTag
