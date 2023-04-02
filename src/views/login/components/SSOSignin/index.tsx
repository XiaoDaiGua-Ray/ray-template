/**
 *
 * @author Ray <https://github.com/XiaoDaiGua-Ray>
 *
 * @date 2023-04-02
 *
 * @workspace ray-template
 *
 * @remark 今天也是元气满满撸代码的一天
 */

/**
 *
 * SSO 单点登录模块组件
 *
 * 按照需求自行增减
 */

import './index.scss'

import { NSpace, NPopover } from 'naive-ui'
import RayIcon from '@/components/RayIcon/index'

interface SSOSigninOptions {
  icon: string
  key: string
  tooltipLabel: string
}

const SSOSignin = defineComponent({
  name: 'SSOSignin',
  setup() {
    const ssoSigninOptions = [
      {
        icon: 'github',
        key: 'github',
        tooltipLabel: 'Github登陆',
      },
      {
        icon: 'google',
        key: 'google',
        tooltipLabel: 'Google登陆',
      },
      {
        icon: 'twitter',
        key: 'twitter',
        tooltipLabel: 'Twitter登陆',
      },
    ]

    const handleSSOSigninClick = (option: SSOSigninOptions) => {
      window.$message.info(`调用${option.tooltipLabel}`)
    }

    return {
      ssoSigninOptions,
      handleSSOSigninClick,
    }
  },
  render() {
    return (
      <NSpace class="sso-signin" align="center" itemStyle={{ display: 'flex' }}>
        {this.ssoSigninOptions.map((curr) => (
          <NPopover>
            {{
              trigger: () => (
                <RayIcon
                  name={curr.icon}
                  size="24"
                  cursorPointer
                  onClick={this.handleSSOSigninClick.bind(this, curr)}
                />
              ),
              default: () => curr.tooltipLabel,
            }}
          </NPopover>
        ))}
      </NSpace>
    )
  },
})

export default SSOSignin
