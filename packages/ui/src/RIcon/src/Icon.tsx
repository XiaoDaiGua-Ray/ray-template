import { computed, defineComponent, onMounted, shallowRef } from 'vue'
import './index.scss'
import { completeSize } from '@ray-template/composables/element'
import { call } from '@ray-template/composables/vue'
import { useUiServices } from '../../services'
import props from './props'

export default defineComponent({
  name: 'RIcon',
  props,
  setup(props) {
    const { iconUrl } = useUiServices()
    const symbolId = computed(() => iconUrl?.(props.name, props.prefix))
    const assets = shallowRef<typeof import('@ray-template/icons/assets')>()
    const asset = computed(() => assets.value?.getIconAsset(props.name))

    onMounted(async () => {
      if (!iconUrl) assets.value = await import('@ray-template/icons/assets')
    })

    const cssVars = computed(() => {
      const cssVar = {
        '--r-icon-width': props.width
          ? completeSize(props.width)
          : completeSize(props.size),
        '--r-icon-height': props.height
          ? completeSize(props.height)
          : completeSize(props.size),
        '--r-icon-depth': props.depth,
        '--r-icon-cursor': props.cursor,
        '--r-icon-color': props.color,
      }

      return cssVar
    })

    const iconClick = (e: MouseEvent) => {
      const { onClick } = props

      if (onClick) {
        call(onClick, e)
      }
    }

    return {
      symbolId,
      asset,
      cssVars,
      iconClick,
    }
  },
  render() {
    return (
      <span
        class={['r-icon', this.customClassName]}
        style={[this.cssVars]}
        onClick={this.iconClick}
      >
        <svg
          viewBox={this.asset?.viewBox}
          innerHTML={this.asset?.body}
          fill={this.color}
          {...({
            RIconAttribute: 'r-icon',
            'aria-hidden': true,
          } as object)}
        >
          {this.symbolId ? (
            <use href={this.symbolId} fill={this.color} />
          ) : null}
        </svg>
      </span>
    )
  },
})
