import { useI18n } from '@/hooks'
import { useMenuActions, useMenuGetters, useSettingGetters } from '@/store'
import { ShellTopNavigation } from '@ray-template/admin-shell'
import SiderBarLogo from '../Menu/components/SiderBarLogo'

export default defineComponent({
  name: 'TopNavigation',
  setup() {
    const { t } = useI18n()
    const { getMenuOptions, getMenuKey } = useMenuGetters()
    const { getLayoutConfig, getMenuConfig } = useSettingGetters()
    const { changeMenuModelValue } = useMenuActions()

    return () => (
      <ShellTopNavigation
        items={getMenuOptions.value}
        active={getMenuKey.value}
        grouped={
          getLayoutConfig.value.mode === 'mixed' ||
          getLayoutConfig.value.mode === 'split'
        }
        label={t('layout.navigation')}
        iconSize={getMenuConfig.value.iconSize}
        select={(option) => changeMenuModelValue(option.fullPath, option)}
      >
        {{
          logo: () =>
            getMenuConfig.value.menuSiderBarLogo ? (
              <SiderBarLogo collapsed={false} />
            ) : null,
        }}
      </ShellTopNavigation>
    )
  },
})
