<template>
  <NConfigProvider
    :theme="isDark ? darkTheme : undefined"
    :themeOverrides="themeOverrides"
    :locale="locale === 'zh-CN' ? zhCN : undefined"
    :dateLocale="locale === 'zh-CN' ? dateZhCN : undefined"
  >
    <div class="vp-raw" :class="{ 'r-template--dark': isDark }" :lang="locale">
      <slot />
    </div>
  </NConfigProvider>
</template>

<script setup lang="ts">
import '@ray-template/ui/theme.css'
import {
  rayPrimaryColor,
  rayThemeOverrides,
} from '@ray-template/ui/theme-presets'
import { darkTheme, dateZhCN, NConfigProvider, zhCN } from 'naive-ui'
import { useData } from 'vitepress'
import { computed } from 'vue'

const props = defineProps<{ dark?: boolean; locale?: 'zh-CN' | 'en' }>()
const { isDark: docsDark, lang } = useData()
const isDark = computed(() => props.dark ?? docsDark.value)
const locale = computed(
  () => props.locale ?? (lang.value.startsWith('en') ? 'en' : 'zh-CN'),
)
const { primaryColor, primaryFadeColor } = rayPrimaryColor
const themeOverrides = computed(() => {
  const preset = rayThemeOverrides[isDark.value ? 'dark' : 'light']

  return {
    ...preset,
    common: {
      ...preset.common,
      primaryColor,
      primaryColorHover: primaryFadeColor,
      primaryColorPressed: primaryColor,
      primaryColorSuppl: primaryFadeColor,
    },
  }
})
</script>
