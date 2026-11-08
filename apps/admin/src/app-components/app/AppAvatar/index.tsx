import { useSigningGetters } from '@/store'
import { avatarProps, NButton, NFlex } from 'naive-ui'
import type { AvatarProps, FlexProps } from 'naive-ui'
import type { PropType } from 'vue'
import AccountAvatar, {
  accountAvatarFont,
  accountInitial,
  measureAccountText,
} from './AccountAvatar'

const captionSize = 14

const AppAvatar = defineComponent({
  name: 'AppAvatar',
  props: {
    ...avatarProps,
    round: { type: Boolean, default: true },
    objectFit: {
      type: String as PropType<AvatarProps['objectFit']>,
      default: 'cover',
    },
    cursor: {
      type: String,
      default: 'auto',
    },
    spaceSize: {
      type: [String, Number, Array] as PropType<FlexProps['size']>,
      default: 'medium',
    },
    avatarSize: {
      type: [String, Number] as PropType<AvatarProps['size']>,
      default: void 0,
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { getSigningCallback } = useSigningGetters()
    const name = computed(() => getSigningCallback.value.name?.trim() ?? '')
    const showName = computed(
      () =>
        props.vertical ||
        !!getSigningCallback.value.avatar ||
        !!props.imgProps?.src ||
        name.value !== accountInitial(name.value),
    )
    const captionOffset = computed(() => {
      if (!showName.value || !name.value) return null

      const metrics = measureAccountText(name.value, captionSize)

      if (!metrics) return null

      const offset =
        (metrics.actualBoundingBoxAscent -
          metrics.actualBoundingBoxDescent -
          metrics.fontBoundingBoxAscent +
          metrics.fontBoundingBoxDescent) /
        2

      return Number.isFinite(offset) ? offset : null
    })

    return {
      getSigningCallback,
      name,
      showName,
      captionOffset,
    }
  },
  render() {
    const {
      getSigningCallback,
      avatarSize,
      spaceSize,
      $props,
      vertical,
      name,
      showName,
      captionOffset,
    } = this

    return (
      <NButton
        class="r-app-avatar"
        quaternary
        strong
        style={{ cursor: this.cursor }}
        {...{ 'aria-label': showName ? void 0 : name }}
      >
        <NFlex align="center" size={spaceSize} vertical={vertical} wrap={false}>
          <AccountAvatar
            {...($props as AvatarProps)}
            name={name}
            src={getSigningCallback?.avatar}
            size={avatarSize ?? this.size}
          />
          {showName && (
            <span
              class={[
                'r-app-avatar__name',
                { 'r-app-avatar__name--measured': captionOffset !== null },
              ]}
              style={{
                ...accountAvatarFont,
                fontSize: `${captionSize}px`,
                transform:
                  captionOffset === null
                    ? void 0
                    : `translateY(${captionOffset}px)`,
              }}
            >
              {name}
            </span>
          )}
          {this.$slots.suffix?.()}
        </NFlex>
      </NButton>
    )
  },
})

export default AppAvatar
