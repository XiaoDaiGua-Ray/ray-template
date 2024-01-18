/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2022-12-27
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * <https://www.naiveui.com/zh-CN/dark/components/grid>
 *
 * 可折叠操作栏
 * 可以结合表单或者表格使用，让你快捷的实现高级搜索功能
 *
 * 该组件完全基于 `NGrid` `NGridItem` 实现, 所以需要在使用该组件时使用 `NGridItem` 包裹元素
 */

import './index.scss'

import { NCard, NGrid, NGridItem, NFlex } from 'naive-ui'
import { RIcon } from '@/components'

import { call } from '@/utils'
import props from './props'

export default defineComponent({
  name: 'RCollapseGrid',
  props,
  setup(props) {
    const modelCollapsed = ref(!props.open)

    const collapseClick = () => {
      modelCollapsed.value = !modelCollapsed.value

      const { onUpdateValue, 'onUpdate:value': _onUpdateValue } = props

      if (onUpdateValue) {
        call(onUpdateValue, modelCollapsed.value)
      }

      if (_onUpdateValue) {
        call(_onUpdateValue, modelCollapsed.value)
      }
    }

    const CollapseIcon = () => (
      <div class="collapse-icon" onClick={collapseClick.bind(this)}>
        <span>
          {modelCollapsed.value
            ? props.collapseToggleText[0]
            : props.collapseToggleText[1]}
        </span>
        <RIcon
          customClassName={`collapse-icon--arrow ${
            modelCollapsed.value ? '' : 'collapse-icon--arrow__expanded'
          }`}
          name="expanded"
          size="14"
        />
      </div>
    )

    return {
      modelCollapsed,
      collapseClick,
      CollapseIcon,
    }
  },
  render() {
    return (
      <NCard bordered={this.bordered}>
        {{
          default: () => (
            <NGrid
              class="ray-collapse-grid"
              {...this.$props}
              collapsed={this.modelCollapsed}
              xGap={this.xGap || 12}
              yGap={this.yGap || 18}
              collapsedRows={this.collapsedRows}
            >
              {this.$slots.default?.()}
              <NGridItem suffix class="ray-collapse-grid__suffix--btn">
                <NFlex justify="end">
                  {this.$slots.action?.()}
                  {this.CollapseIcon()}
                </NFlex>
              </NGridItem>
            </NGrid>
          ),
        }}
      </NCard>
    )
  },
})
