import { useI18n } from '@/hooks'
import { useMenuActions, useMenuGetters, useSettingGetters } from '@/store'
import type { AppMenuOption, NaiveMenuOptions } from '@/types'
import { NMenu } from 'naive-ui'
import { findMenuRoot, firstMenuLeaf } from '../../navigation'
import SiderBarLogo from '../Menu/components/SiderBarLogo'

export default defineComponent({
  name: 'TopNavigation',
  setup() {
    const { t } = useI18n()
    const { getMenuOptions, getMenuKey } = useMenuGetters()
    const { getLayoutConfig, getMenuConfig } = useSettingGetters()
    const { changeMenuModelValue } = useMenuActions()
    const mixed = computed(() => getLayoutConfig.value.mode === 'mixed')
    const options = computed(() =>
      mixed.value
        ? getMenuOptions.value
            .filter((option) => option.show !== false)
            .map((option) => ({ ...option, children: void 0 }))
        : getMenuOptions.value,
    )
    const selected = computed(() =>
      mixed.value
        ? findMenuRoot(getMenuOptions.value, String(getMenuKey.value))?.fullPath
        : getMenuKey.value,
    )
    const select = (key: string, option: AppMenuOption) => {
      const root = mixed.value
        ? getMenuOptions.value.find((item) => item.fullPath === key)
        : option
      const leaf = root && firstMenuLeaf(root)

      if (leaf) changeMenuModelValue(leaf.fullPath, leaf)
    }

    return () => (
      <nav class="r-layout-top-navigation" aria-label={t('layout.navigation')}>
        {getMenuConfig.value.menuSiderBarLogo ? (
          <SiderBarLogo collapsed={false} />
        ) : null}
        <NMenu
          mode="horizontal"
          responsive
          keyField="fullPath"
          value={selected.value}
          options={options.value as unknown as NaiveMenuOptions[]}
          onUpdateValue={(key, option) =>
            select(String(key), option as unknown as AppMenuOption)
          }
        />
      </nav>
    )
  },
})
