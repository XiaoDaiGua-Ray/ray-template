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

import './index.scss'

import { collapseGridProps } from './props'

import { NCard, NGrid, NGridItem, NSpace } from 'naive-ui'
import RayIcon from '@/components/RayIcon'

import { call } from '@/utils/vue/index'
import { cloneDeep } from 'lodash-es'

const RayCollapseGrid = defineComponent({
  name: 'RayCollapseGrid',
  props: collapseGridProps,
  setup(props) {
    const modelCollapsed = ref(cloneDeep(props.open))

    const handleCollapse = () => {
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
      <div class="collapse-icon" onClick={handleCollapse.bind(this)}>
        <span>
          {modelCollapsed.value
            ? props.collapseToggleText[0]
            : props.collapseToggleText[1]}
        </span>
        <RayIcon
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
      handleCollapse,
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
                <NSpace justify="end">
                  {this.$slots.action?.()}
                  {this.CollapseIcon()}
                </NSpace>
              </NGridItem>
            </NGrid>
          ),
        }}
      </NCard>
    )
  },
})

export default RayCollapseGrid

/**
 *
 * <https://www.naiveui.com/zh-CN/dark/components/grid>
 *
 * 可折叠操作栏
 *
 * 可以结合表单或者表格使用
 *
 * 该组件完全基于 `NGrid` `NGridItem` 实现, 所以需要在使用该组件时使用 `NGridItem` 包裹元素
 */
