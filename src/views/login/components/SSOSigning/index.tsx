import type { IconName } from '@/icons'
import './index.scss'
import { RIcon } from '@/components'
import { NFlex, NPopover } from 'naive-ui'

interface SSOSigningOptions {
  icon: IconName
  key: string
  tooltipLabel: string
}

const SSOSigning = defineComponent({
  name: 'SSOSigning',
  setup() {
    const ssoSigningOptions: SSOSigningOptions[] = [
      {
        icon: 'logo/github',
        key: 'github',
        tooltipLabel: 'Github登陆',
      },
      {
        icon: 'logo/google',
        key: 'google',
        tooltipLabel: 'Google登陆',
      },
      {
        icon: 'logo/twitter',
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
      <NFlex class="sso-signing" align="center">
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
      </NFlex>
    )
  },
})

export default SSOSigning
