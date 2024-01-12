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
import { RIcon } from '@/components'

interface SSOSigningOptions {
  icon: string
  key: string
  tooltipLabel: string
}

const SSOSigning = defineComponent({
  name: 'SSOSigning',
  setup() {
    const ssoSigningOptions = [
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

    const handleSSOSigningClick = (option: SSOSigningOptions) => {
      window.$message.info(`调用${option.tooltipLabel}`)
    }

    return {
      ssoSigningOptions,
      handleSSOSigningClick,
    }
  },
  render() {
    return (
      <NSpace class="sso-signing" align="center">
        {this.ssoSigningOptions.map((curr) => (
          <NPopover key={curr.key}>
            {{
              trigger: () => (
                <RIcon
                  name={curr.icon}
                  size="24"
                  cursor="pointer"
                  onClick={this.handleSSOSigningClick.bind(this, curr)}
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

export default SSOSigning
