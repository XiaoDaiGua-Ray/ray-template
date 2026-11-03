import { useSigningGetters } from '@/store'
import { avatarProps, NAvatar, NButton, NFlex } from 'naive-ui'
import type { AvatarProps, FlexProps } from 'naive-ui'
import type { PropType } from 'vue'

const AppAvatar = defineComponent({
  name: 'AppAvatar',
  props: {
    ...avatarProps,
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
      default: 'medium',
    },
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { getSigningCallback } = useSigningGetters()

    return {
      getSigningCallback,
    }
  },
  render() {
    const { getSigningCallback, avatarSize, spaceSize, $props, vertical } = this

    return (
      <NButton quaternary strong focusable={false}>
        <NFlex align="center" size={spaceSize} vertical={vertical}>
          <NAvatar
            {...($props as AvatarProps)}
            src={getSigningCallback?.avatar}
            objectFit="cover"
            round
            size={avatarSize}
          >
            {{
              default: () =>
                getSigningCallback.avatar
                  ? null
                  : getSigningCallback?.name?.[0],
            }}
          </NAvatar>
          {getSigningCallback?.name}
        </NFlex>
      </NButton>
    )
  },
})

export default AppAvatar
