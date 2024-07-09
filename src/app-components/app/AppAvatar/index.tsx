/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-05-31
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * 系统管理员头像与名称
 *
 * 头像展示基于 naive ui Avatar 组件, 继承该组件所有属性与方法
 * 默认读取本地 session catch 缓存
 */

import './index.scss'

import { NAvatar, NButton, NFlex } from 'naive-ui'

import { avatarProps } from 'naive-ui'
import { APP_CATCH_KEY } from '@/app-config'
import { getStorage } from '@/utils'

import type { PropType } from 'vue'
import type { AvatarProps, FlexProps } from 'naive-ui'
import type { SigningCallback } from '@/store/modules/signing/types'

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
  },
  setup(props) {
    const signing = getStorage<SigningCallback>(
      APP_CATCH_KEY.signing,
      'localStorage',
    )

    return {
      signing,
    }
  },
  render() {
    const { signing, avatarSize, spaceSize, $props } = this

    return (
      <NButton quaternary strong>
        <NFlex align="center" size={spaceSize}>
          <NAvatar
            {...($props as AvatarProps)}
            src={signing?.avatar}
            objectFit="cover"
            round
            size={avatarSize}
          />
          {signing?.name}
        </NFlex>
      </NButton>
    )
  },
})

export default AppAvatar
