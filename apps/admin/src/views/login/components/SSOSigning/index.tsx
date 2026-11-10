import type { IconName } from '@/icons'
import { RIcon } from '@ray-template/ui/icon'
import { NButton, NFlex, NTooltip } from 'naive-ui'

const providers = [
  ['GitHub', 'logo/github'],
  ['Google', 'logo/google'],
  ['Twitter', 'logo/twitter'],
] as const satisfies ReadonlyArray<readonly [string, IconName]>

export default defineComponent({
  name: 'SSOSigning',
  render() {
    const { $t } = this

    return (
      <NFlex align="center" size="small">
        {providers.map(([provider, icon]) => (
          <NTooltip key={provider}>
            {{
              trigger: () => (
                <NButton
                  circle
                  secondary
                  size="small"
                  aria-label={$t('views.login.index.Provider', { provider })}
                  onClick={() =>
                    window.$message.info(
                      $t('views.login.index.ProviderHint', { provider }),
                    )
                  }
                >
                  <RIcon name={icon} size={16} />
                </NButton>
              ),
              default: () => $t('views.login.index.Provider', { provider }),
            }}
          </NTooltip>
        ))}
      </NFlex>
    )
  },
})
