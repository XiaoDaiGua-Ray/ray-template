/**
 *
 * 系统管理员头像与名称
 *
 * 头像展示基于 naive ui Avatar 组件, 继承该组件所有属性与方法
 * 默认读取本地 session catch 缓存
 */

import { NAvatar, NButton, NFlex } from 'naive-ui'

import { avatarProps } from 'naive-ui'
import { useSigningGetters } from '@/store'

import type { PropType } from 'vue'
import type { AvatarProps, FlexProps } from 'naive-ui'

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
