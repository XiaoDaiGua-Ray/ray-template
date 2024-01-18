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

import { NAvatar, NFlex } from 'naive-ui'

import { avatarProps, flexProps } from 'naive-ui'
import { APP_CATCH_KEY } from '@/app-config'
import { getStorage } from '@/utils'

import type { PropType } from 'vue'
import type { AvatarProps, SpaceProps } from 'naive-ui'
import type { SigningCallback } from '@/store/modules/signing/type'

const AppAvatar = defineComponent({
  name: 'AppAvatar',
  props: {
    ...avatarProps,
    ...flexProps,
    cursor: {
      type: String,
      default: 'auto',
    },
    spaceSize: {
      type: [String, Number] as PropType<SpaceProps['size']>,
      default: 'medium',
    },
    avatarSize: {
      type: [String, Number] as PropType<AvatarProps['size']>,
      default: 'medium',
    },
  },
  setup(props) {
    const signing = getStorage<SigningCallback>(APP_CATCH_KEY.signing)
    const cssVars = computed(() => {
      const vars = {
        '--app-avatar-cursor': props.cursor,
      }

      return vars
    })

    return {
      signing,
      cssVars,
    }
  },
  render() {
    return (
      <NFlex
        class="app-avatar"
        {...this.$props}
        style={this.cssVars}
        size={this.spaceSize}
      >
        <NAvatar
          // eslint-disable-next-line prettier/prettier, @typescript-eslint/no-explicit-any
          {...(this.$props as any)}
          src={this.signing?.avatar}
          objectFit="cover"
          round
          size={this.avatarSize}
        />
        <div class="app-avatar__name">{this.signing?.name}</div>
      </NFlex>
    )
  },
})

export default AppAvatar
