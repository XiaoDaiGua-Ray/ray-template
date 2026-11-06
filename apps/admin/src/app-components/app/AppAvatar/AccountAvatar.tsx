import './index.scss'
import { avatarProps, NAvatar } from 'naive-ui'

const center = 20
const fontSize = 26

export const accountAvatarFont = {
  fontWeight: 600,
  fontFamily: 'system-ui, sans-serif',
}

const segmenter =
  typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(void 0, { granularity: 'grapheme' })
    : null

export function accountInitial(name: string) {
  return segmenter?.segment(name).containing(0)?.segment ?? Array.from(name)[0]
}

let context: CanvasRenderingContext2D | null | undefined

export function measureAccountText(text: string, size: number) {
  if (typeof document === 'undefined') return null

  if (context === void 0)
    context = document.createElement('canvas').getContext('2d')

  if (!context) return null

  const { fontWeight, fontFamily } = accountAvatarFont

  context.font = `${fontWeight} ${size}px ${fontFamily}`
  context.textAlign = 'left'
  context.textBaseline = 'alphabetic'
  context.direction = 'ltr'

  return context.measureText(text)
}

export default defineComponent({
  name: 'AccountAvatar',
  props: {
    ...avatarProps,
    name: { type: String, default: '' },
  },
  setup(props) {
    const initial = computed(() => accountInitial(props.name.trim()) || '?')
    const ink = computed(() => measureAccountText(initial.value, fontSize))
    const renderInitial = () => {
      const bounds = ink.value

      // 字形与行框的中心不同，尤其是带下伸笔画的字母。
      const x = bounds
        ? center +
          (bounds.actualBoundingBoxLeft - bounds.actualBoundingBoxRight) / 2
        : center
      const y = bounds
        ? center +
          (bounds.actualBoundingBoxAscent - bounds.actualBoundingBoxDescent) / 2
        : center

      return (
        <svg
          class="r-account-avatar__initial"
          viewBox="0 0 40 40"
          aria-hidden="true"
        >
          <text
            x={x}
            y={y}
            fill="currentColor"
            font-family={accountAvatarFont.fontFamily}
            font-size={fontSize}
            font-weight={accountAvatarFont.fontWeight}
            text-anchor={bounds ? 'start' : 'middle'}
            dominant-baseline={bounds ? 'alphabetic' : 'central'}
          >
            {initial.value}
          </text>
        </svg>
      )
    }

    return () => {
      const { name: _name, ...avatar } = props

      return (
        <NAvatar
          {...avatar}
          class="r-account-avatar"
          style={avatar.color ? { backgroundColor: avatar.color } : void 0}
          renderFallback={
            avatar.renderFallback ??
            (avatar.fallbackSrc ? void 0 : renderInitial)
          }
          aria-hidden="true"
        >
          {{
            default: () =>
              avatar.src || avatar.imgProps?.src ? null : renderInitial(),
          }}
        </NAvatar>
      )
    }
  },
})
