import './index.scss'
import { RIcon } from '@/components'
import { call } from '@/utils'
import { NCard, NFlex, NGrid, NGridItem } from 'naive-ui'
import type { GridProps } from 'naive-ui'
import props from './props'

export default defineComponent({
  name: 'RCollapseGrid',
  props,
  setup(props) {
    const modelCollapsed = ref(!props.open)
    const cssVars = computed(() => {
      const cssVar = {
        '--r-collapse-grid-action-align': props.actionAlign,
      }

      return cssVar
    })

    const collapseClick = () => {
      const { onUpdateOpen, 'onUpdate:open': _onUpdateOpen } = props

      modelCollapsed.value = !modelCollapsed.value

      if (onUpdateOpen) {
        call(onUpdateOpen, modelCollapsed.value)
      }

      if (_onUpdateOpen) {
        call(_onUpdateOpen, modelCollapsed.value)
      }
    }

    const CollapseIcon = (collapse: boolean) => (
      <div class="collapse-icon" onClick={collapseClick.bind(this)}>
        <span>
          {collapse ? props.collapseToggleText[0] : props.collapseToggleText[1]}
        </span>
        <RIcon
          customClassName={`collapse-icon--arrow ${
            collapse ? '' : 'collapse-icon--arrow__expanded'
          }`}
          name="directional/expanded"
          size="14"
        />
      </div>
    )

    watchEffect(() => {
      modelCollapsed.value = !props.open
    })

    return {
      modelCollapsed,
      collapseClick,
      CollapseIcon,
      cssVars,
    }
  },
  render() {
    const {
      $slots: { collapse, action, default: defaultSlot },
      CollapseIcon,
      $props,
      modelCollapsed,
      xGap,
      yGap,
      collapsedRows,
      cssVars,
      actionSpan,
      bordered,
    } = this

    return (
      <NCard bordered={bordered} style={[cssVars]}>
        {{
          default: () => (
            <NGrid
              class="r-collapse-grid"
              {...($props as GridProps)}
              collapsed={modelCollapsed}
              xGap={xGap || 12}
              yGap={yGap || 12}
              collapsedRows={collapsedRows}
            >
              {defaultSlot?.()}
              <NGridItem
                suffix
                class="r-collapse-grid__suffix--btn"
                span={actionSpan}
              >
                <NFlex justify="end" align="center">
                  {action?.()}
                  {collapse
                    ? collapse(modelCollapsed)
                    : CollapseIcon(modelCollapsed)}
                </NFlex>
              </NGridItem>
            </NGrid>
          ),
        }}
      </NCard>
    )
  },
})
