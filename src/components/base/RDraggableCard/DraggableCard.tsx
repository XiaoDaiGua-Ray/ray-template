import './index.scss'
import type { AnyFn } from '@/types'
import { completeSize, queryElements, unrefElement } from '@/utils'
import type { MaybeElement, MaybeRefOrGetter } from '@vueuse/core'
import interact from 'interactjs'
import { cardProps, NCard } from 'naive-ui'
import { Teleport, Transition } from 'vue'
import type { VNode } from 'vue'

type RestrictRectOptions = Parameters<typeof interact.modifiers.restrictRect>[0]

type Padding = {
  x: number
  y: number
}

export type DefaultPosition =
  | Padding
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'top-center'
  | 'bottom-center'

const props = {
  ...cardProps,
  /**
   *
   * @description
   * 需要限制的区域位置。
   *
   * @default body
   */
  restrictionElement: {
    type: [String, HTMLElement, Function, Object] as PropType<
      string | HTMLElement | (() => VNode) | MaybeRefOrGetter<MaybeElement>
    >,
    default: 'body',
  },
  /**
   *
   * @description
   * 是否启用拖拽。
   *
   * @default true
   */
  dad: {
    type: Boolean,
    default: true,
  },
  /**
   *
   * @description
   * 自定义限制拖拽范围。
   *
   * @default undefined
   */
  restrictRectOptions: {
    type: Object as PropType<RestrictRectOptions>,
    default: void 0,
  },
  /**
   *
   * @description
   * 默认位置。
   *
   * @default { x: 0, y: 0 }
   */
  defaultPosition: {
    type: [Object, String] as PropType<DefaultPosition>,
    default: () => ({
      x: 0,
      y: 0,
    }),
  },
  /**
   *
   * @description
   * 拖拽卡片宽度。
   *
   * @default 600
   */
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 600,
  },
  /**
   *
   * @description
   * 拖拽卡片 z-index。
   *
   * @default undefined
   */
  zIndex: {
    type: Number,
    default: void 0,
  },
  /**
   *
   * @description
   * 是否启用动画。
   *
   * @default false
   */
  animation: {
    type: Boolean,
    default: false,
  },
  /**
   *
   * @description
   * 默认的边距。
   * 设置该属性后，卡片首次出现的位置会根据该属性进行偏移。
   *
   * @default undefined
   */
  padding: {
    type: Object as PropType<Padding>,
    default: void 0,
  },
}

export default defineComponent({
  name: 'RDraggableCard',
  props,
  setup(props, { expose }) {
    const cardRef = useTemplateRef<HTMLElement>('cardRef')
    let interactInst: ReturnType<typeof interact> | null = null
    const position = {
      x: 0,
      y: 0,
    }
    const CONTAINER_ID = 'r-draggable-card-container'
    const cssVars = computed(() => {
      return {
        '--r-draggable-card-width': completeSize(props.width),
        '--r-draggable-card-z-index': props.zIndex,
      }
    })
    let isSetup = false
    const cacheProps = {
      defaultPosition: props.defaultPosition,
      dad: props.dad,
    }

    // 创建 DraggableCard 容器
    const createDraggableCardContainer = () => {
      if (!document.getElementById(CONTAINER_ID)) {
        const container = document.createElement('div')

        container.id = CONTAINER_ID
        document.documentElement.appendChild(container)
      }
    }

    createDraggableCardContainer()

    // 获取 card, restrictionElement 的 dom 信息
    const getDom = () => {
      const card = unrefElement(cardRef)
      const re =
        typeof props.restrictionElement === 'string'
          ? queryElements<HTMLElement>(props.restrictionElement)
          : props.restrictionElement
      let restrictionElement: HTMLElement | null = null

      if (Array.isArray(re)) {
        restrictionElement = re[0]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        restrictionElement = unrefElement<HTMLElement>(re as any) as HTMLElement
      }

      return {
        card,
        restrictionElement,
      }
    }

    // 获取 container, card 的位置
    const getPosition = (containerRect: DOMRect, cardRect: DOMRect) => {
      const { defaultPosition, padding } = props
      const { x: paddingX = 0, y: paddingY = 0 } = padding ?? {}
      // 默认的 body restrictionElement 的偏移量是 0
      const {
        x: containerX,
        y: containerY,
        width: containerWidth,
        height: containerHeight,
      } = containerRect
      const { width: cardWidth, height: cardHeight } = cardRect

      if (typeof defaultPosition === 'string') {
        switch (defaultPosition) {
          case 'top-center': {
            const cx1 = (containerWidth - cardWidth) / 2 + containerX
            const cy1 = paddingY + containerY
            const cx2 = paddingX + cx1
            const cy2 = cy1

            return { x: cx2, y: cy2 }
          }

          case 'bottom-center': {
            const cx1 = (containerWidth - cardWidth) / 2 + containerX
            const cy1 = containerHeight - cardHeight - paddingY + containerY
            const cx2 = paddingX + cx1
            const cy2 = cy1

            return { x: cx2, y: cy2 }
          }

          case 'center': {
            const cx1 = (containerWidth - cardWidth) / 2 + containerX
            const cy1 = (containerHeight - cardHeight) / 2 + containerY
            const cx2 = paddingX + cx1
            const cy2 = paddingY + cy1

            return { x: cx2, y: cy2 }
          }

          case 'top-left':
            return { x: paddingX + containerX, y: paddingY + containerY }

          case 'top-right':
            return {
              x: containerWidth - cardWidth - paddingX + containerX,
              y: paddingY + containerY,
            }

          case 'bottom-left':
            return {
              x: paddingX + containerX,
              y: containerHeight - cardHeight - paddingY + containerY,
            }

          case 'bottom-right':
            return {
              x: containerWidth - cardWidth - paddingX + containerX,
              y: containerHeight - cardHeight - paddingY + containerY,
            }

          // 默认为左上角
          default:
            return { x: paddingX + containerX, y: paddingY + containerY }
        }
      } else {
        const { x: defaultX, y: defaultY } = defaultPosition

        return {
          x: defaultX + containerX + paddingX,
          y: defaultY + containerY + paddingY,
        }
      }
    }

    // 初始化设置 card 的位置，并且根据配置启用拖拽
    const setupDraggable = () => {
      const { card, restrictionElement } = getDom()

      if (!card) {
        return
      }

      const restrictionRect = restrictionElement?.getBoundingClientRect()
      const cardHeader = card.querySelector('.n-card-header')
      const restrictRectOptions = Object.assign(
        {},
        {
          restriction: restrictionElement,
          endOnly: true,
        },
        props.restrictRectOptions,
      )

      if (restrictionRect && !isSetup) {
        // 计算偏移位置
        const p = getPosition(restrictionRect, card.getBoundingClientRect())

        // 设置初始位置
        card.style.transform = `translate(${p.x}px, ${p.y}px)`
        position.x = p.x
        position.y = p.y
      }

      if (!props.dad) {
        return
      }

      interactInst = interact(card)
        .draggable({
          inertia: true,
          autoScroll: true,
          allowFrom: cardHeader ? '.n-card-header' : '.n-card__content',
          modifiers: [interact.modifiers.restrictRect(restrictRectOptions)],
          listeners: {
            move: (event) => {
              card.setAttribute('can-drag', 'true')

              position.x += event.dx
              position.y += event.dy

              card.style.transform = `translate(${position.x}px, ${position.y}px)`
            },
          },
        })
        .resizable(false)

      isSetup = true
    }

    // 取消拖拽
    const resetDraggable = () => {
      interactInst?.unset()

      interactInst = null
    }

    // 更新拖拽
    const refreshDraggableWhenPropsChange = (fn: AnyFn) => {
      isSetup = false

      fn()
      setupDraggable()
    }

    expose()

    watchEffect(() => {
      props.dad ? setupDraggable() : resetDraggable()

      if (props.defaultPosition !== cacheProps.defaultPosition) {
        refreshDraggableWhenPropsChange(() => {
          cacheProps.defaultPosition = props.defaultPosition
        })
      }
    })

    onMounted(() => {
      nextTick(() => {
        setupDraggable()
      })
    })

    return {
      cardRef,
      CONTAINER_ID,
      cssVars,
    }
  },
  render() {
    const { $attrs, $slots, $props, CONTAINER_ID, cssVars, animation } = this

    return (
      <Teleport to={`#${CONTAINER_ID}`}>
        {animation ? (
          <Transition name="draggable-card" appear mode="out-in">
            <NCard
              {...$attrs}
              {...$props}
              class="r-draggable-card"
              style={[cssVars]}
              ref="cardRef"
            >
              {{ ...$slots }}
            </NCard>
          </Transition>
        ) : (
          <NCard
            {...$attrs}
            {...$props}
            class="r-draggable-card"
            style={[cssVars]}
            ref="cardRef"
          >
            {{ ...$slots }}
          </NCard>
        )}
      </Teleport>
    )
  },
})
